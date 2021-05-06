<template>
    <div class="container-approve-mine">
        <form action="/">
            <van-search
                v-model="valueSearch"
                show-action
                placeholder="搜索人名、标题、内容、状态"
                input-align="center"
                background="#F1F2F6"
                action-text=" "
                @search="onSearch"
            />
        </form>

        <van-sticky :offset-top="46">
            <van-tabs v-model="activeTab" title-active-color="#0082EF" color="#0082EF" @change="switchTab">
                <van-tab title="待处理" :badge="processTodoListCount"></van-tab>
                <van-tab title="已处理"></van-tab>
                <van-tab title="抄送我"></van-tab>
            </van-tabs>
        </van-sticky>

        <template v-if="activeTab === 0">
            <ProcessList type="02" :list="processTodoList" />
        </template>
        <template v-else-if="activeTab === 1">
            <ProcessList type="04" :list="processDoneList" />
        </template>
        <template v-else>
            <ProcessList type="03" :list="processCopyList" />
        </template>
    </div>
</template>

<script>
import { Toast } from "vant";
import ProcessList from "./ProcessList.vue";
import { sessionStore as $SS } from '@/utils';
import SockJS from 'sockjs-client';
import Stomp from 'stompjs';
// import Stomp from 'stomp-websocket';

export default {
    components: {
        ProcessList
    },
    data() {
        return {
            userInfo: null,
            token: '',

            activeTab: 0,
            valueSearch: "",
            processTodoList: [],
            processTodoListCount: '',
            badge: 0,
            processDoneList: [],
            processCopyList: [],
        };
    },
    created() {
        // 同意/驳回流程后中转到 `已处理`
        this.activeTab = this.$route.query.tab
        if(this.activeTab == 1) {
            this.getProcessDoneList()
        }

        this.userInfo = $SS.get('userInfo')
        // console.log(this.userInfo)        
        this.token = this.userInfo.sessionToken
        // console.log(this.token)
    },
    mounted() {        
        this.startWebSocket();
        
        this.getProcessTodoList();
        this.getProcessTodoListCount();

    },
    methods: {
        // API
        // ------------------------------------------------------------------
        // 待处理
        apiGetProcessTodoList(data) {
            return this.$api('urlGetProcessTodoList').post('postNormal', data)
        },
        apiGetProcessTodoListCount() {
            return this.$api('urlGetProcessTodoListCount').get()
        },
        // 已处理
        apiGetProcessDoneList(data) {
            return this.$api('urlGetProcessDoneList').post('postNormal', data)
        },
        // 抄送我
        apiGetProcessCopyList(data) {
            return this.$api('urlGetProcessCopyList').post('postNormal', data)
        },
        // ------------------------------------------------------------------
        // 待处理消息实时推送
        startWebSocket() {
            // console.log('websocket...')

            let url = ''

            if (['prod', 'production'].includes(process.env.NODE_ENV)) {
                // 生产
                url = '/sign/ws'

            } else {
                // 开发
                url = '/apis/ws'
            }

            let headers = {
                // login: 'mylogin',
                // passcode: 'mypasscode',
                // additional header
                // 'client-id': 'my-client-id',  
                'Authorization': this.token,              
                // 'Content-Type': 'text/event-stream',                              
            }
            let socket = new SockJS(url)
            let client = Stomp.over(socket)

            // client.connect(headers, connectCallback, errorCallback)
            client.connect(headers, () => {
                // console.log('SUCCESS...')

                client.subscribe('/task/' + this.userInfo.id + '/remind', (msg) => {
                    // console.log(msg)
                    this.processTodoListCount += 1
                    this.getProcessTodoList()
                })


            }, err => {
                // console.log('FAILED...')
            })

            // client.disconnect(function() {
            //     alert('See you next time!')
            // })

            // client will send heartbeats every 20000ms
            // client.heartbeat.outgoing = 20000
            // client does not want to receive heartbeats
            // client.heartbeat.incoming = 0                            

            // 只在生产环境开启 ws 心跳
            if (process.env.NODE_ENV !== 'production') {
                client.heartbeat.outgoing = client.heartbeat.incoming = 0
            }
        },
        // 获取待处理消息条目
        async getProcessTodoListCount() {
            let res = await this.apiGetProcessTodoListCount()
            if (!res) return

            // console.log(res.data.data)

            let _count = res.data.data
            if (_count == 0) {
                this.processTodoListCount = ''

            } else {
                this.processTodoListCount = _count
            }            
        },
        // 搜索
        async onSearch(val) {
            // console.log(this.activeTab)
        
            let _data = {
                keyword: val.trim(),
                pageNum: 1,
                pageSize: 100
            }

            if (this.activeTab == 0) {
                let res = await this.apiGetProcessTodoList(_data)
                if(!res) return;
                this.processTodoList = res.data.data

            } else if (this.activeTab == 1) {
                let res = await this.apiGetProcessDoneList(_data)
                // console.log(res.data.data)
                if(!res) return;
                this.processDoneList = res.data.data

            } else if (this.activeTab == 2) {
                let res = await this.apiGetProcessCopyList(_data)
                if(!res) return;
                this.processCopyList = res.data.data                
            }
        },

        async getProcessTodoList() {
            let _data = {
                keyword: '',
                pageNum: 1,
                pageSize: 100
            }

            let res = await this.apiGetProcessTodoList(_data)
            if(!res) return;

            this.processTodoList = res.data.data
        },
        async getProcessDoneList() {
            let _data = {
                keyword: '',
                pageNum: 1,
                pageSize: 100
            }

            let res = await this.apiGetProcessDoneList(_data)
            // console.log(res.data.data)
            if(!res) return;

            this.processDoneList = res.data.data
        },
        async getProcessCopyList() {
            let _data = {
                keyword: '',
                pageNum: 1,
                pageSize: 100
            }

            let res = await this.apiGetProcessCopyList(_data)
            if(!res) return;

            this.processCopyList = res.data.data
        },

        // 切换标签
        switchTab(val) {
            switch(val) {
                case 0:
                    this.getProcessTodoList()
                    break;
                case 1:
                    this.getProcessDoneList()
                    break;
                case 2:
                    this.getProcessCopyList()
                    break;
            }
        }
    }
};
</script>

<style lang="scss" scoped>
</style>

<style lang="scss">
.container-approve-mine {
    .van-info {
        right: -10px;
    }
}
</style>