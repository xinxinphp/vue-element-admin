<template>
  <div class="app-container">
    <el-button type="primary" @click="handleAddRole">添加角色</el-button>

    <el-table v-loading="loading" :data="rolesList" style="width: 100%;margin-top:30px;" border>
      <el-table-column align="center" label="角色描述" prop="description" width="180" />
      <el-table-column align="center" label="代码" prop="code" width="180" />
      <el-table-column align="center" label="创建者" prop="createdBy" width="180" />
      <el-table-column align="center" label="创建日期" prop="createdDate" width="180" />
      <el-table-column align="center" label="最后修改着" prop="lastModifiedBy" width="180" />
      <el-table-column align="center" label="最后修改时间" prop="lastModifiedDate" width="180" />
      <el-table-column align="center" label="操作">
        <template slot-scope="scope">
          <el-button type="primary" size="small" @click="handleEdit(scope)">编辑</el-button>
          <el-button type="danger" size="small" @click="handleDelete(scope)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <el-dialog :visible.sync="dialogVisible" :title="dialogType" :before-close="handleClose">
      <el-form :ref="formRef" :model="role" label-width="80px" label-position="left">
        <el-form-item label="角色名称" prop="description" :rules="[{ required: true }]">
          <el-input v-model="role.description" placeholder="角色描述" />
        </el-form-item>
        <el-form-item label="角色代码" prop="code" :rules="[{ required: true }]">
          <el-input v-model="role.code" placeholder="角色代码" />
        </el-form-item>

        <el-form-item label="菜单权限">
          <el-tree
            ref="tree"
            :check-strictly="checkStrictly"
            :data="routes"
            :props="defaultProps"
            show-checkbox
            default-expand-all
            node-key="id"
            :default-checked-keys="defaultCheckedKeys"
            class="permission-tree"
          />
        </el-form-item>
      </el-form>
      <div style="text-align:right;">
        <el-button type="danger" @click="resetForm">取消</el-button>
        <el-button type="primary" @click="confirmRole">保存</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { getMenus, getRoles, saveRoles, deleteRoles, getMenusRoleMenus } from '@/api/authority'

const defaultRole = {
  code: '',
  description: '',
  menuIds: []
}

export default {
  name: 'Roles',
  data() {
    return {
      role: Object.assign({}, defaultRole),
      loading: true,
      routes: [],
      rolesList: [],
      defaultCheckedKeys: [],
      dialogVisible: false,
      dialogType: 'new',
      formRef: 'formRef',
      checkStrictly: false,
      defaultProps: {
        children: 'children',
        label: 'title'
      }
    }
  },
  created() {
    this.getRoutes()
    this.getListMenus()
  },
  methods: {
    // 获取角色列表
    getRoutes() {
      this.loading = true
      getRoles()
        .then(res => {
          this.rolesList = res.data.list
          this.loading = false
        })
    },
    // 获取菜单
    getListMenus() {
      getMenus()
        .then(res => {
          this.routes = res.data
        })
    },
    // 点击 添加角色 按钮
    handleAddRole() {
      this.$refs[this.formRef] && this.$refs[this.formRef].resetFields()
      this.role = Object.assign({}, defaultRole)
      if (this.$refs.tree) {
        this.$refs.tree.setCheckedNodes([])
        this.defaultCheckedKeys = []
      }
      this.dialogType = '添加角色'
      this.dialogVisible = true
    },
    // 编辑角色
    handleEdit(scope) {
      this.$refs[this.formRef] && this.$refs[this.formRef].resetFields()
      getMenusRoleMenus(scope.row.id)
        .then(res => {
          this.dialogType = '角色编辑'
          this.role = Object.assign({}, scope.row)
          this.dialogVisible = true
          this.checkStrictly = true
          this.$nextTick(() => {
            this.checkStrictly = false
            if (this.$refs.tree) {
              this.$refs.tree.setCheckedNodes([])
              this.defaultCheckedKeys = [...res.data]
            }
          })
        })
        .catch(err => {
          this.$message.error(err)
        })
    },
    // 删除角色
    handleDelete({ $index, row }) {
      this.$confirm('确认删除?', '警告', {
        confirmButtonText: '确认',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          deleteRoles(row.id)
            .then(res => {
              this.getRoutes()
              this.$message.success(res.message)
            })
            .catch(err => {
              this.$message.error(err)
            })
        })
    },
    // 保存角色
    confirmRole() {
      const checkedKeys = this.$refs.tree.getCheckedKeys()
      const checkedHalfKeys = this.$refs.tree.getHalfCheckedKeys()
      this.role.menuIds = [...checkedKeys, ...checkedHalfKeys]
      this.$refs[this.formRef].validate((valid) => {
        if (valid) {
          saveRoles(this.role)
            .then(res => {
              this.$message.success(res.message)
              this.getRoutes()
              this.dialogVisible = false
              this.defaultCheckedKeys = []
            })
            .catch(err => {
              this.$message.error(err)
            })
        } else {
          return false
        }
      })
    },
    resetForm() {
      this.dialogVisible = false
      this.$refs[this.formRef] && this.$refs[this.formRef].resetFields()
    },
    handleClose(done) {
      done()
      this.resetForm()
    }
  }
}
</script>

<style lang="scss" scoped>
  .app-container {
    .roles-table {
      margin-top: 30px;
    }
    .permission-tree {
      margin-bottom: 30px;
    }
  }
</style>
