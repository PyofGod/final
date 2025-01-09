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
  Freight: string;
}

interface Categories {
  Id: number,
  name: string,
  description: string
}

interface Supplier {
  Id?: number;
  CompanyName: string;
  ContactName: string;
  ContactTitle: string;
  Address?: string;
  City?: string;
  PostalCode?: string;
  Region?: string;
  Country?: string;
  Phone?: string;
  Fax?: string;
  HomePage?: string;
}

const idProduct = ref<number | undefined>(undefined)
const productList = ref<Product[]>([]);
const categoriesList = ref<Categories[]>([]);
const supplierList = ref<Supplier[]>([]);
const categories = ref<number>(0);
const discontinued = ref<number>(0);
const productName = ref<string>("");
const quantityPerUnit = ref<string>("");
const reorderLevel = ref<number>(0);
const supplierId = ref<number>(0);
const unitPrice = ref<string>("");
const unitsInStock = ref<number>(0);
const unitsOnOrder = ref<number>(0);
const freight = ref<string>("");

const BASE_PATH = import.meta.env.VITE_PORT;

const loadProduct = async () => {
  const res = await HttpService.getAxiosClient().get(`${BASE_PATH}/products`);
  productList.value = res.data;
};

const loadCategory = async () => {
  const res = await HttpService.getAxiosClient().get(`${BASE_PATH}/categories`);
  categoriesList.value = res.data;
}

