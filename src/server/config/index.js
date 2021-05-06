const noLoading = (requestUrl) => {
    if (
        // /\/websign\/checkKeyList$/.test(requestUrl) ||
        /\/login\/checkKeyList$/.test(requestUrl) ||
        // /\/websign\/getKeyInfo/.test(requestUrl) ||
        /\/login\/getKeyCertInfo/.test(requestUrl) ||
        // /\/websign\/loginKey$/.test(requestUrl) ||
        /\/verify\/judgePosition$/.test(requestUrl)
    ) {
        return true;
    } else {
        return false;
    }
};
const noErrorWarning = (requestUrl) => {
    if (
        /\/getVersion$/.test(requestUrl) ||
        /\/websign\/checkKeyList$/.test(requestUrl) ||
        /\/login\/checkKeyList$/.test(requestUrl) ||
        /\/websign\/getKeyInfo$/.test(requestUrl) ||
        /\/login\/getKeyCertInfo$/.test(requestUrl) ||
        /\/websign\/loginKey$/.test(requestUrl) ||
        /\/websign\/signBylist$/.test(requestUrl) ||
        /\/sealManager\/stampRecordApplyList/.test(requestUrl)
    ) {
        return true;
    } else {
        return false;
    }
};
const ifReturnRightNow = (requestUrl) => {
    if (
        /\/getVersion$/.test(requestUrl) ||
        /\/websign\/checkKeyList$/.test(requestUrl) ||
        /\/login\/checkKeyList$/.test(requestUrl) ||
        /\/websign\/getKeyInfo$/.test(requestUrl) ||
        /\/login\/getKeyCertInfo$/.test(requestUrl) ||
        /\/websign\/loginKey$/.test(requestUrl) ||
        /\/websign\/signBylist$/.test(requestUrl) ||
        /\/user\/loginByUserNameAndPwd$/.test(requestUrl) ||
        /\/sealManager\/getSealList$/.test(requestUrl) ||
        /\/sealManager\/stampRecordApplyList/.test(requestUrl) ||
        /\/sealManager\/addUseSeal/.test(requestUrl) ||
        /\/file\/fileUseSeal$/.test(requestUrl) ||
        /\/contract\/contractUseSeal$/.test(requestUrl)
    ) {
        return true;
    } else {
        return false;
    }
};
export { ifReturnRightNow, noErrorWarning, noLoading };
