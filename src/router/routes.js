const routes = [
  {
    path: '/',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      { path: 'dashboard', component: () => import('pages/IndexPage.vue'), meta: { requiresAuth: true } },
      { path: 'add-task', component: () => import('pages/Todo/AddTodo.vue'), meta: { requiresAuth: true } },
      { path: 'user-profile', component: () => import('pages/Profile/UserProfile.vue'), meta: { requiresAuth: true } }
    ]
  },

  {
    path: '/',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      { path: 'login', component: () => import('pages/LoginPage.vue'), meta: { requiresAuth: false } },
      { path: 'signup', component: () => import('pages/SignupPage.vue'), meta: { requiresAuth: false } },
      { path: 'forgot-password', component: () => import('pages/ForgotPasswordPage.vue'), meta: { requiresAuth: false } },
      { path: '/set-password/:token/:uidb64', component: () => import('pages/SetPasswordPage.vue'), meta: { requiresAuth: false } }
    ]
  },

  {
    path: '/:catchAll(.*)*',
    component: () => import('pages/ErrorNotFound.vue')
  }
]

export default routes
