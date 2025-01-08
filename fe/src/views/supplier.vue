<script setup lang="ts">
import { ref, onMounted } from 'vue';
import HttpService from "@/service/HttpService";

interface Customer {
  Id?: string;
  CompanyName: string;
  ContactName: string;
  ContactTitle: string;
  Address: string;
  City: string;
  Country: string;
  Phone: string;
  Fax?: string;
}

const customerList = ref<Customer[]>([]);

const BASE_PATH = "https://b4wm7jx1-4000.asse.devtunnels.ms";

const loadCustomer = async () => {
  try {
    const res = await HttpService.getAxiosClient().get(`${BASE_PATH}/customers`);
    customerList.value = res.data;
  } catch (error) {
    console.error("Failed to load customers", error);
  }
};

onMounted(() => {
  loadCustomer();
});
</script>

<template>
  <div class="supplier-page">
    <h1>รายการลูกค้า</h1>
    <div class="table-container">
      <table>
        <thead>
          <tr>
            <th>รหัส</th>
            <th>ชื่อบริษัท</th>
            <th>ชื่อผู้ติดต่อ</th>
            <th>ตำแหน่งผู้ติดต่อ</th>
            <th>ที่อยู่</th>
            <th>เมือง</th>
            <th>ประเทศ</th>
            <th>โทรศัพท์</th>
            <th>แฟกซ์</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(customer, index) in customerList" :key="customer.Id">
            <td>{{ customer.Id }}</td>
            <td>{{ customer.CompanyName }}</td>
            <td>{{ customer.ContactName }}</td>
            <td>{{ customer.ContactTitle }}</td>
            <td>{{ customer.Address }}</td>
            <td>{{ customer.City }}</td>
            <td>{{ customer.Country }}</td>
            <td>{{ customer.Phone }}</td>
            <td>{{ customer.Fax }}</td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<style scoped>
.supplier-page {
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
  font-size: 2rem;
  margin-bottom: 20px;
}

.table-container {
  margin-top: 20px;
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
  font-size: 1rem;
  color: #333;
}

th {
  font-weight: 600;
  background-color: #4CAF50;
  color: #fff;
}

td {
  border-bottom: 1px solid #ddd;
}

tr:hover {
  background-color: #f9f9f9;
}
</style>
