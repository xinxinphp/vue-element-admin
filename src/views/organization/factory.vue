<template>
  <div class="app-container">
    <el-button type="primary" @click="handleAdd">新增工厂</el-button>

    <el-table
      v-loading="loading"
      style="width: 100%; margin-top:20px;"
      :data="tableData"
      border
      row-key="id"
      fit
      highlight-current-row
    >
      <el-table-column label="编号" prop="code" width="150" />
      <el-table-column label="名称" prop="name" width="320" />
      <el-table-column label="备注" prop="remark" min-width="220" />
      <el-table-column label="操作" align="center" width="250">
        <template slot-scope="scope">
          <el-button type="primary" size="mini" @click="handleEdit(scope)">编辑</el-button>
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
        <el-form-item label="名称" prop="name" :rules="[{ required: true }]">
          <el-input v-model="formQ.name" placeholder="输入名称" />
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

import { getFactories, setFactories } from '@/api/organization'
import Pagination from '@/components/Pagination'
const defaultForm = {
  code: '',
  name: '',
  remark:	''
}

export default {
  name: 'Factory',
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
      getFactories(this.listQuery)
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
    handleAdd() {
      this.dialogType = '添加工厂'
      this.dialogVisible = true
    },
    handleEdit({ row }) {
      this.formQ = { ...row }
      this.$refs[this.formRef] && this.$refs[this.formRef].resetFields()
      this.dialogType = '编辑用户'
      this.dialogVisible = true
    },
    resetForm() {
      this.initForm()
      this.$refs[this.formRef] && this.$refs[this.formRef].resetFields()
    },
    submitForm() {
      this.$refs[this.formRef].validate((valid) => {
        if (valid) {
          setFactories(this.formQ)
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
