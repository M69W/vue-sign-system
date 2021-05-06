<template>
    <div class="container-box myContract">
        <div class="inner">
            <div class="header">
                <el-row>
                    <Authorized :authrity="$permissionMap.myContractNewBtn">
                        <el-button
                            type="primary"
                            size="small"
                            class="iconfont icon-xinjian3"
                            @click="newBtn"
                            >&nbsp;新建</el-button
                        >
                    </Authorized>
                </el-row>
            </div>
            <!-- table -->
            <div class="table">
                <el-table
                    :data="tableData"
                    ref="sealTable"
                    tooltip-effect="dark"
                    class="no-border-bottom"
                    style="width: 100%"
                    :row-class-name="tableRowClassName"
                    :header-cell-style="headerStyleFn"
                >
                    <el-table-column
                        show-overflow-tooltip
                        prop="applicationName"
                        label="应用名称"
                        min-width="100"
                    ></el-table-column>
                    <el-table-column
                        prop="userAppId"
                        label="APPID"
                    ></el-table-column>
                    <el-table-column
                        prop="userAppSceret"
                        label="APPSECERT"
                    ></el-table-column>
                    <el-table-column
                        show-overflow-tooltip
                        prop="createUserName"
                        label="创建人"
                    ></el-table-column>
                    <el-table-column
                        show-overflow-tooltip
                        prop="createTime"
                        label="创建时间"
                        width="200"
                    ></el-table-column>
                    <el-table-column
                        show-overflow-tooltip
                        prop="createEnName"
                        label="所属单位"
                    ></el-table-column>
                    <el-table-column label="状态" width="100">
                        <template slot-scope="scope">
                            <span>{{
                                scope.row.applicationAbled === 0
                                    ? '启用'
                                    : '已禁用'
                            }}</span>
                        </template>
                    </el-table-column>
                    <el-table-column label="操作" width="120">
                        <template slot-scope="scope">
                            <span
                                class="table-btn"
                                @click="deletedList(scope.$index, scope.row)"
                                type="text"
                                size="small"
                                >删除</span
                            >
                            <span
                                class="table-btn"
                                type="text"
                                size="small"
                                @click="switchBtn(scope.$index, scope.row)"
                            >
                                {{
                                    scope.row.applicationAbled === 0
                                        ? '禁用'
                                        : '启用'
                                }}
                            </span>
                        </template>
                    </el-table-column>
                </el-table>
            </div>
            <!-- /table -->

            <!-- 应用管理-新建 -->
            <el-dialog
                title="添加应用"
                :visible.sync="showDialog"
                :before-close="resetDialogData"
            >
                <el-form
                    class="demo-ruleForm"
                    ref="form"
                    :rules="rules"
                    :model="form"
                    label-width="120px"
                >
                    <el-form-item label="应用名称" prop="applicationName">
                        <el-input
                            v-model="form.applicationName"
                            autocomplete="off"
                            placeholder="最多输入30字符"
                            maxlength="30"
                        ></el-input>
                    </el-form-item>
                    <el-form-item label="应用描述" prop="applicationDesc">
                        <el-input
                            class="textarea-box"
                            type="textarea"
                            v-model="form.applicationDesc"
                            autocomplete="off"
                            placeholder="最多输入300字符"
                            maxlength="300"
                        ></el-input>
                    </el-form-item>
                    <el-form-item>
                        <el-button @click="cancelBtn">取消</el-button>
                        <el-button type="primary" @click="submitForm('form')"
                            >提交并获取AppID</el-button
                        >
                    </el-form-item>
                </el-form>
            </el-dialog>

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
import { refreshMenuItem } from '@/mixins/clickMenuItemForRefresh';

