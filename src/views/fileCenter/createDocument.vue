<template>
    <div class="container-box createDocument">
        <div class="inner">
            <div class="breadcrumb">
                <el-breadcrumb separator="/">
                    <el-breadcrumb-item to="/fileCenter/fileTmpList"
                        >文件模板</el-breadcrumb-item
                    >
                    <el-breadcrumb-item>生成文件</el-breadcrumb-item>
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
                        <el-button type="primary" @click="createDocument"
                            >生成文件</el-button
                        >
                    </el-col>
                </el-row>
            </div>
            <text-editor
                :serverUrl="serverUrl"
                :picData="picData"
                :viewUrl="viewUrl"
                v-model="content"
                @input="editorInput"
                ref="editor"
            >
            </text-editor>
        </div>
    </div>
</template>

<script>
import TextEditor from '@/components/TextEditor';

export default {
    name: 'createDocument',
    data() {
        return {
            templateForm: {
                name: '', // 模板名称
                purpose: '' // 模板用途
            },
            templateCont: '',
            serverUrl: '', // 图片上传服务器地址
            picData: {}, // 其它数据
            viewUrl: '', // 图片预览地址
            content: '' // 文本内容
            // toolbar: ["undo redo"] // 页面私有化定制
        };
    },
    created() {
        this.queryTemplate();
    },
    methods: {
        editorInput(cont) {
            this.templateCont = cont;
        },
        // 查询模板
        queryTemplate() {
            this.$api('getTemplate')
                .get('getNormal', {
                    id: this.$route.query.id
                })
                .then((res) => {
                    if (!res) return;
                    let data = res.data.data;
                    this.templateForm.name = data.tempName;
                    this.content = data.tempHtml;
                });
        },
        // 生成文件
        createDocument() {
            if (!this.templateForm.name) {
                this.$message.warning('模板名称不能为空');
                return false;
            }
            if (this.content === '') {
                this.$message.warning('模板内容不能为空');
                return false;
            }
            this.$api('genTemplate')
                .patch('patchNormal', {
                    id: this.$route.query.id,
                    tempHtml: `<html><body>${this.content}</body></html>`,
                    tempName: this.templateForm.name,
                    // tempPurpose: this.templateForm.purpose,
                    contentType: 'json'
                })
                .then((res) => {
                    console.log(this.$route.query.id);
                    console.log(res);
                    let code = res.data.code;
                    if (code === 0) {
                        this.$message.success('生成文件成功');
                    }
                });
        }
    },
    // 初始化
    components: {
        TextEditor
    }
};
</script>

<style lang="scss" scoped>
.createDocument {
    margin-top: 0;
    .breadcrumb {
        height: 54px;
        line-height: 54px;
        .el-breadcrumb {
            line-height: inherit;
        }
        .border {
            border: 1px solid transparent;
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
}
</style>
<style lang="scss">
.createDocument {
    .el-form--inline {
        .el-form-item {
            margin-right: 30px;
            .el-input--suffix {
                .el-input__inner {
                    width: 280px;
                }
            }
        }
    }
    .border {
        border: 1px solid transparent;
    }
}
</style>



