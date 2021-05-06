<template>
    <div class="sign-page">
        <header class="header">
            <div class="left">返回</div>
            <el-button type="primary" size="middle" @click="signContract">签署</el-button>
        </header>
        <div class="container">
            <aside class="aside">
                <div class="title">UKey签章</div>
                <div class="read-key">
                    <!-- 章模 -->
                    <div class="sign-img-container" v-if="sealImg">
                        <div class="sign-img">
                            <img :src="sealImg" alt />
                        </div>
                    </div>
                    <!-- ukey读取输入框 -->
                    <el-form :model="keyForm" v-else>
                        <el-form-item prop="keyName" class="key-name">
                            <el-input v-model="keyForm.keyName" placeholder="请插入UKey点击读取" disabled></el-input>
                            <el-button @click="readUkey">读取</el-button>
                        </el-form-item>
                        <el-form-item prop="pin">
                            <el-input
                                v-model="keyForm.pin"
                                type="password"
                                placeholder="请输入UKey的PIN密码"
                                show-password
                            ></el-input>
                        </el-form-item>
                        <el-form-item class="btn">
                            <el-button type="primary" @click="checkPin">确定</el-button>
                        </el-form-item>
                        <el-form-item prop="remember" class="remember">
                            <el-checkbox v-model="keyForm.remember">记住密码</el-checkbox>
                        </el-form-item>
                        <el-form-item class="download">
                            <span @click="download">UKey驱动下载</span>
                        </el-form-item>
                    </el-form>
                    <!-- 影子章---模拟拖动 -->
                    <div
                        class="shadow-sign"
                        v-show="shadowSeal.isShow"
                        :style="{
                            left: shadowSeal.x + 'px',
                            top: shadowSeal.y + 'px'
                        }"
                    >
                        <img
                            class="shadow-sign-img"
                            :src="sealImg"
                            :style="{
                                width: 110 + 'px',
                                height: 110 + 'px'
                            }"
                            alt="印章"
                        />
                    </div>

                    <div class="sign-desc">
                        <p>签署说明：</p>
                        <p>1、插入UKey并点击读取</p>
                        <p>2、输入PIN密码并点击确定</p>
                        <p>3、点击章模签署指定位置</p>
                        <p>4、点击签署完成签章</p>
                    </div>
                </div>
            </aside>
            <main class="main">
                <div class="file">
                    <img
                        v-if="fileCode"
                        :src="`${baseUrl}/document/scan/page/${fileCode}/${pageNo}`"
                        alt
                    />
                    <div
                        class="seal-item"
                        v-for="(item, index) in sealList"
                        :key="index"
                        :style="{
                            left: item.left +'px',
                            top: item.top +'px'
                        }"
                        :class="{dragging: item.dragging}"
                        v-show="pageNo === item.page"
                    >
                        <div
                            class="close el-icon-circle-close"
                            data-icon="1"
                            @click="delSeal(index)"
                        ></div>
                        <img :src="sealImg" alt :data-id="item.devId" />
                    </div>
                </div>
                <!-- 翻页按钮 -->
                <div class="btn-wrap">
                    <i
                        class="iconfont icon-zhiding"
                        :class="{ gray: pageNo === 1 }"
                        @click="pageTo('toFirst')"
                    ></i>
                    <i
                        class="iconfont icon-shangyiye"
                        :class="{ gray: pageNo === 1 }"
                        @click="pageTo('prev')"
                    ></i>
                    <i
                        class="iconfont icon-xiayiye"
                        :class="{
                            gray: pageNo === pageTotal
                        }"
                        @click="pageTo('next')"
                    ></i>
                    <i
                        class="iconfont icon-zhidi"
                        :class="{
                            gray: pageNo === pageTotal
                        }"
                        @click="pageTo('toLast')"
                    ></i>
                </div>
                <!-- 翻页跳转 -->
                <jumper @current-change="currChange" :tempPageNum="pageNo" :totalPage="pageTotal"></jumper>
            </main>
        </div>
    </div>
</template>

<script>
import convery2Html from './convery2Html';
import { checkBlobFileResponseUtils, sessionStore } from '@/utils';
import jumper from '@/components/jumper'

