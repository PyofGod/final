<script setup lang="ts">
import { ref, onMounted } from 'vue';
import HttpService from "@/service/HttpService";

interface Order {
  Id?: number;
  CustomerId: string;
  EmployeeId: number;
  Freight: string;
  OrderDate: string;
  RequiredDate: string;
  ShipAddress: string;
  ShipCity: string;
  ShipCountry: string;
  ShipName: string;
  ShipPostalCode: string;
  ShipRegion: string;
  ShipVia: number;
  ShippedDate: string;
}

interface Customer {
  Id?: string;
  CompanyName: string;
  ContactName: string;
  ContactTitle: string;
  Fax?: string;
  Address: string;
  City: string;
  Region: string;
  PostalCode: string;
  Country: string;
  Phone: string;
}

const idOrder = ref<number | undefined>(undefined);
const orderList = ref<Order[]>([]);
const customerList = ref<Customer[]>([]);
const customerId = ref<string>("");
const employeeId = ref<number>(0);
const freight = ref<string>("");
const orderDate = ref<string>("");
const requiredDate = ref<string>("");
const shipAddress = ref<string>("");
const shipCity = ref<string>("");
const shipCountry = ref<string>("");
const shipName = ref<string>("");
const shipPostalCode = ref<string>("");
const shipRegion = ref<string>("");
const shipVia = ref<number | null>(null);
const shippedDate = ref<string>("");

const BASE_PATH = "https://b4wm7jx1-4000.asse.devtunnels.ms";

const loadOrders = async () => {
  const res = await HttpService.getAxiosClient().get(`${BASE_PATH}/orders`);
  orderList.value = res.data;
};
const loadCustomer = async () => {
  const res = await HttpService.getAxiosClient().get(`${BASE_PATH}/customers`);
  customerList.value = res.data;
};

const handleEditOrder = async (value: Order) => {
  idOrder.value = value.Id;
  customerId.value = value.CustomerId || "";
  employeeId.value = value.EmployeeId;
  freight.value = value.Freight;
  orderDate.value = value.OrderDate || "";
  requiredDate.value = value.RequiredDate || "";
  shipAddress.value = value.ShipAddress || "";
  shipCity.value = value.ShipCity || "";
  shipCountry.value = value.ShipCountry || "";
  shipName.value = value.ShipName || "";
  shipPostalCode.value = value.ShipPostalCode || "";
  shipRegion.value = value.ShipRegion || "";
  shipVia.value = value.ShipVia || null;
  shippedDate.value = value.ShippedDate || "";
};

const subMit = async () => {
  const orderData = {
    CustomerId: customerId.value,
    EmployeeId: employeeId.value,
    Freight: freight.value,
    OrderDate: orderDate.value,
    RequiredDate: requiredDate.value,
    ShipAddress: shipAddress.value,
    ShipCity: shipCity.value,
    ShipCountry: shipCountry.value,
    ShipName: shipName.value,
    ShipPostalCode: shipPostalCode.value,
    ShipRegion: shipRegion.value,
    ShipVia: shipVia.value,
    ShippedDate: shippedDate.value,
  };

  if (idOrder.value !== undefined) {
    try {
      const response = await HttpService.getAxiosClient().patch(
        `${BASE_PATH}/orders/${idOrder.value}`,
        orderData
      );
      if (response.status === 200) {
        await loadOrders();
      }
    } catch (error) {
      console.error('ไม่สามารถอัปเดตข้อมูลได้', error);
    }
  } else {
    try {
      const res = await HttpService.getAxiosClient().post(`${BASE_PATH}/orders`, orderData);
      if (res.status === 201) {
        await loadOrders();
        console.log('เพิ่มข้อมูล Order สำเร็จ');
      } else {
        console.log('ไม่สามารถเพิ่มข้อมูลได้');
      }
    } catch (error) {
      console.error('ไม่สามารถเพิ่มข้อมูลได้', error);
    }
  }
  reset();
};

const reset = () => {
  idOrder.value = undefined;
  customerId.value = "";
  employeeId.value = 0;
  freight.value = "";
  orderDate.value = "";
  requiredDate.value = "";
  shipAddress.value = "";
  shipCity.value = "";
  shipCountry.value = "";
  shipName.value = "";
  shipPostalCode.value = "";
  shipRegion.value = "";
  shipVia.value = null;
  shippedDate.value = "";
};

const handleDeleteOrder = async (index: number) => {
  try {
    const res = await HttpService.getAxiosClient().delete(`${BASE_PATH}/orders/${index}`);
    if (res.status === 200) {
      await loadOrders();
      console.log('ลบข้อมูล Order สำเร็จ');
    } else {
      console.log('ไม่สามารถลบข้อมูลได้');
    }
  } catch (error) {
    console.error('ไม่สามารถลบข้อมูลได้', error);
  }
};

