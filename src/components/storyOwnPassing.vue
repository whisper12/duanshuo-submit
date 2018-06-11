<template>
  <div class="wrap">
    <SideBar index="4-2"></SideBar>
    <expendStory class="item-wrap" type="ownStoryPassing"></expendStory>

    <el-dialog title="" :visible.sync="submitVisible" size="large" :show-close="false">
      <vsubmit v-if="submitVisible"></vsubmit>
    </el-dialog>

  </div>
</template>

<script>

import submit from './Hello.vue'
import SideBar from './SideBar.vue'
import mixin from '../mixin/mixin.js'
import expendStory from './expendStory'
  export default {
    name:'storyPassing',
    data() {
      return {
        dialogTableVisible: false,
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
      expendStory,
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
