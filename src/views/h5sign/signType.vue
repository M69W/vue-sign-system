<template>
    <!-- 签署方式选择 -->
    <div class="sign-type">
        <div class="title">
            <div class="back" @click="goBack">
                <i class="el-icon-arrow-left"></i>
                <span>返回</span>
            </div>
            请选择签署方式
        </div>
        <div class="content">
            <div class="item single-type" @click="chooseType(1)">
                <div class="left">
                    <i class="iconfont icon-danye"></i>
                    <span>单页签章</span>
                </div>
                <div class="right">
                    <img :src="arrow" alt="" />
                </div>
            </div>
            <div class="item single-type" @click="chooseType(2)" v-if="!domain">
                <div class="left">
                    <i class="iconfont icon-danye"></i>
                    <span>多页签章</span>
                </div>
                <div class="right">
                    <img :src="arrow" alt="" />
                </div>
            </div>
            <div class="item single-type" @click="chooseType(3)" v-if="!domain">
                <div class="left">
                    <i class="iconfont icon-danye"></i>
                    <span>骑缝签章</span>
                </div>
                <div class="right">
                    <img :src="arrow" alt="" />
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import { sessionStore } from '@/utils';
export default {
    components: {},
    props: {},
    data() {
        return {
            arrow: require('@/assets/image/h5arrow.svg'),
            query: {},
            domain: ''
        };
    },
    created() {},
    mounted() {
        this.query = this.$route.query;
        this.domain = this.query.domain;
    },
    methods: {
        chooseType(typeNum) {
            let h5info = Object.assign({}, this.query, {
                typeNum: typeNum
            });
            sessionStore.set('h5info', h5info);
            this.$router.push({
                path: '/h5sign/h5SignRule',
                query: {
                    fileCode: h5info.fileCode,
                    fileName: h5info.fileName
                }
            });
        },
        goBack() {
            this.$router.go(-1);
        }
    }
};
</script>
<style lang="scss" scoped>
.sign-type {
    background: #f1f2f6;
    height: 100%;
    .title {
        height: 0.88rem;
        line-height: 0.88rem;
        font-size: 0.28rem;
        padding: 0 0.32rem;
        display: flex;
        color: #999;
        background: #fff;
        margin-bottom: 0.28rem;
        .back {
            margin-right: 10px;
        }
    }
    .content {
        width: 6.86rem;
        position: relative;
        margin: 0 auto;
        .item {
            width: 100%;
            height: 1.42rem;
            padding: 0.3rem 0.37rem;
            background: #fff;
            text-align: center;
            font-size: 0.18rem;
            margin-top: 0.32rem;
            display: flex;
            justify-content: space-between;
            align-items: center;
            border-radius: 0.16rem;
            .left {
                display: flex;
                align-items: center;
                .icon-danye {
                    font-size: 0.65rem;
                    color: #006efe;
                    margin-right: 0.25rem;
                }
                span {
                    font-size: 0.32rem;
                }
            }
            .right {
                height: 100%;
                display: flex;
                flex-direction: column;
                img {
                    width: 0.46rem;
                }
            }
        }
    }
}
</style>