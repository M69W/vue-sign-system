<template>
    <div class="web-sign">
        <object
            classid="clsid:1630241C-F5D6-4466-8C4A-FE933AD93A9F"
            id="IYIN_WebSign"
            width="0"
            height="0"
        ></object>
        <object
            classid="clsid:0CF182B9-5FE9-4756-BEE5-84E1F7D70C31"
            id="IYIN_WebDBCtrl"
            width="0"
            height="0"
        ></object>

        <div id="divMenu">
            <ul>
                <li @click="VerifySeal()">验证签章</li>
                <li @click="RemoveSeal()">撤销签章</li>
            </ul>
        </div>
        <div id="SealPos" style=" position:relative;  width:1024px;">
            <!--签章定位DIV,印章的父元素-->
            <div id="HomeDiv" class="HomeDiv">
                <div style="POSITION: relative" id="SealPos2">
                    <!--签章定位DIV,印章的父元素-->
                    <div class="head">
                        <!--H1>山东同智伟业软件股份有限公司</H1>
                        <H2>WEB电子签章演示版2.1</H2-->
                    </div>
                    <br />
                    <div class="title">
                        <input
                            class="Button"
                            @click="AddSeal('920px','750px','SealPos2');"
                            value="请示盖章"
                            type="button"
                            name="Button"
                        />
                        <!--input name="Button" type="button" id="Button" @click="javascript:AddSealOne('use,sex,nation,xueli,addr',210,200);" value="审核盖章"/-->
                        <input
                            class="Button"
                            @click="AddSeal('280px','330px','SealPos2')"
                            value="审核盖章"
                            type="button"
                            name="Button"
                        />
                        <input
                            class="Button"
                            @click="BatchVerify()"
                            value="批量验证"
                            type="button"
                            name="Button"
                        />
                        <!--input name="Button" type="button" id="Button" @click="javascript:SaveSealAll();"value="保存签章"/-->
                        <!--<input class=Button @click=javascript:MyPrint() value=打印本页 type=button name=Button>-->
                        <input
                            class="Button"
                            @click="$router.go(-1)"
                            value="返    回"
                            type="button"
                            name="Button"
                        />
                        <!--<input id=Button @click=javascript:DeleteSeal(); value=设置最后章删除 type=button name=Button>-->
                    </div>
                    <br />
                    <TABLE class="table0" border="0" cellspacing="1" cellpadding="0" width="100%">
                        <TBODY>
                            <TR>
                                <TD
                                    id="MySignBat1"
                                    height="100"
                                    width="200"
                                    align="middle"
                                    border="0"
                                >领导批示(审核盖章)</TD>
                                <!--<TD style="position:relative;">&nbsp;-->
                                <!--<div style="position:absolute;left:0;top:-20px;left:30px;" id = "div_signAt2">-->
                                <!--<img src="images/changlingxiangonganju_touming.png" style = "width:200px;height:200px;"/>-->
                                <!--</div>-->
                                <!--</TD>-->
                                <td></td>
                            </TR>
                        </TBODY>
                    </TABLE>
                    <TABLE
                        class="con"
                        border="0"
                        cellspacing="0"
                        cellpadding="0"
                        width="100%"
                        align="left"
                    >
                        <TBODY>
                            <TR>
                                <TD align="middle">
                                    <H1>呈请公安行政处罚审批报告书</H1>
                                </TD>
                            </TR>
                            <TR>
                                <TD align="right">
                                    文书编号：
                                    <input
                                        style="BACKGROUND: none transparent scroll repeat 0% 0%"
                                        id="number"
                                        class="txt1"
                                        border="0"
                                        value="鲁52126"
                                        type="text"
                                    />
                                </TD>
                            </TR>
                            <TR>
                                <TD align="left">
                                    <br />>违法嫌疑人
                                    <input
                                        style="BACKGROUND: none transparent scroll repeat 0% 0%"
                                        id="use"
                                        class="txt1"
                                        border="0"
                                        value="陈ⅹ ⅹ"
                                        type="text"
                                    />，性别：
                                    <input
                                        style="BACKGROUND: none transparent scroll repeat 0% 0%"
                                        id="sex"
                                        class="txt1"
                                        border="0"
                                        value="男"
                                        type="text"
                                    /> ,
                                    <input
                                        style="BACKGROUND: none transparent scroll repeat 0% 0%"
                                        id="birthday"
                                        class="txt1"
                                        border="0"
                                        value="1989年4月7日"
                                        type="text"
                                    /> 出生，居民身份证编号：
                                    <input
                                        style="BACKGROUND: none transparent scroll repeat 0% 0%"
                                        id="car"
                                        class="txt1"
                                        border="0"
                                        value="370102198505023450"
                                        type="text"
                                        maxlength="18"
                                    /> ，民族：
                                    <input
                                        style="BACKGROUND: none transparent scroll repeat 0% 0%"
                                        id="nation"
                                        class="txt1"
                                        border="0"
                                        value="汉"
                                        type="text"
                                    /> 族，学历：
                                    <input
                                        style="BACKGROUND: none transparent scroll repeat 0% 0%"
                                        id="education"
                                        class="txt1"
                                        border="0"
                                        value="初中"
                                        type="text"
                                    />， 户籍所在地：
                                    <input
                                        style="BACKGROUND: none transparent scroll repeat 0% 0%"
                                        id="addr"
                                        class="txt1"
                                        border="0"
                                        value="济南历下区"
                                        type="text"
                                    />
                                    <br />
                                    <br />
                                    <br />现查明
                                    <br />违法嫌疑人陈ⅹⅹ于2010年11月12日17时许至23时许，在ⅹⅹ市ⅹⅹ区“ⅹⅹ”茶楼一包间内，和宋ⅹⅹ、王ⅹⅹ利用扑克牌以打“斗地主”的方式，以每盘输赢40至320元进行赌博时，被现场查获。当场从陈ⅹⅹ处查获赌资750元。认定以上事实的证据有：陈ⅹⅹ、宋ⅹⅹ、王ⅹⅹ询问笔录、检查笔录、辨认笔录、到案经过、赌资、赌具等。
                                    <br />
                                    <br />综上所述
                                    <br />根据《中华人民共和国治安管理处罚法》第七十条和第十一条第一款之规定，拟定对陈ⅹⅹ处行政拘留五日，收缴赌资人民币750元。并对宋ⅹⅹ、王ⅹⅹ进行说服教育。
                                    妥否，请批示。
                                </TD>
                            </TR>
                            <TR>
                                <TD
                                    id="MySeal1"
                                    style="position:relative;height:50px; align:right;"
                                >
                                    <div style="position:absolute;right:0px;top:15px;">
                                        <STRONG>承办人签字 :</STRONG>福州市公安局派出所
                                    </div>
                                    <!--<div style="position:absolute;right:0;top:-60px;" id = "div_signAt1">-->
                                    <!--<img id = "img_pic" src="data:image/bmp;base64,iVBORw0KGgoAAAANSUhEUgAAAnUAAAJ1CAIAAAAwlZEDAAAABmJLR0QA/wD/AP" style = "width:200px;height:200px;"/>-->
                                    <!--</div>-->
                                </TD>
                            </TR>
                            <TR>
                                <TD height="50" align="right">
                                    <STRONG>承办人：</STRONG>郑德龙、王化宾
                                </TD>
                            </TR>
                            <TR>
                                <TD height="50" align="right">二零一零年十一月十二日</TD>
                            </TR>
                        </TBODY>
                    </TABLE>
                    <div class="clear"></div>
                    <div class="foot">
                        公司网址：
                        <a href="https://www.i-yin.net/" target="_blank">https://www.i-yin.net</a>
                    </div>
                    <div class="clear"></div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import {
    getRestoreData,
    restoreInput,
    restorePic,
    evalBase64Str,
    soAddSeal,
    soVerifySeal,
    soRemoveSeal,
    soBatchVerify,
} from './signCore';

