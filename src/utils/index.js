// 引入键名map
import keyCodeMap from './keyCodeMap'

// 引入工具包
import SharedUtils from './shared'
import CommonUtils from './common'

/**
 * 默认暴露安装全局共享函数
 * 
 * 详见：https://cn.vuejs.org/v2/guide/plugins.html
 * 
 * 暴露一个 `install` 方法 
 * - 第一个参数是 Vue 构造器
 * - 第二个参数是一个可选的选项对象 `options`
 */
const install = function(Vue) {
    Vue.$SU = Vue.prototype.$SU = SharedUtils
}


export { 
    install as default,
    CommonUtils as CU
}


// ------------------------------------------------------------------


export const localStore = {
    /**
     * 设置localStorage的方法
     * @param {String} key - 键，必传
     * @param {Object | String | Number | Boolean} value - 值，必传
     * @param {Number} time - 过期时间（单位秒），选传，默认值0（不过期）
     */
    set(key, value, time = 0) {
        let expiringDate = time === 0 ? 0 : new Date().getTime() + time * 1000;
        if (typeof value === 'object') {
            value = JSON.stringify(value);
            value = 'obj-' + value;
        } else {
            value = 'str-' + value;
        }
        value = JSON.stringify({
            data: value,
            time: expiringDate
        });
        window.localStorage.setItem(key, value);
    },
    get(key) {
        let ls = window.localStorage.getItem(key);
        if (!ls) {
            return;
        } else {
            let store = JSON.parse(ls);
            let value = store.data;
            let time = +store.time;
            if (time !== 0 && new Date().getTime() - time > 0) {
                window.localStorage.removeItem(key);
                return undefined;
            } else {
                if (value.indexOf('obj-') === 0) {
                    value = value.slice(4);
                    return JSON.parse(value);
                } else if (value.indexOf('str-') === 0) {
                    return value.slice(4);
                }
            }
        }
    },
    remove(key) {
        if (!key) {
            return;
        }
        window.localStorage.removeItem(key);
    },
    clear() {
        window.localStorage.clear();
    }
};
/**
 * 设置sessionStore的方法
 * @param {String} key - 键，必传
 * @param {Object | String | Number | Boolean} value - 值，必传
 */
export const sessionStore = {
    set(key, value) {
        if (typeof value === 'object') {
            value = JSON.stringify(value);
            value = 'obj-' + value;
        } else {
            value = 'str-' + value;
        }
        window.sessionStorage.setItem(key, value);
    },
    get(key) {
        var value = window.sessionStorage.getItem(key);
        if (!value) {
            return;
        }
        if (value.indexOf('obj-') === 0) {
            value = value.slice(4);
            return JSON.parse(value);
        } else if (value.indexOf('str-') === 0) {
            return value.slice(4);
        }
    },
    remove(key) {
        if (!key) {
            return;
        }
        window.sessionStorage.removeItem(key);
    },
    clear() {
        window.sessionStorage.clear();
    }
};
/**
 * 设置cookieStore的方法
 * @param {String} key - 键，必传
 * @param {String} value - 值，必传
 * @param {Number} iMin - 时间：分钟，选传，默认10
 */
export const cookieStore = {
    set(name, value, iMin = 10) {
        let oDate = new Date();
        let host = location.host;
        let domain;
        oDate.setTime(oDate.getTime() + iMin * 60); // 设置Date对象内部时间，iMin表示几分钟后。
        domain = host.substring(host.indexOf('.'), host.length);
        document.cookie =
            name +
            '=' +
            encodeURIComponent(value) +
            ';expires=' +
            oDate.toUTCString() +
            ';path=/;domain=' +
            domain;
    },
    get(name) {
        var arr = document.cookie.split(';');
        for (var i = 0, len = arr.length; i < len; i++) {
            var arr2 = arr[i].split('=');
            if (arr2[0] === name) {
                return decodeURIComponent(arr2[1]);
            }
        }
        return '';
    },
    remove(name) {
        this.set(name, '', -1);
    },
    clear() {
        var keys = document.cookie.match(/[^=;]+(?=\=)/g);
        if (keys) {
            for (var i = keys.length; i--; )
                document.cookie =
                    keys[i] + '=0;expires=' + new Date(0).toUTCString();
        }
    }
};

