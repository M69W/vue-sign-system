<template>
    <div class="enterprise-step1">
        <header class="header">企业实名认证</header>
        <div class="main">
            <step-list size="4" index="0"></step-list>
            <div class="upload-container">
                <p class="upload-desc">请上传下图所示营业执照</p>
                <div class="upload">
                    <upload class="upload" @uploaded="uploadLicense">
                        <template slot="title">点击上传</template>
                        <template slot="desc">营业执照</template>
                    </upload>
                </div>
            </div>
        </div>
        <div class="btn-wrap" :class="{disabled: disabled || !isSigner}">
            <!-- <div class="login" @click="toLogin">账号登录</div> -->
            <div class="next" @click="next">下一步</div>
        </div>
    </div>
</template>

<script>
import stepList from './stepList';
import {isCard} from '@/utils'
import {sessionStore} from '@/utils'
import upload from './upload'

export default {
    components: { stepList, upload },
    data() {
        return {
            disabled: true,
            personId: '',
            legalPerson: '',
            isSigner: false, // 是否是签署方
            enterpriseName: ''
        };
    },
    created () {
        this.getSignerInfo()
    },
    methods: {
        async getSignerInfo() {
            let res = await this.$api('noTokenViewContract').post('postQuery', '', {
                contractId: this.$route.query.contractId
            })
            if(!res) return
            const signer = res.data.data.signStatusInfo.find(v=>v.signContact===this.$route.query.phone)
            if(!signer) {
                this.isSigner = false
                this.$message.error({
                    customClass: 'h5-z-index',
                    message: '暂无签署信息'
                })
            }else {
                this.isSigner = true
                this.enterpriseName = signer.enterpriseName
            }
        },
        async uploadLicense(file) {
            let formData = new FormData()
            formData.append('image', file)
            formData.append('phoneNumber', this.$route.query.phone)
            let res = await this.$api('businessLicenseInfo').post('postFormData', formData)
            console.log(res);
            if (!res) return
            const data = res.data.data
            if (data.enterpriseName !== this.enterpriseName) return this.$message.error({
                message: '企业信息和签署方不一致，请重新上传',
                customClass: 'h5-z-index'
            })
            this.validateLicense(data)
        },
        async validateLicense(enterpriseInfo) {
            let res = await this.$api('businessLicense').post('', {
                enterpriseCode: enterpriseInfo.enterpriseCode,
                legalPersonName: enterpriseInfo.legalPerson,
                phoneNumber: this.$route.query.phone
            })
            if(res && res.data.data) {
                this.disabled = false
                this.personId = enterpriseInfo.enterpriseCode
                this.legalPerson = enterpriseInfo.legalPerson
            }
        },
        next() {
            sessionStore.set('contractInfo', {
                personId: this.personId,
                legalPerson: this.legalPerson,
                enterpriseName: this.enterpriseName
            })
            this.$router.push({
                path: 'h5Certification1',
                query: this.$route.query
            })
        }
    }
};
</script>

<style lang="scss" scoped>
.enterprise-step1 {
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
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
        flex: 1;
        overflow-y: auto;
        .upload-container {
            padding: .32rem .64rem;
            .upload-desc {
                text-align: center;
                margin-bottom: .4rem;
            }
            .upload {
                margin-bottom: .32rem;
                height: 7rem;
            }
        }
    }
    .btn-wrap {
        width: 100%;
        height: 0.98rem;
        line-height: 0.98rem;
        text-align: center;
        font-size: 0.34rem;
        display: flex;
        &.disabled {
            opacity: 0.4;
            pointer-events: none;
        }
        .login {
            flex: 1;
            color: #666;
            border-top: 1px solid #ccc;
        }
        .next {
            flex: 1;
            background-color: #006efe;
            color: #fff;
        }
    }
}
</style>