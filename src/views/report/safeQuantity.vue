<template>
  <div class="app-container">
    <div class="filter-container">
      <el-select
        v-model="form.factoryId"
        :placeholder="_getFieldName('factoryId','工厂')"
        :style="small"
        clearable
        @change="handleChange"
      >
        <el-option v-for="item in factoryIds" :key="item.id + item.name" :label="item.code" :value="item.id">
          <span style="float: left">{{ item.code + '  ----  ' + item.name }}</span>
        </el-option>
      </el-select>
      <el-select
        v-model="form.warehouseId"
        placeholder="仓库"
        :style="small"
        :disabled="!form.factoryId"
        clearable
        @change="handleWarehouseIdChange"
      >
        <el-option v-for="item in warehouseAll" :key="item.id" :label="item.code" :value="item.id">
          <span style="float: left">{{ item.code + '  ----  ' + item.description }}</span>
        </el-option>
      </el-select>
      <el-select
        v-model="form.materialSmallCategory"
        placeholder="小类"
        :style="mini"
        clearable
      >
        <el-option v-for="item in materialSmallCategory" :key="item.id" :label="item.name" :value="item.name">
          <span style="float: left">{{ item.name }}</span>
        </el-option>
      </el-select>
      <el-input
        v-model="form.materialCode"
        placeholder="物料编码"
        :style="small"
        clearable
      />
      <el-input
        v-model="form.materialName"
        placeholder="物料名称"
        :style="small"
        clearable
      />
      <el-button type="primary" icon="el-icon-search" @click="handleFilter">搜索</el-button>
      <el-button type="info" icon="el-icon-refresh" @click="handleRest">重置</el-button>
      <el-button :loading="downloadLoading" type="primary" icon="el-icon-download" @click="handleDownload">下载Excl</el-button>
    </div>

    <el-table
      :key="tableKey"
      :data="list"
      border
      fit
      :height="fixHeight"
      highlight-current-row
      style="width: 100%;"
      @sort-change="sortChange"
    >
      <el-table-column label="工厂" prop="factoryCode" :width="tdSize(2,4,false)" />
      <el-table-column label="物料编码" prop="materialCode" width="120" />
      <el-table-column label="物料名称" prop="materialName" width="360" />
      <el-table-column label="合格库存" prop="qualifiedQuantity" width="100">
        <template slot-scope="{row}">
          <span :class="Dclass(row)">{{ row.qualifiedQuantity }}</span>
        </template>
      </el-table-column>
      <el-table-column label="不合格库存" prop="unqualifiedQuantity" width="100" />
      <el-table-column label="已冻结库存" prop="frozenQuantity" width="100" />
      <el-table-column label="最低安全库存" prop="minSafeQuantity" width="105" />
      <el-table-column label="最高安全库存" prop="maxSafeQuantity" width="105" />
      <el-table-column label="包装单位" prop="pkgUnit" width="80" />
      <el-table-column label="包装规格" prop="pkgSpec" width="80" />
      <el-table-column label="品牌" prop="materialBrand" align="center" width="70" />
      <el-table-column label="类别" prop="materialCategory" width="70" />
      <el-table-column label="小类" prop="materialSmalCategory" width="70" />
      <el-table-column label="内部简码" prop="internalShortCode" width="80" />
      <el-table-column label="型号" prop="type" width="70" />
    </el-table>
    <pagination
      :total="total"
      :page.sync="listQuery.page"
      :limit.sync="listQuery.limit"
      @pagination="getList(done)"
    />
  </div>

</template>

<script>
import formMixin from '@/views/mixin/BaseSearchForm'
import { getReportSafeQuantity } from '@/api/report'
import { getSafeQuantityExport } from '@/api/export'
import { getWarehousesInfo, getWarehouseAreas, getCategory } from '@/api/common'
import { getMaterialSmallCategory } from '@/api/masterData'

import { getTime } from '@/utils'
import Pagination from '@/components/Pagination'
const defaultForm = {
  factoryId: '', //	工厂
  warehouseId: '', //	仓库
  materialSmalCategory: '', //	小类
  materialCode: '', //	物料编码
  materialName: '' // 物料名称
}

export default {
  name: 'SafeQuantity',
  components: { Pagination },
  mixins: [formMixin],
  data() {
    return {
      form: Object.assign({}, defaultForm),
      loading: true,
      tableKey: 0,
      total: 1,
      listQuery: {
        orderBy: ''// 升序:code 降序: code desc
      },
      materialSmallCategory: [],
      downloadLoading: false,
      factoriesAll: [], // 本页使用的
      warehouseAll: [], // 本页使用的 所有仓库
      warehouseAreaAll: [], // 本页使用的 所有库区
      descriptionAll: [], // 本页使用的 所有货位
      bizTypeAll: [], // 本页使用的 所有业务类型
      materialCategoryAll: [], // 本页使用的 物料类别
      dialogVisibleDownload: false
    }
  },
  computed: {
  },
  created() {
    this.getList(getReportSafeQuantity)
    this.initSetCategory()
    getMaterialSmallCategory()
      .then(res => {
        this.materialSmallCategory = res.data // 小类
      })
  },
  methods: {
    Dclass(row) {
      const { qualifiedQuantity, minSafeQuantity, maxSafeQuantity } = row
      if (qualifiedQuantity < minSafeQuantity) {
        return 'yellow'
      } else if (qualifiedQuantity > maxSafeQuantity) {
        return 'red'
      } else {
        return 'green'
      }
    },
    initSetCategory() {
      getCategory()
        .then(res => {
          this.materialCategoryAll = res.data
        })
    },
    // 给 仓库 字段 进行赋值
    setWarehouse(data) {
      this.form.warehouseId = ''
      this.warehouseAll = data
    },
    // 给 库区 字段 进行赋值
    setWarehouseArea(data) {
      this.form.warehouseAreaId = ''
      this.warehouseAreaAll = data
    },
    // 给 货位 字段 进行赋值
    setWarehouseAreaId(data) {
      this.form.spotId = ''
      this.descriptionAll = data
    },
    handleChange(value) {
      this.form.warehouseId = ''
      this.form.warehouseAreaId = ''
      this.form.spotId = ''
      const data = {
        factoryId: value
      }
      getWarehousesInfo(data)
        .then(res => {
          this.setWarehouse(res.data)
        })
    },
    handleWarehouseIdChange(value) {
      this.form.warehouseAreaId = ''
      this.form.spotId = ''
      const data = {
        warehouseId: value
      }
      getWarehouseAreas(data)
        .then(res => {
          this.setWarehouseArea(res.data)
        })
    },
    handleRest(done) {
      this.initForm()
      this.listQuery.page = 1
      this.listQuery.orderBy = ''
      this.getList(this.done)
    },
    handleDownload() {
      const getDownFn = getSafeQuantityExport
      this.downloadLoading = true
      const fileDownload = require('js-file-download')
      getDownFn(this.form)
        .then(res => {
          fileDownload(res.data, `安全库存${getTime('start')}.xlsx`)
          this.downloadLoading = false
        })
    }
  }
}
</script>
<style scoped>
  .red {background-color: red}
  .yellow {background-color: yellow}
  .green  {background-color: green }
</style>
