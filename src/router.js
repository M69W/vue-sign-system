import Vue from 'vue';
import Router from 'vue-router';
import Store from './store';
import { sessionStore } from '@/utils';
import auth from '@/server/auth';

/* 引入路由规则模块 */
import h5signRoutes from './router/h5sign'      // 移动端签署
import h5wfRoutes from './router/h5workflow'    // 引入 H5 工作流引擎

/* 登录 */
const Login = () => import('@/views/login/login');
/* 主页 */
const Home = () => import('@/views/home/index');
/*404*/
const ErrorPage = () => import('@/views/404');

// 物理印章 ///
const PhysicalSeal = () => import('@/views/physicalSeal/index')

/* 账号管理 */
const MyAccount = () => import('@/views/backManage/myAccount/index'); // 基本设置
const BaseSet = () => import('@/views/backManage/myAccount/baseSet'); // 基本设置
const SafeSet = () => import('@/views/backManage/myAccount/safeSet'); // 安全设置
const SignPassword = () => import('@/views/backManage/myAccount/signPassword'); // 签署密码

/* 工具包 */
const UkeyMake = () => import('@/views/toolsPack/ukeyMake'); // ukey制作
const UkeyGC = () => import('@/views/toolsPack/ukeyGC'); // ukey作废回收
const PwdReset = () => import('@/views/toolsPack/pwdReset'); // ukey作废回收
/* 文档中心 */
const FileManage = () => import('@/views/fileCenter/test'); // 文档管理
const QrToPhoneReal = () => import('@/views/fileCenter/qrToPhoneReal'); // 扫码验证
const FilePrint = () => import('@/views/fileCenter/filePrint'); // 文档打印
const FileTmpList = () => import('@/views/fileCenter/fileTmpList'); // 文档模板列表
const AddTemplate = () => import('@/views/fileCenter/addTemplate'); // 文档模板
const DetailTemplate = () => import('@/views/fileCenter/detailTemplate'); // 文档模板
const WordTemplate = () => import('@/views/fileCenter/wordTemplate'); // word文档模板
const UseWordTemplate = () => import('@/views/fileCenter/useWordTemplate'); // word文档模板
const CreateDocument = () => import('@/views/fileCenter/createDocument'); // 生成文档
const MyFile = () => import('@/views/fileCenter/myFile'); // 我的文档
const FileDetail = () => import('@/views/fileCenter/fileDetail'); // 文档详情
const CloudSing = () => import('@/views/fileCenter/cloudSing'); // 快速签署
const StartFile = () => import('@/views/fileCenter/startContract'); // 发起合同
const initFile = () => import('@/views/fileCenter/initFile'); // 发起合同

/* 开放平台 */
const MyContract = () => import('@/views/electronContract/myContract'); // 应用管理
const ApiDocument = () => import('@/views/electronContract/apiDocument'); // API文档

/* 签章验证*/
const ElecFileVertify = () => import('@/views/signVertify/elecFileVertify'); // 电子文档验证
const CodeVertify = () => import('@/views/signVertify/codeVertify'); // 验证码验证

/* 合同管理 */
const contractMgt = () => import('@/views/contractMgt/index'); // 合同管理
const contractTemplate = () => import('@/views/contractMgt/contractTemplate'); // 合同模板
const startContract = () => import('@/views/contractMgt/index/startContract'); // 发起合同
const newContractStep1 = () =>
    import('@/views/contractMgt/index/components/newContractStep1'); // 发起合同第一步
const newContractStep2 = () =>
    import('@/views/contractMgt/index/components/newContractStep2'); // 发起合同第二步
const newContractStep3 = () =>
    import('@/views/contractMgt/index/components/newContractStep3'); // 发起合同第二步
const viewContract = () => import('@/views/contractMgt/index/viewContract'); // 查看合同详情
const signContract = () => import('@/views/contractMgt/index/signContract'); // 签署合同
const uploadTemplate = () =>
    import('@/views/contractMgt/contractTemplate/uploadTemplate'); // 上传合同模板
const wordTemplates = () => import('@/views/contractMgt/wordTemplate'); // 合同模板控件
const templateSign = () =>
    import('@/views/contractMgt/contractTemplate/templateSign'); // 合同模板签署
