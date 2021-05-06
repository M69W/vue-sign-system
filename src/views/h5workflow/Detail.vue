<template>
    <div class="container-detail"  v-if="processDetail">
        <NavBar title="详情" />

        <div class="content">
            <div class="title">
                <img width="40" height="40" src="../../assets/image/renyuan.svg" />
                <div class="ellipsis" style="font-size: 17px; margin: 0 8px 0 10px; width: 60%;">{{ processDetail.processTitle }}</div>
                <van-tag plain type="primary">{{ formatProcessState[processDetail.processState] }}</van-tag>
            </div>

            <!-- 详情列表 -->
            <div class="list">    
                <div class="list-item">
                    <div class="list-item-title">审批编号:</div>
                    <div class="list-item-content">{{ processDetail.auditCode }}</div>
                </div>            
                <div class="list-item" v-for="(item, idx) in processDetail.viewableFormRespVOList" :key="idx">
                    
                    <!-- 部门、联系人 -->
                    <template v-if="['department', 'contacts'].includes(item.widgetType)">
                        <div class="list-item-title">{{ item.title }}:</div>
                        <div class="list-item-content list-item-content--dc">
                            <div style="margin-right: 6px;" v-for="(_item, _idx) in item.value" :key="_idx">
                                <van-tag @click="tipEllipsis(_item)" plain type="primary">
                                    <span class="ellipsis">{{ _item }}</span>
                                </van-tag>
                            </div>
                        </div>
                    </template>
                    <!-- 关联审批单 -->
                    <template v-else-if="['processlink'].includes(item.widgetType)">
                        <div class="list-item-title">{{ item.title }}:</div>
                        <div class="list-item-content list-item-content--processlink">
                            <div style="margin-right: 6px;" v-for="(_item, _idx) in item.value" :key="_idx">
                                <van-tag mark type="primary" @click="tolinkedProcess(_item.split('&')[0])">{{ _item.split('&')[1] }}</van-tag>
                            </div>
                        </div>
                    </template>
                    <!-- 文件、图片 -->
                    <template v-else-if="['fileupload', 'imgupload'].includes(item.widgetType)">
                        <div class="list-item-title">{{ item.title }}:</div>
                        <div class="list-item-content list-item-content--upload">
                            <div v-for="(_item, _idx) in item.value" :key="_idx" @click="previewFile">
                                <div class="ele">
                                    <van-image
                                        style="margin-right: 10px;"
                                        width="40" height="40"
                                        :src=" item.widgetType == 'fileupload' ? 
                                            'data:image/png;base64,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' : 
                                            _item.thumbImageUrl"
                                        >
                                    </van-image>
                                    <div>{{ _item.fileName }}</div>
                                </div>
                            </div>
                        </div>
                    </template>
                    <!-- 说明文字 ^含链接与否 -->
                    <template v-else-if="item.widgetType=='text'">
                        <div class="list-item-title">{{ item.title }}{{ item.title ? ':' : '' }}</div>
                        <div v-if="item.value.split('&')[1]" class="list-item-content">
                            <a :href="item.value.split('&')[1]">{{ item.value.split('&')[0] }}</a>                            
                        </div>
                        <div v-else class="list-item-content">{{ item.value.split('&')[0] }}</div>
                    </template>  
                    <!-- 电子签章 -->
                    <template v-else-if="item.widgetType=='seal'">
                        <div class="list-item-title">{{ item.title }}:</div>
                        <div class="list-item-content">{{ item.value.split('&')[1] }}</div>                        
                    </template>
                    <!-- 多选框组 -->
                    <template v-else-if="item.widgetType=='checkbox'">
                        <div class="list-item-title">{{ item.title }}:</div>
                        <div class="list-item-content list-item-content--dc">
                            <div style="margin-right: 6px;" v-for="(_item, _idx) in item.value" :key="_idx">
                                <van-tag plain type="primary">{{ _item.label }}</van-tag>
                            </div>
                        </div>                        
                    </template>
                    <!-- 其它... -->
                    <template v-else>
                        <div class="list-item-title">{{ item.title }}:</div>
                        <div class="list-item-content">{{ item.value }}</div>
                    </template>
                </div>

            </div>
        </div>

        <div class="process">
            <div class="title" style="font-size: 16px">审批流程</div>
            <!-- 审批人 -->
            <div>
                <van-steps direction="vertical" :active="-1" active-color="#458CE4">
                    <!-- <van-step>
                        <h3>李经理·已同意</h3>
                        <p>2016-07-12 12:40</p>
                    </van-step> -->
                    <van-step v-for="(item, idx) in processDetail.taskHistoryInfoRespVOList" :key="idx">
                        <van-collapse v-model="activeNames">
                            <van-collapse-item name="1">
                                <!-- 折叠板 title -->
                                <template #title>
                                    <div>
                                        <span>{{ item.taskName }}</span>
                                        <span v-if="item.taskAuditState"> · {{ formatTaskState[item.taskAuditState] }} ({{item.fraction}})</span>
                                    </div>
                                </template>

                                <div class="auditior-item" v-for="(_item, _idx) in item.auditorInfoRespVOList" :key="_idx">

                                    <template v-if="!_item.superiorList">
                                        <img style="float: left; margin-right: 5px; border-radius: 50%;" width="20" height="20" src="../../assets/image/renyuan.svg" />
                                        <h3>
                                            <span>{{ _item.auditorName }}</span>
                                            <span v-if="_item.operate"> · {{ formatOperate[_item.operate] }}</span>
                                        </h3>
                                        <p>{{ _item.comment }}</p>
                                    </template>
                                    <template v-else>
                                        <div v-for="(_citem, _cidx) in _item.superiorList" :key="_cidx">
                                            <img style="float: left; margin-right: 5px; border-radius: 50%;" width="20" height="20" src="../../assets/image/renyuan.svg" />
                                            <h3>
                                                <span>{{ _citem.auditorName }}</span>
                                                <span v-if="_citem.operate"> · {{ formatOperate[_citem.operate] }}</span>
                                            </h3>
                                        </div>
                                    </template>
                                </div>

                            </van-collapse-item>
                        </van-collapse>
                    </van-step>

                </van-steps>
            </div>
            <!-- 抄送人 -->
            <div class="cc">
                <div>抄送人：</div>
                <div class="cc-item">
                    <van-tag size="large" style="margin-right: 10px; margin-bottom: 5px;" plain v-for="(cItem, cIdx) in processDetail.ccManNickNameList" :key="cIdx"> {{ cItem }} </van-tag>
                </div>
            </div>
        </div>

        <!-- 仅针对`待处理`的流程实例操作允许添加 -->
        <div class="remarks" v-if="processType=='02'">
            <van-field v-model="remarks" type="textarea" label="备注" placeholder="请输入备注" autosize />
        </div>

        <div class="operations">
            <!-- 01已提交 02待处理 -->
            <template v-if="processType === '02' && !isLinkedProcess">
                <van-button type="info" @click="agreeApprove">同意</van-button>
                <van-button type="default" @click="disagreeApprove">驳回</van-button>
                <van-button type="default" @click="showTreeDialog">转审</van-button>
            </template>
            <template v-if="processType === '01' && !isLinkedProcess">
                <template v-if="!processDetail.showJumpSignButton">
                    <!-- <van-button type="default" @click="tipQuickApprove">催办</van-button> -->
                    <van-button style="width: 50%;" type="default" @click="cancelProcess">撤销</van-button>
                    <van-button style="width: 50%;" type="info" @click="restartProcess">重新提交</van-button>
                </template>
                <template v-else>
                    <!-- <van-button style="width: 30%;" type="default" @click="tipQuickApprove">催办</van-button> -->
                    <van-button v-if="!isSigned" style="width: 30%;" type="default" @click="cancelProcess">撤销</van-button>
                    <van-button v-if="!isSigned" style="width: 50%;" type="default" @click="restartProcess">重新提交</van-button>
                    <van-button 
                        :icon="isSigned ? 'success' : ''" 
                        :style="{ width: isSigned ? '100%' : '50%'}" 
                        type="info" 
                        @click="toSign"
                        >
                        电子签章
                    </van-button>
                </template>
            </template>
        </div>

        <!-- 部门成员弹窗 -->
        <van-popup v-model="treeDialogVisible" position="bottom" :style="{ height: '60%' }">
            <tree-select
                ref="tree"
                :multiple="false"
                type="user"
                :id="userInfo.enterpriseId"
                @cancel="treeDialogVisible = false"
                @confirm="letOtherApprove">
            </tree-select>
        </van-popup>        
    </div>
