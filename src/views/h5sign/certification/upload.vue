<template>
    <div class="upload-component">
        <input ref="imgUpload" type="file" class="img-upload" @change="imgUpload" accept="image/*">
        <div class="img-container" v-if="imgUrl">
            <img :src="imgUrl" alt="">
        </div>
        <div class="word" v-else>
            <p class="title">
                <slot name="title">点击上传身份证</slot>
            </p>
            <p class="desc">
                <slot name="desc">个人信息面</slot>
            </p>
        </div>
    </div>
</template>

<script>
export default {
    data() {
        return {
            imgUrl: ''
        }
    },
    methods: {
        imgUpload(e) {
            const files = e.target.files
            if(!files.length) return
            this.$emit('uploaded', files[0])
            let _this = this
            const filtReader = new FileReader()
            filtReader.readAsDataURL(files[0])
            filtReader.onload = function (e) {
                _this.imgUrl = this.result
            }
        }
    }
}
</script>

<style lang="scss" scoped>
    .upload-component {
        position: relative;
        max-width: 100%;
        min-height: 2rem;
        max-height: 100%;
        border: 1px dashed #ccc;
        border-radius: .1rem;
        display: flex;
        justify-content: center;
        align-items: center;
        background-color: #f7f7f7;
        .word {
            text-align: center;
            .title {
                color: #999;
                margin-bottom: .3rem;
            }
            .desc {
                font-size: .36rem;
            }
        }
        .img-container {
            position: absolute;
            left: .2rem;
            top: .2rem;
            right: .2rem;
            bottom: .2rem;
            display: flex;
            justify-content: center;
            align-items: center;
            img {
                vertical-align: middle;
                max-width: 100%;
                max-height: 100%;
            }
        }
        .img-upload {
            position: absolute;
            width: 100%;
            height: 100%;
            z-index: 1;
            opacity: 0;
        }
    }
</style>