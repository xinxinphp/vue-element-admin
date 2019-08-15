<template>
  <div class="app-container">
    <el-button type="primary" @click="handleAdd">新增用户</el-button>

    <el-table
      v-loading="loading"
      style="width: 100%; margin-top:20px;"
      :data="tableData"
      border
      row-key="id"
      fit
      highlight-current-row
    >
      <el-table-column label="登录名" prop="login" width="150" />
      <el-table-column label="姓名" prop="name" width="80" />
      <el-table-column label="邮箱" prop="email" min-width="220" />
      <el-table-column label="手机号码" prop="phoneNumber" width="150" />
      <el-table-column label="部门" prop="dept" width="80" />
      <el-table-column label="职位" prop="position" width="150" />
      <el-table-column label="是否AD用户" prop="ldapUser" width="150">
        <template slot-scope="scope">
          <span>{{ scope.row.ldapUser ? '是':'' }}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" width="250">
        <template slot-scope="scope">
          <el-button type="primary" size="mini" @click="handleEdit(scope)">编辑</el-button>
          <el-button type="success" size="mini" @click="handleAbout(scope)">详情</el-button>
          <el-button type="danger" size="mini" @click="handleDelete(scope)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <pagination
      :total="total"
      :page.sync="listQuery.page"
      :limit.sync="listQuery.limit"
      @pagination="getList"
    />
    <el-dialog :visible.sync="dialogVisible" :title="dialogType" :before-close="handleClose" top="5vh">
      <el-form :ref="formRef" :model="formQ" label-width="110px" label-position="right" :disabled="isHidden">
        <el-form-item label="登录名" prop="login" :rules="[{ required: true }]">
          <el-input v-model="formQ.login" placeholder="输入登录名" :disabled="isDisabled" />
        </el-form-item>
        <el-form-item label="姓名" prop="name" :rules="[{ required: true }]">
          <el-input v-model="formQ.name" placeholder="输入姓名" />
        </el-form-item>
        <el-form-item v-if="['编辑用户','查看用户'].includes(dialogType)" label="性别" prop="gender">
          <el-radio v-model="formQ.gender" label="1">男</el-radio>
          <el-radio v-model="formQ.gender" label="2">女</el-radio>
        </el-form-item>
        <el-form-item label="邮箱" prop="email" :rules="[{ required: true }]">
          <el-input v-model="formQ.email" placeholder="输入邮箱email" />
        </el-form-item>
        <el-form-item label="手机号码" prop="phoneNumber">
          <el-input v-model="formQ.phoneNumber" placeholder="输入手机号码" />
        </el-form-item>
        <el-form-item label="部门" prop="dept">
          <el-input v-model="formQ.dept" placeholder="输入部门" />
        </el-form-item>
        <el-form-item label="职位" prop="position">
          <el-input v-model="formQ.position" placeholder="输入职位" />
        </el-form-item>
        <el-form-item label="SAP帐号" prop="sapAccount">
          <el-input v-model="formQ.sapAccount" placeholder="输入SAP帐号" />
        </el-form-item>
        <el-form-item label="工厂" prop="factoryIds">
          <el-select v-model="formQ.factoryIds" multiple placeholder="请选择" style="width: 100%">
            <el-option v-for="item in factoryIds" :key="item.id + item.name" :label="item.code" :value="item.id">
              <span style="float: left">{{ item.code + '  ----  ' + item.name }}</span>
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="角色" prop="roleIds">
          <el-select v-model="formQ.roleIds" multiple placeholder="请选择" style="width: 100%">
            <el-option v-for="item in roleIds" :key="item.id" :label="item.code" :value="item.id">
              <span style="float: left">{{ item.code + '  ----  ' + item.description }}</span>
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item v-if="['编辑用户','查看用户'].includes(dialogType)" label="是否启用" prop="activated">
          <el-radio v-model="formQ.activated" :label="true">启用</el-radio>
          <el-radio v-model="formQ.activated" :label="false">关闭</el-radio>
        </el-form-item>
        <el-form-item label="是否AD用户" prop="ldapUser">
          <el-radio v-model="formQ.ldapUser" :label="true">是</el-radio>
          <el-radio v-model="formQ.ldapUser" :label="false">否</el-radio>
        </el-form-item>
        <el-form-item v-if="isHidden" label="创建人" prop="createdBy">
          <el-input v-model="formQ.createdBy" />
        </el-form-item>
        <el-form-item v-if="isHidden" label="创建时间" prop="createdDate">
          <el-input v-model="formQ.createdDate" />
        </el-form-item>
        <el-form-item v-if="isHidden" label="最后操作人" prop="lastModifiedBy">
          <el-input v-model="formQ.lastModifiedBy" />
        </el-form-item>
        <el-form-item v-if="isHidden" label="最后操作时间" prop="lastModifiedDate">
          <el-input v-model="formQ.lastModifiedDate" />
        </el-form-item>
      </el-form>
      <div style="text-align:right;">
        <el-button type="danger" @click=" resetForm() ? '' : dialogVisible= false">取消</el-button>
        <el-button type="primary" :disabled="isHidden" @click="submitForm">保存</el-button>
      </div>
    </el-dialog>

  </div>
</template>

<script>

import { getUsers, getOneUsers, getFactoriesAll, getRolesAll, saveUsers, deleteUsers } from '@/api/authority'
import Pagination from '@/components/Pagination'
const defaultForm = {
  createdBy: '',
  createdDate: '',
  lastModifiedBy:	'',
  lastModifiedDate: '',
  id:	'',
  login:	'',
  name:	'',
  email:	'',
  activated:	1, // 是否激活 1激活
  dept:	'',
  position:	'',
  sapAccount:	'',
  phoneNumber:	'',
  gender:	1, // 性别 1男 2女
  factoryIds: [],
  ldapUser: '',
  roleIds: []
}

export default {
  name: 'Users',
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
    isDisabled() {
      if (this.dialogType === '编辑用户') {
        return true
      } else {
        return false
      }
    },
    isHidden() {
      if (this.dialogType === '查看用户') {
        return true
      } else {
        return false
      }
    }
  },
  created() {
    this.getList()
    this.getFactories()
    this.getRoles()
  },
  methods: {
    initForm() {
      this.formQ = Object.assign({}, defaultForm)
    },
    getList() {
      this.loading = true
      getUsers(this.listQuery)
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
    getFactories() {
      getFactoriesAll()
        .then(res => {
          this.factoryIds = [...res.data]
        })
    },
    getRoles() {
      getRolesAll()
        .then(res => {
          this.roleIds = [...res.data]
        })
    },
    handleAdd() {
      this.dialogType = '添加用户'
      this.dialogVisible = true
    },
    handleEdit({ row }) {
      getOneUsers(row.id)
        .then(res => {
          this.formQ = { ...res.data }
          this.$refs[this.formRef] && this.$refs[this.formRef].resetFields()
          this.dialogType = '编辑用户'
          this.dialogVisible = true
        })
    },
    handleAbout({ row }) {
      getOneUsers(row.id)
        .then(res => {
          this.formQ = { ...res.data }
          this.$refs[this.formRef] && this.$refs[this.formRef].resetFields()
          this.dialogType = '查看用户'
          this.dialogVisible = true
        })
    },
    handleDelete({ row }) {
      this.$confirm('确认删除?', '警告', {
        confirmButtonText: '确认',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          deleteUsers(row.id)
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
          saveUsers(this.formQ)
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