onMounted(async () => {
  await loadOrders();
  await loadCustomer();
});
</script>

<template>
  <div class="order-page">
    <h1>รายการ Order</h1>
    <form @submit.prevent="subMit" class="order-form">
      <div class="form-group">
        <label for="customerId">รหัสลูกค้า</label>
        <input type="text" v-model="customerId" placeholder="ID ลูกค้า" />
      </div>
      <div class="form-group">
        <label for="employeeId">รหัสพนักงาน</label>
        <input type="number" v-model="employeeId" placeholder="ID พนักงาน" />
      </div>
      <div class="form-group">
        <label for="orderDate">วันที่สั่งซื้อ</label>
        <input type="date" v-model="orderDate" />
      </div>
      <div class="form-group">
        <label for="requiredDate">วันที่ต้องการ</label>
        <input type="date" v-model="requiredDate" />
      </div>
      <div class="form-group">
        <label for="shipAddress">ที่อยู่จัดส่ง</label>
        <input type="text" v-model="shipAddress" placeholder="กรอกที่อยู่จัดส่ง" />
      </div>
      <div class="form-group">
        <label for="shipCity">เมืองจัดส่ง</label>
        <input type="text" v-model="shipCity" placeholder="กรอกเมืองจัดส่ง" />
      </div>
      <div class="form-group">
        <label for="shipCountry">ประเทศจัดส่ง</label>
        <input type="text" v-model="shipCountry" placeholder="กรอกประเทศจัดส่ง" />
      </div>
      <div class="form-group">
        <label for="shipName">ชื่อผู้รับ</label>
        <input type="text" v-model="shipName" placeholder="กรอกชื่อผู้รับ" />
      </div>
      <div class="form-group">
        <label for="shipPostalCode">รหัสไปรษณีย์</label>
        <input type="text" v-model="shipPostalCode" placeholder="กรอกรหัสไปรษณีย์" />
      </div>
      <div class="form-group">
        <label for="shipRegion">ภูมิภาคจัดส่ง</label>
        <input type="text" v-model="shipRegion" placeholder="กรอกภูมิภาคจัดส่ง" />
      </div>
      <div class="form-group">
        <label for="shipVia">การขนส่ง</label>
        <input type="number" v-model="shipVia" placeholder="กรอกหมายเลขขนส่ง" />
      </div>
      <div class="form-group">
        <label for="shippedDate">วันที่ส่งสินค้า</label>
        <input type="date" v-model="shippedDate" />
      </div>
      <button type="submit" class="btn-add">เพิ่ม/แก้ไข Order</button>
    </form>

    <div class="table-container">
      <table>
        <thead>
          <tr>
            <th>Id</th>
            <th>รหัสลูกค้า</th>
            <th>รหัสพนักงาน</th>
            <th>ค่าขนส่ง</th>
            <th>วันที่สั่งซื้อ</th>
            <th>วันที่ต้องการ</th>
            <th>ที่อยู่จัดส่ง</th>
            <th>เมืองจัดส่ง</th>
            <th>ประเทศจัดส่ง</th>
            <th>ชื่อผู้รับ</th>
            <th>รหัสไปรษณีย์</th>
            <th>ภูมิภาคจัดส่ง</th>
            <th>การขนส่ง</th>
            <th>วันที่ส่งสินค้า</th>
            <th>การกระทำ</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(order, index) in orderList" :key="index">
            <td>{{ order.Id }}</td>
            <td>{{ order.CustomerId }}</td>
            <td>{{ order.EmployeeId }}</td>
            <td>{{ order.Freight }}</td>
            <td>{{ order.OrderDate }}</td>
            <td>{{ order.RequiredDate }}</td>
            <td>{{ order.ShipAddress }}</td>
            <td>{{ order.ShipCity }}</td>
            <td>{{ order.ShipCountry }}</td>
            <td>{{ order.ShipName }}</td>
            <td>{{ order.ShipPostalCode }}</td>
            <td>{{ order.ShipRegion }}</td>
            <td>{{ order.ShipVia }}</td>
            <td>{{ order.ShippedDate }}</td>
            <td>
              <button class="btn-edit" @click="handleEditOrder(order)">แก้ไข</button>
              <button class="btn-delete"
                @click="() => { if (order.Id !== undefined) handleDeleteOrder(order.Id) }">ลบ</button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<style scoped>
.order-page {
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

.order-form {
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
  .order-form {
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
