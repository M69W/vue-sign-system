<template>
    <div>
        <h2>{{ msg }} Page</h2>        
    </div>
</template>



<script>

export default {

    data() {
        return {
            msg: 'Blank Page',
            tempParams: {
                id: 100,
                name: 'PC or PHONE'
            },
            permamentParams: {}
        }
    },
    mounted() {
        // console.log(this.$route)
        // ?id=xxx&name=xxx
        // this.$route.params >> { id: xxx, name: xxx }


        // console.log(this.tempParams.id)
        // console.log(this.tempParams.name)
        this.permamentParams = this.tempParams;
        // console.log(this.permamentParams);

        this.whereToGo();

    },

    methods: {
        whereToGo() {
            console.log('Where to go?')


            var flag = this.browserRedirect();
        　　 if(flag){
        　　　　 console.log("phone >> goto h5sign/login");
        　　 }else{
        　　　　 console.log("pc >> goto login");
        　　 }

        },
        browserRedirect() {
            var sUserAgent = navigator.userAgent.toLowerCase();
            var bIsIpad = sUserAgent.match(/ipad/i) == "ipad";
            var bIsIphoneOs = sUserAgent.match(/iphone os/i) == "iphone os";
            var bIsMidp = sUserAgent.match(/midp/i) == "midp";
            var bIsUc7 = sUserAgent.match(/rv:1.2.3.4/i) == "rv:1.2.3.4";
            var bIsUc = sUserAgent.match(/ucweb/i) == "ucweb";
            var bIsAndroid = sUserAgent.match(/android/i) == "android";
            var bIsCE = sUserAgent.match(/windows ce/i) == "windows ce";
            var bIsWM = sUserAgent.match(/windows mobile/i) == "windows mobile";
            if (bIsIpad || bIsIphoneOs || bIsMidp || bIsUc7 || bIsUc || bIsAndroid || bIsCE || bIsWM) {
                return true;
            } else {
                return false;
            }
        }
    }
}

</script>
