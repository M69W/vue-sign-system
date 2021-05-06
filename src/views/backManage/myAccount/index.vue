<template>
    <div class="set-index">
        <div class="inner">
            <div class="side-menu">
                <el-menu
                    class="slide-menu-box el-menu-vertical-demo"
                    :defaultActive="$route.path"
                    router
                    @select="change"
                >
                    <el-menu-item
                        v-for="(item, index) in menu"
                        :key="index"
                        :index="item.path"
                        :class="item.iconClass"
                        >{{ item.title }}</el-menu-item
                    >
                </el-menu>
            </div>
            <div class="container">
                <router-view></router-view>
            </div>
        </div>
    </div>
</template>

<script>
import menu from './menuConfig';
export default {
    name: 'setIndex',
    data() {
        return {
            menu: menu
        };
    },
    methods: {
        change(path) {
            console.log(path, this.$route);
        }
    }
};
</script>

<style lang="scss" scoped>
.set-index {
    width: 100%;
    position: absolute;
    left: 0;
    top: 0;
    bottom: 0;
    overflow: hidden;
    .inner {
        display: flex;
        position: absolute;
        left: 0;
        top: 0;
        right: 6px;
        bottom: 4px;
        // box-shadow: 0 2px 4px rgba(0, 0, 0, 0.5);
    }
    .side-menu {
        width: 240px;
        background: #f4f6f8;
        .el-menu {
            border-right: none;
        }
        .el-menu-item,
        .el-submenu__title {
            background: #f4f6f8;
            height: 40px;
            line-height: 40px;
            color: #333;
        }
        .el-menu-item.is-active {
            background: #fff;
            border-left: solid 2px #4a90e2;
            color: #4a90e2;
        }
    }
    .container {
        flex: 1;
        background: #fff;
    }
}
</style>



