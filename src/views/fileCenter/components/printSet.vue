<template>
    <div class="print-set">
        <!-- 打印弹框 -->
        <el-dialog
            title="打印设置"
            :visible.sync="parentCom.printSetVisible"
            width="700px"
            :before-close="handleClose"
            class="print-set-component"
            :close-on-click-modal="false"
        >
            <div class="bb print-effect print-set-item">
                <div class="print-label">打印效果</div>
                <div class="print-set-content">
                    <el-checkbox v-model="atomization" :disabled="origin"
                        >雾化打印</el-checkbox
                    >
                    <el-checkbox v-model="graying" :disabled="origin"
                        >脱密打印</el-checkbox
                    >
                    <!-- <el-checkbox v-model="grating" :disabled="origin">光栅</el-checkbox>
                    <el-checkbox v-model="watermark" :disabled="origin">防伪水印</el-checkbox>-->
                    <el-checkbox v-model="origin">仅打印原文</el-checkbox>
                </div>
            </div>
            <div class="bb summary print-set-item">
                <div class="print-label">签署摘要</div>
                <div class="print-set-content">
                    <el-checkbox v-model="summary">签署摘要</el-checkbox>
                    <span class="pages">共一页</span>
                    <span class="desc">(包含签署方、验证码和二维码等信息)</span>
                </div>
            </div>
            <div class="print-set-item file-list">
                <div class="print-label">电子文件</div>
                <div class="print-set-content contract-file">
                    <el-scrollbar>
                        <el-checkbox-group v-model="fileCodes">
                            <div
                                class="content-item"
                                v-for="(item, index) in fileList"
                                :key="index"
                            >
                                <el-checkbox :label="item.fileCode">
                                    {{ item.fileName }}
                                    <span class="pages"
                                        >共{{ item.pageTotal }}页</span
                                    >
                                </el-checkbox>
                            </div>
                        </el-checkbox-group>
                    </el-scrollbar>
                    <!-- <div class="content-item">
                        <el-checkbox v-model="summary">文件二</el-checkbox>
                        <span class="pages">共一页</span>
                    </div>-->
                </div>
            </div>
            <div class="dialog-footer">
                <el-button @click="basicClose">取 消</el-button>
                <el-button type="primary" @click="printContract"
                    >打 印</el-button
                >
            </div>
        </el-dialog>
        <!-- 加载弹框 -->
        <el-dialog
            :visible.sync="loadingVisible"
            width="640px"
            :before-close="handleClose"
            class="print-set-loading"
        >
            <p class="loading-text">{{ loadingText }}</p>
            <!-- <p class="loading">大约需要3s</p> -->
            <el-progress
                :percentage="progress"
                class="progress"
                :show-text="false"
            ></el-progress>
            <P class="loading-summary" v-show="summary">签署摘要</P>
            <p
                class="loading-files"
                v-for="(item, index) in checkedList"
                :key="index"
            >
                {{ item.fileName }}
            </p>
        </el-dialog>
    </div>
</template>

<script>
import printSummary from './print-summary';
import { checkBlobFileResponseUtils } from '@/utils';
import printJS from 'print-js';

