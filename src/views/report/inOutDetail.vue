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
        <el-option v-for="item in warehouseAll" :key="item.id + item.description" :label="item.code" :value="item.id">
          <span style="float: left">{{ item.code + '  ----  ' + item.description }}</span>
        </el-option>
      </el-select>
      <el-select
        v-model="form.warehouseAreaId"
        placeholder="库区"
        :style="small"
        :disabled="!form.warehouseId"
        clearable
        @change="handleWarehouseAreaId"
      >
        <el-option v-for="item in warehouseAreaAll" :key="item.id" :label="item.code" :value="item.id">
          <span style="float: left">{{ item.code + '  ----  ' + item.description }}</span>
        </el-option>
      </el-select>
      <el-select
        v-model="form.description"
        placeholder="货位"
        :style="small"
        :disabled="!form.warehouseAreaId"
        clearable
      >
        <el-option v-for="item in descriptionAll" :key="item.id" :label="item.description" :value="item.id">
          <span style="float: left">{{ item.description }}</span>
        </el-option>
      </el-select>
      <el-input
        v-model="form.materialName"
        placeholder="物料描述"
        :style="small"
        clearable
      />
      <el-input
        v-model="form.tagNo"
        placeholder="标签码"
        :style="small"
        clearable
      />
      <el-select
        v-model="form.bizType"
        placeholder="业务类型"
        :style="small"
        clearable
      >
        <el-option v-for="item in bizTypeAll" :key="item.value" :label="item.label" :value="item.value">
          <span style="float: left">{{ item.label }}</span>
        </el-option>
      </el-select>

      <el-dropdown trigger="click" :hide-on-click="false">
        <el-button plain>
          更多<i class="el-icon-caret-bottom el-icon--right" />
        </el-button>
        <el-dropdown-menu slot="dropdown" class="app-container">
          <el-date-picker
            v-model="form.queryDateStart"
            type="date"
            value-format="yyyy-MM-dd"
            :editable="false"
            :placeholder="_getFieldName('queryDateStart','操作时间始')"
            :style="small"
          />
          <el-date-picker
            v-model="form.queryDateEnd"
            type="date"
            value-format="yyyy-MM-dd"
            :editable="false"
            :placeholder="_getFieldName('queryDateEnd','操作时间止')"
            :style="small"
          />
          <el-input
            v-model="form.operator"
            placeholder="操作人"
            :style="small"
            clearable
          />
          <el-input
            v-model="form.materialCode"
            placeholder="物料编码"
            :style="small"
            clearable
          />
          <el-button :loading="downloadLoading" class="filter-item" type="primary" icon="el-icon-download" @click="handleDownload">下载Excl</el-button>
        </el-dropdown-menu>
      </el-dropdown>
      <el-button type="primary" icon="el-icon-search" @click="handleFilter">搜索</el-button>
      <el-button type="info" icon="el-icon-refresh" @click="handleRest">重置</el-button>
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
      <el-table-column label="仓库" prop="warehouseCode" :width="tdSize(2,6,false)" />
      <el-table-column label="库区" prop="warehouseAreaCode" :width="tdSize(2,9,false)" />
      <el-table-column label="货位" prop="spotDescription" :width="tdSize(2,12,false)" />
      <el-table-column label="业务类型" prop="bizType" :width="tdSize(4,7)" />
      <el-table-column label="出入库单" prop="orderNo" width="150" />
      <el-table-column label="前置单据" prop="preOrderNo" width="150" />
      <el-table-column label="物料编码" prop="materialCode" width="150" />
      <el-table-column label="物料名称" prop="materialName" align="center" :width="tdSize(5,11)">
        <template slot-scope="scope">
          <LongText :text="scope.row.materialName" />
        </template>
      </el-table-column>
      <el-table-column label="数量" prop="quantity" width="70" />
      <el-table-column label="单位" prop="unit" width="70" />
      <el-table-column label="标签码" prop="tagNo" :width="tdSize(4,18,false)" />
      <el-table-column label="到厂日期" prop="factoryDate" width="110" />
      <el-table-column label="生产日期" prop="productionDate" width="110" />
      <el-table-column label="版本" prop="version" width="70" />
      <el-table-column label="供应商名称" prop="vendorName" :width="tdSize(5,11)">
        <template slot-scope="scope">
          <LongText :text="scope.row.vendorName"></LongText>
        </template>
      </el-table-column>
      <el-table-column label="操作人" prop="operator" min-width="120" />
      <el-table-column label="操作时间" prop="operateTime" width="170"/>
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
import { getReportInOutDetail, getBizTypes } from '@/api/report'
import { getWarehousesInfo, getWarehouseAreas, getWarehouseAreaId } from '@/api/common'
import { parseTime } from '@/utils'
import Pagination from '@/components/Pagination'
const defaultForm = {
  factoryId: '', // 工厂
  warehouseId: '', // 仓库
  warehouseAreaId: '', // 库区
  description: '', // 货位
  materialCode: '', // 物料编码
  materialName: '', // 物料描述
  tagNo: '', // 标签码
  operator: '', // 操作人
  bizType: '' // 业务类型
}

export default {
  name: 'InOutDetail',
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
      downloadLoading: false,
      factoriesAll: [], // 本页使用的
      warehouseAll: [], // 本页使用的 所有仓库
      warehouseAreaAll: [], // 本页使用的 所有库区
      descriptionAll: [], // 本页使用的 所有货位
      bizTypeAll: [], // 本页使用的 所有业务类型
      dialogVisibleDownload: false
    }
  },
  computed: {
  },
  created() {
    this.getList(getReportInOutDetail)
    this.setBizTypeAll()
  },
  methods: {
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
      this.form.description = ''
      this.descriptionAll = data
    },
    // 给 业务类型 进行赋值
    setBizTypeAll() {
      getBizTypes()
        .then(res => {
          this.bizTypeAll = res.data
        })
    },
    handleChange(value) {
      this.form.warehouseId = ''
      this.form.warehouseAreaId = ''
      this.form.description = ''
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
      this.form.description = ''
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
    handleWarehouseAreaId(value) {
      this.form.description = ''
      getWarehouseAreaId(value)
        .then(res => {
          this.setWarehouseAreaId(res.data)
        })
    },
    handleDownload() {
      this.downloadLoading = true
      import('@/vendor/Export2Excel').then(excel => {
        const tHeader = ['timestamp', 'title', 'type', 'importance', 'status']
        const filterVal = ['timestamp', 'title', 'type', 'importance', 'status']
        const data = this.formatJson(filterVal, this.list)
        excel.export_json_to_excel({
          header: tHeader,
          data,
          filename: 'table-list'
        })
        this.downloadLoading = false
      })
    },
    formatJson(filterVal, jsonData) {
      return jsonData.map(v => filterVal.map(j => {
        if (j === 'timestamp') {
          return parseTime(v[j])
        } else {
          return v[j]
        }
      }))
    }
  }
}
</script>
