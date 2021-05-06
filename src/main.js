import Vue from 'vue';
import App from './App.vue';
import router from './router';
import store from './store';
import './assets/css/common.css';
import './plugins/element.js';
import '@babel/polyfill';
import './assets/iconfont/iconfont.css';
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
import VueRouter from 'vue-router';
import { message } from '@/utils/resetMessage';
import VueQriously from 'vue-qriously';
// import moment from 'moment';
import permissionMap from '@/permission/permissionMap'; // 权限map
import '@/utils/updateMenuAndPermission'; // 权限map
import Authorized from '@/components/Authorized';
import * as filters from './filters';
import VueDND from 'awe-dnd'

// For H5 工作流引擎
import Vant from 'vant'
import 'vant/lib/index.css'
import 'vant/lib/icon/local.css'
import _h5api from './server/reset-api'
import _SharedUtils from './utils'

Vue.use(Vant)
Vue.use(_h5api)
Vue.use(_SharedUtils)

// if (!(['production', 'prod'].includes(process.env.NODE_ENV))) require('./mock')

Vue.use(VueRouter)
    .use(ElementUI)
    .use(VueQriously)
    .use(VueDND);
Vue.component('Authorized', Authorized);

Vue.config.productionTip = false;
Vue.prototype.$message = message;
// Vue.prototype.$moment = moment;
Vue.prototype.$permissionMap = permissionMap;

// 定义全局过滤器
Object.keys(filters).forEach((key) => {
    Vue.filter(key, filters[key]);
});

const updateUKeyDriveUrl =
    'https://qn1.i-yin.com.cn/signsys/zip/%E7%AD%BE%E7%AB%A0%E7%B3%BB%E7%BB%9F%E9%A9%B1%E5%8A%A8V3.4.2_%E6%A0%87%E5%87%86%E7%89%88.zip';
function downloadDriver() {
    const download = document.createElement('a');
    download.style.display = 'none';
    try {
        download.href = updateUKeyDriveUrl;
    } catch (e) {}
    document.body.appendChild(download);
    download.click();
    document.body.removeChild(download);
}
Vue.prototype.$downloadDriver = downloadDriver;
Vue.prototype.$updateUKeyDrive = function() {
    this.$confirm(
        '为了您更好的使用我们产品，请您更新最新驱动程序',
        '最新驱动',
        {
            confirmButtonText: '下载更新',
            cancelButtonText: '知道了',
            type: 'warning',
            customClass: 'self-icon icon-drive'
        }
    )
        .then(() => {
            downloadDriver();
        })
        .catch(() => {});
};

new Vue({
    router,
    store,
    render: (h) => h(App)
}).$mount('#app');
