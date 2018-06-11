<template>
  <div class="wrap">
    <SideBar index="2-1"></SideBar>
    <expendSeries class="item-wrap" :type="type"></expendSeries>

    <el-dialog title="" :visible.sync="submitVisible" size="large" :show-close="false">
      <vsubmit v-if="submitVisible"></vsubmit>
    </el-dialog>
  </div>
</template>

<script>

import submit from './Hello.vue'
import SideBar from './SideBar.vue'
import expendSeries from './expendSeries.vue'

  export default {
    name:'seriesReject',
    data() {
      return {
        dialogTableVisible: false,
        editVisible:false,
        expendStoryVisible:false,
        type:'seriesReject',
      }
    },
    computed:{
      submitVisible(){
        return this.$store.getters.getsubmitVisible
      }
    },       
    components:{
      'vsubmit':submit,
      SideBar,
      expendSeries,
    },
    methods: {

    }
  }
</script>

<style scoped>
.wrap{
  height: 100%;
}
.item-wrap{
  position: absolute;
  top: 0;
  left: 12.5%;
  right: 0;
  bottom: 0;
  overflow: scroll;
}
</style>
