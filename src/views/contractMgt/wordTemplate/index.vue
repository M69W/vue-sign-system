<template>
    <div class="word-template">
        <div class="inner">
            <div class="tmp-head d-flex">
                <span class="breadcrumb" @click="$router.go(-1)">
                    <!-- <router-link
                        :to="{path:'/contractMgt/uploadTemplate',query:{id:$route.query.id}}"
                    > -->
                        <i class="el-icon-arrow-left"></i>&nbsp;返回
                    <!-- </router-link> -->
                </span>
                <span class="step-nav flex1">
                    <img :src="step2Img" alt="设置模板" />
                </span>
                <span class="tmp-info">
                    <el-button @click="cancelTemplate">取消</el-button>
                    <el-button type="primary" @click="saveTemplate">保存</el-button>
                </span>
            </div>

            <section class="container container-sign">
                <!-- 控件列表 -->
                <div class="sign-list">
                    <div class="sign-list-box">
                        <div class="widget-title">
                            <div class="title-big title-big-tmp">模板文件列表</div>
                            <el-form class="tmp-list" ref="selectForm" :model="selectForm">
                                <el-form-item>
                                    <el-select
                                        v-model="selectForm.tmpName"
                                        @change="tmpFileChange"
                                        placeholder="请选择模板文件"
                                    >
                                        <el-option
                                            v-for="(item, index) in tmpFileList"
                                            :key="index"
                                            :label="item.fileName"
                                            :value="item.fileCode"
                                        ></el-option>
                                    </el-select>
                                </el-form-item>
                            </el-form>
                        </div>
                        <div class="widget-list">
                            <div class="title">
                                <span>控件库</span>
                                <span class="tips">请向右侧文件点击添加控件</span>
                            </div>
                            <div class="pos-sign">
                                <ul>
                                    <li
                                        v-for="(item, index) in widgetItem"
                                        class="commonClassName"
                                        :key="index"
                                        :class="item.class"
                                        @click="addControl(index)"
                                    >
                                        <i :class="item.icon"></i>
                                        {{item.title}}
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
                <!-- /控件列表 -->

                <!-- 文件签署区 -->
                <el-scrollbar class="file-area">
                    <div class="drag-wrap">
                        <div class="page-num">
                            <div class="skip-page">
                                前往
                                <input v-model.trim="skipPage" @blur="skipPageBlur" />页
                            </div>
                            <span class="number">{{ pageNumber }}/{{ totalPage }}</span>
                        </div>
                        <div class="drag-wrap-files">
                            <img
                                :src="`${baseUrl}/document/scan/page/${fileCode}/${pageNumber}?_t=${new Date().getTime()}`"
                                alt="文件"
                            />
                        </div>
                        <!-- 控件 -->
                        <vue-draggable-resizable
                            v-for="(item, index) in controlsArr"
                            :key="item.customId"
                            :ref="item.customId"
                            :custom-id="item.customId"
                            :h="item.fontSize | filterFonstSizeToHeight(item)"
                            :w="item.width"
                            :x="item.initX"
                            :y="item.initY"
                            :parent="true"
                            :common-class-name="commonClassName"
                            :class-name="item.signType | filterAccordingToType"
                            :border-class="item.borderClass"
                            :handles="item.signType | filterAccordingToType('handles')"
                            :class="{'not-click': notClick}"
                            @resizestop="onResizstop"
                            @dragstop="onDragstop"
                            @activated="onActivated(item)"
                            v-show="item.fileCode === fileCode && item.signatureStartPage === pageNumber"
                        >
                            <div :class="commonClassName" class="inner-container">
                                {{ filterSignatory(item.signUser)}}
                                <span
                                    class="name"
                                    :title="item.signName"
                                >{{ item.signName }}</span>
                            </div>
                            <i class="close iconfont icon-shanchu1" @click="removeControl(index)"></i>
                            <div class="seal-inner" :class="commonClassName">
                                <div class="seal" :class="commonClassName"></div>
                            </div>
                        </vue-draggable-resizable>
                        <!-- /控件 -->
                    </div>
                    <!-- 翻页器 -->
                    <div class="turn-page">
                        <span :class="{ disabled: pageNumber==1 }" @click="redirectTop">
                            <i class="iconfont icon-zhiding"></i>
                        </span>
                        <span :class="{ disabled: pageNumber==1 }" @click="prePage">
                            <i class="iconfont icon-shangyiye"></i>
                        </span>
                        <span :class="{ disabled: pageNumber==totalPage }" @click="nextPage">
                            <i class="iconfont icon-xiayiye"></i>
                        </span>
                        <span
                            :class="{ disabled: pageNumber==totalPage }"
                            @click="redirectBottom"
                        >
                            <i class="iconfont icon-zhidi"></i>
                        </span>
                    </div>
                    <!-- /翻页器 -->
                </el-scrollbar>

                <div class="attr-list" v-if="editing">
                    <div class="attr-list-box">
                        <div class="title-big title-big-widget">
                            <span class="title-width" v-text="`${editRow.signName}`"></span>
                            <span>控件设置</span>
                        </div>
                        <div class="attr-list-item">
                            <div class="item">
                                <el-form label-position="top" label-width="80px">
                                    <el-form-item class="switch-item">
                                        <div class="left">
                                            是否为必填项
                                            <el-tooltip
                                                class="item"
                                                effect="dark"
                                                content="该控件字段在签署合同的时候是否为必填项"
                                                placement="top"
                                            >
                                                <img src="../../../assets/image/gantanhao.svg" alt />
                                            </el-tooltip>
                                        </div>
                                        <div class="right">
                                            <el-switch
                                                v-model="editRow.isChoose"
                                                :active-value="1"
                                                :inactive-value="0"
                                                name="require"
                                                v-show="editRow.signType!=='01'&&editRow.signType!=='02'"
                                            >必填项</el-switch>
                                        </div>
                                    </el-form-item>
                                    <el-form-item label="名称" class="label-name">
                                        <el-input
                                            type="text"
                                            v-model="editRow.signName"
                                            :maxlength="30"
                                            placeholder="请输入名称"
                                        ></el-input>
                                    </el-form-item>
                                    <el-form-item label="类型" v-show="editRow.signType==='03'">
                                        <el-select v-model="editRow.fieldType" placeholder="请选择类型">
                                            <el-option
                                                v-for="(item) in typeOptions"
                                                :key="item.value"
                                                :label="item.label"
                                                :value="item.value"
                                            ></el-option>
                                        </el-select>
                                    </el-form-item>
                                    <el-form-item label="签署人设置">
                                        <el-select v-model="editRow.signUser" placeholder="请选择签署人">
                                            <el-option
                                                v-for="(item, index) in signatoryOptions"
                                                :key="index"
                                                :label="item.name"
                                                :value="item.name"
                                            ></el-option>
                                        </el-select>
                                    </el-form-item>
                                    <el-form-item v-show="editRow.signType==='04'">
                                        <div class="area-box">
                                            <div class="options-title">
                                                <span class="title">选项内容</span>
                                            </div>
                                            <div class="text-area">
                                                <el-scrollbar>
                                                    <div class="el-scrollbar-item">
                                                        <el-form-item
                                                            v-for="(domain, index) in editRow.optionContent"
                                                            :key="index"
                                                        >
                                                            <el-input
                                                                v-model="domain.value"
                                                                placeholder="请输入选项内容"
                                                            ></el-input>
                                                            <i
                                                                class="icon icon-adds"
                                                                @click="addDomain"
                                                                v-if="index === 0"
                                                            ></i>
                                                            <i
                                                                class="icon icon-remove"
                                                                @click.prevent="removeDomain(index)"
                                                                v-else
                                                            ></i>
                                                        </el-form-item>
                                                    </div>
                                                </el-scrollbar>
                                            </div>
                                        </div>
                                    </el-form-item>

                                    <el-form-item label="日期格式" v-show="editRow.signType === '05'">
                                        <el-select
                                            v-model="editRow.dateFormat"
                                            placeholder="请选择日期格式"
                                        >
                                            <el-option
                                                v-for="(item, index) in dateFormatList"
                                                :key="index"
                                                :label="item.label"
                                                :value="item.value"
                                            ></el-option>
                                        </el-select>
                                    </el-form-item>
                                    <el-form-item
                                        label="字体"
                                        v-show="editRow.signType!=='01'&&editRow.signType!=='02'"
                                    >
                                        <el-select v-model="editRow.typeface" placeholder="请选择字体">
                                            <el-option
                                                v-for="(item, index) in fontFamilyList"
                                                :key="index"
                                                :label="item.label"
                                                :value="item.value"
                                            ></el-option>
                                        </el-select>
                                    </el-form-item>
                                    <el-form-item
                                        label="字号"
                                        v-show="editRow.signType!=='01'&&editRow.signType!=='02'"
                                    >
                                        <el-select v-model="editRow.fontSize" placeholder="请选择字号">
                                            <el-option
                                                v-for="(item, index) in fontSizeOptions"
                                                :key="index"
                                                :label="item.label"
                                                :value="item.value"
                                            ></el-option>
                                        </el-select>
                                    </el-form-item>
                                    <el-form-item
                                        label="外观"
                                        v-show="editRow.signType!=='01'&&editRow.signType!=='02'"
                                    >
                                        <el-select v-model="editRow.appearance" placeholder="请选择外观">
                                            <el-option
                                                v-for="(item, index) in borderSet"
                                                :key="index"
                                                :label="item.label"
                                                :value="item.value"
                                            ></el-option>
                                        </el-select>
                                    </el-form-item>
                                </el-form>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- 模板无控件显示 -->
                <div class="tmp-null" v-else>
                    <img :src="emptyImg" alt="请选择控件" />
                    <span class="tips">
                        请从控件库中选择控件或
                        <br />选中已经添加到文件上的控件
                    </span>
                </div>
            </section>
        </div>
    </div>
