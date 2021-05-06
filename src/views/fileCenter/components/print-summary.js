/**
 * @summary 输出打印摘要的html
 * @param {Object} contractInfo 合同信息
 * @param {String} code 验证码
 * @param {String} qrCode 二维码
 */

const printSummary = (contractInfo, code, qrCode) => {
    let printTime = new Date();
    let signInfo = '';
    contractInfo.signStatusInfo.forEach((v) => {
        signInfo += `<tr>
            <td>&nbsp;&nbsp;</td>
            <td
                style="line-height: 40px;word-break: break-all;padding: 0 5px;"
            >
                ${v.signName}
            </td>
            <td
                style="line-height: 40px;padding: 0 5px;white-space: nowrap;"
            >
                ${v.signDate || '-'}
            </td>
            <td
                style="line-height: 40px;padding: 0 5px;white-space: nowrap;"
            >
                ${v.signStatus === '03' ? '完成签署' : '未完成'}
            </td>
            <td
                style="line-height: 40px;padding: 0 5px;white-space: nowrap;"
            >
            ${v.signStatus === '03' ? '有效' : '-'}
            </td>
        </tr>`;
    });
    return `<!DOCTYPE html>
    <html lang="en">
        <head>
            <meta charset="UTF-8" />
            <meta name="viewport" content="width=device-width, initial-scale=1.0" />
            <meta http-equiv="X-UA-Compatible" content="ie=edge" />
            <title>打印摘要</title>
        </head>
        <!-- width: 595px;height: 841px; -->
        <body
            style="width: 595px;margin:0;padding:0;font-style:normal;font-weight:normal;padding: 12px 20px 4px;font-size: 14px;color: #333;"
        >
            <p
                style="text-align: left;margin-bottom: 0px;font-size:18px;line-height: 50px;"
            >
                安印科技
            </p>
            <p style="text-align: left;margin-top:0px;margin-bottom: 4px;line-height:0;height:0;border-bottom: 4px solid #2a68c8;font-size:12px;">&nbsp;</p>
            <div>
                <p
                    style="color: #99a9bf;text-align: right;font-size: 12px;line-height: 29px;border-top: 1px solid #2a68c8;"
                >
                    编号：${contractInfo.contractId}
                </p>
                <p style="color: #2a68c8;text-align: center;line-height: 45px;font-size:16px;">
                    ${contractInfo.contractTheme}
                </p>
                <div style="width:100%;">
                    <table cellpadding="0" cellspacing="0" width="100%">
                        <tr>
                            <td
                                style="text-align: center;line-height: 40px;background-color: #dee6f9;width: 50%;border-bottom: 1px solid #c4cfdc;border-right: 1px solid #c4cfdc;border-left: 1px solid #c4cfdc;"
                            >
                                验证码
                            </td>
                            <td
                                style="text-align: center;line-height: 40px;background-color: #dee6f9;width: 50%;border-bottom: 1px solid #c4cfdc;border-right: 1px solid #c4cfdc;"
                            >
                                二维码
                            </td>
                        </tr>
                        <tr>
                            <td
                                style="text-align: center;width: 50%;border-bottom: 1px solid #c4cfdc;border-right: 1px solid #c4cfdc;border-left: 1px solid #c4cfdc;padding-top:10px;"
                            >
                                ${
                                    code
                                        ? `<p style="text-align: center;font-weight: 600;">
                                    ${code}
                                </p>
                                <p
                                    style="text-align: center;color: #999;font-size: 12px;margin-top: 12px;"
                                >
                                    在线验证码
                                </p>`
                                        : '<p style="margin-top:10px;">无</p>'
                                }
                            </td>
                            <td
                                style="text-align: center;width: 50%;border-bottom: 1px solid #c4cfdc;border-right: 1px solid #c4cfdc;padding-top:10px;"
                            >
                                ${
                                    qrCode
                                        ? `<img
                                    src="${qrCode}"
                                    alt=""
                                    width="80"
                                    height="80"
                                    style="vertical-align:middle;margin-top:10px;"
                                />
                                <p
                                    style="text-align: center;color: #999;font-size: 12px;margin-top: 0;margin-bottom: 12px;"
                                >
                                    在线验证码
                                </p>`
                                        : '<p style="margin-top:10px;">无</p>'
                                }
                            </td>
                        </tr>
                    </table>
                </div>
                <div>
                    <p style="margin-bottom: 12px;margin-top: 20px;font-size:16px;">
                        签署方
                    </p>
                    <table cellpadding="0" cellspacing="0" style="" width="100%">
                        <tr style="background-color: #f4f6f8;">
                            <td>&nbsp;&nbsp;</td>
                            <td style="line-height: 40px;padding: 0 5px;">
                                姓名/印章名称
                            </td>
                            <td style="line-height: 40px;padding: 0 5px;">
                                时间
                            </td>
                            <td style="line-height: 40px;padding: 0 5px;">
                                完成签名/签章
                            </td>
                            <td style="line-height: 40px;padding: 0 5px;">
                                签名有效
                            </td>
                        </tr>
                        ${signInfo}
                    </table>
                </div>
            </div>
            <p
                style="line-height: 29px;font-size: 12px;text-align: right;color: #c4cfdc;border-top: 1px solid #2a68c8;"
            >
                打印时间：${printTime.getFullYear()}年${printTime.getMonth() +
        1}月${printTime.getDate()}日 ${printTime.getHours()}:${printTime.getMinutes()}:${printTime.getSeconds()}
            </p>
        </body>
    </html>
`;
};

export default printSummary;
