<template>
    <div class="living-step2">
        <header class="header" @click="$router.go(-1)">
            <div class="left">
                <i class="el-icon-arrow-left"></i>
                <span>返回</span>
            </div>
            活体检测
        </header>
        <div class="main">
            <step-list :size="size" index="2"></step-list>
            <div class="main-container">
                <!-- <p class="pos-desc">请牢记以下动作</p>
                <p class="poses">抬头，低头，左右摇头</p> -->
                <div class="living-img">
                    <div class="img-box">
                        <img src="../../../assets/image/living.png" alt="">
                    </div>
                    <p>正面平视手机、保持光线充足、请勿遮挡面部</p>
                </div>
                <div class="step-container">
                    <div class="step-item">
                        <div class="step-num line">1</div>
                        <div class="step-desc">点击录制，开启前置摄像头</div>
                    </div>
                    <div class="step-item">
                        <div class="step-num line">2</div>
                        <div class="step-desc">
                            执行
                            <span class="pos">{{poses[0].value}}</span>
                            和
                            <span class="pos">{{poses[1].value}}</span>
                            动作
                        </div>
                    </div>
                    <div class="step-item">
                        <div class="step-num">3</div>
                        <div class="step-desc">完成录制，等待验证结果</div>
                    </div>
                </div>
            </div>
        </div>
        <div class="btn" @click="start">准备好了，开始录制</div>
        <input type="file" ref="videoUpload" @change="videoUpload" accept="video/*" capture="user"  style="display:none">
        <div class="living-mask" v-if="starting">
            <video></video>
            <div class="head-mask"></div>
            <div class="close" @click="cancelRecord">取消</div>
        </div>
    </div>
</template>

<script>
import stepList from './stepList';
import {isCard} from '@/utils'
import {sessionStore} from '@/utils'
import upload from './upload'
import RecordRTC from 'recordrtc';

export default {
    components: { stepList, upload },
    data() {
        return {
            isEnterprise: this.$route.query.isEnterprise === '1',
            posArr: [
                {
                    key: 'eyeBlink',
                    value: '眨眼'
                },
                {
                    key: 'nod',
                    value: '点头'
                },
                {
                    key: 'openMouth',
                    value: '张嘴'
                },
                {
                    key: 'shake',
                    value: '摇头'
                }
            ],
            starting: false,
            timer: null
        };
    },
    computed: {
        size() {
            return this.isEnterprise ? '4' : '3'
        },
        poses() {
            let index = parseInt(Math.random() * 4)
            index === 4 && (index = 3)
            let index2 = index === 3 ? 1 : index + 1
            return [this.posArr[index], this.posArr[index2]]
        }
    },
    created () {
    },
    methods: {
        start() {
            // if (navigator.getUserMedia) {
            //     this.starting = true
            //     navigator.getUserMedia({video: { width: 720,height: 1440}}, this.success, this.fail)
            // }else if (navigator.mediaDevices.getUserMedia) {
            //     this.starting = true
            //     navigator.mediaDevices.getUserMedia({video: { width: 720,height: 1440}}).then(this.success).catch(this.fail)
            // }else {
            //     this.$refs.videoUpload.click()
            // }
            this.$refs.videoUpload.click()
        },
        success(stream) {
            let _this = this
            var video = document.querySelector('video');
            video.src = window.URL.createObjectURL(stream);
            video.onloadedmetadata = function(e) {
                // Do something with the video here.
                video.play()
                _this.$nextTick(()=>{
                    const recordRTC = RecordRTC(stream, {
                        type: 'video'
                    });
                    recordRTC.startRecording();
                    _this.timer = setTimeout(() => {
                        recordRTC.stopRecording(function(videoURL) {
                            // video.src = videoURL;
                            console.log(videoURL);
                            var recordedBlob = recordRTC.getBlob();
                            console.log(recordedBlob);
                            recordRTC.getDataURL(function(dataURL) {
                                console.log(dataURL);
                            });
                        });
                    }, 4000);
                })
                
            };
        },
        fail() {
            console.log('失败了');
            this.$message.error({
                message:'录制失败',
                customClass: 'h5-z-index'
            })
        },
        async videoUpload(e) {
            console.log(e);
            const files = e.target.files
            if(!files.length) return
            let formData = new FormData()
            formData.append('faceFile', files[0])
            formData.append('poses', JSON.stringify(this.poses.map(v=>v.key)))
            let res = await this.$api('liveDetective').post('postFormData', formData)
            console.log(res);
            if(!res) return
            const query = this.$route.query
            const livingSuccess = res.data.data.posesResult ? '1' : '0'
            sessionStore.set('livingSuccess', livingSuccess)
            this.$router.push({
                path: 'h5Certification3',
                query
            })
        },
        cancelRecord() {
            this.starting = false
            this.timer && clearTimeout(this.timer)
        }
    }
};
</script>

<style lang="scss" scoped>
.living-step2 {
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
        display: flex;
        flex-direction: column;
        .main-container {
            flex: 1;
            background-color: #efebef;
            .pos-desc {
                text-align: center;
                font-size: .32rem;
                line-height: .4rem;
                padding-top: .32rem;
            }
            .poses {
                text-align: center;
                padding: .4rem 0;
                font-size: .4rem;
            }
            .living-img {
                width: 100%;
                padding-bottom: .2rem;
                .img-box {
                    padding: .2rem 2rem;
                    img {
                        width: 100%;
                    }
                }
                p {
                    text-align: center;
                    color: #999;
                }
            }
            .step-container {
                padding: .32rem 0 .32rem .96rem;
                .step-item {
                    display: flex;
                    margin-bottom: .7rem;
                    &:nth-last-of-type(1) {
                        margin-bottom: 0;
                    }
                    .step-num {
                        width: .4rem;
                        height: .4rem;
                        color: #006efe;
                        border: 1px solid #006efe;
                        border-radius: 50%;
                        text-align: center;
                        line-height: .36rem;
                        margin-right: .2rem;
                        position: relative;
                        &.line:after {
                            content: '';
                            width: 0;
                            height: .6rem;
                            border-left: 1px dashed #006efe;
                            position: absolute;
                            left: .18rem;
                            top: .45rem;
                        }
                    }
                    .step-desc {
                        line-height: .4rem;
                        font-size: .32rem;
                        .pos {
                            // color: #006efe;
                            font-weight: bold;
                        }
                    }
                }
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
            // pointer-events: none;
        }
    }
    .living-mask {
        position: fixed;
        top: 0;
        right: 0;
        bottom: 0;
        left: 0;
        background-color: #000;
        video {
            width: 100%;
        }
        .head-mask {
            position: absolute;
            top: 0;
            right: 0;
            bottom: 0;
            left: 0;
            // background-color: #000;
            background: url('../../../assets/image/头.svg');
            background-size: 100%;
        }
        .close {
            position: absolute;
            right: .32rem;
            top: .32rem;
            color: #fff;
        }
    }
}
</style>