const loadSupplier = async () => {
  const res = await HttpService.getAxiosClient().get(`${BASE_PATH}/suppliers`);
  supplierList.value = res.data;
}

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
  freight.value = value.Freight;
};
const subMit = async () => {
  if (idProduct.value !== undefined) {
    try {
      const response = await HttpService.getAxiosClient().patch(
        `${BASE_PATH}/products/${idProduct.value}`,
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
          Freight: freight.value,
        }
      );
      if (response.status === 200) {
        await loadProduct();
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
        Freight: freight.value,
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
  freight.value = "";

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
  await loadCategory();
  await loadSupplier();
});
</script>


<template>
  <div class="product-page">
    <h1>เพิ่มสินค้า</h1>
    <form @submit.prevent="subMit" class="product-form">
      <div class="form-group">
        <label for="productName">ชื่อสินค้า</label>
        <input type="text" v-model="productName" placeholder="กรอกชื่อสินค้า" required />
      </div>
      <div class="form-group">
        <label for="categories">หมวดหมู่</label>
        <select v-model="categories" required>
          <option value="" disabled>-- เลือกหมวดหมู่ --</option>
          <option v-for="category in categoriesList" :key="category.Id" :value="category.Id">
            {{ category.Id }} - {{ category.name }}
          </option>
        </select>
      </div>
      <div class="form-group">
        <label for="discontinued">สถานะสินค้า</label>
        <div class="status-group">
          <label>
            <input type="radio" v-model="discontinued" value="1" required />
            ขายอยู่
          </label>
          <label>
            <input type="radio" v-model="discontinued" value="0" required />
            หมดแล้ว
          </label>
        </div>
      </div>
      <div class="form-group">
        <label for="quantityPerUnit">จำนวนต่อหน่วย</label>
        <input type="text" v-model="quantityPerUnit" placeholder="กรอกจำนวนต่อหน่วย" required />
      </div>
      <div class="form-group">
        <label for="reorderLevel">ระดับการสั่งซื้อ</label>
        <input type="number" v-model="reorderLevel" placeholder="กรอกระดับการสั่งซื้อ" required />
      </div>

      <div class="form-group">
        <label for="supplierId">รหัสผู้จัดจำหน่าย</label>
        <select v-model="supplierId" required>
          <option value="" disabled>-- เลือกผู้จำหน่าย --</option>
          <option v-for="supplier in supplierList" :key="supplier.Id" :value="supplier.Id">
            {{ supplier.Id }} - {{ supplier.ContactName }}
          </option>
        </select>
      </div>

      <div class="form-group">
        <label for="unitPrice">ราคาต่อหน่วย</label>
        <input type="text" v-model="unitPrice" placeholder="กรอกราคาต่อหน่วย" required />
      </div>
      <div class="form-group">
        <label for="freight">ค่าขนส่ง</label>
        <input type="text" v-model="freight" placeholder="กรอกค่าขนส่ง" required />
      </div>
      <div class="form-group">
        <label for="unitsInStock">จำนวนสินค้าในสต็อก</label>
        <input type="number" v-model="unitsInStock" placeholder="กรอกจำนวนสินค้าในสต็อก" required />
      </div>
      <div class="form-group">
        <label for="unitsOnOrder">จำนวนสินค้าที่สั่ง</label>
        <input type="number" v-model="unitsOnOrder" placeholder="กรอกจำนวนสินค้าที่สั่ง" required />
      </div>
      <button type="submit" class="btn-add">เพิ่มสินค้า</button>
    </form>

    <div class="table-container">
      <table>
        <thead>
          <tr>
            <th>Id</th>
            <th>ชื่อสินค้า</th>
            <th>หมวดหมู่</th>
            <th>สถานะสินค้า</th>
            <th>จำนวนต่อหน่วย</th>
            <th>ระดับการสั่งซื้อ</th>
            <th>รหัสผู้จัดจำหน่าย</th>
            <th>ราคาต่อหน่วย</th>
            <th>ค่าขนส่ง</th>
            <th>จำนวนสินค้าในสต็อก</th>
            <th>จำนวนสินค้าที่สั่ง</th>
            <th>การดำเนินการ</th>
          </tr>
        </thead>

        <tbody>
          <tr v-for="(product, index) in productList" :key="index">
            <td>{{ index + 1 }}</td>
            <td>{{ product.ProductName }}</td>
            <td>{{ product.CategoryId }}</td>
            <td :style="{ color: product.Discontinued === 1 ? 'green' : 'red' }">
              {{ product.Discontinued === 1 ? 'ขายอยู่' : 'หมดแล้ว' }}
            </td>
            <td>{{ product.QuantityPerUnit }} </td>
            <td>{{ product.ReorderLevel }}</td>
            <td>{{ product.SupplierId }}</td>
            <td>{{ product.UnitPrice }} บาท</td>
            <td>{{ product.Freight }} บาท</td>
            <td>{{ product.UnitsInStock }}</td>
            <td>{{ product.UnitsOnOrder }}</td>
            <td>
              <div class="action-buttons">
                <button class="btn-edit" @click="handleEditProduct(product)">แก้ไข</button>
                <button class="btn-delete"
                  @click="() => { if (product.Id !== undefined) handleDeleteProduct(product.Id) }">ลบ</button>
              </div>
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

.product-form {
  display: flex;
  flex-wrap: wrap;
  gap: 15px;
  margin-bottom: 30px;
}

.form-group {
  flex: 1 1 calc(50% - 15px);
  display: flex;
  flex-direction: column;
}

label {
  font-weight: bold;
  margin-bottom: 5px;
  color: #333;
}

input,
select,
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
select:focus,
textarea:focus {
  border-color: #4CAF50;
  outline: none;
}

textarea {
  resize: vertical;
  height: 120px;
}

.btn-add,
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

.btn-add {
  background-color: #6C63FF;
}

.btn-add:hover {
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
  /* ลดขนาดฟอนต์ของหัวตาราง */
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

.action-buttons {
  display: flex;
  gap: 10px;
}

.status-group {
  display: flex;
  gap: 20px;
}

.status-group label {
  font-size: 1rem;
}

@media (max-width: 768px) {
  .product-form {
    grid-template-columns: 1fr;
  }

  .btn-add,
  .btn-edit,
  .btn-delete {
    width: 100%;
    padding: 12px 0;
  }
}
</style>
