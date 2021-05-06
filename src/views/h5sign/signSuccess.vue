<template>
    <div class="wrapper">
        <img src="../../assets/image/icon_success.svg" alt="">
        <h2 class="words">签署成功</h2>
        <p class="time">
            签署时间：<span>{{ signDate }}</span>
        </p>
        <div class="qr-code">
            <qriously
                :value="qrUrl"
                :size="160"
                :backgroundAlpha="1"
                ref="qrcode"
                class="qrcode-inner"
                style="text-align:center"
            ></qriously>
            <p class="qr-desc">长按扫码查看签章验证信息</p>
            <p class="security-number" v-if="isContract">保全号：{{ securityNumber }}</p>
        </div>
        <div class="btn-wrap">
            <div class="view btn" @click="view">查看</div>
            <div class="download btn" @click="download">下载</div>
            <div class="tip-tutor" @click="showTipDownload">无法下载？点击查看下载指南</div>
        </div>

        <div class="tip-download" v-if="isShowTip"  @click="hideTipDownload">
            <div class="tip-mask"></div>
            <img class="tip-img" :src="tipDownload">
            <div class="tip-tip">
                <div>点击右上角使用系统浏览器</div>
                <div>打开，然后再点击下载</div>
            </div>
        </div>
    </div>
</template>

<script>
import FileSaver from 'file-saver';
import { checkBlobFileResponseUtils } from '@/utils';
export default {
    components: {},
    props: {},
    data() {
        return {
            fileCode: '',
            fileName: '',
            signDate: '',
            qrUrl: '',
            isContract: this.$route.query.isFile !== '1',
            contractId: this.$route.query.contractId,
            securityNumber: '',

            tipDownload: require('@/assets/image/tip.svg'),
            isShowTip: false,

            // 来自工作流的文件下载，
            // 采用获取临时授权码下载
            iswf: false,
            tempCode: '',

        };
    },
    created() {
        let _query = this.$route.query
        
        if (_query) {    
            if (_query.iswf && _query.iswf == 1) {
                this.iswf = true
            }        
            this.tempCode = _query.tempCode
        }

        this.qrUrl = location.origin + 
            `/sign-sys/#/fileCenter/qrToPhoneReal?fileCode=${this.contractId}${this.isContract?'&isContract=1':''}`
        this.isContract && this.getDetail()
    },
    mounted() {
        this.fileCode = this.$route.query.fileCode;
        this.fileName = this.$route.query.fileName;
        this.signDate = this.$route.query.signDate;
    },
    methods: {
        // APIs
        // ----------------------------------------------------------------
        apiDownloadContract(data) {
            return this.$api('urlDownloadContract').post('postBlobQuery', null, data)
        },
        // ----------------------------------------------------------------
        view() {
            let query = {isView: '1'}
            Object.assign(query, this.$route.query)
            this.$router.push({
                path: 'h5SignContract',
                query
            });
        },
        async getDetail() {
            let url = this.$route.query.isSysUser == 1 ? 'viewContract' : 'noTokenViewContract'
            let res = await this.$api(url).post(
                'postQuery',
                {},
                {
                    contractId: this.contractId
                }
            );
            if (!res) return;
            this.securityNumber = res.data.data.securityNumber
        },
        async download() {
            let res = null

            if (this.iswf) {
                // ^ 来自工作流的下载
                console.log('.....');
                let _data = {
                    code: this.tempCode,
                    contractId: this.contractId
                }

                res = await this.apiDownloadContract(_data)

            } else {
                // ^ 普通下载
                let url = this.$route.query.isSysUser == 1 ? 'downloadContract' : 'noTokenDownloadContract'
                res = await this.$api(url).post(
                    'postBlobQuery',
                    {},
                    {
                        contractId: this.contractId
                    }
                );
            }

            if (!res) return;

            // console.log(res);
            checkBlobFileResponseUtils(res.data)
                .then((res1) => {
                    let fileName = res.headers['content-disposition'].split(
                        'filename='
                    )[1];
                    FileSaver.saveAs(res.data, fileName);
                })
                .catch((err) => {
                    this.$message.error(err);
                });
        },
        showTipDownload() {
            this.isShowTip = true
        },
        hideTipDownload() {
            this.isShowTip = false
        }
    }
};
</script>
<style lang="scss" scoped>
.wrapper {
    position: absolute;
    width: 100%;
    left: 0;
    top: 0;
    bottom: 0;
    text-align: center;
    padding-top: 1rem;
    overflow: auto;
    img {
        vertical-align: middle;
        margin-bottom: .5rem;
    }
    .words {
        font-size: 0.32rem;
        color: #282828;
        margin-bottom: 0.32rem;
    }
    .time {
        font-size: 0.28rem;
        color: #666;
        margin-bottom: .3rem;
    }
    .btn-wrap {
        line-height: 0.98rem;
        color: #fff;
        text-align: center;
        position: absolute;
        left: 0.32rem;
        right: .32rem;
        bottom: 0.64rem;
        font-size: 0.34rem;
        .btn {
            background: #006efe;
            width: 100%;
            height: 0.98rem;
            margin-top: .32rem;
            border-radius: 0.49rem;
            &.download {
                color: #666;
                bottom: 0.64rem;
                background-color: #fff;
                border: 1px solid #ccc;
            }
        }

        .tip-tutor {
            color: #99A9BF;
            font-size: .24rem;
        }
    }
    .qr-desc {
        color: #99A9BF;
        line-height: .6rem;
        margin-bottom: 0.5rem;
    }
    .security-number {
        font-size: 0.3rem;
    }

    .tip-download {
        position: absolute;
        height: 100%;
        width: 100%;
        top: 0;
        right: 0;

        .tip-mask {
            position: absolute;
            background-color: #222;
            width: 100%;
            height: 100%;
            opacity: .8;
            z-index: 0;
        }

        .tip-img {
            position: absolute;
            right: 10px;
            display: block;
            width: 200px;
            z-index: 1;
        }

        .tip-tip {
            position: absolute;
            right: 30px;
            top: 80px;
            color: #fff;
            text-align: left;

            div {
                line-height: 1.5;
            }
        }
    }
}
</style>