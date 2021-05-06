<template>
    <div class="fileTmpList">
        <div class="inner">
            <div class="breadcrumb">
                <el-breadcrumb separator="/">
                    <el-breadcrumb-item>文件模板</el-breadcrumb-item>
                </el-breadcrumb>
            </div>
            <header class="header">
                <div class="info">
                    <Authorized :authrity="$permissionMap.fileTmpSearch">
                        <el-form :model="formDatas" ref="formDatas">
                            <el-form-item
                                class="sign-log-title"
                                label="模板名称"
                                prop="tmpName"
                                label-width="70px"
                            >
                                <el-input
                                    v-model="formDatas.tmpName"
                                    placeholder="请输入模板名称"
                                    maxlength="30"
                                ></el-input>
                            </el-form-item>
                        </el-form>
                    </Authorized>
                </div>
                <div class="header-btn">
                    <Authorized :authrity="$permissionMap.fileTmpSearch">
                        <el-button
                            size="medium"
                            icon="iconfont icon-chaxun el-icon--left"
                            @click="searchTmp"
                            >查询</el-button
                        >
                    </Authorized>
                    <Authorized :authrity="$permissionMap.fileTmpSearch">
                        <el-button
                            size="medium"
                            icon="iconfont icon-chongzhi el-icon--left"
                            @click="resetForm('formDatas')"
                            >重置</el-button
                        >
                    </Authorized>
                </div>
                <Authorized :authrity="$permissionMap.fileTmpAdd">
                    <el-dropdown>
                        <el-button
                            type="primary"
                            class="iconfont icon-xinjian3 right"
                            >添加模板&nbsp;<i class="el-icon-arrow-down"></i
                        ></el-button>
                        <el-dropdown-menu slot="dropdown" class="dropdown-list">
                            <el-dropdown-item>
                                <span @click="createTemp"
                                    >在线制作(Html模板)</span
                                >
                            </el-dropdown-item>
                            <el-dropdown-item>
                                <span @click="uploadTemp">本地上传</span>
                            </el-dropdown-item>
                        </el-dropdown-menu>
                    </el-dropdown>
                </Authorized>
            </header>
            <!-- table -->
            <div class="table">
                <el-table
                    :data="tableData"
                    :header-cell-style="headerStyleFn"
                    :row-class-name="tableRowClassName"
                >
                    <el-table-column
                        prop="templateName"
                        label="模板名称"
                    ></el-table-column>
                    <el-table-column
                        prop="nickName"
                        label="创建人"
                    ></el-table-column>
                    <el-table-column
                        prop="templateType"
                        label="模板类型"
                    ></el-table-column>
                    <el-table-column
                        prop="templateCode"
                        label="模板编码"
                    ></el-table-column>
                    <!-- <el-table-column
                        prop="tempPurpose"
                        label="模板用途"
                    ></el-table-column> -->
                    <el-table-column
                        prop="createDate"
                        label="创建时间"
                    ></el-table-column>
                    <el-table-column label="操作" width="200">
                        <template slot-scope="scope">
                            <span
                                class="oper-btn"
                                @click="editTemp(scope.row)"
                                >编辑</span
                            >
                            <span
                                class="oper-btn"
                                @click="useTemp(scope.row)"
                                v-if="scope.row.templateType==='word/pdf'"
                                >使用模板</span
                            >
                            <span
                                class="oper-btn"
                                @click="delTmp(scope.$index, scope.row)"
                                >删除</span
                            >
                        </template>
                    </el-table-column>
                </el-table>
            </div>

            <!-- 分页 -->
            <div class="pagination">
                <el-pagination
                    :page-size.sync="pagination.pageSize"
                    :page-sizes.sync="pagination.pageSizes"
                    :current-page.sync="pagination.currentPage"
                    :total="pagination.total"
                    @size-change="sizeChange"
                    @current-change="currentChange"
                    layout="total,sizes,prev, pager, next,jumper"
                >
                </el-pagination>
            </div>
        </div>
    </div>
</template>

<script>
import { setRowClass } from '@/mixins/setTableRowClass';
import { mapState } from 'vuex';
import { refreshMenuItem } from '@/mixins/clickMenuItemForRefresh';

