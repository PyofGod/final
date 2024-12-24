<script setup lang="ts">
import { ref, onMounted } from "vue";

interface fruits {
  id: number,
  name: string,
  color: string
}

const fruits = ref<fruits[]>([]);
const selectedId = ref<number>(0);
const fruitName = ref<string>("");
const fruitColor = ref<string>("");
const BASE_PATH = import.meta.env.PUBLIC_BASE_PATH

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
  <div>
    <input type="text" v-model="fruitName" name="name" placeholder="name" />
    <input type="text" v-model="fruitColor" name="color" placeholder="color" />
    <button @click="create" :disabled="!fruitName || !fruitColor || selectedId != 0">
      Create
    </button>
    <button @click="update" :disabled="!fruitName || !fruitColor || selectedId === 0">
      Update
    </button>
    <button @click="remove" :disabled="selectedId === 0">Delete</button>
    <ul>
      <li v-for="fruit in fruits" :key="fruit.id">
        <input type="radio" name="id" v-model="selectedId" :value="fruit.id" @click="undoFruit(fruit.id)" />
        {{ fruit.name }} : {{ fruit.color }}
      </li>
    </ul>
  </div>
</template>
