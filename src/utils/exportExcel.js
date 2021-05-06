function formatJson(filterVal, jsonData) {
  return jsonData.map(v =>
    filterVal.map(j => {
      return v[j];
    })
  );
}
const ExportExcel = (
  filterVal = [],
  tableData = [],
  tHeader = [],
  filename = "表格",
  bookType = "xlsx"
) => {
  import("@/vendor/Export2Excel").then(excel => {
    const data = formatJson(filterVal, tableData);
    excel.export_json_to_excel({
      header: tHeader,
      data,
      filename: filename,
      autoWidth: true,
      bookType: bookType
    });
  });
};
export default ExportExcel;
