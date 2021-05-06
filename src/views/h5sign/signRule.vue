<template>
    <!-- 签署方式选择 -->
    <div class="sign-rule" @click="showDerection = false">
        <div class="title">
            <div class="go-back" @click="goBack">
                <i class="el-icon-arrow-left"></i>
                <span>返回</span>
            </div>
            签署规则
        </div>
        <div class="content">
            <div class="rule-item start-page" v-if="typeNum !== 1">
                <div class="item-inner">
                    <div class="wordd">签章起始页</div>
                    <div class="page-input" @click="focusStart">
                        <span>第</span>
                        <input
                            type="number"
                            ref="start"
                            v-model.number="ruleForm.startPageNo"
                        />
                        <span>页</span>
                        <i class="el-icon-arrow-right"></i>
                    </div>
                </div>
            </div>
            <div class="rule-item start-page" v-if="typeNum !== 1">
                <div class="item-inner no-border">
                    <div class="wordd">签章结束页</div>
                    <div class="page-input" @click="focusEnd">
                        <span>第</span>
                        <input
                            type="number"
                            ref="end"
                            v-model.number="ruleForm.endPageNo"
                        />
                        <span>页</span>
                        <i class="el-icon-arrow-right"></i>
                    </div>
                </div>
            </div>
            <div class="rule-item derection no-border" v-if="typeNum === 3">
                <div class="item-inner no-border">
                    <div class="wordd">签署方向</div>
                    <div class="page-input" @click.stop="chooseDirection">
                        <span>{{ derectionDisc }}</span>
                        <i class="el-icon-arrow-right"></i>
                    </div>
                </div>
                <div class="item-inner no-border">
                    <div class="wordd">一枚印章覆盖页数</div>
                    <input
                        type="number"
                        v-model.number="ruleForm.pageSize"
                        class="page-size"
                    />
                </div>
            </div>
            <div class="rule-item foggy">
                <div class="item-inner">
                    <div class="wordd">签章雾化</div>
                    <div class="page-input foggy">
                        <el-switch v-model="ruleForm.foggy"></el-switch>
                    </div>
                </div>
            </div>
            <div class="rule-item grey">
                <div class="item-inner no-border">
                    <div class="wordd">签章脱密</div>
                    <div class="page-input grey">
                        <el-switch v-model="ruleForm.grey"></el-switch>
                    </div>
                </div>
            </div>
        </div>
        <span class="back" type="primary" @click="nextStep">下一步</span>
        <transition name="decoration">
            <div class="derection-tap" v-if="showDerection">
                <div class="left" @click="chooseDir(0)">左边</div>
                <div class="right" @click="chooseDir(1)">右边</div>
            </div>
        </transition>
    </div>
</template>

