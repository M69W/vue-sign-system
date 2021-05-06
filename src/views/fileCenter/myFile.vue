<template>
    <div class="container-box myFile">
        <h1>我的文件</h1>
        <header class="header">
            <div class="info">
                <strong v-text="contentList.chineseName"></strong>
            </div>
            <div class="header-btn">
                <el-button size="medium">打印分配</el-button>
                <el-button size="medium">下载</el-button>
                <el-button size="medium">删除</el-button>

                <el-dropdown class="dropdown" @command="handleCommand">
                    <el-button size="medium">
                        文件签署<i
                            class="el-icon-arrow-down el-icon--right"
                        ></i>
                    </el-button>
                    <el-dropdown-menu slot="dropdown">
                        <el-dropdown-item command="发起合同"
                            >发起合同</el-dropdown-item
                        >
                        <el-dropdown-item command="快捷签署"
                            >快捷签署</el-dropdown-item
                        >
                    </el-dropdown-menu>
                </el-dropdown>
            </div>
        </header>
        <!-- 我的文件-详情 -->
        <div class="document-detail">
            <ul>
                <li>
                    <span>文件大小：</span>
                    <span v-text="contentList.creditCode"></span>
                </li>
                <li>
                    <span>文件编码：</span>
                    <span v-text="contentList.organizationCode"></span>
                </li>
                <li>
                    <span>文件HASH：</span>
                    <span v-text="contentList.id"></span>
                </li>
                <li>
                    <span>已签署次数：</span>
                    <span v-text="contentList.extDefine"></span>
                </li>
                <li>
                    <span>创建时间：</span>
                    <span v-text="contentList.gmtCreate"></span>
                </li>
                <li>
                    <span>最后签署时间：</span>
                    <span v-text="contentList.gmtCreate"></span>
                </li>
            </ul>
            <div class="num">
                <span>已下载次数<em>108</em></span>
                <span>已打印次数<em>123</em></span>
            </div>
        </div>
        <!-- 我的文件tab -->
        <div class="tabs-box">
            <el-tabs v-model="activeName" @tab-click="handleClick">
                <el-tab-pane label="文件内容" name="second">
                    <file-content></file-content>
                </el-tab-pane>
                <el-tab-pane label="签署日志" name="first">
                    <file-log></file-log>
                </el-tab-pane>
                <el-tab-pane label="打印日志" name="third">
                    <print-log></print-log>
                </el-tab-pane>
            </el-tabs>
        </div>
    </div>
</template>

<script>
import fileContent from '@/views/fileCenter/fileContent';
import fileLog from '@/views/fileCenter/fileLog';
import printLog from '@/views/fileCenter/printLog';

export default {
    name: 'myFile',
    data() {
        return {
            activeName: 'second',
            contentList: {
                chineseName: '安逸签章系统使用说明书'
            }
        };
    },
    components: {
        fileContent,
        fileLog,
        printLog
    },
    methods: {
        handleClick(tab, event) {
            console.log(tab, event);
        },
        handleCommand(command) {
            this.$message.info(command);
        }
    }
};
</script>

<style lang="scss" scoped>
.myFile {
    .header {
        display: flex;
        align-items: center;
        margin-bottom: 15px;
        .info {
            flex: 1;
        }
        .header-btn {
            margin-right: 20px;
            .dropdown {
                margin-left: 10px;
            }
        }
    }
    .document-detail {
        display: flex;
        padding: 15px 5px 5px;
        ul {
            flex: 1;
            li {
                width: 30%;
                display: inline-block;
                margin-bottom: 15px;
                .title {
                    display: inline-block;
                    width: 130px;
                    text-align: right;
                }
            }
        }
        .num {
            text-align: center;
            span {
                display: inline-block;
                margin-right: 20px;
                color: #999;
                em {
                    display: block;
                    margin-top: 5px;
                    color: #000;
                }
            }
        }
    }
    .tabs-box {
        margin-top: 30px;
    }
}
</style>


