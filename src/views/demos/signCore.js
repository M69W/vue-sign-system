var base64EncodeChars =
    'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/';
var base64DecodeChars = new Array(
    -1,
    -1,
    -1,
    -1,
    -1,
    -1,
    -1,
    -1,
    -1,
    -1,
    -1,
    -1,
    -1,
    -1,
    -1,
    -1,
    -1,
    -1,
    -1,
    -1,
    -1,
    -1,
    -1,
    -1,
    -1,
    -1,
    -1,
    -1,
    -1,
    -1,
    -1,
    -1,
    -1,
    -1,
    -1,
    -1,
    -1,
    -1,
    -1,
    -1,
    -1,
    -1,
    -1,
    62,
    -1,
    -1,
    -1,
    63,
    52,
    53,
    54,
    55,
    56,
    57,
    58,
    59,
    60,
    61,
    -1,
    -1,
    -1,
    -1,
    -1,
    -1,
    -1,
    0,
    1,
    2,
    3,
    4,
    5,
    6,
    7,
    8,
    9,
    10,
    11,
    12,
    13,
    14,
    15,
    16,
    17,
    18,
    19,
    20,
    21,
    22,
    23,
    24,
    25,
    -1,
    -1,
    -1,
    -1,
    -1,
    -1,
    26,
    27,
    28,
    29,
    30,
    31,
    32,
    33,
    34,
    35,
    36,
    37,
    38,
    39,
    40,
    41,
    42,
    43,
    44,
    45,
    46,
    47,
    48,
    49,
    50,
    51,
    -1,
    -1,
    -1,
    -1,
    -1
);
//����ķ���
function base64encode(str) {
    var out, i, len;
    var c1, c2, c3;
    len = str.length;
    i = 0;
    out = '';
    while (i < len) {
        c1 = str.charCodeAt(i++) & 0xff;
        if (i == len) {
            out += base64EncodeChars.charAt(c1 >> 2);
            out += base64EncodeChars.charAt((c1 & 0x3) << 4);
            out += '==';
            break;
        }
        c2 = str.charCodeAt(i++);
        if (i == len) {
            out += base64EncodeChars.charAt(c1 >> 2);
            out += base64EncodeChars.charAt(
                ((c1 & 0x3) << 4) | ((c2 & 0xf0) >> 4)
            );
            out += base64EncodeChars.charAt((c2 & 0xf) << 2);
            out += '=';
            break;
        }
        c3 = str.charCodeAt(i++);
        out += base64EncodeChars.charAt(c1 >> 2);
        out += base64EncodeChars.charAt(((c1 & 0x3) << 4) | ((c2 & 0xf0) >> 4));
        out += base64EncodeChars.charAt(((c2 & 0xf) << 2) | ((c3 & 0xc0) >> 6));
        out += base64EncodeChars.charAt(c3 & 0x3f);
    }
    return out;
}
//����ķ���
function base64decode(str) {
    var c1, c2, c3, c4;
    var i, len, out;
    len = str.length;
    i = 0;
    out = '';
    while (i < len) {
        do {
            c1 = base64DecodeChars[str.charCodeAt(i++) & 0xff];
        } while (i < len && c1 == -1);
        if (c1 == -1) break;

        do {
            c2 = base64DecodeChars[str.charCodeAt(i++) & 0xff];
        } while (i < len && c2 == -1);
        if (c2 == -1) break;
        out += String.fromCharCode((c1 << 2) | ((c2 & 0x30) >> 4));

        do {
            c3 = str.charCodeAt(i++) & 0xff;
            if (c3 == 61) return out;
            c3 = base64DecodeChars[c3];
        } while (i < len && c3 == -1);
        if (c3 == -1) break;
        out += String.fromCharCode(((c2 & 0xf) << 4) | ((c3 & 0x3c) >> 2));

        do {
            c4 = str.charCodeAt(i++) & 0xff;
            if (c4 == 61) return out;
            c4 = base64DecodeChars[c4];
        } while (i < len && c4 == -1);
        if (c4 == -1) break;
        out += String.fromCharCode(((c3 & 0x03) << 6) | c4);
    }
    return out;
}
function utf16to8(str) {
    var out, i, len, c;
    out = '';
    len = str.length;
    for (i = 0; i < len; i++) {
        c = str.charCodeAt(i);
        if (c >= 0x0001 && c <= 0x007f) {
            out += str.charAt(i);
        } else if (c > 0x07ff) {
            out += String.fromCharCode(0xe0 | ((c >> 12) & 0x0f));
            out += String.fromCharCode(0x80 | ((c >> 6) & 0x3f));
            out += String.fromCharCode(0x80 | ((c >> 0) & 0x3f));
        } else {
            out += String.fromCharCode(0xc0 | ((c >> 6) & 0x1f));
            out += String.fromCharCode(0x80 | ((c >> 0) & 0x3f));
        }
    }
    return out;
}
function utf8to16(str) {
    var out, i, len, c;
    var char2, char3;
    out = '';
    len = str.length;
    i = 0;
    while (i < len) {
        c = str.charCodeAt(i++);
        switch (c >> 4) {
            case 0:
            case 1:
            case 2:
            case 3:
            case 4:
            case 5:
            case 6:
            case 7:
                // 0xxxxxxx
                out += str.charAt(i - 1);
                break;
            case 12:
            case 13:
                // 110x xxxx   10xx xxxx
                char2 = str.charCodeAt(i++);
                out += String.fromCharCode(((c & 0x1f) << 6) | (char2 & 0x3f));
                break;
            case 14:
                // 1110 xxxx  10xx xxxx  10xx xxxx
                char2 = str.charCodeAt(i++);
                char3 = str.charCodeAt(i++);
                out += String.fromCharCode(
                    ((c & 0x0f) << 12) |
                        ((char2 & 0x3f) << 6) |
                        ((char3 & 0x3f) << 0)
                );
                break;
        }
    }
    return out;
}

