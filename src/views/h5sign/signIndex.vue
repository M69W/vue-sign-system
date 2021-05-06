<template>
    <!-- 签署方式选择 -->
    <div class="sign-choose">
        <header class="header" @click="goBack">
            <i class="el-icon-arrow-left"></i>
            <span>返回</span>
        </header>
        <div
            class="content"
            :class="{ 'dont-need-sign': fileInfo.signStatus !== '01' }"
        >
            <div class="file-wrap">
                <div class="page" v-show="showSeal">
                    <span class="now-page">{{ nowPage }}</span
                    >/<span class="all-page">{{ totalPage }}</span>
                </div>
                <div
                    class="file"
                    @touchstart="fileTouchstart"
                    @touchend="fileTouchend"
                >
                    <img :src="fileUrl" class="fileReal" alt="" />
                    <div
                        v-for="(item, index) in cloudSignList"
                        :key="index"
                        class="seal-wrap"
                        :id="item.devId"
                        :style="{
                            left: item.left + 'px',
                            top: item.top + 'px'
                        }"
                        v-show="
                            (item.picturePath &&
                                (item.pageNo === nowPage &&
                                    item.typeNum === 1)) ||
                                (nowPage >= item.startPageNo &&
                                    nowPage <= item.endPageNo &&
                                    (item.typeNum === 2 || item.typeNum === 3))
                        "
                        @touchstart.stop="signTouchstart"
                        @touchmove.stop="signTouchmove($event, item.devId)"
                        @touchend.stop="signTouchend($event, item.devId)"
                    >
                        <span
                            class="remove el-icon-error"
                            v-if="item.showCloseIcon"
                            data-icon="close"
                            @click.stop="removeSignPos(item.devId)"
                        ></span>
                        <!-- <span
                            class="el-icon-error remove"
                            @click.stop="removeSignPos"
                        ></span> -->
                        <img
                            :src="item.picturePath"
                            :style="{
                                width: signWidth + 'px',
                                height: signHeight + 'px'
                            }"
                            class="seal-item"
                            alt=""
                        />
                    </div>
                    <!-- 固定签署位置 -->
                    <div
                        class="need-to-sign"
                        v-for="(item, index) in needToSignArr"
                        :key="index + item.signatoryId"
                        v-show="item.signatureStartPage === nowPage && fileUrl"
                        :style="{
                            left: item.signatureCoordinateX * scale + 'px',
                            top: item.signatureCoordinateY * scale + 'px',
                            width: signWidth + 'px',
                            height: signHeight + 'px'
                        }"
                    ></div>
                </div>
            </div>
        </div>
        <footer class="footer" v-if="fileInfo.signStatus === '01'">
            <div class="sign-type" @click="chooseSignType">
                签章方式
                <i class="el-icon-d-arrow-right"></i>
            </div>
            <div class="choose-sign" @click="chooseSeal">
                选择印章
                <i class="el-icon-d-arrow-right"></i>
            </div>
            <div class="sign" @click="finishSign">完成签署</div>
        </footer>
    </div>
</template>

