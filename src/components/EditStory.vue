<template>
  <div class="hello">
    <form>
      <div class="series">
        <div>
          <span>封面图片(若不改可不选择):</span>
          <!-- <form method="POST" enctype="multipart/form-data;charset=utf-8"  @submit.prevent="submit" name="cover" id="cover" style="display:inline-block"> -->
            <input type="file" name="photo" id="photo" style="width:200px" ref="inputer"  accept="image/gif,image/jpeg,image/jpg,image/png,image/svg" >
          <!-- </form> -->
        </div>
<!--         <div>
          <img :src="imgUrl1" style="width:200px">
        </div> -->
        <div>
         <span>作者</span>
         <el-input type="text" name="" placeholder="作者" v-model="data.author"></el-input>
        </div>
        <div>
          <span>章节名</span>
          <el-input type="text" name="" placeholder="章节名" v-model="data.title"></el-input>
        </div>
        <div>
          <span>简介</span>
          <el-input type="text" name="" placeholder="简介" v-model="data.introduction"
          style="width:400px"
          ></el-input>
        </div>
      </div>
    </form>

    <div class="submit">
      <span class="wrapper">
        <el-button type="primary" @click="submit()" :loading="isSubmiting">提交</el-button>
      </span>
    </div>

  </div>
</template>

<script>
import {target,imgUrl} from '../mixin/config.js'
export default {
  name: 'editStory',
  props:{
    elementInfo:{
      type:Array
    },
    editCB:{
      type:Function
    }
  },
  data () {
    return {
      isSubmiting:false,
      originData:{},
      data:{
        'id':'',
        'cover':'',
        'author':'',
        'title':'',
        'introduction':'',
        'fkSeriesId':'',
        'isAppend':false
      }
    }
  },
  computed:{
    imgUrl1(){
      // return imgUrl+(this.data.cover?this.data.cover:this.originData.cover)
    }
  },
  mounted:function(){
    this.originData = this.elementInfo[0]
    this.data.author = this.elementInfo[0].author
    this.data.title = this.elementInfo[0].title
    this.data.introduction = this.elementInfo[0].introduction
    this.data.id = this.elementInfo[0].id
    this.data.fkSeriesId = this.elementInfo[0].fkSeriesId
    if(this.originData.status==3){
      this.data.isAppend = false
    }else if(this.originData.status==7){
      this.data.isAppend = true
    }
  },
  methods:{
    submit(){
      let data = Object.assign({},this.data)
      for(let item in data){
        if(!data[item]&&item!='cover'&&item!='isAppend'){
          this.$message({'message':'请填写完整的章节封面信息','type':'warning'})
          console.log(item)
          return
        }
      }
      let _data = new FormData()
      _data.append('id',data.id)
      _data.append('title',data.title)
      _data.append('author',data.author)
      _data.append('introduction',data.introduction)
      _data.append('fkSeriesId',data.fkSeriesId)
      _data.append('cover',this.originData.cover)
      _data.append('isAppend',this.data.isAppend)
      this.$refs.inputer.files[0]&&_data.append('photo',this.$refs.inputer.files[0])
      let header = {'Content-Type': 'multipart/form-data;charset=utf-8'}
      this.isSubmiting=true
      this.axios.post(`${target}/story/update_story`,_data,{'headers':header})
        .then( res=>{
          this.isSubmiting=false
          if(res.status==404||res.status==500){
            this.$message({'message':'章节信息修改失败,404,500','type':'error'})
            return
          }
          if (res.data.retCode==0) {
            this.$message({'message':'章节信息修改成功','type':'success'})
            this.editCB()
          }else{
            this.$message({'message':'章节信息修改失败','type':'error'})
          }
        })
        .catch( error=>{
          this.isSubmiting=false
          console.log(error)
          this.$message({'message':'章节信息修改失败','type':'error'})
        })        
    },
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
  /*display: inline-block;*/
  /*margin: 0 10px;*/
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

.series div div{
  width: 200px;
}
.series div{
  margin-bottom: 5px;
}
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
};
</style>
