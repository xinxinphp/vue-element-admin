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
        <el-option v-for="item in factoryIds" :key="item.id + item.name" :label="item.code" :value="item.id">
          <span style="float: left">{{ item.code + '  ----  ' + item.name }}</span>
        </el-option>
      </el-select>
      <el-input
        v-model="form.poNo"
        :placeholder="_getFieldName('poNo','采购订单')"
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
      <el-select
        v-model="form.receiptConfirmed"
        :placeholder="_getFieldName('receiptConfirmed','收货单确认')"
        :style="small"
        class="filter-item"
        clearable
      >
        <el-option label="已确认" :value="true" />

        <el-option label="未确认" :value="false" />
      </el-select>
      <el-select
        v-model="form.inboundConfirmed"
        :placeholder="_getFieldName('inboundConfirmed','SAP入库')"
        :style="small"
        class="filter-item"
        clearable
      >
        <el-option label="已确认" :value="true" />
        <el-option label="未确认" :value="false" />
      </el-select>
      <el-select
        v-model="form.qualityInspectionStatus"
        :placeholder="_getFieldName('qualityInspectionStatus','质检状态')"
        :style="small"
        class="filter-item"
        clearable
      >
        <el-option label="未质检" :value="1" />
        <el-option label="合格" :value="2" />
        <el-option label="不合格" :value="3" />
        <el-option label="降级接收" :value="4" />
      </el-select>
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
      <el-button class="filter-item" type="info" icon="el-icon-refresh" @click="handleRest()">重置</el-button>

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
        <el-table-column label="质检结果" align="center" :width="tdSize(4,6,true,true)">
          <template slot-scope="scope">
            <span>{{ scope.row.qualityInspectionStatus }}</span>
          </template>
        </el-table-column>
        <el-table-column label="收货确认" prop="receiptConfirmed" align="center" :width="tdSize(4,5,true,true)">
          <template slot-scope="scope">
            <el-button v-if="scope.row.receiptConfirmed" type="success" size="mini" plain disabled>{{ '已确认' }}</el-button>
            <el-button v-else type="info" plain size="mini" @click="handleHarvest(scope)">{{ '未确认' }}</el-button>
          </template>
        </el-table-column>
        <el-table-column label="入库确认" prop="inboundConfirmed" align="center" :width="tdSize(4,5,true,true)">
          <template slot-scope="scope">
            <el-button v-if="scope.row.inboundConfirmed" size="mini" type="success" plain disabled>{{ '已确认' }}</el-button>
            <el-button v-else type="info" plain size="mini" @click="handleConfirm(scope)">{{ '未确认' }}</el-button>
          </template>
        </el-table-column>
        <el-table-column label="收货单" prop="orderNo" :width="tdSize(4,16,false)" />
        <el-table-column label="供应商" prop="vendorName" :width="tdSize(5,11)">
          <template slot-scope="scope">
            <LongText :text="scope.row.vendorName" />
          </template>
        </el-table-column>
        <el-table-column label="采购订单" prop="poNo" :width="tdSize(4,10,false)">
          <template slot-scope="scope">
            <el-button v-if="scope.row.poNo" type="text" size="mini">{{ scope.row.poNo }}</el-button>
            <el-button v-else type="text" size="mini" @click="showProcurement(scope)">{{ "点击关联" }}</el-button>
          </template>
        </el-table-column>
        <el-table-column label="采购订单项目" prop="poiNo" align="center" :width="tdSize(6,10,false)" />
        <el-table-column label="工厂" prop="factoryCode" align="center" width="100" />
        <el-table-column label="收货日期" prop="createdDate" align="center" :width="tdSize(4,20,false)" />
        <el-table-column label="物料编码" prop="materialCode" align="center" min-width="120" />
        <el-table-column label="物料名称" prop="materialName" :width="tdSize(5,11)">
          <template slot-scope="scope">
            <LongText :text="scope.row.materialName" />
          </template>
        </el-table-column>
        <el-table-column label="订单数" prop="poiQuantity" align="center" width="100" />
        <el-table-column label="打码未收货数" prop="printNotReceive" align="center" width="70" />
        <el-table-column label="打码未入库数" prop="printNotInbound" align="center" width="70">
          <template slot-scope="scope">
            <el-button type="text" size="mini" @click="showPrintNotInbound(scope)">{{ scope.row.printNotInbound }}</el-button>
          </template>
        </el-table-column>
        <el-table-column label="收货数量" prop="receiveQuantity" align="center" width="70" />
        <el-table-column label="入库数量" prop="inboundedQuantity" align="center" width="70" />
        <el-table-column label="SAP基本单位" prop="unit" align="center" width="70" />
        <el-table-column label="质检备注" prop="qualityInspectionRemark" align="center" :width="tdSize(4,8)" />
        <el-table-column label="物料凭证" prop="docNo" align="center" width="100" />
        <el-table-column label="年度" prop="year" align="center" width="100" />
      </el-table>

      <pagination
        :total="total"
        :page.sync="listQuery.page"
        :limit.sync="listQuery.limit"
        @pagination="getList(done)"
      />

      <el-dialog :visible.sync="dialogVisible" :title="dialogType">
        <el-form :model="dialogForm" label-width="220px" label-position="right">
          <el-row>
            <el-col :span="24">
              <el-form-item label="质检状态">
                <el-select
                  v-model="dialogForm.qualityInspectionStatus"
                  placeholder="质检状态"
                  style="width:75%"
                  clearable
                >
                  <el-option label="合格" value="合格" />
                  <el-option label="不合格" value="不合格" />
                  <el-option label="降级接收" value="降级接收" />
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="24">
              <el-form-item label="备注信息">
                <el-input
                  v-model="dialogForm.qualityInspectionRemark"
                  type="textarea"
                  :rows="4"
                  style="width:75%"
                  placeholder="请输入备注信息"
                />
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
        <div style="text-align:right;">
          <el-button type="danger" @click="dialogVisible= false">取消</el-button>
          <el-button type="primary" @click="submitForm">保存</el-button>
        </div>
      </el-dialog>

      <el-dialog :visible.sync="dialogPrintNotInbound" title="明细" width="70%" top="8vh">
        <el-table
          :data="listPrintNotInbound"
          border
          fit
          max-height="500"
          highlight-current-row
          style="width: 100%;"
        >
          <el-table-column label="编辑货位" align="center" width="100">
            <template slot-scope="{row}">
              <el-button
                v-if="row.edit"
                type="success"
                size="small"
                icon="el-icon-circle-check-outline"
                @click="confirmEdit(row)"
              >
                保存
              </el-button>
              <el-button
                v-else
                type="primary"
                size="small"
                icon="el-icon-edit"
                @click="row.edit=!row.edit"
              >
                编辑
              </el-button>

            </template>
          </el-table-column>
          <el-table-column label="关联货位" prop="spotDescription" align="center" width="120">
            <template slot-scope="{row}">
              <el-input v-if="row.edit" v-model="row.spotDescription" class="edit-input" size="small" />
              <span v-else>{{ row.spotDescription }}</span>
            </template>
          </el-table-column>
          <el-table-column label="创建时间" prop="createdDate" align="center" width="95" />
          <el-table-column label="打印序列" width="100">
            <template slot-scope="{row}">
              <span>{{ row.printSeq + ' / '+row.ordinal + ' / '+row.totalPrintNum }}</span>
            </template>
          </el-table-column>
          <el-table-column label="标签码" prop="tagNo" align="center" width="95" />
          <el-table-column label="物料编码" prop="materialCode" align="center" width="115" />
          <el-table-column label="物料描述" prop="materialName" :width="tdSize(5,11)">
            <template slot-scope="scope">
              <LongText :text="scope.row.materialName" />
            </template>
          </el-table-column>
          <el-table-column label="版本号" prop="version" align="center" width="70" />
          <el-table-column label="型号" prop="type" align="center" width="50" />
          <el-table-column label="数量" prop="quantity" align="center" width="50" />
          <el-table-column label="单位" prop="unit" align="center" width="50" />
          <el-table-column label="生产日期" prop="productionDate" align="center" min-width="95" />
          <el-table-column label="到厂日期" prop="factoryDate" align="center" min-width="95" />

        </el-table>

        <pagination
          :total="totalPrintNotInbound"
          :page.sync="listQuery.page"
          :limit.sync="listQuery.limit"
          @pagination="getPrintNotInboundList()"
        />

      </el-dialog>

      <el-dialog :visible.sync="dialogProcurement" title="关联采购订单" width="80%" top="5vh">
        <div class="filter-container">
          <el-input
            v-model="procurementForm.factoryCode"
            :placeholder="_getFieldName('factoryCode','工厂')"
            :style="small"
            class="filter-item"
            clearable
            disabled
          />
          <el-input
            v-model="procurementForm.materialName"
            :title="procurementForm.materialName"
            :placeholder="_getFieldName('materialName','物料名称')"
            :style="small"
            class="filter-item"
            clearable
            disabled
          />
          <el-input
            v-model="procurementForm.vendorName"
            :title="procurementForm.vendorName"
            :placeholder="_getFieldName('vendorName','供应商')"
            :style="small"
            class="filter-item"
            clearable
            disabled
          />
          <el-input
            v-model="procurementForm.orderNo"
            :placeholder="_getFieldName('orderNo','采购订单')"
            :style="small"
            class="filter-item"
            clearable
          />
          <el-date-picker
            v-model="procurementForm.queryDateStart"
            type="date"
            value-format="yyyy-MM-dd"
            class="filter-item"
            :editable="false"
            :placeholder="_getFieldName('queryDateStart','创建日期始')"
            :style="small"
          />
          <el-date-picker
            v-model="procurementForm.queryDateEnd"
            type="date"
            value-format="yyyy-MM-dd"
            class="filter-item"
            :editable="false"
            :placeholder="_getFieldName('queryDateEnd','创建日期止')"
            :style="small"
          />
          <el-button class="filter-item" type="primary" icon="el-icon-search" @click="handleSeach">搜索</el-button>
          <el-button class="filter-item" type="success" icon="el-icon-plus" :disabled="!multipleSelection.length" style="float: right" @click="handleAdd">添加关联</el-button>

        </div>
        <el-table
          ref="multipleTable"
          v-loading="loadingProcurement"
          :data="listProcurement"
          border
          fit
          max-height="500"
          highlight-current-row
          style="width: 100%;"
          @selection-change="handleSelectionChange"
        >
          <el-table-column type="selection" width="55" />
          <el-table-column label="采购订单" prop="orderNo" align="center" width="100" />
          <el-table-column label="行项目" prop="orderItemNo" align="center" width="70" />
          <el-table-column label="供应商" prop="vendorName" width="100">
            <template slot-scope="scope">
              <LongText :text="scope.row.vendorCode" />
            </template>
          </el-table-column>
          <el-table-column label="供应商名称" prop="vendorName" align="center" width="130" show-overflow-tooltip />
          <el-table-column label="寄售" prop="pstyp" align="center" :width="tdSize(4,1)">
            <template slot-scope="scope">
              <span>{{ scope.row.pstyp === '2' ? '是': '' }}</span>
            </template>
          </el-table-column>
          <el-table-column label="订单数量" prop="quantity" align="center" width="90" />
          <el-table-column label="未收数" prop="availableQuantity" align="center" width="90" />
          <el-table-column label="已收数" prop="processedQuantity" align="center" width="90" />
          <el-table-column label="交货完成" prop="elikz" align="center" width="90">
            <template slot-scope="scope">
              <span>{{ scope.row.elikz? '完成': '' }}</span>
            </template>
          </el-table-column>
          <el-table-column label="物料" prop="materialCode" align="center" width="120" />
          <el-table-column label="描述" prop="materialName" align="center" min-width="125" show-overflow-tooltip />
        </el-table>

        <pagination
          :total="totalProcurement"
          :page.sync="listQuery.page"
          :limit.sync="listQuery.limit"
          @pagination="handleSeach()"
        />

      </el-dialog>
    </div>
  </div>
