<template>
    <div class="new-home-page">
        <div class="home-cost-save">
            <div class="total-save">
                <div class="num">{{ totalCostSave }}</div>
                <div class="desc">累计节约（元）</div>
            </div>
            <div class="sign-count">
                <div
                    class="sign-count-item"
                    v-for="(item,index) in costList"
                    :key="item.desc"
                    :class="{before: index > 0}"
                >
                    <div class="num">{{ item.num }}</div>
                    <div class="desc">{{ item.desc }}</div>
                </div>
            </div>
        </div>
        <div class="home-sign">
            <div class="home-sign-item" v-for="(item, index) in signStatistics" :key="index">
                <div class="home-sign-statistics">
                    <div
                        class="home-sign-statistics-item"
                        v-for="(it, i) in item"
                        :key="it.desc + i + 1"
                        :class="{before: i > 0 && it.desc}"
                        @click="routerToList(it, index)"
                    >
                        <!-- <i class="iconfont" :class="it.icon"></i> -->
                        <img class="icon" :src="it.icon" alt />
                        <div class="right">
                            <div class="num">{{ it.num }}</div>
                            <div class="desc">{{ it.desc }}</div>
                        </div>
                    </div>
                </div>
                <div class="operate-btn" @click="routerTo(index)">
                    <img
                        class="icon"
                        :src="require(index === 0 ? '@/assets/image/home/shouye-qianfawenjian.svg' : '@/assets/image/home/shouye-faqihetong.svg')"
                    />
                    <p>{{ index === 0 ? '签发文件' : '发起合同' }}</p>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import { sessionStore } from '@/utils'

export default {
    data() {
        return {
            totalCostSave: 0,
            costList: [
                {
                    num: 0,
                    desc: '累计签署'
                },
                {
                    num: 0,
                    desc: '长效证书'
                },
                {
                    num: 0,
                    desc: '事件证书'
                },
                {
                    num: 0,
                    desc: 'UKEY证书'
                }
            ],
            signStatistics: [
                [
                    {
                        num: 0,
                        desc: '累计签署',
                        icon: require('@/assets/image/home/shouye-wenjian.svg')
                    },
                    {
                        num: 0,
                        desc: '待我填写',
                        icon: require('@/assets/image/home/shouye-wenjian-daiwotianxie.svg'),
                        status: '070'
                    },
                    {
                        num: 0,
                        desc: '待我签',
                        icon: require('@/assets/image/home/shouye-wenjian-daiwoqian.svg'),
                        status: '0401'
                    },
                    {
                        num: 0,
                        desc: '待他人签',
                        icon: require('@/assets/image/home/shouye-wenjian-daitarenqian.svg'),
                        status: '040203'
                    },
                    {}
                ],
                [
                    {
                        num: 0,
                        desc: '累计签署',
                        icon: require('@/assets/image/home/shouye-hetong.svg')
                    },
                    {
                        num: 0,
                        desc: '待我填写',
                        icon: require('@/assets/image/home/shouye-hetong-daiwotianxie.svg'),
                        status: '070'
                    },
                    {
                        num: 0,
                        desc: '待我签',
                        icon: require('@/assets/image/home/shouye-hetong-daiwoqian.svg'),
                        status: '0401'
                    },
                    {
                        num: 0,
                        desc: '待他人签',
                        icon: require('@/assets/image/home/shouye-hetong-daitarenqian.svg'),
                        status: '040203'
                    },
                    {
                        num: 0,
                        desc: '即将过期',
                        icon: require('@/assets/image/home/shouye-hetong-jijiangguoqi.svg'),
                        status: '08'
                    }
                ]
            ]
        };
    },
    created() {
        this.init();
    },
    methods: {
        async init() {
            let res = await this.$api('reportHomePage').get();
            if (!res) return;
            console.log(res);
            const data = res.data.data;
            this.totalCostSave = data.cumulativeSavings;
            const costList = [
                data.allSignNumber,
                data.signatureLongLasting,
                data.signatureEvent,
                data.signatureUkey
            ];
            this.costList.forEach((v, i) => (v.num = costList[i]));
            const signStatistics = [
                [
                    data.allSignNumberFile,
                    data.toBeFilledFile,
                    data.toBeSignedFile,
                    data.toBeSignedOthersFile,
                ],
                [
                    data.allSignNumberContract,
                    data.toBeFilledContract,
                    data.toBeSignedContract,
                    data.toBeSignedOthersContract,
                    data.willExpireSoonContract
                ]
            ]
            this.signStatistics.forEach((v,i)=>{
                v.forEach((val,ind)=>val.num = signStatistics[i][ind])
            })
        },
        routerTo(index) {
            const path =
                index === 0
                    ? '/fileCenter/StartContract'
                    : '/contractMgt/startContract/step1';
            this.$router.push(path);
        },
        routerToList(item, index) {
            let url = index === 0 ? '/fileCenter/fileManage' : '/contractMgt/index'
            item.status && sessionStore.set('homeSearchStatus', item.status)
            this.$router.push(url)
        }
    }
};
</script>