/* 统计报表 */
const signLog = () => import('@/views/statistical/signLog/signLog'); // 签章日志
const operateLog = () => import('@/views/statistical/operateLog'); // 操作日志
/* 物理用印（用印管理） */
const applySealUse = () => import('@/views/sealUseMgt/applySealUse'); // 用印申请列表
const applyUse = () => import('@/views/sealUseMgt/applySealUse/applyUse'); // 申请用印
const useLog = () => import('@/views/sealUseMgt/applySealUse/useLog'); // 用印记录
/* c++demo演示 */
const officeShow = () => import('@/views/demos/office'); // office
const pdfShow = () => import('@/views/demos/pdf'); // pdf
const formSign = () => import('@/views/demos/formSign'); // 表单签章
const webSign = () => import('@/views/demos/webSign'); // 表单签署页
const newFile = () => import('@/views/demos/newFile'); // 新建文档
const ofdShow = () => import('@/views/demos/ofdShow'); // 新建文档
/* 周大福二期 */
const zhoudafu = () => import('@/views/zhoudafu');
const middle = () => import('@/views/zhoudafu/middle');
/* 首页 */
const homePage = () => import('@/views/homePage');
/* 业务管理 */
const businessMgt = () => import('@/views/businessCenter/businessMgt');
const addOrder = () => import('@/views/businessCenter/addOrder'); // 添加/编辑订单
const businessSign = () => import('@/views/businessCenter/businessSign'); // 业务签章

// const adobePrint = () =>
//     import('@/views/contractMgt/index/components/adobePrint');

