<script setup lang="ts">
import { ref, onMounted } from 'vue';
import HttpService from "@/service/HttpService";

interface Category {
  Id?: number;
  name: string;
  description: string;
}

const categoryList = ref<Category[]>([]);
const idCategory = ref<number | undefined>(undefined);
const categoryName = ref<string>("");
const description = ref<string>("");

const BASE_PATH = "http://192.168.1.140:4000";

const loadCategories = async () => {
  try {
    const res = await HttpService.getAxiosClient().get(`${BASE_PATH}/categories`);
    categoryList.value = res.data;
  } catch (error) {
    console.error("Failed to load categories", error);
  }
};

const handleEditCategory = (category: Category) => {
  idCategory.value = category.Id;
  categoryName.value = category.name || "";
  description.value = category.description || "";
};

const submitCategory = async () => {
  const payload = {
    name: categoryName.value,
    description: description.value,
  };

  try {
    if (idCategory.value) {
      const res = await HttpService.getAxiosClient().patch(
        `${BASE_PATH}/categories/${idCategory.value}`,
        payload
      );
      if (res.status === 200) {
        console.log("Category updated successfully");
      }
    } else {
      const res = await HttpService.getAxiosClient().post(`${BASE_PATH}/categories`, payload);
      if (res.status === 201) {
        console.log("Category added successfully");
      }
    }
    await loadCategories();
    resetForm();
  } catch (error) {
    console.error("Failed to save category", error);
  }
};

const handleDeleteCategory = async (id: number) => {
  try {
    const res = await HttpService.getAxiosClient().delete(`${BASE_PATH}/categories/${id}`);
    if (res.status === 200) {
      console.log("Category deleted successfully");
      await loadCategories();
    }
  } catch (error) {
    console.error("Failed to delete category", error);
  }
};

const resetForm = () => {
  idCategory.value = undefined;
  categoryName.value = "";
  description.value = "";
};

onMounted(loadCategories);
</script>

<template>
  <div class="category-page">
    <h1>Category Management</h1>

    <form @submit.prevent="submitCategory" class="category-form">
      <div class="form-group">
        <label for="categoryName">Category Name</label>
        <input type="text" v-model="categoryName" placeholder="Enter category name" required />
      </div>

      <div class="form-group">
        <label for="description">Description</label>
        <textarea v-model="description" placeholder="Enter description"></textarea>
      </div>

      <button type="submit" class="btn-submit">{{ idCategory ? 'Update' : 'Add' }} Category</button>
    </form>

    <div class="table-container">
      <table>
        <thead>
          <tr>
            <th>Id</th>
            <th>Category Name</th>
            <th>Description</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="category in categoryList" :key="category.Id">
            <td>{{ category.Id }}</td>
            <td>{{ category.name }}</td>
            <td>{{ category.description }}</td>
            <td>
              <button class="btn-edit" @click="handleEditCategory(category)">Edit</button>
              <button class="btn-delete" @click="() => handleDeleteCategory(category.Id!)">Delete</button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<style scoped>
.category-page {
  max-width: auto;
  margin: 40px auto;
  padding: 20px;
  font-family: 'Roboto', sans-serif;
  color: #333;
  background-color: #f5f5f5;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
  border-radius: 12px;
}

h1 {
  text-align: center;
  color: #4CAF50;
  font-size: 2.2rem;
  margin-bottom: 20px;
}

.category-form {
  display: flex;
  flex-wrap: wrap;
  gap: 15px;
  margin-bottom: 30px;
}

.form-group {
  flex: 1 1 100%;
  display: flex;
  flex-direction: column;
}

label {
  font-weight: bold;
  margin-bottom: 5px;
  color: #333;
}

input,
textarea {
  padding: 12px;
  border: 1px solid #ddd;
  border-radius: 8px;
  font-size: 1rem;
  color: #333;
  background-color: #fff;
  transition: border-color 0.3s ease;
}

input:focus,
textarea:focus {
  border-color: #4CAF50;
  outline: none;
}

textarea {
  resize: vertical;
  height: 120px;
}

.btn-submit,
.btn-edit,
.btn-delete {
  padding: 10px 20px;
  border: none;
  border-radius: 8px;
  color: #fff;
  font-size: 1rem;
  cursor: pointer;
  transition: transform 0.2s ease-in-out;
}

.btn-submit {
  background-color: #6C63FF;
}

.btn-submit:hover {
  background-color: #5a54e4;
}

.btn-edit {
  background-color: #00bcd4;
}

.btn-edit:hover {
  background-color: #00a1b1;
}

.btn-delete {
  background-color: #ff4081;
}

.btn-delete:hover {
  background-color: #f50057;
}

.table-container {
  margin-top: 40px;
  overflow-x: auto;
}

table {
  width: 100%;
  border-collapse: collapse;
  background-color: #fff;
  border-radius: 8px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

th,
td {
  padding: 12px;
  text-align: left;
  font-size: 0.9rem;
  color: #333;
}

th {
  background-color: #f2f2f2;
  font-weight: 600;
}

td {
  border-bottom: 1px solid #ddd;
}

tr:hover {
  background-color: #f9f9f9;
}
</style>
