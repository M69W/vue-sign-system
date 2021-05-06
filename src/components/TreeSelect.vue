<template>
    <div class="container-tree-select">
        <div class="operations">
            <van-button class="btn btn-left" size="small" type="default" @click="$emit('cancel')">取消</van-button>            
            <van-button class="btn btn-right" size="small" type="info" @click="confirm">确定</van-button>
        </div>

        <!-- 多选 -->
        <van-tree-select
            v-if="type == 'org' && multiple"
            class="tree"
            :items="items"
            :active-id.sync="activeIds"
            :main-active-index.sync="activeIndex"            
        />

        <van-tree-select
            v-if="type == 'user' && multiple"
            class="user"
            :items="itemsUser"
            :active-id.sync="activeIdsUser"
            :main-active-index.sync="activeIndexUser"            
        />

        <!-- 单选 -->
        <van-tree-select
            v-if="type == 'org' && !multiple"
            class="tree"
            :items="items"
            :active-id.sync="activeIdsSingle"
            :main-active-index.sync="activeIndex"            
        />

        <van-tree-select
            v-if="type == 'user' && !multiple"
            class="user"
            :items="itemsUser"
            :active-id.sync="activeIdsUserSingle"
            :main-active-index.sync="activeIndexUser"            
        />
    </div>
</template>

