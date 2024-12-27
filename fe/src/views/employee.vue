<script setup lang="ts">
import { ref, onMounted } from "vue";
import HttpService from "@/service/HttpService";

interface Employee {
  Id?: number;
  FirstName: string;
  LastName: string;
  Title: string;
  TitleOfCourtesy: string;
  BirthDate: string;
  HireDate: string;
  Address: string;
  City: string;
  Region: string;
  PostalCode: string;
  Country: string;
  HomePhone: string;
  Extension: string;
  Photo: string;
  Notes: string;
  ReportsTo: number;
  PhotoPath: string;
}

const idEmployee = ref<number | undefined>(undefined);
const employeeList = ref<Employee[]>([]);

const firstName = ref<string>("");
const lastName = ref<string>("");
const title = ref<string>("");
const titleOfCourtesy = ref<string>("");
const birthDate = ref<string>("");
const hireDate = ref<string>("");
const address = ref<string>("");
const city = ref<string>("");
const region = ref<string>("");
const postalCode = ref<string>("");
const country = ref<string>("");
const homePhone = ref<string>("");
const extension = ref<string>("");
const photo = ref<string>("");
const notes = ref<string>("");
const reportsTo = ref<number>(0);
const photoPath = ref<string>("");

const BASE_PATH = "http://192.168.1.140:4000";

const loadEmployee = async () => {
  const res = await HttpService.getAxiosClient().get(`${BASE_PATH}/employees`);
  employeeList.value = res.data;
};

const handleEditEmployee = async (value: Employee) => {
  idEmployee.value = value.Id;
  firstName.value = value.FirstName;
  lastName.value = value.LastName;
  title.value = value.Title;
  titleOfCourtesy.value = value.TitleOfCourtesy;
  birthDate.value = value.BirthDate;
  hireDate.value = value.HireDate;
  address.value = value.Address;
  city.value = value.City;
  region.value = value.Region;
  postalCode.value = value.PostalCode;
  country.value = value.Country;
  homePhone.value = value.HomePhone;
  extension.value = value.Extension;
  photo.value = value.Photo;
  notes.value = value.Notes;
  reportsTo.value = value.ReportsTo;
  photoPath.value = value.PhotoPath;
};

const subMit = async () => {
  if (idEmployee.value !== undefined) {
    try {
      const response = await HttpService.getAxiosClient().patch(
        `${BASE_PATH}/employees/${idEmployee.value}`,
        {
          FirstName: firstName.value,
          LastName: lastName.value,
          Title: title.value,
          TitleOfCourtesy: titleOfCourtesy.value,
          BirthDate: birthDate.value,
          HireDate: hireDate.value,
          Address: address.value,
          City: city.value,
          Region: region.value,
          PostalCode: postalCode.value,
          Country: country.value,
          HomePhone: homePhone.value,
          Extension: extension.value,
          Photo: photo.value,
          Notes: notes.value,
          ReportsTo: reportsTo.value,
          PhotoPath: photoPath.value,
        }
      );
      if (response.status === 200) {
        await loadEmployee();
      }
    } catch (error) {
      console.log("Failed to update employee", error);
    }
  } else {
    try {
      const res = await HttpService.getAxiosClient().post(
        `${BASE_PATH}/employees`,
        {
          FirstName: firstName.value,
          LastName: lastName.value,
          Title: title.value,
          TitleOfCourtesy: titleOfCourtesy.value,
          BirthDate: birthDate.value,
          HireDate: hireDate.value,
          Address: address.value,
          City: city.value,
          Region: region.value,
          PostalCode: postalCode.value,
          Country: country.value,
          HomePhone: homePhone.value,
          Extension: extension.value,
          Photo: photo.value,
          Notes: notes.value,
          ReportsTo: reportsTo.value,
          PhotoPath: photoPath.value,
        }
      );
      if (res.status === 201) {
        await loadEmployee();
        console.log("Employee added successfully");
      } else {
        console.log("Failed to add employee");
      }
    } catch (error) {
      console.log("Failed to add employee", error);
    }
  }
  reset();
};

const reset = async () => {
  idEmployee.value = undefined;
  firstName.value = "";
  lastName.value = "";
  title.value = "";
  titleOfCourtesy.value = "";
  birthDate.value = "";
  hireDate.value = "";
  address.value = "";
  city.value = "";
  region.value = "";
  postalCode.value = "";
  country.value = "";
  homePhone.value = "";
  extension.value = "";
  photo.value = "";
  notes.value = "";
  reportsTo.value = 0;
  photoPath.value = "";
};

const handleDeleteEmployee = async (index: number) => {
  try {
    const res = await HttpService.getAxiosClient().delete(
      `${BASE_PATH}/employees/${index}`
    );
    if (res.status === 200) {
      await loadEmployee();
      console.log("Employee removed successfully");
    } else {
      console.log("Failed to remove employee");
    }
  } catch (error) {
    console.log("Failed to remove employee", error);
  }
};

onMounted(async () => {
  await loadEmployee();
});
</script>

