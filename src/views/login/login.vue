<template>
    <div
        class="wrapper"
        :style="{ backgroundImage: `url(${loginBg})`, backgroundSize: 'cover' }"
    >
        <h1 class="website-title" v-text="websiteTitle"></h1>
        <div class="wrapper-box">
            <!-- <div class="logo">
                <div class="logo-big">
                    <img :src="logoUrl" alt="logo" />
                </div>
                <h3 class="title">电子签章系统</h3>
                <p class="version">v 1.0.0</p>
            </div> -->
            <!-- <h1 class="website-title" v-text="websiteTitle"></h1> -->
            <div class="login">
                <!-- <img :src="imgs.back" alt class="back" ref="back" /> -->
                <div class="login-form">
                    <div class="logo-pic">
                        <!-- <img :src="milogoUrl" alt="logo" /> -->
                        <h2 class="title">前台用户登录</h2>
                    </div>
                    <h5 class="form-title">{{isMsgLogin?'短信验证码登录':'账号登录'}}</h5>
                    <el-form
                        :model="loginInfo"
                        :rules="rulesLoginInfo"
                        ref="loginInfo"
                        :class="{ 'login-error': loginError }"
                    >
                        <!-- 用户名 -->
                        <el-form-item prop="userName">
                            <el-input
                                class="no-border border-bottom ipt-name"
                                size="medium"
                                v-model="loginInfo.userName"
                                :placeholder="isMsgLogin?'请输入手机号':'请输入邮箱或手机号码'"
                                maxlength="30"
                                autocomplete="off"
                                @keyup.enter.native="goLogin('loginInfo')"
                            ></el-input>
                            <i class="iconfont icon-yonghuming"></i>
                        </el-form-item>
                        <!-- 短信验证码 -->
                        <el-form-item prop="smsValidateCode" v-if="isMsgLogin">
                            <el-input
                                class="no-border border-bottom"
                                size="medium"
                                v-model="loginInfo.smsValidateCode"
                                placeholder="请输入短信验证码"
                                @keyup.enter.native="goLogin('loginInfo')"
                            >
                            </el-input>
                            <el-button 
                                class="count-down" 
                                size="small" type="paimary"
                                :disabled="getCodeDisabled"
                                @click="getCode">{{!isNum?'获取验证码':second+'s'}}</el-button>
                        </el-form-item>
                        <!-- 密码 -->
                        <el-form-item prop="password" v-else>
                            <el-input
                                class="no-border border-bottom"
                                size="medium"
                                :type="passType"
                                v-model="loginInfo.password"
                                placeholder="请输入6~16位密码"
                                maxlength="16"
                                autocomplete="off"
                                @keyup.enter.native="goLogin('loginInfo')"
                            >
                                <i
                                    @click="showVerPass"
                                    slot="suffix"
                                    class="iconfont"
                                    :class="{
                                        'icon-buxianshimima':
                                            passType === 'password',
                                        'icon-xianshimima': passType === 'text'
                                    }"
                                ></i>
                            </el-input>
                            <i class="iconfont icon-mima1"></i>
                        </el-form-item>
                        <!-- 验证码 -->
                        <el-form-item prop="valicode">
                            <el-input
                                class="no-border border-bottom ipt-code"
                                size="medium"
                                v-model="loginInfo.valicode"
                                placeholder="请输入右侧验证码"
                                maxlength="4"
                                autocomplete="off"
                                @keyup.enter.native="goLogin('loginInfo')"
                            ></el-input>
                            <span class="tips" @click="codeImgBtn"
                                >看不清,换一张</span
                            >
                            <span class="code" @click="codeImgBtn">
                                <img :src="codeImg" alt="验证码" />
                            </span>
                        </el-form-item>
                        <div class="rememberPass">
                            <div class="remember">
                                <el-checkbox
                                    v-model="rememberPass"
                                    @change="rememberPassFn"
                                    >记住密码</el-checkbox
                                >
                            </div>
                            <div class="switch-type" @click="switchLoginType">{{isMsgLogin?'密码登录':'短信验证码登录'}}</div>
                        </div>
                    </el-form>
                    <p class="error-mention" v-if="loginError">
                        账号或密码错误，请输入正确的账号和密码
                    </p>
                    <el-button
                        class="login-btn"
                        type="primary"
                        @click="goLogin('loginInfo')"
                        plain
                        >登录</el-button
                    >
                </div>
            </div>
        </div>
        <div class="footer-box">
            <!-- 暂无跳转链接，先隐藏 -->
            <!-- <div class="explain">
                <span><el-link>帮助</el-link></span>
                <span><el-link>隐私</el-link></span>
                <span><el-link>条款</el-link></span>
            </div> -->
            <!-- <span class="copyright">
                <em>深圳市安印科技有限公司</em
                >提供技术支持&nbsp;&nbsp;&nbsp;V1.1.0
            </span> -->
        </div>

        <!-- 授权弹窗 -->
        <el-dialog
            title="授权过期"
            class="dialog1"
            :visible.sync="dialogVisible"
            :show-close="false"
            :close-on-click-modal="false"
            center
        >
            <span
                >系统授权已到期，请联系安印科技申请继续试用或升级为正式版本</span
            >
            <span slot="footer" class="dialog-footer">
                <el-button type="primary" @click="authorConfirm"
                    >确 定</el-button
                >
            </span>
        </el-dialog>

        <!-- 授权注册弹窗 -->
        <el-dialog
            title="注册"
            class="dialog2"
            :visible.sync="showDialog"
            :show-close="false"
            :close-on-click-modal="false"
            center
        >
            <div class="headerinfo">
                <img :src="logo2" alt="logo" />
                <p class="txt">请将授权licence文件上传至服务器完成授权</p>
            </div>
            <el-form
                class="demo-ruleForm"
                ref="form"
                :model="form"
                :rules="rules"
            >
                <el-form-item label="机器id">
                    <span v-text="machineCode"></span>
                </el-form-item>
                <el-form-item label="授权文件" prop="formData">
                    <el-upload
                        class="upload-demo"
                        action="https://jsonplaceholder.typicode.com/posts/"
                        :on-remove="onRemove"
                        :on-exceed="onExceed"
                        :http-request="resetFile"
                        :limit="1"
                        :file-list="fileList"
                        accept=".lic"
                    >
                        <el-button size="small" class="iconfont icon-shangchuan"
                            >上传文件</el-button
                        >
                    </el-upload>
                </el-form-item>
                <!-- <div class="tips-txt">请下载模板后,根据模板规格添加</div> -->
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button type="primary" @click="confirmBtn('form')"
                    >确 定</el-button
                >
            </span>
        </el-dialog>
    </div>
