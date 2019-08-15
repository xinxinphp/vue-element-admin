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
        v-model="form.poNo"
        :placeholder="_getFieldName('poNo','采购订单号')"
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
        :style="small"
        class="filter-item"
        clearable
      />
      <el-input
        v-model="form.lastModifiedBy"
        :placeholder="_getFieldName('lastModifiedBy','创建人')"
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
        <el-table-column label="操作" align="center" width="200">
          <template slot-scope="scope">
            <span>
              <el-button type="primary" size="mini" @click="handlePrint(scope)">补打</el-button>
              <el-button type="danger" size="mini" @click="setDisable(scope)">作废</el-button>
            </span>
          </template>
        </el-table-column>
        <el-table-column label="工厂" prop="factoryCode" align="center" width="80" sortable="factoryCode" />
        <el-table-column label="打印时间" prop="createdDate" align="center" width="155" sortable="createdDate" />
        <el-table-column label="打印序列" width="100">
          <template slot-scope="{row}">
            <span>{{ row.printSeq + ' / '+row.ordinal + ' / '+row.totalPrintNum }}</span>
          </template>
        </el-table-column>
        <el-table-column label="标签码" prop="tagNo" min-width="170" />
        <el-table-column label="采购订单号" prop="poNo" align="center" width="100" />
        <el-table-column label="行项目" prop="poiNo" align="center" width="70" />
        <el-table-column label="供应商" prop="vendorCode" :width="tdSize(5,11)">
          <template slot-scope="scope">
            <LongText :text="scope.row.vendorCode" />
          </template>
        </el-table-column>
        <el-table-column label="供应商名称" prop="vendorName" :width="tdSize(5,11)">
          <template slot-scope="scope">
            <LongText :text="scope.row.vendorName" />
          </template>
        </el-table-column>
        <el-table-column label="物料编码" prop="materialCode" width="120" />
        <el-table-column label="物料描述" prop="materialName" :width="tdSize(5,11)">
          <template slot-scope="scope">
            <LongText :text="scope.row.materialName" />
          </template>
        </el-table-column>
        <el-table-column label="内部简码" prop="internalShortCode" align="center" width="100" />
        <el-table-column label="品牌" prop="materialBrand" width="100" />
        <el-table-column label="类别" prop="materialCategory" width="100" />
        <el-table-column label="版本号" prop="version" width="100" />
        <el-table-column label="数量" prop="quantity" width="100" />
        <el-table-column label="sap单位" prop="unit" width="100" />
        <el-table-column label="生产日期" prop="productionDate" width="100" />
        <el-table-column label="到厂日期" prop="factoryDate" width="100" />
      </el-table>

      <pagination
        :total="total"
        :page.sync="listQuery.page"
        :limit.sync="listQuery.limit"
        @pagination="getList(done)"
      />

      <el-dialog :visible.sync="dialogVisibleDownload" title="请先下载驱动" top="30vh">
        <a href="/CLodop_Setup_for_Win32NT.zip" target="_blank" type="primary">点击下载</a>
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
import abcMixin from './abcMixin'
import { getItems, getReprint, setDisable } from '@/api/print'

const defaultForm = {
  factoryId: '', // 工厂
  poNo:	'', // 采购订单号
  vendorCode: '', // 供应商
  vendorName:	'', // 供应商名称
  lastModifiedBy:	'', // 创建人
  materialCode:	'', // 物料编码
  materialName:	''// 物料名称
}

export default {
  name: 'MissedPatches',
  components: { Pagination, Sticky },
  mixins: [formMixin, abcMixin],
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
    }
  }
}
</script>