/**
 * Created by admin on 2017/2/22.
 * the core js module of sign.
 */
var signTsa = true; //true: 签章附带时间戳  false: 签章不附带时间戳
var serverURL = 'http://api.i-yin.net:80'; //签章服务器地址
var tsaURL = 'http://api.i-yin.net/tspserver/tsp'; // 时间戳地址
var tsaUser = ''; // 时间戳用户名
var tsaPassword = ''; // 时间戳密码

var thisURL = document.URL;
var docPara = thisURL.split('?')[1];
var docID = docPara.split('=')[1];
var currentSelectSealID;
var restoreData = null;

function GetDPI() {
    var arrDPI = new Array();
    if (window.screen.deviceXDPI) {
        arrDPI[0] = window.screen.deviceXDPI;
        arrDPI[1] = window.screen.deviceYDPI;
    }

    return arrDPI;
}

function ShowSeal(
    sealID,
    sealPath,
    parentDiv,
    centerX,
    centerY,
    width,
    height
) {
    var imgDiv = document.getElementById(sealID);
    if (imgDiv != null) {
        return;
    }

    var arrDPI = GetDPI();
    var widthPx = (width * arrDPI[0]) / 25.4;
    var heightPx = (height * arrDPI[1]) / 25.4;
    var left = parseInt(centerX) - parseInt(widthPx) / 2;
    var top = parseInt(centerY) - parseInt(heightPx) / 2;

    //动态插入章模图片
    var divName = 'div' + sealID;
    var divElement = document.createElement('div');
    divElement.id = divName;
    divElement.style.visibility = 'visible';
    divElement.style.position = 'absolute';
    divElement.style.zIndex = '9000';
    divElement.style.left = left + 'px';
    divElement.style.top = top + 'px';
    divElement.style.width = widthPx + 'px';
    divElement.style.height = heightPx + 'px';

    divElement.innerHTML =
        "<img id = '" +
        sealID +
        "' class = 'sealImage' style='filter:Chroma(Color = #FFFFFF)' alt border='0' src='data:image/bmp;base64," +
        sealPath +
        "' ondrag='return false' width='" +
        divElement.style.width +
        "'>";
    var divParent = document.getElementById(parentDiv);
    divParent.appendChild(divElement);
    SetImageAlpha(sealID);
}

