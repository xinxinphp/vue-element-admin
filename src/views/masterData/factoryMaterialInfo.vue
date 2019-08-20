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
            <el-button type="primary" size="mini" @click="handleEditor(scope)">编辑</el-button>
          </template>
        </el-table-column>
        <el-table-column label="物料类型" prop="materialType" width="80" />
        <el-table-column label="物料编码" prop="materialCode" width="120" />
        <el-table-column label="物料描述" prop="materialName" :width="tdSize(5,11)">
          <template slot-scope="scope">
            <LongText :text="scope.row.materialName" />
          </template>
        </el-table-column>
        <el-table-column label="SAP批次管理" prop="batchEnabled" align="center" width="120">
          <template slot-scope="scope">
            <span>{{ scope.row.batchEnabled ? '启用': '' }}</span>
          </template>
        </el-table-column>
        <el-table-column label="SAP基本单位" prop="unit" align="center" width="120" />
        <el-table-column label="包装单位" prop="pkgUnit" align="center" width="120" />
        <el-table-column label="包装规格" prop="pkgSpec" min-width="80" />
        <el-table-column label="品牌" prop="materialBrand" width="100" />
        <el-table-column label="类别" prop="materialCategory" align="center" width="100" />
        <el-table-column label="小类" prop="materialSmallCategory" width="100" />
        <el-table-column label="内部简码" prop="internalShortCode" width="100" />
      </el-table>

      <pagination
        :total="total"
        :page.sync="listQuery.page"
        :limit.sync="listQuery.limit"
        @pagination="getList(done)"
      />

      <el-dialog :visible.sync="dialogVisible" :title="dialogType" width="65%">
        <el-form :model="dialogForm" label-width="120px" label-position="right">
          <el-row>
            <el-col :span="8">
              <el-form-item label="物料类型">
                <span> {{ dialogForm.materialType }}</span>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="物料编码">
                <span> {{ dialogForm.materialCode }}</span>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="包装单位" prop="pkgUnit">
                <el-input v-model="dialogForm.pkgUnit" />
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="8">
              <el-form-item label="包装规格">
                <el-input-number v-model="dialogForm.pkgSpec" :min="1" style="width: 100%" />
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="品牌">
                <el-select
                  v-model="dialogForm.materialBrand"
                  style="width: 100%"
                  clearable
                >
                  <el-option v-for="item in materialBrand" :key="item.id" :label="item.name" :value="item.name">
                    <span style="float: left">{{ item.name }}</span>
                  </el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="类别">
                <el-select
                  v-model="dialogForm.materialCategory"
                  style="width: 100%"
                  clearable
                >
                  <el-option v-for="item in materialCategory" :key="item.id" :label="item.name" :value="item.name">
                    <span style="float: left">{{ item.name }}</span>
                  </el-option>
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="8">
              <el-form-item label="小类">
                <el-select
                  v-model="dialogForm.materialSmallCategory"
                  style="width: 100%"
                  clearable
                >
                  <el-option v-for="item in materialSmallCategory" :key="item.id" :label="item.name" :value="item.name">
                    <span style="float: left">{{ item.name }}</span>
                  </el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="内部简码">
                <el-input v-model="dialogForm.internalShortCode" />
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="型号">
                <el-input v-model="dialogForm.type" />
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
        <div style="text-align:right;">
          <el-button type="danger" @click="dialogVisible= false">取消</el-button>
          <el-button type="primary" @click="submitForm">保存</el-button>
        </div>
      </el-dialog>
    </div>
  </div>
</template>

<script>

import Sticky from '@/components/Sticky'
import Pagination from '@/components/Pagination'
import formMixin from '@/views/mixin/BaseSearchForm'
import { getMaterialsInfo, getMaterialBrand, getMaterialCategory, getMaterialSmallCategory, setMaterialsInfo } from '@/api/masterData'
const defaultForm = {
  materialSmallCategory: '',	// 小类
  materialCategory: '', // 类别
  materialType: '', // SAP物料类型	materialType
  materialCode: '', // 物料编码
  internalShortCode: '', // 内部简码
  materialName: ''// 物料描述
}

export default {
  name: 'FactoryMaterialInfo',
  components: { Pagination, Sticky },
  mixins: [formMixin],
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
      dialogVisible: false
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
    handleEditor({ row }) {
      this.dialogForm = Object.assign({}, row)
      this.dialogVisible = true
    },
    submitForm() {
      delete this.dialogForm.createdDate
      delete this.dialogForm.lastModifiedDate
      setMaterialsInfo(this.dialogForm)
        .then(res => {
          this.getList(getMaterialsInfo)
          this.$message.success(res.message)
          this.dialogVisible = false
        })
        .catch(err => {
          this.$message.error(JSON.stringify(err))
          this.dialogVisible = false
        })
    }
  }
}
</script>
