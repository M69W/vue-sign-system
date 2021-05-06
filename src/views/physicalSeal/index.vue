<template>
    <div class="container-physicalseal">
        <div class="title">物理印章</div>

        <!-- 搜索、添加导入 -->
        <div class="tool">
            <div class="query">
                <el-input
                    style="width: 260px;"
                    v-model="queryValue"
                    placeholder="请输入印章名称、保管人、领取人"
                    clearable
                ></el-input>

                <el-select 
                    clearable
                    style="width: 160px; margin-left: 8px;"
                    v-model="sealType" 
                    placeholder="请选择印章类型"
                    >
                    <el-option
                        v-for="item in sealOptions" :key="item.value"
                        :label="item.label"
                        :value="item.value"
                    ></el-option>
                </el-select>

                <el-button style="margin-left: 8px;" type="primary" icon="el-icon-search" @click="querySeal">查询</el-button>
                <el-button type="primary" icon="el-icon-refresh-right" @click="queryReset">重置</el-button>
            </div>

            <div class="add-io">
                <el-button type="primary" icon="el-icon-plus" @click="showDialogForm(null ,'add')">添加印章</el-button>
                <el-button type="primary" icon="el-icon-upload2" @click="dialogVisibleIO = true">批量导入</el-button>
            </div>
        </div>

        <!-- 物理印章列表 -->
        <div class="content">
            <el-table
                :data="tableData"
                border
                style="width: 100%"
                :row-class-name="dispatchRowIndex"
                @row-click="rowClick"
                >
                <el-table-column
                    align="center"
                    v-for="(thItem, thIdx) in tableHeader" :key="thIdx"
                    :prop=thItem.prop
                    :label=thItem.label
                    :min-width=thItem.width>
                </el-table-column>
                <el-table-column
                    align="center"
                    label="操作"
                    width="180">
                    <template slot-scope="scope">
                        <div class="operations">
                            <div class="btn" @click="showDialogForm(scope.row, 'edit')">编辑</div>
                            <div v-if="scope.row.status == 1" class="btn" @click="showDialogUseOutter(scope.row)">领用</div>
                            <div v-else class="btn" style="color: #ccc;">领用</div>
                            <div v-if="scope.row.status == 2" class="btn" @click="showDialogReturn(scope.row)">归还</div>
                            <div v-else class="btn" style="color: #ccc;">归还</div>
                            <div class="btn" @click="showDialogLog(scope.row)">记录</div>
                        </div>
                    </template>
                </el-table-column>
            </el-table>
        </div>

        <!-- 分页 -->
        <div class="pagination">
            <el-pagination
                @size-change="handleSizeChange"
                @current-change="handleCurrentChange"
                :current-page="currentPage"
                :page-sizes="[10, 20, 30, 50]"
                :page-size="pageSize"
                layout="total, sizes, prev, pager, next, jumper"
                :total="total"
            ></el-pagination>
        </div>

        <!-- 弹窗 -->
        <div class="dialog">
            <!-- 批量导入 -->
            <el-dialog title="批量导入" :visible.sync="dialogVisibleIO">
                <div class="io">
                    <div class="desc">批量导入物理印章</div>
                    <div class="load load-o">
                        <span>① 下载模板，批量填写物理印章信息</span>
                        <el-button icon="el-icon-download" @click="excelOutput">下载模板</el-button>
                    </div>
                    <div class="load load-i">

                        <span>② 上传填写好的物理印章信息 ( *.xls )</span>
                        <!-- :action="`${baseUrl}/physicalSeal/physicalSealBatchImport`" -->
                        <el-upload
                            ref="upload"
                            :auto-upload="false"
                            action="#"
                            :show-file-list="false"
                            :file-list="fileList"
                            :limit="1"
                            :on-change="excelImport"
                            accept=".xls, .xlsx"
                            >
                            <el-button icon="el-icon-upload2">导入文件</el-button>
                        </el-upload>
                    </div>
                </div>
            </el-dialog>

            <!-- 添加/编辑印章 -->
            <el-dialog title="收货地址" :visible.sync="dialogFormVisible" width="36%">
                <el-form :model="form" :rules="rules">
                    <el-form-item label="物理印章名称" prop="name" :label-width="formLabelWidth">
                        <el-input clearable v-model="form.name" autocomplete="off"></el-input>
                    </el-form-item>
                    <el-form-item label="物理印章编码" prop="code" :label-width="formLabelWidth">
                        <el-input clearable v-model="form.code" autocomplete="off"></el-input>
                    </el-form-item>

                    <el-form-item label="印章类型" prop="type" :label-width="formLabelWidth">
                        <el-select v-model="form.type" placeholder="请选择" clearable>
                            <el-option 
                                v-for="(item, idx) in sealOptions" :key="idx"
                                :label="item.label" 
                                :value="item.value"
                            ></el-option>
                        </el-select>
                    </el-form-item>

                    <el-form-item label="保管单位/部门" prop="department" :label-width="formLabelWidth">
                        <el-input clearable v-model="form.department" autocomplete="off"></el-input>
                    </el-form-item>

                    <el-form-item label="保管人" prop="keeper" :label-width="formLabelWidth">
                        <el-input clearable v-model="form.keeper" autocomplete="off"></el-input>
                    </el-form-item>

                    <el-form-item label="印章状态" prop="status" :label-width="formLabelWidth">
                        <el-select v-model="form.status" placeholder="请选择" clearable :disabled="isEdit">
                            <el-option 
                                v-for="(item, idx) in statusOptions" :key="idx"
                                :label="item.label" 
                                :value="item.value"
                            ></el-option>
                        </el-select>
                    </el-form-item>
                </el-form>
                <div slot="footer" class="dialog-footer">
                    <el-button v-if="!isEdit" @click="dialogFormVisible = false">取 消</el-button>
                    <el-button v-else @click="dialogFormDel">删 除</el-button>
                    <el-button type="primary" @click="dialogFormConfirm">确 定</el-button>
                </div>
            </el-dialog>

            <!-- 领用 -->
            <el-dialog title="物理印章领用" :visible.sync="dialogVisibleUseOutter">
                 <el-form :model="formUse" :rules="rulesUse">
                    <el-form-item label="领用人" prop="user" :label-width="formLabelWidth">
                        <el-input 
                            clearable 
                            readonly
                            v-model="formUse.user" 
                            placeholder="请选择领用人"
                            @click.native="dialogVisibleUseInner = true"
                        ></el-input>
                    </el-form-item>
                    <el-form-item label="领用说明" prop="desc" :label-width="formLabelWidth">
                        <el-input type="textarea" :rows="4" clearable v-model="formUse.desc"></el-input>
                    </el-form-item>
                </el-form>

                <!-- 内部弹窗 -->
                <el-dialog title="选择领用人" :visible.sync="dialogVisibleUseInner" width="50%" append-to-body>
                    <!-- 组织树 -->
                    <org-tree-select
                        :eid="enterpriseId"
                        :selectedMemberList="selectedMemberList"
                        @confirm="confirmSelectMember"
                        @cancel="cancelSelectMember"
                    ></org-tree-select>
                </el-dialog>

                <div slot="footer" class="dialog-footer">
                    <el-button @click="dialogVisibleUseOutter = false">取 消</el-button>
                    <el-button type="primary" @click="dialogUseOutterConfirm">确 定</el-button>
                </div>
            </el-dialog>

            <!-- 归还 -->
            <el-dialog
                title="归还物理印章"
                :visible.sync="dialogVisibleReturn"
                width="30%"
                >
                <i class="el-icon-warning" style="color: #FFBA00; margin-right: 12px;"></i>
                <span>领用物理印章已归还</span>
                <span slot="footer" class="dialog-footer">
                    <el-button @click="dialogVisibleReturn = false">取 消</el-button>
                    <el-button type="primary" @click="dialogReturnConfirm">确 定</el-button>
                </span>
            </el-dialog>

            <!-- 记录 -->
            <el-dialog 
                width="60%"
                title=" 物理印章操作记录" 
                :visible.sync="dialogVisibleLog">
                <el-table
                    :data="tableDataLog"
                    border
                    style="width: 100%">
                    <el-table-column
                        align="center"
                        v-for="(thItem, thIdx) in tableHeaderLog" :key="thIdx"
                        :prop=thItem.prop
                        :label=thItem.label
                        :min-width=thItem.width>
                    </el-table-column>
                </el-table>

                <div class="pagination">
                    <el-pagination
                        @size-change="handleSizeChangeLog"
                        @current-change="handleCurrentChangeLog"
                        :current-page="currentPageLog"
                        :page-sizes="[10, 20, 30, 50]"
                        :page-size="pageSizeLog"
                        layout="total, sizes, prev, pager, next, jumper"
                        :total="totalLog"
                    ></el-pagination>
                </div>                
            </el-dialog>
        </div>
    </div>
