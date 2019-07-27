<template>
  <div class="app-container">
    <div class="filter-container">
      <el-select
        v-model="form.factoryId"
        :placeholder="_getFieldName('factoryId','工厂')"
        :style="small"
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
        :disabled="!form.factoryId"
        clearable
        @change="handleWarehouseIdChange"
      >
        <el-option v-for="item in warehouseAll" :key="item.id + item.description" :label="item.code" :value="item.id">
          <span style="float: left">{{ item.code + '  ----  ' + item.description }}</span>
        </el-option>
      </el-select>
      <el-select
        v-model="form.warehouseAreaId"
        placeholder="库区"
        :style="small"
        :disabled="!form.warehouseId"
        clearable
      >
        <el-option v-for="item in warehouseAreaAll" :key="item.id" :label="item.code" :value="item.id">
          <span style="float: left">{{ item.code + '  ----  ' + item.description }}</span>
        </el-option>
      </el-select>
      <el-input
        v-model="form.description"
        placeholder="货位"
        :style="small"
        clearable
      />
      <el-button type="primary" icon="el-icon-search" @click="handleFilter">搜索</el-button>
      <el-button type="info" icon="el-icon-refresh" @click="handleRest">重置</el-button>
    </div>

    <el-button type="primary" @click="handleAdd">新增货位</el-button>

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
      <el-table-column label="仓库" prop="warehouseCode" width="90" />
      <el-table-column label="库区" min-width="160">
        <template slot-scope="scope">
          <span>{{ scope.row.warehouseAreaCode + '  ----  ' + scope.row.warehouseAreaDescription }}</span>
        </template>
      </el-table-column>

      <el-table-column label="货位" prop="description" min-width="120" />
      <el-table-column label="货位标签码" prop="tagNo" min-width="150" />
      <el-table-column label="默认车间领料货位" prop="inWorkshop" min-width="120">
        <template slot-scope="scope">
          <span>{{ scope.row.inWorkshop?'是':'' }}</span>
        </template>
      </el-table-column>
      <el-table-column label="冻结" prop="frozen" max-width="90">
        <template slot-scope="scope">
          <span>{{ scope.row.frozen?'是':'' }}</span>
        </template>
      </el-table-column>
      <el-table-column label="SAP库存地" prop="stockLocation" min-width="120" />
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
        <el-form-item label="货位" prop="description" :rules="[{ required: true }]">
          <el-input v-model="formQ.description" placeholder="输入货物" maxlength="20" />
        </el-form-item>

        <el-form-item label="SAP库存地" prop="stockLocation" :rules="[{ required: true }]">
          <el-input v-model="formQ.stockLocation" placeholder="输入货物" maxlength="4" minlength="4"/>
        </el-form-item>

        <el-form-item label="默认车间领料货位" prop="inWorkshop" :rules="[{ required: true }]">
          <el-radio v-model="formQ.inWorkshop" :label="true">是</el-radio>
          <el-radio v-model="formQ.inWorkshop" :label="false">否</el-radio>
        </el-form-item>


        <el-form-item label="冻结" prop="frozen" :rules="[{ required: true }]">
          <el-radio v-model="formQ.frozen" :label="true">是</el-radio>
          <el-radio v-model="formQ.frozen" :label="false">否</el-radio>
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
            @change="handleWarehouseIdChange"
          >
            <el-option v-for="item in warehouseAll" :key="item.id" :label="item.code" :value="item.id">
              <span style="float: left">{{ item.code + '  ----  ' + item.description }}</span>
            </el-option>
          </el-select>


        </el-form-item>

        <el-form-item label="库区" prop="warehouseAreaId" :rules="[{ required: true }]">
          <el-select
            v-model="formQ.warehouseAreaId"
            placeholder="库区"
            style="width: 100%"
            :disabled="!formQ.warehouseId"
            clearable
          >
            <el-option v-for="item in warehouseAreaAll" :key="item.id" :label="item.code" :value="item.id">
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

</template>

<script>
import formMixin from '@/views/mixin/BaseSearchForm'
import { getSpots, setSpots, deleteSpots } from '@/api/organization'
import { getWarehousesInfo, getWarehouseAreas } from '@/api/common'
import Pagination from '@/components/Pagination'
const defaultForm = {
  description: '',
  stockLocation: '',
  inWorkshop: '',
  frozen: '',
  factoryId: '',
  warehouseId: '',
  warehouseAreaId: '',
  remark: ''
}

export default {
  name: 'Spots',
  components: { Pagination },
  mixins: [formMixin],
  data() {
    return {
      formQ: Object.assign({}, defaultForm),
      form: {
        warehouseId: '',
        warehouseAreaId: '',
        description: ''
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
      warehouseAll: [], // 本页使用的 所有仓库
      warehouseAreaAll: [] // 本页使用的 所有库区
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
    // 给库区字段 进行赋值
    setWarehouseArea(data) {
      this.form.warehouseAreaId = ''
      this.warehouseAreaAll = data
    },
    handleChange(value) {
      this.form.warehouseId = ''
      this.formQ.warehouseId = ''
      this.form.warehouseAreaId = ''
      this.formQ.warehouseAreaId = ''
      const data = {
        factoryId: value
      }
      getWarehousesInfo(data)
        .then(res => {
          this.setWarehouse(res.data)
        })
    },
    handleWarehouseIdChange(value) {
      this.form.warehouseAreaId = ''
      this.formQ.warehouseAreaId = ''
      const data = {
        factoryId: value
      }
      getWarehouseAreas(data)
        .then(res => {
          this.setWarehouseArea(res.data)
        })
    },
    getList() {
      this.loading = true
      getSpots({ ...this.form, ...this.listQuery })
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
      getWarehousesInfo(row.factoryId)
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
    handleDelete({ row }) {
      this.$confirm('确认删除?', '警告', {
        confirmButtonText: '确认',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          deleteSpots(row.id)
            .then(res => {
              this.getList()
              this.$message.success(res.message)
            })
            .catch(err => {
              this.$message.err(err)
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
          setSpots(this.formQ)
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
