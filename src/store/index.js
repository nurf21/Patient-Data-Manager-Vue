import Vue from 'vue'
import Vuex from 'vuex'
import Patient from './modules/patient'

Vue.use(Vuex)

export default new Vuex.Store({
  modules: {
    Patient
  }
})
