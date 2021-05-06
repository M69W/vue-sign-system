<template>
<!-- 暂未使用 -->
    <div class="adobe-print">
        <object id="pdfObj" classid="clsid:CA8A9780-280D-11CF-A24D-444553540000" width="100%" height="100%" border="0" v-if="fileSrc">
            <param name="src" :value="fileSrc" />
        </object>
    </div>
</template>

<script>
import { sessionStore } from '@/utils'

export default {
    data () {
        return {
            fileSrc: null
        }
    },
    async created() {
        // let baseUrl = process.env.NODE_ENV === 'production' ? '' : '/apis'
        // this.fileSrc = baseUrl + '/noToken/contract/downloadContract?contractId=' + this.$route.query.contractId
        // this.setUrl()
        // this.getFile()
    },
    methods: {
        setUrl() {
            const baseUrl = process.env.NODE_ENV === 'production' ? '' : '/apis'
            const printInfo = sessionStore.get('printInfo')
            let url = baseUrl + '/document/print/noToken/printSummary?'
            for (const key in printInfo) {
                if (printInfo.hasOwnProperty(key)) {
                    const element = printInfo[key];
                    if (key === 'fileCodes') {
                        element.forEach(v=> url += key + '=' + v + '&')
                    }else if (key === 'context') {
                        url += key + '=' + encodeURIComponent(element.replace(/(\n|\r)/g, '').replace(/\s{2,}/g, ' ')) + '&'
                    }else {
                        url += key + '=' + element + '&'
                    }
                }
            }
            // url = url.substring(0, url.length - 1)
            console.log(url);
            document.write(url.length)
            // this.fileSrc = url
        }
    }
};
</script>

<style lang="scss" scoped>
// object {
//     width: 100%;
//     height: 100%;
// }
.adobe-print {
    width: 100%;
    height: 100%;
}
</style>