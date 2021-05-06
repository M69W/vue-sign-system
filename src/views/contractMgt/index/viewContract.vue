<template>
    <!-- TODO 合同操作 >>> 查看 -->
    <div class="view-contract">
        <div class="header">
            <div class="back" @click="$router.go(-1)">
                <i class="iconfont icon-fanhui"></i>
                返回
            </div>
            <div class="btn-wrap" v-if="contractDetail.contractStatus !== '02'">
                <!-- <Authorized :authrity="$permissionMap.viewContractPrintAllot">
                    <el-button
                        type="normal"
                        @click="openDialog('print')"
                        v-if="contractDetail.sponsorId === userInfo.id"
                        >打印分配</el-button
                    >
                </Authorized>
                <Authorized :authrity="$permissionMap.viewContractPrint">
                    <el-button type="normal" @click="print" :loading="printing"
                        >打印（{{ contractDetail.printNum || 0 }}）</el-button
                    >
                </Authorized> -->
                <!-- 审批页面按钮 -->
                <template v-if="this.isExamine">
                    <el-button
                        style="color: #fff;"
                        size="medium"
                        class="refuse"
                        type="info"
                        @click.stop="refuseSign"
                        >
                        驳回
                    </el-button>
                    <el-button
                        type="primary"
                        size="medium"
                        @click.stop="approve"
                        >
                        审批通过
                    </el-button>
                </template>
                <!-- 打印相关按钮 -->
                <template v-else>
                    <el-button type="normal" @click="print" :loading="printing"
                        >{{ contractDetail.printNum ? `打印（${contractDetail.printNum}）` : '打印申请' }}</el-button
                    >
                    
                    <Authorized :authrity="$permissionMap.viewContractBackout">
                        <el-button
                            type="normal"
                            @click="openDialog('backout')"
                            v-if="contractDetail.sponsorId === userInfo.id"
                            >撤销</el-button
                        >
                    </Authorized>
                    <Authorized :authrity="$permissionMap.viewContractDownload">
                        <el-button type="primary" @click="downloadContract"
                            >下载</el-button
                        >
                    </Authorized>
                </template>

            </div>
        </div>
        <div class="main-container">
            <div class="page-list">
                <div class="title">{{isFile?'签发':'合同'}}文件</div>
                <div class="list">
                    <el-scrollbar>
                        <div
                            class="item"
                            :class="{ active: index === currFile }"
                            v-for="(item, index) in contractDetail.compactFiles"
                            :key="index"
                            @click="selectFile(item, index)"
                        >
                            <img
                                :src="
                                    `${baseUrl}/document/scan/page/${
                                        item.fileCode
                                    }/1?_t=${initTime}`
                                "
                                alt
                            />
                            <!-- <el-image
                                :src="`${baseUrl}/document/scan/page/${item.fileCode}/1?_t=${initTime}`"
                            >
                                <div slot="placeholder" class="img-placeholder">
                                    <img src="../../../assets/image/default-bg.svg" alt />
                                </div>
                                <div slot="error" class="img-error">
                                    <img src="../../../assets/image/default-bg.svg" alt />
                                </div>
                            </el-image>-->
                        </div>
                    </el-scrollbar>
                </div>
            </div>
            <!-- 查看合同主界面 -->
            <div class="main-page">
                <div class="btn-wrap">
                    <i
                        class="iconfont icon-zhiding"
                        :class="{ gray: mainPageInfo.currPage === 1 }"
                        @click="pageTo('toFirst')"
                    ></i>
                    <i
                        class="iconfont icon-shangyiye"
                        :class="{ gray: mainPageInfo.currPage === 1 }"
                        @click="pageTo('prev')"
                    ></i>
                    <i
                        class="iconfont icon-xiayiye"
                        :class="{
                            gray:
                                mainPageInfo.currPage === mainPageInfo.pageTotal
                        }"
                        @click="pageTo('next')"
                    ></i>
                    <i
                        class="iconfont icon-zhidi"
                        :class="{
                            gray:
                                mainPageInfo.currPage === mainPageInfo.pageTotal
                        }"
                        @click="pageTo('toLast')"
                    ></i>
                </div>
                <el-scrollbar>
                    <div class="main-page-box">
                        <p class="title">
                            页码：{{ mainPageInfo.currPage }}/{{
                                mainPageInfo.pageTotal
                            }}
                        </p>
                        <div class="img-box" v-if="imgShow">
                            <!-- <img
                                :src="`${baseUrl}/document/scan/page/${mainPageInfo.fileCode}/${mainPageInfo.currPage}?_t=${initTime}`"
                                alt
                            />-->
                            <el-image
                                :src="
                                    `${baseUrl}/document/scan/page/${
                                        mainPageInfo.fileCode
                                    }/${
                                        mainPageInfo.currPage
                                    }?_t=${initTime}`
                                "
                            >
                                <div
                                    slot="placeholder"
                                    class="img-placeholder big-img"
                                >
                                    <img
                                        src="../../../assets/image/default-bg.svg"
                                        alt
                                    />
                                </div>
                                <div slot="error" class="img-error big-img">
                                    <img
                                        src="../../../assets/image/default-bg.svg"
                                        alt
                                    />
                                </div>
                            </el-image>
                        </div>
                    </div>
                </el-scrollbar>
            </div>
            <!-- 右侧合同信息 -->
            <div class="contract-info">
                <!-- 右上合同信息 -->
                <div class="main-info">
                    <div class="main-info-item">
                        <span class="label">{{isFile?'签发':'合同'}}主题</span>
                        <span class="desc">
                            {{ contractDetail.contractTheme }}
                        </span>
                    </div>
                    <div class="main-info-item">
                        <span class="label">{{isFile?'签发':'合同'}}编号</span>
                        <span class="desc">
                            {{ contractDetail.contractId }}
                        </span>
                    </div>
                    <div class="main-info-item" v-if="!isFile">
                        <span class="label">保全号&nbsp;&nbsp;&nbsp;</span>
                        <span class="desc">
                            {{ contractDetail.securityNumber }}
                        </span>
                    </div>
                    <div class="main-info-item">
                        <span class="label">{{isFile?'签发':'合同'}}状态</span>
                        <span class="desc">
                            {{ contractDetail.contractStatus | filterContractStatus }}
                        </span>
                    </div>
                    <div class="main-info-item">
                        <span class="label">发起时间</span>
                        <span class="desc">
                            {{ contractDetail.compactStartDate }}
                        </span>
                    </div>
                    <div class="main-info-item" v-if="!isFile">
                        <span class="label">截止时间</span>
                        <span class="desc">
                            {{ contractDetail.signDeadline }}
                        </span>
                    </div>
                    <div class="main-info-item">
                        <span class="label">备注信息</span>
                        <span class="desc" :title="contractDetail.remark">
                            {{ contractDetail.remark || '无' }}
                        </span>
                    </div>
                </div>
                <!-- 右下 -->
                <div class="tab-info">
                    <!-- tab栏 -->
                    <div class="tab-nav" :class="{'is-file': isFile}">
                        <div
                            class="tab-nav-item"
                            @click="handleTabClick(0)"
                            :class="{ active: active === 0 }"
                        >
                            签署状态
                        </div>
                        <div
                            class="tab-nav-item"
                            @click="handleTabClick(1)"
                            :class="{ active: active === 1 }"
                            v-if="!isFile"
                        >
                            附件
                        </div>
                        <div
                            class="tab-nav-item"
                            @click="handleTabClick(2)"
                            :class="{ active: active === 2 }"
                        >
                            操作记录
                        </div>
                    </div>
                    <!-- 切换页 -->
                    <div class="tab-content">
                        <!-- 签署状态 -->
                        <el-scrollbar v-show="active === 0">
                            <div class="sign-status">
                                <div class="sign-status-item starter">
                                    <div class="label">发起人：</div>
                                    <div class="content">
                                        <div
                                            class="name"
                                            :title="sponsorInfo.signName"
                                        >
                                            {{ sponsorInfo.signName }}
                                        </div>
                                        <div class="info">
                                            <div class="left">
                                                <span class="phone">
                                                    {{
                                                        sponsorInfo.signContact
                                                    }}
                                                </span>
                                                <span class="time">
                                                    {{ sponsorInfo.signDate }}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div v-if="ISPS" class="sign-status-item signer">
                                    <!--  审批流程 -->
                                    <div class="label">审批流程：</div>
                                    <div>
                                        <el-steps direction="vertical" finish-status="success" :active="whichProcessNode">
                                            <el-step v-for="(nodeItem, nodeIdx) in processNodeList" :key="nodeIdx" title="步骤 1">
                                                <div style="font-size: 14px; color: #666;" slot="title">
                                                    <span>{{ nodeItem.taskName }}·{{ nodeItem.taskAuditState | filterTaskAuditState}} ({{nodeItem.fraction}})</span>
                                                    <span style="margin-left: 16px;">{{ nodeItem.taskType | filterTaskType }}</span>
                                                </div>
                                                <!-- <span slot="icon">{{nodeItem.taskAuditState}}</span> -->
                                                <div slot="description">
                                                    <div 
                                                        style="background: #f9fafb; margin: 3px 0; padding: 3px; color: #666;font-size: 14px;"
                                                        class="auditor-item"
                                                        v-for="(auditorItem, auditorIdx) in nodeItem.auditorInfoRespVOList"
                                                        :key="auditorIdx"
                                                        >
                                                        <!-- 普通节点 -->
                                                        <template v-if="!(auditorItem.superiorList)">
                                                            <div>{{auditorItem.auditorName}}({{auditorItem.auditorAccountNum}}) · {{auditorItem.operate | filterOperate}}</div>
                                                            <div style="color: #aaa;" v-if="auditorItem.comment">"{{auditorItem.comment}}"</div>
                                                        </template>
                                                        <!-- 连续多级 -->
                                                        <template v-else>
                                                            <div v-for="(slItem, slIdx) in auditorItem.superiorList" :key="slIdx">
                                                                {{slItem.auditorName}}({{slItem.auditorAccountNum}}) · {{slItem.operate | filterOperate}}
                                                                <div style="color: #aaa;" v-if="slItem.comment">{{slItem.comment}}</div>

                                                            </div>                                                            
                                                        </template>
                                                    </div>
                                                </div>
                                            </el-step>
                                        </el-steps>
                                    </div>
                                </div>
                                <div class="sign-status-item signer">
                                    <div class="label">签署人：</div>
                                    <div
                                        class="content"
                                        :key="index"
                                        v-for="(item, index) in signList"
                                    >
                                        <div
                                            class="status-box"
                                            :class="
                                                statusIcon(item.signStatus)
                                                    .color
                                            "
                                        >
                                            <span class="status">
                                                {{
                                                    item.signStatus
                                                        | formatStatus(
                                                            contractDetail.contractStatus
                                                        )
                                                }}
                                                <i
                                                    class="iconfont"
                                                    :class="
                                                        statusIcon(
                                                            item.signStatus
                                                        ).icon
                                                    "
                                                ></i>
                                            </span>
                                            <span
                                                class="name"
                                                :title="item.signName"
                                                >{{ item.signName }}</span
                                            >
                                        </div>
                                        <div class="info">
                                            <div class="left">
                                                <span class="phone">
                                                    {{ item.signContact }}
                                                </span>
                                                <span class="time">
                                                    {{ item.signDate }}
                                                </span>
                                            </div>
                                            <div class="right">
                                                <el-tag
                                                    type="danger"
                                                    effect="plain"
                                                    size="mini"
                                                    v-if="
                                                        (item.signStatus ===
                                                            '01' || item.signStatus === '010') &&
                                                            (contractDetail.contractStatus ===
                                                                '0401' ||
                                                                contractDetail.contractStatus ===
                                                                    '0402' ||
                                                                contractDetail.contractStatus ===
                                                                    '071' ||
                                                                contractDetail.contractStatus ===
                                                                    '0403') &&
                                                            item.signatoryId !==
                                                                userInfo.id&&!contractDetail.isContractPlatformSign
                                                    "
                                                    @click="
                                                        urgeSign(
                                                            item.signContact
                                                        )
                                                    "
                                                    >催签</el-tag
                                                >
                                                <el-tag
                                                    type="info"
                                                    effect="plain"
                                                    size="mini"
                                                    v-if="
                                                        contractDetail.contractStatus ===
                                                            '06' &&
                                                            item.signStatus !==
                                                                '03'
                                                    "
                                                    >已过期</el-tag
                                                >
                                            </div>
                                        </div>
                                        <div
                                            class="refuse"
                                            v-if="item.signStatus === '04'"
                                        >
                                            <div class="left">拒签：</div>
                                            <div
                                                class="right"
                                                :title="
                                                    contractDetail.refuseSignRemake
                                                "
                                            >
                                                {{
                                                    contractDetail.refuseSignRemake
                                                }}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </el-scrollbar>
                        <!-- 附件 -->
                        <el-scrollbar v-show="active === 1">
                            <div
                                class="sign-accessory"
                                v-if="
                                    contractDetail.compactAttachments &&
                                        contractDetail.compactAttachments
                                            .length > 0
                                "
                            >
                                <div
                                    class="sign-accessory-item"
                                    v-for="(item,
                                    index) in contractDetail.compactAttachments"
                                    :key="index"
                                >
                                    <div class="name" :title="item.fileName">
                                        {{ item.fileName }}
                                    </div>
                                    <div class="btn">
                                        <el-tag
                                            type="info"
                                            effect="plain"
                                            size="small"
                                            class="download"
                                            @click="
                                                downloadAttachment(
                                                    item.fileCode,
                                                    item.fileName
                                                )
                                            "
                                            >下载</el-tag
                                        >
                                    </div>
                                </div>
                            </div>
                            <div class="sign-accessory" v-else>
                                <p>该合同没有附件哦！</p>
                            </div>
                        </el-scrollbar>
                        <!-- 操作记录 -->
                        <el-scrollbar v-show="active === 2">
                            <div
                                class="operate-log"
                                v-if="
                                    contractDetail.signSysCompactLogs &&
                                        contractDetail.signSysCompactLogs
                                            .length > 0
                                "
                            >
                                <div
                                    class="operate-log-item"
                                    v-for="(item,
                                    index) in contractDetail.signSysCompactLogs"
                                    :key="index"
                                >
                                    <div class="info">
                                        <div class="name">{{ item.name }}</div>
                                        <div class="phone">
                                            ({{ item.phoneOrMail }})
                                        </div>
                                    </div>
                                    <div class="operate">
                                        {{ item.type | formatOperate }}
                                        <span v-if="item.type !== '5'"
                                            >了该文件</span
                                        >
                                    </div>
                                    <div class="time">{{ item.operaDate }}</div>
                                </div>
                            </div>
                            <div class="operate-log" v-else>
                                <p>暂无操作记录！</p>
                            </div>
                        </el-scrollbar>
                    </div>
                </div>
            </div>
        </div>

        <!-- 打印分配 -->
        <el-dialog
            :visible.sync="printVisible"
            :before-close="resetDialog"
            :close-on-click-modal="false"
            class="print-dialog"
            title="打印分配"
            width="640px"
        >
            <el-form
                label-width="100px"
                :rules="printRules"
                :model="printForm"
                ref="printForm"
            >
                <el-form-item label="合同主题">
                    {{ contractDetail.contractTheme }}
                </el-form-item>
                <el-form-item prop="printNum" label="可打印次数">
                    <el-input
                        type="number"
                        v-model.number="printForm.printNum"
                    ></el-input>
                </el-form-item>
                <el-form-item prop="userIds" label="分配对象">
                    <el-select
                        v-model="printForm.userIds"
                        filterable
                        placeholder="请选择"
                        multiple
                        reserve-keyword
                    >
                        <el-option
                            v-for="item in optionsPrint"
                            :key="item.id"
                            :label="item.userNickName"
                            :value="item.id"
                        ></el-option>
                    </el-select>
                </el-form-item>
                <!-- <el-form-item>
                    <div class="checkboxes">
                        <el-checkbox
                            :true-label="1"
                            :false-label="0"
                            v-model="printForm.isFoggy"
                        >雾化打印</el-checkbox>
                        <el-checkbox
                            :true-label="1"
                            :false-label="0"
                            v-model="printForm.isGrey"
                        >章模脱密</el-checkbox>
                        <el-checkbox v-model="printForm.checked">防伪打印</el-checkbox>
                        <el-checkbox v-model="printForm.checked">允许使用本地打印机</el-checkbox>
                    </div>
                </el-form-item>-->
                <el-form-item prop="appoint" label="打印方式">
                    <div class="print-type">
                        <el-radio-group v-model="printForm.printType">
                            <el-radio :label="0">打印中心分配</el-radio>
                            <el-radio :label="1">本地打印</el-radio>
                        </el-radio-group>
                    </div>
                    <div class="appoint" :class="{'no-print': printForm.printType===1}">
                        <el-scrollbar v-if="printerList.length">
                            <div class="printer-item">
                                <div class="name">打印机名称</div>
                                <div class="pos">位置</div>
                                <div class="operate">操作</div>
                            </div>
                            <div class="printer-item" v-for="(item, index) in printerList" :key="index">
                                <div class="name">{{item.name}}</div>
                                <div class="pos">{{item.address}}</div>
                                <div class="operate">
                                    <el-radio v-model="printForm.appoint" :label="item.id">&nbsp;</el-radio>
                                </div>
                            </div>
                        </el-scrollbar>
                        <div class="info" v-else>
                            <p>暂无可用网络打印机</p>
                            <p>请联系统管理员进行添加</p>
                        </div>
                    </div>
                </el-form-item>
                <el-form-item class="print-btn">
                    <div>
                        <el-button
                            @click="resetDialog(() => (printVisible = false))"
                            type="info"
                            plain
                            >取消</el-button
                        >
                        <el-button @click="submitPrint" type="primary"
                            >确定</el-button
                        >
                    </div>
                </el-form-item>
            </el-form>
            <div class="footer" slot="footer"></div>
        </el-dialog>

        <!-- 撤销文件 -->
        <el-dialog
            :visible.sync="backoutVisible"
            :before-close="resetBackout"
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
                    @click="resetBackout(() => (backoutVisible = false))"
                    type="info"
                    plain
                    >取消</el-button
                >
                <el-button @click="submitBackout" type="primary"
                    >确定</el-button
                >
            </div>
        </el-dialog>
        <!-- 打印设置 -->
        <print-set
            :parentCom="parentCom"
            :fileList="contractDetail.compactFiles"
            :contractInfo="contractDetail"
            @completePrint="contractDetail.printNum --"
            :appoint="appoint"
        ></print-set>

        <!-- 打印申请 -->
        <print-apply 
        :visible.sync="printApplyVisible"
        :contractId="compactId"
        @apply-success="contractDetail.printApplying=true"></print-apply>

        <!-- qrcode -->
        <qriously
            :value="qrUrl"
            :size="qrSizeBig"
            :backgroundAlpha="1"
            ref="qrcode"
            class="qr-code"
            style="display:none;"
        ></qriously>
    </div>
