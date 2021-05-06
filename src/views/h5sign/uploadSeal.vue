<template>
    <div class="upload-seal">
        <header class="header">
            <div class="left" @click="$router.go(-1)">
                <i class="el-icon-arrow-left"></i>
                <span>返回</span>
            </div>创建云印章
        </header>
        <div class="main">
            <div class="seal-name">
                <div class="left">印章名称：</div>
                <div class="right">
                    <input type="text" v-model="sealInfo.pictureName" placeholder="请输入印章名称">
                </div>
            </div>
            <div class="seal-name">
                <div class="left">印章类型：</div>
                <div class="right seal-type">
                    <el-select v-model="uploadData.pictureBusinessType" placeholder="请选择印章类型" @change="sealInfo.picturePath=''">
                        <el-option v-for="(item, index) in businessTypeOptions" :key="index" :value="item.value" :label="item.label"></el-option>
                    </el-select>
                </div>
            </div>
            <div class="file-upload">
                <input type="file" style="display:none" ref="sealUpload" accept="image/*" @change="upload">
                <div class="upload-box" @click="openUpload">
                    <img :src="sealInfo.picturePath" alt="" v-if="sealInfo.picturePath">
                    <p v-else>点击上传章模</p>
                </div>
            </div>
            <div class="size">
                <div class="right">
                    <span class="view" @click="preview">章模预览</span>
                </div>
            </div>
        </div>
        <div class="footer">
            <div class="btn" @click="$router.go(-1)">取消</div>
            <div class="btn confirm" @click="submitSeal">提交</div>
        </div>
        <transition name="view-seal">
            <div class="view-seal" v-if="viewSeal">
                <div class="view-seal-inner">
                    <div class="close" @click="viewSeal=false">关闭</div>
                    <img src="@/assets/image/合同签署页.png" class="file" alt="">
                    <img v-if="sealInfo.picturePath" :src="sealInfo.picturePath" class="seal-img" alt="">
                </div>
            </div>
        </transition>
    </div>
</template>

<script>
import { checkIntegral, sessionStore } from '@/utils'

export default {
    data() {
        return {
            uploadData: {
                pictureType: '01',
                pictureBusinessType: ''
            },
            sealInfo: {
                pictureName: '',
                picturePath: ''
            },
            viewSeal: false,
            businessTypeOptions: [
                {
                    label: '行政章',
                    value: '01'
                },
                {
                    label: '财务专用章',
                    value: '02'
                },
                {
                    label: '业务专用章',
                    value: '03'
                },
                {
                    label: '法定代表人名章',
                    value: '04'
                },
                {
                    label: '报关专用章',
                    value: '05'
                },
                {
                    label: '合同专用章',
                    value: '06'
                },
                {
                    label: '其他公章',
                    value: '07'
                },
                {
                    label: '电子杂章',
                    value: '08'
                },
                {
                    label: '电子私章',
                    value: '09'
                }
            ]
        }
    },
    methods: {
        openUpload() {
            if (!this.uploadData.pictureBusinessType) return this.$message.error({
                message: '请先选择印章类型',
                customClass: 'h5-z-index'
            })
            this.$refs.sealUpload.click()
        },
        async upload(e) {
            if(!e.target.files.length) return
            let formData = new FormData()
            formData.append('file', e.target.files[0])
            e.target.value = ''
            let res = await this.$api('uploadSeal').post('postFormDataQuery', formData,  this.uploadData)
            console.log(res);
            if(!res) return
            Object.assign(this.sealInfo, res.data.data)
        },
        submitSeal() {
            if (!this.sealInfo.pictureName) return this.$message.error({
                message: '请输入印章名称',
                customClass: 'h5-z-index'
            })
            if (!this.sealInfo.picturePath) return this.$message.error({
                message: '请上传印章',
                customClass: 'h5-z-index'
            })
            let sealList = sessionStore.get('h5SealList') || []
            this.sealInfo.id = this.sealInfo.pictureDataTmpId
            this.sealInfo.pictureId = this.sealInfo.pictureDataTmpId
            this.sealInfo.pictureType = '01'
            this.sealInfo.pictureBusinessType = this.uploadData.pictureBusinessType
            sealList.push(this.sealInfo)
            sessionStore.set('h5SealList', sealList)
            this.$router.push({
                path: 'h5SignContract',
                query: this.$route.query
            })
        },
        preview() {
            if (!this.sealInfo.picturePath) return this.$message.error({
                message: '请先上传章模',
                customClass: 'h5-z-index'
            })
            this.viewSeal = true
        }
    },
}
</script>

