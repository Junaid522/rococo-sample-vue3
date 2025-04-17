import { defineStore } from 'pinia';
import { useRouter } from 'vue-router';

export const useRouterStore = defineStore('routerStore', {
  state: () => ({
    router: useRouter(),  // Store router instance
  }),
  actions: {
    redirectToLogin() {
      this.router.push('/login');  // Perform redirection to login
    },
  },
});
