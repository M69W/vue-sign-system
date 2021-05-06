<template>
    <div class="file-detail">
        <div class="inner">
            <div class="breadcrumb">
                <el-breadcrumb separator="/">
                    <el-breadcrumb-item to="/fileCenter/FileManage"
                        >文件管理</el-breadcrumb-item
                    >
                    <el-breadcrumb-item>查看文件</el-breadcrumb-item>
                </el-breadcrumb>
            </div>
            <div class="header-wrap">
                <div class="file-name">
                    {{ fileName }}
                </div>
                <div class="handle-wrap">
                    <div class="doload-times">
                        <span>已下载次数</span>{{ fileInfo.downCount }}
                    </div>
                    <div class="print-times">
                        <span>已打印次数</span>{{ fileInfo.printNum }}
                    </div>
                    <Authorized :authrity="$permissionMap.fileDetailPrintAllot">
                        <el-button size="medium" @click="printFile"
                            >打印分配</el-button
                        >
                    </Authorized>
                    <Authorized :authrity="$permissionMap.fileDetailDownload">
                        <el-button size="medium" @click="doloadFile"
                            >下载</el-button
                        >
                    </Authorized>
                    <Authorized :authrity="$permissionMap.fileDetailDownload">
                        <el-button size="medium" @click="backoutVisible=true"
                            >撤销</el-button
                        >
                    </Authorized>
                    <!-- contractStatus (string, optional): 合同状态 01：草稿；
                    02：已撤销；03：已拒签；0401：待我签署 0402 待他人签；05：签署完成；06:已过期 , -->
                    <Authorized
                        v-if="
                            sponsorId === userId ||
                                (contractStatus !== '0401' &&
                                    contractStatus !== '0402' &&
                                    contractStatus !== '05')
                        "
                        :authrity="$permissionMap.fileDetailDelete"
                    >
                        <el-button
                            size="medium"
                            style="margin-right: 20px"
                            @click="deleteFile"
                            >删除</el-button
                        >
                    </Authorized>
                    <!-- 待自己签署才显示 -->
                    <div class="sign-file" v-if="fileInfo.signStatus === '01'">
                        <el-button size="medium" type="primary"
                            >文件签署<i class="iconfont icon-ellipsis"></i
                        ></el-button>
                        <div class="fixed">
                            <div class="inner">
                                <!-- <p class="start-sign">发起合同</p> -->
                                <p class="fast-sign" @click="toFastSign">
                                    快捷签署
                                </p>
                                <p class="fast-sign" @click="toH5Sign">
                                    移动端签署
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <ul class="file-detail-inner">
                <li class="detail-item">
                    <div class="name">文件编码：</div>
                    <div class="value">{{ fileInfo.fileCode }}</div>
                </li>
                <li class="detail-item">
                    <div class="name">文件HASH：</div>
                    <div class="value">{{ fileInfo.fileHash }}</div>
                </li>
                <li class="detail-item">
                    <div class="name">创建时间：</div>
                    <div class="value">{{ fileInfo.gmtCreate }}</div>
                </li>
                <li class="detail-item">
                    <div class="name">文件大小：</div>
                    <div class="value">
                        {{ Math.floor(fileInfo.fileSize / 1024) }}kb
                    </div>
                </li>
                <li class="detail-item">
                    <div class="name">已签署次数：</div>
                    <div class="value">{{ fileInfo.signCount }}</div>
                </li>
                <li class="detail-item">
                    <div class="name">最后签署时间：</div>
                    <div class="value">{{ fileInfo.gmtModified }}</div>
                </li>
            </ul>
            <div class="tab-wrap">
                <el-tabs v-model="tabActiveName" @tab-click="handleSwitchTab">
                    <el-tab-pane
                        label="文件内容"
                        name="first"
                        class="pdf-review"
                    >
                        <div class="file-wrap">
                            <div
                                class="pic-item-wrap"
                                v-for="(picItem, key) in fileImgList"
                                :key="key"
                            >
                                <div class="pic-item" ref="picItem">
                                    <img
                                        :src="picItem"
                                        class="pic-item-img"
                                        alt=""
                                    />
                                </div>
                                <p class="page" v-if="fileImgList.length">
                                    {{ key + 1 }} / {{ totalPage }}
                                </p>
                            </div>
                        </div>
                    </el-tab-pane>
                    <el-tab-pane label="签章日志" name="second">
                        <div class="table" v-if="tabActiveName === 'second'">
                            <el-table
                                ref="sealTable"
                                :data="tableData"
                                tooltip-effect="dark"
                                class="no-border-bottom"
                                style="width: 100%"
                                :row-class-name="tableRowClassName"
                                :header-cell-style="headerStyleFn"
                            >
                                <el-table-column
                                    show-overflow-tooltip
                                    prop="userName"
                                    label="签章人用户名"
                                ></el-table-column>
                                <el-table-column
                                    show-overflow-tooltip
                                    prop="orgName"
                                    label="所属单位/个人"
                                >
                                    <template slot-scope="scope">
                                        {{
                                            scope.row.orgName ||
                                                scope.row.personalName
                                        }}
                                    </template>
                                </el-table-column>
                                <el-table-column
                                    show-overflow-tooltip
                                    prop="sealName"
                                    label="印章名称"
                                ></el-table-column>
                                <el-table-column
                                    show-overflow-tooltip
                                    prop="sealType"
                                    label="印章类型"
                                    min-width="100"
                                >
                                    <template slot-scope="scope">
                                        {{ scope.row.sealType | sealType }}
                                    </template>
                                </el-table-column>
                                <el-table-column
                                    prop="sealCode"
                                    label="印章编码"
                                ></el-table-column>
                                <el-table-column
                                    prop="mediumType"
                                    label="介质类型"
                                    width="100"
                                >
                                    <template slot-scope="scope">
                                        {{ scope.row.mediumType | mediumType }}
                                    </template>
                                </el-table-column>
                                <el-table-column
                                    prop="signFileHash"
                                    label="签后HASH"
                                    min-width="170"
                                ></el-table-column>
                                <el-table-column
                                    show-overflow-tooltip
                                    prop="createDate"
                                    label="签章时间"
                                ></el-table-column>
                            </el-table>
                            <div class="pagination-wrap">
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
                    </el-tab-pane>
                    <el-tab-pane label="打印日志" name="third">
                        <div class="table" v-if="tabActiveName === 'third'">
                            <el-table
                                ref="printTable"
                                :data="tableDataPrint"
                                tooltip-effect="dark"
                                class="no-border-bottom"
                                style="width: 100%"
                                :row-class-name="tableRowClassName"
                                :header-cell-style="headerStyleFn"
                            >
                                <el-table-column
                                    prop="gmtCreate"
                                    label="打印时间"
                                ></el-table-column>
                                <el-table-column
                                    prop="userName"
                                    label="打印人"
                                ></el-table-column>
                                <el-table-column
                                    prop="enterpriseName"
                                    label="所属单位/个人"
                                >
                                </el-table-column>
                            </el-table>
                            <div class="pagination-wrap">
                                <el-pagination
                                    :page-size.sync="paginationPrint.pageSize"
                                    :page-sizes.sync="paginationPrint.pageSizes"
                                    :current-page.sync="
                                        paginationPrint.currentPage
                                    "
                                    :total="paginationPrint.total"
                                    @size-change="sizeChangePrint"
                                    @current-change="currentChangePrint"
                                    layout="total,sizes,prev, pager, next,jumper"
                                >
                                </el-pagination>
                            </div>
                        </div>
                    </el-tab-pane>
                </el-tabs>
            </div>

            <!-- 打印分配弹窗 -->
            <el-dialog
                title="打印分配"
                :visible.sync="showDialog"
                :before-close="resetDialogData"
                class="dialog-box"
                width="38%"
            >
                <el-form
                    class="demo-ruleForm"
                    ref="form"
                    :rules="rules"
                    :model="form"
                    label-width="100px"
                >
                    <el-form-item label="签发主题" prop="chineseName">
                        <el-input
                            v-model="form.chineseName"
                            maxlength="30"
                            placeholder="签发主题"
                            :disabled="true"
                        ></el-input>
                    </el-form-item>
                    <el-form-item label="可打印次数" prop="printNum">
                        <el-input
                            type="number"
                            v-model.number="form.printNum"
                            placeholder="请输入打印次数"
                            oninput="if(value.length>3)value=value.slice(0,3)"
                        ></el-input>
                    </el-form-item>
                    <el-form-item label="分配对象" prop="selectData">
                        <el-select
                            @remove-tag="removeTat"
                            v-model="form.selectData"
                            multiple
                            filterable
                            allow-create
                            default-first-option
                            placeholder="请选择文章标签"
                        >
                            <el-option
                                v-for="item in options"
                                :key="item.id"
                                :label="item.userNickName"
                                :value="item.id"
                            >
                            </el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item>
                        <el-checkbox-group v-model="checkList">
                            <el-checkbox
                                label="雾化打印"
                                @change="atomize"
                            ></el-checkbox>
                            <el-checkbox
                                label="章模脱密"
                                @change="decrypt"
                            ></el-checkbox>
                        </el-checkbox-group>
                    </el-form-item>
                    <el-form-item class="dialog-footer">
                        <el-button @click="cancelBtn">取 消</el-button>
                        <el-button type="primary" @click="confirmBtn('form')"
                            >确 定</el-button
                        >
                    </el-form-item>
                </el-form>
            </el-dialog>
            <!-- 撤销文件 -->
            <el-dialog
                :visible.sync="backoutVisible"
                class="backout-dialog"
                title="撤销文件"
                width="640px"
            >
                <div class="backout-main">
                    <div class="left">
                        <i class="iconfont icon-jingao"></i>
                    </div>
                    <div class="right">
                        <div class="title">撤销文件</div>
                        <div class="desc">
                            文件一旦撤销，剩余未签的签署方将无法签署该文件是否确定撤销？
                        </div>
                    </div>
                </div>
                <div class="backout-footer" slot="footer">
                    <el-button
                        @click="backoutVisible = false"
                        type="info"
                        plain
                        >取消</el-button
                    >
                    <el-button @click="submitBackout" type="primary"
                        >确定</el-button
                    >
                </div>
            </el-dialog>
        </div>
    </div>