export default {
    name: 'fileTmpList',
    mixins: [setRowClass, refreshMenuItem],
    data() {
        return {
            formDatas: {
                tmpName: ''
            },
            formData: null,
            tableData: [],
            pagination: {
                currentPage: 1,
                pageSize: 10,
                pageSizes: [10, 20, 50, 100],
                total: 0
            },
            dialogUploadVisible: false,
            fileList: [],
            form: {
                formData: ''
            },
            // form 规则
            rules: {
                formData: [
                    {
                        required: true,
                        message: '请上传模板文件',
                        trigger: 'blur'
                    },
                    {
                        validator: function(rule, value, callback) {
                            if (!value) {
                                callback(new Error('请上传模板文件'));
                            } else {
                                callback();
                            }
                        },
                        trigger: 'blur'
                    }
                ]
            },
            headerStyleFn() {
                return {
                    background: '#4A90E2',
                    color: '#fff'
                };
            }
        };
    },
    created() {
        this.queryTmp();
    },
    computed: {
        ...mapState({
            uploadFileSize(state) {
                return state.settings.uploadFileSize;
            }
        })
    },
    watch: {
        isSameMenu(newVal, oldVal) {
            this.resetForm('formDatas');
        }
    },
    methods: {
        // 模板列表查询
        searchTmp() {
            this.pagination.currentPage = 1;
            this.queryTmp();
        },
        // 添加html模板
        createTemp() {
            this.$router.push('addTemplate');
        },
        // 添加模板
        uploadTemp() {
            this.$router.push('uploadTemplate?isFile=1')
        },
        // 关闭弹窗前的回调
        closeUploadDialog() {
            this.dialogUploadVisible = false;
            this.fileList = [];
            this.formData = null;
            this.$refs.form.resetFields();
        },
        uploadFaild(err) {
            this.$message.error({
                message: err.msg,
                customClass: 'zZindex'
            });
        },
        resetFile(options) {
            let file = options.file;
            let formdata = new FormData();
            formdata.append('signFile', file);
            this.form.formData = formdata;
            this.$refs.form.clearValidate('formData');
        },
        // 移除文件后的回调
        onRemove() {
            this.$refs.form.resetFields();
            this.formData = null;
        },
        // 确定上传
        sureUpload(formName) {
            this.$refs[formName].validate((valid) => {
                if (valid) {
                    this.$api('importWord')
                        .post('postFormData', this.form.formData)
                        .then((res) => {
                            if (!res) return;
                            console.log(res);
                            this.queryTmp();
                            this.cancelUpload();
                        });
                } else {
                    console.log('error submit!!');
                    return false;
                }
            });
        },
        cancelUpload() {
            this.dialogUploadVisible = false;
            this.closeUploadDialog();
        },
        // 查询模板
        async queryTmp() {
            let { currentPage, pageSize } = this.pagination;
            // this.$api('getTemplateList')
            //     .get('getNormal', {
            //         currPage: currentPage,
            //         pageSize: pageSize,
            //         tempName: this.formDatas.tmpName
            //     })
            //     .then((res) => {
            //         if (!res) return;
            //         let data = res.data.data;
            //         this.tableData = data.records;
            //         this.pagination.total = data.total;
            //     });
            // v1.3.0  sprint5 
            let res = await this.$api('fileTemplateList').post('postQuery', {}, {
                currPage: currentPage,
                pageSize,
                theme: encodeURIComponent(this.formDatas.tmpName),
                type: ''
            })
            if(!res) return;
            let data = res.data.data;
            this.tableData = data.records;
            this.pagination.total = data.total;
        },
        // 查看
        lookTmp(index, row) {
            let type = row.tempType;
            if (type === 'HTML') {
                this.$router.push({
                    path: '/fileCenter/detailTemplate',
                    query: {
                        id: row.id
                    }
                });
            }
            if (type === 'WORD' || type === 'PDF') {
                this.$router.push({
                    path: '/fileCenter/wordTemplate',
                    query: {
                        fileCode: row.tempHtml,
                        fileName: row.tempName,
                        id: row.id
                    }
                });
            }
        },
        // 删除模板
        delTmp(index, row) {
            this.$confirm(
                `确定删除文件模板 <span style="color:red;">${row.templateName}</span> 吗?`,
                '删除模板',
                {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    dangerouslyUseHTMLString: true,
                    type: 'warning'
                }
            )
                .then(() => {
                    console.log(1111111111111111111111);
                    this.$api('deleteTemplate')
                        .delete('deleteQuery',{},{
                            id: row.id
                        })
                        .then((res) => {
                            if (!res) return;
                            let code = res.data.code;
                            if (code === 0) {
                                this.$message.success('删除成功');
                                this.queryTmp();
                            }
                        });
                })
                .catch(() => {}); // 添加取消后方法，防止控制台报错
        },
        editTemp(row) {
            let path = row.templateType === 'word/pdf' ? 'uploadTemplate' : 'detailTemplate'
            this.$router.push({
                path,
                query: {
                    id: row.id,
                    isFile: 1
                }
            });
        },
        useTemp(row) {
            this.$router.push({
                path: 'uploadTemplate',
                query: {
                    id: row.id,
                    use: '1',
                    isFile: 1
                }
            });
        },
        // 重置
        resetForm(formName) {
            this.$refs[formName].resetFields();
            this.searchTmp();
        },
        sizeChange(pageSize) {
            this.pagination.pageSize = pageSize;
            this.pagination.currentPage = 1;
            this.queryTmp();
        },
        currentChange() {
            this.queryTmp();
        }
    }
};
</script>
<style lang="scss" scoped>
.fileTmpList {
    padding-right: 14px;
    .inner {
        padding: 0 20px 0;
        .dialog-box {
            .el-input {
                width: 340px;
            }
        }
        .breadcrumb {
            .el-breadcrumb {
                height: 54px;
                line-height: 54px;
                font-size: 16px;
                color: #333;
            }
        }
        .header {
            display: flex;
            align-items: center;
            margin-bottom: 18px;
            .info {
                width: 360px;
            }
            .header-btn {
                flex: 1;
                margin-left: 32px;
                text-align: left;
                .el-button {
                    margin-right: 10px;
                }
                .right {
                    float: right;
                    margin-right: 0;
                }
            }
        }
        .pagination {
            margin-top: 15px;
            text-align: right;
        }
        .table {
            .oper-btn {
                margin-right: 16px;
                color: #999;
                cursor: pointer;
            }
        }
    }
    .dialog-upload-file {
        .el-upload-dragger:hover {
            border-color: #4a90e2;
        }
        .file-wrap {
            text-align: center;
            .hand-way {
                font-size: 16px;
                margin-bottom: 10px;
                color: #333;
                span {
                    color: #4a90e2;
                }
            }
            .hand-way-drag {
                font-size: 16px;
                color: #4a90e2;
                margin: 76px 0 10px 0;
                display: none;
            }
            .support-type {
                color: #999 !important;
                font-size: 14px;
            }
        }
        .btns-wrap {
            text-align: center;
            margin-top: 40px;
            .el-button {
                margin-right: 10px;
                width: 80px;
            }
        }
        .review-wrap {
            padding: 0 20px;
            .progress {
                margin: 50px 0 20px 0;
            }
            .loading {
                text-align: center;
            }
            .mention {
                color: #999;
                margin-top: 10px;
                line-height: 30px;
                i {
                    margin-right: 5px;
                }
            }
        }
    }
}
.el-form-item {
    margin: 0;
}
</style>
<style lang="scss">
.fileTmpList {
    .sign-log-title {
        .el-input {
            width: 300px;
        }
    }
    .el-upload-dragger {
        width: 560px;
        &:hover {
            border-color: #4a90e2;
        }
        &.is-dragover {
            border: 1px dashed #4a90e2;
            .icon-tuozhuaiwenjian,
            .hand-way {
                display: none;
            }
            .hand-way-drag {
                display: block;
            }
        }
        .icon-tuozhuaiwenjian {
            margin: 24px 0;
            font-size: 50px;
            color: #999;
        }
    }
    .el-form-item__error {
        width: 100%;
        text-align: center;
    }
}
.dropdown-list {
    li {
        span {
            display: block;
        }
    }
}
</style>