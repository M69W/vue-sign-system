<template>
    <div class="new_step_one">
        <div class="step_item">
            <div class="title">
                上传合同
                <span class="desc"
                    >温馨提示：仅支持.doc、docx、pdf、xls、xlsx格式、图片格式，文件&lt;20MB</span
                >
            </div>

            <!-- TODO 添加合同 -->
            <div class="file_list">
                <div
                    class="file_box"
                    v-for="(item, index) in fileList"
                    :key="index"
                >
                    <div class="img_box">
                        <div class="img_box_inner">
                            <!-- <img :src="`${baseUrl}/document/scan/page/${item.fileCode}/1`" alt /> -->
                            <el-image
                                :src="
                                    `${baseUrl}/document/scan/page/${item.fileCode}/1`
                                "
                            >
                                <div slot="placeholder" class="img-placeholder">
                                    <img
                                        src="../../../../assets/image/default-bg.svg"
                                        alt
                                    />
                                </div>
                                <div slot="error" class="img-error">
                                    <img
                                        src="../../../../assets/image/default-bg.svg"
                                        alt
                                    />
                                    <!-- <p class="img-loading-error">加载失败...</p> -->
                                </div>
                            </el-image>
                        </div>
                        <div class="mask">
                            <i
                                class="iconfont icon-shanchuheise"
                                title="删除"
                                @click="delFile(item, index, '01')"
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
                            ></i>
                        </div>
                        <el-progress
                            :percentage="uploadProgress"
                            class="progress"
                            :show-text="false"
                            v-show="uploadIndex === index"
                        ></el-progress>
                    </div>
                    <p :title="item.fileName">
                        <span class="desc">{{ item.fileName }}</span>
                        <span class="page">({{ item.pageTotal }}页)</span>
                    </p>
                </div>
                <div class="upload-box">
                    <el-upload
                        :action="uploadUrl"
                        :on-progress="handleProgress"
                        class="upload_box"
                        accept=".doc, .docx, .pdf, .xls, .xlsx, image/*"
                        :headers="uploadHeaders"
                        :show-file-list="false"
                        :before-upload="beforeUpload"
                        :on-success="uploadSuccess"
                        :on-error="uploadFail"
                    >
                        <i class="iconfont icon-jiahao" ref="upload"></i>
                        <p class="upload_desc">添加合同</p>
                    </el-upload>
                    <div class="mask" @click="addFile"></div>
                </div>
            </div>

            <!-- TODO 添加附件 -->
            <div class="accessory_container">
                <div class="uploadAss_box">
                    <div class="uploadAss_main" @click="addAccessory">
                        <i class="iconfont icon-tianjiafujianhuise">
                            <span class="add">添加附件</span>
                        </i>
                    </div>
                    <span class="uploadAss_desc"
                        >（仅供参与方查阅，不用于签署）</span
                    >
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
                        ></i>
                    </div>
                </div>
            </div>
        </div>

        <!-- TODO 添加合同信息 -->
        <div class="step_item">
            <div class="title">添加合同信息</div>
            <el-form
                label-width="100px"
                :model="contractForm"
                label-position="left"
                class="info_form"
                ref="infoForm"
            >
                <el-form-item
                    label="合同主题"
                    :rules="[
                        {
                            required: true,
                            trigger: 'blur',
                            message: '请输入合同主题'
                        }
                    ]"
                    prop="compactTheme"
                    class="compact-theme"
                >
                    <el-input
                        v-model="contractForm.compactTheme"
                        placeholder="请输入合同主题"
                        maxlength="100"
                    ></el-input>
                </el-form-item>
                <el-form-item label="合同有效期">
                    <el-date-picker
                        v-model="contractForm.validityEndDate"
                        type="date"
                        :picker-options="pickerOptions"
                        placeholder="选择日期"
                        value-format="yyyy/MM/dd"
                        format="yyyy/MM/dd"
                    ></el-date-picker>
                    <p class="date_desc">合同到期前，系统提醒您</p>
                </el-form-item>
                <el-form-item label="签署截止日期">
                    <el-date-picker
                        v-model="contractForm.signDeadline"
                        type="date"
                        :picker-options="pickerOptions"
                        placeholder="选择日期"
                        value-format="yyyy/MM/dd"
                        format="yyyy/MM/dd"
                    ></el-date-picker>
                    <p class="date_desc">所有签署方必须在截止时间前完成</p>
                </el-form-item>
                <el-form-item label="备注" class="remark">
                    <el-input
                        v-model="contractForm.remark"
                        type="textarea"
                        :rows="3"
                        placeholder="请添加备注"
                        maxlength="500"
                    ></el-input>
                </el-form-item>
            </el-form>
        </div>
        <div class="btn_wrap">
            <el-button type="info" plain @click="$router.go(-1)"
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
            top="10vh"
        >
            <el-scrollbar>
                <!-- <img
                    src="../../../../assets/image/filetest/01.png"
                    alt
                    v-for="(item, index) in total"
                    :key="index"
                />-->
                <!-- :src="require('../../../../assets/image/filetest/01.png')" -->
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
                            <img
                                src="../../../../assets/image/default-bg.svg"
                                alt
                            />
                        </div>
                        <div slot="error" class="img-error">
                            <img
                                src="../../../../assets/image/default-bg.svg"
                                alt
                            />
                            <!-- <p class="img-loading-error">加载失败...</p> -->
                        </div>
                    </el-image>
                    <p class="page-no" :key="-index - 1">
                        {{ index + 1 }}/{{ viewItem.pageTotal }}
                    </p>
                </template>
            </el-scrollbar>
        </el-dialog>
    </div>
