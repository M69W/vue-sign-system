<template>
    <div>
        <el-button @click="openSonPage">打开子页面</el-button>
        <h1>return_flag：{{ return_flag }}</h1>
        <h1>message：{{ message }}</h1>
    </div>
</template>

<script>
export default {
    data() {
        return {
            return_flag: '',
            message: '',
            sonPage: ''
        }
    },
    mounted () {
        let _this = this
        window.electronc_tag_return_fun = function (val) {
            console.log(111111111);
            _this.sonPage.close();
            let v = JSON.parse(val)
            _this.return_flag = v.return_flag
            _this.message = v.message
        }
    },
    methods: {
        openSonPage(){
            const domain = document.domain;
            const url = location.origin + location.pathname + '#/ctfSign?batch_id=333333&page_domain=' + domain
            this.sonPage = window.open(url, 'Show_Report', 'scrollbars,top=0,left=' + screen.availWidth + ',width=' + (screen.availWidth - 234) + ',Height=' + (screen.availHeight - 178) + ',resizable=1,toolbar=no');
        }
    }
}
</script>