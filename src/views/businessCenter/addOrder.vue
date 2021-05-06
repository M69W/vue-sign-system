<template>
    <div class="add-order">
        <div class="inner">
            <div class="header-title">
                <el-breadcrumb separator="/">
                    <el-breadcrumb-item to="/businessCenter/businessMgt">业务中心</el-breadcrumb-item>
                    <el-breadcrumb-item>{{ id ? '编辑订单' : '新增订单' }}</el-breadcrumb-item>
                </el-breadcrumb>
            </div>
            <div class="content">
                <div class="step_item">
                    <div class="title">订单信息</div>
                    <el-form
                        inline
                        label-width="100px"
                        :model="goodsInfo"
                        :rules="formRules"
                        ref="goodsInfo"
                    >
                        <el-form-item label="客户姓名" prop="name">
                            <el-input v-model="goodsInfo.name"></el-input>
                        </el-form-item>
                        <el-form-item label="手机号" prop="phone">
                            <el-input v-model="goodsInfo.phone"></el-input>
                        </el-form-item>
                        <el-form-item label="公司名称" prop="company">
                            <el-input v-model="goodsInfo.company"></el-input>
                        </el-form-item>
                        <el-form-item></el-form-item>
                        <el-form-item label="订单金额">
                            <el-input v-model.number="amount" disabled></el-input>
                        </el-form-item>
                        <el-form-item label="实付金额" prop="payAmout">
                            <el-input v-model="goodsInfo.payAmout"></el-input>
                        </el-form-item>
                        <el-form-item label="订单备注" class="order-remark" prop="remark">
                            <el-input v-model="goodsInfo.remark" type="textarea" :rows="3"></el-input>
                        </el-form-item>
                    </el-form>
                </div>

                <!-- 添加角色信息 -->
                <div class="step_item">
                    <div class="title">
                        商品信息
                        <el-button type="primary" size="mini" @click="selectDialogVisible=true">选择商品</el-button>
                    </div>
                    <el-table
                        :data="tableData"
                        style="width: 100%"
                        :row-class-name="tableRowClassName"
                        :header-cell-style="headerStyle"
                        ref="goodsList"
                    >
                        <el-table-column prop="goodsName" label="商品名称" show-overflow-tooltip></el-table-column>
                        <el-table-column prop="number" label="商品数量">
                            <template slot-scope="scope">
                                <el-input v-model.number="scope.row.number"></el-input>
                            </template>
                        </el-table-column>
                        <el-table-column prop="goodsPrice" label="商品价格"></el-table-column>
                        <el-table-column prop="goodsPeriod" label="商品期间"></el-table-column>
                        <el-table-column prop="goodsType" label="商品类型"></el-table-column>
                        <el-table-column prop="commodityAmount" label="商品金额">
                            <template
                                slot-scope="scope"
                            >{{ scope.row.number * scope.row.goodsPrice }}</template>
                        </el-table-column>
                        <el-table-column prop="handselDate" label="赠送时长">
                            <template slot-scope="scope">
                                <el-input v-model.number="scope.row.handselDate"></el-input>月
                            </template>
                        </el-table-column>
                        <el-table-column prop="date" label="记账时间" min-width="200px">
                            <template slot-scope="scope">
                                <el-date-picker
                                    v-model="scope.row.date"
                                    type="daterange"
                                    range-separator="至"
                                    start-placeholder="开始日期"
                                    end-placeholder="结束日期"
                                    value-format="yyyy-MM-dd"
                                ></el-date-picker>
                            </template>
                        </el-table-column>
                        <el-table-column label="操作">
                            <template slot-scope="scope">
                                <span
                                    class="del-btn"
                                    @click="delTableList(scope.row, scope.$index)"
                                >删除</span>
                            </template>
                        </el-table-column>
                    </el-table>
                </div>
                <div class="btn_wrap">
                    <el-button type="info" plain @click="$router.go(-1)">返回</el-button>
                    <el-button type="primary" @click="saveOrder">保存</el-button>
                </div>

                <!-- 选择商品信息弹框 -->
                <el-dialog
                    title="商品信息"
                    :visible.sync="selectDialogVisible"
                    width="900px"
                    :before-close="handleSelectClose"
                    class="select_dialog"
                    @opened="dialogOpened"
                >
                    <el-form inline>
                        <el-form-item label="所属地区">
                            <el-select v-model="searchForm.goodsAddr">
                                <el-option label="全部" value></el-option>
                                <el-option label="深圳市" value="深圳市"></el-option>
                                <el-option label="广州市" value="广州市"></el-option>
                            </el-select>
                        </el-form-item>
                        <el-form-item label="产品名称">
                            <el-input v-model="searchForm.productionName"></el-input>
                        </el-form-item>
                        <el-form-item label="产品类型">
                            <el-select v-model="searchForm.goodsType">
                                <el-option label="全部" value></el-option>
                                <el-option label="普通产品" value="普通产品"></el-option>
                                <el-option label="套餐" value="套餐"></el-option>
                            </el-select>
                        </el-form-item>
                        <el-button type="primary" @click="search">搜索</el-button>
                        <el-button type="primary" @click="resetSearch">重置</el-button>
                    </el-form>
                    <el-table
                        :data="goodsList"
                        style="width: 100%"
                        :row-class-name="tableRowClassName"
                        :header-cell-style="headerStyle"
                        @selection-change="handleSelectionChange"
                        ref="goodsList"
                    >
                        <el-table-column type="selection" width="55"></el-table-column>
                        <el-table-column prop="productionName" label="产品名称" show-overflow-tooltip></el-table-column>
                        <el-table-column prop="goodsName" label="商品名称" show-overflow-tooltip></el-table-column>
                        <el-table-column prop="goodsAttr" label="商品属性" show-overflow-tooltip></el-table-column>
                        <el-table-column prop="goodsAddr" label="商品地区" show-overflow-tooltip></el-table-column>
                        <el-table-column prop="goodsPrice" label="商品价格"></el-table-column>
                        <el-table-column prop="goodsPeriod" label="商品期间"></el-table-column>
                        <el-table-column prop="goodsType" label="商品类型"></el-table-column>
                    </el-table>
                    <div class="footer">
                        <el-button
                            @click="
                        handleSelectClose(
                            () => (selectDialogVisible = false)
                        )
                    "
                        >取 消</el-button>
                        <el-button type="primary" @click="addGoods">确 定</el-button>
                    </div>
                </el-dialog>
            </div>
        </div>
    </div>
