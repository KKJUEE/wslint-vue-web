import Vue from 'vue'
import Vuex from 'vuex'
import * as actions from './actions'
import * as getters from './getters'

Vue.use(Vuex)

// 应用初始状态
const state = {
	messages: []
}
//const state = {
//  count: 10
//}
//const action_state = {
//	add: false,
//	edit: false,
//	del: false,
//	click_action: false,
//	count: 1,
//	messages: []
//}

// 定义所需的 mutations
//const mutations = {
//  INCREMENT(state) {
//      state.count++
//  },
//  DECREMENT(state) {
//      state.count--
//  },
//  //定义增删改、选定进行配置
//  ADDACTION(action_state) {
//  	action_state.add = true
//  },
//  EDITACTION(action_state) {
//  	action_state.edit = true
//  },
//  DELACTION(action_state) {
//  	action_state.del = true
//  },
//  CLICKACTION(action_state) {
//  	action_state.click_action = true
//  },
//  NEW_MESSAGE (state, msg) {
//    state.messages.push(msg)
//  }
//}
  const mutations = {
    NEW_MESSAGE (state, msg) {
      state.messages.push(msg)
    }
  }

// 创建 store 实例
export default new Vuex.Store({
    actions,
    getters,
    state,
//  action_state,
    mutations
})