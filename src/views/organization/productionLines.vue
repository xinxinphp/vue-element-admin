<template>
  <div class="app-container">
    <div class="filter-container">
      <el-select
        v-model="form.factoryId"
        :placeholder="_getFieldName('factoryId','工厂')"
        :style="small"
        clearable
      >
        <el-option v-for="item in factoryIds" :key="item.id + item.name" :label="item.code" :value="item.id">
          <span style="float: left">{{ item.code + '  ----  ' + item.name }}</span>
        </el-option>
      </el-select>
      <el-input
        v-model="form.code"
        placeholder="SAP产线代码"
        :style="small"
        clearable
      />
      <el-input
        v-model="form.name"
        placeholder="产线名称"
        :style="small"
        clearable
      />
      <el-button type="primary" icon="el-icon-search" @click="handleFilter">搜索</el-button>
      <el-button type="info" icon="el-icon-refresh" @click="handleRest">重置</el-button>
    </div>

    <el-button type="primary" @click="handleAdd">新增产线</el-button>

    <el-table
      v-loading="loading"
      style="width: 100%; margin-top:20px;"
      :data="tableData"
      border
      row-key="id"
      fit
      highlight-current-row
    >
      <el-table-column label="工厂" prop="factoryCode" />
      <el-table-column label="产线代码" prop="code" />
      <el-table-column label="产线名称" prop="name"  />
      <el-table-column label="备注" prop="remark" />
      <el-table-column label="操作" align="center" min-width="150">
        <template slot-scope="scope">
          <el-button type="primary" size="small" @click="handleEdit(scope)">编辑</el-button>
          <el-button type="danger" size="small" @click="handleDelete(scope)">删除</el-button>
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
      <el-form :ref="formRef" :model="formQ" label-width="160px" label-position="right">
        <el-form-item label="SAP产线代码" prop="code" :rules="[{ required: true }]">
          <el-input v-model="formQ.code" placeholder="SAP产线代码" maxlength="20" />
        </el-form-item>

        <el-form-item label="产线名称" prop="name" :rules="[{ required: true }]">
          <el-input v-model="formQ.name" placeholder="产线名称" />
        </el-form-item>

        <el-form-item label="工厂" prop="factoryId" :rules="[{ required: true }]">
          <el-select
            v-model="formQ.factoryId"
            placeholder="工厂"
            style="width: 100%"
            clearable
          >
            <el-option v-for="item in factoryIds" :key="item.id" :label="item.code" :value="item.id">
              <span style="float: left">{{ item.code + '  ----  ' + item.name }}</span>
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

</template>

<script>
import formMixin from '@/views/mixin/BaseSearchForm'
import { getProductionLines, setProductionLines, deleteProductionLines } from '@/api/organization'
import Pagination from '@/components/Pagination'
const defaultForm = {
  factoryId: '',
  code: '',
  name: '',
  remark: ''
}

export default {
  name: 'ProductionLines',
  components: { Pagination },
  mixins: [formMixin],
  data() {
    return {
      formQ: Object.assign({}, defaultForm),
      form: {
        code: '',
        name: ''
      },
      roleIds: [],
      tableData: [],
      loading: true,
      total: 1,
      formRef: 'formRef',
      dialogType: '',
      dialogVisible: false
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
    getList() {
      this.loading = true
      getProductionLines({ ...this.form, ...this.listQuery })
        .then(res => {
          this.tableData = res.data.list
          this.total = res.data.total
          this.loading = false
        })
        .catch(err => {
          this.$message.error(err)
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
      this.dialogType = '添加产线'
      this.dialogVisible = true
    },
    handleEdit({ row }) {
      this.formQ = { ...row }
      this.$refs[this.formRef] && this.$refs[this.formRef].resetFields()
      this.dialogType = '编辑'
      this.dialogVisible = true
    },
    handleDelete({ row }) {
      this.$confirm('确认删除?', '警告', {
        confirmButtonText: '确认',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          deleteProductionLines(row.id)
            .then(res => {
              this.getList()
              this.$message.success(res.message)
            })
            .catch(err => {
              this.$message.error(err)
            })
        })
    },
    resetForm() {
      this.initForm()
      this.$refs[this.formRef] && this.$refs[this.formRef].resetFields()
    },
    submitForm() {
      this.$refs[this.formRef].validate((valid) => {
        if (valid) {
          setProductionLines(this.formQ)
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
