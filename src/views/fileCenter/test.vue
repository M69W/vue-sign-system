<template>
    <div class="file-manage">
        <div class="inner">
            <div class="breadcrumb">
                <el-breadcrumb separator="/">
                    <el-breadcrumb-item>文档管理</el-breadcrumb-item>
                </el-breadcrumb>
            </div>
            <div class="search-wrap">
                <div class="left">
                    <div class="form-wrap">
                        <el-form
                            :model="searchForm"
                            :inline="true"
                            label-width="70px"
                            ref="validationForm"
                            ><el-form-item
                                class="date"
                                label="日期"
                                prop="date"
                            >
                                <el-date-picker
                                    v-model="searchForm.searchDate"
                                    type="daterange"
                                    range-separator="-"
                                    start-placeholder="开始日期"
                                    end-placeholder="结束日期"
                                    value-format="yyyy/MM/dd"
                                    format="yyyy/MM/dd"
                                ></el-date-picker>
                            </el-form-item>
                            <el-form-item label="签发主题" prop="fileName">
                                <el-input
                                    size="medium"
                                    v-model.trim="searchForm.fileName"
                                    placeholder="请输入签发主题"
                                    clearable
                                ></el-input>
                            </el-form-item>
                            <el-form-item label="状态" prop="status">
                                <el-select
                                    v-model="searchForm.status"
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
                            <el-form-item>
                                <Authorized
                                    :authrity="$permissionMap.fileManageSearch"
                                >
                                    <el-button
                                        @click="searchFile"
                                        size="medium"
                                        class="search-btn"
                                    >
                                        <i
                                            class="iconfont icon-chaxun el-icon--left"
                                        ></i>
                                        搜索
                                    </el-button>
                                </Authorized>
                            </el-form-item>
                        </el-form>
                    </div>
                </div>
                <div class="right">
                    <Authorized :authrity="$permissionMap.fileManageSign">
                        <el-button
                            @click="uploadFile"
                            type="primary"
                            size="medium"
                            class="search-btn-2"
                        >
                            <i
                                class="iconfont icon-shangchuanwenjian1 el-icon--left"
                            ></i>
                            签发文件
                        </el-button>
                    </Authorized>
                </div>
            </div>
            <div class="table">
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
                        min-width="160"
                        prop="compactTheme"
                        label="签发主题"
                    >
                        <template slot-scope="scope">
                            <div class="compact-theme">
                                <div class="location" v-if="scope.row.num">
                                    <el-tooltip
                                        class="item"
                                        effect="dark"
                                        placement="top"
                                        popper-class="vertify-code"
                                    >
                                        <div slot="content">
                                            已指定签署位置
                                        </div>
                                        <i class="iconfont icon-icon-test"></i>
                                    </el-tooltip>
                                </div>
                                <div class="theme-wrap">
                                    <el-tooltip
                                        class="item"
                                        effect="dark"
                                        placement="top"
                                        popper-class="vertify-code"
                                    >
                                        <div slot="content">
                                            {{ scope.row.compactTheme }}
                                        </div>
                                        <span class="theme">{{
                                            scope.row.compactTheme
                                        }}</span>
                                    </el-tooltip>
                                </div>
                            </div>
                        </template>
                    </el-table-column>
                    <el-table-column
                        show-overflow-tooltip
                        min-width="160"
                        prop="sponsor"
                        label="发起人"
                    ></el-table-column>
                    <el-table-column
                        show-overflow-tooltip
                        width="100"
                        prop="signer"
                        label="签署人"
                    ></el-table-column>
                    <el-table-column
                        show-overflow-tooltip
                        width="200"
                        prop="startingTime"
                        label="发起时间"
                    >
                        <template slot-scope="scope">
                            {{
                                scope.row.startingTime
                                    ? scope.row.startingTime
                                    : '--'
                            }}
                        </template>
                    </el-table-column>
                    <el-table-column
                        show-overflow-tooltip
                        width="100"
                        prop="contractStatus"
                        label="状态"
                    >
                        <template slot-scope="scope">
                            {{
                                scope.row.contractStatus | filterContractStatus
                            }}
                        </template>
                    </el-table-column>
                    <el-table-column
                        prop="verificationCode"
                        label="验证码"
                        min-width="160"
                    >
                        <template slot-scope="scope">
                            <div
                                class="vertify"
                                v-if="
                                    scope.row.verificationCode &&
                                        scope.row.verificationCode !== '0'
                                "
                            >
                                <span class="code">
                                    {{ scope.row.verificationCode }}
                                </span>
                                <el-tooltip
                                    class="item"
                                    effect="dark"
                                    placement="top"
                                    popper-class="vertify-code"
                                >
                                    <div slot="content">
                                        {{
                                            scope.row.verificationDate
                                                | filterDate
                                        }}
                                    </div>
                                    <i class="iconfont icon-jingao"></i>
                                </el-tooltip>
                            </div>
                        </template>
                    </el-table-column>
                    <el-table-column prop="QR" label="二维码" width="140">
                        <template slot-scope="scope">
                            <div class="QR" v-if="scope.row.qrCode">
                                <el-tooltip
                                    class="item"
                                    effect="light"
                                    placement="top"
                                    popper-class="qr-popper"
                                >
                                    <div slot="content">
                                        <qriously
                                            :value="scope.row.qrUrl"
                                            :size="qrSizeBig"
                                            :backgroundAlpha="backgroundAlpha"
                                            ref="qrcode"
                                            class="qrcode-inner"
                                            style="text-align:center"
                                        ></qriously>
                                    </div>
                                    <qriously
                                        :value="scope.row.qrUrl"
                                        :size="qrSize"
                                        :backgroundAlpha="backgroundAlpha"
                                        ref="qrcode"
                                        class="qrcode"
                                        style="text-align:center"
                                    ></qriously>
                                </el-tooltip>
                                <el-tooltip
                                    class="item"
                                    effect="dark"
                                    placement="top"
                                    popper-class="vertify-code"
                                >
                                    <div slot="content">
                                        {{
                                            scope.row.verificationDate
                                                | filterDate
                                        }}
                                    </div>
                                    <i class="iconfont icon-jingao"></i>
                                </el-tooltip>
                            </div>
                        </template>
                    </el-table-column>
                    <el-table-column label="操作" width="200">
                        <template
                            slot-scope="scope"
                            v-if="scope.row.isSupermanager != '1'"
                        >
                            <span
                                class="view"
                                type="text"
                                size="small"
                                @click="toDetail(scope.row)"
                                >查看</span
                            >
                            <span
                                class="view print"
                                type="text"
                                size="small"
                                @click="toSign(scope.row)"
                                v-if="['0401', '070'].includes(scope.row.contractStatus)"
                                >{{scope.row.contractStatus === '070' ? '填写' : '签署'}}</span
                            >
                            <span
                                class="view"
                                @click="toSign(scope.row)"
                                v-show="['0405', '0010'].includes(scope.row.contractStatus)"
                                >审批</span
                            >
                            <!-- 开发暂时使用H5签署 -->
                            <!-- <span
                                class="view print"
                                type="text"
                                size="small"
                                @click="toH5Sign(scope.row)"
                                v-if="scope.row.contractStatus === '0401'"
                                >H5签署</span
                            > -->
                            <span
                                class="view print"
                                type="text"
                                size="small"
                                @click="printFile(scope.row)"
                                v-if="scope.row.contractStatus === '05'"
                                >{{scope.row.printNum ? '打印' : '打印申请' }}</span
                            >
                            <span
                                class="view print"
                                type="text"
                                size="small"
                                @click="downLoad(scope.row)"
                                v-if="scope.row.contractStatus === '05'"
                                >下载</span
                            >
                            <span
                                class="view print"
                                type="text"
                                size="small"
                                @click="reStart(scope.row)"
                                v-if="scope.row.contractStatus === '02'||(scope.row.contractStatus === '03'&&scope.row.sponsorId===currentUserId)"
                                >重新发起</span
                            >
                            <span
                                class="view print"
                                type="text"
                                size="small"
                                @click="deleteContract(scope.row)"
                                v-if="scope.row.contractStatus === '02'||scope.row.contractStatus === '03'"
                                >删除</span
                            >
                            <!-- <span
                                class="view"
                                type="text"
                                size="small"
                                @click="useSeal(scope.row)"
                                >用印申请</span
                            > -->
                        </template>
                    </el-table-column>
                </el-table>
                <div class="pagination-wrap" v-if="pagination.total">
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
        <el-dialog
            :modal-append-to-body="false"
            title="上传文件"
            class="dialog-upload-file"
            :visible.sync="dialogUploadVisible"
            @close="closeUploadDialog"
        >
            <div class="file-wrap">
                <el-upload
                    ref="fileUpload"
                    class="upload-demo"
                    drag
                    action="https://jsonplaceholder.typicode.com/posts/"
                    multiple
                    :limit="1"
                    :file-list="fileList"
                    :on-success="uploadSuccess"
                    :on-error="uploadFaild"
                    :http-request="resetFile"
                    accept=".pdf, .docx, .doc, .html, .xls, .xlsx, .jpg, .png, .bmp, .PDF, .DOCX, .DOC, .HTML, .XLS, .XLSX, .JPG, .PNG, .BMP"
                >
                    <i class="iconfont icon-tuozhuaiwenjian"></i>
                    <div class="el-upload__text">
                        <p class="hand-way">
                            将文件拖拽到此处，或
                            <span>点击上传</span>
                        </p>
                        <p class="hand-way-drag">将文件拖拽到此处</p>
                        <p class="support-type">
                            支持扩展名：.pdf .docx .doc .html .xls .xlsx .jpg
                            .png .bmp
                        </p>
                    </div>
                </el-upload>
            </div>
            <div class="btns-wrap">
                <el-button size="medium" @click="cancelUpload">取消</el-button>
                <el-button type="primary" size="medium" @click="sureUpload"
                    >确定</el-button
                >
            </div>
        </el-dialog>
        <el-dialog
            :modal-append-to-body="false"
            title="文件加载"
            class="dialog-upload-file"
            width="450px"
            :visible.sync="dialogFileViewVisible"
            @close="closeViewDialog"
        >
            <div class="review-wrap" v-if="!isIE">
                <div class="progress">
                    <el-progress
                        :percentage="percentage"
                        :show-text="showText"
                    ></el-progress>
                </div>
                <p class="loading">加载中...</p>
            </div>
            <div class="review-wrap" v-if="isIE">
                <p class="mention">
                    <i class="iconfont icon-jingao"></i
                    >当前浏览器不支持打印签章外观，请您下载后自行打印，或使用Chrome浏览器打印。
                </p>
                <div class="btns-wrap">
                    <el-button size="medium" @click="cancelPrintUpload"
                        >取消</el-button
                    >
                    <el-button
                        type="primary"
                        size="medium"
                        @click="downloadFile"
                        >下载</el-button
                    >
                </div>
            </div>
        </el-dialog>
        <!-- 用印申请 -->
        <el-dialog
            title="用印申请"
            :visible.sync="useApplyDialog"
            :before-close="beforeCloseDialog"
            class="dialog-box-other"
        >
            <el-form
                ref="frameFormEdit"
                :rules="useApplyRules"
                :model="frameFormEdit"
                label-width="100px"
            >
                <el-form-item
                    class="select_bar"
                    label="印章名称"
                    prop="sealName"
                >
                    <el-select
                        v-model="frameFormEdit.sealName"
                        placeholder="请选择印章名称"
                    >
                        <el-option
                            v-for="item in optionsSealName"
                            :key="item.value"
                            :label="item.label"
                            :value="item.value"
                        ></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="申请次数" prop="number">
                    <el-input
                        v-model="frameFormEdit.number"
                        type="number"
                        clearable
                        oninput="if(value.length>5)value=value.slice(0,6)"
                        placeholder="请输入申请次数（限数字）"
                    ></el-input>
                </el-form-item>
                <el-form-item label="失效时间" prop="endTime">
                    <el-date-picker
                        class="no-time-now"
                        v-model="frameFormEdit.endTime"
                        type="datetime"
                        format="yyyy/MM/dd HH:mm"
                        value-format="yyyy/MM/dd HH:mm"
                        :picker-options="pickerOptions"
                    ></el-date-picker>
                </el-form-item>
                <el-form-item label="申请事由" prop="useReason">
                    <el-input
                        v-model="frameFormEdit.useReason"
                        type="textarea"
                        maxlength="300"
                        class="use-reason"
                        show-word-limit
                        placeholder="请输入申请事由"
                    ></el-input>
                </el-form-item>
                <!-- 透传合同ID -->
                <el-form-item label="合同ID" prop="compactId" v-if="false">
                    <el-input
                        v-model="frameFormEdit.compactId"
                        type="text"
                        placeholder="请输入合同ID"
                    ></el-input>
                </el-form-item>
                <!-- 透传MAC -->
                <el-form-item label="MAC" prop="mac" v-if="false">
                    <el-input
                        v-model="frameFormEdit.mac"
                        type="text"
                        placeholder="请输入mac"
                    ></el-input>
                </el-form-item>
            </el-form>
            <div class="dialog-footer">
                <el-button size="medium" @click="cancelBtn('frameFormEdit')"
                    >取消</el-button
                >
                <el-button
                    type="primary"
                    size="medium"
                    @click="saveBtn('frameFormEdit')"
                    >保存</el-button
                >
            </div>
        </el-dialog>
        <!-- 打印设置 -->
        <print-set
            :parentCom="this"
            :fileList="fileList"
            :contractInfo="contractInfo"
            :appoint="appoint"
        ></print-set>
        <!-- 打印申请 -->
        <print-apply 
        :visible.sync="printApplyVisible"
        :contractId="printRow.compactId"
        @apply-success="printRow.printApplying=true"></print-apply>
    </div>
