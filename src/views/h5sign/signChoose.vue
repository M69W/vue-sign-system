<template>
    <!-- 签署方式选择 -->
    <div class="sign-choose">
        <header class="header" @click="goBack">
            <i class="el-icon-arrow-left"></i>
            <span>返回</span>
        </header>
        <div class="content">
            <ul class="seal-list">
                <li
                    v-for="(item, index) in sealList"
                    :key="index"
                    @click="chooseSign(item)"
                >
                    <div class="img">
                        <img :src="item.picturePath" alt="印章图片" />
                    </div>
                    <p>{{ item.pictureName }}</p>
                </li>
            </ul>
        </div>
    </div>
</template>

<script>
import { sessionStore } from '@/utils';
export default {
    components: {},
    props: {},
    data() {
        return {
            enterpriseOrPersonalId: '', // 企业或个人id
            sealList: [],
            query: null
        };
    },
    created() {},
    mounted() {
        this.enterpriseOrPersonalId = sessionStore.get('userInfo').enterpriseId;
        this.query = this.$route.query;
        this.getPageListSealInfo();
    },
    methods: {
        goBack() {
            this.$router.go(-1);
        },
        // 获取印章列表
        getPageListSealInfo(pageSeal) {
            this.$api('pageUserListSealInfo')
                .post({
                    currentPage: 1,
                    pageSize: 100,
                    enterpriseOrPersonalId: this.enterpriseOrPersonalId,
                    mediumType: '01',
                    userId: sessionStore.get('userInfo').id,
                    contentType: 'json'
                })
                .then((res) => {
                    if (!res) return;
                    let data = res.data.data;
                    let seals = data.records;
                    this.sealList.push(...seals);
                });
        },
        chooseSign({ pictureCode, picturePath }) {
            let h5SignItem = {
                devId: Date.now(),
                pictureCode: pictureCode,
                picturePath: picturePath
            };
            sessionStore.set('h5SignItem', h5SignItem);
            this.$router.push({
                path: '/h5sign/h5SignIndex',
                query: {
                    fileCode: this.query.fileCode,
                    fileName: this.query.fileName
                }
            });
        }
    }
};
</script>
<style lang="scss" scoped>
.sign-choose {
    background: #f1f2f6;
    height: 100%;
    .header {
        height: 0.8rem;
        display: flex;
        align-items: center;
        font-size: 0.3rem;
        padding-left: 0.3rem;
        color: #333;
    }
    .content {
        position: absolute;
        left: 0;
        top: 0.8rem;
        bottom: 0;
        right: 0;
        background: #fff;
        overflow-y: auto;
        .seal-list {
            width: 100%;
            padding-left: 0.32rem;
            li {
                display: flex;
                border-bottom: solid 1px #eee;
                height: 1.68rem;
                align-items: center;
                .img {
                    width: 1.1rem;
                    img {
                        width: 100%;
                    }
                }
                p {
                    flex: 1;
                    font-size: 0.32rem;
                    color: #282828;
                    text-overflow: ellipsis;
                    margin-left: 0.24rem;
                    overflow: hidden;
                    white-space: nowrap;
                }
            }
        }
    }
}
</style>