</template>

<script>
import NavBar from '@/components/NavBar.vue';
import TreeSelect from "@/components/TreeSelect.vue";
import { sessionStore as $SS } from '@/utils';
import { Toast } from 'vant';

export default {
    components: {
        NavBar,
        TreeSelect
    },
    data() {
        return {
            userInfo: null,
            // fromWhichPath: '',
            // isMine: false,
            activeNames: ['1'],
            processId: '',                          // 流程模板 ID
            processInstanceId: '',                  // 流程实例 ID
            processTitle: '',                       // 流程实例名称
            // `processType` 进入详情页的流程所属
            // 01已提交 02待处理 04已处理 03抄送我
            processType: '',
            processDetail: null,
            formatProcessState: {
                '01': '审批中',
                '02': '已通过',
                '03': '已驳回',
                '04': '通过前撤销',
                '05': '通过后撤销',
                '06': '管理员删除模板'            
            },
            optionsItem: ['radio', 'department'],
            formatTaskState: {
                '01': '审批中',
                '02': '已同意',
                '03': '已驳回'
            },
            formatOperate: {
                '00': '等待处理中',
                '01': '同意',
                '02': '驳回',
                '03': '转审'
            },


            treeDialogVisible: false,
            isLinkedProcess: false,

            remarks: '',

            // 电子签章
            contractId: '',     // 合同 ID
            isSigned: false,    // 实例是否已经签署
            hasSealItem: false, // 是不包含电子签章组件

            tempCode: '',       // 临时授权码
        };
    },
    async beforeRouteUpdate(to, from, next) {
        // console.log(to)
        if (to.query.sid) {
            // console.log(to.query.sid)
            this.isLinkedProcess = true
            await this.getProcessDetail(to.query.iid, to.query.sid)
        } else {
            this.isLinkedProcess = false
            await this.getProcessDetail()
        }
        next()
    },
    created() {
        let _query = this.$route.query
        this.processInstanceId = _query.iid
        this.processType = _query.type

        this.userInfo = $SS.get('userInfo')
        // console.log(this.userInfo)
    },
    async mounted() {
        await this.getProcessDetail()

        if (this.hasSealItem && this.processType == '01' && this.processDetail.processState == '02') {
            // ^ 包含电子签章组件 && 我发起的 && 已通过
            this.getSignPrepareData()
        }

        this.getDownloadTempCode()
    },
    methods: {
        // API
        // ------------------------------------------------------------------
        // 获取详情
        apiGetProcessDetail(data) {
            return this.$api('urlGetProcessDetail').get('getPath', data)
        },
        apiGetLinkedProcessDetails(data) {
            return this.$api('urlGetLinkedProcessDetails').get('getPath', data)
        },
        // 同意/驳回
        apiAgreeOrDisagreeApprove(data) {
            return this.$api('urlAgreeOrDisagreeApprove').post('postNormal', data)
        },
        // 撤销
        apiCancelProcess(data) {
            return this.$api('urlCancelProcess').delete('deleteNormal', data)
        },
        // 转审
        apiLetOtherApprove(data) {
            return this.$api('urlLetOtherApprove').post('postNormal', data)
        },
        // 催办
        apiTipQuickApprove(data) {
            return this.$api('urlTipQuickApprove').post('postPath', null, data)
        },
        // 电子签章的准备数据
        apiGetSignPrepareData(data) {
            return this.$api('urlGetSignPrepareData').get('getPath', data)
        },

        // 获取工作流（企业微信）中下载文件临时授权 code
        apiGetDownloadTempCode() {
            return this.$api('urlGetDownloadTempCode').get()
        },
        // ------------------------------------------------------------------
        async getDownloadTempCode() {
            let res = await this.apiGetDownloadTempCode()

            if (!res) return
            this.tempCode = res.data.data
        },
        async getSignPrepareData() {
            let _data = {
                processInsId: this.processInstanceId
            }

            let res = await this.apiGetSignPrepareData(_data)
            if (!res) return

            console.log(res.data.data)
            if (res.data.data.showQrCode) {
                // ^ 已经签署过的
                this.isSigned = true
                this.contractId = res.data.data.compactId
            }
        },
        async getProcessDetail(iid, sid) {
            let res = null

            if (sid) {
                // ^ 关联表单处跳转
                let _data = {
                    sourcePid: sid,
                    linkPid: iid
                }

                res = await this.apiGetLinkedProcessDetails(_data)                

            } else {
                // ^ 正常跳转
                let _data = {
                    id: this.processInstanceId,
                    type: this.processType
                }
                res = await this.apiGetProcessDetail(_data)
            }

            if(!res) return;
            // console.log(res.data.data)
            this.processDetail = res.data.data
            this.processId = res.data.data.modelId
            this.processTitle = res.data.data.processTitle

            // 数据解析处理
            this.processDetail.viewableFormRespVOList.map(item => {
                // console.log(item.title, item.val)

                item.widgetConfig = JSON.parse(item.widgetConfig)

                // 文本值如果后台返回的是 `'null'` ，转化为真正的 null
                if (item.value == 'null') {
                    item.value = null
                }

                // 单选框
                if (item.widgetType == 'radio') {
                    // 调整数据，使其对用显示可读 label
                    item.widgetConfig.options.options.forEach(_item => {
                        if (item.value == _item.value) {
                            item.value = _item.label
                        }
                    });
                }

                // 多选框组
                if (item.widgetType == 'checkbox') {

                    let _value = []
                    let _arr = JSON.parse(item.value)

                    _arr.map(_oItem => {
                        // console.log(_oItem)
                        item.widgetConfig.options.options.map((_iItem, _iIdx) => {
                            if (_oItem == _iItem.value) {
                                _value.push(_iItem)
                            }
                        })
                    })
                    // console.log(_value)
                    item.value = _value
                }

                // 部门、联系人
                if (['department', 'contacts'].includes(item.widgetType)) {
                    if (item.widgetType == 'department') {
                        // 仅是为了数据处理
                        item.value = item.value.substring(2)
                        item.value = item.value.split('\'')[0]
                    }

                    // 格式化字符串为数组
                    let list = []
                    list = item.value.split(',')

                    let _list = []
                    list.map(_item => {
                        if (_item.split('&')[1]) _list.push(_item.split('&')[1])
                    })

                    console.log(_list)
                    item.value = _list
                }   

                // 关联审批单
                if (['processlink'].includes(item.widgetType)) {
                    let list = []
                    list = item.value.split(',')
                    if (list[0] == '') list = []
                    item.value = list
                }  

                // 文件图片
                if (['fileupload', 'imgupload'].includes(item.widgetType)) {
                    let _list = []
                    _list = JSON.parse(item.value)

                    // console.log(_list)
                    item.value = _list
                }

                // 地点
                if (item.widgetType == 'address') {
                    let _list = item.value.split('&')
                    // 地址为空时，置空
                    // console.log(_list)
                    if (_list[0] == 'NaN') _list[0] = ''
                    item.value = '' + _list[0] + _list[1]

                }

                // 日期区间
                if (item.widgetType == 'datetimerange') {
                    if (item.value.indexOf('null') > -1 || item.value == ' -- ') item.value = ''
                }

                // 电子签章
                if (item.widgetType == 'seal') this.hasSealItem = true
            })
        },
        // 跳转到关联的表单
        async tolinkedProcess(processlinkedId) {
            // console.log('jump to...')
            // console.log(processlinkedId)

            this.$router.push({
                path: '/h5wf/detail',
                query: {
                    iid: processlinkedId,
                    type: '04',
                    sid: this.processInstanceId
                }
            })
        },
        // 同意
        async agreeApprove() {
            let _data = {
                comment: this.remarks,
                id: this.processInstanceId,
                operate: '01'
            }
            
            let res = await this.apiAgreeOrDisagreeApprove(_data)
            if(!res) return;
            // console.log(res)
            this.$SU.notify('success', '审批成功')
            this.$router.push({
                path: '/h5wf/approve-mine',
                query: {
                    tab: 1
                }
            })
        },
        // 驳回
        async disagreeApprove() {
            let _data = {
                comment:  this.remarks,
                id: this.processInstanceId,
                operate: '02'
            }
            
            let res = await this.apiAgreeOrDisagreeApprove(_data)
            if(!res) return;
            // console.log(res)

            this.$SU.notify('success', '驳回成功')
            this.$router.push({
                path: '/h5wf/approve-mine',
                query: {
                    tab: 1
                }
            })
        },
        // 撤销
        async cancelProcess() {
            // console.log('cancel process...');
            let _data = {
                pid: this.processInstanceId,
                reason: '必须填写撤销原因...'
            }

            let res = await this.apiCancelProcess(_data)
            if(!res) return;
            // console.log(res)

            this.$SU.notify('success', '撤销成功')
            this.$router.push({
                path: '/h5wf/approve-submitted'
            })
        },

        // 重新提交
        restartProcess() {
            // console.log('restart process.....')
            this.$router.push({
                path: '/h5wf/form',
                query: {
                    id: this.processId,
                    name: this.processTitle,
                    iid: this.processInstanceId
                }
            })
        },
        // 转审
        showTreeDialog() {
            this.treeDialogVisible = true
        },
        async letOtherApprove(val) {
            // console.log('转审...')
            // console.log(val);
            
            let _turnToId = ''

            if (val) {
                _turnToId = val.split('&')[0]
            }

            let _data = {
                operate: '03',
                id: this.processInstanceId,
                turnToId: _turnToId,
                comment:  this.remarks
            }

            let res = await this.apiLetOtherApprove(_data)
            if(!res) return;

            // console.log(res)
            this.$SU.notify('success', '转审成功')

            this.treeDialogVisible = false

            this.$router.push({
                path: '/h5wf/approve-mine',
                query: {
                    tab: 1
                }
            })
        },
        // 催办
        async tipQuickApprove() {
            // console.log("催办...")

            let _data = { pid: this.processInstanceId }
            
            let res = await this.apiTipQuickApprove(_data)
            if(!res) return;

            // console.log(res)

            this.$SU.notify('success', '催办成功')
        },
        tipEllipsis(val) {
            Toast(val)
        },
        // 电子签章
        async toSign() {
            console.log('去签章...')
            // await this.getSignPrepareData()
            if (this.isSigned) {
                // ^ 已经签署过的
                // 跳转至签署成功页面
                let time = new Date()
                let signDate = time.getFullYear() + '-' + (time.getMonth() + 1) +'-'+ time.getDate()
                this.$router.push({
                    path: '/h5sign/h5SignSuccess',
                    query: {
                        signDate,
                        fileCode: this.contractId,
                        contractId: this.contractId,
                        iswf: 1,
                        tempCode: this.tempCode
                    }
                })

            } else {
                // ^ 合同尚未签署
                this.$router.push({
                    path: '/h5sign/h5SignContract',
                    query: {
                        iid: this.processInstanceId,
                        isFile: 1,
                        isSysUser: 1,
                        iswf: 1
                    }
                })
            }
        },
        previewFile() {
            if (this.hasSealItem) {
                this.$router.push({
                    path: '/h5sign/h5SignContract',
                    query: {
                        iid: this.processInstanceId,
                        isFile: 1,
                        isSysUser: 1,
                        iswf: 1,
                        isPreview: 1,
                    }
                })
            }
        },
    },
};
</script>

