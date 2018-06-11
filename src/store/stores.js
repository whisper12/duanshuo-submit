import Vue from 'vue'
import Vuex from 'vuex'
Vue.use(Vuex);
export default new Vuex.Store({
	state : {
		'isLogin': '',
		'submitVisible':false,
	},
	mutations: {
		SET_isLogin(state, isLogin) {
		state.isLogin = isLogin;
		},
		SET_submitVisible(state, submitVisible) {
		state.submitVisible = submitVisible;
		}					
	},
	actions: {
		setisLogin({commit}, isLogin) {
		commit('SET_isLogin', isLogin)
		},
		setsubmitVisible({commit}, submitVisible) {
		commit('SET_submitVisible', submitVisible)
		}		
	},
	getters: {
		getisLogin: (state) => state.isLogin,
		getsubmitVisible: (state) => state.submitVisible,
	}
})