/**
 * 校验手机号
 * @param {Number} phoneNumber - 手机号，必传
 */
export const isPhoneNum = (phoneNumber) => {
    return /^(1[3-9][0-9])[0-9]{8}$/.test(phoneNumber.trim());
};
/**
 * 密码校验，字母和数字6-20位
 * @param {Number} value - 密码，必传
 * @param {Number} min - 最小长度，选传，默认6
 * @param {Number} max - 最大长度，选传，默认20
 */
export const isPassword = (value, min = 6, max = 20) => {
    let reg = new RegExp(
        `^(?![0-9]+$)(?![a-zA-Z]+$)[0-9A-Za-z]{${min},${max}}$`
    );
    return reg.test(value.trim());
};
/**
 * 校验正整数
 * @param {Number} val - 值，必传
 */
export const checkIntegral = (val) => {
    var integralReg = /^[1-9]+\d*$|^0+[1-9]+\d*$/;
    return integralReg.test(val);
};
/**
 * 校验正数
 * @param {Number} val - 值，必传
 */
export const checkPositiveNumber = (val) => {
    var positiveNumberReg = /^0\.\d+$|^[1-9]+(\d+)?(\.\d+)?$/;
    return positiveNumberReg.test(val.trim());
};
/**
 * 校验邮箱
 * @param {String} email - 邮箱，必传
 */
export const isEmail = (email) => {
    return /\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*/.test(email.trim());
};
/**
 * 校验身份证号
 * @param {Number} cardNumber - 身份证号，必传
 */
export const isCard = (cardNumber) => {
    return /^(^[1-9]\d{7}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])\d{3}$)|(^[1-9]\d{5}[1-9]\d{3}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])((\d{4})|\d{3}[Xx])$)$/.test(
        cardNumber.trim()
    );
};
/**
 * 校验统一社会信用代码
 * @param {Number} cardNumber - 社会信用代码，必传
 */
export const isCredit = (cardNumber) => {
    return /^[1-9A-GY]{1}[1239]{1}[1-5]{1}[0-9]{5}[0-9A-Z]{10}$/.test(
        cardNumber.trim()
    );
};
/**
 * 校验统一社会信用代码(宽泛)
 * @param {Number} cardNumber - 社会信用代码，必传
 */
export const isNewCredit = (cardNumber) => {
    return /^[\dA-HJ-NP-RTUW-Y]{18}$/.test(cardNumber.trim());
};
/**
 * 校验图片格式
 * @param {String} type - 文件类型，必传
 */
export const isImage = (type) => {
    return /\/(jpg|jpeg|png|webp|svg|svg\+xml)$/.test(type);
};
/**
 * 判断图片是否加载成功或有效地址
 * @param {String} url - 图片地址，必传
 */
export const picDownloadSucceed = (url) => {
    return new Promise((resolve, reject) => {
        let succeed;
        let Img = new Image();
        Img.src = url;
        Img.onload = function() {
            succeed = true;
            resolve(succeed);
        };
        Img.onerror = function() {
            succeed = false;
            reject(succeed);
        };
    });
};
/**
 * 计算字符串字节大小
 * @param {String} s - 值，必传
 */
export const mbStringLength = (s) => {
    var totalLength = 0;
    var i;
    var charCode;
    for (i = 0; i < s.length; i++) {
        charCode = s.charCodeAt(i);
        if (charCode < 0x007f) {
            totalLength = totalLength + 1;
        } else if (0x0080 <= charCode && charCode <= 0x07ff) {
            totalLength += 2;
        } else if (0x0800 <= charCode && charCode <= 0xffff) {
            totalLength += 3;
        } else {
            totalLength += 4;
        }
    }
    // console.log(totalLength);
    return totalLength;
};
/**
 * base64转Unicode编码数组
 * @param {String} base64 - base64，必传
 */
