/**
 * 公共函数工具类
 */
import { Notify } from 'vant';

const SharedUtils = {
    // JSON 缩进格式输出
    log(obj) {
        console.log(JSON.stringify(obj, null, 4))
    },
    // 引用对象的深克隆
    clone(obj) {
        return JSON.parse(JSON.stringify(obj))
    },

    // Vant 框架
    // ---------------------------------
    // 通知 Notify
    notify(type, message) {
        Notify.setDefaultOptions({
            className: 'vant-notify-extension',
            duration: 2000
        })

        Notify({ 
            type: type, 
            message: message
        })
    },


    // ---------------------------------
    // 日期格式化
    dateFormat(fmt, date) {
        let ret;
        const opt = {
            "y+": date.getFullYear().toString(),        // 年
            "M+": (date.getMonth() + 1).toString(),     // 月
            "d+": date.getDate().toString(),            // 日
            "H+": date.getHours().toString(),           // 时
            "m+": date.getMinutes().toString(),         // 分
            "s+": date.getSeconds().toString()          // 秒
            // 有其他格式化字符需求可以继续添加，必须转化成字符串
        };

        for (let k in opt) {
            ret = new RegExp("(" + k + ")").exec(fmt);
            if (ret) {
                fmt = fmt.replace(ret[1], (ret[1].length == 1) ? (opt[k]) : (opt[k].padStart(ret[1].length, "0")))
            };
        };
        return fmt;
    }
}



export default SharedUtils