</template>

<script>
import { checkIntegral, checkBlobFileResponseUtils } from '@/utils';
import { mapState } from 'vuex';
import FileSaver from 'file-saver';
import printSet from './components/printSet';
import printApply from '@/components/printApply';

export default {
    components: { printSet, printApply },
    data() {
        return {
            signSetData: [],
            ISPS: false, // 是否开启了审批流程
            // 是否为审批页
            isExamine: this.$route.query.isExamine === '1',
            processId: '',
            processNodeList: [],
            whichProcessNode: 0,
            isFile: this.$route.query.isFile === '1',
            // --------------------
            appoint: '',
            printerList: [],
            initTime: +new Date(),
            baseUrl: process.env.NODE_ENV === 'development' ? '/apis' : '/sign',
            compactId: '',
            active: 0,
            currFile: 0,
            mainPageInfo: {
                currPage: 1,
                pageTotal: 1
            },
            printVisible: false,
            optionsPrint: [],
            printForm: {
                printNum: '',
                userIds: [],
                isFoggy: 1,
                isGrey: 1,
                printType: 0,
                appoint: ''
            },
            backoutVisible: false,
            signList: [],
            approveList: [],
            contractDetail: '',
            lastPrintAuth: '',
            printing: false,
            sponsorInfo: '',
            placeholderImage: require('../../../assets/image/default-bg.svg'),
            parentCom: {
                printRow: {
                    verificationCode: '',
                    base64: ''
                },
                printSetVisible: false
            },
            qrUrl: '',
            qrSizeBig: 100,
            // isFile: !!this.$route.query.isFile,
            printApplyVisible: false,
            printRules: {
                printNum: [
                    {
                        required: true,
                        trigger: 'blur',
                        message: '可打印次数不能为空'
                    },
                    {
                        validator(rule, value, callback) {
                            if (value === '') {
                                callback(new Error('可打印次数不能为空'));
                            } else if (!checkIntegral(value)) {
                                callback(new Error('可打印次数只能为正整数'));
                            } else {
                                callback();
                            }
                        },
                        trigger: 'blur'
                    }
                ],
                userIds: [
                    {
                        required: true,
                        trigger: 'change',
                        message: '分配对象不能为空'
                    },
                    {
                        validator(rule, value, callback) {
                            if (!value) {
                                callback(new Error('分配对象不能为空'));
                            } else {
                                callback();
                            }
                        },
                        trigger: 'change'
                    }
                ]
            },
            imgShow: false
        };
    },
    computed: {
        ...mapState(['userInfo']),
        contractId() {
            return this.compactId;
        }
    },
    async created() {
        this.compactId = this.$route.query.compactId;
        let _query = this.$route.query;
        if (_query) {
            // 注意，不同页面传递过来的 query 中合同 Id 不一样
            // 这里做一下兼容性处理
            this.compactId = _query.compactId || _query.contractId;
        }

        await this.getSignConfig();
        if (this.signSetData && this.signSetData.isViaProcess === 1) {
            this.ISPS = true;
        }

        console.log(this.ISPS)
    },
    async mounted() {
        if (this.ISPS) {
            await this.getProcessInsDetail();
        }
        this.getDetail();
    },
    filters: {
        // 节点状态
        filterTaskAuditState(code) {
            const map = {
                '01': '审批中',
                '02': '已同意',
                '03': '已驳回'
            };

            return map[code];
        },
        // 节点中审批人的审批状态
        filterOperate(code) {
            const map = {
                '00': '等待处理中',
                '01': '同意',
                '02': '驳回'
            };

            return map[code];
        },
        // 节点审批方式
        filterTaskType(code) {
            const map = {
                or: '或签',
                counter: '会签',
                sequence: '依次审批'
            };

            return map[code];
        },
        formatApproveStatus(val) {
            let msg = '';
            if (val === '02' || val === '05') msg = '待审批';
            else if (val === '06') msg = '审批通过';
            else if (val === '07') msg = '审批不通过';
            return msg;
        },
        formatStatus(val, contractStatus) {
            let status;
            if (contractStatus === '06' && val !== '03') {
                status = '已过期';
            } else {
                switch (val) {
                    case '01':
                        status = '待签署';
                        break;
                    case '02':
                        status = '待签署';
                        break;
                    case '03':
                        status = '已签署';
                        break;
                    case '04':
                        status = '拒签';
                        break;
                    case '011':
                        status = '已填写';
                        break;
                    case '010':
                        status = '未填写';
                        break;
                    default:
                        status = '已签署';
                        break;
                }
            }
            return status;
        },
        formatContractStatus(val) {
            let status;
            switch (val) {
                case '01':
                    status = '草稿';
                    break;
                case '02':
                    status = '已撤销';
                    break;
                case '03':
                    status = '已拒签';
                    break;
                case '0401':
                    status = '待我签署';
                    break;
                case '0402':
                    status = '待他人签';
                    break;
                case '0403':
                    status = '待他人签';
                    break;
                case '0010':
                    status = '待我审批';
                    break;
                case '0110':
                    status = '待他人审批';
                    break;
                case '05':
                    status = '签署完成';
                    break;
                case '070':
                    status = '待填写';
                    break;
                case '071':
                    status = '待他人填写';
                    break;
                case '08':
                    status = '即将过期';
                    break;
                default:
                    status = '已过期';
                    break;
            }
            return status;
        },
        formatOperate(val) {
            switch (val) {
                case '0':
                    return '查看';
                    break;
                case '1':
                    return '签署';
                    break;
                case '2':
                    return '打印';
                    break;
                case '3':
                    return '下载';
                    break;
                case '5':
                    return '申请了用印';
                case '6':
                    return '发起';
                case '7':
                    return '撤销';
                case '8':
                    return '审批';
                case '9':
                    return '驳回';
                default:
                    return '拒签';
                    break;
            }
        }
    },
    methods: {
        /**
         * 获取签章设置
         */
        getSignConfig() {
            this.$api('getSignConfig')
                .get()
                .then((res) => {
                    if (!res) return;
                    let data = res.data.data;
                    // console.log(data);
                    this.signSetData = data;
                });
        },
        async getProcessInsDetail() {
            let _data = {
                compactId: this.compactId
            };

            let res = await this.$api('urlGetProcessInsDetail').get(
                'getNormal',
                _data
            );
            if (!res) return;

            console.log(res.data.data);
            let _res = res.data.data;

            this.processId = _res.processInstanceId;
            this.processNodeList = _res.taskHistoryInfoRespVOList;

            if (this.processNodeList) {
                let _len = this.processNodeList.length;

                if (this.processNodeList[_len - 1].taskAuditState === '02') {
                    // ^ 如果最后一个元素的状态为 `已同意`，则为通过
                    this.whichProcessNode = _len;
                } else {
                    this.whichProcessNode = this.processNodeList.findIndex(
                        (item) => item.taskAuditState !== '02'
                    );
                }
            }
        },
        // urlAuditProcess
        async auditProcess(type, comment = '') {
            // type '01' 审批通过  '02' 驳回
            let _data = {
                comment,
                id: this.processId,
                operate: type,
                turnToId: ''
            };

            let res = await this.$api('urlAuditProcess').post(
                'postNormal',
                _data
            );

            if (!res) return;

            if (type === '01') {
                this.$message.success('审批通过');
            } else if (type === '02') {
                this.$message.warning(`已驳回`);
            }

            let path = this.isFile
                ? '/fileCenter/fileManage'
                : '/contractMgt/index';
            this.$router.push(path);
        },
        // 拒签
        refuseSign() {
            this.$prompt(`请输入驳回原因`, '驳回', {
                confirmButtonText: '确定',
                cancelButtonText: '取消'
            })
                .then(({ value }) => {
                    this.auditProcess('02', encodeURIComponent(value) || '');
                })
                .catch(() => {});
        },
        // 审批通过
        approve() {
            this.auditProcess('01');
        },

        // -----------------
        async getDetail() {
            let res = await this.$api('viewContract').post(
                'postQuery',
                {},
                { contractId: this.compactId }
            );
            // console.log(res);
            if (!res) return;
            let data = res.data.data;
            if (data.deleteOrRevoke === true) {
                this.$message.error('合同文件已被删除或撤销');
                setTimeout(() => {
                    let path = 'index';
                    if (this.isFile) path = '/fileCenter/fileManage';
                    this.$router.replace(path);
                }, 500);
                return;
            }
            this.contractDetail = data;
            this.imgShow = true;
            this.parentCom.printRow.verificationCode = data.verificationCode;
            // 二维码
            let dateVerification = new Date(data.verificationDate).getTime();
            let dateNow = new Date().getTime();
            // 和文档中心公用H5验真页面
            if (
                data.verificationDate &&
                data.verificationDate !== '0' &&
                dateVerification < dateNow
            ) {
                // 过期了
                this.qrUrl =
                    location.origin +
                    `/sign-sys/#/fileCenter/qrToPhoneReal?fileCode=${
                        this.compactId
                    }&isContract=1&timeOut=1`;
            } else {
                this.qrUrl =
                    location.origin +
                    `/sign-sys/#/fileCenter/qrToPhoneReal?fileCode=${
                        this.compactId
                    }&isContract=1`;
            }
            // 签署人
            this.signList = data.signStatusInfo.filter((v) => v.signStatus);
            // 审批人
            this.approveList = data.signStatusInfoApply;
            this.sponsorInfo = data.signStatusInfo[0];
            this.mainPageInfo = Object.assign(
                {},
                this.mainPageInfo,
                data.compactFiles[0]
            );
            this.$nextTick(() => {
                $('.main-page .el-scrollbar__wrap')[0].addEventListener(
                    'mousewheel',
                    this.mouseWheel
                );
                $('.main-page .el-scrollbar__wrap')[0].addEventListener(
                    'DOMMouseScroll',
                    this.mouseWheel
                );
            });
        },
        // 打印/打印申请
        async print() {
            if (this.contractDetail.printNum) {
                // let explorer = window.navigator.userAgent.toLowerCase()
                // if (explorer.indexOf('trident') >= 0 || explorer.indexOf('msie') >= 0 ||
                // explorer.indexOf('firefox') >= 0 || explorer.indexOf('edge') >= 0) {
                //     return this.$message.error('该浏览器暂时不支持打印，请使用chrome、opera或safari浏览器进行打印')
                // }
                let res = await this.$api('printContract').post(
                    'postQuery',
                    {},
                    {
                        contractId: this.compactId
                    }
                );
                if (!res) return;
                this.appoint = res.data.data;
                let base64 = document
                    .querySelector('.view-contract .qr-code canvas')
                    .toDataURL('image/png', 1);
                this.parentCom.printRow.base64 = base64;
                this.parentCom.printSetVisible = true;
            } else {
                // 打印申请
                if (this.contractDetail.printApplying) {
                    this.$message.warning('审批中，紧急打印请联系管理员');
                } else {
                    this.printApplyVisible = true;
                }
            }
        },
        async downloadContract() {
            let res = await this.$api('downloadContract').post(
                'postBlobQuery',
                {},
                {
                    contractId: this.compactId
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
                    this.getDetail();
                })
                .catch((err) => {
                    this.$message.error(err);
                });
            // this.download(this.blob2Url(res.data), fileName);
        },
        selectFile(item, index) {
            this.mainPageInfo.currPage = 1;
            this.mainPageInfo = Object.assign({}, this.mainPageInfo, item);
            this.currFile = index;
            document.querySelector(
                '.main-page .el-scrollbar__wrap'
            ).scrollTop = 0;
        },
        handleTabClick(val) {
            this.active = val;
        },
        // 打开弹框
        async openDialog(val) {
            if (val === 'print') {
                if (this.optionsPrint.length === 0) {
                    // 获取合同相关人
                    // let res = await this.$api('allUserContract').post(
                    //     {},
                    //     {
                    //         contentType: 'query',
                    //         query: {
                    //             contractId: this.compactId
                    //         }
                    //     }
                    // );
                    let res = await this.$api('getAllUser').get('getPath', {
                        enterpriseId: this.userInfo.enterpriseId
                    });
                    if (!res) return;
                    this.optionsPrint = res.data.data;
                }
                let res1 = await this.$api('listPrinterAppoint').post();
                if (!res1) return;
                this.printerList = res1.data.data;
                let res = await this.$api('getPrintAuthList2').get(
                    'getNormal',
                    {
                        contractId: this.compactId
                    }
                );
                if (!res) return;
                let data = res.data.data;
                this.lastPrintAuth = data.signSysPrintAuthUserRespVoS.map(
                    (v) => v.userId
                );
                this.printForm.userIds = data.signSysPrintAuthUserRespVoS.map(
                    (v) => v.userId
                );
                this.printForm.printType = data.printType || 0;
                this.printForm.appoint = this.printerList.length
                    ? data.appoint || ''
                    : '';
                // this.printForm.printNum = data.printNum;
                this.printVisible = true;
            }
            if (val === 'backout') {
                this.backoutVisible = true;
            }
        },
        // 关闭弹框、重置
        resetDialog(done) {
            this.$refs.printForm.resetFields();
            this.$refs.printForm.clearValidate();
            done();
        },
        // 关闭撤销弹框、重置
        resetBackout(done) {
            done();
        },
        // 提交打印分配
        submitPrint() {
            this.$refs.printForm.validate(async (valid) => {
                if (!valid) return;
                if (this.printForm.printType === 0) {
                    if (!this.printForm.appoint)
                        return this.$message.error({
                            message: '请选择网络打印机',
                            customClass: 'zZindex'
                        });
                } else {
                    this.printForm.appoint = undefined;
                }
                let delIds = this.lastPrintAuth.filter((v) => {
                    let flag = true;
                    for (let i = 0; i < this.printForm.userIds.length; i++) {
                        if (this.printForm.userIds[i] === v) {
                            flag = false;
                            break;
                        }
                    }
                    return flag;
                });
                console.log(delIds);
                let sendData = Object.assign({}, this.printForm, {
                    contractId: this.compactId,
                    userIds: this.printForm.userIds.join(',')
                });
                let res = await this.$api('addPrintAuthUser2').post(
                    'postNormal',
                    sendData
                );
                if (!res) return;
                if (delIds.length > 0) {
                    let sendData = {
                        fileCode: this.compactId,
                        userIds: delIds.join(',')
                    };
                    let res = await this.$api('delPrintAuthList').delete(
                        'deleteNormal',
                        sendData
                    );
                    if (!res) return;
                }
                this.$message.success({
                    message: '打印分配操作成功！',
                    customClass: 'zZindex'
                });
                this.getDetail();
                this.resetDialog(() => (this.printVisible = false));
            });
        },
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
            this.getDetail();
            this.backoutVisible = false;
        },
        pageTo(val) {
            if (val === 'toFirst') {
                this.mainPageInfo.currPage = 1;
            }
            if (val === 'prev') {
                if (this.mainPageInfo.currPage === 1) {
                    return;
                }
                this.mainPageInfo.currPage--;
            }
            if (val === 'next') {
                if (
                    this.mainPageInfo.currPage === this.mainPageInfo.pageTotal
                ) {
                    return;
                }
                this.mainPageInfo.currPage++;
            }
            if (val === 'toLast') {
                this.mainPageInfo.currPage = this.mainPageInfo.pageTotal;
            }
            document.querySelector(
                '.main-page .el-scrollbar__wrap'
            ).scrollTop = 1;
        },
        // 下载附件
        async downloadAttachment(fileCode, fileName) {
            let res = await this.$api('downloadSignDoc').get('getBlob', {
                fileCode: fileCode
            });
            checkBlobFileResponseUtils(res.data)
                .then((res1) => {
                    FileSaver.saveAs(res.data, fileName);
                    this.getDetail();
                })
                .catch((err) => {
                    this.$message.error(err);
                });
            // this.download(
            //     `${
            //         this.baseUrl
            //     }/document/downloadSignDoc/${fileCode}?_t=${new Date().getTime()}`
            // );
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
        async urgeSign(contact) {
            let res = await this.$api('urgePerson').post(
                'postQuery',
                {},
                {
                    contractId: this.compactId,
                    contact
                }
            );
            if (!res) return;
            this.$message.success('催签成功！');
        },
        // 格式化状态图标
        statusIcon(val) {
            let icon, color;
            if (this.contractDetail.contractStatus === '06' && val !== '03') {
                icon = 'icon-yiguoqi';
                color = 'gray';
            } else {
                switch (val) {
                    case '03':
                        icon = 'icon-yiqianshu';
                        color = 'green';
                        break;
                    case '01':
                        icon = 'icon-daiqianshu';
                        color = 'red';
                        break;
                    case '04':
                        icon = 'icon-juqian';
                        color = 'gold';
                        break;
                    default:
                        icon = 'icon-daiqianshu';
                        color = 'red';
                        break;
                }
            }
            return { icon, color };
        },
        // 格式化审批状态图标
        approveStatusIcon(val) {
            let icon, color;
            if (this.contractDetail.contractStatus === '06' && val !== '06') {
                icon = 'icon-yiguoqi';
                color = 'gray';
            } else {
                switch (val) {
                    case '06':
                        icon = 'icon-yiqianshu';
                        color = 'green';
                        break;
                    case '05':
                        icon = 'icon-daiqianshu';
                        color = 'red';
                        break;
                    case '07':
                        icon = 'icon-juqian';
                        color = 'gold';
                        break;
                    default:
                        icon = 'icon-daiqianshu';
                        color = 'red';
                        break;
                }
            }
            return { icon, color };
        },
        // 滚轮滚动
        mouseWheel(e) {
            let dom = $('.main-page .el-scrollbar__wrap');
            //  浏览器   firefox     其他
            //   属性   e.detail  wheelDelta
            //   向下      3        -120
            //   向上     -3         120
            if (
                (e.wheelDelta && e.wheelDelta > 0 && dom.scrollTop() === 0) ||
                (e.detail && e.detail < 0 && dom.scrollTop() === 0)
            ) {
                // 向上
                if (this.timer) {
                    return;
                }
                this.timer = true;
                setTimeout(() => {
                    this.pageTo('prev');
                }, 100);
                setTimeout(() => {
                    this.timer = false;
                }, 300);
            }
            if (
                (e.wheelDelta &&
                    e.wheelDelta < 0 &&
                    dom.scrollTop() + dom.height() >= dom[0].scrollHeight) ||
                (e.detail &&
                    e.detail > 0 &&
                    dom.scrollTop() + dom.height() >= dom[0].scrollHeight)
            ) {
                // 向下
                if (this.timer) {
                    return;
                }
                this.timer = true;
                setTimeout(() => {
                    this.pageTo('next');
                }, 100);
                setTimeout(() => {
                    this.timer = false;
                }, 300);
            }
        }
    },
    beforeRouteLeave(to, from, next) {
        $('.main-page-box')[0].removeEventListener(
            'mousewheel',
            this.mouseWheel
        );
        $('.main-page-box')[0].removeEventListener(
            'DOMMouseScroll',
            this.mouseWheel
        );
        next();
    }
};
</script>

