<template>
    <div class="contract_mgt useLog">
        <div class="inner">
            <div class="header-title">
                <div class="txt">用印记录</div>
            </div>
            <div class="content">
                <div class="table_data">
                    <el-table
                        :data="tableData"
                        style="width: 100%"
                        :row-class-name="tableRowClassName"
                        :header-cell-style="headerStyle"
                    >
                        <el-table-column
                            prop="sealName"
                            label="印章名称"
                            show-overflow-tooltip
                        ></el-table-column>
                        <el-table-column
                            prop="applyUserName"
                            label="申请人"
                            show-overflow-tooltip
                        ></el-table-column>
                        <el-table-column
                            prop="applyCause"
                            label="申请事由"
                            show-overflow-tooltip
                        ></el-table-column>
                        <el-table-column
                            prop="stampCount"
                            label="用印次数"
                            width="100"
                            show-overflow-tooltip
                        ></el-table-column>
                        <el-table-column prop="applyTime " label="申请时间">
                            <template slot-scope="scope">
                                <span>{{
                                    scope.row.applyTime | formatTime
                                }}</span>
                            </template>
                        </el-table-column>
                        <el-table-column prop="expireTime" label="失效时间">
                            <template slot-scope="scope">
                                <span>{{
                                    scope.row.expireTime | formatTime
                                }}</span>
                            </template>
                        </el-table-column>
                        <el-table-column
                            prop="approveStatus"
                            label="记录状态"
                            width="100"
                        >
                            <template slot-scope="scope">
                                <span
                                    v-text="
                                        scope.row.approveStatus === 1
                                            ? '已审批'
                                            : '已关闭'
                                    "
                                ></span>
                            </template>
                        </el-table-column>
                        <el-table-column label="操作" class="operate">
                            <template slot-scope="scope">
                                <span
                                    class="operate_item"
                                    @click="sealLog(scope.row)"
                                    >用印日志</span
                                >
                                <span
                                    class="operate_item"
                                    @click="sealPic(scope.row, picNum)"
                                    >盖章图片</span
                                >
                            </template>
                        </el-table-column>
                    </el-table>
                    <el-pagination
                        @size-change="handleSizeChange"
                        @current-change="handleCurrentChange"
                        :current-page="pagination.currentPage"
                        :page-sizes="[10, 20, 30, 50]"
                        :page-size="pagination.pageSize"
                        layout="total, sizes, prev, pager, next, jumper"
                        :total="pagination.total"
                    ></el-pagination>
                </div>
                <!--用印日志 -->
                <el-dialog
                    title="用印日志"
                    :visible.sync="logShowDialog"
                    :before-close="logDialogDataThree"
                    class="dialog-box log-dialog-box"
                >
                    <div class="table">
                        <el-table
                            :data="tableLogData"
                            tooltip-effect="dark"
                            class="no-border-bottom"
                            max-height="300"
                            style="width: 100%"
                            :row-class-name="tableRowClassName"
                            :header-cell-style="headerStyle"
                        >
                            <el-table-column
                                prop="longitude"
                                label="盖章经纬度"
                                width="180"
                            >
                                <template slot-scope="scope">
                                    <span
                                        >{{ scope.row.longitude }}，{{
                                            scope.row.latitude
                                        }}</span
                                    >
                                </template>
                            </el-table-column>
                            <el-table-column
                                prop="address"
                                label="盖章地址"
                            ></el-table-column>
                            <el-table-column
                                prop="stampTime"
                                label="盖章时间"
                                width="180"
                            >
                                <template slot-scope="scope">
                                    <span>{{
                                        scope.row.stampTime | formatTime
                                    }}</span>
                                </template>
                            </el-table-column>
                        </el-table>
                    </div>
                    <div class="pagination">{{ `共 ${logTotal} 条数据` }}</div>
                </el-dialog>

                <!--盖章图片 -->
                <el-dialog
                    title="盖章图片"
                    :visible.sync="picShowDialog"
                    :before-close="logDialogDataThree"
                    class="dialog-box log-dialog-box"
                >
                    <el-scrollbar>
                        <div class="table-img">
                            <img
                                ref="myPdf"
                                :src="pdfUrl"
                                @progress="getProgress"
                                @loaded="pdfLoaded"
                                @error="pdfError"
                            />
                        </div>
                    </el-scrollbar>
                    <span class="arrow arrow-pre" @click="skip('pre')"
                        ><i class="el-icon-arrow-up"></i
                    ></span>
                    <span class="arrow arrow-next" @click="skip('next')"
                        ><i class="el-icon-arrow-down"></i
                    ></span>
                </el-dialog>
            </div>
        </div>
    </div>
</template>

