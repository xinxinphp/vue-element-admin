const nodeField = {
  'factoryId': '工厂',
  'sapCreatedDate': '创建日期',
  'orderNo': '订单号',
  'materialCode': '物料编码',
  'materialName': '物料名称',
  'retPo': '退货标记',
  'vendorCode': '供应商',
  'vendorName': '供应商名称',
  'createdBy': '创建人'
}
export default nodeField
// 全站Form中 input 的长度 匀取以下值
export const large = { width: `240px` }
export const medium = { width: `200px` }
export const small = { width: `140px` }
export const mini = { width: `100px` }
export const getFieldName = (...any) => {
  if (any[1]) {
    return any[1]
  }
  return nodeField[any[0]]
}
