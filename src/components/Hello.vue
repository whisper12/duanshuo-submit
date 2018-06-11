<template>
  <div class="hello">
    <form>
      <div class="series">
        <select v-model="data.series.fkCategoryId">
          <option value='' disabled selected style='display:none;'>文章分类</option> 
          <!-- <option value="1">首页</option> -->
          <option value="2">浪漫</option>
          <option value="3">戏剧</option>
          <option value="4">恐怖惊悚</option>
          <option value="5">科幻幻想</option>
          <option value="6">推理</option>
          <option value="7">超自然</option>
          <option value="8">搞笑</option>
        </select>
<!--         <select v-model="data.series.charge">
           <option value='' disabled selected style='display:none;'>不收费</option> 
          <option value="0">不收费</option>
          <option value="1">收费</option>
        </select> -->
        <span>封面图片(尺寸:500x660,大小200KB-400KB):</span>
        <form method="POST" enctype="multipart/form-data;charset=utf-8"  @submit.prevent="submit" name="cover" id="cover" style="display:inline-block">
          <input type="file" name="photo" id="photo" style="width:200px" @change="uploadCover()" ref="inputer"  accept="image/gif,image/jpeg,image/jpg,image/png,image/svg">
        </form>
        <input type="text" name="" placeholder="作者" v-model="data.series.author">
        <input type="text" name="" placeholder="系列名" v-model="data.series.title">
        <input type="text" name="" placeholder="简介" v-model="data.series.introduction">
        <!-- <input type="number" name="" placeholder="当前录入章节(数字)" v-model="data.story.episode" style="width:150px;" min="0"> -->
      </div>

      <div class="story">
        <input type="number" name="" placeholder="当前录入章节(数字)" v-model="data.story.episode" style="width:150px;">
<!--         <select v-model="data.story.charge">
          <option value='' disabled selected style='display:none;'>不收费</option> 
          <option value="0">不收费</option>
          <option value="1">收费</option>
        </select> -->
<!--         <input type="text" name="" placeholder="故事图片(格式同上)" style="width:300px" v-model="data.story.cover"> -->
        <!-- <input type="text" name="" placeholder="作者" v-model="data.story.author"> -->
        <input type="text" name="" placeholder="章节名" v-model="data.story.title" style="width:200px;">
        <!-- <input type="text" name="" placeholder="简介" v-model="data.story.introduction"> -->
      </div>

      <div>
        <template>
          <el-radio class="radio" v-model="data.story.isAppend" label="false">他人不可续写</el-radio>
          <el-radio class="radio" v-model="data.story.isAppend" label="true">他人可续写</el-radio>
        </template>        
      </div>
      <ul class="element">
        <li v-for="(item,index) in data.element" :key="index">
          <span>{{index+1}}</span>
          <span class="incre" @click="incre(index)" v-if="data.element.length!=1">-</span>
          <select v-model="item.elementCategory">
            <option value='' disabled selected style='display:none;'>选择场景元素</option> 
            <option value="1">场景</option>
            <option value="2">旁白</option>
            <option value="3">人物</option>
            <option value="4">图片</option>
          </select>
        <select v-model="item.charge">
          <option value='' disabled selected style='display:none;'>不收费</option> 
          <option value="0">不收费</option>
          <option value="1">收费</option>
        </select>
          <input type="text" name="" placeholder="角色名称(元素不为人物的话为空)" style="width:200px" v-model="item.actor">
          <input type="text" name="" placeholder="内容" style="width:550px;" v-model="item.content">
          <span class="add" @click="add(index)">+</span>
        </li>
      </ul>
    </form>
    <p>*****************多余的行请删除*****************<p>
    <div class="submit">
      <span class="wrapper">
        <el-button @click="submitVisible()">取消</el-button>
        <el-button type="primary" @click="submit()" :loading="isSubmiting">提交</el-button>
      </span>
    </div>
    <div style="margin-top:20px;">
    <span>选择Excel文件:</span>
      <input type="file" multiple="false" id="sheetjs-input" :accept="SheetJSFT" @change="onchange" style="width:300px;">
      <br/>
      <br/>
      <div id="out-table"></div>
    </div>
    <p v-if="loading" style="color:red">文件解析中，请勿操作页面</p>
    <uploadActor :seriesId="seriesId" :storyId="storyId" v-for="item in actorList" :photoName="item"></uploadActor v-if="showActorList||storyId!==''" :key="index">
    <el-button type="primary" class="uploadComplete" v-if="showActorList" @click="uploadComplete()">完成头像上传</el-button>
  </div>
</template>

