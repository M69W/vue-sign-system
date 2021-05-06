<template>
    <div class="wrapper scroller">
        <div class="scroll-inner">
            <h2 class="title">安印签章</h2>
            <div
                class="sign-list"
                v-for="(item, index) in signFileSignatureList"
                :key="index"
            >
                <h2 class="sign-num">印章{{ index + 1 }}:</h2>
                <div class="sign-message">
                    <h2 class="sign-title">签名信息</h2>
                    <div class="content">
                        <div>
                            <p class="info-title">是否有效</p>
                            <p class="info-message">
                                {{ item.signInfoRespDTO.effectiveDes }}
                            </p>
                        </div>
                        <div>
                            <p class="info-title">签署时间</p>
                            <p class="info-message">
                                {{ item.signInfoRespDTO.signTime }}
                            </p>
                        </div>
                        <div>
                            <p class="info-title">是否被篡改</p>
                            <p class="info-message">
                                {{ item.signInfoRespDTO.updateDes }}
                            </p>
                        </div>
                        <div>
                            <p class="info-title">时间戳时间</p>
                            <p class="info-message">
                                {{ item.signInfoRespDTO.timestamp }}
                            </p>
                        </div>
                    </div>
                </div>
                <div class="card-message">
                    <h2 class="sign-title">证书信息</h2>
                    <div class="content">
                        <div>
                            <p class="info-title">拥有者</p>
                            <p class="info-message">
                                {{ item.cerInfoRespDTO.ownwer }}
                            </p>
                        </div>
                        <div>
                            <p class="info-title">颁发机构</p>
                            <p class="info-message">
                                {{ item.cerInfoRespDTO.certificateAuthority }}
                            </p>
                        </div>
                        <div>
                            <p class="info-title">签名算法</p>
                            <p class="info-message">
                                {{ item.cerInfoRespDTO.signAlgorithm }}
                            </p>
                        </div>
                        <div>
                            <p class="info-title">有效时间</p>
                            <p class="info-message">
                                {{ item.cerInfoRespDTO.periodOfValidity }}
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <!-- <div class="btn-wrap">
                <el-button type="primary" @click="download"
                    >下载此文件</el-button
                >
        </div>-->
        <!-- <a href="" id="dowload" :download="fileName"></a> -->
    </div>
</template>

<script>
import BScroll from 'better-scroll';
export default {
    components: {},
    props: {},
    data() {
        return {
            signFileSignatureList: [
                // {
                //     signInfoRespDTO: {
                //         effectiveDes: '', // 是否有效
                //         signTime: '', // 签署时间
                //         timestamp: '', // 时间戳
                //         updateDes: '' // 是否被篡改
                //     },
                //     cerInfoRespDTO: {
                //         certificateAuthority: '', // 颁发机构
                //         periodOfValidity: '', // 有限期
                //         ownwer: '', // 拥有者
                //         signAlgorithm: '' // 签名算法
                //     }
                // }
            ],
            fileCode: '',
            // fileName: '',
            bscroll: null,
        };
    },
    created() {},
    mounted() {
        this.fileCode = this.$route.query.fileCode;
        // this.fileName = this.$route.query.fileName;
        this.timeOut = this.$route.query.timeOut;
        console.log(this.timeOut);
        if (this.timeOut) {
            this.timeOutFn();
            return;
        }
        this.checkContract()
        // 判断执行合同或文档验真
        // this.isContract ? this.checkContract() : this.checkSign();
    },
    watch: {},
    computed: {},
    methods: {
        timeOutFn() {
            this.$message.warning({
                message: '验证时效已过期！',
                customClass: 'h5-z-index'
            });
        },
        checkSign() {
            this.$api('vertifyFile')
                .get('getPath', {
                    fileCode: this.fileCode
                })
                .then((res) => {
                    if (!res) return;
                    let data = res.data.data.signFileSignatureList;
                    this.signFileSignatureList = data;
                    this.$nextTick(() => {
                        this.initBScroll();
                    });
                });
        },
        async checkContract() {
            console.log(11111111111);
            let res = await this.$api('contractVerify').post(
                'postPath',
                {},
                {
                    fileCode: this.fileCode
                }
            );
            if (!res) return;
            this.signFileSignatureList = res.data.data.signFileSignatureList;
            this.$nextTick(() => {
                this.initBScroll();
            });
        },
        initBScroll() {
            this.bscroll = new BScroll('.scroller', {
                scrollbar: {
                    fade: true
                }
            });
            // console.log(this.bscroll);
        }
        // download() {
        //     this.$api('downloadSignDoc')
        //         .get({
        //             query: [this.fileCode],
        //             responseType: 'blob'
        //         })
        //         .then((res) => {
        //             let blob = res.data;
        //             alert(blob);
        //             console.log(blob);
        //             // let reader = new FileReader();
        //             // reader.onload = function() {
        //             //     console.log(reader.result);
        //             // };
        //             // reader.readAsDataURL(blob);
        //             let url = window.URL.createObjectURL(blob);
        //             var a = document.createElement('a');
        //             a.download = this.fileName;
        //             a.href = url;
        //             $('body').append(a); // 修复firefox中无法触发click
        //             a.click();
        //             $(a).remove();
        //             // var src = url;
        //             // window.open(blob);
        //         });
        // }
    }
};
</script>
<style lang="scss" scoped>
.wrapper {
    width: 100%;
    position: absolute;
    left: 0;
    top: 0;
    bottom: 0;
    overflow: hidden;
    font-size: 0.5rem;
    color: #333;
    .scroll-inner {
        padding-bottom: 30px;
    }
    .title {
        height: 6vh;
        line-height: 6vh;
        text-align: center;
        font-size: 0.4rem;
        color: #fff;
        background: #999;
    }
    .sign-num {
        font-size: 0.3rem;
        text-align: left;
        margin-top: 20px;
        padding-left: 4vw;
        font-weight: bold;
    }
    .sign-message,
    .btn-wrap,
    .card-message {
        padding: 0 4vw;
        .sign-title {
            height: 6vh;
            line-height: 6vh;
            font-size: 0.3rem;
            border-bottom: solid 1px #ccc;
        }
        .content {
            border: solid 1px #ccc;
            border-bottom: none;
            margin-top: 1vh;
            div {
                min-height: 5vh;
                border-bottom: solid 1px #ccc;
                display: flex;
                p {
                    min-height: 5vh;
                    line-height: 3vh;
                    padding: 0 2vw;
                    word-break: break-all;
                    display: flex;
                    align-items: center;
                }
                p.info-title {
                    justify-content: flex-end;
                    width: 25vw;
                    text-align: right;
                    background: #efefef;
                    font-size: 0.25rem;
                }
                p.info-message {
                    flex: 1;
                    font-size: 0.25rem;
                }
            }
        }
        .el-button {
            width: 100%;
        }
    }
    .btn-wrap {
        margin: 20px 0;
        .el-button {
            height: 7vh;
        }
    }
    .card-message {
        margin-top: 20px;
    }
}
</style>