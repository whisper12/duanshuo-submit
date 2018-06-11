import Vue from 'vue'
import Router from 'vue-router'
// import Hello from '@/components/Hello'
// import msgPending from '@/components/msgPending'
//按需加载组件方法
const msgPending = r => require.ensure([], () => r(require('@/components/msgPending')), 'msgPending')
const Hello = r => require.ensure([], () => r(require('@/components/Hello')), 'Hello')
const msgPassing = r => require.ensure([], () => r(require('@/components/msgPassing')), 'msgPassing')
const msgReject = r => require.ensure([], () => r(require('@/components/msgReject')), 'msgReject')
const Login = r => require.ensure([],()=>r(require('@/components/Login')),'Login')
const storyPending = r => require.ensure([],()=>r(require('@/components/storyPending')),'storyPending')
const storyPassing = r => require.ensure([],()=>r(require('@/components/storyPassing')),'storyPassing')
const storyReject = r => require.ensure([],()=>r(require('@/components/storyReject')),'storyReject')
const msgOwnPassing = r => require.ensure([],()=>r(require('@/components/msgOwnPassing')),'msgOwnPassing')
const storyOwnPassing = r => require.ensure([],()=>r(require('@/components/storyOwnPassing')),'storyOwnPassing')
const ConstoryPending = r => require.ensure([],()=>r(require('@/components/ConstoryPending')),'ConstoryPending')
const ConstoryPassing = r => require.ensure([],()=>r(require('@/components/ConstoryPassing')),'ConstoryPassing')
Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/msgPending',
      name: 'msgPending',
      component: msgPending
    },
    {
      path: '/Hello',
      name :'Hello',
      component : Hello
    },
    {
      path: '/msgPassing',
      name :'msgPassing',
      component : msgPassing
    },
    {
      path: '/msgReject',
      name :'msgReject',
      component : msgReject
    },
    {
      path: '/Login',
      name: 'Login',
      component : Login
    },
    {
      path: '/storyPending',
      name: 'storyPending',
      component : storyPending
    },
    {
      path: '/storyPassing',
      name: 'storyPassing',
      component: storyPassing
    },
    {
      path: '/storyReject',
      name: 'storyReject',
      component: storyReject
    },
    {
      path: '/',
      redirect:'/msgPending'
    },
    {
      path: '/msgOwnPassing',
      name: 'msgOwnPassing',
      component : msgOwnPassing
    },
    {
      path: '/storyOwnPassing',
      name: 'storyOwnPassing',
      component : storyOwnPassing
    },
    {
      path: '/ConstoryPending',
      name: 'ConstoryPending',
      component:ConstoryPending
    },
    {
      path: '/ConstoryPassing',
      name: 'ConstoryPassing',
      component:ConstoryPassing
    }    
  ]
})
