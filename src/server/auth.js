import router from '@/router';
import { sessionStore, localStore } from '@/utils';
const auth = {
    isLogined() {
        // return !!sessionStore.get('userInfo');
        return !!localStore.get('userInfo');
    },
    goLogin() {
        let currentPath = encodeURIComponent(router.history.pending.fullPath);
        router.push({
            path: '/login?router=' + currentPath
        });
    }
};
export default auth;
