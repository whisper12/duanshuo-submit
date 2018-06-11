<template>
  <div id="app">
    <router-view></router-view>
  </div>
</template>

<script>
import Hello from './components/Hello'

export default {
  name: 'app',
  created:function(){
    // document.cookie="JSESSIONID=768D2D2B56E6706BF828011032866D59"
    if(!window.sessionStorage.getItem('isLogin')){
      this.$router.push({path:'/login'})
    }
  },
  components: {
    Hello
  }
}
</script>

<style>
*{
  margin:0;
  padding: 0;
}
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  /*margin-top: 60px;*/
  /*min-width: 1200px;*/
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
}
a{
  text-decoration: none;
  color: #bfcbd9;
}
</style>
