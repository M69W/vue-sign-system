<template>
    <div class="living-step3">
        <header class="header" @click="$router.go(-1)">
            <div class="left">
                <i class="el-icon-arrow-left"></i>
                <span>返回</span>
            </div>认证完成
        </header>
        <div class="main" v-if="code === '0'">
            <step-list index="3"></step-list>
            <div class="content">
                <p>
                    <img src="../../../assets/image/icon_success.svg" alt />
                </p>
                <p>恭喜您！活体检测成功</p>
            </div>
            <div class="btn-box">
                <p>系统将在{{second}}s后<span @click="toSign">跳转至签署页面</span></p>
            </div>
        </div>
        <div class="main" v-else>
            <step-list index="2" :error="true"></step-list>
            <div class="content">
                <p>
                    <img src="../../../assets/image/fail.svg" alt />
                </p>
                <p>很遗憾！活体检测失败</p>
                <p>失败原因：{{ reasons[code] }}</p>
            </div>
            <div class="btn-box">
                <div class="btn" @click="getLivingInfo">重新活体检测</div>
            </div>
        </div>
    </div>
</template>

<script>
import stepList from './stepList';
import { sessionStore } from '@/utils'
import reasons from './livingCheackCode'
import qs from 'qs'

export default {
    components: { stepList },
    data() {
        return {
            second: 3,
            timer: null,
            reasons,
            code: ''
        };
    },
    created () {
        this.getCode()
        if (this.code === '0') {
            this.countDown()
        }
    },
    methods: {
        async getLivingInfo() {
            let { personId: idNo, name } = sessionStore.get('contractInfo')
            let res1 = await this.$api('faceRecognition').post('', {
                businessType: this.$route.query.isEnterprise === '1' ? '02' : '01',
                idNo,
                name,
                orderNo: this.getSearchObj(location.search.split('?')[1])['orderNo'],
                userId: this.getSearchObj(location.search.split('?')[1])['orderNo'],
                phoneNumber: this.$route.query.phone
            })
            if(!res1) return
            const data = res1.data.data
            let url = 'https://ida.webank.com/api/web/login?'
            let query = qs.stringify({
                webankAppId: data.webankAppId,
                version: data.version,
                nonce: data.nonce,
                orderNo: data.orderNo,
                h5faceId: data.h5faceId,
                url: location.origin + location.pathname + location.hash,
                userId: data.userId,
                sign: data.sign,
                from: 'browser'
            })
            url += query
            location.href = url
        },
        toSign() {
            // 将第三方返回的地址的hash和search重新排序
            if (location.search && location.href.indexOf(location.search) < location.href.indexOf(location.hash)) {
                location.href = location.origin + location.pathname + location.hash.replace('h5Certification3','h5SignContract');
                return;
            }
            this.$router.push({
                path: 'h5SignContract',
                query: this.$route.query
            })
        },
        countDown(){
            this.timer = setInterval(() => {
                this.second --
                if (this.second <= 0) {
                    if(this.timer) clearInterval(this.timer)
                    this.toSign()
                }
            }, 1000);
        },
        getCode() {
            const search = location.search.split('?')[1]
            this.code = this.getSearchObj(search)['code']
        },
        getSearchObj(search) {
            return JSON.parse(
                '{"' +
                    decodeURIComponent(search)
                        .replace(/"/g, '\\"')
                        .replace(/&/g, '","')
                        .replace(/=/g, '":"') +
                '"}'
            );
        }
    },
    beforeRouteLeave (to, from, next) {
        if(this.timer) clearInterval(this.timer)
        next()
    }
};
</script>

<style lang="scss" scoped>
.living-step3 {
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
            .btn {
                height: 1rem;
                line-height: 0.98rem;
                border-radius: 0.6rem;
                text-align: center;
                font-size: 0.34rem;
                background-color: #006efe;
                color: #fff;
                margin-bottom: 0.32rem;
                border: 0.01rem solid #006efe;

                &:last-of-type {
                    background-color: #fff;
                    color: #666;
                    border: 0.01rem solid #ccc;
                }
            }
        }
    }
}
</style>