</template>

<script>
import VueDraggableResizable from '@/components/vueDraggableResizable';
import { findIndex, find } from 'lodash';
import { wordFontSizeToPx, sessionStore, checkIntegral } from '@/utils';
import service from '@/mixins/service';
import arrtList from './attrList';

export default {
    components: {},
    mixins: [service],
    data() {
        return {
            baseUrl: process.env.NODE_ENV === 'development' ? '/apis' : '/sign',
            widgetItem: arrtList.widgetItem, // 控件库按钮
            fontSizeOptions: arrtList.fontSize, // 字号选择
            typeOptions: arrtList.typeItem, // 类型选择
            fontFamilyList: arrtList.fontFamilyList, // 选择字体
            dateFormatList: arrtList.dateFormat, // 日期格式
            borderSet: arrtList.border, // 外观设置
            commonClassName: 'target', // 确保点击其它非控件元素时，已激活的控件不失去焦点,作为单选高亮判定标准
            controlsArr: [], // 所有控件数组
            signatoryOptions: [], // 签署人设置
            tmpFileList: [], // 模板文件列表
            redirectTopPageDis: true, // 直达顶部
            prePageDis: true,
            nextPageDis: false,
            redirectBottomPageDis: false,
            selectForm: {
                tmpName: 'anyin123'
            },
            fileCode: '', // 文件code
            pageNumber: 1, // 当前页
            totalPage: 1, // 总页数
            skipPage: 1,
            step2Img: require('../../../assets/image/tmpManage/step2.svg'),
            emptyImg: require('../../../assets/image/tmpManage/kongjian.svg'),
            debounceTimer: null, // 鼠标滚动翻页
            notClick: false,
            templateId: '',
            // 当前编辑的数据
            editRow: {},
            templateInfo: {},
            editing: false,
            timer: '',
            isFile: !!this.$route.query.isFile
        };
    },
    components: {
        VueDraggableResizable
    },
    created() {
        this.templateId = this.$route.query.id;
        // session中取出templateInfo
        let data = sessionStore.get('templateInfo');
        this.templateInfo = data;
        this.tmpFileList = data.contractFileList.filter(
            (v) => v.fileType === '01'
        ); // 获取文件列表
        this.signatoryOptions = data.templateSignatories;
        this.selectForm.tmpName = this.fileCode =
            this.tmpFileList[0].fileCode || ''; // 默认显示第一个文件
        this.totalPage = this.tmpFileList[0].pageTotal || 1; // 获取总页数
        // 编辑渲染数据
        if (this.templateId) {
            let arr = [];
            data.contractFileList.forEach((v) =>
                v.templateFields ? (arr = arr.concat(v.templateFields)) : ''
            );
            this.controlsArr = arr;
            this.controlsArr.forEach((v) => {
                v.initX = v.signatureCoordinateX;
                v.initY = v.signatureCoordinateY;
                // 判断编辑时角色是否修改
                v.signUser = this.signatoryOptions.find(
                    (val) => val.name === v.signUser
                )
                    ? v.signUser
                    : '';
                if (v.signType === '01') {
                    v.width = 124;
                    v.height = 124;
                }
                if (v.signType === '02') {
                    v.width = 180;
                    v.height = 80;
                }
                if (v.signType === '04') {
                    v.optionContent = v.optionContent.split(',').map((val) => {
                        return { value: val };
                    });
                }
            });
        }
        this.$nextTick(() => {
            // 滚轮事件：firefox（DOMMouseScroll），其他（mousewheel）
            $('.file-area .el-scrollbar__wrap')[0].addEventListener(
                'mousewheel',
                this.fileContainerWheel
            );
            $('.file-area .el-scrollbar__wrap')[0].addEventListener(
                'DOMMouseScroll',
                this.fileContainerWheel
            );
        });
    },

    filters: {
        filterAccordingToType(controlsType, type) {
            let className = '';
            let handles = [];
            switch (controlsType) {
                case '03':
                    className = 'lq-draggable-text';
                    handles = ['mr'];
                    break;
                case '01':
                    className = 'lq-draggable-seal';
                    break;
                case '02':
                    className = 'lq-draggable-sign';
                    break;
                case '05':
                    className = 'lq-draggable-date';
                    break;
                case '04':
                    className = 'lq-draggable-select';
                    break;
                default:
                    break;
            }
            if (type && type === 'handles') {
                return handles;
            } else {
                return className;
            }
        },
        filterFonstSizeToHeight(fontSize, item) {
            if (item.signType === '01' || item.signType === '02') {
                // 印章和签名固定高度
                return item.height;
            }
            return wordFontSizeToPx(fontSize) + 10; // 上下5px padding
        }
    },
    watch: {
        // 跳转到指定页
        skipPage(val) {
            if (val) {
                if (
                    typeof +val === 'number' &&
                    val > 0 &&
                    val <= this.totalPage &&
                    checkIntegral(val)
                ) {
                    this.pageNumber = val;
                } else if (val > this.totalPage) {
                    this.$message.warning('输入页码不能大于总页数');
                    this.skipPage = this.totalPage;
                } else if (val <= 0) {
                    this.skipPage = 1;
                } else if (!oldVal) {
                    this.skipPage = this.pageNumber;
                } else {
                    this.skipPage = this.pageNumber = oldVal;
                }
            }
        }
    },
    computed: {
        filterSignatory() {
            return function(signatory) {
                let findItem = find(this.signatoryOptions, (o) => {
                    return signatory === o.signatoryId;
                });
            };
        }
    },
    methods: {
        // 点击控件
        onActivated(item) {
            // let copyData = JSON.parse(JSON.stringify(this.controlsArr));
            if (typeof item === ('number' || 'string')) {
                // 从子组件触发时参数为customId
                item = this.controlsArr.find((v) => v.customId === item);
            }
            this.controlsArr.forEach(
                (v) => (v.borderClass = v === item ? 'lq-active-class' : '')
            );
            this.editing = true;
            this.editRow = item;
        },
        // 模板文件选择
        tmpFileChange(fileCode) {
            this.fileCode = fileCode;
            this.skipPage = this.pageNumber = 1;
            this.totalPage = this.tmpFileList.find(
                (v) => v.fileCode === fileCode
            ).pageTotal;
        },
        // 缩放结束
        onResizstop(left, top, width, height, customId) {
            this.editRow.width = width;
        },
        // 拖动结束
        onDragstop(left, top) {
            this.editRow.signatureCoordinateX = left;
            this.editRow.signatureCoordinateY = top;
        },
        // 添加控件
        addControl(type) {
            // 签署方默认第一个签署人
            let signUser = this.signatoryOptions.find((v) => v.sign === 1).name;
            const controlObjMap = [
                {
                    customId: Date.now(),
                    width: 180,
                    signatureCoordinateX: 300,
                    signatureCoordinateY: 40,
                    initX: 300,
                    initY: 40,
                    className: 'lq-draggable-text',
                    signType: '03', // 控件类型
                    handles: ['mr'],
                    signName: '文本',
                    fontSize: 10,
                    fieldType: 1,
                    typeface: 1,
                    signUser, // 签署方默认第一个签署人
                    appearance: 3, // 边框外观
                    isChoose: 0,
                    signatureStartPage: this.pageNumber,
                    fileCode: this.fileCode,
                    signatureMethod: '01',
                    borderClass: 'lq-active-class'
                },
                {
                    customId: Date.now(),
                    width: 180,
                    signatureCoordinateX: 200,
                    signatureCoordinateY: 380,
                    initX: 200,
                    initY: 380,
                    className: 'lq-draggable-select',
                    signType: '04', // 控件类型
                    signName: '选项',
                    fontSize: 10,
                    typeface: 1,
                    optionContent: [{ value: '' }],
                    signUser, // 签署方默认第一个签署人
                    appearance: 3, // 边框外观
                    isChoose: 0,
                    signatureStartPage: this.pageNumber,
                    fileCode: this.fileCode,
                    signatureMethod: '01',
                    borderClass: 'lq-active-class'
                },
                {
                    customId: Date.now(),
                    width: 180,
                    signatureCoordinateX: 0,
                    signatureCoordinateY: 380,
                    initX: 0,
                    initY: 380,
                    className: 'lq-draggable-date',
                    signType: '05', // 控件类型
                    signName: '日期',
                    fontSize: 10,
                    typeface: 1,
                    dateFormat: 3,
                    signUser, // 签署方默认第一个签署人
                    appearance: 3, // 边框外观
                    isChoose: 0,
                    signatureStartPage: this.pageNumber,
                    fileCode: this.fileCode,
                    signatureMethod: '01',
                    borderClass: 'lq-active-class'
                },
                {
                    customId: Date.now(),
                    width: 124,
                    height: 124,
                    signatureCoordinateX: 0,
                    signatureCoordinateY: 140,
                    initX: 0,
                    initY: 140,
                    className: 'lq-draggable-seal',
                    signType: '01', // 控件类型
                    signName: '印章',
                    signUser, // 签署方默认第一个签署人
                    isChoose: 1,
                    signatureStartPage: this.pageNumber,
                    fileCode: this.fileCode,
                    signatureMethod: '01',
                    borderClass: 'lq-active-class'
                },
                {
                    customId: Date.now(),
                    width: 180,
                    height: 80,
                    signatureCoordinateX: 0,
                    signatureCoordinateY: 260,
                    initX: 0,
                    initY: 260,
                    className: 'lq-draggable-sign',
                    signType: '02', // 控件类型
                    signName: '签名',
                    signUser, // 签署方默认甲方
                    isChoose: 1,
                    signatureStartPage: this.pageNumber,
                    fileCode: this.fileCode,
                    signatureMethod: '01',
                    borderClass: 'lq-active-class'
                }
            ];
            let item = controlObjMap[type];
            this.controlsArr.push(item);
            this.setControlActive(item);
        },
        // 手动设置刚才添加的控件为选中状态
        setControlActive(item) {
            this.$nextTick(() => {
                // this.$refs[customId][0].elementDown();
                this.onActivated(item);
            });
        },
        // 移除控件
        removeControl(index) {
            this.controlsArr.splice(index, 1);
            this.editing = false;
        },
        // 保存模板
        async saveTemplate() {
            if (!this.controlsArr.length)
                return this.$message.warning('请先添加控件');

            // 判断名称是否为空
            let noSignName = this.controlsArr.find((v) => !v.signName.trim());
            if (noSignName) return this.$message.warning('控件名称不能为空');

            // 判断签署人是否为空
            let noSignUser = this.controlsArr.find((v) => !v.signUser);
            if (noSignUser) return this.$message.warning('请为控件选择签署人');

            // 选项内容非空判断
            let emptyOption = this.controlsArr.find(
                (v) =>
                    v.signType === '04' &&
                    (!v.optionContent.length ||
                        (v.optionContent.length &&
                            v.optionContent.find((val) => !val.value.trim())))
            );
            if (emptyOption)
                return this.$message.warning('选项控件的选项内容不能为空');
            // 当前控件数据
            let signSysTemplateFieldReqVOList = JSON.parse(
                JSON.stringify(this.controlsArr)
            );
            signSysTemplateFieldReqVOList.forEach((v) => {
                if (v.signType === '04') {
                    v.optionContent = v.optionContent
                        .map((val) => val.value)
                        .join(',');
                }
            });
            let sendData = Object.assign({}, this.templateInfo, {
                signSysTemplateFieldReqVOList
            });
            // 判断是保存还是编辑
            let url = this.templateId
                ? this.isFile ? 'editFileTemplate' : 'editContractTemplate'
                : this.isFile ? 'addFileTemplate' : 'saveContractTemplate';
            let res = await this.$api(url).post('postNormal',sendData);
            if (!res) return;
            this.$message.success('保存成功');
            let path = this.isFile ? '/fileCenter/fileTmpList' : '/contractMgt/contractTemplate';
            this.$router.push(path);
        },
        // 取消保存模板
        cancelTemplate() {
            this.$confirm(`您确认要取消模板保存吗？`, '取消保存', {
                type: 'warning',
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                customClass: 'self-icon',
                closeOnClickModal: false
            })
                .then(() => {
                    let path = this.isFile ? '/fileCenter/fileTmpList' : '/contractMgt/contractTemplate'
                    this.$router.push(path);
                })
                .catch(() => {});
        },
        // 鼠标滚动翻页
        fileContainerWheel(e) {
            let dom = $('.file-area .el-scrollbar__wrap');
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
                    dom.scrollTop() + dom.height() >=
                        dom[0].scrollHeight - 20) ||
                (e.detail &&
                    e.detail > 0 &&
                    dom.scrollTop() + dom.height() >= dom[0].scrollHeight - 20)
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
        // 向上到达顶部
        redirectTop() {
            this.skipPage = this.pageNumber = 1;
        },
        // 向上翻页
        prePage() {
            if (this.pageNumber <= 1) {
                return;
            }
            this.skipPage = --this.pageNumber;
        },
        // 向下翻页
        nextPage() {
            if (this.pageNumber >= this.totalPage) {
                return;
            }
            this.skipPage = ++this.pageNumber;
            $('.file-area .el-scrollbar__wrap')[0].scrollTop = 0;
        },
        // 向下到底
        redirectBottom() {
            this.skipPage = this.pageNumber = this.totalPage;
            $('.file-area .el-scrollbar__wrap')[0].scrollTop = 0;
        },
        // 添加选项输入框
        addDomain() {
            if (this.editRow.optionContent.length === 15) {
                return this.$message.warning('最多只能添加15个选项');
            }
            this.editRow.optionContent.push({
                value: ''
            });
        },
        // 删除选项输入框
        removeDomain(index) {
            this.editRow.optionContent.splice(index, 1);
        },
        // 页码跳转狂blur事件
        skipPageBlur() {
            if (!this.skipPage) {
                this.skipPage = this.pageNumber;
            }
        }
    },
    beforeRouteLeave(to, from, next) {
        if (to.path !== '/contractMgt/uploadTemplate' && to.path !== '/fileCenter/uploadTemplate') {
            sessionStorage.removeItem('templateInfo');
        }
        $('.file-area .el-scrollbar__wrap')[0].removeEventListener(
            'mousewheel',
            this.fileContainerWheel
        );
        $('.file-area .el-scrollbar__wrap')[0].removeEventListener(
            'DOMMouseScroll',
            this.fileContainerWheel
        );
        next();
    }
};
</script>
<style lang="scss" scoped>
.word-template {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    z-index: 9;
    background-color: #f4f6f8;
    .tmp-head {
        height: 50px;
        line-height: 50px;
        box-shadow: 0 2px 3px 0 rgba(227, 237, 242, 0.5);
        .step-nav {
            text-align: center;
            background-color: #fff;
            img {
                position: relative;
                top: 10px;
            }
        }
        .tmp-info {
            position: absolute;
            right: 30px;
            .el-button {
                width: 80px;
            }
        }
        .breadcrumb {
            position: absolute;
            left: 18px;
            color: #626262;
            cursor: pointer;
            &:hover {
                color: #0073bd;
            }
        }
    }
    .title-big {
        margin-bottom: 20px;
        font-size: 16px;
        color: #333;
        text-align: center;
        border-bottom: 1px solid #e2e2e2;
        &.title-big-tmp {
            height: 40px;
            line-height: 40px;
        }
        &.title-big-widget {
            display: flex;
            align-items: center;
            justify-content: center;
            padding: 20px 0 10px;
        }
        .title-width {
            max-width: 116px;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
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
            top: 51px;
            bottom: 0;
            .shadow-sign {
                position: absolute;
                z-index: 10000;
                cursor: move;
            }
            .sign-list {
                width: 216px;
                background: #fff;
                .title {
                    display: block;
                    margin-bottom: 20px;
                    padding: 20px 0 10px;
                    font-size: 16px;
                    color: #333;
                    border-bottom: 1px solid #e2e2e2;
                    .tips {
                        display: block;
                        margin-top: 5px;
                        font-size: 12px;
                        color: #999;
                    }
                }
                .sign-list-box {
                    width: 100%;
                    text-align: center;
                    .widget-title {
                        padding: 0 18px;
                    }
                    .widget-list {
                        padding: 0 18px;
                        border-top: 10px solid #eff2f7;
                    }
                }
                .pos-sign {
                    ul {
                        li {
                            height: 32px;
                            line-height: 32px;
                            margin: 0 auto 10px;
                            text-align: center;
                            background-color: #fafafa;
                            font-size: 14px;
                            color: #333;
                            cursor: pointer;
                            border: 1px solid transparent;
                            border-radius: 4px;
                            user-select: none;
                            &:hover {
                                border: 1px dashed #0073bd;
                                color: #0073bd;
                                border-radius: 4px;
                            }
                            i {
                                margin-right: 10px;
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
            .file-area {
                flex: 1;
                position: relative;
                padding-bottom: 20px;
                .page-num {
                    position: absolute;
                    top: -32px;
                    right: 0;
                    color: #475669;
                    font-size: 12px;
                    display: flex;
                    align-items: center;
                    .skip-page {
                        // position: absolute;
                        // top: -7px;
                        // left: 40px;
                        font-size: 13px;
                        color: #475669;
                        margin-right: 5px;
                        input {
                            width: 34px;
                            height: 28px;
                            margin: 0 5px;
                            text-align: center;
                            border-radius: 4px;
                            color: #475669;
                            font-size: 13px;
                            border: 1px solid #ccc;
                        }
                    }
                }
                .turn-page {
                    position: absolute;
                    bottom: 60px;
                    right: 50px;
                    width: 32px;
                    color: #999;
                    span {
                        display: inline-block;
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
                .drag-wrap {
                    position: relative;
                    width: 597px;
                    height: 844px;
                    margin: 36px auto 0;
                    border: solid 1px #e8e8e8;
                    .draggable {
                        cursor: move;
                    }
                    .inner-container {
                        position: relative;
                        height: 30px;
                        line-height: 30px;
                        margin-top: -20px;
                        padding-left: 10px;
                        padding-right: 25px;
                        font-size: 14px;
                        overflow: hidden;
                        text-overflow: ellipsis;
                        white-space: nowrap;
                        color: #fff;
                        background-color: #2a68c8;
                        border-radius: 4px 4px 0 0;
                        .name {
                            font-size: 12px;
                        }
                    }
                    .close {
                        font-size: 16px;
                        display: inline-block;
                        position: absolute;
                        top: -22px;
                        right: 5px;
                        z-index: 100;
                        width: 16px;
                        height: 16px;
                        color: #fff;
                        cursor: pointer;
                    }
                    .lq-draggable-text,
                    .lq-draggable-date,
                    .lq-draggable-sign,
                    .lq-draggable-select {
                        border: dashed 1px #99a9bf;
                        border-radius: 0 0 4px 4px;
                        box-sizing: border-box;
                        .inner-container {
                            position: relative;
                            top: -10px;
                            left: -1px;
                            height: 30px;
                            line-height: 30px;
                            width: inherit;
                            padding-left: 10px;
                            color: #fff;
                            background-color: #2a68c8;
                            border-radius: 4px 4px 0 0;
                        }
                    }
                    .lq-draggable-seal {
                        .inner-container {
                            margin-top: -30px;
                        }
                        .seal-inner {
                            width: 100%;
                            height: 100%;
                            border: dashed 1px #99a9bf;
                            .seal {
                                width: calc(100% - 12px);
                                height: calc(100% - 12px);
                                margin: 5px 0 0 5px;
                                border: dashed 1px #99a9bf;
                                border-radius: 50%;
                            }
                        }
                        .close {
                            top: -22px;
                        }
                    }
                    .lq-active-class {
                        border-color: rgb(14, 74, 238);
                        .seal-inner {
                            border-color: rgb(14, 74, 238);
                            .seal {
                                border-color: rgb(14, 74, 238);
                            }
                        }
                    }
                    .not-click {
                        pointer-events: none;
                        &.lq-active-class {
                            border: 1px dashed red;
                        }
                    }
                    img {
                        width: 100%;
                        height: 100%;
                    }
                }
                .set-wrap {
                    width: 230px;
                    padding: 0 10px;
                    border-left: solid 1px rgb(105, 103, 103);
                    .control-set-item {
                        margin-bottom: 20px;
                        .title {
                            margin-bottom: 5px;
                            font-size: 14px;
                        }
                    }
                }
            }
            .attr-list,
            .tmp-null {
                width: 216px;
                background-color: #fff;
                user-select: none;
            }
            .attr-list {
                .attr-list-box {
                    width: 180px;
                    margin: 0 auto;
                    .attr-list-item {
                        .el-checkbox {
                            position: absolute;
                            bottom: -32px;
                            right: 0;
                        }
                        .options-title {
                            font-size: 14px;
                            color: rgb(72, 88, 106);
                        }
                        .area-box {
                            overflow: hidden;
                            .text-area {
                                position: relative;
                                background-color: #f5f5f5;
                                border-radius: 4px;
                                height: 156px;
                                .el-input {
                                    width: 100%;
                                }
                                .el-form-item {
                                    margin-bottom: 0;
                                }
                            }
                        }
                    }
                    .switch-item {
                        overflow: hidden;
                        line-height: 40px;
                        .left {
                            float: left;
                            img {
                                vertical-align: middle;
                            }
                        }
                        .right {
                            float: right;
                            height: 40px;
                        }
                    }
                    .label-name {
                        .err-txt {
                            position: absolute;
                            bottom: -32px;
                            left: 0;
                            color: red;
                            font-size: 12px;
                        }
                    }
                }
            }
            .tmp-null {
                text-align: center;
                img {
                    padding: 90px 0 20px;
                }
                .tips {
                    display: block;
                    color: #999;
                    font-size: 14px;
                    line-height: 1.3;
                }
            }
            .choose-type {
                width: 30px;
                margin: 0 0 0 30px;
                .el-button {
                    width: 30px;
                    height: 104px;
                    line-height: initial;
                    padding: 15px 8px;
                    margin-left: 0;
                    margin-top: 20px;
                    cursor: pointer;
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
        bottom: 95px;
    }
}

.el-checkbox-group {
    width: 100%;
    display: flex;
    padding-left: 10px;
}
</style>
<style lang="scss">
.word-template {
    .el-input__inner {
        padding: 3px 10px;
    }
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
    .attr-list-item {
        .el-form--label-top {
            .el-form-item__label {
                line-height: 1;
                padding-bottom: 5px;
            }
        }
    }
    .text-area {
        .el-scrollbar {
            height: 100%;
        }
        .el-form-item {
            margin-bottom: 5px;
        }
        // .el-scrollbar-item {
        //     height: 126px;
        // }
        .el-form-item__content {
            display: flex;
            align-items: center;
            .icon {
                position: absolute;
                top: 13px;
                right: -6px;
                width: 15px;
                height: 15px;
                color: #d3dae6;
                background-color: #e8e8e8;
                border-radius: 50%;
                cursor: pointer;
                &.icon-adds {
                    background: url(../../../assets/image/tmpManage/add.svg)
                        no-repeat center;
                    background-size: 100% 100%;
                }
                &.icon-remove {
                    background: url(../../../assets/image/tmpManage/remove.svg)
                        no-repeat center;
                    background-size: 100% 100%;
                }
            }
            .el-input__inner {
                height: 30px;
                line-height: 30px;
            }
        }
        .el-scrollbar {
            .el-scrollbar__wrap {
                padding: 10px;
                padding-right: 20px;
            }
        }
    }
    .lq-active-class {
        .handle {
            position: absolute;
            right: -10px;
            top: 11px;
            z-index: 999;
            background: #eee;
            border: 1px solid #c4cfdc;
        }
        .handle.handle-mr {
            border-radius: 50%;
            width: 20px;
            height: 20px;
            margin-top: -10px;
            cursor: e-resize;
        }
        .handle-mr::before {
            content: ' ';
            width: 0;
            height: 0;
            border-top: 7px transparent solid;
            border-bottom: 7px transparent solid;
            border-right: 6px solid #c4cfdc;
            position: absolute;
            left: 2px;
            top: 2px;
        }
        .handle-mr::after {
            content: ' ';
            width: 0;
            height: 0;
            border-top: 7px transparent solid;
            border-bottom: 7px transparent solid;
            border-left: 6px solid #c4cfdc;
            position: absolute;
            right: 2px;
            top: 2px;
        }
    }
    .attr-list-box {
        .attr-list-item {
            .el-form-item {
                margin-bottom: 20px;
            }
        }
    }
}
.el-message-box {
    .el-message-box__btns {
        text-align: center;
    }
}
</style>