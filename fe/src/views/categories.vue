<script setup lang="ts">
import { ref, onMounted } from 'vue';
import HttpService from "@/service/HttpService";

interface Categories {
  name: string,
  description: string,
  Id?: number,
}
const categoriesList = ref<Categories[]>([]);
const newCategories = ref<Categories>({
  name: '',
  description: '',
});


const BASE_PATH = "http://192.168.1.140:4000"

const loadData = async () => {
  const res = await HttpService.getAxiosClient().get(`${BASE_PATH}/categories`);
  categoriesList.value = res.data;
};

const addProduct = async () => {
  try {
    const res = await HttpService.getAxiosClient().post(`${BASE_PATH}/categories`, {
      name: newCategories.value.name,
      description: newCategories.value.description,
    });
    if (res) {
      await loadData();
      console.log('Fruit added successfully');
      newCategories.value.name = '';
      newCategories.value.description = '';
    } else {
      console.log('Failed to add fruit');
    }
  } catch (error) {
    console.log('Failed to add fruit');
  }
};

const deleteProduct = async (Id: number) => {
  try {
    const res = await HttpService.getAxiosClient().delete(`${BASE_PATH}/categories/${Id}`);
    if (res.status === 200) {
      await loadData();
      console.log('Product removed successfully');
    } else {
      console.log('Failed to remove product');
    }
  } catch (error) {
    console.log('Failed to remove product', error);
  }
};

onMounted(async () => {
  await loadData();
});
</script>

<template>
  <div class="product-page">
    <h1>Categories List</h1>

    <form @submit.prevent="addProduct" class="product-form">
      <div class="form-group">
        <label for="name">Product Name:</label>
        <input type="text" v-model="newCategories.name" placeholder="Enter product name" required />
      </div>
      <div class="form-group">
        <label for="price">Price:</label>
        <input type="text" v-model="newCategories.description" placeholder="Enter price" required />
      </div>
      <button type="submit" class="btn-add">Add Product</button>
    </form>

    <div class="table-container">
      <table>
        <thead>
          <tr>
            <th>Id</th>
            <th>CategoryName</th>
            <th>Description</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(categories, index) in categoriesList" :key="index">
            <td>{{ index + 1 }}</td>
            <td>{{ categories.name }}</td>
            <td>{{ categories.description }}</td>
            <td>
              <button class="btn-delete" @click="deleteProduct(categories.id)">Delete</button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<style scoped>
.product-page {
  max-width: 800px;
  margin: 40px auto;
  padding: 20px;
  font-family: Arial, sans-serif;
  color: #333;
  background-color: #f9f9f9;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
  border-radius: 8px;
}

h1 {
  text-align: center;
  color: orange;
}

.product-form {
  display: flex;
  flex-wrap: wrap;
  gap: 15px;
  margin-bottom: 20px;
}

.form-group {
  flex: 1 1 calc(50% - 15px);
  display: flex;
  flex-direction: column;
}

label {
  font-weight: bold;
  margin-bottom: 5px;
}

input {
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 4px;
}

.btn-add {
  background-color: orange;
  color: white;
  padding: 10px 20px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.3s;
  align-self: center;
}

.btn-add:hover {
  background-color: #45a049;
}

.table-container {
  overflow-x: auto;
}

table {
  width: 100%;
  border-collapse: collapse;
  margin-top: 20px;
}

th,
td {
  padding: 12px;
  text-align: left;
  border-bottom: 1px solid #ddd;
}

th {
  background-color: #f2f2f2;
  color: #333;
}

tr:hover {
  background-color: #f1f1f1;
}

.btn-delete {
  background-color: #f44336;
  color: white;
  padding: 5px 10px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.3s;
}

.btn-delete:hover {
  background-color: #e41e20;
}
</style>