<script>
import { sessionStore } from '@/utils';
import { findIndex } from 'lodash';
export default {
    components: {},
    props: {},
    data() {
        return {
            fileCode: '',
            typeNum: '',
            totalPage: 0,
            nowPage: 1,
            fileWidth: 0,
            fileHeight: 0,
            sealWrapWidth: 0, // 印章宽高
            sealWrapHeight: 0,
            fileTouchStartY: 0, // 滑动文件起始位置
            fileUrl: '',
            scale: '',
            signWidth: 0,
            signHeight: 0,
            showSeal: false,
            standerdSignWidth: 110, // 标准章宽度
            fileUrlObj: {}, // 缓存已经加载过的文件图片
            signSetData: {},
            cloudSignList: [],
            h5info: {},
            needToSignArr: [],
            fileInfo: {} // 文档信息，是否待我签署，compcatId
        };
    },
    mounted() {
        this.h5info = sessionStore.get('h5info') || {};
        console.log(this.h5info);
        this.fileCode = this.$route.query.fileCode;
        this.fileName = this.$route.query.fileName;
        this.typeNum = this.h5info ? this.h5info.typeNum : '';
        this.nowPage = this.h5info
            ? this.h5info.nowPage
                ? this.h5info.nowPage
                : 1
            : 1;

        this.getFileTotalPage();
        this.getSignConfig();
    },
    methods: {
        goBack() {
            this.$router.go(-1);
        },

        /**获取文件总页数*/
        getFileTotalPage() {
            this.$api('getPicSize')
                .get('getPath', {
                    fileCode: this.fileCode
                })
                .then((res) => {
                    if (!res) return;
                    // console.log(res);
                    let data = res.data.data;
                    this.totalPage = data.totalPageNo;
                    this.fileWidth = data.width; //a4
                    this.fileHeight = data.height;
                    this.getPageSingle();
                    this.calcuScale();
                });
        },
        calcuScale() {
            let fileImgRealWidth = $('.file').width();
            this.scale = fileImgRealWidth / this.fileWidth;
            let wh = this.standerdSignWidth * this.scale;
            this.signWidth = wh;
            this.signHeight = wh;
            // console.log(this.scale, this.signWidth);
            this.getFileInfo(this.fileCode);
        },
        /**获取文件信息 */
        getFileInfo(fileCode) {
            this.$api('queryDocumentDet')
                .post(
                    'postQuery',
                    {},
                    {
                        fileCode: fileCode
                    }
                )
                .then((res) => {
                    if (!res) return;
                    console.log(res);
                    this.fileInfo = res.data.data;
                    if (this.fileInfo.signStatus === '01') {
                        /**待我签署状态,获取签名域 */
                        this.getSignDomain();
                    }
                });
        },
        /**获取签名域 */
        async getSignDomain() {
            let res = await this.$api('sunshineSignDomain').post(
                'postQuery',
                {},
                {
                    fileCode: this.fileCode
                }
            );
            if (!res) return;
            let domainList = res.data.data;
            this.needToSignArr = domainList;
            this.setSignList();
            // console.log(domainList);
        },
        /**设置页面印章信息 */
        setSignList() {
            let h5SignItem = sessionStore.get('h5SignItem');
            let h5SignList = sessionStore.get('h5SignList');
            if (h5SignList && h5SignList.length) {
                this.cloudSignList = h5SignList;
            }
            if (h5SignItem) {
                h5SignItem.left = 0;
                h5SignItem.top = 0;
                h5SignItem.preSign = false;
                h5SignItem.showCloseIcon = true;
                h5SignItem.foggy = this.h5info.foggy || false;
                h5SignItem.grey = this.h5info.grey || false;
                if (this.h5info.typeNum === 1) {
                    h5SignItem.pageNo = this.nowPage;
                    h5SignItem.typeNum = this.h5info.typeNum;
                } else if (
                    this.h5info.typeNum === 2 ||
                    this.h5info.typeNum === 3
                ) {
                    h5SignItem.startPageNo = this.h5info.startPageNo;
                    h5SignItem.endPageNo = this.h5info.endPageNo;
                    h5SignItem.typeNum = this.h5info.typeNum;
                }
                if (this.h5info.typeNum === 3) {
                    h5SignItem.pageSize = this.h5info.pageSize;
                    h5SignItem.signatureDirection = this.h5info.signatureDirection;
                }
                // 如果有指定位置盖章，则打上logo
                if (this.needToSignArr.length) {
                    h5SignItem.isPos = false;
                }
                let hasItemIndex = findIndex(this.cloudSignList, (o) => {
                    return o.devId === h5SignItem.devId;
                });
                hasItemIndex < 0 && this.cloudSignList.push(h5SignItem);
                sessionStore.set('h5SignList', this.cloudSignList);
                sessionStore.remove('h5SignItem');
            }
            console.log(this.cloudSignList);
        },
        // 获取文件单页数
        getPageSingle() {
            this.$api('pageSingle')
                .get('getBlob', {
                    fileCode: this.fileCode,
                    nowPage: this.nowPage
                })
                .then((res) => {
                    if (!res) return;
                    let blob = res.data;
                    let url = window.URL.createObjectURL(res.data);
                    console.log(url);
                    this.fileUrl = url;
                    this.showSeal = true;
                    this.fileUrlObj[this.nowPage] = url;
                });
        },
        /**获取签章设置*/
        getSignConfig() {
            this.$api('getSignConfig')
                .get()
                .then((res) => {
                    if (!res) return;
                    let data = res.data.data;
                    // console.log(data);
                    this.signSetData = data;
                });
        },
        /**印章拖动开始 */
        signTouchstart(e) {
            let fileWidth = $('.file').width();
            let fileHeight = $('.file').height();
            this.sealMaxBorderX = fileWidth;
            this.sealMaxBorderY = fileHeight;
            this.sealWrapWidth = $('.seal-wrap').width() + 8;
            this.sealWrapHeight = $('.seal-wrap').height() + 8;
        },
        /**印章拖动 */
        signTouchmove(e, devId) {
            let paddingLeftX = $('.content').position().left;
            let paddingTopY = $('.content').position().top;
            let posX = e.changedTouches[0].clientX;
            let posY = e.changedTouches[0].clientY;
            // console.log(e.changedTouches[0].clientY);
            let minLeft = 0; // 左边界
            let maxLeft = this.sealMaxBorderX - this.sealWrapWidth; // 右边界
            let minTop = 0; // 上边界
            let maxTop = this.sealMaxBorderY - this.sealWrapHeight; // 下边界

            // 获取拖动印章的索引
            let movingIndex = findIndex(this.cloudSignList, (o) => {
                return o.devId === devId;
            });
            let sealPosX = posX - paddingLeftX - this.sealWrapWidth / 2;
            let sealPosY = posY - paddingTopY - this.sealWrapHeight / 2;
            if (sealPosX <= minLeft) {
                sealPosX = minLeft;
            } else if (sealPosX >= maxLeft) {
                sealPosX = maxLeft;
            }
            if (sealPosY <= minTop) {
                sealPosY = minTop;
            } else if (sealPosY >= maxTop) {
                sealPosY = maxTop;
            }
            this.cloudSignList[movingIndex].left = sealPosX;
            this.cloudSignList[movingIndex].top = sealPosY;
            // console.log(sealPosX, sealPosY);
            // console.log(this.cloudSignList);
        },
        /**印章拖动结束 */
        signTouchend(e, devId) {
            // console.log(e.target.dataset);
            let icon = e.target.dataset.icon;
            if (icon === 'close') return;
            let signDom = $(`#${devId}`);
            let posX = signDom.position().left;
            let posY = signDom.position().top;
            // 获取拖动印章的索引
            let movingIndex = findIndex(this.cloudSignList, (o) => {
                return o.devId === devId;
            });
            this.cloudSignList[movingIndex].submitPosX =
                (posX + this.sealWrapWidth / 2) / this.scale;
            this.cloudSignList[movingIndex].submitPosY =
                (this.sealMaxBorderY - posY - this.sealWrapHeight / 2) /
                this.scale;

            this.adsorbSignToPos(
                posX,
                posY,
                movingIndex,
                this.sealMaxBorderY,
                this.sealWrapWidth,
                this.sealWrapHeight,
                devId
            );
            // console.log(this.submitPosX, this.submitPosY);
        },
        /**距离指定位置一定范围内吸附上去*/
        adsorbSignToPos(
            left,
            top,
            dragCloudItemIndex,
            fileHInner,
            targetWidth,
            targetHeight,
            devId
        ) {
            let _self = this;
            if (this.needToSignArr.length) {
                this.needToSignArr.forEach((item) => {
                    if (item.signatureStartPage === _self.nowPage) {
                        if (
                            left >
                                item.signatureCoordinateX * _self.scale -
                                    targetWidth * 0.2 &&
                            left <
                                item.signatureCoordinateX * _self.scale +
                                    targetWidth * 0.2 &&
                            top >
                                item.signatureCoordinateY * _self.scale -
                                    targetHeight * 0.2 &&
                            top <
                                item.signatureCoordinateY * _self.scale +
                                    targetHeight * 0.2
                        ) {
                            _self.cloudSignList[dragCloudItemIndex].left =
                                item.signatureCoordinateX * _self.scale - 5; // 减去一个padding
                            _self.cloudSignList[dragCloudItemIndex].top =
                                item.signatureCoordinateY * _self.scale - 5;

                            _self.cloudSignList[
                                dragCloudItemIndex
                            ].submitPosX = Math.round(
                                (_self.cloudSignList[dragCloudItemIndex].left +
                                    targetWidth / 2) /
                                    _self.scale
                            );
                            _self.cloudSignList[
                                dragCloudItemIndex
                            ].submitPosY = Math.round(
                                (fileHInner -
                                    _self.cloudSignList[dragCloudItemIndex]
                                        .top -
                                    targetHeight / 2) /
                                    _self.scale
                            );
                            if (_self.needToSignArr.length) {
                                _self.cloudSignList[
                                    dragCloudItemIndex
                                ].isPos = true; // 打上固定签署的logo
                            }
                        } else {
                            if (_self.needToSignArr.length) {
                                _self.cloudSignList[
                                    dragCloudItemIndex
                                ].isPos = false;
                            }
                        }
                    }
                });
            }
            // console.log(_self.cloudSignList);
            if (this.signSetData.preSign && this.h5info.typeNum === 1) {
                this.preSignCheck(
                    this.cloudSignList[dragCloudItemIndex],
                    devId
                );
            }
            sessionStore.set('h5SignList', this.cloudSignList);
        },
        /**文件滑动 */
        fileTouchstart(e) {
            this.fileTouchStartY = e.changedTouches[0].clientY;
            console.log(this.fileTouchStartY);
        },
        /**文件滑动结束 */
        fileTouchend(e) {
            let endY = e.changedTouches[0].clientY;
            // 向上翻页
            if (this.fileTouchStartY - endY > 20) {
                if (this.nowPage < this.totalPage) {
                    this.nowPage++;
                    if (!this.fileUrlObj[this.nowPage]) {
                        this.getPageSingle();
                    } else {
                        this.fileUrl = this.fileUrlObj[this.nowPage];
                    }
                }
            }
            // 向下翻页
            if (endY - this.fileTouchStartY > 20) {
                if (this.nowPage > 1) {
                    this.nowPage--;
                    if (!this.fileUrlObj[this.nowPage]) {
                        this.getPageSingle();
                    } else {
                        this.fileUrl = this.fileUrlObj[this.nowPage];
                    }
                }
            }
            // console.log(this.fileUrlObj);
        },
        removeSignPos(devId) {
            let removeSignIndex = findIndex(this.cloudSignList, (o) => {
                return o.devId === devId;
            });
            this.cloudSignList.splice(removeSignIndex, 1);
            sessionStore.set('h5SignList', this.cloudSignList);
            // console.log(this.cloudSignList);
        },
        // 于盖章校验
        async preSignCheck(venderCloudItem, devId) {
            let preSign = await this.preSign(venderCloudItem);
            if (!preSign) return;
            let data = preSign.data.data;
            let preSignIndex = findIndex(this.cloudSignList, (o) => {
                return o.devId === devId;
            });
            // console.log(pictureCodeOrDevId)
            // console.log(this.cloudSignList);
            if (!data) {
                this.$message.warning({
                    message:
                        '系统管理员已开启安全用章功能，请勿在空白页和章下无文字处盖章！',
                    center: true,
                    customClass: 'h5-z-index'
                });
                this.cloudSignList[preSignIndex].preSign = false;
            } else {
                this.cloudSignList[preSignIndex].preSign = true;
            }
        },
        // 预盖章
        preSign(venderCloudItem) {
            // console.log(venderCloudItem);
            let info = {};
            info.xcoordinate =
                venderCloudItem.submitPosX - this.standerdSignWidth / 2;
            info.ycoordinate =
                venderCloudItem.submitPosY - this.standerdSignWidth / 2;
            info.wcoordinate = this.standerdSignWidth;
            info.hcoordinate = this.standerdSignWidth;
            info.fileCode = this.fileCode;
            info.page = this.nowPage;
            return this.$api('judgePosition').post('postNormal', info);
        },
        chooseSeal() {
            if (!this.h5info.typeNum) {
                this.$message.warning({
                    message: '请先选择签章方式！',
                    center: true,
                    customClass: 'h5-z-index'
                });
                return;
            }
            this.h5info.nowPage = this.nowPage;
            sessionStore.set('h5info', this.h5info);
            this.$router.push({
                path: '/h5sign/h5SignChoose',
                query: {
                    fileCode: this.$route.query.fileCode,
                    fileName: this.$route.query.fileName
                }
            });
        },
        chooseSignType() {
            sessionStore.remove('h5SignItem');
            sessionStore.remove('h5SignList');
            this.$router.push({
                path: '/h5sign/h5SignType',
                query: Object.assign({}, this.$route.query, {
                    totalPage: this.totalPage,
                    domain: this.needToSignArr.length ? 1 : ''
                })
            });
        },
        finishSign() {
            let _self = this;
            if (!this.h5info.typeNum) {
                this.$message.warning({
                    message: '请选择签章方式！',
                    center: true,
                    customClass: 'h5-z-index'
                });
                return;
            }
            if (!this.cloudSignList.length) {
                this.$message.warning({
                    message: '请先选择印章！',
                    center: true,
                    customClass: 'h5-z-index'
                });
                return;
            }
            // console.log(this.cloudSignList);
            if (this.signSetData.preSign && this.h5info.typeNum === 1) {
                let hasPreSignFalse = this.cloudSignList.some((o) => {
                    return !o.preSign;
                });
                if (hasPreSignFalse) {
                    this.$message.warning({
                        message:
                            '系统管理员已开启安全用章功能，请勿在空白页和章下无文字处盖章！',
                        center: true,
                        customClass: 'h5-z-index'
                    });
                    return;
                }
            }
            if (this.needToSignArr.length) {
                let isPosSign = this.cloudSignList.filter((item) => item.isPos);
                if (isPosSign < this.needToSignArr.length) {
                    this.$message.warning({
                        message: '请先在指定位置处盖章！',
                        center: true,
                        customClass: 'h5-z-index'
                    });
                    return;
                }
            }
            // console.log(this.fileInfo.compactId);
            this.signNormalSetPosHttp(this.fileInfo.compactId);
        },
        /**走流程 */
        signNormalSetPosHttp(compactId) {
            console.log(this.cloudSignList);
            console.log(this.h5info);
            // return;
            let info = {};
            info.compactFileCode = this.fileCode;
            info.compactId = compactId;
            info.originalFileName = this.fileName;
            info.sealCode = '0';
            // info.sealCode = this.pictureCode;
            info.signName = sessionStore.get('userInfo').userName;
            info.signatoryId = sessionStore.get('userInfo').id; // 暂无选择用户功能，随便写，不校验
            info.signatureCoordinateX = 0;
            info.signatureCoordinateY = 0;
            info.signatureStartPage = 1;
            info.signType = '01';
            info.signatureMethod = '00'; // 不签署，走步骤
            info.contentType = 'json';
            // console.log(info);
            this.$api('sunshineSign')
                .post('postNormal', info)
                .then((res) => {
                    if (!res) return;
                    let _self = this;
                    // console.log(res);
                    if (res.data.data) {
                        this.setSignData();
                    }
                });
        },
        /**重置数据 */
        setSignData() {
            let info = {};
            let _self = this;
            info.fileCode = this.fileCode;
            info.originalFileName = this.fileName;
            info.signatureMethod = '2'; // 做标签
            info.userId = sessionStore.get('userInfo').id; // 暂无选择用户功能，随便写，不校验
            info.contentType = 'json';
            let list = [];
            let sealItem = {};
            // console.log(this.cloudSignList);
            // return;
            this.cloudSignList.forEach((item) => {
                if (_self.h5info.typeNum === 1) {
                    sealItem = {
                        coordinateX: item.submitPosX,
                        coordinateY: item.submitPosY,
                        foggy: item.foggy,
                        grey: item.grey,
                        pageNo: item.pageNo,
                        sealCode: item.pictureCode
                    };
                } else if (_self.h5info.typeNum === 2) {
                    sealItem = {
                        coordinateX: item.submitPosX,
                        coordinateY: item.submitPosY,
                        foggy: item.foggy,
                        grey: item.grey,
                        startPageNo: item.startPageNo,
                        endPageNo: item.endPageNo,
                        sealCode: item.pictureCode
                    };
                } else if (_self.h5info.typeNum === 3) {
                    sealItem = {
                        coordinateX: item.submitPosX,
                        coordinateY: item.submitPosY,
                        foggy: item.foggy,
                        grey: item.grey,
                        startPageNo: item.startPageNo,
                        endPageNo: item.endPageNo,
                        pageSize: item.pageSize,
                        signatureDirection: item.signatureDirection,
                        sealCode: item.pictureCode
                    };
                }
                list.push(sealItem);
            });
            info.list = list;
            console.log(info);
            if (this.h5info.typeNum === 1) {
                // 单页签
                this.signSigle(info);
            } else if (this.h5info.typeNum === 2) {
                // 多页签
                this.signDouble(info);
            } else if (this.h5info.typeNum === 3) {
                // 骑缝签
                this.signPlace(info);
            }
        },
        // 单页签
        signSigle(info) {
            // console.log(info);
            this.$api('singleSign')
                .post('postNormal', info)
                .then((res) => {
                    console.log(res);
                    if (!res) return;
                    this.$message.success({
                        message: '签署成功！',
                        center: true,
                        customClass: 'h5-z-index'
                    });
                    let _self = this;
                    setTimeout(() => {
                        _self.removeSessionStore();
                        _self.$router.push({
                            path: '/h5sign/h5SignSuccess',
                            query: {
                                fileCode: this.fileCode,
                                fileName: this.fileName,
                                signDate: res.data.data.signDate
                            }
                        });
                    }, 500);
                });
        },
        // 多页签
        signDouble(info) {
            this.$api('singleCoordBatchSign')
                .post('postNormal', info)
                .then((res) => {
                    if (!res) return;
                    console.log(res);
                    this.$message.success({
                        message: '签署成功！',
                        center: true,
                        customClass: 'h5-z-index'
                    });
                    let _self = this;
                    setTimeout(() => {
                        _self.removeSessionStore();
                        _self.$router.push({
                            path: '/h5sign/h5SignSuccess',
                            query: {
                                fileCode: this.fileCode,
                                fileName: this.fileName,
                                signDate: res.data.data.signDate
                            }
                        });
                    }, 500);
                });
        },
        // 骑缝签
        signPlace(info) {
            this.$api('singlePerforationCoordSign')
                .post('postNormal', info)
                .then((res) => {
                    if (!res) return;
                    console.log(res);
                    this.$message.success({
                        message: '签署成功！',
                        center: true,
                        customClass: 'h5-z-index'
                    });
                    let _self = this;
                    setTimeout(() => {
                        _self.removeSessionStore();
                        _self.$router.push({
                            path: '/h5sign/h5SignSuccess',
                            query: {
                                fileCode: this.fileCode,
                                fileName: this.fileName,
                                signDate: res.data.data.signDate
                            }
                        });
                    }, 500);
                });
        },
        removeSessionStore() {
            sessionStore.remove('h5SignItem');
            sessionStore.remove('h5info');
            sessionStore.remove('h5SignList');
        }
    }
};
</script>
<style lang="scss" scoped>
.sign-choose {
    background: #f1f2f6;
    height: 100%;
    position: relative;
    overflow: hidden;
    .header {
        height: 0.8rem;
        display: flex;
        align-items: center;
        font-size: 0.3rem;
        padding-left: 0.3rem;
        color: #333;
    }
    .content {
        width: 6.86rem;
        position: absolute;
        left: 0.32rem;
        top: 0.8rem;
        bottom: 1.22rem;
        background: #f1f2f6;
        .file-wrap {
            width: 100%;
            height: 100%;
            position: relative;
            .fix-wrap {
                width: 100%;
                position: absolute;
                left: 0;
                top: 0;
                bottom: 0;
            }
            .page {
                width: 1.12rem;
                height: 0.4rem;
                display: flex;
                font-size: 0.24rem;
                align-items: center;
                justify-content: space-between;
                padding: 0 0.2rem;
                background: rgba(204, 204, 204, 0.5);
                border-radius: 0.2rem;
                position: absolute;
                top: 1.04rem;
                right: 0.16rem;
                z-index: 100;
                .now-page {
                    color: #282828;
                }
                .all-page {
                    color: #3f3f3f;
                }
            }
            .file {
                width: 100%;
                position: relative;
                .fileReal {
                    width: 100%;
                }
                .seal-wrap {
                    padding: 3px;
                    border-radius: 8px;
                    border: 1px dashed #006efe;
                    position: absolute;
                    left: 0;
                    top: 0;
                    background: rgba(0, 110, 254, 0.1);
                    z-index: 1000;
                    .close {
                        font-size: 0.42rem;
                        color: #006efe;
                        position: absolute;
                        right: -0.16rem;
                        top: -0.16rem;
                    }
                    .remove {
                        font-size: 0.42rem;
                        color: rgb(245, 83, 83);
                        position: absolute;
                        right: -0.16rem;
                        top: -0.16rem;
                    }
                }
                .need-to-sign {
                    width: 100px;
                    height: 100px;
                    position: absolute;
                    border: dashed 1px #bdbbbb;
                    border-radius: 50%;
                }
            }
        }
    }
    .dont-need-sign {
        bottom: 0.24rem;
    }
    .footer {
        height: 0.98rem;
        display: flex;
        position: absolute;
        width: 100%;
        bottom: 0;
        background: #fff;
        border-top: solid 1px #ccc;
        div {
            width: 50%;
            text-align: center;
            height: 0.98rem;
            line-height: 0.98rem;
            font-size: 0.34rem;
        }
        .sign-type {
            color: #666;
            border-right: 1px solid #ccc;
            background: #fff;
        }
        .choose-sign {
            color: #666;
            background: #fff;
        }
        .sign {
            color: #fff;
            background: #006efe;
        }
    }
}
</style>
