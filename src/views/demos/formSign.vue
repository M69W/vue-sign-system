<template>
    <div class="form-sign">
        <object
            classid="clsid:0CF182B9-5FE9-4756-BEE5-84E1F7D70C31"
            id="IYIN_WebDBCtrl"
            width="0"
            height="0"
        ></object>
        <div class="HomeDiv">
            <div class="head">
                <!--H1>山东同智伟业软件股份有限公司</H1>
                <H2>WEB电子签章演示版2.1</H2-->
            </div>
            <div class="main1">
                <div class="title">
                    <input
                        class="Button"
                        @click="$router.push('newFile')"
                        value="新建文档"
                        type="button"
                        name="Button"
                    />
                    <!--<INPUT id="Button2" onclick="javascript:location.href='index.jsp'" value="返    回" type=button name=Button> </INPUT>-->
                    <a
                        class="Button"
                        style="background-color: #2eb68a;border:1px solid #2eb68a;margin: 0 0 0 749px;padding: 6px 20px 8px 20px;"
                        href="./down/qudong.zip"
                    >下载驱动</a>
                </div>
                <p style="height:20px;"></p>
                <TABLE
                    class="table"
                    id="id_table"
                    border="0"
                    cellspacing="1"
                    cellpadding="0"
                    width="100%"
                >
                    <TBODY>
                        <TR style="background-color: rgba(221, 221, 221, 1);">
                            <TH class="name" align="middle">姓名</TH>
                            <TH class="sex" align="middle">性别</TH>
                            <TH class="xueli" align="middle">学历</TH>
                            <TH class="nation" align="middle">民族</TH>
                            <TH class="card" align="middle">身份证</TH>
                            <TH class="addr" align="middle">籍贯地址</TH>
                            <TH class="birthday" align="middle">出生日期</TH>
                            <TH class="number" align="middle">文书编号</TH>
                            <TH class="opt" align="middle">操作</TH>
                        </TR>
                    </TBODY>
                </TABLE>
                <div class="foot">
                    公司网址：
                    <a href="https://www.i-yin.net/" target="_blank">https://www.i-yin.net</a>
                </div>
                <div class="clear"></div>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    mounted() {
        this.initPage();
    },
    methods: {
        initPage() {
            let self = this;
            const webDBOcx = document.getElementById('IYIN_WebDBCtrl');
            const jsonStr = webDBOcx.IYIN_GetDocAll();
            if (jsonStr == '') return;
            const jsonObj = JSON.parse(jsonStr);
            for (let i = 0; i < jsonObj.List.length; i++) {
                let table = document.getElementById('id_table');
                let row = table.insertRow();

                let cell = row.insertCell();
                cell.align = 'middle';
                cell.style.backgroundColor = '#F0FFF0';
                cell.innerHTML = jsonObj.List[i].use;

                cell = row.insertCell();
                cell.align = 'middle';
                cell.style.backgroundColor = '#F0FFF0';
                cell.innerHTML = jsonObj.List[i].sex;

                cell = row.insertCell();
                cell.align = 'middle';
                cell.style.backgroundColor = '#F0FFF0';
                cell.innerHTML = jsonObj.List[i].education;

                cell = row.insertCell();
                cell.align = 'middle';
                cell.style.backgroundColor = '#F0FFF0';
                cell.innerHTML = jsonObj.List[i].nation;

                cell = row.insertCell();
                cell.align = 'middle';
                cell.style.backgroundColor = '#F0FFF0';
                cell.innerHTML = jsonObj.List[i].car;

                cell = row.insertCell();
                cell.align = 'middle';
                cell.style.backgroundColor = '#F0FFF0';
                cell.innerHTML = jsonObj.List[i].addr;

                cell = row.insertCell();
                cell.align = 'middle';
                cell.style.backgroundColor = '#F0FFF0';
                cell.innerHTML = jsonObj.List[i].birthday;

                cell = row.insertCell();
                cell.align = 'middle';
                cell.style.backgroundColor = '#F0FFF0';
                cell.innerHTML = jsonObj.List[i].number;

                cell = row.insertCell();
                cell.align = 'middle';
                cell.style.backgroundColor = '#F0FFF0';
                cell.align = 'center';
                cell.innerHTML =
                    "<button style='margin-right:-2px;' class='Button' id='" +
                    jsonObj.List[i].id +
                    "' type='button'>签章</button>";
            }
            this.$nextTick(() => {
                $('.table ').on('click', '.Button', function(e) {
                    self.$router.push('webSign?id=' + e.target.id);
                });
            });
        }
    }
};
</script>

<style lang="scss" scoped>
.form-sign {
    position: absolute;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    font-family: '微软雅黑';
    font-size: 13px;
    line-height: 25px;
    margin: 0px;
    padding: 0px;
    color: #666;
    background-color: #fbfbfb;
}
.clear {
    clear: both;
}

.HomeDiv {
    width: 100%;
    margin-right: auto;
    margin-left: auto;
    border-top-style: solid;
    border-top-color: #309ad9;
    border-top-width: 0px;
}

.HomeDiv .head {
    background-image: url('../../assets/demos/images/banner2.png');
    height: 100px;
    background-position: center;
    background-repeat: no-repeat;
    background-color: #1653a4;
    text-align: center;
    color: #fff;
    width: 100%;
    padding-top: 30px;
    padding-bottom: 20px;
}

.title {
    display: flex;
    justify-content: space-between;
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
    cursor: pointer;
    background-color: #309bd9;
    width: 120px;
    height: 35px;
    border: 1px solid #309bd9;
    color: #fff;
    font-family: '微软雅黑';
    margin-right: 10px;
    text-align: center;
}

.table tr th {
    //background-color: #FFF;
    padding: 5px;
}

.table td {
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

// .enter a {
//     border-radius: 3px;
//     display: block;
//     height: 60px;
//     width: 100px;
//     margin-right: auto;
//     margin-left: auto;
//     margin-top: 200px;
//     margin-bottom: 200px;
//     // background-image: url('../../assets/demos/images/1.png');
//     background-color: #319bd9;
//     background-repeat: no-repeat;
//     line-height: 60px;
//     font-size: 18px;
//     color: #fff;
//     text-decoration: none;
//     padding-left: 50px;
//     background-position: 10px center;
// }
// .enter a:hover {
//     background-color: #1681bf;
// }
.HomeDiv .main1 {
    text-align: left;
    border: 1px solid #ddd;
    border-top-width: 0;
    padding: 10px 20px;
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