function SetImageAlpha(sealID) {
    var oCanvas = document.createElement('canvas');
    var oImg = document.getElementById(sealID);
    var newImg = new Image();
    var ctx = oCanvas.getContext('2d');
    newImg.src = oImg.src;
    newImg.onload = function() {
        oCanvas.width = newImg.width;
        oCanvas.height = newImg.height;
        ctx.drawImage(newImg, 0, 0);
        var imgData = ctx.getImageData(0, 0, oCanvas.width, oCanvas.height);

        for (var i = 0; i < imgData.data.length; i += 4) {
            if (
                imgData.data[i] == 255 &&
                imgData.data[i + 1] == 255 &&
                imgData.data[i + 2] == 255 &&
                imgData.data[i + 3] == 255
            ) {
                imgData.data[i + 3] = 0;
            }
        }
        ctx.putImageData(imgData, 0, 0);
        oImg.src = oCanvas.toDataURL('image/png');
    };
}

function S4() {
    return (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1);
}

function NewGuid() {
    return (
        S4() +
        S4() +
        '-' +
        S4() +
        '-' +
        S4() +
        '-' +
        S4() +
        '-' +
        S4() +
        S4() +
        S4()
    );
}

function IYIN_AddSeal(plantDataBase64, parentDivID, centerX, centerY) {
    //进行数字签名
    var signRet;

    var signID = NewGuid();
    var webSignOcx = document.getElementById('IYIN_WebSign');
    webSignOcx.IYIN_ActiveX_Init();
    webSignOcx.IYIN_ActiveX_SetSignServerUrl(serverURL);
    webSignOcx.IYIN_ActiveX_SetTsaServerParam(tsaURL, tsaUser, tsaPassword);
    webSignOcx.IYIN_ActiveX_SetTsa(signTsa);
    signRet = webSignOcx.IYIN_ActiveX_Sign(plantDataBase64);

    if (signRet != 0) {
        return false;
    }

    var signResult = webSignOcx.IYIN_ActiveX_GetSignData();
    var sealImage = webSignOcx.IYIN_ActiveX_GetSealImageBase64();

    //保存签章数据
    var signObj = new Object();
    signObj.id = signID;
    signObj.signResult = signResult;
    signObj.sealImage = sealImage;
    signObj.centerX = centerX;
    signObj.centerY = centerY;
    signObj.width = webSignOcx.IYIN_ActiceX_GetSealImageWidth().toString();
    signObj.height = webSignOcx.IYIN_ActiceX_GetSealImageHeight().toString();
    //显示章模
    ShowSeal(
        signID,
        sealImage,
        parentDivID,
        centerX,
        centerY,
        signObj.width,
        signObj.height
    );

    return new Array(JSON.stringify(signObj), signObj.id);
}

export function evalBase64Str() {
    var tempValue = '';
    for (var i = 0; i < arguments.length; i++) {
        tempValue += arguments[i].value;
    }
    var plantTextB64 = base64encode(utf16to8(tempValue));
    return plantTextB64;
}

function stampInvalidPic(result) {
    if (result != 0) {
        //TODO显示无效图片
        var $this = $('#' + currentSelectSealID);
        var childLength = $this.parent().children().length;
        if (childLength == 1) {
            var sealHeight = $this.css('height');
            var sealWidth = $this.css('width');
            var picWidth = parseInt(sealWidth);
            var picTop = parseInt(sealHeight) / 2 - parseInt(sealWidth) / 5.5;

            var shadeTip =
                '<img style="width:' +
                picWidth +
                'px; margin-top: ' +
                picTop +
                'px; position: absolute;' +
                ' pointer-events: none;"' +
                'ondrag="return false"alt=""' +
                'src="./images/invalid.png"border="0">';

            $this.parent().append(shadeTip);
            $this.css('position', 'absolute');
        }
    }
}