export const converData = (base64) => {
    let raw = window.atob(base64);
    let rawLength = raw.length;
    let bufferArr = new ArrayBuffer(rawLength); // 创建一个指定长度的内存区域 bufferArr.length =rawLength
    let array = new Uint8Array(bufferArr); // 在ArrayBuffer对象上生成视图,每个元素8位无符号整数，长度1个字节
    for (let i = 0; i < rawLength; i++) {
        array[i] = raw.charCodeAt(i);
    }
    return array;
};
/**
 * base64转blob
 * @param {String} base64 - base64，必传
 */
export const dataURLtoBlob = (base64) => {
    let bstr = atob(base64),
        n = bstr.length,
        u8arr = new Uint8Array(n);
    while (n--) {
        u8arr[n] = bstr.charCodeAt(n);
    }
    return new Blob([u8arr], { type: '' });
};
/**
 * base64转binary
 * @param {String} base64 - base64，必传
 */
export const dataToBinary = (base64) => {
    let bstr = atob(base64),
        n = bstr.length,
        u8arr = new Uint8Array(n);
    while (n--) {
        u8arr[n] = bstr.charCodeAt(n);
    }
    let _blob = new Blob([u8arr], { type: '' });
    let formdata = new FormData();
    formdata.append('file', _blob);
    return formdata;
};
/**
 * 获取浏览器类型和版本
 */
export const getExplore = () => {
    let sys = {},
        ua = navigator.userAgent.toLowerCase(),
        s;
    console.log(ua)((s = ua.match(/rv:([\d.]+)\) like gecko/)))
        ? (sys.id = s[1])
        : (s = ua.match(/msie ([\d\.]+)/))
        ? (sys.ie = s[1])
        : (s = ua.match(/edge\/([\d\.]+)/))
        ? (sys.edge = s[1])
        : (s = ua.match(/firefox\/([\d\.]+)/))
        ? (sys.firefox = s[1])
        : (s = ua.match(/(?:opera|opr).([\d\.]+)/))
        ? (sys.opera = s[1])
        : (s = ua.match(/chrome\/([\d\.]+)/))
        ? (sys.chrome = s[1])
        : (s = ua.match(/version\/([\d\.]+).*safari/))
        ? (sys.safari = s[1])
        : 0;
    if (sys.ie) return 'IE: ' + sys.ie;
    if (sys.edge) return 'EDGE: ' + sys.edge;
    if (sys.firefox) return 'Firefox: ' + sys.firefox;
    if (sys.chrome) return 'Chrome: ' + sys.chrome;
    if (sys.opera) return 'Opera: ' + sys.opera;
    if (sys.safari) return 'Safari: ' + sys.safari;
    return 'Unkonwn';
};
/**
 * 获取浏览器是否为ie
 */
export const isIE = () => {
    var userAgent = navigator.userAgent; //取得浏览器的userAgent字符串
    var isIE =
        userAgent.indexOf('compatible') > -1 && userAgent.indexOf('MSIE') > -1; //判断是否IE<11浏览器
    var isEdge = userAgent.indexOf('Edge') > -1 && !isIE; //判断是否IE的Edge浏览器
    var isIE11 =
        userAgent.indexOf('Trident') > -1 && userAgent.indexOf('rv:11.0') > -1;
    if (isIE || isEdge || isIE11) {
        return 1;
    } else {
        return 0; //不是ie浏览器
    }
};
/**
 * 获取操作系统类型
 */
