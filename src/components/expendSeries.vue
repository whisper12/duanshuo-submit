<template>
  <div class="wrap">
    <div class="item-wrap">
      <el-checkbox-group v-model="checkList" v-if="checkListVisiable">
        <el-checkbox label="官方短说"></el-checkbox>
        <el-checkbox label="用户短说"></el-checkbox>
      </el-checkbox-group>    
      <el-table :data="tableData" border style="width: 100%">
        <el-table-column label="分类" width="100">
          <template scope="scope">
            <el-tag type="primary">{{ fkCategory[scope.row.fkCategoryId-1] }}</el-tag>
          </template>
        </el-table-column>      
        <el-table-column label="作者" width="120">
          <template scope="scope">
            <span style="margin-left: 10px">{{ scope.row.author }}</span>
          </template>
        </el-table-column>
        <el-table-column label="封面" width="100">
          <template scope="scope">
              <div slot="reference" class="name-wrapper">
                <img :src="imgDefault+scope.row.cover" @click="handlePictureCardPreview(scope.row.cover)" style="height:24px">
              </div>
          </template>
        </el-table-column>         
        <el-table-column label="系列名" width="180">
          <template scope="scope">
              <div slot="reference" class="name-wrapper">
                <el-tag>{{ scope.row.title }}</el-tag>
              </div>
          </template>
        </el-table-column>
        <el-table-column label="简介">
          <template scope="scope">
              <div slot="reference" class="name-wrapper">
                <p>{{ scope.row.introduction }}</p>
              </div>
          </template>
        </el-table-column>
        <el-table-column label="原因" width="180" v-if="type=='seriesReject'">
          <template scope="scope">
              <div slot="reference" class="name-wrapper">
                <p>{{ scope.row.attribute01 }}</p>
              </div>
          </template>
        </el-table-column>         
        <el-table-column label="状态" width="100" v-if="type!='seriesReject'">
          <template scope="scope">
            <el-tag type="success" v-if="scope.row.status==0">线上</el-tag>
            <el-tag type="danger" v-if="scope.row.status==1">已下架</el-tag>
            <el-tag type="warning" v-if="scope.row.status==2">待审核</el-tag>
            <el-tag type="gray" v-if="scope.row.status==3">未通过</el-tag>
          </template>
        </el-table-column>                
        <el-table-column label="操作"> 
          <template scope="scope">
            <el-button size="small" @click="editSeries(scope.$index)" v-if="type=='seriesReject'">编辑</el-button>
            <el-button size="small" type="info" v-if="scope.row.status==1"
            @click="forSale(scope.$index,scope.row.id,0)"
            >上架</el-button>
            <el-button size="small" type="danger" v-if="scope.row.status==0"
            @click="forSale(scope.$index,scope.row.id,1)"
            >下架</el-button>
            <el-button size="small" type="danger" @click="pendingSeries(scope.$index)" v-if="type=='seriesPending'">审核</el-button>
            <el-button size="small" type="primary" @click="expandAllStory(scope.row.id)">查看所有章节</el-button>
          </template>
        </el-table-column>
      </el-table>
      <span>当前页 {{page}} / {{DataCountPage}}</span>
        <el-button-group>
          <el-button type="primary" icon="d-arrow-left" :disabled="this.page==1" @click="getIndexPage()">第一页</el-button>
          <el-button type="primary" icon="arrow-left" :disabled="this.page==1" @click="fontPage()">上一页</el-button>
          <el-button type="primary" @click="nextPage()" :disabled="nextDisable">下一页<i class="el-icon-arrow-right el-icon--right"></i></el-button>
        </el-button-group> 

        <el-dialog title="" :visible.sync="editVisible" size="large">
          <vedit v-if="editVisible" :elementInfo="elementInfo" :editCB="editCB"></vedit>
        </el-dialog>    

        <el-dialog :visible.sync="expendStoryVisible" size=large>
          <expendStory v-if="expendStoryVisible" type="storyPendingById" :seriesId="seriesId"></expendStory>
        </el-dialog>    

        <el-dialog v-model="imgVisible" size="tiny">
          <img width="100%" :src="dialogImageUrl" alt="">
        </el-dialog>

        <el-dialog title="系列详情" :visible.sync="dialogTableVisible" size="small">
          <el-table :data="elementInfo">
            <el-table-column property="date" label="作者" width="100">
              <template scope="scope">
                <p>{{scope.row.author}}</p>
              </template>
            </el-table-column>
            <el-table-column property="name" label="系列名" width="100">
              <template scope="scope">
                <p>{{scope.row.title}}</p>
              </template>
            </el-table-column>
            <el-table-column property="address" label="简介">
              <template scope="scope">
                <p>{{scope.row.introduction}}</p>
              </template>
            </el-table-column>
          </el-table>
          <el-input v-model="auditInfo" placeholder="审核结果说明（若通过则不需要，不通过需加以说明)"></el-input>
          <div class="block" style="margin-top:20px;">
            <span class="wrapper">
              <el-button @click="dialogTableVisible=false">取消</el-button>
              <el-button type="success" @click="getSeriesRes(elementInfo[0].id,0,auditInfo,1)">通过审核</el-button>
              <el-button type="danger" @click="getSeriesRes(elementInfo[0].id,3,auditInfo,1)">拒绝通过</el-button>
            </span>
          </div>      
        </el-dialog>                            
    </div>

  </div>
</template>

<script>

import submit from './Hello.vue'
import edit from './EditSeries.vue'
import SideBar from './SideBar.vue'
import mixin from '../mixin/mixin.js'
import expendStory from './expendStory.vue'

  export default {
    name:'expendSeries',
    mixins:[mixin],
    props:{
      type:{
        type:''
      }
    },
    data() {
      return {
        dialogTableVisible: false,
        expendStoryVisible:false,
        editVisible:false,
      }
    },
    components:{
      'vsubmit':submit,
      'vedit' : edit,
      SideBar,
      expendStory,
    },
    methods: {
      forSale:function(index,id,type,auditInfo=''){
        const url = `${this.targetDefault}/audit/upload_series_audit_result`
        const data = `seriesId=${id}&status=${type}&auditInfo=${auditInfo}`
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
  min-height: 450px;
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
