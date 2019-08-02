<template>
  <div>
    <span v-if="textLength <= maxLength">{{ text }}</span>
    <el-tooltip v-else effect="dark" :content="text" placement="top">
      <el-button type="text" style="margin: 0; padding: 0;">{{ text.toString().substring(0, maxLength) }}...</el-button>
    </el-tooltip>
  </div>
</template>

<script>
export default {
  props: {
    text: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      maxLength: 10,
      textLength: 0
    }
  },
  created() {
    this.textLength = this.text.length
  },
  methods: {
  }
}
</script>

