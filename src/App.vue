<template>
    <div id="app" v-cloak>
        <keep-alive v-if="$route.meta.keepAlive">
            <router-view />
        </keep-alive>
        <router-view v-else />
        <loading :visible="loading" message="努力加载中..."></loading>
    </div>
</template>

<script>
import { mapState } from 'vuex';
import { sessionStore, localStore } from '@/utils';
import Loading from '@/components/loading/loading.vue';
export default {
    name: 'app',
    components: {
        loading: Loading
    },
    data() {
        return {
            // h5routers: [
            //     '/fileCenter/qrToPhoneReal',
            //     '/h5sign/h5SignType',
            //     '/h5sign/h5SignRule',
            //     '/h5sign/h5SignChoose',
            //     '/h5sign/h5SignIndex',
            //     '/h5sign/h5SignSuccess',
            //     '/h5sign/h5SignReview'
            // ]
        };
    },
    async created() {
        let userInfo = localStore.get('userInfo'); // 用户已登录 本地office跳转不用再登录
        if (!sessionStore.get('userInfo') && userInfo) {
            sessionStore.set('userInfo', userInfo)
        }
        if (userInfo) {
            this.$store.dispatch('updateUserInfo', userInfo);
        } else {
            this.$store.dispatch('updateUserInfo', '');
        }
    },
    mounted() {
        window.addEventListener('hashchange', () => {
            let currentPath = window.location.hash.slice(1);
            if (this.$router.path !== currentPath) {
                this.$router.push(currentPath);
            }
        });
        this.listenerResize();
        console.log(sessionStore.get('userInfo'));
    },
    computed: {
        ...mapState({
            loading: (state) => state.loading
        })
    },
    watch: {
        $route(to, from) {
            // if (this.h5routers.includes(to.path)) {
            if (to.path.indexOf('/h5sign') > -1 || to.path === '/fileCenter/qrToPhoneReal') {
                this.resetFontSize('h5');
            } else {
                this.resetFontSize();
            }
        }
    },
    methods: {
        listenerResize() {
            let _self = this;
            window.onresize = function() {
                if (window.innerWidth < 1300) {
                    _self.$store.commit('TOGGLE_SIDEBAR', true);
                } else {
                    _self.$store.commit('TOGGLE_SIDEBAR', false);
                }
            };
        },
        resetFontSize(h5) {
            var windowWidth = document.documentElement.clientWidth;
            var htmlDom = document.getElementsByTagName('html')[0];
            if (h5) {
                htmlDom.style.fontSize = windowWidth / 7.5 + 'px';
                this.$store.commit('toggleCustomClass', 'h5-z-index');
            } else {
                htmlDom.style.fontSize = '14px';
                this.$store.commit('toggleCustomClass');
            }
        }
    }
};
</script>

<style lang="scss" scoped>
#app {
    width: 100%;
    position: absolute;
    left: 0;
    top: 0;
    bottom: 0;
}
</style>


