import { defineRouter } from '#q-app/wrappers'
import { createRouter, createMemoryHistory, createWebHistory, createWebHashHistory } from 'vue-router'
import routes from './routes'
// import { useAuthStore } from 'src/stores/auth'

export default defineRouter(function () {
  const createHistory = process.env.SERVER
    ? createMemoryHistory
    : (process.env.VUE_ROUTER_MODE === 'history' ? createWebHistory : createWebHashHistory)

  const Router = createRouter({
    scrollBehavior: () => ({ left: 0, top: 0 }),
    routes,
    history: createHistory(process.env.VUE_ROUTER_BASE),
  })

  // Add a global navigation guard
  // Router.beforeEach((to, from, next) => {
  //   // const authStore = useAuthStore(); // Initialize the auth store
  //   // Check if the route requires authentication
  //   // if (to.meta.requiresAuth && !authStore.isAuthenticated) {
  //   //   // Redirect to login if not authenticated
  //   //   console.log("Nav guard in action... Redirected to login...");
  //   //   // Avoid redirecting if we're already on the login page
  //   //   if (to.path !== '/login') {
  //   //     next('/login');  // Use `next` for redirection to login
  //   //   } else {
  //   //     next(); // Allow navigation if already on login page
  //   //   }
  //   // }
  //   // // Check if the route requires the user to be non-authenticated
  //   // else if (to.meta.requiresAuth === false && authStore.isAuthenticated) {
  //   //   // Redirect to dashboard if authenticated
  //   //   console.log("Nav guard in action... Redirected to dashboard...");
  //   //   // Avoid redirecting if we're already on the dashboard
  //   //   if (to.path !== '/dashboard') {
  //   //     next('/dashboard');  // Use `next` for redirection to dashboard
  //   //   } else {
  //   //     next(); // Allow navigation if already on dashboard
  //   //   }
  //   // } else {
  //   //   // Allow navigation
  //   //   next();  // Continue with the navigation
  //   // }
  // });

  return Router
})
