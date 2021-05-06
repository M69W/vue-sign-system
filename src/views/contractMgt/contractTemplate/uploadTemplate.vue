<template>
    <div class="upload-template">
        <div class="inner">
            <div class="header-title">
                <el-breadcrumb separator="/">
                    <el-breadcrumb-item to="/contractMgt/contractTemplate">{{isFile? '文件模板':'合同模板'}}</el-breadcrumb-item>
                    <el-breadcrumb-item>{{isUse?'使用模板':id?'编辑模板':'添加模板'}}</el-breadcrumb-item>
                    <el-breadcrumb-item v-if="!isUse&&!id">全局设置</el-breadcrumb-item>
                </el-breadcrumb>
            </div>
            <div class="content">
                <!-- 模板主题 -->
                <div class="theme-container">
                    <span>{{isUse?`${isFile ? '签发' :'合同'}主题`:'模板主题'}}</span>
                    <el-input
                        v-model="compactTheme"
                        class="theme"
                        :placeholder="`请输入${isFile ? '签发' :'合同'}主题`"
                        v-if="isUse"
                    ></el-input>
                    <el-input v-else v-model="theme" class="theme" placeholder="请输入模板主题"></el-input>
                    <template v-if="!isUse && !isFile">
                        <el-checkbox v-model="customContractCode">自定义合同编号</el-checkbox>
                        <el-input
                            v-model="serialNumberPrefix"
                            placeholder="合同编号前缀"
                            v-show="customContractCode"
                            class="prefix"
                        ></el-input>
                        <el-select
                            v-model="serialNumberDate"
                            placeholder="时间"
                            v-show="customContractCode"
                            class="time-select"
                        >
                            <el-option
                                v-for="(item, index) in timeList"
                                :key="index"
                                :value="item.value"
                                :label="item.label"
                            ></el-option>
                        </el-select>
                        <el-input
                            v-model="serialNumberNo"
                            placeholder="流水号，如0001"
                            v-show="customContractCode"
                            class="serial-no"
                        ></el-input>
                    </template>
                </div>

                <div class="step_item">
                    <div class="title">
                        {{isUse?`${isFile ? '签发' :'合同'}`:'模板'}}文件
                        <span
                            class="desc"
                        >温馨提示：仅支持.doc、docx、pdf、xls、xlsx、ofd、html格式、图片格式，文件&lt;20MB</span>
                    </div>

                    <!-- TODO 添加合同 -->
                    <div class="file_list">
                        <div class="file_box" v-for="(item, index) in fileList" :key="index">
                            <div class="img_box">
                                <div class="img_box_inner">
                                    <!-- <img :src="`${baseUrl}/document/scan/page/${item.fileCode}/1`" alt /> -->
                                    <el-image
                                        :src="item.fileCode &&
                                    `${baseUrl}/document/scan/page/${item.fileCode}/1`
                                "
                                    >
                                        <div slot="placeholder" class="img-placeholder">
                                            <img src="../../../assets/image/default-bg.svg" alt />
                                        </div>
                                        <div slot="error" class="img-error">
                                            <img src="../../../assets/image/default-bg.svg" alt />
                                            <!-- <p class="img-loading-error">加载失败...</p> -->
                                        </div>
                                    </el-image>
                                </div>
                                <div class="mask">
                                    <i
                                        class="iconfont icon-shanchuheise"
                                        title="删除"
                                        @click="delFile(item, index, '01')"
                                        :class="{isUse}"
                                    ></i>
                                    <i
                                        class="iconfont icon-chakanheise"
                                        title="查看详情"
                                        @click="viewDetail(item)"
                                    ></i>
                                    <i
                                        class="iconfont icon-zhongxinshangchuanheise"
                                        title="重新上传"
                                        @click="reUpload(item, index)"
                                        :class="{isUse}"
                                    ></i>
                                </div>
                                <el-progress
                                    :percentage="uploadProgress"
                                    class="progress"
                                    :show-text="false"
                                    v-show="uploadIndex.includes(index)"
                                ></el-progress>
                            </div>
                            <p :title="item.fileName">
                                <span class="desc">{{ item.fileName }}</span>
                                <span class="page">({{ item.pageTotal }}页)</span>
                            </p>
                        </div>
                        <div class="upload-box" v-if="!isUse" @click="addFile">
                            <i class="iconfont icon-jiahao" ref="upload"></i>
                            <p class="upload_desc">添加{{isFile?'文件':'合同'}}</p>
                        </div>
                        <input type="file" ref="uploadFile" style="display:none" @change="changeFile" multiple
                            accept=".doc, .docx, .pdf, .xls, .xlsx, image/*, .ofd, .html">
                    </div>

                    <!-- TODO 添加附件 -->
                    <div class="accessory_container" v-if="!isFile">
                        <div class="uploadAss_box">
                            <div class="uploadAss_main" v-if="isUse">
                                <i class="iconfont icon-tianjiafujianhuise">
                                    <span class="add">附件</span>
                                </i>
                            </div>
                            <div class="uploadAss_main" @click="addAccessory" v-else>
                                <i class="iconfont icon-tianjiafujianhuise">
                                    <span class="add">添加附件</span>
                                </i>
                            </div>
                            <span class="uploadAss_desc">（仅供参与方查阅，不用于签署）</span>
                        </div>
                        <div class="accessory_list">
                            <div
                                class="accessory_item"
                                v-for="(item, index) in accessoryList"
                                :key="index"
                                :title="item.fileName"
                                @click="viewDetail(item)"
                            >
                                <p>{{ item.fileName }}</p>
                                <i
                                    class="iconfont icon-shanchu"
                                    @click.stop="delFile(item, index, '02')"
                                    v-if="!isUse"
                                ></i>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- 添加角色信息 -->
                <div class="step_item">
                    <div class="title">参与角色</div>
                    <div class="sign-way">
                        <span>签署方式</span>
                        <div class="sign-items">
                            <el-radio
                                v-model="signWay"
                                label="01"
                                :disabled="isUse&&signWay!=='01'"
                            >无序签署：</el-radio>
                            <span class="desc">签署顺序不受限制</span>
                            <br />
                            <el-radio
                                v-model="signWay"
                                label="02"
                                :disabled="isUse&&signWay!=='02'"
                            >顺序签署：</el-radio>
                            <span class="desc">按签署顺序一人签署完再到下一环节签署，即A→B→C→D</span>
                            <br />
                            <template v-if="!isFile">
                                <el-radio
                                    v-model="signWay"
                                    label="03"
                                    :disabled="isUse&&signWay!=='03'"
                                >每人单独签署：</el-radio>
                                <span class="desc">发起方单独发送每个收件人签署，即A→B，A→C，A→D</span>
                            </template>
                        </div>
                    </div>
                    <div class="sign-list">
                        <div class="sign-title">签署人列表</div>
                        <div
                            class="sign-tr"
                            v-for="(item, index) in templateSignatories"
                            :key="index"
                        >
                            <el-input
                                placeholder="请输入角色名称"
                                v-model="item.name"
                                class="name"
                                :disabled="isUse"
                            ></el-input>
                            <div class="fill">
                                <el-checkbox
                                    v-model="item.fillIn"
                                    :true-label="1"
                                    :false-label="0"
                                    :disabled="isUse"
                                >填写</el-checkbox>
                                <el-tooltip
                                    class="item"
                                    effect="dark"
                                    content="请为需要填写合同的角色勾选该项"
                                    placement="top"
                                >
                                    <img src="../../../assets/image/gantanhao.svg" alt />
                                </el-tooltip>
                            </div>
                            <div class="is-sign">
                                <el-checkbox
                                    v-model="item.sign"
                                    :true-label="1"
                                    :false-label="0"
                                    :disabled="isUse"
                                >签署</el-checkbox>
                                <el-tooltip
                                    class="item"
                                    effect="dark"
                                    content="请为需要签署合同的角色勾选该项"
                                    placement="top"
                                >
                                    <img src="../../../assets/image/gantanhao.svg" alt />
                                </el-tooltip>
                            </div>
                            <div class="sign-type">
                                <el-select v-model="item.signType" placeholder="请选择" :disabled="isUse">
                                    <el-option label="个人" value="01"></el-option>
                                    <el-option label="企业" value="02"></el-option>
                                </el-select>
                            </div>
                            <div class="role-set">
                                <el-checkbox
                                    v-model="item.assignation"
                                    :true-label="1"
                                    :false-label="0"
                                    v-if="!isUse"
                                >指定用户</el-checkbox>
                                <span class="role-span" v-else-if="item.assignation===1">指定用户</span>
                                <span class="role-span" v-else></span>
                                <el-input
                                    placeholder="请输入手机号/邮箱"
                                    v-model="item.signContact"
                                    v-show="item.assignation || isUse"
                                    :disabled="!!item.assignation && isUse"
                                    class="phone"
                                    @change.native="checkNameAndEnterprise(item)"
                                ></el-input>
                                <el-input
                                    :placeholder="item.signType === '01' ? '请输入姓名' : '请输入企业完整名称'"
                                    v-model="item.signName"
                                    v-show="item.assignation || isUse"
                                    :disabled="!!item.assignation && isUse"
                                    @change.native="checkNameAndEnterprise(item)"
                                ></el-input>
                            </div>
                            <div
                                class="del-btn from-org"
                                @click="openDialog(item)"
                                v-if="(isUse&&!item.assignation&&item.signType === '01') || 
                                (!isUse&&item.assignation&&item.signType === '01')"
                            >从组织添加</div>
                            <div class="del-btn" @click="delRole(index)" v-if="!isUse">删除</div>
                        </div>
                        <div class="add-btn" @click="addRole" v-if="!isUse">
                            <img src="../../../assets/image/tianjia.svg" alt /> 添加角色
                        </div>
                    </div>
                </div>
                <div class="btn_wrap">
                    <el-button type="info" plain @click="$router.go(-1)">取消</el-button>
                    <el-button type="primary" @click="next">下一步</el-button>
                </div>

                <!-- 查看文件详情 -->
                <el-dialog
                    class="view-detail"
                    width="1000px"
                    :visible.sync="viewDetailVisible"
                    :title="viewItem.fileName"
                    top="10vh"
                >
                    <el-scrollbar>
                        <template v-for="(item, index) in viewItem.pageTotal">
                            <el-image
                                :src="
                            `${baseUrl}/document/scan/page/${
                                viewItem.fileCode
                            }/${index + 1}`
                        "
                                :key="index"
                                lazy
                                scroll-container=".view-detail .el-scrollbar__wrap"
                            >
                                <div slot="placeholder" class="img-placeholder">
                                    <img src="../../../assets/image/default-bg.svg" alt />
                                </div>
                                <div slot="error" class="img-error">
                                    <img src="../../../assets/image/default-bg.svg" alt />
                                    <!-- <p class="img-loading-error">加载失败...</p> -->
                                </div>
                            </el-image>
                            <p
                                class="page-no"
                                :key="-index-1"
                            >{{ index + 1 }}/{{ viewItem.pageTotal }}</p>
                        </template>
                    </el-scrollbar>
                </el-dialog>

                <!-- 从组织中选择签署人弹框 -->
                <el-dialog
                    title="选择签署人"
                    :visible.sync="selectDialogVisible"
                    width="800px"
                    :before-close="handleSelectClose"
                    class="select_dialog"
                >
                    <div class="main_body">
                        <div class="main_container">
                            <div class="tree_wrap">
                                <el-scrollbar>
                                    <el-select v-model="enterpriseId" @change="changeEnterprise" class="enterprise-select">
                                        <el-option :value="item.id" :label="item.chineseName" v-for="item in enterpriseList" :key="item.id"></el-option>
                                    </el-select>
                                    <el-tree
                                        :data="treeData"
                                        :props="defaultProps"
                                        @node-click="handleNodeClick"
                                        node-key="id"
                                        highlight-current
                                        default-expand-all
                                    ></el-tree>
                                </el-scrollbar>
                            </div>
                            <div class="table_wrap">
                                <el-input
                                    v-model="searchForm.userNickName"
                                    placeholder="关键字搜索成员名称/账号"
                                    class="search_input"
                                    @keyup.enter.native="searchSignMan"
                                >
                                    <i
                                        slot="suffix"
                                        class="iconfont icon-chaxun"
                                        @click="searchSignMan"
                                    ></i>
                                </el-input>
                                <!-- 搜索的成员表格 -->
                                <div class="table">
                                    <el-scrollbar>
                                        <el-table
                                            :data="tableData"
                                            style="width: 100%"
                                            :row-class-name="tableRowClassName"
                                            :header-cell-style="headerStyle"
                                            ref="signTable"
                                            @row-click="submitSignMan"
                                        >
                                            <el-table-column
                                                label="成员名称"
                                                prop="userNickName"
                                                show-overflow-tooltip
                                            ></el-table-column>
                                            <el-table-column
                                                label="登录账号"
                                                width="140px"
                                                prop="userName"
                                            ></el-table-column>
                                        </el-table>
                                    </el-scrollbar>
                                </div>
                            </div>
                        </div>
                        <!-- <div class="footer">
                            <el-button
                                @click="
                            handleSelectClose(
                                () => (selectDialogVisible = false)
                            )
                        "
                            >取 消</el-button>
                            <el-button type="primary" @click="submitSignMan">确 定</el-button>
                        </div>-->
                    </div>
                </el-dialog>
            </div>
        </div>
    </div>
