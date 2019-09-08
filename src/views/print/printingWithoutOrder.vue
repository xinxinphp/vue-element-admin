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
      <el-select
        v-model="form.materialSmallCategory"
        :placeholder="_getFieldName('materialSmallCategory','小类')"
        :style="mini"
        class="filter-item"
        clearable
      >
        <el-option v-for="item in materialSmallCategory" :key="item.id" :label="item.name" :value="item.name">
          <span style="float: left">{{ item.name }}</span>
        </el-option>
      </el-select>
      <el-input
        v-model="form.materialType"
        :placeholder="_getFieldName('materialType','SAP物料类型')"
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
        v-model="form.internalShortCode"
        :placeholder="_getFieldName('internalShortCode','内部简码')"
        :style="small"
        class="filter-item"
        clearable
      />
      <el-input
        v-model="form.materialName"
        :placeholder="_getFieldName('materialName','物料描述')"
        :style="medium"
        class="filter-item"
        clearable
      />
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
        @sort-change="sortChange"
      >
        <el-table-column label="操作" align="center" width="120">
          <template slot-scope="scope">
            <el-button type="primary" size="mini" @click="handlePrint(scope)">打印</el-button>
          </template>
        </el-table-column>
        <el-table-column label="物料类型" prop="materialType" width="80" />
        <el-table-column label="工厂" prop="factoryCode" width="80" />
        <el-table-column label="物料编码" prop="materialCode" width="120" />
        <el-table-column label="物料描述" prop="materialName" :width="tdSize(5,35)" />
        <el-table-column label="SAP批次管理" prop="batchEnabled" align="center" width="120">
          <template slot-scope="scope">
            <span>{{ scope.row.batchEnabled ? '启用': '' }}</span>
          </template>
        </el-table-column>
        <el-table-column label="SAP基本单位" prop="unit" align="center" width="120" />
        <el-table-column label="包装单位" prop="pkgUnit" align="center" width="120" />
        <el-table-column label="包装规格" prop="pkgSpec" min-width="80" />
        <el-table-column label="车牌号" prop="plateNumber" min-width="80" />
        <el-table-column label="品牌" prop="materialBrand" width="100" />
        <el-table-column label="类别" prop="materialCategory" align="center" width="100" />
        <el-table-column label="小类" prop="materialSmallCategory" width="100" />
        <el-table-column label="内部简码" prop="internalShortCode" width="100" />
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
              <el-form-item label="供应商名称" prop="vendorName" :rules="[{ required: true }]">
                <el-select
                  v-model="form.vendorName"
                  placeholder="供应商名称"
                  class="filter-item"
                  clearable
                >
                  <el-option v-for="item in vendorNameAll" :key="item.id" :label="item.vendorName" :value="item.vendorName">
                    <span style="float: left">{{ item.vendorName }}</span>
                  </el-option>
                </el-select>
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
                <el-input v-model="form.batch" placeholder="输入批次" maxlength="10" />
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
                <el-input v-model="form.plateNumber" placeholder="输入车牌号" />
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
import { getMaterialsInfo, getMaterialBrand, getMaterialCategory, getMaterialSmallCategory } from '@/api/masterData'
import { getFindbyFactory } from '@/api/common'
import { getInitItemInfo, setcreateItemsByNoOrder } from '@/api/print'
import { validatePrintSeq } from '@/utils/validate'
import * as U from '@/utils'

const defaultForm = {
  materialSmallCategory: '',	// 小类
  materialCategory: '', // 类别
  materialType: 'PKAG', // SAP物料类型	materialType
  materialCode: '', // 物料编码
  internalShortCode: '', // 内部简码
  productionDate: '', // 生产日期
  productionDate2: '', // 生产日期2
  materialName: ''// 物料描述
}

export default {
  name: 'SupplierPrint',
  components: { Pagination, Sticky },
  mixins: [formMixin, abcMixin],
  data() {
    return {
      defaultForm: defaultForm,
      form: Object.assign({}, defaultForm),
      tableKey: 0,
      list: null,
      total: 0,
      loading: true,
      downloadLoading: false,
      materialBrand: [],
      materialCategory: [],
      materialSmallCategory: [],
      /** ***一下打印*****/
      dialogForm: {},
      isPkgQuantityDisabled: true,
      formRef: 'formRef',
      dialogType: '',
      remark: '', // 车牌号
      printSeq: '', // 备注
      dialogVisible: false,
      /** ***一下打印*****/
      dialogVisibleDownload: false,
      vendorNameAll: [],
      rules: {
        printSeq: [{ required: true, validator: validatePrintSeq, trigger: 'blur' }]
      }
    }
  },
  computed: {
  },
  created() {
    this.getList(getMaterialsInfo)
    getMaterialBrand()
      .then(res => {
        this.materialBrand = res.data // 品牌
      })
    getMaterialCategory()
      .then(res => {
        this.materialCategory = res.data // 类别
      })
    getMaterialSmallCategory()
      .then(res => {
        this.materialSmallCategory = res.data // 小类
      })
  },
  methods: {
    getVendorNameAll(factoryId) {
      getFindbyFactory({ factoryId })
        .then(res => {
          this.vendorNameAll = res.data
        })
    },
    handlePrint({ row }) {
      // this.startPrint()
      // return false
      this.getVendorNameAll(row.factoryId)
      const initPrintStatus = this.initPrint()
      if (initPrintStatus) {
        getInitItemInfo({ factoryId: row.factoryId, materialId: row.materialId })
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
            this.form = { ...defValue, ...res.data, factoryId: row.factoryId }
            this.form.batchEnabled ? this.form.batchEnabled = '启用' : ''
            this.form.vendorName = ''
            this.$refs[this.formRef] && this.$refs[this.formRef].resetFields()
            this.dialogType = '无订单打印标签'
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
    submitForm() {
      this.$refs[this.formRef].validate((valid) => {
        if (valid) {
          if (this.form.pkgQuantity || this.form.baseQuantity) {
            setcreateItemsByNoOrder(this.form)
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