</template>
<script>
import { sessionStore, localStore, isPhoneNum, cookieStore } from '@/utils';
import doPermission from '@/permission/filterPermission';
import { allApis } from '@/server/api-urls';

export default {
    data() {
        return {
            websiteTitle: '电子签章系统',
            codeImg: allApis.apis.getValicode,
            // logoUrl: require('@/assets/image/logo-big.png'),
            // milogoUrl: require('@/assets/image/logo-main.png'),
            loginBg: require('@/assets/image/logo-bg.png'),
            logo2: require('@/assets/image/logo2.png'),
            passType: 'password',
            // imgs: {
            //     back: require("@/assets/image/login/back.png")
            // },
            loginInfo: {
                userName: '',
                password: '',
                valicode: '',
                smsValidateCode: ''
            },
            dialogVisible: false,
            showDialog: false,
            fileList: [],
            machineCode: '',
            form: {
                formData: ''
            },
            // form 规则
            rules: {
                formData: [
                    {
                        required: true,
                        message: '请上传.lic格式授权文件',
                        trigger: 'blur'
                    },
                    {
                        validator: function(rule, value, callback) {
                            if (!value) {
                                callback(new Error('请上传.lic格式授权文件'));
                            } else {
                                callback();
                            }
                        },
                        trigger: 'blur'
                    }
                ]
            },
            rememberPass: false,
            loginBtnDis: false,
            loginError: false,
            isMsgLogin: false, // 是否短信验证码登录
            second: 120,
            isNum: false,
            timer: null,
            getCodeDisabled: false
        };
    },
    computed: {
        rulesLoginInfo() {
            return {
                userName: [
                    {
                        required: true,
                        message: '请输入手机号码' + (this.isMsgLogin ? '' : '或邮箱'),
                        trigger: 'blur'
                    },
                    {
                        validator: function(rule, value, callback) {
                            if (!value) {
                                callback(new Error('请输入邮箱或手机号码'));
                            } else {
                                callback();
                            }
                        },
                        trigger: 'blur'
                    }
                ],
                password: [
                    {
                        required: true,
                        message: '请输入密码',
                        trigger: 'blur'
                    },
                    {
                        validator: function(rule, value, callback) {
                            if (!value) {
                                callback(new Error('请输入密码'));
                            } else {
                                callback();
                            }
                        },
                        trigger: 'blur'
                    }
                ],
                smsValidateCode: [
                    {
                        required: true,
                        message: '请输入短信验证码',
                        trigger: 'blur'
                    },
                    {
                        validator: function(rule, value, callback) {
                            if (!value) {
                                callback(new Error('请输入短信验证码'));
                            } else {
                                callback();
                            }
                        },
                        trigger: 'blur'
                    }
                ],
                valicode: [
                    {
                        required: true,
                        message: '请输入验证码',
                        trigger: 'blur'
                    },
                    {
                        validator: function(rule, value, callback) {
                            if (!value) {
                                callback(new Error('请输入右侧验证码'));
                            } else {
                                callback();
                            }
                        },
                        trigger: 'blur'
                    }
                ]
            }
        },
        
    },
    created() {
        // window.addEventListener('message', function(e) {
        //     console.log(e.data);
        // });
        this.setForm();
        this.$store.commit('TOGGLE_SIDEBAR', false);
        // 本地office 跳转 用户已登录无需再登录
        if (localStore.get('userInfo') && this.$route.query.fileId) {
            this.$router.push(`/fileCenter/signFile?contractId=${this.$route.query.fileId}&isFile=1`)
        }
    },
    mounted() {
        this.$nextTick(() => {
            this.backResize();
        });
        this.codeImgBtn();
    },
    watch: {
        $route: {
            handler: function(to, from) {
                if (to.name === 'login') {
                    this.setForm();
                    this.backResize();
                }
                if (to.name !== 'login') {
                    if (this.$refs.loginInfo) {
                        this.$refs.loginInfo.resetFields();
                    }
                }
            },
            deep: true
        }
    },
    methods: {
        backResize() {
            let that = this;
            let picWidth, picHeight;
            // let img = new Image();
            // img.src = this.imgs.back;
            // img.onload = function() {
            //     picWidth = that.$refs.back.clientWidth;
            //     picHeight = that.$refs.back.clientHeight;
            //     resetBack();
            // };
            window.onresize = function() {
                resetBack();
            };
            function resetBack() {
                let winWidth = document.documentElement.clientWidth;
                let winHeight = document.documentElement.clientHeight;
                if (winWidth / winHeight < picWidth / picHeight) {
                    that.$refs.back.style.height = '100%';
                } else if (winWidth / winHeight > picWidth / picHeight) {
                    that.$refs.back.style.width = '100%';
                }
            }
        },
        setForm() {
            let userInfo = localStore.get('loginInfo');
            if (!userInfo) {
                this.loginInfo.userName = '';
                this.loginInfo.password = '';
                this.loginInfo.valicode = '';
                this.rememberPass = false;
                return;
            } else {
                this.rememberPass = true;
            }
            userInfo.userName && (this.loginInfo.userName = userInfo.userName);
            userInfo.password && (this.loginInfo.password = userInfo.password);
        },
        showVerPass() {
            this.passType = this.passType === 'password' ? 'text' : 'password';
        },
        rememberPassFn(value) {
            this.rememberPass = value;
            if (value) {
                localStore.set('loginInfo', this.loginInfo);
            } else {
                localStore.remove('loginInfo', this.loginInfo);
            }
        },
        // 登录
        goLogin(formName) {
            this.$refs[formName].validate((valid) => {
                if (valid) {
                    this.loginBtnDis = true;
                    // this.loginError = true;
                    this.login();
                } else {
                    return false;
                }
            });
        },
        // 验证码
        codeImgBtn() {
            this.codeImg = allApis.apis.getValicode;
            this.codeImg += `?=${Math.random().toFixed(3)}`;
        },
        // forgetPwd() {
        //     this.$message('暂未开放,敬请期待');
        // },
        authorConfirm() {
            this.showDialog = true;
            this.dialogVisible = false;
            this.authorize();
        },
        // 更新授权
        authorize() {
            this.showDialog = true;
            this.$api('getMachineCode')
                .post()
                .then((res) => {
                    if (!res) return;
                    let data = res.data.data;
                    this.machineCode = data.machineCode;
                });
        },
        // 确定导入
        confirmBtn(formName) {
            let type = this.fileType;
            this.$refs[formName].validate((valid) => {
                if (valid) {
                    if (this.fileSize >= 10) {
                        this.$message({
                            message: '文件大小不能超过10MB',
                            type: 'error',
                            customClass: 'zZindex'
                        });
                        return false;
                    }
                    if (type === 'lic') {
                        this.$api('licence')
                            .post('postFormData', this.formdata)
                            .then((res) => {
                                if (!res) return;
                                let code = res.data.code;
                                let data = res.data.data;
                                this.showDialog = false;
                                if (code === 0) {
                                    this.resetDialogData();
                                    this.$message.success(
                                        '更新授权成功,请重新登录'
                                    );
                                    this.$router.push('/login');
                                } else {
                                    this.$message.error('更新授权失败');
                                }
                            });
                    } else {
                        this.$message({
                            message: '文件格式不正确',
                            type: 'error',
                            customClass: 'zZindex'
                        });
                        return false;
                    }
                } else {
                    console.log('error submit!!');
                    return false;
                }
            });
        },
        // 移除文件后的回调
        onRemove() {
            this.$refs.form.resetFields();
            this.formData = null;
            this.fileSize = 0;
        },
        // 请求后的回调
        resetFile(options) {
            let file = options.file;
            let formdata = new FormData();
            formdata.append('file', file);
            this.formdata = formdata;
            this.form.formData = formdata;
            this.$refs.form.clearValidate('formData');
            this.fileSize = (file.size / 1024 / 1024).toFixed(2);
            this.fileType = file.name.split('.').pop();
        },
        onExceed(file, list) {
            this.$message({
                message: '只能上传1个文件,请删除文件后再上传',
                type: 'warning',
                customClass: 'zZindex'
            });
        },
        // 弹窗关闭前的回调
        resetDialogData() {
            this.$refs.form.resetFields();
            this.formData = null;
            this.showDialog = false;
            this.fileList = [];
        },
        async login() {
            this.loginInfo.contentType = 'json';
            this.loginBtnDis = false;
            let loginInfo = Object.assign({isMsgLogin:this.isMsgLogin}, this.loginInfo)
            let userInfo = await this.$store.dispatch('login', loginInfo);
            localStore.set('userInfo', userInfo); // 用户已登录 本地office跳转不用再登录
            if (this.rememberPass && !this.isMsgLogin) {
                localStore.set('loginInfo', this.loginInfo);
            }
            if (!userInfo) {
                return;
            }
            let code = userInfo.code;
            if (code === 1054) {
                this.$message.error('验证码错误,请重新输入');
                this.loginInfo.valicode = '';
                return false;
            }
            if (code === 1001) {
                this.$message.error('用户名错误,请重新输入！');
                return false;
            }
            if (code === 1005) {
                this.$message.error('用户名或密码错误,请重新输入！');
                return false;
            }
            if (code === 1002) {
                this.$message.error('密码错误,请重新输入！');
                return false;
            }
            if (code === 1061) {
                this.$message.error('帐号已失效，请联系管理员！');
                return false;
            }
            if (code === 1006) {
                this.$message.error('您的账户已被禁用请联系管理员！');
                return false;
            }
            if (
                code === 50300 ||
                code === 50301 ||
                code === 50302 ||
                code === 50303 ||
                code === 50304 ||
                code === 50305 ||
                code === 50306
            ) {
                this.dialogVisible = true;
                return false;
            }
            if (typeof code === 'number') return this.$message.error(userInfo.msg);
            let isSignPassword = await this.$api('querySignPassword').post();
            if(!isSignPassword)  return;
            sessionStore.set('isSignPassword', isSignPassword.data.data)
            if (this.$route.query.router) {
                await this.$store.dispatch('getUserMenuTree', {
                    userId: sessionStore.get('userInfo').id
                });
                this.$router.push(decodeURIComponent(this.$route.query.router));
            } else {
                this.getUserMenuTree(); // 获取菜单
            }
        },
        // 获取菜单权限
        async getUserMenuTree() {
            this.loginInfo.contentType = 'json';
            let menuList = await this.$store.dispatch('getUserMenuTree', {
                userId: sessionStore.get('userInfo').id
            });
            if (!menuList) return;
            // 默认跳转到第一个菜单
            // 本地office跳转 默认地址 /fileCenter/signFile?contractId=826476864473137152
            let fileId = this.$route.query.fileId;
            let defaultRouter = fileId ? `/fileCenter/signFile?contractId=${fileId}&isFile=1`: '/homePage/index';
            this.$router.push(defaultRouter);
        },
        // 获取短信验证码
        async getCode() {
            if(!this.loginInfo.userName) return this.$message.warning('请输入手机号')
            if(!isPhoneNum(this.loginInfo.userName)) return this.$message.warning('手机号格式不正确，请重新输入')
            let res = await this.$api('codeForLogin').post('postQuery', '', {
                telPhone: this.loginInfo.userName,
                useType: '9'
            })
            if(!res) return
            this.$message.success('获取验证码成功')
            this.countDown()
        },
        // 倒计时
        countDown() {
            this.getCodeDisabled = true
            this.isNum = true
            this.second = 120
            this.timer = setInterval(() => {
                this.second --
                if (this.second <= 0) {
                    this.isNum = false
                    this.getCodeDisabled = false
                    clearInterval(this.timer)
                }
            }, 1000);
        },
        switchLoginType() {
            this.isMsgLogin = !this.isMsgLogin
            this.$nextTick(()=>this.$refs.loginInfo.clearValidate())
        }
    },
    beforeRouteLeave (to, from, next) {
        if(this.timer) clearInterval(this.timer)
        next()
    }
};
</script>
<style lang="scss" scoped>
.wrapper {
    width: 100%;
    height: 100%;
    position: relative;
    // background: url(../../assets/image/logo-bg.png);
    // background-color: #002b53;
    // background: url(../../assets/image/cloud.jpg) 0 bottom repeat-x #049ec4;
    // -webkit-animation: animateCloud 20s linear infinite;
    // animation: animateCloud 20s linear infinite;
    .website-title {
        padding-top: 100px;
        font-size: 34px;
        color: #7887a7;
        text-align: center;
    }
    .footer-box {
        position: fixed;
        left: 50%;
        bottom: 60px;
        z-index: 9;
        transform: translateX(-50%);
        text-align: center;
        .explain {
            padding-bottom: 20px;
            font-size: 12px;
            span {
                margin-left: 22px;
                border-right: 1px solid #666;
                padding-right: 20px;
                a {
                    color: #fff;
                    font-size: 12px;
                }
            }
            :last-child {
                border-right: none;
            }
        }
        .copyright {
            margin-top: 25px;
            font-size: 12px;
            color: #fff;
            em {
                margin: 0 6px;
            }
        }
    }
    .wrapper-box {
        // display: flex;
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        // width: 1016px;
        .logo {
            flex: 1;
            float: left;
            width: 636px;
            height: 500px;
            color: #f4f6f8;
            text-align: center;
            .logo-pic {
                text-align: center;
                img {
                    width: 100%;
                }
            }
            .title {
                margin-top: 50px;
                font-size: 26px;
            }
            .version {
                margin-top: 10px;
                font-size: 14px;
            }
            .logo-big {
                width: 100%;
                img {
                    height: 500px;
                }
            }
        }
        .login {
            width: 440px;
            background: #fff;
            border-radius: 6px;
            .login-form {
                padding: 46px 30px 40px;
                border-radius: 8px;
                .form-title {
                    margin-bottom: 16px;
                    color: #4a90e2;
                    font-size: 16px;
                }
                .title {
                    font-size: 24px;
                    color: #333;
                    text-align: center;
                }
                i {
                    position: absolute;
                    top: 0;
                    right: 5px;
                    width: 16px;
                    height: 16px;
                    color: #c0ccda;
                    font-size: 18px;
                }
                .tips {
                    position: absolute;
                    bottom: -5px;
                    right: 90px;
                    color: #4a90e2;
                    text-decoration: underline;
                    cursor: pointer;
                }
                .code {
                    position: absolute;
                    top: 0;
                    right: 0;
                    width: 80px;
                    height: 36px;
                    cursor: pointer;
                }
                .icon-buxianshimima,
                .icon-xianshimima {
                    margin-right: 20px;
                    cursor: pointer;
                }
                .icon-xianshimima {
                    margin-right: 25px;
                    font-size: 28px;
                }
                .logo-pic {
                    margin-bottom: 32px;
                    text-align: center;
                }
                .el-form-item {
                    height: 36px;
                    line-height: 36px;
                    margin-bottom: 22px;
                }
            }
            .login-btn {
                font-size: 16px;
            }
            .rememberPass {
                display: flex;
                justify-content: space-between;
                color: #626262;
                .remember {
                    .el-checkbox__inner {
                        border: 1px solid red;
                    }
                }
            }
            .switch-type {
                color: #006efe;
                cursor: pointer;
            }
            .error-mention {
                color: #ff5446;
                padding-left: 25px;
                margin-top: 10px;
            }
            .el-button.login-btn {
                width: 100%;
                height: 54px;
                line-height: 54px;
                padding: 0;
                margin-top: 40px;
                font-size: 16px;
                color: #fff;
                background: #4a90e2;
                border-radius: 28px;
                overflow: hidden;
                &:hover {
                    background: #1075eb;
                }
            }
            
            .count-down {
                width: 112px;
                position: absolute;
                right: 0;
                top: 5px;
                color: #fff;
                background-color: #4a90e2;
                height: 30px;
                line-height: 30px;
            }
        }
    }
    .dialog2 {
        .headerinfo {
            margin-bottom: 20px;
            .txt {
                margin-top: 15px;
            }
        }
        .dialog-footer {
            position: relative;
            top: -15px;
        }
    }
}
@-webkit-keyframes animateCloud {
    0% {
        background-position: 600px 100%;
    }
    100% {
        background-position: 0 100%;
    }
}

@media screen and (max-width: 1000px) {
    .logo {
        display: none;
    }
    .wrapper .wrapper-box {
        width: 380px;
    }
}
</style>
<style lang="scss">
.wrapper {
    .dialog1 {
        .el-dialog__body {
            padding: 50px 30px 60px;
            color: #333;
        }
    }
    .dialog2 {
        .el-form-item__label {
            text-align: left;
        }
        .el-dialog__body {
            padding: 25px 50px 30px;
            color: #333;
        }
        .el-form-item__content {
            margin-left: 100px;
        }
    }
}
</style>
