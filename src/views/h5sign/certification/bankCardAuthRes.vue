<template>
    <div class="bank-card-auth-res">
        <header class="header" @click="$router.go(-1)">
            <div class="left">
                <i class="el-icon-arrow-left"></i>
                <span>返回</span>
            </div>个人实名认证
        </header>
        <div class="main" v-if="success">
            <div class="content">
                <p>
                    <img src="../../../assets/image/icon_success.svg" alt />
                </p>
                <p>验证成功</p>
                <p>恭喜您！个人实名认证成功！</p>
            </div>
            <div class="btn-box">
                <el-button type="primary" @click="toSign">开始签署</el-button>
            </div>
        </div>
        <div class="main" v-else>
            <div class="content">
                <p>
                    <img src="../../../assets/image/fail.svg" alt />
                </p>
                <p>验证失败</p>
                <p>请尝试重新进行个人银行卡认证</p>
            </div>
            <div class="btn-box">
                <el-button type="primary" @click="back">重新认证</el-button>
            </div>
        </div>
    </div>
</template>

<script>

export default {
    data() {
        return {
            success: this.$route.query.success === '1',
        };
    },
    created () {
    },
    methods: {
        back() {
            this.$router.go(-1)
        },
        toSign() {
            const query = this.$route.query
            delete query.success
            this.$router.push({
                path: 'h5SignContract',
                query
            })
        }
    },
    beforeRouteLeave (to, from, next) {
        if(this.timer) clearInterval(this.timer)
        next()
    }
};
</script>

<style lang="scss" scoped>
.bank-card-auth-res {
    .header {
        height: 0.88rem;
        line-height: 0.88rem;
        text-align: center;
        font-size: 0.3rem;
        color: #fff;
        background-image: radial-gradient(100% 100%, #006efe 0%, #494aff 100%);
        position: relative;
        .left {
            position: absolute;
            left: 0;
        }
    }
    .main {
        .content {
            padding-top: 1.6rem;
            padding-bottom: 1.28rem;

            p {
                text-align: center;

                img {
                    width: 1.28rem;
                    height: 1.28rem;
                }

                color: #282828;
                font-size: 0.34rem;

                &:nth-of-type(2) {
                    margin-top: 0.24rem;
                    line-height: 0.48rem;
                }

                &:nth-of-type(3) {
                    color: #666;
                    font-size: 0.28rem;
                    margin-top: 0.3rem;
                    line-height: 0.4rem;
                }
            }
        }

        .btn-box {
            padding: 0 0.32rem;
            p {
                text-align: center;
                span {
                    color: #1f5fff;
                    text-decoration: underline;
                }
            }
            .el-button {
                width: 100%;
            }
        }
    }
}
</style>