<style lang="scss" scoped>
.view-contract {
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
    .img-placeholder,
    .img-error {
        text-align: center;
        padding: 10px;
        &.big-img {
            height: 700px;
            line-height: 700px;
        }
    }
    .img-loading-error {
        margin-top: 20px;
        text-align: center;
        line-height: 30px;
    }
    > .header {
        width: 100%;
        height: 70px;
        padding: 0 30px;
        border-bottom: 1px solid #ddd;
        display: flex;
        justify-content: space-between;
        align-items: center;
        > .btn-wrap {
            .el-button {
                min-width: 94px;
                margin-left: 10px;
            }
        }
        .back {
            cursor: pointer;
            line-height: 14px;
            &:hover {
                color: #2a68c8;
            }
            .iconfont {
                font-size: 14px;
            }
        }
    }
    > .main-container {
        background-color: #f4f6f8;
        flex: 1;
        display: flex;
        > .page-list {
            width: 206px;
            padding: 0 3px;
            background-color: #fff;
            display: flex;
            flex-direction: column;
            .title {
                height: 45px;
                line-height: 45px;
                text-align: center;
                font-size: 16px;
                color: #2a68c8;
                border-bottom: 1px solid #2a68c8;
                margin-bottom: 8px;
            }
            .list {
                flex: 1;
                position: relative;
                .el-scrollbar {
                    position: absolute;
                    top: 0;
                    right: 0;
                    bottom: 0;
                    left: 0;
                    height: 100%;
                    .el-scrollbar__wrap {
                        .item {
                            width: 120px;
                            // height: 160px;
                            border: 1px solid #c0ccda;
                            padding: 6px;
                            margin: 8px auto;
                            cursor: pointer;
                            &.active {
                                border-color: #2a68c8;
                            }
                            img {
                                width: 100%;
                                // height: 100%;
                            }
                        }
                    }
                }
            }
        }
        > .main-page {
            flex: 1;
            position: relative;
            .btn-wrap {
                position: absolute;
                z-index: 999;
                bottom: 110px;
                // left: 50%;
                // transform: translateX(429px);
                right: 30px;
                .iconfont {
                    display: block;
                    margin-top: 16px;
                    width: 30px;
                    height: 30px;
                    background-color: #c4cfdc;
                    color: #fff;
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    border-radius: 50%;
                    cursor: pointer;
                    &:hover {
                        background-color: #2a68c8;
                    }
                    &.gray {
                        background-color: #e2e2e2;
                        color: #eee;
                        cursor: not-allowed;
                    }
                }
            }
            .el-scrollbar {
                position: absolute;
                top: 0;
                right: 0;
                bottom: 0;
                left: 0;
            }
            .main-page-box {
                width: 790px;
                // height: 1000px;
                max-width: 100%;
                padding: 0 12px;
                margin: 20px auto;
                // background-color: #fff;
                .title {
                    height: 40px;
                    line-height: 40px;
                    text-align: right;
                    padding-right: 30px;
                    background-color: #fafafa;
                    color: #999;
                    font-size: 12px;
                }
                .img-box {
                    width: 100%;
                    // min-height: 500px;
                    text-align: center;
                    background-color: #fff;
                    img {
                        width: 100%;
                        // height: 100%;
                    }
                }
            }
        }
        > .contract-info {
            width: 460px;
            display: flex;
            flex-direction: column;
            .main-info {
                background-color: #fff;
                margin-bottom: 10px;
                padding: 13px 20px;
                &-item {
                    height: 34px;
                    line-height: 34px;
                    overflow: hidden;
                    text-overflow: ellipsis;
                    white-space: nowrap;
                    .label {
                        color: #626262;
                        margin-right: 14px;
                    }
                }
            }
            .tab-info {
                flex: 1;
                background-color: #fff;
                padding: 0 10px;
                display: flex;
                flex-direction: column;
                .tab-nav {
                    display: flex;
                    padding-top: 7px;
                    font-size: 16px;
                    line-height: 42px;
                    border-bottom: 1px solid #e2e2e2;
                    &.is-file {
                        .tab-nav-item {
                            width: 50%;
                        }
                    }
                    &-item {
                        width: 33.33%;
                        font-weight: 500;
                        text-align: center;
                        border-bottom: 2px solid transparent;
                        cursor: pointer;
                        &.active {
                            color: #2a68c8;
                            border-bottom-color: #2a68c8;
                        }
                    }
                }
                .tab-content {
                    flex: 1;
                    position: relative;
                    .el-scrollbar {
                        position: absolute;
                        top: 0;
                        right: 0;
                        bottom: 0;
                        left: 0;
                        height: 100%;
                    }
                    .sign-status {
                        padding: 10px;
                        &-item {
                            margin-bottom: 20px;
                            &.signer {
                                .content {
                                    border-bottom: 1px solid #f9fafb;
                                }
                            }
                            &.starter {
                                .content {
                                    background-color: #f9fafb;
                                }
                            }
                            .label {
                                font-size: 16px;
                                line-height: 34px;
                            }
                            .status-box {
                                display: flex;
                                &.green {
                                    color: #10ad57;
                                }
                                &.red {
                                    color: #ff4949;
                                }
                                &.gold {
                                    color: #fa9100;
                                }
                                &.gray {
                                    color: #999;
                                }
                                .status {
                                    width: 42px;
                                    margin-right: 10px;
                                    position: relative;
                                    .iconfont {
                                        position: absolute;
                                        font-size: 16px;
                                        line-height: 26px;
                                        left: -22px;
                                        top: 0;
                                    }
                                    &.approve {
                                        width: 70px;
                                    }
                                }
                                .name {
                                    flex: 1;
                                    color: #333;
                                }
                            }
                            .content {
                                padding: 7px 0 7px 20px;
                                line-height: 26px;
                                display: flex;
                                flex-direction: column;
                                justify-content: center;
                                .info {
                                    display: flex;
                                    justify-content: space-between;
                                    color: #999;
                                    .phone {
                                        margin-right: 10px;
                                    }
                                    .right {
                                        margin-right: 20px;
                                        cursor: pointer;
                                    }
                                }
                                .refuse {
                                    line-height: 20px;
                                    display: flex;
                                    .right {
                                        flex: 1;
                                        display: -webkit-box;
                                        overflow: hidden;
                                        text-overflow: ellipsis;
                                        -webkit-line-clamp: 2;
                                        /*! autoprefixer: off */
                                        -webkit-box-orient: vertical;
                                        /* autoprefixer: on */
                                    }
                                }
                                .name {
                                    overflow: hidden;
                                    white-space: nowrap;
                                    text-overflow: ellipsis;
                                }
                            }
                        }
                    }
                    .sign-accessory {
                        padding: 10px;
                        &-item {
                            padding: 13px 10px;
                            background: #f9fafb;
                            border-radius: 4px;
                            margin: 10px 0;
                            display: flex;
                            .name {
                                line-height: 20px;
                                flex: 1;
                                display: -webkit-box;
                                overflow: hidden;
                                text-overflow: ellipsis;
                                -webkit-line-clamp: 2;
                                /*! autoprefixer: off */
                                -webkit-box-orient: vertical;
                                /* autoprefixer: on */
                            }
                            .btn {
                                margin-left: 10px;
                                align-self: center;
                                cursor: pointer;
                            }
                        }
                        p {
                            text-align: center;
                            color: #999;
                            line-height: 40px;
                        }
                    }
                    .operate-log {
                        padding: 0 10px;
                        &-item {
                            margin: 20px 0;
                            display: flex;
                            justify-content: center;
                            .info {
                                display: flex;
                                justify-content: space-between;
                                width: 170px;
                                .name {
                                    flex: 1;
                                    overflow: hidden;
                                    text-overflow: ellipsis;
                                    white-space: nowrap;
                                    text-align: center;
                                }
                                .phone {
                                }
                            }
                            .operate {
                                margin: 0 10px;
                                color: #e3ab29;
                            }
                            .time {
                                color: #626262;
                            }
                        }
                        p {
                            text-align: center;
                            color: #999;
                            line-height: 60px;
                        }
                    }
                }
            }
        }
    }
}
</style>