</template>

<script>
import { mapState } from 'vuex';
import { setRowClass } from '@/mixins/setTableRowClass';
import {
    sessionStore,
    isLetterOrNumber,
    checkIntegral,
    isPhoneNum,
    isEmail
} from '@/utils';
import { goods } from './goods';
import { htmlContent } from './htmlContent';

export default {
    mixins: [setRowClass],
    data() {
        return {
            goodsInfo: {
                amount: '',
                company: '',
                htmlContent: '',
                name: '',
                payAmout: '',
                phone: '',
                remark: ''
            },
            selectDialogVisible: false,
            id: null,
            tableData: [],
            goodsList: goods,
            headerStyle: {
                background: '#4A90E2',
                color: '#fff'
            },
            searchForm: {
                productionName: '',
                goodsType: '',
                goodsAddr: ''
            },
            tempSelection: [],
            formRules: {
                name: [
                    {
                        required: true,
                        message: '客户姓名不能为空',
                        trigger: 'blur'
                    }
                ],
                phone: [
                    {
                        required: true,
                        message: '手机号不能为空',
                        trigger: 'blur'
                    },
                    {
                        validator(rule, value, callback) {
                            if (!value.trim()) {
                                callback(new Error('手机号不能为空'));
                            } else if (!isPhoneNum(value.trim())) {
                                callback(new Error('手机号格式不正确'));
                            } else {
                                callback();
                            }
                        },
                        trigger: 'blur'
                    }
                ],
                company: [
                    {
                        required: true,
                        message: '公司名称不能为空',
                        trigger: 'blur'
                    }
                ],
                payAmout: [
                    {
                        required: true,
                        message: '实付金额不能为空',
                        trigger: 'blur'
                    },
                    {
                        validator(rule, value, callback) {
                            if (!value.trim()) {
                                callback(new Error('实付金额不能为空'));
                            } else if (typeof(Number(value.trim())) !== 'number' || isNaN(value.trim())) {
                                callback(new Error('实付金额格式不正确'));
                            } else {
                                callback();
                            }
                        },
                        trigger: 'blur'
                    }
                ],
            }
        };
    },
    computed: {
        ...mapState(['userInfo']),
        amount: {
            get() {
                console.log(this.tableData);
                return this.tableData.length
                    ? this.tableData.reduce(
                          (total, v) => total + v.goodsPrice * v.number,
                          0
                      )
                    : this.goodsInfo.amount || '';
            },
            set() {}
        }
    },
    async created() {
        this.id = this.$route.query.id;
        this.id && this.getDetail();
    },
    methods: {
        async getDetail() {
            let res = await this.$api('orderDetail').get('', {
                id: this.id
            });
            if (!res) return;
            let data = res.data.data;
            this.goodsInfo = Object.assign({}, data);
            this.tableData = data.sysCommodityReqVos.map((v) => {
                let item = this.goodsList.find(
                    (val) => val.commodityId === v.commodityId
                );
                v.date = v.bookkeepingDateBegin ? [v.bookkeepingDateBegin, v.bookkeepingDateAfter] : null;
                return Object.assign(item, v);
            });
        },
        saveOrder() {
            if (!this.tableData.length) return this.$message.error('请选择商品')
            this.$refs.goodsInfo.validate(async valid=>{
                if(!valid) return
                this.tableData.forEach((v) => {
                    v.commodityAmount = v.goodsPrice * v.number;
                    v.bookkeepingDateBegin = v.date[0] || '';
                    v.bookkeepingDateAfter = v.date[1] || '';
                });
                this.goodsInfo.amount = this.amount;
                let url = this.id ? 'updateOrder' : 'addOrder';
                let res = await this.$api(url).post(
                    '',
                    Object.assign(this.goodsInfo, {
                        sysCommodityReqVos: this.tableData,
                        htmlContent: htmlContent(this.goodsInfo, this.tableData)
                    })
                );
                if (!res) return;
                console.log(res);
                let msg = this.id ? '修改订单成功' : '新增订单成功';
                this.$message.success(msg);
                this.$router.push('businessMgt');
            })
        },
        search() {
            const tempSelection = this.tempSelection;
            const { goodsAddr, goodsType, productionName } = this.searchForm;
            this.goodsList = goods.filter((v) => {
                return (
                    (!goodsAddr || v.goodsAddr === goodsAddr) &&
                    (!goodsType || v.goodsType === goodsType) &&
                    (!productionName.trim() ||
                        v.productionName.indexOf(productionName) > -1)
                );
            });
            console.log(this.tempSelection);

            this.$nextTick(() =>
                tempSelection.forEach((v) =>
                    this.$refs.goodsList.toggleRowSelection(v)
                )
            );
        },
        resetSearch() {
            this.searchForm.goodsType = '';
            this.searchForm.goodsAddr = '';
            this.searchForm.productionName = '';
            this.search();
        },
        handleSelectionChange(val) {
            console.log(val);
            this.tempSelection = val;
        },
        addGoods() {
            this.tableData = this.tempSelection;
            this.handleSelectClose(() => (this.selectDialogVisible = false));
        },
        handleSelectClose(done) {
            this.tempSelection = [];
            this.$refs.goodsList.clearSelection();
            done();
        },
        delTableList(row, index) {
            this.tableData.splice(index, 1);
        },
        // 弹框打开完成的弹框
        dialogOpened() {
            let ids = this.tableData.map((v) => v.commodityId);
            console.log(ids);
            this.$nextTick(() =>
                this.goodsList.forEach((v) => {
                    if (ids.includes(v.commodityId)) {
                        this.$refs.goodsList.toggleRowSelection(v);
                    }
                })
            );
        }
    }
};
</script>