let routes = [
    {
        path: '/',
        redirect: '/login'
    },
    // 用户
    {
        path: '/login',
        // redirect: '/h5',  // FIXME 临时重定向路由
        name: 'login',
        component: Login,
        meta: {
            name: '登录'
        }
    },
    {
        path: '/ctfSign',
        name: 'zhoudafu',
        component: zhoudafu,
        meta: {
            name: 'zhoudafu'
        }
    },
    {
        path: '/home',
        component: Home,
        redirect: '/contractMgt/index',
        children: [
            // 物理印章 ///
            {
                path: '/physicalseal',
                name: 'pysicalseal',
                component: PhysicalSeal,
                meta: {
                    parentUrl: '/physicalseal'
                }
            },
            {
                path: '/demos/office',
                name: 'office-demo',
                component: officeShow,
                meta: {
                    parentUrl: '/demos/office'
                }
            },
            {
                path: '/demos/pdf',
                name: 'pdf-demo',
                component: pdfShow,
                meta: {
                    parentUrl: '/demos/pdf'
                }
            },
            {
                path: '/demos/formSign',
                name: 'formSign',
                component: formSign,
                meta: {
                    parentUrl: '/demos/formSign'
                }
            },
            {
                path: '/demos/webSign',
                name: 'webSign',
                component: webSign,
                meta: {
                    parentUrl: '/demos/formSign'
                }
            },
            {
                path: '/demos/newFile',
                name: 'newFile',
                component: newFile,
                meta: {
                    parentUrl: '/demos/formSign'
                }
            },
            {
                path: '/demos/ofd',
                name: 'ofdShow',
                component: ofdShow,
                meta: {
                    parentUrl: '/demos/ofd'
                }
            },
            {
                path: '/backManage/MyAccount',
                name: 'myAccount',
                component: MyAccount,
                redirect: '/backManage/myAccount/baseSet',
                children: [
                    {
                        path: 'BaseSet',
                        name: 'baseSet',
                        component: BaseSet,
                        meta: {
                            parentUrl: '/backManage/myAccount'
                        }
                    },
                    {
                        path: 'SafeSet',
                        name: 'safeSet',
                        component: SafeSet,
                        meta: {
                            parentUrl: '/backManage/myAccount'
                        }
                    },
                    {
                        path: 'SignPassword',
                        name: 'signPassword',
                        component: SignPassword,
                        meta: {
                            parentUrl: '/backManage/myAccount'
                        }
                    }
                ]
            },
            {
                path: '/toolsPack/UkeyMake',
                name: 'ukeyMake',
                component: UkeyMake,
                meta: {
                    parentUrl: '/toolsPack/ukeyMake'
                }
            },
            {
                path: '/toolsPack/UkeyGC',
                name: 'ukeyGC',
                component: UkeyGC,
                meta: {
                    parentUrl: '/toolsPack/ukeyGC'
                }
            },
            {
                path: '/toolsPack/PwdReset',
                name: 'pwdReset',
                component: PwdReset,
                meta: {
                    parentUrl: '/toolsPack/pwdReset'
                }
            },
            {
                path: '/fileCenter/fileManage',
                name: 'fileManage',
                component: FileManage,
                meta: {
                    parentUrl: '/fileCenter/fileManage'
                }
            },
            {
                path: '/fileCenter/fileDetail',
                name: 'fileDetail',
                component: FileDetail,
                meta: {
                    parentUrl: '/fileCenter/fileManage',
                    scrollId: 'fileDetail' // 监听滚动事件id
                }
            },
            {
                path: '/fileCenter/CloudSing',
                name: 'cloudSing',
                component: CloudSing,
                meta: {
                    parentUrl: '/fileCenter/fileManage'
                }
            },
            {
                path: '/fileCenter/StartContract',
                name: 'startFile',
                component: StartFile,
                meta: {
                    parentUrl: '/fileCenter/fileManage'
                }
            },
            {
                path: '/fileCenter/initFile',
                name: 'initFile',
                component: initFile,
                meta: {
                    parentUrl: '/fileCenter/fileManage'
                }
            },
            {
                path: '/fileCenter/FilePrint',
                name: 'filePrint',
                component: FilePrint,
                meta: {
                    parentUrl: '/fileCenter/filePrint'
                }
            },
            {
                path: '/fileCenter/fileTmpList',
                name: 'fileTmpList',
                component: FileTmpList,
                meta: {
                    parentUrl: '/fileCenter/fileTmpList'
                }
            },
            {
                path: '/fileCenter/addTemplate',
                name: 'addTemplate',
                component: AddTemplate,
                meta: {
                    parentUrl: '/fileCenter/fileTmpList'
                }
            },
            {
                path: '/fileCenter/detailTemplate',
                name: 'detailTemplate',
                component: DetailTemplate,
                meta: {
                    parentUrl: '/fileCenter/fileTmpList'
                }
            },
            {
                path: '/fileCenter/wordTemplate',
                name: 'wordTemplate',
                component: WordTemplate,
                meta: {
                    parentUrl: '/fileCenter/fileTmpList',
                    scrollId: 'wordTemplate'
                }
            },
            {
                path: '/fileCenter/useWordTemplate',
                name: 'useWordTemplate',
                component: UseWordTemplate,
                meta: {
                    parentUrl: '/fileCenter/fileTmpList',
                    scrollId: 'useWordTemplate'
                }
            },
            {
                path: '/fileCenter/createDocument',
                name: 'createDocument',
                component: CreateDocument,
                meta: {
                    parentUrl: '/fileCenter/fileTmpList'
                }
            },
            {
                path: '/fileCenter/MyFile',
                name: 'myFile',
                component: MyFile,
                meta: {
                    parentUrl: '/fileCenter/myFile'
                }
            },
            {
                path: '/electronContract/myContract',
                name: 'myContract',
                component: MyContract,
                meta: {
                    parentUrl: '/electronContract/myContract'
                }
            },
            {
                path: '/electronContract/apiDocument',
                name: 'apiDocument',
                component: ApiDocument,
                meta: {
                    parentUrl: '/electronContract/apiDocument'
                }
            },
            {
                path: '/signVertify/elecFileVertify',
                name: 'elecFileVertify',
                component: ElecFileVertify,
                meta: {
                    parentUrl: '/signVertify/elecFileVertify'
                }
            },
            {
                path: '/signVertify/codeVertify',
                name: 'codeVertify',
                component: CodeVertify,
                meta: {
                    parentUrl: '/signVertify/codeVertify'
                }
            },

            // TODO 主页跳转到这里
            {
                path: '/contractMgt/index',
                name: 'contractMgt',
                component: contractMgt,
                meta: {
                    parentUrl: '/contractMgt/index',
                    name: '合同管理',
                    premissionId: '613675885790232576' // 菜单对应的权限id
                }
            },
            {
                path: '/contractMgt/contractTemplate',
                name: 'contractTemplate',
                component: contractTemplate,
                meta: {
                    parentUrl: '/contractMgt/contractTemplate',
                    name: '合同模板',
                    premissionId: '613676023392763904' // 菜单对应的权限id
                }
            },
            {
                path: '/contractMgt/uploadTemplate',
                name: 'uploadTemplate',
                component: uploadTemplate,
                meta: {
                    parentUrl: '/contractMgt/contractTemplate',
                    name: '上传合同模板',
                    premissionId: '613676023392763904' // 菜单对应的权限id
                }
            },
            {
                path: '/contractMgt/wordTemplate',
                name: 'wordTemplates',
                component: wordTemplates,
                meta: {
                    parentUrl: '/contractMgt/contractTemplate',
                    name: '模板控件',
                    premissionId: '613676023392763904' // 菜单对应的权限id
                }
            },
            {
                path: '/fileCenter/uploadTemplate',
                name: 'fileTemplate',
                component: uploadTemplate,
                meta: {
                    parentUrl: '/fileCenter/fileTmpList',
                    name: '上传文件模板',
                    premissionId: '' // 菜单对应的权限id
                }
            },
            {
                path: '/fileCenter/fileTemplate',
                name: 'fileWordTemplates',
                component: wordTemplates,
                meta: {
                    parentUrl: '/fileCenter/fileTmpList',
                    name: '文件模板控件',
                    premissionId: '' // 菜单对应的权限id
                }
            },
            {
                path: '/contractMgt/templateSign',
                name: 'templateSign',
                component: templateSign,
                meta: {
                    parentUrl: '/contractMgt/contractTemplate',
                    name: '模板控件',
                    premissionId: '613676023392763904' // 菜单对应的权限id
                }
            },
            {
                path: '/fileCenter/templateSign',
                name: 'fileTemplateSign',
                component: templateSign,
                meta: {
                    parentUrl: '/fileCenter/fileTmpList',
                    name: 'file模板控件',
                    premissionId: '613676023392763904' // 菜单对应的权限id
                }
            },

            // TODO +签署
            {
                path: '/contractMgt/signContract',
                name: 'signContract',
                component: signContract,
                meta: {
                    parentUrl: '/contractMgt/index'
                }
            },
            // 文件签署
            {
                path: '/fileCenter/signFile',
                name: 'signFile',
                component: signContract,
                meta: {
                    parentUrl: '/fileCenter/fileManage'
                }
            },

            // TODO +发起合同 1 2 3
            {
                path: '/contractMgt/startContract',
                name: 'startContract',
                component: startContract,
                meta: {
                    parentUrl: '/contractMgt/index'
                },
                children: [
                    {
                        path: '/',
                        redirect: 'step1'
                    },
                    {
                        path: 'step1',
                        name: 'newContractStep1',
                        component: newContractStep1,
                        meta: { parentUrl: '/contractMgt/index' }
                    },
                    {
                        path: 'step2',
                        name: 'newContractStep2',
                        component: newContractStep2,
                        meta: { parentUrl: '/contractMgt/index' }
                    },
                    {
                        path: 'step3',
                        name: 'newContractStep3',
                        component: newContractStep3,
                        meta: { parentUrl: '/contractMgt/index' }
                    }
                ]
            },
            // 统计报表--签章日志
            {
                path: '/statistical/signLog',
                name: 'signLog',
                component: signLog,
                meta: {
                    parentUrl: '/statistical/signLog'
                }
            },
            // 统计报表--操作日志
            {
                path: '/statistical/operateLog',
                name: 'operateLog',
                component: operateLog,
                meta: {
                    parentUrl: '/statistical/operateLog'
                }
            },
            // 物理用印--用印申请列表
            {
                path: '/applySealUse/applyUse',
                name: 'applyUse',
                component: applyUse,
                meta: {
                    parentUrl: '/applySealUse/index'
                }
            },
            // 物理用印--用印申请
            {
                path: '/applySealUse/index',
                name: 'applySealUse',
                component: applySealUse,
                meta: {
                    parentUrl: '/applySealUse/index'
                }
            },
            {
                path: '/applySealUse/useLog',
                name: 'useLog',
                component: useLog,
                meta: {
                    parentUrl: '/applySealUse/useLog'
                }
            },
            {
                path: '/homePage/index',
                name: 'homePage',
                component: homePage,
                meta: {
                    parentUrl: '/homePage/index'
                }
            },
            {
                path: '/businessCenter/businessMgt',
                name: 'businessMgt',
                component: businessMgt,
                meta: {
                    parentUrl: '/businessCenter/businessMgt'
                }
            },
            {
                path: '/businessCenter/addOrder',
                name: 'addOrder',
                component: addOrder,
                meta: {
                    parentUrl: '/businessCenter/businessMgt'
                }
            },
            {
                path: '/businessCenter/businessSign',
                name: 'businessSign',
                component: businessSign,
                meta: {
                    parentUrl: '/businessCenter/businessMgt'
                }
            },
        ]
    },
    {
        path: '/contractMgt/viewContract',
        name: 'viewContract',
        component: viewContract,
        meta: {
            parentUrl: '/contractMgt/index'
        }
    },
    // {
    //     path: '/adobePrint',
    //     name: 'adobePrint',
    //     component: adobePrint,
    //     meta: {
    //         parentUrl: '/contractMgt/index'
    //     }
    // },
    {
        path: '/fileCenter/qrToPhoneReal',
        name: 'qrToPhoneReal',
        component: QrToPhoneReal,
        meta: {
            parentUrl: '/fileCenter/fileManage'
        }
    },
    {
        path: '/middle',
        name: 'middle',
        component: middle,
        meta: {
            parentUrl: '/middle'
        }
    },
    {
        path: '*',
        component: ErrorPage,
        name: 'errorPage',
        meta: {
            name: '404'
        }
    }
]

