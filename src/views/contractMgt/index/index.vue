<template>
    <div class="contract_mgt">
        <div class="inner">
            <div class="header-title">
                <div class="txt">合同管理</div>
            </div>
            <div class="content">
                <div class="btn_wrap">
                    <el-form
                        :inline="true"
                        :model="searchForm"
                        class="form_search"
                        ref="searchForm"
                    >
                        <Authorized :authrity="$permissionMap.searchId">
                            <el-form-item label="日期" prop="date">
                                <el-date-picker
                                    v-model="searchDate"
                                    type="daterange"
                                    range-separator="-"
                                    start-placeholder="开始日期"
                                    end-placeholder="结束日期"
                                    value-format="yyyy/MM/dd"
                                    format="yyyy/MM/dd"
                                ></el-date-picker>
                            </el-form-item>
                        </Authorized>
                        <Authorized :authrity="$permissionMap.searchId">
                            <el-form-item label="合同名称" prop="content">
                                <el-input
                                    v-model="searchForm.content"
                                    clearable
                                    placeholder="关键字合同名称"
                                ></el-input>
                            </el-form-item>
                        </Authorized>
                        <Authorized :authrity="$permissionMap.searchId">
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
                        </Authorized>
                        <el-form-item>
                            <Authorized :authrity="$permissionMap.searchId">
                                <el-button
                                    type="normal"
                                    icon="iconfont icon-chaxun el-icon--left"
                                    @click="searchList"
                                    >查询</el-button
                                >
                            </Authorized>
                            <Authorized :authrity="$permissionMap.searchId">
                                <el-button
                                    type="normal"
                                    icon="iconfont icon-chongzhi el-icon--left"
                                    @click="resetSearch"
                                    >重置</el-button
                                >
                            </Authorized>
                        </el-form-item>
                    </el-form>
                    <Authorized :authrity="$permissionMap.startContractId">
                        <el-button
                            type="primary"
                            class="iconfont icon-xinjian3"
                            @click="startContract"
                            >发起合同</el-button
                        >
                    </Authorized>
                </div>
                <div class="table_data">
                    <el-table
                        :data="tableData"
                        style="width: 100%"
                        :row-class-name="tableRowClassName"
                        :header-cell-style="headerStyle"
                    >
                        <el-table-column
                            prop="compactTheme"
                            min-width="160"
                            label="合同主题"
                        >
                            <template slot-scope="scope">
                                <div class="compact-theme">
                                    <div class="location" v-if="scope.row.num === 1">
                                        <el-tooltip
                                            class="item"
                                            effect="dark"
                                            placement="top"
                                            popper-class="vertify-code"
                                        >
                                            <div slot="content">
                                                已指定签署位置
                                            </div>
                                            <i
                                                class="iconfont icon-icon-test"
                                            ></i>
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
                            prop="sponsor"
                            label="发起方"
                            show-overflow-tooltip
                        ></el-table-column>
                        <el-table-column
                            prop="signer"
                            label="签署人"
                            show-overflow-tooltip
                        ></el-table-column>
                        <el-table-column
                            prop="startingTime"
                            label="发起时间"
                            show-overflow-tooltip
                        ></el-table-column>
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
                        <el-table-column prop="QR" label="二维码" width="100">
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
                                                :backgroundAlpha="1"
                                                ref="qrcode"
                                                class="qrcode-inner"
                                                style="text-align:center"
                                            ></qriously>
                                        </div>
                                        <qriously
                                            :value="scope.row.qrUrl"
                                            :size="qrSize"
                                            :backgroundAlpha="1"
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
                        <!-- contractStatus (string, optional): 合同状态 01：草稿；02：已撤销；03：已拒签；0401：待我签署 0402 待他人签；05：签署完成；06:已过期 , -->
                        <el-table-column prop="contractStatus" label="状态">
                            <!-- formatStatus[scope.row.contractStatus] -->
                            <template slot-scope="scope">
                                {{ scope.row.contractStatus | filterContractStatus }}
                            </template>
                        </el-table-column>
                        <!--  01：草稿；02：已撤销；03：已拒签；0401：待我签署 0402 待他人签；0403 待他人签； 05：签署完成；-->
                        <el-table-column
                            label="操作"
                            class="operate"
                            width="300"
                        >
                            <template slot-scope="scope">
                                <span
                                    class="operate_item"
                                    @click="viewContract(scope.row)"
                                    v-show="scope.row.contractStatus !== '01'"
                                    >查看</span
                                >
                                <span
                                    class="operate_item"
                                    @click="signContract(scope.row)"
                                    v-show="scope.row.contractStatus === '0401'"
                                    >签署</span
                                >
                                <span
                                    class="operate_item"
                                    @click="signContract(scope.row)"
                                    v-show="['0405', '0010'].includes(scope.row.contractStatus)"
                                    >审批</span
                                >
                                <span
                                    class="operate_item"
                                    @click="signContract(scope.row)"
                                    v-show="scope.row.contractStatus === '070'"
                                    >填写</span
                                >
                                <!-- v 1.3.0临时使用 -->
                                <!-- <span
                                    class="operate_item"
                                    @click="$router.push(`/h5sign/h5SignContract?contractId=${scope.row.compactId}`)"
                                    v-show="scope.row.contractStatus === '0401'"
                                    >H5签署</span
                                > -->
                                <span
                                    class="operate_item"
                                    @click="urgeContract(scope.row)"
                                    v-show="
                                        (scope.row.contractStatus === '0402' ||
                                            scope.row.contractStatus === '0403')&&!scope.row.isContractPlatformSign
                                    "
                                    >催签</span
                                >
                                <span
                                    class="operate_item"
                                    @click="printContract(scope.row)"
                                    v-show="scope.row.contractStatus === '05'"
                                    >{{scope.row.printNum ? '打印' : '打印申请' }}</span
                                >
                                <span
                                    class="operate_item"
                                    @click="downloadContract(scope.row)"
                                    v-show="scope.row.contractStatus === '05'"
                                    >下载</span
                                >
                                <span
                                    class="operate_item"
                                    @click="renewContract(scope.row)"
                                    v-show="
                                        scope.row.contractStatus === '02' ||
                                        ((scope.row.contractStatus === '03' || scope.row.contractStatus === '09') &&
                                        scope.row.sponsorId === currentUserId)
                                    "
                                    >重新发起</span
                                >
                                <span
                                    class="operate_item"
                                    @click="continueContract(scope.row)"
                                    v-show="scope.row.contractStatus === '01'"
                                    >继续</span
                                >
                                <span
                                    v-show="canDelete(scope.row)"
                                    class="operate_item"
                                    @click="delContract(scope.row)"
                                    >删除</span
                                >
                                <span
                                    class="operate_item"
                                    @click="useSeal(scope.row)"
                                    v-if="
                                        !['02', '03'].includes(
                                            scope.row.contractStatus
                                        )
                                    "
                                    >用印申请</span
                                >
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
                <!-- 打印设置 -->
                <print-set
                    :parentCom="this"
                    :fileList="fileList"
                    :contractInfo="contractInfo"
                    :appoint="appoint"
                ></print-set>
            </div>
        </div>

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
        <!-- /用印申请 -->

        <!-- 打印申请 -->
        <print-apply 
        :visible.sync="printApplyVisible"
        :contractId="printRow.compactId"
        @apply-success="printRow.printApplying=true"></print-apply>

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
import printSet from './components/printSet';
import { refreshMenuItem } from '@/mixins/clickMenuItemForRefresh';
import printApply from '@/components/printApply';

