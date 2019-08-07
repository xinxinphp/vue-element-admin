<template>
  <div>
    <sticky :z-index="1" class-name="sub-navbar-purchase-order">
      <el-select
        v-model="form.factoryId"
        :placeholder="_getFieldName('factoryId','工厂')"
        :style="mini"
        clearable
      >
        <el-option v-for="item in factoryIds" :key="item.id + item.name" :label="item.code" :value="item.id">
          <span style="float: left">{{ item.code + '  ----  ' + item.name }}</span>
        </el-option>
      </el-select>
      <el-select
        v-model="form.poNo"
        :placeholder="_getFieldName('poNo','打码方式')"
        :style="small"
        clearable
      >
        <el-option label="订单" value="1" />
        <el-option label="无订单" value="2" />
      </el-select>
      <el-input
        v-model="form.tagNo"
        :placeholder="_getFieldName('tagNo','标签码')"
        :style="small"
        clearable
      />
      <el-input
        v-model="form.materialCode"
        :placeholder="_getFieldName('materialCode','物料编码')"
        :style="small"
        clearable
      />
      <el-select
        v-model="form.notZero"
        :placeholder="_getFieldName('notZero','数量非0')"
        :style="small"
        clearable
      >
        <el-option label="数量为0" :value="true" />
        <el-option label="数量非0" :value="false" />
      </el-select>
      <el-select
        v-model="form.frozen"
        :placeholder="_getFieldName('frozen','冻结')"
        :style="small"
        clearable
      >
        <el-option label="冻结" :value="true" />
        <el-option label="未冻结" :value="false" />
      </el-select>
      <el-dropdown trigger="click" :hide-on-click="false">
        <el-button plain>
          更多<i class="el-icon-caret-bottom el-icon--right" />
        </el-button>
        <el-dropdown-menu slot="dropdown" class="app-container">
          <el-date-picker
            v-model="form.queryDateStart"
            type="date"
            value-format="yyyy-MM-dd"
            :editable="false"
            :placeholder="_getFieldName('queryDateStart','开始日期')"
            :style="small"
          />
          <el-date-picker
            v-model="form.queryDateEnd"
            type="date"
            value-format="yyyy-MM-dd"
            :editable="false"
            :placeholder="_getFieldName('queryDateEnd','结束日期')"
            :style="small"
          />
          <el-button :loading="downloadLoading" class="filter-item" type="primary" icon="el-icon-download" @click="handleDownload">下载Excl</el-button>
        </el-dropdown-menu>
      </el-dropdown>
      <el-button class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter">搜索</el-button>
      <el-button class="filter-item" type="info" icon="el-icon-refresh" @click="handleRest">重置</el-button>

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
        <el-table-column label="打码方式" prop="printType" align="center" width="80" />
        <el-table-column label="工厂" prop="factoryCode" align="center" :width="tdSize(2,4,false)" />
        <el-table-column label="标签码" prop="tagNo" align="center" :width="tdSize(3,20,false)" />
        <el-table-column label="物料编码" prop="materialCode" align="center" :width="tdSize(5,12,false)" />
        <el-table-column label="物料名称" prop="materialName" align="center" :width="tdSize(5,11)">
          <template slot-scope="scope">
            <LongText :text="scope.row.materialName" />
          </template>
        </el-table-column>
        <el-table-column label="数量" prop="quantity" align="center" width="70" />
        <el-table-column label="SAP基本单位" prop="unit" align="center" width="120" />
        <el-table-column label="版本号" prop="version" align="center" width="100" />
        <el-table-column label="作废" prop="disabled" align="center" width="100" />
        <el-table-column label="冻结" prop="frozen" align="center" width="100" />
        <el-table-column label="型号" prop="type" align="center" width="100" />
        <el-table-column label="SAP批次" prop="batch" align="center" width="100" />
        <el-table-column label="供应商" prop="type" align="center" width="100" />
        <el-table-column label="供应商名称" prop="vendorName" :width="tdSize(5,11)">
          <template slot-scope="scope">
            <LongText :text="scope.row.vendorName" />
          </template>
        </el-table-column>
        <el-table-column label="生产日期" prop="productionDate" width="95" />
        <el-table-column label="到厂日期" prop="factoryDate" width="95" />
        <el-table-column label="采购订单" prop="poNo" align="center" width="100" />
        <el-table-column label="行项目" prop="poiNo" width="70" />
        <el-table-column label="收货人" prop="receiptBy" width="100" />
        <el-table-column label="收货单" prop="roNo" width="100" />
        <el-table-column label="收货时间" prop="receiptTime" width="100" />
        <el-table-column label="货位" prop="spotDescription" width="100" />
        <el-table-column label="创建人" prop="createdBy" width="100" />
        <el-table-column label="创建时间" prop="createdDate" width="100" />
        <el-table-column label="打印序列" align="center" width="80">
          <template slot-scope="{row}">
            <el-input v-if="row.edit" v-model="row.spotDescription" class="edit-input" size="small" />
            <span v-else>{{ row.printSeq + ' / '+row.ordinal + ' / '+row.totalPrintNum }}</span>
          </template>
        </el-table-column>
      </el-table>

      <pagination
        :total="total"
        :page.sync="listQuery.page"
        :limit.sync="listQuery.limit"
        @pagination="getList(done)"
      />

      <el-dialog :visible.sync="dialogVisibleDownload" title="请先下载驱动" top="30vh">
        <el-link href="./../../assets/CLodop_Setup_for_Win32NT.exe" target="_blank" type="primary">点击下载</el-link>
        <div style="text-align:right;">
          <el-button type="danger" @click="dialogVisibleDownload= false">取消</el-button>
        </div>
      </el-dialog>

    </div>
  </div>
