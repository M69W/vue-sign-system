<template>
    <!-- TODO 合同操作 >>> 签署 -->
    <div class="sign-contract">
        <div class="inner">
            <header class="header">
                <div class="reback" @click="$router.go(-1)">返回</div>
                <div class="contract-theme ellipsis">
                    <page-jumper
                        @current-change="handleCurrentChange"
                        :totalPage="totalPage"
                        :tempPageNum="pageNumber"
                    ></page-jumper>
                </div>

                <div class="sign-btn">
                    <el-button
                        size="medium"
                        class="refuse"
                        type="info"
                        @click.stop="refuseSign"
                        v-if="!isFill"
                    >拒签</el-button>
                    <el-button
                        type="primary"
                        size="medium"
                        @click.stop="submitSign"
                    >完成{{ isFill ? '填写' : '签署' }}</el-button>
                </div>
            </header>
            <section class="container container-sign">
                <div
                    class="tab-mask"
                    :class="{ active: contractListActiveName === 'second' }"
                    @click="clickMask"
                ></div>
                <!-- 影子章 -->
                <div
                    class="shadow-sign"
                    v-show="showShadowSign"
                    :style="{
                        left: shadowX + 'px',
                        top: shadowY + 'px'
                    }"
                >
                    <img
                        class="shadow-sign-img"
                        :src="shadowSignUrl"
                        :style="{
                            width: (tabActiveName === 'second'? ukeyWidth * scale : shadowSignType === '01' ? nowSealWidth : 110) + 'px',
                            height: (tabActiveName === 'second'? ukeyHeight * scale : shadowSignType==='01' ? nowSealHeight : 50) + 'px'
                        }"
                        alt="印章"
                    />
                </div>

                <div class="sign-list">
                    <el-tabs v-if="!isFill" v-model="tabActiveName" @tab-click="handleTabClick">
                        <el-tab-pane label="云印章" name="first" class="cloud-seal">
                            <el-scrollbar v-if="filterSealList.length">
                                <ul class="sign-list-wrap">
                                    <li
                                        v-for="(item, index) in filterSealList"
                                        :key="index"
                                        class="seal-list-item"
                                        :data-picturecode="item.pictureCode"
                                        :data-picturepath="item.picturePath"
                                        :data-picturetype="item.pictureType"
                                        :data-picturewidth="item.pictureWidth"
                                        :data-pictureheight="item.pictureHeight"
                                        data-logo="cloudSeal"
                                    >
                                        <div class="img">
                                            <img :src="item.picturePath" alt="印章图片" />
                                        </div>
                                        <p>{{ item.pictureName }}</p>
                                    </li>
                                </ul>
                            </el-scrollbar>
                            <div class="pagination-wrap" v-if="pagination.total">
                                <el-pagination
                                    :page-size.sync="pagination.pageSize"
                                    :current-page.sync="pagination.currentPage"
                                    :total="pagination.total"
                                    small
                                    @current-change="currentChange"
                                    layout="prev, pager, next"
                                    :pager-count="pagination.pagerCount"
                                ></el-pagination>
                            </div>
                            <p class="no-seal" v-else>暂无印章数据</p>
                        </el-tab-pane>
                        <el-tab-pane label="UKEY印章" name="second" class="ukey-seal">
                            <div class="ukey-select">
                                <el-button
                                    type="primary"
                                    :disabled="ukeyReadDis"
                                    class="sure-ukey"
                                    :loading="readUkeyLoading"
                                    @click.stop="readUkey('getCaType')"
                                >读取UKEY</el-button>
                                <div class="ukey-seal-wrap">
                                    <ul class="sign-list-wrap">
                                        <li
                                            class="seal-list-item"
                                            v-for="(item,
                                            index) in filterUkeySealList"
                                            :key="index"
                                            :data-picturecode="item.pictureCode"
                                            :data-picturepath="item.picturePath"
                                            data-logo="ukeySeal"
                                        >
                                            <div class="img">
                                                <img :src="item.picturePath" alt="印章图片" />
                                            </div>
                                            <p>{{ item.pictureName }}</p>
                                        </li>
                                    </ul>
                                </div>
                            </div>
                        </el-tab-pane>
                    </el-tabs>
                    <div class="sign-setting" v-if="!isFill">
                        <h2>签章设置</h2>
                        <div class="check-list">
                            <div class="sign-foggy">
                                <el-checkbox size="medium" label="签章雾化" v-model="foggyCheck"></el-checkbox>
                                <el-tooltip
                                    class="item"
                                    effect="dark"
                                    content="开启签章雾化后，在线预览文件时章模模糊，打印时清晰"
                                    placement="top"
                                >
                                    <div slot="content">
                                        开启签章雾化后，在线预览文
                                        <br />件时章模模糊，打印时清晰
                                    </div>
                                    <i class="iconfont icon-guanyuwomen"></i>
                                </el-tooltip>
                            </div>
                            <div class="sign-grey" style="margin-top: 10px">
                                <el-checkbox size="medium" label="签章脱密" v-model="greyCheck"></el-checkbox>
                                <el-tooltip
                                    class="item"
                                    effect="dark"
                                    content="开启签章雾化后，在线预览文件时章模模糊，打印时清晰"
                                    placement="top"
                                >
                                    <div slot="content">
                                        开启章模脱密后，在线预览文件时
                                        <br />章模灰色显示，防止套取红章
                                        <br />
                                    </div>
                                    <i class="iconfont icon-guanyuwomen"></i>
                                </el-tooltip>
                            </div>
                        </div>
                    </div>
                </div>
                <section class="choose-type" v-if="!isFill">
                    <el-button
                        @click.stop="chooseSignType('01')"
                        :type="typeActive === '01' ? 'primary' : ''"
                    >单页签章</el-button>
                    <el-button
                        @click.stop="chooseSignType('02')"
                        :type="typeActive === '02' ? 'primary' : ''"
                    >多页签章</el-button>
                    <el-button
                        @click.stop="chooseSignType('03')"
                        :type="typeActive === '03' ? 'primary' : ''"
                    >骑缝签章</el-button>
                    <el-button
                        v-if="isFile"
                        @click.stop="chooseSignType('04')"
                        :type="typeActive === '04' ? 'primary' : ''"
                    >批量签章</el-button>
                </section>
                <div
                    class="files"
                    @mousewheel.stop="fileContainerWheel"
                    @DOMMouseScroll.stop="fileContainerWheel"
                >
                    <el-scrollbar>
                        <div class="img-wrap" ref="fileItemWrap">
                            <div
                                v-for="(cloudItem, index) in cloudSignList"
                                :key="index + 'cloudSign'"
                                class="sign-wrap"
                                ref="signWrap"
                                :class="{ 'drag-class': cloudItem.dragging }"
                                :data-devpictureid="cloudItem.devPictureId"
                                v-show="
                                    (cloudItem.signatureMethod !== '02' && cloudItem.fileCode === fileCode &&
                                        cloudItem.pageNo === pageNumber) ||
                                    (cloudItem.signatureMethod === '02' && cloudItem.fileCode === fileCode &&
                                        cloudItem.multiplePageNo && cloudItem.multiplePageNo.includes(pageNumber))
                                "
                                :style="{
                                    left: cloudItem.left + 'px',
                                    top: cloudItem.top + 'px'
                                }"
                            >
                                <p class="sign-moving-tips" v-if="cloudItem.dragging">松开确定位置</p>
                                <i
                                    class="el-icon-error"
                                    data-icon="closeicon"
                                    @click.stop="
                                        removeSignAreadyOnFile(cloudItem)
                                    "
                                ></i>
                                <!-- <span class="sign-garbage-basket">
                                    <i class="el-icon-delete"></i>
                                </span>-->
                                <img
                                    class="sign"
                                    ref="sign"
                                    :src="cloudItem.picturePath"
                                    :style="{
                                        width: cloudItem.width + 'px',
                                        height: cloudItem.height + 'px',
                                        verticalAlign: 'middle'
                                    }"
                                    alt
                                />
                            </div>
                            <!-- 固定签署位置 -->
                            <div
                                class="need-to-sign"
                                :class="{'is-signature': item.signType === '02'}"
                                v-for="(item, index) in setPosArr"
                                :key="index + item.id"
                                v-show="
                                    item.pageNo === pageNumber &&
                                        item.fileCode === fileCode
                                "
                                :style="{
                                    left: (item.posX - signWidth / 2) + 'px',
                                    top: (item.posY - signWidth / 2) + 'px',
                                    width: signWidth + 'px',
                                    height: (item.signType === '01'?signWidth:50) + 'px'
                                }"
                            ></div>
                            <!-- 控件 -->
                            <div
                                class="input-container"
                                v-for="(item, index) in currField"
                                :key="index"
                                :style="{
                                    left: item.left + 'px',
                                    top: item.top + 'px'
                                }"
                                v-show="
                                    item.signatureStartPage === pageNumber &&
                                        item.fileCode === fileCode
                                "
                            >
                                <el-input
                                    v-if="item.signType === '03'"
                                    v-model.trim="item.content"
                                    :style="{width:item.width *scale+'px',height:wordFontSizeToPx(item.fontSize)*scale+'px',
                                        fontSize:wordFontSizeToPx(item.fontSize)*scale+'px'}"
                                    :placeholder="'请输入' + filterFieldType(item.fieldType)"
                                ></el-input>
                                <el-date-picker
                                    type="date"
                                    placeholder="选择日期"
                                    v-if="item.signType === '05'"
                                    v-model="item.content"
                                    :format="dateFormats[item.dateFormat]"
                                    :value-format="dateFormats[item.dateFormat]"
                                ></el-date-picker>
                                <el-select
                                    placeholder="请选择"
                                    v-if="item.signType === '04'"
                                    v-model="item.content"
                                >
                                    <el-option
                                        v-for="(option, i) in item.options"
                                        :key="i"
                                        :label="option"
                                        :value="option"
                                    ></el-option>
                                </el-select>
                            </div>
                            <img class="file center-file" ref="fileItemImg" :src="fileImg" alt />
                        </div>
                    </el-scrollbar>
                    <!-- <div class="page-num">页码:{{ pageNumber }}/{{ totalPage }}</div> -->
                </div>
                <div class="file-list" :class="{'is-file': isFile}">
                    <div class="turn-page">
                        <span :class="{ disabled: redirectTopPageDis }" @click="redirectTop">
                            <i class="iconfont icon-zhiding"></i>
                        </span>
                        <span :class="{ disabled: prePageDis }" @click="prePage">
                            <i class="iconfont icon-shangyiye"></i>
                        </span>
                        <span :class="{ disabled: nextPageDis }" @click="nextPage">
                            <i class="iconfont icon-xiayiye"></i>
                        </span>
                        <span :class="{ disabled: redirectBottomPageDis }" @click="redirectBottom">
                            <i class="iconfont icon-zhidi"></i>
                        </span>
                    </div>
                    <template v-if="isFile">
                        <p>签发文件</p>
                        <el-scrollbar>
                            <div
                                class="file-item"
                                :class="{ active: index === currFile }"
                                v-for="(item, index) in fileList"
                                :key="index"
                                @click="selectFile(item, index)"
                            >
                                <img
                                    :src="
                                        `${baseUrl}/document/scan/page/${item.fileCode}/1`
                                    "
                                    alt
                                />
                                <div class="file-type">{{ item.fileName | filterFileType }}</div>
                            </div>
                        </el-scrollbar>
                    </template>
                    <el-tabs
                        v-model="contractListActiveName"
                        @tab-click="handleFileListClick"
                        v-else
                    >
                        <el-tab-pane label="合同文件" name="first">
                            <el-scrollbar>
                                <div
                                    class="file-item"
                                    :class="{ active: index === currFile }"
                                    v-for="(item, index) in fileList"
                                    :key="index"
                                    @click="selectFile(item, index)"
                                >
                                    <img
                                        :src="
                                            `${baseUrl}/document/scan/page/${item.fileCode}/1`
                                        "
                                        alt
                                    />
                                    <div class="file-type">{{ item.fileName | filterFileType }}</div>
                                </div>
                            </el-scrollbar>
                        </el-tab-pane>
                        <el-tab-pane label="附件" name="second">
                            <el-scrollbar>
                                <div
                                    class="file-item"
                                    :class="{ active: index === currFile }"
                                    v-for="(item, index) in accessoryList"
                                    :key="index"
                                    @click="selectFile(item, index)"
                                >
                                    <img
                                        :src="
                                            `${baseUrl}/document/scan/page/${item.fileCode}/1`
                                        "
                                        alt
                                    />
                                </div>
                            </el-scrollbar>
                        </el-tab-pane>
                    </el-tabs>
                </div>
            </section>
        </div>
        <el-dialog
            :show-close="false"
            :modal-append-to-body="false"
            title="签章规则"
            class="dialog-review-file"
            :visible.sync="dialogChooseType"
        >
            <div class="choose-wrap" v-if="typeActive === '03'">
                <el-form :inline="true" :model="formRule" label-width="120px" ref="ruleContainer">
                    <div class="choose-page">
                        <el-form-item label="签章位置起始页">
                            <el-select
                                v-model="formRule.startPageNo"
                                class="select"
                                size="medium"
                                placeholder="请选择"
                            >
                                <el-option
                                    v-for="(item, index) in startPages"
                                    :key="index + 1"
                                    :label="index + 1"
                                    :value="index + 1"
                                ></el-option>
                            </el-select>
                        </el-form-item>
                        <el-form-item label="签章位置结束页">
                            <el-select
                                v-model="formRule.endPageNo"
                                class="select"
                                size="medium"
                                placeholder="请选择"
                            >
                                <el-option
                                    v-for="(item, index) in endPages"
                                    :key="index + 1"
                                    :label="index + 1"
                                    :value="index + 1"
                                ></el-option>
                            </el-select>
                        </el-form-item>
                        <el-form-item label="签署方向">
                            <el-select
                                v-model="formRule.signatureDirection"
                                class="select"
                                size="medium"
                                placeholder="请选择"
                            >
                                <el-option
                                    v-for="item in signDerection"
                                    :key="item.id"
                                    :label="item.desc"
                                    :value="item.id"
                                ></el-option>
                            </el-select>
                        </el-form-item>

                        <!-- TODO 需要添加骑缝签章中每枚印章覆盖的页数 -->
                        <el-form-item label-width="130" label="一枚印章覆盖页数">
                            <el-input
                                v-model.number="formRule.coverPageNum"
                                placeholder="请输入页数"
                                type="number"
                            ></el-input>
                        </el-form-item>
                    </div>
                </el-form>
            </div>
            <div class="multiple-sign" v-else-if="typeActive === '02'">
                <el-form ref="multiplePageNo" :model="formRule">
                    <el-form-item prop="pageNo" :rules="pageNoRule">
                        <el-input
                            placeholder="请输入如1,3,5,7-10（英文逗号分割，其中-表示连序）的连页选择"
                            v-model.trim="formRule.pageNo"
                        ></el-input>
                    </el-form-item>
                </el-form>
            </div>
            <div class="batch-sign" v-else>
                <p>当前印章将批量应用于所有文件第 {{ pageNumber }} 页</p>
                <p>是否确定批量签章？</p>
            </div>
            <div slot="footer" class="dialog-footer">
                <el-button @click.stop="closeSetRuleDialog">取 消</el-button>
                <el-button type="primary" @click.stop="dialogSure">确 定</el-button>
            </div>
        </el-dialog>
        <el-dialog
            class="ukey-check-dialog"
            :title="ukeyDialogTitle"
            :visible.sync="UkeyCheck"
            label-width="80px"
            width="520px"
            :before-close="ukeycancel"
            :close-on-click-modal="false"
        >
            <el-form label-width="100px">
                <el-form-item label="UKEY信息:">
                    <el-select v-model="ukeyForm.ukeychoice" placeholder="请选择UKEY">
                        <el-option
                            :label="item.key_name"
                            :value="index"
                            v-for="(item, index) in ukeyOptions"
                            :key="item.key_id"
                        ></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="请输入PIN码:">
                    <el-input type="password" v-model="ukeyForm.pinPassword"></el-input>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button type="primary" @click="ukeyPinConfirm">确 定</el-button>
            </div>
        </el-dialog>

        <a ref="newWindowOpen" id="download" href download="test.pdf"></a>

        <!-- 签署密码输入 -->
        <el-dialog
            class="sign-pw-dialog"
            title="签署密码"
            :visible.sync="dialogInputSignPassword"
            label-width="80px"
            width="520px"
            :close-on-click-modal="false"
            :before-close="signPwCancel"
        >
            <el-form
                v-if="isSignPassword"
                label-width="50px"
                ref="signPwForm"
                :rules="signPwRules"
                :model="signPwForm"
            >
                <el-form-item label="密码" prop="password">
                    <el-input type="password" placeholder="请输入签署密码" v-model="signPwForm.password"></el-input>
                </el-form-item>
            </el-form>
            <div v-if="isSignPassword" slot="footer" class="dialog-footer">
                <div class="btn-wrap">
                    <el-button plain @click="signPwCancel" class="cancel">取 消</el-button>
                    <el-button type="primary" @click="signPwConfirm('signPwForm')">确 定</el-button>
                </div>
                <span class="forget" @click="forgetPassword">忘记密码</span>
                <span class="forget" @click="useMessage">使用短信验证码</span>
            </div>
            <div class="no-sign-paw" v-else>
                未设置，
                <span @click="setSignPassword">立即设置</span>
            </div>
        </el-dialog>

        <!-- 验证码验证 -->
        <sign-password-dialog
            ref="signPasswordDialog"
            @submitSignPassword="submitSignPassword"
            :isSign="isSign"
            @useSignPassword="dialogInputSignPassword=true"
        ></sign-password-dialog>
    </div>
