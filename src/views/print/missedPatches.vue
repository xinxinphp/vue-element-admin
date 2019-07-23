<template>
  <div>
    <sticky :z-index="1" class-name="sub-navbar-purchase-order">
      <el-select
        v-model="form.factoryId"
        :placeholder="_getFieldName('factoryId','工厂')"
        :style="mini"
        class="filter-item"
        clearable
      >
        <el-option v-for="item in factoryIds" :key="item.id + item.name" :label="item.code" :value="item.id">
          <span style="float: left">{{ item.code + '  ----  ' + item.name }}</span>
        </el-option>
      </el-select>
      <el-date-picker
        v-model="form.sapCreatedDate"
        type="date"
        value-format="yyyy-MM-dd"
        :placeholder="_getFieldName('sapCreatedDate','打印日期')"
        :style="small"
      />
      <el-input
        v-model="form.orderNo"
        :placeholder="_getFieldName('orderNo','采购订单号')"
        :style="small"
        class="filter-item"
        clearable
      />
      <el-input
        v-model="form.vendorCode"
        :placeholder="_getFieldName('vendorCode','供应商')"
        :style="small"
        class="filter-item"
        clearable
      />
      <el-input
        v-model="form.vendorName"
        :placeholder="_getFieldName('vendorName','供应商名称')"
        :style="small"
        class="filter-item"
        clearable
      />
      <el-input
        v-model="form.createdBy"
        :placeholder="_getFieldName('createdBy','创建人')"
        :style="small"
        class="filter-item"
        clearable
      />
      <el-input
        v-model="form.materialCode"
        :placeholder="_getFieldName('materialCode','物料编码')"
        :style="small"
        class="filter-item"
        clearable
      />
      <el-input
        v-model="form.materialName"
        :placeholder="_getFieldName('materialName','物料名称')"
        :style="small"
        class="filter-item"
        clearable
      />
      <el-button class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter">搜索</el-button>
      <el-button class="filter-item" type="info" icon="el-icon-refresh" @click="handleRest">重置</el-button>

    </sticky>

    <div v-loading="loading" class="app-container">
      <!--
      <div class="filter-container">
        <el-checkbox v-model="showReviewer" class="filter-item" @change="tableKey=tableKey+1">隐藏1</el-checkbox>
      </div>
-->
      <el-table
        :key="tableKey"
        :data="list"
        border
        fit
        height="500"
        highlight-current-row
        style="width: 100%;"
        @sort-change="sortChange"
      >
        <el-table-column label="立即打印" align="center" width="120">
          <template slot-scope="scope">
            <span><el-button type="primary" @click="handlePrint(scope)">立即打印</el-button></span>
          </template>
        </el-table-column>
        <el-table-column label="工厂" prop="factoryCode" align="center" width="80" sortable="factoryCode" />
        <el-table-column label="打印时间" prop="orderNo" align="center" width="120" sortable="orderNo" />
        <el-table-column label="打印序列" prop="vendorCode" align="center" width="120" />
        <el-table-column label="标签码" prop="vendorName" min-width="260" />
        <el-table-column label="采购订单号" prop="sapCreatedDate" align="center" width="120" />
        <el-table-column label="行项目" prop="plannedDeliveryDate" align="center" width="120" />
        <el-table-column label="供应商" prop="stockLocation" align="center" width="120" />
        <el-table-column label="供应商名称" prop="materialCode" align="center" width="120" />
        <el-table-column label="物料编码" prop="materialName" min-width="420" />
        <el-table-column label="物料描述" prop="quantity" width="100" />
        <el-table-column label="内部简码" prop="unit" align="center" width="100" />
        <el-table-column label="品牌" prop="processedQuantity" width="100" />
        <el-table-column label="类别" prop="processedQuantity" width="100" />
        <el-table-column label="版本号" prop="processedQuantity" width="100" />
        <el-table-column label="数量" prop="processedQuantity" width="100" />
        <el-table-column label="sap单位" prop="processedQuantity" width="100" />
        <el-table-column label="生产日期" prop="processedQuantity" width="100" />
        <el-table-column label="到厂日期" prop="processedQuantity" width="100" />
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
import abcMixin from './abcMixin'
import { getOrdersInitItemInfo, saveCreateItems } from '@/api/print'
import { getOrderItemList } from '@/api/documents'

const defaultForm = {
  createdBy: '', // 工厂
  createdDate: '', // 打印日期
  lastModifiedBy:	'', // 采购订单号
  lastModifiedDate: '', // 供应商
  id:	'', // 供应商名称
  login:	'', // 创建人
  name:	'', // 物料编码
  email:	''// 物料名称
}

export default {
  name: 'MissedPatches',
  components: { Pagination, Sticky },
  mixins: [formMixin, abcMixin],
  data() {
    return {
      form: Object.assign({}, defaultForm),
      tableKey: 0,
      list: null,
      total: 0,
      loading: true,
      downloadLoading: false
    }
  },
  created() {
    this.getList(getOrderItemList)
  },
  methods: {
    handlePrint({ row }) {
      const initPrintStatus = this.initPrint()
      if (initPrintStatus) {
        console.log('打印机 已开启,开始打印')
        // this.startPrint()
        getOrdersInitItemInfo(row.id)
          .then(res => {
            console.log(res)
            this.formFieldRules(res)
            this.formQ = { ...res.data, purchaseOrderItemId: row.id, totalPrintNum: 1 }
            this.$refs[this.formRef] && this.$refs[this.formRef].resetFields()
            this.dialogType = '打印订单'
            this.dialogVisible = true
          })
          .catch(err => {
            console.log(err)
          })
      } else {
        console.log('打印机没开启, 提示下载驱动')
        this.dialogVisibleDownload = true
      }
      console.log(row)
    },
    formFieldRules(res) {
      const { pkgUnit, pkgSpec } = res
      if (pkgUnit && pkgSpec) {
        this.isPkgQuantityDisabled = false
      }
    },
    submitForm() {
      this.$refs[this.formRef].validate((valid) => {
        console.log(this.formQ, 'this.formQ')
        saveCreateItems()
          .then(res => {
            console.log(res, '打印返回参数')
          })
          .catch(err => {
            console.log(err, '打印返回参数')
          })
      })
    }
  }
}
</script>
