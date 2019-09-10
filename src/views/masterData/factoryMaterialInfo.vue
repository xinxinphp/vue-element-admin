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
      <el-button type="primary" @click="handleInSetExcel">Excel导入</el-button>

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
        <el-table-column label="物料描述" prop="materialName" :width="tdSize(5,35)" />
        <el-table-column label="最小安全库存" prop="minSafeQuantity" align="center" width="110">
          <template slot-scope="{row}">
            <el-input v-if="row.edit" v-model="row.minSafeQuantity" class="edit-input" size="small" />
            <span v-else>{{ row.minSafeQuantity }}</span>
          </template>
        </el-table-column>
        <el-table-column label="最大安全库存" prop="maxSafeQuantity" align="center" width="110">
          <template slot-scope="{row}">
            <el-input v-if="row.edit" v-model="row.maxSafeQuantity" class="edit-input" size="small" />
            <span v-else>{{ row.maxSafeQuantity }}</span>
          </template>
        </el-table-column>
        <el-table-column label="码放标准" prop="trayBoxQuantity" align="center" width="110">
          <template slot-scope="{row}">
            <el-input v-if="row.edit" v-model="row.trayBoxQuantity" class="edit-input" size="small" />
            <span v-else>{{ row.trayBoxQuantity }}</span>
          </template>
        </el-table-column>
        <el-table-column label="操作" align="center" width="100">
          <template slot-scope="{row}">
            <el-button
              v-if="row.edit"
              type="success"
              size="mini"
              icon="el-icon-circle-check-outline"
              @click="confirmEdit(row)"
            >
              保存
            </el-button>
            <el-button
              v-else
              type="primary"
              size="mini"
              icon="el-icon-edit"
              @click="row.edit=!row.edit"
            >
              编辑
            </el-button>

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
      <el-dialog :visible.sync="dialogVisibleUpFile">
        <el-upload
          ref="upload"
          class="upload-demo"
          action="http://10.240.206.129:8080/api/spots/import_from_excel"
          :on-preview="handlePreview"
          :on-remove="handleRemove"
          :before-remove="beforeRemove"
          multiple
          :headers="headers"
          :auto-upload="false"
          :limit="1"
          :http-request="httpRequst"
          :on-exceed="handleExceed"
          :file-list="fileList"
        >
          <el-button slot="trigger" size="small" type="primary">选取文件</el-button>
          <el-button style="margin-left: 10px;" size="small" type="success" @click="submitUpload">上传到服务器</el-button>
          <div slot="tip" style="color: red; padding-top: 10px">只能上传 xlsx 后缀文件</div>
        </el-upload>

        <span slot="footer" class="dialog-footer">
          <el-button @click="dialogVisibleUpFile = false">取 消</el-button>
        </span>
      </el-dialog>
    </div>
  </div>
</template>

<script>

import Sticky from '@/components/Sticky'
import Pagination from '@/components/Pagination'
import formMixin from '@/views/mixin/BaseSearchForm'
import { getToken } from '@/utils/auth'
import { getMaterialsInfo, getMaterialBrand, getMaterialCategory, getMaterialSmallCategory, setMaterialsInfo, setInputSafeQuantity } from '@/api/masterData'
import { getFactoryMaterialInfoImportFromExcel } from '@/api/common'
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
      dialogVisible: false,
      fileList: [],
      headers: { Authorization: `Bearer ${getToken()}` },
      dialogVisibleUpFile: false
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
    confirmEdit(row) {
      const data = {
        'id': row.id, // itemID
        'minSafeQuantity': row.minSafeQuantity,
        'maxSafeQuantity': row.maxSafeQuantity,
        'trayBoxQuantity': row.trayBoxQuantity
      }
      setInputSafeQuantity(data)
        .then(res => {
          row.edit = false
          this.$message.success(res.message)
          return 'OK'
        })
        .catch(err => {
          row.edit = false
          this.$message.error(err)
        })
        .then(res => {
          this.getList(this.done)
        })
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
    },
    handleInSetExcel(filterVal, jsonData) {
      this.dialogVisibleUpFile = true
    },
    handleRemove(file, fileList) {
    },
    handlePreview(file) {
    },
    handleExceed(files, fileList) {
      this.$message.warning(`当前限制选择 1 个文件，本次选择了 ${files.length} 个文件，共选择了 ${files.length + fileList.length} 个文件`)
    },
    beforeRemove(file, fileList) {
      return this.$confirm(`确定移除 ${file.name}?`)
    },
    httpRequst(params) {
      const _file = params.file
      const isSheet = _file.type.indexOf('sheet') !== -1
      const isLt2M = _file.size / 1024 / 1024 < 8
      if (!isLt2M) {
        this.$message.error('请上传8M以下的.xlsx文件')
        return false
      }
      if (!isSheet) {
        this.$message.error('必须是上传.xlsx文件')
        return false
      }
      var formData = new FormData()
      formData.append('file', _file)
      getFactoryMaterialInfoImportFromExcel(formData)
        .then(res => {
          this.$message.success(res.message)
        })
    },
    submitUpload() {
      this.$refs.upload.submit()
    }
  }
}
</script>
