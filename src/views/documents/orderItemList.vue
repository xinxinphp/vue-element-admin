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
        :placeholder="_getFieldName('orderNo','生产订单号')"
        :style="small"
        class="filter-item"
        clearable
      />
      <el-input
        v-model="form.arbpl"
        :placeholder="_getFieldName('arbpl','产线代码')"
        :style="small"
        class="filter-item"
        clearable
      />
      <el-input
        v-model="form.crtxt"
        :placeholder="_getFieldName('crtxt','产线名称')"
        :style="small"
        class="filter-item"
        clearable
      />
      <el-input
        v-model="form.plnbez"
        :placeholder="_getFieldName('plnbez','产品编码')"
        :style="small"
        class="filter-item"
        clearable
      />
      <el-input
        v-model="form.productMaterialName"
        :placeholder="_getFieldName('productMaterialName','产品名称')"
        :style="medium"
        class="filter-item"
        clearable
      />
      <el-dropdown trigger="click" :hide-on-click="false">
        <el-button>
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
        <el-table-column label="工厂" prop="factoryCode" align="center" width="80" sortable="factoryCode" />
        <el-table-column label="生产订单" prop="orderNo" align="center" width="120" sortable="orderNo" />
        <el-table-column label="产线代码" prop="arbpl" align="center" width="120" />
        <el-table-column label="产线名称" prop="crtxt" width="160" />
        <el-table-column label="计划开始日期" prop="gstrp" align="center" width="120" />
        <el-table-column label="产品编码" prop="plnbez" align="center" width="120" />
        <el-table-column label="产品名称" prop="productMaterialName" :width="tdSize(5,11)">
          <template slot-scope="scope">
            <LongText :text="scope.row.productMaterialName"></LongText>
          </template>
        </el-table-column>
        <el-table-column label="订单数量" prop="productQuantity" align="center" width="80" />
        <el-table-column label="订单单位" prop="productUnit" align="center" width="80" />
        <el-table-column label="订单状态" prop="states" align="center" width="300">
          <template slot-scope="scope">
            {{ scope.row.states }}
          </template>
        </el-table-column>
        <el-table-column label="组件编码" prop="materialCode" align="center" width="100" />
        <el-table-column label="组件名称" prop="materialName" :width="tdSize(5,11)">
          <template slot-scope="scope">
            <LongText :text="scope.row.materialName"></LongText>
          </template>
        </el-table-column>
        <el-table-column label="数量" prop="quantity" align="center" width="80" />
        <el-table-column label="单位" prop="unit" align="center" min-width="80" />
        <el-table-column label="预留号" prop="rsnum" align="center" width="100" />
        <el-table-column label="预留行项目" prop="orderItemNo" align="center" width="100" />
        <el-table-column label="删除标记" prop="sapDeleted" align="center" width="80">
          <template slot-scope="scope">
            <span>{{ scope.row.sapDeleted ? '删除': '' }}</span>
          </template>
        </el-table-column>
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
import { getProductionOrdersOrderItemList } from '@/api/documents'
const defaultForm = {
  orderNo: '', // 生产订单号
  arbpl: '', // 产线代码
  crtxt: '', // 产线名称
  plnbez: '', // 产品编码
  productMaterialName: '' // 产品名称
}

export default {
  name: 'ProductionOrdersOrderItemList',
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
      downloadLoading: false,
      /** ***以下 本页面特用 字段 *****/
      states: {
        I0076: '标记删除标记',
        I0045: 'TECO技术性完成',
        I0046: 'CLSD已关闭',
        I0115: 'CSER 成本计算错误',
        I0013: 'DEL删除',
        I0043: 'LKD已锁定'
      }
      /** ***end 字段 *****/

    }
  },
  computed: {
  },
  created() {
    this.getList(getProductionOrdersOrderItemList)
    // console.log(window.innerHeight)
  },
  methods: {
    statesed(states) {
      return states.split(',')
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
