<template>
    <div class="elec-vertify">
        <div class="title">电子文件验证</div>
        <div class="container">
            <h1>电子文件查验</h1>
            <el-upload
                class="upload-demo"
                action="https://jsonplaceholder.typicode.com/posts/"
                :on-success="uploadSuccess"
                :on-error="uploadFaild"
                :http-request="resetFile"
                :limit="1"
                :file-list="fileList"
                accept=".pdf, .ofd"
            >
                <el-button size="small">上传PDF/OFD文件</el-button>
                <div slot="tip" class="el-upload__tip">
                    查询流程：将已完成签章的电子文件上传（目前仅支持PDF/OFD格式文件验真），文件上传成功后验证结果自动展示。
                </div>
            </el-upload>
            <div class="container-guide">
                <div class="guide-title">
                    <span>电子文件查验指南</span>
                </div>
                <ul>
                    <li>
                        <span class="tit"
                            >1，如果已完成签章的电子文件不是PDF/OFD格式怎么办？</span
                        >
                        <span class="cont"
                            >答：对不起，目前平台仅支持PDF/OFD格式电子文件的查验，请让对方提供PDF/OFD格式的已完成签章的电子文件后，再次上传进行电子文件有效性验证。</span
                        >
                    </li>
                    <li>
                        <span class="tit">2，电子文件验真有哪些查询结果？</span>
                        <span class="cont"
                            >答：①、签名是否有效 ②、文件是否被修改 ③、签名时间
                            ④、时间戳 ⑤、印章类型 ⑥、印章有效期 ⑦、公司名称
                            ⑧、组织机构代码；</span
                        >
                    </li>
                </ul>
            </div>
        </div>
        <el-dialog
            title="电子文件验真结果"
            :visible.sync="dialogVisible"
            :before-close="handleClose"
        >
            <div class="result-box">
                <div class="result-cont">
                    <h1>文件查验结果</h1>
                    <p class="txt" v-text="sealInfo"></p>
                    <div class="result-cont-box">
                        <ul :class="{ onlyLi: isonlyLi }">
                            <li v-for="(item, index) in sealData" :key="index">
                                <table>
                                    <tbody>
                                        <tr>
                                            <td>
                                                <span
                                                    >签名认证：<em
                                                        v-text="
                                                            item.signInfoRespDTO
                                                                .effectiveDes
                                                        "
                                                    ></em
                                                ></span>
                                            </td>
                                            <td>
                                                <span
                                                    >时间戳认证：
                                                    <em
                                                        v-if="
                                                            item.signInfoRespDTO
                                                                .timesVerify ===
                                                                '通过'
                                                        "
                                                        >通过</em
                                                    >
                                                    <em
                                                        v-if="
                                                            item.signInfoRespDTO
                                                                .timesVerify ===
                                                                '不通过'
                                                        "
                                                        class="red"
                                                        >不通过</em
                                                    >
                                                </span>
                                            </td>
                                        </tr>
                                        <tr>
                                            <th>签约人：</th>
                                            <td
                                                v-text="
                                                    item.cerInfoRespDTO.ownwer
                                                "
                                            ></td>
                                        </tr>
                                        <tr>
                                            <th>签约时间：</th>
                                            <td
                                                v-text="
                                                    item.signInfoRespDTO
                                                        .signTime
                                                "
                                            ></td>
                                        </tr>
                                        <tr>
                                            <th>颁发机构：</th>
                                            <td
                                                v-text="
                                                    item.cerInfoRespDTO
                                                        .certificateAuthority
                                                "
                                            ></td>
                                        </tr>
                                        <tr>
                                            <th>时间戳：</th>
                                            <td
                                                v-text="
                                                    item.signInfoRespDTO
                                                        .timestamp
                                                "
                                            ></td>
                                        </tr>
                                    </tbody>
                                </table>
                            </li>
                        </ul>
                    </div>

                    <div class="slogan">
                        <span class="slogan-pic"></span>
                    </div>
                </div>
            </div>
        </el-dialog>
    </div>
</template>
<script>
import { sessionStore } from '@/utils';

