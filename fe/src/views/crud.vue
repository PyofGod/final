<script setup lang="ts">
import { ref, reactive, onMounted } from "vue";

const fruits = ref<{ id: number; name: string; color: string }[]>([]);
const selectedId = ref<number>(0);
const debug = ref<string>("");
const fruitName = ref<string>("");
const fruitColor = ref<string>("");

const load = async () => {
  const res = await fetch("http://localhost:4000/api/fruits");
  fruits.value = await res.json();
};

const create = async () => {
  await fetch("http://localhost:4000/api/fruits", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      name: fruitName.value,
      color: fruitColor.value,
    }),
  });
  await load();
};

const remove = async () => {
  debug.value = "Delete " + selectedId.value;
  selectedId.value = 0;
};

const update = async () => {
  debug.value = "Update " + selectedId.value;
};

const selectFruit = (id: number) => {
  const f = fruits.value.find((e) => e.id === id);
  if (f) {
    selectedId.value = id;
    fruitName.value = f.name;
    fruitColor.value = f.color;
    debug.value = "Select " + selectedId.value;
  } else {
    debug.value = id + " not found " + id;
  }
};

onMounted(async () => {
  await load();
});
</script>

<template>
  <div>
    <input type="text" v-model="fruitName" name="name" placeholder="name" />
    <input type="text" v-model="fruitColor" name="color" placeholder="color" />
    <button @click="create" :disabled="!fruitName || !fruitColor">
      Create
    </button>
    <button @click="update" :disabled="!fruitName || !fruitColor || selectedId === 0">
      Update
    </button>
    <button @click="remove" :disabled="selectedId === 0">Delete</button>
    <ul>
      <li v-for="fruit in fruits" :key="fruit.id">
        <input type="radio" name="id" @click="selectFruit(fruit.id)" />
        {{ fruit.name }} : {{ fruit.color }}
      </li>
    </ul>
    <div>{{ debug }}</div>
  </div>
</template>
