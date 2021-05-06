<template>
    <div class="container-orgtreeselect">
        <div class="main">
            <!-- 组织 -->
            <div class="org">
                <!-- <el-scrollbar> -->
                    <el-tree
                        :data="treeData"
                        :props="defaultProps"
                        @node-click="handleNodeClick"
                        node-key="id"
                        highlight-current
                        default-expand-all
                    ></el-tree>
                <!-- </el-scrollbar> -->
            </div>

            <!-- 成员 -->
            <div class="member">
                <div class="query">
                    <el-input
                        placeholder="关键字搜索成员名称/账号"
                        suffix-icon="el-icon-search"
                        v-model="queryValue"
                        clearable
                    ></el-input>
                </div>
                <div class="table">
                    <el-table
                        ref="multipleTable"
                        height="400"
                        :data="tableData"
                        tooltip-effect="light"
                        style="width: 100%"
                        @selection-change="handleSelectionChange">
                        <el-table-column
                            type="selection"
                            width="55">
                        </el-table-column>
                        <el-table-column
                            align="center"
                            prop="name"
                            label="成员名称"
                            width="120"
                            show-overflow-tooltip>
                        </el-table-column>
                        <el-table-column
                            align="center"
                            prop="account"
                            label="登录账号"
                            show-overflow-tooltip>
                        </el-table-column>
                    </el-table>
                </div>
            </div>
        </div>

        <div class="footer">
            <el-button @click="$emit('cancel')">取 消</el-button>
            <el-button type="primary" @click="confirm">确 定</el-button>
        </div>
    </div>
</template>

<script>
export default {
    props: {
        eid: String,
        selectedMemberList: Array,
    },
    data() {
        return {
            // 组织树
            treeData: [],
            defaultProps: {
                children: 'sonNodes',
                label: 'nodeName',
            },
            // 搜索
            queryValue: '',
            // 成员列表
            tableData: [],
            multipleSelection: this.selectedMemberList,
        };
    },
    mounted() {
        console.log(this.eid);
        this.getNodeTree();
    },
    methods: {
        // APIs ///
        // -------------------------------------------------------
        apiGetNodeTree(data) {
            return this.$api('urlGetNodeTree').get('getPath', data);
        },
        apiGetNodeTreeUserInfo(data) {
            return this.$api('urlGetNodeTreeUserInfo').post('postNormal', data);
        },
        // -------------------------------------------------------
        async getNodeTree() {
            let _data = {
                id: this.eid,
            };

            let res = await this.apiGetNodeTree(_data);
            if (!res) return;

            // console.log(res.data.data);

            let _tree = res.data.data.rootNode;
            _tree.sonNodes = res.data.data.sonNodeList;
            this.treeData = [_tree];

            this.$nextTick(() => this.handleNodeClick(this.treeData[0]))
        },

        async getNodeTreeUserInfo(nodeId) {
            let _data = {
                currentPage: 1,
                pageSize: 2000,
                isForbid: '0',
                userNickName: '',
                nodeId: nodeId,
            };

            let res = await this.apiGetNodeTreeUserInfo(_data);
            if (!res) return;

            console.log(res.data.data.records);

            let _tableData = []
            res.data.data.records.map(item => {
                _tableData.push({
                    id: item.id,
                    nodeId: item.nodeId,
                    name: item.userNickName,
                    account: item.userName
                })
            })

            this.tableData = _tableData
        },
        // 获取节点下成员
        handleNodeClick(data) {
            // console.log(data);
            this.getNodeTreeUserInfo(data.id)
        },
        toggleSelection(rows) {
            if (rows) {
            rows.forEach(row => {
                this.$refs.multipleTable.toggleRowSelection(row);
            });

            } else {
                this.$refs.multipleTable.clearSelection();
            }
        },
        // 已选成员
        handleSelectionChange(val) {
            // val - Array
            console.log(val);
            this.multipleSelection = val;
        },
        confirm() {
            // console.log(this.multipleSelection)
            this.$emit('confirm', this.multipleSelection)
        }
    },
};
</script>

<style lang="scss" scoped>
.container-orgtreeselect {
    .main {
        display: flex;
        justify-content: space-between;

        .org, 
        .member {
            border: 2px solid #eee;
            border-radius: 6px;
            padding: 8px;
        }

        .org {
            width: 40%;
        }

        .member {
            width: 58%;
        }
    }

    .footer {
        margin-top: 16px;
        // text-align: center;
        text-align: right;
    }
}
</style>