<style lang="scss" scoped>
.upload-seal {
    font-size: 0.24rem;
    position: absolute;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    background-color: #f1f2f6;
    display: flex;
    flex-direction: column;
    .header {
        height: 0.88rem;
        line-height: 0.88rem;
        font-size: 0.3rem;
        color: #fff;
        background-image: radial-gradient(100% 100%, #006efe 0%, #494aff 100%);
        position: relative;
        text-align: center;
        .left {
            position: absolute;
            left: 0;
        }
    }
    .main {
        flex: 1;
        overflow: auto;
        .seal-name {
            background-color: #fff;
            padding: .3rem .32rem .1rem;
            height: 1.08rem;
            font-size: .28rem;
            display: flex;
            align-items: center;
            .left {
                width: 2rem;
            }
            .right {
                flex: 1;
                height: 100%;
                border: 1px solid #ccc;
                border-radius: .1rem;
                overflow: hidden;
                padding: 0 .2rem;
                .el-input__inner {
                    border: 0;
                }
            }
            input {
                width: 100%;
                height: 100%;
                border: none;
                outline: none;
                &::placeholder {
                    color: #c0c4cc;
                }
            }
        }
        .size {
            background-color: #fff;
            padding: .1rem .32rem;
            height: .88rem;
            font-size: .28rem;
            display: flex;
            justify-content: flex-end;
            .right {
                height: 100%;
                border-radius: .1rem;
                overflow: hidden;
                padding: 0 .2rem;
                display: flex;
                align-items: center;
                span {
                    margin: 0 .2rem;
                }
                input {
                    width: 1rem;
                    height: .6rem;
                    padding: 0 .1rem;
                    outline: none;
                }
                .view {
                    font-size: .3rem;
                    color: #006efe;
                    margin-left: .4rem;
                }
            }
        }
        .file-upload {
            padding: .32rem;
            background-color: #fff;
            .upload-box {
                width: 100%;
                height: 3.6rem;
                border: 1px dashed #ccc;
                background-color: #f7f7f7;
                border-radius: .1rem;
                overflow: hidden;
                display: flex;
                justify-content: center;
                align-items: center;
                position: relative;
                p {
                    font-size: .4rem;
                    color: #666;
                }
                img {
                    max-width: 100%;
                    max-height: 100%;
                }
            }
        }
    }
    .footer {
        height: 0.98rem;
        line-height: 0.98rem;
        font-size: 0.32rem;
        background-color: #fff;
        display: flex;
        .btn {
            flex: 1;
            text-align: center;
            &.confirm {
                color: #fff;
                background-color: #006efe;
            }
        }
    }
    .view-seal {
        position: fixed;
        left: 0;
        top: 0;
        right: 0;
        bottom: 0;
        background-color: rgb(0, 0, 0);
        &-inner {
            position: absolute;
            left: 0;
            top: 1rem;
            right: 0;
            bottom: .32rem;
            .file {
                max-width: 100%;
                max-height: 100%;
            }
            .close {
                position: absolute;
                right: .32rem;
                top: -.5rem;
                font-size: .3rem;
                color: #fff;
            }
            .seal-img {
                width: 1.2rem;
                height: 1.2rem;
                position: absolute;
                left: 1.8rem;
                top: 5.2rem;
            }
        }
    }
}
</style>

<style lang="scss">
    .upload-seal {
        .main {
            .seal-name {
                .seal-type.right {
                    padding: 0;
                    .el-select {
                        width: 100%;
                    }
                    .el-input__inner {
                        border: 0;
                    }
                }
            }
        }
    }
</style>