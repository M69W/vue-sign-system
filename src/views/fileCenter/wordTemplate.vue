<template>
    <div class="word-template">
        <div class="inner">
            <div class="tmp-head">
                <div class="breadcrumb">
                    <el-breadcrumb separator="/">
                        <el-breadcrumb-item to="/fileCenter/fileTmpList"
                            >文件模板</el-breadcrumb-item
                        >
                        <el-breadcrumb-item>添加模板</el-breadcrumb-item>
                    </el-breadcrumb>
                </div>
                <div class="tmp-info">
                    <el-row class="border">
                        <el-col :span="21">
                            <el-form :inline="true" class="form-two">
                                <el-form-item label="模板名称">
                                    <el-input
                                        v-model="templateForm.name"
                                        placeholder="请输入模板名称"
                                        clearable
                                        maxlength="30"
                                    ></el-input>
                                </el-form-item>
                                <el-form-item label="模板用途">
                                    <el-input
                                        v-model="templateForm.purpose"
                                        placeholder="请输入模板用途"
                                        clearable
                                        maxlength="30"
                                    ></el-input>
                                </el-form-item>
                            </el-form>
                        </el-col>
                        <el-col :span="3" class="right">
                            <el-button type="primary" @click="saveTemplate"
                                >保存模板</el-button
                            >
                        </el-col>
                    </el-row>
                </div>
            </div>

            <section class="container container-sign">
                <!-- 影子指定位置章框 -->
                <!-- 功能开发中暂时隐藏 -->
                <div
                    style="display:none;"
                    class="shadow-sign-setpos"
                    v-show="showShadowPosSign"
                    :style="{
                        left: shadowSetPosX + 'px',
                        top: shadowSetPosY + 'px'
                    }"
                >
                    <div
                        class="title-wrap"
                        :style="{ width: signWidth + 20 + 'px' }"
                    >
                        <div class="title-wrap-inner">
                            <p class="title js-seal-area">{{ sealArea }}</p>
                        </div>
                        <i class="el-icon-close"></i>
                    </div>
                    <div class="sign-pos-wrap">
                        <!-- <div class="sign-pos-wrap" :class="item.className"> -->
                        <div
                            class="sign-pos"
                            :style="{
                                width: signWidth + 'px',
                                height: signHeight + 'px'
                            }"
                        >
                            <!-- 盖章区1 -->
                            {{ sealArea }}
                        </div>
                    </div>
                </div>
                <!-- 功能开发中暂时隐藏 -->
                <div class="sign-list" style="display:none;">
                    <div class="title">控件表</div>
                    <div class="pos-sign js-li">
                        <ul>
                            <li class="js-widget" data-index="01">
                                <i class="iconfont icon-gaizhang"></i>盖章
                            </li>
                            <li class="js-widget" data-index="02">
                                <i class="iconfont icon-qianming"></i>签名
                            </li>
                            <li class="js-widget" data-index="03">
                                <i class="iconfont icon-qianming"></i>文本
                            </li>
                        </ul>
                    </div>
                </div>
                <!-- 功能开发中暂时隐藏 -->
                <div class="choose-type" style="display:none;">
                    <el-button
                        v-if="!needToSignArr.length"
                        @click.stop="chooseSignType(1)"
                        :type="typeActive === 1 ? 'primary' : ''"
                        >单页签章</el-button
                    >
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
                    <el-button
                        v-if="visibleContinuous"
                        @click.stop="chooseSignType(4)"
                        :type="typeActive === 4 ? 'primary' : ''"
                        >连页签章</el-button
                    >
                </div>

                <!-- 文件签署区 -->
                <div class="files" @mousewheel.stop="fileContainerWheel">
                    <div class="img-wrap" ref="fileItemWrap">
                        <div class="file-wrap" ref="fileWrap">
                            <!-- 指定固定签署位置 -->
                            <div
                                class="sign-setpos"
                                :class="item.className"
                                v-for="(item, index) in setPosArr"
                                :key="index + item.id"
                                :data-id="item.devId"
                                v-show="item.pageNo === pageNumber"
                                @click="widgeTitle(item, item.devId)"
                                :style="{
                                    left: item.signatureCoordinateX + 'px',
                                    top: item.signatureCoordinateY + 'px'
                                }"
                            >
                                <div
                                    class="title-wrap"
                                    :style="{ width: signWidth + 20 + 'px' }"
                                >
                                    <div class="title-wrap-inner">
                                        <p class="title js-seal-title">
                                            {{ item.signName }}
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
                                        <!-- 盖章区2 -->
                                        {{ item.area }}
                                    </div>
                                </div>
                            </div>

                            <!-- 固定签署位置 -->
                            <div
                                class="need-to-sign"
                                :class="'widgetType' + item.signType"
                                v-for="item in needToSignArr"
                                :key="item.signatoryId"
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
                            class="page-num"
                            v-if="turnPagePaganation"
                            :style="{ left: turnPagePaganation + 'px' }"
                        >
                            页码:{{ pageNumber }}/{{ totalPage }}
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
                <!-- 功能开发中暂时隐藏 -->
                <div class="attr-list" style="display:none;">
                    <p>盖章控件设置</p>
                    <ul>
                        <li>
                            <span>名称</span>
                            <el-input
                                type="text"
                                id="ccc"
                                :data-id="attrDataId"
                                v-model="controlName"
                            ></el-input>
                        </li>
                    </ul>
                    <div class="save-set">
                        <el-button type="primary" size="mini" @click="saveSet"
                            >保存设置</el-button
                        >
                    </div>
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
                <div slot="footer" class="dialog-footer">
                    <el-button @click.stop="closeSetRuleDialog"
                        >取 消</el-button
                    >
                    <el-button type="primary" @click.stop="dialogSure"
                        >确 定</el-button
                    >
                </div>
            </div>
        </el-dialog>
    </div>
