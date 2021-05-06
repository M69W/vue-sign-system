<template>
    <div class="h5-sign-contract">
        <header class="header">
            <div class="left" @click="$router.go(-1)">
                <i class="el-icon-arrow-left"></i>
                <span>返回</span>
            </div>{{ isView ? isFile ? '查看文件' : '查看合同' : isFile ? '签发文件' :'签署合同' }}
        </header>
        <!-- 主体内容区 -->
        <main class="main">
            <!-- 文件选择 -->
            <div class="file-list">
                <el-select v-model="fileCode">
                    <el-option
                        v-for="item in fileList"
                        :key="item.fileCode"
                        :label="(item.fileType === '01' ? '':'（附件）')+ item.fileName"
                        :value="item.fileCode"
                    ></el-option>
                </el-select>
            </div>
            <!-- 文件容器 -->
            <div class="file-box">
                <div
                    class="file"
                    @touchstart.stop="fileTouchStart($event)"
                    @touchmove.stop="fileTouchMove($event)"
                    @touchend.stop="fileTouchEnd($event)"
                >
                    <!-- 文件图片 -->
                    <img :src="fileImg" alt />
                    <!-- 页码 -->
                    <div class="page-no">
                        <span>{{currPageNo}}</span>
                        / {{totalPage}}
                    </div>
                    <!-- 云印章 -->
                    <div
                        v-for="(item, index) in cloudSignList"
                        :key="'seal' + index"
                        class="seal-wrap"
                        :style="{ left: item.left + 'px', top: item.top + 'px', 
                        transform: item.isPostil ? 'rotate(' + item.rotateDeg + 'deg)' : 'none'}"
                        v-show="item.compactFileCode === fileCode&&
                        ((item.signatureMethod === '01' && item.signatureStartPage === currPageNo) ||
                        (item.signatureMethod === '02' && item.pageNoArr.includes(currPageNo)) ||
                        (item.signatureMethod === '03' && currPageNo <= item.signatureEndPage && currPageNo >= item.signatureStartPage))"
                        @touchstart.stop="sealTouchStart($event, index)"
                        @touchmove.stop="sealTouchmove($event, index)"
                        @touchend.stop="sealTouchend($event, index)"
                        >
                        <!-- TODO 签章操作按钮  -->
                        <span class="remove-icon el-icon-error" @click.stop="removeSeal(index)"></span>
                        <img
                            class="rotate-icon" src="../../assets/image/rotate.svg" 
                            @touchstart.stop="sealRotateTouchStart($event, index)" 
                            @touchmove.stop="sealRotateTouchMove($event, index)" 
                            @touchend.stop="sealRotateTouchEnd($event, index)"
                            v-if="item.isPostil"
                        />
                        <!-- v-if="item.pictureType == '03'" -->
                        <img                             
                            class="scale-icon" src="../../assets/image/scale.svg"
                            @touchstart.stop="sealScaleTouchStart($event, index)" 
                            @touchmove.stop="sealScaleTouchMove($event, index)" 
                            @touchend.stop="sealScaleTouchEnd($event, index)"
                            v-if="item.isPostil"
                        />

                        <!-- 印章显示 -->
                        <!-- :style="{ width: sealWidth + 'px', height: (item.pictureType==='01'?sealWidth:30) + 'px' }" -->
                        <img
                            :src="item.t_picturePath"
                            :style="{ 
                                width: item.pictureWidth * scale * (72 / 25.4)  + 'px',
                                height: item.pictureHeight * scale * (72 / 25.4) + 'px'
                            }"
                            class="seal-item"
                            alt
                        />
                    </div>
                    <!-- 固定签署位置 -->
                    <div
                        class="need-sign"
                        :class="{'is-signature':item.signType==='02'}"
                        v-for="(item, index) in needSignArr"
                        :key="'needSign' + index"
                        v-show="item.signatureStartPage === currPageNo && item.compactFileCode === fileCode"
                        :style="{
                            left: item.signatureCoordinateX * scale + 'px',
                            top: item.signatureCoordinateY * scale + 'px',
                            width: sealWidth + 'px',
                            height: (item.signType==='01'?sealWidth:30) + 'px'
                        }"
                    ></div>
                    <!-- 控件 -->
                    <div class="widget" 
                        v-for="(item, index) in templateFields" :key="'widget'+index"
                        v-show="item.signatureStartPage === currPageNo && item.compactFileCode === fileCode"
                        :style="{
                            left: item.signatureCoordinateX * scale + 'px',
                            top: item.signatureCoordinateY * scale + 'px',
                            width: item.width * scale + 'px',
                            height: wordFontSizeToPx(item.fontSize) * scale + 'px',
                            fontSize: wordFontSizeToPx(item.fontSize) * scale + 'px',
                            lineHeight: (wordFontSizeToPx(item.fontSize)*scale<12?12:wordFontSizeToPx(item.fontSize)*scale) + 'px',
                            minHeight: '14px'
                        }">
                        <input type="text" class="text" v-if="item.signType === '03'" v-model="item.content"
                            :placeholder="'请输入' + filterFieldType[item.fieldType - 1]">
                        <div class="select-date" v-if="item.signType !== '03'" 
                            :class="{'no-content': !item.content}" @click="showControl(item)">
                            {{ item.content || (item.signType === '04' ? '请点击选择选项' : '请点击选择时间') }}
                        </div>
                    </div>
                </div>
            </div>
        </main>
        <!-- 底部按钮 -->
        <footer class="footer" v-if="!isView && !isPreview">
            <div class="sign-type-btn" v-if="isFile && !iswf" @click="addPostil">手写批注</div>
            <div class="sign-type-btn" @click="openDialog('1')">签署方式</div>
            <div class="select-seal-btn" @click="openDialog('2')">
                {{!isSysUser && !sealList.length && !isEnterprise ? '新建签名' : '选择印章'}}
            </div>
            <div class="submit-sign-btn" @click="submitSign">完成签署</div>
        </footer>
        <!-- 弹框 -->
        <div class="dialog-bg" v-show="dialogVisible" @click="closeDialog">
            <div class="dialog-maintainer" :class="{show: maintainerVisible}" @click.stop>
                <div class="dialog-header">{{ dialogType==='1' ? '签章规则' : dialogType==='2' ? '选择印章' : '选择选项' }}</div>
                <div class="dialog-body">
                    <!-- 签章方式 -->
                    <div class="sign-type" v-if="dialogType==='1'">
                        <div class="type-item mb">
                            <div class="left">签署方式</div>
                            <div class="right" @click="openPopup('1')">
                                {{signatureMethodWord[signatureMethod]}}
                                <i
                                    class="el-icon-arrow-right"
                                ></i>
                            </div>
                        </div>
                        <div class="type-item mb" v-show="signatureMethod==='02'">
                            <div class="left">签章页码</div>
                            <div class="right">
                                <el-input
                                    v-model="multiplePageNo"
                                    class="w100"
                                    placeholder="请输入如1,3,5,7-10（英文逗号分割，其中-表示连序）的连页选择"
                                ></el-input>
                            </div>
                        </div>
                        <template v-if="signatureMethod==='03'">
                            <div class="type-item">
                                <div class="left">签章起始页</div>
                                <div class="right">
                                    第
                                    <el-input v-model="signatureStartPage"></el-input>页
                                    <i class="el-icon-arrow-right"></i>
                                </div>
                            </div>
                            <div class="type-item mb">
                                <div class="left">签章结束页</div>
                                <div class="right">
                                    第
                                    <el-input v-model="signatureEndPage"></el-input>页
                                    <i class="el-icon-arrow-right"></i>
                                </div>
                            </div>
                            <div class="type-item">
                                <div class="left">签章方向</div>
                                <div class="right" @click="openPopup('2')">
                                    {{ signatureDirection===1 ? '右' : '左' }}
                                    <i
                                        class="el-icon-arrow-right"
                                    ></i>
                                </div>
                            </div>
                            <div class="type-item mb">
                                <div class="left">一枚印章覆盖页数</div>
                                <div class="right">
                                    <el-input v-model="pageSize"></el-input>
                                </div>
                            </div>
                        </template>
                        <div class="type-item mb">
                            <div class="left">签章雾化</div>
                            <div class="right">
                                <el-switch
                                    v-model="foggy"
                                    active-color="#13ce66"
                                    inactive-color="#ff4949"
                                ></el-switch>
                            </div>
                        </div>
                        <div class="type-item mb">
                            <div class="left">签章脱密</div>
                            <div class="right">
                                <el-switch
                                    v-model="grey"
                                    active-color="#13ce66"
                                    inactive-color="#ff4949"
                                ></el-switch>
                            </div>
                        </div>
                        <div class="submit-sign-type" @click="submitSignType">确定</div>
                    </div>
                    <!-- 选择印章 -->
                    <div class="select-seal" v-else-if="dialogType==='2'">
                        <div
                            class="seal-item"
                            v-for="(item, index) in filterSealList"
                            :key="index"
                            @click="selectSeal(item)"
                        >
                            <div class="img-box">
                                <img :src="item.picturePath" alt />
                            </div>
                            <div class="seal-name">{{ item.pictureName }}</div>
                        </div>
                        <div class="seal-item" v-if="!filterSealList.length">暂无印章</div>
                        <div class="add-btn" v-if="!isSysUser&&isEnterprise">
                            <div class="add-btn-inner" @click="uploadSeal">上传印章</div>
                        </div>
                    </div>
                    <!-- 选择选项 -->
                    <div class="select-option" v-else>
                        <div class="option" v-for="(item, index) in activeWidget.options" :key="index" @click="selectOption(item)">
                            {{ item }}
                        </div>
                    </div>
                </div>
            </div>
            <!-- 二级弹框 -->
            <div class="popup-bg" @click.stop="closePopup" v-show="popupBgVisible">
                <div class="popup" :class="{show: popupVisible}">
                    <template v-if="popupType==='1'">
                        <div class="popup-item" @click="signatureMethod='01'">单页签章</div>
                        <div class="popup-item" @click="signatureMethod='02'">多页签章</div>
                        <div class="popup-item" @click="signatureMethod='03'">骑缝签章</div>
                    </template>
                    <template v-else>
                        <div class="popup-item" @click="signatureDirection=0">左</div>
                        <div class="popup-item" @click="signatureDirection=1">右</div>
                    </template>
                </div>
            </div>
        </div>
        <!-- 自写的日期组件 -->
        <date-picker :visible.sync="showDatePicker" @confirm="confirmTime"></date-picker>
    </div>
