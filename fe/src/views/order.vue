<script setup lang="ts">
import { ref, onMounted } from 'vue';
import HttpService from "@/service/HttpService";

// เพิ่มข้อมูลเกี่ยวกับหมวดหมู่สินค้า
interface Category {
  Id: number;
  CategoryName: string;
}

interface Order {
  Id?: number;
  CustomerId: string;
  Freight: string;
  OrderDate: string;
  ShipAddress: string;
  ShipCity: string;
  ShipCountry: string;
  ShipName: string;
  ShipPostalCode: string;
  ShipRegion: string;
  ShippedDate: string;
  ProductId: number;
}

interface Customer {
  Id: string;
  CompanyName: string;
  ContactName: string;
  ContactTitle: string;
  Address: string;
  City: string;
  Region: string;
  PostalCode: string;
  Country: string;
  Phone: string;
}

interface Product {
  Id: number;
  ProductName: string;
  CategoryId: number;
  CategoryName: string;  // เพิ่มการใช้ CategoryName
  UnitPrice: string;
  UnitsInStock: number;
}

const BASE_PATH = import.meta.env.VITE_PORT;

const orderList = ref<Order[]>([]);
const customerList = ref<Customer[]>([]);
const dialogVisible = ref(false);
const selectedProduct = ref<Product | null>(null);
const formState = ref<Order | null>(null);
const categories = ref<Category[]>([]); // เพิ่มข้อมูลหมวดหมู่สินค้า

const loadOrders = async () => {
  const res = await HttpService.getAxiosClient().get(`${BASE_PATH}/orders`);
  orderList.value = res.data;
};

const loadCustomer = async () => {
  const res = await HttpService.getAxiosClient().get(`${BASE_PATH}/customers`);
  customerList.value = res.data;
};

const loadCategories = async () => {
  const res = await HttpService.getAxiosClient().get(`${BASE_PATH}/categories`);
  categories.value = res.data; // โหลดข้อมูลหมวดหมู่สินค้า
};

const showProductDetails = async (productId: number) => {
  try {
    const res = await HttpService.getAxiosClient().get(`${BASE_PATH}/products/${productId}`);
    selectedProduct.value = res.data;
    dialogVisible.value = true;
  } catch (error) {
    console.error('ไม่สามารถโหลดข้อมูลสินค้าได้', error);
  }
};

const closeDialog = () => {
  dialogVisible.value = false;
  selectedProduct.value = null;
};

const handleEditOrder = (order: Order) => {
  formState.value = { ...order }; // เปิด Dialog พร้อมข้อมูลใน formState
};

const handleSaveOrder = async () => {
  if (!formState.value) return;

  const orderData = {
    CustomerId: formState.value.CustomerId,
    Freight: formState.value.Freight,
    OrderDate: formState.value.OrderDate,
    ShipAddress: formState.value.ShipAddress,
    ShipCity: formState.value.ShipCity,
    ShipCountry: formState.value.ShipCountry,
    ShipName: formState.value.ShipName,
    ShipPostalCode: formState.value.ShipPostalCode,
    ShipRegion: formState.value.ShipRegion,
    ShippedDate: formState.value.ShippedDate,
  };

  try {
    if (formState.value.Id) {
      await HttpService.getAxiosClient().patch(`${BASE_PATH}/orders/${formState.value.Id}`, orderData);
    } else {
      await HttpService.getAxiosClient().post(`${BASE_PATH}/orders`, orderData);
    }
    await loadOrders();
    formState.value = null; // ปิด Dialog หลังจากบันทึกสำเร็จ
  } catch (error) {
    console.error('ไม่สามารถบันทึกข้อมูลได้', error);
  }
};

const handleDeleteOrder = async (orderId: number) => {
  try {
    await HttpService.getAxiosClient().delete(`${BASE_PATH}/orders/${orderId}`);
    await loadOrders();
  } catch (error) {
    console.error('ไม่สามารถลบข้อมูลได้', error);
  }
};

// ฟังก์ชันแปลงวันที่เป็นรูปแบบ dd/mm/yyyy
const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const year = date.getFullYear();
  return `${day}/${month}/${year}`;
};

onMounted(async () => {
  await loadOrders();
  await loadCustomer();
  await loadCategories();  // โหลดข้อมูลหมวดหมู่สินค้า
});
</script>

