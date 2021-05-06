<template>
    <div class="cloud-sign">
        <div class="inner">
            <header class="header">
                <div class="reback" @click="goBack">返回</div>
                <!-- TODO 跳转指定页 -->
                <div class="jumper-wrap">
                    <div class="file-name">{{ fileName }}</div>
                    <page-jumper
                        :totalPage="totalPage"
                        :tempPageNum="pageNumber"
                        @current-change="handleCurrentChange"
                    ></page-jumper>
                </div>
                <div class="sign-btn">
                    <!-- <el-button
                        size="medium"
                        class="refuse"
                        type="info"
                        @click.stop="refuseSign"
                        >拒签</el-button
                    > -->
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
                            <p class="title">
                                {{ posSignPeople }}
                            </p>
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

                <div class="sign-list">
                    <el-tabs
                        v-if="signType !== 1"
                        v-model="tabActiveName"
                        @tab-click="handleTabClick"
                    >
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
                                >
                                </el-pagination>
                            </div>
                            <p class="no-seal" v-else>暂无印章数据</p>
                        </el-tab-pane>
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
                                            class="seal-list-item"
                                            :data-picturecode="item.pictureCode"
                                            :data-picturepath="item.picturePath"
                                            data-ukey="ukey"
                                            v-for="(item,
                                            index) in ukeySealItem"
                                            :key="index"
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
                    <div class="sign-setting" v-if="signType !== 1">
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
                                        开启签章雾化后，在线预览文<br />件时章模模糊，打印时清晰
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
                                        开启章模脱密后，在线预览文件时<br />章模灰色显示，防止套取红章<br />
                                    </div>
                                    <i class="iconfont icon-guanyuwomen"></i>
                                </el-tooltip>
                            </div>
                        </div>
                    </div>
                    <div
                        v-if="signType && signType !== 3"
                        class="set-pos"
                        :class="{ 'reset-pos': signType === 2 }"
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
                                    :key="item.value"
                                    :label="item.label"
                                    :value="item.value"
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
                <section class="choose-type">
                    <el-button
                        v-if="!needToSignArr.length"
                        @click.stop="chooseSignType(1)"
                        :type="typeActive === 1 ? 'primary' : ''"
                        >单页签章</el-button
                    >
                    <!-- <el-button
                        v-if="visibleContinuous"
                        @click.stop="chooseSignType(4)"
                        :type="typeActive === 4 ? 'primary' : ''"
                        >连页签章</el-button
                    > -->
                    <el-button
                        v-if="!needToSignArr.length"
                        @click.stop="chooseSignType(2)"
                        :type="typeActive === 2 ? 'primary' : ''"
                        >多页签章</el-button
                    >
                    <el-button
                        v-if="!needToSignArr.length"
                        @click.stop="chooseSignType(3)"
                        :type="typeActive === 3 ? 'primary' : ''"
                        >骑缝签章</el-button
                    >
                </section>
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
                            <!-- 指定固定签署位置 -->
                            <div
                                class="sign-setpos"
                                v-for="(item, index) in setPosArr"
                                :key="index + item.id"
                                :data-id="item.devId"
                                v-show="item.pageNo === pageNumber"
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
                                        <p class="title">
                                            {{ item.name }}
                                        </p>
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
                            <!-- 固定签署位置 -->
                            <div
                                class="need-to-sign"
                                v-for="(item, index) in needToSignArr"
                                :key="index + item.signatoryId"
                                v-show="
                                    item.signatureStartPage === pageNumber &&
                                        fileImg
                                "
                                :style="{
                                    left: item.signatureCoordinateX + 'px',
                                    top: item.signatureCoordinateY + 'px',
                                    width: signWidth + 'px',
                                    height: signHeight + 'px'
                                }"
                            ></div>
                            <img
                                class="file center-file"
                                ref="fileItemImg"
                                :src="fileImg"
                                alt
                            />
                        </div>
                        <div
                            class="turn-page"
                            v-if="turnPagePaganation"
                            :style="{ left: turnPagePaganation + 'px' }"
                        >
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
                </div>
                <div class="file-list">
                    <div class="name">
                        签发文件
                    </div>
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
                                    item.homePageImagePath
                                "
                                alt
                            />
                        </div>
                    </el-scrollbar>
                </div>
            </section>
        </div>
        <el-dialog
            :show-close="false"
            :modal-append-to-body="false"
            :close-on-click-modal="false"
            :close-on-press-escape="false"
            title="签章规则"
            class="dialog-review-file"
            :visible.sync="dialogChooseType"
        >
            <div class="choose-wrap" v-if="typeActive !== 1">
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
                                    v-for="item in startPages"
                                    :key="item.page"
                                    :label="item.page"
                                    :value="item.page"
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
                                    v-for="item in endPages"
                                    :key="item.page"
                                    :label="item.page"
                                    :value="item.page"
                                ></el-option>
                            </el-select>
                        </el-form-item>
                        <el-form-item
                            label="签署方向"
                            v-if="typeActive === 3 || typeActive === 4"
                        >
                            <el-radio-group
                                v-model="formRule.signatureDirection"
                            >
                                <el-radio :label="1">右</el-radio>
                                <el-radio :label="0">左</el-radio>
                            </el-radio-group>
                        </el-form-item>
                        <el-form-item
                            label-width="130"
                            label="一枚印章覆盖页数"
                            v-if="typeActive === 3"
                        >
                            <el-input
                                v-model="formRule.pageSize"
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
        <!-- 签署密码输入 -->
        <el-dialog
            class="sign-pw-dialog"
            title="签署密码"
            :visible.sync="dialogInputSignPassword"
            label-width="80px"
            width="520px"
            :before-close="resetSignPw"
            :close-on-click-modal="false"
        >
            <el-form
                v-if="hadSignPaw"
                label-width="50px"
                ref="signPwForm"
                :rules="signPwRules"
                :model="signPwForm"
            >
                <el-form-item label="密码" prop="password">
                    <el-input
                        type="password"
                        placeholder="请输入签署密码"
                        v-model="signPwForm.password"
                    ></el-input>
                </el-form-item>
            </el-form>
            <div v-if="hadSignPaw" slot="footer" class="dialog-footer">
                <el-button plain @click="signPwCancel" class="cancel"
                    >取 消</el-button
                >
                <el-button type="primary" @click="signPwConfirm('signPwForm')"
                    >确 定</el-button
                >
            </div>
            <div class="no-sign-paw" v-else>
                未设置，<span @click="setSignPwNow">立即设置</span>
            </div>
        </el-dialog>
        <!-- 签署密码设置 -->
        <el-dialog
            title="设置签署密码"
            :visible.sync="setSignPasswordDialog"
            class="set-pw-box"
            :before-close="resetSetDialogData"
            width="640px"
        >
            <el-form
                class="demo-ruleForm"
                label-width="130px"
                ref="setSignPasswordForm"
                :model="setSignPasswordForm"
                :rules="setSignPasswordRules"
            >
                <el-form-item label="密码" prop="password">
                    <el-input
                        v-model.trim="setSignPasswordForm.password"
                        type="password"
                        minlength="6"
                        maxlength="20"
                        placeholder="必须包含字母和数字，长度为6-20个字符"
                    ></el-input>
                </el-form-item>
                <el-form-item label="确认密码" prop="confPassword">
                    <el-input
                        v-model.trim="setSignPasswordForm.confPassword"
                        type="password"
                        minlength="6"
                        maxlength="20"
                        placeholder="必须包含字母和数字，长度为6-20个字符"
                    ></el-input>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer dialog-footer-center">
                <el-button @click="cancelSetSignPw">取 消</el-button>
                <el-button
                    type="primary"
                    @click="confirmSetSignPw('setSignPasswordForm')"
                    >确 定</el-button
                >
            </div>
        </el-dialog>
    </div>
</template>

