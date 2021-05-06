<template>
    <div class="contract_mgt">
        <div class="inner">
            <div class="header-title">
                <div class="txt">用印申请</div>
            </div>
            <div class="content">
                <div class="btn_wrap">
                    <el-form
                        :inline="true"
                        :model="searchForm"
                        class="form_search"
                        ref="searchForm"
                    >
                        <!-- <Authorized :authrity="$permissionMap.searchId"> -->
                        <el-form-item prop="status">
                            <el-select
                                v-model="searchForm.sealId"
                                placeholder="请选择印章"
                            >
                                <el-option
                                    v-for="(item, index) in sealList"
                                    :key="index"
                                    :label="item.name"
                                    :value="item.id"
                                ></el-option>
                            </el-select>
                        </el-form-item>
                        <!-- </Authorized>
                        <Authorized :authrity="$permissionMap.searchId">-->
                        <el-form-item prop="applyCause">
                            <el-input
                                v-model="searchForm.applyCause"
                                clearable
                                placeholder="关键字搜索申请事由"
                            ></el-input>
                        </el-form-item>
                        <!-- </Authorized> -->
                        <el-form-item>
                            <!-- <Authorized :authrity="$permissionMap.searchId"> -->
                            <el-button
                                type="normal"
                                icon="iconfont icon-chaxun el-icon--left"
                                @click="search"
                                >查询</el-button
                            >
                            <!-- </Authorized>
                            <Authorized :authrity="$permissionMap.searchId">-->
                            <el-button
                                type="normal"
                                icon="iconfont icon-chongzhi el-icon--left"
                                @click="resetSearch"
                                >重置</el-button
                            >
                            <!-- </Authorized> -->
                        </el-form-item>
                    </el-form>
                    <!-- <Authorized :authrity="$permissionMap.startContractId"> -->
                    <el-button
                        type="primary"
                        class="iconfont icon-xinjian3"
                        @click="applySealUse"
                        >申请用印</el-button
                    >
                    <!-- </Authorized> -->
                </div>
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
                            prop="createUserName"
                            label="申请人"
                            show-overflow-tooltip
                        ></el-table-column>
                        <el-table-column
                            prop="applyCause"
                            label="申请事由"
                            show-overflow-tooltip
                        ></el-table-column>
                        <el-table-column
                            prop="applyCount"
                            label="用印次数"
                            show-overflow-tooltip
                        ></el-table-column>
                        <el-table-column
                            prop="gmtCreate"
                            label="申请时间"
                        ></el-table-column>
                        <el-table-column
                            prop="expireTime"
                            label="失效时间"
                        ></el-table-column>
                        <el-table-column
                            label="操作"
                            class="operate"
                            width="200"
                        >
                            <template slot-scope="scope">
                                <span
                                    class="operate_item"
                                    v-show="scope.row.source === 3"
                                    @click="printFile(scope.row)"
                                    >打印</span
                                >
                                <span
                                    class="operate_item"
                                    v-show="scope.row.source === 3"
                                    @click="download(scope.row)"
                                    >下载</span
                                >
                                <span
                                    class="operate_item"
                                    @click="delApply(scope.row)"
                                    >删除</span
                                >
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
                <!-- 打印设置 -->
                <el-dialog
                    :visible.sync="printVisible"
                    width="640px"
                    :before-close="handleClose"
                    title="打印设置"
                    class="print-set"
                >
                    <div class="print-label">电子文件</div>
                    <div class="file">
                        <el-checkbox-group v-model="fileCodes">
                            <div
                                class="file-item"
                                v-for="(item, index) in fileList"
                                :key="index"
                            >
                                <el-checkbox
                                    :label="item.fileCode"
                                    @change="requireChange"
                                >
                                    {{ item.fileName }}
                                    <span class="pages"
                                        >（共{{ item.pageTotal }}页）</span
                                    >
                                </el-checkbox>
                            </div>
                        </el-checkbox-group>
                    </div>
                    <div class="btn-wrap">
                        <el-button @click="cancelPrint">取消</el-button>
                        <el-button type="primary" @click="submitPrint"
                            >打印</el-button
                        >
                    </div>
                </el-dialog>
            </div>
        </div>
    </div>
</template>

<script>
import { setRowClass } from '@/mixins/setTableRowClass';
import { sessionStore, checkBlobFileResponseUtils } from '@/utils';
import FileSaver from 'file-saver';
import { refreshMenuItem } from '@/mixins/clickMenuItemForRefresh';
import printJS from 'print-js';

