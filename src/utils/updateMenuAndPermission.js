import store from '@/store.js';
import { sessionStore } from '@/utils';
let userId = sessionStore.get('userInfo')
    ? sessionStore.get('userInfo').id
    : '';
// 在页面内刷新时动态更新菜单及权限数据
if (userId) {
    store.dispatch('getUserMenuTree', { userId: userId });
}
