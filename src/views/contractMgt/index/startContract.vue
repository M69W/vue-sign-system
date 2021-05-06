<template>
    <div class="contract_mgt">
        <div class="inner">
            <div class="header-title">
                <el-breadcrumb separator="/">
                    <el-breadcrumb-item to="/contractMgt/index">合同管理</el-breadcrumb-item>
                    <el-breadcrumb-item>发起合同</el-breadcrumb-item>
                </el-breadcrumb>
            </div>
            <div class="content">
                <div class="main_container">
                    <!-- <keep-alive> -->
                    <router-view></router-view>
                    <!-- </keep-alive> -->
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import { setRowClass } from '@/mixins/setTableRowClass';
import { sessionStore } from '@/utils';
export default {
    mixins: [setRowClass],
    data() {
        return {};
    },
    watch: {},
    created() {},
    methods: {
        next() {
            console.log(this.$route);
            let routeName = this.$route.name;
            if (routeName === 'newContractStep1') {
                this.$router.push('step2');
            }
        },
        prev() {
            this.$router.go(-1);
        }
    }
};
</script>

<style lang="scss" scoped>
.contract_mgt {
    .inner {
        padding: 0 20px 20px;
        background-color: #fff;
        .header-title {
            border-bottom: 1px solid #e9e9e9;
            .el-breadcrumb {
                &__item {
                    line-height: 54px;
                }
            }
        }
        .content {
            .main_container {
                // padding: 10px;
            }
        }
    }
}
</style>
