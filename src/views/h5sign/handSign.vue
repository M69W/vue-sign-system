<template>
    <div class="handSign">
        <div class="top">
            <span class="sign_close" @click="$router.go(-1)"></span>
            <h5>{{ !isPostil ? "手写签名" : "手写批注" }}</h5>
            <span class="turndown"></span>
        </div>
        <div class="sign_box">
            <div class="signature">
                <div class="bg_box" v-if="!start">
                    <span class="sign_bg"></span>
                    <p>{{ !isPostil ? "请在签署区域内签名" : "请在签署区域内手写批注" }}</p>
                </div>
                <div id="canvas"></div>
            </div>
        </div>
        <div class="sub_foot">
            <div class="tabcolor">
                <span class="red" :class="{ active: type === 0 }" @click="tabColor(0)"></span>
                <span class="blue" :class="{ active: type === 1 }" @click="tabColor(1)"></span>
                <span class="black" :class="{ active: type === 2 }" @click="tabColor(2)"></span>
            </div>
            <div class="sub_btn">
                <div @click="clearCanvas">清空</div>
                <div type="primary" @click="addCanvas">确定</div>
            </div>
        </div>
    </div>
</template>

<script>
import { sessionStore } from '@/utils';
let canvas = document.createElement('canvas');
let cxt = canvas.getContext('2d');