</template>

<script>
import { mapState } from 'vuex';
import { setRowClass } from '@/mixins/setTableRowClass';
import {
    sessionStore,
    isLetterOrNumber,
    checkIntegral,
    isPhoneNum,
    isEmail
} from '@/utils';

export default {
    mixins: [setRowClass],
    data() {
        return {
            baseUrl: process.env.NODE_ENV === 'development' ? '/apis' : '/sign',
            fileList: [], // 文件列表
            accessoryList: [], // 附件列表
            reUploadFile: '', // 重新上传的文件
            isReUpload: false, // 是否是重新上传
            fileType: '01', // 01 合同文件  02 附件
            uploadIndex: [], // 当前操作的合同文件索引
            assIndex: [], // 当前操作的附件索引
            uploadProgress: 0, // 上传进度
            viewDetailVisible: false,
            viewItem: {},
            userId: sessionStore.get('userInfo').id,
            uploadHeaders: {
                session_token: sessionStore.get('userInfo').sessionToken
            },
            timeList: [],
            signWay: '01',
            theme: '', // 模板主题
            customContractCode: false, // 是否自定义编号
            serialNumberPrefix: '', // 编号前缀
            serialNumberDate: '', // 编号日期格式
            serialNumberNo: '', // 流水号
            templateSignatories: [], // 角色列表
            id: '', // 模板id
            rootNodeId: '', // 根节点ID，用于查询用户ID
            isUse: false, // 是否是使用模板
            templateInfo: {},
            selectDialogVisible: false,
            searchForm: {
                currentPage: 1,
                pageSize: 2000,
                isForbid: '0',
                userNickName: '',
                contentType: 'json'
            },
            treeData: [],
            defaultProps: {
                children: 'sonNodes',
                label: 'nodeName'
            },
            headerStyle: {
                background: '#C0CCDA',
                color: '#282828'
                // fontWeight: 'bold'
            },
            tableData: [],
            editItem: '',
            compactTheme: '',
            isFile: !!this.$route.query.isFile, // 是否是文件模板
            renew: !!this.$route.query.renew, // 是否是重新发起
            contractId: this.$route.query.contractId, // 重新发起的合同ID
            enterpriseList: [],
            enterpriseId: ''
        };
    },
    computed: {
        ...mapState(['userInfo'])
    },
    async created() {
        this.getTimeList();
        // 获取组织ID，用于查询用户ID
        // this.$api('getNodeTree')
        //     .get('getPath',{ enterpriseId: sessionStore.get('userInfo').enterpriseId })
        //     .then((res) => {
        //         if (!res) return;
        //         this.rootNodeId = res.data.data.rootNode.id;
        //     });
        // 上传地址
        this.uploadUrl = `${this.baseUrl}/contract/upload?userId=${this.userId}`;
        this.id = this.$route.query.id;
        if (this.id && !this.renew) {
            // 如果query带了id，查询合同信息
            this.templateInfo = await this.getTemplateInfo();
        }
        if (this.contractId) {
            // 如果query带了contractId，查询重新发起合同信息
            this.templateInfo = await this.getRestartInfo();
        }
        // 是否是使用模板
        this.isUse = !!this.$route.query.use;
        let sessionTemplateInfo;
        if (this.isUse) {
            // 使用模板
            sessionTemplateInfo = sessionStore.get('contractInfo') || {};
        } else {
            // 从本地取出存储的templateInfo
            sessionTemplateInfo = sessionStore.get('templateInfo') || {};
        }
        Object.assign(this.templateInfo, sessionTemplateInfo);
        if (JSON.stringify(this.templateInfo) !== '{}') {
            this.fileList = this.templateInfo.contractFileList.filter(
                (v) => v.fileType === '01'
            );
            this.accessoryList = this.templateInfo.contractFileList.filter(
                (v) => v.fileType === '02'
            );
            this.templateSignatories = this.templateInfo.templateSignatories;
            this.serialNumberDate = this.templateInfo.serialNumberDate;
            this.serialNumberNo = this.templateInfo.serialNumberNo;
            this.serialNumberPrefix = this.templateInfo.serialNumberPrefix;
            this.signWay = this.templateInfo.signWay;
            this.compactTheme = this.templateInfo.compactTheme || '';
            this.theme = this.templateInfo.theme || '';
            if (this.serialNumberPrefix) {
                this.customContractCode = true;
            }
        }
    },
    methods: {
        // 获取时间列表
        getTimeList() {
            let now = new Date();
            let year = now.getFullYear().toString();
            let month = now.getMonth() + 1;
            month = (month > 9 ? month : '0' + month).toString();
            let day = now.getDate().toString();
            day = (day > 9 ? day : '0' + day).toString();
            this.timeList.push({
                value: 'YYYYMMdd',
                label: '年月日，如' + year + month + day
            });
            this.timeList.push({
                value: 'YYYYMM',
                label: '年月，如' + year + month
            });
            this.timeList.push({ value: 'YYYY', label: '年，如' + year });
        },
        // 获取合同信息
        async getTemplateInfo() {
            const url = this.isFile ? 'fileTemplateDetail' : 'contractTemplateDetail'
            let res = await this.$api(url).post('postPath',
                {},
                {
                    id: this.id
                }
            );
            if (!res) return {};
            res.data.data.contractFileList = res.data.data.templateFiles;
            return res.data.data;
        },
        // 获取重新发起合同信息
        async getRestartInfo() {
            let res = await this.$api('restartContract').post(
                'postQuery',
                {},
                {
                    contractId: this.contractId
                }
            );
            if (!res) return;
            let contractForm = res.data.data
            // let fileCodes = contractForm.contractFileList.map(v=>v.fileCodeTemplate).join(',');
            // let res1 = await this.$api('uploadOldFile').post('postQuery',{},{fileCodes})
            // if(!res1) return
            // console.log(res1);
            // let fileList = res1.data.data;
            // contractForm.signSysTemplateFields.forEach(v=>{
            //     let item = contractForm.contractFileList.find(val => val.fileCodeTemplate === v.fileCode);
            //     item && (item = fileList.find(val=>val.oldFileCode === item.fileCodeTemplate))
            //     item && (v.fileCode = item.newFileCode)
            // })
            contractForm.contractFileList.forEach(v=>{
                // let item = fileList.find(val=>val.oldFileCode === v.fileCodeTemplate)
                // item && (v.fileCode = item.newFileCode)
                v.fileCode = v.fileCodeTemplate
                v.templateFields = contractForm.signSysTemplateFields.filter(val=>val.fileCode===v.fileCode)
            })
            // contractForm.contractFileList.forEach(v => {
            // }); 
            // console.log(contractForm);
            return {
                compactTheme: contractForm.compactTheme,
                signWay: contractForm.signWay,
                templateSignatories: contractForm.signInfos,
                contractFileList: contractForm.contractFileList
            }
        },
        // 添加文件
        addFile() {
            if (this.fileList.length >= 100) {
                return this.$message.error('合同文件数量不能超过100个');
            }
            this.setUploadStatus('01');
        },
        // 添加附件
        addAccessory() {
            if (this.accessoryList.length >= 10) {
                return this.$message.error('附件数量不能超过10个');
            }
            this.setUploadStatus('02');
        },
        // 重新上传
        reUpload(item, index) {
            if (this.isUse) return;
            this.uploadIndex = [index];
            this.setUploadStatus('01', true, item);
        },
        // 设置上传信息和状态
        setUploadStatus(fileType, isReUpload = false, item = null) {
            this.fileType = fileType;
            this.isReUpload = isReUpload;
            this.reUploadFile = item
            this.$refs.uploadFile.click();
        },
        async changeFile(e) {
            console.log(e);
            let files = e.target.files
            if (files.length === 0) return
            if (files.length + this.fileList.length > 100) {
                e.target.value = ''
                return this.$message.warning('上传文件总数不能100个')
            }
            let formData = new FormData()
            let timer = setInterval(() => {
                this.uploadProgress += 10
                if (this.uploadProgress >= 90 && timer) {
                    clearInterval(timer)
                }
            }, 100);
            for (let i = 0; i < files.length; i++) {
                let file = files[i]
                let nameList = file.name.split('.');
                if (file.size > 20 * 1024 * 1024) return this.$message.error('文件大小不能超过20M')
                if (!['pdf','doc','docx','xls','xlsx','jpg','png','jpeg','bmp','webp','ofd','html'].includes(nameList[nameList.length - 1].toLowerCase())) {
                    this.$message.error('文件格式不正确')
                    continue
                }
                formData.append('files', file)
                nameList[nameList.length - 1] = 'pdf';
                let name = nameList.join('.');
                if (this.fileType === '02') {
                    // 选中文件,先推入一项占位
                    this.accessoryList.push({
                        fileName: name,
                        fileType: '02'
                    });
                    this.assIndex.push(this.accessoryList.length - 1);
                }else {
                    if (!this.isReUpload) {
                        // 选中文件,先推入一项占位
                        this.fileList.push({
                            fileName: name,
                            fileType: '01'
                        });
                        this.uploadIndex.push(this.fileList.length - 1);
                        // if (
                        //     this.fileList.length > 0 &&
                        //     !this.contractForm.compactTheme
                        // ) {
                        //     this.contractForm.compactTheme = this.fileList[0].fileName;
                        // }
                    }
                }
            }
            if (this.isReUpload) {
                let res = await this.$api('reUpload').post('postFormDataQuery', formData, {
                    fileCode: this.reUploadFile.fileCode
                })
                if (res) {
                    let data = res.data.data
                    data.pageTotal = data.filePage
                    delete data.filePage
                    Object.assign(this.reUploadFile, data)
                    this.uploadProgress = 100
                    timer && clearInterval(timer)
                    this.resetUploadStatus()
                }
            }else {
                let res = await this.$api('uploadMoreFile').post('postFormData', formData)
                console.log(res);
                let fileList = this.fileType === '01' ? this.fileList : this.accessoryList
                let indexArr = this.fileType === '01' ? this.uploadIndex : this.assIndex
                if (res) {
                    indexArr.forEach((v,i)=>{
                        let item = res.data.data[i]
                        item.pageTotal = item.filePage
                        delete item.filePage
                        this.$set(fileList[v], 'fileCode', item.fileCode)
                        Object.assign(fileList[v], item)
                    })
                    e.target.value = ''
                    // this.fileType === '01' ? this.uploadIndex = [] : this.assIndex = []
                    this.uploadProgress = 100
                    timer && clearInterval(timer)
                    this.resetUploadStatus()
                }else {
                    fileList.splice(indexArr[0])
                }
            }
        },
        // 重置上传信息和状态
        resetUploadStatus() {
            this.isReUpload = false;
            setTimeout(() => {
                this.assIndex = [];
                this.uploadIndex = [];
                this.uploadProgress = 0;
            }, 200);
        },
        // 删除文件
        async delFile(item, index, type) {
            if (this.isUse) return;
            let res = await this.$api('delContractFile').post('postQuery',
                {},
                {
                    fileCode: item.fileCode 
                }
            );
            if (!res) return;
            // 删除合同文件
            if (type === '01') {
                this.fileList.splice(index, 1);
            } else {
                // 删除附件
                this.accessoryList.splice(index, 1);
            }
        },
        viewDetail(item) {
            this.viewDetailVisible = true;
            this.viewItem = item;
            this.$nextTick(
                () =>
                    (document.querySelector(
                        '.view-detail .el-scrollbar__wrap'
                    ).scrollTop = 0)
            );
        },
        async next() {
            if (this.isUse) {
                // 使用模板
                if (!this.compactTheme.trim()) {
                    return this.$message.error(`请输入${this.isFile ? '签发' :'合同'}主题`);
                }
            } else {
                // 新建和编辑模板
                if (!this.theme.trim()) {
                    return this.$message.error('请输入模板名称');
                }
                if (this.fileList.length === 0) {
                    return this.$message.error('请上传合同再进行下一步');
                }
                // 如有选择自定义合同编号
                if (this.customContractCode && !this.isUse) {
                    // 不能留空
                    if (!this.serialNumberPrefix.trim()) {
                        return this.$message.error('请输入合同编号前缀');
                    } else if (
                        !isLetterOrNumber(this.serialNumberPrefix.trim(), 1, 30)
                    ) {
                        return this.$message.error(
                            '合同编号前缀为30位以内的数字或字母'
                        );
                    }
                    if (!this.serialNumberDate) {
                        return this.$message.error('请选择合同编号的时间格式');
                    }
                    if (!this.serialNumberNo.trim()) {
                        return this.$message.error('请输入合同编号的流水号');
                    } else if (
                        !checkIntegral(this.serialNumberNo.trim()) &&
                        Number(this.serialNumberNo.trim()) !== 0
                    ) {
                        return this.$message.error('流水号应为纯数字');
                    }
                } else {
                    this.serialNumberPrefix = '';
                    this.serialNumberDate = '';
                    this.serialNumberNo = '';
                }
                if (!this.templateSignatories.length) {
                    return this.$message.error('请添加签署人再进行下一步');
                }
                // 必须存在一个需签署的角色
                let signMan = this.templateSignatories.find(
                    (v) => v.sign === 1
                );
                if (!signMan) {
                    return this.$message.error('至少需要一个需签署的角色');
                }
            }
            // 签署人信息校验
            let msg, flag = true
            for (const item of this.templateSignatories) {
                if (!item.name.trim()) {
                    return this.$message.error('角色名称不能为空');
                }
                if (item.signType === '01') {
                    item.isRight = true
                }else {
                    if (!item.signName && item.assignation) {
                        msg = '企业名称不能为空';
                        flag = false;
                        break;
                    }
                    if (item.isRight === false) {
                        msg = '存在用户和企业不匹配';
                        flag = false;
                        break;
                    }
                }
                if (item.assignation === 1 || this.isUse) {
                    // 指定用户
                    if (!item.signName) {
                        return this.$message.error('签署人的姓名不能为空');
                    }
                    if (!item.signContact) {
                        return this.$message.error('签署人的手机/邮箱不能为空');
                    }
                    if (
                        !isPhoneNum(item.signContact.trim()) &&
                        !isEmail(item.signContact.trim())
                    ) {
                        return this.$message.error(
                            '签署人的手机号/邮箱格式不正确'
                        );
                    }
                    // let res = await this.$api('userInfoByNodeId').post('postNormal',
                    //     {
                    //         currentPage: 1,
                    //         pageSize: 1,
                    //         nodeId: this.rootNodeId,
                    //         userName: item.signContact.trim()
                    //     }
                    // );
                    // if (
                    //     res &&
                    //     res.data &&
                    //     res.data.data
                    // ) {
                    //     item.signatoryId = res.data.data.id;
                    // }
                    let res = await this.$api('getInfoByUserName').post('postQuery',{},
                        {
                            userName: item.signContact.trim()
                        }
                    );
                    if (
                        res &&
                        res.data &&
                        res.data.data
                    ) {
                        item.signatoryId = res.data.data.id;
                    }else {
                        item.signatoryId = item.signContact;
                    }
                } else {
                    item.signName = '';
                    item.signContact = '';
                    item.signatoryId = '';
                }
            }

            if(!flag) return this.$message.error(msg)

            // 检查角色名称是否重复
            if (!this.isUse) {
                let nameList = this.templateSignatories.map((v) => v.name);
                if (nameList.length !== [...new Set(nameList)].length) {
                    return this.$message.error('角色名称不能重复');
                }
            }

            // 检查手机号/邮箱是否重复
            let phoneList = this.templateSignatories.map(
                (v, i) => v.signContact || i
            );
            if (phoneList.length !== [...new Set(phoneList)].length) {
                return this.$message.error('同一个签署人不能出现多次');
            }
            if (this.isUse) {
                let templateField = [];
                this.fileList.forEach(
                    (v) =>
                        (templateField = templateField.concat(v.templateFields))
                );
                templateField.forEach(
                    (v) =>
                        (v.signatoryId = this.templateSignatories.find(
                            (val) => v.signUser === val.name
                        ).signatoryId)
                );
                let signatoryWay = '02'
                if (
                    (phoneList.includes(this.userInfo.userName) && this.signWay === '01') ||
                    (phoneList[0] === this.userInfo.userName && this.signWay === '02')
                ) {
                    signatoryWay = '01'
                }
                Object.assign(this.templateInfo, {
                    templateSignatories: this.templateSignatories,
                    signWay: this.signWay,
                    compactTheme: this.compactTheme,
                    templateId: this.id,
                    templateField,
                    signatoryWay
                });
                sessionStore.set('contractInfo', this.templateInfo);
                this.$router.push({
                    path:'templateSign',
                    query: {
                        isFile: this.$route.query.isFile,
                        renew: this.$route.query.renew,
                        contractId: this.$route.query.contractId
                    }
                });
            } else {
                this.fileList.forEach((v) => {
                    v.fileType = '01';
                });
                this.accessoryList.forEach((v) => {
                    v.fileType = '02';
                });
                let contractFileList = []
                    .concat(this.fileList)
                    .concat(this.accessoryList);
                // 模板信息整合
                Object.assign(this.templateInfo, {
                    contractFileList,
                    templateSignatories: this.templateSignatories,
                    serialNumberDate: this.serialNumberDate,
                    serialNumberNo: this.serialNumberNo,
                    serialNumberPrefix: this.serialNumberPrefix,
                    signWay: this.signWay,
                    theme: this.theme
                });
                sessionStore.set('templateInfo', this.templateInfo);
                let path = this.isFile ? '/fileCenter/fileTemplate' : '/contractMgt/wordTemplate';
                let query = {id: this.$route.query.id};
                this.isFile ? (query.isFile = 1) : '';
                this.$router.push({
                    path,
                    query
                });
            }
        },
        // 添加角色
        addRole() {
            if (this.templateSignatories.length === 10) {
                return this.$message.error('最多只能添加10个角色');
            }
            this.templateSignatories.push({
                name: '',
                fillIn: 0,
                sign: 1,
                assignati0on: 0,
                signContact: '',
                signName: '',
                signatoryId: '',
                signType: '01'
            });
        },
        // 删除角色
        delRole(index) {
            this.templateSignatories.splice(index, 1);
        },
        // 打开组织结构弹框
        async openDialog(item) {
            this.editItem = item;
            this.selectDialogVisible = true;
            if (!this.enterpriseList.length) {
                let res = await this.$api('getEnterpriseListByUserInfo').get();
                console.log(res)
                this.enterpriseId = this.userInfo.enterpriseId
                res && res.data && (this.enterpriseList = res.data.data)
            }
            // 生成组织树
            let res = await this.$api('getNodeTree').get('getPath',{
                enterpriseId: this.enterpriseId
            });
            if (!res) return;
            let tree = res.data.data.rootNode;
            tree.sonNodes = res.data.data.sonNodeList;
            this.treeData = [tree];
            this.$nextTick(() => this.handleNodeClick(this.treeData[0]));
        },
        handleSelectClose(done) {
            done();
        },
        // 点击树节点事件
        async handleNodeClick(data) {
            console.log(data);
            // 保存已选项
            this.searchForm.userNickName = '';
            this.searchForm.nodeId = data.id;
            // 搜索生成列表
            this.searchSignMan();
        },
        // 搜索
        async searchSignMan() {
            let res = await this.$api('pageListUserInfoByNodeId2').post('postNormal',
                this.searchForm
            );
            if (!res) return;
            this.tableData = res.data.data.records;
        },
        submitSignMan(row) {
            console.log(row);
            this.editItem.signContact = row.userName;
            this.editItem.signName = row.userNickName;
            this.editItem.signatoryId = row.id;
            this.selectDialogVisible = false;
        },
        async checkNameAndEnterprise(item) {
            if(item.signType === '01') return item.isRight = true
            if (item.signContact && item.signName) {
                let res = await this.$api('userNameAndEnterpriseName').post('postQuery',{},{
                    userName: item.signContact,
                    enterpriseName: encodeURIComponent(item.signName)
                })
                if (res && res.data.data) {
                    item.isRight = true
                }else {
                    this.$message.error('该用户已在其他单位注册')
                    item.isRight = false
                }
            }else {
                item.isRight = false
            }
        },
        async changeEnterprise(val) {
            // 生成组织树
            let res = await this.$api('getNodeTree').get('getPath', {
                enterpriseId: val
            });
            if (!res) return;
            let tree = res.data.data.rootNode;
            tree.sonNodes = res.data.data.sonNodeList;
            this.treeData = [tree];
            this.$nextTick(() => this.handleNodeClick(this.treeData[0]));
        }
    },
    beforeRouteLeave(to, from, next) {
        console.log(to);
        if (
            to.path !== '/contractMgt/wordTemplate' &&
            to.path !== '/fileCenter/fileTemplate' 
        ) {
            sessionStore.remove('templateInfo');
        }
        if (
            to.path !== '/contractMgt/templateSign' &&
            to.path !== '/fileCenter/templateSign'
        ) {
            sessionStore.remove('contractInfo');
        }
        next();
    }
};
</script>

