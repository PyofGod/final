<script setup lang="ts">
import { ref, onMounted } from "vue";
import HttpService from "@/service/HttpService";

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

const idSupplier = ref<number | undefined>(undefined);
const supplierList = ref<Supplier[]>([]);
const companyName = ref<string>("");
const contactName = ref<string>("");
const contactTitle = ref<string>("");
const address = ref<string>("");
const city = ref<string>("");
const postalCode = ref<string>("");
const region = ref<string>("");
const country = ref<string>("");
const phone = ref<string>("");
const fax = ref<string>("");
const homePage = ref<string>("");

const BASE_PATH = import.meta.env.VITE_PORT;

const loadSuppliers = async () => {
  const res = await HttpService.getAxiosClient().get(`${BASE_PATH}/suppliers`);
  supplierList.value = res.data;
};

// ฟังก์ชันสำหรับแก้ไข Supplier
const handleEditSupplier = async (value: Supplier) => {
  idSupplier.value = value.Id;
  companyName.value = value.CompanyName || "";
  contactName.value = value.ContactName || "";
  contactTitle.value = value.ContactTitle || "";
  address.value = value.Address || "";
  city.value = value.City || "";
  postalCode.value = value.PostalCode || "";
  region.value = value.Region || "";
  country.value = value.Country || "";
  phone.value = value.Phone || "";
  fax.value = value.Fax || "";
  homePage.value = value.HomePage || "";
};

// ฟังก์ชันสำหรับบันทึกข้อมูล Supplier
const submit = async () => {
  const supplierData = {
    CompanyName: companyName.value,
    ContactName: contactName.value,
    ContactTitle: contactTitle.value,
    Address: address.value,
    City: city.value,
    PostalCode: postalCode.value,
    Region: region.value,
    Country: country.value,
    Phone: phone.value,
    Fax: fax.value,
    HomePage: homePage.value,
  };

  if (idSupplier.value !== undefined) {
    try {
      const response = await HttpService.getAxiosClient().patch(
        `${BASE_PATH}/suppliers/${idSupplier.value}`,
        supplierData
      );
      if (response.status === 200) {
        await loadSuppliers();
      }
    } catch (error) {
      console.error("ไม่สามารถอัปเดตข้อมูลได้", error);
    }
  } else {
    try {
      const res = await HttpService.getAxiosClient().post(
        `${BASE_PATH}/suppliers`,
        supplierData
      );
      if (res.status === 201) {
        await loadSuppliers();
        console.log("เพิ่มข้อมูล Supplier สำเร็จ");
      } else {
        console.log("ไม่สามารถเพิ่มข้อมูลได้");
      }
    } catch (error) {
      console.error("ไม่สามารถเพิ่มข้อมูลได้", error);
    }
  }
  reset();
};

// ฟังก์ชันสำหรับรีเซ็ตค่าฟอร์ม
const reset = () => {
  idSupplier.value = undefined;
  companyName.value = "";
  contactName.value = "";
  contactTitle.value = "";
  address.value = "";
  city.value = "";
  postalCode.value = "";
  region.value = "";
  country.value = "";
  phone.value = "";
  fax.value = "";
  homePage.value = "";
};

// ฟังก์ชันสำหรับลบข้อมูล Supplier
const handleDeleteSupplier = async (id: number) => {
  try {
    const res = await HttpService.getAxiosClient().delete(
      `${BASE_PATH}/suppliers/${id}`
    );
    if (res.status === 200) {
      await loadSuppliers();
      console.log("ลบข้อมูล Supplier สำเร็จ");
    } else {
      console.log("ไม่สามารถลบข้อมูลได้");
    }
  } catch (error) {
    console.error("ไม่สามารถลบข้อมูลได้", error);
  }
};

onMounted(async () => {
  await loadSuppliers();
});
</script>