</template>

<script>
import { sessionStore } from '@/utils';

export default {
    data() {
        return {
            baseUrl: process.env.NODE_ENV === 'development' ? '/apis' : '/sign',
            fileList: [], // 文件列表
            accessoryList: [], // 附件列表
            uploadUrl: '', // 上传地址
            isReUpload: false, // 是否是重新上传
            fileType: '01', // 01 合同文件  02 附件
            uploadIndex: 0, // 当前操作的合同文件索引
            assIndex: 0, // 当前操作的附件索引
            uploadProgress: 0, // 上传进度
            canUpload: true, // 是否可以上传，防止出错
            contractForm: {
                compactTheme: ''
            },
            viewDetailVisible: false,
            viewItem: {},
            load: true,
            currPage: 1,
            nowPage: 2,
            userId: sessionStore.get('userInfo').id,
            pickerOptions: {
                disabledDate(val) {
                    return val.getTime() < Date.now();
                }
            },
            uploadHeaders: {
                session_token: sessionStore.get('userInfo').sessionToken
            },
            contractId: ''
        };
    },
    async created() {
        this.uploadUrl = `${this.baseUrl}/contract/upload?userId=${this.userId}`;
        this.contractId = this.$route.query.contractId;
        if (this.contractId) {
            // 如果query带了contractId，查询合同信息
            await this.getContractInfo();
        }
        let contractForm = sessionStore.get('contractForm');
        if (contractForm) {
            this.contractForm = Object.assign(
                {},
                this.contractForm,
                contractForm
            );
        }
        this.contractForm.contractId = this.contractId;
        if (
            this.contractForm.contractFileList &&
            this.contractForm.contractFileList.length
        ) {
            this.fileList = this.contractForm.contractFileList.filter(
                (v) => v.fileType === '01'
            );
            this.accessoryList = this.contractForm.contractFileList.filter(
                (v) => v.fileType === '02'
            );
        }
    },
    methods: {
        // 获取合同信息
        async getContractInfo() {
            let res = await this.$api('restartContract').post(
                'postQuery',
                {},
                {
                    contractId: this.contractId
                }
            );
            if (!res) return;
            this.contractForm = Object.assign(
                {},
                this.contractForm,
                res.data.data
            );
        },
        // 添加合同文件
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
            this.uploadIndex = index;
            this.setUploadStatus('01', true, item);
        },
        // 设置上传信息和状态
        setUploadStatus(fileType, isReUpload = false, item = null) {
            if (!this.canUpload) {
                this.$message.error('请等待前面文件上传完成');
                return false;
            }
            if (isReUpload) {
                this.uploadUrl = `${this.baseUrl}/contract/reUpload?userId=${this.userId}&fileCode=${item.fileCode}`;
            } else {
                this.uploadUrl = `${this.baseUrl}/contract/upload?userId=${this.userId}`;
            }
            this.fileType = fileType;
            this.isReUpload = isReUpload;
            this.$refs.upload.click();
        },
        beforeUpload(file) {
            console.log(file);
            if (file.size > 20 * 1024 * 1024) {
                this.$message.error('文件大小不能超过20M');
                return false;
            }
            this.$store.commit('showLoading');
            // 格式化文件名
            let nameList = file.name.split('.');
            nameList[nameList.length - 1] = 'pdf';
            let name = nameList.join('.');
            // 防止重复请求
            this.canUpload = false;
            if (this.fileType === '02') {
                // 选中文件,先推入一项占位
                this.accessoryList.push({
                    fileName: name,
                    fileType: '02'
                });
                this.assIndex = this.accessoryList.length - 1;
                return true;
            }
            if (!this.isReUpload) {
                // 选中文件,先推入一项占位
                this.fileList.push({
                    fileName: name,
                    fileType: '01'
                });
                this.uploadIndex = this.fileList.length - 1;
                if (
                    this.fileList.length > 0 &&
                    !this.contractForm.compactTheme
                ) {
                    this.contractForm.compactTheme = this.fileList[0].fileName;
                }
            }
        },
        // 上传进度
        handleProgress(event, file, fileList) {
            this.uploadProgress = event.percent;
        },
        // 上传成功
        uploadSuccess(res, file, fileList) {
            if (res.code === 0) {
                this.$message.success('上传成功！');
                let data = res.data;
                data.pageTotal = data.filePage;
                delete data.filePage;
                if (this.fileType === '01') {
                    this.fileList[this.uploadIndex] = Object.assign(
                        this.fileList[this.uploadIndex],
                        data
                    );
                } else {
                    this.accessoryList[this.assIndex] = Object.assign(
                        this.accessoryList[this.assIndex],
                        data
                    );
                }
            } else {
                if (this.fileType === '01') {
                    this.fileList.splice(this.uploadIndex, 1);
                } else {
                    this.accessoryList.splice(this.uploadIndex, 1);
                }
                this.$message.error('文件上传失败');
            }
            this.resetUploadStatus();
        },
        // 上传失败
        uploadFail(res, file, fileList) {
            if (this.fileType === '01') {
                this.fileList.splice(this.uploadIndex, 1);
            } else {
                this.accessoryList.splice(this.uploadIndex, 1);
            }
            this.$message.error('文件上传失败');
            this.resetUploadStatus();
        },
        // 重置上传信息和状态
        resetUploadStatus() {
            this.$store.commit('hideLoading');
            this.isReUpload = false;
            this.canUpload = true;
            setTimeout(() => {
                this.assIndex = -1;
                this.uploadIndex = -1;
                this.uploadProgress = 0;
            }, 200);
        },
        // 删除文件
        async delFile(item, index, type) {
            let res = await this.$api('delContractFile').post(
                'postQuery',
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
            // let el = document.querySelector('.view-detail .el-scrollbar__wrap');
            // el.addEventListener('scroll', () => {
            //     this.scrollEvent(el);
            // });
        },
        // scrollEvent(el) {
        //     let canScroll = el.scrollHeight - el.clientHeight;
        //     if (canScroll - el.scrollTop < 20) {
        //         if (this.load) {
        //             this.load = false;
        //             console.log('load More');
        //             this.nowPage++;
        //             this.currPage++;
        //             setTimeout(() => {
        //                 this.load = true;
        //             }, 1000);
        //         }
        //     }
        // }
        next() {
            if (this.fileList.length === 0) {
                return this.$message.error('请上传合同再进行下一步');
            }
            this.$refs.infoForm.validate((valid) => {
                if (!valid) return;
                let contractFileList = this.fileList.concat(this.accessoryList);
                this.contractForm = Object.assign({}, this.contractForm, {
                    contractFileList
                });
                sessionStore.set('contractForm', this.contractForm);
                this.$router.push('step2');
            });
        }
    }
};
</script>

<style lang="scss" scoped>
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
                .mask {
                    position: absolute;
                    left: 0;
                    top: 0;
                    right: 0;
                    bottom: 0;
                    cursor: pointer;
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
    }
    .btn_wrap {
        padding-left: 100px;
        .el-button {
            margin: 0;
            margin-right: 10px;
            width: 100px;
        }
    }
}
</style>
<style lang="scss">
.new_step_one {
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
}
</style>
