<template>
    <div class="container-approve-apply">
        <van-grid
            :column-num="3"
            square
            clickable
            :border="false"
            v-for="(item, idx) in processList"
            :key="idx"
        >
            <div class="group-title">
                <span>{{item.groupName}}</span>
                <span @click="toggleHide(idx)">{{ !item.isHide ? '收起' : '展开' }}</span>
            </div>
            <template v-if="!item.isHide">
                <!-- to="/h5wf/form" -->
                <!-- 
                    :icon="_item.processIconUrl"
                    :text="_item.processName"                    
                 -->
                <van-grid-item
                    v-for="(_item, _idx) in item.processRespVOList"
                    :key="_idx"
                    @click="startApprove(_item.id, _item.processName)"
                    >
                    <div class="grid-item">
                        <img :src="_item.processIconUrl" alt="" width="36" />
                        <div class="title ellipsis">{{ _item.processName }}</div>
                    </div>
                </van-grid-item>
            </template>
        </van-grid>
    </div>
</template>

<script>
export default {
    data() {
        return {
            processList: []
        };
    },
    mounted() {
        // this.apiGetprocessList();
        this.getProcessList()


    },
    methods: {
        // urlGetProcessList
        // API
        // ------------------------------------------------------------------
        // 获取可发起的流程列表
        apiGetProcessList() {
            return this.$api('urlGetProcessList').get()
        },


        // ------------------------------------------------------------------
        async getProcessList() {
            let res = await this.apiGetProcessList()
            if (!res) return
            // console.log(res.data.data)

            this.processList = res.data.data
        },


        // async apiGetprocessList() {
        //     let res = await this.$h5api.get("/approve-apply");

        //     console.log(res.data);
        //     this.$SU.log(res.data);

        //     this.processList = res.data.list;

        //     this.processList.map(item => {
        //         item = Object.assign(item, { isHide: false });
        //         console.log(item);
        //     });

        //     console.log(this.processList);
        // },
        
        // 展开/折叠分组
        toggleHide(idx) {
            this.processList[idx].isHide = !this.processList[idx].isHide;

            this.processList = this.$SU.clone(this.processList); // `$SU` 为全局可用的工具函数集合
        },

        startApprove(processId, processName) {
            this.$router.push({
                path: '/h5wf/form',
                query: {
                    id: processId,
                    name: processName
                }
            })
        },
    }
};
</script>

<style lang="scss" scoped>
.container-approve-apply {
    .group-title {
        border-bottom: 1px solid #eee;
        height: 40px;
        line-height: 40px;
        font-size: 14px;
        color: #8c8d8e;

        width: 100%;
        text-align: left;
        display: flex;
        justify-content: space-between;
        background-color: #fff;
    }

    .grid-item {
        // background-color: #fee;
        width: 80px;
        height: 80px;
        margin: 0 6px;
        display: flex;
        flex-direction: column;
        justify-content: space-around;   
        align-items: center;     

        .title {
            // background-color: #ff0;
            font-size: 12px;
            height: 16px;   
            width: 80px; 
            text-align: center;
        }
    }
}
</style>

<style lang="scss">
.container-approve-apply {
    .van-grid {
        background-color: #fff;
        margin: 12px 10px;
        padding: 0 11px;
        border-radius: 5px;

        .van-grid-item__content {
            border-bottom: 1px solid #eee;
        }

        &:last-child {
            margin-bottom: 10px;
        }
    }
}
</style>

