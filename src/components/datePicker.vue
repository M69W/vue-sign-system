<template>
    <div class="date-picker" v-if="visible" @click="cancel">
        <transition name="date-picker">
            <div class="date-picker-inner" v-show="innerVisible" @click.stop>
                <div class="date-picker-header">
                    <div class="btn" @click="cancel">取消</div>
                    <div class="btn confirm" @click="confirmTime">确定</div>
                </div>
                <div class="date-picker-body">
                    <div class="year-wrap">
                        <div
                            class="year"
                            @touchstart="touching=true"
                            @touchend="touching=false"
                            @scroll="timeScroll($event, 'year')"
                        >
                            <div
                                class="year-item"
                                v-for="(item, index) in yearArr"
                                :key="index"
                                :class="{
                                    gray: index === yearIndex - 1 || index === yearIndex + 1,
                                    grayer: index < yearIndex - 1 || index > yearIndex + 1
                                }"
                            >{{item}}</div>
                        </div>
                    </div>
                    <div class="month-wrap">
                        <div
                            class="month"
                            @touchstart="touching=true"
                            @touchend="touching=false"
                            @scroll="timeScroll($event, 'month')"
                        >
                            <div
                                class="month-item"
                                v-for="(item, index) in monthArr"
                                :key="index"
                                :class="{
                                    gray: item === monthArr[monthIndex - 1] || item === monthArr[monthIndex + 1],
                                    grayer: item === monthArr[monthIndex -2] || item === monthArr[monthIndex +2]
                                }"
                            >{{item}}</div>
                        </div>
                    </div>
                    <div class="date-wrap">
                        <div
                            class="date"
                            @touchstart="touching=true"
                            @touchend="touching=false"
                            @scroll="timeScroll($event, 'date')"
                        >
                            <div
                                class="date-item"
                                v-for="(item, index) in dateArr"
                                :key="index"
                                :class="{
                                    gray: item === dateArr[dateIndex - 1] || item === dateArr[dateIndex + 1],
                                    grayer: item === dateArr[dateIndex -2] || item === dateArr[dateIndex +2]
                                }"
                            >{{item}}</div>
                        </div>
                    </div>
                </div>
            </div>
        </transition>
    </div>
</template>

<script>
import { findIndex } from 'lodash';

