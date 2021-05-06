<template>
    <div class="new-contract-step3">
        <div class="inner">
            <!-- 头部 -->
            <header class="header">
                <div class="reback" @click="$router.go(-1)">返回</div>

                <!-- TODO 跳转指定页 -->
                <!-- <div class="contract-theme ellipsis">{{ contractForm.compactTheme }}</div> -->
                <div class="contract-theme ellipsis">
                    <!-- 页码跳转 -->
                    <page-jumper
                        @current-change="handleCurrentChange"
                        :totalPage="totalPage"
                        :tempPageNum="pageNumber"
                    ></page-jumper>
                </div>

                <div class="sign-btn">
                    <!-- <el-button
                        size="medium"
                        class="refuse"
                        type="info"
                        @click.stop="refuseSign"
                        >拒签</el-button
                    >-->
                    <el-button
                        size="medium"
                        class="refuse"
                        type="info"
                        @click.stop="draftContract"
                        v-if="!$route.query.contractId"
                        >存草稿</el-button
                    >
                    <el-button
                        type="primary"
                        size="medium"
                        @click.stop="submitSign"
                        :loading="loadingFinishSign"
                        >{{ signTitle }}</el-button
                    >
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
                            width: signWidth + 'px',
                            height: signHeight + 'px'
                        }"
                        alt="印章"
                    />
                </div>
                <!-- 影子指定位置章框 -->
                <div
                    class="shadow-sign-setpos"
                    v-show="showShadowPosSign"
                    :style="{
                        left: shadowSetPosX + 'px',
                        top: shadowSetPosY + 'px'
                    }"
                >
                    <div
                        class="title-wrap"
                        :style="{
                            width: signWidth + 20 + 'px'
                        }"
                    >
                        <div class="title-wrap-inner">
                            <p class="title">{{ posSignPeople }}</p>
                        </div>
                        <i class="el-icon-close"></i>
                    </div>
                    <div class="sign-pos-wrap">
                        <div
                            class="sign-pos"
                            :style="{
                                width: signWidth + 'px',
                                height: signHeight + 'px'
                            }"
                        >
                            印章位置
                        </div>
                    </div>
                </div>

                <!-- TODO 印章列表 >>> 云印章、UKEY印章 -->
                <div class="sign-list">
                    <el-tabs
                        v-if="signatoryWay !== '02'"
                        v-model="tabActiveName"
                        @tab-click="handleTabClick"
                    >
                        <!-- 云印章列表 -->
                        <el-tab-pane
                            label="云印章"
                            name="first"
                            class="cloud-seal"
                        >
                            <el-scrollbar v-if="sealList.length">
                                <ul class="sign-list-wrap">
                                    <li
                                        v-for="(item, index) in sealList"
                                        :key="index"
                                        class="seal-list-item"
                                        :data-picturecode="item.pictureCode"
                                        :data-picturepath="item.picturePath"
                                        data-logo="cloudSeal"
                                    >
                                        <div class="img">
                                            <img
                                                :src="item.picturePath"
                                                alt="印章图片"
                                            />
                                        </div>
                                        <p>{{ item.pictureName }}</p>
                                    </li>
                                </ul>
                            </el-scrollbar>
                            <div
                                class="pagination-wrap"
                                v-if="pagination.total"
                            >
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

                        <!-- UKEY 印章列表 -->
                        <el-tab-pane
                            label="UKEY印章"
                            name="second"
                            class="ukey-seal"
                        >
                            <div class="ukey-select">
                                <el-button
                                    type="primary"
                                    :disabled="ukeyReadDis"
                                    class="sure-ukey"
                                    :loading="readUkeyLoading"
                                    @click.stop="readUkey('getCaType')"
                                    >读取UKEY</el-button
                                >
                                <div class="ukey-seal-wrap">
                                    <ul class="sign-list-wrap">
                                        <li
                                            v-for="(item,
                                            index) in ukeySealItem"
                                            :key="index"
                                            @click.stop="
                                                chooseSign(item, 'ukey')
                                            "
                                            class="seal-list-item"
                                            :data-picturecode="item.pictureCode"
                                            :data-picturepath="item.picturePath"
                                            data-logo="ukeySeal"
                                        >
                                            <div class="img">
                                                <img
                                                    :src="item.picturePath"
                                                    alt="印章图片"
                                                />
                                            </div>
                                            <p>{{ item.pictureName }}</p>
                                        </li>
                                    </ul>
                                </div>
                                <el-button
                                    size="medium"
                                    class="dowload-ukey"
                                    plain
                                    @click="downloadDriver"
                                >
                                    UKEY驱动下载
                                    <i class="iconfont icon-xiazai1"></i>
                                </el-button>
                            </div>
                        </el-tab-pane>
                    </el-tabs>

                    <div class="sign-setting" v-if="signatoryWay !== '02'">
                        <h2>签章设置</h2>
                        <div class="check-list">
                            <div class="sign-foggy">
                                <el-checkbox
                                    size="medium"
                                    label="签章雾化"
                                    v-model="foggyCheck"
                                ></el-checkbox>
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
                                <el-checkbox
                                    size="medium"
                                    label="签章脱密"
                                    v-model="greyCheck"
                                ></el-checkbox>
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

                    <!-- TODO 仅需他人签署（添加签署人后的功能） -->
                    <div
                        v-if="signatoryWay && contractForm.signInfos.length > 1"
                        class="set-pos"
                        :class="{ 'reset-pos': signatoryWay === '01' }"
                    >
                        <div class="title">指定签章位置</div>
                        <div class="pos-content">
                            <el-select
                                v-model="posSignPeople"
                                placeholder="请选择签署人"
                                @change="chooseSignPeople"
                                :disabled="chooseSignPeopleDis"
                            >
                                <el-option
                                    v-for="item in optionsSignPeople"
                                    :key="item.signatoryId"
                                    :label="item.signName"
                                    :value="item.signatoryId"
                                ></el-option>
                            </el-select>
                            <div class="pos-sign">
                                <i class="el-icon-s-check"></i>
                                <span class="pos-sign-word">盖章</span>
                                <span class="pos-name">{{
                                    posSignPeople
                                }}</span>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- 签署类型 >>> 单签、多签、骑缝签 -->
                <section
                    class="choose-type"
                    :class="{ 'only-other': signatoryWay === '02' }"
                >
                    <el-button
                        @click.stop="chooseSignType('01')"
                        :type="typeActive === '01' ? 'primary' : ''"
                        >单页签章</el-button
                    >
                    <el-button
                        @click.stop="chooseSignType('02')"
                        :type="typeActive === '02' ? 'primary' : ''"
                        >多页签章</el-button
                    >
                    <el-button
                        @click.stop="chooseSignType('03')"
                        :type="typeActive === '03' ? 'primary' : ''"
                        >骑缝签章</el-button
                    >
                </section>

                <!-- 文件签署区 -->
                <div class="files" @mousewheel.stop="fileContainerWheel">
                    <div class="img-wrap" ref="fileItemWrap">
                        <div class="file-wrap" ref="fileWrap">
                            <div
                                v-for="(cloudItem, index) in cloudSignList"
                                :key="index"
                                class="sign-wrap"
                                ref="signWrap"
                                :class="{ 'drag-class': cloudItem.dragging }"
                                :data-devpictureid="cloudItem.devPictureId"
                                v-show="
                                    cloudItem.fileCode === fileCode &&
                                        cloudItem.pageNo === pageNumber
                                "
                                :style="{
                                    left: cloudItem.left + 'px',
                                    top: cloudItem.top + 'px'
                                }"
                            >
                                <p
                                    class="sign-moving-tips"
                                    v-if="cloudItem.dragging"
                                >
                                    松开确定位置
                                </p>
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
                                        height: cloudItem.height + 'px'
                                    }"
                                    alt
                                />
                            </div>
                            <!-- 固定签署位置 -->
                            <div
                                class="sign-setpos"
                                v-for="(item, index) in setPosArr"
                                :key="index + item.id"
                                :data-id="item.devId"
                                v-show="
                                    item.pageNo === pageNumber &&
                                        item.fileCode === fileCode
                                "
                                :style="{
                                    left: item.posX + 'px',
                                    top: item.posY + 'px'
                                }"
                            >
                                <div
                                    class="title-wrap"
                                    :style="{
                                        width: signWidth + 20 + 'px'
                                    }"
                                >
                                    <div class="title-wrap-inner">
                                        <p class="hover-title">
                                            {{ item.name }}
                                        </p>
                                        <p class="title">{{ item.name }}</p>
                                    </div>
                                    <i
                                        class="el-icon-close"
                                        data-icon="closeicon"
                                        @click.stop="removePosSign(item)"
                                    ></i>
                                </div>
                                <div class="sign-pos-wrap">
                                    <div
                                        class="sign-pos"
                                        :style="{
                                            width: signWidth + 'px',
                                            height: signHeight + 'px'
                                        }"
                                    >
                                        印章位置
                                    </div>
                                </div>
                            </div>
                            <img
                                class="file center-file"
                                ref="fileItemImg"
                                :src="fileImg"
                                alt
                            />
                        </div>
                    </div>
                    <!-- <div class="page-num">页码:{{ pageNumber }}/{{ totalPage }}</div> -->
                    <div class="turn-page">
                        <span
                            :class="{ disabled: redirectTopPageDis }"
                            @click="redirectTop"
                        >
                            <i class="iconfont icon-zhiding"></i>
                        </span>
                        <span
                            :class="{ disabled: prePageDis }"
                            @click="prePage"
                        >
                            <i class="iconfont icon-shangyiye"></i>
                        </span>
                        <span
                            :class="{ disabled: nextPageDis }"
                            @click="nextPage"
                        >
                            <i class="iconfont icon-xiayiye"></i>
                        </span>
                        <span
                            :class="{ disabled: redirectBottomPageDis }"
                            @click="redirectBottom"
                        >
                            <i class="iconfont icon-zhidi"></i>
                        </span>
                    </div>
                </div>

                <!-- 文件列表 -->
                <div class="file-list">
                    <el-tabs
                        v-model="contractListActiveName"
                        @tab-click="handleFileListClick"
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
                                    <!-- <img
                                        :src="`${baseUrl}/document/scan/page/${item.fileCode}/1`"
                                        alt
                                    />-->
                                    <el-image
                                        :src="
                                            `${baseUrl}/document/scan/page/${item.fileCode}/1`
                                        "
                                    >
                                        <div
                                            slot="placeholder"
                                            class="img-placeholder"
                                        >
                                            <img
                                                src="../../../../assets/image/default-bg.svg"
                                                alt
                                            />
                                        </div>
                                        <div slot="error" class="img-error">
                                            <img
                                                src="../../../../assets/image/default-bg.svg"
                                                alt
                                            />
                                        </div>
                                    </el-image>
                                </div>
                            </el-scrollbar>
                        </el-tab-pane>
                        <el-tab-pane label="附件" name="second">
                            <el-scrollbar v-if="accessoryList.length">
                                <div
                                    class="file-item"
                                    :class="{ active: index === currFile }"
                                    v-for="(item, index) in accessoryList"
                                    :key="index"
                                    @click="selectFile(item, index)"
                                >
                                    <!-- <img
                                        :src="`${baseUrl}/document/scan/page/${item.fileCode}/1`"
                                        alt
                                    />-->
                                    <el-image
                                        :src="
                                            `${baseUrl}/document/scan/page/${item.fileCode}/1`
                                        "
                                    >
                                        <div
                                            slot="placeholder"
                                            class="img-placeholder"
                                        >
                                            <img
                                                src="../../../../assets/image/default-bg.svg"
                                                alt
                                            />
                                        </div>
                                        <div slot="error" class="img-error">
                                            <img
                                                src="../../../../assets/image/default-bg.svg"
                                                alt
                                            />
                                        </div>
                                    </el-image>
                                </div>
                            </el-scrollbar>
                            <p v-else class="no-accessory">无附件</p>
                        </el-tab-pane>
                    </el-tabs>
                </div>
            </section>
        </div>

        <!-- TODO 弹窗 >>> 多签、骑缝签 -->
        <el-dialog
            :show-close="false"
            :modal-append-to-body="false"
            title="签章规则"
            class="dialog-review-file"
            :visible.sync="dialogChooseType"
        >
            <div class="choose-wrap" v-if="typeActive !== '01'">
                <el-form
                    :inline="true"
                    :model="formRule"
                    label-width="120px"
                    ref="ruleContainer"
                >
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
                        <el-form-item
                            label="签署方向"
                            v-if="typeActive === '03'"
                        >
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
                        <el-form-item
                            label-width="130"
                            label="一枚印章覆盖页数"
                            v-if="typeActive === '03'"
                        >
                            <el-input
                                v-model.number="formRule.coverPageNum"
                                placeholder="请输入页数"
                                type="number"
                            ></el-input>
                        </el-form-item>
                    </div>
                </el-form>
            </div>
            <div slot="footer" class="dialog-footer">
                <el-button @click.stop="closeSetRuleDialog">取 消</el-button>
                <el-button type="primary" @click.stop="dialogSure"
                    >确 定</el-button
                >
            </div>
        </el-dialog>

        <!-- TODO UKEY 弹窗 -->
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
                    <el-select
                        v-model="ukeyForm.ukeychoice"
                        placeholder="请选择UKEY"
                    >
                        <el-option
                            :label="item.key_name"
                            :value="index"
                            v-for="(item, index) in ukeyOptions"
                            :key="item.key_id"
                        ></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="请输入PIN码:">
                    <el-input
                        type="password"
                        v-model="ukeyForm.pinPassword"
                    ></el-input>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button
                    type="primary"
                    @click="ukeyPinConfirm"
                    :loading="ukeySiging"
                    >确 定</el-button
                >
            </div>
        </el-dialog>

        <a ref="newWindowOpen" id="download" href download="test.pdf"></a>
    </div>