function IYIN_Verify(plantDataBase64, signResult, sealImage, divMenuNodeName) {
    if (signResult == '' || sealImage == '') {
        return -1;
    }
    //'divMenu'
    var webSignOcx = document.getElementById('IYIN_WebSign');
    var oDiv = document.getElementById(divMenuNodeName);
    oDiv.style.display = 'none';
    webSignOcx.IYIN_ActiveX_Init();
    var result = webSignOcx.IYIN_ActiveX_VerifySignature(
        plantDataBase64,
        signResult,
        sealImage
    );
    return result;
}

function IsInSeal() {
    var clickElement = event.srcElement;
    var clickName = clickElement.className;
    if (clickName == 'sealImage') {
        return true;
    } else {
        return false;
    }
}

function Back() {
    window.location.replace('./index.html');
}

export function getRestoreData() {
    var jsonStr = getRestoreDataFromTempDB();
    if (jsonStr == '') {
        return;
    }
    var jsonObj = eval('(' + jsonStr + ')');
    restoreData = jsonObj;
    return jsonObj;
}

export function restoreInput() {
    console.log(restoreData);
    var jsonObj = restoreData;
    for (var i = 0; i < arguments.length; i++) {
        var tempNodeName = arguments[i];
        document.getElementById(tempNodeName).value = jsonObj[tempNodeName];
    }
}

export function restorePic(parentDiv) {
    var jsonObj = restoreData;
    //加载已签章数据
    var signedData = jsonObj.signature;
    if (signedData == '') {
        return;
    }
    //通过逗号分隔符
    var array = signedData.split(',');
    //循环遍历，取出签章图片，并显示出来
    for (var i = 0; i < array.length; i++) {
        var sealID = array[i];
        var arrayData = getResotrPicFromTempDB(sealID);
        // console.log('offsetLeft',$('#HomeDiv')[0].offsetLeft);
        // console.log('offsetTop',$('#HomeDiv')[0].offsetTop);
        // arrayData[1] += $('#HomeDiv')[0].offsetLeft;
        // arrayData[2] += $('#HomeDiv')[0].offsetTop;
        ShowSeal(
            sealID,
            arrayData[0],
            parentDiv,
            arrayData[1],
            arrayData[2],
            arrayData[3],
            arrayData[4]
        );
    }
}

function IYIN_RemoveSeal(
    plantDataBase64,
    signResult,
    sealImage,
    divMenuNodeName
) {
    //'divMenu'
    var result;
    var webSignOcx = document.getElementById('IYIN_WebSign');
    var oDiv = document.getElementById(divMenuNodeName);
    oDiv.style.display = 'none';
    webSignOcx.IYIN_ActiveX_Init();
    result = webSignOcx.IYIN_ActiveX_RemoveSeal(
        plantDataBase64,
        signResult,
        sealImage
    );

    return result;
}

//*********************************************************************************************************

export function soAddSeal(centerX, centerY, parentDivID, plantTextB64) {
    //签章
    var array = IYIN_AddSeal(plantTextB64, parentDivID, centerX, centerY);
    if (!array) {
        return;
    }
    //保存签章数据到数据库
    saveDataToTempDB(array);
}

export function soVerifySeal(plantTextB64, divMenuNodeName) {
    //从数据库取出图片、印章信息、签名数据
    var array = getDataFromTempDB();

    //验章并显示结果
    var result = IYIN_Verify(plantTextB64, array[0], array[1], divMenuNodeName);
    stampInvalidPic(result);
}

