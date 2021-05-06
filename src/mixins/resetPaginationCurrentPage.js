export const resetPaginationCurrentPage = {
  methods: {
    resetCurrentPage(arrIds) {
      let totalPage = Math.ceil(
        this.pagination.total / this.pagination.pageSize
      );
      let arrIdsLen = arrIds.length;
      let last = this.pagination.total % this.pagination.pageSize;
      // 如果最后一页，全部删除，则往前翻一页
      if (this.pagination.currentPage === totalPage) {
        if (arrIdsLen === last && last != 0) {
          return true;
        } else if (last === 0 && arrIdsLen === this.pagination.pageSize) {
          return true;
        }
      }
    }
  }
};
