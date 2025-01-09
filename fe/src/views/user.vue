<script setup lang="ts">
import { defineComponent, onMounted, ref } from 'vue';
import HttpService from "@/service/HttpService";

interface User {
  id: number;
  firstname: string;
  lastname: string;
  username: string;
  password: string;
  email: string;
  roles: string;
}

const users = ref<User[]>([]);
const loading = ref<boolean>(false);
const firstname = ref<string>("");
const lastname = ref<string>("");
const username = ref<string>("");
const password = ref<string>("");
const email = ref<string>("");
const roles = ref<string>("");



const BASE_PATH = import.meta.env.VITE_PORT;

const loadUser = async () => {
  const res = await HttpService.getAxiosClient().get(`${BASE_PATH}/users`);
  users.value = res.data;
};

const createUser = async () => {
  try {
    const res = await HttpService.getAxiosClient().post(`${BASE_PATH}/users`, {
      username: username.value,
      password: password.value,
      email: email.value,
    });
    if (res.status === 201) {
      console.log('สมัครเสร็จสิ้น')
    }
  } catch (error) {
    console.log('สมัครไม่สำเร็จ', error);
  }
};

onMounted(() => {
  loadUser();
});
</script>

<template>
  <div class="user-list">
    <h1>User List</h1>
    <div v-if="loading" class="loading">Loading...</div>
    <div v-else>
      <ul v-if="users.length > 0">
        <li v-for="user in users" :key="user.id">
          {{ user.firstname }}
          {{ user.lastname }}
          {{ user.username }}
          {{ user.email }}
          {{ user.roles }}
        </li>
      </ul>
      <p v-else>No users found.</p>
    </div>
  </div>
  <form @submit.prevent="createUser">
    <input type="text" v-model="username" placeholder="ชื่อผู้ใช้" required /><br>
    <input type="text" v-model="password" placeholder="รหัสผ่าน" required /><br>
    <input type="email" v-model="email" placeholder="อีเมล" required /><br>
    <button type="submit">สมัคร</button>
  </form>
</template>

<style scoped>
.user-list {
  font-family: Arial, sans-serif;
  margin: 20px;
}

.loading {
  color: blue;
  font-weight: bold;
}
</style>
