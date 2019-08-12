<template>
  <div>
    <span v-if="text.length <= maxLength">{{ text }}</span>
    <el-tooltip v-else effect="dark" :content="text" placement="top">
      <el-button type="text" style="margin: 0; padding: 0; color: #606266">{{ text.toString().substring(0, maxLength) }}...</el-button>
    </el-tooltip>
  </div>
</template>

<script>
export default {
  props: {
    text: {
      type: String,
      default: ''
    },
    maxLength: {
      type: Number,
      default: 10
    }
  },
  data() {
    return {
    }
  },
  created() {
  },
  mounted() {
  },
  methods: {
  }
}
</script>
