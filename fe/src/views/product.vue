<script setup lang="ts">
import { ref, onMounted } from 'vue';
import HttpService from "@/service/HttpService";

interface Product {
  CategoryId: number;
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

const idProduct = ref<number | undefined>(undefined)
const productList = ref<Product[]>([]);
const categories = ref<number>(0);
const discontinued = ref<number>(0);
const productName = ref<string>("");
const quantityPerUnit = ref<string>("");
const reorderLevel = ref<number>(0);
const supplierId = ref<number>(0);
const unitPrice = ref<string>("");
const unitsInStock = ref<number>(0);
const unitsOnOrder = ref<number>(0);
const currentProductId = ref<number | null>(null); // เก็บ ID ของสินค้าที่กำลังแก้ไข

const BASE_PATH = "http://192.168.1.140:4000";

const loadProduct = async () => {
  const res = await HttpService.getAxiosClient().get(`${BASE_PATH}/products`);
  productList.value = res.data;
};

const handleEditProduct = async (value: Product) => {
  idProduct.value = value.Id
  productName.value = value.ProductName;
  unitsOnOrder.value = value.UnitsOnOrder;
  unitsInStock.value = value.UnitsInStock;
  unitPrice.value = value.UnitPrice;
  supplierId.value = value.SupplierId;
  reorderLevel.value = value.ReorderLevel;
  quantityPerUnit.value = value.QuantityPerUnit;
  discontinued.value = value.Discontinued;
  categories.value = value.CategoryId;
};
const subMit = async () => {
  if (idProduct.value !== undefined) {
    try {
      const response = await HttpService.getAxiosClient().patch(
        `${BASE_PATH}/products/${idProduct.value}`, // ใช้ ID จาก currentProductId
        {
          UnitsOnOrder: unitsOnOrder.value,
          UnitsInStock: unitsInStock.value,
          UnitPrice: unitPrice.value,
          SupplierId: supplierId.value,
          ReorderLevel: reorderLevel.value,
          QuantityPerUnit: quantityPerUnit.value,
          Discontinued: discontinued.value,
          CategoryId: categories.value,
          ProductName: productName.value,
        }
      );
      if (response.status === 200) {
        await loadProduct(); // โหลดข้อมูลใหม่หลังจากแก้ไขสำเร็จ
        console.log('Product updated successfully');
        currentProductId.value = null; // รีเซ็ตหลังจากแก้ไขเสร็จ
      }
    } catch (error) {
      console.log('Failed to update product', error);
    }
  } else {
    try {
      const res = await HttpService.getAxiosClient().post(`${BASE_PATH}/products`, {
        UnitsOnOrder: unitsOnOrder.value,
        UnitsInStock: unitsInStock.value,
        UnitPrice: unitPrice.value,
        SupplierId: supplierId.value,
        ReorderLevel: reorderLevel.value,
        QuantityPerUnit: quantityPerUnit.value,
        Discontinued: discontinued.value,
        CategoryId: categories.value,
        ProductName: productName.value,
      });
      if (res.status === 201) {
        await loadProduct();
        console.log('Product added successfully');
      } else {
        console.log('Failed to add product');
      }
    } catch (error) {
      console.log('Failed to add product', error);
    }
  }
  reset();
}

const reset = async () => {
  idProduct.value = undefined
  productName.value = "";
  unitsOnOrder.value = 0;
  unitsInStock.value = 0;
  unitPrice.value = "";
  supplierId.value = 0;
  reorderLevel.value = 0;
  quantityPerUnit.value = "";
  discontinued.value = 0;
  categories.value = 0;
}

const handleDeleteProduct = async (index: number) => {
  try {
    const res = await HttpService.getAxiosClient().delete(`${BASE_PATH}/products/${index}`);
    if (res.status === 200) {
      await loadProduct(); // Reload fruits list
      console.log('Product removed successfully');
    } else {
      console.log('Failed to remove product');
    }
  } catch (error) {
    console.log('Failed to remove product', error);
  }
};

onMounted(async () => {
  await loadProduct();
});
</script>

<template>
  <div class="product-page">
    <h1>Product List</h1>
    <form @submit.prevent="subMit" class="product-form">
      <div class="form-group">
        <label for="name">ProductName</label>
        <input type="text" v-model="productName" placeholder="..." required />
      </div>
      <div class="form-group">
        <label for="price">Categories</label>
        <input type="text" v-model="categories" placeholder="..." required />
      </div>
      <div class="form-group">
        <label for="price">Discontinued</label>
        <input type="number" v-model="discontinued" placeholder="..." required />
      </div>
      <div class="form-group">
        <label for="category">QuantityPerUnit</label>
        <input type="text" v-model="quantityPerUnit" placeholder="..." required />
      </div>
      <div class="form-group">
        <label for="category">ReorderLevel</label>
        <input type="number" v-model="reorderLevel" placeholder="..." required />
      </div>
      <div class="form-group">
        <label for="category">SupplierId</label>
        <input type="number" v-model="supplierId" placeholder="..." required />
      </div>
      <div class="form-group">
        <label for="category">UnitPrice</label>
        <input type="text" v-model="unitPrice" placeholder="..." required />
      </div>
      <div class="form-group">
        <label for="category">UnitsInStock</label>
        <input type="number" v-model="unitsInStock" placeholder="..." required />
      </div>
      <div class="form-group">
        <label for="category">UnitsOnOrder</label>
        <input type="number" v-model="unitsOnOrder" placeholder="..." required />
      </div>
      <button type="submit" class="btn-add">เพิ่มสินค้า</button>
    </form>

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
              <button class="btn-edit" @click="handleEditProduct(product)">Edit</button>
            </td>
            <td>
              <button class="btn-delete"
                @click="() => { if (product.Id !== undefined) handleDeleteProduct(product.Id) }">Delete</button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<style scoped>
/* style เดิมตามที่คุณให้มา */
</style>
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

.btn-edit {
  background-color: blue;
  color: white;
  padding: 5px 10px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.3s;
}
</style>
