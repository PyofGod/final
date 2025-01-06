<script setup lang="ts">
import { ref, onMounted } from 'vue';
import HttpService from "@/service/HttpService";

interface Supplier {
  Id?: number;
  CompanyName: string;
  ContactName: string;
  ContactTitle: string;
  Address: string;
  City: string;
  Country: string;
  Phone: string;
  Fax: string;
  HomePage: string;
  PostalCode: string;
  Region: string;
}

const idSupplier = ref<number | undefined>(undefined);
const supplierList = ref<Supplier[]>([]);
const companyName = ref<string>("");
const contactName = ref<string>("");
const contactTitle = ref<string>("");
const address = ref<string>("");
const city = ref<string>("");
const country = ref<string>("");
const phone = ref<string>("");
const fax = ref<string>("");
const homePage = ref<string>("");
const postalCode = ref<string>("");
const region = ref<string>("");

const BASE_PATH = "http://192.168.1.140:4000";

const loadSuppliers = async () => {
  const res = await HttpService.getAxiosClient().get(`${BASE_PATH}/suppliers`);
  supplierList.value = res.data;
};

const handleEditSupplier = (value: Supplier) => {
  idSupplier.value = value.Id;
  companyName.value = value.CompanyName;
  contactName.value = value.ContactName;
  contactTitle.value = value.ContactTitle;
  address.value = value.Address;
  city.value = value.City;
  country.value = value.Country;
  phone.value = value.Phone;
  fax.value = value.Fax;
  homePage.value = value.HomePage;
  postalCode.value = value.PostalCode;
  region.value = value.Region;
};

// ส่งข้อมูล (เพิ่มหรือแก้ไขซัพพลายเออร์)
const subMit = async () => {
  if (idSupplier.value !== undefined) {
    try {
      const response = await HttpService.getAxiosClient().patch(
        `${BASE_PATH}/suppliers/${idSupplier.value}`,
        {
          CompanyName: companyName.value,
          ContactName: contactName.value,
          ContactTitle: contactTitle.value,
          Address: address.value,
          City: city.value,
          Country: country.value,
          Phone: phone.value,
          Fax: fax.value,
          HomePage: homePage.value,
          PostalCode: postalCode.value,
          Region: region.value,
        }
      );
      if (response.status === 200) {
        await loadSuppliers();
      }
    } catch (error) {
      console.log('ไม่สามารถอัพเดทซัพพลายเออร์ได้', error);
    }
  } else {
    try {
      const res = await HttpService.getAxiosClient().post(`${BASE_PATH}/suppliers`, {
        CompanyName: companyName.value,
        ContactName: contactName.value,
        ContactTitle: contactTitle.value,
        Address: address.value,
        City: city.value,
        Country: country.value,
        Phone: phone.value,
        Fax: fax.value,
        HomePage: homePage.value,
        PostalCode: postalCode.value,
        Region: region.value,
      });
      if (res.status === 201) {
        await loadSuppliers();
        console.log('เพิ่มซัพพลายเออร์สำเร็จ');
      } else {
        console.log('ไม่สามารถเพิ่มซัพพลายเออร์ได้');
      }
    } catch (error) {
      console.log('ไม่สามารถเพิ่มซัพพลายเออร์ได้', error);
    }
  }
  reset();
};

// รีเซ็ตฟอร์ม
const reset = () => {
  idSupplier.value = undefined;
  companyName.value = "";
  contactName.value = "";
  contactTitle.value = "";
  address.value = "";
  city.value = "";
  country.value = "";
  phone.value = "";
  fax.value = "";
  homePage.value = "";
  postalCode.value = "";
  region.value = "";
};

// ลบข้อมูลซัพพลายเออร์
const handleDeleteSupplier = async (id: number) => {
  try {
    const res = await HttpService.getAxiosClient().delete(`${BASE_PATH}/suppliers/${id}`);
    if (res.status === 200) {
      await loadSuppliers();
      console.log('ลบซัพพลายเออร์สำเร็จ');
    } else {
      console.log('ไม่สามารถลบซัพพลายเออร์ได้');
    }
  } catch (error) {
    console.log('ไม่สามารถลบซัพพลายเออร์ได้', error);
  }
};

// โหลดข้อมูลเมื่อหน้าถูกแสดง
onMounted(async () => {
  await loadSuppliers();
});
</script>

<template>
  <div class="supplier-page">
    <h1>รายการซัพพลายเออร์</h1>
    <form @submit.prevent="subMit" class="supplier-form">
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
        <label for="address">ที่อยู่</label>
        <input type="text" v-model="address" placeholder="กรอกที่อยู่" required />
      </div>
      <div class="form-group">
        <label for="city">เมือง</label>
        <input type="text" v-model="city" placeholder="กรอกเมือง" required />
      </div>
      <div class="form-group">
        <label for="country">ประเทศ</label>
        <input type="text" v-model="country" placeholder="กรอกประเทศ" required />
      </div>
      <div class="form-group">
        <label for="phone">โทรศัพท์</label>
        <input type="text" v-model="phone" placeholder="กรอกหมายเลขโทรศัพท์" required />
      </div>
      <div class="form-group">
        <label for="fax">แฟกซ์</label>
        <input type="text" v-model="fax" placeholder="กรอกแฟกซ์" required />
      </div>
      <div class="form-group">
        <label for="homePage">หน้าเว็บไซต์</label>
        <input type="text" v-model="homePage" placeholder="กรอกเว็บไซต์" required />
      </div>
      <div class="form-group">
        <label for="postalCode">รหัสไปรษณีย์</label>
        <input type="text" v-model="postalCode" placeholder="กรอกรหัสไปรษณีย์" required />
      </div>
      <div class="form-group">
        <label for="region">ภูมิภาค</label>
        <input type="text" v-model="region" placeholder="กรอกภูมิภาค" required />
      </div>
      <button type="submit" class="btn-add">เพิ่มซัพพลายเออร์</button>
    </form>

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
            <th>หน้าเว็บไซต์</th>
            <th>รหัสไปรษณีย์</th>
            <th>ภูมิภาค</th>
            <th>การกระทำ</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(supplier, index) in supplierList" :key="supplier.Id">
            <td>{{ supplier.Id }}</td>
            <td>{{ supplier.CompanyName }}</td>
            <td>{{ supplier.ContactName }}</td>
            <td>{{ supplier.ContactTitle }}</td>
            <td>{{ supplier.Address }}</td>
            <td>{{ supplier.City }}</td>
            <td>{{ supplier.Country }}</td>
            <td>{{ supplier.Phone }}</td>
            <td>{{ supplier.Fax }}</td>
            <td>{{ supplier.HomePage }}</td>
            <td>{{ supplier.PostalCode }}</td>
            <td>{{ supplier.Region }}</td>
            <td>
              <button class="btn-edit" @click="handleEditSupplier(supplier)">แก้ไข</button>
              <button class="btn-delete"
                @click="() => { if (supplier.Id !== undefined) handleDeleteSupplier(supplier.Id) }">ลบ</button>
            </td>
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
  font-size: 2.2rem;
  margin-bottom: 20px;
}

.supplier-form {
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
  .supplier-form {
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