<style lang="scss" scoped>
.add-order {
    overflow-x: auto;
    .inner {
        padding: 0 20px 20px;
        background-color: #fff;
        .header-title {
            position: relative;
            margin-bottom: 30px;
            &:after {
                content: '';
                position: absolute;
                height: 10px;
                bottom: -10px;
                left: -20px;
                right: -20px;
                background-color: #f4f6f8;
            }
            .el-breadcrumb {
                overflow: hidden;
                &__item {
                    line-height: 54px;
                }
            }
        }
        .content {
            .theme-container {
                line-height: 54px;
                > span {
                    font-size: 16px;
                    margin-right: 10px;
                }
                .theme {
                    width: 300px;
                    margin: 0 10px;
                }
                .prefix,
                .time-select,
                .serial-no {
                    width: 180px;
                    margin: 0 5px;
                }
            }
            .step_item {
                .title {
                    height: 54px;
                    line-height: 54px;
                    margin-bottom: 10px;
                    font-size: 16px;
                    font-weight: bold;
                    padding-left: 10px;
                    position: relative;
                    &:before {
                        content: '';
                        width: 4px;
                        height: 18px;
                        background-color: #2a68c8;
                        position: absolute;
                        left: 0;
                        top: 50%;
                        transform: translateY(-50%);
                    }
                }
                .el-form {
                    &-item {
                        width: 50%;
                        margin-right: 0;
                        &.order-remark {
                            width: 100%;
                        }
                    }
                }
                .el-button {
                    height: 28px;
                    line-height: 28px;
                    font-size: 12px;
                    margin-left: 20px;
                }
                .el-table {
                    .el-input {
                        width: 100px;
                        margin-right: 10px;
                    }
                }
                .del-btn {
                    cursor: pointer;
                    color: #999;
                    &:hover {
                        color: #4a90e2;
                    }
                }
            }
            .btn_wrap {
                padding: 30px 0 20px 100px;
                .el-button {
                    margin: 0;
                    margin-right: 10px;
                    width: 100px;
                }
            }
        }
    }
    .select_dialog {
        .el-form {
            .el-input,
            .el-select {
                width: 150px;
            }
        }
    }
}
</style>
<style lang="scss">
.add-order {
    .el-date-editor.el-date-editor--daterange .el-range-separator {
        width: 40px;
    }
    .step_item {
        .el-form-item__label {
            display: block;
            float: left;
        }
        .el-form-item__content {
            display: block;
            // overflow: hidden;
            width: calc(100% - 100px);
            float: left;
        }
        .el-form-item__label {
            float: left;
        }
    }
    .select_dialog {
        .el-dialog__body {
            padding: 20px;
        }
        .footer {
            text-align: center;
            margin-top: 20px;
            .el-button {
                margin: 0 10px;
                width: 80px;
            }
        }
    }
}
</style>
