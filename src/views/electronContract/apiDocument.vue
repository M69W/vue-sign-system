<template>
    <div class="api-document">
        <div class="inner">
            <div class="tabs-list">
                <el-tabs :tab-position="tabPosition" class="tabs-box">
                    <el-tab-pane v-for="(items, index) in apiList" :label="items.title" :disabled="items.disabled" :key="index">
                        <div class="container-box">
                            <h5 class="h5" v-text="items.subTitle"></h5>
                            <pre class="content" v-text="items.content"></pre>
                            <!-- 接口信息列表 -->
                            <ul>
                                <li>
                                    <em v-text="items.portDesTitle"></em>
                                    <span v-text="items.portDes"></span>
                                </li>
                                <li>
                                    <em v-text="items.portLinkTitle"></em>
                                    <span v-text="items.portLink"></span>
                                </li>
                                <li>
                                    <em v-text="items.methodTitle"></em>
                                    <span v-text="items.method"></span>
                                </li>
                                <li>
                                    <em v-text="items.headersTitle"></em>
                                    <span v-text="items.headers"></span>
                                </li>
                            </ul>
                            <!-- 请求参数 -->
                            <div class="title" v-if="items.paramsTitle" v-text="items.paramsTitle"></div>
                            <table class="table" v-if="items.thead">
                                <thead>
                                    <tr>
                                        <td v-for="(items, index) in items.thead" :key="index" v-text="items"></td>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr v-for="(item,index) in items.tbody" :key="index">
                                        <td v-for="(items, index) in item" :key="index" v-text="items"></td>
                                    </tr>
                                </tbody>
                            </table>
                            <!-- 请求示例 -->
                            <div class="eg" v-if="items.egTitle">
                                <div class="title" v-text="items.egTitle"></div>
                                <pre v-text="items.eg"></pre>
                            </div>
                            <!-- 返回示例 -->
                            <div class="eg" v-if="items.backEgTitle">
                                <div class="title" v-text="items.backEgTitle"></div>
                                <pre v-text="items.backEg"></pre>
                            </div>
                            <!-- 返回参数 -->
                            <div class="title" v-text="items.backParams"></div>
                            <table class="table" v-if="items.thead2">
                                <thead>
                                    <tr>
                                        <td v-for="(item, index) in items.thead2" :key="index" v-text="item"></td>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr v-for="(item,index) in items.tbody2" :key="index">
                                        <td v-for="(items, index) in item" :key="index" v-text="items"></td>
                                    </tr>
                                </tbody>
                            </table>
                            <!-- data -->
                            <div class="title" v-if="items.dataTips" v-text="items.dataTips"></div>
                            <table class="table" v-if="items.thead3">
                                <thead>
                                    <tr>
                                        <td v-for="(item, index) in items.thead3" :key="index" v-text="item"></td>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr v-for="(item,index) in items.tbody3" :key="index">
                                        <td v-for="(items, index) in item" :key="index" v-text="items"></td>
                                    </tr>
                                </tbody>
                            </table>
                            <!-- jsonStr参数说明 -->
                            <div class="title" v-text="items.jsonStr"></div>
                            <table class="table table4" v-if="items.thead4">
                                <thead>
                                    <tr>
                                        <td v-for="(item, index) in items.thead4" :key="index" v-text="item"></td>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr v-for="(item,index) in items.tbody4" :key="index">
                                        <td v-for="(items, index) in item" :key="index" v-text="items"></td>
                                    </tr>
                                </tbody>
                            </table>
                            <!-- 接口返回码说明 -->
                            <div class="title" v-text="items.title6"></div>
                            <table class="table" v-if="items.thead6">
                                <thead>
                                    <tr>
                                        <td v-for="(item, index) in items.thead6" :key="index" v-text="item"></td>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr v-for="(item,index) in items.tbody6" :key="index">
                                        <td v-for="(items, index) in item" :key="index" v-text="items"></td>
                                    </tr>
                                </tbody>
                            </table>

                            <div class="title" v-text="items.title7"></div>
                            <table class="table" v-if="items.thead7">
                                <thead>
                                    <tr>
                                        <td v-for="(item, index) in items.thead7" :key="index" v-text="item"></td>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr v-for="(item,index) in items.tbody7" :key="index">
                                        <td v-for="(items, index) in item" :key="index" v-text="items"></td>
                                    </tr>
                                </tbody>
                            </table>

                            <div class="title" v-text="items.title8"></div>
                            <table class="table" v-if="items.thead8">
                                <thead>
                                    <tr>
                                        <td v-for="(item, index) in items.thead8" :key="index" v-text="item"></td>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr v-for="(item,index) in items.tbody8" :key="index">
                                        <td v-for="(items, index) in item" :key="index" v-text="items"></td>
                                    </tr>
                                </tbody>
                            </table>
                            
                            <!-- 错误码 -->
                            <div class="title" v-text="items.errCode"></div>
                            <table class="table" v-if="items.thead5">
                                <thead>
                                    <tr>
                                        <td v-for="(item, index) in items.thead5" :key="index" v-text="item"></td>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr v-for="(item, index) in items.tbody5" :key="index">
                                        <td v-for="(items, index) in item" :key="index" v-text="items"></td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </el-tab-pane>
                </el-tabs>
            </div>
        </div>
    </div>