<style lang="scss">
.view-contract {
    .print-dialog {
        .el-form {
            &-item {
                width: 440px;
                .el-select {
                    width: 100%;
                }
                .checkboxes {
                    // position: relative;
                    // left: -85px;
                    // width: 560px;
                }
                &.print-btn {
                    text-align: center;
                    margin-bottom: -10px;
                    .el-button {
                        width: 80px;
                        margin-right: 20px;
                    }
                }
            }
        }
        .appoint {
            height: 150px;
            transition: 0.5s all;
            text-align: center;
            &.no-print {
                height: 0;
            }
            .info {
                height: 100%;
                overflow: hidden;
            }
            .el-scrollbar {
                height: 100%;
            }
            .printer-item {
                width: 100%;
                border-top: 1px solid #ccc;
                border-left: 1px solid #ccc;
                &:nth-last-of-type(1) {
                    border-bottom: 1px solid #ccc;
                }
                > div {
                    display: inline-block;
                    vertical-align: middle;
                    width: 33.3333%;
                    border-right: 1px solid #ccc;
                }
            }
        }
    }
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
}
</style>
<style lang="scss">
.view-contract {
    .el-select {
        &__tags {
            .el-tag {
                max-width: 100%;
                overflow: hidden;
                text-overflow: ellipsis;
                white-space: nowrap;
                position: relative;
                padding-right: 24px;
                .el-tag__close {
                    position: absolute;
                    right: 4px;
                    top: 5px;
                }
            }
        }
    }
    .el-image__inner--center {
        position: static;
        transform: none;
    }

    .el-step__icon.is-text {
        width: 18px;
        height: 18px;

        margin-top: 2px;
    }
}
</style>