export const getOs = () => {
    let userAgent =
        ('navigator' in window &&
            'userAgent' in navigator &&
            navigator.userAgent.toLowerCase()) ||
        '';
    let appVersion =
        ('navigator' in window &&
            'appVersion' in navigator &&
            navigator.appVersion.toLowerCase()) ||
        '';

    if (/mac/i.test(appVersion)) return 'MacOSX';
    if (/win/i.test(appVersion)) return 'windows';
    if (/linux/i.test(appVersion)) return 'linux';
    if (
        /iphone/i.test(userAgent) ||
        /ipad/i.test(userAgent) ||
        /ipod/i.test(userAgent)
    )
        return 'ios';
    if (/android/i.test(userAgent)) return 'android';
    if (/win/i.test(appVersion) && /phone/i.test(userAgent))
        return 'windowsPhone';
};
/**
 * 获取元素距离document的距离
 * @param {Dom} ele - 目标元素，必传
 */
export const getOffset = (ele) => {
    let pos = {
        left: 0,
        top: 0
    };
    while (ele) {
        pos.left += ele.offsetLeft;
        pos.top += ele.offsetTop;
        ele = ele.offsetParent;
    }
    return pos;
};
/**
 * 拷贝对象
 * @param {Date | Object | Array} value - 值，必传
 */
export const deepClone = (value) => {
    let copyValue;
    if (value === null || typeof value !== 'object') {
        return value;
    }
    if (value instanceof Date) {
        copyValue = new Date();
        copyVlue.setTime(value.getTime());
        return copyValue;
    }
    if (value instanceof Array) {
        copyValue = [];
        for (let i = 0; i < value.length; i++) {
            copyValue[i] = deepClone(value[i]);
        }
        return copyValue;
    }
    if (value instanceof Object) {
        copyValue = {};
        for (let attr in value) {
            if (value.hasOwnProperty(attr)) {
                copyValue[attr] = deepClone(value[attr]);
            }
        }
        return copyValue;
    }
    throw new Error('不能拷贝!');
};
/**
 * 判断对象是否为空
 * @param {Object} obj - 值，必传
 */
export const isEmptyObject = (obj) => {
    if (!obj || typeof obj !== 'object' || Array.isArray(obj)) {
        return false;
    }
    return !Object.keys(obj).length;
};
/**
 * 生成随机颜色
 */
export const randomColor = () => {
    return (
        '#' +
        ('00000' + ((Math.random() * 0x1000000) << 0).toString(16)).slice(-6)
    );
};
/**
 * 生成随机数
 * @param {Number} min - 下边界，必传
 * @param {Number} max - 上边界，必传
 */
export const randomNumber = (min, max) => {
    return Math.floor(min + Math.random() * (max - min));
};
/**
 * 校验是否为url
 * @param {String} url - url地址，必传
 */
export const isUrl = (url) => {
    return /[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)/i.test(
        url
    );
};
/**
 * 距离现在已过时间
 * @param {Number} startTime - 起始时间ms，必传
 */
export const pastTime = (startTime) => {
    let currentTime = Date.parse(new Date()),
        time = currentTime - startTime,
        day = parseInt(time / (1000 * 60 * 60 * 24)),
        hour = parseInt(time / (1000 * 60 * 60)),
        min = parseInt(time / (1000 * 60)),
        month = parseInt(day / 30),
        year = parseInt(month / 12);
    if (year) return year + '年前';
    if (month) return month + '月前';
    if (day) return day + '天前';
    if (hour) return hour + '小时前';
    if (min) return min + '分钟前';
    else return '刚刚';
};
/**
 * 距离目标时间还剩多少时间
 * @param {Number} endTime - 结束时间ms，必传
 */
export const remainTime = (endTime) => {
    let startTime = new Date().getTime();
    let diff = endTime - startTime;
    let d = 0,
        h = 0,
        m = 0,
        s = 0;
    if (diff > 0) {
        d = Math.floor(diff / 1000 / 3600 / 24);
        h = Math.floor((diff / 1000 / 60) % 24);
        m = Math.floor((diff / 1000 / 60) % 60);
        s = Math.floor((diff / 1000) % 60);
    }
    return d + '天' + h + '小时' + m + '分' + s + '秒';
};
/**
 *
 * @desc 获取url参数
 * @param url url地址
 */