</template>

<script>

import tableConfig from './config/table.config'
import sealConfig from './config/seal.config'
import OrgTreeSelect from '@/components/OrgTreeSelect.vue'
import FileSaver from 'file-saver'
import { checkBlobFileResponseUtils } from '@/utils'

export default {
    components: {
        'org-tree-select': OrgTreeSelect
    },
    data() {
        return {
            userInfo: null,
            enterpriseId: '',

            // 搜索 ///
            queryValue: '',
            sealType: '',
            sealOptions: sealConfig.sealOptions,

            // 列表 ///
            tableHeader: tableConfig.tableHeader,
            tableData: [],

            // 分页 ///
            currentPage: 1,
            pageSize: 10,
            total: 0,

            // 弹窗 ///
            // 批量导入
            dialogVisibleIO: false,
            baseUrl: process.env.NODE_ENV == 'development' ? '/apis' : '/sign',
            fileList: [],

            // 添加/编辑印章
            isEdit: false,
            dialogFormVisible: false,
            statusOptions: sealConfig.statusOptions,
            form: {
                name: '',
                code: '',
                type: '',
                department: '',
                keeper: '',
                status: ''
            },
            rules: {
                name: [
                    { required: true, message: '请输入物理印章名称', trigger: 'blur'}
                ],
                type: [
                    { required: true, message: '请选择领用人', trigger: 'blur'}
                ],
                status: [
                    { required: true, message: '请选择领用人', trigger: 'blur'}
                ],
            },
            formLabelWidth: '120px',

            // 领用
            dialogVisibleUseOutter: false,
            formUse: {
                user: '',
                userId: '',
                desc: ''
            },
            rulesUse: {
                user: [
                    { required: true, message: '请选择领用人', trigger: 'change'}
                ]

            },
            dialogVisibleUseInner: false,
            selectedMemberList: [],


            // 归还
            dialogVisibleReturn: false,
            // 记录
            dialogVisibleLog: false,
            tableHeaderLog: tableConfig.tableHeaderLog,
            tableDataLog: [],
            currentPageLog: 1,
            pageSizeLog: 10,
            totalLog: 0,

            // 其他
            curRow: null,

        };
    },
    mounted() {
        this.userInfo = this.$store.state.userInfo
        this.enterpriseId = this.userInfo.enterpriseId

        this.getPhysicalSealList()
    },
    methods: {
        // 
        // APIs
        // -----------------------------------------------------------
        apiGetPhysicalSealList(data) {
            return this.$api('urlGetPhysicalSealList').post('postQuery', null, data)
        },
        apiGetPhysicalSealLogList(data) {
            return this.$api('urlGetPhysicalSealLogList').post('postQuery', null, data)
        },
        apiAddPhysicalSeal(data) {
            return this.$api('urlAddPhysicalSeal').post('postNormal', data)
        },
        apiUpdatePhysicalSeal(data) {
            return this.$api('urlUpdatePhysicalSeal').post('postNormal', data)
        },
        apiDeletePhysicalSeal(data) {
            return this.$api('urlDeletePhysicalSeal').delete('deletePath', {}, data)
        },
        apiUsePhysicalSeal(data) {
            return this.$api('urlUsePhysicalSeal').post('postNormal', data)
        },
        apiBackPhysicalSeal(data) {
            return this.$api('urlBackPhysicalSeal').post('postNormal', data)
        },
        apiOutputPhysicalSealSamples() {
            return this.$api('urlOutputPhysicalSealSamples').get('getBlob')
        },
        apiImportPhysicalSealSamples(data) {
            return this.$api('urlImportPhysicalSealSamples').post('postFormData', data)
        },

        // -----------------------------------------------------------
        async getPhysicalSealList() {
            let _data = {
                currPage: this.currentPage,
                pageSize: this.pageSize,
                word: this.queryValue,
                sealType: this.sealType
            }

            let res = await this.apiGetPhysicalSealList(_data)
            if (!res) return

            let _tableData = []
            res.data.data.records.forEach(item => {
                _tableData.push({
                    id: item.id,
                    name: item.sealName,
                    code: item.sealCode,
                    type: item.sealType,
                    typeF: this.formatData('seal', item.sealType),
                    department: item.sealEn,
                    keeper: item.sealSafeUser,
                    status: item.sealStatus,
                    statusF: this.formatData('status', item.sealStatus),
                    user: item.userNickName,
                    userId: item.sealUseUserId,
                    date: item.sealUseDate,
                })
            })

            this.tableData = _tableData
            this.total = res.data.data.total
        },

        async getPhysicalSealLogList(id) {
            let _data = {
                currPage: this.currentPageLog,
                pageSize: this.pageSizeLog,
                physicalSealId: id
            }

            let res = await this.apiGetPhysicalSealLogList(_data)
            if (!res) return

            let _tableDataLog = []
            res.data.data.records.forEach(item => {
                _tableDataLog.push({
                    date: item.gmtCreate,
                    type: item.operationType,
                    typeF: this.formatData('operation', item.operationType),
                    desc: item.operationRemark,
                    user: item.userNickName
                })
            })

            this.tableDataLog = _tableDataLog
            this.totalLog = res.data.data.total
        },

        // 搜索 ///
        querySeal() {
            this.currentPage = 1
            this.getPhysicalSealList()
        },
        queryReset() {
            this.currentPage = 1

            this.queryValue = ''
            this.sealType = ''

            this.getPhysicalSealList()
        },

        // 列表 ///
        dispatchRowIndex({ row, rowIndex }) {
            row.index = rowIndex
        },
        rowClick(row) {
            console.log(row.index);
            this.curRow = row
        },

        // 分页 ///
        handleSizeChange(val) {
            // console.log(`每页 ${val} 条`);
            this.pageSize = val
            this.getPhysicalSealList()
        },
        handleCurrentChange(val) {
            // console.log(`当前页: ${val}`);
            this.currentPage = val
            this.getPhysicalSealList()
        },

        // 弹窗 ///
        showDialogForm(row, flag) {
            // console.log(row)
            this.dialogFormVisible = true

            if (flag == 'add') {
                // ^ 添加印章
                this.isEdit = false
                this.statusOptions = this.statusOptions.filter(item => item.value != 2)

                this.form = {
                    name: '',
                    code: '',
                    type: '',
                    department: '',
                    keeper: '',
                    status: ''
                }

                // apiAddPhysicalSeal

            } else if (flag == 'edit') {
                // ^ 编辑
                this.statusOptions = sealConfig.statusOptions
                this.isEdit = true
                this.form = row
            }
        },
        async dialogFormDel() {
            console.log(this.curRow);

            let _data = {
                id: this.curRow.id
            }

            let res = await this.apiDeletePhysicalSeal(_data)
            if (!res) return

            this.dialogFormVisible = false
            this.$message.success('删除成功')
            this.getPhysicalSealList()
        },
        async dialogFormConfirm() {
            let _data = []
            let res = null

            if (!this.isEdit) {
                // ^ 添加
                // console.log(this.form)

                _data = {
                    sealCode: this.form.code,
                    sealEn: this.form.department,
                    sealName: this.form.name,
                    sealSafeUser: this.form.keeper,
                    sealStatus: this.form.status,
                    sealType: this.form.type
                }

                res = await this.apiAddPhysicalSeal(_data)

            } else {
                // ^ 编辑
                _data = {
                    id: this.curRow.id,
                    sealCode: this.curRow.code,
                    sealEn: this.curRow.department,
                    sealName: this.curRow.name,
                    sealSafeUser: this.curRow.keeper,
                    sealStatus: this.curRow.status,
                    sealType: this.curRow.type
                }

                res = await this.apiUpdatePhysicalSeal(_data)
            }

            if (!res) return

            this.$message.success(this.isEdit ? '更新成功' : '添加成功')

            this.getPhysicalSealList()
            this.dialogFormVisible = false
        },
        // 导入、导出
        async excelOutput() {
            let res = await this.apiOutputPhysicalSealSamples()
            if (!res) return

            this.dialogVisibleIO = false

            checkBlobFileResponseUtils(res.data)
                .then((res1) => {
                    FileSaver.saveAs(res.data, '批量导入模板.xls');
                })
                .catch((err) => {
                    this.$message.error(err);
                });
        },
        async excelImport(file) {
            let _data = new FormData()
            _data.append('file', file.raw)

            let res = await this.apiImportPhysicalSealSamples(_data)
            this.$refs.upload.clearFiles()  // 清空已上传文件列表
            if (!res) return

            this.$message.success('导入成功')
            this.getPhysicalSealList()
            this.dialogVisibleIO = false
        },
        // 领用
        showDialogUseOutter(row) {
            // console.log(row);
            this.dialogVisibleUseOutter = true
            this.formUse = row
        },
        async dialogUseOutterConfirm() {

            let _data = {
                operationRemark: this.formUse.desc,
                operationUserId: this.curRow.userId,
                physicalSealId: this.curRow.id
            }

            let res = await this.apiUsePhysicalSeal(_data)
            if (!res) return

            this.$message.success('领用成功')
            this.getPhysicalSealList()
            this.dialogVisibleUseOutter = false
        },
        showDialogUseInnter() {
            this.dialogVisibleUseInner = true
        },
        cancelSelectMember() {
            this.dialogVisibleUseInner = false
        },
        confirmSelectMember(list) {
            // console.log(list[0])
            if (list.length > 1) {
                this.$message.warning({
                    message: '您只能选择一个领用人',
                    customClass: 'zZindex'
                });

                return
            }

            this.formUse.userId = list[0].id
            this.formUse.user = list[0].name

            this.dialogVisibleUseInner = false
        },
        // 归还
        showDialogReturn(row) {
            this.dialogVisibleReturn = true
        },
        async dialogReturnConfirm() {
            let _data = {
                physicalSealId: this.curRow.id
            }

            let res = await this.apiBackPhysicalSeal(_data)
            if (!res) return

            this.$message.success('归还成功')
            this.getPhysicalSealList()
            this.dialogVisibleReturn = false
        },
        // 记录
        async showDialogLog(row) {
            await this.getPhysicalSealLogList(row.id)
            this.dialogVisibleLog = true
        },
        handleSizeChangeLog(val) {
            // console.log(`每页 ${val} 条`);
            this.pageSizeLog = val
            this.getPhysicalSealLogList(this.curRow.id)
        },
        handleCurrentChangeLog(val) {
            // console.log(`当前页: ${val}`);
            this.currentPageLog = val
            this.getPhysicalSealLogList(this.curRow.id)
        },

        // 工具 ///
        // ------------------------------------------------------------------
        formatData(type, str) {
            if (type == 'seal') {
                // 印章名称
                let idx = sealConfig.sealOptions.findIndex(item => str == item.value)
                return sealConfig.sealOptions[idx].label

            } else if (type == 'status') {
                // 印章状态
                let idx = sealConfig.statusOptions.findIndex(item => str == item.value)
                return sealConfig.statusOptions[idx].label
            } else if (type == 'operation') {
                // 操作状态
                let idx = sealConfig.operationOptions.findIndex(item => str == item.value)
                return sealConfig.operationOptions[idx].label
            }
        },
    },
};
</script>

