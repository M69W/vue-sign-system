/* 移动端签署*/
const H5Login = () => import('@/views/h5sign/login'); // 签署方式
const Blank = () => import('@/views/h5sign/blank'); // 签署方式
const H5SignType = () => import('@/views/h5sign/signType'); // 签署方式
const H5SignRule = () => import('@/views/h5sign/signRule'); // 签署规则
const H5SignChoose = () => import('@/views/h5sign/signChoose'); // 选择印章
const H5SignIndex = () => import('@/views/h5sign/signIndex'); // 快捷签署
const H5SignSuccess = () => import('@/views/h5sign/signSuccess'); // 签署成功
const H5SignReview = () => import('@/views/h5sign/review'); // 签署成功后预览效果
const h5SignContract = () => import('@/views/h5sign/h5SignContract'); // H5签署合同
const h5EnterpriseStep1 = () => import('@/views/h5sign/certification/enterpriseStep1'); // H5企业实名第一步
const h5Certification1 = () => import('@/views/h5sign/certification/step1'); // H5实名第一步
const h5Certification2 = () => import('@/views/h5sign/certification/step2'); // H5实名第二步
const h5Certification3 = () => import('@/views/h5sign/certification/step3'); // H5实名第三步
const h5HandSign = () => import('@/views/h5sign/handSign'); // H5手写签名
const h5UploadSeal = () => import('@/views/h5sign/uploadSeal'); // H5手写签名
const h5AuthWay = () => import('@/views/h5sign/certification/authWay'); // H5个人实名认证方式选择
const h5BankCardAuth = () => import('@/views/h5sign/certification/bankCardAuth'); // H5个人实名银行卡认证
const h5BankCardAuthRes = () => import('@/views/h5sign/certification/bankCardAuthRes'); // H5个人实名银行卡认证结果页面
const h5CodeLogin = () => import('@/views/h5sign/certification/codeLogin'); // 验证码登录


const h5signRoutes = [
    // FIXME: 简化跳转路由
    {
        path: '/h5',
        redirect: '/h5sign/login'
    },
    {
        path: '/h5sign/login',
        // redirect: '/h5wf/home',    // FIXME 临时重定向
        name: 'h5Login',
        component: H5Login,
        meta: {
            name: 'H5登录'
        }
    },
    {
        path: '/h5sign/blank',
        name: 'blank',
        component: Blank,
        meta: {
            name: 'blank'
        }
    },
    {
        path: '/h5sign/h5SignType',
        name: 'h5SignType',
        component: H5SignType,
        meta: {
            parentUrl: '/h5sign/h5SignType'
        }
    },
    {
        path: '/h5sign/h5SignRule',
        name: 'h5SignRule',
        component: H5SignRule,
        meta: {
            parentUrl: '/h5sign/h5SignRule'
        }
    },
    {
        path: '/h5sign/h5SignChoose',
        name: 'h5SignChoose',
        component: H5SignChoose,
        meta: {
            parentUrl: '/h5sign/h5SignChoose'
        }
    },
    {
        path: '/h5sign/h5SignIndex',
        name: 'h5SignIndex',
        component: H5SignIndex,
        meta: {
            parentUrl: '/h5sign/h5SignIndex'
        }
    },
    {
        path: '/h5sign/h5SignSuccess',
        name: 'h5SignSuccess',
        component: H5SignSuccess,
        meta: {
            parentUrl: '/h5sign/h5SignSuccess'
        }
    },
    {
        path: '/h5sign/H5SignReview',
        name: 'H5SignReview',
        component: H5SignReview,
        meta: {
            parentUrl: '/h5sign/h5SignReview'
        }
    },
    {
        path: '/h5sign/h5SignContract',
        name: 'h5SignContract',
        component: h5SignContract,
        meta: {
            parentUrl: '/h5sign/h5SignContract'
        }
    },
    {
        path: '/h5sign/h5EnterpriseStep1',
        name: 'h5EnterpriseStep1',
        component: h5EnterpriseStep1,
        meta: {
            parentUrl: '/h5sign/h5EnterpriseStep1'
        }
    },
    {
        path: '/h5sign/h5Certification1',
        name: 'h5Certification1',
        component: h5Certification1,
        meta: {
            parentUrl: '/h5sign/h5SignContract'
        }
    },
    {
        path: '/h5sign/h5Certification2',
        name: 'h5Certification2',
        component: h5Certification2,
        meta: {
            parentUrl: '/h5sign/h5SignContract'
        }
    },
    {
        path: '/h5sign/h5Certification3',
        name: 'h5Certification3',
        component: h5Certification3,
        meta: {
            parentUrl: '/h5sign/h5SignContract'
        }
    },
    {
        path: '/h5sign/h5HandSign',
        name: 'h5HandSign',
        component: h5HandSign,
        meta: {
            parentUrl: '/h5sign/h5SignContract'
        }
    },
    {
        path: '/h5sign/h5UploadSeal',
        name: 'h5UploadSeal',
        component: h5UploadSeal,
        meta: {
            parentUrl: '/h5sign/h5SignContract'
        }
    },
    {
        path: '/h5sign/h5AuthWay',
        name: 'h5AuthWay',
        component: h5AuthWay,
        meta: {
            parentUrl: '/h5sign/h5SignContract'
        }
    },
    {
        path: '/h5sign/h5BankCardAuth',
        name: 'h5BankCardAuth',
        component: h5BankCardAuth,
        meta: {
            parentUrl: '/h5sign/h5SignContract'
        }
    },
    {
        path: '/h5sign/h5BankCardAuthRes',
        name: 'h5BankCardAuthRes',
        component: h5BankCardAuthRes,
        meta: {
            parentUrl: '/h5sign/h5SignContract'
        }
    },
    {
        path: '/h5sign/h5CodeLogin',
        name: 'h5CodeLogin',
        component: h5CodeLogin,
        meta: {
            parentUrl: '/h5sign/h5SignContract'
        }
    },
]

export {
    h5signRoutes as default
}

// export default h5wfRoutes