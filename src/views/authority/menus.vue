<template>
  <div class="app-container">
    <el-button type="primary" @click="handleAddRole">新增菜单</el-button>
    <el-table
      v-loading="loading"
      style="width: 100%;margin-top:20px;"
      :data="routesData"
      border
      row-key="id"
      fit
      highlight-current-row
      :tree-props="{children: 'children', hasChildren: 'hasChildren'}"
    >
      <el-table-column label="名称" prop="title" width="150" />
      <el-table-column label="图标" prop="icon" width="120" />
      <el-table-column label="排序" prop="seq" width="50" align="center" />
      <el-table-column label="访问url路径" prop="path" width="220" />
      <el-table-column label="组件名称" prop="name" width="220" />
      <el-table-column label="组件路径" prop="component" />
      <el-table-column label="操作" align="center" width="150">
        <template slot-scope="scope">
          <el-button type="primary" size="small" @click="handleEdit(scope)">编辑</el-button>
          <el-button type="danger" size="small" :disabled="!!scope.row.children" @click="handleDelete(scope)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-dialog :visible.sync="dialogVisible" :title="dialogType" :before-close="handleClose">
      <el-form :ref="formRef" :model="role" :rules="rules" label-width="120px" label-position="right">
        <el-form-item label="菜单名称" prop="title">
          <el-input v-model="role.title" placeholder="菜单名称" style="width: 200px" />
        </el-form-item>
        <el-form-item label="菜单图标名称" prop="icon">
          <el-input v-model="role.icon" placeholder="菜单图标名称" style="width: 200px" />
        </el-form-item>
        <el-form-item label="菜单父级" prop="parentId">
          <SelectTree
            :props="props"
            :options="routesDataDb"
            :value="valueId"
            :clearable="isClearable"
            :accordion="isAccordion"
            @getValue="getValue($event)"
          />
        </el-form-item>
        <el-form-item label="排序" prop="seq">
          <el-input-number v-model="role.seq" controls-position="right" :min="1" :max="100" style="width: 200px" />
        </el-form-item>
        <el-form-item label="访问url路径" prop="path">
          <el-input v-model="role.path" placeholder="访问url路径" />
        </el-form-item>
        <el-form-item label="组件名称" prop="name">
          <el-input v-model="role.name" placeholder="组件名称" />
        </el-form-item>
        <el-form-item label="组件路径" prop="component">
          <el-input v-model="role.component" placeholder="组件路径" />
        </el-form-item>
      </el-form>
      <div style="text-align:right;">
        <el-button type="danger" @click="resetForm()">取消</el-button>
        <el-button type="primary" @click="confirmRole">保存</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { getMenus, saveMenus, deleteMenus } from '@/api/authority'
import SelectTree from '@/components/TreeSelect'
export default {
  name: 'Menus',
  components: {
    SelectTree
  },
  data() {
    return {
      isClearable: false, // 可清空（可选）
      isAccordion: true, // 可收起（可选）
      valueId: 9999, // 初始ID（可选）
      defValueId: 9999, // 初始ID原始值
      props: { // 配置项（必选）
        value: 'id',
        label: 'title',
        children: 'children'
      },
      /** **********************/
      loading: true,
      formRef: 'formRef',
      dialogVisible: false,
      dialogType: '',
      role: {
        name: '',
        parentId: '',
        title: '',
        icon: '',
        seq: 50,
        path: '',
        component: ''
      },
      rules: {
        name: [{ required: true }],
        title: [{ required: true }],
        path: [{ required: true }],
        component: [{ required: true }]
      },
      routesData: [],
      routesDataDb: []
    }
  },
  created() {
    this.getList()
    this.copyRoleDb()
  },
  methods: {
    getList() {
      getMenus()
        .then(res => {
          this.routesData = res.data
          this.loading = false
        })
    },
    handleAddRole() {
      this.role = Object.assign({}, this.roleDb)
      this.dialogType = '新增菜单'
      this.valueId = this.defValueId // 恢复默认值 9999 顶级菜单
      this.copyRoutesData()
      this.dialogVisible = true
    },
    handleDelete({ $index, row }) {
      this.$confirm('确认删除本菜单?', '警告', {
        confirmButtonText: '确认',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          deleteMenus(row.id)
            .then(res => {
              this.getList()
              this.$message.success(res.message)
            })
            .catch(err => {
              this.$message.err(err)
            })
        })
    },
    handleEdit(scope) {
      this.dialogType = '编辑菜单'
      this.dialogVisible = true
      this.$refs[this.formRef] && this.$refs[this.formRef].resetFields()
      this.copyRoutesData()
      if (!scope.row.parentId) scope.row.parentId = this.defValueId
      this.valueId = scope.row.parentId
      this.role = { ...scope.row }
    },
    resetForm() {
      this.$refs[this.formRef] && this.$refs[this.formRef].resetFields()
      this.dialogVisible = false
      this.role = { ...this.roleDb }
    },
    confirmRole() {
      if (this.valueId !== this.defValueId) {
        this.role.parentId = this.valueId
      } else {
        this.role.parentId = 0
      }
      this.$refs[this.formRef].validate((valid) => {
        if (valid) {
          saveMenus(this.role)
            .then(res => {
              this.resetForm()
              this.getList()
              this.$message.success(res.message)
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
    copyRoutesData() {
      this.routesDataDb = [{ id: this.defValueId, title: '顶级导航' }, ...this.routesData]
    },
    copyRoleDb() {
      this.roleDb = Object.assign({}, this.role)
    },
    getValue(value) {
      this.valueId = value
    },
    handleClose(done) {
      done()
      this.resetForm()
    }

  }
}
</script>
