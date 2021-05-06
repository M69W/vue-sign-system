<template>
    <div class="wrapper">
        <div class="wrapper-box">
            <div class="logo">
                <img class="logo-pic" :src="logoUrl" alt="logo" />
                <p class="website-title" v-text="websiteTitle"></p>
            </div>

            <div class="login">
                <div class="login-form">
                    <div class="logo-pic"></div>
                    <h5 class="form-title">账号登录</h5>
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
                                placeholder="请输入邮箱或手机号码"
                                maxlength="30"
                                autocomplete="off"
                            ></el-input>
                            <i class="iconfont icon-yonghuming"></i>
                        </el-form-item>
                        <!-- 密码 -->
                        <el-form-item prop="password">
                            <el-input
                                class="no-border border-bottom"
                                size="medium"
                                :type="passType"
                                v-model="loginInfo.password"
                                placeholder="请输入6~16位密码"
                                maxlength="16"
                                autocomplete="off"
                                >
                                <i
                                    @click="showVerPass"
                                    slot="suffix"
                                    class="iconfont"
                                    :class="{
                                        'icon-buxianshimima': passType === 'password',
                                        'icon-xianshimima': passType === 'text'
                                    }">
                                </i>
                            </el-input>
                            <i class="iconfont icon-mima1"></i>
                        </el-form-item>
                        <!-- 验证码 -->
                        <el-form-item prop="valicode">
                            <el-input
                                class="no-border border-bottom ipt-code"
                                size="medium"
                                v-model="loginInfo.valicode"
                                placeholder="请输入验证码"
                                maxlength="4"
                                autocomplete="off"
                                @keyup.enter.native="goLogin('loginInfo')"
                                >
                            </el-input>
                            <span class="tips" @click="codeImgBtn">看不清,换一张</span>
                            <span class="code" @click="codeImgBtn">
                                <img :src="codeImg" alt="验证码" />
                            </span>
                        </el-form-item>
                        <div class="rememberPass">
                            <div class="remember">
                                <el-checkbox v-model="rememberPass" @change="rememberPassFn">
                                    记住密码
                                </el-checkbox>
                            </div>
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
                        >
                        登录
                    </el-button>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
import { sessionStore, localStore, isPhoneNum } from '@/utils';
import doPermission from '@/permission/filterPermission';
import { allApis } from '@/server/api-urls';