<script>
import { setRowClass } from '@/mixins/setTableRowClass';
import { sessionStore } from '@/utils';
import { checkBlobFileResponseUtils } from '@/utils';
import { refreshMenuItem } from '@/mixins/clickMenuItemForRefresh';

export default {
    name: 'useLog',
    mixins: [setRowClass, refreshMenuItem],
    data() {
        return {
            sealList: [],
            tableData: [],
            tableLogData: [],
            logTotal: '0',
            pdfUrl: '',
            logShowDialog: false,
            picShowDialog: false,
            debounceTimer: null,
            tableData: [],
            headerStyle: {
                background: '#4A90E2',
                color: '#fff'
            },
            fileList: [],
            fileCodes: [],
            progress: 0,
            picNum: 0,
            otherId: '',
            picNumData: [],
            pagination: {
                currentPage: 1,
                pageSizes: [10, 20, 50, 100],
                pageSize: 10,
                total: 0
            }
        };
    },
    created() {
        this.getBaiheId();
        this.getList();
    },
    filters: {
        formatTime(val) {
            // let time = dateFormat("YYYY-mm-dd HH:MM", new Date(val))
            let time = new Date(val);
            let year = time.getFullYear();
            let month = time.getMonth() + 1;
            let day = time
                .getDate()
                .toString()
                .padStart(2, '0');
            let hour = time
                .getHours()
                .toString()
                .padStart(2, '0');
            let minute = time
                .getMinutes()
                .toString()
                .padStart(2, '0');
            let second = time
                .getSeconds()
                .toString()
                .padStart(2, '0');
            return `${year}-${month}-${day} ${hour}:${minute}:${second}`;
        }
    },
    watch: {
        isSameMenu(newVal, oldVal) {
            this.getList();
        }
    },
    methods: {
        // pagesize改变
        handleSizeChange(val) {
            this.pagination.pageSize = val;
            this.getList();
        },
        // 页码改变
        handleCurrentChange(val) {
            this.pagination.currentPage = val;
            this.getList();
        },
        // 获取申请列表
        getList() {
            let userInfo = sessionStore.get('userInfo');
            let { currentPage, pageSize } = this.pagination;
            this.$api('stampRecordApplyList')
                .post('postNormal', {
                    curPage: currentPage,
                    hasPage: true,
                    pageSize: pageSize,
                    ParamBean: {
                        applyUser: userInfo.otherId
                    }
                })
                .then((res) => {
                    if (!res) return;
                    let code = res.data.code;
                    if (code === 10012 && !this.otherId) {
                        this.$message.warning(
                            '暂无数据，请先登录后台同步章数据至白鹤平台！'
                        );
                        return;
                    } else if (code === 10012 && this.otherId) {
                        this.$message.warning(
                            '暂无签名，请先登录到白鹤平台创建签名！'
                        );
                    } else if (code === 0) {
                        let data = res.data.data;
                        this.pagination.total = data.count;
                        this.tableData = data.stampRecordApplyVOList;
                    }
                });
        },
        // 获取白鹤ID
        getBaiheId() {
            let userInfo = sessionStore.get('userInfo');
            this.$api('info')
                .get('getPath', {
                    userId: userInfo.id
                })
                .then((res) => {
                    let otherId = res.data.data.otherId;
                    this.otherId = otherId;
                });
        },
        // 用印日志
        sealLog(row) {
            this.logShowDialog = true;
            let { currentPage, pageSize } = this.pagination;
            this.$api('applyStampRecordList')
                .post('postNormal', {
                    curPage: currentPage,
                    hasPage: true,
                    pageSize: pageSize,
                    param: row.id
                })
                .then((res) => {
                    if (!res) return;
                    let data = res.data.data.sealRecordVOList;
                    this.tableLogData = data;
                    this.logTotal = data.length;
                });
        },
        // 盖章图片
        sealPic(row) {
            let _this = this;
            if (!row.stampRecordImgList) {
                this.$message.warning('没有图片');
                return;
            }
            _this.picNumData = row;

            this.picShowDialog = true;
            this.$api('fetchImage')
                .post(
                    'postBlobQuery',
                    {},
                    {
                        fileName: row.stampRecordImgList[_this.picNum],
                        category: 5
                    }
                )
                .then((res) => {
                    if (!res) return;
                    checkBlobFileResponseUtils(res.data)
                        .then((res1) => {
                            this.progress = 0;
                            _this.pdfUrl = _this.blob2Url(res.data);
                        })
                        .catch((err) => {
                            this.$message.error(err);
                        });
                });
        },
        skip(type) {
            let _this = this;
            let number;
            let info;
            if (type === 'next') {
                number = ++_this.picNum;
            }
            if (type === 'pre') {
                number = --_this.picNum;
            }

            this.picShowDialog = true;
            this.$api('fetchImage')
                .post(
                    'postBlobQuery',
                    {},
                    {
                        fileName: this.picNumData.stampRecordImgList[number],
                        category: 5
                    }
                )
                .then((res) => {
                    if (!res) return;
                    checkBlobFileResponseUtils(res.data)
                        .then((res1) => {
                            this.progress = 0;
                            let size = res.data.size;

                            if (size === 0) {
                                if (type === 'next') {
                                    this.$message.warning({
                                        message: '已经是最后一页了',
                                        customClass: 'zZindex'
                                    });
                                    _this.picNum--;
                                    return;
                                }
                                if (type === 'pre') {
                                    this.$message.warning({
                                        message: '已经是第一页了',
                                        customClass: 'zZindex'
                                    });
                                    _this.picNum++;
                                    return;
                                }
                            }
                            _this.pdfUrl = _this.blob2Url(res.data);
                        })
                        .catch((err) => {
                            this.$message.error(err);
                        });
                });
        },
        // 用印日志右上角关闭回调
        logDialogDataThree() {
            this.logShowDialog = false;
            this.picShowDialog = false;
            this.logTotal = '0';
        },
        getProgress(val) {
            this.progress = val * 100;
        },
        pdfLoaded() {
            this.loadingVisible = false;
            this.$store.commit('showLoading');
            setTimeout(() => {
                this.$refs.myPdf.print();
                setTimeout(() => {
                    this.$store.commit('hideLoading');
                }, 1000);
            }, 100);
        },
        pdfError() {},
        blob2Url(blob) {
            let url;
            if (window.createObjectURL != undefined) {
                // basic
                url = window.createObjectURL(blob);
            } else if (window.URL != undefined) {
                // mozilla(firefox)
                url = window.URL.createObjectURL(blob);
            } else if (window.webkitURL != undefined) {
                // webkit or chrome
                url = window.webkitURL.createObjectURL(blob);
            }
            return url;
        }
    }
};
</script>

