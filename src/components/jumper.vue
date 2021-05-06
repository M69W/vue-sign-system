<template>
    <div class="jumper">
        <span>前往</span>
        <el-input
            size="small"
            v-model="pageNum"
            @keyup.enter.native="handleCurrentChange(pageNum)"
            @blur="handleCurrentChange(pageNum)"
        ></el-input>
        <span>/ {{ totalPage }} 页</span>
    </div>
</template>

<script>
export default {
    components: {},
    props: {
        totalPage: {
            type: Number,
            default: 0
        },
        tempPageNum: {
            type: Number,
            default: 1
        }
    },
    data() {
        return {
            pageNumForTime: 1,
            pageNum: 1
        };
    },
    watch: {
        tempPageNum(val) {
            this.pageNum = val;
        }
    },
    mounted() {},
    methods: {
        handleCurrentChange(val) {
            if (val < 1 || val > this.totalPage) {
                this.$message.warning('页码不在范围内！');
                this.pageNum = this.pageNumForTime;
                return;
            }
            this.$emit('current-change', parseInt(val));
            this.pageNumForTime = val;
        }
    }
};
</script>
<style lang="scss" scoped>
.jumper {
    span {
        color: #303133;
    }
    .el-input {
        width: 40px;
        margin: 0 5px;
    }
}
</style>
<style lang="scss">
.jumper {
    display: flex;
    align-items: center;
    .el-input--small .el-input__inner {
        height: 28px;
        line-height: 28px;
        padding: 0 5px;
        text-align: center;
    }
}
</style>