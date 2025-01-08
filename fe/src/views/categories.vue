<script setup lang="ts">
import { ref, onMounted } from 'vue';
import HttpService from "@/service/HttpService";

interface Category {
  Id?: number;
  name: string;
  description: string;
}

const idCategory = ref<number | undefined>(undefined);
const categoryList = ref<Category[]>([]);
const categoryName = ref<string>("");
const description = ref<string>("");

const BASE_PATH = "https://b4wm7jx1-4000.asse.devtunnels.ms";

const loadCategories = async () => {
  try {
    const res = await HttpService.getAxiosClient().get(`${BASE_PATH}/categories`);
    categoryList.value = res.data;
  } catch (error) {
    console.error("ไม่สามารถโหลดหมวดหมู่ได้", error);
  }
};

const handleEditCategory = (value: Category) => {
  idCategory.value = value.Id;
  categoryName.value = value.name;
  description.value = value.description;
};

const submitCategory = async () => {
  if (idCategory.value !== undefined) {
    try {
      const response = await HttpService.getAxiosClient().patch(
        `${BASE_PATH}/categories/${idCategory.value}`,
        {
          name: categoryName.value,
          description: description.value,
        }
      );
      if (response.status === 200) {
        await loadCategories();
        console.log("อัปเดตหมวดหมู่สำเร็จ");
      }
    } catch (error) {
      console.log("ไม่สามารถอัปเดตหมวดหมู่ได้", error);
    }
  } else {
    try {
      const res = await HttpService.getAxiosClient().post(`${BASE_PATH}/categories`, {
        name: categoryName.value,
        description: description.value,
      });
      if (res.status === 201) {
        await loadCategories();
        console.log("เพิ่มหมวดหมู่สำเร็จ");
      } else {
        console.log("ไม่สามารถเพิ่มหมวดหมู่ได้");
      }
    } catch (error) {
      console.log("ไม่สามารถเพิ่มหมวดหมู่ได้", error);
    }
  }
  resetForm();
};

const handleDeleteCategory = async (id: number) => {
  try {
    const res = await HttpService.getAxiosClient().delete(`${BASE_PATH}/categories/${id}`);
    if (res.status === 200) {
      console.log("ลบหมวดหมู่สำเร็จ");
      await loadCategories();
    }
  } catch (error) {
    console.error("ไม่สามารถลบหมวดหมู่ได้", error);
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
    <h1>จัดการหมวดหมู่</h1>

    <form @submit.prevent="submitCategory" class="category-form">
      <div class="form-group">
        <label for="categoryName">ชื่อหมวดหมู่</label>
        <input type="text" v-model="categoryName" placeholder="กรอกชื่อหมวดหมู่" required />
      </div>

      <div class="form-group">
        <label for="description">คำอธิบาย</label>
        <textarea v-model="description" placeholder="กรอกคำอธิบาย"></textarea>
      </div>

      <button type="submit" class="btn-submit">{{ idCategory ? 'อัปเดต' : 'เพิ่ม' }} หมวดหมู่</button>
    </form>

    <div class="table-container">
      <table>
        <thead>
          <tr>
            <th>รหัส</th>
            <th>ชื่อหมวดหมู่</th>
            <th>คำอธิบาย</th>
            <th>การกระทำ</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="category in categoryList" :key="category.Id">
            <td>{{ category.Id }}</td>
            <td>{{ category.name }}</td>
            <td>{{ category.description }}</td>
            <td>
              <button class="btn-edit" @click="handleEditCategory(category)">แก้ไข</button>
              <button class="btn-delete" @click="() => handleDeleteCategory(category.Id!)">ลบ</button>
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