</template>

<script>
import {
    sessionStore,
    getOffset,
    checkIntegral,
    mmToPx,
    isPassword,
    isMultiplePageNo,
    wordFontSizeToPx
} from '@/utils';
import { checkUkeyRes } from '@/mixins/checkUkeyRes';
import { mapState } from 'vuex';
import pageJumper from '@/components/jumper';
import { findIndex } from 'lodash';
import signPasswordDialog from '@/components/signPasswordDialog';

export default {
    components: { pageJumper, signPasswordDialog },
    mixins: [checkUkeyRes],
    filters: {
        filterFileType(fileName) {
            const nameList = fileName.split('.');
            return nameList[nameList.length - 1].toLowerCase();
        }
    },
    data() {
        return {
            isFill: false, // 是否为填写控件
            isSign: false,
            wordFontSizeToPx,
            baseUrl: process.env.NODE_ENV === 'development' ? '/apis' : '/sign',
            contractListActiveName: 'first',
            shadowSignUrl: '',
            shadowX: 0,
            shadowY: 0,
            shadowSetPosX: 0,
            shadowSetPosY: 0,
            showShadowSign: false,
            showShadowPosSign: false,
            shadowSignType: '01',
            tabActiveName: 'first',
            showPosOk: false,
            boxShadow: '',
            pageNumber: 1,
            fileImg: '',
            sign: '',
            cloudSignList: [],
            signShow: false,
            posX: 1,
            posY: 1,
            fileWidth: 0,
            fileHeight: 0,
            totalPage: 0,
            standerdSignWidth: 114, // 标准章宽度
            imgList: [],
            event: false, // 避免冲入绑定
            signPosX: 0, // 验证签章位置用
            signPosY: 0,
            signSubmitPosX: 0, // 签署时提交用
            signSubmitPosY: 0,
            scale: 1, // 放大、缩小倍数
            forSignData: {}, // 签署文件数据
            filePicData: {}, // 文件图片数据
            typeActive: '01',
            typeActiveForTime: 1, // 暂时放置激活值
            dialogChooseType: false,
            formRule: {
                startPageNo: 1,
                endPageNo: 1,
                signatureDirection: 1, // 0左，1右
                coverPageNum: 1, // 骑缝签时每枚章的覆盖页数
                pageNo: '' // 多页签
            },
            startPages: [],
            endPages: [],
            signDerection: [
                {
                    id: 0,
                    desc: '左'
                },
                {
                    id: 1,
                    desc: '右'
                }
            ],
            chooseDerectionVisible: false, // 显示选择签署方向
            checkList: [],
            foggyCheck: false, // 签章雾化
            greyCheck: false, // 签章脱密
            signOkPosX: '', // 确定文字用
            signOkPosY: '',
            pagination: {
                currentPage: 1,
                pageSize: 4,
                total: 0,
                pagerCount: 5
            },
            sealList: [], // 印章列表
            fileCode: '', // 文件code
            fileId: '', // 文件id
            fileName: '', // 文件name
            pictureCode: '', // 签章code
            enterpriseOrPersonalId: '', // 企业或个人id
            removeSignPosX: '', // 移除印章按钮位置
            removeSignPosY: '', // 移除印章按钮位置
            removeIconLeft: false, // 按钮位置
            canContinueLoad: true, // 滚动时是否可以继续加载
            ukeyForm: {
                ukeychoice: '',
                pinPassword: ''
            },
            ukeychoice: '', // 选中ukey的索引
            ukeyOptions: [
                // {
                //     label: 'hahaha',
                //     value: '01'
                // }
            ],
            ukeySeal: [], // ukey印章列表
            ukeySealItem: [], // ukey印章
            ukeyReadDis: true, // 读取ukey
            readUkeyLoading: false, // 读取ukey loading
            ukeySign: false, // ukey签署标识
            UkeyCheck: false, // ukey签署校验
            signSetData: {},
            sealName: '',
            ukeySignData: [
                {
                    llx: '',
                    lly: '',
                    signCenterPosXRatio: 0, // ukey签署
                    signCenterPosYRatio: 0
                }
            ],
            ukeyDialogTitle: 'UKEY签署校验',
            caType: '', // ca类型
            debounceTimer: null,
            draggingSignId: '', // 拖动印章的id
            posSignPeople: '', // 定位签署人
            posSignPeopleId: '', // 定位签署人id
            optionsSignPeople: [],
            setPosArr: [],
            chooseSignPeopleDis: false,
            turnPagePaganation: 0,
            redirectTopPageDis: true, // 直达顶部
            prePageDis: true,
            nextPageDis: false,
            redirectBottomPageDis: false,
            // -----------------------------------------
            contractForm: {},
            currFile: 0,
            contractId: '',
            fileList: [],
            accessoryList: [],
            signDomain: [],
            tempPageNum: 1,
            ukeyWidth: '',
            ukeyHeight: '',
            dialogInputSignPassword: false,
            signPwForm: {
                password: ''
            },
            signPwRules: {
                password: [
                    {
                        required: true,
                        message: '请输入签署密码！',
                        trigger: 'blur'
                    },
                    {
                        validator: function(rule, value, callback) {
                            if (!value) {
                                callback(new Error('请输入签署密码！'));
                            } else if (!isPassword(value)) {
                                callback(
                                    new Error(
                                        '请输入6-20位字母和数字签署密码！'
                                    )
                                );
                            } else {
                                callback();
                            }
                        },
                        trigger: 'blur'
                    }
                ]
            },
            templateField: [],
            tempTemplateField: [],
            dateFormats: {
                '1': 'yyyy/MM/dd',
                '2': 'yyyy-MM-dd',
                '3': 'yyyy年MM月dd日'
            },
            flag: true,
            isFile: !!this.$route.query.isFile,
            isSignPassword:
                sessionStore.get('isSignPassword') === 'true' || false,
            fileSizeList: {},
            ukeySealCode: '',
            certOID: '',
            sealImgData: '',
            gmstamp: '',
            sealImgWidth: '',
            sealImgHeight: '',
            nowSealWidth: 114,
            nowSealHeight: 114,
            timer: false,
            isOfd: false, // 当前是否是ofd文件
            isSM2: false // 是否是SM2ukey
        };
    },
    computed: {
        ...mapState({
            userInfo: (state) => state.userInfo
        }),
        currField() {
            return this.templateField;
            // return this.templateField.filter(
            //     (v) =>
            //         v.fileCode === this.fileCode &&
            //         v.signatureStartPage === this.pageNumber
            // );
        },
        signWidth() {
            return this.standerdSignWidth * this.scale;
        },
        filterSealList() {
            return this.isOfd
                ? this.sealList.filter((v) => v.certificateType === '02')
                : this.sealList;
        },
        filterUkeySealList() {
            return this.isOfd && this.isSM2 ? [] : this.ukeySealItem;
        },
        pageNoRule() {
            let _this = this;
            return [
                { required: true, message: '页码不能为空！' },
                {
                    validator(rule, value, callback) {
                        if (!value) {
                            callback(new Error('页码不能为空！'));
                        } else {
                            let res = isMultiplePageNo(value, _this.totalPage);
                            if (!res.status) {
                                callback(new Error(res.msg));
                            } else {
                                callback();
                            }
                        }
                    },
                    trigger: 'blur'
                }
            ];
        }
    },
    async mounted() {
        // this.isFill = !!this.$route.query.isFill
        this.enterpriseOrPersonalId = sessionStore.get('userInfo').enterpriseId; // 管理员所属单位id
        // // -----------------------------------------------------------------
        // let url = this.isFile ? 'signFileDetail' : 'signContractFile'
        // this.contractId = this.$route.query.contractId;
        // let res = await this.$api(url).post(
        //     'postQuery',
        //     {},
        //     {
        //         contractId: this.contractId
        //     }
        // );
        // console.log(res);
        // if (!res) return;
        // this.contractForm = res.data.data;
        // this.fileList = this.contractForm.compactFiles;
        // this.accessoryList = this.contractForm.compactAttachments;
        // let fileName = this.fileName.split('.')
        // this.isOfd = fileName[fileName.length - 1].toLowerCase() === 'ofd'
        // await this.getControls();
        let res = await this.$api('getPicSize').get('getPath', {
            fileCode: this.$route.query.fileCode
        });
        console.log(res);
        if (!res) return;
        this.fileList = [
            {
                fileCode: this.$route.query.fileCode,
                fileName: '业务订单.pdf',
                pageTotal: res.data.data.totalPageNo,
                fileType: '01'
            }
        ];
        this.startPages = this.endPages = this.totalPage = this.fileList[0].pageTotal;
        this.fileCode = this.fileList[0].fileCode;
        this.fileName = this.fileList[0].fileName;
        this.getPageListSealInfo('', '01'); // 获取云签章列表
        this.getPageSingle();
        this.addEventSignMove();
        this.getSignConfig(); // 获取签署配置
    },
    watch: {
        totalPage(val) {
            if (val === 1) {
                this.redirectTopPageDis = true;
                this.prePageDis = true;
                this.nextPageDis = true;
                this.redirectBottomPageDis = true;
            }
        }
    },
    methods: {
        // 获取控件
        async getControls() {
            this.contractForm.templateFields.forEach((v) => {
                let item = this.contractForm.signSysCompactSignatories.find(
                    (val) => val.name === v.signUser
                );
                if (item) v.signatoryId = item.signatoryId;
            });
            if (this.isFill) {
                // 填写控件
                this.tempTemplateField = this.contractForm.templateFields.filter(
                    (v) =>
                        v.signType !== '01' &&
                        v.signType !== '02' &&
                        v.signatoryId === this.userInfo.id
                );
                this.tempTemplateField.forEach((v) => {
                    v.fileCode = this.fileList.find(
                        (val) => val.fileCodeTemplate === v.fileCode
                    ).fileCode;
                    if (v.signType === '04') {
                        v.options = v.optionContent.split(',');
                    }
                    this.$set(v, 'content', '');
                });
            } else {
                // 签章
                let tempSetPosArr = this.contractForm.templateFields.filter(
                    (v) => {
                        if (
                            (v.signType === '01' || v.signType === '02') &&
                            v.signatoryId === this.userInfo.id
                        ) {
                            v.posX = v.signatureCoordinateX;
                            v.posY = v.signatureCoordinateY;
                            v.pageNo = v.signatureStartPage;
                            v.fileCode = this.fileList.find(
                                (val) => val.fileCodeTemplate === v.fileCode
                            ).fileCode;
                            v.isWidget = true; // 是控件
                            return true;
                        } else {
                            return false;
                        }
                    }
                );
                let res1 = await this.$api('signDomain').post(
                    'postQuery',
                    {},
                    {
                        contractId: this.contractId
                    }
                );
                console.log(res1);
                if (!res1) return;
                this.signDomain = res1.data.data;
                this.setPosArr = tempSetPosArr.concat(
                    this.signDomain.map((v) => {
                        return {
                            devId: Date.now(),
                            id: v.signatoryId,
                            name: v.signName,
                            pageNo: v.signatureStartPage,
                            posX: v.signatureCoordinateX,
                            posY: v.signatureCoordinateY,
                            fileCode: v.compactFileCode,
                            signType: v.signType
                        };
                    })
                );
            }
        },
        // 选择文件
        selectFile(item, index) {
            this.redirectTopPageDis = true;
            this.prePageDis = true;
            this.nextPageDis = false;
            this.redirectBottomPageDis = false;
            this.startPages = this.endPages = this.totalPage = item.pageTotal;
            this.fileCode = item.fileCode;
            this.fileName = item.fileName;
            this.currFile = index;
            this.pageNumber = 1;
            this.tempPageNum = 1;
            let fileName = this.fileName.split('.');
            this.isOfd = fileName[fileName.length - 1].toLowerCase() === 'ofd';
            this.getPageSingle();
        },
        handleTabClick(event, tab) {
            console.log(666);
            if (event.name === 'second') {
                this.$ukeyApi('getUKeyVersion')
                    .get()
                    .then((res) => {
                        console.log(res);
                        let data = res.data;
                        if (this.successUKeyCheckCode(data)) {
                            console.log(
                                this.$store.state.settings.driveVersion
                            );
                            let ver = data.version;
                            if (
                                ver !== this.$store.state.settings.driveVersion
                            ) {
                                this.$updateUKeyDrive();
                            } else {
                                // 版本校验通过
                                console.log(666);
                                this.ukeyReadDis = false;
                                if (this.ukeySealItem.length) {
                                    // 如果已经读取过，判断是否插入ukey
                                    this.readUkey('switchTab');
                                }
                                if (!this.ukeySeal.length) {
                                    this.getPageListSealInfo('', '02');
                                }
                            }
                        } else {
                            this.ukeyReadDis = false;
                        }
                    })
                    .catch((err) => {
                        console.log(err);
                        this.$updateUKeyDrive();
                    });
            } else {
                this.readUkeyLoading = false;
            }
        },
        // 获取ca类型
        getCAtype() {
            this.$ukeyApi('getKeyCertInfo')
                .get('getNormal', {
                    keyid: 0
                })
                .then((res) => {
                    console.log(res);
                    let data = res.data;
                    let keyType, driverType;
                    if (this.successUKeyCheckCode(data)) {
                        data.info.map((item) => {
                            if (item.item_type == 7) {
                                keyType = item.item_info;
                            }
                            if (item.item_type == 27) {
                                driverType = item.item_info;
                            }
                        });
                        this.caType = keyType;
                        if (
                            keyType === 'GDCA' ||
                            keyType === '公安三所CA' ||
                            driverType === 'gass'
                        ) {
                            this.caType === 'GDCA';
                            // data.info.forEach(v=>{
                            //     if (v.item_type == 21) {
                            //         this.ukeyWidth = (v.item_info * 595) / 210 + 6;
                            //     }
                            //     if (v.item_type == 22) {
                            //         this.ukeyHeight = (v.item_info * 595) / 210 + 6;
                            //     }
                            // })
                            this.preCheckList('websign');
                            // this.getKeyInfo();
                        } else if (keyType === 'NETCA') {
                            this.ukeyDialogTitle = 'UKEY读取校验';
                            this.UkeyCheck = true;
                            this.readUkeyLoading = false;
                        }
                    }
                });
        },
        // 每次调用相关前缀钱需调用对应前缀的checkList
        preCheckList(preString) {
            if (preString === 'websign') {
                this.$ukeyApi('checkUkeyList')
                    .get()
                    .then((res) => {
                        let data = res.data;
                        if (this.successUKeyCheckCode(data)) {
                            if (!data.keyList.length) {
                                this.$message.warning({
                                    message: '暂无印章数据，请插入UKEY进行读取',
                                    customClass: 'zZindex'
                                });
                            } else {
                                this.getKeyInfo();
                            }
                        }
                    });
            } else if (preString === 'login') {
                this.readUkeyLoading = true;
                this.$ukeyApi('checkUkeyList')
                    .get()
                    .then((res) => {
                        let data = res.data;
                        if (this.successUKeyCheckCode(data)) {
                            if (!data.keyList.length) {
                                this.$message.warning({
                                    message: '暂无印章数据，请插入UKEY进行读取',
                                    customClass: 'zZindex'
                                });
                            }
                        }
                    });
            }
        },
        // 读取ukey，获得ukey签名、ukey印章
        readUkey(check) {
            console.log(check);
            if (check === 'getCaType') {
                this.readUkeyLoading = true;
                this.$ukeyApi('checkUkeyList')
                    .get()
                    .then((res) => {
                        let data = res.data;
                        if (this.successUKeyCheckCode(data)) {
                            if (!data.keyList.length) {
                                this.$message.warning({
                                    message: '暂无印章数据，请插入UKEY进行读取',
                                    customClass: 'zZindex'
                                });
                                this.readUkeyLoading = false;
                                this.ukeySealItem = [];
                            } else {
                                this.ukeyOptions = data.keyList;
                                if (this.ukeyOptions.length > 0) {
                                    //默认选中第一个
                                    this.ukeyForm.ukeychoice = 0;
                                }
                                this.getCAtype();
                            }
                        }
                    });
            } else {
                //查询插入ukey数目
                this.$ukeyApi('checkUkeyList')
                    .get()
                    .then((res) => {
                        let data = res.data;
                        if (this.successUKeyCheckCode(data)) {
                            if (!data.keyList.length) {
                                this.ukeyOptions = [];
                                this.ukeySealItem = [];
                                this.sign = '';
                                this.signShow = false;
                                this.UkeyCheck = false;
                                if (check === 'switchTab') {
                                    return;
                                }
                                if (check === 'ukeyReadCheck') {
                                    this.UkeyCheck = false;
                                    this.ukeyForm = {
                                        ukeychoice: '',
                                        pinPassword: ''
                                    };
                                }
                                this.$message.warning({
                                    message: '暂无印章数据，请插入UKEY进行读取',
                                    customClass: 'zZindex'
                                });
                            } else {
                                if (
                                    check !== 'ukeyPinConfirm' &&
                                    check !== 'ukeyReadCheck'
                                ) {
                                    this.ukeyForm.pinPassword = '';
                                }
                                if (
                                    check === 'ukeyReadCheck' ||
                                    check === 'ukeyPinConfirm'
                                ) {
                                    this.checkPinHttp(check);
                                    return;
                                }
                                this.ukeyOptions = data.keyList;
                                if (this.ukeyOptions.length > 0) {
                                    //默认选中第一个
                                    this.ukeyForm.ukeychoice = 0;
                                    if (check === 'check') {
                                        if (this.caType === 'GDCA') {
                                            this.getKeyInfo('check');
                                        } else {
                                            this.ukeyDialogTitle =
                                                'UKEY签署校验';
                                            this.UkeyCheck = true;
                                        }
                                    }
                                    // netca才登陆校验
                                    // this.getKeyInfo(check);
                                } else {
                                    this.ukeyForm.ukeychoice = '';
                                }
                            }
                        } else {
                            if (check === 'switchTab') {
                                this.ukeySealItem = [];
                            }
                        }
                    });
            }
        },
        getKeyInfo(check) {
            this.$ukeyApi('getKeyCertInfo')
                .get('getNormal', {
                    keyid: 0
                })
                .then((res) => {
                    console.log(data);
                    let data = res.data;
                    if (this.successUKeyCheckCode(data)) {
                        data = data.info;
                        let sealCode = data.find((v) => v.item_type === 3)
                            .item_info;
                        this.ukeySealCode = sealCode;
                        this.certOID = data.find(
                            (v) => v.item_type === 15
                        ).item_info;
                        this.sealImgData = data.find(
                            (v) => v.item_type === 20
                        ).item_info;
                        this.gmstamp =
                            (data.find((v) => v.item_type === 29) &&
                                data.find((v) => v.item_type === 29)
                                    .item_info) ||
                            '';
                        this.isSM2 =
                            data.find((v) => v.item_type === 15).item_info ===
                            '1.2.156.10197.1.501';
                        let item = this.ukeySeal.find(
                            (v) => v.pictureCode === sealCode
                        );
                        let ukeySealItem = item || {};
                        item &&
                            (ukeySealItem.picturePath =
                                'data:image/png;base64,' + this.sealImgData);
                        this.sealImgWidth = data.find(
                            (v) => v.item_type === 21
                        ).item_info;
                        this.sealImgHeight = data.find(
                            (v) => v.item_type === 22
                        ).item_info;
                        this.ukeyWidth = (this.sealImgWidth * 595) / 210 + 6;
                        this.ukeyHeight = (this.sealImgHeight * 595) / 210 + 6;

                        if (!Object.keys(ukeySealItem).length) {
                            this.$message.warning(
                                ' 当前账户无此UKey印章，请重新核对印章信息'
                            );
                            this.readUkeyLoading = false;
                            this.ukeySealItem = [];
                            return;
                        } else {
                            if (check === 'check') {
                                // if (this.caType === 'GDCA') {
                                //     this.ukeySignFn();
                                // } else {
                                // 检查是否插入ukey或是否为本帐户ukey
                                this.UkeyCheck = true;
                                // }
                            } else if (check === 'ukeyPinConfirm') {
                                // 验证pin码
                                this.checkPinHttp();
                            } else {
                                // 读取印章
                                this.sealName = ukeySealItem.pictureName;
                                this.ukeySealItem = [ukeySealItem];
                                this.readUkeyLoading = false;
                            }
                        }
                    } else {
                        this.readUkeyLoading = false;
                        if (check === 'switchTab') {
                            this.ukeySealItem = [];
                        }
                    }
                });
        },
        ukeycancel() {
            this.UkeyCheck = false;
            this.ukeyForm = {
                ukeychoice: '',
                pinPassword: ''
            };
        },
        ukeyPinConfirm() {
            if (this.ukeyDialogTitle === 'UKEY读取校验') {
                this.readUkey('ukeyReadCheck');
            } else {
                this.readUkey('ukeyPinConfirm');
            }
        },
        checkPinHttp(check) {
            this.$ukeyApi('checkKeyPin')
                .post('postQuery', {
                    keyid: 0,
                    pin: this.ukeyForm.pinPassword
                })
                .then((res1) => {
                    if (!res1) return;
                    this.$ukeyApi('checkKeyPin')
                        .post('postQuery', {
                            keyid: 0,
                            pin: this.ukeyForm.pinPassword
                        })
                        .then((res) => {
                            // console.log(res);
                            let data = res.data;
                            if (this.successUKeyCheckCode(data)) {
                                this.UkeyCheck = false;
                                this.ukeyForm = {
                                    ukeychoice: '',
                                    pinPassword: ''
                                };
                                if (check === 'ukeyReadCheck') {
                                    this.getKeyInfo('ukeyReadCheck');
                                    return;
                                }
                                this.ukeySignFn();
                            } else {
                            }
                        });
                });
        },

        // TODO ukey签署
        async ukeySignFn() {
            let _self = this;
            // 获取签章文件的base64并格式化请求数据
            let ukeyList = await this.getSignedBase64();
            console.log(ukeyList);
            if (!ukeyList) return;
            for (let i = 0; i < ukeyList.length; i++) {
                let v = ukeyList[i];
                let res = await this.$api('getSignSummary').post('', v);
                if (!res) return;
                let res1 = await this.$ukeyApi('signbydigestdata').post(
                    'postQuery',
                    {
                        keyid: 0,
                        planthash: res.data.data.digest,
                        gmstamp: this.gmstamp
                    }
                );
                if (!res1) return;
                let res2 = await this.$api('bigFileUkeySignReturnBase64').post(
                    '',
                    {
                        bussinessID: String(+new Date()),
                        fileCode: v.fileCode,
                        reqType: 'asyncSignComplete',
                        signCacheInfo: res.data.data.signCacheInfo,
                        signType: 2,
                        signedData: res1.data.signedData
                    }
                );
                if (!res2) return;
                v.ukeySignPdfBase64 = res2.data.data;
            }
            console.log(ukeyList);

            ukeyList.forEach((v) => {
                v.list = v.signInfo[0].signPosInfo.map((val) => {
                    let llx = val.x;
                    let lly = val.y;
                    let urx = this.ukeyWidth;
                    let ury = this.ukeyHeight;
                    if (val.type === 2) {
                        if (val.part === 0) {
                            llx = 0;
                        } else {
                            llx = val.pdfWidth - urx / val.pagingSize;
                        }
                        urx = (urx / val.pagingSize) * 2;
                    }
                    return {
                        foggy: this.foggyCheck,
                        grey: this.greyCheck,
                        llx,
                        lly,
                        pageNum: val.type === 0 ? val.page : val.startPage,
                        pageNumEnd: val.endPage,
                        pdfWidth: v.pdfWidth,
                        sealCode: v.keyCode,
                        sealName: this.sealName,
                        urx,
                        ury
                    };
                });
            });
            console.log(ukeyList);
            this.signContract(ukeyList);
        },

        /**
         * 获取签署文件的 base64
         */
        async getSignedBase64() {
            let ukeySignList = [];
            this.ukeySignList.forEach((v) => {
                let signPos = {
                    dXY: v.y, // 骑缝坐标
                    endPage: parseInt(v.endPageNo), // 签章结束页码
                    foggy: v.foggy, // 雾化
                    page: parseInt(v.pageNo), // 签章页码
                    pagingSize: parseInt(v.coverPageNum), // 骑缝一枚印章覆盖页数
                    part: parseInt(v.signatureDirection), // 骑缝方向 0 左 1 右
                    startPage: parseInt(v.startPageNo), // 开始页码
                    type: 0, // 类型 0 单页 1 多页 2 骑缝
                    x: v.signSubmitPosX / v.scale, // x坐标
                    y: v.signSubmitPosY / v.scale // y坐标
                };
                let multipleSignPos = [];
                if (v.signatureMethod == '02') {
                    signPos.type = 1;
                    let pageNo = v.pageNo.split(',');
                    console.log(pageNo);
                    pageNo.forEach((v) => {
                        let arr = v.split('-');
                        let startPage = arr[0];
                        let endPage = arr[0];
                        if (arr.length === 2) endPage = arr[1];
                        multipleSignPos.push(
                            Object.assign({}, signPos, { startPage, endPage })
                        );
                    });
                } else if (v.signatureMethod == '03') {
                    signPos.type = 2;
                }
                let index = findIndex(
                    ukeySignList,
                    (val) => val.fileCode === v.fileCode
                );
                if (index < 0) {
                    // 如果没有，新增
                    ukeySignList.push({
                        certOID: this.certOID,
                        fileCode: v.fileCode,
                        fileName: v.originalFileName,
                        keyCode: this.ukeySealCode,
                        season: 'summary',
                        pdfWidth: v.pdfWidth,
                        userId: this.userInfo.id,
                        signInfo: [
                            {
                                sealImgData: this.sealImgData,
                                sealImgWidth: parseInt(this.sealImgWidth),
                                sealImgHeight: parseInt(this.sealImgHeight),
                                sealImgType: 'png',
                                signPosInfo:
                                    v.signatureMethod == '02'
                                        ? multipleSignPos
                                        : [signPos]
                            }
                        ]
                    });
                } else {
                    // 有就推入
                    if (v.signatureMethod == '02') {
                        multipleSignPos.forEach((v) =>
                            ukeySignList[index].signInfo[0].signPosInfo.push(v)
                        );
                    } else {
                        ukeySignList[index].signInfo[0].signPosInfo.push(
                            signPos
                        );
                    }
                }
            });
            return ukeySignList;
        },
        // 拖动印章到文件上的过程
        addEventSignMove() {
            let _self = this;
            let containerDom = document.querySelector('.container-sign');
            let fileWrapDom = document.querySelector('.files');
            let fileDom = document.querySelector('.center-file');
            $('.container-sign').on('mousedown', '.seal-list-item', function(
                e
            ) {
                // 点击时将影子章定位到点击出
                _self.shadowSignType =
                    e.currentTarget.dataset.picturetype || '01';
                _self.showShadowSign = true;
                let pageStartX = e.pageX;
                let pageStartY = e.pageY;
                let target = $(e.currentTarget);
                // 是否是ukey
                let isUkey = _self.tabActiveName === 'second';
                // console.log(target.width(), target.height());
                _self.nowSealWidth =
                    (isUkey
                        ? _self.ukeyWidth
                        : (target[0].dataset.picturewidth * 72) / 25.4) *
                    _self.scale;
                _self.nowSealHeight =
                    (isUkey
                        ? _self.ukeyHeight
                        : (target[0].dataset.pictureheight * 72) / 25.4) *
                    _self.scale;
                let targetWidth = target.outerWidth();
                let targetHeight = target.outerHeight() - 18; // 减去名称的高度
                let picturePath = target[0].dataset.picturepath;
                let pictureCode = target[0].dataset.picturecode;
                let contDocumentPosObj = getOffset(containerDom);
                let sealItemDocumentPosObj = getOffset(e.currentTarget);
                let fileDocumentPosObj = getOffset(fileWrapDom);
                let sealToContX =
                    sealItemDocumentPosObj.left - contDocumentPosObj.left;
                let sealToContY =
                    sealItemDocumentPosObj.top - contDocumentPosObj.top;
                // 计算初始位置
                _self.shadowX =
                    sealToContX - (_self.nowSealWidth - targetWidth) / 2;
                _self.shadowY =
                    sealToContY +
                    (_self.shadowSignType === '01' ? 0 : 50) -
                    (_self.nowSealHeight - targetHeight) / 2;
                // console.log(fileDocumentPosObj, contDocumentPosObj);
                _self.shadowSignUrl = picturePath;
                let left, top;
                e.preventDefault();
                $(document).mouseup(function(e) {
                    if (pageStartX === e.pageX) {
                        _self.showShadowSign = false;
                        $(this).unbind('mousemove');
                        $(this).unbind('mouseup');
                        return;
                    }
                });
                // console.log(999);
                $(document).bind('mousemove', function(e) {
                    let diffX =
                        e.pageX -
                        contDocumentPosObj.left -
                        _self.nowSealWidth / 2;
                    let diffY =
                        e.pageY -
                        contDocumentPosObj.top -
                        (_self.shadowSignType === '01'
                            ? _self.nowSealHeight
                            : 50) /
                            2;
                    // 右边界
                    let diffXmax =
                        fileDocumentPosObj.left -
                        contDocumentPosObj.left +
                        (fileWrapDom.clientWidth - fileDom.clientWidth) / 2 +
                        fileDom.clientWidth -
                        _self.nowSealWidth;
                    // 下边界
                    let diffYmax =
                        containerDom.clientHeight -
                        (_self.shadowSignType === '01'
                            ? _self.nowSealHeight
                            : 50) -
                        11;
                    if (diffX <= 0) {
                        diffX = 0;
                    }
                    if (diffX >= diffXmax) {
                        diffX = diffXmax;
                    }
                    if (diffY <= 11) {
                        diffY = 11;
                    }
                    if (diffY >= diffYmax) {
                        diffY = diffYmax;
                    }
                    _self.shadowX = diffX;
                    _self.shadowY = diffY;
                    // 页面印章位置
                    // let addSignPosX =
                    //     diffX -
                    //     (fileDocumentPosObj.left - contDocumentPosObj.left);
                    let addSignPosX =
                        diffX -
                        (getOffset($('.container-sign .img-wrap')[0]).left -
                            contDocumentPosObj.left) -
                        1;
                    // let diffFileWrapFile =
                    //     (fileWrapDom.clientWidth - fileDom.clientWidth) / 2;
                    let diffFileWrapFile =
                        ($('.container-sign .img-wrap')[0].clientWidth -
                            fileDom.clientWidth) /
                        2;
                    if (addSignPosX < diffFileWrapFile) {
                        addSignPosX = diffFileWrapFile;
                    }
                    addSignPosX += $('.files .el-scrollbar__wrap')[0]
                        .scrollLeft;
                    let addSignPosY =
                        diffY -
                        11 +
                        $('.files .el-scrollbar__wrap')[0].scrollTop;
                    $(document).mouseup(function(e) {
                        $(this).unbind('mousemove');
                        $(this).unbind('mouseup');
                        if (_self.debounceTimer !== null) {
                            clearTimeout(_self.debounceTimer);
                        }
                        _self.debounceTimer = setTimeout(() => {
                            _self.showShadowSign = false;
                            _self.addCloudSign(
                                pictureCode,
                                addSignPosX,
                                addSignPosY,
                                isUkey
                            );
                        }, 50);
                    });
                });
            });
        },
        // 添加云印章
        addCloudSign(pictureCode, addSignPosX, addSignPosY, isUkey = false) {
            let fileHInner = $('.file').outerHeight();
            // 判断是否是ukey印章
            let list = isUkey ? this.ukeySeal : this.filterSealList;

            let sealItemIndex = findIndex(list, (o) => {
                return o.pictureCode === pictureCode;
            });

            let width = isUkey
                ? this.ukeyWidth * this.scale
                : this.nowSealWidth;
            let height =
                this.shadowSignType === '02'
                    ? 50
                    : isUkey
                    ? this.ukeyHeight * this.scale
                    : this.nowSealHeight;
            let cloudSignItem = list[sealItemIndex];
            let venderCloudItem = Object.assign({}, cloudSignItem, {
                isUkey,
                left: addSignPosX,
                top: addSignPosY,
                width,
                height,
                signWidth: this.signWidth,
                pageNo: this.pageNumber,
                devPictureId: Date.now(),
                signSubmitPosX: (addSignPosX + width / 2) / this.scale,
                signSubmitPosY:
                    (fileHInner - addSignPosY - height / 2) / this.scale,
                y: (addSignPosY + height / 2) / this.scale,
                dragging: false,
                fileCode: this.fileCode,
                originalFileName: this.fileName,
                signatureMethod:
                    this.typeActive === '04' ? '01' : this.typeActive,
                pdfWidth: this.fileWidth,
                scale: this.scale
            });

            let fileDom = $('.file');
            let fileWInner = fileDom.outerWidth();
            venderCloudItem.posx =
                (venderCloudItem.left + width / 2) / fileWInner;
            venderCloudItem.posy =
                1 -
                (fileHInner - venderCloudItem.top - height / 2) / fileHInner;

            // if (this.typeActive === '01') {
            //     this.foggyCheck && (venderCloudItem.foggy = true);
            //     this.greyCheck && (venderCloudItem.grey = true);
            // }
            // if (this.cloudSignList.length) return; // 暂时只支持单章
            this.draggingSignId = venderCloudItem.devPictureId;
            this.cloudSignList.push(venderCloudItem);
            // 于盖章校验
            if (this.typeActive === '01' && this.signSetData.preSign === 1) {
                this.preSignCheck(
                    venderCloudItem,
                    venderCloudItem.devPictureId
                );
            }
            if (this.typeActive !== '01') {
                this.dialogChooseType = true;
            }
            // 吸附
            if (this.typeActive === '01') {
                this.adsorbSignToPos(
                    addSignPosX,
                    addSignPosY,
                    venderCloudItem,
                    fileHInner,
                    isUkey
                );
            }
        },
        // 于盖章校验
        async preSignCheck(venderCloudItem, devPictureId) {
            let preSign = await this.preSign(venderCloudItem);
            if (!preSign) return;
            let data = preSign.data.data;
            let preSignIndex = findIndex(this.cloudSignList, (o) => {
                return o.devPictureId === devPictureId;
            });
            if (!data) {
                this.$message.warning(
                    '系统管理员已开启安全用章功能，请勿在空白页和章下无文字处盖章！'
                );
                this.cloudSignList[preSignIndex].preSign = false;
            } else {
                this.cloudSignList[preSignIndex].preSign = true;
            }
        },
        // 删除云印章
        removeSignAreadyOnFile({ devPictureId }) {
            let signOnFileIndex = findIndex(this.cloudSignList, (o) => {
                return o.devPictureId === devPictureId;
            });
            let batchId = this.cloudSignList[signOnFileIndex].batchId;
            if (batchId) {
                for (let i = 0; i < this.cloudSignList.length; i++) {
                    if ((this.cloudSignList[i].batchId = batchId)) {
                        this.cloudSignList.splice(i, 1);
                        i--;
                    }
                }
            } else {
                this.cloudSignList.splice(signOnFileIndex, 1);
            }
        },
        currentChange() {
            this.getPageListSealInfo('', '01');
        },
        // 获取签章设置
        getSignConfig() {
            this.$api('getSignConfig')
                .get('getNormal')
                .then((res) => {
                    if (!res) return;
                    let data = res.data.data;
                    // console.log(data);
                    this.signSetData = data;
                });
        },
        // 获取印章列表
        getPageListSealInfo(pageSeal, mediumType) {
            if (mediumType && mediumType === '01') {
                // 云印章
                this.$api('pageUserListSealInfo')
                    .post('postNormal', {
                        currentPage: this.pagination.currentPage,
                        pageSize: this.pagination.pageSize,
                        enterpriseOrPersonalId: this.enterpriseOrPersonalId,
                        mediumType: mediumType,
                        userId: this.userInfo.id
                    })
                    .then((res) => {
                        if (!res) return;
                        let data = res.data.data;
                        let seals = data.records;
                        this.pagination.total = data.total;
                        this.sealList = seals;
                    });
            } else if (mediumType && mediumType === '02') {
                // ukey印章
                this.$api('pageUserListSealInfo')
                    .post('postNormal', {
                        currentPage: 1,
                        pageSize: 100,
                        enterpriseOrPersonalId: this.enterpriseOrPersonalId,
                        mediumType: mediumType,
                        // enterpriseOrPersonalId: '591635506115117056',
                        userId: this.userInfo.id
                    })
                    .then((res) => {
                        if (!res) return;
                        let data = res.data.data;
                        let ukeySeals = data.records;
                        this.ukeySeal = ukeySeals;
                    });
            }
        },

        /**
         * 跳转到指定页
         */
        handleCurrentChange(val) {
            if (val === this.totalPage) {
                this.redirectTopPageDis = false;
                this.prePageDis = false;
                this.redirectBottomPageDis = true;
                this.nextPageDis = true;
            }
            if (val === 1) {
                this.redirectTopPageDis = true;
                this.prePageDis = true;
                this.redirectBottomPageDis = false;
                this.nextPageDis = false;
            }
            this.pageNumber = val;
            this.getPageSingle();
        },

        /**
         * 向上到顶部
         */
        redirectTop() {
            this.pageNumber = 1;
            this.redirectTopPageDis = true;
            this.prePageDis = true;
            this.redirectBottomPageDis = false;
            this.nextPageDis = false;
            this.tempPageNum = this.pageNumber;
            this.getPageSingle();
        },

        /**
         * 向上翻页
         */
        prePage() {
            if (this.pageNumber <= 1) {
                return;
            }
            this.pageNumber--;
            this.redirectBottomPageDis = false;
            this.nextPageDis = false;
            if (this.pageNumber === 1) {
                this.redirectTopPageDis = true;
                this.prePageDis = true;
            }
            this.tempPageNum = this.pageNumber;
            this.getPageSingle();
        },

        /**
         * 向下翻页
         */
        nextPage() {
            if (this.pageNumber >= this.totalPage) {
                return;
            }
            this.pageNumber++;
            this.redirectTopPageDis = false;
            this.prePageDis = false;
            if (this.pageNumber === this.totalPage) {
                this.redirectBottomPageDis = true;
                this.nextPageDis = true;
            }
            this.tempPageNum = this.pageNumber;
            this.getPageSingle();
        },

        /**
         * 向下到底
         */
        redirectBottom() {
            this.pageNumber = this.totalPage;
            this.redirectTopPageDis = false;
            this.prePageDis = false;
            this.redirectBottomPageDis = true;
            this.nextPageDis = true;
            this.tempPageNum = this.pageNumber;
            this.getPageSingle();
        },
        // 获取文件单页数
        getPageSingle() {
            // 获取文件宽高
            this.$api('getPicSize')
                .get('getPath', {
                    fileCode: this.fileCode
                })
                .then((res1) => {
                    if (!res1) return;
                    let data = res1.data.data;
                    this.fileHeight = data.height;
                    this.fileWidth = data.width;
                    this.scale = 800 / data.width; // 页面宽度800 / 真实文件宽度
                    if (!this.fileSizeList.hasOwnProperty(this.fileCode)) {
                        this.fileSizeList[this.fileCode] = {
                            width: data.width,
                            height: data.height
                        };
                    }
                    // 获取文件信息
                    this.$api('pageSingle')
                        .get('getBlob', {
                            fileCode: this.fileCode,
                            pageNumber: this.pageNumber
                        })
                        .then((res) => {
                            if (!res) return;
                            let blob = res.data;
                            let url = window.URL.createObjectURL(res.data);
                            this.fileImg = url;
                            this.setStyle();
                        });
                });
        },
        chooseSignType(typeNum) {
            this.typeActive = typeNum;
        },
        closeSetRuleDialog() {
            // console.log(this.formRule);
            let signOnFileIndex = findIndex(this.cloudSignList, (o) => {
                return o.devPictureId === this.draggingSignId;
            });
            this.cloudSignList.splice(signOnFileIndex, 1);
            this.resetDialogChooseType();
        },
        dialogSure() {
            let signOnFileIndex = findIndex(this.cloudSignList, (o) => {
                return o.devPictureId === this.draggingSignId;
            });
            if (this.typeActive === '02') {
                this.$refs.multiplePageNo.validate((valid) => {
                    if (!valid) return;
                    this.cloudSignList[
                        signOnFileIndex
                    ].pageNo = this.formRule.pageNo;
                    this.setMultiplePageNo(this.cloudSignList[signOnFileIndex]);
                    this.resetDialogChooseType();
                });
            } else if (this.typeActive === '03') {
                if (this.formRule.startPageNo >= this.formRule.endPageNo) {
                    return this.$message.warning({
                        message: '结束页不能小于或等于起始页！',
                        customClass: 'zZindex'
                    });
                }

                if (
                    !checkIntegral(this.formRule.coverPageNum) ||
                    this.formRule.coverPageNum >
                        this.formRule.endPageNo - this.formRule.startPageNo + 1
                ) {
                    return this.$message.warning({
                        message: '覆盖页数需为正整数且不超过骑缝总页数！',
                        customClass: 'zZindex'
                    });
                }

                this.cloudSignList[
                    signOnFileIndex
                ].startPageNo = this.formRule.startPageNo;
                this.cloudSignList[
                    signOnFileIndex
                ].endPageNo = this.formRule.endPageNo;
                this.cloudSignList[
                    signOnFileIndex
                ].signatureDirection = this.formRule.signatureDirection;
                this.cloudSignList[
                    signOnFileIndex
                ].coverPageNum = this.formRule.coverPageNum;

                this.resetDialogChooseType();
            } else {
                // 批量签章
                // 先找出含有改页码的文件
                let fileList = this.fileList.filter(
                    (v) => v.pageTotal >= this.pageNumber
                );
                let sealItem = this.cloudSignList.splice(
                    this.cloudSignList.length - 1,
                    1
                );
                let batchId = +new Date();
                fileList.forEach((v, i) =>
                    this.cloudSignList.push(
                        Object.assign({}, sealItem[0], {
                            fileCode: v.fileCode,
                            devPictureId: +new Date() + i,
                            batchId
                        })
                    )
                );
                this.resetDialogChooseType();
            }
        },

        resetDialogChooseType() {
            this.formRule = {
                startPageNo: 1,
                endPageNo: 1,
                signatureDirection: 1, // 0左，1右
                coverPageNum: 1, // 骑缝签时每枚章的覆盖页数
                pageNo: ''
            };
            this.dialogChooseType = false;
            this.$nextTick(
                () =>
                    this.$refs.multiplePageNo &&
                    this.$refs.multiplePageNo.clearValidate()
            );
        },

        // 设置多页签的页码数组
        setMultiplePageNo(item) {
            let pageNoArr = [];
            item.pageNo.split(',').forEach((v) => {
                if (v.indexOf('-') === -1) {
                    pageNoArr.push(+v);
                } else {
                    let num = v.split('-');
                    for (let i = num[0]; i <= num[1]; i++) {
                        pageNoArr.push(+i);
                    }
                }
            });
            item.multiplePageNo = [...new Set(pageNoArr)];
        },

        setFoggyAndGrey() {
            if (this.foggyCheck) {
                this.checkList.map((item) => {
                    if (item === '签章雾化') {
                        this.formRule.foggy = true;
                        delete this.formRule.grey;
                    }
                    if (item === '签章脱密') {
                        this.formRule.grey = true;
                        delete this.formRule.foggy;
                    }
                });
            } else if (this.checkList.length === 2) {
                this.checkList.map((item) => {
                    if (item === '签章雾化') {
                        this.formRule.foggy = true;
                    } else if (item === '签章脱密') {
                        this.formRule.grey = true;
                    }
                });
            }
        },
        // 设置指定印章位置和控件的位置
        setStyle() {
            this.setPosArr.forEach((v) => {
                if (
                    v.fileCode === this.fileCode &&
                    !this.fileSizeList[this.fileCode].scale
                ) {
                    let posX = v.isWidget
                        ? (v.posX + 6) * this.scale + this.signWidth / 2
                        : v.posX * this.scale;
                    let posY = v.isWidget
                        ? (v.posY + 6) * this.scale + this.signWidth / 2
                        : v.posY * this.scale;
                    this.$set(v, 'posX', posX);
                    this.$set(v, 'posY', posY);
                }
            });
            if (!this.templateField.length)
                this.templateField = this.tempTemplateField;
            this.templateField.forEach((v) => {
                if (
                    v.fileCode === this.fileCode &&
                    !this.fileSizeList[this.fileCode].scale
                ) {
                    this.$set(v, 'left', v.signatureCoordinateX * this.scale);
                    this.$set(v, 'top', v.signatureCoordinateY * this.scale);
                }
            });
            !this.fileSizeList[this.fileCode].scale &&
                (this.fileSizeList[this.fileCode].scale = this.scale);
            $('.files .el-scrollbar__wrap')[0].scrollTop = 0;
            this.mouseMove();
        },
        mouseMove() {
            let _self = this;
            let imgWrapDom = $('.img-wrap');
            let fileDom = $('.file');
            let difWidth = (imgWrapDom.outerWidth() - fileDom.outerWidth()) / 2;
            let difHeight = imgWrapDom.outerHeight() - fileDom.outerHeight();
            let fileH = fileDom.outerHeight();
            // console.log($('.img-wrap').outerWidth());
            // console.log($('.file').outerWidth());
            if (this.event) {
                return;
            }
            this.event = true;
            imgWrapDom.on('mousedown', '.sign-wrap', function(e) {
                let target = $(e.currentTarget);
                let offsetX = e.pageX - target.offset().left;
                let offsetY = e.pageY - target.offset().top;
                let left, top;
                let dragDevpictureid = +target[0].dataset.devpictureid;
                // 如果点击的是关闭按钮
                let clickIcon = e.target.dataset.icon;
                if (clickIcon || !dragDevpictureid) {
                    return;
                }
                let dragCloudItemIndex = findIndex(_self.cloudSignList, (o) => {
                    return o.devPictureId === dragDevpictureid;
                });
                let sealItem = _self.cloudSignList[dragCloudItemIndex];
                let batchSignList = sealItem.batchId
                    ? _self.cloudSignList.filter(
                          (v) => v.batchId === sealItem.batchId
                      )
                    : [sealItem];
                // console.log(dragDevpictureid,dragCloudItemIndex, _self.cloudSignList);
                e.preventDefault();
                $(document).bind('mousemove', function(e) {
                    let target1 = e.target;
                    let dataset = $(target1)[0].dataset;
                    // console.log($(target1)[0].dataset);
                    let fileHInner = fileDom.outerHeight();
                    let fileWInner = fileDom.outerWidth();
                    left = e.pageX - imgWrapDom.offset().left - offsetX;
                    top = e.pageY - imgWrapDom.offset().top - offsetY;
                    left =
                        left < 0
                            ? 0
                            : left > imgWrapDom.width() - target.width()
                            ? imgWrapDom.width() - target.width()
                            : left;
                    top =
                        top < 0
                            ? 0
                            : top > imgWrapDom.height() - target.outerHeight()
                            ? imgWrapDom.height() - target.outerHeight()
                            : top;
                    sealItem.left = left;
                    sealItem.top = top;
                    sealItem.dragging = true;
                    // ukey签署用坐标 比例
                    // _self.ukeySignData[0].signCenterPosXRatio =
                    //     (left - diffWidthInner + target.width() / 2) /
                    //     fileWInner;
                    // _self.ukeySignData[0].signCenterPosYRatio =
                    //     1 - (top + target.outerHeight() / 2) / fileHInner;

                    sealItem.posx = (left + target.width() / 2) / fileWInner;
                    sealItem.posy =
                        1 -
                        (fileHInner - top - target.outerHeight() / 2) /
                            fileHInner;
                    // 印章中心坐标
                    _self.ukeySignData[0].llx =
                        (left + target.width() / 2) / _self.scale;
                    _self.ukeySignData[0].lly =
                        (fileHInner - top - target.outerHeight() / 2) /
                        _self.scale;
                    // 云签署用坐标
                    sealItem.signSubmitPosX =
                        (left + target.width() / 2) / _self.scale;
                    sealItem.signSubmitPosY =
                        (fileHInner - top - target.outerHeight() / 2) /
                        _self.scale;
                    sealItem.y = (top + target.outerHeight() / 2) / _self.scale;
                    // console.log(that.ukeySignData);
                    $(document).mouseup(function() {
                        $(this).unbind('mousemove');
                        $(this).unbind('mouseup');
                        if (_self.debounceTimer !== null) {
                            clearTimeout(_self.debounceTimer);
                        }
                        _self.debounceTimer = setTimeout(() => {
                            if (!_self.cloudSignList.length) return;
                            sealItem.dragging = false;
                            if (sealItem.batchId) {
                                batchSignList.forEach((v, i) => {
                                    if (
                                        v.devPictureId !== sealItem.devPictureId
                                    ) {
                                        Object.assign(v, sealItem, {
                                            devPictureId: +new Date() + i,
                                            fileCode: v.fileCode
                                        });
                                    }
                                });
                            }
                            // 单页签预盖章
                            if (
                                sealItem.signatureMethod === '01' &&
                                _self.signSetData.preSign === 1
                            ) {
                                _self.preSignCheck(
                                    sealItem,
                                    sealItem.devPictureId
                                );
                                _self.adsorbSignToPos(
                                    left,
                                    top,
                                    sealItem,
                                    fileHInner,
                                    sealItem.isUkey
                                );
                            } else if (_self.typeActive === '01') {
                                // 单页签才支持指定位置签署
                                // console.log(666)
                                _self.adsorbSignToPos(
                                    left,
                                    top,
                                    sealItem,
                                    fileHInner,
                                    sealItem.isUkey
                                );
                            }
                        }, 50);
                    });
                });
            });
        },
        // 预盖章
        preSign(venderCloudItem) {
            let info = {};
            info.xcoordinate =
                venderCloudItem.signSubmitPosX - this.standerdSignWidth / 2;
            info.ycoordinate =
                venderCloudItem.signSubmitPosY - this.standerdSignWidth / 2;
            info.wcoordinate = this.standerdSignWidth;
            info.hcoordinate = this.standerdSignWidth;
            info.fileCode = this.fileCode;
            info.page = this.pageNumber;
            return this.$api('judgePosition').post('postNormal', info);
        },
        // 删除文件上印章
        removeSignPos() {
            this.showPosOk = false;
            this.signShow = false;
            this.ukeySign = false;
            this.sign = '';
        },

        // 拒签
        refuseSign() {
            this.$prompt('请输入拒签原因', '拒签', {
                confirmButtonText: '确定',
                cancelButtonText: '取消'
            })
                .then(({ value }) => {
                    let sendData = {
                        contractId: this.contractId,
                        rejectContent: encodeURIComponent(value) || '',
                        timeStamp: new Date().getTime()
                    };
                    let url = this.isFile ? 'rejectFile' : 'rejectContract';
                    this.$api(url)
                        .post('postQuery', {}, sendData)
                        .then((res) => {
                            this.$message.warning('已拒签');
                            let path = this.isFile
                                ? '/fileCenter/fileManage'
                                : '/contractMgt/index';
                            this.$router.push(path);
                        })
                        .catch((err) => {});
                })
                .catch(() => {});
        },

        // TODO 完成签署BTN
        submitSign() {
            if (this.isFill) {
                // 如果是填写控件，不处理印章
                return this.signContract();
            }
            this.cloudSignList.forEach((v) => {
                v.foggy = this.foggyCheck;
                v.grey = this.greyCheck;
            });

            if (!this.cloudSignList.length) {
                this.$message.warning('请拖拽印章添加到文件上！');
                return;
            }

            // 所有文件都需签署
            let fileCodeList = this.fileList.map((v) => v.fileCode);
            let signFileList = [
                ...new Set(this.cloudSignList.map((v) => v.fileCode))
            ];
            if (fileCodeList.length !== signFileList.length) {
                this.$message.warning('请您为其他文件选择印章/签名进行签署');
                return;
            }

            // 对单页签的章模进行预签章校验
            let preSignList = this.cloudSignList.filter(
                (v) => v.signatureMethod === '01'
            );
            if (this.signSetData.preSign === 1) {
                let ifHasPresignFalse = preSignList.some((o) => {
                    return !o.preSign;
                });
                // 如果开启了于盖章功能
                if (ifHasPresignFalse) {
                    this.$message.warning(
                        '系统管理员已开启安全用章功能，请勿在空白页和章下无文字处盖章！'
                    );
                    return;
                }
            }

            // 指定位置签署校验
            if (this.setPosArr.length) {
                let checkPosSignReady = this.checkPosSignReady();
                if (!checkPosSignReady) return;
            }

            this.ukeySignList = this.cloudSignList.filter((v) => v.isUkey);
            let cloudSignList = this.cloudSignList.filter((v) => !v.isUkey);

            if (cloudSignList.length) {
                this.dialogInputSignPassword = true;
            } else {
                this.readUkey('check');
            }
        },
        async signContract(ukeySignList = []) {
            let _self = this;

            // ----------------------------------------------------------------
            console.log(this.contractId);

            let signReqVOS = [];
            // console.log(this.contractForm)
            // console.log(this.cloudSignList)

            let cloudSignList = this.cloudSignList.filter((v) => !v.isUkey);

            signReqVOS = cloudSignList.map((v) => {
                if (v.signatureDirection === 0) {
                    v.signSubmitPosX = 0;
                }

                return {
                    compactFileCode: v.fileCode,
                    compactId: this.contractId,
                    originalFileName: v.originalFileName,
                    coverPageNum: v.coverPageNum,
                    foggy: v.foggy,
                    grey: v.grey,
                    pageSize: v.coverPageNum,
                    sealCode: v.pictureCode,
                    signName: this.userInfo.userNickName,
                    signType: '01',
                    signatoryId: this.userInfo.id,
                    signatureCoordinateX: v.signSubmitPosX,
                    signatureCoordinateY: v.signSubmitPosY,
                    signatureEndPage: v.endPageNo,
                    signatureMethod: v.signatureMethod,
                    signatureStartPage: v.startPageNo || v.pageNo
                };
            });
            if (this.isFill) {
                let templateField = JSON.parse(
                    JSON.stringify(this.templateField)
                );
                let noFill = templateField.find(
                    (v) => !v.content && v.isChoose === 1
                );
                if (noFill) {
                    return this.$message.warning('请为必填控件输入内容');
                }
                for (const v of templateField) {
                    v.compactFileCode = v.fileCode;
                    v.originalFileName = this.fileList.find(
                        (val) => val.fileCode === v.fileCode
                    ).fileName;
                    if (v.content) {
                        v.signatureCoordinateY =
                            this.fileSizeList[v.fileCode].height -
                            wordFontSizeToPx(v.fontSize) -
                            v.signatureCoordinateY;
                    }
                    if (v.signType === '03' && v.content) {
                        if (v.fieldType === 2 && !isPhoneNum(v.content)) {
                            this.$message.warning('手机号码格式不正确');
                            return false;
                        }
                        if (v.fieldType === 3 && !isCard(v.content)) {
                            this.$message.warning('身份证号码格式不正确');
                            return false;
                        }
                        if (v.fieldType === 4 && !isNewCredit(v.content)) {
                            this.$message.warning('统一社会信用代码格式不正确');
                            return false;
                        }
                    }
                }

                signReqVOS = signReqVOS.concat(templateField);
            }
            let signatoryId = this.$route.query.phone
            let res2 = await this.$api('getInfoByUserName').post(
                'postQuery',
                {},
                {
                    userName: this.$route.query.phone
                }
            );
            if (res2 && res2.data && res2.data.data) {
                signatoryId = res2.data.data.id;
            }
            // TODO 完成签署BTN >>> 异步请求
            let sendData = Object.assign({
                compactTheme: this.$route.query.enterpriseName + '-业务订单', // 主题,
                contractFileList: this.fileList, // 合同文件列表,
                remark: '', // 备注
                // signContact: '', // 签署人的联系方式联系方式(自签)
                signDeadline: '', // 签署截止日期
                signInfos: [
                    {
                        enterpriseName: '',
                        name: '',
                        signName: this.userInfo.userNickName,
                        signContact: this.userInfo.userName,
                        signType: '01',
                        signatoryId: this.userInfo.id,
                        type: '01'
                    },
                    {
                        enterpriseName: this.$route.query.enterpriseName,
                        name: '',
                        signName: this.$route.query.name,
                        signContact: this.$route.query.phone,
                        signType: '02',
                        signatoryId,
                        type: '01'
                    }
                ], // 签署信息---签署人列表
                // signName: '', // 签署人(自签)
                signWay: '01', // 签署方式（01：无序签；02：顺序签署；03：每人单独签署；）
                signatoryWay: '01', // 签署对象（01：我需要签署；02：仅需他人签署；）
                validityEndDate: '', // 合同有效期
                compactFieldInfoReqVoList: [], // 签名域信息集
                fileManageSignReqVoS: signReqVOS, // 签章信息
                contractId: '',
                isSiteSign: '0', // 是否指定签署位置（0：未指定签署位置；1：指定签署位置；）
                orgId: this.userInfo.enterpriseId, // 所属组织Id ,
                type: '02', //  类型（01:文件管理，02:合同）
                isUseEventCert: false
            });

            // 如果存在ukey印章，
            if (ukeySignList.length > 0) {
                sendData.ukeySignReqVoS = ukeySignList;
            }

            // 发起人是否需要签署
            console.log(sendData);
            let res = await this.$api('initiateSignContract').post(
                'postNormal',
                sendData
            );
            console.log(res);
            if (!res) return;
            let res1 = await this.$api('updateOrderStatus').get('', {
                id: this.$route.query.id,
                status: 1,
                contractId: res.data.data
            });
            this.$message.success('发起合同成功！');
            this.$router.push('businessMgt');
            // let sendData = {
            //     contractId: this.contractId,
            //     signReqVoS: signReqVOS,
            //     ukeySignReqVoS: ukeySignReqVOS,
            //     isUseEventCert: false
            // };
            // console.log(sendData);
            // this.isFill && (sendData.templateFillReqVos = signReqVOS);
            // let url = this.isFill
            //     ? 'fillContract'
            //     : this.isFile
            //     ? 'signFile'
            //     : 'signContract';
            // let res = await this.$api(url).post('postNormal', sendData);
            // if (!res) return;
            // let msg = this.isFill ? '填写完成' : '签署成功';
            // this.$message.success(msg);
            // let path = this.isFile
            //     ? '/fileCenter/fileManage'
            //     : '/contractMgt/index';
            // this.$router.push(path);
        },
        /**
         * 文件列表切换
         */
        handleFileListClick(val) {
            let item = {};
            if (val.name === 'second' && this.accessoryList.length) {
                item = this.accessoryList[0];
            } else if (val.name === 'first') {
                item = this.fileList[0];
            } else {
                return;
            }
            this.startPages = this.endPages = this.totalPage = item.pageTotal;
            this.fileCode = item.fileCode;
            this.fileName = item.fileName;
            this.currFile = 0;
            this.pageNumber = 1;
            this.tempPageNum = 1;
            this.redirectTopPageDis = true;
            this.prePageDis = true;
            this.nextPageDis = false;
            this.redirectBottomPageDis = false;
            this.getPageSingle();
        },
        // 点击操作栏的遮罩
        clickMask() {
            this.$message.warning('附件不允许操作！');
        },
        // 距离指定位置一定范围内吸附上去
        adsorbSignToPos(left, top, cloudSignItem, fileHInner, isUkey = false) {
            if (!this.setPosArr.length) return;
            for (const item of this.setPosArr) {
                if (
                    item.pageNo === this.pageNumber &&
                    left + cloudSignItem.width / 2 >
                        item.posX - this.signWidth * 0.2 &&
                    left + cloudSignItem.width / 2 <
                        item.posX + this.signWidth * 0.2 &&
                    top + cloudSignItem.height / 2 >
                        item.posY - this.signWidth * 0.2 &&
                    top + cloudSignItem.height / 2 <
                        item.posY + this.signWidth * 0.2 &&
                    cloudSignItem.pictureType === item.signType
                ) {
                    cloudSignItem.left =
                        item.posX - 1 - cloudSignItem.width / 2; // 减去一个边框
                    cloudSignItem.top =
                        item.posY - 1 - cloudSignItem.height / 2;
                    cloudSignItem.signSubmitPosX = item.posX;
                    cloudSignItem.signSubmitPosY = item.posY;
                    cloudSignItem.isPos = true; // 打上固定签署的logo
                    break;
                } else {
                    delete cloudSignItem.isPos; // 删除标识
                }
            }
        },
        // 校验固定位置是否全部有章
        checkPosSignReady() {
            // 指定位置已有章模数组
            let signInPosArr = this.cloudSignList.filter((item) => item.isPos);
            // console.log(signInPosArr);
            let flag = true;
            for (let i = 0; i < this.setPosArr.length; i++) {
                // 指定位置和已有章模对比
                flag = signInPosArr.find((v) => {
                    if (v.isUkey) {
                        return (
                            v.fileCode === this.setPosArr[i].fileCode &&
                            v.pageNo === this.setPosArr[i].pageNo &&
                            v.signSubmitPosX === this.setPosArr[i].posX &&
                            v.signSubmitPosY === this.setPosArr[i].posY
                        );
                    } else {
                        return (
                            v.fileCode === this.setPosArr[i].fileCode &&
                            v.pageNo === this.setPosArr[i].pageNo &&
                            v.signSubmitPosX === this.setPosArr[i].posX &&
                            v.signSubmitPosY === this.setPosArr[i].posY
                        );
                    }
                });
                if (!flag) {
                    this.$message.warning('请先在指定位置签署！');
                    break;
                }
            }
            return flag;
        },
        // 取消输入签署密码
        signPwCancel() {
            this.$refs.signPwForm && this.$refs.signPwForm.resetFields();
            this.dialogInputSignPassword = false;
        },
        resetSignPw() {
            this.signPwCancel();
        },
        // 确定签署密码
        signPwConfirm(formName) {
            this.$refs[formName].validate(async (valid) => {
                if (!valid) return;
                let res = await this.$api('verifySignPassword').post(
                    'postQuery',
                    {},
                    { password: this.signPwForm.password }
                );
                if (!res) return;
                console.log(res);

                if (!res.data.data)
                    return this.$message.error({
                        message: '签署密码错误',
                        customClass: 'zZindex'
                    });
                if (this.ukeySignList.length) {
                    // this.readUkey('ukeyPinConfirm');
                    this.readUkey('check');
                } else {
                    this.signContract();
                }
            });
        },
        filterFieldType(val) {
            if (val === 2) {
                return '手机号';
            } else if (val === 3) {
                return '身份证号';
            } else if (val === 4) {
                return '统一社会信用代码';
            } else {
                return '文本';
            }
        },
        submitSignPassword() {
            if (this.isSign) {
                if (this.ukeySignList.length) {
                    // this.readUkey('ukeyPinConfirm');
                    this.readUkey('check');
                } else {
                    this.signContract();
                }
            } else {
                this.isSignPassword =
                    sessionStore.get('isSignPassword') === 'true' || false;
            }
        },
        /**
         * 滚动翻页
         */
        fileContainerWheel(e) {
            let dom = $('.files .el-scrollbar__wrap');
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
                    this.prePage();
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
                    this.nextPage();
                }, 100);
                setTimeout(() => {
                    this.timer = false;
                }, 300);
            }
        },
        useMessage() {
            this.isSign = true;
            this.$refs.signPasswordDialog.identityAuthDialog = true;
            this.$nextTick(() => (this.dialogInputSignPassword = false));
        },
        setSignPassword() {
            this.isSign = false;
            this.$refs.signPasswordDialog.identityAuthDialog = true;
        },
        forgetPassword() {
            this.isSign = false;
            this.$refs.signPasswordDialog.identityAuthDialog = true;
        }
    }
};
</script>
<style lang="scss" scoped>
.input-container {
    position: absolute;
    > .el-input,
    > .el-date-editor,
    > .el-select {
        width: 100%;
        height: 100%;
    }
}
.sign-pw-dialog {
    .el-form-item {
        margin: 0;
    }
    .dialog-footer {
        .cancel {
            color: #626262;
            &:hover {
                border-color: #c0ccda;
            }
        }
    }
    .no-sign-paw {
        margin-top: 50px;
        text-align: center;
        span {
            text-decoration: underline;
            color: #02adff;
            cursor: pointer;
        }
    }
    .btn-wrap {
        margin-bottom: 20px;
    }
    .forget {
        cursor: pointer;
        margin: 0 10px;
        &:hover {
            color: #006efe;
        }
    }
}
.sign-contract {
    position: absolute;
    left: 0;
    right: 0;
    top: 0;
    bottom: 0;
    background: #f4f6f8;
    .batch-sign {
        text-align: center;
        p {
            font-size: 18px;
            margin: 20px 0;
        }
    }
}
.inner {
    position: relative;
    width: 100%;
    height: 100%;
    margin: 0 auto;
    color: #333;
    .header {
        width: 100%;
        height: 44px;
        align-items: top;
        display: flex;
        justify-content: space-between;
        padding: 0 20px;
        box-shadow: 0 2px 4px 0 rgba(203, 203, 203, 0.5);
        .reback {
            color: #626262;
            font-size: 16px;
            margin-top: 10px;
            cursor: pointer;
        }
        .contract-theme {
            line-height: 44px;
            margin-left: 280px;
        }
        .refuse {
            margin-right: 10px;
            color: #fff;
            border: none;
        }
    }
    .container {
        display: flex;
        position: absolute;
        width: 100%;
        left: 0;
        top: 45px;
        bottom: 0;
        .tab-mask {
            width: 300px;
            height: 100%;
            position: absolute;
            background-color: rgba(0, 0, 0, 0.3);
            left: 0;
            top: 0;
            z-index: 10001;
            display: none;
            &.active {
                display: block;
            }
        }
        .shadow-sign {
            position: absolute;
            z-index: 10000;
            cursor: move;
        }
        .sign-list {
            width: 220px;
            background: #fff;
            position: relative;
            .el-tabs {
                width: 100%;
                height: 320px;
                position: absolute;
                left: 0;
                top: 0;
            }
            .el-tabs__nav.is-top {
                width: 100%;
            }
            .el-tabs__item {
                width: 100%;
            }
            .el-scrollbar {
                flex: 1;
            }
            .pagination-wrap {
                height: 40px;
            }
            .sign-list-wrap {
                padding: 0 20px;
                display: flex;
                flex-wrap: wrap;
                justify-content: space-between;
                li {
                    width: 80px;
                    cursor: move;
                    margin-bottom: 10px;
                    .img {
                        padding: 5px;
                        width: 80px;
                        height: 80px;
                        line-height: 80px;
                        img {
                            width: 100%;
                            max-height: 100%;
                            border: solid 1px rgb(243, 242, 242);
                            &:hover {
                                border: solid 1px #c4cfdc;
                            }
                            &:active {
                                border: solid 1px #2a68c8;
                            }
                        }
                    }
                    p {
                        margin-top: 6px;
                        text-align: center;
                        font-size: 12px;
                        color: #999;
                        text-overflow: ellipsis;
                        overflow: hidden;
                        white-space: nowrap;
                    }
                }
            }
            .pagination-wrap {
                width: 100%;
                text-align: center;
                margin-top: 10px;
            }
            .no-seal {
                text-align: center;
                margin-top: 20px;
                color: #ccc;
            }
            .ukey-select {
                padding: 10px 20px;
                .sign-list-wrap {
                    padding: 0;
                }
            }
            .sure-ukey {
                width: 100%;
                margin-bottom: 10px;
            }
            .set-pos {
                .title {
                    height: 40px;
                    line-height: 40px;
                    text-align: center;
                    border-bottom: solid 1px #e2e2e2;
                    margin-bottom: 16px;
                    color: #626262;
                    font-size: 16px;
                }
                .pos-content {
                    padding: 0 14px;
                }
                .pos-sign {
                    margin-top: 14px;
                    display: flex;
                    align-items: center;
                    justify-content: space-between;
                    padding: 5px 20px;
                    border: solid 1px #c0ccda;
                    cursor: move;
                    i {
                        font-size: 22px;
                        color: #409eff;
                    }
                    .pos-sign-word {
                        margin: 0 20px 0 10px;
                        white-space: nowrap;
                    }
                    .pos-name {
                        color: #409eff;
                        min-width: 40px;
                        text-overflow: ellipsis;
                        overflow: hidden;
                        white-space: nowrap;
                    }
                }
            }
            .reset-pos {
                position: absolute;
                top: 420px;
            }
            .sign-setting {
                position: absolute;
                width: 100%;
                top: 320px;
                h2 {
                    text-align: center;
                    font-size: 16px;
                    color: #626262;
                    border-bottom: solid 1px #e2e2e2;
                    padding-bottom: 10px;
                }
                i {
                    cursor: pointer;
                }
            }
        }
        .files {
            flex: 1;
            position: relative;
            .img-wrap {
                width: 800px;
                margin: 0 auto;
                position: relative;
                .file {
                    width: 100%;
                    vertical-align: middle;
                }
                .need-to-sign {
                    position: absolute;
                    border: dashed 1px #bdbbbb;
                    border-radius: 50%;
                    &.is-signature {
                        border-radius: 0;
                    }
                }
                .sign-wrap {
                    position: absolute;
                    z-index: 99;
                    border: solid 1px transparent;
                    .sign-moving-tips {
                        color: #fff;
                        width: 100%;
                        background: #4a90e2;
                        font-size: 12px;
                        height: 28px;
                        line-height: 28px;
                        padding: 0 5px;
                        border-radius: 4px;
                        position: absolute;
                        left: 0;
                        top: -38px;
                        &::before {
                            content: '';
                            position: absolute;
                            left: 50%;
                            top: 100%;
                            width: 0;
                            height: 0;
                            border-left: 4px solid transparent;
                            border-right: 4px solid transparent;
                            border-top: 4px solid #4a90e2;
                        }
                        &:hover {
                            border: none;
                        }
                    }
                    .sign-garbage-basket {
                        position: absolute;
                        width: 30px;
                        height: 30px;
                        left: 50%;
                        margin-left: -15px;
                        top: 102%;
                        &:hover {
                            border: none;
                        }
                        i {
                            cursor: pointer;
                            font-size: 22px;
                            &:hover {
                                border: none;
                            }
                        }
                    }
                    .el-icon-error {
                        position: absolute;
                        font-size: 20px;
                        color: #4a90e2;
                        right: -10px;
                        top: -10px;
                        background: #fff;
                        cursor: pointer;
                        display: none;
                    }
                    &:hover {
                        border: solid 1px #c4cfdc;
                        .el-icon-error {
                            display: block;
                        }
                    }
                    .sure {
                        position: absolute;
                        right: -15px;
                        top: 0px;
                        font-size: 20px;
                        color: #409eff;
                        cursor: pointer;
                    }
                    .close {
                        position: absolute;
                        right: -15px;
                        bottom: 0px;
                        font-size: 20px;
                        color: #409eff;
                        cursor: pointer;
                        color: rgba(255, 0, 0, 0.911);
                    }
                    .fixed {
                        width: 100%;
                        height: 100%;
                        position: absolute;
                        left: 0;
                        top: 0;
                    }
                }
                .drag-class {
                    border: solid 1px #2a68c8;
                    &:hover {
                        border: solid 1px #2a68c8;
                    }
                }
                .sign {
                    cursor: move;
                    width: 151px;
                    height: 151px;
                }
            }
            .file-wrap {
                position: relative;
            }
            .page-num {
                position: absolute;
                top: 15px;
                right: 15px;
                color: #999;
                font-size: 12px;
            }
        }
        .choose-type {
            width: 30px;
            display: flex;
            flex-direction: column;
            justify-content: center;
            z-index: 100;
            .el-button {
                width: 30px;
                height: 104px;
                line-height: initial;
                padding: 15px 8px;
                margin-left: 0;
                margin-top: 20px;
                cursor: pointer;
            }
            margin: 0 0 0 30px;
        }
        .file-list {
            width: 206px;
            background: #fff;
            position: relative;
            // overflow-x: hidden;
            .turn-page {
                position: absolute;
                bottom: 60px;
                left: -50px;
                color: #999;
                font-size: 12px;
                display: flex;
                flex-direction: column;
                span {
                    width: 30px;
                    height: 30px;
                    line-height: 30px;
                    text-align: center;
                    font-size: 16px;
                    border-radius: 50%;
                    cursor: pointer;
                    margin-bottom: 20px;
                    color: #fff;
                    background: #c4cfdc;
                    &:hover {
                        background: #2a68c8;
                        color: #fff;
                    }
                }
                .disabled {
                    background: #e2e2e2;
                    pointer-events: none;
                    &:hover {
                        background: #e2e2e2;
                    }
                }
            }
            > p {
                text-align: center;
                line-height: 40px;
                border-bottom: 1px solid #ccc;
            }
            .file-item {
                padding: 6px;
                width: 120px;
                height: 160px;
                margin: 0 auto 10px;
                border-radius: 4px;
                overflow: hidden;
                border: solid 2px #e2e2e2;
                position: relative;
                cursor: pointer;
                img {
                    width: 100%;
                    height: 100%;
                }
                &.active {
                    border: solid 2px #4a90e2;
                    .file-type {
                        border-color: #006efe;
                        color: #006efe;
                    }
                }
                .file-type {
                    width: 30px;
                    height: 20px;
                    line-height: 18px;
                    border: 1px solid #e2e2e2;
                    border-radius: 4px;
                    color: #e2e2e2;
                    position: absolute;
                    right: 0;
                    bottom: 0;
                    text-align: center;
                }
            }
        }
    }
}
.file-list {
    .el-scrollbar {
        width: 100%;
        position: absolute;
        left: 0;
        top: 10px;
        bottom: 0;
    }
    &.is-file {
        .el-scrollbar {
            top: 50px;
        }
    }
}
.files {
    .el-scrollbar {
        width: 100%;
        position: absolute;
        left: 0;
        top: 0;
        bottom: 0;
        padding: 10px 0;
    }
}
.choose-wrap {
    .choose-page {
        display: flex;
        flex-wrap: wrap;
        .el-form-item {
            margin-right: 30px;
        }
    }
    .el-select {
        width: 120px;
    }
}
.el-checkbox-group {
    width: 100%;
    display: flex;
    padding-left: 10px;
}
.dialog-footer {
    width: 100%;
    text-align: center;
    .el-button {
        margin-right: 10px;
        width: 120px;
    }
}
</style>
<style lang="scss">
.sign-contract {
    .input-container {
        .el-input__inner {
            height: 100%;
            padding: 0 5px;
        }
    }
    .el-tabs__nav.is-top {
        width: 100%;
        .el-tabs__item {
            width: 50%;
            text-align: center;
        }
    }
    .el-tabs__content {
        width: 100%;
        position: absolute;
        left: 0;
        bottom: 0;
        top: 50px;
        .cloud-seal,
        .ukey-seal {
            width: 100%;
            position: absolute;
            left: 0;
            bottom: 0;
            top: 0;
            display: flex;
            flex-direction: column;
        }
    }
    .choose-type span {
        display: inline-block;
        height: 100%;
        line-height: 18px;
        word-wrap: break-word;
        white-space: normal;
        width: 100%;
        letter-spacing: 2px;
    }
    .ukey-check-dialog {
        .el-select {
            width: 100%;
        }
        .el-dialog__body {
            padding-bottom: 0;
        }
        .el-dialog__footer {
            padding-top: 0;
        }
    }
    .check-list {
        padding: 20px 10px;
        .el-checkbox__inner {
            width: 16px;
            height: 16px;
        }
        .el-checkbox__label {
            padding-left: 6px;
        }
        .el-checkbox {
            margin-right: 6px;
        }
    }
}
</style>