export default {
    mounted() {
        this.LoadDoc();
    },
    methods: {
        AddSeal(centerX, centerY, parentDivID) {
            //计算原文base64
            var plantTextB64 = evalBase64Str(
                use,
                sex,
                birthday,
                car,
                nation,
                education,
                addr,
                number
            );

            soAddSeal(centerX, centerY, parentDivID, plantTextB64);
        },

        VerifySeal() {
            var plantTextB64 = evalBase64Str(
                use,
                sex,
                birthday,
                car,
                nation,
                education,
                addr,
                number
            );
            soVerifySeal(plantTextB64, 'divMenu');
        },

        LoadDoc() {
            if (getRestoreData() == null) {
                return;
            }
            //参数为节点ID
            restoreInput(
                'use',
                'sex',
                'birthday',
                'car',
                'nation',
                'education',
                'addr',
                'number'
            );
            restorePic('SealPos2');
        },

        RemoveSeal() {
            var plantTextB64 = evalBase64Str(
                use,
                sex,
                birthday,
                car,
                nation,
                education,
                addr,
                number
            );
            soRemoveSeal(plantTextB64, 'divMenu');
        },

        BatchVerify() {
            var plantTextB64 = evalBase64Str(
                use,
                sex,
                birthday,
                car,
                nation,
                education,
                addr,
                number
            );
            soBatchVerify(plantTextB64);
        },

        //*********************************************************************************************************
        //以下为DB交互

        saveDataToTempDB(array) {
            var webDBOcx = document.getElementById('IYIN_WebDBCtrl');
            webDBOcx.IYIN_SaveSignature(array[0]);
            webDBOcx.IYIN_AddSignToDoc(docID, array[1]);
        },

        getDataFromTempDB() {
            var webDBOcx = document.getElementById('IYIN_WebDBCtrl');
            var signResult = webDBOcx.IYIN_GetSignData(currentSelectSealID, 1);
            var sealImage = webDBOcx.IYIN_GetSignData(currentSelectSealID, 2);
            return new Array(signResult, sealImage);
        },

        getRestoreDataFromTempDB() {
            var webDBOcx = document.getElementById('IYIN_WebDBCtrl');
            var jsonStr = webDBOcx.IYIN_GetDoc(docID);
            return jsonStr;
        },

        getResotrPicFromTempDB(sealID) {
            var webDBOcx = document.getElementById('IYIN_WebDBCtrl');
            var sealImage = webDBOcx.IYIN_GetSignData(sealID, 2);
            var centerX = webDBOcx.IYIN_GetSignData(sealID, 4);
            var centerY = webDBOcx.IYIN_GetSignData(sealID, 5);
            var width = webDBOcx.IYIN_GetSignData(sealID, 7);
            var height = webDBOcx.IYIN_GetSignData(sealID, 8);
            return new Array(sealImage, centerX, centerY, width, height);
        },

        getBatchVerifyDataFromTempData(sealID) {
            var webDBOcx = document.getElementById('IYIN_WebDBCtrl');
            var signResult = webDBOcx.IYIN_GetSignData(sealID, 1);
            var sealImage = webDBOcx.IYIN_GetSignData(sealID, 2);
            return new Array(signResult, sealImage);
        }
    }
};
</script>

