<template>
    <div class="container-box sign-password">
        <div class="safe-box">
            <h3>签署密码</h3>
            <ul>
                <li>
                    <div class="left">
                        <span class="txt"
                            >签署密码:
                            <em v-if="isSignPassword">***********</em></span
                        >
                        <span class="tips"
                            >在签署环节用于表达您真实的签署信息</span
                        >
                    </div>
                    <div class="right">
                        <el-button
                            size="small"
                            @click="modifyPassword(isSignPassword)"
                            >{{
                                isSignPassword ? '修改密码' : '设置密码'
                            }}</el-button
                        >
                    </div>
                </li>
            </ul>
        </div>

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
                <el-button @click="cancel">取 消</el-button>
                <el-button
                    type="primary"
                    @click="confirmBtn('setSignPasswordForm')"
                    >确 定</el-button
                >
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
                        ></el-input>
                        <span @click="forgetPw" class="forget-pw">
                            忘记密码
                        </span>
                    </div>
                </el-form-item>
                <el-form-item label="新签署密码" prop="passwordNew">
                    <el-input
                        v-model.trim="changeSignPasswordForm.passwordNew"
                        type="password"
                        minlength="6"
                        maxlength="20"
                        placeholder="必须包含字母和数字，长度为6-20个字符"
                    ></el-input>
                </el-form-item>
                <el-form-item label="确认密码" prop="confPasswordNew">
                    <el-input
                        v-model.trim="changeSignPasswordForm.confPasswordNew"
                        type="password"
                        minlength="6"
                        maxlength="20"
                        placeholder="请输入新签署密码"
                    ></el-input>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer dialog-footer-center">
                <el-button @click="changeCancel">取 消</el-button>
                <el-button
                    type="primary"
                    @click="changeConfirmBtn('changeSignPasswordForm')"
                    >确 定</el-button
                >
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
                <el-form-item label="接受手机号/邮箱" prop="receiveWay">
                    <div class="group">
                        <span class="phone-or-email">
                            {{ userInfo.userName | regPhone }}
                        </span>
                        <el-button
                            class="get-ver"
                            :disabled="verBtnMsg !== '获取验证码'"
                            type="primary"
                            @click="getVertifyCode"
                            >{{ verBtnMsg }}</el-button
                        >
                    </div>
                </el-form-item>
                <el-form-item label="验证码" prop="vertifyCode">
                    <el-input
                        v-model.trim="identityAuthForm.vertifyCode"
                        type="number"
                        placeholder="请输入验证码"
                    ></el-input>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer dialog-footer-center">
                <el-button @click="verCodeCancel">取 消</el-button>
                <el-button
                    type="primary"
                    @click="verCodeConfirmBtn('identityAuthForm')"
                    >确 定</el-button
                >
            </div>
        </el-dialog>

        <!-- 验证码验证 -->
        <sign-password-dialog ref="signPasswordDialog" @submitSignPassword="submitSignPassword"></sign-password-dialog>
    </div>
</template>

<script>
import { sessionStore, isPassword, checkIntegral } from '@/utils';
import { mapState } from 'vuex';
import signPasswordDialog from '@/components/signPasswordDialog'

export default {
    name: 'safeSet',
    components: { signPasswordDialog },
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
            countdownTimer: null,
            isSignPassword: sessionStore.get('isSignPassword') === 'true' || false
        };
    },
    created() {
        this.querySafeInfo();
    },
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
        querySafeInfo() {
            // let userInfo = sessionStore.get('userInfo');
            // this.user.name = userInfo.userName;
            // this.uid = userInfo.id; // 获取用户id
        },
        modifyPassword(isSignPassword) {
            isSignPassword
                // ? (this.changeSignPasswordDialog = true)
                // : (this.setSignPasswordDialog = true);
                ? (this.$refs.signPasswordDialog.changeSignPasswordDialog = true)
                : (this.$refs.signPasswordDialog.setSignPasswordDialog = true)
        },
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
                            {},
                            {
                                contentType: 'query',
                                query: {
                                    password: this.setSignPasswordForm.password
                                }
                            }
                        )
                        .then((res) => {
                            if (!res) return;
                            this.isSignPassword = true;
                            sessionStore.set('isSignPassword', true)
                            this.$message.success({
                                message: '设置成功！',
                                customClass: 'zZindex'
                            });
                            setTimeout(() => {
                                this.cancel();
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
                        message: '新密码和旧密码相同，请从新输入！',
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
                {},
                {
                    contentType: 'query',
                    query: this.changeSignPasswordForm
                }
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
            this.$refs[formName].validate((valid) => {
                if (valid) {
                    this.$message.success({
                        message: '验证成功！',
                        customClass: 'zZindex'
                    });
                    setTimeout(() => {
                        this.verCodeCancel();
                        this.setSignPasswordDialog = true;
                    }, 500);
                }
            });
        },
        async getVertifyCode() {
            let res = await this.$api('getValidateCode').post(
                {},
                {
                    query: {
                        telPhone: this.userInfo.userName,
                        useType: '31' // 1.注册 2.修改密码 3.找回密码 4.设置或修改签署密码 5.ukey初始化 6.修改邮箱 7.修改手机号 8.修改地址 31.忘记密码
                    },
                    contentType: 'query'
                }
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
            this.verBtnMsg = time;
            this.countdownTimer = setInterval(() => {
                --time;
                this.verBtnMsg = time + 's';
                if (time === 0) {
                    this.verBtnMsg = '获取验证码';
                    clearInterval(this.countdownTimer);
                }
            }, 1000);
        },
        submitSignPassword() { }
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
    }
}
</style>
<style lang="scss">
.safe-box {
    width: 70%;
    h3 {
        font-size: 16px;
        color: #333;
        margin-bottom: 0;
    }
    li {
        display: flex;
        align-items: center;
        height: 86px;
        border-bottom: 1px solid #e8ecef;
        .left {
            flex: 1;
            font-size: 14px;
            .txt {
                display: inline-block;
                color: #626262;
            }
            .tips {
                display: block;
                margin-top: 10px;
                color: #9b9b9b;
            }
        }
    }
    .dialog-footer {
        text-align: center;
    }
}
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