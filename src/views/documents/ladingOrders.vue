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
        :placeholder="_getFieldName('orderNo','提单号')"
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
      <el-date-picker
        v-model="form.queryDateStart"
        type="date"
        value-format="yyyy-MM-dd"
        :editable="false"
        :placeholder="_getFieldName('queryDateStart','计划出库日期起始')"
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
        <el-table-column label="提单" prop="orderNo" width="230" sortable="factoryCode">
          <template slot-scope="{row}">
            <span>{{ row.orderNo }} &nbsp;
              <el-button v-if="row.enabled" type="success" plain size="mini" style="min-width: 110px;" @click="handleHarvest(row)">{{ '手持可用' }}</el-button>
              <el-button v-else type="info" plain size="mini" @click="handleHarvest(row)">{{ '手持不可用' }}</el-button>
            </span>
          </template>
        </el-table-column>
        <el-table-column label="工厂" prop="factoryCode" align="center" width="100" sortable="orderNo" />
        <el-table-column label="库存地点" prop="stockLocation" align="center" width="80" />
        <el-table-column label="提单类型" prop="loType" width="80" />
        <el-table-column label="项目类型" prop="pstyv" align="center" width="80" />
        <el-table-column label="计划出库日期" prop="planShipDate" align="center" width="105" />
        <el-table-column label="物料编码" prop="materialCode" width="110" />
        <el-table-column label="物料名称" prop="materialName" :width="tdSize(5,11)">
          <template slot-scope="scope">
            <LongText :text="scope.row.materialName" />
          </template>
        </el-table-column>
        <el-table-column label="计划发货数量" prop="quantity" align="center" min-width="110" />
        <el-table-column label="已出库数量" prop="shippedQuantity" align="center" min-width="110" />
        <el-table-column label="单位" prop="unit" align="center" />
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
import { getLadingOrders, setLadingOrders } from '@/api/documents'
const defaultForm = {
  orderNo: '', // 提单号
  materialCode: '', // 物料编码
  materialName: '', // 物料名称
  queryDateStart: '', // 计划出库日期起始
  queryDateEnd: '' // 结束日期
}

export default {
  name: 'LadingOrders',
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
    this.getList(getLadingOrders)
  },
  methods: {
    handleHarvest(row) {
      this.$confirm('确认设置状态?', '警告', {
        confirmButtonText: '确认',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          setLadingOrders(row.id)
            .then(res => {
              this.getList(getLadingOrders)
              this.$message.success(res.message)
            })
        })
    }
  }
}
</script>
