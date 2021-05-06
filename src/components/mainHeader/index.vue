<template>
    <div class="header">
        <div class="shrinkage">
            <i class="el-icon-s-fold" v-if="!isCollapse" @click="fold"></i>
            <i class="el-icon-s-unfold" v-if="isCollapse" @click="unfold"></i>
        </div>
        <div class="bar-info">
            <!-- <span class="about" @click="about">
                <i class="iconfont icon-guanyuwomen"></i>关于我们
            </span>-->
            <span class="name">
                <!-- <i class="iconfont icon-yonghu-outline"></i>{{companyName}} -->
                <img :src="avatar" class="avatar" alt />
                <span
                    class="user-name"
                    @click="$router.push('/backManage/myAccount/baseSet')"
                    >{{ companyName }}</span
                >
            </span>
            <span class="login-out" @click="loginOut">退出</span>
        </div>
        <!-- <theme-picker
            style="float: right;height: 26px;margin: -3px 8px 0 0;"
            @change="themeChange"
        />-->
    </div>
</template>
<script>
import { mapState } from 'vuex';
import { sessionStore, localStore } from '@/utils';
import ThemePicker from '@/components/themePicker';
export default {
    name: 'mainHeader',
    data() {
        return {
            companyName: sessionStore.get('userInfo').userName,
            avatar: require('@/assets/image/用户头像.png')
        };
    },
    computed: {
        ...mapState({
            isCollapse: (state) => state.app.sidebar.isCollapse,
            userInfo: (state) => state.userInfo
        })
    },
    components: { ThemePicker },
    methods: {
        fold() {
            this.$store.commit('TOGGLE_SIDEBAR');
        },
        unfold() {
            this.$store.commit('TOGGLE_SIDEBAR');
        },
        themeChange(val) {
            this.$store.commit('CHANGE_SETTING', {
                key: 'theme',
                value: val
            });
        },
        about() {
            this.$message.info('暂未开放');
        },
        loginOut() {
            this.$confirm('退出当前用户, 是否继续?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                let idToken = sessionStore.get('userInfo').id;
                this.$api('loginOut')
                    .get('getPath', {
                        token: idToken
                    })
                    .then((res) => {
                        let isLoginOut = res.data.data;
                        let errInfo = res.data.msg;
                        let _self = this;
                        if (isLoginOut) {
                            localStore.remove('userInfo');
                            localStore.remove('menuList');
                            localStore.remove('permissionData');
                            this.$router.push('/login');
                            // debugger;
                            this.$message.success({
                                message: '退出成功!'
                            });
                        } else {
                            this.$message.error(errInfo);
                        }
                    })
                    .catch((err) => {
                        console.log(err);
                    });
            });
        }
    }
};
</script>
<style lang="scss" scoped>
.header {
    height: 60px;
    display: flex;
    align-items: center;
    .shrinkage {
        flex: 1;
        margin-left: 30px;
        i {
            font-size: 20px;
            color: #000;
            cursor: pointer;
        }
    }
    .bar-info {
        display: flex;
        align-items: center;
        padding-right: 30px;
        .name {
            margin: 0 50px;
            display: flex;
            align-items: center;
            .avatar {
                width: 45px;
                height: 45px;
                margin-right: 5px;
                border-radius: 5px;
            }
            .user-name {
                cursor: pointer;
            }
        }
        .about,
        .login-out {
            cursor: pointer;
            .icon-guanyuwomen {
                position: relative;
                top: 1px;
                margin-right: 5px;
            }
        }
    }
}
</style>