<template>
  <div class="table-container">
    <table>
      <thead>
        <tr>
          <th>Id</th>
          <th>รหัสลูกค้า</th>
          <th>ค่าขนส่ง</th>
          <th>วันที่สั่งซื้อ</th>
          <th>ที่อยู่จัดส่ง</th>
          <th>เมืองจัดส่ง</th>
          <th>ประเทศจัดส่ง</th>
          <th>ชื่อผู้รับ</th>
          <th>รหัสไปรษณีย์</th>
          <th>ภูมิภาคจัดส่ง</th>
          <th>วันที่ส่งสินค้า</th>
          <th>การกระทำ</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(order, index) in orderList" :key="index">
          <td>{{ order.Id }}</td>
          <td>{{ order.CustomerId }}</td>
          <td>{{ order.Freight }}</td>
          <td>{{ formatDate(order.OrderDate) }}</td> <!-- ใช้ฟังก์ชัน formatDate -->
          <td>{{ order.ShipAddress }}</td>
          <td>{{ order.ShipCity }}</td>
          <td>{{ order.ShipCountry }}</td>
          <td>{{ order.ShipName }}</td>
          <td>{{ order.ShipPostalCode }}</td>
          <td>{{ order.ShipRegion }}</td>
          <td>{{ formatDate(order.ShippedDate) }}</td> <!-- ใช้ฟังก์ชัน formatDate -->
          <td>
            <button class="btn-edit" @click="handleEditOrder(order)">แก้ไข</button>
            <button class="btn-delete"
              @click="() => { if (order.Id !== undefined) handleDeleteOrder(order.Id) }">ลบ</button>
            <button class="btn-details" @click="showProductDetails(order.ProductId)">รายละเอียดสินค้า</button>
          </td>
        </tr>
      </tbody>
    </table>
  </div>

  <!-- Dialog แสดงรายละเอียดสินค้า -->
  <div v-if="dialogVisible" class="dialog-overlay">
    <div class="dialog">
      <h3>รายละเอียดสินค้า</h3>
      <p><strong>ชื่อสินค้า:</strong> {{ selectedProduct?.ProductName }}</p>
      <p><strong>ราคา:</strong> {{ selectedProduct?.UnitPrice }}</p>
      <button class="btn-close" @click="closeDialog">ปิด</button>
    </div>
  </div>

  <!-- Dialog แก้ไขข้อมูลคำสั่งซื้อ -->
  <div v-if="formState" class="dialog-overlay">
    <div class="dialog">
      <h3>แก้ไขคำสั่งซื้อ</h3>
      <div class="form-group">
        <label for="CustomerId">รหัสลูกค้า</label>
        <input id="CustomerId" v-model="formState.CustomerId" type="text" />
      </div>
      <div class="form-group">
        <label for="Freight">ค่าขนส่ง</label>
        <input id="Freight" v-model="formState.Freight" type="text" />
      </div>
      <div class="form-group">
        <label for="OrderDate">วันที่สั่งซื้อ</label>
        <input id="OrderDate" v-model="formState.OrderDate" type="date" />
      </div>
      <div class="form-group">
        <label for="ShipAddress">ที่อยู่จัดส่ง</label>
        <input id="ShipAddress" v-model="formState.ShipAddress" type="text" />
      </div>
      <div class="form-group">
        <label for="ShipCity">เมืองจัดส่ง</label>
        <input id="ShipCity" v-model="formState.ShipCity" type="text" />
      </div>
      <div class="form-group">
        <label for="ShipCountry">ประเทศจัดส่ง</label>
        <input id="ShipCountry" v-model="formState.ShipCountry" type="text" />
      </div>
      <div class="form-group">
        <label for="ShipName">ชื่อผู้รับ</label>
        <input id="ShipName" v-model="formState.ShipName" type="text" />
      </div>
      <div class="form-group">
        <label for="ShipPostalCode">รหัสไปรษณีย์</label>
        <input id="ShipPostalCode" v-model="formState.ShipPostalCode" type="text" />
      </div>
      <div class="form-group">
        <label for="ShipRegion">ภูมิภาคจัดส่ง</label>
        <input id="ShipRegion" v-model="formState.ShipRegion" type="text" />
      </div>
      <div class="form-group">
        <label for="ShippedDate">วันที่ส่งสินค้า</label>
        <input id="ShippedDate" v-model="formState.ShippedDate" type="date" />
      </div>
      <div class="action-buttons">
        <button class="btn-edit" @click="handleSaveOrder">บันทึก</button>
        <button class="btn-delete" @click="formState = null">ยกเลิก</button>
      </div>
    </div>
  </div>
</template>


<style scoped>
.dialog-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
}

.dialog {
  background: white;
  padding: 20px;
  border-radius: 8px;
  min-width: 300px;
  max-width: 600px;
}

.table-container {
  margin: 20px;
}

table {
  width: 100%;
  border-collapse: collapse;
}

th,
td {
  border: 1px solid #ccc;
  padding: 8px;
  text-align: left;
}

thead {
  background-color: #f4f4f4;
}

.btn-edit {
  background-color: #4caf50;
  color: white;
  padding: 5px 10px;
  border: none;
  cursor: pointer;
}

.btn-delete {
  background-color: #f44336;
  color: white;
  padding: 5px 10px;
  border: none;
  cursor: pointer;
}

.btn-details {
  background-color: #2196f3;
  color: white;
  padding: 5px 10px;
  border: none;
  cursor: pointer;
}

.action-buttons {
  display: flex;
  gap: 10px;
  margin-top: 20px;
}
</style>