export default {
    components: { jumper },
    data() {
        return {
            // ukey信息表单
            keyForm: {
                keyName: '',
                pin: '',
                remember: false
            },
            sealImg: '', // 印章图片
            // 影子章
            shadowSeal: {
                isShow: false,
                x: 0,
                y: 0
            },
            sealList: [], // 文件上的印章列表
            timer: '', // 防止拖动重复触发
            fileCode: '', // 文件code
            pageNo: 1, // 当前页
            baseUrl: process.env.NODE_ENV === 'production' ? '/sign' : '/apis',
            fileBase64: '', // 文件的base64
            pageTotal: 1, // 总页数
            pageTimer: '', // 防止翻页重复触发
            signResult: false, // 签署结果
            domain: this.$route.query.page_domain
        };
    },
    created() {
        this.init();
        let _this = this;
        window.onunload = function () {
            if (!_this.signResult) {
                let msg = JSON.stringify({
                    return_flag: 1,
                    message: '未签署完成'
                })
                _this.domain && (document.domain != _this.domain) && (document.domain = _this.domain);
                window.opener.electronc_tag_return_fun(msg)
            }
        }
    },
    mounted() {
        this.addShadowSealMoveEvent();
        this.addSealMoveEvent();
    },
    methods: {
        // 获取初始化信息
        async init() {
            let pin = localStorage.getItem('pin');
            pin && ((this.keyForm.pin = pin), (this.keyForm.remember = true));
            let res = await this.$ukeyApi('getUKeyVersion').get();
            if (res.data.ret !== 0) return this.$message.error(res.data.errMsg);
            if (res.data.version !== '2.0.0.7')
                return this.$message.error('请使用最新驱动！');
            await this.createToken()
            this.getOrderInfo();
            this.$nextTick(() => {
                $('.main')[0].addEventListener(
                    'mousewheel',
                    this.mouseWheel
                );
                $('.main')[0].addEventListener(
                    'DOMMouseScroll',
                    this.mouseWheel
                );
            });
        },
        // 获取token
        async createToken() {
            const sendData = {
                client_id: '7962DCF4747746549493499F57C1CC55',
                client_secret: '5B1E59EFA63E4C5382DD3FC768AF18CB',
                grant_type: 'client_credentials',
                scope: 'read',
                refresh_token: ''
            };
            let res = await this.$api('createToken').post('', sendData);
            if (!res) return;
            sessionStore.set('session_token', res.data.data.access_token);
        },
        // 获取订单信息
        async getOrderInfo() {
            let res = await this.$api('getOrderInfo').get('getPath', {
                data: '6666666'
            });
            console.log(res);
            if (!res) return;
            // 订单信息转换为html字符串
            const html = convery2Html(res.data.data.order_info);
            console.log(html);
            let sendData = {
                batch_id: this.$route.query.batch_id || '6666',
                content: html,
                otherId: '123456'
            };
            // html传给后台签收货人章并返回pdf
            let res1 = await this.$api('getOrderFile').post('', sendData);
            console.log(res1);
            if (!res1) return;
            this.fileCode = res1.data.data.fileCode;
            this.getPicInfo();
            this.getFileBase64();
        },
        // 读取ukey
        async readUkey() {
            let res = await this.$ukeyApi('signCheckUkeyList').get();
            if (res.data.ret !== 0) return this.$message.error(res.data.errMsg);
            if (!res.data.keyList.length) return this.$message.error('请插入ukey');
            this.keyForm.keyName = res.data.keyList[0].key_name;
        },
        // 校验pin码
        async checkPin() {
            const sendData = {
                keyid: '0',
                pin: this.keyForm.pin
            };
            let res = await this.$ukeyApi('loginKey').post(
                'postQuery',
                sendData
            );
            if (res.data.ret !== 0) return this.$message.error(res.data.errMsg);
            let res1 = await this.$ukeyApi('getKeyInfo').get('', { keyid: 0 });
            if (res.data.ret !== 0) return this.$message.error(res.data.errMsg);
            this.sealImg = 'data:image/png;base64,' + res1.data.image;
            if (this.keyForm.remember) {
                localStorage.setItem('pin', this.keyForm.pin);
            }else {
                localStorage.removeItem('pin');
            }
        },
        // 影子章移动
        addShadowSealMoveEvent() {
            let _this = this;
            $('.container').on('mousedown', '.sign-img img', function(e) {
                e.preventDefault();
                let startX = e.pageX;
                let startY = e.pageY;
                // 文件距离页面左上角距离
                let domDistance = _this.getOffset($('.file')[0]);
                let domLeft = domDistance.left;
                let domTop = domDistance.top;
                // 鼠标距离印章左上角的距离
                let mouse2SealLeft = startX - _this.getOffset($(this)[0]).left;
                let mouse2SealTop = startY - _this.getOffset($(this)[0]).top;
                _this.shadowSeal.isShow = true;
                _this.shadowSeal.x = _this.getOffset($(this)[0]).left;
                _this.shadowSeal.y = _this.getOffset($(this)[0]).top;
                $(document).mouseup(function(e) {
                    if (e.pageX === startX) {
                        _this.shadowSeal.isShow = false;
                        $(this).unbind('mousemove');
                        $(this).unbind('mouseup');
                    }
                });
                $(document).bind('mousemove', function(e) {
                    _this.shadowSeal.x = e.pageX - mouse2SealLeft;
                    _this.shadowSeal.y = e.pageY - mouse2SealTop;
                    $(this).bind('mouseup', function(e) {
                        $(this).unbind('mousemove');
                        $(this).unbind('mouseup');
                        let left = e.pageX - mouse2SealLeft - domLeft;
                        let top =
                            e.pageY -
                            mouse2SealTop -
                            domTop +
                            $('.main')[0].scrollTop;
                        if (_this.timer) clearTimeout(_this.timer);
                        _this.timer = setTimeout(() => {
                            _this.addSeal2Page(left, top);
                            _this.shadowSeal.isShow = false;
                        }, 50);
                    });
                });
            });
        },
        addSeal2Page(left, top) {
            let fileHeight = $('.file').height();
            left = left < 0 ? 0 : left > 595 - 112 ? 595 - 112 : left;
            top = top < 0 ? 0 : top > fileHeight - 112 ? fileHeight - 112 : top;
            this.sealList.push({
                left,
                top,
                devId: +new Date(),
                dragging: false,
                page: this.pageNo
            });
        },
        delSeal(index) {
            this.sealList.splice(index, 1);
        },
        // 文件上印章移动
        addSealMoveEvent() {
            let _this = this;
            $('.file').on('mousedown', '.seal-item', function(e) {
                e.preventDefault();
                if (e.target.dataset.icon) return;
                let id = e.target.dataset.id;
                let startX = e.pageX;
                let startY = e.pageY;
                // 文件距离页面左上角距离
                let domDistance = _this.getOffset($('.file')[0]);
                let domLeft = domDistance.left;
                let domTop = domDistance.top;
                // 鼠标距离印章左上角的距离
                let mouse2SealLeft = startX - _this.getOffset($(this)[0]).left;
                let mouse2SealTop = startY - _this.getOffset($(this)[0]).top;
                $(document).mouseup(function(e) {
                    if (e.pageX === startX) return $(this).unbind('mousemove');
                });
                $(document).bind('mousemove', function(e) {
                    let item = _this.sealList.find((v) => v.devId == id);
                    item.dragging = true;
                    let left = e.pageX - mouse2SealLeft - domLeft;
                    let top = e.pageY - mouse2SealTop - domTop;
                    let fileHeight = $('.file').height();
                    left = left < 0 ? 0 : left > 595 - 112 ? 595 - 112 : left;
                    top =
                        top < 0
                            ? 0
                            : top > fileHeight - 112
                            ? fileHeight - 112
                            : top;
                    item.left = left;
                    item.top = top;
                    $(this).bind('mouseup', function(e) {
                        item.dragging = false;
                        $(this).unbind('mousemove');
                        $(this).unbind('mouseup');
                    });
                });
            });
        },
        // 获取元素距离document的距离
        getOffset(ele) {
            let pos = {
                left: 0,
                top: 0
            };
            while (ele) {
                pos.left += ele.offsetLeft;
                pos.top += ele.offsetTop;
                ele = ele.offsetParent;
            }
            return pos;
        },
        // 获取文件basee64
        async getFileBase64() {
            let _this = this;
            let res = await this.$api('getFileBinary').get('getBlob', {
                fileCode: this.fileCode
            });
            checkBlobFileResponseUtils(res.data)
                .then((res1) => {
                    let fileReader = new FileReader();
                    fileReader.readAsDataURL(res.data);
                    let base64;
                    fileReader.onload = function() {
                        _this.fileBase64 = fileReader.result.match(
                            /base64,(.*)/
                        )[1];
                    };
                })
                .catch((err) => _this.$message.error(err));
        },
        // 获取文件信息
        async getPicInfo() {
            let res = await this.$api('getPicSize').get('getPath',{fileCode: this.fileCode})
            if(!res) return
            this.pageTotal = res.data.data.totalPageNo;
        },
        // 签章
        async signContract() {
            // this.signResult = true
            // let result = JSON.stringify({
            //     return_flag: 0,
            //     message: 'res1.data.data.file.fileCode'
            // })
            // this.domain && (document.domain != this.domain) && (document.domain = this.domain);
            // window.opener.electronc_tag_return_fun(result);
            // 参数：keyid=&pdfFile=PDF文档base64数据&signinfo=json字符串(页面信息数组：
            // {"posx"=0.1;"posy"=0.1;"signtype"=IYIN_ST_SEAL;"page"=1;"signmode"=IMG_MODE_GRAYSCALE;}


            if (!this.sealList.length) return this.$message.error('请先选择印章');
            let signinfo = this.sealList.map(v=>{
                let fileWidth = 595;
                let fileHeight = $('.file').height();
                return {
                    posx: (v.left + 56) / fileWidth,
                    posy: (v.top + 56) / fileHeight,
                    signtype: 0, // 单页签
                    page: v.page,
                    signmode: 0
                }
            })
            let res = await this.$ukeyApi('signBylist').post('postQuery', {
                keyid: 0,
                pdfFile: this.fileBase64,
                signinfo: JSON.stringify(signinfo)
            })
            console.log(res);
            if (res.data.ret !== 0) return this.$message.error(res.data.errMsg);
            let res1 = await this.$api('uploadBase64').post('', {
                userId: 'cdf',
                baseFile: res.data.signedFile
            })
            if(!res1) return
            console.log(res1);
            this.signResult = true;
            let result = JSON.stringify({
                return_flag: 0,
                message: res1.data.data.file.fileCode
            })
            this.domain && (document.domain != this.domain) && (document.domain = this.domain);
            window.opener.electronc_tag_return_fun(result);
        },
        // 滚轮滚动
        mouseWheel(e) {
            let dom = $('.main');
            let fileDom = $('.file');
            let outerHeight = dom.scrollTop() > 0 ? fileDom.outerHeight() + 20 : dom.outerHeight();
            //  浏览器   firefox     其他
            //   属性   e.detail  wheelDelta
            //   向下      3        -120
            //   向上     -3         120
            // console.log(e.wheelDelta);
            // console.log(dom.scrollTop());
            // console.log(dom.outerHeight());
            // console.log(dom[0].scrollHeight);
            
            if (
                (e.wheelDelta && e.wheelDelta > 0 && dom.scrollTop() === 0) ||
                (e.detail && e.detail < 0 && dom.scrollTop() === 0)
            ) {
                // 向上
                if (this.pageTimer) {
                    return;
                }
                this.pageTimer = true;
                setTimeout(() => {
                    this.pageTo('prev');
                }, 100);
                setTimeout(() => {
                    this.pageTimer = false;
                }, 300);
            }
            if (
                (e.wheelDelta &&
                    e.wheelDelta < 0 &&
                    dom.scrollTop() + outerHeight >= dom[0].scrollHeight) ||
                (e.detail &&
                    e.detail > 0 &&
                    dom.scrollTop() + outerHeight >= dom[0].scrollHeight)
            ) {
                // 向下
                if (this.pageTimer) {
                    return;
                }
                this.pageTimer = true;
                setTimeout(() => {
                    this.pageTo('next');
                }, 100);
                setTimeout(() => {
                    this.pageTimer = false;
                }, 300);
            }
        },
        pageTo(val) {
            if (val === 'toFirst') {
                this.pageNo = 1;
            }
            if (val === 'prev') {
                if (this.pageNo === 1) {
                    return;
                }
                this.pageNo--;
            }
            if (val === 'next') {
                if (
                    this.pageNo === this.pageTotal
                ) {
                    return;
                }
                this.pageNo++;
            }
            if (val === 'toLast') {
                this.pageNo = this.pageTotal;
            }
            document.querySelector(
                '.main'
            ).scrollTop = 0;
        },
        currChange(val){
            this.pageNo = val;
        },
        download() {
            this.$downloadDriver()
        }
    },
    beforeDestroy () {
        sessionStore.remove('session_token');
    }
};
</script>

