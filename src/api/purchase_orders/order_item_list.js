const temp = {
  'total': 1,
  'list': [
    {
      'createdBy': 'anonymousUser',
      'createdDate': '2019-07-05 17:07:31',
      'lastModifiedBy': 'lingzhiwei1',
      'lastModifiedDate': '2019-07-05 17:12:42',
      'id': 1,
      'purchaseOrderId': 4,
      'orderNo': '6913000000',
      'orderItemNo': '00001',
      'retPo': false,
      'sapDeleted': false,
      'stockLocation': 'N460',
      'materialId': 34,
      'quantity': 560000,
      'unit': 'PC',
      'status': '',
      'applicant': '马英芳',
      'applyDeptCode': '0012',
      'applyDeptName': '生产部',
      'processedQuantity': 0,
      'elikz': false,
      'wemng': 0,
      'knttp': '',
      'pstyp': '0',
      'materialCode': '058.136.070',
      'materialName': '瓶盖-PET上红下白 0.9L-2.5L/6G(金龙鱼)',
      'vendorCode': '9040000135',
      'vendorName': '百利盖(昆山)有限公司',
      'sapCreatedBy': 'MM-CHENSY',
      'sapCreatedDate': '20190705',
      'enabled': '1',
      'factoryId': 3,
      'factoryCode': 'ZH01'
    }
  ],
  'pageNum': 1,
  'pageSize': 10,
  'size': 1,
  'startRow': 1,
  'endRow': 1,
  'pages': 1,
  'prePage': 0,
  'nextPage': 0,
  'isFirstPage': true,
  'isLastPage': true,
  'hasPreviousPage': false,
  'hasNextPage': false,
  'navigatePages': 8,
  'navigatepageNums': [
    1
  ],
  'navigateFirstPage': 1,
  'navigateLastPage': 1
}

for (let i = 0; i < 8; i++) {
  const tempList = Object.assign({}, temp.list[0])
  tempList.id = tempList.id + i
  tempList.orderNo = Number(tempList.orderNo) + i
  temp.list.push(tempList)
}
export default temp
