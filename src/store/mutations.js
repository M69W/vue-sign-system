import { sessionStore, localStore } from '@/utils';
export const updateUserInfo = (state, value) => {
    state.userInfo = value;
    sessionStore.set('userInfo', value);
};
export const updateMenu = (state, value) => {
    state.menuData = value;
};
export const userMenuTree = (state, value) => {
    state.menuList = value;
    localStore.set('menuList', value) // 用户已登录 本地office跳转不用再登录
};
export const showLoading = (state, value) => {
    state.loading = true;
    state.loadingMsg = value || '努力加载中...';
};
export const updatePermitionData = (state, value) => {
    state.permissionData = value;
    localStore.set('permissionData', value) // 用户已登录 本地office跳转不用再登录
};
export const hideLoading = (state) => {
    state.loading = false;
};
