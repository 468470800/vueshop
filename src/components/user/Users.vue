<template>
  <div>
    <!-- 面包屑导航 -->
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item><a href="/">用户管理</a></el-breadcrumb-item>
      <el-breadcrumb-item>用户列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片 -->
    <el-card class="box-card">
      <!-- 搜索添加 -->
      <el-row :gutter="20">
        <el-col :span="8">
          <el-input
            placeholder="请输入内容"
            v-model="queryInfo.query"
            clearable
            @clear="getUserList"
          >
            <el-button
              slot="append"
              icon="el-icon-search"
              @click="getUserList"
            ></el-button>
          </el-input>
        </el-col>
        <el-col :span="4">
          <el-button type="primary" @click="addDialogVisible = true"
            >添加用户</el-button
          >
        </el-col>
      </el-row>
      <!-- 用户列表区域 -->
      <el-table :data="userlist" border stripe>
        <el-table-column type="index" label="id"></el-table-column>
        <el-table-column label="姓名" prop="username"></el-table-column>
        <el-table-column label="邮箱" prop="email"></el-table-column>
        <el-table-column label="电话" prop="mobile"></el-table-column>
        <el-table-column label="角色" prop="role_name"></el-table-column>
        <el-table-column label="状态" prop="mg_name">
          <!-- 通过作用域插槽就可以 scope.row -->
          <template slot-scope="scope">
            <!-- 开关按钮插件 通过scope.row.mg_name 关联绑定 -->
            <el-switch
              v-model="scope.row.mg_name"
              @change="userStateChaged(scope.row)"
            ></el-switch>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="180px">
          <template slot-scope="scope">
            <!-- 开关按钮插件 通过scope.row.mg_name 关联绑定 -->
            <!-- 修改 -->
            <el-button
              type="prmary"
              icon="el-icon-edit"
              @click="showEditDialog(scope.row.id)"
              size="mini"
            ></el-button>
            <!-- 删除 -->
            <el-button
              type="danger"
              icon="el-icon-delete" @click="removeUserById(scope.row.id)"
              size="mini"
            ></el-button>
            <!-- 分配角色 -->
            <el-tooltip
              style="margin-left:8px;"
              effect="dark"
              content="分配角色"
              placement="top"
              :enterable="false" @click="setRole(scope.row)"
              ><el-button
                type="warning"
                icon="el-icon-setting"
                size="mini"
              ></el-button
            ></el-tooltip>
          </template>
        </el-table-column>
      </el-table>
      <!-- 分页 -->
      <el-pagination
        style="margin-top:10px;"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="queryInfo.pagenum"
        :page-sizes="[1, 2, 3, 4, 10]"
        :page-size="queryInfo.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="400"
      >
      </el-pagination>
    </el-card>
    <!-- 添加用户对话框 -->
    <el-dialog
      title="添加用户"
      :visible.sync="addDialogVisible"
      @close="addDialogClosed"
      width="30%"
    >
      <!-- 对话框内容 -->
      <el-form
        :model="addForm"
        :rules="addFormRules"
        ref="addFormRef"
        label-width="70px"
      >
        <el-form-item label="用户" prop="username">
          <el-input v-model="addForm.username"></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input v-model="addForm.password"></el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="addForm.email"></el-input>
        </el-form-item>
        <el-form-item label="手机" prop="mobile">
          <el-input v-model="addForm.mobile"></el-input>
        </el-form-item>
      </el-form>
      <!-- 底部区域 -->
      <span slot="footer" class="dialog-footer">
        <el-button @click="addDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addUser">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 修改对话框 -->
    <el-dialog
      title="修改用户"
      :visible.sync="editDialogVisible"
      width="30%"
      @close="editDialogClosed"
    >
      <el-form
        :model="editForm"
        :rules="editFormRules"
        ref="editFormRef"
        label-width="70px"
      >
        <el-form-item label="用户名">
          <el-input v-model="editForm.username" disabled></el-input>
        </el-form-item>
        <el-form-item label="邮箱">
          <el-input v-model="editForm.email" prop="email"></el-input>
        </el-form-item>
        <el-form-item label="手机号">
          <el-input v-model="editForm.mobile" prop="mobile"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="editUserInfo(scope.row)"
          >确 定</el-button
        >
      </span>
    </el-dialog>
    <!-- 分配角色对话框 -->
      <el-dialog
      title="提示" @close="setRoleDialogClosed"
      :visible.sync="stRoleDialogVisble"
      width="30%">
      <div>
        <p>当前用户: {{userInfo.username}}</p>
        <p>当前角色: {{userInfo.role_name}}</p>
        <p>分配新角色:   <el-select v-model="selectedRoleId" placeholder="请选择">
    <el-option
      v-for="item in rolesList"
      :key="item.id"
      :label="item.roleName"
      :value="item.id">
    </el-option>
  </el-select></p>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="stRoleDialogVisble = false">取 消</el-button>
        <el-button type="primary" @click="saveRoleInfo">确 定</el-button>
      </span>
    </el-dialog>

  </div>