export default {
    props: {
        parentCom: {
            default() {
                return {};
            }
        },
        fileList: {
            default() {
                return [];
            }
        },
        contractInfo: {
            default() {
                return {};
            }
        }
    },
    data() {
        return {
            atomization: false, // 雾化打印
            graying: false, // 脱密打印
            grating: false, // 光栅
            watermark: false, // 防伪水印
            origin: false, // 仅打印原文
            summary: true, // 摘要
            loadingVisible: false,
            progress: 0,
            timer: '',
            fileCodes: [], // 选中列表
            loadingText: '文件加载中...',
            checkedList: []
        };
    },
    computed: {},
    created() {},
    watch: {
        fileList(val) {
            this.fileCodes = val.map((v) => v.fileCode);
        },
        atomization(val) {
            if (val) {
                this.grating = false;
                this.watermark = false;
            }
        },
        graying(val) {
            if (val) {
                this.grating = false;
                this.watermark = false;
            }
        },
        watermark(val) {
            if (val) {
                this.graying = false;
                this.atomization = false;
            }
        },
        grating(val) {
            if (val) {
                this.graying = false;
                this.atomization = false;
            }
        },
        origin(val) {
            if (val) {
                this.atomization = false;
                this.graying = false;
                this.grating = false;
                this.watermark = false;
            }
        }
    },
    methods: {
        handleClose(done) {
            this.atomization = false;
            this.graying = false;
            this.grating = false;
            this.watermark = false;
            this.origin = false;
            this.summary = true;
            this.fileCodes = [];
            done();
        },
        basicClose() {
            this.handleClose(() => (this.parentCom.printSetVisible = false));
        },
        async printContract() {
            if (!this.fileCodes.length)
                return this.$message.error({
                    message: '请选择需要打印的文件！',
                    customClass: 'zZindex'
                });
            let context = '';
            if (this.summary) {
                context = printSummary(
                    this.contractInfo,
                    this.parentCom.printRow.verificationCode,
                    this.parentCom.printRow.base64
                );
            }
            // console.log(context);
            let sendData = {
                atomization: this.atomization,
                graying: this.graying,
                grating: this.grating,
                watermark: this.watermark,
                origin: this.origin,
                context,
                fileCodes: this.fileCodes
            };
            let res = await this.$api('printSet').post('postBlob', sendData);
            if (!res) return;
            console.log(res);
            checkBlobFileResponseUtils(res.data)
                .then((res1) => {
                    this.progress = 0;
                    this.checkedList = this.fileList.filter((v) =>
                        this.fileCodes.includes(v.fileCode)
                    );
                    this.handleClose(
                        () => (this.parentCom.printSetVisible = false)
                    );
                    this.loadingVisible = true;
                    let pdfUrl = this.blob2Url(res.data);
                    let that = this;
                    printJS({
                        printable: pdfUrl,
                        onLoadingStart(val) {
                            that.timer = setInterval(() => {
                                if (that.progress >= 90) {
                                    clearInterval(that.timer);
                                    return;
                                }
                                that.progress += 10;
                            }, 100);
                        },
                        onLoadingEnd(val) {
                            clearInterval(that.timer);
                            that.progress = 100;
                            that.loadingText = '加载完成';
                            setTimeout(() => {
                                that.loadingVisible = false;
                            }, 700);
                        }
                    });
                })
                .catch((err) => {
                    this.$message.error(err);
                });

            // this.timer = setInterval(() => {
            //     this.progress += 10;
            //     if (this.progress >= 100 && this.timer) {
            //         clearInterval(this.timer);
            //     }
            // }, 100);
        },
        blob2Url(blob) {
            let url;
            if (window.createObjectURL != undefined) {
                // basic
                url = window.createObjectURL(blob);
            } else if (window.URL != undefined) {
                // mozilla(firefox)
                url = window.URL.createObjectURL(blob);
            } else if (window.webkitURL != undefined) {
                // webkit or chrome
                url = window.webkitURL.createObjectURL(blob);
            }
            return url;
        }
    }
};
</script>
<style lang="scss" scoped>
.print-set {
    .print-set-component {
        .print-set-item {
            padding-left: 20px;
            display: flex;
            height: 56px;
            &.file-list {
                max-height: 200px;
                min-height: 115px;
                .print-label {
                    height: 56px;
                }
                .el-scrollbar {
                    height: 100%;
                }
            }
            .print-label {
                color: #626262;
                width: 60px;
                margin-right: 10px;
                display: flex;
                align-items: center;
            }
            .print-set-content {
                display: flex;
                align-items: center;
                .el-checkbox {
                    margin-right: 0px;
                    .el-checkbox__label {
                        font-weight: bold;
                    }
                }
                .pages {
                    margin-left: 8px;
                    margin-right: 10px;
                    color: #999;
                }
                .desc {
                    color: #666;
                }
                &.contract-file {
                    flex-direction: column;
                    margin-top: 15px;
                    // box-shadow: 0 -1px 3px #efefef inset;
                    padding: 3px;
                    .content-item {
                        margin-bottom: 8px;
                    }
                }
            }
            &.print-effect {
                .el-checkbox {
                    margin-right: 32px;
                }
            }
        }
        .bb {
            border-bottom: 1px solid #eee;
        }
        .dialog-footer {
            text-align: center;
            padding: 30px 0;
            .el-button {
                margin: 0 10px;
            }
        }
    }
    .print-set-loading {
        .loading-text {
            text-align: center;
            font-size: 16px;
            font-family: 'PingFangSC-Medium';
            color: #000;
            margin-bottom: 20px;
        }
        .progress {
            width: 100%;
            height: 10px;
            margin-bottom: 15px;
        }
        .loading-summary {
            color: #626262;
            line-height: 30px;
        }
        .loading-files {
            color: #000;
            line-height: 30px;
        }
    }
}
</style>
<style lang="scss">
.print-set {
    .el-dialog__header {
        height: 40px;
    }
    .el-dialog__body {
        padding: 20px 70px;
    }
    .print-set-component {
        .el-dialog__body {
            padding: 0 7px 0 33px;
            .el-checkbox__label {
                color: #000;
                font-family: 'PingFangSC-Regular';
            }
            .el-checkbox.is-disabled {
                .el-checkbox__label {
                    color: #c0c4cc;
                }
            }
        }
    }
}
</style>