</template>

<script>
import { setRowClass } from '@/mixins/setTableRowClass';
import { sessionStore, checkBlobFileResponseUtils } from '@/utils';
import FileSaver from 'file-saver';
import { mapState } from 'vuex';

export default {
    name: 'fileManage',
    mixins: [setRowClass],
    data() {
        return {
            tabActiveName: 'first',
            contractStatus: '', // 合同状态
            fileInfo: {
                fileCode: '',
                fileHash: '',
                gmtCreate: '',
                fileSize: '',
                signCount: '',
                gmtModified: ''
            },
            tableData: [
                // {
                //     userName: '',
                //     orgName: '',
                //     personalName: '',
                //     sealName: '',
                //     sealType: '',
                //     sealCode: '',
                //     mediumType: '',
                //     signFileHash: '',
                //     createDate: ''
                // }
            ],
            options: [],
            tableDataPrint: [
                {
                    gmtCreate: '',
                    userName: '',
                    enterpriseName: ''
                }
            ],
            isFoggy: 0, // 是否雾化
            isGrey: 0, // 是否脱密
            previewUrl: '',
            fileImgList: [], // 文件图片数组
            checkList: [],
            pageCountNow: 2,
            pageLoaded: 0,
            totalPage: 0,
            loadingMore: true,
            showDialog: false,
            fileContentHeight: 0,
            pagination: {
                currentPage: 1,
                pageSize: 10,
                pageSizes: [10, 30, 50, 100],
                total: 0
            },
            paginationPrint: {
                currentPage: 1,
                pageSize: 10,
                pageSizes: [10, 30, 50, 100],
                total: 0
            },
            form: {
                chineseName: '',
                printNum: 1,
                selectData: []
            },
            delSelectItem: [],
            backoutVisible: false,
            // form 规则
            rules: {
                printNum: [
                    {
                        required: true,
                        message: '请输入打印次数',
                        trigger: 'blur'
                    },
                    {
                        validator: function(rule, value, callback) {
                            if (!value) {
                                callback(new Error('请输入打印次数'));
                            } else if (value < 0) {
                                callback(new Error('打印次数不能为负数'));
                            } else {
                                callback();
                            }
                        },
                        trigger: 'blur'
                    }
                ],
                selectData: [
                    {
                        required: true,
                        message: '请输入分配对象',
                        trigger: 'change'
                    },
                    {
                        validator: function(rule, value, callback) {
                            if (!value) {
                                callback(new Error('请输入分配对象'));
                            } else {
                                callback();
                            }
                        },
                        trigger: 'change'
                    }
                ]
            },
            headerStyleFn(row, column, rowIndex) {
                return {
                    background: '#4A90E2',
                    color: '#fff'
                };
            },
            fileCode: '',
            fileName: '',
            sponsorId: '' // 发起合同人id
        };
    },
    mounted() {
        let fileDetailActive = sessionStore.get('fileDetailActive');
        this.compactId = this.$route.query.compactId || '';
        if (fileDetailActive) {
            this.tabActiveName = fileDetailActive;
        } else {
            this.tabActiveName = 'first';
        }
        this.getContractInfo();
        this.initListenerScroll();
        // 查询用户打印权限列表
        this.queryUserSeal();
    },
    computed: {
        ...mapState({
            enterpriseId: (state) => state.userInfo.enterpriseId,
            userId: (state) => state.userInfo.id
        })
    },
    methods: {
        initListenerScroll() {
            let _self = this;
            $('#fileDetail')
                .find('.el-scrollbar__wrap')
                .on('scroll', function(e) {
                    let wrapHeight = $('#fileDetail').height();
                    let scrollTop = e.currentTarget.scrollTop;
                    let fileContentHeight = $('.file-detail').height();
                    // console.log('scrollTop:' + scrollTop);
                    // console.log('fileContentHeight:' + fileContentHeight);
                    // console.log('wrapHeight:' + wrapHeight);
                    if (fileContentHeight - scrollTop < wrapHeight + 600) {
                        if (!_self.loadingMore) return;
                        _self.loadingMore = false;
                        _self.loadMore();
                    }
                });
        },
        loadMore() {
            if (this.totalPage - this.pageCountNow >= 3 && this.totalPage > 3) {
                this.pageCountNow += 3;
            } else {
                this.pageCountNow = this.totalPage;
            }
            if (this.pageLoaded >= this.totalPage) return;
            this.getFilePdf(this.fileCode);
        },
        /**获取合同信息 */
        getContractInfo() {
            this.$api('viewContract')
                .post(
                    'postQuery',
                    {},
                    {
                        contractId: this.compactId
                    }
                )
                .then((res) => {
                    if (!res) return;
                    let data = res.data.data;
                    if (data.deleteOrRevoke) {
                        // 该合同已被删除
                        this.$message.warning('该文件已被删除！');
                        setTimeout(() => {
                            this.$router.go(-1);
                        }, 1000);
                        return;
                    }
                    this.fileCode = data.compactFiles[0].fileCode;
                    this.fileName = data.contractTheme;
                    this.contractStatus = data.contractStatus;
                    this.sponsorId = data.sponsorId;
                    // console.log(data.compactFiles[0]);
                    this.getFileInfo(this.fileCode);
                });
        },
        getFileInfo(fileCode) {
            this.$api('queryDocumentDet')
                .post(
                    'postQuery',
                    {},
                    {
                        fileCode: fileCode
                    }
                )
                .then((res) => {
                    if (!res) return;
                    console.log(res);
                    this.fileInfo = res.data.data;
                    this.getOtherInfo();
                });
        },
        getOtherInfo() {
            if (this.tabActiveName === 'first') {
                this.getFileTotalPage(this.fileCode);
            } else if (this.tabActiveName === 'second') {
                this.getQuerySignLog();
            } else {
                this.getQueryPrintLog();
            }
        },
        getFilePdf(fileCode) {
            if (this.pageLoaded >= this.totalPage) return;
            let fileCodeNew = fileCode || this.fileCode;
            this.pageLoaded++;
            this.$api('fetch')
                .get(
                    'getBlob',
                    {
                        fileCodeNew: fileCodeNew,
                        pageLoaded: this.pageLoaded
                    },
                    {
                        headers: {
                            noLoading: true
                        }
                    }
                )
                .then((res) => {
                    let _self = this;
                    // console.log(res.data);
                    if (!res) return;
                    let blob = res.data;
                    let checkBlobFileResponse = checkBlobFileResponseUtils(
                        blob
                    );
                    checkBlobFileResponse
                        .then((res) => {
                            let url = window.URL.createObjectURL(res);
                            _self.fileImgList.push(url);
                            _self.fileImg = url;
                            if (_self.pageLoaded < _self.pageCountNow) {
                                _self.getFilePdf();
                            } else {
                                _self.loadingMore = true;
                            }
                        })
                        .catch((error) => {
                            _self.$message.warning(error);
                        });
                });
        },
        // 获取文件总页数
        getFileTotalPage(fileCode) {
            this.$api('getPicSize')
                .get('getPath', {
                    fileCode: fileCode
                })
                .then((res) => {
                    if (!res) return;
                    let data = res.data.data;
                    this.totalPage = data.totalPageNo;
                    this.loadMore();
                });
        },
        getQuerySignLog() {
            this.$api('querySignLog')
                .post('postNormal', {
                    currentPage: this.pagination.currentPage,
                    pageSize: this.pagination.pageSize,
                    fileCode: this.fileCode
                })
                .then((res) => {
                    if (!res) return;
                    // console.log(res);
                    let data = res.data.data;
                    this.tableData = data.records;
                    this.pagination.total = data.total;
                });
        },
        getQueryPrintLog() {
            this.$api('getFilePrintList')
                .get('getNormal', {
                    currPage: this.paginationPrint.currentPage,
                    pageSize: this.paginationPrint.pageSize,
                    fileCode: this.fileCode
                })
                .then((res) => {
                    if (!res) return;
                    // console.log(res);
                    let data = res.data.data;
                    this.tableDataPrint = data.records;
                    this.paginationPrint.total = data.total;
                });
        },
        deleteFile() {
            this.$confirm('确定删除该文件？', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                this.$api('del')
                    .post(
                        'postQuery',
                        {},
                        {
                            compactId: this.compactId
                        }
                    )
                    .then((res) => {
                        if (!res) return;
                        // console.log(res);
                        this.$message.success('删除成功！');
                        let that = this;
                        setTimeout(() => {
                            that.$router.go(-1);
                        }, 1000);
                    });
            });
        },
        // 下载
        doloadFile() {
            this.$api('fileDownload')
                .post('postBlobQuery', {
                    contractId: this.compactId
                })
                .then((res) => {
                    if (!res) return;
                    let blob = res.data;
                    let _self = this;
                    let checkBlobFileResponse = checkBlobFileResponseUtils(
                        blob
                    );
                    checkBlobFileResponse
                        .then((res) => {
                            FileSaver.saveAs(res, _self.fileName);
                        })
                        .catch((error) => {
                            _self.$message.warning(error);
                        });
                });
        },
        // 获取打印分配对象
        printFile() {
            this.showDialog = true;
            this.form.chineseName = this.fileName;
            // if (this.options.length === 0) {
            //     this.queryUserSeal()
            // }
            // this.queryUserSeal();
            this.getPrintAuthList();
        },
        // 查询当前用户对象
        queryUserSeal() {
            this.$api('getAllUser')
                .get('getPath', {
                    enterpriseId: this.enterpriseId
                })
                .then((res) => {
                    if (!res) return;
                    this.options = res.data.data;
                });
        },
        // 获取已分配对象
        getPrintAuthList() {
            this.$api('getPrintAuthList')
                .get(
                    'getNormal',
                    {
                        fileCode: this.fileCode
                    },
                    {
                        headers: {
                            noLoading: true
                        }
                    }
                )
                .then((res) => {
                    if (!res) return;
                    let data = res.data.data;
                    this.form.selectData = data.list.map((v) => v.userId);
                    this.delSelectItem = data.list.map((v) => v.userId);
                    if (data.printDisNum === null) return 0;
                    this.form.printNum = data.printDisNum;
                });
        },
        // 移除select选中项
        removeTat() {
            let delIds = this.delSelectItem.filter((v) => {
                let flag = true;
                for (let i = 0; i < this.form.selectData.length; i++) {
                    if (this.form.selectData[i] === v) {
                        flag = false;
                        break;
                    }
                }
                return flag;
            });
            if (delIds.length > 0) {
                this.$api('delPrintAuthList')
                    .delete({
                        fileCode: this.fileCode,
                        userIds: delIds.join(','),
                        contentType: 'json'
                    })
                    .then((res) => {
                        if (!res) return;
                    });
            }
        },
        // 可打印分配取消
        cancelBtn() {
            this.$refs.form.resetFields();
            this.showDialog = false;
        },
        // 雾化打印
        atomize(e) {
            this.isFoggy = e ? '1' : '0';
        },
        // 章模脱密
        decrypt(e) {
            this.isGrey = e ? '1' : '0';
        },
        // 打印分配提交
        confirmBtn(formName) {
            this.$refs[formName].validate((valid) => {
                if (valid) {
                    this.$api('addPrintAuthUser')
                        .post('postNormal', {
                            fileCode: this.fileCode,
                            printNum: this.form.printNum,
                            isFoggy: this.isFoggy,
                            isGrey: this.isGrey,
                            userIds: this.form.selectData.join(',')
                        })
                        .then((res) => {
                            let code = res.data.code;
                            let msg = res.data.msg;
                            this.showDialog = false;
                            if (code === 0) {
                                this.$message.success('分配成功');
                            } else {
                                this.$message.warning(msg);
                            }
                        })
                        .catch((err) => {
                            console.log(err);
                        });
                } else {
                    console.log('error submit!!');
                    return false;
                }
            });
        },
        sizeChange(pageSize) {
            console.log(pageSize);
            this.pagination.pageSize = pageSize;
            this.pagination.currentPage = 1;
            this.getQuerySignLog();
        },
        sizeChangePrint(pageSize) {
            // console.log(pageSize);
            this.paginationPrint.pageSize = pageSize;
            this.paginationPrint.currentPage = 1;
            this.getQueryPrintLog();
        },
        resetDialogData() {
            this.showDialog = false;
        },
        currentChange() {
            this.getQuerySignLog();
        },
        currentChangePrint() {
            this.getQueryPrintLog();
        },
        handleSwitchTab(event) {
            if (event.name === 'first') {
                this.getFilePdf();
            } else if (event.name === 'second') {
                this.getQuerySignLog();
            } else if (event.name === 'third') {
                this.getQueryPrintLog();
            }
            sessionStore.set('fileDetailActive', event.name);
        },
        // 快捷签署
        toFastSign() {
            this.$router.push({
                path: '/fileCenter/cloudSing',
                query: {
                    fileCode: this.fileCode,
                    compactId: this.fileInfo.compactId,
                    fileName: this.fileName,
                    signStatus: this.fileInfo.signStatus // 签署状态（01：待我签署；02：待他人签；03：签署通过；
                }
            });
            sessionStore.remove('fileDetailActive');
        },
        toH5Sign() {
            this.$router.push({
                path: '/h5sign/h5SignIndex',
                query: {
                    fileCode: this.fileCode,
                    fileName: this.fileName
                }
            });
            sessionStore.remove('fileDetailActive');
        },
        // 撤销
        async submitBackout() {
            let res = await this.$api('revokeContract').post(
                'postQuery',
                {},
                {
                    contractId: this.compactId,
                    revokeContent: ''
                }
            );
            if (!res) return;
            this.$message.success('撤销成功！');
            this.getContractInfo();
            this.backoutVisible = false;
        },
    },
    beforeRouteLeave(to, from, next) {
        // ...
        $('#fileDetail')
            .find('.el-scrollbar__wrap')
            .unbind();
        next();
    }
};
</script>

