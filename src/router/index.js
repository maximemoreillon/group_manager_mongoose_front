import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)

const routes = [
  {
    path: '/about',
    name: 'about',
    component: () => import('../views/About.vue')
  },
  {
    path: '/groups',
    alias: '/',
    name: 'groups',
    component: () => import('../views/Groups.vue')
  },
  {
    path: '/groups/new',
    name: 'create_group',
    component: () => import('../views/CreateGroup.vue')
  },
  {
    path: '/groups/:group_id',
    name: 'group',
    component: () => import('../views/Group.vue')
  },
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router