</template>

<script>
import { mapState } from 'vuex';
import { isMultiplePageNo, checkIntegral, sessionStore, wordFontSizeToPx } from '@/utils'
import datePicker from '../../components/datePicker'

export default {
    components: { datePicker },
    data() {
        return {
            activeWidget: {}, // 选中的时间/选项控件
            showDatePicker: false, // 时间组件显示/隐藏
            wordFontSizeToPx,
            dialogVisible: false, // 弹框可见
            maintainerVisible: false, // 弹框内层样式
            dialogType: '', // 弹框类型
            sealList: [], // 印章列表
            signatureMethod: '01', // 签章方式
            signatureMethodWord: {
                '01': '单页签章',
                '02': '多页签章',
                '03': '骑缝签章'
            },
            signatureStartPage: '1', // 骑缝签起始页
            signatureEndPage: '1', // 骑缝签结束页
            multiplePageNo: '', // 多页签页码
            signatureDirection: 1, // 骑缝签方向 0 左  1 右
            pageSize: '1', // 骑缝签一枚印章覆盖页数
            tempSignatureMethod: '01', // 临时保存签章方式
            tempSignatureStartPage: '1', // 临时保存骑缝签起始页
            tempSignatureEndPage: '1', // 临时保存骑缝签结束页
            tempMultiplePageNo: '', // 临时保存多页签页码
            tempSignatureDirection: 1, // 临时保存骑缝签方向 0 左  1 右
            tempPageSize: '1', // 临时保存骑缝签一枚印章覆盖页数
            foggy: false, // 雾化
            grey: false, // 脱密
            popupBgVisible: false, // 弹框中弹出层可见
            popupVisible: false, // 弹框中弹出层样式
            popupType: '', // 弹出层类型
            cloudSignList: [], // 签署印章列表
            contractId: this.$route.query.contractId, // 合同id
            fileList: [], // 文件列表
            fileCode: '', // 当前文件fileCode
            fileName: '', // 当前文件名
            currPageNo: 0, // 当前页码
            fileImg: '', // 当前图片路径
            totalPage: 0, // 当前文件总页数
            fileWidth: 0, // 当前文件真实宽度
            fileHeight: 0, // 当前文件真实高度
            scale: 1, // 文件缩放比
            moveStartY: 0, // 文件滑动其实坐标---用于翻页
            pageTurning: '', // 是否达到翻页条件
            needSignArr: [], // 指定的签名域
            handToSealLeft: 0, // 印章移动开始时触点距离印章左上方的距离
            handToSealTop: 0, // 印章移动开始时触点距离印章左上方的距离
            isFile: this.$route.query.isFile == '1', // 是否为签发文件签署
            isSysUser: this.$route.query.isSysUser == '1', // 是否为系统用户
            isEnterprise: this.$route.query.isEnterprise == '1', // 是否为企业用户
            validateFlag: true,
            isView: this.$route.query.isView == '1', // 是否为查看合同
            fileType: '01',
            templateFields: [],
            filterFieldType: ['文本', '手机号', '身份证号', '统一社会信用代码'],
            fileSizeList: {},
            isOfd: false, // 当前是否是OFD文件

            // 印章变换            
            startY: 0,
            startX: 0,            
            moveX: 0,
            moveY: 0,

            iswf: false,            // 是否来自工件流
            isPreview: false,       // 是否来自工作流的预览
            processInstanceId: '',  // 流程引擎跳转时对应的实例 id
            contractTheme: '',      // 合同签章主题

            isPostil: this.$route.query.isPostil == 1,
            curPictureWidth: 40,
            startRotateDeg: 0,

            tempCode: '',           // 工作流下载合同临时授权 code
        };
    },
    computed: {
        // ...mapState(['userInfo']),
        // 印章缩放后宽度
        sealWidth() {
            return this.scale * 110;
        },
        // 多页签页码数组
        multiplePageNoArr(){
            let pageNoArr = [];
            this.multiplePageNo.split(',').forEach(v => {
                if (v.indexOf('-') === -1) {
                    pageNoArr.push(+v);
                }else {
                    let num = v.split('-');
                    for (let i = num[0]; i <= num[1]; i++) {
                        pageNoArr.push(+i);
                    }
                }
            })
            return [...new Set(pageNoArr)]
        },
        // OFD文件过滤印章列表
        filterSealList() {
            return this.isOfd ? this.sealList.filter(v=>v.certificateType === '02') : this.sealList
        }
    },
    watch: {
        // fileCode改变，请求单个文件信息
        fileCode(val) {
            let _file = this.fileList.find((v) => v.fileCode === val)
            if (!_file) return

            this.fileName = _file.fileName;
            this.fileType = _file.fileType;
            let fileName = this.fileName.split('.')
            this.isOfd = fileName[fileName.length - 1].toLowerCase() === 'ofd'
            this.currPageNo = 1;
            this.getFileInfo();
        },
        currPageNo(val) {
            // this.getPageSingle();
        }
    },
    created() {
        let _query = this.$route.query
        if (_query) {
            this.iswf = _query.iswf == 1 ? true : false
            this.processInstanceId = _query.iid

            this.isPreview = _query.isPreview == 1 ? true : false
        }

        // 修复企业微信中无法从 vuex 中拿到 userInfo 的问题
        this.userInfo = sessionStore.get('userInfo')
    },
    async mounted() {
        this.getDownloadTempCode()      // 获取临时授权码

        if (this.iswf && !this.isView) {
            // ^ 来自工作流
            if (this.isPreview) {
                // ^^ 文件预览
                await this.getPreviewData()

            } else {
                await this.getSignPrepareData()
            }

        } else {
            // ^ 原有逻辑
            // 获取合同信息
            await this.getContractInfo();
            if(this.isview) return

            if(!this.isSysUser) {
                if (this.isEnterprise) {
                    this.getEnterpriseSeal()
                }else {
                    this.getBase64();
                }
                return
            };
        }

        // 获取批注
        await this.getPostil()

        window.addEventListener(
            'onorientationchange' in window ? 'orientationchange' : 'resize',
            this.orientationchange,
            false
        );

        // 获取印章列表
        if (!this.isPreview) {
            // ^ 预览的时候不需要获取印章列表
            await this.getSealList();
        }

    },
    destroyed() {
        window.removeEventListener('onorientationchange' in window ? 'orientationchange' : 'resize', this.orientationchange, false)        
    },
    methods: {
        // ------------------------------------------------------------------
        // APIS //
        // 获取从流程引擎跳转过来的签章需要的信息数据
        // `apiGetSignPrepareData` 和 `apiGetPreviewData` 返回数据是相同的，不同的是
        // 前者对权限的要求更加严格，
        // 故签章预览使用后者即可
        apiGetSignPrepareData(data) {
            return this.$api('urlGetSignPrepareData').get('getPath', data)
        },
        apiGetPreviewData(data) {
            return this.$api('urlGetPreviewData').get('getPath', data)
        },
        apiGetSealListData(data, path) {
            return this.$api('urlGetSealListData').post('postPath', data, path)
        },
        apiDoneSign(data) {
            return this.$api('initiateSignFile').post('postNormal', data)
        },
        // 获取工作流（企业微信）中下载文件临时授权 code
        apiGetDownloadTempCode() {
            return this.$api('urlGetDownloadTempCode').get()
        },
        // ------------------------------------------------------------------
        async getDownloadTempCode() {
            let res = await this.apiGetDownloadTempCode()

            if (!res) return
            this.tempCode = res.data.data

            console.log('tempCode >>> ', this.tempCode);
        },

        // 获取从流程引擎跳转过来的签章需要的信息数据
        async getSignPrepareData() {
            let _data = {
                processInsId: this.processInstanceId
            }

            let res = await this.apiGetSignPrepareData(_data)
            if (!res) return

            // console.log(res.data.data)            
            this.contractTheme = res.data.data.theme
            this.fileList = res.data.data.fileList
            this.fileList.forEach(item => {
                Object.assign(item, {fileType: '01'})
            })

            this.fileCode = this.fileList[0].fileCode;
            this.currPageNo = 1;

            if (this.isView) return
        },
        async getPreviewData() {
            let _data = {
                processInsId: this.processInstanceId
            }

            let res = await this.apiGetPreviewData(_data) 
            if (!res) return

            this.contractTheme = res.data.data.theme
            this.fileList = res.data.data.fileList
            this.fileList.forEach(item => {
                Object.assign(item, {fileType: '01'})
            })

            this.fileCode = this.fileList[0].fileCode;
            this.currPageNo = 1;

            if (this.isView) return
        },

        orientationchange() {        
            setTimeout(() => {
                var windowWidth = document.documentElement.clientWidth;
                var htmlDom = document.getElementsByTagName('html')[0];
                htmlDom.style.fontSize = windowWidth / 7.5 + 'px';
                this.scale = $('.file').width() / this.fileWidth
            }, 200)
        },

        // 获取合同信息
        async getContractInfo() {
            // 区分签发文件和合同
            let url = this.isFile ? this.isSysUser ? 'signFileDetail' : 'noTokensignFileDetail' : this.isSysUser ? 'signContractFile' : 'noTokensignContractFile'
            let res = await this.$api(url).post(
                'postQuery',
                {},
                {
                    contractId: this.contractId
                }
            );
            // console.log(res);
            if (!res) return;
            let data = res.data.data;
            this.fileList = data.compactFiles.concat(data.compactAttachments);
            this.fileCode = this.fileList[0].fileCode;
            this.currPageNo = 1;
            if (this.isView) return
            if (data.templateFields.length) {
                let signItem = data.signSysCompactSignatories.find(v => v.signContact === this.$route.query.phone)
                if (signItem) {
                    let signUser = signItem.name
                    this.templateFields = data.templateFields.filter(v => {
                        if (v.signType !== '01' && v.signType !== '02' && v.signUser === signUser) {
                            v.compactFileCode = this.fileList.find(val => val.fileCodeTemplate === v.fileCode).fileCode;
                            this.$set(v, 'content', '');
                            if (v.signType === '04') {
                                v.options = v.optionContent.split(',');
                            }
                            return true
                        }
                        return false
                    })
                    this.needSignArr = data.templateFields.filter(v => {
                        if ((v.signType === '01' || v.signType === '02') && v.signUser === signUser) {
                            v.compactFileCode = this.fileList.find(val => val.fileCodeTemplate === v.fileCode).fileCode;
                            return true
                        }
                        return false
                    })
                }
                return
            }
            // 获取指定的签名域
            this.getDomain();
        },
        // 获取签名域
        async getDomain() {
            let url = this.isSysUser ? 'signDomain' : 'noTokensignDomain'
            let res = await this.$api(url).post(
                'postQuery',
                {},
                { 
                    contractId: this.contractId,
                    personPhone: this.$route.query.phone
                 }
            );
            if (!res) return;
            this.needSignArr = res.data.data;
        },
        // 获取当前文件信息（总页数，真实宽高）
        getFileInfo() {
            let url = this.isSysUser ? 'getPicSize' : 'noTokengetPicSize'
            // 获取文件页数和真实宽高
            this.$api(url)
                .get('getPath', {
                    fileCode: this.fileCode
                })
                .then((res) => {
                    if (!res) return;
                    let { totalPageNo, width, height } = res.data.data;
                    this.totalPage = totalPageNo;
                    this.fileWidth = width;
                    this.fileHeight = height;
                    // 计算缩放比例
                    this.scale = $('.file').width() / this.fileWidth;
                    if (this.postilList && this.postilList.length) {
                        this.postilList[this.postilList.length - 1].signatureCoordinateY = this.fileHeight - 40 * 72 / 25.4 / 4 + 10
                        this.postilList = []
                    }
                    $('.main')[0].scrollTop = 0;
                    if (!this.fileSizeList.hasOwnProperty(this.fileCode)) {
                        this.fileSizeList[this.fileCode] = { width, height, scale: this.scale }
                    }
                });
            this.getPageSingle();
        },
        // 获取当前页文件图片
        getPageSingle() {
            let url = this.isSysUser ? 'pageSingle' : 'noTokenpageSingle'
            this.$api(url)
                .get('getBlob', {
                    fileCode: this.fileCode,
                    pageNumber: this.currPageNo
                })
                .then((res) => {
                    // console.log(res);
                    if (!res) return;
                    let url = window.URL.createObjectURL(res.data);
                    this.fileImg = url;
                    $('.main')[0].scrollTop = 0;
                });
        },
        // 获取印章列表
        async getSealList() {
            if (this.iswf) {
                // ^ 来自工作流
                console.log('getSealList >>>');
                console.log(this.userInfo);

                let _userInfo = sessionStore.get('userInfo')
                console.log('_userInfo >>>', _userInfo);

                // FIXME *Id 在企业微信中获取不到
                let _data = {
                    currentPage: 1,
                    pageSize: 100,
                    enterpriseOrPersonalId: this.userInfo.enterpriseId || _userInfo.enterpriseId,
                    mediumType: '01',
                    userId: this.userInfo.id || _userInfo.id
                }

                console.log(_data);

                let _path = {
                    processInsId: this.processInstanceId
                }

                let res = await this.apiGetSealListData(_data, _path)
                if (!res) return

                this.sealList = res.data.data.records

            } else {
                let url = this.isSysUser ? 'pageUserListSealInfo' : 'noTokenpageUserListSealInfo'
                let res = await this.$api(url).post(
                    'postNormal',
                    {
                        currentPage: 1,
                        pageSize: 100,
                        enterpriseOrPersonalId: this.userInfo.enterpriseId,
                        mediumType: '01',
                        userId: this.userInfo.id
                    }
                );
                // console.log(res);
                if (!res) return;
                this.sealList = res.data.data.records;
            }


            // 给每除了了手写批注之外的签章增加一个用来显示的 透明底的 `t_picturePath`
            this.sealList.forEach(item => {
                item = Object.assign(item, {
                    t_picturePath: item.picturePath                    
                })
            })

            // 插入手写备注
            // `t_signBase64` 存储的是透明底
            // `signBase64` 存储的是白色底，是真正签署的时候要用的
            // if (sessionStore.get('signBase64')) {
            //     // let _picturePath = sessionStore.get('_signBase64')
            //     let _postil = {
            //         enterpriseOrPersonalId: this.userInfo.enterpriseId,                
            //         pictureCode: +new Date(),   // 用时间戳唯一标识一下手写备注
            //         picturePath: sessionStore.get('signBase64'),
            //         t_picturePath: sessionStore.get('t_signBase64'),
            //         pictureWidth: '42',
            //         pictureHeight: '42',
            //         pictureType: '02',
            //     }

            //     this.sealList.push(_postil)
            // }

            // // 临时初始化旋转角度
            // this.sealList.forEach(item => {
            //     item = Object.assign(item, { rotateDeg: 0 })
            // })
        },

        // TODO 手写批注
        addPostil() {
            // console.log('remark...')   
            let _query = this.$route.query

            _query = Object.assign(_query, { isPostil: '1', fileCode: this.fileCode, pageNo: this.currPageNo})
            console.log(_query)

            this.$router.push({
                path: 'h5HandSign',
                query: _query
            })            
        },

        /**
         * @param {String} val '1'签署方式  '2'选择印章
         */
        // 开启印章/签章方式弹框
        openDialog(val) {
            if (this.fileType === '02') return this.$message.error({
                message: '附件不能签署',
                customClass: 'h5-z-index'
            })
            if (!this.isSysUser && !this.sealList.length && val === '2' && !this.isEnterprise) return this.$router.push({
                path: 'h5HandSign',
                query: this.$route.query
            })
            this.validateFlag = false;
            this.tempSignatureMethod = this.signatureMethod;
            this.tempSignatureStartPage = this.signatureStartPage;
            this.tempSignatureEndPage = this.signatureEndPage;
            this.tempMultiplePageNo = this.multiplePageNo;
            this.tempSignatureDirection = this.signatureDirection;
            this.tempPageSize = this.pageSize;
            this.dialogType = val;
            this.dialogVisible = true;
            this.$nextTick(() => (this.maintainerVisible = true));
        },
        /**
         * @param {String} val '1'签章方式  '2'签署方向
         */
        // 开启签章方式/方向二级弹框
        openPopup(val) {
            this.popupType = val;
            this.popupBgVisible = true;
            this.$nextTick(() => (this.popupVisible = true));
        },
        // 关闭印章/签章方式弹框
        closeDialog() {
            if (!this.validateFlag) {
                this.signatureMethod = this.tempSignatureMethod;
                this.signatureStartPage = this.tempSignatureStartPage;
                this.signatureEndPage = this.tempSignatureEndPage;
                this.multiplePageNo = this.tempMultiplePageNo;
                this.signatureDirection = this.tempSignatureDirection;
                this.pageSize = this.tempPageSize;
            }
            this.maintainerVisible = false;
            setTimeout(() => {
                this.dialogVisible = false;
            }, 300);
        },
        // 关闭签章方式/方向二级弹框
        closePopup() {
            this.popupVisible = false;
            setTimeout(() => {
                this.popupBgVisible = false;
            }, 300);
        },
        // 选择印章
        selectSeal(item) {
            let sealItem = Object.assign({}, item, {
                left: 0,
                top: 0,
                compactFileCode: this.fileCode,
                compactId: this.contractId,
                originalFileName: this.fileName,
                sealCode: item.pictureCode,
                signName: this.userInfo.userNickName,
                signType: item.pictureType || '02',
                signatoryId: this.userInfo.id,
                signatureCoordinateX: item.pictureWidth * 72 / 25.4 / 2 + 5 / this.scale,
                signatureCoordinateY: this.fileHeight - item.pictureHeight * 72 / 25.4 / 2 - 5 / this.scale,
                signatureMethod: this.signatureMethod,
                scale: this.scale
            });
            if (this.signatureMethod === '01') {
                sealItem.signatureStartPage = this.currPageNo;
            } else if (this.signatureMethod === '02') {
                sealItem.pageNo = this.multiplePageNo;
                sealItem.pageNoArr = this.multiplePageNoArr;
            } else if (this.signatureMethod === '03') {
                sealItem.signatureStartPage = this.signatureStartPage;
                sealItem.signatureEndPage = this.signatureEndPage;
                sealItem.pageSize = this.pageSize;
                sealItem.signatureDirection = this.signatureDirection;
            }
            this.cloudSignList.push(sealItem);
            this.closeDialog();
        },
        // 保存签署方式
        submitSignType() {
            if (this.signatureMethod === '02') {
            // 多页签
                if (!this.multiplePageNo.trim()) {
                    return this.$message.warning({
                        message: '请输入如1,3,5,7-10（英文逗号分割，其中-表示连序）的连页选择',
                        center: true,
                        customClass: 'h5-z-index'
                    })
                }else {
                    let res = isMultiplePageNo(this.multiplePageNo, this.totalPage)
                    // console.log(res);
                    if (!res.status) {
                        return this.$message.warning({
                            message: res.msg,
                            center: true,
                            customClass: 'h5-z-index'
                        })
                    }
                }
            }else if (this.signatureMethod === '03') {
                // 骑缝签
                if (
                    !checkIntegral(this.signatureStartPage.trim()) ||
                    !checkIntegral(this.signatureEndPage.trim())
                ) {
                    return this.$message.warning({
                        message: '页码均需为正整数！',
                        center: true,
                        customClass: 'h5-z-index'
                    });
                }
                if (this.signatureStartPage > this.totalPage || this.signatureEndPage > this.totalPage) {
                    return this.$message.warning({
                        message: '页码不能大于总页数！',
                        center: true,
                        customClass: 'h5-z-index'
                    });
                }
                if (this.signatureStartPage >= this.signatureEndPage) {
                    return this.$message.warning({
                        message: '结束页必须大于起始页！',
                        center: true,
                        customClass: 'h5-z-index'
                    });
                }
                if (
                    !checkIntegral(this.pageSize) ||
                    this.pageSize > this.signatureEndPage - this.signatureStartPage + 1
                ) {
                    return this.$message.warning({
                        message: '覆盖页数需为正整数且不超过骑缝总页数！',
                        center: true,
                        customClass: 'h5-z-index'
                    });
                }
                
            }
            this.validateFlag = true;
            this.closeDialog();
        },

        // ------------------------------------------------------------------
        // === 印章的拖动和变换 ===

        // 印章滑动开始
        sealTouchStart(e, index) {
            // 获取文件距离页面左上角的距离
            let fileLeft = $('.file').position().left;
            let fileTop = $('.file').position().top;
            // 获取触点到页面左上角的距离
            let posX = e.changedTouches[0].clientX;
            let posY = e.changedTouches[0].clientY;
            // 触点距离印章左上的距离
            this.handToSealLeft = posX - fileLeft - this.cloudSignList[index].left;
            this.handToSealTop = posY - fileTop - this.cloudSignList[index].top;
        },
        // 印章滑动
        sealTouchmove(e, index) {
            // 获取文件距离页面左上角的距离
            let fileLeft = $('.file').position().left;
            let fileTop = $('.file').position().top;
            // 获取触点到页面左上角的距离
            let posX = e.changedTouches[0].clientX;
            let posY = e.changedTouches[0].clientY;

            // 计算印章相对文件的坐标
            let sealPosX = posX - fileLeft - this.handToSealLeft;
            let sealPosY = posY - fileTop - this.handToSealTop;

            let item = this.cloudSignList[index]

            let minLeft = 0; // 左边界
            let maxLeft = $('.file').width() - item.pictureWidth * 72 / 25.4 * this.scale - 10; // 右边界
            let minTop = 0; // 上边界
            let maxTop = $('.file').height() - item.pictureHeight * 72 / 25.4 * this.scale - 10; // 下边界

            // 设置边界，触点出去印章依旧在里面
            if (sealPosX <= minLeft) {
                sealPosX = minLeft;
            } else if (sealPosX >= maxLeft) {
                sealPosX = maxLeft;
            }
            if (sealPosY <= minTop) {
                sealPosY = minTop;
            } else if (sealPosY >= maxTop) {
                sealPosY = maxTop;
            }

            item.left = sealPosX;
            item.top = sealPosY;
        },
        // 印章滑动结束
        sealTouchend(e, index) {
            let item = this.cloudSignList[index]
            item.signatureCoordinateX =
                (item.left + 5) / this.scale + item.pictureWidth * 72 / 25.4 / 2;
            item.signatureCoordinateY =
                this.fileHeight - (item.top + 5) / this.scale - item.pictureHeight * 72 / 25.4 / 2
            if (
                item.signatureMethod === '01' &&
                this.needSignArr.length
            ) {
                // 靠近制定位置时，印章自动吸附到指定位置处
                this.adsorbSignToPos(item);
            }
        },
        // 靠近指定位置时，印章自动吸附到指定位置处
        adsorbSignToPos(sealItem) {
            // console.log(sealItem);
            let needSignItem = this.needSignArr.find((v) => 
                v.signatureStartPage === this.currPageNo &&
                v.compactFileCode === this.fileCode &&
                sealItem.signatureCoordinateX >
                    v.signatureCoordinateX + 110 * 0.3 &&
                sealItem.signatureCoordinateX <
                    v.signatureCoordinateX + 110 * 0.7 &&
                this.fileHeight - sealItem.signatureCoordinateY >
                    v.signatureCoordinateY + 110 * 0.3 &&
                this.fileHeight - sealItem.signatureCoordinateY <
                    v.signatureCoordinateY + 110 * 0.7 &&
                (sealItem.pictureType || sealItem.signType) === v.signType
            );
            // console.log(needSignItem);
            if (needSignItem) {
                sealItem.isPos = true;
                sealItem.left =
                    needSignItem.signatureCoordinateX * this.scale - 5;
                sealItem.top =
                    needSignItem.signatureCoordinateY * this.scale - 5;
                sealItem.signatureCoordinateX =
                    needSignItem.signatureCoordinateX + 110 * 0.5;
                sealItem.signatureCoordinateY =
                    this.fileHeight -
                    needSignItem.signatureCoordinateY -
                    110 * 0.5;
            }else {
                sealItem.isPos = false
            }
        },
        // ---------------------------------
        // 移除印章
        removeSeal(index) {
            this.cloudSignList.splice(index, 1);
        },

        // 印章旋转
        sealRotateTouchStart(e, index) {
            this.startY = e.touches[0].pageY  
            this.startRotateDeg = this.cloudSignList[index].rotateDeg
        },
        sealRotateTouchMove(e, index) {
            // console.log('rotate move...')
            this.moveX = e.touches[0].pageX
            this.moveY = e.touches[0].pageY
            
            this.cloudSignList[index].rotateDeg = this.startRotateDeg + (this.moveY - this.startY)
        },
        sealRotateTouchEnd(e, index) {

        },

        // 印章缩放
        sealScaleTouchStart(e, index) {
            // console.log('scale start...')

            // console.log(this.cloudSignList[index].pictureWidth)
            this.startX = e.touches[0].pageX
            this.startY = e.touches[0].pageY

            this.curPictureWidth = Number(this.cloudSignList[index].pictureWidth)
        },
        sealScaleTouchMove(e, index) {
            // console.log('scale move...')

            this.moveX = e.touches[0].pageX
            this.moveY = e.touches[0].pageY              

            this.cloudSignList[index].pictureWidth = this.curPictureWidth + (this.moveX - this.startX) / this.scale * 25.4 / 72
            this.cloudSignList[index].pictureHeight = (this.curPictureWidth + (this.moveX - this.startX) / this.scale * 25.4 / 72) / 2
        },
        sealScaleTouchEnd(e, index) {
            let item = this.cloudSignList[index]

            item.signatureCoordinateX =
                (item.left + 5) / this.scale + item.pictureWidth * 72 / 25.4 / 2;
            item.signatureCoordinateY =
                this.fileHeight - (item.top + 5) / this.scale - item.pictureHeight * 72 / 25.4 / 2

        },      

        // ------------------------------------------------------------------
        // 文件滑动开始
        fileTouchStart(e) {
            this.moveStartY = e.changedTouches[0].clientY;
        },
        // 滑动文件
        fileTouchMove(e) {
            // 文件无需滑动
            if ($('.main').height() >= $('.file-box')[0].scrollHeight)
                return (this.pageTurning = true);
            // 需滑动
            // 向上
            if ($('.main').scrollTop() <= 0 && this.pageTurning !== 'prev') {
                this.pageTurning = 'prev';
                this.moveStartY = e.changedTouches[0].clientY;
            } else if (
                (($('.main').scrollTop() + $('.main').height() + 5) >=
                    $('.file-box')[0].scrollHeight) &&
                this.pageTurning !== 'next'
            ) {
                // 向下
                this.pageTurning = 'next';
                this.moveStartY = e.changedTouches[0].clientY;
            }
        },
        // 文件滑动结束
        fileTouchEnd(e) {
            if (this.pageTurning) {
                let endY = e.changedTouches[0].clientY;
                if (
                    endY - this.moveStartY > 20 &&
                    this.currPageNo > 1 &&
                    (this.pageTurning === 'prev' || this.pageTurning === true)
                ) {
                    this.currPageNo--;
                    this.getPageSingle();
                } else if (
                    this.moveStartY - endY > 20 &&
                    this.currPageNo < this.totalPage &&
                    (this.pageTurning === 'next' || this.pageTurning === true)
                ) {
                    this.currPageNo++;
                    this.getPageSingle();
                }
                this.pageTurning = '';
            }
        },
        // 完成签署
        async submitSign() {
            // 是否有章
            if (!this.cloudSignList.filter(v=>!v.isPostil).length)
                return this.$message.warning({
                    message: '请选择印章！',
                    center: true,
                    customClass: 'h5-z-index'
                });
            // 是否每个文件都有章
            let signedList = [...new Set(this.cloudSignList.map(v=>v.compactFileCode))];
            let compactList = this.fileList.filter(v=>v.fileType==='01');
            if (signedList.length !== compactList.length) return this.$message.warning({
                message: '请为所有合同文件签章',
                customClass: 'h5-z-index'
            })
            // 校验指定位置是否全部有章
            if (this.needSignArr.length && !this.checkNeedSignPos()) return
            // 统一加上雾化脱密效果
            this.cloudSignList.forEach((v) => {
                v.foggy = this.foggy;
                v.grey = this.grey;
                if (v.signatureMethod === '02') {
                    v.signatureStartPage = v.pageNo
                }else if (v.signatureMethod === '03' && v.signatureDirection === 0) {
                    v.signatureCoordinateX = 0
                }
            });
            // 控件
            let templateFields = JSON.parse(JSON.stringify(this.templateFields));
            let noFill = templateFields.find(
                (v) => !v.content && v.isChoose === 1
            );
            if (noFill) return this.$message.warning({
                message:'请为必填控件输入内容',
                customClass: 'h5-z-index'
            });
            for (const v of templateFields) {
                v.originalFileName = this.fileList.find(
                    (val) => val.fileCode === v.compactFileCode
                ).fileName;
                if (v.content) {
                    v.signatureCoordinateY =
                        this.fileSizeList[v.compactFileCode].height -
                        wordFontSizeToPx(v.fontSize) -
                        v.signatureCoordinateY;
                }
                if (v.signType === '03' && v.content) {
                    if (v.fieldType === 2 && !isPhoneNum(v.content)) {
                        return this.$message.warning({
                            message: '手机号码格式不正确',
                            customClass: 'h5-z-index'    
                        });
                    }
                    if (v.fieldType === 3 && !isCard(v.content)) {
                        return this.$message.warning({
                            message: '身份证号码格式不正确',
                            customClass: 'h5-z-index'    
                        });
                    }
                    if (v.fieldType === 4 && !isNewCredit(v.content)) {
                        return this.$message.warning({
                            message: '统一社会信用代码格式不正确',
                            customClass: 'h5-z-index'    
                        });
                    }
                }
            }
            let sendData = {
                contractId: this.contractId,
                signReqVoS: this.cloudSignList.concat(templateFields).filter(v=>!v.isPostil),
                annotations: this.cloudSignList.filter(v=>v.isPostil).map(v=>{
                    return Object.assign(v, {
                        annotationWidth: v.pictureWidth,
                        annotationHeight: v.pictureHeight,
                        isUseEventCert: !this.isSysUser,
                        signAnnotationBase64: v.picturePath.split('base64,')[1]
                    })
                })
            };
            if (!this.isSysUser) {
                // ^ 不是系统用户 或 是手写批注时
                const { phone } = this.$route.query
                const { name, personId } = sessionStore.get('contractInfo') || {}

                // 手写批注的折衷
                let _idx = this.isPostil ? this.sealList.length - 1 : 0
                sendData.handWrittenSignatureBase64 = this.sealList[_idx].picturePath.split('base64,')[1];                

                sendData.isUseEventCert = true;

                sendData.personPhone = phone;
                // 手写批注时 query 没有的字段（personId name），
                // 将其映射为 `this.userInfo.id` `this.userInfo.userNickName`
                sendData.personId = personId || this.userInfo.id;
                sendData.personName = name || this.userInfo.userNickName;

                // 目前仅适用于单个批注
                // if (this.isPostil) {
                //     // ^ 手写批注需要额外参数  
                //     sendData = Object.assign(sendData, {
                //         annotationType: true,
                //         annotationWidth: this.curPictureWidth,
                //         annotationHeight: this.curPictureWidth / 2
                //     })
                // }

                sendData.signReqVoS.forEach(v=>{
                    v.signName = name || this.userInfo.userNickName
                    v.signatoryId = personId || this.userInfo.id                    
                })
            }
            // 签署接口
            let url = 
                this.isFile ? 
                    this.isSysUser ? 'signFile' : 'noTokensignFile' : 
                    this.isSysUser ? 'signContract' : 'noTokensignContract';

            // >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
            // 
            if (this.iswf) {
                // ^ 工作流使用的签署
                url = 'initiateSignFile'

                // console.log('iswf userinfo >>>', this.userInfo);

                sendData = {
                    compactFieldInfoReqVOList: [],
                    compactTheme: this.contractTheme,
                    contractFileList: this.fileList,
                    contractId: "",
                    fileManageSignReqVOS: this.cloudSignList.concat(templateFields),
                    isSiteSign: "0",
                    orgId: this.userInfo.enterpriseId,
                    remark: "",
                    signDeadline: "",
                    signInfos: [
                        {
                            enterpriseName: "",
                            name: "",
                            signContact: this.userInfo.userName,
                            signName: this.userInfo.userNickName,
                            signType: "01",
                            signatoryId: this.userInfo.id,
                            type: "01"
                        }
                    ],
                    signWay: "01",
                    signatoryWay: "01",
                    type: "01",
                    ukeySignReqVOS: []
                }

                // console.log('sendData >>>', sendData);
            }
            // <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<
            // 实名认证存档
            // TODO 暂时注释，不知道这段代码的用途
            // let realNameRes = await this.$api('checkNeedSave').post('', {
            //     authType: this.isEnterprise ? 1 : 0,
            //     compactId: this.contractId,
            //     enterpriseName: sessionStore.get('contractInfo') && sessionStore.get('contractInfo').name,
            //     userName: this.$route.query.phone,
            //     personName: sessionStore.get('contractInfo') && sessionStore.get('contractInfo').name,
            //     personId: sessionStore.get('contractInfo') && sessionStore.get('contractInfo').personId
            // })

            // console.log(sendData)
            let res = await this.$api(url).post(
                'postNormal',
                sendData
            );
            if (!res) return;
            this.$message.success({
                message: '签署成功！',
                center: true,
                customClass: 'h5-z-index'
            });
            sessionStore.remove('signBase64')
            sessionStore.remove('_signBase64')
            sessionStore.remove('h5SealList')
            sessionStore.remove('postilList')
            let time = new Date()
            let signDate = time.getFullYear() + '-' + (time.getMonth() + 1) +'-'+ time.getDate()
            let query = { signDate, contractId: res.data.data, tempCode: this.tempCode }
            Object.assign(query, this.$route.query)
            this.$router.push({
                path: 'h5SignSuccess',
                query
            })
        },
        // 校验指定位置是否全部有章
        checkNeedSignPos() {
            // 指定位置已有章模数组
            let signInPosArr = this.cloudSignList.filter((item) => item.isPos);
            // console.log(signInPosArr);
            let flag = true;
            for (let i = 0; i < this.needSignArr.length; i++) {
                // 指定位置和已有章模对比
                flag = signInPosArr.find(
                    (v) =>
                        v.compactFileCode ===
                            this.needSignArr[i].compactFileCode &&
                        v.signatureStartPage ===
                            this.needSignArr[i].signatureStartPage &&
                        v.left ===
                            this.needSignArr[i].signatureCoordinateX * v.scale -
                                5 &&
                        v.top ===
                            this.needSignArr[i].signatureCoordinateY * v.scale -
                                5
                );
                if (!flag) {
                    this.$message.warning({
                        message: '请先在指定位置签署！',
                        center: true,
                        customClass: 'h5-z-index'
                    });
                    break;
                }
            }
            return flag;
        },
        // 非系统用户拿到签名
        getBase64() {
            let base64 = sessionStore.get('signBase64')
            let _base64 = sessionStore.get('t_signBase64')
            if(!base64) return
            let now = +new Date()
            this.sealList = [{
                picturePath: base64,
                t_picturePath: _base64,
                pictureCode: now,
                pictureWidth: '40',
                pictureHeight: '20'
            }]
        },
        // 确定提交时间
        confirmTime(date) {
            // console.log(date);
            this.activeWidget.content = date
        },
        // 
        showControl(item) {
            this.activeWidget = item
            item.signType === '04' && (this.openDialog('3'))
            item.signType === '05' && (this.showDatePicker = true)
        },
        // 选择选项
        selectOption(item) {
            this.activeWidget.content = item
            this.closeDialog()
        },
        // 上传章模
        uploadSeal() {
            this.$router.push({
                path: 'h5UploadSeal',
                query: this.$route.query
            })
        },
        // 获取上传的印章
        getEnterpriseSeal() {
            const sealList = sessionStore.get('h5SealList') || []
            this.sealList = sealList
            this.sealList.forEach(item => {
                item = Object.assign(item, {
                    t_picturePath: item.picturePath                    
                })
            })
        },
        // 获取批注
        // 批注默认长 40mm 宽 20mm
        getPostil() {
            let postilList = sessionStore.get('postilList') || []
            if (postilList.length) {
                let lastItem = postilList[postilList.length - 1]
                this.fileCode = lastItem.compactFileCode
                this.currPageNo = lastItem.signatureStartPage
                Object.assign(postilList[postilList.length - 1], {
                    left: 0,
                    top: 0,
                    compactId: this.contractId,
                    originalFileName: this.fileName,
                    sealCode: '',
                    signName: this.userInfo.userNickName || '',
                    signType: '02',
                    signatoryId: this.userInfo.id || '',
                    signatureCoordinateX: 40 * 72 / 25.4 / 2 + 10,
                    signatureCoordinateY: this.fileHeight - 40 * 72 / 25.4 / 4 + 10,
                    signatureMethod: '01',
                    scale: this.scale,
                    pictureWidth: 40,
                    pictureHeight: 20,
                    rotateDeg: 0,
                    isPostil: true
                })
                this.postilList = postilList
                this.cloudSignList = postilList
            }
        }
    },
    beforeRouteLeave (to, from, next) {
        if (to.path === '/h5sign/h5HandSign') {
            sessionStore.set('postilList', this.cloudSignList)
        }
        next()
    }
};
</script>

