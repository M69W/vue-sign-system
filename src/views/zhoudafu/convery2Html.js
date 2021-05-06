import moment from 'moment';

let convery2Html = (orderInfo) => {
    let listData = orderInfo.order_content;
    const headerInfo = orderInfo.order_header;
    // let width = 100 / 22 + '%';
    // listData = listData.concat(listData)
    // listData = listData.concat(listData)
    // listData = listData.concat(listData)
    // listData = listData.concat(listData)
    let tableStr = '';
    listData.forEach((v, i) => {
        tableStr += `<tr>
            <td style="word-break:break-all;word-wrap:break-word;">${i === 0 ? '统计' : ''}</td>
            <td style="word-break:break-all;word-wrap:break-word;">${v.order_no}</td>
            <td style="word-break:break-all;word-wrap:break-word;">${v.stock_type || ''}</td>
            <td style="word-break:break-all;word-wrap:break-word;">${v.gold_type_desc || ''}</td>
            <td style="word-break:break-all;word-wrap:break-word;">${v.stock_nature_desc || ''}</td>
            <td style="word-break:break-all;word-wrap:break-word;">${v.mould_no || ''}</td>
            <td style="word-break:break-all;word-wrap:break-word;">${v.net_unit_price || ''}</td>
            <td style="word-break:break-all;word-wrap:break-word;">${v.qty}</td>
            <td style="word-break:break-all;word-wrap:break-word;">${v.gold_weight}</td>
            <td style="word-break:break-all;word-wrap:break-word;">${v.gold_weight_gram}</td>
            <td style="word-break:break-all;word-wrap:break-word;">${v.gold_value}</td>
            <td style="word-break:break-all;word-wrap:break-word;">${v.loss_rate || ''}</td>
            <td style="word-break:break-all;word-wrap:break-word;">${v.loss_weight}</td>
            <td style="word-break:break-all;word-wrap:break-word;">${v.loss_gold_cost}</td>
            <td style="word-break:break-all;word-wrap:break-word;">${v.labour_cost}</td>
            <td style="word-break:break-all;word-wrap:break-word;">${v.total_gold_labour_cost}</td>
            <td style="word-break:break-all;word-wrap:break-word;">${v.acc_qty}</td>
            <td style="word-break:break-all;word-wrap:break-word;">${v.outer_acc_qty}</td>
            <td style="word-break:break-all;word-wrap:break-word;">${v.acc_cost}</td>
            <td style="word-break:break-all;word-wrap:break-word;">${v.outer_acc_cost}</td>
            <td style="word-break:break-all;word-wrap:break-word;">${v.other_cost}</td>
            <td style="word-break:break-all;word-wrap:break-word;">${v.total_value}</td>
        </tr>`;
    });
    return `<!DOCTYPE html>
    <html lang="en">
    <head>
        <meta http-equiv="Content-Type" content="text/html; charset=utf-8"/>
        <title>单据</title>
        <style type="text/css">
            /*解决html转pdf文件中文不显示的问题*/
            body {
                font-family: "微软雅黑";
            }
            /* body {
                font-family: "宋体";
            } */

            /*设定纸张大小*/
            /* A4纸 */
            /* @page{size:210mm*297mm} */
            @page{size:a4}

            /* p {
                color: red;
            } */
        </style>
    </head>
    <body>
        <h1 style="text-align: center;">${headerInfo.title}</h1>
        <table style="border-collapse: collapse; width: 100%; height: 150px;" border="0">
            <tbody>
                <tr style="height: 50px;">
                    <td style="width: 10%; height: 50px;">
                        <strong>批次號：</strong>
                    </td>
                    <td style="width: 20%; height: 50px;">
                        <span>${headerInfo.batch_no}</span>
                    </td>
                    <td style="width: 3.3333%; height: 50px;">
                        <span>&nbsp;</span>
                    </td>
                    <td style="width: 10%; height: 50px;">
                        <strong>日期：</strong>
                    </td>
                    <td style="width: 20%; height: 50px;">
                        <span>${headerInfo.tran_date}</span>
                    </td>
                    <td style="width: 3.3333%; height: 50px;">
                        <span>&nbsp;</span>
                    </td>
                    <td style="width: 10%; height: 50px;">
                        <strong>發單部門：</strong>
                    </td>
                    <td style="width: 20%; height: 50px;">
                        <span>${headerInfo.order_dept_desc}</span>
                    </td>
                    <td style="width: 3.3333%; height: 50px;">
                        <span>&nbsp;</span>
                    </td>
                </tr>
                <tr style="height: 50px;">
                    <td style="width: 10%; height: 50px;">
                        <strong>工廠：</strong>
                    </td>
                    <td style="width: 20%; height: 50px;">
                        <span>${headerInfo.workshop_desc}</span>
                    </td>
                    <td style="width: 3.3333%; height: 50px;">
                        <span>&nbsp;</span>
                    </td>
                    <td style="width: 10%; height: 50px;">
                        <strong>操作人：</strong>
                    </td>
                    <td style="width: 20%; height: 50px;">
                        <span>${headerInfo.handler}</span>
                    </td>
                    <td style="width: 3.3333%; height: 50px;">
                        <span>&nbsp;</span>
                    </td>
                    <td style="width: 10%; height: 50px;">
                        <strong>受託公司：</strong>
                    </td>
                    <td style="width: 20%; height: 50px;">
                        <span>${headerInfo.agent_comp_desc}</span>
                    </td>
                    <td style="width: 3.3333%; height: 50px;">
                        <span>&nbsp;</span>
                    </td>
                </tr>
                <tr style="height: 50px;">
                    <td style="width: 10%; height: 50px;">
                        <strong>公司：</strong>
                    </td>
                    <td style="width: 20%; height: 50px;">
                        <span>${headerInfo.comp_desc}</span>
                    </td>
                    <td style="width: 3.3333%; height: 50px;">
                        <span>&nbsp;</span>
                    </td>
                    <td style="width: 10%; height: 50px;">
                        <strong>操作組別：</strong>
                    </td>
                    <td style="width: 20%; height: 50px;">
                        <span>${headerInfo.dept_desc}</span>
                    </td>
                    <td style="width: 3.3333%; height: 50px;">
                        <span>&nbsp;</span>
                    </td>
                    <td style="width: 10%; height: 50px;">
                        <strong>位置：</strong>
                    </td>
                    <td style="width: 20%; height: 50px;">
                        <span>${headerInfo.location}</span>
                    </td>
                    <td style="width: 3.3333%; height: 50px;">
                        <span>&nbsp;</span>
                    </td>
                </tr>
            </tbody>
        </table>
        <table style="border-collapse: collapse; width: 100%;word-break: break-all;table-layout:fixed;text-align:center;" border="1">
            <thead>
                <tr>
                    <td style="word-break:break-all;"><strong>統計</strong></td>
                    <td style="word-break:break-all;"><strong>單號</strong></td>
                    <td style="word-break:break-all;"><strong>貨類</strong></td>
                    <td style="word-break:break-all;"><strong>發單金類</strong></td>
                    <td style="word-break:break-all;"><strong>名稱</strong></td>
                    <td style="word-break:break-all;"><strong>中模</strong></td>
                    <td style="word-break:break-all;"><strong>金價</strong></td>
                    <td style="word-break:break-all;"><strong>件數</strong></td>
                    <td style="word-break:break-all;"><strong>金重</strong></td>
                    <td style="word-break:break-all;"><strong>金重（g）</strong></td>
                    <td style="word-break:break-all;"><strong>金值</strong></td>
                    <td style="word-break:break-all;"><strong>耗率</strong></td>
                    <td style="word-break:break-all;"><strong>耗重</strong></td>
                    <td style="word-break:break-all;"><strong>耗金額</strong></td>
                    <td style="word-break:break-all;"><strong>工值</strong></td>
                    <td style="word-break:break-all;"><strong>金工耗統值</strong></td>
                    <td style="word-break:break-all;"><strong>配入粒数</strong></td>
                    <td style="word-break:break-all;"><strong>匯入粒数</strong></td>
                    <td style="word-break:break-all;"><strong>配入石值</strong></td>
                    <td style="word-break:break-all;"><strong>匯入石值</strong></td>
                    <td style="word-break:break-all;"><strong>其他成本</strong></td>
                    <td style="word-break:break-all;"><strong>統值</strong></td>
                </tr>
            </thead>
            <tbody>
                ${tableStr}
            </tbody>
        </table>
        <p>&nbsp;</p>
        <table style="border-collapse: collapse; height: 100px;" border="0" width="100%">
            <tbody>
                <tr style="height: 50px;width: 100%;">
                    <td style="width: 10%; height: 50px;">
                        <p><span style="font-weight:bold;">發貨人：</span></p>
                    </td>
                    <td style="width: 30%; height: 50px;border-bottom: 1px solid #000;">
                        <p><span style="">&nbsp;&nbsp;&nbsp;</span></p>
                    </td>
                    <td style="width: 10%; height: 50px;">
                        <p>&nbsp;</p>
                    </td>
                    <td style="width: 10%; height: 50px;">
                        <p><span style="font-weight:bold;">收貨人：</span></p>
                    </td>
                    <td style="width: 30%; height: 50px;border-bottom: 1px solid #000;">
                        <p><span style="">&nbsp;&nbsp;&nbsp;</span></p>
                    </td>
                    <td style="width: 10%; height: 50px;">
                        <p>&nbsp;</p>
                    </td>
                </tr>
                <tr style="height: 50px;width: 100%;">
                    <td style="width: 10%; height: 50px;">
                        <p>&nbsp;</p>
                    </td>
                    <td style="width: 30%; height: 50px;">
                        <p>&nbsp;</p>
                    </td>
                    <td style="width: 10%; height: 50px;">
                        <p>&nbsp;</p>
                    </td>
                    <td style="width: 10%; height: 50px;">
                        <p><span style="font-weight:bold;">交收日期：</span></p>
                    </td>
                    <td style="width: 30%; height: 50px;border-bottom: 1px solid #000;">
                        <p><span style="">${moment().format('YYYY-MM-DD')}</span></p>
                    </td>
                    <td style="width: 10%; height: 50px;">
                        <p>&nbsp;</p>
                    </td>
                </tr>
            </tbody>
        </table>
    </body>
</html>`;
};
export default convery2Html;
