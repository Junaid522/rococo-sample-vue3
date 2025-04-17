<template>
  <q-page class="flex flex-center q-pa-md">
    <q-card class="q-pa-md" style="max-width: 500px; width: 100%; border-radius: 10px; box-shadow: 0 10px 20px rgba(0,0,0,0.1)">
      <q-card-section class="q-pt-none text-center">
        <div class="text-h5 text-primary q-mb-md">Profile</div>

        <q-input
          outlined
          v-model="firstName"
          label="First Name"
          dense
          class="q-mb-md"
          :rules="[val => val && val.length > 0 || 'First Name is required']"
        />

        <q-input
          outlined
          v-model="lastName"
          label="Last Name"
          dense
          class="q-mb-md"
          :rules="[val => val && val.length > 0 || 'Last Name is required']"
        />

        <q-btn
          label="Update"
          color="primary"
          class="full-width q-mt-lg"
          @click="saveProfile"
          :disabled="!firstName || !lastName"
        />
      </q-card-section>
    </q-card>
  </q-page>
</template>

<script setup>
import { ref } from 'vue'
import localStorageService from 'services/localStorage.service.js'
import { useAuthStore } from 'stores/auth'

const authStore = useAuthStore()
const user = localStorageService.getItem('user')
const firstName = ref(user ? user.first_name : '')
const lastName = ref(user ? user.last_name : '')

async function saveProfile() {
  let payload = {
    first_name: firstName,
    last_name: lastName
  }

  await authStore.updateUser(payload, user?.entity_id)
}
</script>

<style scoped>
.q-card {
  background-color: #ffffff;
  border-radius: 10px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
}

.text-h5 {
  font-weight: bold;
  color: #3e4e5e;
}

.q-input {
  max-width: 100%;
}

.q-btn {
  font-weight: bold;
  padding: 12px;
  border-radius: 8px;
}

.q-card-section {
  padding: 20px;
}

.q-mb-md {
  margin-bottom: 16px;
}

.q-btn:hover {
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.15);
  background-color: #1e88e5;
}

.q-btn:disabled {
  background-color: #b0bec5;
  cursor: not-allowed;
}
</style>
