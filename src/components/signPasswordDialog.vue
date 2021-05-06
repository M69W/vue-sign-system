<template>
    <div class="container-box sign-password">
        <!-- 设置签署密码 -->
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
                        @keyup.native.enter="confirmBtn('setSignPasswordForm')"
                    ></el-input>
                </el-form-item>
                <el-form-item label="确认密码" prop="confPassword">
                    <el-input
                        v-model.trim="setSignPasswordForm.confPassword"
                        type="password"
                        minlength="6"
                        maxlength="20"
                        placeholder="必须包含字母和数字，长度为6-20个字符"
                        @keyup.native.enter="confirmBtn('setSignPasswordForm')"
                    ></el-input>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer dialog-footer-center">
                <el-button @click="cancel">取 消</el-button>
                <el-button type="primary" @click="confirmBtn('setSignPasswordForm')">确 定</el-button>
            </div>
        </el-dialog>
        <!-- 修改签署密码 -->
        <el-dialog
            title="修改签署密码"
            :visible.sync="changeSignPasswordDialog"
            class="change-pw-box"
            :before-close="resetChangeDialogData"
            width="640px"
        >
            <el-form
                class="demo-ruleForm"
                label-width="130px"
                ref="changeSignPasswordForm"
                :model="changeSignPasswordForm"
                :rules="changeSignPasswordRules"
            >
                <el-form-item label="原签署密码" prop="password">
                    <div class="group">
                        <el-input
                            v-model.trim="changeSignPasswordForm.password"
                            type="password"
                            minlength="6"
                            maxlength="20"
                            placeholder="请输入原签署密码"
                            @keyup.native.enter="changeConfirmBtn('changeSignPasswordForm')"
                        ></el-input>
                        <span @click="forgetPw" class="forget-pw">忘记密码</span>
                    </div>
                </el-form-item>
                <el-form-item label="新签署密码" prop="passwordNew">
                    <el-input
                        v-model.trim="changeSignPasswordForm.passwordNew"
                        type="password"
                        minlength="6"
                        maxlength="20"
                        placeholder="必须包含字母和数字，长度为6-20个字符"
                        @keyup.native.enter="changeConfirmBtn('changeSignPasswordForm')"
                    ></el-input>
                </el-form-item>
                <el-form-item label="确认密码" prop="confPasswordNew">
                    <el-input
                        v-model.trim="changeSignPasswordForm.confPasswordNew"
                        type="password"
                        minlength="6"
                        maxlength="20"
                        placeholder="请输入新签署密码"
                        @keyup.native.enter="changeConfirmBtn('changeSignPasswordForm')"
                    ></el-input>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer dialog-footer-center">
                <el-button @click="changeCancel">取 消</el-button>
                <el-button type="primary" @click="changeConfirmBtn('changeSignPasswordForm')">确 定</el-button>
            </div>
        </el-dialog>
        <!-- 身份认证 -->
        <el-dialog
            title="身份认证"
            :visible.sync="identityAuthDialog"
            class="ide-auth-box"
            :before-close="resetIdentityAuthDialogData"
            width="640px"
        >
            <el-form
                class="demo-ruleForm"
                label-width="115px"
                ref="identityAuthForm"
                :model="identityAuthForm"
                :rules="identityAuthRules"
            >
                <el-form-item label="接收手机号/邮箱" prop="receiveWay">
                    <div class="group">
                        <span class="phone-or-email">{{ userInfo.userName | regPhone }}</span>
                        <el-button
                            class="get-ver"
                            :disabled="verBtnMsg !== '获取验证码'"
                            type="primary"
                            @click="getVertifyCode"
                        >{{ verBtnMsg }}</el-button>
                    </div>
                </el-form-item>
                <el-form-item label="验证码" prop="vertifyCode">
                    <el-input
                        v-model.trim="identityAuthForm.vertifyCode"
                        type="number"
                        placeholder="请输入验证码"
                        @keyup.native.enter="verCodeConfirmBtn('identityAuthForm')"
                    ></el-input>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer dialog-footer-center">
                <el-button @click="verCodeCancel">取 消</el-button>
                <el-button type="primary" @click="verCodeConfirmBtn('identityAuthForm')">确 定</el-button>
                <p><span class="checkout" v-if="isSign" @click="useSignPassword">使用签署密码</span></p>
            </div>
        </el-dialog>
    </div>
