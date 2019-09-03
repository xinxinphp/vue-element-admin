<template>
  <div class="app-container">
    <div class="filter-container">
      <el-select
        v-model="form.factoryId"
        :placeholder="_getFieldName('factoryId','工厂')"
        :style="mini"
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
      <el-select
        v-model="form.poNo"
        :placeholder="_getFieldName('poNo','打码方式')"
        :style="small"
        clearable
      >
        <el-option label="订单" value="1" />
        <el-option label="无订单" value="2" />
      </el-select>
      <el-input
        v-model="form.tagNo"
        :placeholder="_getFieldName('tagNo','标签码')"
        :style="small"
        clearable
      />
      <el-input
        v-model="form.materialCode"
        :placeholder="_getFieldName('materialCode','物料编码')"
        :style="small"
        clearable
      />
      <el-checkbox v-model="form.notZero">数量非0</el-checkbox>
      <el-checkbox v-model="form.frozen">冻结</el-checkbox>
      <el-checkbox v-model="form.inbounded">已上架</el-checkbox>
      <el-date-picker
        v-model="form.queryDateStart"
        type="date"
        value-format="yyyy-MM-dd"
        :editable="false"
        :placeholder="_getFieldName('queryDateStart','开始日期')"
        :style="small"
      />
      <el-date-picker
        v-model="form.queryDateEnd"
        type="date"
        value-format="yyyy-MM-dd"
        :editable="false"
        :placeholder="_getFieldName('queryDateEnd','结束日期')"
        :style="small"
      />
      <el-button type="primary" icon="el-icon-search" @click="handleFilter">搜索</el-button>
      <el-button type="info" icon="el-icon-refresh" @click="handleRest">重置</el-button>
    </div>

    <div v-loading="loading">
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
        <el-table-column label="打码方式" prop="printType" align="center" width="80" />
        <el-table-column label="工厂" prop="factoryCode" align="center" :width="tdSize(2,4,false)" />
        <el-table-column label="标签码" prop="tagNo" align="center" :width="tdSize(3,20,false)" />
        <el-table-column label="物料编码" prop="materialCode" align="center" :width="tdSize(5,12,false)" />
        <el-table-column label="物料描述" prop="materialName" :width="tdSize(5,35)" />
        <el-table-column label="数量" prop="quantity" align="center" width="70" />
        <el-table-column label="SAP基本单位" prop="unit" align="center" width="120" />
        <el-table-column label="版本号" prop="version" align="center" width="100" />
        <el-table-column label="SAP批次" prop="batch" align="center" width="100" />
        <el-table-column label="供应商" prop="vendorCode" align="center" width="100" />
        <el-table-column label="供应商名称" prop="vendorName" :width="tdSize(5,11)">
          <template slot-scope="scope">
            <LongText :text="scope.row.vendorName" />
          </template>
        </el-table-column>
        <el-table-column label="货位" prop="spotDescription" width="100" />
        <el-table-column label="作废" prop="disabled" align="center" width="100" />
        <el-table-column label="冻结" prop="frozen" align="center" width="100">
          <template slot-scope="scope">
            <span>{{ scope.row.frozen?'是':'' }}</span>
          </template>
        </el-table-column>
        <el-table-column label="型号" prop="type" align="center" width="100" />
        <el-table-column label="生产日期" prop="productionDate" width="95" />
        <el-table-column label="到厂日期" prop="factoryDate" width="95" />
        <el-table-column label="采购订单" prop="poNo" align="center" width="100" />
        <el-table-column label="行项目" prop="poiNo" width="70" />
        <el-table-column label="收货人" prop="receiptBy" width="100" />
        <el-table-column label="收货单" prop="roNo" width="160" />
        <el-table-column label="收货时间" prop="receiptTime" width="160" />
        <el-table-column label="创建人" prop="createdBy" width="100" />
        <el-table-column label="创建时间" prop="createdDate" width="160" />
        <el-table-column label="打印序列" width="100">
          <template slot-scope="{row}">
            <el-input v-if="row.edit" v-model="row.spotDescription" class="edit-input" size="small" />
            <span v-else>{{ row.printSeq + ' / '+row.ordinal + ' / '+row.totalPrintNum }}</span>
          </template>
        </el-table-column>
      </el-table>

      <pagination
        :total="total"
        :page.sync="listQuery.page"
        :limit.sync="listQuery.limit"
        @pagination="getList(done)"
      />
    </div>
  </div>
</template>

<script>

import Pagination from '@/components/Pagination'
import formMixin from '@/views/mixin/BaseSearchForm'
import { getWarehousesInfo, getWarehouseAreas, getWarehouseAreaId } from '@/api/common'
import { parseTime } from '@/utils'
import { getItems, setDisable } from '@/api/print'

const defaultForm = {
  factoryId: '', // 工厂
  warehouseId: '', // 仓库
  warehouseAreaId: '', // 库区
  description: '', // 货位
  printType: '', // 打码方式
  tagNo: '', // 标签码
  materialCode: '', // 物料编码
  notZero: '', // 数量非0
  inbounded: true, // 已上架
  frozen: ''// 冻结
}

export default {
  name: 'LabelQuery',
  components: { Pagination },
  mixins: [formMixin],
  data() {
    return {
      defaultForm: defaultForm,
      tableKey: 0,
      list: null,
      total: 0,
      loading: true,
      downloadLoading: false,
      /** ***一下打印*****/
      form: Object.assign({}, defaultForm),
      /** ***一下打印*****/
      factoriesAll: [], // 本页使用的
      warehouseAll: [], // 本页使用的 所有仓库
      warehouseAreaAll: [], // 本页使用的 所有库区
      descriptionAll: [] // 本页使用的 所有货位
    }
  },
  created() {
    this.getList(getItems)
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
    setDisable({ row }) {
      this.$confirm('确认作废?', '警告', {
        confirmButtonText: '确认',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          setDisable(row.id)
            .then(res => {
              this.getList(getItems)
              this.$message.success(res.message)
            })
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