export default {
    data() {
        return {
            path: '',
            type: 0,
            color: '#FF0000',
            disabled: true,
            start: false,
            paperParams: {},

            isPostil: false,        // 是否为手写批注
        };
    },
    created() {
        let _query = this.$route.query

        // 判断是否为手写批注
        if (_query && _query.isPostil == 1) {
            console.log('=== 手写批注 ===')
            this.isPostil = true            
        }
    },
    mounted() {
        // 初始化手写批注的样式
        if (this.isPostil) {
            this.type = 2
            this.color = '#000000'
        }


        this.path = this.$route.path.match(/([^/]+)$/)[1];
        window.addEventListener(
            'onorientationchange' in window ? 'orientationchange' : 'resize',
            this.orientationChange,
            false
        );
        // this.getCanvas();
        this.orientationChange();
        document.body.addEventListener('touchmove', this.hiddenPrevent, {
            passive: false
        });
        // 从签署页过来
        if (this.$route.name === 'fileToHandSign') {
            if (this.$store.state.handSign.paperParams.id) {
                this.paperParams = this.$store.state.handSign.paperParams;
                $.cookie('paperParams', JSON.stringify(this.paperParams));
            } else {
                this.paperParams = JSON.parse($.cookie('paperParams'));
                console.log(this.paperParams);
            }
        }
    },
    methods: {
        routerTo(val) {
            this.$router.push(val);
        },
        tabColor(val) {
            this.type = val;
            switch (this.type) {
                case 0:
                    this.color = '#FF0000';
                    break;
                case 1:
                    this.color = '#0076FF';
                    break;
                case 2:
                    this.color = '#000000';
                    break;
            }
            this.getCanvas();
        },
        getCanvas() {
            let el = document.getElementById('canvas');
            el.appendChild(canvas);
            canvas.width = el.clientWidth;
            canvas.height = el.clientHeight;
            cxt.fillStyle = 'transparent'; //填充绘图的背景颜色
            cxt.fillRect(0, 0, canvas.width, canvas.height); //绘制“已填色”的矩形
            cxt.strokeStyle = this.color; //笔触的颜色
            cxt.lineCap = 'round'; //线条末端线帽的样式
            let linewidth = '4';
            let top = 44;
            let left = 16;
            // alert(left);alert(top)
            //开始绘制
            canvas.addEventListener(
                'touchstart',
                function(e) {
                    this.start = true;
                    cxt.beginPath();
                    cxt.lineWidth = linewidth; //当前线条的宽度，以像素计
                    cxt.moveTo(
                        e.changedTouches[0].pageX - left,
                        e.changedTouches[0].pageY - top
                    );
                    console.log();
                }.bind(this),
                false
            );
            //绘制中
            canvas.addEventListener(
                'touchmove',
                function(e) {
                    cxt.lineTo(
                        e.changedTouches[0].pageX - left,
                        e.changedTouches[0].pageY - top
                    );
                    cxt.stroke();
                }.bind(this),
                false
            );
            //结束绘制
            canvas.addEventListener(
                'touchend',
                function() {
                    cxt.closePath();
                }.bind(this),
                false
            );
        },
        clearCanvas() {
            this.start = false;
            this.getCanvas();
        },
        addCanvas() {
            if(!this.start) return this.$message.error({
                message: !this.isPostil ? '请先完成手写签名' : '请先完成手写批注',
                customClass: 'h5-z-index'
            })
            this.start = false;
            let imageData = cxt.getImageData(0, 0, canvas.width, canvas.height);

            // 保留原始透明的 base64         
            let _imageData = cxt.getImageData(0, 0, canvas.width, canvas.height);
            cxt.putImageData(_imageData, 0, 0);
            let _imgBase64 = canvas.toDataURL('image/png');
            !this.isPostil && sessionStore.set('t_signBase64', _imgBase64)


            for(let i = 0; i < imageData.data.length; i += 4) {
            // 当该像素是透明的,则设置成白色
                if(imageData.data[i + 3] == 0) {
                    imageData.data[i] = 255;
                    imageData.data[i + 1] = 255;
                    imageData.data[i + 2] = 255;
                    imageData.data[i + 3] = 255;
                }
            }           

            cxt.putImageData(imageData, 0, 0);
            let imgBase64 = canvas.toDataURL('image/png');
            if (this.isPostil) {
                let postilList = sessionStore.get('postilList') || []
                postilList.push({
                    t_picturePath: _imgBase64,
                    picturePath: imgBase64,
                    compactFileCode: this.$route.query.fileCode,
                    signatureStartPage: this.$route.query.pageNo
                })
                sessionStore.set('postilList', postilList)
            }else {
                sessionStore.set('signBase64', imgBase64)
            }
            this.$router.push({
                path: 'h5SignContract',
                query: this.$route.query
            })
            // this.signUpload({
            //     base64: imgBase64,
            //     pictureType: '01'
            // })
            //     .then((res) => {
            //         if (this.successCheckCode(res)) {
            //             this.$store.commit('updateChange', {
            //                 formData: Object.assign(this.formData, {
            //                     pictureWidth: res.data.pictureWidth,
            //                     pictureHeight: res.data.pictureHeight,
            //                     pictureDataTmpId: res.data.pictureDataTmpId,
            //                     picturePath: res.data.picturePath
            //                 }),
            //                 signBase64: imgBase64,
            //                 picWidth: res.data.pictureWidth,
            //                 picHeight: res.data.pictureHeight,
            //                 sealType: '99' //印章类型（01：印章；02：签名；99: 移动端手写签名）
            //             });
            //             if (this.$route.query.isEdit == '1') {
            //                 let data = Object.assign(
            //                     {},
            //                     this.formData,
            //                     JSON.parse(
            //                         sessionStorage.getItem('ukeySignData')
            //                     )
            //                 );
            //                 this.addUkeySign(data).then((res) => {
            //                     if (this.successCheckCode(res)) {
            //                         console.log(res);
            //                         toast.close();
            //                         this.close();
            //                     }
            //                 });
            //             } else {
            //                 this.close();
            //             }
            //         }
            //         this.start = true;
            //         toast.close();
            //     })
            //     .fail((res) => {
            //         this.start = true;
            //         toast.close();
            //     });
        },
        //判断手机横竖屏状态：
        orientationChange() {
            if (window.orientation == 180 || window.orientation == 0) {
                //竖屏
                document.body.parentElement.className = '';
                this.start = false;
                setTimeout(() => {
                    document.querySelector('.sign_bg').style.width = '6rem';
                    document.querySelector('.sign_bg').style.height = '3rem';
                    cxt.clearRect(0, 0, canvas.width, canvas.height);
                }, 100);
                setTimeout(() => {
                    this.getCanvas();
                }, 500);
            }
            if (window.orientation == 90 || window.orientation == -90) {
                //横屏
                document.body.parentElement.className = 'isOprientation';
                this.start = false;
                setTimeout(() => {
                    document.querySelector('.sign_bg').style.width = '3rem';
                    document.querySelector('.sign_bg').style.height = '1.5rem';
                    cxt.clearRect(0, 0, canvas.width, canvas.height);
                }, 100);
                setTimeout(() => {
                    this.getCanvas();
                }, 500);
            }
        },
        hiddenPrevent(e) {
            e.preventDefault();
        }
    },
    destroyed() {
        document.body.removeEventListener('touchmove', this.hiddenPrevent, {
            passive: false
        });
        document.body.parentElement.className = '';

        window.removeEventListener(
            'onorientationchange' in window ? 'orientationchange' : 'resize',
            this.orientationChange,
            false
        );
    }
};
</script>

