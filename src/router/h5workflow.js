/* H5 工作流引擎 */
// 为了与 PC 区分，增加前缀 `H5wf`
// const H5SignType = () => import('@/views/h5sign/signType'); // 签署方式
const H5wfHome = () => import('@/views/h5workflow/Home.vue')
const H5wfForm = () => import('@/views/h5workflow/Form.vue')
const H5wfDetail = () => import('@/views/h5workflow/Detail.vue')

const ApproveApply = () => import('@/components/h5workflow/home/ApproveApply.vue')
const ApproveMine = () => import('@/components/h5workflow/home/ApproveMine.vue')
const ApproveSubmitted = () => import('@/components/h5workflow/home/ApproveSubmitted.vue')

const h5wfRoutes = [
    {
        path: '/h5wf',
        redirect: '/h5wf/approve-apply',
        name: 'h5wfHome',
        component: H5wfHome,

        children: [
            {
                path: 'approve-apply',
                name: 'ApproveApply',
                component: ApproveApply
            },
            {
                path: 'approve-mine',
                name: 'ApproveMine',
                component: ApproveMine
            },
            {
                path: 'approve-submitted',
                name: 'ApproveSubmitted',
                component: ApproveSubmitted
            },
        ]        

    },
    {
        path: '/h5wf/form',
        name: 'h5wfForm',
        component: H5wfForm

    },
    {
        path: '/h5wf/detail',
        name: 'h5wfDetail',
        component: H5wfDetail

    },
]

export {
    h5wfRoutes as default
}

// export default h5wfRoutes