<style lang="scss" scoped>
.web-sign {
    position: absolute;
    top: 0;
    left: 0;
    bottom: 0;
    right: 0;
    overflow: auto;
    font-family: '微软雅黑';
    font-size: 13px;
    line-height: 25px;
    color: #666;
    background-color: #fbfbfb;
}
.clear {
    clear: both;
}
.main {
    width: 1024px;
    margin-right: auto;
    margin-left: auto;
    border-top-style: solid;
    border-top-color: #309ad9;
    border-top-width: 0px;
}
.HomeDiv {
    width: 1024px;
    // margin-right: auto;
    // margin-left: auto;
    border-top-style: solid;
    border-top-color: #309ad9;
    border-top-width: 0px;
}

.HomeDiv .head {
    background-image: url('../../assets/demos/images/banner2.png');
    height: 150px;
    background-position: center;
    text-align: center;
    color: #fff;
    width: 100%;
    padding-top: 30px;
    padding-bottom: 20px;
}
.head h1 {
    font-size: 24px;
    font-weight: normal;
}
.HomeDiv .head h2 {
    font-size: 14px;
    font-weight: normal;
}
.title {
    color: #333;
    width: 100%;
    border-bottom-width: 0px;
    border-bottom-style: solid;
    border-bottom-color: #eee;
    margin-top: 10px;
    margin-bottom: 10px;
    font-size: 14px;
}
.text {
    border: 1px solid #ddd;
    width: 100%;

    height: 30px;
    line-height: 30px;
    text-indent: 10px;
}
#Button {
    background-color: #309bd9;
    width: 120px;
    height: 35px;
    border: 1px solid #309bd9;
    color: #fff;
    font-family: '微软雅黑';
    margin-right: 10px;
    text-align: center;
}
.Button {
    background-color: #309bd9;
    width: 120px;
    height: 35px;
    border: 1px solid #309bd9;
    color: #fff;
    font-family: '微软雅黑';
    margin-right: 10px;
    text-align: center;
}
.table tr td {
    //background-color: #FFF;
    padding: 5px;
}
.table0 tr td {
    //background-color: #FFF;
    padding: 5px;
}
.foot {
    border-top-width: 3px;
    border-top-style: solid;
    border-top-color: #bddef2;
    padding-top: 10px;
    text-align: center;
    float: left;
    width: 100%;
    padding-bottom: 20px;
}
.table0 {
    padding: 0px;
    border: 1px solid #eee;
    float: left;
    width: 100%;
    //background-color: #eee;
    margin-bottom: 10px;
}
.table {
    padding: 0px;
    border: 1px solid #eee;
    float: left;
    width: 100%;
    //background-color: #eee;
    margin-bottom: 10px;
}
.txt {
    border: 1px solid #ddd;
    width: 600px;
    padding: 10px;
    color: #666;
}
.qz {
    height: 200px;
    width: 200px;
    border: 1px solid #309bd9;
}
#Button1 {
    background-color: #fbfbfb;
    border: 1px solid #eee;
    line-height: 35px;
    width: 100px;
    text-indent: 0px;
    height: 35px;
    color: #666;
}
.enter a {
    border-radius: 3px;
    display: block;
    height: 60px;
    width: 150px;
    margin-right: auto;
    margin-left: auto;
    margin-top: 200px;
    margin-bottom: 200px;
    // background-image: url(../images/1.png);
    background-color: #319bd9;
    background-repeat: no-repeat;
    line-height: 60px;
    font-size: 18px;
    color: #fff;
    text-decoration: none;
    padding-left: 50px;
    background-position: 10px center;
}
.enter a:hover {
    background-color: #1681bf;
}
.HomeDiv .main1 {
    /*//background-color: #FFF;*/
    text-align: left;
    border-top-width: 0px;
    border-right-width: 1px;
    border-bottom-width: 0px;
    border-left-width: 1px;
    border-top-style: solid;
    border-right-style: solid;
    border-bottom-style: solid;
    border-left-style: solid;
    border-top-color: #ddd;
    border-right-color: #ddd;
    border-bottom-color: #ddd;
    border-left-color: #ddd;
    padding-top: 10px;
    padding-right: 20px;
    padding-bottom: 20px;
    padding-left: 20px;
}