</template>

<script>
import list from './apiList'

export default {
    data() {
        return {
            tabPosition: 'left',
            apiList: list
        }
    },
    methods: {
       
    }
};
</script>
<style lang="scss" scoped>
.api-document {
    .inner {
        // display: flex;
        position: absolute;
        left: 0;
        top: 0;
        right: 6px;
        bottom: 4px;
        .container-box {
            position: absolute;
            left: 0;
            right: 0;
            top: 0;
            bottom: 0;
            overflow-y: auto;
            width: 100%;
            margin: 30px;
            padding-bottom: 50px;
            pre {
                display: block;
                font-family: -moz-fixed;
                white-space: pre-wrap;
                line-height: 2;
            }
            ul {
                margin: 20px 0;
                li {
                    em {
                        font-weight: bold;
                    }
                    line-height: 2;
                }
            }
            .h5 {
                padding-top: 5px;
                font-size: 16px;
                font-weight: bold;
            }
            .table {
                width: 92%;
                margin-bottom: 20px;
                tr {
                    height: 36px;
                    line-height: 36px;
                    td {
                        padding-left: 10px;
                        border: 1px solid #e9e9e9;
                    }
                }
            }
            .eg {
                .title {
                    position: relative;
                    top: -6px;
                    z-index: 9;
                    padding-bottom: 10px;
                }
                pre {
                    position: relative;
                    top: -20px;
                    color: #f34d4d;
                    background-color: #e9e9e9;
                }
            }
            .title {
                margin-bottom: 10px;
                font-weight: bold;
            }
            .content {
                margin-top: 20px;
                line-height: 1.5;
            }
            .table4 {
                tr {
                    td:nth-child(2) {
                        width: 100px;
                    }
                    td:nth-child(4) {
                        width: 160px;
                    }
                }
            }
        }
    }
}
</style>
<style lang="scss">
.api-document {
    .el-tabs__header {
        width: 240px;
        padding: 0;
        &.is-left {
            margin-right: 0;
        }
        .el-tabs__nav-scroll {
            position: relative;
            height: 100vh;

            .el-tabs__nav {
                position: absolute;
                top: 0;
                left: 0;
                right: -20px;
                bottom: 0;
                z-index: 9;
                padding-bottom: 70px;
                overflow-y: auto;
                overflow-x: hidden;
            }
        }
    }
    .tabs-box {
        .el-tabs__content {
            position: relative;
            height: 100vh;
        }
    }
    .el-tabs__active-bar {
        background-color: #4a90e2;
        &.is-left{
            position: absolute;
            left: 0;
            z-index: 9;
            width: 2px;
        }
    }
    .el-tabs__item {
        &.is-left {
            height: 40px;
            line-height: 40px;
            text-align: left;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
        }
        &.is-active {
            color: #333;
            background: #fff;
        }
    }
    .el-tabs__nav-wrap {
        background-color: #f4f6f8;
    }
}
</style>