export default {
    props: {
        minYear: {
            type: [String, Number],
            default: ''
        },
        maxYear: {
            type: [String, Number],
            default: ''
        },
        // 日期格式  1 YYYY/MM/DD 2 YYYY-MM-DD 3 YYYY年MM月DD日
        format: {
            type: Number,
            default: 3
        },
        visible: {
            type: Boolean,
            default: false
        }
    },
    data() {
        return {
            yearArr: [],
            monthArr: [],
            year: '',
            month: '',
            date: '',
            unitHeight: 0,
            timer: '',
            scrollTimer: '',
            touching: true,
            scrollFn: '',
            innerVisible: false
        };
    },
    computed: {
        dateArr() {
            let dateArr = ['', ''],
                length = 31;
            let arr = ['04', '06', '09', '11'];
            if (arr.includes(this.month)) {
                // 小月
                length = 30;
            } else if (this.month === '02') {
                // 二月
                if (
                    this.year % 400 === 0 ||
                    (this.year % 100 !== 0 && this.year % 4 === 0)
                ) {
                    // 闰年
                    length = 29;
                } else {
                    // 平年
                    length = 28;
                }
            }
            Array.from({ length }).forEach((v, i) => {
                let date = i + 1;
                date = String(date > 9 ? date : '0' + date);
                dateArr.push(date);
            });
            dateArr.push('');
            dateArr.push('');
            return dateArr;
        },
        yearIndex() {
            return findIndex(this.yearArr, (v) => v === this.year);
        },
        monthIndex() {
            return findIndex(this.monthArr, (v) => v === this.month);
        },
        dateIndex() {
            return findIndex(this.dateArr, (v) => v === this.date);
        }
    },
    watch: {
        touching(val) {
            if (!val && this.scrollFn) {
                this.scrollFn();
            }
        },
        visible(val) {
            if (val) {
                this.$nextTick(() => {
                    this.innerVisible = val
                    this.init()
                })
            }
        }
    },
    created() {},
    methods: {
        init() {
            // 获取当前日期
            this.year = new Date().getFullYear();
            console.log(this.year);
            const month = new Date().getMonth() + 1;
            this.month = String(month > 9 ? month : '0' + month);
            const date = new Date().getDate();
            this.date = String(date > 9 ? date : '0' + date);
            this.yearArr = ['', '']
            this.monthArr = ['', '']
            // 计算年月日数组
            for (let i = this.year - 10; i < this.year + 10; i++) {
                this.yearArr.push(i);
            }
            for (let i = 1; i < 13; i++) {
                let tempMonth = String(i > 9 ? i : '0' + i);
                this.monthArr.push(tempMonth);
            }
            this.yearArr.push('');
            this.yearArr.push('');
            this.monthArr.push('');
            this.monthArr.push('');
            this.$nextTick(() => {
                this.unitHeight = $('.date-picker-body').height() / 5;
                this.setTime();
            });
        },
        setTime() {
            document.querySelector('.year').scrollTop =
                (this.yearIndex - 2) * this.unitHeight;
            document.querySelector('.month').scrollTop =
                (this.monthIndex - 2) * this.unitHeight;
            document.querySelector('.date').scrollTop =
                (this.dateIndex - 2) * this.unitHeight;
        },
        timeScroll(e, type) {
            this.timer && clearTimeout(this.timer);
            let scrollTop = e.target.scrollTop;
            let index = parseInt(scrollTop / this.unitHeight);
            let rest = scrollTop % this.unitHeight;
            if (rest > this.unitHeight / 2) index++;
            this[type] = this[`${type}Arr`][index + 2];
            this.timer = setTimeout(() => {
                clearTimeout(this.timer);
                if (this.touching)
                    return (this.scrollFn = () => this.endScroll(type));
                this.endScroll(type);
                this.scrollFn = '';
            }, 200);
        },
        endScroll(type) {
            this.scrollTimer && clearInterval(this.scrollTimer);
            let dom = document.querySelector(`.${type}`);
            // dom当前滑到的高度
            let scrollTop = dom.scrollTop;
            // 需要滑到的高度
            let height = (this[`${type}Index`] - 2) * this.unitHeight;
            // 如果高度一样，不执行自动滑动
            if (height - scrollTop < 1 && height - scrollTop > -1)
                return this.setTime();
            let diff = height > scrollTop ? 1 : -1;
            this.scrollTimer = setInterval(() => {
                console.log('diff:' + diff);
                scrollTop += diff;
                dom.scrollTop = scrollTop;
                if (height - scrollTop < 1 && height - scrollTop > -1) {
                    dom.scrollTop = height;
                    clearInterval(this.scrollTimer);
                }
            }, 5);
        },
        confirmTime() {
            let arr = [this.year, this.month, this.month];
            let date = '';
            this.format === 1 && (date = arr.split('/'));
            this.format === 2 && (date = arr.split('-'));
            this.format === 3 &&
                (date =
                    this.year + '年' + this.month + '月' + this.date + '日');
            this.$emit('confirm', date);
            this.cancel();
        },
        // 关闭date-picker
        cancel() {
            this.innerVisible = false;
            setTimeout(() => {
                this.$emit('update:visible', false);
            }, 300);
        }
    }
};
</script>

<style lang="scss" scoped>
.date-picker-enter-active,
.date-picker-leave-active {
    transition: all 0.3s;
}
.date-picker-enter, .date-picker-leave-to /* .fade-leave-active below version 2.1.8 */ {
    transform: translateY(100%);
    opacity: 0;
}
.date-picker {
    position: fixed;
    left: 0;
    top: 0;
    right: 0;
    bottom: 0;
    background-color: rgba(0, 0, 0, 0.3);
    z-index: 99;
    &-inner {
        width: 100%;
        height: 40%;
        background-color: #fff;
        position: absolute;
        bottom: 0;
        border-radius: 8px 8px 0 0;
    }
    &-header {
        height: 41px;
        font-size: 16px;
        line-height: 40px;
        padding: 0 32px;
        display: flex;
        justify-content: space-between;
        border-bottom: 1px solid #ccc;
        .confirm {
            color: #006efe;
        }
    }
    &-body {
        width: 100%;
        height: calc(100% - 41px);
        display: flex;
        justify-content: space-around;
        color: #006efe;
        > div {
            flex: 1;
            overflow: hidden;
            position: relative;
            > div {
                position: absolute;
                // width: 100%;
                // height: 100%;
                left: 0;
                top: 0;
                right: 0;
                bottom: 0;
                margin-right: -10px;
                overflow: auto;
                > div {
                    height: 20%;
                    display: flex;
                    justify-content: center;
                    align-items: center;
                }
            }
        }
        .gray {
            color: #999;
        }
        .grayer {
            color: #ddd;
        }
    }
}
</style>