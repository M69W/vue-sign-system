export default {
    tableHeader: [
        {
            prop: 'name',
            label: '物理印章名称',
            width: '160'
        },
        {
            prop: 'code',
            label: '物理印章编码',
            width: '160'
        },
        {
            prop: 'typeF',
            label: '印章类型',
            width: '160'
        },
        {
            prop: 'department',
            label: '保管单位/部门',
            width: '190'
        },
        {
            prop: 'keeper',
            label: '保管人',
            width: '100'
        },
        {
            prop: 'statusF',
            label: '印章状态',
            width: '100'
        },
        {
            prop: 'user',
            label: '领用人',
            width: '100'
        },
        {
            prop: 'date',
            label: '领用时间',
            width: '160'
        }
    ],


    // tableData: [
    //     {
    //         name: '安印行政章',
    //         code: '566454544564654',
    //         type: '行政章',
    //         department: '人事部',
    //         keeper: '小普陀',
    //         status: '完好',
    //         user: '小领用',
    //         date: '2020-08-11 15:43'
    //     },
    //     {
    //         name: '安印行政章',
    //         code: '566454544564654',
    //         type: '行政章',
    //         department: '人事部',
    //         keeper: '小普陀',
    //         status: '损坏',
    //         user: '小领用',
    //         date: '2020-08-11 15:43'
    //     },
    //     {
    //         name: '安印行政章',
    //         code: '566454544564654',
    //         type: '行政章',
    //         department: '人事部',
    //         keeper: '小普陀',
    //         status: '领用',
    //         user: '小领用',
    //         date: '2020-08-11 15:43'
    //     },
    // ],

    tableHeaderLog: [
        {
            prop: 'date',
            label: '时间',
            width: 200
        },
        {
            prop: 'typeF',
            label: '操作类型',
            width: 160
        },
        {
            prop: 'desc',
            label: '操作说明',
            width: 200
        },
        {
            prop: 'user',
            label: '用户',
            width: 160
        },
    ],

    // tableDataLog: [
    //     {
    //         date: '2020-08-11 15:43',
    //         type: '归还',
    //         desc: '归还了一个印章',
    //         user: '小王'
    //     },
    //     {
    //         date: '2020-08-11 15:43',
    //         type: '领用',
    //         desc: '借来盖一份合同',
    //         user: '张三'
    //     },

    // ]
}