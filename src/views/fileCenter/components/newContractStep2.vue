<template>
    <div class="new_step_two">
        <div class="title">填写签署信息</div>
        <el-form
            label-position="top"
            label-width="100px"
            :model="form"
            class="info_form"
        >
            <!-- 签署对象 -->
            <el-form-item label="签署对象">
                <div class="sign_obj">
                    <div
                        class="sign_obj_item"
                        :class="{ active: form.signatoryWay === '01' }"
                        @click="selectSignObj('01')"
                    >
                        <p class="item">我需要签署</p>
                        <p class="desc">
                            （自己与对方均需签署，也可仅自己签署不发送）
                        </p>
                        <i class="iconfont icon-gou"></i>
                    </div>
                    <div
                        class="sign_obj_item"
                        :class="{ active: form.signatoryWay === '02' }"
                        @click="selectSignObj('02')"
                    >
                        <p class="item">仅需他人签署</p>
                        <p class="desc">（自己不需要签署，仅对方签署）</p>
                        <i class="iconfont icon-gou"></i>
                    </div>
                </div>
            </el-form-item>

            <!-- 签署方式 -->
            <el-form-item label="签署方式" class="sign_type">
                <el-radio v-model="form.signWay" label="01"
                    >无序签署：</el-radio
                >
                <span class="desc">签署顺序不受限制</span>
                <br />
                <el-radio v-model="form.signWay" label="02"
                    >顺序签署：</el-radio
                >
                <span class="desc"
                    >按签署顺序一人签署完再到下一环节签署，即A→B→C→D</span
                >
                <br />
                <el-radio v-model="form.signWay" label="03"
                    >每人单独签署：</el-radio
                >
                <span class="desc"
                    >发起方单独发送每个收件人签署，即A→B，A→C，A→D</span
                >
            </el-form-item>

            <!-- 签署人信息 -->
            <el-form-item label="签署人信息">
                <!-- 导入签署人按钮 -->
                <div class="btn_wrap">
                    <div class="btn_select" @click="addSignMan(0)">
                        <i class="iconfont icon-zuzhitianjia1"></i>
                        从组织添加
                    </div>
                    <div class="btn_select" @click="addSignMan(1)">
                        <i class="iconfont icon-piliangdaoru"></i>
                        批量导入
                    </div>
                </div>
                <!-- 签署人列表 -->
                <div class="sign_list">
                    <div
                        class="sign_list_item"
                        v-for="(item, index) in form.signInfos"
                        :key="index"
                    >
                        <el-input
                            size="small"
                            v-model="item.signName"
                            :disabled="index === 0"
                            placeholder="请输入用户名称"
                        ></el-input>
                        <el-input
                            size="small"
                            v-model="item.signContact"
                            :disabled="index === 0"
                            placeholder="请输入联系方式"
                        ></el-input>
                        <el-select
                            size="small"
                            v-model="item.type"
                            :disabled="index === 0"
                            placeholder="请选择"
                        >
                            <el-option label="需签署" value="01"></el-option>
                            <el-option label="仅抄送" value="02"></el-option>
                        </el-select>
                        <span
                            class="del_sign"
                            v-show="index !== 0"
                            @click="delSignList(index)"
                            >删除</span
                        >
                        <span class="add_sign" @click="addSignList(index)"
                            >增加</span
                        >
                    </div>
                </div>
            </el-form-item>
        </el-form>

        <div class="btn_wrap">
            <el-button type="info" plain @click="$router.go(-1)"
                >上一步</el-button
            >
            <el-button type="primary" @click="next">下一步</el-button>
        </div>

        <!-- 从组织中选择签署人弹框 -->
        <el-dialog
            :title="`选择签署人（已添加${count}人）`"
            :visible.sync="selectDialogVisible"
            width="800px"
            :before-close="handleSelectClose"
            class="select_dialog"
        >
            <div class="main_body">
                <div class="main_container">
                    <div class="tree_wrap">
                        <el-scrollbar>
                            <el-tree
                                :data="treeData"
                                :props="defaultProps"
                                @node-click="handleNodeClick"
                                node-key="id"
                                highlight-current
                                default-expand-all
                            ></el-tree>
                        </el-scrollbar>
                    </div>
                    <div class="table_wrap">
                        <el-input
                            v-model="searchForm.userNickName"
                            placeholder="关键字搜索成员名称/账号"
                            class="search_input"
                            @keyup.enter.native="handleSearch"
                        >
                            <i
                                slot="suffix"
                                class="iconfont icon-chaxun"
                                @click="handleSearch"
                            ></i>
                        </el-input>
                        <!-- 搜索的成员表格 -->
                        <div class="table">
                            <el-scrollbar>
                                <el-table
                                    :data="tableData"
                                    style="width: 100%"
                                    :row-class-name="tableRowClassName"
                                    :header-cell-style="headerStyle"
                                    @selection-change="changeSignMan"
                                    ref="signTable"
                                >
                                    <el-table-column
                                        type="selection"
                                        width="55"
                                    ></el-table-column>
                                    <el-table-column
                                        label="成员名称"
                                        prop="userNickName"
                                        show-overflow-tooltip
                                    ></el-table-column>
                                    <el-table-column
                                        label="登录账号"
                                        width="140px"
                                        prop="userName"
                                    ></el-table-column>
                                </el-table>
                            </el-scrollbar>
                        </div>
                        <!-- <div class="table">
                            <div class="table_header tr">
                                .name
                            </div>
                            <div
                                class="table_body tr"
                                v-for="(item, index) in tableData"
                                :key="index"
                            ></div>
                        </div>-->
                    </div>
                </div>
                <div class="footer">
                    <el-button
                        @click="
                            handleSelectClose(
                                () => (selectDialogVisible = false)
                            )
                        "
                        >取 消</el-button
                    >
                    <el-button type="primary" @click="submitSignMan"
                        >确 定</el-button
                    >
                </div>
            </div>
        </el-dialog>

        <!-- 批量导入弹窗 -->
        <el-dialog
            title="批量导入用户"
            :visible.sync="bulkImportVisible"
            width="640px"
            :before-close="handleClose"
            class="bulk_import"
        >
            <div class="main_container">
                <div class="title">
                    将把合同批量发送给多个签署人（上限100），由他们分别完成签署
                </div>
                <div class="item download">
                    <div class="left">
                        <span class="index">①</span>下载模板，批量填写用户信息
                    </div>
                    <div class="right">
                        <el-button @click="downloadModule">下载</el-button>
                    </div>
                </div>
                <div class="item">
                    <div class="left">
                        <span class="index">②</span>上传填写好的用户信息表
                    </div>
                    <div class="right">
                        <el-upload
                            ref="bulkUpload"
                            :action="`${baseUrl}/contract/batchImport`"
                            :on-progress="uploadProgress"
                            :show-file-list="false"
                            :before-upload="beforeUpload"
                            :on-success="uploadSuccess"
                            :on-error="uploadFail"
                            :headers="{
                                session_token:
                                    $store.state.userInfo.sessionToken
                            }"
                        >
                            <el-button>选择文件</el-button>
                        </el-upload>
                    </div>
                </div>
                <div class="file" v-show="showFile">
                    <div class="name" v-show="fileName">
                        <i class="iconfont icon-daoruwendang"></i>
                        {{ fileName }}
                    </div>
                    <el-progress
                        :stroke-width="2"
                        :percentage="progress"
                        :show-text="false"
                        color="#20A0FF"
                        v-show="showProgress"
                    ></el-progress>
                </div>
            </div>
            <div class="footer">
                <el-button
                    type="primary"
                    @click="submitImport"
                    :disabled="!canUpload"
                    >开始上传</el-button
                >
            </div>
        </el-dialog>
    </div>
