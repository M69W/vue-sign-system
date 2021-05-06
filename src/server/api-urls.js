import config from '@/config';
import { isIE } from '@/utils';
let baseUrl;
const NODE_ENV = (process.env.NODE_ENV || 'development').trim();
const BASE_URL = NODE_ENV === 'development' ? config.envConfig.apiOrigin : '';
baseUrl = NODE_ENV === 'development' ? '' : '/sign';

const createFullApis = (baseUrl, apis) => {
    Object.keys(apis).map((key) => {
        apis[key] = baseUrl + apis[key];
    });
};
const readUkey =
    NODE_ENV === 'development'
        ? 'ukeyApi'
        : window.location.protocol === 'http:'
            ? 'http://127.0.0.1:9826'
            : isIE()
                ? 'https://127.0.0.1:9825'
                : 'http://127.0.0.1:9826';

const apis = {
    // 账号相关
    // login: baseUrl + '/admin/login', // 签章系统后台管理员登录
    // loginOut: baseUrl + '/admin/loginOut', // 签章系统后台管理员退出
    login: baseUrl + '/user/loginByUserNameAndPwd', // 签章系统前台用户登录
    loginOut: baseUrl + '/user/loginOut', // 签章系统前台用户退出
    getValicode: baseUrl + '/user/getValicode', // 获取登录的验证码
    getSysDefaultConfig: baseUrl + '/user/getSysDefaultConfig', // 获取后台配置的系统默认信息
    // 权限相关
    getUserMenuTree: baseUrl + '/user/getUserMenuTree', // 用户登录后获取菜单树结构
    // 签章验证
    queryDocumetnByValityCode:
        baseUrl + '/document/api/queryDocumetnByValityCode', // v1.1.0_验证码验证签章
    queryDocumetnByValityCodeNew: baseUrl + '/verify/sign/verify/code', // sprint4验证码验证签章
    downloadDocument: baseUrl + '/document/api/downloadDocument', // 根据文文件编码下载文档
    fileVality: baseUrl + '/verify/sign/verify/electronics/file', // v1.1.0_电子文档验证签章

    // 物理印章
    // ------------------------------------------------------------------
    urlGetPhysicalSealList: baseUrl + '/physicalSeal/getPhysicalSealList', // 获取物理印章列表
    urlGetPhysicalSealLogList: baseUrl + '/physicalSeal/getPhysicalSealLogList', // 获取物理印章列表
    urlAddPhysicalSeal: baseUrl + '/physicalSeal/addPhysicalSeal', // 添加物理印章
    urlUpdatePhysicalSeal: baseUrl + '/physicalSeal/updatePhysicalSeal', // 更新物理印章
    urlDeletePhysicalSeal: baseUrl + '/physicalSeal/deletePhysicalSeal', // 删除物理印章 `{id}`
    urlUsePhysicalSeal: baseUrl + '/physicalSeal/usePhysicalSeal', // 领用物理印章
    urlBackPhysicalSeal: baseUrl + '/physicalSeal/backPhysicalSeal', // 归还物理印章
    urlOutputPhysicalSealSamples:
        baseUrl + '/physicalSeal/downloadPhysicalSealExeclSamples', // 下载物理印章 excel
    urlImportPhysicalSealSamples:
        baseUrl + '/physicalSeal/physicalSealBatchImport', // 上传物理印章 excel

    // ------------------------------------------------------------------

    /* 文档管理 */
    queryDocumentList: baseUrl + '/document/api/queryDocumentList', // 查询文档列表 (后台sp3改动了接口地址，sp2用的是下面的接口地址)
    queryDocumentListFileCenter: baseUrl + '/file/queryFile', // 查询单位下的文档列表 （文档管理模块）
    pageUserListSealInfo: baseUrl + '/seal/pageUserListSealInfo', // 文件签署时查看印章列表(根据数据权限显示
    // 模板管理
    getTemplateList: baseUrl + '/signSysTemplate/getTemplateList', // 模板管理列表接口
    addAppBackInfoTmp: baseUrl + '/signSysTemplate/addAppBackInfo', // 模板添加并返回模板信息接口
    deleteTemplate: baseUrl + '/signSysTemplate/deleteTemplate', // 模板删除接口
    getTemplate: baseUrl + '/signSysTemplate/getTemplate', // 模板详情接口
    updateTemplate: baseUrl + '/signSysTemplate/updateTemplate', // 模板更新接口
    genTemplate: baseUrl + '/signSysTemplate/genTemplate', // 生成模板接口
    importWord: baseUrl + '/signSysTemplate/importWord', // 导入word V1.2.0
    addTemplate: baseUrl + '/signSysTemplate/addTemplate', // 模板添加接口
    getTemplateM: baseUrl + '/signSysTemplate/getTemplateM', // 模板详情接口-返回控件
    addFilefromTemplate: baseUrl + '/signSysTemplate/fromTemplate', // 从模板引入文件
    // 查询角色
    getAllRole: baseUrl + '/role/getAllRole', // 查询所有角色
    // 前台——我的账号
    info: baseUrl + '/user/account/info', // 我的账号-基本设置
    updatePassword: baseUrl + '/user/updatePassword/', // 我的账号-安全设置
    getValidateCode: baseUrl + '/user/sms/code', // 获取验证码
    verValidateCode: baseUrl + '/user/sms/validateCode', // 验证验证码
    bindPhone: baseUrl + '/user/binding/phone', // 绑定手机换号
    querySignPassword: baseUrl + '/user/querySignPassword', // 是否设置了签署密码
    modifySignPassword: baseUrl + '/user/modifySignPassword', // 修改签署密码
    setSignPassword: baseUrl + '/user/saveSignPassword', // 设置签署密码
    verifySignPassword: baseUrl + '/user/verifySignPassword', // 验证签署密码
    getEmailCode: baseUrl + '/user/mail/code', // 获取邮箱验证码
    validateEmailCode: baseUrl + '/user/mail/validateCode', // 验证邮箱验证码
    getInfoByUserName: baseUrl + '/user/userName', // 获取用户信息
    // 我的账号
    listByOrgId: baseUrl + '/credentials/listByOrgId', // 根据组织ID查找证书
    getDocList: baseUrl + '/document/getDocList', // 文件列表
    upload: baseUrl + '/document/api/conversionDocument', // 文件上传
    filecenterPrintFileRight: baseUrl + '/file/printFile', // 打印权限
    filecenterPrintFile: baseUrl + '/file/print', // 打印文件
    filePrint: baseUrl + '/document/print/fetch', // 文件打印
    filePrint2: baseUrl + '/document/print/fetch2', // 文件打印2
    getFilePrintList: baseUrl + '/document/print/getFilePrintList', // 文件打印日志列表
    // queryDocumentDet: baseUrl + '/document/api/queryDocumentDetail', // 查询文档详情
    queryDocumentDet: baseUrl + '/file/viewFile', // 查询文档详情
    vertifyFile: baseUrl + '/verify/sign/file', // 加签验真
    downloadSignDoc: baseUrl + '/document/downloadSignDoc', // 下载文件
    judgePosition: baseUrl + '/verify/judgePosition', // v1.1.0_判断签章处是否空白
    querySignLog: baseUrl + '/document/api/querySignLog', // 根据文档编码查询签署日志
    del: baseUrl + '/file/delStatus', // 文件删除
    getApplicationList: baseUrl + '/sysApplication/getApplicationList', // TODO 应用管理列表接口
    addAppBackInfo: baseUrl + '/sysApplication/addAppBackInfo', // 应用添加并返回应用信息接口
    abledApp: baseUrl + '/sysApplication/abledApp', // 应用启用/禁用接口
    deleteApplication: baseUrl + '/sysApplication/deleteApplication', // 应用删除接口
    fileCodeGetPic: baseUrl + '/document/fetch/getPic', // 文件CODE转图片，输出图片CODE列表
    fetch: baseUrl + '/document/scan/page', // 图片在线预览
    pageListSealInfo: baseUrl + '/seal/pageListSealInfo', // 查询单位下的印章列表
    totalPage: baseUrl + '/document/fileCode/page/total', // 查询文件总页数
    pageSingle: baseUrl + '/document/fetch/page', // 查询文件图片单页
    singleCoordBatchSign: baseUrl + '/fast/singleCoordBatchSign', // 个人/企业快捷签-单文件多页坐标签章接口
    singlePerforationCoordSign: baseUrl + '/fast/singlePerforationCoordSign', // 个人/企业快捷签-单文件骑缝坐标签章接口
    singleSign: baseUrl + '/fast/singleSign', // 个人/企业快捷签-单文件单页单签章接口
    singlePerforationCoordHalfSign:
        baseUrl + '/fast/singlePerforationCoordHalfSign', // 个人/企业快捷签-连页单签章接口
    createToken: baseUrl + '/auth/createToken', // createToken
    getPicSize: baseUrl + '/document/fetch/getPicSize', // 获取文件相关信息
    getFileBinary: baseUrl + '/document/fetch', // 获取文件流
    uKeySign: baseUrl + '/fast/uKeySign', // 保存ukey签署文件到后台
    // 打印分配
    addPrintAuthUser: baseUrl + '/printAuthUser/addPrintAuthUser', // 打印分配 v1.2.0
    addPrintAuthUser2: baseUrl + '/printAuthUser/addPrintAuthUser2', // 添加打印分配 v1.2.0
    delPrintAuthList: baseUrl + '/printAuthUser/delPrintAuthList', // 删除已分配对象 v1.2.0
    getPrintAuthList: baseUrl + '/printAuthUser/getPrintAuthList', // 获取已分配对象 v1.2.0
    getPrintAuthList2: baseUrl + '/printAuthUser/getPrintAuthList2', // 获取已分配对象y与次数 v1.2.0
    // 菜单管理
    // 根据method不同分为： 获取 "get" , 新增  "post" , 更新 "put"
    // '/menu/{id}'  删除 'delete' , 菜单详细信息 'get'
    menu: baseUrl + '/menu',

    // 单位管理 -> 印章管理 -> 印章权限管理
    getAllUser: baseUrl + '/enterprise/getAllUserInfoByEnterpriseId', // 查询单位下的所有成员列表
    getSealAuth: baseUrl + '/userSeal/query', // 获取拥有当前印章权限的所有用户
    bindSealToUser: baseUrl + '/userSeal/bind', // 将印章权限分配给用户
    getAllUserInfoByEnterpriseId:
        baseUrl + '/enterprise/getAllUserInfoByEnterpriseId', // 查询单位下的所有成员列表
    // 单位管理 -> 印章管理 -> 导入ukey印章
    importUkeySeal: baseUrl + '/seal/uk/save', // 导入UKEY印章
    editUkeySeal: baseUrl + '/seal/uk/update', // 编辑UKEY印章

    sunshineUpload: baseUrl + '/file/upload', // 文件上传
    sunshineDelete: baseUrl + '/file/delete', // 文件删除
    sunshineReUpload: baseUrl + '/file/reUpload', // 重新上传
    sunshineSignDomain: baseUrl + '/file/signDomain', // 固定位置盖章
    sunshineInitiateSign: baseUrl + '/file/initiateSign', // 发起签署
    sunshineSign: baseUrl + '/file/sign', // 签署步骤
    sunshineQueryListAdminUser: baseUrl + '/admin/queryListAdminUser', // 查询用户

    // ------------------
    // 获取审批流程列表
    urlGetProcessInfoList: baseUrl + '/process/manage/getProcessInfoList',

    // -------------------

    // 合同管理
    queryContract: baseUrl + '/contract/queryContract', // 查询合同列表
    delContractFile: baseUrl + '/contract/delete', // 发起合同--删除文件
    initiateContract: baseUrl + '/contract/initiateContract', // 发起合同---仅他人签署
    viewContract: baseUrl + '/contract/viewContract', // 查看合同
    delContract: baseUrl + '/contract/delContract', // 删除合同
    printContract: baseUrl + '/contract/printContract', // 查看合同
    allUserContract: baseUrl + '/contract/allUserContract', // 获取合同相关人
    downloadContract: baseUrl + '/contract/downloadContract', // 下载合同
    getNodeTree: baseUrl + '/enterprise/getNodeTree', // 获取组织结构树
    pageListUserInfoByNodeId: baseUrl + '/enterprise/pageListUserInfoByNodeId', // 查询所选节点下的用户列表
    pageListUserInfoByNodeId2:
        baseUrl + '/enterprise/pageListUserInfoByNodeId2', // 查询所选节点下的用户列表
    userInfoByNodeId: baseUrl + '/enterprise/userInfoByNodeId', // 查询用户
    revokeContract: baseUrl + '/contract/revokeContract', // 撤销合同
    downloadBatchImport: baseUrl + '/contract/downloadBatchImport', // 下载批量导入模板
    restartContract: baseUrl + '/contract/restartContract', // 重新/继续发起合同--获取合同信息
    uploadOldFile: baseUrl + '/contract/uploadOldFile', // 重新发起合同旧文件处理
    draftContract: baseUrl + '/contract/draftContract', // 存合同草稿
    initiateSignContract: baseUrl + '/contract/initiateSignContract', // 发起并签署合同
    urgeContract: baseUrl + '/contract/urgeContract', // 催签合同
    urgePerson: baseUrl + '/contract/urgePerson', // 单独催签
    signContractFile: baseUrl + '/contract/signContractFile', // 获取签署合同信息
    signDomain: baseUrl + '/contract/signDomain', // 获取签名域
    signContract: baseUrl + '/contract/signContract', // 签署合同
    exceptionD: baseUrl + '/contract/exceptionD', // 异常数据下载
    rejectContract: baseUrl + '/contract/rejectContract', // 拒签
    contractVerify: baseUrl + '/verify/sign/verify/qrCode', // 合同二维码验真
    codeVerify: baseUrl + '/verify/sign/verify/code', // 合同二维码验真
    printSet: baseUrl + '/document/print/printSummary', // 打印设置
    contractUseSeal: baseUrl + '/contract/contractUseSeal', // 申请用印
    fileUseSeal: baseUrl + '/file/fileUseSeal', // 申请用印 （新接口）
    restartFile: baseUrl + '/file/restartFile', // 重新发起

    // 文件下载服务 v1.2.0
    fileDownload: baseUrl + '/file/downloadFile', // 文件下载
    getSignConfig: baseUrl + '/signConfig/getSignConfig', // 获取签章配置详情接口 V1.1.0

    // 统计报表
    signLogList: baseUrl + '/fast/signLog', // 签章日志列表
    operateLogList: baseUrl + '/contract/getCompactLogList', // 操作日志列表

    // License 授权
    getMachineCode: baseUrl + '/verify/getMachineCode', // 获取机器码 V1.2.0
    licence: baseUrl + '/verify/licence', // 注册 或更新 Licence V1.2.0

    // 白鹤--用印申请
    getSealList: baseUrl + '/sealManager/getSealList', // 获取印章列表
    getUseSealList: baseUrl + '/sealManager/getUseSealList', // 获取申请用印列表
    addUseSeal: baseUrl + '/sealManager/addUseSeal', // 申请用印
    deleteUseSeal: baseUrl + '/sealManager/deleteUseSeal', // 删除用印申请
    downloadUseSeal: baseUrl + '/sealManager/down', // 下载用印申请文件
    getFilePrintInfoList: baseUrl + '/sealManager/getFilePrintInfoList', // 获取用印申请打印文件列表
    printUseSealFiles: baseUrl + '/sealManager/fetch', // 打印用印申请文件
    stampRecordApplyList: baseUrl + '/sealManager/stampRecordApplyList', // v1.2.2_白鹤 用印记录
    applyStampRecordList: baseUrl + '/sealManager/applyStampRecordList', // v1.2.2_白鹤 用印日志
    fetchImage: baseUrl + '/sealManager/fetchImage', // v1.2.2_白鹤 盖章图片

    // 合同模板
    saveContractTemplate: baseUrl + '/contract/template/save', // 添加合同模板
    editContractTemplate: baseUrl + '/contract/template/edit/save', // 编辑保存
    contractTemplateDetail: baseUrl + '/contract/template/detail', // 合同模板详情
    contractTemplateList:
        baseUrl + '/contract/template/getContractTemplateList', // 合同模板列表
    delContractTemplate: baseUrl + '/contract/template/delContractTemplate', // 删除合同模板
    signByTemplate: baseUrl + '/contract/template/signByTemplate', // 合同模板签章

    // 文件本地上传模板
    editFileTemplate: baseUrl + '/fileTemplate/edit/save', // 文件模板编辑
    addFileTemplate: baseUrl + '/fileTemplate/add', // 文件模板添加
    fileTemplateDetail: baseUrl + '/fileTemplate/detail', // 文件模板详情
    useFileTemplate: baseUrl + '/fileTemplate/use', // 文件模板使用
    fileTemplateList: baseUrl + '/fileTemplate/list', // 文件模板列表

    // v1.3.0 文件管理
    signFileDetail: baseUrl + '/file/signFileDetail', // 签发文件详情
    signFile: baseUrl + '/file/signFile', // 签署签发文件
    initiateSignFile: baseUrl + '/file/initiateContractSign', // 发起并签署文件
    initiateFile: baseUrl + '/file/initiateContract', // 发起文件
    fileUploadOldFile: baseUrl + '/file/uploadOldFile', // 文件管理重新发起上次旧文件
    rejectFile: baseUrl + '/file/reject', // 拒签文件

    // 非系统用户签署接口(无token)
    noTokensignContractFile: baseUrl + '/noToken/contract/signContractFile', // 获取签署合同信息(无token)
    noTokensignDomain: baseUrl + '/noToken/contract/signDomain', // 获取签名域(无token)
    noTokensignContract: baseUrl + '/noToken/contract/signContract', // 签署合同(无token)
    noTokensignFileDetail: baseUrl + '/noToken/file/signFileDetail', // 签发文件详情(无token)
    noTokensignFile: baseUrl + '/noToken/file/signFile', // 签署签发文件(无token)
    noTokengetPicSize: baseUrl + '/noToken/document/fetch/getPicSize', // 获取文件相关信息(无token)
    noTokenpageSingle: baseUrl + '/noToken/document/fetch/page', // 查询文件图片单页(无token)

    // 周大福二期接口
    getOrderInfo: baseUrl + '/ctfOrder/getOrderInfo', // 获取订单信息
    getOrderFile: baseUrl + '/ctfOrder/getOrderFile', // HTML生成PDF
    uploadBase64: baseUrl + '/document/upload/base64', // 签章完成上传base64

    // V 2.1.0
    // 打印
    listPrinterAppoint: baseUrl + '/printManage/listPrinterAppoint', // 打印机列表
    // 用户名和单位关联
    userNameAndEnterpriseName:
        baseUrl + '/enterprise/userNameAndEnterpriseName', // 用户名和单位关联

    // V 2.1.0
    // 实名认证
    liveDetective: baseUrl + '/certification/live/detective', // 活体检测
    businessLicenseInfo: baseUrl + '/certification/ocr/business/license/info', // 营业执照信息
    businessLicense: baseUrl + '/certification/validate/business/license', // 校验营业执照
    ocrIdCard: baseUrl + '/certification/ocr/id/card', // 上传身份证照
    validateID: baseUrl + '/certification/validate/id/card/info', // 身份证二要素校验
    // H5上传印章
    uploadSeal: baseUrl + '/seal/noToken/defined/file',
    noTokenDownloadContract: baseUrl + '/noToken/contract/downloadContract', // 下载合同(无token)

    // H5 工作流引擎
    // ------------------------------------------------------------------
    urlGetProcessList: baseUrl + '/process/user/list/startable', // 可发起的流程列表
    urlGetProcessFormList: baseUrl + '/process/user/init/form', // 预发起流程初始化表单
    urlStartProcess: baseUrl + '/process/user/start', // 提交发起

    urlGetProcessTodoList: baseUrl + '/process/user/list/my/todo', // 待处理 02
    urlGetProcessTodoListCount: baseUrl + '/process/user/count/my/todo', // 待处理条目数量
    urlGetProcessDoneList: baseUrl + '/process/user/list/my/audited', // 已处理 04
    urlGetProcessCopyList: baseUrl + '/process/user/list/carbon/copy/me', // 抄送我 03
    urlGetProcessSubmittedList: baseUrl + '/process/user/list/my/started', // 已提交 01

    urlGetProcessDetail: baseUrl + '/process/user/detail', // 获取流程详情

    urlAgreeOrDisagreeApprove: baseUrl + '/task/user/audit', // 同意/驳回操作

    urlCancelProcess: baseUrl + '/process/user/cancel', // 撤销
    urlInitRestartProcess: baseUrl + '/process/user/restart/init/form', // 重新发起初始化   `/{modelId}/{processInstanceId}`
    urlRestartProcess: baseUrl + '/process/user/restart', // 重新提交
    urlLetOtherApprove: baseUrl + '/task/user/turn/audit', // 转审
    urlTipQuickApprove: baseUrl + '/task/user/urge/todo', // 催办 `/{pid}`

    urlGetExpResult: baseUrl + '/process/user/expression/eval', // 获取计算结果
    urlUploadFile: baseUrl + '/process/user/upload/file', // 普通附件 - 文件上传 `/{modeId}`
    urlUploadImage: baseUrl + '/process/user/upload/image', // 普通附件 - 图片上传 `/{modeId}`
    urlUploadFileForSign: baseUrl + '/process/user/upload/file/for/sign', // 待签章附件上传

    urlGetPreviewData: baseUrl + '/process/user/preview/pdf', // 文件预览 `/{processInsId}`
    urlDownloadFile: baseUrl + '/process/user/download/file', // 文件下载预览 `/{pid}/{widgetId}`

    urlGetNodeTree: baseUrl + '/enterprise/getNodeTree', // 获取组织结构 `/{ enterpriseId }`
    urlGetNodeTreeUserInfo: baseUrl + '/enterprise/pageListUserInfoByNodeId2', // 获取组织结构成员信息

    urlGetProcesslinkList: baseUrl + '/process/user/list/relevancy', // 获取关联审批单列表
    urlUpdateProcesslinkedList: baseUrl + '/process/user/cache/checked/list', // 更新已选关联列表缓存
    urlGetLinkedProcessDetails: baseUrl + '/process/user/relevancy/detail', // 跳转至关联的表单

    urlGetProcessAuditorAndCC: baseUrl + '/process/user/auditor/cc/info', // 获取当前流程实例的审批人和抄送人信息

    urlGetSignPrepareData: baseUrl + '/process/user/prepare/data/for/sign', // 跳转去签章页面 `/{processInsId}`
    urlGetSealListData: baseUrl + '/process/user/list/seal', // 针对工件流的签章列表数据

    urlGetWechatToken: baseUrl + '/user/noToken/loginByEnterpriseWeChat', // 企业微信授权登录
    urlGetDownloadTempCode: baseUrl + '/process/user/download/temp/code', // 获取无 token 临时下载授权码
    urlDownloadContract: baseUrl + '/process/user/download/contract', // 使用临时授权码下载合同 `/{code}`
    // ------------------------------------------------------------------
    // v3.0.0
    applyPrint: baseUrl + '/print/apply', // 打印申请

    // sprint9 v3.1.0
    codeForLogin: baseUrl + '/user/noToken/sms/code', // 获取验证码用于登录
    loginBySmsValidateCode: baseUrl + '/user/noToken/loginBySmsValidateCode', // 短信验证码登录
    getSignSummary: baseUrl + '/ukey/getSignSummary', // 获取ukey签章摘要
    bigFileUkeySignReturnBase64: baseUrl + '/ukey/bigFileUkeySignReturnBase64', // 摘要签章
    fillContract: baseUrl + '/contract/fillContract', // 填写模板控件

    // sprint10 v 3.1.1
    uploadMoreFile: baseUrl + '/contract/uploadMoreFile', // 多文件上传
    reUpload: baseUrl + '/contract/reUpload', // 重新上传
    noTokenViewContract: baseUrl + '/noToken/contract/viewContract', // 无token获取合同信息
    printShortString: baseUrl + '/document/print/shortString', // html转短字符串

    // sprint12 v 3.3.0
    reportHomePage: baseUrl + '/report/homePage', // 首页统计数据

    // sprint13 v 3.3.1
    businessCenter: baseUrl + '/signSysBusiness/query', // 业务列表
    addOrder: baseUrl + '/signSysBusiness/billing', // 添加订单
    deleteOrder: baseUrl + '/signSysBusiness/deleteBill', // 删除订单
    orderDetail: baseUrl + '/signSysBusiness/detailBill', // 订单详情
    updateOrderStatus: baseUrl + '/signSysBusiness/updateBillStatus', // 更新订单状态
    updateOrder: baseUrl + '/signSysBusiness/updateBill', // 更新订单信息

    // sprint14 v 3.4.0
    validateBankcard: baseUrl + '/certification/validate/bankcard/info', // 银行卡校验
    faceRecognition: baseUrl + '/certification/face/recognition/signature', // 活体检测发起

    // sprint16 v 3.5.0
    checkNeedCert: baseUrl + '/identify/config/check/need/cert', // 校验是否需要实名认证
    checkNeedSave: baseUrl + '/identify/config/check/need/save', // 实名认证信息存档
    getEnterpriseListByUserInfo:
        baseUrl + '/enterprise/getEnterpriseListByUserInfo', // 查询用户相关的权限单位列表
    noTokenValidateCode: baseUrl + '/user/noToken/sms/validateCode', // 无token校验验证码

    // sprint18 v3.5.2
    applyContract: baseUrl + '/contract/applyContract', // 审批通过合同
    applyContractNo: baseUrl + '/contract/applyContractNo', // 合同审批不通过
    applyFile: baseUrl + '/file/applyFile', // 审批通过文件
    applyFileNo: baseUrl + '/file/applyNo', // 文件审批不通过

    // ----------------------------
    // SP20
    urlApplyInitiateContract: baseUrl + '/file/applyInitiateContract', // v3.5.4_待审批签发文件（文件）
    urlInitiateContractApply: baseUrl + '/contract/initiateContractApply', // v3.5.4_带审批发送（合同）

    urlGetProcessInsDetail: baseUrl + '/noForm/process/instance/detail', // 根据合同id查询审批详情
    urlAuditProcess: baseUrl + '/noForm/process/instance/audit' // 审批通过/驳回

    // ---------------------------
};
const ukeyApis = {
    //  UKEY导入
    checkUkeyList: '/login/checkKeyList', // 获取插入所有ukey列表
    //获取ukey信息 0-14
    /*
    CERT_NAME = 0,//证书名称
    CERT_OID,//证书OID
    CERT_TYPE,//KEY类型 0：创业KEY  1：ODC-KEY
    CERT_CODE,//印章编码
    CERT_HOLDER,//KEY公私属性 0：机构 1:个人
    CERT_VALID_START,//证书有效起始日期
    CERT_VALID_END,//证书有效结束日期
    CERT_OEM,//KEY的制造厂商（GDCA，NETC，SZCA,BJCA,UNKNOWCA）
    CERT_ORGCODE,//组织机构代码/社会统一信用代码
    CERT_PUBLICKEY,//加密证书公钥
    CERT_SIGN_SN,//签名证书序列号
    CERT_ENC_SN,//加密证书序列号
    CERT_GDCA_TRUSTID,//GDCA_信任服务号(GDCA的KEY才会返回)
    CERT_OWNER_JSON,//证书所有者信息（json对象的字符串）
    CERT_ISSUER_JSON,//证书颁发者信息（json对象的字符串）
    */
    getKeyCertInfo: '/login/getKeyCertInfo',
    checkKeyPin: '/login/loginKey', // 验证ukey的PIN
    signbydigestdata: '/login/signbydigestdata', // 获取摘要签名
    getUKeyVersion: '/getVersion', // 获取ukey版本号
    // ukey签署接口
    getKeyInfo: '/websign/getKeyInfo', // 获取取章模信息
    loginKey: '/websign/loginKey', // 校验pin吗
    signBylist: '/websign/signBylist', // ukey签
    signCheckUkeyList: '/websign/checkKeyList' // 获取插入所有ukey列表
};
const apiCloudSignBaseUrl = '/apiCloudSign';
const apiCloudSign = {
    // 云签api
    getAuthToken: '/auth/token', // 获取云签token
    identity: '/verification/interface/identity/card/information' // 个人两要素校验
};
createFullApis(BASE_URL, apis);
createFullApis(readUkey, ukeyApis);
createFullApis(apiCloudSignBaseUrl, apiCloudSign);

export const allApis = {
    apis,
    ukeyApis,
    apiCloudSign
};
