import Vue from 'vue';
import Vuex from 'vuex';
import app from '@/store/modules/app';
import settings from '@/store/modules/settings';
import customClass from '@/store/modules/customClass';
import * as actions from '@/store/actions';
import * as mutations from '@/store/mutations';

Vue.use(Vuex);

export default new Vuex.Store({
    modules: {
        app,
        settings,
        customClass
    },
    state: {
        userInfo: {},
        loading: false,
        loadingMsg: '努力加载中...',
        permissionData: [], // 权限数据
        menuList: [], // 侧边栏菜单
        isSameMenu: 0 // 解决点击当前菜单栏刷新
    },
    mutations,
    actions
});
