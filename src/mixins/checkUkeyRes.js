export const checkUkeyRes = {
    methods: {
        successUKeyCheckCode(ret) {
            if (typeof ret == 'string') {
                ret = JSON.parse(ret);
            }
            // console.log(ret);
            let errMsg = '';
            if (ret.ret == 0) {
                return true;
            } else if (ret.ret == -1) {
                this.$updateUKeyDrive();
                return false;
            } else if (ret.ret == 106) {
                this.$message.warning({
                    message: 'PIN码不正确',
                    duration: 1500,
                    customClass: 'zZindex'
                });
                return false;
            } else {
                this.$message.warning({
                    message: ret.errMsg,
                    type: 'warning',
                    duration: 1500,
                    customClass: 'zZindex'
                });
                return false;
            }
        }
    }
};