</template>

<script>
import { setRowClass } from '@/mixins/setTableRowClass';
import { sessionStore, isIE, checkBlobFileResponseUtils } from '@/utils';
import { refreshMenuItem } from '@/mixins/clickMenuItemForRefresh';
import { mapState } from 'vuex';
import printSet from '../contractMgt/index/components/printSet';
import FileSaver from 'file-saver';
import JSZip from 'jszip';
import printJS from 'print-js';
import qrCode from '@/components/createQR';
import printApply from '@/components/printApply';
export default {
    name: 'fileManage',
    mixins: [setRowClass, refreshMenuItem],
    components: { 'qr-code': qrCode, printSet, printApply },
    data() {
        return {
            appoint: null,
            printApplyVisible: false,
            currentUserId: sessionStore.get('userInfo').id,
            searchForm: {
                searchDate: '',
                fileName: '',
                status: ''
            },
            tableData: [],
            dialogUploadVisible: false,
            dialogFileViewVisible: false,
            fileList: [], // 文件列表
            contractInfo: {}, // 合同信息
            printRow: '',
            printSetVisible: false,
            formdata: null,
            pagination: {
                currentPage: 1,
                pageSize: 10,
                pageSizes: [10, 30, 50, 100],
                total: 0
            },
            pdfUrl: '',
            pageCount: 0,
            currentPage: 0,
            percentage: 0,
            showText: false,
            isIE: false,
            qrSize: 40,
            qrSizeBig: 100,
            compactId: '',
            compactTheme: '',
            backgroundAlpha: 1,
            printContractId: null,
            headerStyleFn(row, column, rowIndex) {
                return {
                    background: '#4A90E2',
                    color: '#fff'
                };
            },
            signSetData: {},
            useApplyDialog: false, // 用印申请弹窗
            frameFormEdit: {
                sealName: '',
                number: 1,
                endTime: '',
                useReason: '',
                compactId: '',
                mac: ''
            },
            optionsSealName: [],
            useApplyRules: {
                endTime: [
                    {
                        required: true,
                        message: '失效时间不能为空',
                        trigger: 'blur'
                    },
                    {
                        validator: function(rule, value, callback) {
                            let curTime =
                                new Date(value).getTime() >= Date.now();
                            if (!value) {
                                callback(new Error('失效时间不能为空'));
                            } else if (!curTime) {
                                callback(new Error('失效时间不能小于当前时间'));
                            } else {
                                callback();
                            }
                        },
                        trigger: 'blur'
                    }
                ],
                number: [
                    {
                        required: true,
                        message: '申请次数不能为空',
                        trigger: 'blur'
                    },
                    {
                        validator: function(rule, value, callback) {
                            if (!value) {
                                callback(new Error('申请次数不能为空'));
                            } else if (value <= 0) {
                                callback(new Error('申请次数不能小于0次'));
                            } else {
                                callback();
                            }
                        },
                        trigger: 'blur'
                    }
                ],
                useReason: [
                    {
                        required: true,
                        message: '申请事由不能为空',
                        trigger: 'blur'
                    },
                    {
                        validator: function(rule, value, callback) {
                            if (!value) {
                                callback(new Error('申请事由不能为空'));
                            } else {
                                callback();
                            }
                        },
                        trigger: 'blur'
                    }
                ],
                sealName: [
                    {
                        required: true,
                        message: '印章名称不能为空',
                        trigger: 'change'
                    },
                    {
                        validator: function(rule, value, callback) {
                            if (value === null) {
                                callback(new Error('印章名称不能为空'));
                            } else {
                                callback();
                            }
                        },
                        trigger: 'change'
                    }
                ]
            },
            pickerOptions: {
                disabledDate(val) {
                    return val.getTime() <= Date.now();
                }
            },
            otherId: '', // 白鹤id
            statusOptions: [
                {
                    value: '',
                    label: '全部'
                },
                {
                    value: '01',
                    label: '草稿'
                },
                {
                    value: '02',
                    label: '已撤销'
                },
                {
                    value: '03',
                    label: '已拒签'
                },
                {
                    value: '0401',
                    label: '待我签署'
                },
                {
                    value: '040203',
                    label: '待他人签'
                },
                {
                    value: '05',
                    label: '签署完成'
                },
                {
                    value: '06',
                    label: '已过期'
                },
                {
                    value: '070',
                    label: '待填写'
                },
                {
                    value: '071',
                    label: '待他人填写'
                },
                {
                    value: '0010',
                    label: '待我审批'
                },
                {
                    value: '0110',
                    label: '待他人审批'
                },
                {
                    value: '09',
                    label: '已驳回'
                }
            ]
        };
    },
    computed: {
        ...mapState({
            uploadFileSize(state) {
                return state.settings.uploadFileSize;
            }
        })
    },
    watch: {
        isSameMenu(newVal, oldVal) {
            this.getSignConfig();
            this.searchForm.fileName = '';
        }
    },
    filters: {
        filterDate(val) {
            return val ? '永久有效' : '有效期至：' + val;
        }
    },
    mounted() {
        this.searchForm.status = sessionStore.get('homeSearchStatus') || '';
        sessionStore.remove('homeSearchStatus');
        this.getSignConfig();
        this.getBaiheId();
    },
    methods: {
        getSignConfig() {
            this.$api('getSignConfig')
                .get()
                .then((res) => {
                    if (!res) return;
                    let data = res.data.data;
                    this.signSetData = data;
                    this.getDocList();
                });
        },
        getDocList() {
            console.log(this.searchForm);
            this.$api('queryDocumentListFileCenter')
                .post('postNormal', {
                    pageNum: this.pagination.currentPage,
                    pageSize: this.pagination.pageSize,
                    content: this.searchForm.fileName,
                    orgId: sessionStore.get('userInfo').enterpriseId,
                    status: this.searchForm.status,
                    timeBefore: this.searchForm.searchDate
                        ? this.searchForm.searchDate[0]
                        : '',
                    timeAfter: this.searchForm.searchDate
                        ? this.searchForm.searchDate[1]
                        : ''
                })
                .then((res) => {
                    if (!res) return;
                    let data = res.data.data;
                    this.tableData = data.records;

                    let qrUrl;
                    let origin = window.location.origin;
                    this.tableData.forEach((el) => {
                        let dateVerification = new Date(
                            el.gmtVerification
                        ).getTime();
                        let dateNow = new Date().getTime();
                        if (
                            el.gmtVerification &&
                            el.gmtVerification !== '0' &&
                            dateVerification < dateNow
                        ) {
                            // 过期了
                            qrUrl =
                                origin +
                                `/sign-sys/#/fileCenter/qrToPhoneReal?fileCode=${
                                    el.compactId
                                }&timeOut=1`;
                        } else {
                            qrUrl =
                                origin +
                                `/sign-sys/#/fileCenter/qrToPhoneReal?fileCode=${
                                    el.compactId
                                }`;
                        }
                        el.qrUrl = qrUrl;
                    });
                    this.pagination.total = data.total;
                });
        },
        searchFile() {
            this.pagination.currentPage = 1;
            console.log(this.searchForm);
            this.getDocList();
        },
        uploadFile() {
            // this.dialogUploadVisible = true;
            // window.print();
            this.$router.push('/fileCenter/StartContract');
        },
        // 用印申请右上角关闭回调
        beforeCloseDialog() {
            this.useApplyDialog = false;
            this.$refs.frameFormEdit.resetFields();
            this.optionsSealName = [];
        },
        // 用印申请
        useSeal(row) {
            this.printContractId = row;
            this.frameFormEdit.compactId = row.compactId;
            this.getSealList();
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
        // 获取印章列表
        getSealList() {
            this.$api('getSealList')
                .get()
                .then((res) => {
                    if (!res) return;
                    let code = res.data.code;
                    if (code === 10012 && !this.otherId) {
                        this.$message.warning(
                            '暂无数据，请先登录后台同步章数据至白鹤平台！'
                        );
                        return;
                    } else if (code === 10012 && this.otherId) {
                        this.$message.warning('暂无数据！');
                        return;
                    }

                    this.useApplyDialog = true;
                    let data = res.data.data.sealList;
                    this.optionsSealName = [];
                    data.map((cur, index, arr) => {
                        this.optionsSealName.push({
                            label: cur.name,
                            value: index,
                            id: cur.id
                        });
                    });
                });
        },
        // 用印申请保存
        saveBtn(formName) {
            this.$refs[formName].validate((valid) => {
                if (valid) {
                    this.optionsSealName.map((item, index) => {
                        if (index === this.frameFormEdit.sealName) {
                            this.frameFormEdit.sealName = item.label;
                            this.frameFormEdit.id = item.id;
                        }
                    });
                    this.$api('fileUseSeal')
                        .post('postNormal', {
                            applyCount: this.frameFormEdit.number, // 申请次数
                            applyCause: this.frameFormEdit.useReason, // 申请事由
                            contractId: this.frameFormEdit.compactId, // 合同ID
                            expireTime: new Date(
                                this.frameFormEdit.endTime
                            ).getTime(), // 失效时间
                            sealId: this.frameFormEdit.id, // 印章id
                            sealName: this.frameFormEdit.sealName // 印章名称
                        })
                        .then((res) => {
                            let code = res.data.code;
                            if (code === 0) {
                                this.useApplyDialog = false;
                                this.printFile(this.printContractId); // 调用打印服务
                                this.$refs.frameFormEdit.resetFields();
                            } else if (code === 10012) {
                                this.$message.warning({
                                    message:
                                        '暂无签名，请先登录到白鹤平台创建签名！',
                                    customClass: 'zZindex'
                                });
                            } else {
                                this.$message.warning({
                                    message: res.data.msg,
                                    customClass: 'zZindex'
                                });
                            }
                        });
                } else {
                    console.log('error submit!!');
                    return false;
                }
            });
        },
        // 用印申请取消
        cancelBtn(frameForm) {
            this.useApplyDialog = false;
            this.$refs[frameForm].resetFields();
            this.optionsSealName = [];
        },
        resetFile(options) {
            let file = options.file;
            let fileSize = file.size;
            if (fileSize > 1024 * 1024 * this.uploadFileSize) {
                this.$message.warning({
                    message: `上传文件不得大于${
                        this.uploadFileSize
                    }兆，请重新选择！`,
                    customClass: 'zZindex'
                });
                this.fileList = [];
                return;
            }
            let formdata = new FormData();
            formdata.append('file', file);
            this.formdata = formdata;
        },
        uploadSuccess(res) {},
        uploadFaild(err) {
            this.$message.warning({
                message: err.msg,
                customClass: 'zZindex'
            });
        },
        cancelUpload() {
            this.dialogUploadVisible = false;
            this.fileList = [];
            this.formdata = null;
            this.$refs.fileUpload.clearFiles();
        },
        cancelPrintUpload() {
            this.dialogFileViewVisible = false;
        },
        sureUpload() {
            if (!this.formdata) return;
            this.$api('upload')
                .post('postFormDataQuery', this.formdata, {
                    userId: sessionStore.get('userInfo').id
                })
                .then((res) => {
                    if (!res) return;
                    this.cancelUpload();
                    this.getDocList();
                });
        },
        // 查看详情
        toDetail(row) {
            // this.$router.push({
            //     path: '/fileCenter/fileDetail',
            //     query: {
            //         compactId: row.compactId || ''
            //     }
            // });
            this.$router.push({
                path: '/contractMgt/viewContract',
                query: {
                    compactId: row.compactId || '',
                    isFile: 1
                }
            });
            sessionStore.remove('fileDetailActive');
        },
        toSign(row) {
            console.log('to process...');
            const query = {
                contractId: row.compactId,
                isFile: '1'
            };

            // 070 填写
            if (row.contractStatus === '070') {
                query.isFill = '1';

                this.$router.push({
                    path: '/fileCenter/signFile',
                    query
                });

                return;
            }

            // 0401 签署
            if (row.contractStatus === '0401') {
                this.$router.push({
                    path: '/fileCenter/signFile',
                    query
                });
            }

            // - 0405 待审批
            // - 0010 待审批 (`审批流程`)
            if (['0405', '0010'].includes(row.contractStatus)) {
                query.isExamine = '1';

                this.$router.push({
                    path: '/contractMgt/viewContract',
                    query
                });

                return;
            }
        },
        toH5Sign(row) {
            this.$router.push(
                `/h5sign/h5SignContract?contractId=${row.compactId}&isFile=1`
            );
        },
        // 列表下载
        downLoad(row) {
            this.$api('fileDownload')
                .post(
                    'postBlobQuery',
                    {},
                    {
                        contractId: row.compactId
                    }
                )
                .then((res) => {
                    if (!res) return;
                    let blob = res.data;
                    let _self = this;
                    // console.log(blob);
                    let checkBlobFileResponse = checkBlobFileResponseUtils(
                        blob
                    );
                    checkBlobFileResponse
                        .then((res1) => {
                            // const zip = new JSZip();
                            // zip.folder();
                            // zip.file(`${row.compactTheme}.zip`, res);
                            // zip.generateAsync({
                            //     type: 'blob'
                            // }).then(
                            //     (blob) => {
                            //         FileSaver.saveAs(
                            //             blob,
                            //             `${row.compactTheme}.zip`
                            //         );
                            //     },
                            //     (err) => {
                            //         this.$message.error('下载失败');
                            //     }
                            // );
                            let fileName = res.headers[
                                'content-disposition'
                            ].split('filename=')[1];
                            FileSaver.saveAs(res.data, fileName);
                        })
                        .catch((error) => {
                            this.$message.warning(error);
                        });
                });
        },
        reStart(row) {
            let path = row.templateId ? 'uploadTemplate' : 'startContract';
            let query = {
                contractId: row.compactId,
                renew: '1',
                use: row.templateId ? '1' : undefined,
                id: row.templateId || undefined,
                isFile: '1'
            };
            this.$router.push({ path, query });
        },
        deleteContract(row) {
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
                            compactId: row.compactId
                        }
                    )
                    .then((res) => {
                        if (!res) return;
                        // console.log(res);
                        this.$message.success('删除成功！');
                        setTimeout(() => {
                            this.getDocList();
                        }, 1000);
                    });
            });
        },
        // 打印文件
        printFile(row) {
            let ie = isIE();
            if (row.printNum) {
                // if (ie) {
                //     this.isIE = true;
                //     this.dialogFileViewVisible = true;
                //     this.compactId = row.compactId;
                //     this.compactTheme = row.compactTheme;
                // } else {
                //     this.isIE = false;
                //     this.getFilePdf(row);
                // }
                // let explorer = window.navigator.userAgent.toLowerCase()
                // if (explorer.indexOf('trident') >= 0 || explorer.indexOf('msie') >= 0 ||
                // explorer.indexOf('firefox') >= 0 || explorer.indexOf('edge') >= 0) {
                //     return this.$message.error('该浏览器暂时不支持打印，请使用chrome、opera或safari浏览器进行打印')
                // }
                this.getFilePdf(row);
            } else {
                // 打印申请
                if (row.printApplying) {
                    this.$message.warning('审批中，紧急打印请联系管理员');
                } else {
                    this.printRow = row;
                    this.printApplyVisible = true;
                }
            }
        },
        getFilePdf(row) {
            if (this.previewUrl) return;
            let _self = this;
            let compactId = row.compactId || this.compactId;
            this.percentage = 0;
            // 获取权限
            this.$api('filecenterPrintFileRight')
                .post(
                    'postQuery',
                    {},
                    {
                        contractId: compactId
                    }
                )
                .then((res) => {
                    if (!res) return;
                    this.appoint = res.data.data;
                    let base64 = row.qrCode
                        ? document
                              .querySelector('.QR canvas')
                              .toDataURL('image/png', 1)
                        : null;
                    this.printRow = row;
                    this.printRow.base64 = base64;
                    this.getContractDetail(row.compactId);
                });
        },
        // 获取合同详情
        async getContractDetail(id) {
            let res = await this.$api('viewContract').post(
                'postQuery',
                {},
                { contractId: id }
            );
            if (!res) return;
            let data = res.data.data;
            this.contractInfo = data;
            this.fileList = data.compactFiles;
            this.printSetVisible = true;
        },
        downloadFile() {
            this.$api('downloadSignDoc')
                .get('getBlob', {
                    fileCode: this.fileCode
                })
                .then((res) => {
                    let blob = res.data;
                    let checkBlobFileResponse = checkBlobFileResponseUtils(
                        blob
                    );
                    checkBlobFileResponse
                        .then((res) => {
                            FileSaver.saveAs(res, _self.fileName);
                        })
                        .catch((error) => {
                            _self.dialogFileViewVisible = false;
                        });
                })
                .catch((err) => {
                    console.log(err);
                });
        },
        closeUploadDialog() {
            this.cancelUpload();
        },
        closeViewDialog() {},
        sizeChange(pageSize) {
            this.pagination.pageSize = pageSize;
            this.pagination.currentPage = 1;
            this.getDocList();
        },
        currentChange() {
            this.getDocList();
        }
    }
};
</script>

