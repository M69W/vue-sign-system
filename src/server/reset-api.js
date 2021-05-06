import Vue from 'vue';
import store from '@/store';
import router from '@/router';
import axios from 'axios';
import qs from 'qs';
import { allApis } from '@/server/api-urls';
import { ifReturnRightNow, noErrorWarning, noLoading } from './config/index';
import { message } from '@/utils/resetMessage';
import { sessionStore, localStore } from '@/utils';

// console.log(message);
// const TIMEOUT = 20000; // 接口10秒
// axios.defaults.timeout = TIMEOUT;
let errorWarning = true;
let ifReturnNow = false;
axios.interceptors.request.use(
    (config) => {
        // console.log(config);
        let loading = true;
        // 不加载loading动画的api
        if (config.headers.noLoading || noLoading(config.url)) {
            loading = false;
        } else {
            loading = true;
        }
        // 不弹出错误
        if (config.headers.noErrorWarning || noErrorWarning(config.url)) {
            errorWarning = false;
        } else {
            errorWarning = true;
        }
        // 直接返回单独处理状态
        if (config.headers.responseRightNow || ifReturnRightNow(config.url)) {
            ifReturnNow = true;
        } else {
            ifReturnNow = false;
        }
        if (loading) {
            store.commit('hideLoading');
            store.commit('showLoading');
        }
        return config;
    },
    (error) => {
        store.commit('hideLoading');
        message.error({
            message: msg,
            customClass: 'zZindex'
        });
        return Promise.reject(error);
    }
);
axios.interceptors.response.use(
    (response) => {
        store.commit('hideLoading');
        if (ifReturnNow) {
            return response;
        }
        if (response.status === 200) {
            // console.log(store.state.responseType);
            // 如果是文件流,单独处理
            if (response.config.responseType === 'blob') {
                if (response.data.code) {
                    message.error({
                        message: response.data.msg,
                        customClass: store.state.customClass.customClass
                    });
                    return;
                }
                return response;
            }
            let code;
            if (response.data.code === 0 || response.data.ret === 0 || response.data.code === undefined) {
                code = 0;
            } else {
                code = response.data.code || response.data.ret;
            }
            // code = 1000000;
            let msg = response.data.msg || '请求异常，请稍后再试！';
            if (code !== 0) {
                if (code === 1009 || code === 1010 || code === 1011) {
                    // console.log('无效的授权信息！');
                    // console.log(router.history.current.fullPath);
                    console.log(router);
                    if (router.history.current.fullPath === '/login' || router.history.current.path.indexOf('h5sign') > -1) return;
                    message.error({
                        message: '无效的授权信息！',
                        // customClass: 'zZindex'
                        customClass: store.state.customClass.customClass
                    });
                    sessionStore.remove('userInfo');
                    store.dispatch('updateUserInfo', '');
                    router.push('/login');
                    return;
                } else {
                    if (code === 106) {
                        msg = 'PIN码错误，请重新输入！';
                    }
                    message.error({
                        message: msg,
                        // customClass: 'zZindex'
                        customClass: store.state.customClass.customClass
                    });
                    return;
                }
            }
        } else {
            let msg = response.statusText || '请求异常，请稍后再试！';
            // console.log(errorWarning);
            message.error({
                message: msg,
                // customClass: 'zZindex'
                customClass: store.state.customClass.customClass
            });
            return;
        }
        return response;
    },
    (error) => {
        store.commit('hideLoading');
        // console.log(/500/.test(error));
        if (error.msg) {
            message.error({
                message: error.msg,
                customClass: store.state.customClass.customClass
            });
        } else if (error.message.indexOf('timeout') > -1) {
            message.error({
                message: '链接超时！',
                customClass: store.state.customClass.customClass
            });
        } else if (!errorWarning) {
            // 读取本地ukey出错不弹出错误提示
            return Promise.reject(error);
        } else {
            if (errorWarning) {
                message.error({
                    message: '请求错误，请稍后再试！',
                    customClass: store.state.customClass.customClass
                });
            } else if (/500/.test(error)) {
                // Message({
                //     message: '服务器异常，请稍后再试！',
                //     type: 'error',
                //     customClass: 'zZindex'
                // });
            }
        }
        return Promise.reject(error);
    }
);
let createAxios = (url) => {
    // let userInfo = sessionStore.get('userInfo') || {};
    let userInfo = localStore.get('userInfo') || {}; // 用户已登录 本地office跳转不用再登录
    let api_token = sessionStore.get('session_token');
    let sessionToken = userInfo.sessionToken || 'no_token';
    function setCommonPathUrl(url, data) {
        if (Object.keys(data).length) {
            for (let key in data) {
                url += `/${data[key]}`;
            }
        }
        return url;
    }
    function setCommonQueryUrl(url, data) {
        if (Object.keys(data).length) {
            for (let key in data) {
                url +=
                    url.indexOf('?') < 0
                        ? `?${key}=${data[key]}`
                        : `&${key}=${data[key]}`;
            }
        }
        return url;
    }
    return {
        get(requestType, data = {}, config = {}) {
            function getCommonPathAxios(url, config, sessionToken) {
                url += `?_t=${new Date().getTime()}`;
                let headers = setCommonHeaders(config, sessionToken);
                return axios({
                    method: 'get',
                    url: url,
                    headers: headers
                }).catch((err) => {
                    console.log(err);
                });
            }
            function setCommonHeaders(config, sessionToken) {
                let headers = Object.assign(
                    {},
                    !api_token ? {
                        session_token: sessionToken
                    } : {
                        api_token
                    },
                    config.headers || {}
                );
                return headers;
            }
            // params 正常拼接 ？a=xxx&b=xxx
            if (requestType === 'getNormal' || !requestType) {
                // console.log(data);
                url += `?_t=${new Date().getTime()}`;
                let headers = setCommonHeaders(config, sessionToken);
                return axios({
                    method: 'get',
                    url: url,
                    params: data,
                    headers: headers,
                    paramsSerializer: function(p) {
                        return qs.stringify(p, { indices: false });
                    }
                }).catch((err) => {
                    console.log(err);
                });
            }
            // 简单拼接 将参数以/xxx形式拼接到url上
            if (requestType === 'getPath') {
                console.log(data);
                url = setCommonPathUrl(url, data);
                return getCommonPathAxios(url, config, sessionToken);
            }
            // 指定替换字段拼接 将参数以/xxx形式拼接到url上
            if (requestType === 'getLocationPath') {
                // console.log(data);
                if (Object.keys(data).length) {
                    for (let key in data) {
                        let reg = new RegExp(key, 'g');
                        url = url.replace(reg, data[key]);
                    }
                }
                return getCommonPathAxios(url, config, sessionToken);
            }
            // 返回blob数据流
            if (requestType === 'getBlob') {
                // console.log(data);
                url = setCommonPathUrl(url, data);
                url += `?_t=${new Date().getTime()}`;

                let headers = setCommonHeaders(config, sessionToken);
                return axios({
                    method: 'get',
                    url: url,
                    responseType: 'blob',
                    headers: headers
                }).catch((err) => {
                    console.log(err);
                });
            }
        },
        post(requestType, data = {}, config = {}) {
            // config用于传拼接字段
            let headers = !api_token ? {
                session_token: sessionToken
            }:{api_token};
            function commonPostNormal(url, data, headers) {
                return axios
                    .post(url, data, {
                        headers: headers
                    })
                    .catch((err) => {
                        console.log(err);
                    });
            }
            function commonPostBlob(url, data, headers) {
                return axios({
                    method: 'post',
                    url: url,
                    responseType: 'blob',
                    data: data,
                    headers: headers
                }).catch((err) => {
                    console.log(err);
                });
            }
            // 正常请求 参数body以json形式,没有path和query拼接
            if (requestType === 'postNormal' || !requestType) {
                return commonPostNormal(url, data, headers);
            }
            // 正常请求 参数body以json形式,有path拼接
            if (requestType === 'postPath') {
                url = setCommonPathUrl(url, config);
                return commonPostNormal(url, data, headers);
            }
            // 正常请求 参数body以json形式,有query拼接
            if (requestType === 'postQuery') {
                url = setCommonQueryUrl(url, config);
                return commonPostNormal(url, data, headers);
            }
            // 请求blob数据流 参数body以json形式,无拼接
            if (requestType === 'postBlob') {
                return commonPostBlob(url, data, headers);
            }
            // 请求blob数据流 参数body以json形式,有path拼接
            if (requestType === 'postBlobPath') {
                url = setCommonPathUrl(url, config);
                return commonPostBlob(url, data, headers);
            }
            // 请求blob数据流 参数body以json形式,有query拼接
            if (requestType === 'postBlobQuery') {
                url = setCommonQueryUrl(url, config);
                return commonPostBlob(url, data, headers);
            }
            // 上传formdata文件 参数以formdata形式,无拼接
            if (requestType === 'postFormData') {
                return commonPostNormal(url, data, headers);
            }
            // 上传formdata文件 参数以formdata形式,有path拼接
            if (requestType === 'postFormDataPath') {
                url = setCommonPathUrl(url, config);
                return commonPostNormal(url, data, headers);
            }
            // 上传formdata文件 参数以formdata形式,有query拼接
            if (requestType === 'postFormDataQuery') {
                url = setCommonQueryUrl(url, config);
                return commonPostNormal(url, data, headers);
            }
        },
        patch(requestType, data = {}, config = {}) {
            function commonPatchNormal(url, data, headers) {
                return axios
                    .patch(url, data, {
                        headers: headers
                    })
                    .catch((err) => {
                        console.log(err);
                    });
            }
            let headers = !api_token ? {
                session_token: sessionToken,
            }:{api_token};
            console.log(requestType);
            if (requestType === 'patchNormal' || !requestType) {
                return commonPatchNormal(url, data, headers);
            }
            if (requestType === 'patchQuery') {
                url = setCommonQueryUrl(url, config);
                return commonPatchNormal(url, data, headers);
            }
        },
        delete(requestType, data = {}, config = {}) {
            function commonDeleteNormal(url, data, headers) {
                return axios
                    .delete(url, data, {
                        headers: headers
                    })
                    .catch((err) => {
                        console.log(err);
                    });
            }
            let headers = !api_token?{
                session_token: sessionToken
            }:{api_token};
            if (requestType === 'deleteNormal' || !requestType) {
                return commonDeleteNormal(url, {data, headers});
            }
            if (requestType === 'deleteQuery') {
                url = setCommonQueryUrl(url, config);
                return commonDeleteNormal(url, {data, headers});
            }
            if (requestType === 'deletePath') {
                url = setCommonPathUrl(url, config);
                return commonDeleteNormal(url, {data, headers});
            }
        }
    };
};
// 单独写的ukey的请求
let createUkeyAxios = (url) => {
    return {
        get(requestType, data = {}) {
            if (requestType === 'getNormal' || !requestType) {
                return axios({
                    method: 'get',
                    url: url,
                    params: data,
                    paramsSerializer: function(p) {
                        return qs.stringify(p, { indices: false });
                    }
                }).catch((err) => {
                    console.log(err);
                });
            }
            if (requestType === 'getPath') {
                url = setCommonPathUrl(url, data);
                return axios.get(url);
            }
        },
        post(requestType, data = {}, config = {}) {
            let contentType;
            if (requestType === 'postNormal') {
                contentType = 'application/json;charset=UTF-8';
            }
            if (requestType === 'postQuery') {
                contentType = 'application/x-www-form-urlencoded';
                data = qs.stringify(data);
            }
            return axios
                .post(url, data, {
                    headers: {
                        'content-Type': contentType
                    }
                })
                .catch((err) => {
                    console.log(err);
                });
        }
    };
};
export const api = (key) => {
    return createAxios(allApis.apis[key]);
};
export const ukeyApi = (key) => {
    return createUkeyAxios(allApis.ukeyApis[key]);
};
export const apiCloudSign = (key) => {
    return createUkeyAxios(allApis.apiCloudSign[key]);
};
Vue.prototype.$api = api; // TODO 全局 $api 封装
Vue.prototype.$ukeyApi = ukeyApi;
Vue.prototype.$apiCloudSign = apiCloudSign;


// ------------------------------------------------------------------

// FOR H5 Workflow - to create a simple axios instance
// 创建一个 axios 实例
const h5api = axios.create()
// 添加请求拦截器
h5api.interceptors.request.use(config => {
    // 发送请求之前执行的操作
    // ...


    return config
}, error => {
    // 自定义请求错误操作
    return Promise.reject(error)
})


// 添加响应拦截器
h5api.interceptors.response.use(response => {
    // 针对响应数据的操作
    // ...


    return response
}, error => {
    // 自定义响应错误操作
    return Promise.reject(error)
})


/**
 * 默认暴露安装全局挂载 api
 * 
 * 暴露一个 `install` 方法 
 * - 第一个参数是 Vue 构造器
 * - 第二个参数是一个可选的选项对象 `options`
 */
const install = function(Vue) {
    Vue.$h5api = Vue.prototype.$h5api = h5api

}


export {
    install as default
}