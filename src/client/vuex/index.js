
import model from './store/model'
import getter from './store/getter'
export const route = {
  path: '/vuex',
  name: 'vuex',
  component: () => import('./container/vuex')
}

export const stores = {
  model,
  getter
}
