<template>
    <el-dialog
        :visible.sync="visible"
        :before-close="resetPrintApply"
        :close-on-click-modal="false"
        class="print-apply"
        title="打印申请"
        width="640px"
    >
        <el-form :rules="rules" :model="printApplyForm" label-width="80px" ref="printApplyForm">
            <el-form-item label="打印次数" prop="printCount">
                <el-input v-model="printApplyForm.printCount" placeholder="请输入打印次数"></el-input>
            </el-form-item>
            <el-form-item label="申请事由" prop="printReasons">
                <el-input
                    type="textarea"
                    v-model="printApplyForm.printReasons"
                    placeholder="请输入申请事由"
                    :rows="3"
                    maxlength="100"
                    show-word-limit
                ></el-input>
            </el-form-item>
        </el-form>
        <div class="btn-wrap">
            <el-button @click="resetPrintApply">取消</el-button>
            <el-button type="primary" @click="submitApply">确定</el-button>
        </div>
    </el-dialog>
</template>

<script>
import { checkIntegral } from '@/utils'

export default {
    props: {
        visible: {
            default: false,
            type: Boolean
        },
        contractId: String
    },
    data() {
        return {
            printApplyForm: {
                printCount: '',
                printReasons: ''
            },
            rules: {
                printCount: [
                    {
                        required: true,
                        message: '请输入打印次数',
                        trigger: 'blur'
                    },
                    {
                        validator(rule, value, callback) {
                            if (!value) {
                                callback(new Error('请输入打印次数'));
                            } else if (!checkIntegral(value)) {
                                callback(new Error('打印次数应为正整数'));
                            } else {
                                callback();
                            }
                        },
                        trigger: 'blur'
                    }
                ],
                printReasons: [
                    {
                        required: true,
                        message: '请输入申请事由',
                        trigger: 'blur'
                    },
                    {
                        validator(rule, value, callback) {
                            if (!value) {
                                callback(new Error('请输入申请事由'));
                            } else {
                                callback();
                            }
                        },
                        trigger: 'blur'
                    }
                ]
            }
        };
    },
    methods: {
        resetPrintApply(done) {
            this.$refs.printApplyForm.resetFields();
            this.$refs.printApplyForm.clearValidate();
            this.$emit('update:visible', false);
        },
        submitApply() {
            this.$refs.printApplyForm.validate(async (valid) => {
                if (!valid) return;
                let res = await this.$api('applyPrint').post(
                    '',
                    Object.assign(
                        { contractId: this.contractId },
                        this.printApplyForm
                    )
                );
                if(!res) return
                this.$message.success('打印申请提交成功')
                this.resetPrintApply()
                this.$emit('apply-success')
            });
        }
    }
};
</script>

<style lang="scss" scoped>
.print-apply {
    .btn-wrap {
        text-align: center;
    }
}
</style>