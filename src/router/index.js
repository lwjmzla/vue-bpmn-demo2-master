import Vue from 'vue'
import Router from 'vue-router'
import HelloWorld from '@/components/HelloWorld'
import Bpmn from '@/components/bpmn.vue'
Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'Bpmn',
      component: Bpmn
    },
    {
      path: '/hello',
      name: 'HelloWorld',
      component: HelloWorld
    }
  ]
})