<style lang="scss">
.isOprientation {
    font-size: 50px !important;
}
.handSign {
    height: 100%;
    width: 100%;
    display: flex;
    flex-direction: column;
    .top {
        display: flex;
        height: 44px;
        line-height: 44px;
        justify-content: space-between;
        .sign_close {
            display: inline-block;
            width: 0.88rem;
            height: 0.88rem;
            background: url(../../assets/image/back_black.svg) no-repeat;
            background-size: 100%;
        }
        .turndown {
            display: inline-block;
            width: 0.88rem;
            height: 0.88rem;
            background: url(../../assets/image/turn_icon.svg) no-repeat;
            background-size: 0.44rem 0.44rem;
            background-position: center;
        }
        h5 {
            font-size: 0.32rem;
        }
    }
    .sign_box {
        padding: 0 16px;
        flex: 1;
        .signature {
            height: 100%;
            width: 100%;
            border: 1px dashed rgba(0, 110, 254, 0.4);
            border-radius: 0.16rem;
            text-align: center;
            position: relative;
            .bg_box {
                position: absolute;
                left: 50%;
                top: 50%;
                transform: translate(-50%, -50%);
            }
            .sign_bg {
                display: inline-block;
                width: 6rem;
                height: 3rem;
                background: url(../../assets/image/sign_bg.svg) no-repeat;
                background-size: 100%;
            }
            p {
                color: #cccccc;
                font-size: 0.32rem;
            }
        }
        #canvas {
            width: 100%;
            height: 100%;
            position: absolute;
            left: 0;
            top: 0;
        }
    }
    .sub_foot {
        padding: 0.32rem;
        display: flex;
        justify-content: space-between;
        .tabcolor {
            width: 1.96rem;
            display: flex;
            justify-content: space-between;
            align-items: center;
            span {
                display: inline-block;
                width: 0.44rem;
                height: 0.44rem;
                border-radius: 50%;
                position: relative;
            }
            .red {
                background: #ff0000;
            }
            .blue {
                background: #0076ff;
            }
            .black {
                background: #000000;
            }
            .active {
                &::before {
                    content: '';
                    width: 100%;
                    height: 100%;
                    display: inline-block;
                    background: url(../../assets/image/pick.svg) no-repeat
                        center;
                    background-size: 0.18rem;
                }
            }
        }
        .sub_btn {
            width: 4.36rem;
            display: flex;
            justify-content: space-between;
            >div {
                width: 2.1rem;
                height: .72rem;
                border: 1px solid #ccc;
                text-align: center;
                line-height: .72rem;
                border-radius: .36rem;
            }
        }
    }
}
</style>
