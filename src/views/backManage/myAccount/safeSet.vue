<template>
    <div class="container-box safeSet">
        <div class="safe-box">
            <h3>安全设置</h3>
            <ul>
                <li>
                    <div class="left">
                        <span class="txt">账户密码: <em>***********</em></span>
                        <span class="tips">用于保护帐号信息和登录安全</span>
                    </div>
                    <div class="right">
                        <el-button size="small" @click="modifyPassword"
                            >修改密码</el-button
                        >
                    </div>
                </li>
                <li>
                    <div class="left">
                        <span class="txt">登录账户</span>
                        <span class="tips"
                            >当前登录账户为：<em v-text="user.name"></em
                        ></span>
                    </div>
                </li>
            </ul>
        </div>

        <!-- 修改密码 -->
        <el-dialog
            title="修改密码"
            :visible.sync="showDialog"
            class="pop-box"
            :before-close="resetDialogData"
        >
            <el-form
                class="demo-ruleForm"
                label-width="130px"
                ref="safeForm"
                :model="safeForm"
                :rules="rules"
            >
                <el-form-item label="原密码" prop="oldPassword">
                    <el-input
                        v-model.trim="safeForm.oldPassword"
                        type="password"
                        minlength="6"
                        maxlength="16"
                        placeholder="请输入原密码"
                    ></el-input>
                </el-form-item>
                <el-form-item label="新密码" prop="newPassword">
                    <el-input
                        v-model.trim="safeForm.newPassword"
                        type="password"
                        minlength="6"
                        maxlength="16"
                        placeholder="请输入新密码"
                    ></el-input>
                </el-form-item>
                <el-form-item label="确认新密码" prop="confirmNewPassword">
                    <el-input
                        v-model.trim="safeForm.confirmNewPassword"
                        type="password"
                        minlength="6"
                        maxlength="16"
                        placeholder="请输入新密码"
                    ></el-input>
                </el-form-item>
            </el-form>

            <div slot="footer" class="dialog-footer dialog-footer-center">
                <el-button @click="cancel">取 消</el-button>
                <el-button type="primary" @click="confirmBtn('safeForm')"
                    >确 定</el-button
                >
            </div>
        </el-dialog>
    </div>
</template>

<script>
import { sessionStore } from '@/utils';
export default {
    name: 'safeSet',
    data() {
        return {
            showDialog: false,
            uid: '', // 定义用户id
            user: {
                name: ''
            },
            safeForm: {
                oldPassword: '',
                newPassword: '',
                confirmNewPassword: ''
            },
            // form 规则
            rules: {
                oldPassword: [
                    {
                        required: true,
                        message: '原密码不能为空',
                        trigger: 'blur'
                    },
                    {
                        validator: function(rule, value, callback) {
                            if (!value) {
                                callback(new Error('原密码不能为空！'));
                            } else {
                                callback();
                            }
                        },
                        trigger: 'blur'
                    }
                ],
                newPassword: [
                    {
                        required: true,
                        message: '新密码不能为空',
                        trigger: 'blur'
                    },
                    {
                        validator: function(rule, value, callback) {
                            if (!value) {
                                callback(new Error('新密码不能为空！'));
                            } else {
                                callback();
                            }
                        },
                        trigger: 'blur'
                    }
                ],
                confirmNewPassword: [
                    {
                        required: true,
                        message: '新密码不能为空',
                        trigger: 'blur'
                    },
                    {
                        validator: function(rule, value, callback) {
                            if (!value) {
                                callback(new Error('新密码不能为空！'));
                            } else {
                                callback();
                            }
                        },
                        trigger: 'blur'
                    }
                ]
            }
        };
    },
    created() {
        this.querySafeInfo();
    },
    methods: {
        querySafeInfo() {
            let userInfo = sessionStore.get('userInfo');
            this.user.name = userInfo.userName;
            this.uid = userInfo.id; // 获取用户id
        },
        modifyPassword() {
            this.showDialog = true;
        },
        resetDialogData() {
            this.showDialog = false;
            this.$refs.safeForm.resetFields();
        },
        cancel() {
            this.resetDialogData();
        },
        confirmBtn(formName) {
            if (
                this.safeForm.oldPassword &&
                this.safeForm.newPassword &&
                this.safeForm.confirmNewPassword &&
                this.safeForm.oldPassword === this.safeForm.newPassword
            ) {
                this.$message.warning({
                    message: '新密码和旧密码一致！',
                    customClass: 'zZindex'
                });
                return;
            }
            if (
                this.safeForm.oldPassword &&
                this.safeForm.newPassword &&
                this.safeForm.confirmNewPassword &&
                this.safeForm.newPassword !== this.safeForm.confirmNewPassword
            ) {
                this.$message.warning({
                    message: '新密码不一致',
                    type: 'warning',
                    customClass: 'zZindex'
                });
                return;
            }
            this.$refs[formName].validate((valid) => {
                if (valid) {
                    this.$api('updatePassword')
                        .post('postNormal', {
                            userId: this.uid,
                            oldPassword: this.safeForm.oldPassword,
                            newPassword: this.safeForm.newPassword
                        })
                        .then((res) => {
                            if (!res) return;
                            let that = this;
                            let data = res.data.data;
                            if (data) {
                                this.$message.success(
                                    '密码修改成功，请重新登陆！'
                                );
                                this.showDialog = false;
                                setTimeout(() => {
                                    that.outLogin();
                                }, 1500);
                            } else {
                                this.$message.warning('密码修改失败');
                            }
                        })
                        .catch((err) => {
                            this.$message.error(err);
                        });
                } else {
                    console.log('error submit!!');
                    return false;
                }
            });
        },
        // 取消修改密码
        cancelBtn() {
            this.showDialog = false;
            this.safeForm = {};
        },
        resetDialogData() {
            this.$refs.safeForm.resetFields();
            this.showDialog = false;
        },
        outLogin() {
            this.$router.push('/login');
            this.$store.dispatch('updateUserInfo', '');
            sessionStore.remove('userInfo');
        }
    }
};
</script>

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
</style>