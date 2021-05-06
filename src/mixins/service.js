const domain = '';
const baseUrl = '/soa-service/';

const debugLevel = 'dev';

var api = '';
// const ctx = "https://127.0.0.1:9825/";
let ctx = 'http://127.0.0.1:9826/';

let signUrl = '/compact/file/page?fileCode=a8c20fb7-2dc3-4341-8cb5-dcbe4da41a68&pageNo=1'
const UKeyDriveName = '';
const UKeyDriveSrc = '';

if (!!window.ActiveXObject || 'ActiveXObject' in window) {
    self.isIe = true;
    ctx = 'https://127.0.0.1:9825/';
}

if (debugLevel == 'dev') {
    api = '/api';
} else if (debugLevel == 'build') {
    api = '/api';
} else if (debugLevel == 'local') {
    api = '';
}

var commonAjaxSetting = {
    get: {
        dataType: 'json',
        cache: false,
        beforeSend: function(request) {
            request.setRequestHeader('Authorization', $.cookie('token'));
        }
    },
    post: {
        dataType: 'json',
        headers: {
            'Content-Type': 'application/json'
        },
        beforeSend: function(request) {
            request.setRequestHeader('Authorization', $.cookie('token'));
        },
        data: {},
        cache: false
    },
    put: {
        dataType: 'json',
        headers: {
            'Content-Type': 'application/json'
        },
        beforeSend: function(request) {
            request.setRequestHeader('Authorization', $.cookie('token'));
        },
        data: {},
        cache: false
    },
    delete: {
        dataType: 'json',
        headers: {
            'Content-Type': 'application/json'
        },
        beforeSend: function(request) {
            request.setRequestHeader('Authorization', $.cookie('token'));
        },
        data: {},
        cache: false
    },
    patch: {
        dataType: 'json',
        headers: {
            'Content-Type': 'application/json'
        },
        beforeSend: function(request) {
            request.setRequestHeader('Authorization', $.cookie('token'));
        },
        data: {},
        cache: false
    }
};

var ajaxCall = function(setting, type) {
    if (type === undefined) {
        type = 'get';
    }
    var sendData = commonAjaxSetting[type];
    sendData.type = type;
    if (
        sendData.headers &&
        sendData.headers['Content-Type'] == 'application/json'
    ) {
        setting.data = JSON.stringify(setting.data);
    }
    sendData = $.extend({}, sendData, setting);
    return $.ajax(sendData);
};
var ajaxUKeyCall = function(setting, type) {
    if (type === undefined) {
        type = 'get';
    }
    var sendData = { type: type, async: false, cache: false }; //ukey接口为同步
    sendData = $.extend({}, sendData, setting);
    return $.ajax(sendData);
};

