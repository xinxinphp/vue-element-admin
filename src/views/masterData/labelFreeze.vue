<template>
  <div>
    <sticky :z-index="1" class-name="sub-navbar-purchase-order">
      <el-select
        v-model="form.factoryId"
        :placeholder="_getFieldName('factoryId','工厂')"
        :style="small"
        class="filter-item"
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
        clearable
      >
        <el-option v-for="item in warehouseAll" :key="item.id + item.description" :label="item.code" :value="item.id">
          <span style="float: left">{{ item.code + '  ----  ' + item.description }}</span>
        </el-option>
      </el-select>
      <el-select
        v-model="form.materialCategory"
        placeholder="类别"
        :style="small"
        clearable
      >
        <el-option v-for="item in materialCategoryAll" :key="item.id + item.name" :label="item.name" :value="item.name">
          <span style="float: left">{{ item.name }}</span>
        </el-option>
      </el-select>

      <el-input
        v-model="form.materialCode"
        :placeholder="_getFieldName('materialCode','物料编码')"
        :style="small"
        clearable
      />
      <el-input
        v-model="form.materialName"
        :placeholder="_getFieldName('materialName','物料名称')"
        :style="small"
        clearable
      />
      <el-checkbox v-model="form.notZero">数量非0</el-checkbox>
      <el-checkbox v-model="form.frozen">冻结</el-checkbox>
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
      <el-input
        v-model="form.batch"
        :placeholder="_getFieldName('batch','批次')"
        :style="small"
        clearable
      />
      <el-input
        v-model="form.version"
        :placeholder="_getFieldName('version','版本号')"
        :style="small"
        clearable
      />
      <el-button class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter">搜索</el-button>
      <el-button class="filter-item" type="info" icon="el-icon-refresh" @click="handleRest">重置</el-button>

    </sticky>

    <div v-loading="loading" class="app-container">
      <el-button class="filter-item" type="success" size="mini" plain @click="handleFreeze('add')">冻结</el-button>
      <el-button type="info" plain size="mini" @click="handleFreeze('rest')">解冻</el-button>

      <el-table
        :key="tableKey"
        :data="list"
        border
        fit
        :height="fixHeight"
        highlight-current-row
        style="margin-top:10px;width: 100%;"
        @sort-change="sortChange"
        @selection-change="handleSelectionChange"
      >
        >
        <el-table-column type="selection" align="center" width="55" fixed />
        <el-table-column label="工厂" prop="factoryCode" align="center" :width="tdSize(2,4,false)" />
        <el-table-column label="仓库" prop="warehouseCode" align="center" :width="tdSize(3,20,false)" />
        <el-table-column label="库区" prop="warehouseAreaCode" align="center" :width="tdSize(5,12,false)" />
        <el-table-column label="货位" prop="spotDescription" align="center" :width="tdSize(5,12,false)" />
        <el-table-column label="标签" prop="tagNo" align="center" :width="tdSize(5,12,false)" />
        <el-table-column label="物料编码" prop="materialCode" align="center" :width="tdSize(5,12,false)" />
        <el-table-column label="物料名称" prop="materialName" align="center" :width="tdSize(5,11)">
          <template slot-scope="scope">
            <LongText :text="scope.row.materialName" />
          </template>
        </el-table-column>
        <el-table-column label="数量" prop="quantity" align="center" width="70" />
        <el-table-column label="合格" prop="qualityInspectionStatus" align="center" width="120" />
        <el-table-column label="冻结" prop="frozen" align="center" width="100">
          <template slot-scope="scope">
            <span>{{ scope.row.frozen?'是':'' }}</span>
          </template>
        </el-table-column>
        <el-table-column label="SAP基本单位" prop="unit" align="center" width="100" />
        <el-table-column label="版本" prop="version" align="center" width="100" />
        <el-table-column label="型号" prop="type" align="center" width="100" />
        <el-table-column label="批次" prop="batch" align="center" width="100" />
        <el-table-column label="供应商" prop="vendorCode" align="center" width="100" />
        <el-table-column label="供应商名称" prop="vendorName" :width="tdSize(5,11)">
          <template slot-scope="scope">
            <LongText :text="scope.row.vendorName" />
          </template>
        </el-table-column>
        <el-table-column label="生产日期" prop="productionDate" width="95" />
        <el-table-column label="到厂日期" prop="factoryDate" width="95" />
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

import Sticky from '@/components/Sticky'
import Pagination from '@/components/Pagination'
import formMixin from '@/views/mixin/BaseSearchForm'
import { getWarehousesInfo, getCategory } from '@/api/common'
import { parseTime } from '@/utils'
import { getItemsFrozen, setItemsFrozenType } from '@/api/masterData'

const defaultForm = {
  factoryId: '', // 工厂
  warehouseId: '', // 仓库
  printType: '', // 打码方式
  materialCategory: '', // 类别
  tagNo: '', // 标签码
  batch: '', // 批次
  version: '', // 版本号
  materialCode: '', // 物料编码
  materialName: '', // 物料名称
  notZero: '', // 数量非0
  frozen: ''// 冻结
}

export default {
  name: 'LabelFreeze',
  components: { Pagination, Sticky },
  mixins: [formMixin],
  data() {
    return {
      defaultForm: defaultForm,
      warehouseAll: [], // 所有仓库
      materialCategoryAll: [], // 所有类别
      tableKey: 0,
      list: null,
      total: 0,
      loading: true,
      downloadLoading: false,
      /** ***一下打印*****/
      form: Object.assign({}, defaultForm),
      /** ***一下打印*****/
      multipleSelection: []
    }
  },
  created() {
    this.getList(getItemsFrozen)
    this.initSetCategory()
  },
  methods: {
    initSetCategory() {
      getCategory()
        .then(res => {
          this.materialCategoryAll = res.data
        })
    },
    handleSelectionChange(val) {
      this.multipleSelection = val
    },
    handleFreeze(name) {
      if (!this.multipleSelection.length) {
        this.$message.error('请先勾选项目')
        return
      }
      const data = {
        frozenType: '1',
        frozenName: '冻结'
      }
      if (name === 'rest') {
        data.frozenType = '2'
        data.frozenName = '解冻'
      }
      this.$confirm(`确认${data.frozenName}?`, '警告', {
        confirmButtonText: '确认',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          setItemsFrozenType(data.frozenType, this.multipleSelection)
            .then(res => {
              this.getList(getItemsFrozen)
              this.$message.success(res.message)
            })
        })
    },
    setWarehouse(data) {
      this.form.warehouseId = ''
      this.warehouseAll = data
    },
    handleChange(value) {
      this.form.warehouseId = ''
      const data = {
        factoryId: value
      }
      getWarehousesInfo(data)
        .then(res => {
          this.setWarehouse(res.data)
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
