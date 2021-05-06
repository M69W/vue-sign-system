<template>
    <div class="start-contract">
        <div class="inner">
            <div class="breadcrumb">
                <el-breadcrumb separator="/">
                    <el-breadcrumb-item to="/fileCenter/fileManage"
                        >文件管理</el-breadcrumb-item
                    >
                    <el-breadcrumb-item>签发文件</el-breadcrumb-item>
                </el-breadcrumb>
            </div>
            <div class="new_step_one">
                <div class="step_item">
                    <div class="title">
                        <div class="left">
                            <span class="mention">
                                上传文件
                            </span>
                            <span class="desc"
                                >温馨提示：仅支持.doc、docx、pdf、xls、xlsx、ofd、html格式、图片格式，文件&lt;20MB</span
                            >
                        </div>
                        <!-- <div class="right" @click="chooseFromModule">
                            <i class="iconfont icon-zuzhitianjia1"></i>
                            <span>从文件模板选择</span>
                        </div> -->
                    </div>
                    <div class="file_list">
                        <div
                            class="file_box"
                            v-for="(item, index) in fileList"
                            :key="index"
                        >
                            <div class="img_box">
                                <div class="img_box_inner">
                                    <img :src="item.fileCode && `${baseUrl}/document/scan/page/${item.fileCode}/1`" alt />
                                </div>
                                <div class="mask">
                                    <i
                                        class="iconfont icon-shanchuheise"
                                        title="删除"
                                        @click="delFile(item, index)"
                                    ></i>
                                    <i
                                        class="iconfont icon-chakanheise"
                                        title="查看详情"
                                        @click="viewDetail(item, index)"
                                    ></i>
                                    <i
                                        class="iconfont icon-zhongxinshangchuanheise"
                                        title="重新上传"
                                        @click="reUploadFn(item, index)"
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
                                <span class="page"
                                    >({{ item.pageTotal }}页)</span
                                >
                            </p>
                        </div>
                        <div class="upload-box" v-show="fileList.length < 100" @click="addFile">
                            <!-- <el-upload
                                action="#"
                                :on-progress="handleProgress"
                                class="upload_box"
                                accept=".doc, .docx, .pdf, .xls, .xlsx, image/*"
                                :show-file-list="false"
                                :before-upload="beforeUpload"
                                :on-success="uploadSuccess"
                                :on-err="uploadFail"
                                :http-request="resetFile"
                            > -->
                                <i
                                    class="iconfont icon-jiahao"
                                    ref="uploadFile"
                                ></i>
                                <p class="upload_desc">添加文件</p>
                            <!-- </el-upload> -->
                        </div>
                        <input type="file" ref="uploadFile" style="display:none" @change="changeFile" multiple 
                            accept=".doc, .docx, .pdf, .xls, .xlsx, image/*, .ofd, .html">
                    </div>
                </div>
                <div class="step_item">
                    <el-form
                        label-width="100px"
                        :model="contractForm"
                        :rules="themeRules"
                        label-position="left"
                        class="info_form"
                        ref="infoForm"
                    >
                        <el-form-item label="签发主题" prop="compactTheme" style="float: left;">
                            <el-input
                                v-model="contractForm.compactTheme"
                                placeholder="请输入签发主题"
                                maxlength="100"
                            ></el-input>
                        </el-form-item>
                        <!-- 审批流程 -->
                        <el-form-item
                            v-if="isViaProcess"
                            style="float: left; margin-left: 10px;"
                            label="审批流程"
                            :rules="[
                                {
                                    required: true,
                                    trigger: 'blur',
                                    message: '请选择审批流程'
                                }
                            ]"
                            prop="processName"
                            class="compact-theme"
                        >
                            <el-select v-model="contractForm.processName" placeholder="请选择审批流程" clearable>
                                <el-option
                                v-for="item in processInfoList"
                                :key="item.id"
                                :label="item.processName"
                                :value="item.id">
                                </el-option>
                            </el-select>
                        </el-form-item>

                        <el-form-item label="签署方式" prop="signWay" style="clear: both;">
                            <el-radio-group v-model="contractForm.signWay" @change="signWayChange">
                                <el-radio label="01"
                                    >无序签署：签署顺序不受限制</el-radio
                                >
                                <el-radio label="02"
                                    >顺序签署：按签署顺序一人签署完再到下一环节人签署，即：A-B-C-D</el-radio
                                >
                            </el-radio-group>
                        </el-form-item>
                    </el-form>
                </div>
                <el-form
                    label-position="top"
                    label-width="100px"
                    :model="form"
                    ref="signInfo"
                    class="info_form-signpeople"
                >
                    <el-form-item label="签署人信息" prop="signInfos">
                        <!-- 签署人列表 -->
                        <div class="sign_list">
                            <template v-if="contractForm.signWay === '02'">
                                <div
                                    class="sign_list_item sort"
                                    v-for="(item, index) in form.signInfos"
                                    :key="item.devId"
                                    v-dragging="{item, list:form.signInfos, group: 'devId'}"
                                >   
                                    <div class="operate-btn">
                                        <i class="el-icon-top" v-show="index !== 0" @click="toTop(item,index)"></i>
                                        <i class="el-icon-bottom" v-show="index !== form.signInfos.length - 1" @click="toBottom(item,index)"></i>
                                    </div>
                                    <el-autocomplete
                                        size="small"
                                        class="select-choose-people"
                                        v-model="item.signName"
                                        :fetch-suggestions="querySearch"
                                        placeholder="请选择签署方"
                                        @select="choosePeple($event, index)"
                                    ></el-autocomplete>
                                    <!-- 配合事件证书修改 -->
                                    <!-- <el-select
                                        size="small"
                                        v-model="item.signName"
                                        placeholder="请选择签署方"
                                        class="sign-name"
                                        @change="selectSigner($event,index)"
                                    >
                                        <el-option
                                            :label="option.userNickName"
                                            :value="option.signatoryId"
                                            v-for="(option, i) in optionsSignPeople" :key="i"
                                        ></el-option>
                                    </el-select> -->
                                    <el-input
                                        @change="checkNameAndEnterprise(item)"
                                        :class="{ error: item.isPhoneOrEmailErr }"
                                        size="small"
                                        v-model="item.signContact"
                                        placeholder="请输入手机号/邮箱"
                                    ></el-input>
                                    <el-select
                                        size="small"
                                        v-model="item.signType"
                                        placeholder="请选择"
                                        @change="signTypeChange($event,item)"
                                    >
                                        <el-option label="个人" value="01"></el-option>
                                        <el-option label="企业" value="02"></el-option>
                                    </el-select>
                                    <div class="enterprise-name">
                                        <el-input
                                            size="small"
                                            v-model="item.enterpriseName"
                                            v-if="item.signType==='02'"
                                            placeholder="请输入企业名称"
                                            @change.native="checkNameAndEnterprise(item)"
                                        ></el-input>
                                    </div>
                                    <el-select
                                        size="small"
                                        v-model="item.type"
                                        placeholder="请选择"
                                    >
                                        <el-option
                                            label="需签署"
                                            value="01"
                                        ></el-option>
                                        <!-- <el-option
                                            v-if="!isViaProcess"
                                            label="需审批"
                                            value="03"
                                        ></el-option> -->
                                        <!-- <el-option
                                            label="仅抄送"
                                            value="02"
                                        ></el-option> -->
                                    </el-select>
                                    <span
                                        class="del_sign"
                                        v-show="index !== 0"
                                        @click="delSignList(index)"
                                        >删除</span
                                    >
                                    <span
                                        class="add_sign"
                                        @click="addSignList(index)"
                                        >增加</span
                                    >
                                </div>
                            </template>
                            <template v-else>
                                <div
                                    class="sign_list_item"
                                    v-for="(item, index) in form.signInfos"
                                    :key="item.devId"
                                >
                                    <el-autocomplete
                                        size="small"
                                        class="select-choose-people no-sort"
                                        v-model="item.signName"
                                        :fetch-suggestions="querySearch"
                                        placeholder="请选择签署方"
                                        @select="choosePeple($event, index)"
                                    ></el-autocomplete>
                                    <!-- 配合事件证书修改 -->
                                    <!-- <el-select
                                        size="small"
                                        v-model="item.signName"
                                        placeholder="请选择签署方"
                                        class="sign-name"
                                        @change="selectSigner($event,index)"
                                    >
                                        <el-option
                                            :label="option.userNickName"
                                            :value="option.signatoryId"
                                            v-for="(option, i) in optionsSignPeople" :key="i"
                                        ></el-option>
                                    </el-select> -->
                                    <el-input
                                        @change="checkNameAndEnterprise(item)"
                                        :class="{ error: item.isPhoneOrEmailErr }"
                                        size="small"
                                        v-model="item.signContact"
                                        placeholder="请输入手机号/邮箱"
                                    ></el-input>
                                    <el-select
                                        size="small"
                                        v-model="item.signType"
                                        placeholder="请选择"
                                        @change="signTypeChange($event,item)"
                                    >
                                        <el-option label="个人" value="01"></el-option>
                                        <el-option label="企业" value="02"></el-option>
                                    </el-select>
                                    <div class="enterprise-name">
                                        <el-input
                                            size="small"
                                            v-model="item.enterpriseName"
                                            v-if="item.signType==='02'"
                                            placeholder="请输入企业名称"
                                            @change.native="checkNameAndEnterprise(item)"
                                        ></el-input>
                                    </div>
                                    <el-select
                                        size="small"
                                        v-model="item.type"
                                        placeholder="请选择"
                                    >
                                        <el-option
                                            label="需签署"
                                            value="01"
                                        ></el-option>
                                        <!-- <el-option
                                            label="仅抄送"
                                            value="02"
                                        ></el-option> -->
                                    </el-select>
                                    <span
                                        class="del_sign"
                                        v-show="index !== 0"
                                        @click="delSignList(index)"
                                        >删除</span
                                    >
                                    <span
                                        class="add_sign"
                                        @click="addSignList(index)"
                                        >增加</span
                                    >
                                </div>
                            </template>
                        </div>
                    </el-form-item>
                </el-form>
                <div class="btn_wrap">
                    <el-button
                        type="info"
                        plain
                        @click="$router.push('/fileCenter/fileManage')"
                        >取消</el-button
                    >
                    <el-button type="primary" @click="next">下一步</el-button>
                </div>
                <!-- 查看文件详情 -->
                <el-dialog
                    class="view-detail"
                    width="1000px"
                    :visible.sync="viewDetailVisible"
                    :title="viewItem.fileName"
                >
                    <!-- <div class="page-no">
                        {{ currPage }}/{{ viewItem.filePage }}
                    </div> -->
                    <el-scrollbar>
                        <div
                            class="view-item-wrap"
                            v-for="(item, index) in viewItem.pageTotal"
                            :key="index"
                        >
                            <el-image
                                :src="
                                    `${baseUrl}/document/scan/page/${
                                        viewItem.fileCode
                                    }/${index + 1}`
                                "
                                lazy
                                scroll-container=".view-detail .el-scrollbar__wrap"
                            >
                            </el-image>
                            <p class="page">
                                {{ index + 1 }}/{{ viewItem.pageTotal }}
                            </p>
                        </div>
                    </el-scrollbar>
                </el-dialog>
            </div>
        </div>
    </div>