<style lang="scss" scoped>
.new-home-page {
    background-color: #f4f6f8;
    position: absolute;
    left: 0;
    top: 0;
    right: 0;
    bottom: 0;
    overflow-x: auto;
    .home-cost-save {
        padding: 40px;
        color: #fff;
        background-color: #fff;
        line-height: 60px;
        overflow: hidden;
        .num {
            font-size: 24px;
            text-align: center;
        }
        .desc {
            font-size: 20px;
            text-align: center;
        }
        > div {
            display: inline-block;
            vertical-align: middle;
        }
        .total-save {
            // width: 280px;
            width: 20%;
            float: left;
            padding: 0 20px;
            margin-right: 40px;
            border-radius: 8px;
            background-image: linear-gradient(
                225deg,
                #83d6f1 0%,
                #74b5f0 23%,
                #526ee8 100%
            );
            .num {
                position: relative;
                &::after {
                    content: '';
                    width: 100%;
                    height: 1px;
                    background-color: #dde1ee;
                    position: absolute;
                    left: 0;
                    bottom: 0;
                }
            }
        }
        .sign-count {
            width: 75%;
            float: right;
            background-image: linear-gradient(-49deg, #f7c598 0%, #ff8886 100%);
            box-shadow: 0 2px 5px 0 rgba(83, 97, 255, 0.05);
            border-radius: 8px;
            &-item {
                display: inline-block;
                vertical-align: middle;
                // width: 280px;
                width: 25%;
                padding: 0 20px;
                position: relative;
                &.before::before {
                    content: '';
                    position: absolute;
                    top: 30px;
                    left: 0;
                    width: 1px;
                    height: 60px;
                    background-color: #fecac4;
                }
            }
        }
    }
    .home-sign {
        &-item {
            margin-top: 20px;
            overflow: hidden;
            .home-sign-statistics {
                float: left;
                background-color: #fff;
                padding: 35px 0;
                width: 80%;
                &-item {
                    float: left;
                    width: 20%;
                    text-align: center;
                    position: relative;
                    border-radius: 4px;
                    cursor: pointer;
                    > div {
                        display: inline-block;
                    }
                    &.before::before {
                        content: '';
                        position: absolute;
                        top: 0;
                        left: 0;
                        width: 1px;
                        height: 60px;
                        background-color: #e2edff;
                    }
                    .icon {
                        margin-right: 30px;
                        font-size: 50px;
                        color: #4393fe;
                    }
                    .num,
                    .desc {
                        text-align: center;
                        line-height: 30px;
                    }
                    .num {
                        font-size: 26px;
                        color: #333;
                    }
                    .desc {
                        font-size: 20px;
                        color: #99a9bf;
                    }
                }
            }
            .operate-btn {
                float: right;
                width: 18%;
                height: 130px;
                background-color: #fff;
                border-radius: 4px;
                text-align: center;
                font-size: 20px;
                color: #333;
                padding-top: 20px;
                cursor: pointer;
                img {
                    margin-bottom: 15px;
                }
            }
        }
    }
}
</style>