input {
    border-radius: 3px;
}
.con h1 {
    font-size: 24px;
    line-height: 50px;
    font-weight: normal;
}
.txt1 {
    text-align: center;
    border-top-width: 0px;
    border-right-width: 0px;
    border-bottom-width: 1px;
    border-left-width: 0px;
    border-top-style: solid;
    border-right-style: solid;
    border-bottom-style: solid;
    border-left-style: solid;
    border-top-color: #ccc;
    border-right-color: #ccc;
    border-bottom-color: #ccc;
    border-left-color: #ccc;
}
#Button:hover {
    background-color: #1883c1;
}
#cen {
    font-size: 36px;
    color: #60f;
    text-align: center;
}
#divMenu {
    position: absolute;
    display: none;
    z-index: 9999;
}
#divMenu ul {
    position: absolute;
    float: left;
    border: 1px solid #979797;
    background: #f1f1f1;
    padding: 2px;
    box-shadow: 2px 2px 2px rgba(0, 0, 0, 0.6);
    width: 100px;
    overflow: hidden;
}
#divMenu ul li {
    float: left;
    clear: both;
    height: 24px;
    cursor: pointer;
    line-height: 24px;
    white-space: nowrap;
    padding: 0 30px;
    width: 100%;
    display: inline-block;
}
#divMenu ul li:hover {
    background: #e6edf6;
    border: 1px solid #b4d2f6;
}
</style>