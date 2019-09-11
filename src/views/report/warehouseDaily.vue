<template>
  <div class="app-container">
    <div class="filter-container">
      <el-select
        v-model="form.factoryId"
        :placeholder="_getFieldName('factoryId','工厂')"
        :style="small"
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
      >
        <el-option v-for="item in warehouseAll" :key="item.id" :label="item.code" :value="item.id">
          <span style="float: left">{{ item.code + '  ----  ' + item.description }}</span>
        </el-option>
      </el-select>
      <el-date-picker
        v-model="form.reportDate"
        type="date"
        value-format="yyyy-MM-dd"
        :editable="false"
        :placeholder="_getFieldName('reportDate','日期')"
        :style="small"
      />
      <el-button type="primary" icon="el-icon-search" @click="handleFilter">搜索</el-button>
      <el-button type="info" icon="el-icon-refresh" @click="handleRest">重置</el-button>
    </div>

    <el-table
      :key="tableKey"
      v-loading="loading"
      :data="list"
      border
      fit
      :height="fixHeight"
      highlight-current-row
      style="width: 100%;"
      @sort-change="sortChange"
    >
      <el-table-column label="报表日期" prop="reportDate" width="110" />
      <el-table-column label="工厂" prop="factoryCode" :width="tdSize(2,4,false)" />
      <el-table-column label="类别" prop="materialCategory" :width="tdSize(2,4)" />
      <el-table-column label="库位" prop="spotDescription" :width="tdSize(2,9,false)" />
      <el-table-column label="物料代码" prop="materialCode" :width="tdSize(2,12,false)" />
      <el-table-column label="物料名称" prop="materialName" width="360" />
      <el-table-column label="单位" prop="unit" width="70" />
      <el-table-column label="批次" prop="batch" width="70" />
      <el-table-column label="版本号" prop="version" width="110" />
      <el-table-column label="版本描述" prop="versionTxt" align="center" width="80" />
      <el-table-column label="生产日期" prop="productionDate" width="100" />
      <el-table-column label="进货日期" prop="factoryDate" width="100" />
      <el-table-column label="供应商名称" prop="vendorName" width="210" />
      <el-table-column label="入库天数" prop="inventoryDays" width="100" />
      <el-table-column label="期初库存" prop="openingStock" width="100" />
      <el-table-column label="采购入库" prop="poInboundQuantity" width="100" />
      <el-table-column label="生产退回" prop="proReturnQuantity" width="100" />
      <el-table-column label="货位移入" prop="stockMoveInQuantity" width="100" />
      <el-table-column label="其它入库" prop="otherInboundQuantity" width="100" />
      <el-table-column label="当日入库合计" prop="totalInboundQuantity" width="110" />
      <el-table-column label="生产领用" prop="proPickQuantity" width="100" />
      <el-table-column label="其它领用" prop="otherPickQuantity" width="100" />
      <el-table-column label="货位移出" prop="stockMoveOutQuantity" width="100" />
      <el-table-column label="不合格品出库" prop="unqualifiedOutQuantity" width="110" />
      <el-table-column label="其它出库" prop="otherOutboundQuantity" width="100" />
      <el-table-column label="当日出库合计" prop="totalOutboundQuantity" width="110" />
      <el-table-column label="期末库存" prop="endingStock" width="100" />
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
import { getWarehouseDaily } from '@/api/report'
import { getWarehousesInfo, getWarehouseAreaId } from '@/api/common'
import Pagination from '@/components/Pagination'
const defaultForm = {
  factoryId: '', // 工厂
  warehouseId: '', // 仓库
  reportDate: '' // 日期
}

export default {
  name: 'QueryBeforeCreate',
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
      createdownloadLoading: false,
      deletedownloadLoading: false,
      factoriesAll: [], // 本页使用的
      warehouseAll: [], // 本页使用的 所有仓库
      dialogVisibleDownload: false
    }
  },
  computed: {
  },
  created() {
  },
  mounted() {
    this.initFormSouch()
  },
  methods: {
    initFormSouch() {
      this.form.factoryId = this.factoryIds[0].id
      this.handleChange(this.form.factoryId)
      this.getList(getWarehouseDaily)
    },
    // 给 仓库 字段 进行赋值
    setWarehouse(data) {
      this.form.warehouseId = ''
      this.warehouseAll = data
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
    handleRest(done) {
      this.initForm()
      this.listQuery.page = 1
      this.listQuery.orderBy = ''
      this.initFormSouch()
    },
    handleWarehouseAreaId(value) {
      this.form.spotId = ''
      getWarehouseAreaId(value)
        .then(res => {
          this.setWarehouseAreaId(res.data)
        })
    }
  }
}
</script>
