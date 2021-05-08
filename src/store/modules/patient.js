import axios from 'axios'
export default {
  state: {
    patients: [],
    page: 1,
    limit: 100,
    totalRows: null
  },
  mutations: {
    setPatient (state, payload) {
      payload.data.map(value => {
        const setData = {
          ID: value.id,
          Name: value.name,
          Sex: value.sex,
          Religion: value.religion,
          Phone: value.phone,
          Address: value.address,
          NIK: value.nik
        }
        state.patients = [...state.patients, setData]
        state.totalRows = payload.pagination.totalData
      })
    },
    clearPatient (state) {
      state.patients = []
    }
  },
  actions: {
    getPatient (context) {
      axios
        .get(`${process.env.VUE_APP_BASE_URL}/patient?page=${context.state.page}&limit=${context.state.limit}`)
        .then(response => {
          context.commit('setPatient', response.data)
        })
        .catch(error => {
          console.log(error)
        })
    },
    addPatient (context, payload) {
      return new Promise((resolve, reject) => {
        axios
          .post(`${process.env.VUE_APP_BASE_URL}/patient`, payload)
          .then(response => {
            context.commit('clearPatient')
            resolve(response.data)
          })
          .catch(error => {
            reject(error.response)
          })
      })
    },
    patchPatient (context, payload) {
      return new Promise((resolve, reject) => {
        axios
          .patch(`${process.env.VUE_APP_BASE_URL}/patient/${payload.id}`, payload.form)
          .then(response => {
            context.commit('clearPatient')
            resolve(response.data)
          })
          .catch(error => {
            reject(error.response)
          })
      })
    },
    deletePatient (context, payload) {
      return new Promise((resolve, reject) => {
        axios
          .delete(`${process.env.VUE_APP_BASE_URL}/patient/${payload}`)
          .then(response => {
            context.commit('clearPatient')
            resolve(response.data)
          })
          .catch(error => {
            reject(error.response)
          })
      })
    }
  },
  getters: {
    getPatient (state) {
      return state.patients
    },
    getTotalRows (state) {
      return state.totalRows
    }
  }
}