<style lang="scss" scoped>
.backout-dialog {
    .backout-main {
        display: flex;
        align-items: center;
        margin-bottom: 20px;
        .left {
            width: 40px;
            height: 40px;
            margin-right: 20px;
            .iconfont {
                font-size: 40px;
                color: #f7bc30;
            }
        }
        .right {
            line-height: 26px;
            .title {
                font-size: 18px;
                margin-bottom: 10px;
            }
            .desc {
                font-size: 16px;
                color: #626262;
            }
        }
    }
    .backout-footer {
        text-align: center;
        padding-bottom: 30px;
        .el-button {
            width: 80px;
            margin: 0 10px;
        }
    }
}
.file-detail {
    .el-table__header-wrapper {
        overflow: auto !important;
    }
    .dialog-footer {
        margin: 50px 0 0;
    }
    .el-select {
        width: 100%;
    }
}
.breadcrumb {
    .el-breadcrumb {
        font-size: 16px;
        color: #333;
        height: 46px;
        line-height: 46px;
        margin-left: 22px;
    }
}
.header-wrap {
    display: flex;
    margin-left: 22px;
    height: 36px;
    align-items: center;
    justify-content: space-between;
    .file-name {
        font-size: 20px;
        font-weight: bold;
        color: rgba(0, 0, 0, 0.85);
    }
    .handle-wrap {
        display: flex;
        align-items: center;
        .doload-times,
        .print-times {
            font-size: 12px;
            color: #999;
            margin-right: 35px;
            span {
                margin-right: 5px;
            }
        }
        .el-button {
            margin-right: 20px;
            margin-left: 0;
            width: 94px;
        }
        .sign-file {
            position: relative;
            .el-button {
                width: 124px;
                margin-left: 0;
                i {
                    margin-left: 10px;
                }
            }
            &:hover {
                .fixed {
                    display: block;
                }
            }
            .fixed {
                display: none;
                width: 124px;
                position: absolute;
                top: 36px;
                left: 0;
                background: #fff;
                .inner {
                    border: 1px solid #d3dce6;
                    box-shadow: 0 2px 4px 0 rgba(0, 0, 0, 0.12),
                        0 0 6px 0 rgba(0, 0, 0, 0.04);
                    border-radius: 2px;
                    margin-top: 4px;
                }
                p {
                    height: 36px;
                    line-height: 36px;
                    margin-left: 10px;
                    color: #475669;
                    cursor: pointer;
                }
            }
        }
    }
}
.file-detail-inner {
    display: flex;
    flex-wrap: wrap;
    padding: 10px 20px 10px 32px;
    margin: 16px 20px 20px;
    background: #f9fafd;
    border: solid 1px #c0ccda;
    border-radius: 4px;
    .detail-item {
        display: flex;
        width: 37%;
        align-items: center;
        min-height: 40px;
        margin-right: 3px;
        .name {
            white-space: nowrap;
        }
        .value {
            line-height: 20px;
            word-break: break-all;
        }
    }
    .detail-item:nth-child(3n) {
        width: 23%;
    }
}
.tab-wrap {
    margin: 0 22px;
    position: relative;
    .file-wrap {
        background: rgb(224, 222, 222);
        .pic-item-wrap {
            padding-top: 10px;
            width: 80%;
            position: relative;
            margin: 0 auto;
            .pic-item {
                min-height: 800px;
                background: #fff url('../../assets/image/default-bg.svg')
                    no-repeat center center;
                // background: #fff;
            }
            .pic-item-img {
                width: 100%;
                min-height: 800px;
            }
            .page {
                text-align: center;
            }
        }
    }
}
.table {
    margin: 20px 0;
    padding-bottom: 20px;
    .view {
        color: #999;
        cursor: pointer;
    }
    .pagination-wrap {
        text-align: right;
        margin-top: 40px;
        margin-right: 58px;
    }
}
</style>
<style lang="scss">
.file-detail {
    .dialog-footer {
        .el-form-item__content {
            margin-left: 0 !important;
            text-align: center;
        }
    }
}
</style>