</template>

<script>
import { setRowClass } from '@/mixins/setTableRowClass';
import { mapState } from 'vuex';
import {
    sessionStore,
    isEmail,
    isPhoneNum,
    checkBlobFileResponseUtils
} from '@/utils';
import FileSaver from 'file-saver';

export default {
    data() {
        return {
            baseUrl: process.env.NODE_ENV === 'development' ? '/apis' : '/sign',
            form: {
                signatoryWay: '',
                signWay: '01',
                signInfos: []
            },
            tableData: [],
            searchForm: {
                currentPage: 1,
                pageSize: 2000,
                isForbid: '0',
                userNickName: '',
                contentType: 'json'
            },
            tempSignList: [],
            selectList: {},
            selectDialogVisible: false,
            bulkImportVisible: false,
            progress: 0,
            treeData: [],
            defaultProps: {
                children: 'sonNodes',
                label: 'nodeName'
            },
            headerStyle: {
                background: '#C0CCDA',
                color: '#282828'
                // fontWeight: 'bold'
            },
            fileName: '',
            batchImportInfo: '',
            showFile: false,
            showProgress: false,
            canUpload: false
        };
    },
    computed: {
        ...mapState(['userInfo']),
        count() {
            let count = 0;
            for (const key in this.selectList) {
                console.log(this.selectList[key]);
                count += this.selectList[key].length;
            }
            count += this.tempSignList.length;
            return count;
        }
    },
    watch: {
        tableData: {
            handler(val) {
                // tableData改变，先检查是否存在已选中
                if (this.selectList[this.searchForm.nodeId]) {
                    let tableIndex = [];
                    let tempIndex = [];
                    // 遍历出tableData和选中列表里面对应的已选中的index
                    this.tableData.forEach((val, index) => {
                        this.selectList[this.searchForm.nodeId].forEach(
                            (v, i) => {
                                if (val.id === v.id) {
                                    tableIndex.push(index);
                                    tempIndex.push(i);
                                }
                            }
                        );
                    });
                    console.log(tableIndex, tempIndex);
                    // 将tableData的选中项设置为选中状态
                    tableIndex.forEach((v) => {
                        this.$nextTick(() => {
                            this.$refs.signTable.toggleRowSelection(
                                this.tableData[v],
                                true
                            );
                        });
                    });
                    // 将已选中列表中tableData中存在的项剔除
                    tempIndex.forEach((v, i) =>
                        this.selectList[this.searchForm.nodeId].splice(v - i, 1)
                    );
                }
            },
            deep: true
        }
    },
    created() {
        let contractForm = sessionStore.get('contractForm');
        this.form = Object.assign({}, this.form, contractForm);
        // 如果没有添加签署人，默认添加自己作为第一个
        if (this.form.signInfos.length === 0) {
            this.form.signInfos.push({
                signName: this.userInfo.userNickName,
                signContact: this.userInfo.userName,
                signatoryId: this.userInfo.id,
                type: ''
            });
        }
    },
    methods: {
        // 选择签署对象
        selectSignObj(val) {
            this.form.signatoryWay = val;
            this.form.signInfos[0].type = val;
        },
        // 手动添加签署列表成员
        addSignList(index) {
            this.form.signInfos.splice(index + 1, 0, {
                signName: '',
                signContact: '',
                signatoryId: new Date().getTime(),
                type: '01'
            });
        },
        // 删除签署列表成员
        delSignList(index) {
            this.form.signInfos.splice(index, 1);
        },

        handleSelectClose(done) {
            this.handleNodeClick(this.treeData[0]);
            this.selectList = {};
            this.tempSignList = [];
            done();
        },
        // 添加签署人
        async addSignMan(val) {
            if (val === 0) {
                this.selectDialogVisible = true;
                // 生成组织树
                let res = await this.$api('getNodeTree').get('getPath', {
                    enterpriseId: this.userInfo.enterpriseId
                });
                if (!res) return;
                let tree = res.data.data.rootNode;
                tree.sonNodes = res.data.data.sonNodeList;
                this.treeData = [tree];
                this.$nextTick(() => this.handleNodeClick(this.treeData[0]));
            }
            if (val === 1) {
                this.bulkImportVisible = true;
            }
        },
        // 点击树节点事件
        async handleNodeClick(data) {
            console.log(data);
            // 保存已选项
            this.saveSelection();
            this.searchForm.userNickName = '';
            this.searchForm.nodeId = data.id;
            // 搜索生成列表
            this.searchSignMan();
        },
        // 点击搜索
        handleSearch() {
            this.saveSelection();
            this.searchSignMan();
        },
        saveSelection() {
            // 表格有已选项才执行储存操作
            if (this.tempSignList.length > 0) {
                // 分节点储存，如果已有该节点数据，拼接，如果没有，$set新加一个
                if (this.selectList.hasOwnProperty(this.searchForm.nodeId)) {
                    this.selectList[this.searchForm.nodeId] = this.selectList[
                        this.searchForm.nodeId
                    ].concat(this.tempSignList);
                } else {
                    this.$set(
                        this.selectList,
                        this.searchForm.nodeId,
                        this.tempSignList
                    );
                }
                this.tempSignList = [];
            }
        },
        // 搜索
        async searchSignMan() {
            let res = await this.$api('pageListUserInfoByNodeId2').post(
                'postNormal',
                this.searchForm
            );
            if (!res) return;
            let tempArr = res.data.data.records;
            // 如果签署人信息列表已存在,就不显示在搜索结果列表里面
            this.tableData = tempArr.filter((v) => {
                let flag = true;
                for (const item of this.form.signInfos) {
                    if (item.signatoryId === v.id) {
                        flag = false;
                        break;
                    }
                }
                return flag;
            });
        },
        // 表格选项改变触发事件,参数为当前表格所有选中项
        changeSignMan(val) {
            this.tempSignList = val;
        },
        // 确定提交从组织导入的签署人
        submitSignMan() {
            // 先确认所有选项都保存
            this.saveSelection();
            // 将所有保存的选项格式化
            let arr = [];
            for (const key in this.selectList) {
                arr = arr.concat(this.selectList[key]);
            }
            arr = arr.map((v) => {
                return {
                    signContact: v.userName,
                    signName: v.userNickName,
                    signatoryId: v.id,
                    type: '01'
                };
            });
            // 添加进签署人信息列表
            this.form.signInfos = this.form.signInfos.concat(arr);
            this.handleSelectClose(() => (this.selectDialogVisible = false));
        },
        // 下载批量导入模板
        async downloadModule() {
            let res = await this.$api('downloadBatchImport').get('getBlob');
            if (!res) return;
            console.log(res);
            checkBlobFileResponseUtils(res.data)
                .then((res1) => {
                    FileSaver.saveAs(res.data, '批量导入模板.xlsx');
                })
                .catch((err) => {
                    this.$message.error(err);
                });
        },
        beforeUpload(file) {
            console.log(file);
            this.progress = 0;
            this.showProgress = true;
            this.showFile = true;
            this.fileName = file.name;
        },
        // 批量导入上传进度
        uploadProgress(event, file, fileList) {
            this.progress = event.percent;
        },
        uploadSuccess(res, file, fileList) {
            console.log(res);

            setTimeout(() => {
                this.showProgress = false;
            }, 700);
            if (res.code === 0) {
                this.batchImportInfo = res.data;
                this.canUpload = true;
            } else {
                let message = res.msg || '上传失败，请重新上传！';
                this.$message.error({ message, customClass: 'zZindex' });
                this.showFile = false;
            }
        },
        submitImport() {
            this.form.signInfos = this.form.signInfos.concat(
                this.batchImportInfo.signInfos
            );
            this.handleClose(() => (this.bulkImportVisible = false));
            this.$confirm(
                `<p class="confirm-title">导入完毕</p><p>已提交${this.batchImportInfo.total}条数据，成功导入${this.batchImportInfo.normal}条，
                其中${this.batchImportInfo.exception}条数据异常无法导入。</p>`,
                '',
                {
                    dangerouslyUseHTMLString: true,
                    confirmButtonText: '确定',
                    cancelButtonText: '点击下载',
                    type: 'success',
                    distinguishCancelAndClose: true
                }
            )
                .then(() => {
                    this.batchImportInfo = '';
                })
                .catch((err) => {
                    this.batchImportInfo = '';
                    if (err === 'cancel') {
                        this.downloadExceptionD();
                    }
                });
            // if (this.batchImportList.length > 0) {
            //     this.form.signInfos = this.form.signInfos.concat(
            //         this.batchImportList
            //     );
            // } else {
            //     this.$message.error({
            //         message: '导入的数据为空，请重新上传！',
            //         customClass: 'zZindex'
            //     });
            // }
        },
        async downloadExceptionD() {
            let res = await this.$api('exceptionD').get('getBlob');
            if (!res) return;
            console.log(res);
            checkBlobFileResponseUtils(res.data)
                .then((res1) => {
                    FileSaver.saveAs(res.data, '异常数据导出.xls');
                })
                .catch((err) => {
                    this.$message.error(err);
                });
        },
        download(url, fileName) {
            let a = document.createElement('a');
            a.style.display = 'none';
            a.download = fileName;
            a.href = url;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
        },
        blob2Url(blob) {
            let url;
            if (window.createObjectURL != undefined) {
                // basic
                url = window.createObjectURL(blob);
            } else if (window.URL != undefined) {
                // mozilla(firefox)
                url = window.URL.createObjectURL(blob);
            } else if (window.webkitURL != undefined) {
                // webkit or chrome
                url = window.webkitURL.createObjectURL(blob);
            }
            return url;
        },
        handleClose(done) {
            this.canUpload = false;
            this.$refs.bulkUpload.value = '';
            this.fileName = '';
            this.showFile = false;
            this.showProgress = false;
            done();
        },
        uploadFail(res, file, fileList) {
            console.log(res);
            this.showFile = false;
            setTimeout(() => {
                this.showProgress = false;
            }, 700);
        },

        // TODO 发起合同 >>> 下一步
        async next() {
            if (!this.form.signatoryWay) {
                return this.$message.error('请选择签署对象！');
            }
            let signInfos = this.form.signInfos.filter((v) => v.type === '01');
            if (!signInfos.length) {
                return this.$message.error('请设置签署人！');
            }
            let flag = true,
                msg = '';
            for (const item of this.form.signInfos) {
                if (!item.signName) {
                    msg = '签署/抄送人名称不能为空';
                    flag = false;
                    break;
                }
                if (!item.signContact) {
                    msg = '签署/抄送人联系方式不能为空';
                    flag = false;
                    break;
                }
                if (
                    !isEmail(item.signContact) &&
                    !isPhoneNum(item.signContact)
                ) {
                    msg = '签署/抄送人手机号或邮箱格式不正确';
                    flag = false;
                    break;
                }
            }
            if (!flag) return this.$message.error(msg);

            // 查重
            let phoneList = this.form.signInfos.map((v) => v.signContact);
            let noRepeatList = [...new Set(phoneList)];
            if (phoneList.length !== noRepeatList.length) {
                return this.$message.error(
                    '存在重复的签署人联系方式，请删除后继续！'
                );
            }

            // 保存合同信息
            sessionStore.set('contractForm', this.form);

            this.$router.push({
                path: 'step3'
            });
        }
    },
    mixins: [setRowClass]
};
</script>

