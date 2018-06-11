<template>
  <div class="wrap">
    <div class="item-wrap">
      <el-checkbox-group v-model="checkList" v-if="checkListVisiable" style="display:inline-block">
        <el-checkbox label="官方短说"></el-checkbox>
        <el-checkbox label="用户短说"></el-checkbox>
      </el-checkbox-group>
      <el-select placeholder='筛选上传人' v-model="selectedAuthor" v-if="checkListVisiable">
        <el-option  
          v-for="item in userList"
          :key="item"
          :label="item"
          :value="item">
        </el-option>
      </el-select>           
      <el-table :data="tableData" border style="width: 100%">
        <el-table-column label="作者" width="180">
          <template scope="scope">
            <span style="margin-left: 10px">{{ scope.row.author }}</span>
          </template>
        </el-table-column>
        <el-table-column label="上传人" width="100" v-if="checkListVisiable">
          <template scope="scope">
            <span style="margin-left: 10px">{{ scope.row.attribute03 }}</span>
          </template>
        </el-table-column>        
        <el-table-column label="封面" width="100" v-if="type!='ConstoryPending'&&type!='ConstoryPassing'">
          <template scope="scope">
              <div slot="reference" class="name-wrapper">
                <img :src="imgDefault+scope.row.cover" @click="handlePictureCardPreview(scope.row.cover)" style="height:24px">
              </div>
          </template>
        </el-table-column>        
        <el-table-column label="章节数" width="100" 
        v-if="type!='ConstoryPending'&&type!='ConstoryPassing'">
          <template scope="scope">
              <div slot="reference" class="name-wrapper">
                <p>{{ scope.row.episode }}</p>
              </div>
          </template>
        </el-table-column>        
        <el-table-column label="章节名" 
        v-if="type!='ConstoryPending'&&type!='ConstoryPassing'">
          <template scope="scope">
              <div slot="reference" class="name-wrapper">
                <p>{{ scope.row.title }}</p>
              </div>
          </template>
        </el-table-column>
        <el-table-column label="被续写文章" v-if="type=='ConstoryPending'||type=='ConstoryPassing'">
          <template scope="scope">
              <div slot="reference" class="name-wrapper">
                <p>{{ scope.row.title }}</p>
              </div>
          </template>
        </el-table-column>        
        <el-table-column label="原因" width="180" v-if="type=='storyReject'">
          <template scope="scope">
              <div slot="reference" class="name-wrapper">
                <p>{{ scope.row.attribute04 }}</p>
              </div>
          </template>
        </el-table-column>
        <el-table-column label="状态" width="100">
          <template scope="scope">
            <el-tag type="success" v-if="scope.row.status==0||scope.row.status==5||scope.row.status==6">线上</el-tag>
            <el-tag type="danger" v-if="scope.row.status==1">已下架</el-tag>
            <el-tag type="warning" v-if="scope.row.status==2||scope.row.status==4">待审核</el-tag>
            <el-tag type="gray" v-if="scope.row.status==3||scope.row.status==7">未通过</el-tag>
          </template>
        </el-table-column>                          
        <el-table-column label="操作"> 
          <template scope="scope">
            <el-button size="small" @click="editSeries(scope.$index)"
            v-if="type=='storyReject'"
            >编辑</el-button>
            <el-button size="small" @click="pendingStory(scope.row.id,scope.$index,1,false)"
            v-if="scope.row.status!=2&&scope.row.status!==4"
            >查看</el-button>            
            <el-button 
            size="small" 
            type="danger" 
            @click="pendingStory(scope.row.id,scope.$index,1,true)" 
            v-if="scope.row.status==2||scope.row.status==4">审核</el-button>
            <el-button size="small" type="info" v-if="scope.row.status==1"
            @click="forSale(scope.$index,scope.row.id,0)"
            >上架</el-button>
            <el-button size="small" type="danger" v-if="scope.row.status==0"
            @click="forSale(scope.$index,scope.row.id,1)"
            >下架</el-button>
          </template>
        </el-table-column>
      </el-table>
      <span>当前页 {{page}} / {{DataCountPage}}</span>
      <el-button-group>
          <el-button type="primary" icon="d-arrow-left" :disabled="this.page==1" @click="getIndexPage()">第一页</el-button>
          <el-button type="primary" icon="arrow-left" :disabled="this.page==1" @click="fontPage()">上一页</el-button>
          <el-button type="primary" @click="nextPage()" :disabled="nextDisable">下一页<i class="el-icon-arrow-right el-icon--right"></i></el-button>
      </el-button-group>              
    </div>

    <el-dialog title="章节详情" :visible.sync="dialogTableVisible" size="large" 
    :modal-append-to-body="false" 
    :modal="type=='storyReject'||type=='storyPending'||type=='storyPassing'">
      <el-table :data="elementInfo">
        <el-table-column property="name" label="行数" width="100">
          <template scope="scope">
            <p>{{ scope.row.lineNum}}</p>
          </template>
        </el-table-column>      
        <el-table-column property="date" label="场景" width="100">
          <template scope="scope">
              <div slot="reference" class="name-wrapper">
                <el-tag>{{ ['场景','旁白','人物','图片'][scope.row.elementCategory-1] }}</el-tag>
              </div>
          </template>          
        </el-table-column>
        <el-table-column property="name" label="角色" width="150">
          <template scope="scope">
            <el-tag type="primary">{{ scope.row.actor}}</el-tag>
          </template>
        </el-table-column>
        <el-table-column property="address" label="内容">
          <template scope="scope">
            <span>{{ scope.row.content}}</span>
          </template>
        </el-table-column>
      </el-table>

      <el-button-group>
          <el-button type="primary" icon="d-arrow-left" :disabled="this.eleCurrentPage==1" @click="getIndexEle()">第一页</el-button>
          <el-button type="primary" icon="arrow-left" :disabled="this.eleCurrentPage==1" @click="fontEle()">上一页</el-button>
          <el-button type="primary" @click="nextEle()" :disabled="eleCurrentPage>=eleCountPage">下一页<i class="el-icon-arrow-right el-icon--right"></i></el-button>
        </el-button-group>  

      <el-input v-model="auditInfo" placeholder="审核结果说明（若通过则不需要，不通过需加以说明)"
      v-if="type!='storyReject'"
      ></el-input>

      <div class="block" style="margin-top:20px;">
        <span class="wrapper">
          <el-button @click="dialogTableVisible=false">取消</el-button>
          <el-button type="success" @click="getSeriesRes(elementInfo[0].fkStoryId,0,auditInfo,2)"
          v-if="pendingButton"
          >通过审核</el-button>
          <el-button type="danger"@click="getSeriesRes(elementInfo[0].fkStoryId,3,auditInfo,2)"
          v-if="pendingButton"
          >拒绝通过</el-button>
        </span>
      </div>      
    </el-dialog> 

    <el-dialog title="" :visible.sync="editVisible" size="large" 
    :modal-append-to-body="false"
    :modal="type!='storyPendingById'&&type!='storyPassingById'&&type!='storyRejectById'">
      <vedit v-if="editVisible" 
      :elementInfo="elementInfo"
      :editCB="editCB"
      ></vedit>
    </el-dialog>

    <el-dialog v-model="imgVisible" size="tiny"
    :modal-append-to-body="false"
    :modal="type!='storyPendingById'&&type!='storyPassingById'&&type!='storyRejectById'">
      <img width="100%" :src="dialogImageUrl" alt="">
    </el-dialog>

  </div>
