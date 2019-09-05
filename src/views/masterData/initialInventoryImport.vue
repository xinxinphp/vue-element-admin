<template>
  <div class="app-container">
    <el-button type="primary" @click="handleInSetExcel">Excel导入</el-button>

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

</template>

<script>
import formMixin from '@/views/mixin/BaseSearchForm'
import { getToken } from '@/utils/auth'
import { getSpots, setSpots, deleteSpots, getProductionLinesAll } from '@/api/organization'
import { getMaterialCategory } from '@/api/masterData'
import { getWarehousesInfo, getWarehouseAreas, setItemsImportFromExcel } from '@/api/common'
const defaultForm = {
  description: '',
  stockLocation: '',
  inWorkshop: false,
  frozen: false,
  feedingSpot: false,
  productionLineCode: '',
  materialCategoryList: [],
  factoryId: '',
  warehouseId: '',
  warehouseAreaId: '',
  remark: ''
}

export default {
  name: 'InitialInventoryImport',
  mixins: [formMixin],
  data() {
    return {
      formQ: Object.assign({}, defaultForm),
      form: {
        productionLineCode: '',
        warehouseId: '',
        warehouseAreaId: '',
        description: ''
      },
      roleIds: [],
      tableData: [],
      loading: true,
      downloadLoading: false,
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
      warehouseAreaAll: [], // 本页使用的 所有库区
      productionLineAll: [],
      materialCategoryAll: [], // 物料类别
      dialogVisibleUpFile: false,
      headers: { Authorization: `Bearer ${getToken()}` },
      fileList: [] // 上传文件列表
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
        warehouseId: value
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
      this.dialogType = '添加货位'
      this.dialogVisible = true
    },
    handleEdit({ row }) {
      getMaterialCategory().then(res => {
        this.materialCategoryAll = res.data
      })
      getWarehousesInfo({ factoryId: row.factoryId })
        .then(res => {
          getWarehouseAreas({ warehouseId: row.warehouseId })
            .then(ref => {
              this.formQ = { ...row, materialCategoryList: row.materialCategoryList }
              this.setWarehouse(res.data)
              this.setWarehouseArea(ref.data)
              delete this.formQ.createdDate
              delete this.formQ.lastModifiedDate
              this.$refs[this.formRef] && this.$refs[this.formRef].resetFields()
              this.dialogType = '编辑'
              this.dialogVisible = true
            })
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
    },
    onFeedingSpotYes(value) {
      if (value === true) {
        this.formQ.inWorkshop = false
        getProductionLinesAll().then(res => {
          this.productionLineAll = res.data
        })
        getMaterialCategory().then(res => {
          this.materialCategoryAll = res.data
        })
      }
    },
    onFeedingSpotNo(value) {
      if (value === false) {
        this.materialCategoryAll = []
        this.productionLineAll = []
        this.formQ.materialCategoryList = []
        this.formQ.productionLineCode = ''
      }
    },
    onInWorkshopYes(value) {
      if (value === true) {
        this.formQ.feedingSpot = false
        this.formQ.materialCategoryList = []
        this.formQ.productionLineCode = ''
      }
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
      setItemsImportFromExcel(formData)
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
