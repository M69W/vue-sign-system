import { api } from '@/server/reset-api';
import doPermission from '@/permission/filterPermission';
export const login = async ({ commit }, params) => {
    let res;
    if (params.isMsgLogin) {
        let { userName, valicode: validateCode, smsValidateCode } = params;
        res = await api('loginBySmsValidateCode').post('', {
            userName,
            validateCode,
            smsValidateCode
        });
    } else {
        res = await api('login').post('postNormal', params);
    }
    if (res) {
        if (res.data.code === 0) {
            let userInfo = res.data.data;
            commit('updateUserInfo', userInfo);
            return userInfo;
        } else {
            return res.data;
        }
    }
};
export const getUserMenuTree = async ({ commit }, data) => {
    console.log(data);
    let res = await api('getUserMenuTree').get('getPath', data);
    if (res) {
        let menuList = res.data.data;
        let filterPermissionData = doPermission(menuList);
        commit('updatePermitionData', filterPermissionData);
        commit('userMenuTree', menuList);
        return menuList;
    }
};
export const updateUserInfo = ({ commit }, value) => {
    commit('updateUserInfo', value);
};

export const updatePermitionData = ({ commit }, value) => {
    commit('updatePermitionData', value);
};
