import {target,imgUrl} from '../mixin/config.js'
export default {
	data(){
		return{
			page:1,             //当前页数
			size:10,
			tableData: [],       //展示的数据
			auditInfo:'',        //审核结果说明
			currentIndex:'',     //当前操作的index
			DataCountPage:1,     //数据总页数
			nextDisable:true,    //下一页按钮
			imgVisible:false,    //控制缩略图
			dialogImageUrl:'',   //查看缩略图
			imgDefault:imgUrl,   //图片前缀
			targetDefault:target, //api前缀
			elementInfo:[],  //当前操作的数据
			fkCategory:['首页','浪漫','戏剧','恐怖惊悚','科幻幻想','推理','超自然','搞笑'],
			onlineDS:[],    //官方短说
			userDS:[],		//用户短说
			allDS:[],      //全部短说
			checkList:['官方短说','用户短说'],
			selectedAuthor:'all',
			}
	},
    watch:{
      checkList(){
        console.log(this.checkList)
        this.sortList()
        // this.selectedAuthor = 'all'
        return this.checkList
      }
    },	
	computed:{
		submitVisible(){
			return this.$store.getters.getsubmitVisible
		},
		checkListVisiable(){
			if (['zhangchao','test001','admin'].indexOf(window.sessionStorage.uploadAuthor)!=-1) {
				return true
			}else{
				return false
			}
		}
	},
	methods:{
		sortList:function(){
			let data = []
            if (this.checkList.length==2) {
              data=this.allDS
            }else if(this.checkList.length==1&&this.checkList.indexOf('官方短说')!=-1){
              data = this.onlineDS
            }else if(this.checkList.length==1&&this.checkList.indexOf('用户短说')!=-1){
              data=this.userDS
            }else{
              data = []
            }  
            if(this.selectedAuthor=='all'){
            	this.tableData = data
            }else{
 				let _data = []
      	        data.forEach(res=>{
      	          if (res.attribute03 == this.selectedAuthor) {
      	            _data.push(res)
      	          }
      	        })
      	        this.tableData = _data            	
            }
		},
        editCB:function(){
          this.tableData.splice(this.currentIndex,1)
          this.editVisible=false
        },		
        handlePictureCardPreview:function(file) {      //查看缩略图
          this.dialogImageUrl =  this.imgDefault + file + '?' + Math.random();
          this.imgVisible = true;
        },		
		getTabledata:function(){       //获取系列,列表等API
			this.tableData = []
			this.allDS = []
			this.userDS = []
			this.onlineDS = []
			const _domain = target
			const url = {
				'seriesPending':`${_domain}/audit/noaudit_series?page=${this.page}`,
				'storyPending':`${_domain}/audit/noaudit_story?page=${this.page}`,
				'seriesReject':`${_domain}/audit/no_pass_audit_series?page=${this.page}`,
				'storyReject':`${_domain}/audit/no_pass_audit_story?page=${this.page}`,
				'seriesPassing':`${_domain}/audit/online_series?page=${this.page}`,
				'storyPassing':`${_domain}/audit/online_story?page=${this.page}`,
				'ownSeriesPassing':`${_domain}/audit/online_own_series?page=${this.page}`,
				'ownStoryPassing':`${_domain}/audit/online_own_story?page=${this.page}`,
				'storyPendingById':`${_domain}/audit/noaudit_story_by_series?seriesId=${this.seriesId}`,
				'storyRejectById':`${_domain}/audit/noaudit_story_by_series?seriesId=${this.seriesId}`,
				'storyPassingById':`${_domain}/audit/noaudit_story_by_series?seriesId=${this.seriesId}`,
				'ConstoryPending':`${_domain}/audit/story_append?page=${this.page}&status=2`,
				'ConstoryPassing':`${_domain}/audit/story_append?page=${this.page}&status=0`
			}
			let _url = url[this.type]
			if(!_url){
				return
			}
			this.axios.get(_url,{'withCredentials':true})
			.then(res=>{
				if(res.data.retCode==120){
					this.$message({message:'请先登录',type:'warning'})
					this.$router.push({path:'/login'})
				}else if(res.data.retCode==0){
					let key = Object.keys(res.data.result)
					let _key = ''
					for(let item of key){
						if(item!='sizeCount'){
							_key = item
						}
					}
					let tableData = res.data.result[_key]
					if(['zhangchao','test001','admin'].indexOf(window.sessionStorage.uploadAuthor)!=-1){
						// this.tableData = tableData
						this.allDS = tableData
						tableData.forEach(res=>{
							if(res['fkAuthorId']!=undefined){
								this.userDS.push(res)
							}else{
								this.onlineDS.push(res)
							}
						})
						this.sortList()
					}else{
						tableData.forEach(res=>{
							if(res['attribute03']==undefined||res['attribute03']==window.sessionStorage.uploadAuthor){
								this.tableData.push(res)
							}
						})						
					}
					let _flag = this.type=='seriesPending'||this.type=='storyPendingById'||this.type=='storyPending'
					_flag&&this.tableData.map(res=>{res.cover=res.cover + '?' + Math.random()})					
					if(res.data.result.sizeCount!==undefined){
						this.DataCountPage = Math.ceil(res.data.result.sizeCount/20)
						this.nextDisable=this.DataCountPage<=this.page?true:false
					}else{
						this.nextDisable=this.tableData.length<20?true:false      //分页
						this.DataCountPage=1
					}
				}else if(res.data.retCode==8){
					this.$message({message:'该系列下没有待审核章节',type:'success'})
					this.nextDisable=true
				}else if(res.data.retCode==110){
					this.$message({message:'此账号无查看列表权限',type:'error'})
					this.nextDisable=true					
				}else{
					this.$message({message:'数据获取异常',type:'error'})
					this.nextDisable=true					
				}
			})
			.catch(res=>{this.$message({message:'服务器异常',type:'error'})})
		},
		fontPage:function(){
			// console.log(--this.page)   //上一页
			this.page--
			this.getTabledata()
		},
		nextPage:function(){
			// console.log(++this.page)    //下一页
			this.page++
			this.getTabledata()
		},
		getIndexPage:function(){    //跳转第一页
			this.page=1
			this.getTabledata()
		},
		editSeries:function(row){    //编辑系列
			this.$set(this.elementInfo,0,this.tableData[row])
			this.editVisible = true
			this.currentIndex = row
		},
		editStory:function(row){    //编辑章节
			this.$set(this.elementInfo,0,this.tableData[row])
			this.editVisible = true
			this.currentIndex = row			
		},
		expandAllStory:function(seriesId){    //查看所有章节
			this.seriesId=seriesId
			this.expendStoryVisible = true
		},
		pendingSeries:function(row){      //获取当前审核系列信息，弹出审核框
			this.$set(this.elementInfo,0,this.tableData[row])
			this.currentIndex = row
			this.dialogTableVisible = true			
		},
		pendingStory:function(storyId,row,eleCurrentPage=1,pendingButton){   //获取当前章节信息，弹出审核框
			this.currentIndex = row
			this.pendingButton=pendingButton
			this.eleCurrentPage = eleCurrentPage
			let url = `${target}/audit/noaudit_element?storyId=${storyId}&page=${eleCurrentPage}`
			this.axios.get(url,{'withCredentials':true})
			.then(res=>{
				this.elementInfo = res.data.result.elements
				this.eleCountPage = Math.ceil(res.data.result.sizeCount/20)
				console.log(res.data.result)
			})
			this.dialogTableVisible = true
		},
		getSeriesRes:function(id,type,auditInfo='',resType){   //更改系列，章节状态
			console.log(this.$route.name)
			if(this.$route.name=='ConstoryPending'){
				resType=3
			}
			if(this.tableData[this.currentIndex].status==4&&type===0){
				type=5
			}else if(this.tableData[this.currentIndex].status==4&&type===3){
				type=7
			}
			if(id===undefined){
				id = this.tableData[this.currentIndex].id
			}
			console.log(id,type,auditInfo)
			if(type==3&&!auditInfo){
				this.$message({message:'请填写不通过理由',type:'error'})
				return
			}
			let data = ''
			let url = ''
			if(resType==1){
				data=`seriesId=${id}&status=${type}&auditInfo=${auditInfo}`
				url = `${target}/audit/upload_series_audit_result`
			}else if(resType==2){
				data=`storyId=${id}&status=${type}&auditInfo=${auditInfo}`
				url = `${target}/audit/upload_story_audit_result`
			}else if(resType==3){
				data=`storyId=${id}&status=${type}&auditInfo=${auditInfo}`
				url = `${target}/audit/upload_append_audit_result`				
			}
			let header = {'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8'}
			this.axios.post(url,data,{'headers':header,'withCredentials':true})
			.then(res=>{
				console.log(res.data.retCode)
				if(res.data.retCode==0){
					this.tableData.splice(this.currentIndex,1)
					this.$message({message:'操作成功',type:'success'})
					this.dialogTableVisible = false
				}else if(res.data.retCode==9){
					this.$message({message:'该系列下还有未审核或审核不通过的章节',type:'error'})
				}else if(res.data.retCode==120){
					this.$message({message:'请先登录',type:'warning'})
					this.$router.push({path:'/login'})
				}
			})
			.catch(res=>{
				this.$message({message:'服务器异常',type:'error'})
			})
		}
	},
	mounted:function(){
		console.log(this.type)
		this.getTabledata()    //获取数据
	},
	created:function(){
	    if(!window.sessionStorage.getItem('isLogin')){
	      this.$router.push({path:'/login'})   //检查登录
	    }		
	}
}