<style lang="scss" scoped>
.useLog {
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
            .table_data {
                .operate {
                    text-align: center;
                    &_item {
                        color: #999;
                        margin-right: 10px;
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
                .vertify,
                .QR {
                    position: relative;
                    display: flex;
                    align-items: center;
                    .code {
                        margin-right: 10px;
                    }
                    .qrcode {
                        margin-right: 10px;
                        display: flex;
                        align-items: center;
                    }
                    i {
                        font-size: 15px;
                        color: #ccc;
                        cursor: pointer;
                    }
                    .qr-wrap {
                        margin-right: 10px;
                    }
                }
            }
            .print-set {
                .print-label {
                    margin-bottom: 10px;
                    font-weight: 600;
                }
                .file {
                    &-item {
                        margin-top: 20px;
                        .pages {
                            margin-left: 10px;
                            color: #999;
                        }
                    }
                }
                .btn-wrap {
                    padding: 40px 0 0;
                    text-align: center;
                    .el-button {
                        width: 80px;
                        margin: 0 10px;
                    }
                }
            }
            .print-set-loading {
                .loading-text {
                    text-align: center;
                    font-size: 16px;
                    font-family: 'PingFangSC-Medium';
                    color: #000;
                    margin-bottom: 20px;
                }
                .progress {
                    width: 100%;
                    height: 10px;
                    margin-bottom: 15px;
                }
                .loading-summary {
                    color: #626262;
                    line-height: 30px;
                }
                .loading-files {
                    color: #000;
                    line-height: 30px;
                    text-align: center;
                }
            }
        }
    }
}
</style>
<style lang="scss">
.useLog {
    .log-dialog-box {
        .el-dialog {
            width: 800px;
        }
        .table {
            width: 738px;
            .el-table__body-wrapper {
                width: 721px;
                overflow-y: auto;
            }
        }
        .table-img {
            width: 732px;
            max-height: 520px;
            overflow-y: auto;
            margin-top: -17px;
            padding-top: 17px;
            img {
                width: 100%;
            }
            .el-table__body-wrapper {
                width: 721px;
                overflow-y: auto;
            }
        }
        .pagination {
            margin-top: 20px;
        }
        .arrow {
            position: absolute;
            right: 7px;
            display: inline-block;
            width: 30px;
            height: 30px;
            line-height: 30px;
            text-align: center;
            border-radius: 50%;
            color: #999;
            border: 1px solid #e5e5e5;
            cursor: pointer;
            &.arrow-pre {
                bottom: 120px;
            }
            &.arrow-next {
                bottom: 70px;
            }
        }
    }
    .el-scrollbar {
        height: 100%;
    }
}
</style>