</template>

<script>
import { sessionStore, isPhoneNum, isEmail } from '@/utils';
import { mapState } from 'vuex';
import { differenceBy, findIndex, find } from 'lodash';

export default {
    data() {
        return {
            isViaProcess: false, // 管理后台是否开启了流程审批
            processInfoList: [],
            // ----------------------
            baseUrl: process.env.NODE_ENV === 'development' ? '/apis' : '/sign',
            fileType: '01',
            fileList: [], // 文件列表
            fileName: '', // 文件列表
            reUploadFile: '', // 重新上传的文件
            uploadProgress: 0, // 上传进度
            canUpload: true, // 是否可以上传，防止并发
            contractForm: {
                compactTheme: '',
                processName: '',
                signWay: '01'
            },
            uploadIndex: [],
            viewDetailVisible: false,
            dialogVisibleChooseModule: false,
            viewItem: {},
            load: true,
            currPage: 1,
            nowPage: 2,
            userId: sessionStore.get('userInfo').id,
            reUpload: false,
            fileCode: '',
            form: {
                signInfos: [
                    {
                        signName: '',
                        signContact: '',
                        isPhoneOrEmailErr: false,
                        signatoryId: '',
                        userNickName: '',
                        type: '01',
                        signType: '01',
                        enterpriseName: '',
                        devId: +new Date()
                    }
                ]
            },
            themeRules: {
                compactTheme: [
                    {
                        required: true,
                        trigger: 'blur',
                        message: '请输入文件主题！'
                    },
                    {
                        validator: function(rule, value, callback) {
                            if (!value) {
                                callback(new Error('请输入文件主题！'));
                            } else {
                                callback();
                            }
                        },
                        trigger: 'blur'
                    }
                ],
                signWay: [
                    {
                        required: true,
                        trigger: 'change',
                        message: '请选择签署方式！'
                    }
                ]
            },
            optionsSignPeople: [],
            tableDataModule: [
                // {
                //     tempName: '444',
                //     updateUserName: '444',
                //     tempType: '444',
                //     tempPurpose: '444',
                //     choosed: true
                // }
            ],
            headerStyleFn(row, column, rowIndex) {
                return {
                    background: '#4A90E2',
                    color: '#fff'
                };
            },
            choosedModuleId: 0,
            pagination: {
                currentPage: 1,
                pageSize: 10,
                pageSizes: [10],
                total: 0
            },
            renew: !!this.$route.query.renew,
            isReUpload: false
        };
    },
    computed: {
        ...mapState({
            uploadFileSize: (state) => state.settings.uploadFileSize
        })
    },
    async mounted() {
        await this.getSignConfig();

        if (this.isViaProcess) {
            this.getProcessInfoList();
        }
        // --------------------------

        this.getAllUserInfo();
        let startContractInfo;
        if (this.renew) {
            let res = await this.$api('restartFile').post(
                'postQuery',
                {},
                {
                    contractId: this.$route.query.contractId
                }
            );
            if (!res) return;
            startContractInfo = res.data.data;
            this.contractForm = startContractInfo;
            let fileCodes = this.contractForm.contractFileList
                .map((v) => v.fileCodeOrigin || v.fileCode)
                .join(',');
            let res1 = await this.$api('uploadOldFile').post(
                'postQuery',
                {},
                { fileCodes }
            );
            if (!res1) return;
            console.log(res1);
            let fileList = res1.data.data;
            this.contractForm.compactFieldInfoReqVOList.forEach((v) => {
                let item = this.contractForm.contractFileList.find(
                    (val) => val.fileCode === v.compactFileCode
                );
                item &&
                    (item = fileList.find(
                        (val) =>
                            val.oldFileCode ===
                            (item.fileCodeOrigin || item.fileCode)
                    ));
                item && (v.compactFileCode = item.newFileCode);
            });
            this.contractForm.contractFileList.forEach((v) => {
                let item = fileList.find(
                    (val) =>
                        val.oldFileCode === (v.fileCodeOrigin || v.fileCode)
                );
                item && (v.fileCode = item.newFileCode);
            });
        } else {
            startContractInfo = sessionStore.get('startContractInfo');
        }
        startContractInfo && this.setStartContractInfo(startContractInfo);
    },
    methods: {
        // 返回管理后台的配置
        async getSignConfig() {
            let res = await this.$api('getSignConfig').get();

            if (!res) return;

            this.isViaProcess = res.data.data.isViaProcess === 1 ? true : false;
            console.log(this.isViaProcess);
        },
        async getProcessInfoList() {
            let _data = {
                enterpriseOrPersonalId: sessionStore.get('userInfo')
                    .enterpriseId
            };

            let res = await this.$api('urlGetProcessInfoList').get(
                'getNormal',
                _data
            );

            if (!res) return;
            this.processInfoList = res.data.data;

            // this.processInfoList = [
            //     {
            //         id: 'string',
            //         processName: 'stringProcessName'
            //     }
            // ];
        },

        // ------------------
        setStartContractInfo(info) {
            this.fileList = info.contractFileList;
            this.form.signInfos = info.signInfos;
            this.contractForm.compactTheme = info.compactTheme;
            this.contractForm.signWay = info.signWay;
        },
        // 获取单位下签署人
        async getAllUserInfo() {
            let res = await this.$api('getAllUserInfoByEnterpriseId').get(
                'getPath',
                {
                    enterpriseId: sessionStore.get('userInfo').enterpriseId
                }
            );
            if (!res) return;
            let dataList = res.data.data;
            this.signerList = dataList;
            let peopleItem = {};
            dataList.forEach((element) => {
                peopleItem = {
                    userNickName: element.userNickName,
                    isPhoneOrEmailErr: false,
                    signatoryId: element.id,
                    userName: element.userName,
                    value: element.userNickName
                };
                this.optionsSignPeople.push(peopleItem);
            });
        },
        // 添加合同文件
        addFile() {
            if (this.fileList.length >= 100) {
                return this.$message.error('合同文件数量不能超过100个');
            }
            this.setUploadStatus('01');
        },
        // 重新上传
        reUploadFn(item, index) {
            this.uploadIndex = [index];
            this.setUploadStatus('01', true, item);
        },
        // 设置上传信息和状态
        setUploadStatus(fileType, isReUpload = false, item = null) {
            this.fileType = fileType;
            this.isReUpload = isReUpload;
            this.reUploadFile = item;
            this.$refs.uploadFile.click();
        },
        async changeFile(e) {
            console.log(e);
            let files = e.target.files;
            if (files.length === 0) return;
            if (files.length + this.fileList.length > 100) {
                e.target.value = '';
                return this.$message.warning('上传文件总数不能100个');
            }
            let formData = new FormData();
            let timer = setInterval(() => {
                this.uploadProgress += 10;
                if (this.uploadProgress >= 90 && timer) {
                    clearInterval(timer);
                }
            }, 100);
            for (let i = 0; i < files.length; i++) {
                let file = files[i];
                let nameList = file.name.split('.');
                if (file.size > 20 * 1024 * 1024)
                    return this.$message.error('文件大小不能超过20M');
                if (
                    ![
                        'pdf',
                        'doc',
                        'docx',
                        'xls',
                        'xlsx',
                        'jpg',
                        'png',
                        'jpeg',
                        'bmp',
                        'webp',
                        'ofd',
                        'html'
                    ].includes(nameList[nameList.length - 1].toLowerCase())
                ) {
                    this.$message.error('文件格式不正确');
                    continue;
                }
                formData.append('files', file);
                nameList[nameList.length - 1] = 'pdf';
                let name = nameList.join('.');
                if (this.fileType === '02') {
                    // 选中文件,先推入一项占位
                    this.accessoryList.push({
                        fileName: name,
                        fileType: '02'
                    });
                    this.assIndex.push(this.accessoryList.length - 1);
                } else {
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
                let res = await this.$api('reUpload').post(
                    'postFormDataQuery',
                    formData,
                    {
                        fileCode: this.reUploadFile.fileCode
                    }
                );
                if (res) {
                    let data = res.data.data;
                    data.pageTotal = data.filePage;
                    delete data.filePage;
                    Object.assign(this.reUploadFile, data);
                    this.uploadProgress = 100;
                    timer && clearInterval(timer);
                    this.resetUploadStatus();
                }
            } else {
                let res = await this.$api('uploadMoreFile').post(
                    'postFormData',
                    formData
                );
                console.log(res);
                if (res) {
                    this.uploadIndex.forEach((v, i) => {
                        let item = res.data.data[i];
                        item.pageTotal = item.filePage;
                        delete item.filePage;
                        this.$set(this.fileList[v], 'fileCode', item.fileCode);
                        Object.assign(this.fileList[v], item);
                    });
                    e.target.value = '';
                    this.uploadProgress = 100;
                    timer && clearInterval(timer);
                    this.resetUploadStatus();
                } else {
                    this.fileList.splice(this.uploadIndex[0]);
                }
            }
        },
        // 重置上传信息和状态
        resetUploadStatus() {
            this.isReUpload = false;
            setTimeout(() => {
                this.uploadIndex = [];
                this.uploadProgress = 0;
            }, 200);
        },
        // 删除文件
        async delFile(item, index) {
            let res = await this.$api('sunshineDelete').post(
                'postQuery',
                {},
                {
                    fileCode: item.fileCode
                }
            );
            if (!res) return;
            // 删除合同文件
            this.fileList.splice(index, 1);
            !this.fileList.length && (this.contractForm.compactTheme = '');
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
        delSignList(index) {
            console.log(index);
            this.form.signInfos.splice(index, 1);
        },
        addSignList(index) {
            this.form.signInfos.splice(index + 1, 0, {
                signName: '',
                signContact: '',
                signatoryId: '',
                userNickName: '',
                type: '01',
                signType: '01',
                enterpriseName: '',
                devId: +new Date()
            });
        },
        querySearch(queryString, cb) {
            let doOptionsSignPeople = this.optionsSignPeople;
            let filterPeople = differenceBy(
                doOptionsSignPeople,
                this.form.signInfos,
                'signatoryId'
            );
            // console.log(filterPeople);
            cb(filterPeople);
        },
        /**
         * 下拉选择
         */
        choosePeple(item, index) {
            console.log(item);
            let peopleItem = find(this.optionsSignPeople, (o) => {
                return item.signatoryId === o.signatoryId;
            });
            // console.log(peopleItem);
            this.form.signInfos[index].signContact = peopleItem.userName;
            this.form.signInfos[index].userNickName = peopleItem.userNickName;
            this.form.signInfos[index].signatoryId = item.signatoryId;
        },
        /**
         *
         */
        next() {
            if (!this.fileList.length) {
                this.$message.warning('请至少上传一份文件！');
                return;
            }

            this.$refs.infoForm.validate((valid) => {
                if (!valid) return;
                let signPeople = this.form.signInfos.some((o) => {
                    return !o.signContact || !o.signName;
                });

                let signMan = this.form.signInfos.find((o) => o.type === '01');

                if (signPeople || !signMan) {
                    this.$message.warning('请添加签署人！');
                    return;
                }

                if (this.form.signInfos.find((item) => !item.type))
                    return this.$message.warning('存在签署人未选择签署方式');

                // 有审批人时审批人需在前面的判断
                if (!this.checkApprove())
                    return this.$message.warning('审批人顺序需在签署人前面');

                this.checkPhoneNum();
            });
        },
        checkPhoneNum() {
            let checkTrue = false;
            for (let i = 0; i < this.form.signInfos.length; i++) {
                let item = this.form.signInfos[i];
                if (
                    !isPhoneNum(item.signContact) &&
                    !isEmail(item.signContact)
                ) {
                    console.log(item);
                    item.isPhoneOrEmailErr = true;
                    this.$set(this.form.signInfos, i, item);
                    checkTrue = true;
                    break;
                }
            }
            if (checkTrue) {
                this.$message.warning('请输入正确的手机号或邮箱');
            } else {
                this.setSignType();
            }
        },
        // 根据是否选择了自己设置参数
        async setSignType() {
            let flag = true,
                msg = '';
            for (const item of this.form.signInfos) {
                if (item.signType === '01') {
                    item.enterpriseName = '';
                    item.isRight = true;
                } else {
                    if (!item.enterpriseName) {
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
                let optionsItem = find(this.optionsSignPeople, (o) => {
                    return o.userName === item.signContact;
                });
                if (optionsItem) {
                    item.signatoryId = optionsItem.signatoryId;
                } else {
                    let res = await this.$api('getInfoByUserName').post(
                        'postQuery',
                        {},
                        {
                            userName: item.signContact.trim()
                        }
                    );
                    if (res && res.data && res.data.data) {
                        item.signatoryId = res.data.data.id;
                    } else {
                        item.signatoryId = item.signContact;
                    }
                }
            }
            if (!flag) return this.$message.error(msg);

            // 本人不可审批
            let selfApprove = this.form.signInfos.find(
                (o) => o.signatoryId === this.userId && o.type === '03'
            );
            if (selfApprove) return this.$message.warning('本人不可审批');

            let index = findIndex(this.form.signInfos, (o) => {
                return o.signatoryId === this.userId && o.type === '01';
            });
            let signatoryWay = '';
            if (
                (index === 0 && this.contractForm.signWay === '02') ||
                (index >= 0 && this.contractForm.signWay === '01')
            ) {
                signatoryWay = '01'; // 自己需要签署
            } else {
                signatoryWay = '02'; // 仅他人需要签署
            }

            /**
             * 保存信息，返回时赋值
             */
            this.fileList.forEach((v) => {
                v.pageTotal = v.filePage || v.pageTotal;
                v.fileType = '01';
            });
            let startContractInfo = Object.assign({}, this.contractForm, {
                compactTheme: this.contractForm.compactTheme,
                contractFileList: this.fileList,
                signInfos: this.form.signInfos,
                signWay: this.contractForm.signWay,
                signatoryWay
            });
            sessionStore.set('startContractInfo', startContractInfo);

            let query = this.renew ? { renew: '1' } : {};

            // 如果激活了`审批流程`
            if (this.isViaProcess) {
                query = Object.assign(query, {
                    isViaProcess: 1,
                    processId: this.contractForm.processName
                });
            }

            this.$router.push({
                path: '/fileCenter/initFile',
                query
            });
        },
        // 配合事件证书新增
        selectSigner(id, index) {
            let peopleItem = find(this.optionsSignPeople, (o) => {
                return id === o.signatoryId;
            });
            // console.log(peopleItem);
            this.form.signInfos[index].signContact = peopleItem.userName;
            this.form.signInfos[index].signName = peopleItem.userNickName;
            this.form.signInfos[index].signatoryId = id;
        },
        async checkNameAndEnterprise(item) {
            if (item.signType === '01')
                return (item.isRight = true), (item.isPhoneOrEmailErr = false);
            if (item.signContact && item.enterpriseName) {
                let res = await this.$api('userNameAndEnterpriseName').post(
                    'postQuery',
                    {},
                    {
                        userName: item.signContact,
                        enterpriseName: encodeURIComponent(item.enterpriseName)
                    }
                );
                if (res && res.data.data) {
                    item.isRight = true;
                    item.isPhoneOrEmailErr = false;
                } else {
                    this.$message.error('该用户已在其他单位注册');
                    item.isPhoneOrEmailErr = true;
                    item.isRight = false;
                }
            } else {
                item.isPhoneOrEmailErr = true;
                item.isRight = false;
            }
        },
        signTypeChange(signType, item) {
            if (signType === '01') {
                item.isPhoneOrEmailErr = false;
            }
        },
        toTop(item, index) {
            this.form.signInfos.splice(
                index - 1,
                0,
                this.form.signInfos.splice(index, 1)[0]
            );
        },
        toBottom(item, index) {
            this.form.signInfos.splice(
                index + 1,
                0,
                this.form.signInfos.splice(index, 1)[0]
            );
        },
        // 核对审批人是否在签署人前面
        checkApprove() {
            if (this.contractForm.signWay !== '02') return true;
            // 审批人数量
            const approveCount = this.form.signInfos.filter(
                (item) => item.type === '03'
            ).length;
            if (!approveCount) return true;
            const count = this.form.signInfos
                .filter((item) => item.type !== '02')
                .slice(0, approveCount)
                .filter((item) => item.type === '03').length;
            if (count === approveCount) return true;
            else return false;
        },
        signWayChange(val) {
            if (val !== '02') {
                this.form.signInfos
                    .filter((item) => item.type === '03')
                    .forEach((item) => (item.type = ''));
            }
        }
    },
    beforeRouteLeave(to, from, next) {
        if (to.path !== '/fileCenter/initFile') {
            sessionStore.remove('startContractInfo');
        }
        next();
    }
};
</script>

<style lang="scss" scoped>
.start-contract {
    .inner {
        margin-right: 14px;
        padding: 0 20px 0;
    }
    .breadcrumb {
        overflow: hidden;
        .el-breadcrumb {
            height: 46px;
            line-height: 46px;
            font-size: 16px;
            color: #333;
        }
    }
}
.new_step_one {
    .step_item {
        .title {
            height: 54px;
            line-height: 54px;
            margin-bottom: 10px;
            font-size: 16px;
            font-weight: bold;
            padding-left: 10px;
            position: relative;
            // display: flex;
            // align-items: center;
            // justify-content: space-between;

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
            .right {
                font-size: 14px;
                font-weight: normal;
                color: #2a68c8;
                cursor: pointer;
                i {
                    margin-right: 10px;
                }
            }
        }
        .file_list {
            display: flex;
            flex-wrap: wrap;
            min-height: 270px;
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
                        img {
                            width: 100%;
                            height: 100%;
                            vertical-align: middle;
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
    }
    .info_form-signpeople {
        .btn_wrap {
            color: #1890ff;
            margin-bottom: 20px;
            display: flex;
            .btn_select {
                width: 120px;
                border: 1px dashed #c0ccda;
                border-radius: 4px;
                font-size: 14px;
                margin-right: 20px;
                text-align: center;
                cursor: pointer;
                &:hover {
                    border-color: #2a68c8;
                }
                .iconfont {
                    margin-right: 3px;
                }
            }
        }
        .sign_list {
            &_item {
                width: 1110px;
                line-height: 50px;
                background-color: #fafafa;
                margin-bottom: 11px;
                padding-left: 10px;
                position: relative;
                &.sort {
                    cursor: move;
                }
                &:hover {
                    background-color: #dee6f9;
                    .add_sign,
                    .del_sign {
                        color: #2a68c8;
                    }
                }
                &:after {
                    content: '';
                    width: 100%;
                    height: 1px;
                    position: absolute;
                    left: 0;
                    bottom: -6px;
                    background-color: #eee;
                }
                .el-input {
                    width: 250px;
                    margin-right: 10px;
                    vertical-align: middle;
                }
                .el-select {
                    width: 100px;
                    margin-right: 10px;
                    vertical-align: middle;
                }
                .operate-btn {
                    width: 50px;
                    display: inline-block;
                    vertical-align: middle;
                    text-align: center;
                    > i {
                        cursor: pointer;
                    }
                    .el-icon-top {
                        margin-right: 8px;
                    }
                }
                .select-choose-people {
                    width: 200px;
                    margin-right: 10px;
                    vertical-align: middle;
                    &.no-sort {
                        width: 250px;
                    }
                }
                .add_sign,
                .del_sign {
                    margin-right: 16px;
                    cursor: pointer;
                    color: #999;
                }
                .sign-name {
                    width: 250px;
                }
                .enterprise-name {
                    width: 250px;
                    margin-right: 10px;
                    display: inline-block;
                    vertical-align: middle;
                }
            }
        }
    }
    .btn_wrap {
        padding-left: 100px;
        margin-bottom: 30px;
        .el-button {
            margin: 0;
            margin-right: 10px;
            width: 100px;
        }
    }
}
</style>
<style lang="scss">
.choose-module-dialog {
    .el-dialog__footer {
        width: 100%;
        text-align: center;
        .el-button {
            margin-right: 10px;
        }
    }
    .pagination {
        width: 100%;
        margin-top: 20px;
        text-align: right;
    }
}
.new_step_one {
    .step_item {
        .file_list {
            .upload_box {
                margin: 0 20px 20px 0;
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
                .el-radio {
                    margin: 10px 0;
                }
            }
        }
    }
    .el-input.error {
        .el-input__inner {
            border-color: #ff4949;
        }
    }
    .view-detail {
        .page-no {
            position: absolute;
            top: 14px;
            left: 50%;
            transform: translateX(-50%);
        }
        .view-item-wrap {
            // margin-bottom: 20px;
            min-height: 500px;
            background: #fff url('../../assets/image/default-bg.svg') no-repeat
                center center;
            .el-image {
                min-height: 500px;
            }
            .page {
                text-align: center;
                height: 40px;
                line-height: 40px;
                background: #f4f6f8;
            }
        }
        .el-dialog {
            margin-top: 10vh !important;
        }
        .el-dialog__header {
            background-color: #f4f6f8;
        }
        .el-dialog__body {
            background-color: #f4f6f8;
            padding: 0;
            height: 610px;
            padding-bottom: 20px;
            .el-scrollbar {
                height: 100%;
                .el-image {
                    width: 100%;
                }
                .el-image__error {
                    visibility: hidden;
                }
            }
            img {
                width: 100%;
            }
        }
    }
}
</style>