<style lang="scss" scoped>
.new_step_two {
    > .title {
        height: 54px;
        line-height: 54px;
        font-size: 16px;
        font-weight: bold;
        padding-left: 10px;
        position: relative;
        &:before {
            content: '';
            width: 4px;
            height: 18px;
            background-color: #2a68c8;
            position: absolute;
            left: 0;
            top: 50%;
            transform: translateY(-50%);
        }
    }
    .info_form {
        .sign_obj {
            display: flex;
            .sign_obj_item {
                width: 360px;
                height: 86px;
                border: 1px solid #c0ccda;
                border-radius: 4px;
                margin-right: 40px;
                text-align: center;
                padding-top: 15px;
                cursor: pointer;
                position: relative;
                line-height: 26px;
                &.active {
                    border-color: #2a68c8;
                    p {
                        color: #2a68c8;
                    }
                    &:after {
                        content: '';
                        position: absolute;
                        top: -28px;
                        right: -28px;
                        border: 28px solid transparent;
                        border-bottom-color: #2a68c8;
                        transform: rotateZ(45deg);
                        z-index: 1;
                    }
                }
                .iconfont {
                    position: absolute;
                    z-index: 2;
                    top: 8px;
                    right: 3px;
                    color: #fff;
                    font-size: 12px;
                    line-height: 1;
                    transform: scale(0.8);
                }
                .item {
                    color: #333;
                }
                .desc {
                    color: #2a2a2a;
                }
            }
        }
        .sign_type {
            .desc {
                color: #999;
                font-size: 12px;
            }
        }
        .btn_wrap {
            color: #1890ff;
            margin-bottom: 20px;
            display: flex;
            .btn_select {
                width: 120px;
                border: 1px dashed #c0ccda;
                border-radius: 4px;
                font-size: 14px;
                margin-right: 20px;
                text-align: center;
                cursor: pointer;
                &:hover {
                    border-color: #2a68c8;
                }
                .iconfont {
                    margin-right: 3px;
                }
            }
        }
        .sign_list {
            &_item {
                width: 1110px;
                line-height: 50px;
                background-color: #fafafa;
                margin-bottom: 11px;
                padding-left: 10px;
                position: relative;
                &:hover {
                    background-color: #dee6f9;
                    .add_sign,
                    .del_sign {
                        color: #2a68c8;
                    }
                }
                &:after {
                    content: '';
                    width: 100%;
                    height: 1px;
                    position: absolute;
                    left: 0;
                    bottom: -6px;
                    background-color: #eee;
                }
                .el-input {
                    width: 354px;
                    margin-right: 10px;
                }
                .el-select {
                    margin-right: 30px;
                }
                .add_sign,
                .del_sign {
                    margin-right: 16px;
                    cursor: pointer;
                    color: #999;
                }
            }
        }
    }

    > .btn_wrap {
        .el-button {
            margin: 0;
            margin-right: 10px;
            width: 100px;
        }
    }

    .select_dialog {
        .main_body {
            .main_container {
                height: 498px;
                margin-bottom: 20px;
                display: flex;
                justify-content: space-between;
                .tree_wrap {
                    width: 300px;
                    border: 1px solid #edeeee;
                }
                .el-scrollbar {
                    height: 100%;
                    &__wrap {
                        overflow-x: hidden;
                    }
                }
                .table_wrap {
                    width: 440px;
                    .search_input {
                        margin-bottom: 10px;
                        .iconfont {
                            line-height: 36px;
                            cursor: pointer;
                        }
                    }
                    .el-table {
                        border-left: 1px solid #e9e9e9;
                        border-right: 1px solid #e9e9e9;
                    }
                    .table {
                        border: 1px solid #e9e9e9;
                        height: 450px;
                        // .tr {
                        //     height: 50px;
                        //     &.table_header {
                        //         background-color: #c0ccda;
                        //     }
                        //     &.table_body {
                        //         &:nth-of-type(2n + 1) {
                        //             background-color: #f4f6f8;
                        //         }
                        //     }
                        // }
                    }
                }
            }
            .footer {
                text-align: center;
                .el-button {
                    margin: 0 10px;
                    width: 80px;
                }
            }
        }
    }

    .bulk_import {
        .main_container {
            .title {
                color: #626262;
                line-height: 20px;
            }
            .item {
                width: 100%;
                height: 66px;
                border: 1px solid #e9e9e9;
                border-radius: 4px;
                padding: 0 30px;
                display: flex;
                justify-content: space-between;
                align-items: center;
                margin: 10px 0;
                &.download {
                    margin-bottom: 20px;
                }
                .left {
                    .index {
                        margin-right: 10px;
                    }
                }
                .right {
                    .el-button {
                        width: 98px;
                    }
                }
            }
            .file {
                .name {
                    color: #626262;
                    line-height: 20px;
                    margin-bottom: 6px;
                    .iconfont {
                        font-size: 14px;
                        margin-right: 8px;
                    }
                }
                .el-progress {
                    // width: 360px;
                }
            }
        }
        .footer {
            padding-top: 20px;
            text-align: center;
            .el-button {
                // margin: 0 10px;
                // width: 80px;
            }
        }
    }
}
</style>

<style lang="scss">
.new_step_two {
    .el-tree.el-tree--highlight-current {
        .el-tree-node.is-current.is-focusable > .el-tree-node__content {
            background-color: #1075eb;
            color: #fff;
        }
        .el-tree-node__content:hover {
            background-color: #e5e9f2;
        }
    }
    .info_form {
        .el-form-item__label {
            color: #999;
            padding: 0;
        }
        .el-radio {
            margin-right: 5px;
        }
    }
    .select_dialog {
        .el-dialog__body {
            padding: 20px;
        }
    }
}
</style>
