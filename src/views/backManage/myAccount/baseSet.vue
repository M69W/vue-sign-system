<template>
    <div class="container-box baseSet">
        <div class="base-box">
            <h3>账户信息</h3>
            <ul>
                <li>
                    <span class="tit">账户名</span>
                    <span class="cont" v-text="user.userName"></span>
                </li>
                <li v-if="isEmail(user.userName)">
                    <span class="tit">手机号</span>
                    <span class="cont bind-msg" v-if="!user.phone"
                        ><i>未绑定</i
                        ><i class="go-binding" @click="bindImmediately"
                            >立即绑定</i
                        ></span
                    >
                    <span class="cont" v-else v-text="user.phone"></span>
                </li>
                <li>
                    <span class="tit">所属单位</span>
                    <span class="cont" v-text="user.enterpriseName"></span>
                </li>
                <li>
                    <span class="tit">账户角色</span>
                    <span class="cont" v-text="user.roleName"></span>
                </li>
            </ul>
        </div>
        <!-- 绑定手机号分配弹窗 -->
        <el-dialog
            title="绑定手机号"
            :visible.sync="showDialog"
            :before-close="resetDialogData"
            class="baseSet-dialog-box"
            width="640px"
        >
            <el-form
                class="demo-ruleForm"
                ref="formBindPhone"
                :rules="rules"
                :model="form"
                label-width="80px"
            >
                <el-form-item label="手机号" prop="phone">
                    <el-input
                        v-model="form.phone"
                        maxlength="30"
                        type="number"
                        placeholder="请输入手机号码"
                    ></el-input>
                </el-form-item>
            </el-form>
            <el-form
                class="demo-ruleForm"
                ref="formBindPhoneVer"
                :rules="rulesVer"
                :model="formVer"
                label-width="80px"
            >
                <el-form-item prop="vertifyCode" label="验证码">
                    <div class="vertiry-wrap">
                        <el-input
                            placeholder="请输入验证码"
                            v-model="formVer.vertifyCode"
                        ></el-input>
                        <el-button
                            type="primary"
                            class="ver-btn"
                            @click="getVertifyCode('formBindPhone')"
                            :disabled="verBtnMsg !== '获取验证码'"
                            >{{ verBtnMsg }}</el-button
                        >
                    </div>
                </el-form-item>
            </el-form>
            <div class="dialog-footer">
                <el-button @click="cancelBindPhone">取 消</el-button>
                <el-button
                    type="primary"
                    @click="
                        confirmBindPhone('formBindPhone', 'formBindPhoneVer')
                    "
                    >确 定</el-button
                >
            </div>
        </el-dialog>
    </div>
</template>

<script>
import { sessionStore, isPhoneNum, isEmail, checkIntegral } from '@/utils';
export default {
    name: 'baseSet',
    data() {
        return {
            isEmail,
            user: {
                // userName: '',
                // role: '',
                // enterpriseName: ''
            },
            verBtnMsg: '获取验证码',
            showDialog: false,
            form: {
                phone: ''
            },
            formVer: {
                vertifyCode: ''
            },
            // form 规则
            rules: {
                phone: [
                    {
                        required: true,
                        message: '请输入手机号码！',
                        trigger: 'blur'
                    },
                    {
                        validator: function(rule, value, callback) {
                            if (!value) {
                                callback(new Error('请输入手机号码！'));
                            } else if (!isPhoneNum(value)) {
                                callback(
                                    new Error('请输入正确格式的手机号码！')
                                );
                            } else {
                                callback();
                            }
                        },
                        trigger: 'blur'
                    }
                ]
            },
            rulesVer: {
                vertifyCode: [
                    {
                        required: true,
                        message: '请输入验证码',
                        trigger: 'blur'
                    },
                    {
                        validator: function(rule, value, callback) {
                            if (!value) {
                                callback(new Error('请输入验证码！'));
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
    created() {
        this.queryBaseInfo();
    },
    methods: {
        queryBaseInfo() {
            let userInfo = sessionStore.get('userInfo');
            this.$api('info')
                .get('getPath', {
                    userId: userInfo.id
                })
                .then((res) => {
                    if (!res) return;
                    let data = res.data.data;
                    this.user = data;
                    this.user.roleName = data.userRoleRespVO.roleName;
                });
        },
        bindImmediately() {
            this.showDialog = true;
        },
        getVertifyCode(formfName) {
            this.$refs[formfName].validate((valid) => {
                if (valid) {
                    // http
                    this.getVertifyCodeHttp();
                }
            });
        },
        async getVertifyCodeHttp() {
            let res = await this.$api('getValidateCode').post(
                'postQuery',
                {},
                {
                    telPhone: this.form.phone,
                    useType: '7' // 1.注册 2.修改密码 3.找回密码 4.设置或修改签署密码 5.ukey初始化 6.修改邮箱 7.修改手机号 8.修改地址 31.忘记密码
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
        resetDialogData() {
            this.$refs.formBindPhone.resetFields();
            this.$refs.formBindPhoneVer.resetFields();
            this.showDialog = false;
            this.verBtnMsg = '获取验证码';
            this.countdownTimer && clearTimeout(this.countdownTimer);
        },
        cancelBindPhone() {
            this.resetDialogData();
        },
        confirmBindPhone(formName, formName1) {
            this.$refs[formName].validate((valid) => {
                if (valid) {
                    this.validateVer(formName1);
                }
            });
        },
        validateVer(formName) {
            this.$refs[formName].validate((valid) => {
                if (valid) {
                    this.verValidateCode();
                }
            });
        },
        async verValidateCode() {
            let res = await this.$api('verValidateCode').post(
                'postQuery',
                {},
                {
                    telPhone: this.form.phone,
                    code: this.formVer.vertifyCode,
                    useType: '7'
                }
            );
            if (!res) return;
            this.bindPhone();
        },
        async bindPhone() {
            let res = await this.$api('bindPhone').get('getNormal', {
                phone: this.form.phone
            });
            if (!res) return;
            this.$message.success({
                message: '绑定成功！',
                customClass: 'zZindex'
            });
            setTimeout(() => {
                this.resetDialogData();
            }, 500);
            this.queryBaseInfo();
        }
    }
};
</script>

<style lang="scss" scoped>
.base-box {
    width: 70%;
    h3 {
        font-size: 16px;
        margin-bottom: 20px;
    }
    li {
        display: flex;
        margin-top: -1px;
        span {
            display: inline-block;
            width: 100px;
            height: 50px;
            line-height: 50px;
            font-size: 14px;
            border: 1px solid #e8ecef;
        }
        .tit {
            width: 263px;
            text-indent: 60px;
            color: #626262;
        }
        .cont {
            flex: 1;
            margin-left: -1px;
            text-indent: 60px;
            color: #333;
        }
        .bind-msg {
            display: flex;
            // justify-content: space-between;
            .go-binding {
                margin-left: -40px;
                color: #4a90e2;
                cursor: pointer;
                text-decoration: underline;
            }
        }
    }
}
.vertiry-wrap {
    display: flex;
    align-items: center;
    .el-input {
        flex: 1;
    }
    .ver-btn {
        margin-left: 20px;
        width: 120px;
    }
}
.dialog-footer {
    text-align: center;
    .el-button {
        width: 120px;
        margin-right: 20px;
    }
}
</style>
<style lang="scss">
.baseSet-dialog-box .el-dialog__body {
    padding: 30px 90px 30px;
}
</style>


