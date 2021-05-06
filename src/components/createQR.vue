<template>
    <div class="qr-container">
        <div :id="index"></div>
    </div>
</template>

<script>
import QRcode from 'qrcodejs2';
export default {
    components: {},
    props: {
        width: {
            type: Number,
            default: 100
        },
        height: {
            type: Number,
            default: 100
        },
        url: {
            type: String,
            required: true
        },
        index: {
            type: String,
            default: Date.now()
        }
    },
    data() {
        return {};
    },
    created() {},
    mounted() {
        this.initQR();
    },
    methods: {
        initQR() {
            let _self = this;
            new QRcode(this.index, {
                width: _self.width,
                height: _self.height,
                text: _self.url,
                colorDark: '#000',
                colorLight: '#fff'
            });
        }
    }
};
</script>
<style lang="scss" scoped>
.qr-container {
}
</style>