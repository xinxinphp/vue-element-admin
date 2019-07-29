<template>
  <div class="app-container">
    <el-button type="primary" @click="handleAdd">新增仓库</el-button>

    <el-table
      v-loading="loading"
      style="width: 100%; margin-top:20px;"
      :data="tableData"
      border
      row-key="id"
      fit
      highlight-current-row
    >
      <el-table-column label="编号" prop="code" />
      <el-table-column label="描述" prop="description" min-width="120" />
      <el-table-column label="工厂" prop="factoryCode" width="90" />
      <el-table-column label="创建人" prop="createdBy" min-width="120" />
      <el-table-column label="创建日期" prop="createdDate" min-width="120" />
      <el-table-column label="最后操作" prop="lastModifiedBy" min-width="120" />
      <el-table-column label="操作日期" prop="lastModifiedDate" min-width="120" />
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
          >
            <el-option v-for="item in factoriesAll" :key="item.id" :label="item.code" :value="item.id">
              <span style="float: left">{{ item.code + '  ----  ' + item.name }}</span>
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="备注" prop="remark">
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

import { getWarehouses, setWarehouses } from '@/api/organization'
import { getFactoriesAll } from '@/api/common'
import Pagination from '@/components/Pagination'
const defaultForm = {
}

export default {
  name: 'Warehouses',
  components: { Pagination },
  data() {
    return {
      formQ: Object.assign({}, defaultForm),
      factoryIds: [],
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
      factoriesAll: [] // 本页使用的 所有工厂
    }
  },
  computed: {
  },
  created() {
    this.getList()
    this.initForm()
    this.getFactoriesAll()
  },
  methods: {
    initForm() {
      this.formQ = Object.assign({}, defaultForm)
    },
    getFactoriesAll() {
      getFactoriesAll()
        .then(res => {
          this.factoriesAll = res.data
          console.log(this.factoriesAll, '2321')
        })
    },
    getList() {
      this.loading = true
      getWarehouses(this.listQuery)
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
    handleAdd() {
      this.dialogType = '添加仓库'
      this.dialogVisible = true
    },
    handleEdit({ row }) {
      this.formQ = { ...row }
      delete this.formQ.createdDate
      delete this.formQ.lastModifiedDate
      this.$refs[this.formRef] && this.$refs[this.formRef].resetFields()
      this.dialogType = '编辑'
      this.dialogVisible = true
    },
    resetForm() {
      this.initForm()
      this.$refs[this.formRef] && this.$refs[this.formRef].resetFields()
    },
    submitForm() {
      this.$refs[this.formRef].validate((valid) => {
        if (valid) {
          setWarehouses(this.formQ)
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