<style lang="scss" scoped>
.breadcrumb {
    .el-breadcrumb {
        font-size: 16px;
        height: 54px;
        line-height: 54px;
        margin-left: 22px;
        border-bottom: solid #e9e9e9 1px;
    }
}
.search-wrap {
    display: flex;
    margin: 20px 0 0 22px;
    // height: 36px;
    // align-items: center;
    justify-content: space-between;
    .left {
        display: flex;
        align-items: center;
        margin-left: -32px;
        flex: 1;
    }
    .form-wrap {
        .date {
            margin-bottom: 20px;
        }
    }
    .el-form-item {
        margin-bottom: 0;
    }
    .search-btn {
        margin-left: 20px;
    }
    .right {
        margin-right: 20px;
        .el-button {
            width: 124px;
        }
    }
}
.table {
    margin: 20px 22px;
    padding-bottom: 20px;
    .view {
        margin-right: 20px;
    }
    .view,
    .print {
        color: #999;
        cursor: pointer;
        &:hover {
            color: #4a90e2;
        }
    }
    .pagination-wrap {
        text-align: right;
        margin-top: 40px;
        margin-right: 58px;
    }
    .vertify,
    .QR {
        position: relative;
        display: flex;
        align-items: center;
        .code {
            display: inline-block;
            margin-right: 10px;
            width: 180px;
            // overflow: hidden;
            // white-space: nowrap;
            // text-overflow: ellipsis;
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
    .compact-theme {
        display: flex;
        i {
            margin-right: 10px;
            cursor: pointer;
            color: #437dff;
        }
        .theme-wrap {
            flex: 1;
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
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
.file-manage {
    /deep/ .dialog-box-other {
        .el-form-item__content {
            width: 383px;
        }
        .el-input__inner {
            width: 380px;
        }
        .dialog-footer {
            text-align: center;
        }
        .el-input__count {
            position: absolute;
            bottom: 3px;
            right: 10px;
            height: 18px;
            line-height: 18px;
            color: #909399;
            background: transparent;
            font-size: 12px;
        }
        .use-reason {
            .el-textarea__inner {
                width: 380px;
                height: 180px;
            }
        }
    }
}
</style>
<style lang="scss">
.file-manage .dialog-upload-file .el-upload-dragger:hover {
    border-color: #4a90e2;
}
.file-manage .el-upload-dragger.is-dragover {
    border: 1px dashed #4a90e2;
    .icon-tuozhuaiwenjian,
    .hand-way {
        display: none;
    }
    .hand-way-drag {
        display: block;
    }
}
.file-manage .el-upload-list {
    width: 60%;
    .el-upload-list__item-name:hover {
        background: #eff2f7;
    }
}
.vertify-code {
    background: #1f2d3d;
    padding: 7px 10px;
}
.qr-popper {
    border: none !important;
    box-shadow: 1px 1px 1px rgb(243, 241, 241);
    padding: 0;
}
.no-time-now {
    width: 100% !important;
}
</style>
