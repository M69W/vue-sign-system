<template>
    <div class="container-approve-mine-list">
        <!-- <van-list v-model="loading" :finished="finished" finished-text="没有更多了" @load="onLoad"> -->
        <van-list>
            <van-cell
                v-for="(item, idx) in list" :key="idx"
                clickable
                @click="toggle(idx)"
                >
                <div class="list-item-wrapper">

                    <div class="list-item">
                        <div class="title">
                            <div class="one">{{ item.processTitle }}</div>
                            <div class="two"><van-tag plain type="primary">{{ formatProcessState[item.processState] }}</van-tag></div>
                            <!-- <div class="thr">刚刚</div> -->
                        </div>
                        <div class="content">
                            <div>
                                <span style="display: inline-block;">请假类型 :</span>
                                <span style="margin-left: 10px;">年假</span>
                            </div>
                            <div>
                                <span style="display: inline-block;">开始时间 :</span>
                                <span style="margin-left: 10px;">{{ item.startTime }}</span>
                            </div>
                            <div>
                                <span style="display: inline-block;">结束时间 :</span>
                                <span style="margin-left: 10px;">{{ item.startTime }}</span>
                            </div>
                        </div>
                    </div>

                    <div class="list-checkbox">
                        <van-checkbox :value="item.isChecked"></van-checkbox>
                    </div>
                </div>

            </van-cell>
        </van-list>
    </div>
</template>

<script>
export default {
    props: {
        list: Array,
        type: String
    },
    data() {
        return {
            loading: false,
            finished: false,
            formatProcessState: {
                '01': '审批中',
                '02': '已通过',
                '03': '已驳回',
                '04': '通过前撤销',
                '05': '通过后撤销',
                '06': '管理员删除模板',
            },

            result: []
        };
    },
    methods: {
        toggle(idx) {
            // console.log(idx)
            this.list[idx].isChecked = !this.list[idx].isChecked

            if(this.list[idx].isChecked) {
                this.$emit('checkok', this.list[idx].id + '&' + this.list[idx].processTitle)
            } else {
                this.$emit('checkno', this.list[idx].id + '&' + this.list[idx].processTitle)
            }
        }
    }
};
</script>


<style lang="scss">
.container-approve-mine-list {
    .van-list {
        &:last-child {
            margin-bottom: 10px;
        }
    }

    .list-item-wrapper {
        display: flex;
        justify-content: space-between;
        align-items: center;
    }

    .list-item {
        // background-color: #fee;
        // height: 120px;
        position: relative;

        .title {
            .one {
                float: left;
                margin-right: 10px;
                font-size: 16px;
                color: #000;
            }

            .two {
                float: left;
            }

            .thr {
                float: right;
                font-size: 12px;
                color: #96989E;
            }
        }

        .content {
            clear: both;
            color: #9B9B9B;
        }
    }
}
</style>