export default {
    name: 'elecVertify',
    data() {
        return {
            dialogVisible: false,
            isonlyLi: false,
            sealInfo: '',
            contractName: '',
            sealData: [],
            fileList: [],
            formdata: '',
            fileSize: '',
            fileType: ''
        };
    },
    computed: {},
    filters: {},
    created() {},
    methods: {
        uploadSuccess(res, file, fileList) {
            console.log(1);
        },
        uploadFaild(err) {
            this.$message.error({
                message: err.msg,
                customClass: 'zZindex'
            });
        },
        // 请求后的回调
        resetFile(options) {
            let file = options.file;
            let formdata = new FormData();
            formdata.append('file', file);
            this.contractName = file.name;
            this.formdata = formdata;
            this.fileSize = (file.size / 1024 / 1024).toFixed(2);
            this.fileType = file.name.split('.').pop();
            this.uploadFile();
        },
        // 上传文件
        uploadFile() {
            if (this.fileSize >= 20) {
                this.fileList = [];
                this.$message.warning('文件不能超过20MB');
                return false;
            }
            if (this.fileType.toLowerCase() !== 'pdf' && this.fileType.toLowerCase() !== 'ofd') {
                this.fileList = [];
                this.$message.warning('请上传PDF/OFD格式的文件');
                return false;
            }
            this.$api('fileVality')
                .post('postFormData', this.formdata)
                .then((res) => {
                    if (!res) return this.fileList = [];
                    let data = res.data.data;
                    let code = res.data.code;
                    let seal = data.signFileSignatureList;
                    if (code === 0) {
                        this.dialogVisible = true;
                        this.isonlyLi = seal.length === 1;
                        if (seal.length === 0) {
                            this.sealInfo = `系统检测到文件 《${this.contractName}》 没有印章信息`;
                        } else {
                            this.sealData = seal;
                            this.sealInfo = `系统检测到文件 《${this.contractName}》 共有${seal.length}个印章信息，其中详细信息如下：`;
                        }
                    }
                });
        },
        handleClose() {
            this.dialogVisible = false;
            this.sealData = [];
            this.fileList = [];
        }
    }
};
</script>
<style lang="scss" scoped>
.elec-vertify {
    margin: 0 0 0 22px;
    .title {
        height: 54px;
        line-height: 54px;
        color: #333;
        font-size: 16px;
        border-bottom: 1px solid #e9e9e9;
    }
    .container {
        text-align: center;
        .el-upload-list {
            border: 1px solid red;
        }
        h1 {
            margin: 60px 0 40px;
            color: #333;
            font-size: 36px;
        }
        .el-upload__tip {
            margin-top: 20px;
            color: #999;
            font-size: 16px;
        }
        .upload-demo {
            .el-button {
                width: 780px;
                height: 50px;
                line-height: 50px;
                font-size: 18px;
                color: #333;
                border: 1px solid #4a90e2;
                &:hover,
                &:focus,
                &:active {
                    background-color: transparent;
                }
            }
        }
        .container-guide {
            margin: 60px 0 0 13.88%;
            .guide-title {
                padding-top: 20px;
                color: #333;
                font-size: 18px;
                text-align: left;
                border-top: 1px solid #eaeaea;
                span {
                    padding-left: 6px;
                    border-left: 3px solid #4a90e2;
                }
            }
            ul {
                li {
                    height: 90px;
                    padding-top: 20px;
                    text-align: left;
                    color: #333;
                    border-bottom: 1px solid #eaeaea;
                    .tit {
                        display: block;
                        margin-bottom: 14px;
                        font-size: 16px;
                    }
                    .cont {
                        display: block;
                        font-size: 14px;
                    }
                }
            }
        }
    }
    .result-box {
        border: 6px solid #0e4a97;
        border-radius: 6px;
        .result-cont {
            margin: 20px 10px;
            border: 1px solid #0e4a97;
            padding: 20px 30px;
            .result-cont-box {
                width: 800px;
                overflow: hidden;
                margin-bottom: 15px;
                ul {
                    width: 812px;
                    margin-top: -17px;
                    margin-bottom: -17px;
                    padding-top: 17px;
                    padding-bottom: 8px;
                }
                .onlyLi {
                    width: 800px;
                }
            }
            h1 {
                color: transparent;
                width: 256px;
                height: 64px;
                background: url(../../assets/image/signVertify/flag.png)
                    no-repeat;
                margin: 0 auto;
            }
            ul {
                max-height: 360px;
                overflow-y: auto;
                li {
                    margin-bottom: 10px;
                    border: 1px solid #c0ccda;
                    table {
                        margin: 15px 20px;
                        tr {
                            display: block;
                            th,
                            td {
                                height: 30px;
                                line-height: 30px;
                                font-size: 14px;
                                font-weight: normal;
                            }
                            th {
                                text-align: right;
                                width: 100px;
                                color: #626262;
                            }
                            td {
                                padding-left: 5px;
                                color: #000;
                            }
                        }
                        tr:nth-child(1) {
                            margin-bottom: 10px;
                            td {
                                padding-left: 22px;
                                font-size: 16px;
                                em {
                                    color: #25b44e;
                                }
                                .red {
                                    color: red;
                                }
                            }
                            td:nth-child(2) {
                                padding-left: 60px;
                            }
                        }
                    }
                }
            }
            .txt {
                margin: 36px 0 40px;
                color: #0e4a97;
                font-size: 16px;
            }
            .slogan {
                display: flex;
                justify-content: flex-end;
                .slogan-pic {
                    width: 182px;
                    height: 80px;
                    background: url(../../assets/image/signVertify/slogan.png)
                        no-repeat;
                }
            }
        }
    }
}
</style>
<style lang="scss">
.elec-vertify {
    .el-dialog__title {
        font-family: cursive;
    }
    .el-dialog {
        width: 1000px;
    }
    .container {
        .el-upload-list {
            width: 800px;
            margin: 0 auto;
        }
    }
}
</style>
