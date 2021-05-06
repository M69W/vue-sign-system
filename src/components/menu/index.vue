<template>
    <div class="menu-cont" :class="{ 'menu-cont-fold': isCollapse }">
        <menu-logo
            v-if="showLogo"
            :logoUrl="logoUrl"
            :logoTitle="logoTitle"
            :collapse="isCollapse"
        />
        <div class="slide-menu">
            <el-scrollbar>
                <main-menu :menu="menu" :isCollapse="isCollapse"></main-menu>
            </el-scrollbar>
        </div>
    </div>
</template>
<script>
import { mapState } from 'vuex';
import menu from '@/config/menu'; // 引入静态菜单
import MenuLogo from './menuLogo';
import MainMenu from './menuItem';
import { sessionStore, localStore } from '@/utils';
import doPermission from '@/permission/filterPermission';

export default {
    name: 'sideMenu',
    data() {
        return {
            logoTitle: '',
            logoUrl: '',
            menu: localStore.get('menuList')
        };
    },
    computed: {
        ...mapState({
            isCollapse: (state) => state.app.sidebar.isCollapse,
            // menu: (state) => state.menuList
        }),
        showLogo() {
            return this.$store.state.settings.sidebarLogo;
        }
    },
    components: {
        MenuLogo,
        MainMenu
    },
    created() {
        this.getUserInfo();
    },
    methods: {
        // 获取系统名和logo
        getUserInfo() {
            this.$api('getSysDefaultConfig')
                .get()
                .then((res) => {
                    if (!res) return;
                    let data = res.data.data;
                    this.logoTitle = data.sysName;
                    this.logoUrl = data.logoUrl;
                });
        }
    }
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
.menu-cont {
    width: 256px;
    position: relative;
    transition: all 0.3s;
    .slide-menu {
        width: 100%;
        position: absolute;
        left: 0;
        top: 70px;
        bottom: 0;
        // background-color: #001529;
        background-color: #e9edf1;
        // padding-top: 28px;
    }
}
.menu-cont-fold {
    width: 60px;
}
.el-menu-vertical-demo:not(.el-menu--collapse) {
    width: 256px;
}
.websiteTitle {
    height: 70px;
    line-height: 70px;
    text-align: left;
    text-indent: 26px;
    white-space: nowrap;
    overflow: hidden;
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
.el-scrollbar {
    border-right: solid 1px #e5e5e5;
}
</style>