export const getQuery = (url) => {
    if (url) {
        let search = url.substring(url.lastIndexOf('?') + 1);
        return JSON.parse(
            '{"' +
                decodeURIComponent(search)
                    .replace(/"/g, '\\"')
                    .replace(/&/g, '","')
                    .replace(/=/g, '":"') +
                '"}'
        );
    } else {
        let q = {};
        location.href.replace(/([^?&=]+)=([^&]+)/g, (_, k, v) => (q[k] = v));
        return q;
    }
};
/**
 *
 * @desc 判断两个数组是否相等
 * @param arr1 数组1
 * @param arr2 数组2
 */
export const arrIsEqual = (arr1, arr2) => {
    if (arr1 === arr2) return true;
    if (arr1.length !== arr2.length) return false;
    for (let i = 0; i < arr1.length; i++) {
        if (arr1[i] !== arr2[i]) return false;
    }
    return true;
};
/**
 *
 * @desc H5软键盘缩回、弹起回调
 * 当软件键盘弹起会改变当前 window.innerHeight，监听这个值变化
 * @param {Function} downCb 当软键盘缩回的回调
 * @param {Function} upCb 当软键盘弹起的回调
 */
export const windowResize = (downCb, upCb) => {
    var clientHeight = window.innerHeight;
    downCb = typeof downCb === 'function' ? downCb : function() {};
    upCb = typeof upCb === 'function' ? upCb : function() {};
    window.addEventListener('resize', () => {
        var height = window.innerHeight;
        if (height === clientHeight) {
            downCb();
        }
        if (height < clientHeight) {
            upCb();
        }
    });
};
/**
 * @desc 根据keycode获得键名
 * @param  {Number} keycode
 * @return {String}
 */
export const getKeyName = (keycode) => {
    if (keyCodeMap[keycode]) {
        return keyCodeMap[keycode];
    } else {
        return '';
    }
};
/**
 * @desc 本地图片转base64字符串
 * @param  {String} url
 * @return {String}
 */
export const imgToBase64 = (url) => {
    let canvas = document.createElement('canvas');
    let ctx = canvas.getContext('2d');
    let img = new Image();
    img.src = url;
    ctx.drawImage(img, 0, 0, img.width, img.height);
    let ext = url.substring(url.lastIndexOf('.') + 1).toLowerCase();
    let base64 = canvas.toDataURL('image/' + ext);
    return base64;
};

/**
 * @desc 校验汉字
 * @param {String} val
 */
export const isChinese = (val) => {
    // 汉字正则
    let reg = /[\u4e00-\u9fa5]/;
    return reg.test(val.trim());
};
/**
 * @desc 校验汉字和中文标点符号
 * @param {String} val
 */
export const isChineseSymbol = (val) => {
    // 汉字正则
    let reg = /[\u4e00-\u9fa5]/;
    // 中文标点符号正则
    let reg2 = /[\u3002|\uff1f|\uff01|\uff0c|\u3001|\uff1b|\uff1a|\u201c|\u201d|\u2018|\u2019|\uff08|\uff09|\u300a|\u300b|\u3008|\u3009|\u3010|\u3011|\u300e|\u300f|\u300c|\u300d|\ufe43|\ufe44|\u3014|\u3015|\u2026|\u2014|\uff5e|\ufe4f|\uffe5]/;
    return reg.test(val.trim()) || reg2.test(val.trim());
};
/**
 * @desc 校验英文和中文标点符号
 * @param {String} val
 */
export const isSymbol = (val) => {
    // 英文符号正则
    let reg = /[\~|\`|\!|\@|\#|\$|\%|\^|\&|\*|\(|\)|\-|\_|\+|\=|\||\\|\[|\]|\{|\}|\;|\:|\"|\'|\,|\<|\.|\>|\/|\?]/g;
    // 中文符号正则
    let reg2 = /[\u3002|\uff1f|\uff01|\uff0c|\u3001|\uff1b|\uff1a|\u201c|\u201d|\u2018|\u2019|\uff08|\uff09|\u300a|\u300b|\u3008|\u3009|\u3010|\u3011|\u300e|\u300f|\u300c|\u300d|\ufe43|\ufe44|\u3014|\u3015|\u2026|\u2014|\uff5e|\ufe4f|\uffe5]/;
    return reg.test(val.trim()) || reg2.test(val.trim());
};
/**
 * @desc 计算ukey签署mode
 * @param {Boolean} foggyCheck
 * @param {Boolean} greyCheck
 */
export const computedSignMode = (foggyCheck, greyCheck) => {
    let signmode;
    if (!foggyCheck && !greyCheck) {
        signmode = 0;
    } else if (foggyCheck && !greyCheck) {
        signmode = 4;
    } else if (!foggyCheck && greyCheck) {
        signmode = 2;
    } else if (foggyCheck && greyCheck) {
        signmode = 6;
    }
    return signmode;
};
/**
 * @desc 计算ukey签署foggy grey
 * @param {Number} signmode
 */
export const computedSignType = (signmode) => {
    let signType = {};
    if (signmode === 0) {
        signType = {
            foggy: false,
            grey: false
        };
    } else if (signmode === 2) {
        signType = {
            foggy: false,
            grey: true
        };
    } else if (signmode === 4) {
        signType = {
            foggy: true,
            grey: false
        };
    } else if (signmode === 6) {
        signType = {
            foggy: true,
            grey: true
        };
    }
    return signType;
};
/**
 * @desc 计算ukey签署foggy grey
 * @param {Number} signmode
 */
export const checkBlobFileResponseUtils = (blob) => {
    return new Promise((resolve, reject) => {
        // 有可能下载失败，返回{code: '500'},但responseType: 'blob'会把data强制转为blob，导致下载undefined.excel
        // 解决：将已转为blob类型的data转回json格式，判断是否下载成功
        console.log(blob);

        let r = new FileReader();
        r.onload = function() {
            // 如果JSON.parse(this.result)不报错，说明this.result是json字符串，是下载报错情况的返回值，弹框提示
            // 如果JSON.parse(this.result)报错，说明下载成功，进入catch
            try {
                let resData = JSON.parse(this.result);
                if (resData && resData.code) {
                    reject(resData.msg);
                }
            } catch (error) {
                resolve(blob);
            }
        };
        r.readAsText(blob);
    });
};
/**
 * @desc 换算mm和px
 * @param {Number} value
 */
export const mmToPx = (value) => {
    // 获取dpi
    // let conversion_getDPI = function() {
    //     var arrDPI = [];
    //     if (window.screen.deviceXDPI) {
    //         arrDPI[0] = window.screen.deviceXDPI;
    //         arrDPI[1] = window.screen.deviceYDPI;
    //     } else {
    //         var tmpNode = document.createElement('DIV');
    //         tmpNode.style.cssText =
    //             'width:1in;height:1in;position:absolute;left:0px;top:0px;z-index:99;visibility:hidden';
    //         document.body.appendChild(tmpNode);
    //         arrDPI[0] = parseInt(tmpNode.offsetWidth);
    //         arrDPI[1] = parseInt(tmpNode.offsetHeight);
    //         tmpNode.parentNode.removeChild(tmpNode);
    //     }
    //     return arrDPI;
    // };
    // let dpi = 72; // 72较为通用，普遍
    // a4纸595 宽210mm
    let pxValue = (value * 595) / 210;
    return pxValue;
};

/**字号和px转换 */
export const wordFontSizeToPx = (font) => {
    const fontMap = {
        1: 42,
        2: 36,
        3: 26,
        4: 24,
        5: 22,
        6: 18,
        7: 16,
        8: 15,
        9: 14,
        10: 12,
        11: 10.5,
        12: 9
    };
    return fontMap[font];
};
/**
 * 校验字母和数字
 * @param {String} value - 内容，必传
 * @param {Number} min - 最小长度，选传，默认1
 * @param {Number} max - 最大长度，选传，默认20
 */
export const isLetterOrNumber = (value, min = 1, max = 20) => {
    let reg = new RegExp(`^[A-Za-z0-9]{${min},${max}}$`);
    return reg.test(value.trim());
};

/**
 * 切割字符串，使文本按自定义长度换行
 * @param {String} str - 字符串，必传
 * @param {Number} startIndex - 起始下标
 * @param {Number} len - 一行可显示字符数
 */
export const subString = (str, startIndex, len) => {
    let contentArr = [];
    function subStringFn(str, startIndex, len) {
        let newLength = 0;
        let sIdx = startIndex;
        let newStr = '';
        let chineseRegex = /[^\x00-\xff]/g;
        let singleChar = '';
        let strLength = str.replace(chineseRegex, '**').length;
        let contentLen = str.length;
        for (let i = sIdx; i < strLength; i++) {
            singleChar = str.charAt(i).toString();
            if (singleChar.match(chineseRegex) != null) {
                newLength += 2;
                startIndex++;
            } else {
                newLength++;
                startIndex++;
            }
            if (newLength > len) {
                startIndex--;
                break;
            }
            newStr += singleChar;
        }
        contentArr.push(newStr);
        if (startIndex <= contentLen - 1) {
            subStringFn(str, startIndex, len);
        }
    }
    subStringFn(str, startIndex, len);
    return contentArr.join('\n');
};
/**
 * 多页签页码字符串校验
 * @param {String} str - 字符串，必传
 */
export const isMultiplePageNo = (str, total) => {
    str = str.trim();
    if (
        !/\d+$/.test(str) ||
        !/^\d(,|-|\d)*\d*$/.test(str) ||
        /(,|-)(,|-)/.test(str)
    ) {
        return {
            status: false,
            msg: '请输入如1,3,5,7-10（英文逗号分割，其中-表示连序）的连页选择'
        };
    } else {
        let status = true;
        let msg = '';
        let arr1 = str.split(',');
        for (let i = 0; i < arr1.length; i++) {
            if (arr1[i].indexOf('-') === -1) {
                if (arr1[i] > total || arr1[i] < 1) {
                    status = false;
                    msg = '页码不能大于总页数或小于0';
                    break;
                }
            } else {
                let arr2 = arr1[i].split('-');
                if (Number(arr2[0]) >= Number(arr2[1])) {
                    status = false;
                    msg = '横杠之前页码需小于其之后的页码';
                    break;
                }
                if (
                    Number(arr2[0]) < 1 ||
                    Number(arr2[1]) < 1 ||
                    Number(arr2[0]) > total ||
                    Number(arr2[1]) > total
                ) {
                    status = false;
                    msg = '页码不能大于总页数或小于0';
                    break;
                }
            }
        }
        return {status,msg};
    }
};

/**
 * 防抖 -- 连续触发的函数，只执行一次
 * @param { Function } fn 需要执行的函数
 * @param { Number } delay 延迟时间
 */
export function debounce(fn, delay) {
    let timer = null;
    return function() {
        timer && clearTimeout(timer);
        timer = setTimeout(fn, delay);
    };
}

/**
 * 节流 -- 连续触发的函数，每隔一段时间执行一次
 * @param { Function } fn 需要执行的函数
 * @param { Number } delay 执行时间间隔
 */
export function throttle(fn, delay) {
    let flag = true;
    return function() {
        if (!flag) return;
        flag = false;
        setTimeout(() => {
            flag = true;
            fn();
        }, delay);
    };
}
