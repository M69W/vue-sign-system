import moment from 'moment'
export const htmlContent = ({ company, name, phone }, tableData) => {
    let data = '';
    let businessList = []
    tableData.forEach((v) => {
        businessList.push(v.goodsName)
        data += `<tr style="line-height: 40px;">
            <td>${v.goodsName}</td>
            <td>${v.number}</td>
            <td>${v.commodityAmount}</td>
            <td>${v.bookkeepingDateBegin}-${v.bookkeepingDateAfter}</td>
        </tr>`;
    });
    return `<!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8" />
            <meta name="viewport" content="width=device-width, initial-scale=1.0" />
            <meta http-equiv="X-UA-Compatible" content="ie=edge" />
            <title>代办协议</title>
        </head>
        <!-- width: 595px;height: 841px; -->
        <body
            style="margin:0;padding:0;font-style:normal;font-weight:normal;padding: 50px;font-size: 14px;color: #333;"
        >
            <h2 style="line-height: 36px;text-align: center">
                代办协议
            </h2>
            <div>
                <p style="line-height: 29px;">
                    甲方公司：${company}
                </p>
                <div style="width:100%;">
                    <table cellpadding="0" cellspacing="0" width="100%">
                        <tr>
                            <td style="line-height: 40px;">
                                甲方：
                            </td>
                            <td style="line-height: 40px;">
                                ${name}
                            </td>
                            <td style="line-height: 40px;">
                                乙方：
                            </td>
                            <td style="line-height: 40px;">
                                信卓财税
                            </td>
                        </tr>
                        <tr style="line-height: 40px;">
                            <td>联系电话：</td>
                            <td>${phone}</td>
                            <td>联系电话：</td>
                            <td>0755-12345678</td>
                        </tr>
                    </table>
                </div>
                <p>
                    双方本着友好协商的原则，就乙方为甲方办理如下业务，达成如下协议：
                </p>
                <p>
                    一、甲方向乙方咨询和办理：[ ${businessList.join('，')} ] 业务事宜；甲方向乙方提供相关的合法资料。
                </p>
                <p>
                    二、办理费用：见下面服务详细内容列表
                </p>
                <p>
                    三、办理时长：为正常办理时长（预估时间仅供参考）。
                </p>
                <div style="margin-bottom: 20px">
                    <table cellpadding="0" cellspacing="0" width="100%" border="1">
                        <tr style="line-height: 40px;">
                            <td>
                                服务名称
                            </td>
                            <td>
                                数量
                            </td>
                            <td>
                                实付金额
                            </td>
                            <td>
                                记账起止时间
                            </td>
                        </tr>
                        ${data}
                    </table>
                </div>
            </div>
            四、双方义务及责任：
            <p>
                （一）甲方代表人须具有代表甲方办理该项业务的资格；甲方为转委托人的，甲方须得到委托方的合法授权，否则，因甲方代表或甲方代理资质不合法产生的所有费用、法律责任全部由甲方承担。
            </p>
            <p>
                （二）甲方应积极配合乙方的工作并按乙方要求及时提供业务相关的证照和材料，签复乙方提出的有关本次业务的相关问题。
            </p>
            <p>
                （三）甲方安排专人负责协助乙方业务工作，并与乙方交接所有业务所需证照及相关材料。
            </p>
            <p>
                （四）甲方应保证所提供的资料的真实性、合法性和准确性。如因甲方提供相关证照或答复不及时，而导致的延误，均由甲方负责。
            </p>
            <p>
                （五）甲方不得有授意乙方实施违反国家法律、法规的行为。如有类似情况，经劝告仍不停止的，乙方有权终止合同，并扣除相应的服务费。
            </p>
            <p>
                （六）因甲方单方面原因而导致的政府罚款及相关部门的其他收费，由甲方另行支付，不包含在上述代理费中。
            </p>
            <p>
                （七）协议签订后，双方应积极按约履行，乙方开始提供服务后，甲方无故终止本协议的，仍应向乙方支付本合同约定的服务费及产生的代收费。
            </p>
            <p>
                （八）本协议履行过程中发生的争议，应由双方协商解决；协商不成，提交乙方所在地人民法院管辖。
            </p>
            <p>
                （九）因政府原因导致延误办理时间或影响业务办理结果的，乙方不承担责任。
            </p>
            <p>
                （十）如因甲方原因导致业务无法正常办理，经双方协商无进展，乙方有权单方终止协议，并收取甲方该业务总服务费的30%作为劳务费，同时有权向甲方追收已产生的代收费。如因乙方原因导致业务无法正常办理，全额退还甲方所付款项。
            </p>
            <p>
                （十一）甲方应于本协议签署之日起三日内或双方约定的付款期限内支付本协议第二条约定的服务费，否则乙方有权额外按天追收（甲方业务应收总额的5%/天）滞纳金，并追究其违约责任。如委托办理业务过程中，甲方对乙方造成巨大损失，有权要求甲方进行相应的赔偿。
            </p>
            <p>
                （十二）甲方承诺：甲方已明白公司成立法则及相关条例，并确认以上所提供的资料真实、合法、有效。如因资料不实、办理过程中或办理完毕及后期违法经营而引起的一切法律责任，概由甲方全权承担。
            </p>
            <p>
                （十三）未经甲方允许，乙方不得擅自泄漏甲方的信息或资料。
            </p>
            <p>
                （十四）除双方协商一致外，本协议手写的内容均属无效。乙方在完成甲方以上业务服务后，本协议自行终止。
            </p>
            <p style="font-weight: bold">
                （十五）乙方收款帐户信息如下：开户名：深圳市信卓财税代理有限公司
                账号：755929950410701 开户行：招商银行深圳科苑支行
            </p>
            <table cellpadding="0" cellspacing="0" width="100%">
                <tr>
                    <td style="line-height: 40px;">
                        甲方：
                    </td>
                    <td style="line-height: 40px;">
                        ${company}
                    </td>
                    <td style="line-height: 40px;">
                        乙方：
                    </td>
                    <td style="line-height: 40px;font-weight: bold;">
                        信卓财税
                    </td>
                </tr>
                <tr style="line-height: 40px;">
                    <td>签约代表人（签字）：</td>
                    <td>&nbsp;</td>
                    <td>乙方签约代表人（签字）：</td>
                    <td>&nbsp;</td>
                </tr>
                <tr style="line-height: 40px;">
                    <td>日期：</td>
                    <td>${moment().format('YYYY-MM-DD')}</td>
                    <td>日期：</td>
                    <td>${moment().format('YYYY-MM-DD')}</td>
                </tr>
            </table>
        </body>
    </html>
    `;
};