<script>
import XLSX from 'xlsx'
// import sheet from './sheet'
import {target} from '../mixin/config.js'
import uploadActor from './uploadActor.vue'
export default {
  name: 'hello',
  components:{
    uploadActor:uploadActor
  },
  data () {
    return {
      loading: false,
      isSubmiting:false,
      showActorList:false,
      hasEncode:false,
      SheetJSFT :["xlsx", "xlsb", "xlsm", "xls"].map(function(x) { return "." + x; }).join(","),
      sheetData:'',
      data:{
        'series':{
          'fkCategoryId':'',
          'charge':'0',
          'cover':'',
          'author':'',
          'title':'',
          'introduction':'',
          'fkStoryId':''
        },
        'story':{
          'episode':'',
          'charge':'0',
          'cover':'',
          'author':'',
          'title':'',
          'introduction':'',
          'attribute03':window.sessionStorage.uploadAuthor,
          'isAppend':'false'
        },
        'element':[{
          'lineNum':'',
          'elementCategory':'',
          'charge':'0',
          'actor':'',
          'content':''
        }]
      },
      storyId:'',
      seriesId:'',
      actorList:[]
    }
  },
  computed:{
    size(){
      return this.data.element.length
    }
  },
  methods:{
    incre:function(e){
      this.data.element.splice(e,1)
      // this.size--
    },
    add:function(e){
      // console.log(e)
      let index = e+1
      let data =  {
        'lineNum':'',
        'category':'',
        'charge':'',
        'actor':'',
        'content':''
      }
      this.data.element.splice(index,0,data)
      // this.size++
    },
    submit(){
      let data = this.data
      let length = data.element.length
      for(let item in data.series){
        if(!data.series[item]&&item!='fkStoryId'){
          this.$message({'message':'请填写完整的小说封面信息','type':'warning'})
          return
        }
      }
      if(!data.story.episode){
        this.$message({'message':'请填写章节数','type':'warning'})
        return
      }
      if(!data.story.title){
        this.$message({'message':'请填写章节名','type':'warning'})
        return
      }      
      // for(let item in data.story){
      //   if(!data.story[item]){
      //     alert('请填写完整的章节信息')
      //     return
      //   }
      // }      
      for(let i = 1;i<=length;i++){
        data.element[i-1].lineNum=i
        if (!data.element[i-1].content) {
          this.$message({'message':'所有对话内容不能为空，请检查对话内容','type':'warning'})
          return
        }else{
          if(data.element[i-1].actor){
            this.addActor(data.element[i-1].actor)
          }
          if(this.hasEncode===false){
            data.element[i-1].content=encodeURIComponent(data.element[i-1].content)
          }
        }
      }
      // if(!data.series.cover.match('https://img.pipi.cn/movies/300X400/juhe/')){
      //   data.series.cover = 'https://img.pipi.cn/movies/300X400/juhe/' + data.series.cover
      // }
      // data.series.recomand = ''
      data.story.cover = data.series.cover
      data.story.author = data.series.author
      data.story.title = data.series.title
      data.story.introduction = data.series.introduction
      console.log(this.data)
      // return
      // data='data=' + JSON.stringify(data)
      let header = {'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8'}
      if(confirm('确定提交文章?')){
      this.isSubmiting=true
      this.hasEncode=true
      this.axios.post(`${target}/story/upload`,data,{'headers':header,'withCredentials':true})
        .then( res=>{
          this.isSubmiting=false
          // console.log(res.data.retCode)
          if(res.status==404||res.status==500){
            this.$message({'message':'文章上传失败,404,500','type':'error'})
            this.actorList=[]
            this.showActorList = false
            return
          }
          if (res.data.retCode==0) {
            this.$message({'message':'文章提交成功','type':'success'})
            this.seriesId = res.data.result.seriesId
            this.storyId = res.data.result.storyId
            this.showActorList = true
            this.clearContent()
          } else if(res.data.retCode==120){
            this.actorList=[]
            this.showActorList = false
            this.$message({message:'请先登录',type:'warning'})
            this.$router.push({path:'/login'})
          }else{
            this.actorList=[]
            this.showActorList = false
            this.$message({'message': res.data.retMsg,'type':'error'})
          }
        })
        .catch( error=>{
          this.isSubmiting=false
          console.log(error)
          this.$message({'message':'服务器异常','type':'error'})
        })        
      }
    },
    s2ab:function(s){
      if(typeof ArrayBuffer !== 'undefined') {
        let buf = new ArrayBuffer(s.length);
        let view = new Uint8Array(buf);
        for (let i=0; i!=s.length; ++i) view[i] = s.charCodeAt(i) & 0xFF;
        return buf;
      } else {
        let buf = new Array(s.length);
        for (let i=0; i!=s.length; ++i) buf[i] = s.charCodeAt(i) & 0xFF;
        return buf;
      }      
    },
    onchange: function(evt) {
      this.actorList=[]
      this.showActorList = false
      let _this =this
      let reader = new FileReader();   
      _this.data.element = [{
            'lineNum':'',
            'elementCategory':'',
            'charge':'',
            'actor':'',
            'content':''
          }]   
      reader.onload = function (e) {   
        _this.loading=true
        _this.data.element=[]
        let bstr = e.target.result;
        let wb = XLSX.read(bstr, {type:'binary'});

        let wsname = wb.SheetNames[0];
        let ws = wb.Sheets[wsname];

        let HTML = XLSX.utils.sheet_to_json(ws); 
        // console.log(HTML)
        for(let i=0;i<HTML.length;i++){
          let _data =  {
            'lineNum':'',
            'elementCategory':'',
            'charge':'',
            'actor':'',
            'content':''
          }               
          _data.elementCategory=HTML[i]['分类']
          _data.charge=(HTML[i]['收费']?1:0)
          _data.actor=(HTML[i]['角色']?HTML[i]['角色']:'')
          _data.content=(HTML[i]['内容']?HTML[i]['内容']:'')
          _this.data.element.push(_data)
        }
        _this.loading=false
      };

      reader.readAsBinaryString(evt.target.files[0]);
    },
    uploadCover:function(){
      let data = new FormData(document.getElementById('cover'))
      data.append('photoType',1)
      let inputDOM = this.$refs.inputer
      let _this = this
      if (!inputDOM.files.length) {
        return
      }else if(inputDOM.files[0].size>409600){
        alert('图片大小请控制在400KB之内')
        return
      }
      this.axios.post(`${target}/story/upload_photo`,data,{'withCredentials':true})
        .then(res=>{
          console.log(res)
          let result = res.data
          if(result.retCode==0){
            this.$message({'message':'封面图片上传成功','type':'success'})
            _this.data.series.cover = result.result.photoUrl
          }else if(result.retCode==5){
            this.$message({'message':'无效的图片格式','type':'error'})
          }else if(result.retCode==120){
            this.$message({'message':'请先登录','type':'error'})
            this.$router.push({path:'/login'})
          }else if(res.data.retCode==110){
            this.$message({'message':'此账号无上传文章权限','type':'error'})
          }else{
            this.$message({'message':'上传异常','type':'error'})
          }
        })
        .catch(error=>{
          this.$message({'message':'服务器异常','type':'error'})
          console.log(error)
        })
    },
    clearContent:function(){
      this.data.element= [{
          'lineNum':'',
          'category':'',
          'charge':'0',
          'actor':'',
          'content':''
        }]
    },
    submitVisible(){
      this.$store.dispatch('setsubmitVisible',false)
    },
    handleRemove(file, fileList) {
      console.log(file, fileList);
    },
    handlePictureCardPreview(file) {
      this.dialogImageUrl = file.url;
      this.dialogVisible = true;
    },
    handleAvatarSuccess(res, file) {
        this.imageUrl = URL.createObjectURL(file.raw);
    },
    addActor(actor){
      if(this.actorList.indexOf(actor)===-1){
        this.actorList.push(actor)
      }
    },
    uploadComplete(){
      this.actorList=[]
      this.showActorList = false
      this.$message({'message':'文章已完整上传成功','type':'success'})
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
input[type="text"],
input[type="number"]{
  border:1px solid #999;
}
h1, h2 {
  font-weight: normal;
}

ul {
  list-style-type: none;
  padding: 0;
}

li {
  display: inline-block;
  margin: 0 10px;
}

a {
  color: #42b983;
}

.series,
.story,
.element .li{
  white-space: nowrap;
}

.story{
  margin:20px 0;
}

input{
  width: 100px;
}

/*.submit span{
  display: inline-block;
  width: 100px;
  height: 50px;
  background: #5b7efe;
  line-height: 50px;
  color: #fff;
  font-size: 24px;
  border-radius: 10px;
  cursor: pointer;
}*/
.incre,
.add{
  display: inline-block;
  color: #fff;
  padding: 5px;
  border-radius: 50%;
  width: 10px;
  height: 10px;
  line-height: 10px;
  cursor: pointer;
}
.incre{
  background: red;
}
.add{
  background: green;
}
input::-webkit-outer-spin-button,
input::-webkit-inner-spin-button {
    -webkit-appearance: none !important;
    margin: 0;
}
.grid1 {
  width: 500px;
  height: 400px;
}
.uploadComplete{
  display: block;
  margin: 0 auto;
  margin-top: 20px;
}
</style>
