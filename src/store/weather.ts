import type { InjectionKey } from 'vue'
import { createStore, Store } from 'vuex'

export interface State {
  weatherData: {
    city: string
  }
}

// define injection key for vuex store
export const key: InjectionKey<Store<State>> = Symbol()

export const store = createStore<State>({
  state: {
    weatherData: {
      city: 'Nairobi',
    },
  },
  getters: {},
  mutations: {},
  actions: {},
})