export default {
    name: 'myContract',
    mixins: [setRowClass, refreshMenuItem],
    data() {
        return {
            tableData: [],
            showDialog: false,
            form: {
                applicationName: '',
                applicationDesc: ''
            },
            // form 规则
            rules: {
                applicationName: [
                    {
                        required: true,
                        message: '请输入应用名称',
                        trigger: 'blur'
                    },
                    {
                        validator: function(rule, value, callback) {
                            if (!value) {
                                callback(new Error('请输入应用名称'));
                            } else {
                                callback();
                            }
                        },
                        trigger: 'blur'
                    }
                ]
            },
            pagination: {
                currentPage: 1,
                pageSize: 10,
                pageSizes: [10, 20, 50, 100],
                total: 0
            },
            headerStyleFn(row, column, rowIndex) {
                return {
                    background: '#4A90E2',
                    color: '#fff'
                };
            }
        };
    },
    created() {
        this.queryList();
    },
    watch: {
        isSameMenu(newVal, oldVal) {
            this.queryList();
        }
    },
    methods: {
        // 查询应用管理列表
        queryList() {
            this.$api('getApplicationList')
                .get('getNormal', {
                    currPage: this.pagination.currentPage,
                    pageSize: this.pagination.pageSize
                })
                .then((res) => {
                    if (!res) return;
                    let data = res.data.data;
                    this.tableData = data.records;
                    this.pagination.total = data.total;
                });
        },
        newBtn() {
            this.showDialog = true;
        },
        // 新增应用名称
        submitForm(formName) {
            this.$refs[formName].validate((valid) => {
                if (valid) {
                    console.log(this.form);
                    this.$api('addAppBackInfo')
                        .post('postNormal', {
                            applicationName: this.form.applicationName
                        })
                        .then((res) => {
                            if (!res) return;
                            this.showDialog = false;
                            this.$refs.form.resetFields();
                            this.$message.success('添加成功');
                            this.queryList();
                        });
                } else {
                    console.log('error submit!!');
                    return;
                }
            });
        },
        // 删除应用名称
        deletedList(index, row) {
            this.$confirm(
                `确定要删除应用名称为 <span style="color:red">${row.applicationName}</span> 吗？`,
                '提示',
                {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    dangerouslyUseHTMLString: true,
                    type: 'warning'
                }
            )
                .then(() => {
                    this.$api('deleteApplication')
                        .delete({
                            id: row.id
                        })
                        .then((res) => {
                            if (!res) return;
                            this.queryList();
                            console.log(res);
                        });
                })
                .catch((err) => {
                    console.log(err);
                });
        },
        // 启用/禁用
        switchBtn(index, row) {
            if (row.applicationAbled === 0) {
                this.$confirm(
                    '<span style="color:red">禁用后应用无法使用</span>，确定禁用吗？',
                    '禁用应用',
                    {
                        dangerouslyUseHTMLString: true,
                        confirmButtonText: '确定',
                        cancelButtonText: '取消',
                        type: 'warning'
                    }
                )
                    .then(() => {
                        this.$api('abledApp')
                            .patch(
                                'patchQuery',
                                {},
                                {
                                    id: row.id,
                                    type: row.applicationAbled === 0 ? 1 : 0
                                }
                            )
                            .then((res) => {
                                if (!res) return;
                                row.applicationAbled === 0
                                    ? (row.applicationAbled = 1)
                                    : (row.applicationAbled = 0);
                            });
                    })
                    .catch((err) => {
                        console.log(err);
                    });
            }
            if (row.applicationAbled === 1) {
                this.$confirm(
                    '<span style="color:red">启用后应用恢复使用</span>，确定启用吗？',
                    '启用应用',
                    {
                        dangerouslyUseHTMLString: true,
                        confirmButtonText: '确定',
                        cancelButtonText: '取消',
                        type: 'warning'
                    }
                )
                    .then(() => {
                        this.$api('abledApp')
                            .patch(
                                'patchQuery',
                                {},
                                {
                                    id: row.id,
                                    type: row.applicationAbled === 0 ? 1 : 0
                                }
                            )
                            .then((res) => {
                                if (!res) return;
                                row.applicationAbled === 0
                                    ? (row.applicationAbled = 1)
                                    : (row.applicationAbled = 0);
                            });
                    })
                    .catch((err) => {
                        console.log(err);
                    });
            }
        },
        resetDialogData() {
            this.$refs.form.resetFields();
            this.showDialog = false;
        },
        // 取消操作
        cancelBtn() {
            // 重置表单
            this.$refs.form.resetFields();
            this.showDialog = false;
        },
        sizeChange(pageSize) {
            this.pagination.pageSize = pageSize;
            this.pagination.currentPage = 1;
            this.queryList();
        },
        currentChange() {
            this.queryList();
        }
    }
};
</script>

<style lang="scss">
.myContract {
    // padding-bottom: 20px;
    margin: 0 14px 4px 0;
    .inner {
        padding: 20px;
        // box-shadow: 0 2px 4px rgba(0, 0, 0, 0.5);
        .textarea-box {
            .el-textarea__inner {
                height: 110px;
                font-family: auto;
            }
            .el-input__count {
                height: 30px;
            }
        }
    }
    .header {
        margin-bottom: 10px;
        text-align: right;
    }
    .table {
        .table-btn {
            margin-right: 5px;
            padding: 0;
            border: none;
            font-size: 14px;
            color: #999;
            cursor: pointer;
            &:hover,
            &:focus,
            &:visited,
            &:active {
                color: #4a90e2;
                background-color: transparent;
            }
        }
    }
    .pagination {
        margin-top: 15px;
        text-align: right;
    }
}
</style>