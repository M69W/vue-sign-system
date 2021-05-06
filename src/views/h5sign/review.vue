<template>
    <!-- 签署方式选择 -->
    <div class="sign-choose">
        <div class="content">
            <div class="file-wrap">
                <div class="page">
                    <span class="now-page">{{ nowPage }}</span
                    >/<span class="all-page">{{ totalPage }}</span>
                </div>
                <div
                    class="file"
                    @touchstart="fileTouchstart"
                    @touchend="fileTouchend"
                >
                    <img :src="fileUrl" class="fileReal" alt="" />
                </div>
            </div>
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
            fileCode: '',
            totalPage: 0,
            nowPage: 1,
            fileTouchStartY: 0, // 滑动文件起始位置
            fileUrl: '',
            fileUrlObj: {} // 缓存已经加载过的文件图片
        };
    },
    mounted() {
        this.fileCode = this.$route.query.fileCode;
        this.fileName = this.$route.query.fileName;
        this.getFileTotalPage();
    },
    methods: {
        goBack() {
            this.$router.go(-1);
        },
        /**获取文件总页数*/
        getFileTotalPage() {
            this.$api('getPicSize')
                .get('getPath', {
                    fileCode: this.fileCode
                })
                .then((res) => {
                    if (!res) return;
                    // console.log(res);
                    let data = res.data.data;
                    this.totalPage = data.totalPageNo;
                    this.getPageSingle();
                });
        },
        // 获取文件单页数
        getPageSingle() {
            this.$api('fetch')
                .get('getBlob', {
                    fileCode: this.fileCode,
                    nowPage: this.nowPage
                })
                .then((res) => {
                    if (!res) return;
                    let blob = res.data;
                    let url = window.URL.createObjectURL(res.data);
                    console.log(url);
                    this.fileUrl = url;
                    this.fileUrlObj[this.nowPage] = url;
                });
        },
        /**文件滑动 */
        fileTouchstart(e) {
            this.fileTouchStartY = e.changedTouches[0].clientY;
            console.log(this.fileTouchStartY);
        },
        /**文件滑动结束 */
        fileTouchend(e) {
            let endY = e.changedTouches[0].clientY;
            // 向上翻页
            if (this.fileTouchStartY - endY > 20) {
                if (this.nowPage < this.totalPage) {
                    this.nowPage++;
                    if (!this.fileUrlObj[this.nowPage]) {
                        this.getPageSingle();
                    } else {
                        this.fileUrl = this.fileUrlObj[this.nowPage];
                    }
                }
            }
            // 向下翻页
            if (endY - this.fileTouchStartY > 20) {
                if (this.nowPage > 1) {
                    this.nowPage--;
                    if (!this.fileUrlObj[this.nowPage]) {
                        this.getPageSingle();
                    } else {
                        this.fileUrl = this.fileUrlObj[this.nowPage];
                    }
                }
            }
        }
    }
};
</script>
<style lang="scss" scoped>
.sign-choose {
    background: #f1f2f6;
    height: 100%;
    position: relative;
    overflow: hidden;
    .content {
        width: 6.86rem;
        position: absolute;
        left: 0.32rem;
        top: 0.24rem;
        bottom: 0.24rem;
        background: #f1f2f6;
        .file-wrap {
            width: 100%;
            height: 100%;
            position: relative;
            .fix-wrap {
                width: 100%;
                position: absolute;
                left: 0;
                top: 0;
                bottom: 0;
            }
            .page {
                width: 1.12rem;
                height: 0.4rem;
                display: flex;
                font-size: 0.24rem;
                align-items: center;
                justify-content: space-between;
                padding: 0 0.2rem;
                background: rgba(204, 204, 204, 0.5);
                border-radius: 0.2rem;
                position: absolute;
                top: 1.04rem;
                right: 0.16rem;
                z-index: 100;
                .now-page {
                    color: #282828;
                }
                .all-page {
                    color: #3f3f3f;
                }
            }
            .file {
                width: 100%;
                position: relative;
                .fileReal {
                    width: 100%;
                }
                .seal-wrap {
                    padding: 3px;
                    border-radius: 8px;
                    border: 1px dashed #006efe;
                    position: absolute;
                    left: 0;
                    top: 0;
                    background: rgba(0, 110, 254, 0.1);
                    .close {
                        font-size: 0.42rem;
                        color: #006efe;
                        position: absolute;
                        right: -0.16rem;
                        top: -0.16rem;
                    }
                    .remove {
                        font-size: 0.42rem;
                        color: rgb(245, 83, 83);
                        position: absolute;
                        right: -0.16rem;
                        top: -0.16rem;
                    }
                }
            }
        }
    }
}
</style>
