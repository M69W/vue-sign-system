<template>
    <div class="ofd-demo">
        <div v-if="isIE" class="tips">
            <p>该页面暂不支持IE浏览器打开，</p>
            <p>1、请使用chrome浏览器或360浏览器极速模式打开本页面，或</p>
            <p>2、复制下方地址，并使用chrome浏览器或360浏览器极速模式打开</p>
            <p>https://127.0.0.1:9827/ofdService/upload.html</p>
        </div>
        <iframe
            src="https://127.0.0.1:9827/ofdService/upload.html"
            frameborder="0"
            width="100%"
            height="100%"
            v-else
        ></iframe>
    </div>
</template>

<script>
import { isIE } from '@/utils';

export default {
    data() {
        return {
            isIE: false
        };
    },
    created() {
        if (isIE()) {
            this.isIE = true;
        }
    }
};
</script>

<style lang="scss" scoped>
.ofd-demo {
    position: absolute;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    .tips {
        text-align: center;
        padding-top: 20px;
        line-height: 40px;
    }
}
</style>