<template>
  <div class="supplier-page">
    <h1>รายการ Supplier</h1>
    <form @submit.prevent="submit" class="supplier-form">
      <div class="form-group">
        <label for="companyName">ชื่อบริษัท</label>
        <input type="text" v-model="companyName" placeholder="กรอกชื่อบริษัท" />
      </div>
      <div class="form-group">
        <label for="contactName">ชื่อผู้ติดต่อ</label>
        <input
          type="text"
          v-model="contactName"
          placeholder="กรอกชื่อผู้ติดต่อ"
        />
      </div>
      <div class="form-group">
        <label for="contactTitle">ตำแหน่งผู้ติดต่อ</label>
        <input
          type="text"
          v-model="contactTitle"
          placeholder="กรอกตำแหน่งผู้ติดต่อ"
        />
      </div>
      <div class="form-group">
        <label for="address">ที่อยู่</label>
        <input type="text" v-model="address" placeholder="กรอกที่อยู่" />
      </div>
      <div class="form-group">
        <label for="city">เมือง</label>
        <input type="text" v-model="city" placeholder="กรอกเมือง" />
      </div>
      <div class="form-group">
        <label for="postalCode">รหัสไปรษณีย์</label>
        <input
          type="text"
          v-model="postalCode"
          placeholder="กรอกรหัสไปรษณีย์"
        />
      </div>
      <div class="form-group">
        <label for="region">ภูมิภาค</label>
        <input type="text" v-model="region" placeholder="กรอกภูมิภาค" />
      </div>
      <div class="form-group">
        <label for="country">ประเทศ</label>
        <input type="text" v-model="country" placeholder="กรอกประเทศ" />
      </div>
      <div class="form-group">
        <label for="phone">หมายเลขโทรศัพท์</label>
        <input type="text" v-model="phone" placeholder="กรอกหมายเลขโทรศัพท์" />
      </div>
      <div class="form-group">
        <label for="fax">หมายเลขแฟกซ์</label>
        <input type="text" v-model="fax" placeholder="กรอกหมายเลขแฟกซ์" />
      </div>
      <div class="form-group">
        <label for="homePage">เว็บไซต์</label>
        <input type="text" v-model="homePage" placeholder="กรอกเว็บไซต์" />
      </div>
      <button type="submit" class="btn-add">เพิ่ม/แก้ไข Supplier</button>
    </form>

    <div class="table-container">
      <table>
        <thead>
          <tr>
            <th>Id</th>
            <th>ชื่อบริษัท</th>
            <th>ชื่อผู้ติดต่อ</th>
            <th>ตำแหน่งผู้ติดต่อ</th>
            <th>ที่อยู่</th>
            <th>เมือง</th>
            <th>รหัสไปรษณีย์</th>
            <th>ภูมิภาค</th>
            <th>ประเทศ</th>
            <th>หมายเลขโทรศัพท์</th>
            <th>หมายเลขแฟกซ์</th>
            <th>เว็บไซต์</th>
            <th>การกระทำ</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(supplier, index) in supplierList" :key="index">
            <td>{{ supplier.Id }}</td>
            <td>{{ supplier.CompanyName }}</td>
            <td>{{ supplier.ContactName }}</td>
            <td>{{ supplier.ContactTitle }}</td>
            <td>{{ supplier.Address }}</td>
            <td>{{ supplier.City }}</td>
            <td>{{ supplier.PostalCode }}</td>
            <td>{{ supplier.Region }}</td>
            <td>{{ supplier.Country }}</td>
            <td>{{ supplier.Phone }}</td>
            <td>{{ supplier.Fax }}</td>
            <td>{{ supplier.HomePage }}</td>
            <td>
              <button class="btn-edit" @click="handleEditSupplier(supplier)">
                แก้ไข
              </button>
              <button
                class="btn-delete"
                @click="
                  () => {
                    if (supplier.Id !== undefined)
                      handleDeleteSupplier(supplier.Id);
                  }
                "
              >
                ลบ
              </button>
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
  font-family: "Roboto", sans-serif;
  color: #333;
  background-color: #f5f5f5;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
  border-radius: 8px;
}

.supplier-form {
  margin-bottom: 30px;
}

.supplier-form .form-group {
  margin-bottom: 15px;
}

.supplier-form label {
  display: block;
  font-weight: bold;
}

.supplier-form input {
  width: 100%;
  padding: 10px;
  font-size: 14px;
  border: 1px solid #ccc;
  border-radius: 4px;
  margin-top: 5px;
}

.supplier-form button {
  padding: 10px 15px;
  font-size: 16px;
  background-color: #4caf50;
  color: white;
  border: none;
  cursor: pointer;
  border-radius: 4px;
}

.supplier-form button:hover {
  background-color: #45a049;
}

.table-container {
  margin-top: 20px;
}

.table-container table {
  width: 100%;
  border-collapse: collapse;
  margin-top: 20px;
}

.table-container th,
.table-container td {
  padding: 12px;
  text-align: left;
  border: 1px solid #ddd;
}

.table-container th {
  background-color: #f1f1f1;
}

.table-container tr:nth-child(even) {
  background-color: #f9f9f9;
}

.table-container button {
  background-color: #007bff;
  color: white;
  border: none;
  padding: 5px 10px;
  font-size: 14px;
  cursor: pointer;
  border-radius: 4px;
}

.table-container button:hover {
  background-color: #0056b3;
}

.btn-delete {
  background-color: #dc3545;
}

.btn-delete:hover {
  background-color: #c82333;
}
</style>
