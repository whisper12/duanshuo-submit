<template>
  <div class="wrap">
    <el-upload
      class="avatar-uploader"
      :action="target + '/story/upload_photo'"
      :show-file-list="false"
      name='photo'
      :data="seriesData"
      :with-credentials="true"
      :http-request="uplpadDiyPhoto">
      <img v-if="imageUrl" :src="imageUrl" class="avatar">
      <i v-else class="el-icon-plus avatar-uploader-icon"></i>
    </el-upload>
    <el-button type="primary" @click="showDefault">选择默认头像</el-button>
    <el-tag class="name">{{photoName}}</el-tag>

    <el-dialog title="" :visible.sync="defaultVisible" size="normal" :modal="false">
      <div class="default-avatar-wrap">
        <div>
          <img :src="item" v-for="(item,index) in actorAvatar" class="avatar" @click="chooseAvatar(index)">
        </div>
      </div> 
    </el-dialog>
  </div>
</template>

<script>
import default1 from '../assets/avatar/女6.png'
import default2 from '../assets/avatar/女5.png'
import default3 from '../assets/avatar/男5.png'
import default4 from '../assets/avatar/男6.png'
import default5 from '../assets/avatar/女3.png'
import default6 from '../assets/avatar/女4.png'
import default7 from '../assets/avatar/男4.png'
import default8 from '../assets/avatar/男3.png'
import default9 from '../assets/avatar/女2.png'
import default10 from '../assets/avatar/女1.png'
import default11 from '../assets/avatar/男1.png'
import default12 from '../assets/avatar/男2.png'
import {target,imgUrl} from '../mixin/config.js'
  export default {
    props:{
      seriesId:{
        type:''
      },
      storyId:{
        type:''
      },
      photoName:{
        type:''
      }
    },
    data() {
      return {
        imageUrl: '',
        target:target,
        defaultVisible:false,
        seriesData:{
          'actorName':'',
          'storyId':'',
          'photoType':2
        },
        header:{
          'Content-Type':'multipart/form-data'
        },
        actorAvatar:[default1,default2,default3,default4,default5,default6,default7,default8,default9,default10,default11,default12]        
      };
    },
    mounted:function(){
      this.seriesData.actorName = this.photoName
    },
    watch:{
      storyId(){
        this.seriesData.storyId = this.storyId
        return storyId
      }
    },
    methods: {
      handleAvatarSuccess(res, file) {
        this.imageUrl = URL.createObjectURL(file.raw);
        this.$message({'message':'上传图片成功','type':'success'})
      },
      showDefault(){
        this.defaultVisible=true
      },
      chooseAvatar(index){
        this.imageUrl = this.actorAvatar[index];
        index++
        this.defaultVisible=false
        let data ={
          storyId:this.seriesData.storyId,
          actorPhoto:[{
            actorName:this.seriesData.actorName,
            photoNum:index
          }]
        }
        let header = {'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8'}
        this.axios.post(`${target}/story/upload_default_photo`,data,{'withCredentials':true,'headers':header})
        .then(res=>{
          if(res.data.retCode==0){
            this.$message({'message':'上传图片成功','type':'success'})
          }else{
            this.$message({'message':'上传图片失败','type':'error'})
          }
        })
      },
      uplpadDiyPhoto(e){
        console.log(e)
        let data = new FormData()
        data.append('photo',e.file)
        data.append('actorName',e.data.actorName)
        data.append('photoType',2)
        data.append('storyId',e.data.storyId)
        this.axios.post(`${target}/story/upload_photo`,data,{'withCredentials':true})
        .then(res=>{
          if(res.data.retCode==0){
            this.$message({'message':'上传图片成功','type':'success'})
            let photoUrl = res.data.result.photoUrl
            this.imageUrl = imgUrl+photoUrl
          }else{
            this.$message({'message':'上传图片失败','type':'error'})
          }
        })        
      }      
    }
  }
</script>

<style scoped>
.wrap{
  display: inline-block;
  text-align: center;
  margin-left:20px;
}
.avatar-uploader{
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
  width: 80px;
  height: 80px;
  margin-left: 20px;
  box-sizing: border-box;
  margin-bottom: 10px;
}
.avatar-uploader:hover {
  border-color: #20a0ff;
}
.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 80px;
  height: 80px;
  line-height: 80px;
  text-align: center;
}
.avatar {
  width: 80px;
  height: 80px;
  display: block;
}
.name{
  margin-top: 10px;
  display: block;
}
.default-avatar-wrap{
  width: 200px;
  height: 200px;
  /*position: absolute;*/
  /*background: red;*/
  top: 0;
  left: 0;
}
.avatar{
  width: 50px;
  height: 50px;
  display: inline-block;
  margin-top:10px;
  padding: 5px;
  box-sizing: border-box;
  cursor: pointer;
}
</style>
