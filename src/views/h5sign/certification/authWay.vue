<template>
    <div class="auth-way">
        <div class="title">认证方式</div>
        <div class="sub-title">请选择认证方式</div>
        <div class="type">
            <div class="type-item" @click="routerTo(1)">
                <div class="left">
                    <img src="../../../assets/image/身份证.svg" alt />
                    <span class="desc">身份证认证</span>
                </div>
                <div class="right-arrow">
                    <span></span>
                    <span></span>
                    <span></span>
                </div>
            </div>
            <div class="type-item" @click="routerTo(2)">
                <div class="left">
                    <img src="../../../assets/image/yhk.svg" alt />
                    <span class="desc">银行卡认证</span>
                </div>
                <div class="right-arrow">
                    <span></span>
                    <span></span>
                    <span></span>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    methods: {
        /**
         * @param {Number} type 认证方式 1 身份证认证   2 银行卡认证
         */
        routerTo(type) {
            this.$router.push({
                path: type === 1 ? 'h5Certification1' : 'h5BankCardAuth',
                query: this.$route.query
            })
        }
    }
};
</script>

<style lang="scss" scoped>
.auth-way {
    height: 100%;
    background-color: #f1f2f6;
    .title {
        height: 0.88rem;
        line-height: 0.88rem;
        text-align: center;
        font-size: 0.34rem;
        color: #fff;
        background-image: linear-gradient(#006efe, #494aff);
    }
    .sub-title {
        height: 0.88rem;
        line-height: 0.88rem;
        font-size: 0.28rem;
        color: #999;
        padding-left: 0.32rem;
        background-color: #fff;
        margin-bottom: 0.24rem;
    }
    .type {
        padding: 0 0.32rem;
    }
    .type-item {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 0.43rem 0.32rem;
        background-color: #fff;
        border-radius: 0.16rem;
        margin-bottom: 0.32rem;
        .left {
            display: flex;
            align-items: center;
            img {
                width: 1.64rem;
                height: 1.14rem;
                margin-right: 0.32rem;
            }
            .desc {
                font-size: 0.32rem;
                color: #282828;
            }
        }
        .right-arrow {
            span {
                display: inline-block;
                width: 0.2rem;
                height: 0.2rem;
                border-top: 1px solid #295aff;
                border-right: 1px solid #295aff;
                transform: rotateZ(45deg);
                &:nth-of-type(1) {
                    border-color: #c4daf8;
                }
                &:nth-of-type(2) {
                    border-color: #8cbbf7;
                }
            }
        }
    }
}
</style>