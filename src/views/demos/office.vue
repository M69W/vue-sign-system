<template>
    <div class="demos-show">
        <div class="navz">
            <div class="h1">
                <div class="logo"></div>
                <h1>OFFICE网页签章</h1>
            </div>
        </div>
        <div class="contz" id="contz">
            <div class="leftz">
                <ul>
                    <li class="li01" @click="NewDocument">
                        <i></i>新建
                    </li>
                    <li class="li02" @click="OpenFileFromLocal">
                        <i></i>打开
                    </li>
                    <li class="li03" @click="SaveFileToLocal">
                        <i></i>保存
                    </li>
                    <li class="li04" @click="SaveAs">
                        <i></i>另存为
                    </li>
                </ul>
            </div>
            <div class="rightz">
                <object
                    id="office"
                    classid="clsid:3C838BB9-BCA8-477F-81C9-2ED6BFC1E939"
                    width="100%"
                    height="100%"
                    codebase="IYIN_iWebOffice.CAB#version=1,0,0,1"
                ></object>
            </div>
        </div>
        <div class="footz">
            <p>版权所有 © www.i-yin.net</p>
        </div>
    </div>
</template>

<script>
export default {
    mounted() {
        this.contz_height();
        if (window.attachEvent) {
            window.attachEvent('onresize', this.contz_height);
        } else {
            window.addEventListener('beforeunload', this.addOnBeforeUnload, false);
            window.addEventListener('resize', this.contz_height, false);
        }
    },
    methods: {
        contz_height() {
            document.getElementById('contz').style.height =
                document.querySelector('.demos-show').clientHeight - 110 + 'px';
        },

        OpenFileFromLocal() {
            var officeOcx = document.getElementById('office');
            officeOcx.IYIN_OpenFileFromLocal();
        },

        OpenFileFromServer() {
            var officeOcx = document.getElementById('office');
            officeOcx.IYIN_OpenFileFromServer();
        },

        SaveFileToLocal() {
            var officeOcx = document.getElementById('office');
            officeOcx.IYIN_SaveFileToLocal();
        },

        SaveAs() {
            var officeOcx = document.getElementById('office');
            officeOcx.IYIN_SaveAs();
        },

        NewDocument() {
            var officeOcx = document.getElementById('office');
            officeOcx.IYIN_CreateNew();
        },

        addOnBeforeUnload(e) {
            var ev = e || event;
            if (ev) {
                var officeOcx = document.getElementById('office');
                officeOcx.IYIN_Unload();
            }
        }
    },
    beforeDestroy() {
        this.addOnBeforeUnload();
        if (window.attachEvent) {
            window.detachEvent('onresize', this.contz_height);
        } else {
            window.removeEventListener('resize', this.contz_height);
        }
    }
};
</script>

<style lang="scss" scoped>
.demos-show {
    position: absolute;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
}
// html,
// body,
// div,
// p,
// a,
// img,
// h2,
// h1,
// button,
// ul,
// li,
// input,
// select,
// iframe {
//     margin: 0;
//     padding: 0;
//     font-family: 微软雅黑;
//     border: 0;
//     outline: 0;
//     font-size: 100%;
//     font-size: 14px;
// }

// html {
//     height: 100%;
//     min-width: 999px;
// }
// body {
//     height: 100%;
//     background-color: #e9edf2;
//     min-width: 999px;
// }
.navz {
    width: 100%;
    height: 80px;
    background-color: #1b6fa7;
    background: -webkit-gradient(
        linear,
        0 0,
        100% 0,
        color-stop(0.3, #1b6fa7),
        to(#0599b4)
    );
    background: -webkit-linear-gradient(left, #1b6fa7 30%, #0599b4 100%);
    background: -moz-linear-gradient(left, #1b6fa7 30%, #0599b4 100%);
    background: -o-linear-gradient(left, #1b6fa7 30%, #0599b4 100%);
    background: linear-gradient(left, #1b6fa7 30%, #0599b4 100%);
}

.navz .h1 {
    height: 48px;
    padding: 16px;
}

.navz .h1 .logo {
    width: 48px;
    height: 48px;
    background-image: url(../../assets/demos/images/logo.png);
    float: left;
}

.navz .h1 h1 {
    line-height: 48px;
    font-size: 26px;
    color: #fff;
    margin-left: 10px;
    float: left;
}

.contz {
    width: 100%;
    min-height: 400px;
    background-color: #f7f7f7;
}
.contz .leftz {
    width: 190px;
    height: 100%;
    float: left;
    /*background: #5b666e;*/
    background-image: url(../../assets/demos/images/leftz_bg.gif);
    background-repeat: repeat;
}
.contz .leftz ul {
    padding: 10px;
}
.contz .leftz ul li {
    width: 170px;
    height: 40px;
    line-height: 20px;
    margin-bottom: 10px;
    padding: 10px;
    background-color: #218dd4;
    border-radius: 6px;
    color: #fff;
    cursor: pointer;
    list-style: none;
}

.contz .leftz ul li:hover {
    background-color: #09b7d4;
}
.contz .leftz ul li:active {
    background-color: #26a9ff;
}
.contz .leftz ul li i {
    width: 20px;
    height: 20px;
    background-image: url(../../assets/demos/images/icon01.png);
    background-repeat: no-repeat;
    display: block;
    float: left;
    margin-right: 10px;
}

.contz .leftz ul .li01 i {
    background-position: 0 0;
}
.contz .leftz ul .li02 i {
    background-position: -20px 0;
}
.contz .leftz ul .li03 i {
    background-position: -40px 0;
}
.contz .leftz ul .li04 i {
    background-position: -60px 0;
}
.contz .leftz ul .li05 i {
    background-position: -80px 0;
}

.contz .rightz {
    margin-left: 190px;
    width: auto;
    height: 100%;
}
.contz .rightz .patz {
    padding: 20px;
}

.footz {
    width: 100%;
    height: 30px;
    background-color: #1b6fa7;
    background: -webkit-gradient(
        linear,
        0 0,
        100% 0,
        color-stop(0.3, #1b6fa7),
        to(#0599b4)
    );
    background: -webkit-linear-gradient(left, #1b6fa7 30%, #0599b4 100%);
    background: -moz-linear-gradient(left, #1b6fa7 30%, #0599b4 100%);
    background: -o-linear-gradient(left, #1b6fa7 30%, #0599b4 100%);
    background: linear-gradient(left, #1b6fa7 30%, #0599b4 100%);
}
.footz p {
    font-size: 12px;
    color: #eee;
    text-align: center;
    line-height: 30px;
}
</style>