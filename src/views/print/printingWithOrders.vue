<template>
  <div>
    <sticky :z-index="10" class-name="sub-navbar-purchase-order">
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
        :placeholder="_getFieldName('sapCreatedDate','创建日期')"
        :style="small"
      />
      <el-input
        v-model="form.orderNo"
        :placeholder="_getFieldName('orderNo','订单号')"
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
        :style="medium"
        class="filter-item"
        clearable
      />
      <el-dropdown trigger="click">
        <el-button plain>
          更多<i class="el-icon-caret-bottom el-icon--right" />
        </el-button>
        <el-dropdown-menu slot="dropdown" class="app-container">
          <el-input
            v-model="form.createdBy"
            :placeholder="_getFieldName('createdBy','创建人')"
            :style="medium"
            class="filter-item"
            clearable
          />
          <el-select
            v-model="form.retPo"
            :placeholder="_getFieldName('retPo','退货标记')"
            :style="medium"
            class="filter-item"
            clearable
          >
            <el-option label="是" :value="true" />
            <el-option label="否" :value="false" />
          </el-select>
        </el-dropdown-menu>
      </el-dropdown>

      <el-button class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter">搜索</el-button>
      <el-button class="filter-item" type="info" icon="el-icon-refresh" @click="handleRest()">重置</el-button>

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
        <el-table-column label="打印条码" align="center" width="120">
          <template slot-scope="scope">
            <span><el-button type="primary" @click="handlePrint(scope)">打印条码</el-button></span>
          </template>
        </el-table-column>
        <el-table-column label="工厂" prop="factoryCode" align="center" width="80" sortable="factoryCode" />
        <el-table-column label="订单号" prop="orderNo" align="center" width="120" sortable="orderNo" />
        <el-table-column label="供应商" prop="vendorCode" align="center" width="120" />
        <el-table-column label="供应商名称" prop="vendorName" min-width="260" />
        <el-table-column label="创建日期" prop="sapCreatedDate" align="center" width="120" />
        <el-table-column label="交货日期" prop="plannedDeliveryDate" align="center" width="120" />
        <el-table-column label="退货标记" prop="retPo" align="center" width="120">
          <template slot-scope="scope">
            <span>{{ scope.row.retPo ? '是': '' }}</span>
          </template>
        </el-table-column>
        <el-table-column label="删除标记" prop="sapDeleted" align="center" width="120">
          <template slot-scope="scope">
            <span>{{ scope.row.sapDeleted ? '是': '' }}</span>
          </template>
        </el-table-column>
        <el-table-column label="是否寄售" prop="pstyp" align="center" width="120">
          <template slot-scope="scope">
            <span>{{ scope.row.pstyp === '2' ? '是': '' }}</span>
          </template>
        </el-table-column>

        <el-table-column label="库存地点" prop="stockLocation" align="center" width="120" />
        <el-table-column label="物料编码" prop="materialCode" align="center" width="120" />
        <el-table-column label="物料名称" prop="materialName" min-width="420" />
        <el-table-column label="订单数量" prop="quantity" width="100" />
        <el-table-column label="订单单位" prop="unit" align="center" width="100" />
        <el-table-column label="已入库数量" prop="processedQuantity" width="100" />
        <el-table-column label="SAP已交货完成" prop="elikz" align="center" width="80">
          <template slot-scope="scope">
            <span>{{ scope.row.elikz ? '是': '' }}</span>
          </template>
        </el-table-column>
      </el-table>

      <pagination
        :total="total"
        :page.sync="listQuery.page"
        :limit.sync="listQuery.limit"
        @pagination="getList(done)"
      />
      <el-dialog :visible.sync="dialogVisible" :title="dialogType" :before-close="handleClose" width="65%">
        <el-form :ref="formRef" :model="form" label-width="120px" label-position="right">
          <el-row>
            <el-col :span="8">
              <el-form-item label="品牌" prop="materialBrand">
                <el-input v-model="form.materialBrand" placeholder="输入品牌" disabled />
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="类别" prop="materialCategory">
                <el-input v-model="form.materialCategory" placeholder="输入类别" disabled />
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="物料描述" prop="materialName">
                <el-input v-model="form.materialName" placeholder="输入物料描述" disabled />
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="8">
              <el-form-item label="物料编码" prop="materialCode">
                <el-input v-model="form.materialCode" placeholder="输入物料编码" disabled />
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="内部简码" prop="internalShortCode">
                <el-input v-model="form.internalShortCode" placeholder="输入内部简码" disabled />
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="供应商名称" prop="vendorName">
                <el-input v-model="form.vendorName" placeholder="输入供应商名称" disabled />
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="8">
              <el-form-item label="SAP工厂代码" prop="factoryCode">
                <el-input v-model="form.factoryCode" placeholder="输入SAP工厂代码" disabled />
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="包装单位" prop="pkgUnit">
                <el-input v-model="form.pkgUnit" placeholder="输入包装单位" disabled />
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="包装规格" prop="pkgSpec">
                <el-input v-model="form.pkgSpec" placeholder="输入包装规格" disabled />
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="8">
              <el-form-item label="型号" prop="type">
                <el-input v-model="form.type" placeholder="输入型号" disabled />
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="SAP批次" prop="batch">
                <el-input v-model="form.batch" placeholder="输入SAP批次" />
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="版本号" prop="version" :rules="[{ required: true }]">
                <el-input v-model="form.version" placeholder="输入版本号" />
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="8">
              <el-form-item label="生产日期" prop="productionDate">
                <el-date-picker
                  v-model="form.productionDate"
                  style="width: 100%"
                  type="date"
                  value-format="yyyy-MM-dd"
                  placeholder="输入生产日期"
                  :editable="false"
                />
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="到厂日期" prop="factoryDate" :rules="[{ required: true }]">
                <el-date-picker
                  v-model="form.factoryDate"
                  style="width: 100%"
                  type="date"
                  value-format="yyyy-MM-dd"
                  placeholder="输入到厂日期"
                  :editable="false"
                />
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="打印张数" prop="totalPrintNum">
                <el-input-number v-model="form.totalPrintNum" :min="1" style="width: 100%" />
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="8">
              <el-form-item label="包装单位数量" prop="pkgQuantity">
                <el-input v-model="form.pkgQuantity" placeholder="输入包装单位数量" :disabled="isPkgQuantityDisabled" />
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="基本单位数量" prop="baseQuantity" :rules="[{ required: true }]">
                <el-input v-model="form.baseQuantity" placeholder="输入基本单位数量" />
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="打印序次" prop="printSeq">
                <el-input-number v-model="form.printSeq" :min="1" style="width: 100%" />
              </el-form-item>
            </el-col>
          </el-row>

        </el-form>
        <div style="text-align:right;">
          <el-button type="danger" @click="resetForm() ? '' : dialogVisible= false">取消</el-button>
          <el-button type="primary" @click="submitForm">打印</el-button>
        </div>
      </el-dialog>

      <el-dialog :visible.sync="dialogVisibleDownload" title="请先下载驱动" top="30vh">

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
import abcMixin from './abcMixin'
import { getOrderItemList } from '@/api/documents'
import { getOrdersInitItemInfo, saveCreateItems } from '@/api/print'
import * as U from '@/utils'
const defaultForm = {
  materialBrand: '', // 品牌
  materialCategory: '', // 类别
  materialName: '', // 物料描述
  materialCode: '', // 物料编码
  internalShortCode: '', // 内部简码
  vendorName: '', // 供应商名称
  factoryCode: '', // SAP工厂代码
  pkgUnit: '', // 包装单位
  pkgSpec: '', // 包装规格
  type: '', // 型号:
  batch: '', // SAP批次
  version: '', // 版本号
  productionDate: '', // 生产日期
  factoryDate: '', // 到厂日期
  totalPrintNum: '', // 打印张数：
  pkgQuantity: '', // 包装单位数量
  baseQuantity: '', // 基本单位数量
  printSeq: '', // 打印序次
  purchaseOrderItemId: ''// 隐藏de ID
}

