<template>
    <div class="container-form">
        <NavBar :title="processName" />

        <van-form colon @submit="onSubmit" ref="FM">
            <!-- 组件条目 -->
            <div 
                v-for="(item, idx) in processFormList" :key="idx"
                @click="onClick(idx)">

                <!-- 单行文本 -->
                <template v-if="item.widgetType === 'input'">
                    <van-field 
                    :readonly="item.widgetAuthType == '02'"
                    :required="item.request" 
                    :value="item.val" 
                    :name="item.id" 
                    :label="item.title" 
                    :placeholder="item.widgetConfig.options.placeholder"
                    @input="onInput" />
                </template>
                <!-- 多行文本 -->
                <template v-if="item.widgetType === 'textarea'">
                    <van-field 
                    :readonly="item.widgetAuthType == '02'"
                    :required="item.request" 
                    type="textarea" 
                    :value="item.val" 
                    :name="item.id" 
                    :label="item.title" 
                    :placeholder="item.widgetConfig.options.placeholder" 
                    @input="onInput" />
                </template>
                <!-- 数字文本 -->
                <!-- @blur="getCurForm" -->
                <template v-if="item.widgetType === 'numberinput'">
                    <van-field 
                        :readonly="item.widgetAuthType == '02'"
                        :required="item.request" 
                        type="number" 
                        :value="item.val"
                        :name="item.id" 
                        :label="item.title" 
                        :placeholder="item.widgetConfig.options.placeholder"
                        @blur="toGetCurForm"
                        @input="onInput" />
                </template>
                <!-- 单选框组 -->
                <template v-if="item.widgetType === 'radio'">
                    <van-field :required="item.request" :name="item.id" :label="item.title">
                        <template #input>
                            <van-radio-group 
                                :disabled="item.widgetAuthType=='02'"
                                v-model="item.widgetConfig.options.defaultValue" 
                                @change="toGetCurForm"
                                >
                                <van-radio
                                    v-for="(_item, _idx) in item.widgetConfig.options.options" :key="_idx" 
                                    :name="_item.value">
                                    {{ _item.label }}
                                </van-radio>
                            </van-radio-group>
                        </template>
                    </van-field>
                </template>
                <!-- 金额 -->
                <!-- @blur="getCurForm" -->
                <!-- @focus="onFocus" -->
                <template v-if="item.widgetType === 'money'">
                    <van-field 
                    :readonly="item.widgetAuthType == '02'"
                    :required="item.request" 
                    type="number" 
                    :value="item.val" 
                    :name="item.id" 
                    :label="item.title" 
                    :placeholder="item.widgetConfig.options.placeholder"
                    @blur="toGetCurForm"
                    @input="onInput" />
                </template>
                <!-- 部门 -->
                <template v-if="item.widgetType === 'department'">
                    <van-field 
                        :required="item.request" 
                        :name="item.id" :label="item.title"  
                        :value="item.selectedDepartmentListReal.toString()"
                        @click="selectTree('org', item.widgetConfig.options.whichRadio, idx)">
                        <template #input>
                            <div class="department">         
                                <div 
                                    style="color: #999;"
                                    v-if="item.selectedDepartmentList.length == 0"
                                    >
                                    {{ item.widgetConfig.options.placeholder }}
                                </div>                          
                                <van-tag
                                    style="margin: 0 5px;"
                                    v-for="(_item, _idx) in item.selectedDepartmentList" :key="_idx"
                                    :closeable="isTagCloseable"
                                    plain 
                                    type="primary"
                                    size="medium"
                                    @close="delCurDepartment('org', item.widgetConfig.options.whichRadio, _idx, idx)">
                                    {{ _item }}
                                </van-tag>
                            </div>
                        </template>
                    </van-field>
                </template>

                <!-- <template v-if="item.widgetType === 'checkbox'">
                    <van-field name="checkbox" label="复选框">
                        <template #input>
                            <van-checkbox v-model="checkbox" shape="square" />
                        </template>
                    </van-field>
                </template> -->

                <!-- 复选框组 -->
                <template v-if="item.widgetType === 'checkbox'">
                    <van-field :required="item.request" :name="item.id" label="复选框组" :value="item.widgetConfig.options.defaultValue.toString()">
                        <template #input>
                            <van-checkbox-group 
                                :disabled="item.widgetAuthType=='02'"
                                v-model="item.widgetConfig.options.defaultValue" 
                                direction="horizontal"
                                >
                                <van-checkbox 
                                    style="width: 100%; margin: 5px 0;"
                                    v-for="(_item, _idx) in item.widgetConfig.options.options" :key="_idx"
                                    :name="_item.value"
                                    shape="square">
                                    {{ _item.label }}
                                </van-checkbox>                                
                            </van-checkbox-group>
                        </template>
                    </van-field>
                </template>

                <!-- 日期 -->
                <template v-if="item.widgetType === 'datetime'">
                    <van-field :required="item.request" :name="item.id" :label="item.title" :value="item.val">
                        <template #input>
                            <div 
                                :class="{ 'placeholder-color': !item.val }"
                                style="width: 100%;"
                                @click="showDateDialog(item.widgetConfig.options.format, '0', idx)"
                                >
                                {{ item.val ? item.val : item.widgetConfig.options.placeholder }}
                            </div>
                        </template>
                    </van-field>                    
                </template>

                <template v-if="item.widgetType === 'datetimerange'">
                    <van-field :required="item.request" :name="item.id" :label="item.title" :value="item.valStart + ' -- ' + item.valEnd">
                        <template #input>
                            <div 
                                :class="{ 'placeholder-color': !item.valStart }"
                                style="width: 100%;" 
                                @click="showDateDialog(item.widgetConfig.options.format, '1', idx)">
                                {{ item.valStart ? item.valStart : item.widgetConfig.options.startPlaceholder }}
                            </div>        
                            <div style="background: #fff; width: 32px; text-align: center;">-</div>            
                            <div 
                                :class="{ 'placeholder-color': !item.valEnd }"
                                style="width: 100%;" 
                                @click="showDateDialog(item.widgetConfig.options.format, '2', idx)">
                                {{ item.valEnd ? item.valEnd : item.widgetConfig.options.endPlaceholder }}
                            </div>                            
                        </template>                        
                    </van-field>                    
                </template>

                <template v-if="item.widgetType === 'address'">
                    <van-field 
                        :required="item.request" 
                        :name="item.id" :label="item.title" 
                        :value="selectedAddress[0].name + selectedAddress[1].name + selectedAddress[2].name + '&' + addressDetail">
                        <template #input>
                            <div
                                :class="{ 'placeholder-color': selectedAddress == '请选择' }"
                                style="width: 100%;"
                                @click="showAddressDialog(idx)">
                                <div v-if="selectedAddress == '请选择'">{{ selectedAddress }}</div>
                                <div v-else>
                                    {{ selectedAddress[0].name + selectedAddress[1].name + selectedAddress[2].name }}
                                </div>
                            </div>
                        </template>
                    </van-field>
                    <van-field 
                        :readonly="item.widgetAuthType=='02'"
                        :required="item.request" 
                        :name="item.id + '_detail'" 
                        label="详细地址" 
                        v-model="addressDetail"
                        placeholder="请输入详细地址">
                    </van-field>                    
                </template>

                <template v-if="item.widgetType === 'text'">
                    <van-field :required="item.request" :name="item.id" :label="item.title" :value="item.widgetConfig.options.defaultValue + '&' + item.widgetConfig.options.defaultValueLink">
                        <template #input>
                            <!-- ^ 含链接的说明文字 -->
                            <div v-if="item.widgetConfig.options.defaultValueLink">
                                <a style="color: #19f;" :href="item.widgetConfig.options.defaultValueLink">{{ item.widgetConfig.options.defaultValue }}</a>
                            </div>
                            <!-- ^ 不含链接的说明文字 -->
                            <div v-else>{{ item.widgetConfig.options.defaultValue }}</div>
                        </template>
                    </van-field>
                </template>

                <template v-if="item.widgetType === 'processlink'">
                    <van-field :required="item.request" :name="item.id" :label="item.title" readonly @click="showProcesslinkDialog(idx)" :value="processlinkedList.toString()">
                        <template #input>
                            <div>               
                                <div 
                                    style="color: #999;"
                                    v-if="processlinkedList.length == 0"
                                    >
                                    {{ item.widgetConfig.options.placeholder }}
                                </div>                       
                                <van-tag
                                    style="margin: 0 5px;"
                                    v-for="(_item, _idx) in processlinkedList" :key="_idx"
                                    closeable
                                    plain 
                                    type="primary"
                                    size="medium"
                                    @close="delCurProcesslink(_idx)"
                                    >
                                    {{ _item.split('&')[1] }}
                                </van-tag>
                            </div>                            
                        </template>                        
                    </van-field>                    
                </template>

                <template v-if="item.widgetType === 'formula'">
                    <van-field :required="item.request" :name="item.id" :label="item.title" :id="item.widgetConfig.options.formula" :value="item.val" readonly></van-field>                    
                </template>

                <template v-if="item.widgetType === 'seal'">
                    <van-field 
                        :required="item.request" 
                        is-link readonly
                        placeholder="请选择"
                        input-align="right"
                        :label="item.title"
                        :name="item.id"
                        :value="sealSelected.code + '&' + sealSelected.name"
                        @click="sealDialogVisible = item.widgetAuthType=='02' ? false : true"
                        >
                        <template #input>
                            <div class="seal">
                                {{ sealSelected.name }}
                            </div>
                        </template>
                    </van-field>
                </template>

                <!-- <template v-if="item.widgetType === 'signature'">
                    <van-field :name="item.id" :label="item.title">
                        <template #input>
                            <div class="signature-outter">
                                签名
                            </div>                            
                        </template>                        
                    </van-field>
                </template> -->

                <template v-if="item.widgetType === 'contacts'">
                    <van-field 
                        :required="item.request" 
                        :name="item.id" :label="item.title" 
                        :value="item.selectedUserListReal.toString()"
                        @click="selectTree('user', item.widgetConfig.options.whichRadio, idx)">
                        <template #input>
                            <div class="department">   
                                <div 
                                    style="color: #999;"
                                    v-if="item.selectedUserList.length == 0"
                                    >
                                    {{ item.widgetConfig.options.placeholder }}
                                </div>                                   
                                <van-tag
                                    style="margin: 0 5px;"
                                    v-for="(_item, _idx) in item.selectedUserList" :key="_idx"
                                    :closeable="isTagCloseable"
                                    plain 
                                    type="primary"
                                    size="medium"
                                    @close="delCurUser('user', item.widgetConfig.options.whichRadio, _idx, idx)">
                                    {{ _item }}
                                </van-tag>
                            </div>                            
                        </template>                        
                    </van-field>
                </template>


                <!-- 附件 -->
                <template v-if="['fileupload', 'imgupload'].includes(item.widgetType)">
                    <van-field :required="item.request" :name="item.id" :label="item.title">
                        <template #input>
                            <van-uploader 
                                :disabled="item.widgetAuthType=='02'"
                                v-model="item.fileList"
                                :accept="item.widgetType == 'fileupload' ? 'file' : 'image/*'"
                                :upload-icon="item.widgetType == 'fileupload' ? 'idcard' : 'photo-o'"
                                :upload-text="item.widgetType == 'fileupload' ? '上传文件' : '上传图片'"
                                :max-count="item.widgetConfig.options.limit"
                                :after-read="afterRead"
                                :before-delete="beforeDelete"
                                @delete="deleteFile"
                                >
                            </van-uploader>
                        </template>
                    </van-field>
                </template>

                <template v-if="item.widgetType === 'table'">
                    <van-field :required="item.request" :name="item.id" :label="item.title">
                        <template #input>
                        </template>                        
                    </van-field>
                </template>

            </div>
            <!-- 审批流程 -->
            <div>
                <div style="background: #fff; font-size: 16px; padding: 16px">审批流程</div>
                <van-steps direction="vertical" active="-1" active-color="#458CE4">
                    <div v-for="(item, idx) in processInfoList" :key="idx">
                        
                        <van-step>
                            <div>审批人</div>
                            <div style="display: flex; flex-wrap: wrap; width: 80%;">
                                <!-- TODO ^ 允许审批人自选 - `allowOptAuditor` 为 true -->
                                <template v-if="item.allowOptAuditor"> 
                                    <!--允许审批人自选时， `auditorList` 默认为 null  -->
                                    <template v-if="item.auditorList">                                    
                                        <div v-for="(_item, _idx) in item.auditorList" :key="_idx">
                                            <van-tag size="large" type="primary" @click="chooseApprover(idx)">
                                                X{{_idx}}X
                                            </van-tag>                            
                                            <span v-if="_idx !== (item.auditorList.length - 1) && item.segmentType === '01'" class="or-or-and">/</span>
                                            <span v-if="_idx !== (item.auditorList.length - 1) && item.segmentType === '02'" class="or-or-and">+</span>
                                        </div>
                                    </template>
                                    <template v-else>
                                        <van-tag size="large" type="primary" @click="chooseApprover(idx)">选择审批人</van-tag>
                                    </template>            

                                </template>
                                <!-- ^ 不允许自选审批人 - `allowOptAuditor` 为 false -->
                                <template v-else>
                                    <!-- ^^ 非连续多级主管时 -->
                                    <template v-if="item.segmentType != '03'">
                                        <div v-for="(_item, _idx) in item.auditorList" :key="_idx">
                                            <van-tag plain size="large">
                                                {{_item.userNickName}}
                                            </van-tag>
                                            <span v-if="_idx !== (item.auditorList.length - 1) && item.segmentType === '01'" class="or-or-and">/</span>
                                            <span v-if="_idx !== (item.auditorList.length - 1) && item.segmentType === '02'" class="or-or-and">+</span>
                                        </div>
                                    </template>
                                    <!-- ^^ 是连续多级主管时 -->
                                    <template v-if="item.segmentType == '03'">
                                        <div 
                                            style="display: flex; width: 100%; margin-bottom: 6px;"
                                            v-for="(_item, _idx) in item.multipleAuditorList" :key="_idx"
                                            >
                                            <div 
                                                style="display: flex; flex-shrink: 0; flex-wrap: wrap;"
                                                v-for="(__item, __idx) in _item" :key="__idx">
                                                <van-tag plain size="large">
                                                    {{__item.userNickName}}
                                                </van-tag>
                                                <span v-if="(_item.length - 1) === __idx && _idx !== (item.multipleAuditorList.length - 1)" class="or-or-and">+</span>
                                                <span v-if="(_item.length - 1) !== __idx" class="or-or-and">/</span>
                                            </div>
                                        </div>
                                    </template>
                                </template>    
                            </div>
                        </van-step>
        
                        <van-step>
                            <div style="width: 100px;">抄送人</div>
                            <div style="display: flex; flex-wrap: wrap; width: 120%;">
                                <!-- 允许抄送人自选 - `allowOptCarbonCopyMan` 为 true -->                                
                                <template v-if="item.allowOptCarbonCopyMan">

                                    <div v-if="item.allowOptCarbonCopyMan">
                                        <span class="or-or-and">+</span>
                                        <van-tag 
                                            size="large" type="primary"
                                            @click="selectTree('user', 'multi')"
                                            >
                                            +++
                                        </van-tag>
                                    </div>
                                </template>

                                <!-- 不允许自选抄送人 - `allowOptCarbonCopyMan` 为 false -->
                                <template v-else>
                                    <div  v-for="(_item, _idx) in item.carbonCopyManList" :key="_idx">
                                        <van-tag plain size="large" style="margin-bottom: 5px;">
                                            {{_item.userNickName}}
                                        </van-tag>
                                        <!--允许审批人自选时， `carbonCopyManList` 默认为 null  -->
                                        <template v-if="item.carbonCopyManList">
                                            <span v-if="_idx !== (item.carbonCopyManList.length - 1)" class="or-or-and">+</span>
                                        </template>
                                    </div>
                                </template>
                            </div>
                        </van-step>
                       
                    </div>
                </van-steps>
            </div>            

            <div style="margin: 16px;">
                <van-button v-if="isRestart" round block type="info" native-type="submit">重新提交</van-button>
                <van-button v-else round block type="info" native-type="submit">提交</van-button>
            </div>
        </van-form>

        <!-- <van-button round block type="info" @click="test">测试</van-button> -->
        
        <!-- 日期弹窗 -->
        <van-popup v-model="dateDialogVisible" position="bottom" :style="{ height: '40%' }">
            <van-datetime-picker
                v-model="currentDate"
                :type="dateformat"
                title="选择年月日"
                :min-date="minDate"
                :max-date="maxDate"
                @cancel="dateDialogVisible = false"
                @confirm="selectCurDate"
            />
        </van-popup>

        <!-- 地址弹窗 -->
        <van-popup v-model="addressDialogVisible" position="bottom" :style="{ height: '40%' }">
            <van-area
            title="标题"
            :area-list="areaList"
            @cancel="addressDialogVisible = false"
            @confirm="selectCurAddress"
            />
        </van-popup>    

        <!-- 部门成员弹窗 -->
        <van-popup v-model="treeDialogVisible" position="bottom" :style="{ height: '60%' }">
            <tree-select
                ref="tree"
                :multiple="isMultiple"
                :type.sync="treeType"
                :id="userInfo.enterpriseId"
                @cancel="treeDialogVisible = false"
                @confirm="treeDialogConfirm"
                >
            </tree-select>
        </van-popup>    

        <!-- 关联审批单弹窗 -->
        <van-popup v-model="processlinkDialogVisible" position="bottom" :style="{ height: '80%' }">
            <div class="container-processlink" v-if="processlinkData">

                <div class="operations">
                    <van-button class="btn btn-left" size="small" type="default" @click="processlinkDialogVisible = false">取消</van-button>            
                    <van-button class="btn btn-right" size="small" type="info" @click="processlinkDialogConfirm">确定</van-button>
                </div>

                <div class="contents">
                    <form action="/">
                        <van-search
                            v-model="searchVal"
                            show-action
                            placeholder="搜索人名、标题、内容、状态"
                            input-align="center"
                            background="#F1F2F6"
                            action-text=" "
                            @search="getProcesslinkSearchData"
                            @clear="getProcesslinkData"
                        />
                    </form>

                    <van-sticky :offset-top="182">
                        <van-tabs v-model="activeTab" title-active-color="#0082EF" color="#0082EF" @change="switchTab">
                            <van-tab title="我发起的"></van-tab>
                            <van-tab title="我审批的"></van-tab>
                            <van-tab title="抄送我的"></van-tab>
                        </van-tabs>
                    </van-sticky>

                    <template v-if="activeTab === 0">
                        <ProcesslinkList @checkok="checkok" @checkno="checkno" :list="processlinkData.myStartedList" />
                    </template>
                    <template v-else-if="activeTab === 1">
                        <ProcesslinkList @checkok="checkok" @checkno="checkno" :list="processlinkData.myAuditList" />
                    </template>
                    <template v-else>
                        <ProcesslinkList @checkok="checkok" @checkno="checkno" :list="processlinkData.carbonCopyMeList" />
                    </template>
                </div>

            </div>            
        </van-popup>

        <!-- 印章类型弹窗 -->
        <van-action-sheet :round="false" v-model="sealDialogVisible" :actions="sealActions" @select="onSelectSeal" />

    </div>
