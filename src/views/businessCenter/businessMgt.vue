<template>
    <div class="business_mgt">
        <div class="inner">
            <div class="header-title">
                <div class="txt">业务中心</div>
            </div>
            <div class="content">
                <div class="btn_wrap">
                    <el-form
                        :inline="true"
                        :model="searchForm"
                        class="form_search"
                        ref="searchForm"
                    >
                        <el-form-item label="合同名称" prop="keyWord">
                            <el-input v-model="searchForm.keyWord" clearable placeholder="关键字合同名称"></el-input>
                        </el-form-item>
                        <el-form-item>
                            <el-button
                                type="normal"
                                icon="iconfont icon-chaxun el-icon--left"
                                @click="searchList"
                            >查询</el-button>
                            <el-button
                                type="normal"
                                icon="iconfont icon-chongzhi el-icon--left"
                                @click="resetSearch"
                            >重置</el-button>
                        </el-form-item>
                    </el-form>
                    <el-button
                        type="primary"
                        class="iconfont icon-xinjian3"
                        @click="$router.push('addOrder')"
                    >新增</el-button>
                </div>
                <div class="table_data">
                    <el-table
                        :data="tableData"
                        style="width: 100%"
                        :row-class-name="tableRowClassName"
                        :header-cell-style="headerStyle"
                    >
                        <el-table-column prop="name" width="120" label="客户姓名"></el-table-column>
                        <el-table-column prop="phone" label="手机号"></el-table-column>
                        <el-table-column prop="company" label="公司名称"></el-table-column>
                        <el-table-column prop="orderNumber" label="订单号" width="200px"></el-table-column>
                        <el-table-column prop="orderCreate" label="下单时间" width="200px"></el-table-column>
                        <el-table-column prop="amount" label="订单金额"></el-table-column>
                        <el-table-column prop="payAmout" label="实付金额"></el-table-column>
                        <el-table-column prop="creatUserName" label="开单人"></el-table-column>
                        <el-table-column label="操作" class="operate" width="250">
                            <template slot-scope="scope">
                                <span
                                    class="operate_item"
                                    @click="editOrder(scope.row)"
                                    v-if="scope.row.status === 0"
                                >编辑</span>
                                <span class="operate_item" @click="signContract(scope.row)">电子签章</span>
                                <span class="operate_item" @click="printOrder(scope.row)">物理用印</span>
                                <span
                                    class="operate_item"
                                    v-if="scope.row.status === 0"
                                    @click="deleteOrder(scope.row)"
                                >删除</span>
                            </template>
                        </el-table-column>
                    </el-table>
                    <el-pagination
                        @size-change="handleSizeChange"
                        @current-change="handleCurrentChange"
                        :current-page="searchForm.pageNum"
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
import {
    sessionStore,
    checkIntegral,
    checkBlobFileResponseUtils
} from '@/utils';
import FileSaver from 'file-saver';
import { refreshMenuItem } from '@/mixins/clickMenuItemForRefresh';

export default {
    mixins: [setRowClass, refreshMenuItem],
    filters: {
        filterDate(val) {
            return val === '0' ? '永久有效' : '有效期至：' + val;
        }
    },
    data() {
        return {
            searchForm: {
                keyWord: '',
                pageNum: 1,
                pageSize: 10
            },
            total: 0,
            headerStyle: {
                background: '#4A90E2',
                color: '#fff'
            },
            tableData: []
        };
    },
    computed: {},
    created() {
        this.search();
    },
    methods: {
        // 点击搜索
        searchList() {
            this.searchForm.pageNum = 1;
            this.search();
        },
        // 搜索合同
        async search() {
            // 01：草稿；02：已撤销；03：已拒签；0401：待我签署 040203 待他人签；05：签署完成；
            let res = await this.$api('businessCenter').post(
                'postNormal',
                this.searchForm
            );
            console.log(res);
            if (!res) return;
            let data = res.data.data;
            this.tableData = data.records;
            if (this.tableData.length === 0 && this.searchForm.pageNum > 1) {
                this.searchForm.pageNum--;
                this.search();
                return;
            }
            this.total = data.total;
        },
        handleSizeChange(val) {
            this.searchForm.pageSize = val;
            this.search();
        },
        handleCurrentChange(val) {
            this.searchForm.pageNum = val;
            this.search();
        },
        // 重置搜索条件
        resetSearch() {
            this.searchDate = null;
            this.$refs.searchForm.resetFields();
            this.search();
        },
        // 编辑订单
        editOrder(row) {
            this.$router.push(`addOrder?id=${row.id}`);
        },
        // 物理用印
        async printOrder(row) {
            let res = await this.$api('downloadSignDoc').get('getBlob', {
                fileCode: row.fileCode
            })
            checkBlobFileResponseUtils(res.data).then(res1=>{
                window.open(URL.createObjectURL(res.data))
            })
        },
        // 签署/查看订单
        signContract(row) {
            let query =
                row.status === 0
                    ? {
                          fileCode: row.fileCode,
                          name: row.name,
                          phone: row.phone,
                          id: row.id,
                          enterpriseName: row.company
                      }
                    : {
                          compactId: row.contractId
                      };
            let path =
                row.status === 0 ? 'businessSign' : '/contractMgt/viewContract';
            this.$router.push({
                path,
                query
            });
        },
        // 删除合同
        deleteOrder(row) {
            this.$confirm(
                '<p class="mention-del-seal">订单删除后不可恢复</p><p>确定删除么？</p>',
                '删除订单',
                {
                    confirmButtonText: '确定',
                    dangerouslyUseHTMLString: true,
                    cancelButtonText: '取消',
                    type: 'warning'
                }
            )
                .then(async () => {
                    let res = await this.$api('deleteOrder').get('', {
                        id: row.id
                    });
                    if (!res) return;
                    this.search();
                    this.$message.success('删除成功！');
                })
                .catch((err) => {
                    console.log(err);
                });
        }
    }
};
</script>

<style lang="scss" scoped>
.business_mgt {
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
                margin-top: 20px;
            }
            .table_data {
                .operate {
                    text-align: center;
                    &_item {
                        color: #999;
                        margin-right: 15px;
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