</template>

<script>
export default {
  data() {
    //验证邮箱
    var checkEmail = (rule, value, cb) => {
      //
      const regEamil = /^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+(\.[a-zA-Z0-9_-])+/
      if (regEamil.test(value)) {
        //正则text.value值
        return cb()
      }
      cb(new Error('请输入合法邮箱'))
    }
    //验证手机号
    var checkMobile = (rule, value, cb) => {
      const regMobile = /^(0|86|17951)?(13[0-9]|15[012356789]|17[678]|18[0-9]|14[57])[0-9]{8}$/
      if (regMobile.test(value)) {
        return cb()
      }
      cb(new Error('请输入合法手机号'))
    }
    return {
      //获取用户列表参数对象
      queryInfo: {
        query: '', //字符串
        pagenum: 1, //第几页条数据
        //当前每页显示多少条数据
        pagesize: 2 //显示二十条数据
      },
      userlist: [], //我们的数据获成功了并且保存到这里
      taotal: 0,
      addDialogVisible: false, //控制对话框的行为区域
      addForm: {
        //添加用户表单数据
        username: '',
        password: '',
        email: '',
        mobile: ''
      },
      addFormRules: {
        //表单验证规则
        username: [
          { required: true, message: '请输入用户名', trigger: 'blur' },
          { min: 3, max: 10, message: '用户名长度3~10个字符', trigger: 'blur' }
        ],
        password: [
          { required: true, message: '请输入密码', trigger: 'blur' },
          { min: 6, max: 15, message: '用户名长度6~15个字符', trigger: 'blur' }
        ],
        email: [
          { required: true, message: '请输入邮箱', trigger: 'blur' },
          { validator: checkEmail, trigger: 'blur' }
        ],
        mobile: [
          { required: true, message: '请输入手机号', trigger: 'blur' },
          { validator: checkMobile, trigger: 'blur' }
        ]
      },
      editDialogVisible: false, //修改控制用户对话框的显示隐藏
      editForm: {}, //查询到的用户信息对象
      editFormRules: {
        //修改验证规则对象
        email: [
          { reqwuired: true, message: '用户邮箱', trigger: 'blur' },
          { validator: checkEmail, trigger: 'blur' }
        ],
        mobile: [
          { reqwuired: true, message: '用户手机号', trigger: 'blur' },
          { validator: checkMobile, trigger: 'blur' }
        ]
      },//控制分配角色对话框的显示隐藏
      stRoleDialogVisble: false,
      //需要被分配角色的用户信息
      userInfo:{},
      //所有角色数据列表
      rolesList:[],
      // 已选中角色id
      selectedRoleId:''
    }
  },
  created() {
    this.getUserList() //调用这个请求
  },
  methods: {
    //在定义请求数据
    async getUserList() {
      //函数  请求方法get 参数params
      const { data: res } = await this.$http.get('users', {
        params: this.queryInfo
      })
      console.log(res)
      if (res.meta.status !== 200) {
        return this.$message.error('获取用户列表失败')
      }
      //拿到数据成功后 我们给列表 users taotal赋值 返回过来的数据一定要核实
      this.userlist = res.data.users
      this.taotal = res.data.taotal
      console.log(res)
    },
    handleSizeChange(newSize) {
      //监听 pagesize改变事件 通过参数监听
      // console.log(newSize) //我们通过这个监听事件我们找到它点击并且发生的变化在赋值给它并更新
      this.queryInfo.pagesize = newSize
      this.getUserList()
    },
    handleCurrentChange(newPage) {
      // console.log(newPage)
      this.queryInfo.pagenum = newPage
      this.getUserList()
    },
    async userStateChaged(userinfo) {
      //监听 switch 开关状态的改变
      console.log(userinfo) //我们通过userinfo这个属性找到id 并且找到 状态
      const { data: res } = await this.$http.put(
        'users/{userinfo.id}/state/${userinfo.mg_state}'
      )
      if (res.meta.status !== 200) {
        //判断我们找到这个状态是否 !==200
        userinfo.mg_state = !userinfo.mg_state //如果是取反
        return this.$message.error('更新失败！') //如果不是我们更新失败提示
      }
      this.$message.success('更新用户状态成功')
    },
    addDialogClosed() {
      //监听对话框关闭事件  拿到表单ref的引用拿到表单的
      this.$refs.addFormRef.resetFields()
    },
    //表单的预校验 拿到整个表单的数据对象
    addUser() {
      this.$refs.addFormRef.validate(async valid => {
        if (!valid) reuturn //可以发起添加用户的网络请求
        const { data: res } = await this.$http.post('users', this.addForm) //请求路径和表单绑定数据
        if (res.meta.status !== 201) {
          this.$message.error('添加用户失败！')
        }
        this.$message.success('添加用户成功') //提示成功
        this.addDialogVisible = false //关闭对话框
        this.getUserList()
      })
    },
    async showEditDialog(id) {
      //展示编辑对话框
      // console.log(id)
      const { data: res } = await this.$http.get('users/' + id)
      if (res.meta.status !== 200) {
        return this.$message.error('查询用户信息失败')
      }
      this.editForm = res.data
      this.editDialogVisible = true
    },
    editDialogClosed() {
      //监听修改对话框的关闭事件
      this.$refs.editFormRef.resetFields()
    },
    //修改用户信息
    editUserInfo() {
      this.$refs.editFormRef.validate(async valid => {
        if (!valid) return //发起修改用户信息
         const {data:res} = await this.$http.put('users/' + this.editForm.id,
        {
          email: this.editForm.email,
          mobile: this.editForm.mobile
        })
        if(res.meta.status !== 200){
          return this.$message.error("更新用户失败")
        }
        //关闭对话框
          this.editDialogVisible = false 
          //刷新数据列表
          this.getUserList() 
          this.$message.success('更新用户信息成功')
      })
    },
    async removeUserById(id){//删除id对应信息
      //弹框询问用户是否删除数据
        const confirmResult = await this.$confirm('此操作将永久删除该用户, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).catch(err => err) //接收捕获
        //如果用户确认删除则返回值为字符串confirm
        //如果用户取消删除 则字符串返回值为字符串cancel
        if(confirmResult !== 'confirm'){
          return tisd.$messge.info('已经取消删除')
        }
       const {data:res} = await this.$http.delete('users/'+ id)
       if(res.meta.status !== 200){
         return this.$message.error('删除用户失败')
       }
       this.$message.success('删除用户成功！')
       this.getUserList()
  },
     async setRole(userInfo) {//展示分配对话框
        this.userInfo = userInfo
        //展示对话框之前获取所有角色列表
        const {data:res} = await this.$http.get('roles')
        if(res.meta.status !== 200) {
          return this.$message.error('获取角色列表失败')
        }
        this.rolesList = res.data
        this.stRoleDialogVisble = true
      },
     async saveRoleInfo(){
          if(!this.selectedRoleId){
            return this.$message.error('请选择角色')
          }
          const {data:res} = await this.$http.put(`users/${this.userInfo.id}/role`,{
            rid: this.selectedRoleId
          })
          if(res.meta.status !== 200){
            return this.$message.error('更新角色失败')
          }
          this.$message.success('更新成功')
          this.getUserList()
          this.stRoleDialogVisble = false
      },
      setRoleDialogClosed() {
        this.selectedRoleId = ''
        this.userInfo = {}
      }

  }
}
</script>

<style lang="less" scope>
.card {
  padding: 25px;
}
.el-table {
  margin-top: 5px;
  font-size: 10px;
}
</style>