export function soBatchVerify(plantTextB64) {
    var webSignOcx = document.getElementById('IYIN_WebSign');
    webSignOcx.IYIN_ActiveX_Init();

    var jsonStr = getRestoreDataFromTempDB();
    if (jsonStr == '') {
        return;
    }

    var jsonObj = eval('(' + jsonStr + ')');
    var signedData = jsonObj.signature;
    if (signedData == '') {
        alert('尚未签章!');
        return;
    }

    var array = signedData.split(',');
    webSignOcx.IYIN_ActiveX_BatchVerifyInit();
    for (var i = 0; i < array.length; i++) {
        var sealID = array[i];
        var arrayBatchVerifyData = getBatchVerifyDataFromTempData(sealID);
        webSignOcx.IYIN_ActiveX_BatchVerifyPushParam(
            plantTextB64,
            arrayBatchVerifyData[0],
            arrayBatchVerifyData[1]
        );
    }
    webSignOcx.IYIN_ActiveX_BatchVerifyShowResult();
}

export function soRemoveSeal(plantTextB64, divMenuNodeName) {
    var array = getDataFromTempDB();
    var signResult = array[0];
    var sealImage = array[1];
    if (signResult == '' || sealImage == '') {
        return false;
    }

    var result = IYIN_RemoveSeal(
        plantTextB64,
        signResult,
        sealImage,
        divMenuNodeName
    );
    if (result == 0) {
        //TODO撤销章模图片
        $('#' + currentSelectSealID)
            .parent()
            .remove();
        var webDBOcx = document.getElementById('IYIN_WebDBCtrl');
        //删除数据库
        webDBOcx.IYIN_RemoveSeal(docID, currentSelectSealID);
    }
}

function saveDataToTempDB(array) {
    var webDBOcx = document.getElementById('IYIN_WebDBCtrl');
    webDBOcx.IYIN_SaveSignature(array[0]);
    webDBOcx.IYIN_AddSignToDoc(docID, array[1]);
}

function getDataFromTempDB() {
    var webDBOcx = document.getElementById('IYIN_WebDBCtrl');
    var signResult = webDBOcx.IYIN_GetSignData(currentSelectSealID, 1);
    var sealImage = webDBOcx.IYIN_GetSignData(currentSelectSealID, 2);
    return new Array(signResult, sealImage);
}

function getRestoreDataFromTempDB() {
    var webDBOcx = document.getElementById('IYIN_WebDBCtrl');
    var jsonStr = webDBOcx.IYIN_GetDoc(docID);
    return jsonStr;
}

function getResotrPicFromTempDB(sealID) {
    var webDBOcx = document.getElementById('IYIN_WebDBCtrl');
    var sealImage = webDBOcx.IYIN_GetSignData(sealID, 2);
    var centerX = webDBOcx.IYIN_GetSignData(sealID, 4);
    var centerY = webDBOcx.IYIN_GetSignData(sealID, 5);
    var width = webDBOcx.IYIN_GetSignData(sealID, 7);
    var height = webDBOcx.IYIN_GetSignData(sealID, 8);
    return new Array(sealImage, centerX, centerY, width, height);
}

function getBatchVerifyDataFromTempData(sealID) {
    var webDBOcx = document.getElementById('IYIN_WebDBCtrl');
    var signResult = webDBOcx.IYIN_GetSignData(sealID, 1);
    var sealImage = webDBOcx.IYIN_GetSignData(sealID, 2);
    return new Array(signResult, sealImage);
}

//*********************************************************************************************************
$(function() {
    document.oncontextmenu = function(
        ev //拦截鼠标右键消息，处理成自己的菜单
    ) {
        if (IsInSeal()) {
            currentSelectSealID = event.srcElement.id;
            var oEvent = ev || event;
            var oDiv = document.getElementById('divMenu');
            oDiv.style.display = 'block';
            console.log(oEvent.pageX);
            console.log(oEvent.pageY);
            console.log(oEvent.target.id);
            oDiv.style.left = oEvent.pageX - 268 + 'px';
            oDiv.style.top =
                oEvent.pageY + $('.web-sign').scrollTop() - 47 + 'px';
            return false;
        }
    };
    document.body.onclick = function() //点击其他区域，取消显示菜单
    {
        var oDiv = document.getElementById('divMenu');
        oDiv.style.display = 'none';
    };
});
