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
        v-model="form.crtxt"
        :placeholder="_getFieldName('crtxt','产线名称')"
        :style="small"
        class="filter-item"
        clearable
      />
      <el-date-picker
        v-model="form.queryDateStart"
        type="date"
        value-format="yyyy-MM-dd"
        :editable="false"
        :placeholder="_getFieldName('queryDateStart','生产日期')"
        :style="small"
      />
      <el-input
        v-model="form.plnbez"
        :placeholder="_getFieldName('plnbez','产品编码')"
        :style="small"
        class="filter-item"
        clearable
      />
      <el-input
        v-model="form.productName"
        value-format="yyyy-MM-dd"
        :placeholder="_getFieldName('productName','产品名称')"
        :style="small"
      />
      <el-input
        v-model="form.internalShortCode"
        value-format="yyyy-MM-dd"
        :placeholder="_getFieldName('internalShortCode','产品简码')"
        :style="small"
        clearable
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
        <el-table-column label="工厂" prop="factoryCode" :width="tdSize(2,4,false)" />
        <el-table-column label="计划开始日期" prop="queryDateStart" align="center" width="110" />
        <el-table-column label="产品编码" prop="plnbez" align="center" width="120" />
        <el-table-column label="产品名称" prop="productName" width="360" />
        <el-table-column label="白班产量" prop="dayYield" align="center" width="110">
          <template slot-scope="{row}">
            <el-input v-if="row.edit" v-model="row.dayYield" class="edit-input" size="small" />
            <span v-else>{{ row.dayYield }}</span>
          </template>
        </el-table-column>
        <el-table-column label="夜班产量" prop="nightYield" align="center" width="110">
          <template slot-scope="{row}">
            <el-input v-if="row.edit" v-model="row.nightYield" class="edit-input" size="small" />
            <span v-else>{{ row.nightYield }}</span>
          </template>
        </el-table-column>
        <el-table-column label="留样数量" prop="sampleQuantity" align="center" width="110">
          <template slot-scope="{row}">
            <el-input v-if="row.edit" v-model="row.sampleQuantity" class="edit-input" size="small" />
            <span v-else>{{ row.sampleQuantity }}</span>
          </template>
        </el-table-column>
        <el-table-column label="操作" align="center" width="100">
          <template slot-scope="{row}">
            <el-button
              v-if="row.edit"
              type="success"
              size="mini"
              icon="el-icon-circle-check-outline"
              @click="confirmEdit(row)"
            >
              保存
            </el-button>
            <el-button
              v-else
              type="primary"
              size="mini"
              icon="el-icon-edit"
              @click="row.edit=!row.edit"
            >
              编辑
            </el-button>

          </template>
        </el-table-column>
        <el-table-column label="生产订单" prop="orderNo" align="center" width="120" />
        <el-table-column label="产品简码" prop="internalShortCode" align="center" width="80" />
        <el-table-column label="产品单位" prop="productUnit" align="center" width="80" />
        <el-table-column label="产线名称" prop="crtxt" width="210" />
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
import { getProductionOrders, setProductionOrdersInputYield } from '@/api/workshop'
import { parseTime } from '@/utils'
const defaultForm = {
  crtxt: '', // 产线
  queryDateStart: '', // 生产日期
  plnbez: '', // 产品编码
  productName: '', // 产品名称
  internalShortCode: '' // 产品简码
}

export default {
  name: 'ProductionOrders',
  components: { Pagination, Sticky },
  mixins: [formMixin],
  data() {
    return {
      defaultForm: defaultForm,
      form: Object.assign({}, defaultForm),
      tableKey: 0,
      list: null,
      total: 0,
      loading: true
      /** ***以下 本页面特用 字段 *****/
      /** ***end 字段 *****/
    }
  },
  created() { //
    this.getList(getProductionOrders)
    this.initGstrp()
  },
  methods: {
    // "默认规则 :每天9点前之前，系统日期前一天. 9点之后， 默认系统日期."
    initGstrp() {
      const newTime = parseTime(new Date(), '{h}')
      const now = new Date()
      const date = now.setDate(now.getDate() - 1)
      newTime < 9
        ? this.form.queryDateStart = parseTime(date, '{y}-{m}-{d}')
        : this.form.queryDateStart = parseTime(new Date(), '{y}-{m}-{d}')
    },
    confirmEdit(row) {
      const data = {
        'id': row.id, // itemID
        'dayYield': row.dayYield,
        'nightYield': row.nightYield,
        'sampleQuantity': row.sampleQuantity
      }
      setProductionOrdersInputYield(data)
        .then(res => {
          row.edit = false
          this.$message.success(res.message)
          return 'OK'
        })
        .catch(err => {
          row.edit = false
          this.$message.error(err)
        })
        .then(res => {
          this.getList(this.done)
        })
    }
  }
}
</script>
