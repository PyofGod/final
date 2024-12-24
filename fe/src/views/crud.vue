<script setup lang="ts">
import { ref, onMounted } from "vue";

interface fruits {
  id: number;
  name: string;
  color: string;
}

const fruits = ref<fruits[]>([]);
const selectedId = ref<number>(0);
const fruitName = ref<string>("");
const fruitColor = ref<string>("");
const BASE_PATH = "http://192.168.1.140:4000";

const loadData = async () => {
  const res = await fetch(`${BASE_PATH}/api/fruits`);
  fruits.value = await res.json();
};

const create = async () => {
  await fetch(`${BASE_PATH}/api/fruits`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      name: fruitName.value,
      color: fruitColor.value,
    }),
  });
  fruitName.value = "";
  fruitColor.value = "";
  await loadData();
};

const remove = async () => {
  if (selectedId.value !== 0) {
    await fetch(`${BASE_PATH}/api/fruits/${selectedId.value}`, {
      method: "DELETE",
    });
    selectedId.value = 0;
    fruitName.value = "";
    fruitColor.value = "";
    await loadData();
  }
};

const update = async () => {
  if (selectedId.value !== 0) {
    await fetch(`${BASE_PATH}/api/fruits/${selectedId.value}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: fruitName.value,
        color: fruitColor.value,
      }),
    });
    selectedId.value = 0;
    fruitName.value = "";
    fruitColor.value = "";
    await loadData();
  }
};

const undoFruit = (id: number) => {
  if (selectedId.value === id) {
    selectedId.value = 0;
    fruitName.value = "";
    fruitColor.value = "";
  } else {
    const f = fruits.value.find((e) => e.id === id);
    if (f) {
      fruitName.value = f.name;
      fruitColor.value = f.color;
    }
  }
};

onMounted(async () => {
  await loadData();
});
</script>

<template>
  <div class="container">
    <h1>Fruit List</h1>
    <div class="form">
      <input type="text" v-model="fruitName" name="name" placeholder="Name" class="input" />
      <input type="text" v-model="fruitColor" name="color" placeholder="Color" class="input" />
    </div>
    <div class="buttons">
      <button @click="create" :disabled="!fruitName || !fruitColor || selectedId != 0"
        class="button create">Create</button>
      <button @click="update" :disabled="!fruitName || !fruitColor || selectedId === 0"
        class="button update">Update</button>
      <button @click="remove" :disabled="selectedId === 0" class="button delete">Delete</button>
    </div>
    <ul class="list">
      <li v-for="fruit in fruits" :key="fruit.id" class="list-item">
        <input type="radio" name="id" v-model="selectedId" :value="fruit.id" @click="undoFruit(fruit.id)" />
        {{ fruit.name }} : {{ fruit.color }}
      </li>
    </ul>
  </div>
</template>

<style>
.container {
  max-width: 600px;
  margin: 30px auto;
  padding: 20px;
  background: #f8f8f8;
  border: 1px solid #ddd;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  font-family: Arial, sans-serif;
}

h1 {
  text-align: center;
  font-size: 24px;
  margin-bottom: 20px;
  color: #333;
}

.form {
  display: flex;
  gap: 10px;
  margin-bottom: 20px;
}

.input {
  flex: 1;
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 4px;
  font-size: 16px;
}

.input:focus {
  border-color: #007bff;
  outline: none;
}

.buttons {
  display: flex;
  gap: 10px;
  justify-content: space-between;
  margin-bottom: 20px;
}

.button {
  flex: 1;
  padding: 10px;
  font-size: 16px;
  border: none;
  border-radius: 4px;
  color: white;
  cursor: pointer;
}

.button.create {
  background-color: #28a745;
}

.button.create:hover {
  background-color: #218838;
}

.button.update {
  background-color: #007bff;
}

.button.update:hover {
  background-color: #0056b3;
}

.button.delete {
  background-color: #dc3545;
}

.button.delete:hover {
  background-color: #c82333;
}

.button:disabled {
  background-color: #ccc;
  cursor: not-allowed;
}

.list {
  list-style: none;
  padding: 0;
  margin: 0;
}

.list-item {
  padding: 10px;
  background: #fff;
  border: 1px solid #ddd;
  border-radius: 4px;
  margin-bottom: 10px;
  display: flex;
  align-items: center;
  gap: 10px;
}

.list-item:hover {
  background: #f0f0f0;
}
</style>
