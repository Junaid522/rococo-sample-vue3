import { defineStore, acceptHMRUpdate } from 'pinia'
import { Notify } from 'quasar';
import axios from "config/axios"
import localStorageService from 'services/localStorage.service';

import { handleAuthRequest, handleForgotPasswordRequest } from '@/utils/apiHelper'


export const useAuthStore = defineStore('auth', {
  state: () => ({
    user: localStorageService.getItem('user') || null,
    accessToken: localStorageService.getItem('accessToken') || null,
    accessTokenExpiry: localStorageService.getItem('accessTokenExpiry') || null,
  }),

  getters: {
    isAuthenticated: (state) => {
      if (!state.accessToken || !state.accessTokenExpiry) {
        return false;
      }

      const currentTime = Math.floor(Date.now() / 1000);
      return currentTime < state.accessTokenExpiry;
    },
  },

  actions: {
    async signup(payload) {
      let response
      try {
        response = await axios.post('/auth/signup', payload);
      } catch {
        Notify.create({
          message: "An unknown error occurred",
          color: "danger"
        })
        return false;
      }

      if (response.data?.success) {
        return true;
      } else {
        Notify.create({
          message: response.data?.message,
          color: "danger"
        })
      }
    },

    async forgotPassword(payload) {
      return handleForgotPasswordRequest(this, () =>
        axios.post('/auth/forgot_password', payload), this.router
      );
    },

    async login(payload) {
      return handleAuthRequest(this, () =>
        axios.post('/auth/login', payload), this.router
      );
    },

    async setPassword(token, uidb64, payload) {
      return handleAuthRequest(this, () =>
        axios.post(`/auth/reset_password/${token}/${uidb64}`, payload), this.router
      );
    },

    async updateUser (payload, id) {
      try {
        const userPayload = {
          first_name: payload.first_name.value,
          last_name: payload.last_name.value,
        };

        const response = await axios.put(`/person/me/${id}`, userPayload);

        if (response.data?.success) {
          this.user.first_name = payload.first_name;
          this.user.last_name = payload.last_name;
          localStorageService.setItem('user', this.user);
          Notify.create({
            message: "User  information updated successfully.",
            color: "positive"
          });
          return true;
        } else {
          Notify.create({
            message: response.data?.message || "Failed to update user information.",
            color: "danger"
          });
          return false;
        }
      } catch (error) {
        console.log(error, "error")
        Notify.create({
          message: error,
          color: "danger"
        });
        return false;
      }
    },

    async logout() {
      localStorageService.clear()
      this.user = null;
      this.accessToken = null;
      this.accessTokenExpiry = null;
      this.router.push('/login')
    },
  }
})

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useAuthStore, import.meta.hot))
}
