<template>
    <div class="container-approve-mine-list">
        <!-- <van-list v-model="loading" :finished="finished" finished-text="没有更多了" @load="onLoad"> -->
        <van-list>
            <van-cell v-for="(item, idx) in plist" :key="idx" @click="gotoDetail(idx)">
                <div class="list-item">
                    <div class="title">
                        <div class="one ellipsis">{{ item.processTitle }}</div>
                        <div class="two"><van-tag plain type="primary">{{ formatProcessState[item.processState] }}</van-tag></div>
                        <!-- 现在距发起时间的分针数 (((new Date()) - (new Date(item.startTime))) / (1000 * 60)).toFixed() -->
                        <!-- -_||
                        60秒内：刚刚
                        1分钟到60分钟内：X分前
                        1小时到24小时内：X小时前
                        1天到7天内：X天前
                        大于7天：具体日期，如2020-07-08 
                        -->
                        <div class="thr">
                            {{ 
                                (((new Date()) - (new Date(item.startTime))) / (1000 * 60)) < 2  ? 
                                '刚刚' :
                                    (((new Date()) - (new Date(item.startTime))) / (1000 * 60)) < 60 ?
                                    (((new Date()) - (new Date(item.startTime))) / (1000 * 60)).toFixed() + '分钟前' :
                                        (((new Date()) - (new Date(item.startTime))) / (1000 * 60)) < (24 * 60) ?
                                        ((((new Date()) - (new Date(item.startTime))) / (1000 * 60)) / 60).toFixed() + '小时前' :
                                            (((new Date()) - (new Date(item.startTime))) / (1000 * 60)) < (7 * 24 * 60) ?
                                            ((((new Date()) - (new Date(item.startTime))) / (1000 * 60)).toFixed() / (24 * 60)).toFixed() + '天前':
                                            item.startTime
                            }}
                        </div>
                    </div>
                    <div class="content">
          
                            <div v-for="(_item, _idx) in item.viewableRespVOList" :key="_idx"
                                style="display: flex;"
                                >
                                <!-- 多行文本 -->
                                <template v-if="_item.widgetType == 'textarea'">
                                    <span class="title-cls">{{ _item.title }}</span>
                                    <span class="value-cls ellipsis">: {{ _item.value }}</span>
                                </template>
                                <!-- 地址 -->
                                <template v-else-if="_item.widgetType == 'address'">
                                    <span class="title-cls">{{ _item.title }}</span>
                                    <span class="value-cls ellipsis">: {{ _item.value.split('&').join('') }}</span>
                                </template>
                                <!-- 说明文字 -->
                                <template v-else-if="_item.widgetType == 'text'">
                                    <span class="title-cls">{{ _item.title }}</span>
                                    <span class="value-cls ellipsis">: {{ _item.value.split('&').join('') }}</span>
                                </template>
                                <!-- 其他 -->
                                <template v-else>
                                    <span class="title-cls">{{ _item.title }}</span>
                                    <span class="value-cls ellipsis">: {{ _item.value }}</span>
                                </template>

                            </div>
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
            }
        };
    },
    computed:{
        plist() {
            let _list = JSON.parse(JSON.stringify(this.list))
            
            _list.forEach(item => {
                // console.log(item)
                item.viewableRespVOList.forEach((_item, _idx) => {
                    // console.log(_idx, _item.widgetType, _item.title, _item)
                    _item.widgetConfig = JSON.parse(_item.widgetConfig)

                    // 部门、联系人
                    if (['department', 'contacts'].includes(_item.widgetType)) {
                        if (_item.value.split(',').length == 1) {
                            // ^ 单选 或 多选（只选了一个）
                            _item.value = _item.value.split('&')[1]

                        } else {
                            let _val = ''
                            _item.value.split(',').forEach(ele => {
                                _val += ele.split('&')[1] + ' '
                            })
                            _item.value = _val
                        }
                    }

                    // 单选框
                    if (['radio'].includes(_item.widgetType)) {
                        _item.widgetConfig.options.options.forEach(ele => {
                            if (_item.value == ele.value) {
                                _item.value = ele.label
                            }
                        })                        
                    }

                    // 多选框
                    if (['checkbox'].includes(_item.widgetType)) {
                        _item.value = JSON.parse(_item.value)
                        let _val = ''
                        _item.value.forEach(oele => {
                            _item.widgetConfig.options.options.forEach(ele => {
                                if (oele == ele.value) {
                                    _val += ele.label + ' '
                                }
                            })  
                        })

                        _item.value = _val
                    }
                })
            })

            return _list
        }
    },
    methods: {
        gotoDetail(idx) {
            this.$router.push({
                path: '/h5wf/detail',
                query: {
                    // 为了区分模板 ID (processId) 的 query 中使用 id，
                    // 此处针对流程实例，用 iid ，对应 processInstanceId
                    iid: this.list[idx].id,
                    type: this.type,
                }
            })
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

    .list-item {
        // background-color: #fee;
        min-height: 40px;
        position: relative;

        .title {
            .one {
                float: left;
                margin-right: 10px;
                font-size: 16px;
                color: #000;
                width: 40%;
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

            .title-cls {
                display: inline-block; 
                width: 18%;
            }

            .value-cls {
                margin-left: 10px;
                display: inline-block; 
                width: 70%;
            }
        }
    }
}
</style>