<template>
  <div class="employee-page">
    <h1>รายชื่อพนักงาน</h1>
    <form @submit.prevent="subMit" class="employee-form">
      <div class="form-group">
        <label for="firstName">ชื่อ</label>
        <input type="text" v-model="firstName" placeholder="กรอกชื่อ" required />
      </div>
      <div class="form-group">
        <label for="lastName">นามสกุล</label>
        <input type="text" v-model="lastName" placeholder="กรอกนามสกุล" required />
      </div>
      <div class="form-group">
        <label for="title">ตำแหน่ง</label>
        <input type="text" v-model="title" placeholder="กรอกตำแหน่ง" required />
      </div>
      <div class="form-group">
        <label for="titleOfCourtesy">ตำแหน่งเกียรติยศ</label>
        <input type="text" v-model="titleOfCourtesy" placeholder="กรอกตำแหน่งเกียรติยศ" required />
      </div>
      <div class="form-group">
        <label for="birthDate">วันเกิด</label>
        <input type="date" v-model="birthDate" required />
      </div>
      <div class="form-group">
        <label for="hireDate">วันเข้าทำงาน</label>
        <input type="date" v-model="hireDate" required />
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
        <label for="homePhone">เบอร์โทรศัพท์</label>
        <input type="text" v-model="homePhone" placeholder="กรอกเบอร์โทรศัพท์" required />
      </div>
      <div class="form-group">
        <label for="extension">ต่อ</label>
        <input type="text" v-model="extension" placeholder="กรอกหมายเลขต่อ" required />
      </div>
      <div class="form-group">
        <label for="photo">รูปภาพ</label>
        <input type="text" v-model="photo" placeholder="กรอก URL รูปภาพ" required />
      </div>
      <div class="form-group">
        <label for="notes">หมายเหตุ</label>
        <textarea v-model="notes" placeholder="กรอกหมายเหตุ" required></textarea>
      </div>
      <div class="form-group">
        <label for="reportsTo">รายงานถึง</label>
        <input type="number" v-model="reportsTo" placeholder="กรอกหมายเลขผู้รายงานถึง" required />
      </div>
      <div class="form-group">
        <label for="photoPath">เส้นทางรูปภาพ</label>
        <input type="text" v-model="photoPath" placeholder="กรอกเส้นทางรูปภาพ" required />
      </div>
      <button type="submit" class="btn-add">เพิ่ม / แก้ไข พนักงาน</button>
    </form>
    <div class="table-container">
      <table>
        <thead>
          <tr>
            <th>รหัส</th>
            <th>ชื่อ</th>
            <th>นามสกุล</th>
            <th>ตำแหน่ง</th>
            <th>ตำแหน่งเกียรติยศ</th>
            <th>วันเกิด</th>
            <th>วันเข้าทำงาน</th>
            <th>เมือง</th>
            <th>ประเทศ</th>
            <th>การกระทำ</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(employee, index) in employeeList" :key="index">
            <td>{{ employee.Id }}</td>
            <td>{{ employee.FirstName }}</td>
            <td>{{ employee.LastName }}</td>
            <td>{{ employee.Title }}</td>
            <td>{{ employee.TitleOfCourtesy }}</td>
            <td>{{ employee.BirthDate }}</td>
            <td>{{ employee.HireDate }}</td>
            <td>{{ employee.City }}</td>
            <td>{{ employee.Country }}</td>
            <td>
              <button class="btn-edit" @click="handleEditEmployee(employee)">
                แก้ไข
              </button>
              <button class="btn-delete" @click="() => {
                if (employee.Id !== undefined)
                  handleDeleteEmployee(employee.Id);
              }
                ">
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
.employee-page {
  max-width: 1200px;
  margin: 40px auto;
  padding: 30px;
  background-color: #ffffff;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  border-radius: 8px;
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  color: #333;
}

h1 {
  text-align: center;
  color: #008CBA;
  /* ใช้สีฟ้าเหมือนหน้า Customer */
  font-size: 2rem;
  margin-bottom: 30px;
}

.employee-form {
  display: flex;
  flex-wrap: wrap;
  gap: 20px;
  margin-bottom: 30px;
}

.form-group {
  flex: 1 1 calc(50% - 20px);
  display: flex;
  flex-direction: column;
}

label {
  font-weight: 600;
  margin-bottom: 8px;
  color: #333;
}

input,
textarea {
  padding: 12px;
  border: 1px solid #ddd;
  border-radius: 6px;
  font-size: 14px;
  color: #333;
  box-sizing: border-box;
}

input[type="date"] {
  padding-left: 8px;
}

textarea {
  resize: none;
  height: 100px;
}

textarea:focus,
input:focus {
  border-color: #008CBA;
  /* ใช้สีฟ้าเหมือนหน้า Customer */
  outline: none;
}

.btn-add {
  background-color: #4CAF50;
  /* สีเขียว */
  color: white;
  padding: 12px 24px;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  transition: background-color 0.3s;
  font-size: 16px;
  align-self: center;
  margin-top: 10px;
}

.btn-add:hover {
  background-color: #45a049;
}

.table-container {
  overflow-x: auto;
  margin-top: 40px;
}

table {
  width: 100%;
  border-collapse: collapse;
}

th,
td {
  padding: 14px;
  text-align: left;
  font-size: 14px;
  border-bottom: 1px solid #ddd;
}

th {
  background-color: #f3f3f3;
  font-weight: bold;
  color: #333;
}

tr:hover {
  background-color: #f9f9f9;
}

.btn-delete,
.btn-edit {
  padding: 8px 16px;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-size: 14px;
  transition: background-color 0.3s;
}

.btn-delete {
  background-color: #f44336;
  /* สีแดง */
  color: white;
}

.btn-delete:hover {
  background-color: #e41e20;
}

.btn-edit {
  background-color: #008CBA;
  /* สีฟ้าเหมือนหน้า Customer */
  color: white;
}

.btn-edit:hover {
  background-color: #007bb5;
}

button {
  margin-right: 10px;
}

.table-container th,
.table-container td {
  text-align: left;
  padding: 12px 10px;
}

.table-container th,
.table-container td {
  border-bottom: 1px solid #ddd;
}

tr:hover {
  background-color: #f1f1f1;
}

@media (max-width: 768px) {
  .employee-form {
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
