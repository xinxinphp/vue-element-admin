<template>
  <div>
    <sticky :z-index="10" class-name="sub-navbar-purchase-order">
      <el-select
        v-model="form.factoryId"
        :placeholder="_getFieldName('factoryId','工厂')"
        :style="mini"
        class="filter-item"
        clearable
      >
        <el-option key="1" label="名称1" value="1" />
        <el-option key="2" label="名称2" value="2" />
      </el-select>
      <el-date-picker
        v-model="form.sapCreatedDate"
        type="date"
        :placeholder="_getFieldName('sapCreatedDate','创建日期')"
        :style="small"
      />
      <el-input
        v-model="form.orderNo"
        :placeholder="_getFieldName('orderNo','订单号')"
        :style="small"
        class="filter-item"
        clearable
      />
      <el-input
        v-model="form.materialCode"
        :placeholder="_getFieldName('materialCode','物料编码')"
        :style="small"
        class="filter-item"
        clearable
      />
      <el-input
        v-model="form.materialName"
        :placeholder="_getFieldName('materialName','物料名称')"
        :style="small"
        class="filter-item"
        clearable
      />
      <el-input
        v-model="form.vendorCode"
        :placeholder="_getFieldName('vendorCode','供应商')"
        :style="small"
        class="filter-item"
        clearable
      />
      <el-input
        v-model="form.vendorName"
        :placeholder="_getFieldName('vendorName','供应商名称')"
        :style="medium"
        class="filter-item"
        clearable
      />
      <el-dropdown trigger="click">
        <el-button plain>
          更多<i class="el-icon-caret-bottom el-icon--right" />
        </el-button>
        <el-dropdown-menu slot="dropdown" class="app-container">
          <el-input
            v-model="form.createdBy"
            :placeholder="_getFieldName('createdBy','创建人')"
            :style="medium"
            class="filter-item"
            clearable
          />
          <el-select
            v-model="form.retPo"
            :placeholder="_getFieldName('retPo','退货标记')"
            :style="medium"
            class="filter-item"
            clearable
          >
            <el-option key="12" :label="1" value="it1em" />
          </el-select>
          <el-button :loading="downloadLoading" class="filter-item" type="primary" icon="el-icon-download" @click="handleDownload">下载Excl</el-button>

        </el-dropdown-menu>
      </el-dropdown>

      <el-button class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter">搜索</el-button>
      <el-button class="filter-item" type="info" icon="el-icon-refresh" @click="handleRest">重置</el-button>

    </sticky>

    <div v-loading="listLoading" class="app-container">
<!--
      <div class="filter-container">
        <el-checkbox v-model="showReviewer" class="filter-item" @change="tableKey=tableKey+1">隐藏1</el-checkbox>
      </div>
-->
      <el-table
        :key="tableKey"
        :data="list"
        border
        fit
        highlight-current-row
        style="width: 100%;"
        @sort-change="sortChange"
      >
        <el-table-column label="工厂" prop="factoryCode" align="center" width="80"></el-table-column>
        <el-table-column label="订单号" prop="orderNo" align="center" width="120" ></el-table-column>
        <el-table-column label="供应商" prop="vendorCode" align="center" width="120" ></el-table-column>
        <el-table-column label="供应商名称" prop="vendorName" align="center" min-width="220" ></el-table-column>
        <el-table-column label="创建日期" prop="sapCreatedDate" align="center" width="120" ></el-table-column>
        <el-table-column label="交货日期" prop="plannedDeliveryDate" align="center" width="120" ></el-table-column>
        <el-table-column label="退货标记" prop="retPo" align="center" width="120" ></el-table-column>
        <el-table-column label="删除标记" prop="sapDeleted" align="center" width="120" ></el-table-column>
        <el-table-column label="是否寄售" prop="pstyp" align="center" width="120" ></el-table-column>
        <el-table-column label="库存地点" prop="stockLocation" align="center" width="120" ></el-table-column>
        <el-table-column label="物料编码" prop="materialCode" align="center" width="120" ></el-table-column>
        <el-table-column label="物料名称" prop="materialName" align="center" min-width="320"></el-table-column>
        <el-table-column label="订单数量" prop="quantity" align="center" width="120" ></el-table-column>
        <el-table-column label="订单单位" prop="unit" align="center" width="80" ></el-table-column>
        <el-table-column label="已入库数量" prop="processedQuantity" align="center" width="120" ></el-table-column>
        <el-table-column label="收货标记" prop="elikz" align="center" width="80" ></el-table-column>
      </el-table>

      <pagination
        v-show="total>0"
        :total="total"
        :page.sync="listQuery.page"
        :limit.sync="listQuery.limit"
        @pagination="getList"
      />

    </div>
  </div>
</template>

<script>
import { fetchList } from '@/api/article'
import { parseTime } from '@/utils'
import Sticky from '@/components/Sticky'
import Pagination from '@/components/Pagination'
import formMixin from '@/views/mixin/BaseSearchForm'

export default {
  name: 'PrintingWithoutOrder',
  components: { Pagination, Sticky },
  mixins: [formMixin],
  data() {
    return {
      tableKey: 0,
      list: null,
      total: 0,
      listLoading: true,
      downloadLoading: false
    }
  },
  created() {
    this.getList()
  },
  methods: {
    getList() {
      this.listLoading = true
    },
    handleRest() {
      this._mixinReset()
    },
    sortChange(data) {
      const { prop, order } = data
      if (prop === 'id') {
        this.sortByID(order)
      }
    },
    sortByID(order) {
      if (order === 'ascending') {
        this.listQuery.sort = '+id'
      } else {
        this.listQuery.sort = '-id'
      }
      this.handleFilter()
    },
    handleFilter() {
      this.listQuery.page = 1
      this.getList()
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
<style scoped>
  .el-popper[x-placement^="bottom"] {
    margin-top: 0;
  }
</style>
