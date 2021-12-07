<template>
  <div class="login_container">
    <!-- 登录组件 -->
    <div class="login_box">
      <!-- 登录 -->
      <div class="avatar_box">
        <img src="../assets/logo.svg" />
      </div>
      <el-form
        ref="loginFormRef"
        :model="loginForm"
        :rules="loginFormRules"
        label-width="0px"
        class="login_form"
      >
        <!-- 账号 -->
        <el-form-item prop="username">
          <el-input
            v-model="loginForm.username"
            prefix-icon="iconfont icon-user"
          ></el-input>
        </el-form-item>
        <!-- 密码 -->
        <el-form-item prop="password">
          <el-input type="password"
            v-model="loginForm.password"
            prefix-icon="iconfont icon-3702mima"
          ></el-input>
        </el-form-item>
        <!-- 按钮 -->
        <el-form-item class="btns">
          <el-button type="primary" @click="login">登录</el-button>
          <el-button type="info" @click="resetLoginForm">重置</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      //这是登录表单数据绑定对象
      loginForm: {
        username: 'admin',
        password: '123456'
      },
      loginFormRules: {
        //这是表单必填项
        //验证用户名是否合法
        username: [
          { required: true, message: '请输入登录名称', trigger: 'blur' },
          { min: 3, max: 10, message: '长度3-10个字符', trigger: 'blur' }
        ],
        password: [
          { required: true, message: '请输入密码', trigger: 'blur' },
          { min: 6, max: 15, message: '长度6-15个字符', trigger: 'blur' }
        ]
      }
    }
  },
  methods: {
    //重置表单
    resetLoginForm() {
      //我们同form绑定事件找到this找到refs方法调用清空函数
      this.$refs.loginFormRef.resetFields()
    },
    login() {
      //验证登录  获取表单的对象
      this.$refs.loginFormRef.validate(async valid => {
        if (!valid) return
        const { data: res } = await this.$http.post('login', this.loginForm)
        if (res.meta.status !== 200) return this.$message.error('登录失败')
        this.$message.success('登录成功')
        // 1.将扥估成功之后 token保存到客户端 sessionStorage
        //项目中出登录之外其他API接口必须登录之后才能访问
        //token只用当前网站打开期间生效将token保存在sessionStorage中
        window.sessionStorage.setItem('token', res.data.token)
        // 通过编程式导航跳转到后提主页路由地址/home
        this.$router.push('/home')
      })
    }
  }
}
</script>

<style lang="less">
.login_container {
  height: 100%;
  width: 100%;
  background-color: rgb(95, 151, 153);
}
.login_box {
  width: 450px;
  height: 300px;
  background-color: #fff;
  border-radius: 3%;
  position: absolute; //定位
  left: 50%; //左边距 上边距
  top: 50%;
  transform: translate(-50%, -50%); //减去盒子本身的上下50%
  .avatar_box {
    width: 130px; //给图片加盒子设置大小  图片直接100%
    height: 130px;
    border: 1px solid #eee;
    border-radius: 50%;
    padding: 10px;
    box-shadow: 0 0 20px #ddd;
    position: absolute;
    left: 50%;
    background: #fff;
    transform: translate(-50%, -50%);
    img {
      width: 100%;
      height: 100%;
      border-radius: 50%;
      background-color: #eee;
    }
  }
}

.login_form {
  position: absolute;
  bottom: 5px;
  width: 100%;
  padding: 0 20px;
  box-sizing: border-box;
}

.btns {
  display: flex;
  justify-content: flex-end;
}
</style>