</template>

<script>
import {
    sessionStore,
    getOffset,
    checkIntegral,
    checkBlobFileResponseUtils
} from '@/utils';
import { checkUkeyRes } from '@/mixins/checkUkeyRes';
import { findIndex } from 'lodash';
export default {
    components: {},
    mixins: [checkUkeyRes],
    data() {
        return {
            shadowX: 0,
            shadowY: 0,
            shadowSetPosX: 0,
            shadowSetPosY: 0,
            showShadowSign: false,
            showShadowPosSign: false,
            pageNumber: 1,
            fileImg: '',
            sign: '',
            cloudSignList: [],
            signatureCoordinateX: 1,
            signatureCoordinateY: 1,
            signWidth: 110,
            signHeight: 110,
            fileWidth: 0,
            fileHeight: 0,
            totalPage: 0,
            fileWidth: 0,
            fileHeight: 0,
            standerdSignWidth: 110, // 标准章宽度
            event: false, // 避免冲入绑定
            signPosX: 0, // 验证签章位置用
            signPosY: 0,
            signSubmitPosX: 0, // 签署时提交用
            signSubmitPosY: 0,
            scale: 1, // 放大、缩小倍数
            forSignData: {}, // 签署文件数据
            filePicData: {}, // 文件图片数据
            typeActive: 1,
            dialogChooseType: false,
            posSignPeople: '',
            templateForm: {
                name: '',
                purpose: ''
            },
            formRule: {
                startPageNo: 1,
                endPageNo: 1,
                signatureDirection: 1, // 0左，1右
                pageSize: '' // 骑缝签覆盖页数
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
            enterpriseOrPersonalId: '', // 企业或个人id
            removeSignPosX: '', // 移除印章按钮位置
            removeSignPosY: '', // 移除印章按钮位置
            removeIconLeft: false, // 按钮位置
            canContinueLoad: true, // 滚动时是否可以继续加载
            signSetData: {},
            debounceTimer: null,
            signType: '', // 1仅他人需要签署，2自己他人都需要
            posSignPeopleId: '', // 定位签署人id
            setPosArr: [],
            compactId: '', // 合同id
            signStatus: '', // 合同状态（01：待我签署；02：待他人签；03：签署通过；04签署不通过） ,
            turnPagePaganation: 0,
            redirectTopPageDis: true, // 直达顶部
            prePageDis: true,
            nextPageDis: false,
            redirectBottomPageDis: false,
            needToSignArr: [],
            visibleContinuous: true,
            ukeySealList: [], // ukey印章
            controlName: '', // 控件名称
            indexNum: '1', // 盖章title初始值
            indexNum2: '1', // 签名title初始值
            indexNum3: '1', // 文本title初始值
            attrDataId: '', // 自定义id属性
            sealArea: '盖章区'
        };
    },
    created() {
        this.queryTemplate();
    },
    mounted() {
        this.fileCode = this.$route.query.fileCode;
        this.fileName = this.$route.query.fileName;
        this.signStatus = this.$route.query.signStatus;
        this.compactId = this.$route.query.compactId;
        this.templateForm.name = this.fileName;
        this.signType = +this.$route.query.signType; // 1仅他人需要签署，2自己他人都需要
        this.enterpriseOrPersonalId = sessionStore.get('userInfo').enterpriseId; // 管理员所属单位id
        this.getPageListSealInfo('', '01');
        this.getSignConfig();
        this.mouseMoveSetPos(); // 固定签章位置
        this.addEventSignPosMove(); // 拖动指定印章位置
        this.renderTmp(); // 渲染模板空间位置
    },
    methods: {
        // 保存模板
        saveTemplate() {
            this.$api('addTemplate')
                .post('postNormal', {
                    tempHtml: '111',
                    tempName: this.templateForm.name,
                    tempPurpose: this.templateForm.purpose,
                    templateFiledsList: this.setPosArr,
                    templateId: this.$route.query.id
                })
                .then((res) => {
                    if (!res) return;
                    this.$message.success('编辑成功');
                    this.$router.push('/fileCenter/fileTmpList');
                });
        },
        // 渲染模板
        renderTmp() {
            this.$api('getTemplateM')
                .post(
                    'postQuery',
                    {},
                    {
                        id: this.$route.query.id
                    }
                )
                .then((res) => {
                    if (!res) return;
                    let domainList = res.data.data.templateFiledsList;
                    domainList.forEach((item) => {
                        item.signatureCoordinateX =
                            item.signatureCoordinateX * this.scale + 10;
                        item.signatureCoordinateY =
                            item.signatureCoordinateY * this.scale + 35;
                    });

                    this.needToSignArr = domainList; // 渲染印章空白位置
                });
        },
        // 查询模板详情
        queryTemplate() {
            this.$api('getTemplate')
                .get('getNormal', {
                    id: this.$route.query.id
                })
                .then((res) => {
                    if (!res) return;
                    let data = res.data.data;
                    this.templateForm.num = data.id;
                    this.templateForm.name = data.tempName;
                    this.templateForm.purpose = data.tempPurpose;
                    this.content = data.tempHtml;
                });
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
        // 拖动指定印章位置
        addEventSignPosMove() {
            let _self = this;
            $('.container-sign').on('mousedown', '.js-widget', function(e) {
                _self.widget(e);
            });
        },

        widget(e) {
            let _self = this;
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
            let dataIndex = e.currentTarget.dataset.index; // 获取当前节点自定义data属性

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
                pageStartX - contDocumentPosObj.left - signPosShadow_width / 2;
            _self.shadowSetPosY =
                pageStartY - contDocumentPosObj.top - signPosShadow_height / 2;

            let left, top;
            e.preventDefault();
            $(document).mouseup(function(e) {
                if (pageStartX === e.pageX) {
                    _self.showShadowPosSign = false;
                    return;
                }
            });

            $(document).bind('mousemove', function(e) {
                let diffX =
                    e.pageX - contDocumentPosObj.left - signPosShadow_width / 2;
                let diffY =
                    e.pageY - contDocumentPosObj.top - signPosShadow_height / 2;
                // 右边界
                let diffXmax =
                    fileDocumentPosObj.left -
                    contDocumentPosObj.left +
                    (fileWrapDom.clientWidth - fileDom.clientWidth) / 2 +
                    fileDom.clientWidth -
                    signPosShadow_width;
                // 下边界
                let diffYmax = containerDom.clientHeight - signPosShadow_height;
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
                    fileWrapDom.clientWidth * 0.16;
                let diffFileWrapFile =
                    (fileWrapDom.clientWidth - fileDom.clientWidth) / 2 -
                    fileWrapDom.clientWidth * 0.16;

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
                            fileHInner,
                            dataIndex
                        );
                    }, 50);
                });
            });
        },

        // 添加指定签章位置
        addPosSignWrap(
            addSignPosX,
            addSignPosY,
            diffWidthInner,
            fileHInner,
            dataIndex
        ) {
            let widgetTitle, signType, area, className;

            if (dataIndex === '01') {
                widgetTitle = '盖章' + this.indexNum++;
                signType = '01';
                area = '盖章区';
                this.sealArea = '盖章区';

                className = 'seal-area';
            }
            if (dataIndex === '02') {
                widgetTitle = '签名' + this.indexNum2++;
                signType = '02';
                area = '签名区';
                this.sealArea = '签名区';

                className = 'sign-area';
            }

            if (dataIndex === '03') {
                widgetTitle = '文本' + this.indexNum3++;
                signType = '03';
                area = '文本区';
                this.sealArea = '文本区';

                className = 'text-area';
            }

            let item = {
                area: area,
                id: this.posSignPeopleId, // 定位边界
                devId: Date.now(),

                className: className,
                coverPageNum: this.formRule.pageSize || 1, // 骑缝签时每枚章的覆盖页数
                signType: signType, // 位置类型(01:印章；02:签名；03:日期) ,
                pageNo: this.pageNumber,
                signatureCoordinateX: addSignPosX,
                signatureCoordinateY: addSignPosY,
                signName: widgetTitle, // 签章名称
                signatureEndPage: this.formRule.endPageNo, // 签章结束页
                signatureMethod: this.typeActive, // 签章方式 01：单页签章；02：多页签章；03：骑缝签章；04:连页签章
                signatureStartPage: this.pageNumber // 签章页或签章初始页
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
            }
            this.setPosArr.push(item);

            if (this.typeActive !== 1) {
                this.dialogChooseType = true;
            }
        },

        removePosSign({ devId }) {
            let idx = findIndex(this.setPosArr, (o) => {
                return o.devId === devId;
            });
            this.setPosArr.splice(idx, 1);
        },
        // 获取签章设置
        getSignConfig() {
            this.$api('getSignConfig')
                .get()
                .then((res) => {
                    if (!res) return;
                    let data = res.data.data;
                    this.signSetData = data;
                });
        },
        // 获取印章列表
        getPageListSealInfo(pageSeal, mediumType) {
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
        },
        // 获取文件总页数
        getFileTotalPage() {
            this.$api('getPicSize')
                .get('getPath', {
                    fileCode: this.fileCode
                })
                .then((res) => {
                    if (!res) return;
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
                .get('getBlob', {
                    fileCode: this.fileCode,
                    pageNumber: this.pageNumber
                })
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
                            _self.setStyle(url);
                        })
                        .catch((error) => {
                            _self.$message.warning(error);
                        });
                });
        },
        chooseSignType(typeNum) {
            // 签署的时候
            // if (!this.signType && typeNum !== 1) {
            //     this.$message.warning('指定位置签章不支持多页或骑缝签署！');
            //     return;
            // }
            // 发起签署只给别人设置签署位置
            if (this.signType === 1 && typeNum !== 1) {
                this.$message.warning('指定位置签章不支持多页或骑缝签署！');
                this.posSignPeople = '';
                this.posSignPeopleId = '';
                this.setPosArr = [];
            } else if (this.signType === 2 && typeNum !== 1) {
                this.posSignPeople = '';
                this.posSignPeopleId = '';
            } else if (typeNum === 1) {
            }
            this.typeActive = typeNum;
            this.cloudSignList = []; // 只支持单类型签署
        },
        closeSetRuleDialog() {
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
            if (
                this.typeActive !== 1 &&
                this.formRule.startPageNo >= this.formRule.endPageNo
            ) {
                this.$message.warning({
                    message: '结束页不能小于或等于起始页！',
                    customClass: 'zZindex'
                });
                return;
            } else {
                this.dialogChooseType = false;
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

            // 签章规则设置
            let rule = {
                startPageNo: this.formRule.startPageNo,
                endPageNo: this.formRule.endPageNo,
                signatureDirection: this.formRule.signatureDirection,
                pageSize: this.formRule.pageSize,
                methods: this.typeActive
            };

            this.dialogChooseType = false;
        },
        setStyle(fileUrl) {
            this.$nextTick(() => {
                let wrapDom = this.$refs.fileItemWrap;
                let width = wrapDom.clientWidth;
                let height = wrapDom.clientHeight;
                let colWrap = height / width;
                let colImg = this.fileHeight / this.fileWidth;

                // console.log('文档宽:' + this.fileWidth);
                // console.log('文档高:' + this.fileHeight);

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
        // 设置翻页
        signToFile(fileUrl) {
            let that = this;
            let img = new Image();
            img.src = fileUrl;
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
                that.signWidth = wh;
                that.signHeight = wh;
            };
        },
        // 控件title
        widgeTitle(title, devId) {
            this.controlName = title.signName;
            this.attrDataId = devId;
        },
        // 保存属性设置
        saveSet() {
            this.setPosArr.forEach((item) => {
                if (item.devId === this.attrDataId) {
                    item.signName = this.controlName;
                }
            });
        },
        // 固定签章
        mouseMoveSetPos() {
            let _self = this;
            let imgWrapDom = $('.img-wrap');
            let fileDom = $('.file');
            let difWidth = (imgWrapDom.outerWidth() - fileDom.outerWidth()) / 2;
            let difHeight = imgWrapDom.outerHeight() - fileDom.outerHeight();

            imgWrapDom.on('mousedown', '.sign-setpos', function(e) {
                let target = $(e.currentTarget);

                let pageStartX = e.pageX;
                let pageStartY = e.pageY;

                let moveId = +target[0].dataset.id;
                let offsetX = e.pageX - target.offset().left;
                let offsetY = e.pageY - target.offset().top;
                // 如果点击的是关闭按钮
                let clickIcon = e.target.dataset.icon;
                if (clickIcon) {
                    return;
                }
                // 点击移除拖拽
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
                    _self.setPosArr[moveIndex].signatureCoordinateX = left;
                    _self.setPosArr[moveIndex].signatureCoordinateY = top;
                    $(document).mouseup(function() {
                        $(this).unbind('mousemove');
                        $(this).unbind('mouseup');
                        // 单页签预盖章
                        if (_self.debounceTimer !== null) {
                            clearTimeout(_self.debounceTimer);
                        }
                        _self.debounceTimer = setTimeout(() => {
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
                            }
                        }, 50);
                    });
                });
            });
        },

        // 校验固定位置是否全部有章
        checkPosSignReady() {
            // 没有在固定位盖章提示
            let signInPosArr = this.cloudSignList.filter((item) => {
                return item.isPos;
            });
            console.log('没有在固定位盖章提示：' + signInPosArr);
            if (signInPosArr.length < this.needToSignArr.length) {
                this.$message.warning('请先在指定位置签署！');
                return false;
            } else {
                return true;
            }
        },
        startSign() {
            if (this.signType === 1) {
                // 指定位置盖章
                let ifHasPresignPosFalse = this.setPosArr.some((o) => {
                    return !o.preSign;
                });
                if (ifHasPresignPosFalse) {
                    this.$message.warning(
                        '系统管理员已开启安全用章功能，请勿在空白页和章下无文字处指定位置！'
                    );
                    return;
                }
            }
            if (this.signType === 2 || this.signType === 3 || !this.signType) {
                if (!this.cloudSignList.length) {
                    this.$message.warning('请拖拽签章到文件上！');
                    return;
                }
                // 没有在固定位盖章提示
                if (this.needToSignArr.length) {
                    let checkPosSignReady = this.checkPosSignReady();
                    if (!checkPosSignReady) return;
                }
                if (this.signSetData.preSign === 1 && !this.signType) {
                    let ifHasPresignFalse = this.cloudSignList.some((o) => {
                        return !o.preSign;
                    });
                    // 如果开启了于盖章功能
                    if (ifHasPresignFalse) {
                        this.$message.warning(
                            '系统管理员已开启安全用章功能，请勿在空白页和章下无文字处签署！'
                        );
                        return;
                    }
                }
            }
        }
    }
};
</script>
<style lang="scss" scoped>
.word-template {
    position: absolute;
    left: 0;
    right: 0;
    top: 0;
    bottom: 0;
    background: #f4f6f8;
    .tmp-head {
        margin-right: -30px;
        padding-left: 30px;
        border-bottom: 1px solid #e3e3e3;
        .breadcrumb {
            height: 54px;
            line-height: 54px;
            .el-breadcrumb {
                line-height: inherit;
            }
        }
    }
}
.inner {
    position: relative;
    width: 100%;
    height: 100%;
    margin: 0 auto;
    color: #333;
    .container {
        display: flex;
        position: absolute;
        width: 100%;
        left: 0;
        top: 118px;
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
                        margin-left: 10px;
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
                    .hide {
                        display: none;
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

            .seal-area {
                .sign-pos {
                    border-radius: 50%;
                }
            }

            .sign-area {
                .sign-pos {
                    border-radius: 0;
                }
            }

            .text-area {
                .sign-pos {
                    border-radius: 0;
                }
            }
        }
        .sign-list {
            width: 220px;
            background: #fff;
            position: relative;
            top: 10px;
            .title {
                display: block;
                margin: 0 20px 20px;
                padding: 20px 0 10px;
                border-bottom: 1px solid #e2e2e2;
                text-align: center;
            }
            .pos-sign {
                ul {
                    li {
                        width: 160px;
                        height: 32px;
                        line-height: 32px;
                        margin: 0 auto 10px;
                        text-align: center;
                        background-color: #fafafa;
                        font-size: 14px;
                        color: #333;
                        cursor: pointer;
                        i {
                            margin-right: 10px;
                            color: #2a68c8;
                            font-size: 14px;
                        }
                    }
                }
            }
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
            .reset-pos {
                position: absolute;
                top: 420px;
            }
        }
        .files {
            flex: 1;
            position: relative;
            .img-wrap {
                width: 68%;
                position: absolute;
                left: 50%;
                top: 10px;
                bottom: 10px;
                transform: translateX(-50%);
                // overflow: hidden;
                text-align: center;
                .sign-wrap {
                    position: absolute;
                    border: solid 1px #2a68c8;
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
                                margin-left: 10px;
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

                .seal-area {
                    .sign-pos-wrap {
                        .sign-pos {
                            border-radius: 50%;
                        }
                    }
                }

                .sign-area {
                    .sign-pos-wrap {
                        .sign-pos {
                            border-radius: 0;
                        }
                    }
                }
                .text-area {
                    .title-wrap {
                        width: 132px !important;
                    }
                    .sign-pos-wrap {
                        .sign-pos {
                            width: 120px !important;
                            height: 30px !important;
                            border-radius: 0;
                        }
                    }
                }
                .need-to-sign {
                    width: 100px;
                    height: 100px;
                    position: absolute;
                    border: dashed 1px #bdbbbb;
                }
                .widgetType01 {
                    border-radius: 50%; // 固定位置后的印章
                }
                .widgetType02 {
                    border-radius: 0;
                }
                .widgetType03 {
                    width: 120px !important;
                    height: 30px !important;
                    border-radius: 0;
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
                    img {
                        height: 100%;
                    }
                }
            }
            .page-num {
                position: absolute;
                top: 10px;
                white-space: nowrap;
                color: #999;
                font-size: 12px;
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
        .attr-list {
            width: 160px;
            padding: 10px 10px 0 10px;
            background-color: #fff;
            ul {
                li {
                    margin-top: 20px;
                    .el-input {
                        margin-top: 5px;
                    }
                }
            }
            .save-set {
                margin-top: 10px;
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
    }
}
.file-list {
    .el-scrollbar {
        width: 100%;
        position: absolute;
        left: 0;
        top: 10px;
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
        min-height: 100px;
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
.word-template {
    .el-tabs__header {
        margin: 0;
    }
    .el-tabs__content {
        width: 100%;
        position: absolute;
        top: 0;
        left: 0;
        bottom: 0;
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
    .attr-list {
        .el-input__inner {
            height: 30px;
            line-height: 30px;
        }
    }
}
</style>