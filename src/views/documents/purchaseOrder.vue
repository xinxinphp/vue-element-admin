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
            <el-option label="是" :value="true" />
            <el-option label="否" :value="false" />
          </el-select>
          <el-button :loading="downloadLoading" class="filter-item" type="primary" icon="el-icon-download" @click="handleDownload">下载Excl</el-button>

        </el-dropdown-menu>
      </el-dropdown>

      <el-button class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter">搜索</el-button>
      <el-button class="filter-item" type="info" icon="el-icon-refresh" @click="handleRest">重置</el-button>

    </sticky>

    <div v-loading="loading" class="app-container">
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
        :height="fixHeight"
        highlight-current-row
        style="width: 100%;"
        @sort-change="sortChange"
      >
        <el-table-column label="工厂" prop="factoryCode" align="center" :width="tdSize(2,4,false,true)" sortable="factoryCode" />
        <el-table-column label="订单号" prop="orderNo" align="center" :width="tdSize(3,10,false,true)"  sortable="orderNo" />
        <el-table-column label="物料编码" prop="materialCode" align="center" :width="tdSize(3,12,false)" />
        <el-table-column label="物料名称" prop="materialName" min-width="180">
          <template slot-scope="scope">
            <LongText :text="scope.row.materialName"></LongText>
          </template>
        </el-table-column>

        <el-table-column label="订单数量" prop="quantity" :width="tdSize(4,7,false)" />

        <el-table-column label="订单单位" prop="unit" align="center" :width="tdSize(4,4,false)" />
        <el-table-column label="供应商" prop="vendorCode" align="center" :width="tdSize(4,10,false)" />
        <el-table-column label="供应商名称" prop="vendorName" :width="tdSize(5,11)">
          <template slot-scope="scope">
            <LongText :text="scope.row.vendorName"></LongText>
          </template>
        </el-table-column>
        <el-table-column label="创建日期" prop="sapCreatedDate" align="center" :width="tdSize(4,8,false)" />
        <el-table-column label="交货日期" prop="plannedDeliveryDate" align="center" :width="tdSize(4,8,false)"/>
        <el-table-column label="退货标记" prop="retPo" align="center" :width="tdSize(4,1)">
          <template slot-scope="scope">
            <span>{{ scope.row.retPo ? '是': '' }}</span>
          </template>
        </el-table-column>
        <el-table-column label="删除标记" prop="sapDeleted" align="center" :width="tdSize(4,1)">
          <template slot-scope="scope">
            <span>{{ scope.row.sapDeleted ? '是': '' }}</span>
          </template>
        </el-table-column>
        <el-table-column label="是否寄售" prop="pstyp" align="center" :width="tdSize(4,1)">
          <template slot-scope="scope">
            <span>{{ scope.row.pstyp === '2' ? '是': '' }}</span>
          </template>
        </el-table-column>

        <el-table-column label="库存地点" prop="stockLocation" align="center" :width="tdSize(4,1)" />
        <el-table-column label="已入库数量" prop="processedQuantity" :width="tdSize(5,1)" />
        <el-table-column label="SAP已交货完成" prop="elikz" align="center" :width="tdSize(7,1)">
          <template slot-scope="scope">
            <span>{{ scope.row.elikz ? '是': '' }}</span>
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
import { getOrderItemList } from '@/api/documents'

export default {
  name: 'PurchaseOrder',
  components: { Pagination, Sticky },
  mixins: [formMixin],
  data() {
    return {
      tableKey: 0,
      list: null,
      total: 0,
      loading: true,
      downloadLoading: false
    }
  },
  created() {
    this.getList(getOrderItemList)
  },
  methods: {
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
