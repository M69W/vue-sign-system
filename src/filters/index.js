// 定义全局过滤器

/* 印章类型 */
let sealType = (type) => {
    let desc = '';
    switch (type) {
        case '01':
            desc = '行政章';
            break;
        case '02':
            desc = '财务专用章';
            break;
        case '03':
            desc = '业务专用章';
            break;
        case '04':
            desc = '法定代表人名章';
            break;
        case '05':
            desc = '报关专用章';
            break;
        case '06':
            desc = '合同专用章';
            break;
        case '07':
            desc = '其他公章';
            break;
        case '08':
            desc = '电子杂章';
            break;
        case '09':
            desc = '电子私章';
            break;
        default:
            desc = '未知';
            break;
    }
    return desc;
};

/* 介质类型 */
let mediumType = (type) => {
    let desc = '';
    switch (type) {
        case '01':
            desc = '云印章';
            break;
        case '02':
            desc = 'ukey印章';
            break;
        default:
            desc = '未知';
            break;
    }
    return desc;
};
/* 合同状态 */
let filterContractStatus = (statusCode) => {
    const statusMap = {
        '01': '草稿',
        '02': '已撤销',
        '03': '已拒签',
        '0401': '待我签署',
        '0402': '待他人签',
        '0403': '待他人签',
        '05': '签署完成',
        '06': '已过期',
        '070': '待填写',
        '071': '待他人填写',
        // '0405': '待我审批',
        // '040602': '待他人审批',
        '09': '已驳回',
        // `审批流程`时
        '0010': '待我审批',
        '0110': '待他人审批'
    };
    return statusMap[statusCode];
};

export { sealType, mediumType, filterContractStatus };