<script>
export default {
    props: {
        id: String,
        type: String,
        multiple: {
            type: Boolean,
            default: true
        }
    },
    data() {
        return {
            nodeTree: null,

            // 公司组织架构
            items: [],
            activeIds: [],
            activeIdsSingle: '',
            activeIndex: 0,

            // 公司组织成员
            itemsUser: [],
            activeIdsUser: [],
            activeIdsUserSingle: '',
            activeIndexUser: 0,
        }
    },
    async mounted() {
        console.log(this.multiple)

        await this.getNodeTree()

        
        // 选择联系人时，才需要初始化
         
        this.initItems()
        this.initItemsUser()
 
    },

    methods: {
        apiGetNodeTree(data) {
            return this.$api('urlGetNodeTree').get('getPath', data)
        },
        apiGetNodeTreeUserInfo(data) {
            return this.$api('urlGetNodeTreeUserInfo').post('postNormal', data)
        },


        async getNodeTree() {
            let _data = {
                id: this.id
            }

            let res = await this.apiGetNodeTree(_data)
            if (!res) return

            console.log(res.data.data)

            this.nodeTree = res.data.data
            return res.data.data
        },

        async getNodeTreeUserInfo(nodeId) {
            let _data = {
                currentPage:1,
                pageSize:2000,
                isForbid:'0',
                userNickName:'',
                nodeId: nodeId
            }

            let res = await this.apiGetNodeTreeUserInfo(_data)
            if (!res) return

            // console.log(res.data.data.records)
            return res.data.data.records
        },

        initItems() {
            let _items = [{
                text: this.nodeTree.rootNode.nodeName,
                id: this.nodeTree.rootNode.id,
                parentNodeId: this.nodeTree.rootNode.parentNodeId,
                children: []
            }]

            let _children = []

            this.nodeTree.sonNodeList.map(item => {
                _children.push({
                    text: item.nodeName,
                    id: item.id + '&' + item.nodeName,
                    parentNodeId: item.parentNodeId,
                    sonNodes: item.sonNodes
                })

                // 多级部门时，递归获取
                this.recursiveFn(_children, item.sonNodes)
            })

            _items[0].children = _children

            this.items = _items
        },
        recursiveFn(arr, nodes) {
            if (!nodes) return

            nodes.map(item => {
                arr.push({
                    text: item.nodeName,
                    id: item.id + '&' + item.nodeName,
                    parentNodeId: item.parentNodeId,
                    sonNodes: item.sonNodes
                })

                this.recursiveFn(arr, item.sonNodes)
            })
        },
        async initItemsUser() {
            console.log('user....')

            // 根节成员
            let _itemsUser = [{
                text: this.nodeTree.rootNode.nodeName,
                id: this.nodeTree.rootNode.id,
                parentNodeId: this.nodeTree.rootNode.parentNodeId,
                children: []
            }]            

            let _children = []
            // 599266417723834368
            let _res = await this.getNodeTreeUserInfo(this.nodeTree.rootNode.id)
            console.log(_res);

            _res.map(item => {
                _children.push({
                    text: item.userNickName,
                    id: item.id + '&' + item.userNickName,
                    parentNodeId: item.nodeId
                })
            })            
            _itemsUser[0].children = _children


            // 子节点成员
            let __itemsUser = []

            this.nodeTree.sonNodeList.map(async (item, idx) => {
                // console.log(item.nodeName + '&' + item.id)
                // console.log(idx, item.sonNodes)
                __itemsUser.push({
                    text: item.nodeName,
                    id: item.id + '&' + item.nodeName,
                    parentNodeId: item.parentNodeId,
                    sonNodes: item.sonNodes,
                    children: []
                })
                this.recursiveUserFn(__itemsUser, item.sonNodes)
            })

            __itemsUser.map(async (item, idx) => {
                let __res = await this.getNodeTreeUserInfo(item.id.split('&')[0])
                let __children = []

                __res.map(item => {
                    __children.push({
                        text: item.userNickName,
                        id: item.id + '&' + item.userNickName,
                        parentNodeId: item.nodeId
                    })
                })
                __itemsUser[idx].children = __children
            })
            

            _itemsUser = [..._itemsUser, ...__itemsUser]
            this.itemsUser = _itemsUser
            // console.log(this.itemsUser)
        },
        recursiveUserFn(arr, nodes) {
            if (!nodes) return
            nodes.map(item => {
                arr.push({
                    text: item.nodeName,
                    id: item.id + '&' + item.nodeName,
                    parentNodeId: item.parentNodeId,
                    sonNodes: item.sonNodes,
                    children: []
                })

                this.recursiveUserFn(arr, item.sonNodes)
            })
        },

        confirm() {
            // console.log(this.activeIds)
            if (this.type == 'org') {
                // ^ 组织
                if (this.multiple) {
                    this.$emit('confirm', this.activeIds)

                } else {
                    this.$emit('confirm', this.activeIdsSingle)
                }

            } else if (this.type == 'user') {
                // ^ 成员
                if (this.multiple) {
                    this.$emit('confirm', this.activeIdsUser)

                } else {
                    this.$emit('confirm', this.activeIdsUserSingle)
                }
            }
        },

        deleteCur(type, val, idx) {
            console.log('child...', val)
            console.log('child...', type)

            if (type == 'org') {  
                if (val == 'multi') {
                    this.activeIds.splice(idx, 1)

                } else if (val == 'one') {
                    this.activeIdsSingle = ''
                }       
                
            } else if (type == 'user') {
                if (val == 'multi') {
                    this.activeIdsUser.splice(idx, 1)

                } else if (val == 'one') {
                    this.activeIdsUserSingle = ''
                }
            }
        }
    },
}
</script>

<style lang="scss" scoped>
.container-tree-select {
    position: relative;
    height: 100%;

    .operations {
        position: absolute;
        top: 0;
        z-index: 1;
        background: #f1f2f6;
        width: 100%;
        height: 50px;

        .btn {
            margin: 10px;
        }

        .btn-right {
            float: right;
        }
    }

    .user,
    .tree {
        min-height: 100%;
        padding-top: 50px;
    }

    .user {
        a {
            font-weight: 700;
        }

        a:first-child {
            font-weight: 700;
            color: #369;            
        }
    }

    .van-tree-select__content {
        .van-tree-select__item {
            font-weight: 400;
        }
    }

    .van-sidebar-item--select {
        font-weight: 700;
        color: #369;
    }
}
</style>