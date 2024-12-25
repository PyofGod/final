<script setup lang="ts">
import { ref, onMounted } from 'vue';
import HttpService from "@/service/HttpService";

interface Product {
  CategoryId?: number;
  Discontinued: number;
  Id?: number;
  ProductName: string;
  QuantityPerUnit: string;
  ReorderLevel: number;
  SupplierId: number;
  UnitPrice: string;
  UnitsInStock: number;
  UnitsOnOrder: number;
}

const productList = ref<Product[]>([]);
const newProduct = ref<Product>({
  Discontinued: 0,
  ProductName: '',
  QuantityPerUnit: '',
  ReorderLevel: 0,
  SupplierId: 0,
  UnitPrice: '',
  UnitsInStock: 0,
  UnitsOnOrder: 0,
});

const BASE_PATH = "http://192.168.1.140:4000"

const loadProduct = async () => {
  const res = await HttpService.getAxiosClient().get(`${BASE_PATH}/products`);
  productList.value = res.data;
};

loadProduct();

// ฟังก์ชันเพิ่มสินค้า
const handleAddProduct = () => {
  productList.value.push({ ...newProduct.value });
};

// ฟังก์ชันลบสินค้า
const handleDeleteProduct = (index) => {
  productList.value.splice(index, 1); // ลบสินค้าตามตำแหน่งในรายการ
};

// ฟังก์ชันรีเซ็ตฟอร์ม
</script>

<template>
  <div class="product-page">
    <h1>Product List</h1>

    <!-- ฟอร์มสำหรับเพิ่มสินค้า -->
    <form @submit.prevent="handleAddProduct" class="product-form">
      <div class="form-group">
        <label for="name">ProductName</label>
        <input type="text" v-model="newProduct.ProductName" placeholder="..." required />
      </div>
      <div class="form-group">
        <label for="name">CategoryId</label>
        <input type="text" v-model="newProduct.CategoryId" placeholder="..." required />
      </div>
      <div class="form-group">
        <label for="price">Discontinued</label>
        <input type="number" v-model="newProduct.Discontinued" placeholder="..." required />
      </div>
      <div class="form-group">
        <label for="category">QuantityPerUnit</label>
        <input type="number" v-model="newProduct.QuantityPerUnit" placeholder="..." required />
      </div>
      <div class="form-group">
        <label for="category">ReorderLevel</label>
        <input type="text" v-model="newProduct.ReorderLevel" placeholder="..." required />
      </div>
      <div class="form-group">
        <label for="category">SupplierId</label>
        <input type="text" v-model="newProduct.SupplierId" placeholder="..." required />
      </div>
      <div class="form-group">
        <label for="category">UnitPrice</label>
        <input type="text" v-model="newProduct.UnitPrice" placeholder="..." required />
      </div>
      <div class="form-group">
        <label for="category">UnitsInStock</label>
        <input type="text" v-model="newProduct.UnitsInStock" placeholder="..." required />
      </div>
      <div class="form-group">
        <label for="category">UnitsOnOrder</label>
        <input type="text" v-model="newProduct.UnitsOnOrder" placeholder="..." required />
      </div>
      <button type="submit" class="btn-add">เพิ่มสินค้า</button>
    </form>

    <!-- ตารางรายการสินค้า -->
    <div class="table-container">
      <table>
        <thead>
          <tr>
            <th>Id</th>
            <th>ProductName</th>
            <th>CategoryId</th>
            <th>Discontinued</th>
            <th>QuantityPerUnit</th>
            <th>ReorderLevel</th>
            <th>SupplierId</th>
            <th>UnitPrice</th>
            <th>UnitsInStock</th>
            <th>UnitsOnOrder</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(product, index) in productList" :key="index">
            <td>{{ index + 1 }}</td>
            <td>{{ product.ProductName }}</td>
            <td>{{ product.CategoryId }}</td>
            <td>{{ product.Discontinued }}</td>
            <td>{{ product.QuantityPerUnit }}</td>
            <td>{{ product.ReorderLevel }}</td>
            <td>{{ product.SupplierId }}</td>
            <td>{{ product.UnitPrice }}</td>
            <td>{{ product.UnitsInStock }}</td>
            <td>{{ product.UnitsOnOrder }}</td>
            <td>
              <button class="btn-delete" @click="handleDeleteProduct(index)">Delete</button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<style scoped>
.product-page {
  max-width: auto;
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
  color: #4CAF50;
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
  background-color: #4CAF50;
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
