<template>
    <div class="steplist">
        <div class="step" :class="{'ing':index=='0','ok':['1','2','3'].includes(index)}" v-if="size=='4'">
            <div class="line"></div>
            <div class="num">
                <span>1</span>
            </div>
            <div class="name">企业认证</div>
        </div>
        <div class="step" :class="{'ing':index=='1','ok':['2','3'].includes(index)}">
            <div class="line"></div>
            <div class="num">
                <span>{{size-2}}</span>
            </div>
            <div class="name">{{size=='4'?'法人认证':'身份认证'}}</div>
        </div>
        <div class="step" :class="{'ing':index=='2','ok':['3'].includes(index),'error':error}">
            <div class="line"></div>
            <div class="num">
                <span>{{size-1}}</span>
            </div>
            <div class="name">活体检测</div>
        </div>
        <div class="step" :class="{'ing':index=='3','ok':index=='3','error':error}">
            <div class="line"></div>
            <div class="num">
                <span>{{size}}</span>
            </div>
            <div class="name">认证完成</div>
        </div>
    </div>
</template>

<script>
export default {
    props: {
        index: {
            default: '1',
            type: String
        },
        error: {
            default: false,
            type: Boolean
        },
        size: {
            default: '3',
            type: [String, Number]
        }
    }
};
</script>

<style scoped lang="scss">
.steplist {
    padding: 0.32rem 0;
    text-align: center;
    display: flex;
    align-items: center;
    justify-content: center;
    display: -webkit-flex;
    flex-flow: row;
    flex-wrap: wrap;
    background-color: #f5f5f5;

    .step {
        flex: 1;
        text-align: center;
        position: relative;

        .num {
            position: relative;
            width: 0.48rem;
            height: 0.48rem;
            border-radius: 50%;
            background: #ccc;
            color: #fff;
            line-height: 0.48rem;
            margin: auto;
            span {
                font-size: 0.24rem;
                color: #ffffff;
            }
        }

        .name {
            font-size: 0.24rem;
            color: #999;
            padding-top: 0.16rem;
            line-height: 0.34rem;
        }

        .line {
            height: 0.02rem;
            position: absolute;
            left: 50%;
            right: -50%;
            top: 0.23rem;
            background: #ccc;
        }

        &:last-child .line {
            width: 0;
            display: none;
        }
        &.ing {
            .num {
                background-color: #006efe;
            }
            .name {
                color: #282828;
            }
        }
        &.error {
            .num {
                background-color: #f76260;
            }
            .name {
                color: #282828;
            }
            .line {
                background-color: #f76260;
            }
        }
        &.ok {
            .num {
                background-color: #fff;
                background-image: url('../../../assets/image/success.svg');
                background-size: 100%;
                span {
                    display: none;
                }
            }
            .line {
                background-color: #0bc161;
            }
            .name {
                color: #282828;
            }
        }
    }
}
</style>
