// 重写messge提示
import { Message } from 'element-ui';

let messageInfo;
function mainMessage(type = null) {
    return function(options) {
        if (messageInfo) {
            messageInfo.close();
        }
        if (type) {
            messageInfo = Message[type](options);
        } else {
            messageInfo = Message(options);
        }
    };
}
const messageFn = mainMessage();
['success', 'info', 'error', 'warning'].forEach((v) => {
    messageFn[v] = mainMessage(v);
});
export const message = messageFn;