<script>
import {
    sessionStore,
    getOffset,
    computedSignMode,
    computedSignType,
    checkIntegral,
    checkBlobFileResponseUtils,
    mmToPx,
    isPassword
} from '@/utils';
import { checkUkeyRes } from '@/mixins/checkUkeyRes';
import pageJumper from '@/components/jumper';
import { findIndex } from 'lodash';
export default {
    components: {
        'page-jumper': pageJumper
    },
    mixins: [checkUkeyRes],
    data() {
        return {
            // sprint5
            dialogInputSignPassword: false,
            hadSignPaw: false, // 是否设置了签署密码
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
            setSignPasswordDialog: false,
            setSignPasswordForm: {
                password: '',
                confPassword: ''
            },
            setSignPasswordRules: {
                password: [
                    {
                        required: true,
                        message: '密码不能为空！',
                        trigger: 'blur'
                    },
                    {
                        validator: function(rule, value, callback) {
                            if (!value) {
                                callback(new Error('密码不能为空！'));
                            } else if (!isPassword(value, 6, 20)) {
                                callback(
                                    new Error(
                                        '请输入6-20个字母和数字组合密码！'
                                    )
                                );
                            } else {
                                callback();
                            }
                        },
                        trigger: 'blur'
                    }
                ],
                confPassword: [
                    {
                        required: true,
                        message: '确认密码不能为空！',
                        trigger: 'blur'
                    },
                    {
                        validator: function(rule, value, callback) {
                            if (!value) {
                                callback(new Error('确认密码不能为空！'));
                            } else if (!isPassword(value, 6, 20)) {
                                callback(
                                    new Error(
                                        '请输入6-20个字母和数字组合密码！'
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
            /**------------------ */
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
            signWidth: 0,
            signHeight: 0,
            ukeyWidth: 110, // ukey宽度
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
            typeActive: 1,
            typeActiveForTime: 1, // 暂时放置激活值
            dialogChooseType: false,
            formRule: {
                startPageNo: 1,
                endPageNo: 1,
                signatureDirection: 1, // 0左，1右
                pageSize: '' // 骑缝签覆盖页数
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
            ukeyDialogTitle: 'UKEY签署校验',
            caType: '', // ca类型
            debounceTimer: null,
            draggingSignId: '', // 拖动印章的id
            signType: '', // 1仅他人需要签署，2自己他人都需要
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
            compactId: '', // 合同id
            signStatus: '', // 合同状态（01：待我签署；02：待他人签；03：签署通过；04签署不通过） ,
            turnPagePaganation: 0,
            redirectTopPageDis: true, // 直达顶部
            prePageDis: true,
            nextPageDis: false,
            redirectBottomPageDis: false,
            needToSignArr: [
                // {
                //     compactFileCode: '36cbe38f-d5e1-41d1-ae43-b9863330f896',
                //     signName: 'landq',
                //     signatoryId: '614509936684040192',
                //     signatureCoordinateX: 463.586,
                //     signatureCoordinateY: 165.086,
                //     signatureEndPage: null,
                //     signatureMethod: '01',
                //     signatureStartPage: 1
                // }
            ],
            visibleContinuous: true,
            ukeySealList: [], // ukey印章
            cloudSealList: [], // 云印章
            fileList: [],
            currFile: 0
        };
    },
    mounted() {
        // this.fileCode = this.$route.query.fileCode;
        // this.fileName = this.$route.query.fileName;
        // this.signStatus = this.$route.query.signStatus;
        // this.signWay = +this.$route.query.signWay;
        // this.compactId = this.$route.query.compactId;
        // this.signType = +this.$route.query.signType; // 1仅他人需要签署，2自己他人都需要, 3仅自己需要
        this.enterpriseOrPersonalId = sessionStore.get('userInfo').enterpriseId; // 管理员所属单位id
        // console.log(this.enterpriseOrPersonalId);
        if (this.signType) {
            this.setOptionsSignPeople();
        }
        let startContractInfo = sessionStore.get('startContractInfo')
        this.fileList = startContractInfo.fileList;
        this.getPageListSealInfo('', '01');
        this.getSignConfig();
        this.addEventSignMove();
        this.mouseMoveSetPos();
        this.addEventSignPosMove();
        this.setSignTitle();
        // console.log(this.signType)
    },
    methods: {
        // 签署密码
        signPwCancel() {
            this.$refs.signPwForm.resetFields();
            this.dialogInputSignPassword = false;
        },
        resetSignPw() {
            this.signPwCancel();
        },
        signPwConfirm(formName) {
            this.$refs[formName].validate((valid) => {
                if (valid) {
                }
            });
        },
        setSignPwNow() {
            this.dialogInputSignPassword = false;
            setTimeout(() => {
                this.setSignPasswordDialog = true;
            }, 500);
        },
        resetSetDialogData() {
            this.cancelSetSignPw();
        },
        cancelSetSignPw() {
            this.$refs.setSignPasswordForm.resetFields();
            this.setSignPasswordDialog = false;
        },
        confirmSetSignPw(formName) {
            this.$refs[formName].validate((valid) => {
                if (valid) {
                }
            });
        },
        /**
         * 下载驱动
         */
        downloadDriver() {
            this.$downloadDriver();
        },
        goBack() {
            // 文件详情过来的
            if (!this.signType) {
                this.$router.go(-1);
            } else {
                this.$router.push({
                    path: '/fileCenter/StartContract',
                    query: {
                        fromSign: 1
                    }
                });
            }
        },
        /**
         * 跳转到指定页
         */
        handleCurrentChange(val) {
            console.log(val);
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
            if (val > 1 && val < this.totalPage) {
                this.redirectTopPageDis = false;
                this.prePageDis = false;
                this.redirectBottomPageDis = false;
                this.nextPageDis = false;
            }
            this.pageNumber = val;
            this.getPageSingle();
        },
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
        setSignTitle() {
            if (this.signType === 1) {
                this.signTitle = '发起签署';
            }
            if (this.signType === 2) {
                this.signTitle = '签署并发起';
            }
        },
        // 获取签名域
        async getSignDomain() {
            let res = await this.$api('sunshineSignDomain').post(
                'postQuery',
                {},
                {
                    fileCode: this.fileCode
                }
            );
            if (!res) return;
            let domainList = res.data.data;
            let imgWrapDom = $('.img-wrap');
            let fileDom = $('.file');
            console.log(this.scale);
            console.log(domainList);
            domainList.forEach((item) => {
                item.signatureCoordinateX =
                    item.signatureCoordinateX * this.scale +
                    (imgWrapDom.width() - fileDom.width()) / 2;
                item.signatureCoordinateY =
                    item.signatureCoordinateY * this.scale;
            });
            this.needToSignArr = domainList;
        },
        // 显示或隐藏云印章
        visibleCloudSign(cloudSign) {
            if (cloudSign.endPageNo) {
                return (
                    this.pageNumber >= cloudSign.startPageNo &&
                    this.pageNumber <= cloudSign.endPageNo
                );
            } else {
                return (
                    cloudSign.pageNo === this.pageNumber ||
                    cloudSign.page === this.pageNumber
                );
            }
        },
        handleTabClick(event, tab) {
            if (event.name === 'second') {
                this.visibleContinuous = false; // 隐藏连页签
                this.$ukeyApi('getUKeyVersion')
                    .get()
                    .then((res) => {
                        // console.log(res);
                        let data = res.data;
                        if (this.successUKeyCheckCode(data)) {
                            // console.log(
                            //     this.$store.state.settings.driveVersion
                            // );
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
                this.visibleContinuous = true; // 显示连页签
                this.readUkeyLoading = false;
            }
        },
        // 获取ca类型
        getCAtype() {
            this.$ukeyApi('getKeyCertInfo')
                .get('getNormal',{
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
        // 每次调用相关前缀钱需调用对应前缀的checkList
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
        // 读取ukey，获得ukey签名、ukey印章
        readUkey(check) {
            console.log(check)
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
                                        if (this.caType === 'GDCA') {
                                            this.getKeyInfo('check');
                                        } else {
                                            this.ukeyDialogTitle =
                                                'UKEY签署校验';
                                            this.UkeyCheck = true;
                                            this.loadingFinishSign = false;
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
            this.$ukeyApi('getKeyInfo')
                .get('getNormal',{
                        keyid: 0
                    
                })
                .then((res) => {
                    let data = res.data;
                    let _self = this;
                    if (this.successUKeyCheckCode(data)) {
                        let sealCode = data.sealCode;
                        let sealWidth = data.sealWidth || 50; // 老ukey没有宽高字段，默认50mm
                        let sealHeight = data.sealHeight || 50;
                        let ukeySealItem = {};
                        this.ukeySeal.map((item) => {
                            if (item.pictureCode === sealCode) {
                                ukeySealItem = item;
                                ukeySealItem.picturePath =
                                    'data:image/png;base64,' + data.image;
                                _self.ukeyWidth = Math.round(
                                    mmToPx(sealWidth) * _self.scale
                                );
                                // console.log(mmToPx(sealWidth));
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
                                // this.sealName = ukeySealItem.pictureName;
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
                .post('postQuery',{
                        keyid: 0,
                        pin: this.ukeyForm.pinPassword
                    
                })
                .then((res) => {
                    console.log(res);
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
                        console.log(999);
                        this.ukeySiging = false;
                    }
                });
        },
        // 获取文件数据
        ukeySignFn() {
            let _self = this;
            this.$api('getFileBinary')
                .get({
                    responseType: 'blob',
                    query: [this.fileCode]
                })
                .then((res) => {
                    this.loadingFinishSign = false;
                    if (!res) return;
                    let blob = res.data;
                    // console.log(blob);
                    let fileReader = new FileReader();
                    fileReader.readAsDataURL(blob);
                    fileReader.onload = function() {
                        // console.log(fileReader.result);
                        let base64 = fileReader.result.match(/base64,(.*)/)[1];
                        let ukeySealArr = _self.cloudSignList.filter((item) => {
                            return item.ukeySeal;
                        });
                        // 雾化、脱密计算
                        let signmodeJava = computedSignMode(
                            _self.foggyCheck,
                            _self.greyCheck
                        );
                        let signmode = 0; // c++处理有bug，暂时不传值
                        let signinfo = [];
                        let sealItem = {};
                        if (_self.typeActive === 1) {
                            // 单页签
                            ukeySealArr.forEach((ele) => {
                                sealItem = {
                                    page: ele.page,
                                    posx: ele.posx,
                                    posy: ele.posy,
                                    signtype: 0,
                                    signmode: signmode // 2:脱密，4:雾化 6：脱密加雾化 0:都不
                                };
                                ele.signmode = signmodeJava;
                                signinfo.push(sealItem);
                            });
                        } else if (_self.typeActive === 2) {
                            // 多页签
                            ukeySealArr.forEach((ele) => {
                                sealItem = {
                                    pageStart: ele.startPageNo,
                                    pageEnd: ele.endPageNo,
                                    posx: ele.posx,
                                    posy: ele.posy,
                                    signtype: 1, // 0:单页签，1：多页签，2：骑缝签
                                    signmode: signmode // 2:脱密，4:
                                };
                                ele.signmode = signmodeJava;
                                signinfo.push(sealItem);
                            });
                        } else if (_self.typeActive === 3) {
                            // 骑缝签
                            // console.log(ukeySealArr)
                            ukeySealArr.forEach((ele) => {
                                sealItem = {
                                    pageStart: ele.startPageNo,
                                    pageEnd: ele.endPageNo,
                                    seamPart: +ele.pageSize,
                                    posxy: ele.posy,
                                    pagetype: ele.signatureDirection,
                                    signtype: 2, // 0:单页签，1：多页签，2：骑缝签
                                    signmode: signmode // 2:脱密，4:
                                };
                                ele.signmode = signmodeJava;
                                signinfo.push(sealItem);
                            });
                        }
                        _self.ukeySignHttp(base64, signinfo, ukeySealArr);
                    };
                });
        },
        ukeySignHttp(fileBase64, signinfo, ukeySealArr) {
            this.$ukeyApi('signBylist')
                .post('postQuery',{
                        keyid: 0,
                        pdfFile: fileBase64,
                        signinfo: JSON.stringify(signinfo)
                    
                })
                .then((res) => {
                    let data = res.data;
                    if (this.successUKeyCheckCode(data)) {
                        // console.log(data);
                        let signFinishedFile = data.signedFile;
                        this.saveFileToJava(signFinishedFile, ukeySealArr);
                    }
                });
        },
        // 保存到java后台
        saveFileToJava(fileBase64, ukeySealArr) {
            let saveData = {
                fileCode: this.fileCode,
                fileName: this.fileName,
                ukeySignPdfBase64: fileBase64,
                userId: sessionStore.get('userInfo').id
            };
            let list = [];
            let sealItem = {};
            console.log(ukeySealArr);
            // console.log(this.ukeySeal);
            // return
            ukeySealArr.forEach((ele) => {
                let signType = computedSignType(ele.signmode);
                sealItem = {
                    foggy: signType.foggy,
                    grey: signType.grey,
                    pdfWidth: this.fileWidth,
                    sealCode: this.ukeySeal[0].pictureCode,
                    sealName: this.ukeySeal[0].pictureName,
                    llx: ele.llx,
                    lly: ele.lly
                };
                if (ele.ukeySeal) {
                    // 如果是ukey印章
                    sealItem.urx = this.ukeyWidth / this.scale + 4;
                    sealItem.ury = this.ukeyWidth / this.scale + 4;
                } else {
                    sealItem.urx = this.standerdSignWidth + 4;
                    sealItem.ury = this.standerdSignWidth + 4;
                }
                if (this.typeActive === 1) {
                    sealItem.pageNum = ele.page;
                } else if (this.typeActive == 2 || this.typeActive === 3) {
                    sealItem.pageNum = ele.startPageNo;
                    sealItem.pageNumEnd = ele.endPageNo;
                }
                if (this.typeActive === 3) {
                    let diff = sealItem.urx / ele.pageSize;
                    sealItem.urx = diff * 2;
                    if (ele.signatureDirection === 0) {
                        sealItem.llx = 0;
                    } else if (ele.signatureDirection === 1) {
                        sealItem.llx = this.fileWidth - diff;
                    }
                }
                // console.log(ele.signmode);
                list.push(sealItem);
            });
            saveData.list = list;
            // console.log(saveData);
            // return
            // console.log(saveData);
            this.$api('uKeySign')
                .post('postNormal', saveData)
                .then((res) => {
                    this.loadingFinishSign = false;
                    if (!res) return;
                    if (res.data.data) {
                        if (this.cloudSealList.length) {
                            // this.cloudSignList = this.cloudSealList;
                            this.startSign();
                            // 如果只有
                        } else {
                            this.onlyOtherSign();
                        }
                    }
                    // console.log(res);
                });
        },
        setOptionsSignPeople() {
            let _self = this;
            let userId = sessionStore.get('userInfo').id;
            this.optionsSignPeopleBefor = sessionStore.get('signPeople');
            let selfIndex = findIndex(this.optionsSignPeopleBefor, (o) => {
                return o.signatoryId === userId;
            });
            console.log(sessionStore.get('signPeople'));
            if (selfIndex >= 0) {
                this.optionsSignPeopleBefor.splice(selfIndex, 1);
            }
            let item = {};
            this.optionsSignPeopleBefor.forEach((element) => {
                if (element.type === '01') {
                    item = {
                        label: element.signName,
                        value: element.signatoryId
                    };
                    _self.optionsSignPeople.push(item);
                }
            });
        },
        chooseSignPeople(userId) {
            let index = findIndex(this.optionsSignPeople, (o) => {
                return o.value === userId;
            });
            this.posSignPeople = this.optionsSignPeople[index].label;
            this.posSignPeopleId = userId;
        },
        // 拖动指定印章位置
        addEventSignPosMove() {
            let _self = this;
            $('.container-sign').on('mousedown', '.pos-sign', function(e) {
                let containerDom = document.querySelector('.container-sign');
                let fileWrapDom = document.querySelector('.files');
                let fileDom = document.querySelector('.center-file');
                let imgWrapDom = $('.img-wrap');
                let fileDomItem = $('.center-file');
                let diffWidthInner =
                    (imgWrapDom.outerWidth() - fileDomItem.outerWidth()) / 2;
                let fileHInner = fileDomItem.outerHeight();
                // 点击时将影子章定位到点击出
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
                        (fileDocumentPosObj.left - contDocumentPosObj.left) -
                        fileWrapDom.clientWidth * 0.075;
                    let diffFileWrapFile =
                        (fileWrapDom.clientWidth - fileDom.clientWidth) / 2 -
                        fileWrapDom.clientWidth * 0.075;
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
                            _self.addPosSignWrap(
                                addSignPosX,
                                addSignPosY,
                                diffWidthInner,
                                fileHInner
                            );
                        }, 50);
                    });
                });
            });
        },
        // 添加指定签章位置
        addPosSignWrap(addSignPosX, addSignPosY, diffWidthInner, fileHInner) {
            console.log(this.scale);
            let item = {
                name: this.posSignPeople,
                id: this.posSignPeopleId,
                devId: Date.now(),
                signType: '01', // 位置类型(01:印章；02:签名；03:日期) ,
                posX: addSignPosX,
                posY: addSignPosY,
                submitX: (addSignPosX - diffWidthInner + 5) / this.scale, // 距离文件边沿的实际距离
                submitY: (addSignPosY + 30 + 5) / this.scale,
                pageNo: this.pageNumber
            };
            if (this.typeActive === 1 && this.signSetData.preSign === 1) {
                let venderPosItem = {
                    signSubmitPosX: Math.round(
                        (addSignPosX -
                            diffWidthInner +
                            (this.signWidth + 8) / 2) /
                            this.scale
                    ),
                    signSubmitPosY: Math.round(
                        (fileHInner - addSignPosY - this.signWidth / 2 - 30) /
                            this.scale
                    )
                };
                this.preSignCheck(venderPosItem, item.devId, 'pos');
            }
            this.setPosArr.push(item);
        },
        removePosSign({ devId }) {
            let idx = findIndex(this.setPosArr, (o) => {
                return o.devId === devId;
            });
            this.setPosArr.splice(idx, 1);
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
                _self.showShadowSign = true;
                let pageStartX = e.pageX;
                let pageStartY = e.pageY;
                let target = $(e.currentTarget);
                console.log(target);
                let targetWidth = target.outerWidth();
                let targetHeight = target.outerHeight() - 18; // 减去名称的高度
                let picturePath = target[0].dataset.picturepath;
                let pictureCode = target[0].dataset.picturecode;
                let ukeyLogo = target[0].dataset.ukey;
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
                e.preventDefault();
                // 点击
                $(document).mouseup(function(e) {
                    if (pageStartX === e.pageX && pageStartY === e.pageY) {
                        _self.showShadowSign = false;
                        $(this).unbind('mousemove');
                        $(this).unbind('mouseup');
                    }
                });
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
                        (fileDocumentPosObj.left - contDocumentPosObj.left) -
                        fileWrapDom.clientWidth * 0.075;
                    let diffFileWrapFile =
                        (fileWrapDom.clientWidth - fileDom.clientWidth) / 2 -
                        fileWrapDom.clientWidth * 0.075;

                    // console.log('diffX:'+diffX)
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
                            _self.addCloudOrUkeySign(
                                pictureCode,
                                addSignPosX,
                                addSignPosY,
                                ukeyLogo
                            );
                        }, 50);
                    });
                });
            });
        },
        // 添加云印章或ukey印章
        addCloudOrUkeySign(
            pictureCode,
            addSignPosX,
            addSignPosY,
            ukeyLogo = ''
        ) {
            let imgWrapDom = $('.img-wrap');
            let fileDom = $('.file');
            let diffWidthInner =
                (imgWrapDom.outerWidth() - fileDom.outerWidth()) / 2;
            let fileHInner = fileDom.outerHeight();
            let fileWInner = fileDom.outerWidth();
            let venderCloudItem;
            // console.log(ukeyLogo)
            if (ukeyLogo) {
                // ukey印章
                let sealItemIndex = findIndex(this.ukeySeal, (o) => {
                    return o.pictureCode === pictureCode;
                });
                let cloudSignItem = this.ukeySeal[sealItemIndex];
                // console.log(addSignPosX, diffWidthInner);
                venderCloudItem = Object.assign({}, cloudSignItem, {
                    signSubmitPosX:
                        (addSignPosX - diffWidthInner + this.ukeyWidth / 2) /
                        this.scale,
                    signSubmitPosY:
                        (fileHInner - addSignPosY - this.ukeyWidth / 2) /
                        this.scale,
                    ukeySeal: true, // 标识ukey印章
                    page: this.pageNumber,
                    posx:
                        Math.round(
                            addSignPosX - diffWidthInner + this.ukeyWidth / 2
                        ) / fileWInner,
                    // posy: this.ukeySignData[0].signCenterPosYRatio,
                    posy:
                        Math.round(addSignPosY + this.ukeyWidth / 2) /
                        fileHInner,
                    left: addSignPosX,
                    top: addSignPosY,
                    llx: Math.round(
                        (addSignPosX - diffWidthInner + this.ukeyWidth / 2) /
                            this.scale
                    ),
                    lly: Math.round(
                        (fileHInner - addSignPosY - this.ukeyWidth / 2) /
                            this.scale
                    ),
                    width: this.ukeyWidth,
                    height: this.ukeyWidth,
                    devPictureId: Date.now(),
                    picturePath: this.ukeySealItem[0].picturePath,
                    dragging: false
                });
                // console.log(fileHInner);
                // console.log(addSignPosY);
                // console.log(venderCloudItem.posy);
            } else {
                // 云印章
                let sealItemIndex = findIndex(this.sealList, (o) => {
                    return o.pictureCode === pictureCode;
                });
                let cloudSignItem = this.sealList[sealItemIndex];
                venderCloudItem = Object.assign({}, cloudSignItem, {
                    left: addSignPosX,
                    top: addSignPosY,
                    width: this.signWidth,
                    height: this.signHeight,
                    pageNo: this.pageNumber,
                    devPictureId: Date.now(),
                    signSubmitPosX: Math.round(
                        (addSignPosX - diffWidthInner + this.signWidth / 2) /
                            this.scale
                    ),
                    signSubmitPosY: Math.round(
                        (fileHInner - addSignPosY - this.signWidth / 2) /
                            this.scale
                    ),
                    dragging: false,
                    fileCode: this.fileCode,
                    signatureMethod: `0${this.typeActive}`
                });
            }
            this.draggingSignId = venderCloudItem.devPictureId;
            this.cloudSignList.push(venderCloudItem);
            // 于盖章校验
            if (this.typeActive === 1 && this.signSetData.preSign === 1) {
                this.preSignCheck(
                    venderCloudItem,
                    venderCloudItem.devPictureId
                );
            }
            if (this.typeActive !== 1) {
                this.dialogChooseType = true;
            }
            // 吸附
            if (this.typeActive === 1) {
                this.adsorbSignToPos(
                    addSignPosX,
                    addSignPosY,
                    this.cloudSignList.length - 1,
                    diffWidthInner,
                    fileHInner,
                    this.signWidth,
                    this.signHeight
                );
            }
        },
        // 于盖章校验
        async preSignCheck(venderCloudItem, pictureCodeOrDevId, type = '') {
            let preSign = await this.preSign(venderCloudItem);
            if (!preSign) return;
            let data = preSign.data.data;
            let preSignIndex = findIndex(this.cloudSignList, (o) => {
                return o.devPictureId === pictureCodeOrDevId;
            });
            let preSignPosIndex = findIndex(this.setPosArr, (o) => {
                return o.devId === pictureCodeOrDevId;
            });
            // console.log(pictureCodeOrDevId)
            console.log(this.cloudSignList);
            console.log(preSignIndex);
            if (!data) {
                if (!type) {
                    this.$message.warning(
                        '系统管理员已开启安全用章功能，请勿在空白页和章下无文字处盖章！'
                    );
                    this.cloudSignList[preSignIndex].preSign = false;
                } else {
                    this.$message.warning(
                        '系统管理员已开启安全用章功能，请勿在空白页和章下无文字处指定位置！'
                    );
                    // 指定位置
                    this.setPosArr[preSignPosIndex].preSign = false;
                }
            } else {
                if (!type) {
                    this.cloudSignList[preSignIndex].preSign = true;
                } else {
                    this.setPosArr[preSignPosIndex].preSign = true;
                }
            }
        },
        // 删除云印章
        removeSignAreadyOnFile({ devPictureId }) {
            let signOnFileIndex = findIndex(this.cloudSignList, (o) => {
                return o.devPictureId === devPictureId;
            });
            this.cloudSignList.splice(signOnFileIndex, 1);
        },
        currentChange() {
            this.getPageListSealInfo('', '01');
        },
        // 获取签章设置
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
                        userId: sessionStore.get('userInfo').id
                    })
                    .then((res) => {
                        if (!res) return;
                        let data = res.data.data;
                        let seals = data.records;
                        this.pagination.total = data.total;
                        this.sealList = seals;
                        if (pageSeal) return;
                        this.getFileTotalPage();
                    });
            } else if (mediumType && mediumType === '02') {
                // ukey印章
                this.$api('pageUserListSealInfo')
                    .post('postNormal', {
                        currentPage: 1,
                        pageSize: 100,
                        enterpriseOrPersonalId: this.enterpriseOrPersonalId,
                        mediumType: mediumType,
                        userId: sessionStore.get('userInfo').id
                    })
                    .then((res) => {
                        if (!res) return;
                        let data = res.data.data;
                        let ukeySeals = data.records;
                        this.ukeySeal = ukeySeals;
                    });
            }
        },
        // 获取文件总页数
        getFileTotalPage() {
            this.$api('getPicSize')
                .get('getPath', {
                    fileCode: this.fileCode
                })
                .then((res) => {
                    if (!res) return;
                    // console.log(res);
                    let data = res.data.data;
                    this.totalPage = data.totalPageNo;
                    this.fileWidth = data.width; //a4
                    this.fileHeight = data.height;
                    this.getPageSingle();
                    this.setStartPages(this.totalPage);
                });
        },
        setStartPages(totalPage) {
            let startPages = [];
            for (let i = 0; i < totalPage; i++) {
                startPages.push({
                    page: i + 1
                });
            }
            this.startPages = this.endPages = startPages;
        },
        // 向上到达顶部
        redirectTop() {
            this.pageNumber = 1;
            this.redirectTopPageDis = true;
            this.prePageDis = true;
            this.redirectBottomPageDis = false;
            this.nextPageDis = false;
            this.getPageSingle();
        },
        // 向上翻页
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
            this.getPageSingle();
        },
        // 向下翻页
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
            this.getPageSingle();
        },
        // 向下到底
        redirectBottom() {
            this.pageNumber = this.totalPage;
            this.redirectTopPageDis = false;
            this.prePageDis = false;
            this.redirectBottomPageDis = true;
            this.nextPageDis = true;
            this.getPageSingle();
        },
        // 获取文件单页数
        getPageSingle() {
            this.$api('pageSingle')
                .get(
                    'getBlob',
                    {
                        fileCode: this.fileCode,
                        pageNumber: this.pageNumber
                    },
                    {
                        headers: {
                            noLoading: true
                        }
                    }
                )
                .then((res) => {
                    if (!res) return;
                    let _self = this;
                    let blob = res.data;
                    let checkBlobFileResponse = checkBlobFileResponseUtils(
                        blob
                    );
                    checkBlobFileResponse
                        .then((res) => {
                            let url = window.URL.createObjectURL(res);
                            _self.fileImg = url;
                            _self.pageNumber === 1 && _self.setStyle(url);
                        })
                        .catch((error) => {
                            _self.$message.warning(error);
                        });
                });
        },
        chooseSignType(typeNum) {
            // console.log(typeNum, this.typeActiveForTime);
            // 签署的时候
            if (!this.signType && typeNum !== 1 && this.needToSignArr.length) {
                this.$message.warning('指定位置签章不支持多页或骑缝签署！');
                return;
            }
            // 发起签署只给别人设置签署位置
            if (this.signType === 1 && typeNum !== 1) {
                this.$message.warning('指定位置签章不支持多页或骑缝签署！');
                this.chooseSignPeopleDis = true;
                this.posSignPeople = '';
                this.posSignPeopleId = '';
                this.setPosArr = [];
            } else if (this.signType === 2 && typeNum !== 1) {
                this.chooseSignPeopleDis = true;
                this.posSignPeople = '';
                this.posSignPeopleId = '';
            } else if (typeNum === 1) {
                this.chooseSignPeopleDis = false;
            }
            console.log(555);
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
                signatureDirection: 1 // 0左，1右
            };
        },
        dialogSure() {
            // console.log(this.formRule, this.typeActive);
            if (
                this.typeActive !== 1 &&
                this.formRule.startPageNo >= this.formRule.endPageNo
            ) {
                this.$message.warning({
                    message: '结束页不能小于或等于起始页！',
                    customClass: 'zZindex'
                });
                return;
            }
            if (this.typeActive === 3) {
                if (!this.formRule.pageSize) {
                    this.$message.warning({
                        message: '请输入印章覆盖页数！',
                        customClass: 'zZindex'
                    });
                    return;
                } else if (!checkIntegral(this.formRule.pageSize)) {
                    this.$message.warning({
                        message: '印章覆盖页数只能为正整数！',
                        customClass: 'zZindex'
                    });
                    return;
                } else if (this.formRule.pageSize > this.totalPage) {
                    this.$message.warning({
                        message: '印章覆盖页数不能大于结束页！',
                        customClass: 'zZindex'
                    });
                    return;
                }
            }
            let signOnFileIndex = findIndex(this.cloudSignList, (o) => {
                return o.devPictureId === this.draggingSignId;
            });
            if (this.typeActive !== 1) {
                if (this.typeActive === 2) {
                    this.setMultiplePageNo(this.cloudSignList[signOnFileIndex]);
                    this.cloudSignList[
                        signOnFileIndex
                    ].startPageNo = this.formRule.startPageNo;
                    this.cloudSignList[
                        signOnFileIndex
                    ].endPageNo = this.formRule.endPageNo;
                }
                if (this.typeActive === 3 || this.typeActive === 4) {
                    this.cloudSignList[
                        signOnFileIndex
                    ].startPageNo = this.formRule.startPageNo;
                    this.cloudSignList[
                        signOnFileIndex
                    ].endPageNo = this.formRule.endPageNo;
                    this.cloudSignList[
                        signOnFileIndex
                    ].signatureDirection = this.formRule.signatureDirection;
                    if (this.typeActive === 3) {
                        this.cloudSignList[
                            signOnFileIndex
                        ].pageSize = this.formRule.pageSize;
                    }
                }
            }
            // this.foggyCheck &&
            //     (this.cloudSignList[signOnFileIndex].foggy = true);
            // this.greyCheck && (this.cloudSignList[signOnFileIndex].grey = true);
            this.formRule = {
                startPageNo: 1,
                endPageNo: 1,
                signatureDirection: 1 // 0左，1右
            };
            this.dialogChooseType = false;
        },
        setMultiplePageNo(item){
            let arr = new Array(this.formRule.endPageNo);
            let pageNoArr = [];
            for (let i = 0; i < arr.length; i++) {
                const element = i+1;
                element >= this.formRule.startPageNo ? pageNoArr.push(element) : '';
            }
            item.multiplePageNo = pageNoArr;
        },
        setStyle(fileUrl) {
            this.$nextTick(() => {
                let wrapDom = this.$refs.fileItemWrap;
                let width = wrapDom.clientWidth;
                let height = wrapDom.clientHeight;
                let colWrap = height / width;
                let colImg = this.fileHeight / this.fileWidth;
                // console.log('colWrap:' + colWrap);
                // console.log('fileHeight:' + this.fileHeight);
                // console.log('fileWidth:' + this.fileWidth);
                if (colImg > colWrap) {
                    $('.file').css('height', '100%');
                    $('.file-wrap').css('height', '100%');
                } else {
                    $('.file').css('width', '100%');
                    $('.file-wrap').css('width', '100%');
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
                let fileWrapRealWidth = $('.file-wrap').width();
                // 设置翻页器位置
                that.turnPagePaganation =
                    (fileWrapRealWidth - fileImgRealWidth) / 2 +
                    fileImgRealWidth +
                    20;
                that.scale = fileImgRealWidth / that.fileWidth;
                let wh = that.standerdSignWidth * that.scale;
                if (
                    !that.signType &&
                    that.signStatus === '01' &&
                    !that.signWidth
                ) {
                    /**待我签署状态 */
                    that.getSignDomain();
                }
                that.signWidth = wh;
                that.signHeight = wh;
                // console.log(wh);
                that.mouseMove();
            };
        },
        // 固定签章
        mouseMoveSetPos() {
            let _self = this;
            let imgWrapDom = $('.img-wrap');
            let fileDom = $('.file');
            imgWrapDom.on('mousedown', '.sign-setpos', function(e) {
                let target = $(e.currentTarget);
                let pageStartX = e.pageX;
                let pageStartY = e.pageY;
                let moveId = +target[0].dataset.id;
                // console.log(moveId);
                let offsetX = e.pageX - target.offset().left;
                let offsetY = e.pageY - target.offset().top;
                // 如果点击的是关闭按钮
                let clickIcon = e.target.dataset.icon;
                if (clickIcon) {
                    return;
                }
                // 点击
                $(document).mouseup(function(e) {
                    if (pageStartX === e.pageX && pageStartY === e.pageY) {
                        $(this).unbind('mousemove');
                        $(this).unbind('mouseup');
                    }
                });
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
                    _self.setPosArr[moveIndex].submitX =
                        (left - diffWidthInner + 5) / _self.scale; // 加padding
                    _self.setPosArr[moveIndex].posY = top;
                    _self.setPosArr[moveIndex].submitY =
                        (top + 30 + 5) / _self.scale;
                    // console.log('top:' + top);
                    // console.log('left:' + left);
                    // console.log('left:' + (left - diffWidthInner));
                    $(document).mouseup(function() {
                        $(this).unbind('mousemove');
                        $(this).unbind('mouseup');
                        // 单页签预盖章
                        if (_self.debounceTimer !== null) {
                            clearTimeout(_self.debounceTimer);
                        }
                        _self.debounceTimer = setTimeout(() => {
                            //  console.log( _self.setPosArr);
                            if (
                                _self.typeActive === 1 &&
                                _self.signSetData.preSign === 1
                            ) {
                                let venderPosItem = {
                                    signSubmitPosX: Math.round(
                                        (left -
                                            diffWidthInner +
                                            target.width() / 2 +
                                            4) /
                                            _self.scale
                                    ),
                                    signSubmitPosY: Math.round(
                                        (fileHInner -
                                            top -
                                            target.height() +
                                            _self.signHeight / 2 +
                                            4) /
                                            _self.scale
                                    )
                                };
                                _self.preSignCheck(
                                    venderPosItem,
                                    moveId,
                                    'pos'
                                );
                            }
                        }, 50);
                    });
                });
            });
        },
        // 云签章拖拽
        mouseMove() {
            let _self = this;
            let imgWrapDom = $('.img-wrap');
            let fileDom = $('.file');
            // console.log($('.img-wrap').outerWidth());
            // console.log($('.file').outerWidth());
            if (this.event) {
                return;
            }
            this.event = true;
            imgWrapDom.on('mousedown', '.sign-wrap', function(e) {
                let target = $(e.currentTarget);
                let pageStartX = e.pageX;
                let pageStartY = e.pageY;
                let targetWidth = target.width();
                let targetHeight = target.height();
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
                // 点击
                $(document).mouseup(function(e) {
                    if (pageStartX === e.pageX && pageStartY === e.pageY) {
                        $(this).unbind('mousemove');
                        $(this).unbind('mouseup');
                    }
                });
                // console.log(dragDevpictureid,dragCloudItemIndex, _self.cloudSignList);
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
                              imgWrapDom.width() - targetWidth - diffWidthInner
                            ? imgWrapDom.width() - targetWidth - diffWidthInner
                            : left;
                    top =
                        top < 0
                            ? 0
                            : top >
                              imgWrapDom.height() -
                                  targetHeight -
                                  diffHeightInner
                            ? imgWrapDom.height() -
                              targetHeight -
                              diffHeightInner
                            : top;
                    _self.cloudSignList[dragCloudItemIndex].left = left;
                    _self.cloudSignList[dragCloudItemIndex].top = top;
                    _self.cloudSignList[dragCloudItemIndex].dragging = true;
                    // ukey签署用坐标 比例
                    if (_self.cloudSignList[dragCloudItemIndex].ukeySeal) {
                        _self.cloudSignList[dragCloudItemIndex].posx =
                            Math.round(
                                left - diffWidthInner + targetWidth / 2
                            ) / fileWInner;
                        _self.cloudSignList[dragCloudItemIndex].posy =
                            Math.round(top + targetHeight / 2) / fileHInner;
                        // 印章中心坐标
                        _self.cloudSignList[
                            dragCloudItemIndex
                        ].llx = Math.round(
                            (left - diffWidthInner + targetWidth / 2) /
                                _self.scale
                        );
                        _self.cloudSignList[
                            dragCloudItemIndex
                        ].lly = Math.round(
                            (fileHInner - top - targetHeight / 2) / _self.scale
                        );
                        // console.log(_self.cloudSignList[dragCloudItemIndex]);
                    }
                    // 云签署用坐标
                    _self.cloudSignList[
                        dragCloudItemIndex
                    ].signSubmitPosX = Math.round(
                        (left - diffWidthInner + targetWidth / 2) / _self.scale
                    );
                    _self.cloudSignList[
                        dragCloudItemIndex
                    ].signSubmitPosY = Math.round(
                        (fileHInner - top - targetHeight / 2) / _self.scale
                    );
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
                                _self.typeActive === 1 &&
                                _self.signSetData.preSign === 1
                            ) {
                                _self.preSignCheck(
                                    _self.cloudSignList[dragCloudItemIndex],
                                    _self.cloudSignList[dragCloudItemIndex]
                                        .devPictureId
                                );
                                _self.adsorbSignToPos(
                                    left,
                                    top,
                                    dragCloudItemIndex,
                                    diffWidthInner,
                                    fileHInner,
                                    targetWidth,
                                    targetHeight
                                );
                            } else if (_self.typeActive === 1) {
                                // 单页签才支持指定位置签署
                                // console.log(666)
                                _self.adsorbSignToPos(
                                    left,
                                    top,
                                    dragCloudItemIndex,
                                    diffWidthInner,
                                    fileHInner,
                                    targetWidth,
                                    targetHeight
                                );
                            }
                        }, 50);
                    });
                });
            });
        },
        // 预盖章
        preSign(venderCloudItem) {
            // console.log(venderCloudItem);
            let info = {};
            if (venderCloudItem.ukeySeal) {
                info.xcoordinate =
                    venderCloudItem.signSubmitPosX -
                    this.ukeyWidth / 2 / this.scale;
                info.ycoordinate =
                    venderCloudItem.signSubmitPosY -
                    this.ukeyWidth / 2 / this.scale;
                info.wcoordinate = this.ukeyWidth / this.scale;
                info.hcoordinate = this.ukeyWidth / this.scale;
            } else {
                info.xcoordinate =
                    venderCloudItem.signSubmitPosX - this.standerdSignWidth / 2;
                info.ycoordinate =
                    venderCloudItem.signSubmitPosY - this.standerdSignWidth / 2;
                info.wcoordinate = this.standerdSignWidth;
                info.hcoordinate = this.standerdSignWidth;
            }
            info.fileCode = this.fileCode;
            info.page = this.pageNumber;
            return this.$api('judgePosition').post('postNormal', info);
        },
        // 距离指定位置一定范围内吸附上去
        adsorbSignToPos(
            left,
            top,
            dragCloudItemIndex,
            diffWidthInner,
            fileHInner,
            targetWidth,
            targetHeight
        ) {
            if (!this.needToSignArr.length) return;
            let _self = this;
            console.log(_self.cloudSignList, dragCloudItemIndex);
            console.log('left:' + left);
            console.log('top:' + top);
            console.log('scale:' + this.scale);
            console.log('targetWidth:' + targetWidth);
            console.log(this.needToSignArr);
            console.log(left - diffWidthInner);
            this.needToSignArr.forEach((item) => {
                if (item.signatureStartPage === _self.pageNumber) {
                    if (
                        left > item.signatureCoordinateX - targetWidth * 0.2 &&
                        left < item.signatureCoordinateX + targetHeight * 0.2 &&
                        top >
                            item.signatureCoordinateY -
                                _self.signHeight * 0.2 &&
                        top < item.signatureCoordinateY + _self.signHeight * 0.2
                    ) {
                        _self.cloudSignList[dragCloudItemIndex].left =
                            item.signatureCoordinateX - 1; // 减去一个边框
                        _self.cloudSignList[dragCloudItemIndex].top =
                            item.signatureCoordinateY - 1;
                        _self.cloudSignList[
                            dragCloudItemIndex
                        ].signSubmitPosX = Math.round(
                            (_self.cloudSignList[dragCloudItemIndex].left -
                                diffWidthInner +
                                targetWidth / 2) /
                                _self.scale
                        );
                        _self.cloudSignList[
                            dragCloudItemIndex
                        ].signSubmitPosY = Math.round(
                            (fileHInner -
                                _self.cloudSignList[dragCloudItemIndex].top -
                                targetHeight / 2) /
                                _self.scale
                        );
                        _self.cloudSignList[dragCloudItemIndex].isPos = true; // 打上固定签署的logo
                    } else {
                        delete _self.cloudSignList[dragCloudItemIndex].isPos; // 删除标识
                    }
                }
            });
        },
        // 拒签
        refuseSign() {},
        submitSign() {
            // 过滤出ukey印章和云印章并保存
            let ukeySealList = this.cloudSignList.filter((item) => {
                return item.ukeySeal;
            });
            let cloudSealList = this.cloudSignList.filter((item) => {
                return !item.ukeySeal;
            });
            this.ukeySealList = ukeySealList;
            this.cloudSealList = cloudSealList;
            console.log(this.cloudSealList);
            // return
            // 没有ukey印章
            if (!ukeySealList.length) {
                this.startSign();
            } else {
                // 签署时没有在固定位盖章提示
                if (this.needToSignArr.length) {
                    let checkPosSignReady = this.checkPosSignReady();
                    if (!checkPosSignReady) return;
                }
                // 发起时没有在固定位盖章提示
                if (
                    this.ukeySealList.some((o) => {
                        return !o.preSign;
                    }) &&
                    this.signSetData.preSign === 1 &&
                    this.typeActive === 1
                ) {
                    this.$message.warning(
                        '系统管理员已开启安全用章功能，请勿在空白页和章下无文字处指定位置！'
                    );
                    return;
                }
                this.loadingFinishSign = true;
                this.readUkey('check');
            }
        },
        // 校验固定位置是否全部有章
        checkPosSignReady() {
            // 没有在固定位盖章提示
            let signInPosArr = this.cloudSignList.filter((item) => {
                return item.isPos;
            });
            // console.log(signInPosArr);
            if (signInPosArr.length < this.needToSignArr.length) {
                this.$message.warning('请先在指定位置签署！');
                return false;
            } else {
                return true;
            }
        },
        startSign() {
            console.log(this.signType);
            if (this.signType === 1) {
                // 指定位置盖章
                let ifHasPresignPosFalse = this.setPosArr.some((o) => {
                    return !o.preSign;
                });
                if (ifHasPresignPosFalse && this.signSetData.preSign === 1) {
                    this.$message.warning(
                        '系统管理员已开启安全用章功能，请勿在空白页和章下无文字处指定位置！'
                    );
                    return;
                }
                this.onlyOtherSign();
            }
            if (this.signType === 2 || this.signType === 3 || !this.signType) {
                if (!this.cloudSealList.length) {
                    this.$message.warning('请拖拽签章到文件上！');
                    return;
                } else {
                    // 判断是否每份文件上都有章模
                    let signFileList = this.cloudSignList.map((v) => v.fileCode);
                    signFileList = [...new Set(signFileList)];
                    if (signFileList.length < this.fileList.length)
                        return this.$message.warning(
                            '请您为其他文件选择印章/签名进行签署！'
                        );
                }

                // 没有在固定位盖章提示
                if (this.needToSignArr.length) {
                    let checkPosSignReady = this.checkPosSignReady();
                    if (!checkPosSignReady) return;
                }
                if (
                    this.signSetData.preSign === 1 &&
                    (!this.signType || [3, 2].includes(this.signType))
                ) {
                    let ifHasPresignFalse = this.cloudSealList.some((o) => {
                        return !o.preSign;
                    });
                    // 如果开启了于盖章功能 单页才指定位置
                    // console.log(this.cloudSignList)
                    if (ifHasPresignFalse && this.typeActive === 1) {
                        this.$message.warning(
                            '系统管理员已开启安全用章功能，请勿在空白页和章下无文字处签署！'
                        );
                        return;
                    }
                }
                this.onlyOtherSign();
            }
        },
        // 给别人设置签署位置 或者仅自己签署走步骤
        onlyOtherSign() {
            let _self = this;
            let info = {
                compactTheme: this.fileName,
                fileCode: this.fileCode,
                filePage: this.totalPage,
                signWay: this.signWay === 1 ? '01' : '02', // 02顺序签
                signatoryWay: this.signType === 1 ? '02' : '01', // 02:自己不需要签署，01自己需要签署
                type: '01', // 01文件管理，02合同
                userId: sessionStore.get('userInfo').id,
                orgId: this.enterpriseOrPersonalId
            };
            if (this.signType === 2 || this.signType === 3) {
                info.signName = sessionStore.get('userInfo').userName;
            }
            let compactFieldInfoReqVOList = [];
            if (this.setPosArr.length) {
                this.setPosArr.forEach((item) => {
                    let pos = {
                        compactFileCode: _self.fileCode,
                        signName: item.name,
                        signatoryId: item.id === '-1' ? '' : item.id,
                        signType: item.signType, // 位置类型(01:印章；02:签名；03:日期)
                        signatureCoordinateX: item.submitX,
                        signatureCoordinateY: item.submitY,
                        signatureStartPage: item.pageNo,
                        signatureMethod: '01' // 01：单页签章；02：多页签章；03：骑缝签章；04:连页签章
                    };
                    compactFieldInfoReqVOList.push(pos);
                });
            }
            // console.log(compactFieldInfoReqVOList)
            // return
            let signInfos = [];
            if (this.signType) {
                let signPeople = sessionStore.get('signPeople');
                console.log(signPeople);
                signPeople.forEach((item) => {
                    signInfos.push({
                        signContact: item.signContact,
                        signName: item.userNickName,
                        signatoryId:
                            item.signatoryId === '-1' ? '' : item.signatoryId,
                        type: item.type
                    });
                });
                // 自己必须放到第一位
                let selfIndex = findIndex(signInfos, (o) => {
                    return o.signatoryId === sessionStore.get('userInfo').id;
                });
                if (selfIndex >= 0) {
                    let selfItem = signInfos.splice(selfIndex, 1);
                    signInfos = [...selfItem, ...signInfos];
                    // console.log(signInfos)
                }
            }
            // 普通签署自己必须签署需将自己添加上去
            if (!this.signType) {
                signInfos.unshift({
                    signContact: '18215629685',
                    signName: sessionStore.get('userInfo').userName,
                    signatoryId: sessionStore.get('userInfo').id,
                    type: '01'
                });
            }

            info.compactFieldInfoReqVOList = compactFieldInfoReqVOList;
            info.signInfos = signInfos;
            // console.log(info);
            // return
            // 如果是待我签署，则使用文件详情传过来的compactId
            if (!this.signType && this.signStatus === '01') {
                this.signNormalSetPosHttp(this.compactId);
                // 流程已经走完了，则走普通签署
            } else if (!this.signType && this.signStatus !== '01') {
                this.setSignData();
            } else {
                this.sunshineInitiateSign(info);
            }
        },
        /**发起签署 */
        sunshineInitiateSign(info) {
            let _self = this;
            this.$api('sunshineInitiateSign')
                .post('postNormal', info)
                .then((res) => {
                    if (!res) return;
                    let data = res.data.data;
                    if (res.data.data) {
                        if (this.signType === 1) {
                            this.$message.success('发起签约成功！');
                            setTimeout(() => {
                                _self.$router.push('/fileCenter/fileManage');
                            }, 500);
                            // 普通签署,发起签署时自己需要签署的话需要走流程
                        } else if (
                            !this.signType ||
                            this.signType === 3 ||
                            this.signType === 2
                        ) {
                            // 有云印章走云签章
                            let compactId = data;
                            this.signNormalSetPosHttp(compactId);
                        }
                    }
                });
        },
        /**走流程 */
        signNormalSetPosHttp(compactId) {
            let info = {};
            info.compactFileCode = this.fileCode;
            info.compactId = compactId;
            info.originalFileName = this.fileName;
            info.sealCode = '0';
            // info.sealCode = this.pictureCode;
            info.signName = sessionStore.get('userInfo').userName;
            info.signatoryId = sessionStore.get('userInfo').id; // 暂无选择用户功能，随便写，不校验
            info.signatureCoordinateX = 0;
            info.signatureCoordinateY = 0;
            info.signatureStartPage = 1;
            info.signType = '01';
            info.signatureMethod = '00'; // 不签署，走步骤
            info.contentType = 'json';
            // console.log(info);
            this.$api('sunshineSign')
                .post('postNormal', info)
                .then((res) => {
                    if (!res) return;
                    let _self = this;
                    // console.log(res);
                    if (res.data.data) {
                        let ukeySeals = this.cloudSignList.filter((o) => {
                            return o.ukeySeal;
                        });
                        let cloudSeals = this.cloudSignList.filter((o) => {
                            return !o.ukeySeal;
                        });
                        if (cloudSeals.length) {
                            // 有云印章走云签章
                            this.setSignData();
                        } else if (!cloudSeals.length && ukeySeals.length) {
                            this.$message.success('签约成功！');
                            setTimeout(() => {
                                _self.$router.push('/fileCenter/fileManage');
                            }, 500);
                        }
                    }
                });
        },
        setSignData() {
            let info = {};
            info.fileCode = this.fileCode;
            info.originalFileName = this.fileName;
            info.signatureMethod = '2'; // 做标签
            info.userId = sessionStore.get('userInfo').id; // 暂无选择用户功能，随便写，不校验
            info.contentType = 'json';

            let list = [];
            let sealItem = {};
            this.cloudSealList.forEach((item) => {
                if (this.typeActive === 1) {
                    sealItem = {
                        coordinateX: item.signSubmitPosX,
                        coordinateY: item.signSubmitPosY,
                        foggy: this.foggyCheck ? true : false,
                        grey: this.greyCheck ? true : false,
                        pageNo: item.pageNo,
                        sealCode: item.pictureCode
                    };
                } else if (this.typeActive === 2) {
                    // console.log(item)
                    sealItem = {
                        coordinateX: item.signSubmitPosX,
                        coordinateY: item.signSubmitPosY,
                        foggy: this.foggyCheck ? true : false,
                        grey: this.greyCheck ? true : false,
                        startPageNo: item.startPageNo,
                        endPageNo: item.endPageNo,
                        sealCode: item.pictureCode
                    };
                } else if (this.typeActive === 3) {
                    sealItem = {
                        coordinateY: item.signSubmitPosY,
                        foggy: this.foggyCheck ? true : false,
                        grey: this.greyCheck ? true : false,
                        startPageNo: item.startPageNo,
                        pageSize: item.pageSize,
                        endPageNo: item.endPageNo,
                        signatureDirection: item.signatureDirection,
                        sealCode: item.pictureCode
                    };
                } else if (this.typeActive === 4) {
                    sealItem = {
                        coordinateY: item.signSubmitPosY,
                        foggy: item.foggy ? item.foggy : false,
                        grey: item.grey ? item.grey : false,
                        startPageNo: item.startPageNo,
                        endPageNo: item.endPageNo,
                        signatureDirection: item.signatureDirection,
                        sealCode: item.pictureCode
                    };
                }
                list.push(sealItem);
            });
            // return
            info.list = list;
            // console.log(this.cloudSignList);
            if (this.typeActive === 1) {
                // 单页签
                this.signSigle(info);
            } else if (this.typeActive === 2) {
                // 多页签
                this.signDouble(info);
            } else if (this.typeActive === 3) {
                // 骑缝签
                this.signPlace(info);
            } else if (this.typeActive === 4) {
                // 连页签
                this.singlePerforationCoordHalfSign(info);
            }
        },
        // 单页签
        signSigle(info) {
            this.$api('singleSign')
                .post('postNormal', info)
                .then((res) => {
                    // console.log(res);
                    this.loadingFinishSign = false;
                    if (!res) return;
                    this.$message.success('签署成功！');
                    this.loadingFinishSign = false;
                    let _self = this;
                    setTimeout(() => {
                        _self.$router.push('/fileCenter/fileManage');
                    }, 500);
                });
        },
        // 多页签
        signDouble(info) {
            // console.log(info);
            delete info.signatureDirection;
            this.$api('singleCoordBatchSign')
                .post('postNormal', info)
                .then((res) => {
                    this.loadingFinishSign = false;
                    if (!res) return;
                    // console.log(res);
                    this.$message.success('签署成功！');
                    this.loadingFinishSign = false;
                    let _self = this;
                    setTimeout(() => {
                        _self.$router.push('/fileCenter/fileManage');
                    }, 500);
                });
        },
        // 骑缝签
        signPlace(info) {
            console.log(info);
            this.$api('singlePerforationCoordSign')
                .post('postNormal', info)
                .then((res) => {
                    this.loadingFinishSign = false;
                    if (!res) return;
                    console.log(res);
                    this.$message.success('签署成功！');
                    this.loadingFinishSign = false;
                    let _self = this;
                    setTimeout(() => {
                        _self.$router.push('/fileCenter/fileManage');
                    }, 500);
                });
        },
        // 连页签
        singlePerforationCoordHalfSign(info) {
            this.$api('singlePerforationCoordHalfSign')
                .post('postNormal', info)
                .then((res) => {
                    this.loadingFinishSign = false;
                    if (!res) return;
                    console.log(res);
                    this.$message.success('签署成功！');
                    this.loadingFinishSign = false;
                    let _self = this;
                    setTimeout(() => {
                        _self.$router.push('/fileCenter/fileManage');
                    }, 500);
                });
        },
        // 别人签署时调用步骤，发起方不调用
        stepsLogHttp() {
            let info = {};
            info.compactFileCode = this.fileCode;
            info.compactId = this.compactId;
            info.originalFileName = this.fileName;
            info.sealCode = this.cloudSignList[0].pictureCode;
            info.signName = this.pictureName;
            info.signatoryId = sessionStore.get('userInfo').id; // 暂无选择用户功能，随便写，不校验
            info.signatureCoordinateX = this.signSubmitPosX;
            info.signatureCoordinateY = this.signSubmitPosY;
            // info.signatureMethod = '2'; // 做标签
            info.contentType = 'json';
            info = Object.assign({}, info, this.formRule);
            delete info.signatureDirection;
            delete info.startPageNo;
            delete info.endPageNo;
            // console.log(info);
            if (this.typeActive === 1) {
                // 单页签
                info.signatureMethod = '01';
                info.signatureStartPage = this.pageNumber;
            } else if (this.typeActiveForSubmit === 2) {
                // 多页签
                info.signatureStartPage = this.formRule.startPageNo;
                info.signatureEndPage = this.formRule.endPageNo;
                info.signatureMethod = '02';
            } else if (this.typeActiveForSubmit === 3) {
                // 骑缝签
                info.signatureStartPage = this.formRule.startPageNo;
                info.signatureEndPage = this.formRule.endPageNo;
                info.signatureMethod = '03';
                info.coverPageNum =
                    this.formRule.endPageNo - this.formRule.startPageNo + 1;
                if (this.formRule.signatureDirection === 0) {
                    info.signatureCoordinateX = 0;
                } else {
                    info.signatureCoordinateX = 100;
                }
            }
            console.log(info);
            this.$api('sunshineSign')
                .post('postNormal', info)
                .then((res) => {
                    if (!res) return;
                    let _self = this;
                    console.log(res);
                    if (res.data.data) {
                        this.$message.success('签署成功！');
                        setTimeout(() => {
                            _self.$router.push({
                                path: '/fileCenter/fileDetail',
                                query: {
                                    fileCode: _self.fileCode,
                                    fileName: _self.fileName
                                }
                            });
                        }, 500);
                    }
                });
        },
        // 选择文件
        selectFile(item, index) {
            this.redirectTopPageDis = true;
            this.prePageDis = true;
            this.nextPageDis = false;
            this.redirectBottomPageDis = false;
            this.totalPage = item.filePage;
            this.fileCode = item.fileCode;
            this.fileName = item.fileName;
            this.currFile = index;
            this.pageNumber = 1;
            this.tempPageNum = 1;
            this.setStartPages(this.totalPage);
            this.getPageSingle();
        },
    },
    beforeRouteLeave (to, from, next) {
        if (to.path !== '/fileCenter/StartContract') {
            sessionStore.remove('startContractInfo');
        }
        next();
    }
};
</script>
<style lang="scss" scoped>
.cloud-sign {
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
            cursor: pointer;
            margin-right: 20px;
            margin-top: 10px;
        }

        .jumper-wrap {
            display: flex;
            align-items: top;
            margin-top: -10px;
            margin-left: 35%;
            .file-name {
                height: 54px;
                line-height: 54px;
                text-align: center;
                margin-right: 40px;
                font-size: 16px;
                width: 200px;
                overflow: hidden;
                text-overflow: ellipsis;
            }
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
                margin-top: 25px;
                li {
                    width: 80px;
                    cursor: move;
                    margin-bottom: 10px;
                    position: relative;
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
                .seal-list-item:hover::before,
                .seal-list-item:hover::after {
                    display: block;
                }
                .seal-list-item::before {
                    content: '拖动到签章位置';
                    position: absolute;
                    white-space: nowrap;
                    background: #409eff;
                    color: #fff;
                    padding: 0 5px;
                    height: 20px;
                    line-height: 20px;
                    font-size: 12px;
                    border-radius: 4px;
                    left: 50%;
                    transform: translateX(-50%);
                    top: -23px;
                    display: block;
                    text-align: center;
                    display: none;
                }
                .seal-list-item::after {
                    content: '';
                    position: absolute;
                    left: 47%;
                    top: -4px;
                    display: block;
                    border-left: transparent 5px solid;
                    border-right: transparent 5px solid;
                    border-top: solid 5px #409eff;
                    display: none;
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
                width: 85%;
                position: absolute;
                left: 50%;
                top: 10px;
                bottom: 10px;
                transform: translateX(-50%);
                // overflow: hidden;
                text-align: center;
                .sign-wrap {
                    position: absolute;
                    border: solid 1px transparent;
                    z-index: 100;
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
                .need-to-sign {
                    width: 100px;
                    height: 100px;
                    position: absolute;
                    border: dashed 1px #bdbbbb;
                    border-radius: 50%;
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
                .file-wrap {
                    position: relative;
                    height: 100%;
                    background: url('../../assets/image/default-bg.svg')
                        no-repeat center center;
                    .file {
                        min-width: 500px;
                    }
                }
            }
            .turn-page {
                position: absolute;
                bottom: 60px;
                // left: 50%;
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
        }
        .file-list {
            width: 206px;
            background: #fff;
            position: relative;
            overflow-x: hidden;
            .name{
                line-height: 40px;
                text-align: center;
                border-bottom: 1px solid #e2e2e2;
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
        top: 50px;
        bottom: 95px;
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
.cloud-sign {
    .el-tabs__header {
        margin: 0;
    }
    .el-tabs__content {
        width: 100%;
        position: absolute;
        left: 0;
        bottom: 0;
        top: 40px;
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
    .sign-pw-dialog {
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