export default {
    data() {
        return {
            websiteTitle: '电子签章系统V1.0.0',
            codeImg: allApis.apis.getValicode,
            logoUrl: require('@/assets/image/logo-main.png'),
            passType: 'password',
            loginInfo: {
                userName: '',
                password: '',
                valicode: ''
            },
            rulesLoginInfo: {
                userName: [
                    {
                        required: true,
                        message: '请输入账号',
                        trigger: 'blur'
                    },
                    {
                        validator: function(rule, value, callback) {
                            if (!value) {
                                callback(new Error('请输入账号'));
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
                valicode: [
                    {
                        required: true,
                        message: '请输入验证码',
                        trigger: 'blur'
                    },
                    {
                        validator: function(rule, value, callback) {
                            if (!value) {
                                callback(new Error('请输入验证码'));
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
            needCert: false // 是否需要实名
        };
    },
    async created() {
        // FIXME: 暂时用 query 判断登陆入口     
        // let _hash = '#/h5sign/login?iswx=1&iswxdetail=1&iid=PROCESS_INS_ID&type=ENTER_TYPE'
        let _hash = window.location.hash
        let _query = _hash.split('?')[1].split('&'),
            _queryArr = []

        for(let i = 0, len = _query.length; i < len; i++) {
            _queryArr.push(_query[i].split('='))
        }
        
        let [_iswxArr, _iswxdetailArr, _iidArr, _typeArr] = _queryArr

        // 是否需要实名
        let res = await this.$api('checkNeedCert').post('', {
            compactId: this.$route.query.contractId,
            userName: this.$route.query.phone
        })
        if(!res) return
        this.needCert = res.data.data.needCert;
        sessionStore.set('contractInfo', {
            name: res.data.data.personName,
            personId: res.data.data.personId
        })
        // FIXME: 暂时用 query 判断登陆入口
        if (this.$route.query.iswx == 1 || 
            (_iswxArr[0] == 'iswx' && _iswxArr[1] == 1)
        ) {
            // ^ 企业微信端无感登录
            let _token = await this.getWechatToken()

            if (_token) {
                // 务必做 _iswxdetailArr 的判断，因为它可能为 undefined
                if (_iswxdetailArr && _iswxdetailArr[0] == 'iswxdetail' && _iswxdetailArr[1] == 1) {
                    // ^. 跳转到`详情页`
                    this.$router.push({
                        path: '/h5wf/detail',
                        query: {
                            iid: _iidArr[1],
                            type: _typeArr[1]
                        }
                    })

                } else {
                    // ^. 跳转到`发起流程页`
                    this.$router.push({
                        path: '/h5wf'
                    })
                }                
            }

        } else if (this.$route.query.iswf == 1) {  // 工作流
            this.setForm();
            this.getwebsiteTitle()
            this.$store.commit('TOGGLE_SIDEBAR', false);            

        } else if (this.$route.query.isSysUser == 1) {
            this.setForm();
            this.getwebsiteTitle()
            this.$store.commit('TOGGLE_SIDEBAR', false);
        }else {
            const path = this.needCert ? this.$route.query.isEnterprise == 1 ? 'h5EnterpriseStep1' : 'h5AuthWay' : 'h5CodeLogin'
            this.$router.replace({
                path,
                query: this.$route.query
            })
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
        // ----------------------------------------------------------
        // 获取 企业微信的授权
        apiGetWechatToken(data) {
            return this.$api('urlGetWechatToken').post('postNormal', data)
        },
        // ----------------------------------------------------------
        async getWechatToken() {
            console.log(window.location)
            console.log(this.$route);
            console.log(window.location.search.split('&')[0].split('=')[1]);
            let _data = {
                // code: 'tmkuCaOAipJ2eqermLUV_0-WuIeVm08UzHV0ALW1Kng'
                code: this.$route.query.code || window.location.search.split("&")[0].split('=')[1]
            }

            let res = await this.apiGetWechatToken(_data)
            if (!res) return

            console.log(res)
            // res.data.data 即为 userInfo
            sessionStore.set('userInfo', res.data.data);

            return res.data.data.sessionToken
        },

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

            if (userInfo.userName) this.loginInfo.userName = userInfo.userName;
            if (userInfo.password) this.loginInfo.password = userInfo.password;
            if (userInfo.valicode) this.loginInfo.valicode = userInfo.valicode;
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
            // eUI `validate` 方法 - 对整个表单进行检验，参数为一个回调函数，
            // Function(callback: Function(boolean, object))
            // - 是否检验成功
            // - 未通过住校验的字段
            this.$refs[formName].validate((valid) => {
                if (valid) {
                    // ^ 通过检验
                    this.loginBtnDis = true;
                    this.login();   // 去登录

                } else {
                    // ^ 检验失败
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
        getwebsiteTitle () {
            let info = sessionStore.get('userInfo')
            if (!info) return
            this.websiteTitle = sessionStore.get('userInfo').userLicenceInfo.userName
        },
        async login() {
            this.loginInfo.contentType = 'json';
            this.loginBtnDis = false;

            let userInfo = await this.$store.dispatch('login', this.loginInfo);

            if (this.rememberPass) localStore.set('loginInfo', this.loginInfo);

            if (!userInfo) return;

            if (typeof userInfo.code === 'number') {
                return this.$message.error({
                    message: userInfo.msg,
                    customClass: 'h5-z-index'
                })
            };

            sessionStore.set('userInfo', userInfo);
            
            // FIXME: 待确定入口
            if(this.$route.query.iswf == 1) {   // 工作流
                this.$router.push({
                    path: '/h5wf'
                })                
            } else {
                if (this.needCert) {
                    const path = this.$route.query.isEnterprise == 1 ? 'h5EnterpriseStep1' : 'h5AuthWay'
                    this.$router.replace({
                        path,
                        query: this.$route.query
                    })
                    return 
                }
                this.$router.push({
                    path:'h5SignContract',
                    query:this.$route.query
                })                
            }

            // if (this.$route.query.router) {
            //     this.$router.push(decodeURIComponent(this.$route.query.router));
            // } else {
            //     this.getUserMenuTree(); // 获取菜单
            // }
        },
        // 获取菜单权限
        async getUserMenuTree() {
            // this.loginInfo.contentType = 'json';
            // let menuList = await this.$store.dispatch(
            //     'getUserMenuTree',
            //     sessionStore.get('userInfo').id
            // );
            // if (!menuList) return;
            // let filterPermissionData = doPermission(menuList);
            // sessionStore.set('filterPermissionData', filterPermissionData);
            // sessionStore.set('menuList', menuList);
            // this.$router.push('/home');
        }
    }
};
</script>
<style lang="scss" scoped>
.wrapper {
    min-height: 100%;
    position: relative;
    background-color: #eee;
    color: #333;

    .logo {
        text-align: center;
        padding-top: 30px;

        .logo-pic {
            margin: 10px auto;
        }

        .website-title {
            padding-bottom: 30px;
            font-size: 24px;
            color: #7887a7;
        }
    }


    .wrapper-box {
        
        .login {
            background: #fff;
            border-radius: 6px;

            .login-form {
                padding: 46px 5% 40px;
                border-radius: 8px;

                // 账号登录
                .form-title {
                    margin-bottom: 16px;
                    color: #4a90e2;
                    font-size: 16px;
                }

                // 验证码
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

                // 显示密码
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
            .forgetPwd {
                color: #333;
            }
            .error-mention {
                color: #ff5446;
                padding-left: 25px;
                margin-top: 10px;
            }
            .el-button {
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
        }
    }
}
</style>

