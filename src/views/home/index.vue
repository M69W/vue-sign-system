<template>
    <div class="home-page">
        <side-menu />
        <div class="main-cont">
            <main-header />
            <div class="container">
                <div class="inner">
                    <el-scrollbar :id="$route.meta.scrollId">
                        <div class="inner-second">
                            <!-- <transition name="fade-transform" mode="out-in"> -->
                            <!-- <keep-alive> -->
                            <router-view :key="$route.path" />
                            <!-- </keep-alive> -->
                            <!-- </transition> -->
                        </div>
                    </el-scrollbar>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
import { mapState } from 'vuex';
import Menu from '@/components/menu';
import MainHeader from '@/components/mainHeader';
export default {
    name: 'home',
    data() {
        return {};
    },
    computed: {
        ...mapState({
            isCollapse: (state) => state.app.sidebar.isCollapse
        })
    },
    components: { sideMenu: Menu, MainHeader },
    filters: {},
    created() {},
    methods: {}
};
</script>
<style lang="scss" scoped>
.home-page {
    width: 100%;
    position: absolute;
    left: 0;
    top: 0;
    bottom: 0;
    display: flex;
}
.el-scrollbar {
    height: 100%;
    overflow: hidden;
    border-right: none !important;
    .el-scrollbar__wrap {
        height: 100%;
        overflow-y: scroll;
        overflow-x: hidden;
    }
}
.main-cont {
    flex: 1;
    position: relative;
    .container {
        background: #f4f6f8;
        position: absolute;
        width: 100%;
        left: 0;
        top: 60px;
        bottom: 0;
        overflow: hidden;
        .inner {
            position: absolute;
            left: 10px;
            top: 10px;
            bottom: 0;
            right: 10px;
            // background: #f4f6f8;
            background-color: #fff;
            .inner-second {
                // background: #f4f6f8;
                background-color: #fff;
            }
        }
    }
}
</style>