<style lang="scss" scoped>
.container-physicalseal {
    margin: 20px;

    .title {
        font-size: 16px;
        margin: 16px 0;
        padding-left: 16px;
        border-left: 2px solid #19f;
    }

    // 搜索 ///
    .tool {
        display: flex;
        justify-content: space-between;
        margin-bottom: 20px;
    }

    // 列表 ///
    .content {
        min-height: 520px;
        // background: #fee;

        .operations {
            display: flex;
            justify-content: space-between;

            .btn {
                color: #19f;
                &:hover {
                    cursor: pointer;
                }
            }
        }
    }

    // 分页 ///
    .pagination {
        float: right;
        margin: 20px 0 40px 0;
    }

    // 弹窗 ///
    .dialog {
        .io {
            display: flex;
            flex-direction: column;
            justify-content: space-evenly;
            height: 260px;

            .load {
                display: flex;
                justify-content: space-between;
                align-items: center;

                // background: #fee;
                border: 1px dashed #ccc;
                margin: 16px 0;
                padding: 16px;
                height: 80px;
            }
        }
    }
}
</style>

<style lang="scss">
.container-physicalseal {
    .el-table--border {
        border: 1px solid #dfe6ec;
    }

    tr:nth-child(even) {
        background: #F4F6F8;
    }

    .dialog {
        .el-dialog {
            min-height: 180px;
        }

        .el-select {
            width: 100%;
        }
    }
}
</style>