export default {
    mixins: [setRowClass, refreshMenuItem],
    data() {
        return {
            searchForm: {
                currPage: 1,
                pageSize: 10,
                sealId: '',
                applyCause: ''
            },
            sealList: [],
            tableData: [],
            total: 0,
            headerStyle: {
                background: '#4A90E2',
                color: '#fff'
            },
            otherId: '',
            loadingVisible: false,
            printVisible: false,
            checkedBox: false,
            fileList: [],
            fileCodes: [],
            fileCode: '',
            pdfUrl: '',
            percentage: 0,
            progress: 0
        };
    },
    created() {
        this.getList();
        this.getBaiheId();
        this.getSealList();
    },
    watch: {
        isSameMenu(newVal, oldVal) {
            this.resetSearch();
        }
    },
    methods: {
        // 获取印章列表
        async getSealList() {
            let res = await this.$api('getSealList').get();
            if (!res) return;
            let code = res.data.code;
            if (code === 10012 && !this.otherId) {
                this.$message.warning(
                    '暂无数据，请先登录后台同步章数据至白鹤平台！'
                );
                return;
            } else if (code === 10012 && this.otherId) {
                this.$message.warning('暂无数据');
                return;
            }
            this.sealList = res.data.data.sealList;
        },
        // 获取白鹤ID
        getBaiheId() {
            let userInfo = sessionStore.get('userInfo');
            this.$api('info')
                .get('getPath', {
                    userId: userInfo.id
                })
                .then((res) => {
                    console.log(res);

                    let otherId = res.data.data.otherId;
                    this.otherId = otherId;
                });
        },
        // pagesize改变
        handleSizeChange(val) {
            this.searchForm.pageSize = val;
            this.search();
        },
        // 页码改变
        handleCurrentChange(val) {
            this.searchForm.currPage = val;
            this.getList();
        },
        // 搜索
        search() {
            this.searchForm.currPage = 1;
            this.getList();
        },
        // 重置
        resetSearch() {
            this.searchForm.applyCause = '';
            this.searchForm.sealId = '';
            this.search();
        },
        requireChange(val) {
            this.checkedBox = val;
        },
        // 获取申请列表
        async getList() {
            let res = await this.$api('getUseSealList').get(
                'getNormal',
                this.searchForm
            );
            if (!res) return;
            let data = res.data.data;
            this.total = data.total;
            this.tableData = data.records;
            if (!this.tableData.length && this.searchForm.currPage > 1) {
                this.searchForm.currPage--;
                this.getList();
            }
        },
        // 申请用印
        applySealUse() {
            this.$router.push('applyUse');
        },
        // 打印
        async printFile(row) {
            let res = await this.$api('getFilePrintInfoList').get('getNormal', {
                applyId: row.applyId
            });
            if (!res) return;
            this.fileList = res.data.data;
            this.fileCode = row.fileCode;
            this.printVisible = true;
        },
        // 下载
        async download(row) {
            let res = await this.$api('downloadUseSeal').post(
                'postBlobQuery',
                {},
                {
                    applyId: row.applyId
                }
            );
            if (!res) return;
            checkBlobFileResponseUtils(res.data)
                .then((res1) => {
                    let fileName = res.headers['content-disposition'].split(
                        'filename='
                    )[1];
                    FileSaver.saveAs(res.data, fileName);
                })
                .catch((err) => {
                    this.$message.error(err);
                });
        },
        // 删除
        delApply(row) {
            this.$confirm(
                '<p style="color:red">删除后申请无法恢复</p>确定删除吗？',
                '删除申请',
                {
                    dangerouslyUseHTMLString: true,
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }
            )
                .then(async () => {
                    let res = await this.$api('deleteUseSeal').delete(
                        'deleteQuery',
                        {},
                        {
                            applyId: row.applyId
                        }
                    );
                    if (!res) return;
                    this.$message.success('删除成功！');
                    this.getList();
                })
                .catch((err) => {
                    console.log(err);
                });
        },
        handleClose(done) {
            this.fileCodes = [];
            done();
        },
        // 提交打印设置
        async submitPrint() {
            if (!this.checkedBox) {
                return this.$message.warning({
                    message: '请选择需打印的文件！',
                    customClass: 'zZindex'
                });
            }
            let _self = this;
            let fileCodes = this.fileCode;
            let res = await this.$api('printUseSealFiles').post(
                'postBlobQuery',
                {},
                { fileCodes }
            );
            if (!res) return;
            let blob = res.data;
            let checkBlobFileResponse = checkBlobFileResponseUtils(blob);
            checkBlobFileResponse
                .then((resBlob) => {
                    let url = window.URL.createObjectURL(resBlob);
                    this.getProgress(url);
                })
                .catch((error) => {
                    _self.$message.warning(error);
                });
        },
        cancelPrint() {
            this.handleClose(() => (this.printVisible = false));
        },
        getProgress(url) {
            let num = 0;
            let _self = this;
            _self.printVisible = true;
            let timer = setInterval(() => {
                num++;
                _self.percentage = num;
                if (num >= 100) {
                    clearInterval(timer);
                    setTimeout(() => {
                        _self.printVisible = false;
                        printJS(url);
                        this.fileCodes = [];
                        this.checkedBox = false;
                    }, 500);
                }
            }, 10);
        },
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
.contract_mgt {
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
