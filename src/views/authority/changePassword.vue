<template>
  <div class="app-container">
    <el-form ref="formRef" :model="form" label-width="110px" label-position="top">
      <el-form-item label="现密码" :rules="[{ required: true }]" prop="oldPassword">
        <el-input v-model.trim="form.oldPassword" type="password" style="width: 30%" />
      </el-form-item>
      <el-form-item label="新密码" :rules="[{ required: true }]" prop="newPassword">
        <el-input v-model.trim="form.newPassword" type="password" style="width: 30%" />
      </el-form-item>
      <el-form-item label="确认密码" :rules="[{ required: true }]" prop="newPassword2">
        <el-input v-model.trim="form.newPassword2" type="password" style="width: 30%" @paste.native.capture.prevent="handlePaste" />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="submit">确认</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import { setChangePassword } from '@/api/authority'
export default {
  name: 'ChangePassword',
  data() {
    return {
      form: {
        oldPassword: '',
        newPassword: '',
        newPassword2: ''
      }
    }
  },
  methods: {
    submit() {
      this.$refs['formRef'].validate((valid) => {
        if (!valid) { return }
        if (this.form.newPassword2 !== this.form.newPassword) {
          this.$message.error('2次输入密码不一致,请重新输入')
          this.form.newPassword2 = ''
          return false
        }
        setChangePassword(this.form.oldPassword, this.form.newPassword)
          .then(res => {
            this.$message.success(res.message)
            setTimeout(() => {
              this.logout()
            }, 3000)
          })
          .catch(err => {
            this.$message.error(err)
            this.form.oldPassword = ''
            this.form.newPassword = ''
            this.form.newPassword2 = ''
          })
      })
    },
    handlePaste() {},
    async logout() {
      await this.$store.dispatch('user/logout')
      this.$router.push(`/login?redirect=${this.$route.fullPath}`)
    }
  }
}
</script>
