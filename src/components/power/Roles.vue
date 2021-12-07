<template>
  <div>
    <!-- 面包屑导航 -->
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item><a href="/">权限管理</a></el-breadcrumb-item>
      <el-breadcrumb-item>角色列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片视图 -->
    <el-card>
      <!-- 添加角色 -->
      <el-row>
        <el-col>
          <el-button type="primary">添加角色</el-button>
        </el-col>
      </el-row>
      <el-table :data="rolelist" border stripe>
        <!-- 展开行 -->
        <el-table-column type="expand">
          <template slot-scope="scope">
            <el-row
              :class="['bdbottom', i1 === 0 ? 'bdtop' : '', 'vcenter']"
              v-for="(item1, i1) in scope.row.children"
              :key="item1.id"
            >
              <!-- 渲染一级权限 -->
              <el-col :span="5">
                <el-tag closable @close="removeRigById(scope.row, item1.id)">{{
                  item1.authName
                }}</el-tag>
                <i class="el-icon-caret-right"></i>
              </el-col>
              <!-- 渲染二级权限 -->
              <el-col :span="19">
                <!-- 通过for循环嵌套二级权限 -->
                <el-row
                  :class="[i2 === 0 ? '' : 'bdtop', 'vcenter']"
                  v-for="(item2, i2) in item1.children"
                  :key="item2.id"
                >
                  <!-- 二级权限渲染 -->
                  <el-col :span="6">
                    <el-tag
                      closable
                      @close="removeRigById(scope.row, item2.id)"
                      type="success"
                      >{{ item2.authName }}</el-tag
                    >
                    <i class="el-icon-caret-right"></i>
                  </el-col>
                  <!-- 3级权限渲染 -->
                  <el-col :span="18">
                    <el-tag
                      closable
                      @close="removeRigById(scope.row, item3.id)"
                      type="warning"
                      v-for="(item3, i3) in item2.children"
                      :key="i3"
                    >
                      {{ item3.authName }}
                    </el-tag>
                  </el-col>
                </el-row>
              </el-col>
            </el-row>
          </template>
        </el-table-column>
        <!-- 索引 -->
        <el-table-column type="index"></el-table-column>
        <el-table-column label="角色名称" prop="roleName"></el-table-column>
        <el-table-column label="角色描述" prop="roleDesc"></el-table-column>
        <el-table-column label="角色操作" width="300px">
          <template slot-scope="scope">
            <el-button size="mini" type="primary" icon="el-icon-edit"
              >编辑</el-button
            >
            <el-button size="mini" type="danger" icon="el-icon-delete"
              >删除</el-button
            >
            <el-button
              size="mini"
              type="warning" 
              icon="el-icon-setting"
              @click="showSetRightDialog(scope.row)">分配权限</el-button
            >
          </template>
        </el-table-column>
      </el-table>
    </el-card>
    <!-- 分配权限对话框 -->
    <el-dialog
      title="分配权限用户权限"
      :visible.sync="setRightDialogVisible"
      width="45%" @close="setRightDialogClosed"
    >
    <!-- 树形控件 -->
      <el-tree defaultExpandAll show-checkbox node-key="id" ref="treeRef" :default-checked-keys="defKeys" default-expand-all="true" :data="rightslist" :props="treeProps" ></el-tree>
      <span slot="footer" class="dialog-footer">
        <el-button @click="setRightDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="allotRights"
          >确 定</el-button
        >
      </span>
    </el-dialog>
  </div>
</template>
<script>
export default {
  data() {
    return {
      //所有角色列表
      rolelist: [],
      //控制分配权限对话框的显示隐藏
      setRightDialogVisible: false,
      //所有权限数据
      rightslist:[],
      treeProps:{
        label:'authName',
        children:'children'
      },//树形控件
      defKeys:[],
       // 当前即将分配权限的角色id
      roleId: ''
    }
  },
  created() {
    this.getRolesList()
  },
  methods: {
    //获取角色列表
    async getRolesList() {
      const { data: res } = await this.$http.get('roles')
      if (res.meta.status !== 200) {
        return this.$message.error('获取角色列表失败')
      }
      this.rolelist = res.data
      //  console.log(this.rolelist)
    }, //根据id删除对应的权限
    async removeRigById(role, rightId) {
      //弹框提示用户是否删除
      const confirmResult = await this.$confirm(
        '此操作将永久删除该文件, 是否继续?',
        '提示',
        {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }
      ).catch(err => err)
      if (confirmResult !== 'confirm') {
        return this.$message.info('取消删除')
      }
      const { data: res } = await this.$http.delete(
        `roles/${role.id}/rights/${rightId}`
      )
      if (res.meta.status !== 200) {
        return this.$message.error('删除成功')
      }
      // this.getRolesList()//我们删除后调用这个函数数据会刷新页面重新渲染
      role.children = res.data //我们可以为当前角色信息重新赋值权限就可以了
    },
    //展示分配权限对话框
    async showSetRightDialog(role) {
       this.roleId = role.id
      //展示分配权限的对话框
      const {data:res} = await this.$http.get('rights/tree')
      if(res.meta.status !== 200) {
          return this.$message.error('获取权限数据失败')
      }//把所有获取的权限保存到data
      this.rightslist = res.data
      console.log(this.rightslist)
      //            递归获取三级节点的id
      this.getLeafKeys(role,this.defKeys)
      this.setRightDialogVisible = true
    },//通过递归的方式获取角色所三级权限 并保存 defKeys数组中
    getLeafKeys(node,arr){//一个节点是否是三级节点 一个数组 node不包含children树形则是三级节点
      if(!node.children){//
        return arr.push(node.id)//不是三级节点直接push
      }//我们调用递归获取三级节点
      node.children.forEach(item => this.getLeafKeys(item,arr))//循环这个children树形循环调用他里面的item
    },
    setRightDialogClosed() {//监听对话框的关闭事件
      this.defKeys = []    //我们关闭清空数组里面的元素项
      },
     async allotRights() {//为角色分配权限 拿到有的id ref="treeRef"
        const keys = [
          ...this.$refs.treeRef.getCheckedKeys(),
          ...this.$refs.treeRef.getHalfCheckedKeys()
        ]
        const idStr = keys.join(',')//字符串拼接逗号隔开
       const {data:res} = await this.$http.post(`roles/${this.roleId}/rights`,{rids:idStr})//请求体传递idStr
       if(res.meta.status !== 200){
         return this.$message.error('获取权限失败！')
       }
       this.$message.success('分配成功')
       this.getRolesList()
      this.setRightDialogVisible = false
      }
  }
}
</script>
<style lang="less" scope>
.el-tag {
  margin: 7px;
}

.bdtop {
  border-top: 1px solid #eee;
}

.bdbottom {
  border-bottom: 1px solid #eee;
}

.vcenter {
  display: flex;
  align-items: center;
}
</style>
