<template>
    <div class="container-box use-word-template">
        <div class="inner">
            <div class="breadcrumb">
                <el-breadcrumb separator="/">
                    <el-breadcrumb-item to="/fileCenter/fileTmpList"
                        >文件模板</el-breadcrumb-item
                    >
                    <el-breadcrumb-item>使用模板</el-breadcrumb-item>
                </el-breadcrumb>
            </div>
            <div class="tmp-head">
                <el-row class="border">
                    <el-col :span="18">
                        <el-form :inline="true" class="form-two">
                            <el-form-item label="文件名称">
                                <el-input
                                    v-model="templateForm.name"
                                    placeholder="请输入文件名称"
                                    clearable
                                    maxlength="30"
                                ></el-input>
                            </el-form-item>
                        </el-form>
                    </el-col>
                    <el-col :span="6" class="right">
                        <!-- sp3暂不做 -->
                        <!-- <el-button type="primary" @click="saveTemplate">提交</el-button> -->
                    </el-col>
                </el-row>
            </div>
            <div class="file-wrap">
                <div
                    class="pic-item-wrap"
                    v-for="(picItem, key) in fileImgList"
                    :key="key"
                >
                    <div class="pic-item" ref="picItem">
                        <img :src="picItem" class="pic-item-img" alt="模板" />
                        <p class="page" v-if="fileImgList.length">
                            {{ key + 1 }} / {{ totalPage }}
                        </p>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import TextEditor from '@/components/TextEditor';
import FileSaver from 'file-saver';

export default {
    name: 'use-word-template',
    data() {
        return {
            fileInfo: {
                fileCode: ''
            },
            templateForm: {
                num: '', // 模板内容
                name: '', // 模板名称
                purpose: '' // 模板用途
            },
            previewUrl: '',
            fileImgList: [], // 文件图片数组
            totalPage: 0,
            pageLoaded: 0,
            pageCountNow: 2,
            fileContentHeight: 0,
            loadingMore: true,
            fileCode: '',
            fileName: ''
        };
    },
    mounted() {
        let fileCode = this.$route.query.fileCode;
        this.fileName = this.$route.query.fileName;
        this.fileCode = fileCode;
        this.templateForm.name = this.fileName;
        this.getFileInfo(fileCode);
        this.initListenerScroll();
    },
    methods: {
        initListenerScroll() {
            let _self = this;
            $('#useWordTemplate')
                .find('.el-scrollbar__wrap')
                .on('scroll', function(e) {
                    let wrapHeight = $('#useWordTemplate').height();
                    let scrollTop = e.currentTarget.scrollTop;
                    let fileContentHeight = $('.use-word-template').height();
                    if (fileContentHeight - scrollTop < wrapHeight + 600) {
                        if (!_self.loadingMore) return;
                        _self.loadingMore = false;
                        _self.loadMore();
                    }
                });
        },
        // 保存模板
        saveTemplate() {
            if (!this.templateForm.name) {
                this.$message.warning('文件名称不能为空');
                return false;
            }
            this.$api('updateTemplate')
                .patch()
                .then((res) => {
                    let code = res.data.code;
                    if (code === 0) {
                        this.$message.success('保存成功');
                    }
                });
        },
        loadMore() {
            if (this.totalPage - this.pageCountNow >= 3 && this.totalPage > 3) {
                this.pageCountNow += 3;
            } else {
                this.pageCountNow = this.totalPage;
            }
            if (this.pageLoaded >= this.totalPage) return;

            this.getFilePdf(this.fileCode);
        },
        getFileInfo(fileCode) {
            this.$api('queryDocumentDet')
                .post(
                    'postQuery',
                    {},
                    {
                        fileCode: fileCode
                    }
                )
                .then((res) => {
                    if (!res) return;
                    this.fileInfo = res.data.data;
                    this.getOtherInfo();
                });
        },
        getOtherInfo() {
            this.getFileTotalPage(this.fileCode);
        },
        // 获取文件总页数
        getFileTotalPage(fileCode) {
            this.$api('getPicSize')
                .get('getPath', {
                    fileCode: fileCode
                })
                .then((res) => {
                    if (!res) return;
                    let data = res.data.data;
                    this.totalPage = data.totalPageNo;
                    this.loadMore();
                });
        },
        getFilePdf(fileCode) {
            if (this.previewUrl) return;
            let fileCodeNew = fileCode || this.fileCode;
            this.pageLoaded++;
            this.$api('fetch')
                .get('getBlob', {
                    fileCodeNew: fileCodeNew,
                    pageLoaded: this.pageLoaded
                })
                .then((res) => {
                    if (!res) return;
                    let blob = res.data;
                    let url = window.URL.createObjectURL(blob);
                    this.fileImgList.push(url);
                    if (this.pageLoaded < this.pageCountNow) {
                        this.getFilePdf();
                    } else {
                        this.loadingMore = true;
                    }
                });
        }
    },
    beforeRouteLeave(to, from, next) {
        // ...
        $('#useWordTemplate')
            .find('.el-scrollbar__wrap')
            .unbind();
        next();
    },
    // 初始化
    components: {
        TextEditor
    }
};
</script>

<style lang="scss" scoped>
.use-word-template {
    margin-top: 0;
    .breadcrumb {
        height: 54px;
        line-height: 54px;
        .el-breadcrumb {
            line-height: inherit;
        }
    }
    .editor {
        height: 500px;
        border: 1px solid #e3e3e3;
    }
    .form-one {
        .el-form-item {
            margin-bottom: 10px;
        }
    }
    .right {
        text-align: right;
    }
    .file-wrap {
        background: rgb(224, 222, 222);
        .pic-item-wrap {
            padding-top: 10px;
            width: 80%;
            position: relative;
            margin: 0 auto;
            .pic-item-img {
                width: 100%;
            }
            .page {
                text-align: center;
            }
        }
    }
}
</style>
<style lang="scss">
.use-word-template {
    .el-form--inline {
        .el-form-item {
            margin-right: 30px;
            .el-input--suffix {
                .el-input__inner {
                    width: 300px;
                }
            }
        }
    }
    .border {
        border: 1px solid transparent;
    }
}
</style>
