<template>
  <div class="app-container">
    待完善
  </div>

</template>

<script>
const defaultForm = {
  factoryId: '', // 工厂
  warehouseId: '', // 仓库
  warehouseAreaId: '', // 库区
  description: '', // 货位
  materialCode: '', // 物料编码
  materialName: '', // 物料描述
  tagNo: '', // 标签码
  operator: '', // 操作人
  orderNo: '', // 出入库单
  preOrderNo: '', // 前置单据
  bizType: '' // 业务类型
}

export default {
  name: 'Index',
  data() {
    return {
      form: Object.assign({}, defaultForm),
      loading: true,
      tableKey: 0,
      total: 1,
      listQuery: {
        orderBy: ''// 升序:code 降序: code desc
      },
      downloadLoading: false,
      factoriesAll: [], // 本页使用的
      warehouseAll: [], // 本页使用的 所有仓库
      warehouseAreaAll: [], // 本页使用的 所有库区
      descriptionAll: [], // 本页使用的 所有货位
      bizTypeAll: [], // 本页使用的 所有业务类型
      dialogVisibleDownload: false
    }
  },
  created() {

  },
  methods: {
  }
}
</script>