</template>

<script>
import { sessionStore, getOffset, checkIntegral, mmToPx } from '@/utils';
import { checkUkeyRes } from '@/mixins/checkUkeyRes';
import { mapState } from 'vuex';
import { Promise, resolve, reject } from 'q';
import pageJumper from '@/components/jumper';
import { findIndex } from 'lodash';

export default {
    components: { pageJumper },
    mixins: [checkUkeyRes],
    data() {
        return {
            baseUrl: process.env.NODE_ENV === 'development' ? '/apis' : '/sign',
            contractListActiveName: 'first',
            signTitle: '完成签署',
            shadowSignUrl: '',
            shadowX: 0,
            shadowY: 0,
            shadowSetPosX: 0,
            shadowSetPosY: 0,
            showShadowSign: false,
            showShadowPosSign: false,
            tabActiveName: 'first',
            showPosOk: false,
            boxShadow: '',
            pageNumber: 1,
            fileImg: '',
            sign: '',
            cloudSignList: [
                // {
                //     left: 0,
                //     top: 0,
                //     picturePath:
                //         'http://sign.sys.fdfs.oa.com/group1/M00/00/03/wKgz1F0sa_OAbW4HAAPNDRpGoxM031.png',
                //     width: 100,
                //     height: 100
                // }
            ],
            signShow: false,
            posX: 1,
            posY: 1,
            signWidth: 110,
            signHeight: 110,
            fileWidth: 0,
            fileHeight: 0,
            totalPage: 0,
            standerdSignWidth: 110, // 标准章宽度
            imgList: [],
            event: false, // 避免冲入绑定
            signPosX: 0, // 验证签章位置用
            signPosY: 0,
            signSubmitPosX: 0, // 签署时提交用
            signSubmitPosY: 0,
            scale: 1, // 放大、缩小倍数
            forSignData: {}, // 签署文件数据
            filePicData: {}, // 文件图片数据
            typeActive: '01', // 01 单签、02 多签、03 骑缝签
            typeActiveForTime: 1, // 暂时放置激活值
            dialogChooseType: false,
            formRule: {
                startPageNo: 1,
                endPageNo: 1,
                signatureDirection: 1, // 0左，1右
                coverPageNum: 1 // 骑缝签时每枚章的覆盖页数
            },
            startPages: [
                // {
                //   page: 1
                // }
            ],
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
            sealList: [
                // {
                //     picturePath:
                //         'http://sign.sys.fdfs.oa.com/group1/M00/00/05/wKgz1F0tfjaAfu7JAAMyMvJKZV0269.png',
                //     pictureName: '士大夫士大夫首发式地方士大夫随风倒'
                // }
            ], // 印章列表
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
            ukeySiging: false, // ukey验证pin码loading
            loadingFinishSign: false, // 完成签署loading
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
            optionsSignPeople: [
                // {
                //     label: '张三',
                //     value: '张三'
                // },
                // {
                //     label: '王五',
                //     value: '王五'
                // }
            ],
            setPosArr: [
                // {
                //     name: '张三',
                //     id: 1,
                //     posX: 232,
                //     posY: 190
                // }
            ],
            chooseSignPeopleDis: false,
            turnPagePaganation: 0,
            redirectTopPageDis: true, // 直达顶部
            prePageDis: true,
            nextPageDis: false,
            redirectBottomPageDis: false,
            // -----------------------------------------
            contractForm: {},
            currFile: 0,
            signatoryWay: '',
            contractId: '',
            ukeySignList: [],
            tempPageNum: 1,
            ukeyWidth: '',
            ukeyHeight: ''
        };
    },
    computed: {
        fileList() {
            if (
                this.contractForm.contractFileList &&
                this.contractForm.contractFileList.length > 0
            ) {
                return this.contractForm.contractFileList.filter(
                    (v) => v.fileType === '01'
                );
            } else {
                return [];
            }
        },
        accessoryList() {
            if (
                this.contractForm.contractFileList &&
                this.contractForm.contractFileList.length > 0
            ) {
                return this.contractForm.contractFileList.filter(
                    (v) => v.fileType === '02'
                );
            } else {
                return [];
            }
        },
        ...mapState(['userInfo'])
    },
    mounted() {
        // this.fileCode = this.$route.query.fileCode;
        // this.signType = +this.$route.query.signType; // 1仅他人需要签署，2自己他人都需要
        this.enterpriseOrPersonalId = sessionStore.get('userInfo').enterpriseId; // 管理员所属单位id
        // console.log(this.enterpriseOrPersonalId);
        // -----------------------------------------------------------------
        let contractForm = sessionStore.get('contractForm');

        if (contractForm) {
            this.contractForm = contractForm;
            this.signatoryWay = contractForm.signatoryWay;
            // 01：我需要签署  02：仅需他人签署
            if (this.signatoryWay) {
                this.setOptionsSignPeople();
            }
        }

        this.contractId =
            this.$route.query.contractId || this.contractForm.contractId;
        this.startPages = this.endPages = this.totalPage = this.fileList[0].pageTotal;
        this.fileCode = this.fileList[0].fileCode;
        this.fileName = this.fileList[0].fileName;

        if (this.contractForm.compactFieldInfoReqVOList) {
            // compactFieldInfoReqVOList 签名域信息集
            this.setPosArr = this.contractForm.compactFieldInfoReqVOList.map(
                (v) => {
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
                }
            );
        }

        this.getPageSingle();
        this.getPageListSealInfo('', '01'); // 获取云签章列表
        this.getSignConfig(); // 获取签署配置
        this.addEventSignMove();
        this.mouseMoveSetPos();
        this.addEventSignPosMove();
        this.setSignTitle();
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
        /**
         * 滚动翻页
         */
        fileContainerWheel(e) {
            let _self = this;
            if (_self.debounceTimer !== null) {
                clearTimeout(this.debounceTimer);
            }
            this.debounceTimer = setTimeout(() => {
                let mouseScrollY = e.deltaY;
                if (mouseScrollY > 0) {
                    // 向下翻页
                    _self.nextPage();
                } else {
                    // 向上翻页
                    _self.prePage();
                }
            }, 500);
        },
        /**
         * 下载驱动
         */
        downloadDriver() {
            this.$downloadDriver();
        },
        /**
         * 选择文件
         * - item { object } - 某页面
         * - index { number } - 索引
         */
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
            this.getPageSingle();
        },

        /**
         * 发起合同 >>> 签署方式对应按钮
         * - 01 我需要签署 => 完成签署
         * - 02 仅他人签署 => 立即发送
         */
        setSignTitle() {
            if (this.signatoryWay === '02') {
                this.signTitle = '立即发送';
            }
            if (
                this.signatoryWay === '01' &&
                this.contractForm.signInfos.length > 1
            ) {
                this.signTitle = '签署并发起';
            }
        },

        /**
         * 切换 云印章/UKEY印章
         */
        handleTabClick(event, tab) {
            //   console.log(tab);
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

        /**
         * 获取 CA 类型
         */
        getCAtype() {
            this.$ukeyApi('getKeyCertInfo')
                .get('getNormal', {
                    keyid: 0
                })
                .then((res) => {
                    console.log(res);
                    let data = res.data;
                    let keyType;
                    if (this.successUKeyCheckCode(data)) {
                        data.info.map((item) => {
                            if (item.item_type == 7) {
                                keyType = item.item_info;
                            }
                        });
                        this.caType = keyType;
                        if (keyType === 'GDCA') {
                            this.caType === 'GDCA';
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

        /**
         * 每次调用相关前缀前需调用对应前缀的 checkList
         */
        preCheckList(preString) {
            if (preString === 'websign') {
                this.$ukeyApi('signCheckUkeyList')
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

        /**
         * 读取 ukey ，获得 ukey 签名、 ukey 印章
         * - check {string} - ? 等于 'getCaType'
         */
        readUkey(check) {
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
                this.$ukeyApi('signCheckUkeyList')
                    .get()
                    .then((res) => {
                        let data = res.data;
                        if (this.successUKeyCheckCode(data)) {
                            if (!data.keyList.length) {
                                this.ukeyOptions = [];
                                this.ukeySiging = false;
                                this.loadingFinishSign = false;
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
                                        this.loadingFinishSign = false;
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

        /**
         * 获取 ukey 信息
         * - check { string } - ?
         */
        getKeyInfo(check) {
            this.$ukeyApi('getKeyInfo')
                .get('getNormal', {
                    keyid: 0
                })
                .then((res) => {
                    let data = res.data;
                    if (this.successUKeyCheckCode(data)) {
                        let sealCode = data.sealCode;
                        let ukeySealItem = {};
                        console.log(this.ukeySeal);
                        this.ukeySeal.map((item) => {
                            if (item.pictureCode === sealCode) {
                                ukeySealItem = item;
                                ukeySealItem.picturePath =
                                    'data:image/png;base64,' + data.image;
                                // 由于雾化脱密效果边缘还差一点点，宽高加6 优化
                                this.ukeyWidth =
                                    (data.sealWidth * 595) / 210 + 6 || 145;
                                this.ukeyHeight =
                                    (data.sealHeight * 595) / 210 + 6 || 145;
                                // this.ukeyWidth = mmToPx(data.sealWidth);
                                // this.ukeyHeight = mmToPx(data.sealHeight);
                            }
                        });
                        if (!Object.keys(ukeySealItem).length) {
                            this.$message.warning(
                                ' 当前账户无此UKey印章，请重新核对印章信息'
                            );
                            this.readUkeyLoading = false;
                            this.ukeySiging = false;
                            this.loadingFinishSign = false;
                            this.ukeySealItem = [];
                            return;
                        } else {
                            if (check === 'check') {
                                // if (this.caType === 'GDCA') {
                                //     this.ukeySignFn();
                                // } else {
                                // 检查是否插入ukey或是否为本帐户ukey
                                this.UkeyCheck = true;
                                this.loadingFinishSign = false;
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
            this.ukeySiging = true;
            if (this.ukeyDialogTitle === 'UKEY读取校验') {
                this.readUkey('ukeyReadCheck');
            } else {
                this.readUkey('ukeyPinConfirm');
            }
        },
        checkPinHttp(check) {
            this.$ukeyApi('loginKey')
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
                        this.ukeySiging = false;
                        if (check === 'ukeyReadCheck') {
                            this.getKeyInfo('ukeyReadCheck');
                            return;
                        }
                        this.ukeySignFn();
                    } else {
                        this.ukeySiging = false;
                    }
                });
        },
        // ukey签署
        async ukeySignFn() {
            let _self = this;
            // 获取签章文件的base64并格式化请求数据
            let ukeyList = await this.getSignedBase64();
            console.log(ukeyList);
            if (!ukeyList) return;
            // ukey签章
            for (let i = 0; i < ukeyList.length; i++) {
                let res = await this.$ukeyApi('signBylist').post('postQuery', {
                    keyid: 0,
                    pdfFile: ukeyList[i].base64,
                    signinfo: JSON.stringify(ukeyList[i].signInfos)
                });
                console.log(res);
                ukeyList[i].ukeySignPdfBase64 = res.data.signedFile;
            }
            console.log(ukeyList);

            ukeyList.forEach((v) => {
                v.list = v.signInfos.map((val) => {
                    let llx = val.centerX;
                    let lly = val.centerY;
                    let urx = this.ukeyWidth;
                    let ury = this.ukeyHeight;
                    if (val.signtype === 2) {
                        if (val.pagetype === 0) {
                            llx = 0;
                        } else {
                            llx = val.pdfWidth - urx / val.seamPart;
                        }
                        urx = (urx / val.seamPart) * 2;
                    }
                    return {
                        foggy: val.foggy,
                        grey: val.grey,
                        llx,
                        lly,
                        pageNum: val.pageStart || val.page,
                        pageNumEnd: val.pageEnd,
                        pdfWidth: val.pdfWidth,
                        sealCode: val.sealCode,
                        sealName: val.sealName,
                        urx,
                        ury,
                        signType: val.signtype, // 签署类型 2：骑缝
                        pageType: val.pagetype // 骑缝方向：0左  1右
                    };
                });
            });
            console.log(ukeyList);
            this.onlyOtherSign(ukeyList);
        },

        /**
         * 获取签署文件的 base64
         */
        async getSignedBase64() {
            let ukeySignList = [];
            this.ukeySignList.forEach((v) => {
                let signInfo = {
                    signmode: 0,
                    signtype: 1,
                    posx: v.posx,
                    posy: v.posy,
                    pageStart: v.startPageNo,
                    pageEnd: v.endPageNo,
                    pdfWidth: v.pdfWidth,
                    sealCode: v.pictureCode,
                    sealName: v.pictureName,
                    foggy: v.foggy,
                    grey: v.grey,
                    centerX: v.signSubmitPosX,
                    centerY: v.signSubmitPosY
                };
                // if (v.foggy && v.grey) {
                //     signInfo.signmode = 6;
                // } else if (v.foggy && !v.grey) {
                //     signInfo.signmode = 4;
                // } else if (!v.foggy && v.grey) {
                //     signInfo.signmode = 2;
                // }
                if (v.signatureMethod === '01') {
                    signInfo.pageStart = undefined;
                    signInfo.pageEnd = undefined;
                    signInfo.signtype = 0;
                    signInfo.page = v.pageNo;
                } else if (v.signatureMethod === '03') {
                    signInfo.signtype = 2;
                    signInfo.posx = undefined;
                    signInfo.posy = undefined;
                    signInfo.seamPart = v.coverPageNum;
                    signInfo.posxy = v.posy;
                    signInfo.pagetype = v.signatureDirection;
                }
                let index = findIndex(
                    ukeySignList,
                    (val) => val.fileCode === v.fileCode
                );
                if (index < 0) {
                    // 如果没有，新增
                    ukeySignList.push({
                        fileCode: v.fileCode,
                        fileName: v.originalFileName,
                        userId: this.userInfo.id,
                        signInfos: [signInfo]
                    });
                } else {
                    // 有就推入
                    ukeySignList[index].signInfos.push(signInfo);
                }
            });
            // 获取每个文件的blob转成base64
            for (let i = 0; i < ukeySignList.length; i++) {
                let res = await this.$api('getFileBinary').get('getBlob', {
                    fileCode: ukeySignList[i].fileCode
                });
                let blob = res.data || '';
                let base64 = await this.blob2base64(blob);
                ukeySignList[i].base64 = base64;
            }
            this.loadingFinishSign = false;
            console.log(ukeySignList);
            return ukeySignList;
        },

        /**
         * blob 转 base64
         */
        async blob2base64(blob = '') {
            console.log(blob);
            if (!blob) {
                return '';
            }
            let fileReader = new FileReader();
            fileReader.readAsDataURL(blob);
            let base64;
            let res = await new Promise((resolve, reject) => {
                fileReader.onload = function() {
                    // console.log(fileReader.result);
                    base64 = fileReader.result.match(/base64,(.*)/)[1];
                    resolve(base64);
                };
            });
            return base64;
        },

        setOptionsSignPeople() {
            // let _self = this;
            // let userId = sessionStore.get('userInfo').id;
            // this.optionsSignPeopleBefor = sessionStore.get('signPeople');
            // let selfIndex = findIndex(this.optionsSignPeopleBefor, (o) => {
            //     return o.userId === userId;
            // });
            // // console.log(sessionStore.get('signPeople'));
            // if (selfIndex >= 0) {
            //     this.optionsSignPeopleBefor.splice(selfIndex, 1);
            // }
            // let item = {};
            // this.optionsSignPeopleBefor.forEach((element) => {
            //     if (element.signType === '01') {
            //         item = {
            //             label: element.userName,
            //             value: element.userId
            //         };
            //         _self.optionsSignPeople.push(item);
            //     }
            // });
            this.optionsSignPeople = [].concat(this.contractForm.signInfos);
            this.optionsSignPeople.shift();
        },

        chooseSignPeople(userId) {
            let index = findIndex(this.optionsSignPeople, (o) => {
                return o.signatoryId === userId;
            });
            this.posSignPeople = this.optionsSignPeople[index].signName;
            this.posSignPeopleId = userId;
        },

        /**
         * 拖动指定印章位置
         */
        addEventSignPosMove() {
            let _self = this;
            let containerDom = document.querySelector('.container-sign');
            let fileWrapDom = document.querySelector('.files');
            let fileDom = document.querySelector('.center-file');
            $('.container-sign').on('mousedown', '.pos-sign', function(e) {
                // 点击时将影子章定位到点击出
                if (!_self.posSignPeopleId) return;
                _self.showShadowPosSign = true;
                let pageStartX = e.pageX;
                let pageStartY = e.pageY;
                let target = $(e.currentTarget);
                // console.log(target.width(), target.height());
                let targetWidth = target.outerWidth();
                let targetHeight = target.outerHeight();
                let contDocumentPosObj = getOffset(containerDom);
                let sealItemDocumentPosObj = getOffset(e.currentTarget);
                let fileDocumentPosObj = getOffset(fileWrapDom);
                let signPosShadow = $('.shadow-sign-setpos');
                let signPosShadow_width = signPosShadow.width();
                let signPosShadow_height = signPosShadow.height();
                let sealToContX =
                    sealItemDocumentPosObj.left - contDocumentPosObj.left;
                let sealToContY =
                    sealItemDocumentPosObj.top - contDocumentPosObj.top;
                // 计算初始位置
                _self.shadowSetPosX =
                    pageStartX -
                    contDocumentPosObj.left -
                    signPosShadow_width / 2;
                _self.shadowSetPosY =
                    pageStartY -
                    contDocumentPosObj.top -
                    signPosShadow_height / 2;

                let left, top;

                e.preventDefault();

                $(document).mouseup(function(e) {
                    if (pageStartX === e.pageX) {
                        _self.showShadowPosSign = false;
                        return;
                    }
                });
                // console.log(999);
                $(document).bind('mousemove', function(e) {
                    let diffX =
                        e.pageX -
                        contDocumentPosObj.left -
                        signPosShadow_width / 2;
                    let diffY =
                        e.pageY -
                        contDocumentPosObj.top -
                        signPosShadow_height / 2;
                    // 右边界
                    let diffXmax =
                        fileDocumentPosObj.left -
                        contDocumentPosObj.left +
                        (fileWrapDom.clientWidth - fileDom.clientWidth) / 2 +
                        fileDom.clientWidth -
                        signPosShadow_width;
                    // 下边界
                    let diffYmax =
                        containerDom.clientHeight - signPosShadow_height;
                    if (diffX <= 0) {
                        diffX = 0;
                    }
                    if (diffX >= diffXmax) {
                        diffX = diffXmax;
                    }
                    if (diffY <= 10) {
                        diffY = 10;
                    }
                    if (diffY >= diffYmax) {
                        diffY = diffYmax;
                    }
                    _self.shadowSetPosX = diffX;
                    _self.shadowSetPosY = diffY;
                    // 页面印章位置
                    let addSignPosX =
                        diffX -
                        (fileDocumentPosObj.left - contDocumentPosObj.left);
                    let diffFileWrapFile =
                        (fileWrapDom.clientWidth - fileDom.clientWidth) / 2;
                    if (addSignPosX < diffFileWrapFile) {
                        addSignPosX = diffFileWrapFile;
                    }
                    let addSignPosY = diffY - 10;
                    $(document).mouseup(function(e) {
                        $(this).unbind('mousemove');
                        $(this).unbind('mouseup');
                        if (_self.debounceTimer !== null) {
                            clearTimeout(_self.debounceTimer);
                        }
                        _self.debounceTimer = setTimeout(() => {
                            _self.showShadowPosSign = false;
                            _self.addPosSignWrap(addSignPosX, addSignPosY);
                        }, 50);
                    });
                });
            });
        },

        /**
         * 添加指定签章位置
         * - addSignPosX { number } - 横坐标
         * - addSignPosY { number } - 纵坐标
         */
        addPosSignWrap(addSignPosX, addSignPosY) {
            // console.log(addSignPosX, addSignPosY);
            this.setPosArr.push({
                fileCode: this.fileCode,
                name: this.posSignPeople,
                id: this.posSignPeopleId,
                devId: Date.now(),
                signType: '01', // 位置类型(01:印章；02:签名；03:日期) ,
                posX: addSignPosX,
                posY: addSignPosY,
                pageNo: this.pageNumber
            });
        },
        removePosSign({ devId }) {
            let idx = findIndex(this.setPosArr, (o) => {
                return o.devId === devId;
            });
            this.setPosArr.splice(idx, 1);
        },
        /**
         * 拖动印章到文件上的过程
         */
        addEventSignMove() {
            let _self = this;
            let containerDom = document.querySelector('.container-sign');
            let fileWrapDom = document.querySelector('.files');
            let fileDom = document.querySelector('.center-file');
            $('.container-sign').on('mousedown', '.seal-list-item', function(
                e
            ) {
                // 点击时将影子章定位到点击出
                _self.showShadowSign = true;

                let pageStartX = e.pageX;
                let pageStartY = e.pageY;
                let target = $(e.currentTarget);
                // console.log(target.width(), target.height());
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
                    sealToContX - (_self.signWidth - targetWidth) / 2;
                _self.shadowY =
                    sealToContY - (_self.signWidth - targetHeight) / 2;
                // console.log(fileDocumentPosObj, contDocumentPosObj);
                _self.shadowSignUrl = picturePath;

                let left, top;

                e.preventDefault();

                $(document).mouseup(function(e) {
                    if (pageStartX === e.pageX) {
                        _self.showShadowSign = false;
                        return;
                    }
                });
                // console.log(999);
                $(document).bind('mousemove', function(e) {
                    let diffX =
                        e.pageX - contDocumentPosObj.left - _self.signWidth / 2;
                    let diffY =
                        e.pageY - contDocumentPosObj.top - _self.signHeight / 2;
                    // 右边界
                    let diffXmax =
                        fileDocumentPosObj.left -
                        contDocumentPosObj.left +
                        (fileWrapDom.clientWidth - fileDom.clientWidth) / 2 +
                        fileDom.clientWidth -
                        _self.signWidth;
                    // 下边界
                    let diffYmax =
                        containerDom.clientHeight - _self.signHeight - 10;
                    if (diffX <= 0) {
                        diffX = 0;
                    }
                    if (diffX >= diffXmax) {
                        diffX = diffXmax;
                    }
                    if (diffY <= 0) {
                        diffY = 0;
                    }
                    if (diffY >= diffYmax) {
                        diffY = diffYmax;
                    }
                    _self.shadowX = diffX;
                    _self.shadowY = diffY;
                    // 页面印章位置
                    let addSignPosX =
                        diffX -
                        (fileDocumentPosObj.left - contDocumentPosObj.left);
                    let diffFileWrapFile =
                        (fileWrapDom.clientWidth - fileDom.clientWidth) / 2;
                    if (addSignPosX < diffFileWrapFile) {
                        addSignPosX = diffFileWrapFile;
                    }
                    let addSignPosY = diffY - 10;

                    $(document).mouseup(function(e) {
                        $(this).unbind('mousemove');
                        $(this).unbind('mouseup');
                        if (_self.debounceTimer !== null) {
                            clearTimeout(_self.debounceTimer);
                        }
                        _self.debounceTimer = setTimeout(() => {
                            _self.showShadowSign = false;
                            let isUkey = _self.tabActiveName === 'second';
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

        /**
         * 添加云印章
         * - pictureCode - ？
         * - addSignPosX { number } - 横坐标
         * - addSignPosY { number } - 纵坐标
         * - isUkey { boolean } - 是否 ukey 印章，默认 false
         */
        addCloudSign(pictureCode, addSignPosX, addSignPosY, isUkey = false) {
            let diffWidthInner =
                ($('.img-wrap').outerWidth() - $('.file').outerWidth()) / 2;
            let fileHInner = $('.file').outerHeight();
            // 判断是否是ukey印章
            let list = isUkey ? this.ukeySeal : this.sealList;
            let sealItemIndex = findIndex(list, (o) => {
                return o.pictureCode === pictureCode;
            });
            let width = isUkey ? this.ukeyWidth * this.scale : this.signWidth;
            let height = isUkey
                ? this.ukeyHeight * this.scale
                : this.signHeight;
            let cloudSignItem = list[sealItemIndex];
            let venderCloudItem = Object.assign({}, cloudSignItem, {
                isUkey,
                left: addSignPosX,
                top: addSignPosY,
                width,
                height,
                pageNo: this.pageNumber,
                devPictureId: Date.now(),
                signSubmitPosX:
                    (addSignPosX - diffWidthInner + width / 2) / this.scale,
                signSubmitPosY:
                    (fileHInner - addSignPosY - height / 2) / this.scale,
                dragging: false,
                fileCode: this.fileCode,
                originalFileName: this.fileName,
                signatureMethod: this.typeActive,
                pdfWidth: this.fileWidth
            });
            let fileDom = $('.file');
            let fileWInner = fileDom.outerWidth();
            venderCloudItem.posx =
                (venderCloudItem.left - diffWidthInner + width / 2) /
                fileWInner;
            venderCloudItem.posy =
                1 -
                (fileHInner - venderCloudItem.top - height / 2) / fileHInner;
            // venderCloudItem.posx = venderCloudItem.signSubmitPosX / fileWInner;
            // venderCloudItem.posy = venderCloudItem.signSubmitPosY / fileHInner;
            if (this.typeActive === '01') {
                this.foggyCheck && (venderCloudItem.foggy = true);
                this.greyCheck && (venderCloudItem.grey = true);
            }
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
        },

        /**
         * 预盖章校验
         * - venderCloudItem - ?
         * - pictureCode - ?
         */
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

        /**
         * 删除云印章
         */
        removeSignAreadyOnFile({ devPictureId }) {
            let signOnFileIndex = findIndex(this.cloudSignList, (o) => {
                return o.devPictureId === devPictureId;
            });
            this.cloudSignList.splice(signOnFileIndex, 1);
        },
        currentChange() {
            this.getPageListSealInfo('', '01');
        },

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
        /**
         * 获取印章列表
         * - pageSeal {string}
         * - mediumType {string} - 01 云印章列表、02 ukey 印章
         */
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
                        userId: this.userInfo.id
                        // enterpriseOrPersonalId: '591635506115117056',
                    })
                    .then((res) => {
                        if (!res) return;
                        let data = res.data.data;
                        let ukeySeals = data.records;
                        this.ukeySeal = ukeySeals;
                        console.log(this.ukeySeal);
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

        /**
         * 获取文件单页数
         */
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
                            this.setStyle(url);
                        });
                });
        },

        /**
         * 选择签章类型
         * @typeNum { string } - 01 单签、02 多签、03 骑缝签
         */
        chooseSignType(typeNum) {
            // console.log(typeNum, this.typeActiveForTime);
            // 只给别人设置签署位置
            if (this.signatoryWay === '02' && typeNum !== '01') {
                this.$message.warning('指定位置签章不支持多页或骑缝签署！'); // TODO 待改进，此时应直接置灰其他签章类型
                this.chooseSignPeopleDis = true;
                this.posSignPeople = '';
                this.posSignPeopleId = '';
            } else if (this.signatoryWay === '01' && typeNum !== '01') {
                this.chooseSignPeopleDis = true;
                this.posSignPeople = '';
                this.posSignPeopleId = '';
            } else if (typeNum === '01') {
                this.chooseSignPeopleDis = false;
            }
            this.typeActive = typeNum;
            // this.cloudSignList = []; // 只支持单类型签署
        },

        closeSetRuleDialog() {
            // console.log(this.formRule);
            let signOnFileIndex = findIndex(this.cloudSignList, (o) => {
                return o.devPictureId === this.draggingSignId;
            });
            this.cloudSignList.splice(signOnFileIndex, 1);
            this.dialogChooseType = false;
            this.formRule = {
                startPageNo: 1,
                endPageNo: 1,
                signatureDirection: 1, // 0左，1右
                coverPageNum: 1 // 骑缝签时每枚章的覆盖页数
            };
        },

        dialogSure() {
            // console.log(this.formRule, this.typeActive);
            if (
                (this.typeActive === '02' || this.typeActive === '03') &&
                this.formRule.startPageNo >= this.formRule.endPageNo
            ) {
                this.$message.warning({
                    message: '结束页不能小于或等于起始页！',
                    customClass: 'zZindex'
                });
                return;
            }

            if (
                this.typeActive === '03' &&
                (!checkIntegral(this.formRule.coverPageNum) ||
                    this.formRule.coverPageNum >
                        this.formRule.endPageNo - this.formRule.startPageNo + 1)
            ) {
                return this.$message.warning({
                    message: '覆盖页数需为正整数且不超过骑缝总页数！',
                    customClass: 'zZindex'
                });
            }

            let signOnFileIndex = findIndex(this.cloudSignList, (o) => {
                return o.devPictureId === this.draggingSignId;
            });

            if (this.typeActive !== '01') {
                if (this.typeActive === '02') {
                    this.cloudSignList[
                        signOnFileIndex
                    ].startPageNo = this.formRule.startPageNo;
                    this.cloudSignList[
                        signOnFileIndex
                    ].endPageNo = this.formRule.endPageNo;
                }

                if (this.typeActive === '03') {
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
                }
            }

            this.foggyCheck &&
                (this.cloudSignList[signOnFileIndex].foggy = true);
            this.greyCheck && (this.cloudSignList[signOnFileIndex].grey = true);
            this.formRule = {
                startPageNo: 1,
                endPageNo: 1,
                signatureDirection: 1, // 0左，1右
                coverPageNum: 1 // 骑缝签时每枚章的覆盖页数
            };
            this.dialogChooseType = false;
        },

        // 暂没有被调用
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

        /**
         * 选择印章
         * - item { object } - ukeySealItem 中的项
         * - ukey { string } - ?
         */
        chooseSign({ pictureCode, picturePath }, ukey) {
            if (!this.imgList.length) return;
            if (ukey) {
                // ukey印章
                this.ukeySign = true;
            } else {
                this.ukeySign = false;
            }
            if (this.typeActive === '03') {
                this.showPosOk = false;
            } else {
                this.showPosOk = true;
            }
            this.signShow = true;
            // console.log(picturePath);
            this.sign = picturePath;
            this.pictureCode = pictureCode;
            this.mouseMove();
            this.setFirstPos(picturePath, ukey);
        },

        /**
         * 不拖动时设置位置
         * - picturePath { string } - 章模路径
         * - ukey { string } - ?
         */
        setFirstPos(picturePath, ukey) {
            let signDom = $('.sign-wrap');
            let fileHInner = $('.file').outerHeight();
            let _self = this;
            let Img = new Image();
            Img.src = picturePath;
            Img.onload = function() {
                if (ukey) {
                    _self.ukeySignData[0].signCenterPosXRatio =
                        _self.standerdSignWidth / 2 / _self.fileWidth;
                    _self.ukeySignData[0].signCenterPosYRatio =
                        (signDom.position().top + signDom.height() / 2) /
                        fileHInner;
                    // console.log(_self.ukeySignData);
                    // 印章中心坐标
                    _self.ukeySignData[0].llx = _self.standerdSignWidth / 2;
                    _self.ukeySignData[0].lly =
                        (fileHInner -
                            signDom.position().top -
                            signDom.height() / 2) /
                        _self.scale;
                }

                _self.signSubmitPosX = _self.standerdSignWidth / 2;
                _self.signSubmitPosY =
                    (fileHInner -
                        signDom.position().top -
                        signDom.height() / 2) /
                    _self.scale;
            };
        },

        // 暂时未被调用
        reviewFileImg(index, url) {
            this.pageNumber = index;
            this.fileImg = url;
        },

        setStyle(fileUrl) {
            this.$nextTick(() => {
                let wrapDom = this.$refs.fileItemWrap;
                let width = wrapDom.clientWidth;
                let height = wrapDom.clientHeight;
                let colWrap = height / width;
                let colImg = this.fileHeight / this.fileWidth;
                console.log('colWrap:' + colWrap);
                console.log('fileHeight:' + this.fileHeight);
                console.log('fileWidth:' + this.fileWidth);
                if (colImg > colWrap) {
                    $('.file').css('height', '100%');
                    $('.file').css('width', 'auto');
                    $('.file-wrap').css('height', '100%');
                    // $('.file-wrap').css('width', 'auto');
                } else {
                    $('.file').css('width', '100%');
                    $('.file').css('height', 'auto');
                    $('.file-wrap').css('width', '100%');
                    // $('.file-wrap').css('height', 'auto');
                }
                this.signToFile(fileUrl);
            });
        },

        signToFile(fileUrl) {
            let that = this;
            let img = new Image();
            img.src = fileUrl;
            // console.log(fileUrl);
            img.onload = function() {
                let fileImgRealWidth = $('.file').width();
                // 设置翻页器位置
                // that.turnPagePaganation =
                //     ($('.files').width() - fileImgRealWidth) / 2 - 70;
                that.scale = fileImgRealWidth / that.fileWidth;
                let wh = that.standerdSignWidth * that.scale;
                that.signWidth = wh;
                that.signHeight = wh;
                // console.log(wh);
                that.mouseMove();
            };
        },

        /**
         * 固定签章
         */
        mouseMoveSetPos() {
            let _self = this;
            let imgWrapDom = $('.img-wrap');
            let fileDom = $('.file');
            let difWidth = (imgWrapDom.outerWidth() - fileDom.outerWidth()) / 2;
            let difHeight = imgWrapDom.outerHeight() - fileDom.outerHeight();
            let fileH = fileDom.outerHeight();
            imgWrapDom.on('mousedown', '.sign-setpos', function(e) {
                let target = $(e.currentTarget);
                let moveId = +target[0].dataset.id;
                // console.log(moveId);
                let offsetX = e.pageX - target.offset().left;
                let offsetY = e.pageY - target.offset().top;
                // 如果点击的是关闭按钮
                let clickIcon = e.target.dataset.icon;
                if (clickIcon) {
                    return;
                }
                let left, top;

                e.preventDefault();

                $(document).bind('mousemove', function(e) {
                    let diffWidthInner =
                        (imgWrapDom.outerWidth() - fileDom.outerWidth()) / 2;
                    let diffHeightInner =
                        imgWrapDom.outerHeight() - fileDom.outerHeight();
                    let fileHInner = fileDom.outerHeight();
                    left = e.pageX - imgWrapDom.offset().left - offsetX;
                    top = e.pageY - imgWrapDom.offset().top - offsetY;
                    // console.log(e.pageX);
                    left =
                        left < diffWidthInner
                            ? diffWidthInner
                            : left >
                              imgWrapDom.width() -
                                  target.width() -
                                  diffWidthInner
                            ? imgWrapDom.width() -
                              target.width() -
                              diffWidthInner
                            : left;
                    top =
                        top < 0
                            ? 0
                            : top >
                              imgWrapDom.height() -
                                  target.outerHeight() -
                                  diffHeightInner
                            ? imgWrapDom.height() -
                              target.outerHeight() -
                              diffHeightInner
                            : top;
                    let moveIndex = findIndex(_self.setPosArr, (item) => {
                        return item.devId === moveId;
                    });
                    _self.setPosArr[moveIndex].posX = left;
                    _self.setPosArr[moveIndex].posY = top;
                    // console.log('top:' + top);
                    // console.log('left:' + left);
                    $(document).mouseup(function() {
                        $(this).unbind('mousemove');
                        $(this).unbind('mouseup');
                    });
                });
            });
        },

        /**
         * 印章在文件上拖动
         */
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
                // console.log(dragDevpictureid,dragCloudItemIndex, _self.cloudSignList);
                // 防止点击拖动印章
                imgWrapDom.mouseup(function(e) {
                    let newTarget = $(e.currentTarget);
                    if (
                        offsetX === e.pageX - target.offset().left &&
                        offsetY === e.pageY - target.offset().top
                    ) {
                        $(document).unbind('mousemove');
                        imgWrapDom.unbind('mouseup');
                        return;
                    }
                });
                e.preventDefault();
                $(document).bind('mousemove', function(e) {
                    let target1 = e.target;
                    let dataset = $(target1)[0].dataset;
                    // console.log($(target1)[0].dataset);
                    let diffWidthInner =
                        (imgWrapDom.outerWidth() - fileDom.outerWidth()) / 2;
                    let diffHeightInner =
                        imgWrapDom.outerHeight() - fileDom.outerHeight();
                    let fileHInner = fileDom.outerHeight();
                    let fileWInner = fileDom.outerWidth();
                    left = e.pageX - imgWrapDom.offset().left - offsetX;
                    top = e.pageY - imgWrapDom.offset().top - offsetY;
                    left =
                        left < diffWidthInner
                            ? diffWidthInner
                            : left >
                              imgWrapDom.width() -
                                  target.width() -
                                  diffWidthInner
                            ? imgWrapDom.width() -
                              target.width() -
                              diffWidthInner
                            : left;
                    top =
                        top < 0
                            ? 0
                            : top >
                              imgWrapDom.height() -
                                  target.outerHeight() -
                                  diffHeightInner
                            ? imgWrapDom.height() -
                              target.outerHeight() -
                              diffHeightInner
                            : top;
                    _self.cloudSignList[dragCloudItemIndex].left = left;
                    _self.cloudSignList[dragCloudItemIndex].top = top;
                    _self.cloudSignList[dragCloudItemIndex].dragging = true;
                    // ukey签署用坐标 比例
                    _self.cloudSignList[dragCloudItemIndex].posx =
                        (left - diffWidthInner + target.width() / 2) /
                        fileWInner;
                    _self.cloudSignList[dragCloudItemIndex].posy =
                        1 -
                        (fileHInner - top - target.outerHeight() / 2) /
                            fileHInner;
                    // 印章中心坐标
                    _self.ukeySignData[0].llx =
                        (left - diffWidthInner + target.width() / 2) /
                        _self.scale;
                    _self.ukeySignData[0].lly =
                        (fileHInner - top - target.outerHeight() / 2) /
                        _self.scale;
                    // 云签署用坐标
                    _self.cloudSignList[dragCloudItemIndex].signSubmitPosX =
                        (left - diffWidthInner + target.width() / 2) /
                        _self.scale;
                    _self.cloudSignList[dragCloudItemIndex].signSubmitPosY =
                        (fileHInner - top - target.outerHeight() / 2) /
                        _self.scale;
                    // console.log(that.ukeySignData);
                    $(document).mouseup(function() {
                        $(this).unbind('mousemove');
                        $(this).unbind('mouseup');
                        if (_self.debounceTimer !== null) {
                            clearTimeout(_self.debounceTimer);
                        }
                        _self.debounceTimer = setTimeout(() => {
                            if (!_self.cloudSignList.length) return;
                            _self.cloudSignList[
                                dragCloudItemIndex
                            ].dragging = false;
                            // 单页签预盖章
                            if (
                                _self.cloudSignList[dragCloudItemIndex]
                                    .signatureMethod === '01' &&
                                _self.signSetData.preSign === 1
                            ) {
                                _self.preSignCheck(
                                    _self.cloudSignList[dragCloudItemIndex],
                                    _self.cloudSignList[dragCloudItemIndex]
                                        .devPictureId
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
            let sealWidth = venderCloudItem.isUkey
                ? this.ukeyWidth
                : this.standerdSignWidth;
            let sealHeight = venderCloudItem.isUkey
                ? this.ukeyHeight
                : this.standerdSignWidth;
            info.xcoordinate = venderCloudItem.signSubmitPosX - sealWidth / 2;
            info.ycoordinate = venderCloudItem.signSubmitPosY - sealHeight / 2;
            info.wcoordinate = sealWidth;
            info.hcoordinate = sealHeight;
            info.fileCode = this.fileCode;
            info.page = this.pageNumber;
            return this.$api('judgePosition').post('postNormal', info);
        },

        // 删除文件上印章（暂未被调用）
        removeSignPos() {
            this.showPosOk = false;
            this.signShow = false;
            this.ukeySign = false;
            this.sign = '';
        },

        // 拒签
        refuseSign() {},

        // TODO 完成签署BTN
        /**
         * 完成签署
         */
        submitSign() {
            // 所有章模统一添加雾化脱密标识
            this.cloudSignList.forEach((v) => {
                v.foggy = this.foggyCheck;
                v.grey = this.greyCheck;
            });
            // 仅他人签署
            if (this.signatoryWay === '02') {
                this.onlyOtherSign();
                return;
            }
            // 合同上是否有章模
            if (!this.cloudSignList.length) {
                return this.$message.warning('请拖拽添加印章到文件上！');
            } else {
                // 判断是否每份文件上都有章模
                let signFileList = this.cloudSignList.map((v) => v.fileCode);
                signFileList = [...new Set(signFileList)];
                if (signFileList.length < this.fileList.length)
                    return this.$message.warning(
                        '请您为其他文件选择印章/签名进行签署！'
                    );
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

            this.ukeySignList = this.cloudSignList.filter((v) => v.isUkey);

            // 如果有ukey签章，先调ukey签章接口
            if (this.ukeySignList.length) {
                this.loadingFinishSign = true;
                this.readUkey('check');
            } else {
                // 若没有ukey，直接调云签章
                this.onlyOtherSign();
            }
        },

        /**
         * 给别人设置签署位置，
         */
        async onlyOtherSign(ukeySignList = []) {
            let _self = this;
            let compactFieldInfoReqVOList = []; // 签名域信息集

            // 格式化签名域信息集
            if (this.setPosArr.length) {
                compactFieldInfoReqVOList = this.setPosArr.map((v) => {
                    v.id = v.id.length === 13 ? '' : v.id;
                    return {
                        compactFileCode: v.fileCode,
                        signName: v.name,
                        signType: v.signType,
                        signatoryId: v.id,
                        signatureCoordinateX: v.posX,
                        signatureCoordinateY: v.posY,
                        signatureMethod: '01',
                        signatureStartPage: v.pageNo,
                        signatureEndPage: v.pageNo
                    };
                });
            }

            // 签章信息
            let fileManageSignReqVOS;
            if (this.signatoryWay === '01') {
                // 取云签章信息
                let cloudSignList = this.cloudSignList.filter((v) => !v.isUkey);
                fileManageSignReqVOS = cloudSignList.map((v) => {
                    if (v.signatureDirection === 0) {
                        v.signSubmitPosX = 0;
                    }
                    return {
                        compactFileCode: v.fileCode, // 合同文件编码 ,
                        compactId: this.contractId || '', // 文件ID ,
                        pageSize: v.coverPageNum, // 骑缝签时每枚章的覆盖页数 ,
                        foggy: v.foggy, // 是否雾化 ,
                        grey: v.grey, // 是否脱密 ,
                        originalFileName: v.originalFileName, // 原文件名称 ,
                        sealCode: v.pictureCode, // 章模编码 ,
                        signName: this.userInfo.userNickName, // 签署人名称 ,
                        signType: '01', // 位置类型(01:印章；02:签名；03:日期) ,
                        signatoryId: this.userInfo.id, // 签署人Id ,
                        signatureCoordinateX: v.signSubmitPosX, // 签署坐标X轴 ,
                        signatureCoordinateY: v.signSubmitPosY, // 签署坐标Y轴 ,
                        signatureEndPage: v.endPageNo, // 签署结束页数 ,
                        signatureMethod: v.signatureMethod, // 签章方式(01：单页签章；02：多页签章；03：骑缝签章；04:连页签章) ,
                        signatureStartPage: v.startPageNo || v.pageNo // 签署开始页数
                    };
                });
            }
            // console.log(fileManageSignReqVOS)

            // TODO 完成签署BTN >>> 异步请求
            let sendData = Object.assign(
                {
                    compactTheme: '', // 主题,
                    contractFileList: '', // 合同文件列表,
                    remark: '', // 备注
                    // signContact: '', // 签署人的联系方式联系方式(自签)
                    signDeadline: '', // 签署截止日期
                    signInfos: '', // 签署信息---签署人列表
                    // signName: '', // 签署人(自签)
                    signWay: '', // 签署方式（01：无序签；02：顺序签署；03：每人单独签署；）
                    signatoryWay: '', // 签署对象（01：我需要签署；02：仅需他人签署；）
                    validityEndDate: '' // 合同有效期
                },
                this.contractForm,
                {
                    compactFieldInfoReqVOList, // 签名域信息集
                    fileManageSignReqVOS, // 签章信息
                    contractId: this.contractId || '',
                    isSiteSign:
                        compactFieldInfoReqVOList.length > 0 ? '1' : '0', // 是否指定签署位置（0：未指定签署位置；1：指定签署位置；）
                    orgId: this.userInfo.enterpriseId, // 所属组织Id ,
                    type: '02' //  类型（01:文件管理，02:合同）
                }
            );

            // 如果存在ukey印章，
            if (this.signatoryWay === '01' && ukeySignList.length > 0) {
                sendData.ukeySignReqVOS = ukeySignList;
            }

            // 发起人是否需要签署
            let url =
                this.signatoryWay === '01'
                    ? 'initiateSignContract'
                    : 'initiateContract';
            console.log(sendData);
            let res = await this.$api(url).post('postNormal', sendData);
            console.log(res);
            if (!res) return;
            this.$message.success('发起合同成功！');
            this.$router.push('/contractMgt/index');
        },
        /**
         * 存草稿
         */
        async draftContract() {
            let compactFieldInfoReqVOList = this.setPosArr.map((v) => {
                v.id = v.id.length === 13 ? '' : v.id;
                return {
                    compactFileCode: v.fileCode,
                    signName: v.name,
                    signType: v.signType,
                    signatoryId: v.id,
                    signatureCoordinateX: v.posX,
                    signatureCoordinateY: v.posY,
                    signatureMethod: '01',
                    signatureStartPage: v.pageNo,
                    signatureEndPage: v.pageNo
                };
            });
            let sendData = Object.assign(
                {
                    compactTheme: '', // 主题,
                    contractFileList: '', // 合同文件列表,
                    remark: '', // 备注
                    // signContact: '', // 签署人的联系方式联系方式(自签)
                    signDeadline: '', // 签署截止日期
                    signInfos: '', // 签署信息---签署人列表
                    // signName: '', // 签署人(自签)
                    signWay: '', // 签署方式（01：无序签；02：顺序签署；03：每人单独签署；）
                    signatoryWay: '', // 签署对象（01：我需要签署；02：仅需他人签署；）
                    validityEndDate: '' // 合同有效期
                },
                this.contractForm,
                {
                    compactFieldInfoReqVOList, // 签名域信息集
                    isSiteSign: '0', // 是否指定签署位置（0：未指定签署位置；1：指定签署位置；）
                    orgId: this.userInfo.enterpriseId, // 所属组织Id ,
                    type: '02' //  类型（01:文件管理，02:合同）
                }
            );
            console.log(sendData);
            let res = await this.$api('draftContract').post(
                'postNormal',
                sendData
            );
            if (!res) return;
            this.$router.push('/contractMgt/index');
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
        }
    }
};
</script>
<style lang="scss" scoped>
.new-contract-step3 {
    position: absolute;
    left: 0;
    right: 0;
    top: 0;
    bottom: 0;
    background: #f4f6f8;
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
            max-width: 600px;
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
        .shadow-sign-setpos {
            position: absolute;
            z-index: 10000;
            .title-wrap {
                background: #daa520;
                color: #fff;
                border-radius: 4px 4px 0 0;
                height: 30px;
                line-height: 30px;
                padding: 0 10px;
                width: 100%;
                display: flex;
                align-items: center;
                cursor: pointer;
                position: relative;
                .title-wrap-inner {
                    height: 30px;
                    width: 90%;
                    .title {
                        overflow: hidden;
                        text-overflow: ellipsis;
                        white-space: nowrap;
                        text-align: center;
                    }
                    .hover-title {
                        position: absolute;
                        top: 0px;
                        left: 110%;
                        height: 30px;
                        line-height: 30px;
                        white-space: nowrap;
                        background: #626262;
                        padding: 0 10px;
                        border-radius: 4px;
                        visibility: hidden;
                    }
                }
            }
            .sign-pos-wrap {
                cursor: move;
                padding: 5px;
                border: dashed 1px #e2e2e2;
                border-radius: 0 0 4px 4px;
                border-top: none;
                display: flex;
                justify-content: center;
                .sign-pos {
                    position: relative;
                    border-radius: 50%;
                    border: dashed 1px #02adff;
                    color: #02adff;
                    display: flex;
                    justify-content: center;
                    align-items: center;
                }
            }
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
                        border: solid 1px rgb(243, 242, 242);
                        &:hover {
                            border: solid 1px #c4cfdc;
                        }
                        &:active {
                            border: solid 1px #2a68c8;
                        }
                        img {
                            width: 100%;
                            height: 100%;
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
                .dowload-ukey {
                    width: 100%;
                    border: solid 1px #f4f6f8;
                    background: #f4f6f8;
                    color: #99a9bf;
                    span {
                        display: flex;
                        align-items: center;
                    }
                    .icon-xiazai1 {
                        color: #99a9bf;
                        font-weight: bold;
                        margin-left: 5px;
                    }
                    &:hover {
                        color: #2a68c8;
                        border: dashed 1px #2a68c8;
                        .icon-xiazai1 {
                            color: #2a68c8;
                        }
                    }
                }
            }
            .sure-ukey {
                width: 100%;
                margin-bottom: 10px;
            }
            .set-pos {
                width: 100%;
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
                // width: 100%;
                // width: 700px;
                position: absolute;
                // left: 50%;
                left: 10px;
                right: 10px;
                top: 10px;
                bottom: 10px;
                // transform: translateX(-50%);
                overflow: hidden;
                text-align: center;

                .sign-wrap {
                    position: absolute;
                    border: solid 1px #2a68c8;
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
                    }
                    &:hover {
                        border: solid 1px #c4cfdc;
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
                .sign-setpos {
                    position: absolute;
                    z-index: 10000;
                    .title-wrap {
                        background: #daa520;
                        color: #fff;
                        border-radius: 4px 4px 0 0;
                        height: 30px;
                        line-height: 30px;
                        padding: 0 10px;
                        width: 100%;
                        display: flex;
                        align-items: center;
                        cursor: pointer;
                        position: relative;
                        .title-wrap-inner {
                            height: 30px;
                            width: 90%;
                            .title {
                                overflow: hidden;
                                text-overflow: ellipsis;
                                white-space: nowrap;
                                margin-left: -4px;
                            }
                            .hover-title {
                                position: absolute;
                                top: 0px;
                                left: 110%;
                                height: 30px;
                                line-height: 30px;
                                white-space: nowrap;
                                background: #626262;
                                padding: 0 10px;
                                border-radius: 4px;
                                visibility: hidden;
                                &::before {
                                    content: '';
                                    border-top: solid 4px transparent;
                                    border-bottom: solid 4px transparent;
                                    border-right: solid 8px #626262;
                                    position: absolute;
                                    left: -8px;
                                    top: 12px;
                                }
                            }
                            &:hover .hover-title {
                                visibility: visible;
                            }
                        }
                    }
                    .sign-pos-wrap {
                        cursor: move;
                        padding: 5px;
                        border: dashed 1px #e2e2e2;
                        border-radius: 0 0 4px 4px;
                        border-top: none;
                        display: flex;
                        justify-content: center;
                        .sign-pos {
                            position: relative;
                            border-radius: 50%;
                            border: dashed 1px #02adff;
                            color: #02adff;
                            display: flex;
                            justify-content: center;
                            align-items: center;
                        }
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
            .turn-page {
                position: absolute;
                bottom: 60px;
                // left: 50%;
                right: 15px;
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
            &.only-other {
                .el-button {
                    display: none;
                }
            }
        }
        .file-list {
            width: 206px;
            background: #fff;
            position: relative;
            overflow-x: hidden;
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
                }
            }
            .no-accessory {
                text-align: center;
                padding-top: 30px;
                font-size: 12px;
                color: #999;
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
}
.files {
    .el-scrollbar {
        width: 100%;
        position: absolute;
        left: 0;
        top: 0;
        bottom: 0;
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
.new-contract-step3 {
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