</template>

<script>
import { sessionStore, isPassword, checkIntegral, isPhoneNum, isEmail } from '@/utils';
import { mapState } from 'vuex';
export default {
    props: {
        isSign: {
            default: false,
            type: Boolean
        }
    },
    name: 'safeSet',
    data() {
        return {
            setSignPasswordDialog: false,
            setSignPasswordForm: {
                password: '',
                confPassword: ''
            },
            // form 规则
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
            // 修改密码
            changeSignPasswordDialog: false,
            changeSignPasswordForm: {
                password: '',
                passwordNew: '',
                confPasswordNew: ''
            },
            // form 规则
            changeSignPasswordRules: {
                password: [
                    {
                        required: true,
                        message: '原签署密码不能为空！',
                        trigger: 'blur'
                    },
                    {
                        validator: function(rule, value, callback) {
                            if (!value) {
                                callback(new Error('原签署密码不能为空！'));
                            } else {
                                callback();
                            }
                        },
                        trigger: 'blur'
                    }
                ],
                passwordNew: [
                    {
                        required: true,
                        message: '新密码不能为空！',
                        trigger: 'blur'
                    },
                    {
                        validator: function(rule, value, callback) {
                            if (!value) {
                                callback(new Error('新密码不能为空！'));
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
                confPasswordNew: [
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
            // 身份认证
            verBtnMsg: '获取验证码',
            identityAuthDialog: false,
            identityAuthForm: {
                vertifyCode: ''
            },
            // form 规则
            identityAuthRules: {
                vertifyCode: [
                    {
                        required: true,
                        message: '验证码不能为空！',
                        trigger: 'blur'
                    },
                    {
                        validator: function(rule, value, callback) {
                            if (!value) {
                                callback(new Error('验证码不能为空！'));
                            } else if (!checkIntegral(value)) {
                                callback(new Error('请输入正整数类型验证码！'));
                            } else {
                                callback();
                            }
                        },
                        trigger: 'blur'
                    }
                ]
            },
            countdownTimer: null
        };
    },
    created() {},
    filters: {
        regPhone(value) {
            return value.replace(/(\d{3})(\d{4})(\d{4})/, '$1****$3');
        }
    },
    computed: {
        ...mapState({
            userInfo: (state) => state.userInfo
        })
    },
    methods: {
        resetSetDialogData() {
            this.setSignPasswordDialog = false;
            this.$refs.setSignPasswordForm.resetFields();
        },
        cancel() {
            this.resetSetDialogData();
        },
        confirmBtn(formName) {
            this.$refs[formName].validate((valid) => {
                if (valid) {
                    if (
                        this.setSignPasswordForm.password !==
                        this.setSignPasswordForm.confPassword
                    ) {
                        this.$message.warning({
                            message: '密码和确认密码不一致！',
                            customClass: 'zZindex'
                        });
                        return;
                    }
                    this.$api('setSignPassword')
                        .post(
                            'postQuery',
                            {},
                            {
                                password: this.setSignPasswordForm.password
                            }
                        )
                        .then((res) => {
                            if (!res) return;
                            sessionStore.set('isSignPassword', true)
                            this.$message.success({
                                message: '设置成功！',
                                customClass: 'zZindex'
                            });
                            setTimeout(() => {
                                this.cancel();
                                this.$emit('submitSignPassword');
                            }, 500);
                        });
                } else {
                    console.log('error submit!!');
                    return false;
                }
            });
        },
        // 修改密码
        forgetPw() {
            this.changeSignPasswordDialog = false;
            setTimeout(() => {
                this.identityAuthDialog = true;
            }, 300);
        },
        resetChangeDialogData() {
            this.changeSignPasswordDialog = false;
            this.$refs.changeSignPasswordForm.resetFields();
        },
        changeCancel() {
            this.resetChangeDialogData();
        },
        changeConfirmBtn(formName) {
            this.$refs[formName].validate((valid) => {
                if (!valid) return;
                if (
                    this.changeSignPasswordForm.password ===
                    this.changeSignPasswordForm.passwordNew
                ) {
                    this.$message.warning({
                        message: '新密码和旧密码相同，请重新输入！',
                        customClass: 'zZindex'
                    });
                    return;
                }
                if (
                    this.changeSignPasswordForm.passwordNew !==
                    this.changeSignPasswordForm.confPasswordNew
                ) {
                    this.$message.warning({
                        message: '新密码和确认密码不一致！',
                        customClass: 'zZindex'
                    });
                    return;
                }
                this.changeSignPwHttp();
            });
        },
        async changeSignPwHttp() {
            let changeSignPwRes = await this.$api('modifySignPassword').post(
                'postQuery',
                {},
                this.changeSignPasswordForm
            );
            if (!changeSignPwRes) return;
            this.$message.success({
                message: '修改成功！',
                customClass: 'zZindex'
            });
            setTimeout(() => {
                this.changeCancel();
            }, 500);
        },
        // 身份认证
        resetIdentityAuthDialogData() {
            this.identityAuthDialog = false;
            this.$refs.identityAuthForm.resetFields();
            this.verBtnMsg = '获取验证码';
            this.countdownTimer && clearTimeout(this.countdownTimer);
        },
        verCodeCancel() {
            this.resetIdentityAuthDialogData();
        },
        verCodeConfirmBtn(formName) {
            this.$refs[formName].validate(async (valid) => {
                if (valid) {
                    let url = 'verValidateCode'
                    let sendData = {
                        telPhone: this.userInfo.userName,
                        mail: undefined,
                        code: this.identityAuthForm.vertifyCode,
                        useType: '4'
                    }
                    if (isEmail(this.userInfo.userName)) {
                        url = 'validateEmailCode'
                        sendData.telPhone = undefined;
                        sendData.mail = this.userInfo.userName;
                    }
                    let res = await this.$api(url).post('postQuery', {} ,sendData)
                    if (!res) return;
                    this.$message.success({
                        message: '验证成功！',
                        customClass: 'zZindex'
                    });
                    setTimeout(() => {
                        this.verCodeCancel();
                        if (this.isSign) {
                            this.$emit('submitSignPassword');
                        } else {
                            this.setSignPasswordDialog = true;
                        }
                    }, 500);
                }
            });
        },
        async getVertifyCode() {
            let url = 'getValidateCode'
            let sendData = {
                telPhone: this.userInfo.userName,
                mail: undefined,
                useType: '4' // 1.注册 2.修改密码 3.找回密码 4.设置或修改签署密码 5.ukey初始化 6.修改邮箱 7.修改手机号 8.修改地址 31.忘记密码
            }
            if (isEmail(this.userInfo.userName)) {
                url = 'getEmailCode';
                sendData.telPhone = undefined;
                sendData.mail = this.userInfo.userName;
            }
            let res = await this.$api(url).post(
                'postQuery',
                {},
                sendData
            );
            if (!res) return;
            this.$message.success({
                message: '获取验证码成功！',
                customClass: 'zZindex'
            });
            this.countDown();
        },
        countDown() {
            let time = 120;
            this.verBtnMsg = time + 's';
            this.countdownTimer = setInterval(() => {
                --time;
                this.verBtnMsg = time + 's';
                if (time === 0) {
                    this.verBtnMsg = '获取验证码';
                    clearInterval(this.countdownTimer);
                }
            }, 1000);
        },
        useSignPassword() {
            this.resetIdentityAuthDialogData()
            this.$emit('useSignPassword')
        }
    }
};
</script>
<style lang="scss" scoped>
.sign-password {
    .dialog-footer {
        .el-button {
            width: 80px;
            margin-left: 20px;
        }
        p {
            padding-top: 20px;
            .checkout {
                cursor: pointer;
                &:hover {
                    color: #006efe;
                }
            }
        }
    }
}
</style>
<style lang="scss">
.change-pw-box,
.set-pw-box {
    .el-dialog__body {
        padding-bottom: 0;
    }
}
.change-pw-box {
    .group {
        display: flex;
        .forget-pw {
            white-space: nowrap;
            margin-left: 10px;
            color: #4a90e2;
            cursor: pointer;
        }
    }
}
.ide-auth-box {
    .group {
        display: flex;
        justify-content: space-between;
    }
    .el-dialog__body {
        padding: 30px 80px 0 80px;
    }
    .get-ver {
        width: 120px;
    }
}
</style>