</template>

<script>
import NavBar from "@/components/NavBar.vue";
import TreeSelect from "@/components/TreeSelect.vue";
import ProcesslinkList from "@/components/h5workflow/form/ProcesslinkList";
import area from "@/components/h5workflow/form/area.js"
import { Popup } from 'vant';
import { sessionStore as $SS } from '@/utils';


export default {
    components: {
        NavBar,
        TreeSelect,
        ProcesslinkList
    },
    data() {
        return {
            userInfo: null,

            isRestart: false,       // 是否为重新提交的流程，默认 false
            processInstanceId: '',  // 流程实例 id

            text: '',
            textarea: '',
            number: '',
            // checkbox: false,
            checkboxGroup: [],

            dateformat: 'date',             // `date`  `datetime` 带时间
            dateType: '',                   // `datetime`日期 `datetimeStart`开始日期 `datetimeEnd`结束日期
            dateDialogVisible: false,
            minDate: new Date(2000, 0, 1),
            maxDate: new Date(2040, 10, 1),
            currentDate: new Date(),

            addressDialogVisible: false,
            areaList: area,
            selectedAddress: '请选择',
            addressDetail: '',


            processId: '',
            processName: '',
            processFormList: [],    // 流程表单列表
            processInfoList: [],    // 流程审批人和抄送人列表

            currentIdx: 0,
            currentWidgetId: 0,

            fileList: [],
            
            treeDialogVisible: false,
            isMultiple: false,
            treeType: 'org',                    // `org`组织 `user`成员 

            isTagCloseable: true,               // 默许 van-tag 是可删除的

            // 关联审批单
            processlinkDialogVisible: false,
            processlinkData: null,
            processlinkAllData: null,   // 全量
            processlinkedList: [],
            activeTab: 0,
            searchVal: '',

            // 电子签章
            sealList: [],
            sealDialogVisible: false,
            sealActions: [],
            sealSelected: { name: '', code: '' },
            isForSeal: false,                   // 当前实例是否将用于签章

            // 是否包含计算公式组件
            hasFormula: false,
        };
    },
    created() {
        let _query = this.$route.query

        if(_query.iid) {
            // ^ 为重新提交的流程
            this.isRestart = true
            this.processInstanceId = _query.iid
        }
        
        this.processId = _query.id
        this.processName = _query.name


        this.userInfo = $SS.get('userInfo')
        // console.log(this.userInfo)
    },
    async mounted() {
        await this.getSealList()             // 获取印章列表

        if(this.isRestart) {
            // ^ 重新提交
            // console.log('is restart...')
            this.isTagCloseable = false // 用于重新提交时，点击弹窗前禁止 tag 的可删除功能（此时还无弹窗数据）

            await this.initRestartProcess()
        } else {
            // ^ 非重新提交（正常发起）
            // await this.getSealList()        // 获取印章列表
            await this.getProcessFormList()
            // this.getCurForm()
        }
    },
    methods: {
        // API
        // ------------------------------------------------------------------
        // 获取当前单位印章列表
        apiGetSealList(data) {
            return this.$api('pageListSealInfo').post('postNormal', data)
        },     
        // 获取可发起的流程列表
        apiGetProcessFormList(data) {
            return this.$api('urlGetProcessFormList').get('getPath', data)
        },
        apiStartProcess(data) {
            return this.$api('urlStartProcess').post('postNormal', data)
        },

        // 重新发起
        apiInitRestartProcess(data) {
            return this.$api('urlInitRestartProcess').get('getPath', data)
        },
        // 重新提交
        apiRestartProcess(data) {
            return this.$api('urlRestartProcess').post('postNormal', data)
        },

        // 获取计算公式结果
        apiGetExpResult(data) {
            return this.$api('urlGetExpResult').post('postNormal', data)
        },

        // 上传文件
        apiUploadFile(data) {
            return this.$api('urlUploadFile').post('postNormal', data)
        },
        // 上传图片
        apiUploadImage(data) {
            return this.$api('urlUploadImage').post('postNormal', data)
        },
        // 待签章附件上传
        apiUploadFileForSign(data) {
            return this.$api('urlUploadFileForSign').post('postNormal', data)
        },

        // 获取关联审批单列表
        apiGetProcesslinkList(data) {
            return this.$api('urlGetProcesslinkList').post('postNormal', data)
        },
        apiUpdateProcesslinkedList(data) {
            return this.$api('urlUpdateProcesslinkedList').post('postNormal', data)
        },
        
        // 获取当前流程实例的审批人和抄送人
        apiGetProcessAuditorAndCC(data) {
            return this.$api('urlGetProcessAuditorAndCC').post('postNormal', data)
        },
        // ------------------------------------------------------------------
        // toGetProcessAuditorAndCC() {
        //     // ? 需要限止顺序吗
        //     setTimeout(() => {
        //         this.getProcessAuditorAndCC()
        //     }, 1000)
        // },
        // 获取当前实例流程的审批人和抄送人
        async getProcessAuditorAndCC() {

            // 需要实时获取审批人和抄送人的组件只有：
            // - 发起人（当前用户）
            // - 数字文本、金额、计算公式
            // - 单选框、部门
            // console.log(this.$refs.FM.getValues())
            let values = this.$refs.FM.getValues()


            for (let [key, val] of Object.entries(values)) {
                // 对文件、图片等组件进行值替换
                if (key.indexOf('upload') > -1) {
                    // console.log('file or img >>> ', key)
                    this.processFormList.forEach(item => {
                        if (key == item.id) {
                            // 接口限止，需要值类型为 string
                            values[key] = JSON.stringify(item.fileListReal)
                        }
                    })
                }

                // 部门的数据 val 需要处理一下
                // 将 `727535648973520896&两级部门` 改为 `727535648973520896`
                if (key.indexOf('department') > -1) {
                    // console.log('department...')
                    // console.log(key)
                    // console.log(typeof val)
                    // console.log(val.split(','))

                    let _list = val.split(',')
                    if (_list[0] == '') _list = []

                    values[key] = JSON.stringify(_list)
                }
            }

            // 将不是字符串类型的值转为字符串，供后台解析
            for (let [key, val] of Object.entries(values)) {
                if ((typeof val) != 'string') {
                    values[key] = JSON.stringify(val)
                }
            }

            this.$SU.log(values)

            // -_|| 神奇的不响应
            // ---------------------------------
            // 提交时，当包含 `计算公式`组件时才调 `getCurForm` 接口
            let _exec = false
            for (let key in values) {
                if (key.indexOf('formula') > -1) {
                    _exec = true
                }
            }

            if (_exec) {
                let _resMap = await this.getCurForm()
                // console.log(_resMap)
    
                for (let key in values) {
                    for (let yek in _resMap) {
                        if (key === yek) {
                            values[key] = _resMap[yek]
                        }
                    }
                }
                // console.log('exec...')
                this.$SU.log(values)
            }

                        
            let _data = {
                formValueMap: values,             
                processId: this.processId
            }

            let res = await this.apiGetProcessAuditorAndCC(_data)
            if (!res) return

            // console.log(res.data.data)
            // console.log(this.processInfoList)
            
            this.processInfoList = this.$SU.clone(res.data.data)            
        },
        // 获取当前单位印章列表
        async getSealList() {
            let _data = {
                currentPage: 1,
                pageSize: 100,
                enterpriseOrPersonalId: this.userInfo.enterpriseId
            }

            let res = await this.apiGetSealList(_data)
            if (!res) return

            // console.log(res.data.data.records)
            this.sealList = res.data.data.records
        },
        // 获取流程表单数据
        async getProcessFormList() {

            let _data = {
                processId: this.processId
            }

            let res = await this.apiGetProcessFormList(_data)
            if(!res) return;
            // console.log(res.data.data)

            this.isForSeal = res.data.data.applySeal

            this.processFormList = res.data.data.formPropertyRespVOList
            this.processInfoList = res.data.data.wayInfoRespVOList

            this.processFormList.map(item => {
                // 包含计算组件时，设置 `hasFormula` 为 true
                if (item.widgetType == 'formula') this.hasFormula = true

                item.widgetConfig = JSON.parse(item.widgetConfig)

                // 图片、文件
                if (['fileupload', 'imgupload'].includes(item.widgetType)) {
                    // console.log(item.title, item.id, item)
                    item = Object.assign(item, { 
                        fileList: [],       // 用来绑定上传文件数据
                        fileListReal: []    // 用来存储实际提交给后台的数据
                    })
                }

                // 部门
                if (item.widgetType == 'department') {
                    item = Object.assign(item, {
                        selectedDepartmentList: [],
                        selectedDepartmentListReal: []
                    })
                }

                // 联系人
                if (item.widgetType == 'contacts') {
                    item = Object.assign(item, {
                        selectedUserList: [],
                        selectedUserListReal: [],
                    })
                }

                // 数字文本、金额、计算公式
                if (['numberinput', 'money', 'formula'].includes(item.widgetType)) {
                    // 数字文本和金额时，初始化 val 为 0
                    item = Object.assign(item, { val: 0 })
                } else if (['input', 'textarea'].includes(item.widgetType)) {
                    // 文本
                    item = Object.assign(item, { val: item.widgetConfig.options.defaultValue })

                } else {
                    item = Object.assign(item, { val: null })
                }

                // 日期区间，开始时间和结束时间需做特殊处理
                if (item.widgetType == 'datetimerange') {
                    item = Object.assign(item, {valStart: null, valEnd: null})
                }

                // 仅获取设计允许的签章
                if (item.widgetType == 'seal') {
                    let _sealList = []
                    item.widgetConfig.options.sealList.map(_code => {
                        this.sealList.map(_item => {
                            if (_item.pictureCode == _code) {
                                _sealList.push(_item)                                
                            }
                        })
                    })

                    _sealList.map(_item => {
                        // 组装印章结构 this.sealActions
                        this.sealActions.push({
                            name: _item.pictureName,
                            code: _item.pictureCode
                        })
                    })

                    item.widgetConfig.options.sealList = _sealList
                }
            })
        },

        // 重新发起的表单数据初始化
        async initRestartProcess() {
            let _data = {
                modelId: this.processId,
                processInstanceId: this.processInstanceId
            }

            let res = await this.apiInitRestartProcess(_data)
            if(!res) return;
            // console.log(res.data.data)

            this.isForSeal = res.data.data.applySeal

            this.processFormList = res.data.data.formPropertyRespVOList
            this.processInfoList = res.data.data.wayInfoRespVOList
            
            this.processFormList.map((item, idx) => {
                // 包含计算组件时，设置 `hasFormula` 为 true
                if (item.widgetType == 'formula') this.hasFormula = true

                item.widgetConfig = JSON.parse(item.widgetConfig)

                // 单选框
                if (item.widgetType == 'radio') {
                    // item.widgetConfig.options.defaultValue = JSON.parse(item.restartValue)
                    item.widgetConfig.options.defaultValue = item.restartValue
                }
                // 多选框
                if (item.widgetType == 'checkbox') {
                    item.widgetConfig.options.defaultValue = JSON.parse(item.restartValue)
                }
                // 电子签章
                if (item.widgetType == 'seal') {
                    this.sealSelected = {
                        name: item.restartValue.split('&')[1],
                        code: item.restartValue.split('&')[0]
                    }


                    let _sealList = []
                    item.widgetConfig.options.sealList.map(_code => {
                        this.sealList.map(_item => {
                            if (_item.pictureCode == _code) {
                                _sealList.push(_item)                                
                            }
                        })
                    })

                    _sealList.map(_item => {
                        // 组装印章结构 this.sealActions
                        this.sealActions.push({
                            name: _item.pictureName,
                            code: _item.pictureCode
                        })
                    })                                     
                }

                // 日期
                // if ( item.widgetType == 'datetime' ) {
                //     this.selectedDate = item.restartValue
                // }
                // 日期区间
                if (item.widgetType == 'datetimerange') {
                    item.valStart = item.restartValue.split(' -- ')[0]
                    item.valEnd = item.restartValue.split(' -- ')[1]

                    if (item.valStart == 'null') item.valStart = ''
                    if (item.valEnd == 'null') item.valEnd = ''
                }
                // 地点
                if (item.widgetType == 'address') {
                    let _list = item.restartValue.split('&')
                    // console.log(_list)
                    if (_list[0] == 'NaN') _list[0] = '.'
                    this.selectedAddress = [{ name: _list[0] }, { name: '' }, { name: '' }]
                    this.addressDetail = _list[1]                    
                }

                // FIXME 部门、联系人 -- 弹窗选项同步
                // 部门
                if (item.widgetType == 'department') { 
                    // console.log(item.restartValue)
                    // 仅是为了数据处理
                    item.restartValue = item.restartValue.substring(2)
                    item.restartValue = item.restartValue.split('\'')[0]
                    
                    let list = item.restartValue.split(',')
                    let _list = []

                    list.map(_item => {
                        if (_item.split('&')[1]) _list.push(_item.split('&')[1])
                    })

                    this.processFormList[idx].selectedDepartmentList = _list
                    this.processFormList[idx].selectedDepartmentListReal = list
                }

                // 联系人
                if (item.widgetType == 'contacts') {        
                    let list = item.restartValue.split(',')
                    let _list = []

                    list.map(_item => {
                        if (_item.split('&')[1]) _list.push(_item.split('&')[1])
                    })

                    this.processFormList[idx].selectedUserList = _list
                    this.processFormList[idx].selectedUserListReal = list
                }

                // 关联审批单
                if (item.widgetType == 'processlink') {
                    let list = item.restartValue.split(',')
                    if (list[0] == '') list = []
                    
                    this.processlinkedList = list
                    this.updateProcesslinkedList(this.processId, item.id, this.processlinkedList)
                }

                // 文件、图片
                // if (item.widgetType == 'fileupload') {
                //     this.fileList = JSON.parse(item.restartValue)
                // }
                // if (item.widgetType == 'imgupload') {
                //     this.imageList = JSON.parse(item.restartValue)
                // }
                if (item.widgetType.indexOf('upload') > -1) {
                    // console.log(item.widgetType)
                    // this.fileList = JSON.parse(item.restartValue)
                    // 初始化这个字段，用来存储重新提交的数据
                    item = Object.assign(item, { fileListReal: [] })
                }

                if (item.restartValue == 'null') item.restartValue = ''

                item = Object.assign(item, { val: item.restartValue })  // 初始化条目值
                // item.widgetConfig = JSON.parse(item.widgetConfig)
            })

            // console.log(this.processFormList)

            // 实时更新审批人和抄送人信息
            // 只针对可以作为条件的项：数字文本、金额、计算公式、部门、单选框
            setTimeout(this.getProcessAuditorAndCC, 1000)
        },
        
        // 提交发起
        async onSubmit(values) {
            // console.log("submit >>> ", values);
            // this.$SU.log(values)

            // -_|| 神奇的不响应
            // ---------------------------------
            // 提交时，当包含 `计算公式`组件时才调 `getCurForm` 接口
            let _exec = false
            for (let key in values) {
                if (key.indexOf('formula') > -1) {
                    _exec = true
                }
            }

            if (_exec) {
                let _resMap = await this.getCurForm()
                // console.log(_resMap)
    
                for (let key in values) {
                    for (let yek in _resMap) {
                        if (key === yek) {
                            values[key] = _resMap[yek]
                        }
                    }
                }
                console.log('exec...')
                this.$SU.log(values)
            }


            // 校验一下
            let isVerifySuccess = true // 默认校验通过
            // console.log(this.processFormList)
            for (let [key, val] of Object.entries(values)) {
                // console.log(key, val)

                this.processFormList.forEach(item => {
                    if ((key.indexOf('numberinput') < 0 && key.indexOf('money') < 0 && key.indexOf('formula') < 0) &&
                        (key == item.id && item.request && ((!val || val.length == 0)))) {
                        // 排除 numberinput money formula ，上述有默认值 0
                        // 选项必选时（不能为空或 []）
                        // console.log('not nul...')
                        // console.log('>>>>>>',  key)
                        this.$message.warning('必填项不能为空！')
                        isVerifySuccess = false
                    }
                })
            }
            if (!isVerifySuccess) return

            for (let [key, val] of Object.entries(values)) {
                // 对文件、图片等组件进行值替换
                if (key.indexOf('upload') > -1) {
                    // console.log('file or img >>> ', key)
                    this.processFormList.forEach(item => {
                        if (key == item.id) {
                            // 接口限止，需要值类型为 string
                            values[key] = JSON.stringify(item.fileListReal)
                        }
                    })
                }

                if (key.indexOf('department') > -1) {
                    // console.log('department >>> ', key, val)
                    values[key] = `['${val}']`
                }
            }

            // 将不是字符串类型的值转为字符串，供后台解析
            for (let [key, val] of Object.entries(values)) {
                if ((typeof val) != 'string') {
                    values[key] = JSON.stringify(val)
                }
            }

            this.$SU.log(values)


            // ---------------------------------
            
            if(this.isRestart) {
                // ^ 重新提交
                // console.log("is restart ...")
                let _data = {
                    formValueMap: values,
                    preInstanceId: this.processInstanceId,
                    processId: this.processId,
                    selfPickList: null
                }

                this.$SU.log(_data)
                let res = await this.apiRestartProcess(_data)
                if(!res) return;

                // console.log(res)
                this.processlinkedList = []
                this.updateProcesslinkedList(this.processId, this.currentWidgetId, [])

                this.$SU.notify('success', '重新提交成功')
                this.$router.push('/h5wf/approve-submitted')

            } else {
                // ^ 提交
                let _data = {
                    formValueMap: values,
                    processId: this.processId,
                    selfPickList: null
                }

                // FIXME 
                let res = await this.apiStartProcess(_data)
                if(!res) return;
    
                // console.log(res)
                this.processlinkedList = []
                this.updateProcesslinkedList(this.processId, this.currentWidgetId, [])

                this.$SU.notify('success', '提交成功')
                this.$router.push('/h5wf/approve-submitted')
            }
        },

        onClick(idx) {
            this.currentIdx = idx
            this.currentWidgetId = this.processFormList[idx].id
            console.log(this.currentIdx, this.currentWidgetId)
        },
        // onFocus() {
        //     // console.log('focus...')
        //     setTimeout(() => {
        //         if (['money', 'numberinput'].includes(this.processFormList[this.currentIdx].widgetType) &&
        //             this.processFormList[this.currentIdx].val == 0) {
        //             // ^ 优化金额输入操作
        //             this.processFormList[this.currentIdx].val = ''
        //             this.processFormList = this.$SU.clone(this.processFormList)
        //         }
        //     }, 100)
        // },
        onInput(val) {
            if(['money'].includes(this.processFormList[this.currentIdx].widgetType) &&
                val.indexOf(".") < 0 && val != ''){
                // ^ 以上已经过滤，此处控制的是如果没有小数点，首位不能为类似于 01、02的金额
                val= parseFloat(val)
            } 

            this.processFormList[this.currentIdx].val = val
            this.processFormList = this.$SU.clone(this.processFormList)
        },
        async afterRead(file, detail) {
            // console.log('after read file...')
            // console.log(file)
            // console.log(file.file)

            // 更新数组，响应
            this.processFormList[this.currentIdx].fileList[detail.index].file = file.file
            this.$set(this.processFormList, this.currentIdx, this.processFormList[this.currentIdx])

            // console.log(this.processFormList[this.currentIdx].fileList)
            
            let _formdata = new FormData
            _formdata.append('file', file.file)
            _formdata.append('modelId', this.processId)

            let _data = _formdata
            let res = null

            // 开始上传
            if (this.isForSeal) {
                // ^ 印章附件
                res = await this.apiUploadFileForSign(_data)

            } else {
                // ^ 普通附件
                if (this.processFormList[this.currentIdx].widgetType == 'fileupload') {
                    // ^^ 文件
                    res = await this.apiUploadFile(_data)
    
                } else {
                    // ^^ 图片
                    res = await this.apiUploadImage(_data)
                }
            }

            if (!res) return
            // console.log(res.data.data)

            this.processFormList[this.currentIdx].fileListReal.push(res.data.data)
            // console.log(this.processFormList[this.currentIdx].fileListReal)
        },
        beforeDelete() {
            // console.log('beforeDelete...')
            // console.log(this.currentIdx)
            return true
        },
        deleteFile(file, detail) {
            // console.log('delete file...')
            // 更新数组，响应
            this.$set(this.processFormList, this.currentIdx, this.processFormList[this.currentIdx])
            this.processFormList[this.currentIdx].fileListReal.splice(detail.index, 1)
        },

        // 日期
        // date - yyyy:MM:dd
        // datetime- yyyy:MM:dd HH:mm 
        showDateDialog(flag, type, curWIdx) {
            // 模拟设置禁用状态
            if (this.processFormList[curWIdx].widgetAuthType == '02') return

            // 区分日期格式
            if (flag == 'yyyy-MM-dd') {
                this.dateformat = 'date'
            } else {
                this.dateformat = 'datetime'
            }

            // 区分点击日期
            if (type == '0') {
                // ^ 日期
                this.dateType = 'datetime'
            } else if (type == '1') {
                // ^ 开始日期
                this.dateType = 'datetimeStart'
            } else if (type == '2') {
                // ^ 结束日期
                this.dateType = 'datetimeEnd'
            }

            this.dateDialogVisible = true
        },

        // FIXME 优化日期组件同类值共享问题
        selectCurDate(value) {
            if (this.dateType == 'datetime') {
                // ^ 日期
                this.processFormList[this.currentIdx].val =
                    this.dateformat == 'date' ? 
                    this.$SU.dateFormat('yyyy-MM-dd', value) : 
                    this.$SU.dateFormat('yyyy-MM-dd HH:mm', value)

            } else if (this.dateType == 'datetimeStart') {
                // ^ 开始日期
                this.processFormList[this.currentIdx].valStart =
                    this.dateformat == 'date' ? 
                    this.$SU.dateFormat('yyyy-MM-dd', value) : 
                    this.$SU.dateFormat('yyyy-MM-dd HH:mm', value)       
                    
                if (this.processFormList[this.currentIdx].valEnd &&
                    this.processFormList[this.currentIdx].valStart > this.processFormList[this.currentIdx].valEnd) {
                    // ^ 结束日期不为空时，开始日期不能大于结束日期
                    this.$SU.notify('warning', '开始日期不能大于结束日期')
                    this.processFormList[this.currentIdx].valStart = null
                }

            } else if (this.dateType == 'datetimeEnd') {
                // ^ 结束日期
                this.processFormList[this.currentIdx].valEnd =
                    this.dateformat == 'date' ? 
                    this.$SU.dateFormat('yyyy-MM-dd', value) : 
                    this.$SU.dateFormat('yyyy-MM-dd HH:mm', value)

                if (this.processFormList[this.currentIdx].valStart &&
                    this.processFormList[this.currentIdx].valStart > this.processFormList[this.currentIdx].valEnd) {
                    // ^ 结束日期不为空时，开始日期不能大于结束日期
                    this.$SU.notify('warning', '开始日期不能大于结束日期')
                    this.processFormList[this.currentIdx].valEnd = null
                }
            }

            this.dateDialogVisible = false
        },

        showAddressDialog(curWIdx) {
            // 模拟禁用操作
            if (this.processFormList[curWIdx].widgetAuthType == '02') return

            this.addressDialogVisible = true
        },
        selectCurAddress(value) {
            // console.log(value)
            this.selectedAddress = value

            this.addressDialogVisible = false
        },

                        
        // FIXME 获取计算结果
        async getExpResult(map, list) {
            let _data = {
                inputValueMap: map,
                list: list
            }
            
            let res = await this.apiGetExpResult(_data)
            if (!res) return;

            return res
        },
        toGetCurForm() {
            // console.log('blur...')
            // console.log(this.processFormList[this.currentIdx].val)
            // if (['money', 'numberinput'].includes(this.processFormList[this.currentIdx].widgetType) &&
            //     this.processFormList[this.currentIdx].val == '') {
            //     // ^ 失焦时，若为 '' ，恢复为 0 ，避免包含计算公式时出错
            //     this.processFormList[this.currentIdx].val = 0
            //     this.processFormList = this.$SU.clone(this.processFormList)
            // }

            // 增加一个延时器，避免 `数字输入框` `金额`失焦时造成 部件 id 获取不到
            if (this.hasFormula) {
                // ^ 包含计算公式组件的时候，才执行
                setTimeout(this.getCurForm, 1000)
            }

            // 实时更新审批人和抄送人信息
            // 只针对可以作为条件的项：数字文本、金额、计算公式、部门、单选框
            setTimeout(this.getProcessAuditorAndCC, 800)
        },
        async getCurForm() {            
            // console.log(this.$refs.FM.$el)

            let _inputValueMap = {}
            let _list = []

            Array.prototype.forEach.call(this.$refs.FM.$el, (item, idx) => {
                let _len = this.$refs.FM.$el.length
                
                if (idx < _len - 1) {
                    // console.log(item.name, item.value)
                    
                    if (item.name.indexOf('formula') > -1) {
                        // ^ formula
                        _list.push({
                            expression: item.id,
                            widgetId: item.name
                        })

                    } else if (item.name.indexOf('numberinput') > -1 || item.name.indexOf('money') > -1) {
                        // ^ numberinput & money
                        _inputValueMap = Object.assign(_inputValueMap, {
                            [item.name]: item.value
                        })
                    }
                }
            })

            // console.log(_inputValueMap)
            // console.log(_list)

            let res = await this.getExpResult(_inputValueMap, _list)
            if (!res) return

            let _resMap = res.data.data.resultMap
            // console.log(_resMap);            

            Array.prototype.forEach.call(this.$refs.FM.$el, (item, idx) => {     
                if (item.name.indexOf('formula') > -1) {          
                    for (let key in _resMap) {
                        if (key == item.name) {
                            item.value = _resMap[key]
                        }
                    }
                }
            })

            return _resMap
        },
        // ------------------------------------------------------------------

        selectTree(type, val, curWIdx) {
            // 模拟设置组件只读状态
            if (this.processFormList[curWIdx].widgetAuthType == '02') return

            this.isTagCloseable = true  // 用于重新提交时，点击弹窗后恢复 tag 的可删除功能

            // console.log(type, val, curWIdx)

            if (val == 'multi') {
                this.isMultiple = true

            } else if (val == 'one') {
                this.isMultiple = false
            }

            if (type == 'org') {
                this.treeType = 'org'

            } else if (type == 'user') {
                this.treeType = 'user'
            }
            
            this.treeDialogVisible = true

            // 重新发起时，实时更新弹窗中的激活项
            if (this.isRestart) {
                let activeWhat = '',
                    selectWhat = ''

                if (type == 'org') {                    
                    activeWhat = val == 'multi' ? 'activeIds' : 'activeIdsSingle'
                    selectWhat = 'selectedDepartmentListReal'

                } else if (type == 'user') {
                    activeWhat = val == 'multi' ? 'activeIdsUser' : 'activeIdsUserSingle'
                    selectWhat = 'selectedUserListReal'
                }

                this.$nextTick(() => {
                    if (this.isMultiple) {
                        // ^ 
                        this.$refs.tree[activeWhat] = this.processFormList[curWIdx][selectWhat]

                    } else {
                        // ^ tree-select 组件的选择方式是根据 active-id 的形式决定的 - 数组（多选） 字符串（单选）
                         this.$refs.tree[activeWhat] = this.processFormList[curWIdx][selectWhat][0]
                    }
                })
            }

        },
        // 删除的时候要实时传递 type val
        // `type` - org user
        // `val`  - one multi
        // `curWIdx` - 当前组件的索引
        delCurDepartment(type, val, idx, curWIdx) {      
            // console.log(val)  
            // console.log('当前组件索引', curWIdx, this.processFormList[curWIdx].id)

            this.processFormList[curWIdx].selectedDepartmentList.splice(idx, 1)
            this.processFormList[curWIdx].selectedDepartmentListReal.splice(idx, 1)
            this.$refs.tree.deleteCur(type, val, idx)
            this.processFormList = this.$SU.clone(this.processFormList) // 不然 van-tag 不会 DOM 更新


            // 部门变更后即时更新审批人和抄送人信息
            this.toGetCurForm()
        },
        delCurUser(type, val, idx, curWIdx) {
            // console.log(val)
            // console.log('当前组件索引', curWIdx, this.processFormList[curWIdx].id)

            this.processFormList[curWIdx].selectedUserList.splice(idx, 1)
            this.processFormList[curWIdx].selectedUserListReal.splice(idx, 1)
            this.$refs.tree.deleteCur(type, val, idx)
            this.processFormList = this.$SU.clone(this.processFormList) // 不然 van-tag 不会 DOM 更新
        },
        treeDialogConfirm(val) {
            // `val` is a list
            // console.log(val)
            // console.log(this.isMultiple)
            
            if (this.isMultiple) {
                // 多选
                let _list = []
                val.map(item => {
                    _list.push(item.split('&')[1])
                })

                if (this.treeType == 'org') {                
                    this.processFormList[this.currentIdx].selectedDepartmentList = [..._list]
                    this.processFormList[this.currentIdx].selectedDepartmentListReal = [...val]

                } else if (this.treeType == 'user') {                
                    this.processFormList[this.currentIdx].selectedUserList = [..._list]
                    this.processFormList[this.currentIdx].selectedUserListReal = [...val]
                }

            } else {
                // 单选
                let _list = []

                if (val) {
                    _list.push(val.split('&')[1])
                }

                if (this.treeType == 'org') {
                    this.processFormList[this.currentIdx].selectedDepartmentList = [..._list]
                    this.processFormList[this.currentIdx].selectedDepartmentListReal = [val]

                } else if (this.treeType == 'user') {
                    this.processFormList[this.currentIdx].selectedUserList = [..._list]
                    this.processFormList[this.currentIdx].selectedUserListReal = [val]
                }
            }
            
            this.treeDialogVisible = false

            // 部门变更后即时更新审批人和抄送人信息
            this.toGetCurForm()
        },

        // ------------------------------------------------------------------
        // 电子签章
        onSelectSeal(item) {
            this.sealDialogVisible = false;
            // console.log(item)
            this.sealSelected = item
        },

        // 显示审批单列表弹窗
        async switchTab() {
            this.processlinkData = await this.getProcesslinkSearchData(this.searchVal)
        },
        async showProcesslinkDialog(curWIdx) {
            // 模拟禁用状态
            if (this.processFormList[curWIdx].widgetAuthType == '02') return

            this.processlinkDialogVisible = true
            
            await this.getProcesslinkData()
            
        },
        processlinkDialogConfirm() {
            this.processlinkDialogVisible = false
        },
        delCurProcesslink(idx) {

            this.processlinkedList.splice(idx, 1)
            this.updateProcesslinkedList(this.processId, this.currentWidgetId, this.processlinkedList)
        },

        // 获取全部关联数据
        async getProcesslinkData() {        

            let _data = {
                keyword: "",
                modelId: this.processId,
                pageNum: 1,
                pageSize: 2000,
                pickModelScope: "",
                widgetId: this.currentWidgetId
            }

            let res = await this.apiGetProcesslinkList(_data)
            if (!res) return;
            
            this.processlinkData = res.data.data
            return res.data.data
        },
        // 获取搜索关联数据
        async getProcesslinkSearchData(searchVal) {
            let _data = {
                keyword: searchVal.trim(),
                modelId: this.processId,
                pageNum: 1,
                pageSize: 2000,
                pickModelScope: "",
                widgetId: this.currentWidgetId
            }

            let res = await this.apiGetProcesslinkList(_data)
            if (!res) return

            this.processlinkData = res.data.data
            return res.data.data
        },
        // 更新缓存列表
        async updateProcesslinkedList(processId, widgetId, processlinkedList) {
            let _data = {
                modelId: processId,
                widgetId: widgetId,
                checkedInstanceIdList: processlinkedList
            }

            let res = await this.apiUpdateProcesslinkedList(_data)
            if (!res) return

            // console.log('缓存表成功更新了...')
        },
        checkok(ele) {
            this.processlinkedList.push(ele)
            this.updateProcesslinkedList(this.processId, this.currentWidgetId, this.processlinkedList)
        },
        checkno(ele) {
            this.processlinkedList.map((item, idx) => {
                if (item === ele) {
                    this.processlinkedList.splice(idx, 1)
                }
            }) 
            this.updateProcesslinkedList(this.processId, this.currentWidgetId, this.processlinkedList)                       
        },

        // ------------------------------------------------------------------
        // TODO 审批人自选
        chooseApprover(idx) {
            // console.log(idx)
            // console.log(this.processInfoList[idx].auditorList)
            this.processInfoList[idx].auditorList = ['a', 'b', 'c']
        },       
    }
};
</script>

