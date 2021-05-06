<template>
    <div class="fileLog">
        <!-- table -->
        <div class="table">
            <el-table
                :data="tableData"
                :header-cell-style="headerStyleFn"
                stripe
            >
                <el-table-column
                    prop="chineseName"
                    label="签署人姓名"
                ></el-table-column>
                <el-table-column
                    prop="creditCode"
                    label="所属单位/个人"
                ></el-table-column>
                <el-table-column prop="id" label="印章名称"></el-table-column>
                <el-table-column
                    prop="gmtCreate"
                    label="印章类型"
                ></el-table-column>
                <el-table-column
                    prop="gmtCreate"
                    label="印章编码"
                ></el-table-column>
                <el-table-column
                    prop="gmtCreate"
                    label="介质类型"
                ></el-table-column>
                <el-table-column
                    prop="gmtCreate"
                    label="签后HASH"
                ></el-table-column>
                <el-table-column
                    prop="gmtCreate"
                    label="签章时间"
                ></el-table-column>
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
</template>

<script>
import { setRowClass } from '@/mixins/setTableRowClass';

export default {
    name: 'fileLog',
    mixins: [setRowClass],
    data() {
        return {
            fileName: '',
            tableData: [
                {
                    chineseName: 'sddf',
                    creditCode: 'sddf',
                    id: 'sddf',
                    gmtCreate: 'sddf',
                    status: 'sddf'
                },
                {
                    chineseName: 'sddf',
                    creditCode: 'sddf',
                    id: 'sddf',
                    gmtCreate: 'sddf',
                    status: 'sddf'
                },
                {
                    chineseName: 'sddf',
                    creditCode: 'sddf',
                    id: 'sddf',
                    gmtCreate: 'sddf',
                    status: 'sddf'
                }
            ],
            pagination: {
                currentPage: 1,
                pageSize: 10,
                pageSizes: [10, 20, 50, 100],
                total: 100
            },
            headerStyleFn(row, column, rowIndex) {
                return {
                    background: '#1890ff',
                    color: '#fff'
                };
            }
        };
    },
    methods: {
        sizeChange(pageSize) {
            this.pagination.pageSize = pageSize;
            this.pagination.currentPage = 1;
            console.log(pageSize);
        },
        currentChange() {
            let { currentPage } = this.pagination;

            alert(currentPage);
        }
    }
};
</script>
<style lang="scss" scoped>
.fileLog {
    .pagination {
        margin-top: 15px;
        text-align: right;
    }
}
.el-form-item {
    margin: 0;
}
</style>