export default {
    mixins: [setRowClass, refreshMenuItem],
    filters: {
        filterDate(val) {
            return val === '0' ? '永久有效' : '有效期至：' + val;
        }
    },
    data() {
        return {
            appoint: null,
            printApplyVisible: false,
            searchForm: {
                status: '',
                content: '',
                timeBefore: '',
                timeAfter: '',
                pageNum: 1,
                pageSize: 10,
                orgId: sessionStore.get('userInfo').enterpriseId,
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
                    value: '08',
                    label: '即将过期'
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
            ],
            pdfUrl: '',
            currentUserId: sessionStore.get('userInfo').id,
            printSetVisible: false,
            qrSizeBig: 100,
            qrSize: 40,
            origin: window.location.origin,
            printRow: '',
            fileList: [], // 文件列表
            contractInfo: {}, // 合同信息
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
            printContractId: null,
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
                            } else if (!checkIntegral(value)) {
                                callback(new Error('申请次数为正整数'));
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
            otherId: '' // 是否启用白鹤
        };
    },
    computed: {
        formatStatus() {
            let obj = {};
            this.statusOptions.forEach((v) => (obj[v.value] = v.label));
            obj['0402'] = obj['0403'] = '待他人签';
            return obj;
        }
    },
    watch: {
        searchDate(val) {
            if (!val) {
                this.searchForm.timeBefore = '';
                this.searchForm.timeAfter = '';
                return;
            }
            this.searchForm.timeBefore = val[0];
            this.searchForm.timeAfter = val[1];
        },
        isSameMenu(newVal, oldVal) {
            this.resetSearch();
        }
    },
    created() {
        this.searchForm.status = sessionStore.get('homeSearchStatus') || '';
        sessionStore.remove('homeSearchStatus');
        this.search();
        this.getBaiheId();
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
            let res = await this.$api('queryContract').post(
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
            this.tableData.forEach((v) => {
                let dateVerification = new Date(v.verificationDate).getTime();
                let dateNow = new Date().getTime();
                // 和文档中心公用H5验真页面
                if (
                    v.verificationDate &&
                    v.verificationDate !== '0' &&
                    dateVerification < dateNow
                ) {
                    // 过期了
                    v.qrUrl =
                        location.origin +
                        `/sign-sys/#/fileCenter/qrToPhoneReal?fileCode=${
                            v.compactId
                        }&isContract=1&timeOut=1`;
                } else {
                    v.qrUrl =
                        location.origin +
                        `/sign-sys/#/fileCenter/qrToPhoneReal?fileCode=${
                            v.compactId
                        }&isContract=1`;
                }
            });
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
            this.searchForm.status = '';
            this.search();
        },
        // 发起合同
        startContract() {
            this.$router.push('/contractMgt/startContract');
        },
        // 查看合同
        viewContract(row) {
            this.$router.push(`viewContract?compactId=${row.compactId}`);
        },
        // 签署合同
        signContract(row) {
            const query = {
                contractId: row.compactId
            };

            // 070 填写
            if (row.contractStatus === '070') {
                query.isFill = '1';
                this.$router.push({
                    path: '/contractMgt/signContract',
                    query
                });

                return;
            }

            // 0401 签署
            if (row.contractStatus === '0401') {
                this.$router.push({
                    path: '/contractMgt/signContract',
                    query
                });

                return;
            }

            // - 0405 待审批
            // - 0010 待审批（审批流程时）
            if (['0405', '0010'].includes(row.contractStatus)) {
                query.isExamine = '1';

                this.$router.push({
                    path: '/contractMgt/viewContract',
                    query
                });

                return;
            }
        },
        // 催签合同
        async urgeContract(row) {
            let res = await this.$api('urgeContract').post(
                'postQuery',
                {},
                {
                    contractId: row.compactId
                }
            );
            if (!res) return;
            this.$message.success('催签成功！');
        },
        // 打印合同
        async printContract(row) {
            if (row.printNum) {
                let explorer = window.navigator.userAgent.toLowerCase();
                // if (explorer.indexOf('trident') >= 0 || explorer.indexOf('msie') >= 0 ||
                // explorer.indexOf('firefox') >= 0 || explorer.indexOf('edge') >= 0) {
                //     return this.$message.error('该浏览器暂时不支持打印，请使用chrome、opera或safari浏览器进行打印')
                // }
                await this.getContractDetail(row.compactId);
                let res = await this.$api('printContract').post(
                    'postQuery',
                    {},
                    {
                        contractId: row.compactId
                    }
                );
                if (!res) return;
                this.appoint = res.data.data;
                let base64 = row.qrCode
                    ? document
                          .querySelector('.QR canvas')
                          .toDataURL('image/png', 1)
                    : null;
                this.printRow = row;
                this.printRow.base64 = base64;
                this.printSetVisible = true;
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
        // 下载合同
        async downloadContract(row) {
            let res = await this.$api('downloadContract').post(
                'postBlobQuery',
                {},
                {
                    contractId: row.compactId
                }
            );
            if (!res) return;
            console.log(res);
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
        download(url, fileName) {
            let a = document.createElement('a');
            a.style.display = 'none';
            a.download = fileName;
            a.href = url;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
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
        },
        // 重新发起合同
        renewContract(row) {
            let path = row.templateId
                ? '/contractMgt/uploadTemplate'
                : '/contractMgt/startContract';
            let query = {
                contractId: row.compactId,
                renew: '1',
                use: row.templateId ? '1' : undefined,
                id: row.templateId || undefined
            };
            this.$router.push({ path, query });
        },
        // 继续合同
        continueContract(row) {
            this.$router.push(
                `/contractMgt/startContract?contractId=${row.compactId}`
            );
        },
        // 删除合同
        delContract(row) {
            this.$confirm(
                '<p class="mention-del-seal">删除后合同无法恢复</p><p>确定删除么？</p>',
                '删除合同',
                {
                    confirmButtonText: '确定',
                    dangerouslyUseHTMLString: true,
                    cancelButtonText: '取消',
                    type: 'warning'
                }
            )
                .then(async () => {
                    let res = await this.$api('delContract').post(
                        'postQuery',
                        {},
                        {
                            contractId: row.compactId
                        }
                    );
                    if (!res) return;
                    this.search();
                    this.$message.success('删除成功！');
                })
                .catch((err) => {
                    console.log(err);
                });
        },
        // 用印申请
        useSeal(row) {
            this.printContractId = row;
            this.frameFormEdit.compactId = row.compactId;
            this.getSealList();
        },
        // 用印申请右上角关闭回调
        beforeCloseDialog() {
            this.useApplyDialog = false;
            this.$refs.frameFormEdit.resetFields();
            this.optionsSealName = [];
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
                .get('getNormal', { hasExpired: true })
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
                    this.$api('contractUseSeal')
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
                                // this.printContract(this.printContractId); // 调用打印服务
                                this.$refs.frameFormEdit.resetFields();
                                this.$message.success('用印申请提交成功');
                            } else if (code === 10012) {
                                this.$message.warning({
                                    message:
                                        '暂无签名，请先登录到白鹤平台创建签名！',
                                    customClass: 'zZindex'
                                });
                            }
                            // this.printSetVisible = true;
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
        },
        // 是否可以删除
        canDelete(item) {
            let status = item.contractStatus;
            return (
                (status === '01' ||
                    status === '02' ||
                    status === '03' ||
                    status === '09') &&
                item.sponsorId === this.$store.state.userInfo.id
            );
        }
    },
    components: { printSet, printApply }
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
        }
    }
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
.no-time-now {
    width: 100% !important;
}
</style>
