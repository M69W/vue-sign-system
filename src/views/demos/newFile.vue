<template>
    <div class="new-file">
        <object
            classid="clsid:0CF182B9-5FE9-4756-BEE5-84E1F7D70C31"
            id="IYIN_WebDBCtrl"
            width="0"
            height="0"
        ></object>

        <DIV class="HomeDiv">
            <DIV class="head"></DIV>

            <DIV class="main1">
                <DIV class="title">
                    <input
                        class="Button"
                        @click="SaveDoc(use,sex,birthday,car,nation,education,addr,number)"
                        value="保存文档"
                        type="button"
                        name="Button"
                    />
                    <input
                        class="Button"
                        @click="$router.go(-1)"
                        value="返 回"
                        type="button"
                        name="Button"
                    />
                </DIV>
                <br />
                <br />
                <TABLE
                    class="table"
                    border="0"
                    cellspacing="1"
                    cellpadding="0"
                    width="100%"
                    align="center"
                >
                    <TBODY>
                        <TR>
                            <TD height="100" width="200" align="middle">领导批示(审核盖章)</TD>
                            <TD>&nbsp;</TD>
                        </TR>
                    </TBODY>
                </TABLE>
                <TABLE
                    class="con"
                    border="0"
                    cellspacing="0"
                    cellpadding="0"
                    width="100%"
                    align="center"
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
                                <input id="number" class="txt1" border="0" type="text" v-model="number" />
                            </TD>
                        </TR>
                        <TR>
                            <TD align="left">
                                <br />违法嫌疑人
                                <input
                                    id="use"
                                    class="txt1"
                                    border="0"
                                    v-model="use"
                                    type="text"
                                /> ，
                                性别：
                                <input
                                    id="sex"
                                    class="txt1"
                                    border="0"
                                    v-model="sex"
                                    type="text"
                                /> ,
                                <input
                                    id="birthday"
                                    class="txt1"
                                    border="0"
                                    v-model="birthday"
                                    type="text"
                                /> 出生，
                                居民身份证编号：
                                <input
                                    id="car"
                                    class="txt1"
                                    border="0"
                                    v-model="car"
                                    type="text"
                                    maxlength="18"
                                /> ，
                                民族：
                                <input
                                    id="nation"
                                    class="txt1"
                                    border="0"
                                    v-model="nation"
                                    type="text"
                                /> 族，
                                学历：
                                <input
                                    id="education"
                                    class="txt1"
                                    border="0"
                                    v-model="education"
                                    type="text"
                                />，
                                户籍所在地：
                                <input
                                    id="addr"
                                    class="txt1"
                                    border="0"
                                    v-model="addr"
                                    type="text"
                                />
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
                            <TD height="50" align="right">
                                <STRONG>承办人签字:</STRONG>福州市公安局派出所
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
                <DIV class="clear"></DIV>
            </DIV>
            <DIV class="foot">
                公司网址：
                <a href="https://www.i-yin.net/" target="_blank">https://www.i-yin.net</a>
            </DIV>
            <DIV class="clear"></DIV>
        </DIV>
    </div>
</template>

<script>
export default {
    data() {
        return {
            use: '陈ⅹⅹ',
            sex: '男',
            birthday: '1989-12-16',
            car: '370102198505023450',
            nation: '汉',
            education: '初中',
            addr: '福建福州',
            number: ''
        };
    },
    methods: {
        SaveDoc(use, sex, birthday, car, nation, education, addr, number) {
            if (
                use == '' ||
                sex == '' ||
                birthday == '' ||
                car == '' ||
                nation == '' ||
                education == '' ||
                addr == '' ||
                number == ''
            ) {
                alert('内容不能为空！');
                return;
            }

            if (car.length != 18) {
                alert('请输入18位的身份证号！');
                return;
            }

            var docObj = new Object();
            docObj.id = this.NewGuid();
            docObj.use = use;
            docObj.sex = sex;
            docObj.birthday = birthday;
            docObj.car = car;
            docObj.nation = nation;
            docObj.education = education;
            docObj.addr = addr;
            docObj.number = number;

            var webDBOcx = document.getElementById('IYIN_WebDBCtrl');
            if (webDBOcx.IYIN_SaveDoc(JSON.stringify(docObj)) == 0) {
                alert('保存成功！');
                return true;
            } else {
                alert('保存失败！');
                return false;
            }
        },

        S4() {
            return (((1 + Math.random()) * 0x10000) | 0)
                .toString(16)
                .substring(1);
        },

        NewGuid() {
            return (
                this.S4() +
                this.S4() +
                '-' +
                this.S4() +
                '-' +
                this.S4() +
                '-' +
                this.S4() +
                '-' +
                this.S4() +
                this.S4() +
                this.S4()
            );
        }
    }
};
</script>

<style lang="scss" scoped>
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
    margin-right: auto;
    margin-left: auto;
    border-top-style: solid;
    border-top-color: #309ad9;
    border-top-width: 0px;
}
body {
    font-family: '微软雅黑';
    font-size: 13px;
    line-height: 25px;
    margin: 0px;
    padding: 0px;
    color: #666;
    background-color: #fbfbfb;
}
.HomeDiv .head {
    background-image: url('../../assets/demos/images/banner2.png');
    height: 100px;
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
    width: 100px;
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
</style>