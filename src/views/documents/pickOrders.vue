<template>
  <div>
    <sticky :z-index="1" class-name="sub-navbar-purchase-order">
      <el-select
        v-model="form.factoryId"
        :placeholder="_getFieldName('factoryId','工厂')"
        :style="mini"
        class="filter-item"
        clearable
      >
        <el-option v-for="item in factoryIds" :key="item.id + item.name" :label="item.code" :value="item.id">
          <span style="float: left">{{ item.code + '  ----  ' + item.name }}</span>
        </el-option>
      </el-select>
      <el-input
        v-model="form.orderNo"
        :placeholder="_getFieldName('orderNo','领料单号')"
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
      <el-dropdown trigger="click" :hide-on-click="false">
        <el-button>
          更多<i class="el-icon-caret-bottom el-icon--right" />
        </el-button>
        <el-dropdown-menu slot="dropdown" class="app-container">
          <el-date-picker
            v-model="form.bedat"
            type="date"
            value-format="yyyy-MM-dd"
            :editable="false"
            :placeholder="_getFieldName('bedat','计划领料日期')"
            :style="small"
          />
          <el-date-picker
            v-model="form.apdat"
            type="date"
            value-format="yyyy-MM-dd"
            :editable="false"
            :placeholder="_getFieldName('apdat','创建日期')"
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
        height="500"
        highlight-current-row
        style="width: 100%;"
        @sort-change="sortChange"
      >
        <el-table-column label="领料单号" prop="orderNo" width="230" sortable="factoryCode">
          <template slot-scope="{row}">
            <span>{{ row.orderNo }} &nbsp;
              <el-button v-if="row.enabled" type="success" plain style="min-width: 110px;" @click="handleHarvest(row)">{{ '手持可用' }}</el-button>
              <el-button v-else type="info" plain @click="handleHarvest(row)">{{ '手持不可用' }}</el-button>
            </span>
          </template>
        </el-table-column>
        <el-table-column label="工厂" prop="factoryCode" align="center" width="100" sortable="orderNo" />
        <el-table-column label="库存地点" prop="stockLocation" align="center" width="80" />
        <el-table-column label="创建人" prop="applicant" align="center" width="90" />
        <el-table-column label="创建日期" prop="apdat" align="center" width="90" />
        <el-table-column label="备注" prop="txzhd" align="center" min-width="210" />
        <el-table-column label="部门" prop="deptDesc" align="center" width="110" />
        <el-table-column label="业务选择" prop="bstypTxt" align="center" width="110" />
        <el-table-column label="成本中心" prop="costCenter" align="center" width="110" />
        <el-table-column label="移动类型" prop="moveType" align="center" width="80" />
        <el-table-column label="计划领料日期" prop="bedat" align="center" width="120" />
        <el-table-column label="物料编码" prop="materialCode" align="center" width="120" />
        <el-table-column label="物料名称" prop="materialName" align="center" width="120" />
        <el-table-column label="计划领料数量" prop="quantity" align="center" width="120" />
        <el-table-column label="单位" prop="unit" align="center" width="80" />
        <el-table-column label="实际领料数量" prop="shippedQuantity" align="center" min-width="120" />
      </el-table>

      <pagination
        :total="total"
        :page.sync="listQuery.page"
        :limit.sync="listQuery.limit"
        @pagination="getList(done)"
      />

    </div>
  </div>
</template>

<script>

import Sticky from '@/components/Sticky'
import Pagination from '@/components/Pagination'
import formMixin from '@/views/mixin/BaseSearchForm'
import { parseTime } from '@/utils'
import { getPickOrders, setPickOrders } from '@/api/documents'
const defaultForm = {
  bedat: '', // 计划领料日期
  orderNo: '', // 领料单号
  materialCode: '', // 物料编码
  materialName: '', // 物料名称
  apdat: ''// 创建日期
}

export default {
  name: 'PickOrders',
  components: { Pagination, Sticky },
  mixins: [formMixin],
  data() {
    return {
      defaultForm: defaultForm,
      form: Object.assign({}, defaultForm),
      tableKey: 0,
      list: null,
      total: 0,
      loading: true,
      downloadLoading: false
      /** ***以下 本页面特用 字段 *****/
      /** ***end 字段 *****/
    }
  },
  created() { //
    this.getList(getPickOrders)
  },
  methods: {
    handleHarvest(row) {
      this.$confirm('确认设置状态?', '警告', {
        confirmButtonText: '确认',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          setPickOrders(row.id)
            .then(res => {
              this.getList(getPickOrders)
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
