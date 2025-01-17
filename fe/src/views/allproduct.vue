<script setup lang="ts">
import { ref, onMounted } from "vue";
import { useRouter } from 'vue-router';
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
  Id: number;
  name: string;
  description: string;
}

const productList = ref<Product[]>([]);
const categoriesList = ref<Categories[]>([]);

const BASE_PATH = import.meta.env.VITE_PORT;
const router = useRouter();

const loadProduct = async () => {
  const res = await HttpService.getAxiosClient().get(`${BASE_PATH}/products`);
  productList.value = res.data;
};

const loadCategory = async () => {
  const res = await HttpService.getAxiosClient().get(`${BASE_PATH}/categories`);
  categoriesList.value = res.data;
};

onMounted(async () => {
  await loadProduct();
  await loadCategory();
});

const handleOrderProduct = (product: Product) => {
  router.push({
    path: '/customer',
    query: { productId: product.Id },
  });
};

const getCategoryName = (categoryId: number) => {
  const category = categoriesList.value.find(c => c.Id === categoryId);
  return category ? category.name : 'ไม่พบหมวดหมู่';
};
</script>

<template>
  <div class="product-page">
    <h1>รายการสินค้า</h1>

    <div class="table-container">
      <table>
        <thead>
          <tr>
            <th>ชื่อสินค้า</th>
            <th>หมวดหมู่</th>
            <th>สถานะสินค้า</th>
            <th>จำนวนต่อหน่วย</th>
            <th>ราคาต่อหน่วย</th>
            <th>ค่าขนส่ง</th>
            <th>จำนวนสินค้าในสต็อก</th>
            <th>การดำเนินการ</th>
          </tr>
        </thead>

        <tbody>
          <tr v-for="(product, index) in productList" :key="product.Id">
            <td>{{ product.ProductName }}</td>
            <td>{{ getCategoryName(product.CategoryId) }}</td>
            <td :style="{ color: product.Discontinued === 1 ? 'green' : 'red' }">
              {{ product.Discontinued === 1 ? 'ขายอยู่' : 'หมดแล้ว' }}
            </td>
            <td>{{ product.QuantityPerUnit }}</td>
            <td>{{ product.UnitPrice }} บาท</td>
            <td>{{ product.Freight }} บาท</td>
            <td>{{ product.UnitsInStock }}</td>
            <td>
              <div class="action-buttons">
                <button class="btn-order" @click="handleOrderProduct(product)">
                  สั่งซื้อ
                </button>
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
  font-family: "Roboto", sans-serif;
  color: #333;
  background-color: #f5f5f5;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
  border-radius: 12px;
}

h1 {
  text-align: center;
  color: #4caf50;
  font-size: 2.2rem;
  margin-bottom: 20px;
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
  text-align: center;
  /* จัดข้อความให้อยู่กลางแนวนอน */
  vertical-align: middle;
  /* จัดข้อความให้อยู่กลางแนวตั้ง */
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

.action-buttons {
  display: flex;
  gap: 10px;
}

.btn-order {
  padding: 10px 20px;
  border: none;
  border-radius: 8px;
  color: #fff;
  font-size: 1rem;
  background-color: #00bcd4;
}

.btn-order:hover {
  background-color: #00a1b1;
}

@media (max-width: 768px) {
  .btn-order {
    padding: 12px 0;
  }
}
</style>
