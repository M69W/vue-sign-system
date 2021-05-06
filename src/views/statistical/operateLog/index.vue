<template>
    <div class="sign-log">
        <div class="inner">
            <div class="header-title">
                <div class="txt">签章日志</div>
            </div>
            <div class="content">
                <div class="btn_wrap">
                    <el-form
                        :inline="true"
                        :model="searchForm"
                        class="form_search"
                        ref="searchForm"
                    >
                        <!-- <Authorized :authrity="$permissionMap.signLogSearchBth"> -->
                        <el-form-item label="操作类型" prop="type">
                            <el-select v-model="searchForm.type" placeholder="操作类型">
                                <el-option
                                    v-for="(item, index) in operateOptions"
                                    :key="index"
                                    :label="item.label"
                                    :value="item.value"
                                ></el-option>
                            </el-select>
                        </el-form-item>
                        <!-- </Authorized> -->
                        <!-- <Authorized :authrity="$permissionMap.signLogSearchBth"> -->
                        <el-form-item label="操作时间" prop="date">
                            <el-date-picker
                                v-model="searchDate"
                                type="daterange"
                                range-separator="-"
                                start-placeholder="开始日期"
                                end-placeholder="结束日期"
                                value-format="yyyy/MM/dd"
                                format="yyyy/MM/dd"
                                :picker-options="pickerOptions"
                            ></el-date-picker>
                        </el-form-item>
                        <!-- </Authorized> -->
                        <!-- <Authorized :authrity="$permissionMap.signLogSearchBth"> -->
                        <el-form-item prop="word">
                            <el-input
                                v-model="searchForm.userNickName"
                                clearable
                                placeholder="关键字搜索用户名称"
                                @keyup.native.enter="searchList"
                            ></el-input>
                        </el-form-item>
                        <!-- </Authorized> -->
                        <el-form-item>
                            <!-- <Authorized :authrity="$permissionMap.signLogSearchBth"> -->
                            <el-button
                                type="normal"
                                icon="iconfont icon-chaxun el-icon--left"
                                @click="searchList"
                            >查询</el-button>
                            <!-- </Authorized> -->
                            <!-- <Authorized :authrity="$permissionMap.signLogResetBth"> -->
                            <el-button
                                type="normal"
                                icon="iconfont icon-chongzhi el-icon--left"
                                @click="resetSearch"
                            >重置</el-button>
                            <!-- </Authorized> -->
                        </el-form-item>
                    </el-form>
                </div>
                <div class="table_data">
                    <el-table
                        :data="tableData"
                        style="width: 100%"
                        :row-class-name="tableRowClassName"
                        :header-cell-style="headerStyle"
                    >
                        <el-table-column prop="name" label="用户" show-overflow-tooltip></el-table-column>
                        <el-table-column prop="phoneOrMail" label="账号" show-overflow-tooltip></el-table-column>
                        <el-table-column prop="sealType" label="操作" show-overflow-tooltip>
                            <template slot-scope="scope">{{ formatOperateType[scope.row.type] }}</template>
                        </el-table-column>
                        <el-table-column prop="compactTheme" label="签发/合同主题" show-overflow-tooltip></el-table-column>
                        <el-table-column prop="operaDate" label="时间" show-overflow-tooltip></el-table-column>
                        <el-table-column label="操作" class="operate" width="150">
                            <template slot-scope="scope">
                                <span class="operate_item" @click="viewDetail(scope.row)">详情</span>
                            </template>
                        </el-table-column>
                    </el-table>
                    <el-pagination
                        @size-change="handleSizeChange"
                        @current-change="handleCurrentChange"
                        :current-page="searchForm.currPage"
                        :page-sizes="[10, 20, 30, 50]"
                        :page-size="searchForm.pageSize"
                        layout="total, sizes, prev, pager, next, jumper"
                        :total="total"
                    ></el-pagination>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import { setRowClass } from '@/mixins/setTableRowClass';
import { sessionStore, checkBlobFileResponseUtils } from '@/utils';
import FileSaver from 'file-saver';
import { refreshMenuItem } from '@/mixins/clickMenuItemForRefresh';

