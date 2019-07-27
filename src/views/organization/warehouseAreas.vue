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
      <el-button class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter">搜索</el-button>
      <el-button class="filter-item" type="info" icon="el-icon-refresh" @click="handleRest">重置</el-button>
    </sticky>
    <div class="app-container">
      <el-button type="primary" @click="handleAdd">新增库区</el-button>

      <el-table
        v-loading="loading"
        style="width: 100%; margin-top:20px;"
        :data="tableData"
        border
        row-key="id"
        fit
        highlight-current-row
      >
        <el-table-column label="库区代码" prop="code" />
        <el-table-column label="描述" prop="description" width="90" />
        <el-table-column label="工厂" prop="factoryCode" min-width="120" />
        <el-table-column label="仓库" prop="warehouseCode" min-width="120" />
        <el-table-column label="仓库描述" prop="warehouseDescription" min-width="120" />
        <el-table-column label="创建者" prop="createdBy" min-width="120" />
        <el-table-column label="创建日期" prop="createdDate" max-width="90" />
        <el-table-column label="最后操作" prop="lastModifiedBy" min-width="120" />
        <el-table-column label="操作时间" prop="lastModifiedDate" max-width="90" />
        <el-table-column label="备注" prop="remark" min-width="120" />
        <el-table-column label="操作" align="center">
          <template slot-scope="scope">
            <el-button type="primary" size="small" @click="handleEdit(scope)">编辑</el-button>
          </template>
        </el-table-column>
      </el-table>
      <pagination
        :total="total"
        :page.sync="listQuery.page"
        :limit.sync="listQuery.limit"
        @pagination="getList"
      />
      <el-dialog :visible.sync="dialogVisible" :title="dialogType" :before-close="handleClose">
        <el-form :ref="formRef" :model="formQ" label-width="110px" label-position="right">
          <el-form-item label="编号" prop="code" :rules="[{ required: true }]">
            <el-input v-model="formQ.code" placeholder="输入编号" />
          </el-form-item>
          <el-form-item label="描述" prop="description" :rules="[{ required: true }]">
            <el-input v-model="formQ.description" placeholder="输入描述" />
          </el-form-item>
          <el-form-item label="工厂" prop="factoryId" :rules="[{ required: true }]">
            <el-select
              v-model="formQ.factoryId"
              placeholder="工厂"
              style="width: 100%"
              clearable
              @change="handleChange"
            >
              <el-option v-for="item in factoryIds" :key="item.id" :label="item.code" :value="item.id">
                <span style="float: left">{{ item.code + '  ----  ' + item.name }}</span>
              </el-option>
            </el-select>
          </el-form-item>

          <el-form-item label="仓库" prop="warehouseId" :rules="[{ required: true }]">
            <el-select
              v-model="formQ.warehouseId"
              placeholder="仓库"
              style="width: 100%"
              clearable
              :disabled="!formQ.factoryId"
            >
              <el-option v-for="item in warehouseAll" :key="item.id" :label="item.code" :value="item.id">
                <span style="float: left">{{ item.code + '  ----  ' + item.description }}</span>
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="备注" prop="remark" :rules="[{ required: true }]">
            <el-input v-model="formQ.remark" placeholder="输入备注" />
          </el-form-item>
        </el-form>
        <div style="text-align:right;">
          <el-button type="danger" @click=" resetForm() ? '' : dialogVisible= false">取消</el-button>
          <el-button type="primary" @click="submitForm">保存</el-button>
        </div>
      </el-dialog>

    </div>
  </div>
</template>

<script>
import Sticky from '@/components/Sticky'
import formMixin from '@/views/mixin/BaseSearchForm'
import { getWarehouseAreas, setWarehouseAreas } from '@/api/organization'
import { getWarehousesInfo } from '@/api/common'
import Pagination from '@/components/Pagination'
const defaultForm = {
  code: '',
  description: '',
  factoryId: '',
  warehouseId: '',
  remark: ''
}

export default {
  name: 'WarehouseAreas',
  components: { Pagination, Sticky },
  mixins: [formMixin],
  data() {
    return {
      formQ: Object.assign({}, defaultForm),
      form: {
        warehouseId: ''
      },
      roleIds: [],
      tableData: [],
      loading: true,
      total: 1,
      listQuery: {
        page: 1,
        limit: 20, // 每页多少条
        orderBy: 'id desc'// 升序:code 降序: code desc
      },
      formRef: 'formRef',
      dialogType: '',
      dialogVisible: false,
      factoriesAll: [], // 本页使用的
      warehouseAll: [] // 本页使用的 所有仓库
    }
  },
  computed: {
  },
  created() {
    this.getList()
    this.initForm()
  },
  methods: {
    initForm() {
      this.formQ = Object.assign({}, defaultForm)
    },
    // 给仓库字段 进行赋值
    setWarehouse(data) {
      this.form.warehouseId = ''
      this.warehouseAll = data
    },
    handleChange(value) {
      this.form.warehouseId = ''
      this.formQ.warehouseId = ''
      const data = {
        factoryId: value
      }
      getWarehousesInfo(data)
        .then(res => {
          this.setWarehouse(res.data)
        })
    },
    getList() {
      this.loading = true
      getWarehouseAreas({ ...this.form, ...this.listQuery })
        .then(res => {
          this.tableData = res.data.list
          this.total = res.data.total
          this.loading = false
        })
        .catch(err => {
          this.$message.err(err)
          this.loading = false
        })
    },
    handleRest() {
      this.form = {}
      this.listQuery.page = 1
      this.listQuery.orderBy = 'id desc'
      this.getList()
    },
    handleAdd() {
      this.form = {}
      this.dialogType = '添加库区'
      this.dialogVisible = true
    },
    handleEdit({ row }) {
      getWarehousesInfo({ factoryId: row.factoryId })
        .then(res => {
          this.formQ = { ...row }
          this.setWarehouse(res.data)
          delete this.formQ.createdDate
          delete this.formQ.lastModifiedDate
          this.$refs[this.formRef] && this.$refs[this.formRef].resetFields()
          this.dialogType = '编辑'
          this.dialogVisible = true
        })
    },
    resetForm() {
      this.initForm()
      this.$refs[this.formRef] && this.$refs[this.formRef].resetFields()
    },
    submitForm() {
      this.$refs[this.formRef].validate((valid) => {
        if (valid) {
          setWarehouseAreas(this.formQ)
            .then(res => {
              this.$message.success(res.message)
              this.getList()
              this.resetForm()
              this.dialogVisible = false
            })
            .catch(err => {
              this.$message.error(err)
            })
        } else {
          return false
        }
      })
    },
    handleClose(done) {
      done()
      this.resetForm()
    }
  }
}
</script>
