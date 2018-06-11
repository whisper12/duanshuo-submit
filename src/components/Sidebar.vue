<template>
    <el-row class="tac">
      <el-col :span="3">
        <el-menu :default-active="index" class="el-menu-vertical-demo" theme="dark">
          <el-submenu index="1">
            <template slot="title">待审核</template>
              <router-link to="/"> <el-menu-item index="1-1">待审核系列</el-menu-item></router-link>
              <router-link to="/storyPending"><el-menu-item index="1-2">待审核章节</el-menu-item></router-link>
              <router-link to="/ConstoryPending"><el-menu-item index="1-3">续写章节</el-menu-item></router-link>
          </el-submenu>        
          <el-submenu index="2">
            <template slot="title">未通过审核</template>
              <router-link to="/msgReject"><el-menu-item index="2-1">未通过系列</el-menu-item></router-link>
              <router-link to="/storyReject"><el-menu-item index="2-2">未通过章节</el-menu-item></router-link>
          </el-submenu>  
          <el-submenu index="3">
            <template slot="title">线上短说</template>
              <router-link to="/msgPassing"><el-menu-item index="3-1">线上系列</el-menu-item></router-link>
              <router-link to="/storyPassing"><el-menu-item index="3-2">线上章节</el-menu-item></router-link>
              <router-link to="/ConstoryPassing"><el-menu-item index="3-3">续写章节</el-menu-item></router-link>
          </el-submenu>
          <el-submenu index="4">
            <template slot="title">官方短说</template>
              <router-link to="/msgOwnPassing"><el-menu-item index="4-1">所有系列</el-menu-item></router-link>
              <router-link to="/storyOwnPassing"><el-menu-item index="4-2">所有章节</el-menu-item></router-link>
          </el-submenu>  
           <el-menu-item index="5" @click="changeVisible()">提交新短说</el-menu-item>
           <el-menu-item index="6" @click="logOut()">退出登录</el-menu-item>
        </el-menu>
      </el-col>

    </el-row>
</template>

<script>
import {target} from '../mixin/config.js' 
  export default {
    name:'SideBar',
    props:{
      index:{
        type:''
      }
    },
    methods:{
      changeVisible(){
        this.$store.dispatch('setsubmitVisible',true)        
      },
      logOut(){
        let url = `${target}/logout`
        this.axios.get(url)
        .then(res=>{
          if(res.data.retCode==0){
            this.$message({message:'退出成功',type:'success'})
            this.$router.push({path:'/login'})
          }else{
            this.$message({message:'退出异常',type:'error'})
          }
        })
        .catch(res=>{this.$message({message:'退出异常',type:'error'})})
      }
    }
  }
</script>

<style scoped>
.wrap{
  height: 100%;
}
.wrap .tac,
.wrap .el-col-3,
.el-menu{
  height: 100%;
}
.el-menu{
  padding-top: 80px;
  width: 100%;
  box-sizing: border-box;
   overflow-y: scroll;
}
.el-menu-item{
  width: 100%;
}
.item-wrap{
  position: absolute;
  top: 0;
  left: 8.3333333333%;
  right: 0;
  bottom: 0;
  overflow: scroll;
}
</style>
