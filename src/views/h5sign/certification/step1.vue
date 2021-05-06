<template>
    <div class="living-step1">
        <header class="header" @click="$router.go(-1)">
            <div class="left">
                <i class="el-icon-arrow-left"></i>
                <span>返回</span>
            </div>
            {{isEnterprise?'法人认证':'身份认证'}}
        </header>
        <div class="main">
            <step-list :size="size"></step-list>
            <div class="upload-container">
                <p class="upload-desc">请确保您的第二代身份证处于有效期内</p>
                <upload class="upload" @uploaded="uploadIdCard($event, 0)"></upload>
                <upload class="upload" @uploaded="uploadIdCard($event, 1)">
                    <template slot="desc">国徽面</template>
                </upload>
            </div>
        </div>
        <div class="btn" :class="{disabled}" @click="next">下一步</div>
    </div>
</template>

<script>
import stepList from './stepList';
import {isCard} from '@/utils'
import {sessionStore} from '@/utils'
import upload from './upload'
import qs from 'qs'

export default {
    components: { stepList, upload },
    data() {
        return {
            isEnterprise: this.$route.query.isEnterprise === '1',
            legalPerson: sessionStore.get('contractInfo') && sessionStore.get('contractInfo').legalPerson,
            orderNo: String(+new Date()),
            name: '',
            idCard: '',
            unexpired: false
        };
    },
    computed: {
        size() {
            return this.isEnterprise ? '4' : '3'
        },
        disabled() {
            return !this.name || !this.idCard || !this.unexpired
        }
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
                this.$message.error({
                    customClass: 'h5-z-index',
                    message: '暂无签署信息'
                })
            }else {
                if (!this.isEnterprise) {
                    this.legalPerson = signer.signName
                }
            }
        },
        async uploadIdCard(file, cardType) {
            console.log(file);
            let formData = new FormData()
            formData.append('image', file)
            formData.append('orderNo', this.orderNo)
            formData.append('cardType', cardType)
            formData.append('phoneNumber', this.$route.query.phone)
            let res = await this.$api('ocrIdCard').post('postFormData', formData)
            console.log(res);
            if(!res) return
            const data = res.data.data.result
            if (cardType === 0) {
                if (data.name === this.legalPerson) {
                    this.name = data.name
                    this.idCard = data.idcard
                }else {
                    this.name = ''
                    this.idCard = ''
                    let message = this.isEnterprise ? '验证失败，法人与企业不匹配' : '验证失败，身份证与签署人不匹配'
                    this.$message.error({
                        message,
                        customClass: 'h5-z-index'
                    })
                }
            }else {
                // validDate: "20190211-20390211"
                let str = data.validDate.split('-')[1]
                console.log(str);
                let dateStr = str.substr(0,4) + '/' + str.substr(4,2) + '/' + str.substr(6)
                console.log(dateStr);
                this.unexpired = +new Date(dateStr) > +new Date()
                if (!this.unexpired) this.$message.error({
                    message: '身份证不在有效期内',
                    customClass: 'h5-z-index'
                })
            }
        },
        async next() {
            if (this.disabled) return
            const { idCard , name } = this
            let res = await this.$api('validateID').post('', {
                idCard,
                realName: name,
                phoneNumber: this.$route.query.phone
            })
            if(!res) return
            if (!res.data.data) return this.$message.error({
                message: '姓名和身份证号不一致',
                customClass: 'h5-z-index'
            })
            // const query = this.$route.query
            let contractInfo = sessionStore.get('contractInfo') || {}
            contractInfo.name = this.isEnterprise ? contractInfo.enterpriseName : name
            if(!this.isEnterprise) {
                contractInfo.personId = idCard
            }
            sessionStore.set('contractInfo',contractInfo)
            // this.$router.push({
            //     path: 'h5Certification2',
            //     query
            // })
            let res1 = await this.$api('faceRecognition').post('', {
                idNo: idCard,
                name,
                orderNo: this.$route.query.contractId,
                userId: this.$route.query.contractId,
                businessType: this.isEnterprise ? '02' : '01',
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
                url: location.href.replace('h5Certification1', 'h5Certification3'),
                userId: data.userId,
                sign: data.sign,
                from: 'browser'
            })
            url += query
            location.href = url
        }
    }
};
</script>

<style lang="scss" scoped>
.living-step1 {
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
            padding: .32rem;
            .upload-desc {
                text-align: center;
                margin-bottom: .4rem;
            }
            .upload {
                margin-bottom: .32rem;
                height: 3.6rem;
            }
        }
    }
    .btn {
        /*position: absolute;*/
        bottom: 0;
        left: 0;
        width: 100%;
        height: 0.98rem;
        line-height: 0.98rem;
        text-align: center;
        background-color: #006efe;
        color: #fff;
        font-size: 0.34rem;

        &.disabled {
            opacity: 0.4;
            pointer-events: none;
        }
    }
}
</style>