<style lang="scss">
.vant-notify-extension {
    height: 46px;
    line-height: 30px;
}

.container-form {
    background: #F1F2F6;
    min-height: 100%;

    .van-field__control {
        // background-color: #fee;
    }

    .van-field--min-height .van-field__control {
        min-height: 74px;
    }    

    .van-radio {
        margin: 10px 0;
    }

    .van-cell {
        margin: 12px 0;
    }

    .van-steps {
        // .van-step {
        //     display: flex;
        // }

        .van-step__title {
            display: flex;
            justify-content: space-between;

            color: #333;
            font-size: 16px;
        }

        .or-or-and {
            color: #666;
            margin: 0 5px;
        }
    } 

    .placeholder-color {
        color: #999;
    }

    .van-uploader__preview {
        margin: 6px;
        .van-uploader__file,
        .van-uploader__preview-image {
            width: 70px;
            height: 70px;
        }
    }

    .van-uploader__upload {
        margin: 6px;
        width: 70px;
        height: 70px;
    }

    .van-icon-warning-o::before {
        // \F0D4
        content: '\F0CB';
    }

    // 60% 100px
    .seal-outter {
        position: relative;
        margin-left: 70%;        
        height: 70px; 
        width: 70px; 
        border: 1px dashed #aaf; 
        line-height: 70px; 
        text-align: center; 
        color: #aaa; 

        // 80px
        .seal-inner {
            position: absolute; 
            top: 10px; 
            left: 10px;            
            height: 50px; 
            width: 50px; 
            border: 1px solid #ddd; 
            border-radius: 50%; 
        }
    }

    // 60% 100px
    .signature-outter {
        position: relative;  
        margin-left: 70%;        
        height: 40px; 
        width: 70px; 
        border: 1px dashed #aaf; 
        text-align: center; 
        line-height: 40px; 
        color: #aaa; 
    }

    .container-processlink {
        position: relative;

        .operations {
            position: fixed;
            top: 133px;
            z-index: 1;
            background: #f1f2f6;
            width: 100%;
            height: 50px;

            .btn {
                margin: 10px;
            }

            .btn-right {
                float: right;
            }    
        }

        .contents {
            padding-top: 50px;
        }
    }
}
</style>