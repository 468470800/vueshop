<template>
  <el-container>
    <!-- 头部区域 -->
    <el-header>
      <div>
        <img src="../assets/heima.png" alt="" /> <span>后台管理系统</span>
      </div>
      <el-button type="success" @click="logout">退出</el-button>
      </el-header
    >
    <el-container> 
      <!-- 左侧 边栏目-->
      <el-aside style="background-color: #333744 ;" :width="isCollaose ? '64px' : '200px' "><!-- 伸缩 -->
        <div class='toggle-button' @click='toggleCollapse'> | | | </div>
        <el-menu
          background-color="#333744"
          text-color="#fff"
          active-text-color="#ffd00b" :unique-opened="true" :collapse="isCollaose"
        :collapse-transition='false' router :default-active="activePath">         
          <!-- 一级菜单 -->
          <el-submenu
            :index="item.id + ''"
            v-for="item in menulist"
            :key="item.id" 
          >
            <template slot="title">
              <!-- 图标 -->
              <i :class="iconsObj[item.id]"></i>
              <!-- 文本 -->
              <span>{{ item.authName }}</span>
            </template>
            <!-- 二级菜单导航 -->
            <el-menu-item :index=" '/'+subItem.path" @click="saveNavState('/'+subItem.path)" v-for="subItem in item.children" :key='subItem.id'>
              <template>
                <!-- 图标 -->
              <i class="el-icon-menu"></i>
                <span>{{subItem.authName}}</span>
                <!-- 文本 -->
              </template>
            </el-menu-item>
          </el-submenu>
        </el-menu>
      </el-aside>
      <!-- 内容 -->
      <el-main>
        <router-view></router-view>
      </el-main>
    </el-container>
  </el-container>
</template>

<script>
export default {
  data() {
    return {
      //左侧菜单数据
      menulist: [],
      iconsObj:{
        '125':"iconfont icon-user",
        '103':"iconfont icon-tijikongjian",
        '101':"iconfont icon-shangpin",
        '102':"iconfont icon-danju",
        '145':"iconfont icon-baobiao"
      },//折叠
      isCollaose:false,
      //被激活的链接地址
      activePath:''
    }
  },
  created() {
    //在创建前调用
    this.getMenuList()
    this.activePath = window.sessionStorage.getItem('activePath')
  },
  methods: {
    logout() {
      window.sessionStorage.clear()
      this.$router.push('/login')
    },
    async getMenuList() {
      const { data: res } = await this.$http.get('menus')
      if (res.meta.status != 200) return this.$message.error(res.meta.msg)
      this.menulist = res.data
      console.log(res)
    },
    //点击按钮切换展开
    toggleCollapse(){
     this.isCollaose = !this.isCollaose
    },
    saveNavState(activePath) {
      window.sessionStorage.setItem('activePath',activePath)
      this.activePath = activePath
    }
  }
}
</script>

<style lang="less" scoped>
.el-container {
  height: 100%;
}

.el-header {
  background: #373d41;
  display: flex;
  justify-content: space-between;
  color: #fff;
  font-size: 28px;
  .el-button{
    margin: 6px;
  }
  > div {
    display: flex;
    align-items: center;
    span {
      padding-left: 15px;
    }
  }
}

.el-aside {
  background-color: #373d41;
}

.el-menu {
  border: none;
}

.iconfont{
  padding: 10px;
}

.el-main {
  background: #eee;
}

.toggle-button{
  background: #4A5064;
  color: #eee;
  text-align: center;
  line-height: 24px;
}
</style>
