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
      <el-date-picker
        v-model="form.queryDateStart"
        type="date"
        value-format="yyyy-MM-dd"
        :editable="false"
        :placeholder="_getFieldName('queryDateStart','创建日期开始')"
        :style="small"
      />
      <el-date-picker
        v-model="form.queryDateEnd"
        type="date"
        value-format="yyyy-MM-dd"
        :editable="false"
        :placeholder="_getFieldName('queryDateEnd','创建日期结束')"
        :style="small"
      />
      <el-input
        v-model="form.createdBy"
        :placeholder="_getFieldName('createdBy','创建人')"
        :style="medium"
        class="filter-item"
        clearable
      />
      <el-checkbox v-model="form.retPo">退货</el-checkbox>
      <el-button class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter">搜索</el-button>
      <el-button class="filter-item" type="info" icon="el-icon-refresh" @click="handleRest()">重置</el-button>

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
        :default-sort="{prop: 'sapCreatedDate', order: 'descending'}"
        @sort-change="sortChange"
      >
        <el-table-column label="打印" align="center" width="75">
          <template slot-scope="scope">
            <span><el-button type="primary" size="mini" @click="handlePrint(scope)">打印</el-button></span>
          </template>
        </el-table-column>
        <el-table-column label="工厂" prop="factoryCode" align="center" width="65" />
        <el-table-column label="订单号" prop="orderNo" align="center" :width="tdSize(3,11, false)" />
        <el-table-column label="行项目" prop="orderItemNo" align="center" :width="tdSize(3,5, false)" />
        <el-table-column label="创建日期" prop="sapCreatedDate" align="center" width="110" sortable />
        <el-table-column label="交货日期" prop="plannedDeliveryDate" align="center" width="110" />
        <el-table-column label="物料编码" prop="materialCode" align="center" width="120" />
        <el-table-column label="物料描述" prop="materialName" :width="tdSize(5,35)" />
        <el-table-column label="订单数量" prop="quantity" width="100" />
        <el-table-column label="车牌号" prop="plateNumber" min-width="80" />
        <el-table-column label="已打印数量" prop="printedQuantity" width="100" />
        <el-table-column label="订单单位" prop="unit" align="center" width="100" />
        <el-table-column label="已入库数量" prop="processedQuantity" width="100" />
        <el-table-column label="供应商名称" prop="vendorName" :width="tdSize(5,11)">
          <template slot-scope="scope">
            <LongText :text="scope.row.vendorName" />
          </template>
        </el-table-column>
        <el-table-column label="供应商" prop="vendorCode" :width="tdSize(3,10, false)">
          <template slot-scope="scope">
            <LongText :text="scope.row.vendorCode" />
          </template>
        </el-table-column>
        <el-table-column label="退货" prop="retPo" align="center" width="70">
          <template slot-scope="scope">
            <span>{{ scope.row.retPo ? '是': '' }}</span>
          </template>
        </el-table-column>
        <el-table-column label="删除" prop="sapDeleted" align="center" width="70">
          <template slot-scope="scope">
            <span>{{ scope.row.sapDeleted ? '是': '' }}</span>
          </template>
        </el-table-column>
        <el-table-column label="寄售" prop="pstyp" align="center" width="70">
          <template slot-scope="scope">
            <span>{{ scope.row.pstyp === '2' ? '是': '' }}</span>
          </template>
        </el-table-column>

        <el-table-column label="库存地点" prop="stockLocation" align="center" width="80" />
        <el-table-column label="SAP已交货完成" prop="elikz" align="center" width="120">
          <template slot-scope="scope">
            <span>{{ scope.row.elikz ? '是': '' }}</span>
          </template>
        </el-table-column>
        <el-table-column label="备注" prop="remark" width="180" />
      </el-table>

      <pagination
        :total="total"
        :page.sync="listQuery.page"
        :limit.sync="listQuery.limit"
        @pagination="getList(done)"
      />
      <el-dialog :visible.sync="dialogVisible" :title="dialogType" :before-close="handleClose" width="65%">
        <el-form :ref="formRef" :model="form" :rules="rules" label-width="120px" label-position="right">
          <el-row>
            <el-col :span="16">
              <el-form-item label="物料描述" prop="materialName">
                <el-input v-model="form.materialName" disabled />
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="供应商名称" prop="vendorName">
                <el-input v-model="form.vendorName" disabled />
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="8">
              <el-form-item label="物料编码" prop="materialCode">
                <el-input v-model="form.materialCode" disabled />
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="内部简码" prop="internalShortCode">
                <el-input v-model="form.internalShortCode" disabled />
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="Sap工厂代码" prop="factoryCode">
                <el-input v-model="form.factoryCode" disabled />
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="8">
              <el-form-item label="品牌" prop="materialBrand">
                <el-input v-model="form.materialBrand" disabled />
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="类别" prop="materialCategory">
                <el-input v-model="form.materialCategory" disabled />
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="型号" prop="type">
                <el-input v-model="form.type" disabled />
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="8">
              <el-form-item label="包装单位" prop="pkgUnit">
                <el-input v-model="form.pkgUnit" disabled />
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="包装规格" prop="pkgSpec">
                <el-input v-model="form.pkgSpec" disabled />
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="SAP基本单位" prop="unit">
                <el-input v-model="form.unit" disabled />
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="8">
              <el-form-item label="SAP批次管理" prop="batchEnabled">
                <el-input v-model="form.batchEnabled" disabled />
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="批次" prop="batch" :rules="[{ required: form.batchEnabled }]">
                <el-select
                  v-model="form.batch"
                  allow-create
                  filterable
                  remote
                  reserve-keyword
                  placeholder="输入批次"
                  :remote-method="remoteMethodBatch"
                  :loading="loadingSelct"
                >
                  <el-option v-for="item in batchAll" :key="item.id" :label="item.content" :value="item.content" />
                </el-select>
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
                  placeholder="选择生产日期"
                  :editable="false"
                />
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="到厂日期" prop="factoryDate" :rules="[{ required: true }]">
                <el-date-picker
                  v-model="form.factoryDate"
                  style="width: 100%"
                  type="datetime"
                  value-format="yyyy-MM-dd HH:mm:ss"
                  placeholder="选择到厂日期"
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
              <el-form-item label="箱数(包装单位)" prop="pkgQuantity">
                <el-input v-model="form.pkgQuantity" placeholder="输入包装单位数量" :disabled="isPkgQuantityDisabled" />
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="散数(基本单位)" prop="baseQuantity" :rules="[{ required: true }]">
                <el-input-number v-model="form.baseQuantity" :min="0" style="width: 100%" />
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="打印序次" prop="printSeq">
                <el-input v-model="form.printSeq" style="width: 100%" />
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="8">
              <el-form-item label="车牌号" prop="plateNumber" :rules="[{ required: true }]">
                <el-select
                  v-model="form.plateNumber"
                  allow-create
                  filterable
                  remote
                  reserve-keyword
                  placeholder="请输入车牌号"
                  :remote-method="remoteMethodPlateNumber"
                  :loading="loadingSelct"
                >
                  <el-option v-for="item in plateNumberAll" :key="item.id" :label="item.content" :value="item.content" />
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="备注" prop="remark">
                <el-input v-model="form.remark" :min="0" style="width: 100%" />
              </el-form-item>
            </el-col>
            <el-col :span="8" />
          </el-row>

        </el-form>
        <div style="text-align:right;">
          <el-button type="danger" @click="resetForm() ? '' : dialogVisible= false">取消</el-button>
          <el-button type="primary" @click="submitForm">打印</el-button>
        </div>
      </el-dialog>

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
import abcMixin from './abcMixin'
import { parseTime } from '@/utils'
import { getOrderItemList } from '@/api/documents'
import { getOrdersInitItemInfo, saveCreateItems } from '@/api/print'
import { validatePrintSeq } from '@/utils/validate'
import * as U from '@/utils'
const now = new Date()
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
  retPo: false,
  batch: '', // SAP批次
  version: '', // 版本号
  productionDate: '', // 生产日期
  productionDate2: '', // 生产日期2
  factoryDate: '', // 到厂日期
  totalPrintNum: '', // 打印张数：
  pkgQuantity: '', // 包装单位数量
  baseQuantity: '', // 基本单位数量
  printedQuantity: '', // 已打印数量
  plateNumber: '', // 已打印数量
  remark: '', // 车牌号
  printSeq: '', // 备注
  queryDateStart: parseTime(now.setMonth(now.getMonth() - 1), '{y}-{m}-{d}'), // 打印序次
  queryDateEnd: parseTime(new Date(), '{y}-{m}-{d}'),
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
      isBatchDisabled: true, // 批次是否能输入
      formRef: 'formRef',
      dialogType: '',
      dialogVisible: false,
      loadingSelct: false,
      plateNumberAll: [],
      rules: {
        printSeq: [{ required: true, validator: validatePrintSeq, trigger: 'blur' }]
      },
      /** ***一下打印*****/
      dialogVisibleDownload: false
    }
  },
  computed: {
  },
  created() {
    this.getList(getOrderItemList)
  },
  methods: {
    handlePrint({ row }) {
      if (row.retPo || row.sapDeleted) {
        this.$message({
          message: '退货或删除订单不允许打印',
          type: 'error',
          duration: 0,
          showClose: true
        })
        return false
      }
      const initPrintStatus = this.initPrint()
      if (initPrintStatus) {
        getOrdersInitItemInfo(row.id)
          .then(res => {
            const defValue = {
              factoryDate: U.parseTime(new Date(), '{y}-{m}-{d} {h}:{i}:{s}'),
              purchaseOrderItemId: row.id,
              totalPrintNum: 1,
              printSeq: U.parseTime(new Date(), '{h}{i}'),
              pkgQuantity: 0,
              baseQuantity: 0
            }
            this.formFieldRules(res)
            this.formBatchFieldRules(res)
            this.form = { ...defValue, ...res.data }
            this.form.batchEnabled ? this.form.batchEnabled = '启用' : ''
            this.$refs[this.formRef] && this.$refs[this.formRef].resetFields()
            this.dialogType = '有订单打印'
            this.dialogVisible = true
          })
      } else {
        this.dialogVisibleDownload = true
      }
    },
    formFieldRules(res) {
      const { pkgUnit, pkgSpec } = res.data
      if (pkgUnit && pkgSpec) {
        this.isPkgQuantityDisabled = false
      }
    },
    formBatchFieldRules(res) {
      const { batch } = res.data
      if (batch) {
        this.isBatchDisabled = true
      } else {
        this.isBatchDisabled = false
      }
    },
    submitForm() {
      this.$refs[this.formRef].validate((valid) => {
        if (valid) {
          if (this.form.pkgQuantity || this.form.baseQuantity) {
            saveCreateItems(this.form)
              .then(res => {
                this.dialogVisible = false
                this.startPrint({ data: res.data, form: this.form })
                this.resetForm()
              })
          } else {
            this.$message.error('包装单位数量/基本单位数量至少一个不为0')
          }
        } else {
          return false
        }
      })
    }
  }
}
</script>
