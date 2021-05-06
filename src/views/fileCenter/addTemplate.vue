<template>
    <div class="container-box addTemplate">
        <div class="inner">
            <div class="breadcrumb">
                <el-breadcrumb separator="/">
                    <el-breadcrumb-item to="/fileCenter/fileTmpList"
                        >文件模板</el-breadcrumb-item
                    >
                    <el-breadcrumb-item>添加模板</el-breadcrumb-item>
                </el-breadcrumb>
            </div>
            <div class="tmp-head">
                <el-row class="border">
                    <el-col :span="18">
                        <el-form :inline="true" class="form-two">
                            <el-form-item label="模板名称">
                                <el-input
                                    v-model="templateForm.name"
                                    placeholder="请输入模板名称"
                                    clearable
                                    maxlength="30"
                                ></el-input>
                            </el-form-item>
                            <el-form-item label="模板用途">
                                <el-input
                                    v-model="templateForm.purpose"
                                    placeholder="请输入模板用途"
                                    clearable
                                    maxlength="30"
                                ></el-input>
                            </el-form-item>
                        </el-form>
                    </el-col>
                    <el-col :span="6" class="right">
                        <el-button type="primary" @click="createTmp"
                            >生成模板</el-button
                        >
                    </el-col>
                </el-row>
            </div>
            <div class="edit-area">
                <text-editor
                    :serverUrl="serverUrl"
                    :picData="picData"
                    :viewUrl="viewUrl"
                    v-model="content"
                    @input="editorInput"
                    ref="editor"
                >
                </text-editor>
                <!-- :toolbar="toolbar" 私有化定制需加上该属性-->
            </div>
        </div>
    </div>
</template>

<script>
import TextEditor from '@/components/TextEditor';

export default {
    name: 'addTemplate',
    data() {
        return {
            templateForm: {
                name: '', // 模板名称
                purpose: '' // 模板用途
            },
            control: {
                txt: '',
                family: '',
                size: '',
                border: ''
            },
            options1: [
                {
                    value: '1',
                    label: '宋体'
                },
                {
                    value: '2',
                    label: '新宋体'
                },
                {
                    value: '3',
                    label: '黑体'
                },
                {
                    value: '4',
                    label: '楷体'
                }
            ],
            options2: [
                {
                    value: '1',
                    label: '12号'
                },
                {
                    value: '2',
                    label: '14号'
                },
                {
                    value: '3',
                    label: '16号'
                },
                {
                    value: '4',
                    label: '18号'
                },
                {
                    value: '5',
                    label: '20号'
                }
            ],
            options3: [
                {
                    value: '1',
                    label: '所有边框'
                },
                {
                    value: '2',
                    label: '下边框'
                },
                {
                    value: '3',
                    label: '无边框'
                }
            ],
            templateCont: '',
            serverUrl: '', // 图片上传服务器地址
            picData: {}, // 其它数据
            viewUrl: '', // 图片预览地址
            content: '', // 文本内容
            // toolbar: ["print"], // 页面私有定制
            txtNum: 1
        };
    },
    methods: {
        editorInput(cont) {
            this.templateCont = cont;
            console.log(tinyMCE);
            console.log(tinyMCE.activeEditor.execCommand);
        },
        // 创建模板
        createTmp() {
            if (!this.templateForm.name) {
                this.$message.warning('模板名称不能为空');
                return false;
            }
            if (!this.templateForm.purpose) {
                this.$message.warning('模板用途不能为空');
                return false;
            }
            if (this.content === '') {
                this.$message.warning('模板内容不能为空');
                return false;
            }
            this.$api('addAppBackInfoTmp')
                .post('postNormal', {
                    tempHtml: `<html><body>${this.templateCont}</body></html>`, // 模板内容
                    tempName: this.templateForm.name, // 模板名称
                    tempPurpose: this.templateForm.purpose // 模板用途
                })
                .then((res) => {
                    if (!res) return;
                    this.$message.success('保存成功');
                    setTimeout(() => {
                        this.$router.push('fileTmpList');
                    }, 1000);
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
.addTemplate {
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
    .edit-area {
        position: relative;
    }
}
</style>
<style lang="scss">
.addTemplate {
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
    .tox-toolbar {
        border-bottom: 1px solid #ccc;
    }
    .tox-sidebar-wrap {
        background-color: #f4f6f8;
        .tox-edit-area {
            // margin: 0 360px;
            border-top: none;
        }
    }
    .border {
        border: 1px solid transparent;
    }
}
</style>



