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
                        <Authorized :authrity="$permissionMap.signLogSearchBth">
                            <el-form-item label="状态" prop="signatureResult">
                                <el-select
                                    v-model="searchForm.signatureResult"
                                    placeholder="合同状态"
                                >
                                    <el-option
                                        v-for="(item, index) in statusOptions"
                                        :key="index"
                                        :label="item.label"
                                        :value="item.value"
                                    ></el-option>
                                </el-select>
                            </el-form-item>
                        </Authorized>
                        <Authorized :authrity="$permissionMap.signLogSearchBth">
                            <el-form-item label="印章类型" prop="sealType">
                                <el-select
                                    v-model="searchForm.sealType"
                                    placeholder="印章类型"
                                >
                                    <el-option
                                        v-for="(item, index) in sealTypeOptions"
                                        :key="index"
                                        :label="item.label"
                                        :value="item.value"
                                    ></el-option>
                                </el-select>
                            </el-form-item>
                        </Authorized>
                        <Authorized :authrity="$permissionMap.signLogSearchBth">
                            <el-form-item label="日期" prop="date">
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
                        </Authorized>
                        <Authorized :authrity="$permissionMap.signLogSearchBth">
                            <el-form-item prop="word">
                                <el-input
                                    v-model="searchForm.word"
                                    clearable
                                    placeholder="签署人/印章名称"
                                    @keyup.native.enter="searchList"
                                ></el-input>
                            </el-form-item>
                        </Authorized>
                        <el-form-item>
                            <Authorized
                                :authrity="$permissionMap.signLogSearchBth"
                            >
                                <el-button
                                    type="normal"
                                    icon="iconfont icon-chaxun el-icon--left"
                                    @click="searchList"
                                    >查询</el-button
                                >
                            </Authorized>
                            <Authorized
                                :authrity="$permissionMap.signLogResetBth"
                            >
                                <el-button
                                    type="normal"
                                    icon="iconfont icon-chongzhi el-icon--left"
                                    @click="resetSearch"
                                    >重置</el-button
                                >
                            </Authorized>
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
                        <el-table-column
                            prop="signName"
                            label="签署人"
                            show-overflow-tooltip
                        ></el-table-column>
                        <el-table-column
                            prop="sealType"
                            label="印章类型"
                            show-overflow-tooltip
                        >
                            <template slot-scope="scope">
                                {{ formatSealType[scope.row.sealType] }}
                            </template>
                        </el-table-column>
                        <el-table-column
                            prop="sealName"
                            label="印章名称"
                            show-overflow-tooltip
                        ></el-table-column>
                        <el-table-column
                            prop="fileName"
                            label="签署文件"
                            show-overflow-tooltip
                        ></el-table-column>
                        <el-table-column
                            prop="signDate"
                            label="签署时间"
                            show-overflow-tooltip
                        ></el-table-column>
                        <el-table-column
                            prop="signatureResult"
                            label="状态"
                            width="80"
                            show-overflow-tooltip
                        >
                            <template slot-scope="scope">
                                {{ formatStatus[scope.row.signatureResult] }}
                            </template>
                        </el-table-column>
                        <!--  01：草稿；02：已撤销；03：已拒签；0401：待我签署 0402 待他人签；0403 待他人签； 05：签署完成；-->
                        <el-table-column
                            label="操作"
                            class="operate"
                            width="150"
                        >
                            <template slot-scope="scope">
                                <!-- <span class="operate_item" @click="viewDetail(scope.row)">详情</span> -->
                                <span
                                    class="operate_item"
                                    @click="downloadLogs(scope.row)"
                                    >下载</span
                                >
                            </template>
                        </el-table-column>
                    </el-table>
                    <el-pagination
                        @size-change="handleSizeChange"
                        @current-change="handleCurrentChange"
                        :current-page="searchForm.currentPage"
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
                signatureResult: '',
                sealType: '',
                word: '',
                signDateBefore: '',
                signDateAfter: '',
                currentPage: 1,
                pageSize: 10,
                contentType: 'json'
            },
            total: 0,
            searchDate: null,
            headerStyle: {
                background: '#4A90E2',
                color: '#fff'
            },
            tableData: [],
            statusOptions: [
                {
                    value: '',
                    label: '全部'
                },
                {
                    value: '01',
                    label: '成功'
                },
                {
                    value: '02',
                    label: '失败'
                }
            ],
            sealTypeOptions: [
                { value: '', label: '全部' },
                { value: '01', label: '行政章' },
                { value: '02', label: '财务专用章' },
                { value: '03', label: '业务专用章' },
                { value: '04', label: '法定代表人名章' },
                { value: '05', label: '报关专用章' },
                { value: '06', label: '合同专用章' },
                { value: '07', label: '其他公章' },
                { value: '08', label: '电子杂章' },
                { value: '09', label: '电子私章' }
            ],
            pickerOptions: {
                disabledDate(val) {
                    return val.getTime() > Date.now();
                }
            }
        };
    },
    computed: {
        formatStatus() {
            let obj = {};
            this.statusOptions.forEach((v) => (obj[v.value] = v.label));
            return obj;
        },
        formatSealType() {
            let obj = {};
            this.sealTypeOptions.forEach((v) => (obj[v.value] = v.label));
            return obj;
        }
    },
    watch: {
        isSameMenu(newVal, oldVal) {
            this.resetSearch();
        },
        searchDate(val) {
            if (!val) {
                this.searchForm.signDateBefore = '';
                this.searchForm.signDateAfter = '';
                return;
            }
            this.searchForm.signDateBefore = val[0];
            this.searchForm.signDateAfter = val[1];
        }
    },
    created() {
        this.search();
    },
    methods: {
        // 点击搜索
        searchList() {
            this.searchForm.currentPage = 1;
            this.search();
        },
        // 搜索
        async search() {
            let res = await this.$api('signLogList').post(
                'postNormal',
                this.searchForm
            );
            console.log(res);
            if (!res) return;
            let data = res.data.data;
            this.tableData = data.records;
            // 如果当页没有数据且不是在第一页，执行if里面的操作
            if (
                this.tableData.length === 0 &&
                this.searchForm.currentPage > 1
            ) {
                this.searchForm.currentPage--;
                this.search();
                return;
            }
            this.total = data.total;
        },
        // pageSize改变
        handleSizeChange(val) {
            this.searchForm.currentPage = 1;
            this.searchForm.pageSize = val;
            this.search();
        },
        // 页码改变
        handleCurrentChange(val) {
            this.searchForm.currentPage = val;
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
            this.$router.push(`viewContract?compactId=${row.compactId}`);
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
    }
}
</style>

<style lang="scss">
</style>