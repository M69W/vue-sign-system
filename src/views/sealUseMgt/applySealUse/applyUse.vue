<template>
    <div class="apply-seal-use">
        <div class="inner">
            <div class="header-title">
                <el-breadcrumb separator="/">
                    <el-breadcrumb-item to="/applySealUse/index"
                        >用印申请</el-breadcrumb-item
                    >
                    <el-breadcrumb-item>申请用印</el-breadcrumb-item>
                </el-breadcrumb>
            </div>
            <div class="content">
                <div class="title">
                    用印文件
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
                                <el-image
                                    :src="
                                        `${baseUrl}/document/scan/page/${item.fileCode}/1`
                                    "
                                >
                                    <div
                                        slot="placeholder"
                                        class="img-placeholder"
                                    >
                                        <img
                                            src="../../../assets/image/default-bg.svg"
                                            alt
                                        />
                                    </div>
                                    <div slot="error" class="img-error">
                                        <img
                                            src="../../../assets/image/default-bg.svg"
                                            alt
                                        />
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
                            <p class="upload_desc">添加文件</p>
                        </el-upload>
                        <div class="mask" @click="addFile"></div>
                    </div>
                </div>

                <el-form
                    label-width="100px"
                    :model="applyForm"
                    label-position="left"
                    class="apply-form"
                    ref="applyForm"
                    :rules="rules"
                >
                    <el-form-item
                        label="申请事由"
                        class="apply-matter"
                        prop="applyCause"
                    >
                        <el-input
                            v-model.trim="applyForm.applyCause"
                            type="textarea"
                            :rows="3"
                            placeholder="请输入申请事由"
                            maxlength="300"
                            show-word-limit
                        ></el-input>
                    </el-form-item>
                    <el-form-item label="印章名称" prop="sealId">
                        <el-select
                            v-model="applyForm.sealId"
                            placeholder="请选择印章"
                        >
                            <el-option
                                v-for="(item, index) in sealList"
                                :key="index"
                                :value="item.id"
                                :label="item.name"
                            ></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="申请次数" prop="applyCount">
                        <el-input
                            v-model.number="applyForm.applyCount"
                            placeholder="请输入申请次数"
                            type="number"
                        ></el-input>
                    </el-form-item>
                    <el-form-item label="失效时间" prop="expireTime">
                        <el-date-picker
                            v-model="applyForm.expireTime"
                            type="datetime"
                            :picker-options="pickerOptions"
                            placeholder="选择失效时间"
                            value-format="yyyy-MM-dd HH:mm"
                            format="yyyy-MM-dd HH:mm"
                        ></el-date-picker>
                    </el-form-item>
                    <el-form-item>
                        <el-button
                            type="primary"
                            class="apply-btn"
                            @click="submitApply"
                            >申请</el-button
                        >
                    </el-form-item>
                </el-form>

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
                                    <img
                                        src="../../../assets/image/default-bg.svg"
                                        alt
                                    />
                                </div>
                                <div slot="error" class="img-error">
                                    <img
                                        src="../../../assets/image/default-bg.svg"
                                        alt
                                    />
                                </div>
                            </el-image>
                            <p class="page-no" :key="-index - 1">
                                {{ index + 1 }}/{{ viewItem.pageTotal }}
                            </p>
                        </template>
                    </el-scrollbar>
                </el-dialog>
            </div>
        </div>
    </div>
</template>

<script>
import { sessionStore, checkIntegral } from '@/utils';