<style lang="scss" scoped>
.h5-sign-contract {
    font-size: 0.24rem;
    position: absolute;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    background-color: #f1f2f6;
    display: flex;
    flex-direction: column;
    .header {
        height: 0.88rem;
        line-height: 0.88rem;
        font-size: 0.3rem;
        color: #fff;
        background-image: radial-gradient(100% 100%, #006efe 0%, #494aff 100%);
        position: relative;
        text-align: center;
        .left {
            position: absolute;
            left: 0;
        }
    }
    .main {
        flex: 1;
        overflow: auto;
        padding-top: 0.7rem;
        .file-box {
            flex: 1;
            width: 100%;
            padding: 0.2rem;
            overflow-x: hidden;
            overflow-y: auto;
            .file {
                width: 100%;
                position: relative;
                > img {
                    width: 100%;
                    vertical-align: middle;
                }
                .page-no {
                    width: 1.12rem;
                    height: 0.4rem;
                    line-height: 0.4rem;
                    border-radius: 0.2rem;
                    text-align: center;
                    position: absolute;
                    right: 0.1rem;
                    top: 0.2rem;
                    background-color: #ccc;
                    opacity: 0.5;
                    color: #3f3f3f;
                    > span {
                        color: #282828;
                    }
                }
                .seal-wrap {
                    position: absolute;
                    padding: 4px;
                    border: 1px dashed #006efe;
                    border-radius: 4px;
                    background-color: rgba(0, 110, 254, 0.1);
                    touch-action: none;
                    z-index: 1;

                    .rotate-icon,
                    .scale-icon,
                    .remove-icon {
                        width: 0.32rem;
                        height: 0.32rem;
                        // top: -0.16rem;
                        // right: -0.16rem;
                        font-size: 0.32rem;
                        position: absolute;
                        // background-color: #aaa;
                        border-radius: 0.32rem;
                    }
                    .remove-icon {
                        left: -0.16rem;
                        top: -0.16rem;
                    }
                    .rotate-icon {
                        top: -0.16rem;
                        right: -0.16rem;
                    }
                    .scale-icon {
                        right: -0.16rem;
                        bottom: -0.16rem;
                    }

                    img {
                        vertical-align: middle;
                    }
                }
                .need-sign {
                    position: absolute;
                    border: dashed 1px #bdbbbb;
                    border-radius: 50%;
                    &.is-signature {
                        border-radius: 0;
                    }
                }
                .widget {
                    position: absolute;
                    border: 1px solid #ccc;
                    > input {
                        width: 100%;
                        height: 100%;
                        border: none;
                        vertical-align: middle;
                        position: absolute;
                        top: 0;
                        left: 0;
                        right: 0;
                        bottom: 0;
                    }
                    .select-date {
                        position: absolute;
                        left: 0;
                        top: 0;
                        right: 0;
                        bottom: 0;
                        &.no-content {
                            color: #999;
                        }
                    }
                }
            }
        }
    }
    .footer {
        height: 0.98rem;
        line-height: 0.98rem;
        display: flex;
        align-items: center;
        text-align: center;
        background-color: #fff;
        color: #666;
        > div {
            width: 33.33%;
            position: relative;
        }
        .submit-sign-btn {
            background-color: #006efe;
            color: #fff;
        }
        .sign-type-btn:after {
            content: '';
            width: 1px;
            height: 0.78rem;
            background-color: #e2e2e2;
            position: absolute;
            right: 0;
            top: 0.1rem;
        }
    }
    .dialog-bg {
        position: absolute;
        top: 0;
        bottom: 0;
        left: 0;
        right: 0;
        background-color: rgba(0, 0, 0, 0.3);
        z-index: 3;
        .dialog-maintainer {
            width: 100%;
            height: 80%;
            background-color: #f1f2f6;
            position: absolute;
            bottom: 0;
            transform: translateY(100%);
            transition: all 0.3s ease-out;
            display: flex;
            flex-direction: column;
            border-radius: 0.12rem 0.12rem 0 0;
            overflow: hidden;
            &.show {
                transform: translateY(0);
            }
            .dialog-header {
                height: 0.88rem;
                line-height: 0.88rem;
                text-align: center;
                border-bottom: 1px solid #ccc;
                font-size: 0.32rem;
            }
            .dialog-body {
                flex: 1;
                overflow-x: hidden;
                overflow-y: auto;
                .sign-type {
                    padding-top: 0.24rem;
                    .type-item {
                        height: 1.12rem;
                        padding: 0 0.32rem;
                        display: flex;
                        justify-content: space-between;
                        align-items: center;
                        font-size: 0.32rem;
                        position: relative;
                        background-color: #fff;
                        &.mb {
                            margin-bottom: 0.24rem;
                        }
                        &:after {
                            content: '';
                            width: 100%;
                            height: 1px;
                            background-color: #eee;
                            position: absolute;
                            left: 0.32rem;
                            bottom: 0;
                        }
                        .left {
                            color: #282828;
                        }
                        .right {
                            color: #666;
                            text-align: right;
                            .el-input {
                                width: 1rem;
                                margin: 0 0.1rem;
                                &.w100 {
                                    width: 100%;
                                }
                            }
                        }
                    }
                    .submit-sign-type {
                        width: 6.86rem;
                        height: 0.98rem;
                        line-height: 0.98rem;
                        background-color: #006efe;
                        border-radius: 0.6rem;
                        margin: 0.2rem auto;
                        color: #fff;
                        text-align: center;
                        font-size: 0.36rem;
                    }
                }
                .select-seal {
                    .seal-item {
                        width: 100%;
                        height: 1.68rem;
                        padding: 0 0.32rem;
                        display: flex;
                        align-items: center;
                        font-size: 0.32rem;
                        color: #282828;
                        background-color: #fff;
                        position: relative;
                        &:after {
                            content: '';
                            width: 100%;
                            height: 1px;
                            background-color: #eee;
                            position: absolute;
                            left: 0.32rem;
                            bottom: 0;
                        }
                        .img-box {
                            width: 1.1rem;
                            height: 1.1rem;
                            text-align: center;
                            line-height: 1.1rem;
                            margin-right: 0.24rem;
                            img {
                                max-width: 100%;
                                max-height: 100%;
                                vertical-align: middle;
                            }
                        }
                    }
                    .add-btn {
                        padding: .20rem .32rem;
                        &-inner {
                            height: .96rem;
                            border-radius: .48rem;
                            background-color: #006efe;
                            color: #fff;
                            font-size: .36rem;
                            text-align: center;
                            line-height: .96rem;
                        }
                    }
                }
                .select-option {
                    overflow-x: hidden;
                    overflow-y: auto;
                    .option {
                        height: .98rem;
                        font-size: .32rem;
                        line-height: .96rem;
                        text-align: center;
                        border-bottom: 1px solid #ddd;
                    }
                }
            }
        }
        .popup-bg {
            position: fixed;
            top: 0;
            bottom: 0;
            left: 0;
            right: 0;
            background-color: rgba(0, 0, 0, 0.3);
            .popup {
                width: 100%;
                position: absolute;
                bottom: 0;
                transform: translateY(100%);
                transition: all 0.3s ease-out;
                &.show {
                    transform: translateY(0);
                }
                &-item {
                    text-align: center;
                    height: 1rem;
                    line-height: 1rem;
                    border-bottom: 1px solid #eee;
                    font-size: 0.36rem;
                    background-color: #fff;
                }
            }
        }
    }
}
</style>

<style lang="scss">
.h5-sign-contract {
    .sign-type {
        .type-item {
            .right {
                .el-input__inner {
                    padding: 0 0.1rem;
                    text-align: center;
                }
            }
        }
    }
    .main {
        .file-list {
            position: absolute;
            top: 0.88rem;
            left: 0;
            width: 100%;
            z-index: 2;
            .el-select {
                width: 100%;
                .el-input__inner {
                    font-size: 0.24rem;
                    height: 0.7rem;
                    line-height: 0.7rem;
                }
            }
        }
    }
}
</style>