<script setup lang="ts">
import { ref, onMounted } from "vue";
import HttpService from "@/service/HttpService";

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

const idCustomer = ref<string | undefined>(undefined);
const customerList = ref<Customer[]>([]);

const companyName = ref<string>("");
const contactName = ref<string>("");
const contactTitle = ref<string>("");
const fax = ref<string>("");
const address = ref<string>("");
const city = ref<string>("");
const region = ref<string>("");
const postalCode = ref<string>("");
const country = ref<string>("");
const phone = ref<string>("");

const BASE_PATH = "http://192.168.1.140:4000";

const loadCustomer = async () => {
  const res = await HttpService.getAxiosClient().get(`${BASE_PATH}/customers`);
  customerList.value = res.data;
};
loadCustomer();

const handleEditCustomer = async (value: Customer) => {
  idCustomer.value = value.Id;
  companyName.value = value.CompanyName;
  contactName.value = value.ContactName;
  contactTitle.value = value.ContactTitle;
  fax.value = value.Fax || "";
  address.value = value.Address;
  city.value = value.City;
  region.value = value.Region;
  postalCode.value = value.PostalCode;
  country.value = value.Country;
  phone.value = value.Phone;
};

const submit = async () => {
  if (idCustomer.value !== undefined) {
    try {
      const response = await HttpService.getAxiosClient().patch(
        `${BASE_PATH}/customers/${idCustomer.value}`,
        {
          CompanyName: companyName.value,
          ContactName: contactName.value,
          ContactTitle: contactTitle.value,
          Fax: fax.value,
          Address: address.value,
          City: city.value,
          Region: region.value,
          PostalCode: postalCode.value,
          Country: country.value,
          Phone: phone.value,
        }
      );
      if (response.status === 200) {
        await loadCustomer();
      }
    } catch (error) {
      console.log("Failed to update customer", error);
    }
  } else {
    try {
      const res = await HttpService.getAxiosClient().post(
        `${BASE_PATH}/customers`,
        {
          CompanyName: companyName.value,
          ContactName: contactName.value,
          ContactTitle: contactTitle.value,
          Fax: fax.value,
          Address: address.value,
          City: city.value,
          Region: region.value,
          PostalCode: postalCode.value,
          Country: country.value,
          Phone: phone.value,
        }
      );
      if (res.status === 201) {
        await loadCustomer();
        console.log("Customer added successfully");
      } else {
        console.log("Failed to add customer");
      }
    } catch (error) {
      console.log("Failed to add customer", error);
    }
  }
  reset();
};

const reset = async () => {
  idCustomer.value = undefined;
  companyName.value = "";
  contactName.value = "";
  contactTitle.value = "";
  fax.value = "";
  address.value = "";
  city.value = "";
  region.value = "";
  postalCode.value = "";
  country.value = "";
  phone.value = "";
};

const handleDeleteCustomer = async (index: string) => {
  try {
    const res = await HttpService.getAxiosClient().delete(
      `${BASE_PATH}/customers/${index}`
    );
    if (res.status === 200) {
      await loadCustomer();
      console.log("Customer removed successfully");
    } else {
      console.log("Failed to remove customer");
    }
  } catch (error) {
    console.log("Failed to remove customer", error);
  }
};
</script>

<template>
  <div class="customer-page">
    <h1>รายชื่อลูกค้า</h1>
    <form @submit.prevent="submit" class="customer-form">
      <div class="form-group">
        <label for="companyName">ชื่อบริษัท</label>
        <input type="text" v-model="companyName" placeholder="กรอกชื่อบริษัท" required />
      </div>
      <div class="form-group">
        <label for="contactName">ชื่อผู้ติดต่อ</label>
        <input type="text" v-model="contactName" placeholder="กรอกชื่อผู้ติดต่อ" required />
      </div>
      <div class="form-group">
        <label for="contactTitle">ตำแหน่งผู้ติดต่อ</label>
        <input type="text" v-model="contactTitle" placeholder="กรอกตำแหน่งผู้ติดต่อ" required />
      </div>
      <div class="form-group">
        <label for="fax">หมายเลขแฟกซ์</label>
        <input type="text" v-model="fax" placeholder="กรอกหมายเลขแฟกซ์" />
      </div>
      <div class="form-group">
        <label for="address">ที่อยู่</label>
        <input type="text" v-model="address" placeholder="กรอกที่อยู่" required />
      </div>
      <div class="form-group">
        <label for="city">เมือง</label>
        <input type="text" v-model="city" placeholder="กรอกเมือง" required />
      </div>
      <div class="form-group">
        <label for="region">ภาค</label>
        <input type="text" v-model="region" placeholder="กรอกภาค" required />
      </div>
      <div class="form-group">
        <label for="postalCode">รหัสไปรษณีย์</label>
        <input type="text" v-model="postalCode" placeholder="กรอกรหัสไปรษณีย์" required />
      </div>
      <div class="form-group">
        <label for="country">ประเทศ</label>
        <input type="text" v-model="country" placeholder="กรอกประเทศ" required />
      </div>
      <div class="form-group">
        <label for="phone">หมายเลขโทรศัพท์</label>
        <input type="text" v-model="phone" placeholder="กรอกหมายเลขโทรศัพท์" required />
      </div>
      <button type="submit" class="btn-add">เพิ่ม / แก้ไข ลูกค้า</button>
    </form>

    <div class="table-container">
      <table>
        <thead>
          <tr>
            <th>รหัส</th>
            <th>ชื่อบริษัท</th>
            <th>ชื่อผู้ติดต่อ</th>
            <th>ตำแหน่งผู้ติดต่อ</th>
            <th>โทรศัพท์</th>
            <th>แฟกซ์</th>
            <th>เมือง</th>
            <th>ประเทศ</th>
            <th>การกระทำ</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(customer, index) in customerList" :key="index">
            <td>{{ customer.Id }}</td>
            <td>{{ customer.CompanyName }}</td>
            <td>{{ customer.ContactName }}</td>
            <td>{{ customer.ContactTitle }}</td>
            <td>{{ customer.Phone }}</td>
            <td>{{ customer.Fax }}</td>
            <td>{{ customer.City }}</td>
            <td>{{ customer.Country }}</td>
            <td>
              <div class="action-buttons">
                <button class="btn-edit" @click="handleEditCustomer(customer)">
                  แก้ไข
                </button>
                <button class="btn-delete" @click="() => handleDeleteCustomer(customer.Id)">
                  ลบ
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
.customer-page {
  width: 80%;
  max-width: 1200px;
  margin: 40px auto;
  padding: 30px;
  background-color: #f5f5f5;
  border-radius: 12px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
  font-family: 'Roboto', sans-serif;
}

h1 {
  text-align: center;
  color: #4CAF50;
  font-size: 2.2rem;
  margin-bottom: 20px;
}

.customer-form {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 20px;
  margin-bottom: 30px;
}

.form-group {
  display: flex;
  flex-direction: column;
}

label {
  font-size: 1rem;
  font-weight: 600;
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

.btn-add,
.btn-edit,
.btn-delete {
  padding: 8px 16px;
  border: none;
  border-radius: 8px;
  color: #fff;
  font-size: 0.95rem;
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
  padding: 15px;
  text-align: left;
  font-size: 1rem;
  color: #333;
}

th {
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
  justify-content: flex-start;
}

@media (max-width: 768px) {
  .customer-form {
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