</template>

<script>

import submit from './Hello.vue'
import edit from './EditStory.vue'
import mixin from '../mixin/mixin.js'
  export default {
    name:'expendStory',
    mixins:[mixin],
    props:{
      type:{
        type:''
      },
      seriesId:{
        type:''
      }
    },
    data() {
      return {
        dialogTableVisible: false,
        editVisible:false,
        eleCurrentPage:1,
        eleCountPage:'',
        pendingButton:false,
        userList:['all','qianxiaozeng','huanganna','liuwenxia','shichao','yixing']
        // storyNextDisable:false,
      }
    },
    components:{
      'vsubmit':submit,
      'vedit' : edit,
    },
    watch:{
      selectedAuthor(){
        // console.log(this.selectedAuthor)
        this.sortList()
        return this.selectedAuthor
      }
    },
    methods: {
      nextEle:function(){
        this.eleCurrentPage++
        this.pendingStory(this.tableData[this.currentIndex].id,this.currentIndex,this.eleCurrentPage,this.pendingButton)
      },
      fontEle:function(){
        this.eleCurrentPage--
        this.pendingStory(this.tableData[this.currentIndex].id,this.currentIndex,this.eleCurrentPage,this.pendingButton)        
      },
      getIndexEle:function(){
        this.eleCurrentPage=1
        this.pendingStory(this.tableData[this.currentIndex].id,this.currentIndex,this.eleCurrentPage,this.pendingButton) 
      },
      forSale:function(index,id,type,auditInfo=''){
        const url = `${this.targetDefault}/audit/upload_story_audit_result`
        const data = `storyId=${id}&status=${type}&auditInfo=${auditInfo}`
        this.axios.post(url,data)
        .then(res=>{
          if (res.data.retCode==0) {
            this.$message({message:'操作成功',type:'success'})
            this.tableData[index].status=type
          }else{
            this.$message({message:'操作异常',type:'error'})
          }
        })
        .catch(res=>{this.$message({message:'服务器异常',type:'error'})})
      }      
    }
  }
</script>

<style scoped>
.wrap{
  height: 100%;
  min-height: 500px;
}
.wrap .tac,
.wrap .el-col-2,
.el-menu{
  height: 100%;
}
.el-menu{
  padding-top: 80px;
  width: 100%;
  box-sizing: border-box;
}
.el-menu-item{
  width: 100%;
}
.item-wrap{
  /*position: absolute;*/
 /* top: 0;
  left: 0;
  right: 0;
  bottom: 0;*/
  /*overflow: scroll;*/
}
</style>