export default {
    mixins: [setRowClass, refreshMenuItem],
    data() {
        return {
            searchForm: {
                currPage: 1,
                endOperaDate: '',
                pageSize: 10,
                startOperaDate: '',
                type: '', // 0查看 1签署 2打印 3下载 4拒签 5用印申请
                userNickName: ''
            },
            total: 0,
            searchDate: null,
            headerStyle: {
                background: '#4A90E2',
                color: '#fff'
            },
            tableData: [],
            operateOptions: [
                { value: '', label: '全部操作' },
                { value: '0', label: '查看' },
                { value: '1', label: '签署' },
                { value: '2', label: '打印' },
                { value: '3', label: '下载' },
                { value: '4', label: '拒签' },
                { value: '5', label: '用印申请' }
            ],
            pickerOptions: {
                disabledDate(val) {
                    return val.getTime() > Date.now();
                }
            }
        };
    },
    computed: {
        formatOperateType() {
            let obj = {};
            this.operateOptions.forEach((v) => (obj[v.value] = v.label));
            return obj;
        }
    },
    watch: {
        isSameMenu(newVal, oldVal) {
            this.resetSearch();
        },
        searchDate(val) {
            if (!val) {
                this.searchForm.startOperaDate = '';
                this.searchForm.endOperaDate = '';
                return;
            }
            this.searchForm.startOperaDate = val[0];
            this.searchForm.endOperaDate = val[1];
        }
    },
    created() {
        this.search();
    },
    methods: {
        // 点击搜索
        searchList() {
            this.searchForm.currPage = 1;
            this.search();
        },
        // 搜索
        async search() {
            let res = await this.$api('operateLogList').post(
                'postNormal',
                this.searchForm
            );
            console.log(res);
            if (!res) return;
            let data = res.data.data;
            this.tableData = data.records;
            // 如果当页没有数据且不是在第一页，执行if里面的操作
            if (this.tableData.length === 0 && this.searchForm.currPage > 1) {
                this.searchForm.currPage--;
                this.search();
                return;
            }
            this.total = data.total;
        },
        // pageSize改变
        handleSizeChange(val) {
            this.searchForm.currPage = 1;
            this.searchForm.pageSize = val;
            this.search();
        },
        // 页码改变
        handleCurrentChange(val) {
            this.searchForm.currPage = val;
            this.search();
        },
        // 重置搜索条件
        resetSearch() {
            this.searchDate = null;
            this.$refs.searchForm.resetFields();
            this.$nextTick(() => this.search());
        },
        // 查看详情
        viewDetail(row) {
            this.$router.push(`/contractMgt/viewContract?compactId=${row.compactId}`);
        },
        // 下载
        async downloadLogs(row) {
            let res = await this.$api('fileDownload').post('postBlobQuery', {
                fileCode: row.fileCode
            });
            if (!res) return;
            console.log(res);
            checkBlobFileResponseUtils(res.data)
                .then((res1) => {
                    // let fileName = res.headers['content-disposition'].split(
                    //     'filename='
                    // )[1];
                    FileSaver.saveAs(res.data, row.fileName);
                })
                .catch((err) => {
                    this.$message.error(err);
                });
        }
    }
};
</script>

<style lang="scss" scoped>
.sign-log {
    .inner {
        padding: 0 20px 20px;
        background-color: #fff;
        .header-title {
            height: 54px;
            line-height: 54px;
            border-bottom: 1px solid #e9e9e9;
            .txt {
                color: #333;
                font-size: 16px;
            }
        }
        .content {
            .btn_wrap {
                display: flex;
                justify-content: space-between;
                padding: 10px;
                .form_search {
                }
            }
            .table_data {
                .operate {
                    text-align: center;
                    &_item {
                        color: #999;
                        margin: 0 10px;
                        cursor: pointer;
                        &:hover {
                            color: #4a90e2;
                        }
                    }
                }
                .el-table {
                    margin-bottom: 10px;
                }
                .el-pagination {
                    text-align: right;
                }
            }
        }
        .el-range-editor.el-input__inner {
            transform: translateY(2px);
        }
    }
}
</style>

<style lang="scss">
</style>