</template>

<script>

import Sticky from '@/components/Sticky'
import Pagination from '@/components/Pagination'
import formMixin from '@/views/mixin/BaseSearchForm'
import { parseTime } from '@/utils'
// import abcMixin from './abcMixin'
import { getItems, getReprint, setDisable } from '@/api/print'

const defaultForm = {
  factoryId: '', // 工厂
  printType: '', // 打码方式
  tagNo: '', // 标签码
  materialCode: '', // 物料编码
  notZero: '', // 数量非0
  frozen: ''// 冻结
}

export default {
  name: 'LabelQuery',
  components: { Pagination, Sticky },
  mixins: [formMixin],
  data() {
    return {
      defaultForm: defaultForm,
      tableKey: 0,
      list: null,
      total: 0,
      loading: true,
      downloadLoading: false,
      /** ***一下打印*****/
      form: Object.assign({}, defaultForm),
      /** ***一下打印*****/
      dialogVisibleDownload: false
    }
  },
  created() {
    this.getList(getItems)
  },
  methods: {
    handlePrint({ row }) {
      const initPrintStatus = this.initPrint()
      if (initPrintStatus) {
        getReprint(row.id)
          .then(res => {
            const data = {
              data: {
                tagList: [{
                  tagNo: row.tagNo,
                  ordinal: row.ordinal
                }],
                commonInfo: {
                  printSeq: row.printSeq,
                  totalPrintNum: row.totalPrintNum,
                  displayQuantity: res.data.displayQuantity,
                  factoryName: res.data.factoryName
                }
              },
              form: {
                materialName: row.materialName,
                internalShortCode: row.internalShortCode,
                materialCode: row.materialCode,
                materialBrand: row.materialBrand,
                materialCategory: row.materialCategory,
                version: row.version,
                productionDate: row.productionDate,
                factoryDate: row.factoryDate,
                vendorName: row.vendorName
              }
            }
            this.startPrint(data)
          })
          .catch(err => {
            this.$message.error(JSON.stringify(err))
          })
      } else {
        this.dialogVisibleDownload = true
      }
    },
    setDisable({ row }) {
      this.$confirm('确认作废?', '警告', {
        confirmButtonText: '确认',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          setDisable(row.id)
            .then(res => {
              this.getList(getItems)
              this.$message.success(res.message)
            })
            .catch(err => {
              this.$message.error(err)
            })
        })
    },
    handleDownload() {
      this.downloadLoading = true
      import('@/vendor/Export2Excel').then(excel => {
        const tHeader = ['timestamp', 'title', 'type', 'importance', 'status']
        const filterVal = ['timestamp', 'title', 'type', 'importance', 'status']
        const data = this.formatJson(filterVal, this.list)
        excel.export_json_to_excel({
          header: tHeader,
          data,
          filename: 'table-list'
        })
        this.downloadLoading = false
      })
    },
    formatJson(filterVal, jsonData) {
      return jsonData.map(v => filterVal.map(j => {
        if (j === 'timestamp') {
          return parseTime(v[j])
        } else {
          return v[j]
        }
      }))
    }
  }
}
</script>