<script>
import { checkIntegral, sessionStore } from '@/utils';
export default {
    components: {},
    props: {},
    data() {
        return {
            ruleForm: {
                foggy: false,
                grey: false,
                signatureDirection: 0,
                startPageNo: 1,
                endPageNo: 1,
                pageSize: ''
            },
            typeNum: 0,
            showDerection: false,
            derectionDisc: '左边',
            query: {}
        };
    },
    created() {},
    mounted() {
        this.query = sessionStore.get('h5info');
        this.typeNum = this.query.typeNum;
    },
    methods: {
        nextStep() {
            if (this.typeNum === 2 || this.typeNum === 3) {
                console.log(this.ruleForm);
                if (
                    !checkIntegral(this.ruleForm.startPageNo) ||
                    !checkIntegral(this.ruleForm.endPageNo)
                ) {
                    this.$message.warning({
                        message: '请输入正整数页码！',
                        center: true,
                        customClass: 'h5-z-index'
                    });
                    return;
                }
                if (
                    this.ruleForm.startPageNo > this.query.totalPage ||
                    this.ruleForm.endPageNo > this.query.totalPage
                ) {
                    this.$message.warning({
                        message: '签署页不能大于总页数！',
                        center: true,
                        customClass: 'h5-z-index'
                    });
                    return;
                }
                if (this.ruleForm.startPageNo >= this.ruleForm.endPageNo) {
                    this.$message.warning({
                        message: '起始页不能大于等于结束页！',
                        center: true,
                        customClass: 'h5-z-index'
                    });
                    return;
                }
                if (this.typeNum === 3) {
                    if (!this.ruleForm.pageSize) {
                        this.$message.warning({
                            message: '请输入印章覆盖页数！',
                            center: true,
                            customClass: 'h5-z-index'
                        });
                        return;
                    } else if (!checkIntegral(this.ruleForm.pageSize)) {
                        this.$message.warning({
                            message: '印章覆盖页数只能为正整数！',
                            center: true,
                            customClass: 'h5-z-index'
                        });
                        return;
                    } else if (this.ruleForm.pageSize > this.query.totalPage) {
                        this.$message.warning({
                            message: '印章覆盖页数不能大于结束页！',
                            center: true,
                            customClass: 'h5-z-index'
                        });
                        return;
                    }
                }
            }
            let h5info = Object.assign({}, this.query, this.ruleForm);
            sessionStore.set('h5info', h5info);
            this.$router.push({
                path: '/h5sign/h5SignIndex',
                query: {
                    fileCode: h5info.fileCode,
                    fileName: h5info.fileName
                }
            });
        },
        focusStart() {
            this.$refs.start.focus();
        },
        focusEnd() {
            this.$refs.end.focus();
        },
        chooseDirection() {
            this.showDerection = !this.showDerection;
        },
        chooseDir(num) {
            this.ruleForm.signatureDirection = num;
            let dirMap = {
                0: '左边',
                1: '右边'
            };
            this.derectionDisc = dirMap[num];
            this.showDerection = false;
        },
        startChange(val) {
            this.ruleForm.startPageNo = this.ruleForm.startPageNo.replace(
                /[^(\d+| 0)(\.\d+)]/g,
                ''
            );
        },
        endChange(val) {
            this.ruleForm.endPageNo = this.ruleForm.endPageNo.replace(
                /[^(\d+| 0)(\.\d+)]/g,
                ''
            );
        },
        goBack() {
            this.$router.go(-1);
        }
    }
};
</script>
<style lang="scss" scoped>
.sign-rule {
    background: #f1f2f6;
    height: 100%;
    .title {
        height: 0.88rem;
        line-height: 0.88rem;
        font-size: 0.28rem;
        padding: 0 0.32rem;
        color: #999;
        display: flex;
        background: #fff;
        margin-bottom: 0.28rem;
        .go-back {
            margin-right: 10px;
        }
    }
    .content {
        .rule-item {
            padding-left: 0.32rem;
            background: #fff;
            .item-inner {
                display: flex;
                height: 1.12rem;
                justify-content: space-between;
                width: 100%;
                border-bottom: solid 1px #eee;
                align-items: center;
                color: #282828;
                font-size: 0.32rem;
                .page-input {
                    display: flex;
                    align-items: center;
                    margin-right: 0.18rem;
                    color: #666;
                    width: 60%;
                    justify-content: flex-end;
                    height: 100%;
                    i {
                        color: #ccc;
                        font-size: 0.4rem;
                    }
                    input {
                        border: none;
                        height: 30px;
                        width: 0.52rem;
                        text-align: right;
                        margin: 0 5px;
                        color: #666;
                        font-size: 0.32rem;
                        &:focus {
                            outline: none;
                        }
                    }
                }
                .foggy,
                .grey {
                    margin-right: 0.32rem;
                }
                .page-size {
                    width: 2rem;
                    height: 0.6rem;
                    margin-right: 0.32rem;
                    text-align: center;
                    border: solid 1px #eee;
                    border-radius: 0.1rem;
                    &:focus {
                        // border-color: #006efe;
                    }
                }
            }
            .no-border {
                border: none;
            }
        }
        .derection,
        .foggy {
            margin-top: 0.24rem;
        }
    }
    .back {
        width: 6.86rem;
        height: 0.98rem;
        line-height: 0.98rem;
        color: #fff;
        text-align: center;
        background: #006efe;
        border-radius: 0.49rem;
        position: absolute;
        left: 0.32rem;
        bottom: 0.64rem;
        font-size: 0.34rem;
    }
    .derection-tap {
        background: #fff;
        width: 100%;
        position: absolute;
        left: 0;
        bottom: 0;
        opacity: 1;
        div {
            text-align: center;
            height: 1rem;
            line-height: 1rem;
            color: #282828;
            &:first-of-type {
                border-bottom: solid 1px #eee;
            }
        }
    }
    .decoration-enter-active,
    .decoration-leave-active {
        transition: all 0.5s;
    }
    .decoration-enter,
    .decoration-leave-to {
        bottom: -2rem;
        opacity: 0;
    }
}
</style>
<style lang="scss">
.sign-rule {
    .el-switch__core {
        height: 0.56rem;
        width: 1.12rem !important;
        border-radius: 0.28rem;
        &::after {
            width: 0.48rem;
            height: 0.48rem;
            top: 0.03rem;
            left: 0.03rem;
        }
    }
    .el-switch.is-checked .el-switch__core::after {
        margin-left: -0.52rem;
    }
    .el-switch.is-checked .el-switch__core {
        border-color: #0bc161;
        background-color: #0bc161;
    }
}
</style>