</template>

<script>

import Sticky from '@/components/Sticky'
import Pagination from '@/components/Pagination'
import formMixin from '@/views/mixin/BaseSearchForm'
import { parseTime } from '@/utils'
import { getReceiptOrders, setQualityInspectionStatus, setReceiptConfirm, setInboundConfirm, getPrintNotInbound, setBindSpot, getreceiptOrderItemList, setbindPurchaseOrder } from '@/api/documents'
const defaultForm = {
  poNo: '', // 采购订单
  materialCode: '', // 物料编码
  materialName: '', // 物料名称
  receiptConfirmed:	'', // true 收货单确认
  inboundConfirmed: '', // SAP入库
  qualityInspectionStatus: '' // 质检状态
}

export default {
  name: 'ReceiptOrders',
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
      materialBrand: [],
      materialCategory: [],
      materialSmallCategory: [],
      /** ***以下dialog字段 *****/
      dialogForm: {},
      dialogFormRef: 'dialogFormRef',
      dialogType: '',
      dialogVisible: false,
      /** ***以下 xxxx 字段 *****/
      dialogPrintNotInbound: false,
      formPrintNotInbound: {
        spotDescription: ''
      },
      listPrintNotInbound: [],
      totalPrintNotInbound: 1,
      loadingPrintNotInbound: false,
      purchaseOrderItemId: {},
      /** ***以下 xxxx 字段 *****/
      dialogProcurement: false,
      procurementForm: {
        factoryCode: '',
        materialName: '',
        vendorName: '',
        orderNo: '',
        queryDateStart: '',
        queryDateEnd: ''
      },
      loadingProcurement: false,
      totalProcurement: 1,
      listProcurement: [],
      multipleSelection: []
    }
  },
  computed: {
  },
  created() {
    this.getList(getReceiptOrders)
  },
  methods: {
    handleEditor({ row }) {
      this.dialogForm = Object.assign({}, row)
      this.dialogVisible = true
    },
    handleHarvest({ row }) {
      this.$confirm('确认收货?', '警告', {
        confirmButtonText: '确认',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          setReceiptConfirm(row.id)
            .then(res => {
              row.receiptConfirmed = !row.receiptConfirmed
              this.$message.success(res.message)
            })
        })
    },
    handleConfirm({ row }) {
      this.$confirm('确认入库?', '警告', {
        confirmButtonText: '确认',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          setInboundConfirm(row.id)
            .then(res => {
              row.inboundConfirmed = !row.inboundConfirmed
              this.$message.success(res.message)
            })
        })
    },
    submitForm() {
      const data = {
        id: this.dialogForm.id,
        qualityInspectionStatus: this.dialogForm.qualityInspectionStatus,
        qualityInspectionRemark: this.dialogForm.qualityInspectionRemark
      }
      setQualityInspectionStatus(data)
        .then(res => {
          this.getList(getReceiptOrders)
          this.$message.success(res.message)
          this.dialogVisible = false
        })
    },
    showProcurement({ row }) {
      const now = new Date()
      const mont = now.setMonth(now.getMonth() - 1)
      this.procurementForm.factoryCode = row.factoryCode
      this.procurementForm.materialName = row.materialName
      this.procurementForm.vendorName = row.vendorName
      this.procurementForm.queryDateStart = parseTime(mont, '{y}-{m}-{d}')
      this.procurementForm.queryDateEnd = parseTime(new Date(), '{y}-{m}-{d}')
      this.totalProcurement = 1
      this.itemID = row.id
      this.dialogProcurement = true
      this.purchaseOrderItemId = { purchaseOrderItemId: row.purchaseOrderItemId }
      this.handleSeach(this.purchaseOrderItemId)
    },
    handleSeach() {
      this.loadingProcurement = true
      getreceiptOrderItemList({ ...this.procurementForm, ...this.listQuery })
        .then(res => {
          this.loadingProcurement = false
          this.listProcurement = res.data.list
        })
    },
    handleSelectionChange(val) {
      if (val.length === 1) {
        this.multipleSelection = [...val]
        this.$refs.multipleTable.toggleRowSelection(val[0], true)
      } else if (val.length === 2) {
        const de = [...val]
        this.$refs.multipleTable.clearSelection()
        this.$refs.multipleTable.toggleRowSelection(de[1], true)
        this.multipleSelection = [de[1]]
      } else {
        this.multipleSelection = []
        this.$refs.multipleTable.clearSelection()
      }
    },
    handleAdd() {
      const data = {
        receiptId: this.itemID,
        purchaseItemId: this.multipleSelection[0].id
      }
      setbindPurchaseOrder(data)
        .then(res => {
          this.$message.success(res.message)
          this.loadingProcurement = false
          this.dialogProcurement = false
          this.getList(getReceiptOrders)
        })
    },
    showPrintNotInbound({ row }) {
      this.totalPrintNotInbound = 1
      this.itemID = row.id
      this.dialogPrintNotInbound = true
      this.purchaseOrderItemId = { purchaseOrderItemId: row.purchaseOrderItemId }
      this.getPrintNotInboundList(this.purchaseOrderItemId)
    },
    getPrintNotInboundList(purchaseOrderItemId = this.purchaseOrderItemId) {
      this.loading = true
      getPrintNotInbound({ ...this.listQuery, ...purchaseOrderItemId })
        .then(res => {
          this.listPrintNotInbound = res.data.list.map(v => {
            this.$set(v, 'edit', false)
            return v
          })
          this.totalPrintNotInbound = res.data.total
          this.loading = false
        })
        .catch(() => {
          this.loading = false
        })
    },
    confirmEdit(row) {
      const data = {
        'id': row.id, // itemID
        'receiptOrderId': this.itemID, // 收货单ID
        'spotDescription': row.spotDescription// 输入的货位
      }
      setBindSpot(data)
        .then(res => {
          row.edit = false
          this.$message.success(res.message)
        })
        .catch(err => {
          row.edit = false
          row.spotDescription = ''
          this.$message.error(err)
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