// 将引入的 H5 路由规则注入
routes = [...h5signRoutes, ...h5wfRoutes, ...routes]

Vue.use(Router);

let router = new Router({
    mode: 'hash',
    base: process.env.BASE_URL,
    routes,
    scrollBehavior(to, from, savedPosition) {
        if (savedPosition) {
            return savedPosition;
        } else {
            return {
                x: 0,
                y: 0
            };
        }
    }
});
let whiteMap = [
    '/',
    '/login',
    '/h5sign/login',
    '/h5sign/blank',
    '/404',
    '/fileCenter/qrToPhoneReal',
    '/h5sign/h5SignType',
    '/h5sign/h5SignRule',
    '/h5sign/h5SignChoose',
    '/h5sign/h5SignIndex',
    '/h5sign/h5SignSuccess',
    '/h5sign/h5HandSign',
    '/h5sign/h5UploadSeal',
    '/h5sign/h5SignContract',
    '/h5sign/h5EnterpriseStep1',
    '/h5sign/h5Certification1',
    '/h5sign/h5Certification2',
    '/h5sign/h5Certification3',
    '/h5sign/h5AuthWay',
    '/h5sign/h5BankCardAuth',
    '/h5sign/h5BankCardAuthRes',
    '/h5sign/h5CodeLogin',
    '/ctfSign',
    '/middle',
    // H5 工作流引擎
    '/h5wf',
    '/h5wf/approve-apply',
    '/h5wf/approve-mine',
    '/h5wf/approve-submitted',
    '/h5wf/form',
    '/h5wf/detail',
]; // 不校验登录白名单
let startContractPath = [
    '/contractMgt/startContract/step1',
    '/contractMgt/startContract/step2',
    '/contractMgt/startContract/step3'
];
router.beforeEach(async (to, from, next) => {
    // console.log(to, from);
    // 解决点击当前菜单栏刷新
    // if (from.meta.parentUrl !== to.meta.parentUrl) {
    //     Store.state.isSameMenu -= 1;
    // }
    if (auth.isLogined() || whiteMap.includes(to.path)) {
        if (!startContractPath.includes(to.path)) {
            sessionStore.remove('contractForm');
        }
        next();
    } else {
        sessionStore.clear();
        auth.goLogin();
    }
});
export default router;
