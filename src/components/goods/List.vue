<template>
    <div>
          <!-- 面包屑导航区域 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>商铺列表</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card>
            <el-row :gutter="20">
                <el-col :span="8">
                    <el-input placeholder="请输入内容" v-model="queryInfo.query" clearable @clear="getGoodsList"><el-button slot="append" icon="el-icon-search" @click="getGoodsList"></el-button></el-input>
                </el-col>
                <el-col :span="4"><el-button type="primary" @click="goAddpage">添加商品</el-button></el-col>
            </el-row>
            <!-- table 表格区域 -->
             <template>
                   <!-- table表格区域 -->
                <el-table :data="goodslist" border stripe>
                    <el-table-column type="index"></el-table-column>
                    <el-table-column label="商品名称" prop="goods_name"></el-table-column>
                     <el-table-column label="商品价格(元)" prop="goods_price" width="95px"></el-table-column>
                    <el-table-column label="商品重量" prop="goods_weight" width="70px"></el-table-column>
                    <el-table-column label="创建时间" prop="add_time" width="180px">
                        <template slot-scope="scope">
                           {{scope.row.add_time | dataFormat}}
                        </template>
                    </el-table-column>
                    <el-table-column label="操作">
                        <template slot-scope="scope">
                          <el-button type="primary" size="mini" icon="el-icon-edit"></el-button>
                          <el-button type="danger"  size="mini" @click="removeById(scope.row.goods_id)" icon="el-icon-delete"></el-button>
                        </template>
                    </el-table-column>  
                </el-table>
        <!-- 分页 -->
            <div class="block">
            <el-pagination
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
            :current-page="queryInfo.pagenum"
            :page-sizes="[3,5, 10, 15]"
            :page-size="queryInfo.pagesize"
            layout="total, sizes, prev, pager, next, jumper"
            :total="total" background>
            </el-pagination>
                </div>
            </template>
     </el-card>            
    </div>
</template>
<script>
export default {
    data() {
        return {
            //查询
           queryInfo:{
            query:'',
            pagenum:1,
            pagesize:10
           },//商品分页
           goodslist:[],
           //总数据条数
           total:0
        }
    },
    created(){
        this.getGoodsList()
    },
    methods:{
          async getGoodsList(){
          const { data: res } = await this.$http.get('goods', {
        params: this.queryInfo})
           if(res.meta.status !== 200){
               return this.$message.error('获取商品列表')
           }
           this.$message.success('获取商品列表成功')
           this.goodslist = res.data.goods
           console.log(res.data)
           this.total = res.data.total
           }   ,
           handleSizeChange(newSize){
               this.queryInfo.pagesize = newSize
               this.getGoodsList()
           }     ,
            handleCurrentChange(newSize){
               this.queryInfo.pagenum = newSize
               this.getGoodsList()
           },
           async removeById(id){
              const confirmResult = await this.$confirm('删除该商品, 是否继续?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
                }).catch(err => err)
                if(confirmResult !== 'confirm'){
                    return this.$message.info('取消删除')
                }
                const {data:res} = await this.$http.delete(`goods/${id}`)
                 if(res.meta.status !== 200){
               return this.$message.error('删除失败')
                    }
                    this.$message.success('删除成功')
                   this.getGoodsList()

           },
           goAddpage(){
               this.$router.push(`/goods/add`)
           }
    }
}
</script>
<style lang="less" scoped>

</style>