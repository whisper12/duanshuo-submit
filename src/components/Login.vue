<template>
  <div class="wrap">
    <el-dialog size="tiny" :show-close="false" :visible.sync="visible" :close-on-press-escape="false" :close-on-click-modal="false" title="文章管理系统">
      <el-input v-model="id" placeholder="账号" class="input"></el-input>
      <el-input v-model="psw" placeholder="密码" class="input" type="password"></el-input>
      <el-button size="large" type="primary" @click="login()">登录</el-button>
    </el-dialog>
  </div>
</template>

<script>
import {target} from '../mixin/config.js'
  export default {
    name:'login',
    data(){
      return{
        id:'',
        psw:'',
        visible:true,
        url:`${target}/login`
      }
    },
    methods:{
      login(){
        let data = `user=${this.id}&password=${this.psw}`
        if(this.id&&this.psw){
          this.axios.post(this.url,data)
           .then(res=>{
             if (res.data.retCode==0) {
              this.$message({
                message:'登录成功',
                type:'success'
              })
              window.sessionStorage.isLogin = true
              window.sessionStorage.uploadAuthor = res.data.result.user
              this.$router.push({path:'/'})
             }else{
              this.$message({
                message:'账户或密码错误',
                type:'error'
              })
             }
           })
           .catch(res=>{
            this.$message({message:'服务器异常',type:'error'})
           })          
        }else{
          this.$message({'message':'请填写账户和密码',type:'warning'})
        }
      }
    },
    created:function(){
      window.sessionStorage.isLogin=false
      window.sessionStorage.uploadAuthor=''
    }
  }
</script>

<style scoped>
.wrap{
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background:#324157;
}

.input{
  margin-bottom: 20px;
}
</style>