<style lang="scss" scoped>
.upload-template {
    overflow-x: auto;
    .enterprise-select {
        width: 100%;
    }
    .inner {
        padding: 0 20px 20px;
        background-color: #fff;
        .header-title {
            position: relative;
            margin-bottom: 30px;
            &:after {
                content: '';
                position: absolute;
                height: 10px;
                bottom: -10px;
                left: -20px;
                right: -20px;
                background-color: #f4f6f8;
            }
            .el-breadcrumb {
                overflow: hidden;
                &__item {
                    line-height: 54px;
                }
            }
        }
        .content {
            .theme-container {
                line-height: 54px;
                > span {
                    font-size: 16px;
                    margin-right: 10px;
                }
                .theme {
                    width: 300px;
                    margin: 0 10px;
                }
                .prefix,
                .time-select,
                .serial-no {
                    width: 180px;
                    margin: 0 5px;
                }
            }
            .step_item {
                .title {
                    height: 54px;
                    line-height: 54px;
                    margin-bottom: 10px;
                    font-size: 16px;
                    font-weight: bold;
                    padding-left: 10px;
                    position: relative;
                    &:before {
                        content: '';
                        width: 4px;
                        height: 18px;
                        background-color: #2a68c8;
                        position: absolute;
                        left: 0;
                        top: 50%;
                        transform: translateY(-50%);
                    }
                    .desc {
                        font-size: 13px;
                        font-weight: normal;
                        color: #999;
                        margin-left: 10px;
                    }
                }
                .file_list {
                    display: flex;
                    flex-wrap: wrap;
                    .file_box {
                        width: 220px;
                        height: 250px;
                        margin: 0 30px 30px 0;
                        &:hover {
                            .img_box {
                                .mask {
                                    height: 60px;
                                }
                            }
                        }
                        .img_box {
                            width: 100%;
                            height: 220px;
                            padding: 10px 35px;
                            border: 1px solid #c4cfdc;
                            border-radius: 8px;
                            background-color: #f9fafc;
                            position: relative;
                            margin-bottom: 10px;
                            &_inner {
                                width: 100%;
                                height: 100%;
                                background-color: #fff;
                                .el-image {
                                    width: 100%;
                                    height: 100%;
                                    img {
                                        width: 100%;
                                        height: 100%;
                                        vertical-align: middle;
                                    }
                                    .img-error,
                                    .img-placeholder {
                                        line-height: 180px;
                                    }
                                }
                            }
                            .mask {
                                width: 100%;
                                height: 0;
                                background-color: rgba(58, 82, 142, 0.3);
                                border-radius: 0px 0px 8px 8px;
                                position: absolute;
                                left: 0;
                                bottom: 0;
                                display: flex;
                                justify-content: center;
                                align-items: center;
                                overflow: hidden;
                                transition: all 0.2s;
                                .iconfont {
                                    width: 40px;
                                    height: 40px;
                                    background-color: #fff;
                                    margin: 0 5px;
                                    border-radius: 50%;
                                    font-size: 20px;
                                    line-height: 40px;
                                    text-align: center;
                                    cursor: pointer;
                                    &:hover {
                                        color: #2a68c8;
                                    }
                                    &.isUse {
                                        background-color: #ccc;
                                        cursor: not-allowed;
                                        &:hover {
                                            color: #333;
                                        }
                                    }
                                }
                            }
                            .progress {
                                position: absolute;
                                left: 0;
                                bottom: 0;
                                width: 100%;
                            }
                        }
                        p {
                            display: flex;
                            justify-content: center;
                            text-align: center;
                            line-height: 20px;
                            width: 100%;
                            .desc {
                                // flex: 1;
                                text-overflow: ellipsis;
                                overflow: hidden;
                                white-space: nowrap;
                                max-width: 160px;
                            }
                            .page {
                                width: 50px;
                                text-align: center;
                            }
                        }
                    }
                    .upload-box {
                        position: relative;
                        width: 220px;
                        height: 220px;
                        margin: 0 20px 20px 0;
                        border: 1px solid #c4cfdc;
                        border-radius: 8px;
                        display: flex;
                        flex-direction: column;
                        justify-content: center;
                        align-items: center;
                        cursor: pointer;
                        background-color: #f9fafc;
                        .iconfont {
                            font-size: 30px;
                            color: #c4cfdc;
                        }
                        .upload_desc {
                            margin-top: 20px;
                            color: #626262;
                        }
                    }
                }
                .accessory_container {
                    .uploadAss_box {
                        height: 36px;
                        line-height: 34px;
                        margin-bottom: 20px;
                        display: flex;
                        .uploadAss_main {
                            width: 220px;
                            border: 1px dashed #c4cfdc;
                            color: #c4cfdc;
                            border-radius: 6px;
                            text-align: center;
                            margin-right: 10px;
                            cursor: pointer;
                            &:hover {
                                border-color: #2a68c8;
                                color: #2a68c8;
                                .add {
                                    color: #2a68c8;
                                }
                            }
                            .iconfont {
                                font-size: 14px;
                            }
                            .add {
                                color: #626262;
                                margin-left: 10px;
                            }
                        }
                        .uploadAss_desc {
                            font-size: 13px;
                            color: #999;
                            line-height: 36px;
                        }
                    }
                    .accessory_list {
                        display: flex;
                        flex-wrap: wrap;
                        .accessory_item {
                            width: 220px;
                            height: 36px;
                            border: 1px solid #c4cfdc;
                            border-radius: 4px;
                            margin: 0 30px 20px 0;
                            padding: 0 20px;
                            line-height: 34px;
                            cursor: pointer;
                            text-align: center;
                            position: relative;
                            color: #626262;
                            p {
                                overflow: hidden;
                                text-overflow: ellipsis;
                                white-space: nowrap;
                            }
                            &:hover {
                                border-color: #2a68c8;
                                color: #2a68c8;
                                .iconfont {
                                    display: block;
                                }
                            }
                            .iconfont {
                                font-size: 16px;
                                border-radius: 50%;
                                position: absolute;
                                background-color: #fff;
                                top: -6px;
                                right: -6px;
                                color: #2a68c8;
                                line-height: 16px;
                                display: none;
                            }
                        }
                    }
                }
                .sign-way {
                    display: flex;
                    line-height: 40px;
                    margin-bottom: 20px;
                    > span {
                        margin-right: 40px;
                    }
                    .sign-items {
                        .desc {
                            font-size: 12px;
                            color: #999;
                        }
                    }
                }
                .sign-list {
                    width: 1220px;
                    .sign-title {
                        margin-bottom: 10px;
                    }
                    .sign-tr {
                        height: 50px;
                        background-color: #dee6f9;
                        display: flex;
                        align-items: center;
                        margin-bottom: 10px;
                        padding-left: 40px;
                        &:hover {
                            background-color: #fcf0d2;
                        }
                        .el-input {
                            width: 220px;
                        }
                        .el-checkbox {
                            margin: 0;
                        }
                        .name {
                            margin-right: 20px;
                            // &.el-input {
                            //     width: 300px;
                            // }
                        }
                        .fill {
                            display: flex;
                            align-items: center;
                            margin-right: 20px;
                            img {
                                margin-left: 4px;
                                cursor: pointer;
                            }
                        }
                        .is-sign {
                            margin-right: 20px;
                            display: flex;
                            align-items: center;
                            img {
                                margin-left: 6px;
                                cursor: pointer;
                            }
                            .el-select {
                                width: 92px;
                            }
                        }
                        .sign-type {
                            width: 100px;
                            align-items: center;
                            margin-right: 20px;
                        }
                        .role-set {
                            width: 500px;
                            display: flex;
                            align-items: center;
                            .role-span {
                                width: 80px;
                                margin-right: 16px;
                            }
                            .el-checkbox {
                                margin-right: 16px;
                            }
                            .el-input {
                                margin-right: 10px;
                            }
                            .phone {
                                width: 170px;
                            }
                        }
                        .del-btn {
                            color: #999;
                            cursor: pointer;
                            &.from-org {
                                margin-right: 10px;
                            }
                            &:hover {
                                color: #02adff;
                            }
                        }
                    }
                    .add-btn {
                        width: 100%;
                        height: 50px;
                        font-size: 16px;
                        border: 1px dashed #ccc;
                        background-color: #fafafa;
                        border-radius: 8px;
                        cursor: pointer;
                        color: #02adff;
                        display: flex;
                        justify-content: center;
                        align-items: center;
                        &:hover {
                            border-color: #02adff;
                            background-color: #fff;
                        }
                        img {
                            margin-right: 6px;
                        }
                    }
                }
            }
            .btn_wrap {
                padding: 30px 0 20px 100px;
                .el-button {
                    margin: 0;
                    margin-right: 10px;
                    width: 100px;
                }
            }
        }
    }
}
</style>
<style lang="scss">
.upload-template {
    .step_item {
        .file_list {
            .upload-box:hover {
                .el-upload {
                    border-color: #1075eb;
                    border-style: dashed;
                    .iconfont {
                        color: #1075eb;
                    }
                    .upload_desc {
                        color: #1075eb;
                    }
                }
            }
            .upload_box {
                .el-upload {
                    width: 220px;
                    height: 220px;
                    border: 1px solid #c4cfdc;
                    border-radius: 8px;
                    display: flex;
                    flex-direction: column;
                    justify-content: center;
                    align-items: center;
                    background-color: #f9fafc;
                    .iconfont {
                        font-size: 30px;
                        color: #c4cfdc;
                    }
                    .upload_desc {
                        margin-top: 20px;
                        color: #626262;
                    }
                }
            }
        }
        .info_form.el-form {
            .compact-theme {
                input {
                    overflow: hidden;
                }
            }
            .el-form-item {
                width: 460px;
                position: relative;
                .el-date-editor {
                    width: 100%;
                }
                .date_desc {
                    color: #999;
                    line-height: 40px;
                    position: absolute;
                    right: -10px;
                    top: 0;
                    transform: translateX(100%);
                }
                &.remark {
                    width: 1000px;
                }
            }
        }
        .el-radio {
            margin-right: 5px;
        }
    }
    .view-detail {
        .page-no {
            text-align: center;
            line-height: 40px;
            background-color: #f4f6f8;
        }
        .el-dialog__header {
            background-color: #f4f6f8;
        }
        .el-dialog__body {
            // background-color: #f4f6f8;
            background-color: #fff;
            padding: 0;
            padding-bottom: 20px;
            height: 620px;
            .el-scrollbar {
                height: 100%;
                .el-image {
                    width: 100%;
                    background-color: #fff;
                    min-height: 500px;
                    text-align: center;
                    .img-error,
                    .img-placeholder {
                        // padding: 50px 200px;
                        line-height: 500px;
                    }
                }
            }
            img {
                // width: 100%;
            }
        }
    }
    .select_dialog {
        .el-dialog__body {
            padding: 20px;
        }
        .main_body {
            .main_container {
                height: 498px;
                margin-bottom: 20px;
                display: flex;
                justify-content: space-between;
                .tree_wrap {
                    width: 300px;
                    border: 1px solid #edeeee;
                }
                .el-scrollbar {
                    height: 100%;
                    &__wrap {
                        overflow-x: hidden;
                    }
                }
                .table_wrap {
                    width: 440px;
                    .search_input {
                        margin-bottom: 10px;
                        .iconfont {
                            line-height: 36px;
                            cursor: pointer;
                        }
                    }
                    .el-table {
                        border-left: 1px solid #e9e9e9;
                        border-right: 1px solid #e9e9e9;
                    }
                    .el-table__row {
                        cursor: pointer;
                    }
                    .table {
                        border: 1px solid #e9e9e9;
                        height: 450px;
                    }
                }
            }
            .footer {
                text-align: center;
                .el-button {
                    margin: 0 10px;
                    width: 80px;
                }
            }
        }
    }
}
</style>
