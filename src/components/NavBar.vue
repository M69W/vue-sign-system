<template>
    <div class="container-nav-bar">
        <div class="nav-bar-space"></div>
        <van-nav-bar
            :title="title"
            left-text=""
            right-text=""
            :left-arrow="isBack"
            fixed
            @click-left="onClickLeft"
        />
    </div>
</template>

<script>
export default {
    props: {
        title: String
    },
    data() {
        return {
            isBack: true
        }
    },
    mounted() {
        // console.log(this.$route.path)
        // 发起审批首页时，隐藏`返回`按钮
        let _hideBackPages = [
            '/h5wf/approve-apply',
            '/h5wf/approve-mine',
            '/h5wf/approve-submitted',
        ]

        if (_hideBackPages.includes(this.$route.path)) {
            this.isBack = false
        }
    },
    methods: {
        onClickLeft() {
            console.log('返回...')
            if (this.isBack) {
                // ^ 仅当返回按钮有效果时，才执行返回
                this.$router.go(-1)
            }
        }
    },    
}
</script>

<style lang="scss">
    .nav-bar-space {
        height: 46px;
    }

    .van-nav-bar {
        // background-image: linear-gradient(#006EFE, #494AFF);
        background-image: linear-gradient(#f1f2f6, #e1e2e6);
        
        .van-icon::before,
        .van-nav-bar__title {
            // color: #fff;
            color: #666;
        }  
    }
</style>