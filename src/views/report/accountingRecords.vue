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
      <el-select
        v-model="form.success"
        :placeholder="_getFieldName('success','过账结果')"
        :style="small"
        class="filter-item"
        clearable
      >
        <el-option label="成功" :value="true" />
        <el-option label="失败" :value="false" />
      </el-select>
      <el-date-picker
        v-model="form.queryDateStart"
        type="date"
        value-format="yyyy-MM-dd"
        :editable="false"
        :placeholder="_getFieldName('queryDateStart','创建日期始')"
        :style="small"
      />
      <el-date-picker
        v-model="form.queryDateEnd"
        type="date"
        value-format="yyyy-MM-dd"
        :editable="false"
        :placeholder="_getFieldName('queryDateEnd','创建日期止')"
        :style="small"
      />
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
        <el-table-column label="操作" align="center" width="150" fixed="left">
          <template slot-scope="{row}">
            <el-button type="primary" size="mini" @click="handleEditor(row)">明细</el-button>
            <el-button type="success" size="mini" :disabled="row.success" @click="handleDb(row)">重传</el-button>
          </template>
        </el-table-column>
        <el-table-column label="过账成功" width="80" align="center">
          <template slot-scope="scope">
            <template v-if="typeof scope.row.success === 'boolean'">
              <el-tag v-if="scope.row.success" type="success">成功</el-tag><el-tag v-else type="danger">失败</el-tag>
            </template>
            <template v-else>
              <el-tag type="success">过账中</el-tag>
            </template>
          </template>
        </el-table-column>
        <el-table-column label="交易ID" prop="intid" width="180" />
        <el-table-column label="工厂" prop="factoryCode" width="120" />
        <el-table-column label="PCM单据" prop="orderNo" width="180" />
        <el-table-column label="创建时间" prop="createdDate" align="center" width="160" />
        <el-table-column label="最后处理时间" prop="lastModifiedDate" min-width="160" />
        <el-table-column label="处理次数" prop="postCount" width="100" />
        <el-table-column label="物料凭证" prop="docNo" align="center" width="100" />
        <el-table-column label="年度" prop="docYear" width="100" />
      </el-table>

      <pagination
        :total="total"
        :page.sync="listQuery.page"
        :limit.sync="listQuery.limit"
        @pagination="getList(done)"
      />

      <el-dialog :visible.sync="dialogVisible" :title="dialogType" width="65%">
        <el-form :model="dialogForm" label-width="120px" label-position="right">
          <el-row>
            <el-col :span="8">
              <el-form-item label="创建人">
                <span> {{ dialogForm.createdBy }}</span>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="创建日期">
                <span> {{ dialogForm.createdDate }}</span>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="最后操作" prop="pkgUnit">
                <span> {{ dialogForm.lastModifiedBy }}</span>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="8">
              <el-form-item label="最后处理时间">
                <span> {{ dialogForm.lastModifiedDate }}</span>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="PCM单据">
                <span> {{ dialogForm.orderNo }}</span>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="处理次数" prop="pkgUnit">
                <span> {{ dialogForm.postCount }}</span>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="8">
              <el-form-item label="业务类型">
                <span> {{ dialogForm.type }}</span>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="Mule transid">
                <span> {{ dialogForm.transId }}</span>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="交易ID" prop="pkgUnit">
                <span> {{ dialogForm.intid }}</span>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="24">
              <el-form-item label="过账内容">
                <p style="word-wrap:break-word; line-height: 16px;"> {{ dialogForm.postContent }}</p>
                <!--                <LongText :text="dialogForm.postContent" />-->
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="24">
              <el-form-item label="过账结果">
                <p style="word-wrap:break-word; line-height: 16px;"> {{ dialogForm.message }}</p>
                <!--                <LongText :text="dialogForm.postContent" />-->
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
        <div style="text-align:right;">
          <el-button type="danger" @click="dialogVisible= false">关闭</el-button>
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
import { getPostLogs, getPostLogsList, getPostLogsRepost } from '@/api/report'
const defaultForm = {
  success: ''	// 过账结果
}

export default {
  name: 'AccountingRecords',
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
      /** ***一下打印*****/
      dialogForm: {},
      isPkgQuantityDisabled: true,
      formRef: 'formRef',
      dialogType: '',
      dialogVisible: false
    }
  },
  computed: {
  },
  created() {
    this.getList(getPostLogs)
  },
  methods: {
    handleEditor(row) {
      getPostLogsList(row.id)
        .then(res => {
          this.dialogForm = Object.assign({}, res.data)
          this.dialogVisible = true
        })
    },
    handleDb(row) {
      this.$confirm('确认重新传输?', '警告', {
        confirmButtonText: '确认',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          getPostLogsRepost(row.id)
            .then(res => {
              row.success = '过账中'
              this.$message.success(res.message)
            })
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
