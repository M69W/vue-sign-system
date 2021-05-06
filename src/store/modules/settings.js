import variables from '@/assets/scss/element-variables.scss';
import { sessionStore } from '@/utils';

const state = {
    sidebarLogo: true,
    logoUrl: '../../assets/image/avatar.gif',
    logoUrl: sessionStore.get('logoUrl')
        ? sessionStore.get('logoUrl')
        : require('@/assets/image/logo-main.png'),
    logoTitle: sessionStore.get('logoTitle')
        ? sessionStore.get('logoTitle')
        : '签章系统-体验演示',
    theme: sessionStore.get('theme')
        ? sessionStore.get('theme')
        : variables.theme,
    driveVersion: '3.3.0', // 驱动版本
    // driveVersion: '2.0.0.7', // 驱动版本
    uploadFileSize: 20 // 上传文件上线
};

const mutations = {
    CHANGE_SETTING: (state, { key, value }) => {
        console.log(key, value);
        if (state.hasOwnProperty(key)) {
            state[key] = value;
            sessionStore.set(key, value);
        }
    }
};

export default {
    state,
    mutations
};