<style lang="scss" scoped>
.sign-page {
    position: absolute;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    .header {
        height: 50px;
        border-bottom: 1px solid #ccc;
        overflow: hidden;
        padding: 5px 16px;
        .left {
            float: left;
            cursor: pointer;
            line-height: 40px;
        }
        .el-button {
            float: right;
        }
    }
    .container {
        height: calc(100% - 50px);
        .aside {
            float: left;
            width: 15%;
            height: 100%;
            border-right: 1px solid #ccc;
            .title {
                height: 41px;
                line-height: 40px;
                border-bottom: 1px solid #ccc;
                text-align: center;
            }
            .read-key {
                .el-form {
                    padding: 20px;
                    .key-name {
                        padding-right: 60px;
                        .el-button {
                            position: absolute;
                            top: 2px;
                            right: -60px;
                        }
                    }
                    .btn {
                        .el-button {
                            width: 100%;
                        }
                    }
                    .remember {
                        text-align: center;
                    }
                    .download {
                        color: #409eff;
                        text-align: center;
                        cursor: pointer;
                    }
                    .btn,
                    .remember,
                    .download {
                        margin-bottom: 0;
                    }
                }
                .sign-img-container {
                    width: 100%;
                    padding: 50px;
                    text-align: center;
                    .sign-img {
                        // width: 100%;
                        img {
                            width: 112px;
                            height: 112px;
                            border: 1px solid #eee;
                            cursor: move;
                        }
                    }
                }
                .sign-desc {
                    color: #999;
                    padding-left: 16px;
                }
                .shadow-sign {
                    position: fixed;
                    cursor: move;
                    border: 1px solid #eee;
                    z-index: 3;
                }
            }
        }
        .main {
            float: left;
            width: 85%;
            height: 100%;
            padding: 10px;
            overflow: auto;
            position: relative;
            .file {
                border: 1px solid #ccc;
                width: 597px;
                // height: 844px;
                position: relative;
                img {
                    width: 100%;
                    // height: 100%;
                    vertical-align: middle;
                }
                .seal-item {
                    width: 112px;
                    height: 112px;
                    position: absolute;
                    border: 1px solid transparent;
                    cursor: move;
                    &:hover {
                        border-color: #eee;
                        .close {
                            display: block;
                        }
                    }
                    &.dragging {
                        border-color: #2a68c8;
                        z-index: 2;
                        .close {
                            display: none;
                        }
                    }
                    .close {
                        position: absolute;
                        width: 20px;
                        height: 20px;
                        border-radius: 50%;
                        right: -10px;
                        top: -10px;
                        background-color: #fff;
                        font-size: 20px;
                        color: #eee;
                        cursor: pointer;
                        display: none;
                    }
                }
            }
            .btn-wrap {
                position: absolute;
                z-index: 10;
                left: 620px;
                bottom: 110px;
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
            .jumper {
                position: absolute;
                left: 620px;
                top: 20px;
            }
        }
    }
}
</style>