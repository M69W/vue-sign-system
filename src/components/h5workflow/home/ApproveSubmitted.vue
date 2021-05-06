<template>
    <div class="container-approve-submitted">
        <form action="/">
            <van-search
                v-model="valueSearch"
                show-action
                placeholder="搜索人名、标题、内容、状态"
                input-align="center"
                background="#F1F2F6"
                action-text=" "
                @search="onSearch"
            />
        </form>
        <ProcessList type="01" :list="processSubmittedList" />
    </div>
</template>

<script>
import { Toast } from "vant";
import ProcessList from "./ProcessList.vue";

export default {
    components: {
        ProcessList
    },
    data() {
        return {
            valueSearch: '',
            processSubmittedList: [],
        };
    },
    mounted() {
        // 获取已提交列表
        this.getProcessSubmittedList();
    },
    methods: {
        // API
        // ------------------------------------------------------------------
        // 已提交
        apiGetProcessSubmittedList(data) {
            return this.$api('urlGetProcessSubmittedList').post('postNormal', data)
        },
        // ------------------------------------------------------------------
        async getProcessSubmittedList() {
            let _data = {
                keyword: '',
                pageNum: 1,
                pageSize: 100
            }

            let res = await this.apiGetProcessSubmittedList(_data)
            // console.log(res.data.data)
            if(!res) return;

            this.processSubmittedList = res.data.data
        },

        // 搜索
        async onSearch(val) {

            let _data = {
                keyword: val.trim(),
                pageNum: 1,
                pageSize: 100
            }

            let res = await this.apiGetProcessSubmittedList(_data)
            // console.log(res.data.data)
            if(!res) return;

            this.processSubmittedList = res.data.data            
        },
    }
};
</script>

<style lang="scss" scoped>
</style>