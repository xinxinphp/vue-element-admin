<template>
  <div>
    <sticky :z-index="1" class-name="sub-navbar-purchase-order">
      <el-select
        v-model="form.factoryId"
        :placeholder="_getFieldName('factoryId','工厂')"
        :style="mini"
        clearable
      >
        <el-option v-for="item in factoryIds" :key="item.id + item.name" :label="item.code" :value="item.id">
          <span style="float: left">{{ item.code + '  ----  ' + item.name }}</span>
        </el-option>
      </el-select>
      <el-input
        v-model="form.vendorCode"
        :placeholder="_getFieldName('vendorCode','供应商代码')"
        :style="small"
        clearable
      />
      <el-input
        v-model="form.vendorName"
        :placeholder="_getFieldName('vendorName','供应商名称')"
        :style="small"
        clearable
      />
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
      <el-button class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter">搜索</el-button>
      <el-button class="filter-item" type="info" icon="el-icon-refresh" @click="handleRest">重置</el-button>
      <el-button :loading="downloadLoading" class="filter-item" type="primary" icon="el-icon-download" @click="handleDownload">下载Excl</el-button>
    </sticky>

    <div v-loading="loading" class="app-container">
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
        <el-table-column label="物料名称" prop="materialName" align="center" :width="tdSize(5,11)">
          <template slot-scope="scope">
            <LongText :text="scope.row.materialName" />
          </template>
        </el-table-column>
        <el-table-column label="数量" prop="quantity" align="center" width="70" />
        <el-table-column label="SAP基本单位" prop="unit" align="center" width="120" />
        <el-table-column label="版本号" prop="version" align="center" width="100" />
        <el-table-column label="作废" prop="disabled" align="center" width="100" />
        <el-table-column label="冻结" prop="frozen" align="center" width="100">
          <template slot-scope="scope">
            <span>{{ scope.row.frozen?'是':'' }}</span>
          </template>
        </el-table-column>
        <el-table-column label="型号" prop="type" align="center" width="100" />
        <el-table-column label="SAP批次" prop="batch" align="center" width="100" />
        <el-table-column label="供应商" prop="vendorCode" align="center" width="100" />
        <el-table-column label="供应商名称" prop="vendorName" :width="tdSize(5,11)">
          <template slot-scope="scope">
            <LongText :text="scope.row.vendorName" />
          </template>
        </el-table-column>
        <el-table-column label="生产日期" prop="productionDate" width="95" />
        <el-table-column label="到厂日期" prop="factoryDate" width="95" />
        <el-table-column label="采购订单" prop="poNo" align="center" width="100" />
        <el-table-column label="行项目" prop="poiNo" width="70" />
        <el-table-column label="收货人" prop="receiptBy" width="100" />
        <el-table-column label="收货单" prop="roNo" width="160" />
        <el-table-column label="收货时间" prop="receiptTime" width="160" />
        <el-table-column label="货位" prop="spotDescription" width="100" />
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

      <el-dialog :visible.sync="dialogVisibleDownload" title="请先下载驱动" top="30vh">
        <a href="/CLodop_Setup_for_Win32NT.zip" target="_blank" type="primary">点击下载</a>
        <div style="text-align:right;">
          <el-button type="danger" @click="dialogVisibleDownload= false">取消</el-button>
        </div>
      </el-dialog>

    </div>
  </div>
</template>

<script>

import Sticky from '@/components/Sticky'
import Pagination from '@/components/Pagination'
import formMixin from '@/views/mixin/BaseSearchForm'
import { parseTime } from '@/utils'
import { getReprint, setDisable } from '@/api/print'
import { getItemsVendor } from '@/api/masterData'

const defaultForm = {
  vendorCode: '', // 供应商代码
  vendorName: '', // 供应商名称
  tagNo: '', // 标签码
  materialCode: '', // 物料编码
  notZero: '', // 数量非0
  frozen: ''// 冻结
}

export default {
  name: 'SupplierLabelQuery',
  components: { Pagination, Sticky },
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
      dialogVisibleDownload: false
    }
  },
  created() {
    this.getList(getItemsVendor)
  },
  methods: {
    handlePrint({ row }) {
      const initPrintStatus = this.initPrint()
      if (initPrintStatus) {
        getReprint(row.id)
          .then(res => {
            const data = {
              data: {
                tagList: [{
                  tagNo: row.tagNo,
                  ordinal: row.ordinal
                }],
                commonInfo: {
                  printSeq: row.printSeq,
                  totalPrintNum: row.totalPrintNum,
                  displayQuantity: res.data.displayQuantity,
                  factoryName: res.data.factoryName
                }
              },
              form: {
                materialName: row.materialName,
                internalShortCode: row.internalShortCode,
                materialCode: row.materialCode,
                materialBrand: row.materialBrand,
                materialCategory: row.materialCategory,
                version: row.version,
                productionDate: row.productionDate,
                factoryDate: row.factoryDate,
                vendorName: row.vendorName
              }
            }
            this.startPrint(data)
          })
      } else {
        this.dialogVisibleDownload = true
      }
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
              this.getList(getItemsVendor)
              this.$message.success(res.message)
            })
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