export default {
    data() {
        return {
            baseUrl: process.env.NODE_ENV === 'development' ? '/apis' : '/sign',
            fileList: [], // 文件列表
            uploadUrl: '', // 上传地址
            isReUpload: false, // 是否是重新上传
            uploadIndex: 0, // 当前操作的合同文件索引
            uploadProgress: 0, // 上传进度
            canUpload: true, // 是否可以上传，防止出错
            applyForm: {
                applyCause: '',
                sealId: '',
                applyCount: '',
                expireTime: '',
                contentType: 'json'
            },
            viewDetailVisible: false,
            viewItem: {},
            otherId: '',
            userId: sessionStore.get('userInfo').id,
            pickerOptions: {
                disabledDate(val) {
                    return val.getTime() <= Date.now();
                }
            },
            sealList: [],
            uploadHeaders: {
                session_token: sessionStore.get('userInfo').sessionToken
            },
            rules: {
                applyCause: [
                    {
                        required: true,
                        trigger: 'blur',
                        message: '申请事由不能为空'
                    },
                    {
                        trigger: 'blur',
                        validator(rule, value, callback) {
                            if (!value) {
                                callback(new Error('申请事由不能为空'));
                            } else {
                                callback();
                            }
                        }
                    }
                ],
                sealId: [
                    {
                        required: true,
                        trigger: 'change',
                        message: '请选择印章名称'
                    },
                    {
                        trigger: 'change',
                        validator(rule, value, callback) {
                            if (!value) {
                                callback(new Error('请选择印章名称'));
                            } else {
                                callback();
                            }
                        }
                    }
                ],
                applyCount: [
                    {
                        required: true,
                        trigger: 'blur',
                        message: '申请次数不能为空'
                    },
                    {
                        trigger: 'blur',
                        validator(rule, value, callback) {
                            if (!value) {
                                callback(new Error('申请次数不能为空'));
                            } else if (!checkIntegral(value)) {
                                callback(new Error('申请次数只能为正整数'));
                            } else {
                                callback();
                            }
                        }
                    }
                ],
                expireTime: [
                    {
                        required: true,
                        trigger: 'change',
                        message: '请选择失效时间'
                    },
                    {
                        trigger: 'change',
                        validator(rule, value, callback) {
                            if (!value) {
                                callback(new Error('请选择失效时间'));
                            } else if (+new Date(value) <= +new Date()) {
                                callback(new Error('失效时间须晚于当前时间'));
                            } else {
                                callback();
                            }
                        }
                    }
                ]
            }
        };
    },
    watch: {},
    created() {
        this.getBaiheId();
        this.getSealList();
    },
    methods: {
        // 获取印章列表
        async getSealList() {
            let res = await this.$api('getSealList').get();
            if (!res) return;
            this.sealList = res.data.data.sealList;
        },
        // 添加用印文件
        addFile() {
            if (this.fileList.length >= 100) {
                return this.$message.error('用印文件数量不能超过100个');
            }
            this.setUploadStatus();
        },
        // 重新上传
        reUpload(item, index) {
            this.uploadIndex = index;
            this.setUploadStatus(true, item);
        },
        // 设置上传信息和状态
        setUploadStatus(isReUpload = false, item = null) {
            if (!this.canUpload) {
                this.$message.error('请等待前面文件上传完成');
                return false;
            }
            if (isReUpload) {
                this.uploadUrl = `${this.baseUrl}/contract/reUpload?userId=${this.userId}&fileCode=${item.fileCode}`;
            } else {
                this.uploadUrl = `${this.baseUrl}/contract/upload?userId=${this.userId}`;
            }
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
            if (!this.isReUpload) {
                // 选中文件,先推入一项占位
                this.fileList.push({
                    fileName: name,
                    fileType: '01'
                });
                this.uploadIndex = this.fileList.length - 1;
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
                this.fileList[this.uploadIndex] = Object.assign(
                    this.fileList[this.uploadIndex],
                    data
                );
            } else {
                this.fileList.splice(this.uploadIndex, 1);
                let msg = res.msg || '文件上传失败';
                this.$message.error(msg);
            }
            this.resetUploadStatus();
        },
        // 上传失败
        uploadFail(res, file, fileList) {
            this.fileList.splice(this.uploadIndex, 1);
            this.$message.error('文件上传失败');
            this.resetUploadStatus();
        },
        // 重置上传信息和状态
        resetUploadStatus() {
            this.$store.commit('hideLoading');
            this.isReUpload = false;
            this.canUpload = true;
            setTimeout(() => {
                this.uploadIndex = -1;
                this.uploadProgress = 0;
            }, 200);
        },
        // 删除文件
        async delFile(item, index, type) {
            let res = await this.$api('delContractFile').post(
                'postQuery',
                {},
                { fileCode: item.fileCode }
            );
            if (!res) return;
            // 删除合同文件
            this.fileList.splice(index, 1);
            this.$message.success('删除成功！');
        },
        // 查看详情
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
        // 申请
        submitApply() {
            if (!this.fileList.length)
                return this.$message.error('请上传用印文件！');
            this.$refs.applyForm.validate(async (valid) => {
                if (!valid) return;
                let fileCode = this.fileList.map((v) => v.fileCode).join(',');
                Object.assign(this.applyForm, { fileCode });
                let res = await this.$api('addUseSeal').post(
                    'postNormal',
                    this.applyForm
                );
                if (!res) return;
                let code = res.data.code;
                if (code === 10012 && !this.otherId) {
                    this.$message.warning(
                        '暂无数据，请先登录后台同步章数据至白鹤平台！'
                    );
                    return;
                } else if (code === 10012 && this.otherId) {
                    this.$message.warning(
                        '暂无签名，请先登录到白鹤平台创建签名！'
                    );
                    return;
                }
                this.$message.success('提交用印申请成功！');
                this.$router.push('index');
            });
        },
        // 获取白鹤ID
        getBaiheId() {
            let userInfo = sessionStore.get('userInfo');
            this.$api('info')
                .get('getPath', {
                    userId: userInfo.id
                })
                .then((res) => {
                    let otherId = res.data.data.otherId;
                    this.otherId = otherId;
                });
        }
    }
};
</script>

<style lang="scss" scoped>
.apply-seal-use {
    .inner {
        padding: 0 20px 20px;
        background-color: #fff;
        .header-title {
            border-bottom: 1px solid #e9e9e9;
            .el-breadcrumb {
                &__item {
                    line-height: 54px;
                }
            }
        }
        .content {
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
            .apply-btn {
                width: 100px;
            }
        }
    }
}
</style>
<style lang="scss">
.apply-seal-use {
    .inner {
        .content {
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
            .apply-form.el-form {
                .el-form-item {
                    width: 460px;
                    position: relative;
                    .el-date-editor,
                    .el-select {
                        width: 100%;
                    }
                    &.apply-matter {
                        width: 800px;
                    }
                    .el-textarea .el-input__count {
                        right: -48px;
                        bottom: -5px;
                    }
                }
            }
        }
    }
}
</style>