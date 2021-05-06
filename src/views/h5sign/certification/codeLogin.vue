<template>
    <div class="code-login">
        <div class="title">
            <div class="back" @click="$router.go(-1)">
                <img src="../../../assets/image/返回上一步 白.svg" alt />
            </div>个人实名认证
        </div>
        <el-form label-position="top" label-width="80px" :model="form" :rules="rules" ref="form">
            <el-form-item label="手机号" prop="phoneNum">
                <el-input v-model="form.phoneNum" placeholder="请输入手机号" ref="phoneNum"></el-input>
            </el-form-item>
            <el-form-item label="短信验证码" prop="verifyCode">
                <el-input v-model="form.verifyCode" placeholder="请输入短信验证码"></el-input>
                <el-button type="plain" @click="getCode" :disabled="btnDisabled">{{ btnText }}</el-button>
            </el-form-item>
        </el-form>
        <div class="submit">
            <el-button type="primary" size="medium" @click="submit">提交</el-button>
        </div>
    </div>
</template>

<script>
import { isCard, sessionStore } from '@/utils';
import { Toast } from 'vant';

export default {
    data() {
        return {
            form: {
                phoneNum: '',
                useType: '36',
                verifyCode: ''
            },
            btnText: '获取验证码',
            btnDisabled: false,
            timer: null,
            rules: {
                phoneNum: [
                    {
                        required: true,
                        message: '手机号不能为空',
                        trigger: 'blur'
                    }
                ],
                verifyCode: [
                    {
                        required: true,
                        message: '短信验证码不能为空',
                        trigger: 'blur'
                    }
                ]
            }
        };
    },
    methods: {
        // 获取验证码
        async getCode() {
            if (!this.form.phoneNum.trim()) {
                this.$refs.phoneNum.focus();
                this.$refs.phoneNum.blur();
                return;
            }
            let res = await this.$api('codeForLogin').post('postQuery', '', {
                telPhone: this.form.phoneNum,
                useType: '36'
            });
            if (!res) return;
            Toast('验证码发送成功');
            this.btnDisabled = true;
            this.btnText = 60;
            this.timer = setInterval(() => {
                this.btnText--;
                if (this.btnText === 0) {
                    this.btnText = '获取验证码';
                    this.btnDisabled = false;
                    clearInterval(this.timer);
                }
            }, 1000);
        },
        // 提交表单
        submit() {
            this.$refs.form.validate(async (valid) => {
                if (!valid) return;
                let { phoneNum: telPhone, verifyCode: code, useType } = this.form
                let res = await this.$api('noTokenValidateCode').post(
                    'postQuery',
                    '',
                    {
                        telPhone,
                        code,
                        useType
                    }
                );
                if (!res) return;
                console.log(res);
                const query = this.$route.query;
                query.success = '1';
                // const { acctName: name, certId: personId } = this.form;
                // const contractInfo = {
                //     name,
                //     personId
                // };
                // sessionStore.set('contractInfo', contractInfo);
                this.$router.push({
                    path: 'h5SignContract',
                    query
                });
            });
        }
    },
    beforeDestroy() {
        clearInterval(this.timer);
    }
};
</script>

<style lang="scss" scoped>
.code-login {
    height: 100%;
    .title {
        height: 0.88rem;
        line-height: 0.88rem;
        text-align: center;
        font-size: 0.34rem;
        color: #fff;
        background-image: linear-gradient(#006efe, #494aff);
        position: relative;
        .back {
            position: absolute;
            width: 0.88rem;
            height: 0.88rem;
            left: 0;
            top: 0;
            img {
                width: 100%;
                height: 100%;
            }
        }
    }
    .el-form {
        padding: 0.32rem;
        .el-button {
            position: absolute;
            right: 0;
            bottom: 0.1rem;
            border-color: #006efe;
            // color: #006efe;
        }
    }
    .submit {
        padding: 0 0.32rem;
        .el-button {
            width: 100%;
        }
    }
}
</style>
<style lang="scss">
.code-login {
    .el-form {
        .el-form-item__label {
            color: #99a9bf;
            height: 0.62rem;
        }
        .el-input {
            input {
                border: none;
                border-bottom: 1px solid #efefef;
                border-radius: 0;
                padding-left: 0;
                &:focus {
                    border-color: #1465ff;
                }
            }
        }
        &-item.is-error {
            .el-input {
                input {
                    border-color: #ff4949;
                }
            }
        }
    }
}
</style>