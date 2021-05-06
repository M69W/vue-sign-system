<template>
    <el-menu
        class="slide-menu-box el-menu-vertical-demo"
        :defaultActive="$route.meta.parentUrl"
        router
        :collapse="isCollapse"
        @select="selectMenu"
    >
        <!-- 静态菜单树 - 首页 -->
        <el-menu-item :index="constantMenu[0].itemChildren[0].path">
            <i class="el-icon-s-home"></i>
            <span slot="title">首页</span>
        </el-menu-item>

        <!-- 遍历后台返回菜单树 -->
        <el-submenu
            v-for="menuItem in menu"
            :index="menuItem.id"
            :key="menuItem.id"
            v-if="menuItem.id"
            @select="selectMenu"
        >
            <template slot="title">
                <i :class="menuItem.icon"></i>
                <span class="title" v-text="menuItem.name"></span>
            </template>
            <el-menu-item-group>
                <el-menu-item
                    v-for="item in menuItem.children"
                    :key="item.id"
                    @click="menuClick(item.id)"
                    :index="item.path"
                    v-text="item.name"
                >
                </el-menu-item>
            </el-menu-item-group>
        </el-submenu>
    </el-menu>
</template>
<script>
// import { mapState } from 'vuex';
import menu from '@/config/menu'; // 引入静态菜单

export default {
    name: 'menuItem',
    props: {
        menu: {
            type: Array,
            default() {
                return [];
            }
        },
        isCollapse: {
            type: Boolean,
            default: false
        }
    },
    computed: {
        // ...mapState({
        //     isSameMenu: (state) => state.isSameMenu
        // })
    },
    data() {
        return {
            constantMenu: menu
        };
    },
    mounted() {},
    methods: {
        menuClick(id) {
            this.$store.state.isSameMenu = !this.$store.state.isSameMenu;
        },
        selectMenu(index, indexPath) {
            // console.log(index, indexPath);
        }
    }
};
</script>
<style lang="scss" scoped>
.slide-menu-box {
    // background-color: #001529;
    background-color: #e9edf1;
}
.el-menu-vertical-demo:not(.el-menu--collapse) {
    width: 256px;
}
.el-menu {
    border-right: none;
}
.el-menu-item {
    width: 100%;
    color: #666 !important;
    // background: #F3F6F8 !important;
    background-color: #e9edf1;
    padding-left: 60px !important;
}
.el-menu-item,
.el-submenu__title {
    height: 40px;
    line-height: 40px;
    color: #333;
}
.el-submenu__title i {
    margin-right: 0 !important;
}
.el-menu-item:hover {
    color: #666 !important;
}
.el-menu-item:hover i {
    color: #666 !important;
}
.el-menu-item.is-active {
    color: #fff !important;
    background: #4a90e2;
}
.el-menu-item.is-active i {
    color: #fff !important;
}
.slide-menu-box .is-active.is-opened .el-submenu__title {
    background: red;
}
.el-menu-item i {
    color: #666 !important;
}
.el-submenu .iconfont,
.el-submenu .iconfont::before {
    margin-right: 20px;
    font-size: 16px;
}

.slide-menu-box .el-submenu__title i {
    color: #333;
}
.el-icon-s-home {
    margin-left: -40px;
    margin-right: 15px;
}
</style>