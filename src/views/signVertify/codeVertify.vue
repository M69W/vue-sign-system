<template>
    <div class="code-vertify">
        <div class="title">验证码验证</div>
        <div class="search-box">
            <el-form :inline="true">
                <el-form-item label="验证码">
                    <Authorized :authrity="$permissionMap.codeVertifySearch">
                        <el-input
                            v-model="searchForm.code"
                            placeholder="请输入验证码"
                            clearable
                        ></el-input>
                    </Authorized>
                </el-form-item>
                <el-form-item>
                    <Authorized :authrity="$permissionMap.codeVertifySearch">
                        <el-button
                            icon="iconfont icon-chaxun"
                            @click="queryCode"
                            >查询</el-button
                        >
                    </Authorized>
                </el-form-item>
            </el-form>
            <p class="tips">
                验证码查验指南：输入验证码查询对应的电子文件，下载文件对比验证。
            </p>
        </div>
        <!-- table -->
        <div class="table">
            <table>
                <thead>
                    <tr>
                        <td>主题</td>
                        <!-- <td>文件编码</td>
                        <td>已签次数</td>-->
                        <td>创建时间</td>
                        <td>最后签署时间</td>
                        <td>操作</td>
                    </tr>
                </thead>
                <tbody>
                    <tr v-show="showData">
                        <td>
                            <span v-text="vertify.theme"></span>
                        </td>
                        <!-- <td>
                            <span v-text="vertify.fileCode"></span>
                        </td>
                        <td>
                            <span v-text="vertify.signCount"></span>
                        </td>-->
                        <td>
                            <span v-text="vertify.createDate"></span>
                        </td>
                        <td>
                            <span v-text="vertify.signDate"></span>
                        </td>
                        <td>
                            <span class="oper-btn" @click="download">下载</span>
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>
    </div>
</template>

<script>
import { refreshMenuItem } from '@/mixins/clickMenuItemForRefresh';
export default {
    name: 'codeVertify',
    mixins: [refreshMenuItem],
    data() {
        return {
            showData: false,
            searchForm: {
                code: ''
            },
            vertify: ''
        };
    },
    watch: {
        isSameMenu(newVal, oldVal) {
            this.searchForm.code = '';
            this.vertify = '';
        }
    },
    filters: {},
    created() {},
    methods: {
        queryCode() {
            if (this.searchForm.code) {
                this.$api('codeVerify')
                    .post(
                        'postPath',
                        {},
                        {
                            code: this.searchForm.code
                        }
                    )
                    .then((res) => {
                        if (!res) return;
                        this.showData = true;
                        this.vertify = res.data.data;
                    })
                    .catch((err) => {
                        console.log(err);
                    });
            } else {
                this.$message.warning('请输入验证码');
            }
        },
        // 下载pdf
        download() {
            this.$api('downloadContract')
                .post(
                    'postBlobQuery',
                    {},
                    {
                        contractId: this.vertify.id
                    }
                )
                .then((res) => {
                    console.log(res);
                    if (!res) return;
                    let blob = res.data;
                    let url = window.URL.createObjectURL(blob);
                    let fileName =
                        res.headers['content-disposition'].split(
                            'filename='
                        )[1] || this.vertify.theme + '.zip';
                    let a = document.createElement('a');
                    a.download = fileName; // download Html5新属性下载超链接的目标/值为fileName
                    a.href = url;
                    a.id = 'download';
                    $('body').append(a); // 修复firefox中无法触发click
                    a.click();
                    $('#download').remove();
                });
        }
    }
};
</script>
<style lang="scss" scoped>
.code-vertify {
    margin: 0 0 0 22px;
    .title {
        height: 54px;
        line-height: 54px;
        color: #333;
        font-size: 16px;
        border-bottom: 1px solid #e9e9e9;
    }
    .search-box {
        margin: 20px 0;
        .el-input {
            width: 280px;
        }
        .el-button {
            position: relative;
            top: 2px;
            left: 22px;
        }
        .tips {
            margin-top: -8px;
            color: #999;
            font-size: 14px;
        }
    }
    .table {
        .oper-btn {
            margin-right: 16px;
            color: #999;
            border: none;
            cursor: pointer;
            &:hover {
                color: #4a90e2;
                background-color: transparent;
            }
            &:focus {
                color: red;
                background-color: #4a90e2;
            }
            .el-button {
                background-color: #4a90e2;
            }
        }
        table {
            width: 100%;
            thead {
                color: #fff;
                background-color: #4a90e2;
            }
            tbody {
                border: 1px solid #e9e9e9;
            }
            tr {
                height: 38px;
                line-height: 38px;
                td {
                    padding-left: 10px;
                }
            }
        }
    }
}
</style>
<style lang="scss">
.code-vertify {
    .table {
        .el-table__body-wrapper {
            margin: -1px 0 1px;
            border: 1px solid #e9e9e9;
        }
    }
}
</style>

