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
        v-model="form.arbpl"
        :placeholder="_getFieldName('arbpl','产线')"
        :style="small"
        clearable
        :disabled="!form.factoryId"
      >
        <el-option v-for="item in arbplAll" :key="item.id" :label="item.code" :value="item.code">
          <span style="float: left">{{ item.code + '  ----  ' + item.name }}</span>
        </el-option>
      </el-select>
      <el-date-picker
        v-model="form.queryDateStart"
        type="date"
        value-format="yyyy-MM-dd"
        :editable="false"
        :placeholder="_getFieldName('queryDateStart','生产日期开始')"
        :style="small"
      />
      <el-date-picker
        v-model="form.queryDateEnd"
        type="date"
        value-format="yyyy-MM-dd"
        :editable="false"
        :placeholder="_getFieldName('queryDateEnd','生产日期结束')"
        :style="small"
      />
      <el-input
        v-model="form.orderNo"
        placeholder="订单号"
        :style="small"
        clearable
      />
      <el-input
        v-model="form.cpMaterialName"
        placeholder="产品名称"
        :style="small"
        clearable
      />
      <el-button type="primary" icon="el-icon-search" @click="handleFilter">搜索</el-button>
      <el-button type="info" icon="el-icon-refresh" @click="handleRest">重置</el-button>
      <el-button :loading="downloadLoading" type="primary" icon="el-icon-download" @click="handleDownload">下载Excl</el-button>
    </div>

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
      <el-table-column label="工厂" prop="factoryCode" :width="tdSize(2,4,false)" />
      <el-table-column label="生产订单" prop="orderNo" :width="tdSize(2,7)" />
      <el-table-column label="产品编码" prop="cpMaterialCode" :width="tdSize(2,12,false)" />
      <el-table-column label="产品名称" prop="cpMaterialName" :width="tdSize(2,20,false)" />
      <el-table-column label="产品单位" prop="productUnit" width="90" />
      <el-table-column label="产量" prop="yield" :width="tdSize(5,6)" />
      <el-table-column label="产线" prop="arbpl" width="80" />
      <el-table-column label="物料编码" prop="zjMaterialCode" width="80" />
      <el-table-column label="物料名称" prop="zjMaterialName" :width="tdSize(5,35)" />
      <el-table-column label="批次" prop="batch" :width="tdSize(4,18,false)" />
      <el-table-column label="供应商" prop="vendorName" :width="tdSize(5,11)" />
      <el-table-column label="投料数量" prop="feedQuantity" width="110" />
      <el-table-column label="最后投料时间" prop="lastFeedDate" width="110" />
      <el-table-column label="退料数量" prop="returnQuantity" width="110" />
      <el-table-column label="SAP基本单位" prop="sapUnit" width="110" />
    </el-table>
    <pagination
      :total="total"
      :page.sync="listQuery.page"
      :limit.sync="listQuery.limit"
      @pagination="getList(done)"
    />
  </div>

</template>

<script>
import formMixin from '@/views/mixin/BaseSearchForm'
import { getProductionOrderFeedThroat } from '@/api/report'
import { getProductionOrderFeedThroatExport } from '@/api/export'
import { getProductionLinesAll } from '@/api/organization'
import { getTime } from '@/utils'
import Pagination from '@/components/Pagination'
const defaultForm = {
  factoryId: '', // 工厂
  arbpl: '',
  queryDateStart: '',
  queryDateEnd: '',
  orderNo: '',
  cpMaterialName: ''
}

export default {
  name: 'OrderFeeding',
  components: { Pagination },
  mixins: [formMixin],
  data() {
    return {
      form: Object.assign({}, defaultForm),
      loading: true,
      tableKey: 0,
      total: 1,
      listQuery: {
        orderBy: ''// 升序:code 降序: code desc
      },
      downloadLoading: false,
      arbplAll: []
    }
  },
  computed: {
  },
  created() {
    this.getList(getProductionOrderFeedThroat)
  },
  methods: {
    handleRest(done) {
      this.initForm()
      this.listQuery.page = 1
      this.listQuery.orderBy = ''
      this.getList(this.done)
    },
    handleChange() {
      this.form.arbpl = ''
      this.getArbplAlll()
    },
    // 获取当前工厂的产线
    getArbplAlll() {
      const data = {
        factoryId: this.form.factoryId
      }
      getProductionLinesAll(data)
        .then(res => {
          this.arbplAll = res.data
        })
    },
    handleDownload() {
      const getDownFn = getProductionOrderFeedThroatExport
      this.downloadLoading = true
      const fileDownload = require('js-file-download')
      getDownFn(this.form)
        .then(res => {
          fileDownload(res.data, `订单投料批次报表${getTime('start')}.xlsx`)
          this.downloadLoading = false
        })
    }
  }
}
</script>