const info = {
    defaultErrorMsg: '数据请求出错，请稍后重试',
    insertUsbkey: '请插入USB Key',
    loginExpire: '登录信息已过期，请重新登录',
    error500Msg: '你的服务开小差了，请稍后再试',
    error401Msg: '您没有访问该资源的权限'
};
export default {
    methods: {
        successCheckCode(ret) {
            if (ret.code === 401) {
                this.$message({
                    message: info.error401Msg,
                    type: 'warning',
                    duration: 1500
                });
                this.$router.replace('/errors');
                return false;
            } else if (
                ret.code === 1016 ||
                ret.code === 1014 ||
                ret.code === 1013
            ) {
                this.$message({
                    message: info.loginExpire,
                    type: 'warning',
                    duration: 1500
                });
                $.removeCookie('token', { path: '/', domain: this.$domain });
                $.removeCookie('userinfo', { path: '/', domain: this.$domain });
                $.removeCookie("sessionToken", { path: '/', domain: this.$domain });
                $.removeCookie("ukeylist", {path: "/", domain: this.$domain});
                this.$router.push('/login');
                return false;
            } else if (ret.code === 500) {
                this.$message({
                    message: info.error500Msg,
                    type: 'warning',
                    duration: 1500
                });
                return false;
            } else if (
                ret.code === 2052 ||
                ret.code === 2051 ||
                ret.code === 2050 ||
                ret.code === 2053
            ) {
                // 手绘签名错误码处理
                return true;
            } else if (ret.code !== 0) {
                this.$message({
                    message: ret.msg || info.defaultErrorMsg,
                    type: 'warning',
                    duration: 1500
                });
                return false;
            }
            return true;
        },
        successUKeyCheckCode(ret) {
            if (typeof ret == 'string') {
                ret = JSON.parse(ret);
            }
            let errMsg = '';
            if (ret.ret == 0) {
                return true;
            } else if (ret.ret == -1) {
                this.$updateUKeyDrive();
                return false;
            } else if (ret.ret == 106) {
                this.$message({
                    message: 'PIN码不正确',
                    type: 'warning',
                    duration: 1500
                });
                return false;
            } else {
                this.$message({
                    message: ret.errMsg,
                    type: 'warning',
                    duration: 1500
                });
                return false;
            }
        },
        successCheckCodeText(ret) {
            try {
                ret = JSON.parse(ret);
            } catch (error) {
                this.$message({
                    message: '接口异常，请稍后再试！',
                    type: 'warning',
                    duration: 1500
                });
                return false;
            }
            return ret;
        },
        ajaxCall(setting, type) {
            var xhr = ajaxCall(setting, type);
            xhr.fail((jqxhr, textStatus) => {
                if (textStatus != 'abort') {
                    this.$message({
                        message: info.defaultErrorMsg,
                        type: 'warning',
                        duration: 1500
                    });
                }
            });
            return xhr;
        },
        ajaxPassCall(setting, type) {
            var xhr = ajaxCall(setting, type);
            return xhr;
        },
        ajaxUKeyCall(setting, type) {
            var xhr = ajaxUKeyCall(setting, type);
            xhr.fail((jqxhr, textStatus) => {
                console.log('fail------' + jqxhr, textStatus);
                if (textStatus != 'abort') {
                    /*this.$message({
                        // message: "服务异常，请确认安装好驱动后重试",
                        message: "请您先安装/更新UKey驱动，以便正常使用系统",
                        type: "error",
                        duration: 1500
                    });*/
                    this.$updateUKeyDrive();
                }
            });
            return xhr;
        },
        //get时拼接参数的方法
        parseParams(obj) {
            let params = '?';
            for (let param in obj) {
                if (obj[param]) {
                    params +=
                        param + '=' + encodeURIComponent(obj[param]) + '&';
                }
            }
            return params.slice(0, params.length - 1);
        },
        //图片上传
        postFileImageUpload(dom, url, cbSuccess, cbError, percentVal) {
            $('#' + dom).ajaxSubmit({
                // url: domain + api + url,
                url: '/zuul' + url,
                type: 'post',
                // dataType: "json", /*设置返回值类型为文本*/
                ContentType: 'multipart/form-data',
                beforeSend: function(request) {
                    request.setRequestHeader(
                        'Authorization',
                        $.cookie('token')
                    );
                },
                uploadProgress: function(percentComplete) {
                    percentVal(percentComplete);
                },
                success: data => {
                    cbSuccess(data);
                },
                error: data => {
                    this.successCheckCodeText(data);
                    cbError(data);
                },
                complete: function() {}
            });
        },
        //图片上传
        postFileImageUpload2(dom, url, cbSuccess, cbError, percentVal) {
            $('#' + dom).ajaxSubmit({
                url: domain + api + url,
                type: 'post',
                // dataType: "json", /*设置返回值类型为文本*/
                ContentType: 'multipart/form-data',
                beforeSend: function(request) {
                    request.setRequestHeader(
                        'Authorization',
                        $.cookie('token')
                    );
                },
                //uploadProgress: function (percentComplete) {
                //    percentVal(percentComplete)
                //},
                success: data => {
                    cbSuccess(data);
                },
                error: data => {
                    this.successCheckCodeText(data);
                    cbError(data);
                },
                complete: function() {}
            });
        },
        // 模板添加接口
        addTemplate(data) {
            return this.ajaxCall(
                { url: domain + api + '/signSysTemplate/addTemplate', data: data },
                'post'
            );
        },
        // 模板保存接口
        insertTmp(data) {
            return this.ajaxCall(
                { url: domain + api + '/template/insert', data: data },
                'post'
            );
        },
        // 模板编辑接口
        updateTmp(data) {
            return this.ajaxCall(
                { url: domain + api + '/template/update', data: data },
                'post'
            )
        },
        // 获取文件相关信息
        getPicSize(fileCode) {
            return this.ajaxCall(
                { url: domain + api + '/document/fetch/getPicSize/' + fileCode },
                'get'
            )
        },
        // 查询文件图片单页
        pageSingle(fileCode, pageNumber) {
            return this.ajaxCall(
                { url:domain + api + '/compact/file/page' + fileCode + '/' + pageNumber },
                // { url: signUrl },
                'get'
            )
        },
        // 文件签署时查看印章列表(根据数据权限显示)
        pageUserListSealInfo() {
            return this.ajaxCall(
                { url: domain + api + '/seal/pageUserListSealInfo' },
                'post'
            )
        },
        // 权限判断
        checkPermission(url) {
            return this.ajaxCall(
                { url: domain + api + '/permission/valid?url=' + url },
                'post'
            );
        },
        // 获取权限map
        getPermissionMap() {
            return this.ajaxCall(
                { url: domain + api + '/permission/getMeanUrl' },
                'get'
            );
        },
        //账号密码登录
        userLogin(data) {
            return this.ajaxCall(
                { url: domain + api + '/user/login/normal', data: data },
                'post'
            );
        },
        //登出
        loginOut(data) {
            return this.ajaxCall(
                { url: domain + api + '/user/logout/normal', data: data },
                'post'
            );
        },
        //个人注册
        personRegister(data) {
            // return this.ajaxCall({url: domain + api + "/user/person/register", data: data}, 'post')
            // return this.ajaxCall({url: domain + api + "/register/account", data: data}, 'post')让
            return this.ajaxCall(
                { url: domain + api + '/user/person/register', data: data },
                'post'
            );
        },
        //企业注册
        enterpriseRegister(data) {
            return this.ajaxCall(
                {
                    url: domain + api + '/user/enterprise/register/email',
                    data: data
                },
                'post'
            );
        },
        //企业用户注册信息完善
        perfectInfo(data) {
            return this.ajaxCall(
                {
                    url: domain + api + '/user/enterprise/register/phone',
                    data: data
                },
                'post'
            );
        },
        //邮箱验证码
        emailCode(data) {
            return this.ajaxCall(
                {
                    url: domain + api + '/user/email/verification/code',
                    data: data
                },
                'post'
            );
        },
        //短信验证码
        smsCode(data) {
            return this.ajaxCall(
                {
                    url: domain + api + '/user/sms/verification/code',
                    data: data
                },
                'post'
            );
        },
        //企业ukey登录
        ukeyLogin(data) {
            return this.ajaxCall(
                { url: domain + api + '/user/login/ukey', data: data },
                'post'
            );
        },
        //个人ukey登录
        PersonUkeyLogin(data) {
            return this.ajaxCall(
                {
                    url: domain + api + '/user/person/ukey/login/init',
                    data: data
                },
                'post'
            );
        },
        //企业用户中心详情
        enterpriseDetail(data) {
            return this.ajaxCall(
                { url: domain + api + '/user/enterprise/details', data: data },
                'post'
            );
        },
        //个人用户中心详情
        personDetail(data) {
            return this.ajaxCall(
                { url: domain + api + '/user/person/details', data: data },
                'post'
            );
        },
        //添加云签名
        addCloudSign(data) {
            return this.ajaxCall(
                {
                    url: domain + api + '/seal/save/cloud/signature',
                    data: data
                },
                'post'
            );
        },
        //添加Ukey签名
        addUkeySign(data) {
            return this.ajaxCall(
                {
                    url: domain + api + '/seal/save/ukey/signature',
                    data: data
                },
                'post'
            );
        },
        //获取云签名列表
        getCouldSignList(pageNum, pageSize) {
            return this.ajaxCall(
                {
                    url:
                        domain +
                        api +
                        '/seal/signature/list/' +
                        pageNum +
                        '/' +
                        pageSize
                },
                'get'
            );
        },
        //根据权限获取签名、印章
        getSealSignListByRole(data) {
            return this.ajaxCall(
                {
                    url:
                        domain +
                        api +
                        '/user/role/findPageByeEnterpriseIdAndRoleId',
                    data: data
                },
                'get'
            );
        },
        //获取个人签名、印章
        getPersonSealSignList(data) {
            return this.ajaxCall(
                { url: domain + api + '/seal/findPageByePersonId', data: data },
                'get'
            );
        },
        // 合同状态
        signState(data) {
            return this.ajaxCall(
                { url: domain + api + '/compact/status/list/' + data },
                'get'
            );
        },
        // 合同列表
        getSignList(data) {
            return this.ajaxCall(
                {
                    url: domain + api + '/compact/page/info/' + data.userId,
                    data: data
                },
                'get'
            );
        },
        // 合同发起签约 下一步
        contractBasicNext(data) {
            return this.ajaxCall(
                { url: domain + api + '/compact/basic/info', data: data },
                'post'
            );
        },
        // 合同发起签约 下一步
        contractSignNext(data) {
            return this.ajaxCall(
                { url: domain + api + '/compact/sign/info', data: data },
                'post'
            );
        },
        // 合同签署 暂不签署
        contractTemporary(data) {
            return this.ajaxCall(
                {
                    url: domain + api + '/compact/signature/field/temporary',
                    data: data
                },
                'post'
            );
        },
        //联系人列表
        userList(pageNum, pageSize, data) {
            return this.ajaxCall(
                {
                    url:
                        domain +
                        api +
                        '/user-contacts/page/' +
                        pageNum +
                        '/' +
                        pageSize,
                    data: data
                },
                'get'
            );
        },
        //添加联系人
        addUser(data) {
            return this.ajaxCall(
                { url: domain + api + '/user-contacts/contact', data: data },
                'post'
            );
        },
        //修改联系人
        editUser(data) {
            return this.ajaxCall(
                { url: domain + api + '/user-contacts/change', data: data },
                'put'
            );
        },
        //删除联系人
        delUser(contactId) {
            return this.ajaxCall(
                { url: domain + api + '/user-contacts/contact/' + contactId },
                'delete'
            );
        },
        //实名认证
        realName(data) {
            return this.ajaxCall(
                {
                    // url: domain + api + "/user/enterprise/real-name",
                    url: domain + api + '/user/new/enterprise/real-name', //新实名认证企业生成二维码
                    data: data
                },
                'post'
            );
        },
        //编辑第一步
        editCompact(data) {
            return this.ajaxCall(
                { url: domain + api + '/compact/basic/info/detail/' + data },
                'get'
            );
        },
        // 合同详情
        detail(data) {
            return this.ajaxCall(
                {
                    url:
                        domain + api + '/compact/sign/field/info/detail/' + data
                },
                'get'
            );
        },
        // 合同详情 滚动加载
        saveSignPosition(data) {
            return this.ajaxCall(
                { url: domain + api + '/compact/signature/field', data: data },
                'post'
            );
        },
        //合同详情 3回到2
        editCompactSec(data) {
            return this.ajaxCall(
                {
                    url: domain + api + '/compact/signatory/info/detail/' + data
                },
                'get'
            );
        },
        //删除云签名
        deleteCouldSign(pictureId) {
            return this.ajaxCall(
                { url: domain + api + '/seal/' + pictureId },
                'delete'
            );
        },
        //上传云签名
        signupload(data) {
            return this.ajaxCall(
                { url: domain + api + '/seal/file/upload', data: data },
                'post'
            );
        },
        //获取印章详情
        signImgUrl(data) {
            return this.ajaxCall(
                {
                    url: domain + api + '/seal/pictrure/details/' + data,
                    async: false
                },
                'get'
            );
        },
        signDetail(compactId, userId) {
            return this.ajaxCall(
                {
                    url:
                        domain +
                        api +
                        '/compact/signature/detail/' +
                        compactId +
                        '/' +
                        userId
                },
                'get'
            );
        },
        signature(data) {
            return this.ajaxCall(
                { url: domain + api + '/compact/signature', data: data },
                'post'
            );
        },
        //删除合同
        deleteCompact(data) {
            return this.ajaxCall(
                {
                    url:
                        domain +
                        api +
                        '/compact/info/' +
                        data.compactId +
                        '/' +
                        data.userId
                },
                'delete'
            );
        },
        //订单列表
        orderList(pageNum, pageSize) {
            return this.ajaxCall(
                {
                    url:
                        domain + api + '/order/list/' + pageNum + '/' + pageSize
                },
                'get'
            );
        },
        //订单详情-企业
        orderDetailEnterprise(orderNum) {
            return this.ajaxCall(
                { url: domain + api + '/order/detail/enterprise/' + orderNum },
                'get'
            );
        },
        //订单详情-个人
        orderDetailPersonal(orderNum) {
            return this.ajaxCall(
                { url: domain + api + '/order/detail/personal/' + orderNum },
                'get'
            );
        },
        //取消订单
        cancelUkeyOrder(orderNum, orderType) {
            return this.ajaxCall(
                {
                    url:
                        domain +
                        api +
                        '/order/cancel/' +
                        orderNum +
                        '/' +
                        orderType
                },
                'put'
            );
        },
        //用户中心短信验证码检验
        checkSms(phone, code, data) {
            return this.ajaxCall(
                {
                    url:
                        domain +
                        api +
                        '/user/info/check-sign-pwd-sms-code/' +
                        phone +
                        '/' +
                        code,
                    data: data
                },
                'post'
            );
        },
        //设置、修改合同签署密码
        signPsd(data) {
            return this.ajaxCall(
                { url: domain + api + '/user/info/sign-pwd', data: data },
                'post'
            );
        },
        // 下载
        download(data) {
            return this.ajaxCall(
                { url: domain + api + '/compact/package/download', data: data },
                'post'
            );
        },
        //申请电子印章列表
        eSealList(pageNum, pageSize) {
            return this.ajaxCall(
                {
                    url:
                        domain +
                        api +
                        '/seal/manage/mySeal/list/' +
                        pageNum +
                        '/' +
                        pageSize,
                    headers: {
                        accountId: JSON.parse($.cookie('userinfo')).accountId
                    }
                },
                'get'
            );
        },
        //查询企业电子印章、签名列表
        getSealSignList(data) {
            return this.ajaxCall(
                {
                    url: domain + api + '/user/role/findPageByeEnterpriseId',
                    data: data
                },
                'get'
            );
        },
        //印章管理各项列表数量统计
        sealNavCount() {
            return this.ajaxCall(
                { url: domain + api + '/seal/manage/total' },
                'get'
            );
        },
        //印章信息列表
        sealInfoList(orderNo, pageNum, pageSize) {
            return this.ajaxCall(
                {
                    url:
                        domain +
                        api +
                        '/seal/enterprise/custom/info/list/' +
                        orderNo +
                        '/' +
                        pageNum +
                        '/' +
                        pageSize
                },
                'get'
            );
        },
        //创建ukey印章订单初始化
        orderInit(data) {
            return this.ajaxCall(
                {
                    url: domain + api + '/order/enterprise/base/init',
                    data: data
                },
                'post'
            );
        },
        //创建ukey签名订单初始化
        signOrderInit(data) {
            return this.ajaxCall(
                { url: domain + api + '/order/personal/base/init', data: data },
                'post'
            );
        },
        //获取省列表
        getProvince(data) {
            return this.ajaxCall(
                {
                    url:
                        domain +
                        api +
                        '/user/third-level-address/page/province',
                    data: data
                },
                'get'
            );
        },
        //获取市列表
        getCity(data) {
            return this.ajaxCall(
                {
                    url: domain + api + '/user/third-level-address/page/city',
                    data: data
                },
                'get'
            );
        },
        //获取区列表
        getDistrict(data) {
            return this.ajaxCall(
                {
                    url:
                        domain +
                        api +
                        '/user/third-level-address/page/district',
                    data: data
                },
                'get'
            );
        },
        //新增用户地址
        setAddress(data) {
            return this.ajaxCall(
                { url: domain + api + '/user/address/details', data: data },
                'post'
            );
        },
        //修改用户地址
        changeAddress(data) {
            return this.ajaxCall(
                { url: domain + api + '/user/address/details', data: data },
                'put'
            );
        },
        //获取用户地址
        getAddress(userAddressType, data) {
            return this.ajaxCall(
                {
                    url: domain + api + '/user/address/page/' + userAddressType,
                    data: data
                },
                'get'
            );
        },
        //申请电子印章删除章模信息
        deleteOrderSeal(sealId) {
            return this.ajaxCall(
                {
                    url: domain + api + '/seal/enterprise/custom/info/' + sealId
                },
                'delete'
            );
        },
        //新增个人ukey签名订单
        addPersonalUkeySign(data) {
            return this.ajaxCall(
                {
                    url: domain + api + '/seal/personal/custom/info',
                    data: data
                },
                'post'
            );
        },
        //新增企业印章订单
        addSeal(data) {
            return this.ajaxCall(
                {
                    url: domain + api + '/seal/enterprise/custom/info',
                    data: data
                },
                'post'
            );
        },
        //编辑企业印章
        editSeal(data) {
            return this.ajaxCall(
                {
                    url: domain + api + '/seal/enterprise/custom/info',
                    data: data
                },
                'put'
            );
        },
        //保存企业草稿订单
        saveDraftOrder(data) {
            return this.ajaxCall(
                { url: domain + api + '/order/draft/enterprise', data: data },
                'post'
            );
        },
        //保存个人ukey草稿订单
        savePersonDraftOrder(data) {
            return this.ajaxCall(
                { url: domain + api + '/order/draft/personal', data: data },
                'post'
            );
        },
        //修改草稿订单
        editDraftOrder(data) {
            return this.ajaxCall(
                { url: domain + api + '/order/draft/enterprise', data: data },
                'put'
            );
        },
        //提交订单
        submitOrder(data) {
            return this.ajaxCall(
                { url: domain + api + '/order/info/enterprise', data: data },
                'post'
            );
        },
        //个人ukey申请提交订单
        submitPersonOrder(data) {
            return this.ajaxCall(
                { url: domain + api + '/order/sub/personal', data: data },
                'put'
            );
        },
        //订单确认信息获取展示
        getOrderConfirm(orderNo, pageNum, pageSize) {
            return this.ajaxCall(
                {
                    url:
                        domain +
                        api +
                        '/order/confirm/info/enterprise/' +
                        orderNo +
                        '/' +
                        pageNum +
                        '/' +
                        pageSize
                },
                'get'
            );
        },
        //续期订单确认信息获取展示
        getRenewOrderConfirm(orderNo, pageNum, pageSize) {
            return this.ajaxCall(
                {
                    url:
                        domain +
                        api +
                        '/order/confirm/renewInfo/enterprise/' +
                        orderNo +
                        '/' +
                        pageNum +
                        '/' +
                        pageSize
                },
                'get'
            );
        },
        //获取微信支付码
        getWxPayCode(data) {
            return this.ajaxCall(
                { url: domain + api + '/payment/wx/create', data: data },
                'post'
            );
        },
        //获取微信支付结果
        getWxPayResult(paymentNo, data) {
            return this.ajaxCall(
                {
                    url: domain + api + '/payment/wx/payState/' + paymentNo,
                    data: data
                },
                'get'
            );
        },
        //获取支付宝支付页面
        getAliPayCode(data) {
            return this.ajaxCall(
                { url: domain + api + '/payment/alipay/create', data: data },
                'post'
            );
        },
        //获取支付宝支付结果
        getAliPayResult(paymentNo, data) {
            return this.ajaxCall(
                {
                    url:
                        domain +
                        api +
                        '/payment/getPaymentInfo?paymentNo=' +
                        paymentNo,
                    data: data
                },
                'get'
            );
        },
        //获取用户名称
        getUser(data) {
            return this.ajaxCall(
                {
                    url: domain + api + '/user/getUserByPhoneOrEmail',
                    data: data
                },
                'post'
            );
        },
        //通过Ukey初始化企业账号
        ukeyInitInfo(data) {
            return this.ajaxCall(
                {
                    url: domain + api + '/user/init/ukey/enterprise',
                    data: data
                },
                'post'
            );
        },
        //通过Ukey初始化个人账号
        ukeyInitPerson(data) {
            return this.ajaxCall(
                { url: domain + api + '/user/init/ukey/person', data: data },
                'post'
            );
        },
        compactMore(compactId) {
            return this.ajaxCall(
                {
                    url: domain + api + '/compact/info/more/detail/' + compactId
                },
                'get'
            );
        },
        //签署流程
        signOrder(compactId) {
            return this.ajaxCall(
                {
                    url:
                        domain + api + '/compact/signature/process/' + compactId
                },
                'get'
            );
        },
        //套餐列表
        getPackageList(pageNum, pageSize) {
            return this.ajaxCall(
                {
                    url:
                        domain +
                        api +
                        '/compact/sign-package/page/' +
                        pageNum +
                        '/' +
                        pageSize
                },
                'get'
            );
        },
        //购买套餐订单初始化
        packageInit(id) {
            return this.ajaxCall(
                {
                    url:
                        domain +
                        api +
                        '/order/package/details?signPackageId=' +
                        id
                },
                'post'
            );
        },
        //提交套餐订单
        subPackage(data) {
            return this.ajaxCall(
                { url: domain + api + '/order/package/details', data: data },
                'put'
            );
        },
        getCertificate(data) {
            return this.ajaxCall(
                {
                    url:
                        domain +
                        api +
                        '/order/addr/certificate/info/enterprise',
                    data: data
                },
                'get'
            );
        },
        //套餐支付结果
        getWxPackagePayResult(orderNo) {
            return this.ajaxCall(
                { url: domain + api + '/order/package/pay-status/' + orderNo },
                'get'
            );
        },
        //获取激活二维码
        getActivateCode(data) {
            return this.ajaxCall(
                { url: domain + api + '/user/ukey/activation', data: data },
                'get'
            );
        },
        //获取用户账号统计信息
        getAccountInfo(data) {
            return this.ajaxCall(
                { url: domain + api + '/user/account/statistics', data: data },
                'get'
            );
        },
        //套餐订单列表
        getPackOrderList(data) {
            return this.ajaxCall(
                { url: domain + api + '/order/package/page', data: data },
                'get'
            );
        },
        //费用订单列表
        getCostOrderList(currPage, pageSize, startDate, endDate) {
            return this.ajaxCall(
                {
                    url:
                        domain +
                        api +
                        '/order/getPaymentPage/' +
                        currPage +
                        '/' +
                        pageSize +
                        '?startDate=' +
                        startDate +
                        '&endDate=' +
                        endDate
                },
                'get'
            );
        },
        //生成手绘签名二维码
        getPaintCode(data) {
            return this.ajaxCall(
                {
                    url: domain + api + '/seal/handlePaintSign/qrCode',
                    data: data
                },
                'get'
            );
        },
        //获取手绘签名
        getPaintSign(nonceStr, data) {
            return this.ajaxCall(
                {
                    url:
                        domain +
                        api +
                        '/seal/handlePaintSign/getSign/' +
                        nonceStr,
                    data: data
                },
                'get'
            );
        },
        //获取合同文件base64
        getCompactBase64(data) {
            return this.ajaxCall(
                {
                    url: domain + api + '/compact/file/str/' + data,
                    async: false
                },
                'post'
            );
        },
        //存储
        saveFileBase64(data) {
            return this.ajaxCall(
                {
                    url: domain + api + '/compact/key/compact/file/info',
                    data: data,
                    async: false
                },
                'post'
            );
        },
        //获取ukey列表
        getUkeySealList(current, pageSize) {
            return this.ajaxCall(
                {
                    url:
                        domain +
                        api +
                        '/seal/auth/seal/list/' +
                        current +
                        '/' +
                        pageSize
                },
                'get'
            );
        },
        //短信验证码检验
        checkSmsCode(data) {
            return this.ajaxCall(
                { url: domain + api + '/user/info/checkSmsCode', data: data },
                'post'
            );
        },
        //校验续期是否有已经存在的订单
        checkUkeyIfHas(data) {
            return this.ajaxCall(
                {
                    url: domain + api + '/order/extension/validateEsealOrderHT',
                    data: data
                },
                'post'
            );
        },
        //重置密码
        resetPassword(data) {
            return this.ajaxCall(
                { url: domain + api + '/user/info/resetPassword', data: data },
                'post'
            );
        },
        //清除所有合同签名域
        clearCompactId(compactId) {
            return this.ajaxCall(
                { url: domain + api + '/compact/field/clear/' + compactId },
                'put'
            );
        },
        //待我签署弹窗提醒次数不足
        getSignNum(data) {
            return this.ajaxCall(
                {
                    url: domain + api + '/compact/check/choose/consumer',
                    data: data,
                    async: false
                },
                'post'
            );
        },
        //个人中心设置安全邮箱
        setSafeEmail(email) {
            return this.ajaxCall(
                {
                    url:
                        domain +
                        api +
                        '/user/enterprise/notRegister/emailSet?email=' +
                        email
                },
                'post'
            );
        },
        //个人实名认证
        personInit(data) {
            return this.ajaxCall(
                // { url: domain + api + "/user/personal/real-name", data: data },
                {
                    url: domain + api + '/user/new/personal/real-name',
                    data: data
                },
                'post'
            );
        },
        //上传头像
        uploadHeadImg(data) {
            return this.ajaxCall(
                { url: domain + api + '/user/info/uploadIcon', data: data },
                'post'
            );
        },
        //修改邮箱
        updateEmail(data) {
            return this.ajaxCall(
                { url: domain + api + '/user/info/updateEmail', data: data },
                'post'
            );
        },
        //合同撤销
        contractBackout(data) {
            return this.ajaxCall(
                {
                    url: domain + api + '/compact/info/status/revocation',
                    data: data
                },
                'put'
            );
        },
        //获取企业核对信息
        enterpriseInfo(data) {
            return this.ajaxCall(
                {
                    url: domain + api + '/user/enterprise/check/info',
                    data: data
                },
                'get'
            );
        },
        //添加云印章
        addCloudSeal(data) {
            return this.ajaxCall(
                { url: domain + api + '/seal/cloud/seal/info', data: data },
                'post'
            );
        },
        //修改云印章
        editCloudSeal(data) {
            return this.ajaxCall(
                { url: domain + api + '/seal/cloud/seal/info', data: data },
                'put'
            );
        },
        //删除云印章
        delCloudSeal(sealId) {
            return this.ajaxCall(
                { url: domain + api + '/seal/cloud/seal/info/' + sealId },
                'delete'
            );
        },
        //拒签合同
        contractDenied(data) {
            return this.ajaxCall(
                {
                    url: domain + api + '/compact/info/status/refuse',
                    data: data
                },
                'put'
            );
        },
        //修改登录密码
        editPassword(data) {
            return this.ajaxCall(
                {
                    url: domain + api + '/user/info/updateLoginPassword',
                    data: data
                },
                'post'
            );
        },
        //签章日志
        logInfoList(data) {
            return this.ajaxCall(
                {
                    url: domain + api + '/contract/sign/log/info/list',
                    data: data
                },
                'get'
            );
        },
        //催签合同
        contractRush(contractId) {
            return this.ajaxCall(
                { url: domain + api + '/compact/info/urge/sign/' + contractId },
                'put'
            );
        },
        //合同转签
        contractTransfer(data) {
            return this.ajaxCall(
                { url: domain + api + '/compact/turnSignatory', data: data },
                'post'
            );
        },
        //ukey gdca发送申请续期
        applyGDCA(data) {
            return this.ajaxCall(
                {
                    url: domain + api + '/order/extension/gdca',
                    data: data
                },
                'post'
            );
        },
        //ukey 印章续期-更新saas订单状态
        uptOrderStatus(data) {
            return this.ajaxCall(
                {
                    url: domain + api + '/order/extension/uptOrderStatus',
                    data: data
                },
                'post'
            );
        },
        //ukey 印章续期-获取印章信息
        getSignInfo(data) {
            return this.ajaxCall(
                {
                    url: domain + api + '/order/extension/eseal/pre',
                    data: data
                },
                'post'
            );
        },
        //ukey 续期-更新证书回写
        uptCertificateStatus(data) {
            return this.ajaxCall(
                {
                    url: domain + api + '/order/extension/uptCertificate',
                    data: data
                },
                'post'
            );
        },
        //ukey印章挂失
        createSignReport(data) {
            return this.ajaxCall(
                { url: domain + api + '/order/loss/create', data: data },
                'post'
            );
        },
        //ukey印章取消挂失
        cancelSignReport(orderNo) {
            return this.ajaxCall(
                {
                    url: domain + api + '/order/loss/cancel?orderNo=' + orderNo,
                    data: ''
                },
                'put'
            );
        },
        //签署截止日提醒设置
        signAbortDay(data) {
            return this.ajaxCall(
                { url: domain + api + '/user/info/signAbortDay', data: data },
                'post'
            );
        },
        //合同到期提醒设置
        vaildAbortDay(data) {
            return this.ajaxCall(
                { url: domain + api + '/user/info/vaildAbortDay', data: data },
                'post'
            );
        },
        //短信通知提醒设置
        shortMessageSet(data) {
            return this.ajaxCall(
                { url: domain + api + '/user/info/isShortMessage', data: data },
                'post'
            );
        },
        //邮箱通知提醒设置
        shortMailSet(data) {
            return this.ajaxCall(
                { url: domain + api + '/user/info/isMail', data: data },
                'post'
            );
        },
        //文件安全校验设置
        fileSafetySet(data) {
            return this.ajaxCall(
                {
                    url: domain + api + '/user/info/compactDownloadValidate',
                    data: data
                },
                'post'
            );
        },
        //获取企业角色列表
        getUserRoleList(pageNum, pageSize, data) {
            return this.ajaxCall(
                {
                    url:
                        domain +
                        api +
                        '/user/role/page/' +
                        pageNum +
                        '/' +
                        pageSize,
                    data: data
                },
                'get'
            );
        },
        //获取角色权限
        permissionRoleSet(data) {
            return this.ajaxCall(
                {
                    url: domain + api + '/user/role/permissionRoleSet',
                    data: data
                },
                'get'
            );
        },
        //获取角色印章数据权限
        permissionSealRoleSet(data) {
            return this.ajaxCall(
                { url: domain + api + '/user/role/sealRoleSet', data: data },
                'get'
            );
        },
        //获取角色合同数据权限
        permissionOrgRoleSet(data) {
            return this.ajaxCall(
                { url: domain + api + '/user/role/orgRoleSet', data: data },
                'get'
            );
        },
        //删除角色
        permissionRoleDelete(data) {
            return this.ajaxCall(
                { url: domain + api + '/user/role/delete', data: data },
                'delete'
            );
        },
        //获取权限列表
        getUserRoleMenuInfos(data) {
            return this.ajaxCall(
                { url: domain + api + '/user/role/MenuInfos', data: data },
                'get'
            );
        },
        //获取组织结构列表
        findOrgInfoByParentId(data) {
            return this.ajaxCall(
                { url: domain + api + '/user/org/getOrgInfoDto', data: data },
                'get'
            );
        },
        //修改组织结构列表
        editOrgInfoByParentId(data) {
            return this.ajaxCall(
                { url: domain + api + '/user/org/update', data: data },
                'post'
            );
        },
        //删除组织结构列表
        deleteOrgInfoByParentId(data) {
            return this.ajaxCall(
                { url: domain + api + '/user/org/delete', data: data },
                'post'
            );
        },
        //新增子组织结构列表
        addOrgInfoByParentId(data) {
            return this.ajaxCall(
                { url: domain + api + '/user/org/add', data: data },
                'post'
            );
        },
        //ukey续期获取印章信息
        getSealRenewInfo(data) {
            return this.ajaxCall(
                {
                    url:
                        domain +
                        api +
                        '/order/extension/eseal',
                    data: data
                },
                'post'
            );
        },
        //ukey续期生成订单
        createRenewOrder(data) {
            return this.ajaxCall(
                {
                    url: domain + api + '/order/extension/newcreate',
                    data: data
                },
                'post'
            );
        },
        //查询存证信息
        getEvidenceInfo(data) {
            return this.ajaxCall(
                { url: domain + api + '/webank/evidence/findE', data: data },
                'post'
            );
        },
        //企业自定义章模上传-base64
        uploadImgBase64(data) {
            return this.ajaxCall(
                {
                    url: domain + api + '/seal/enterprise/custom/upload64',
                    data: data
                },
                'post'
            );
        },
        //新增角色
        addUserRole(data) {
            return this.ajaxCall(
                { url: domain + api + '/user/role/add', data: data },
                'post'
            );
        },
        //修改角色名称
        updateUserRole(data) {
            return this.ajaxCall(
                { url: domain + api + '/user/role/update', data: data },
                'put'
            );
        },
        //新增角色权限分配
        addRoleSealOrgMenuRelationship(data) {
            return this.ajaxCall(
                {
                    url:
                        domain +
                        api +
                        '/user/role/addRoleSealOrgMenuRelationship',
                    data: data
                },
                'post'
            );
        },
        //修改角色权限分配
        updateRoleSealOrgMenuRelationship(data) {
            return this.ajaxCall(
                {
                    url:
                        domain +
                        api +
                        '/user/role/updateRoleSealOrgMenuRelationship',
                    data: data
                },
                'post'
            );
        },
        //新增子账号
        addEnterpriseOfAccount(orgId, roleId, data) {
            return this.ajaxCall(
                {
                    url:
                        domain +
                        api +
                        '/user/info/enterpriseOfAccount/' +
                        orgId +
                        '/' +
                        roleId,
                    data: data
                },
                'post'
            );
        },
        //修改子账号
        updateEnterpriseOfAccount(data) {
            return this.ajaxCall(
                { url: domain + api + '/user/role/updateUserRole', data: data },
                'put'
            );
        },
        //删除子账号
        deleteEnterpriseOfAccount(data) {
            return this.ajaxCall(
                {
                    url: domain + api + '/user/info/unBindEnterprise',
                    data: data
                },
                'post'
            );
        },
        //禁用、启用子账号
        forbiddenEnterpriseOfAccount(data) {
            return this.ajaxCall(
                {
                    url:
                        domain +
                        api +
                        '/user/info/forbiddenAccountOfEnterprise',
                    data: data
                },
                'post'
            );
        },
        //查询子账号权限
        findEnterpriseOfAccount(data) {
            return this.ajaxCall(
                {
                    url: domain + api + '/user/info/findOrgIdAndRoleId',
                    data: data
                },
                'post'
            );
        },
        //分页查询子账号
        getAccountListOfEnterprise(data) {
            return this.ajaxCall(
                {
                    url: domain + api + '/user/info/accountListOfEnterprise',
                    data: data
                },
                'post'
            );
        },
        //切换身份账号
        switchAccountOfEnterprise(data) {
            return this.ajaxCall(
                { url: domain + api + '/user/switchEnterprise', data: data },
                'post'
            );
        },
        //新用户中心验证码获取 注册
        getNewSmsVerification(data) {
            return this.ajaxCall(
                {
                    url: domain + api + '/user/sms/not-login-verification/code',
                    data: data
                },
                'post'
            );
        },
        //用户统计
        userCount(data) {
            return this.ajaxCall(
                { url: domain + api + '/user/info/userCount', data: data },
                'get'
            );
        },
        //用户统计列表
        userCountList(pageNum, pageSize, data) {
            return this.ajaxCall(
                {
                    url:
                        domain +
                        api +
                        '/user/info/PageSecendAcound/' +
                        pageNum +
                        '/' +
                        pageSize,
                    data: data
                },
                'post'
            );
        },
        //实名失败统计列表
        authFailList(pageNum, pageSize, data) {
            return this.ajaxCall(
                {
                    url:
                        domain +
                        api +
                        '/user/getRealNamePage/' +
                        pageNum +
                        '/' +
                        pageSize,
                    data: data
                },
                'post'
            );
        },
        //获取合同归档列表
        getCompactFolderList(enterpriseId) {
            return this.ajaxCall(
                {
                    url:
                        domain +
                        api +
                        '/compact/folder/list?enterpriseId=' +
                        enterpriseId,
                    data: ''
                },
                'get'
            );
        },
        //添加合同归档文件夹
        addCompactFolder(data) {
            return this.ajaxCall(
                { url: domain + api + '/compact/folder/add', data: data },
                'post'
            );
        },
        //删除合同归档文件夹
        deleteCompactFolder(data) {
            return this.ajaxCall(
                { url: domain + api + '/compact/folder/delete', data: data },
                'post'
            );
        },
        //修改合同归档文件夹名
        updateCompactFolder(data) {
            return this.ajaxCall(
                { url: domain + api + '/compact/folder/update', data: data },
                'post'
            );
        },
        //移动合同归档文件
        moveCompactFolder(data) {
            return this.ajaxCall(
                {
                    url: domain + api + '/compact/folder/compactfolder/add',
                    data: data
                },
                'post'
            );
        },
        //根据角色获取签名印章
        getSealRoleSetByRole(data) {
            return this.ajaxCall(
                { url: domain + api + '/user/role/sealRoleSet', data: data },
                'get'
            );
        },
        //根据角色获取组织
        getOrgRoleSetRole(data) {
            return this.ajaxCall(
                { url: domain + api + '/user/role/orgRoleSet', data: data },
                'get'
            );
        },
        //导出统计数据分页信息
        exportUserInfo(data) {
            return this.ajaxCall(
                {
                    url:
                        domain +
                        api +
                        '/user/info/export/' +
                        data.pageNum +
                        '/' +
                        data.pageSize,
                    data: data
                },
                'get'
            );
        },
        //根据手机号获取所有身份
        getUserAllId(data) {
            return this.ajaxCall(
                { url: domain + api + '/user/getAllId/' + data },
                'get'
            );
        },
        //修改手机号
        updatePhone(data) {
            return this.ajaxCall(
                { url: domain + api + '/user/info/phone', data: data },
                'put'
            );
        },
        //查询手机号或邮箱是否注册过
        checkPhoneOrEmail(data) {
            return this.ajaxCall(
                {
                    url: domain + api + '/user/getUserByPhoneOrEmail',
                    data: data
                },
                'post'
            );
        },
        //套餐次数不足发送短信接口
        remindSignTime(data) {
            return this.ajaxCall(
                { url: domain + api + '/compact/message/sendSms', data: data },
                'post'
            );
        },
        //查询ukey版本是否为最新
        checkUKeyVersion(ver) {
            return this.ajaxCall(
                { url: domain + api + '/common/ukey/compareVer?ver=V' + ver },
                'get'
            );
        },
        //修改联系人或企业名称
        updateLinkOrCompanyName(data) {
            return this.ajaxCall(
                {
                    url: domain + api + '/user/info/updateLinkOrCompanyName',
                    data: data
                },
                'post'
            );
        },
        //订单日志
        getOrderLog(orderNo) {
            return this.ajaxCall(
                { url: domain + api + '/order/log/' + orderNo },
                'get'
            );
        },
        //ukey信息补全
        ukeyUpdata(data) {
            return this.ajaxCall(
                { url: domain + api + '/common/ukey/login/ukey', data: data },
                'post'
            );
        },
        //netca是否续期成功过
        netcaSuccess(data) {
            return this.ajaxCall(
                {
                    url: domain + api + '/order/extension/netCaIsSucceed',
                    data: data
                },
                'post'
            );
        },
        //是否换体续期
        isNeedChangeCert(data) {
            return this.ajaxCall(
                {
                    url: domain + api + '/order/extension/changeCert',
                    data: data
                },
                'post'
            );
        },
        //获取签名原文
        getNetcaSignText(data) {
            return this.ajaxCall(
                {
                    url: domain + api + '/order/extension/netCaSignPlainText',
                    data: data
                },
                'post'
            );
        },
        //netca续期
        renewNetca(data) {
            return this.ajaxCall(
                {
                    url: domain + api + '/order/extension/renewCertNetCa',
                    data: data
                },
                'post'
            );
        },
        //续期回写通知
        netcaNotify(data) {
            return this.ajaxCall(
                {
                    url: domain + api + '/order/extension/uptNetCaCertificate',
                    data: data
                },
                'post'
            );
        },
        //续期成功查看章模
        getSignetInfo(data) {
            return this.ajaxCall(
                {
                    url:
                        domain +
                        api +
                        '/order/extension/gdcaPictureOrderDetail',
                    data: data
                },
                'get'
            );
        },
        //获取续期价格
        getPayInfo(data) {
            return this.ajaxCall(
                {
                    url: domain + api + '/order/extension/payInfoBypictureCode',
                    data: data
                },
                'post'
            );
        },
        //续期订单改草稿
        changeOrderStatus(orderNo) {
            return this.ajaxCall(
                {
                    url:
                        domain +
                        api +
                        '/order/extension/uptOrderStatusToDraft/' +
                        orderNo
                },
                'put'
            );
        },
        //登录获取验证码
        getLoginSms(phone){
            return this.ajaxCall(
                {
                    url:
                        domain +
                        api +
                        '/user/loginsms/uc/' +
                        phone
                },
                'get'
            );
        },
        //登录获取验证码
        loginSms(data){
            return this.ajaxCall(
                {
                    url:
                        domain +
                        api +
                        '/user/login/sms',
                        data: data
                },
                'post'
            );
        },
        //签署获取验证码
        getSignSms(data){
            return this.ajaxCall(
                {
                    url:
                        domain +
                        api +
                        '/user/sms/verification/code',
                        data: data
                },
                'post'
            );
        },


        //ukey 多浏览器兼容接口 开始
        //获取插入ukey数目
        getCertCount() {
            return this.ajaxUKeyCall(
                { url: ctx + 'login/getCertCount' },
                'get'
            );
        },
        //选中ukey
        setCertIndex(index) {
            return this.ajaxUKeyCall(
                { url: ctx + 'login/setCertIndex?index=' + index },
                'get'
            );
        },
        //获取证书数据 0，签名证书 1，加密证书
        getCertData(data) {
            return this.ajaxUKeyCall(
                { url: ctx + 'login/getKeyCertStream', data: data },
                'get'
            );
        },
        //验证ukey pin码
        setCertPin(pin) {
            return this.ajaxUKeyCall(
                { url: ctx + 'login/setCertPin?pin=' + pin },
                'get'
            );
        },
        //获取证书数据  0，证书名称 1，证书OID 2，证书类型(0-安逸key，1-odc的key) 3，印章编码 4，印章拥有者（0机构 1个人）
        //5，证书有效起始期 6，证书有效终止期 7，key制造商 8，组织机构名称 9，加密证书公钥 10:签名证书序列号 11，加密证书序列号
        //12，gdca的信任服务号 13，证书使用者信息 14，证书颁发者信息
        GetCertInfo(type) {
            return this.ajaxUKeyCall(
                { url: ctx + 'login/getCertInfo?type=' + type },
                'get'
            );
        },
        //PKCS7签名
        signatureUKey(data) {
            return this.ajaxUKeyCall(
                { url: ctx + 'login/signature', data: data },
                'post'
            );
        },
        //PKCS1签名
        signatureUKeyPKCS1(data) {
            return this.ajaxUKeyCall(
                { url: ctx + 'login/signaturePKCS1', data: data },
                'post'
            );
        },
        //验证PKCS7签名
        verifySignatureUKey(data) {
            return this.ajaxUKeyCall(
                { url: ctx + 'login/verifySignature', data: data },
                'post'
            );
        },
        //获取ukey id
        getUKeyID() {
            return this.ajaxUKeyCall({ url: ctx + 'login/getKeyID' }, 'get');
        },
        //ukey 多浏览器兼容接口 结束

        //新ukey 多浏览器兼容接口 开始
        // 通用
        //获取ukey版本号
        getUKeyVersion() {
            return this.ajaxUKeyCall({ url: ctx + 'getVersion' }, 'get');
        },
        //登录相关 http://localhost:9825/login
        //获取插入所有ukey列表
        getAllUKeyList() {
            return this.ajaxUKeyCall(
                { url: ctx + 'login/checkKeyList?_t' + Date.now() },
                'get'
            );
        },
        //ukey登录
        loginKey(data) {
            return this.ajaxUKeyCall(
                { url: ctx + 'login/loginKey', data: data },
                'post'
            );
        },
        //获取ukey信息 0-14
        /*CERT_NAME = 0,//证书名称
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
        CERT_ISSUER_JSON,//证书颁发者信息（json对象的字符串）*/
        getCertInfoObjFn(keyid) {
            return this.ajaxUKeyCall(
                { url: ctx + 'login/getKeyCertInfo?keyid=' + keyid },
                'get'
            );
        },

        //签章相关 http://localhost:9825/websign
        //获取插入所有ukey列表
        getAllUKeyListOfSign() {
            return this.ajaxUKeyCall(
                { url: ctx + 'websign/checkKeyList' },
                'get'
            );
        },
        //ukey登录
        loginKeyOfSign(data) {
            return this.ajaxUKeyCall(
                { url: ctx + 'websign/loginKey', data: data },
                'post'
            );
        },
        //获取ukey信息 0-14
        /*CERT_NAME = 0,//证书名称
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
        CERT_ISSUER_JSON,//证书颁发者信息（json对象的字符串）*/
        getCertInfoObjFnOfSign(keyid) {
            return this.ajaxUKeyCall(
                { url: ctx + 'websign/getKeyCertInfo?keyid=' + keyid },
                'get'
            );
        },
        //ukey单页签
        uKeySignOfSealSign(data) {
            return this.ajaxUKeyCall(
                { url: ctx + 'websign/sealSign', data: data },
                'post'
            );
        },
        //ukey多页签
        uKeySignOfMultiSign(data) {
            return this.ajaxUKeyCall(
                { url: ctx + 'websign/multiSign', data: data },
                'post'
            );
        },
        //ukey骑缝签
        uKeySignOfSignOnSeam(data) {
            return this.ajaxUKeyCall(
                { url: ctx + 'websign/signOnSeam', data: data },
                'post'
            );
        },
        //ukey 三签章合一
        uKeySignOfSignBylist(data) {
            return this.ajaxUKeyCall(
                { url: ctx + 'websign/signBylist', data: data },
                'post'
            );
        },
        //新ukey 多浏览器兼容接口 结束
        // 模板列表
        getTemplateList(data) {
            return this.ajaxCall(
                {
                    url: domain + api + '/template/page/list',
                    data
                },
                'post'
            );
        },
        // 删除模板
        delTemplate(id) {
            return this.ajaxCall(
                {
                    url: domain + api + `/template/delete/${id}`,
                },
                'post'
            );
        },
        // 获取模板详情
        getTemplateInfo(id) {
            return this.ajaxCall(
                {
                    url: domain + api + `/template/getInfo/${id}`,
                },
                'post'
            );
        },
        // 获取模板详情
        templateBasicInfo(data) {
            return this.ajaxCall(
                {
                    url: domain + api + `/compact/template/basic/info`,
                    data
                },
                'post'
            );
        },
        // 获取模板详情
        compactTempDetail(id) {
            return this.ajaxCall(
                {
                    url: domain + api + `/compact/template/info/detail/${id}`,
                },
                'get'
            );
        },
        // 填充模板信息
        fillTemplate(data) {
            return this.ajaxCall(
                {
                    url: domain + api + `/compact/fill/fields`,
                    data
                },
                'post'
            );
        },
    }
};
