<template>
    <div class="contract-template">
        <div class="inner">
            <div class="header-title">
                <div class="txt">合同模板</div>
            </div>
            <header class="header">
                <div class="info">
                    <!-- <Authorized :authrity="$permissionMap.fileTmpSearch"> -->
                    <el-form :model="formData" ref="formData">
                        <el-form-item
                            class="sign-log-title"
                            label="模板名称"
                            prop="tmpName"
                            label-width="70px"
                        >
                            <el-input
                                v-model="formData.tmpName"
                                placeholder="请输入模板名称"
                                maxlength="30"
                            ></el-input>
                        </el-form-item>
                    </el-form>
                    <!-- </Authorized> -->
                </div>
                <div class="header-btn">
                    <!-- <Authorized :authrity="$permissionMap.fileTmpSearch"> -->
                    <el-button
                        size="medium"
                        icon="iconfont icon-chaxun el-icon--left"
                        @click="searchTmp"
                        >查询</el-button
                    >
                    <!-- </Authorized> -->
                    <!-- <Authorized :authrity="$permissionMap.fileTmpSearch"> -->
                    <el-button
                        size="medium"
                        icon="iconfont icon-chongzhi el-icon--left"
                        @click="resetForm('formData')"
                        >重置</el-button
                    >
                    <!-- </Authorized> -->
                </div>
                <!-- <Authorized :authrity="$permissionMap.fileTmpAdd"> -->
                <el-dropdown>
                    <el-button
                        type="primary"
                        class="iconfont icon-xinjian3 right"
                    >
                        添加模板&nbsp;
                        <i class="el-icon-arrow-down"></i>
                    </el-button>
                    <el-dropdown-menu slot="dropdown">
                        <el-dropdown-item>
                            <span @click="uploadTemp">本地上传(Word模板)</span>
                        </el-dropdown-item>
                        <el-dropdown-item>
                            <span @click="createTemp">在线制作(HTML模板)</span>
                        </el-dropdown-item>
                    </el-dropdown-menu>
                </el-dropdown>
                <!-- </Authorized> -->
            </header>
            <!-- table -->
            <div class="table">
                <el-table
                    :data="tableData"
                    :header-cell-style="headerStyleFn"
                    :row-class-name="tableRowClassName"
                >
                    <el-table-column
                        prop="theme"
                        label="模板名称"
                    ></el-table-column>
                    <el-table-column
                        prop="createUserName"
                        label="创建人"
                    ></el-table-column>
                    <el-table-column
                        prop="type"
                        label="模板类型"
                    ></el-table-column>
                    <el-table-column
                        prop="id"
                        label="模板编码"
                    ></el-table-column>
                    <!-- <el-table-column prop="tempPurpose" label="模板用途"></el-table-column> -->
                    <el-table-column
                        prop="gmtCreate"
                        label="创建时间"
                    ></el-table-column>
                    <el-table-column label="操作" width="200">
                        <template slot-scope="scope">
                            <span
                                class="oper-btn"
                                @click="editTemp(scope.$index, scope.row)"
                                >编辑</span
                            >
                            <span
                                class="oper-btn"
                                @click="useTemp(scope.$index, scope.row)"
                                >使用模板</span
                            >
                            <span
                                class="oper-btn"
                                @click="delTemp(scope.$index, scope.row)"
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
                ></el-pagination>
            </div>
        </div>
    </div>
</template>

<script>
import { setRowClass } from '@/mixins/setTableRowClass';
import { mapState } from 'vuex';

export default {
    name: 'contract-template',
    mixins: [setRowClass],
    data() {
        return {
            formData: {
                tmpName: ''
            },
            tableData: [],
            pagination: {
                currentPage: 1,
                pageSize: 10,
                pageSizes: [10, 20, 30, 50],
                total: 0
            },
            fileList: [],
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
    methods: {
        // 模板列表查询
        searchTmp() {
            this.pagination.currentPage = 1;
            this.queryTmp();
        },
        // 添加html模板
        createTemp() {
            this.$message.info('暂未开放，敬请期待！');
            // this.$router.push('addTemplate');
        },
        // 添加模板
        uploadTemp() {
            this.$router.push('uploadTemplate');
        },
        // 查询模板
        queryTmp() {
            let { currentPage, pageSize } = this.pagination;
            this.$api('contractTemplateList')
                .get('getNormal', {
                    currPage: currentPage,
                    pageSize: pageSize,
                    theme: this.formData.tmpName
                })
                .then((res) => {
                    if (!res) return;
                    let data = res.data.data;
                    this.tableData = data.records;
                    this.pagination.total = data.total;
                });
        },
        // 编辑
        editTemp(index, row) {
            let type = row.type;
            if (type === 'HTML') {
                this.$router.push({
                    path: '/fileCenter/detailTemplate',
                    query: {
                        id: row.id
                    }
                });
            }
            if (type === 'word/pdf') {
                this.$router.push({
                    path: 'uploadTemplate',
                    query: {
                        id: row.id
                    }
                });
            }
        },
        // 使用模板
        useTemp(index, row) {
            this.$router.push({
                path: 'uploadTemplate',
                query: {
                    id: row.id,
                    use: '1'
                }
            });
        },
        // 删除模板
        delTemp(index, row) {
            this.$confirm(
                `确定删除合同模板 <span style="color:red;">${row.theme}</span> 吗?`,
                '删除模板',
                {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    dangerouslyUseHTMLString: true,
                    type: 'warning'
                }
            )
                .then(() => {
                    this.$api('delContractTemplate')
                        .delete('deletePath',{},{
                            query: row.id
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
.contract-template {
    padding-right: 14px;
    .inner {
        padding: 0 20px 0;
        .header-title {
            height: 54px;
            line-height: 54px;
            border-bottom: 1px solid #e9e9e9;
            margin-bottom: 10px;
            .txt {
                color: #333;
                font-size: 16px;
            }
        }
        .dialog-box {
            .el-input {
                width: 340px;
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
                &:hover {
                    color: #4a90e2;
                }
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
.contract-template {
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
}
</style>