export default {
  name: 'PrintingWithOrders',
  components: { Pagination, Sticky },
  mixins: [formMixin, abcMixin],
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
      isPkgQuantityDisabled: true,
      formRef: 'formRef',
      dialogType: '',
      dialogVisible: false,
      /** ***一下打印*****/
      dialogVisibleDownload: false
    }
  },
  computed: {
    isHidden() {
      if (this.dialogType === '查看用户') {
        return true
      } else {
        return false
      }
    }
  },
  created() {
    this.getList(getOrderItemList)
    // console.log(window.innerHeight)
  },
  methods: {
    handlePrint({ row }) {
      // this.startPrint()
      // return false
      const initPrintStatus = this.initPrint()
      if (initPrintStatus) {
        console.log('打印机 已开启,开始打印')
        getOrdersInitItemInfo(row.id)
          .then(res => {
            const defValue = {
              factoryDate: U.parseTime(new Date(), '{y}-{m}-{d}'),
              purchaseOrderItemId: row.id,
              totalPrintNum: 1,
              printSeq: 1,
              pkgQuantity: 0
            }
            this.formFieldRules(res)
            this.form = { ...defValue, ...res.data }
            this.$refs[this.formRef] && this.$refs[this.formRef].resetFields()
            this.dialogType = '打印订单'
            this.dialogVisible = true
          })
          .catch(err => {
            console.log(err)
          })
      } else {
        this.dialogVisibleDownload = true
      }
    },
    formFieldRules(res) {
      const { pkgUnit, pkgSpec } = res
      if (pkgUnit && pkgSpec) {
        this.isPkgQuantityDisabled = false
      }
    },
    submitForm() {
      this.$refs[this.formRef].validate((valid) => {
        if (valid) {
          saveCreateItems(this.form)
            .then(res => {
              this.dialogVisible = false
              this.startPrint({ data: res.data, form: this.form })
            })
            .catch(err => {
              console.log(err, 'err打印返回参数')
            })
        } else {
          return false
        }
      })
    }

  }
}
</script>
