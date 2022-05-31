export const state = () => ({
  eachOthersCurrentStations: null
})

export const mutations = {
  setEachOthersCurrentStations(state, payload) {
    state.eachOthersCurrentStations = payload
  }
}

export const actions = {
  setEachOthersCurrentStations({ commit }, payload) {
    commit('setEachOthersCurrentStations', payload)
  }
}
