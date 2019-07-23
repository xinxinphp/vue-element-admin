// import store from '@/store'
import formNodeDef, { large, medium, small, mini, getFieldName } from '@/views/mixin/nodeField'

// 开局把formNode原始值赋值为空
const formNode = {}
Object.keys(formNodeDef).forEach(item => {
  formNode[item] = ''
})

import { mapState } from 'vuex'
export default {
  data() {
    return {
      defaultForm: {},
      form: { ...formNode },
      formRef: 'formRef',
      large,
      medium,
      small,
      mini,
      total: 0,
      list: [],
      loading: true,
      listQuery: {
        page: 1,
        limit: 20, // 每页多少条
        orderBy: `id desc`// 升序:code 降序: code desc
      },
      done: null
    }
  },
  created() {
  },
  computed: {
    ...mapState('user', ['factoryIds']) // 用户下的所有工厂
  },
  mounted() {
    console.log('页面加载完毕 ---- BaseSearchForm.js')
  },
  methods: {
    getList(done) {
      this.done ? '' : this.done = done
      this.loading = true
      done({ ...this.listQuery, ...this.form })
        .then(res => {
          this.list = res.data.list
          this.total = res.data.total
          this.loading = false
        })
        .catch(() => {
          this.loading = false
        })
    },
    handleRest(done) {
      this.initForm()
      this.listQuery.page = 1
      this.listQuery.orderBy = 'id desc'
      this.getList(this.done)
    },
    initForm() {
      this.form = Object.assign({}, this.defaultForm)
    },
    resetForm() {
      this.initForm()
      this.$refs[this.formRef] && this.$refs[this.formRef].resetFields()
    },
    handleClose(done) {
      done()
      this.resetForm()
    },
    // 排序的开始函数 开始
    sortChange(data) {
      const { prop, order } = data
      if (order === 'ascending') {
        this.listQuery.orderBy = `${prop}`
      } else {
        this.listQuery.orderBy = `${prop} desc`
      }
      this.handleFilter()
    },
    handleFilter() {
      this.listQuery.page = 1
      this.getList(this.done)
    },
    // 排序的开始函数 结束
    _getFieldName(FieldName, name = '') {
      return getFieldName(FieldName, name)
    }
  }
}
