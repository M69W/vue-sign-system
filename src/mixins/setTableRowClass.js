export const setRowClass = {
    methods: {
        tableRowClassName({ row, rowIndex }) {
            if (rowIndex % 2) {
                return 'has-back';
            } else {
                return '';
            }
        }
    }
};
