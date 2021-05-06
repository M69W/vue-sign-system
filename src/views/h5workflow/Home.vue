<template>
    <div class="container-home">
        <NavBar title="审批" />

        <div class="main">
            <router-view />
        </div>

        <van-tabbar v-model="activeNav" route>
            <van-tabbar-item to="/h5wf/approve-apply" icon="home-o">发起审批</van-tabbar-item>
            <van-tabbar-item to="/h5wf/approve-mine" icon="manager-o">我的审批</van-tabbar-item>
            <van-tabbar-item to="/h5wf/approve-submitted" icon="passed">已提交</van-tabbar-item>
        </van-tabbar>
    </div>
</template>

<script>
import NavBar from '@/components/NavBar.vue'
export default {
    name: "Home",
    components: {
        NavBar
    },
    data() {
        return {
            activeNav: 0
        };
    },
    methods: {
        back() {
            // console.log('.......')
        }
      
    }
};
</script>

<style lang="scss" scoped>
.container-home {
    background-color: #F1F2F6;

    .main {
        height: 570px;
        overflow: auto;
    }
    

}
</style>

<style lang="scss">
.vant-notify-extension {
    height: 46px;
    line-height: 30px;
}
</style>