<style lang="scss" scoped>
.container-detail {
    min-height: 100%;
    background-color: #f1f2f6;

    .content {
        background-color: #fff;
        padding: 8px;
        margin-bottom: 12px;

        .title {
            display: flex;
            align-items: center;
        }

        .list {
            padding: 2px 20px;
            // background-color: #fee;

            .list-item {
                margin: 16px 0;
                display: flex;

                .list-item-title {
                    min-width: 80px;
                    color: #666;                    
                }

                .list-item-content {
                    width: 100%;
                    // background-color: #CC0;
                    // color: #19f;
                    white-space: normal;
                    word-break: break-all;

                    a {
                        color: #19f;
                    }
                }

                .list-item-content--upload {
                    .ele {
                        display: flex;
                        align-items: flex-end;
                        border: 1px solid #eee;
                        margin-bottom: 8px;
                    }
                }
                .list-item-content--dc,
                .list-item-content--processlink {
                    .van-tag--primary {
                        margin-bottom: 10px;
                        height: 30px;
                        width: 80%;
                        line-height: 30px;
                    }
                }

                .list-item-content--dc {
                    // display: flex;
                    .van-tag--plain {
                        width: 48%;
                    }
                }                
            }
        }
    }

    .process {
        background-color: #fff;
        padding: 8px;
        margin-bottom: 30px;

        .title {
            margin-bottom: 8px;
        }

        .cc {
            min-height: 30px; 
            margin-bottom: 16px;
            font-size: 16px;

            .cc-item {
                margin: 10px 35px;
                margin-top: 16px;
            }            
        }
    }
}
</style>

<style lang="scss">
.container-detail {
    position: relative;
    
    .van-steps {
        .van-step__title {
            color: #333;
            font-size: 16px;
        }
    }

    .van-collapse {
        .van-cell {
            padding: 0;
        }

        .van-cell__title {
            font-size: 16px;
        }

        .van-collapse-item__content {
            font-size: 15px;
            color: #999;
            padding: 0;
        }

        .van-cell:not(:last-child)::after {
            border-bottom: 1px solid #fff;
        }

        .auditior-item {
            background-color: #f7f8fa;
            margin: 10px 0;
            padding: 8px 16px;
        }
    }

    .remarks {
        background: #333;
        margin: 12px 0 40px;

        .van-button--default {
            // background: #aaf;
        }
    }

    .operations {
        display: flex;
        justify-content: space-between;
        position: fixed;
        width: 100%;
        bottom: 0;

        .van-button {
            width: 34%;

            .van-button__text {
                font-size: 17px;
                color: #666;
            }
        }
        .van-button--info {
            .van-button__text {
                color: #fff;
            }
        }
    }
}
</style>