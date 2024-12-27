<script setup lang="ts">
import { ref, onMounted } from 'vue';
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
  try {
    const res = await HttpService.getAxiosClient().get(`${BASE_PATH}/employees`);
    employeeList.value = res.data;
  } catch (error) {
    console.error("Failed to load employees:", error);
  }
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
      console.log('Failed to update employee', error);
    }
  } else {
    try {
      const res = await HttpService.getAxiosClient().post(`${BASE_PATH}/employees`, {
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
      });
      if (res.status === 201) {
        await loadEmployee();
        console.log('Employee added successfully');
      } else {
        console.log('Failed to add employee');
      }
    } catch (error) {
      console.log('Failed to add employee', error);
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
    const res = await HttpService.getAxiosClient().delete(`${BASE_PATH}/employees/${index}`);
    if (res.status === 200) {
      await loadEmployee();
      console.log('Employee removed successfully');
    } else {
      console.log('Failed to remove employee');
    }
  } catch (error) {
    console.log('Failed to remove employee', error);
  }
};

onMounted(async () => {
  await loadEmployee();
});
</script>

<template>
  <div class="employee-page">
    <h1>Employee List</h1>
    <form @submit.prevent="subMit" class="employee-form">
      <div class="form-group">
        <label for="firstName">First Name</label>
        <input type="text" v-model="firstName" placeholder="Enter First Name" required />
      </div>
      <div class="form-group">
        <label for="lastName">Last Name</label>
        <input type="text" v-model="lastName" placeholder="Enter Last Name" required />
      </div>
      <div class="form-group">
        <label for="title">Title</label>
        <input type="text" v-model="title" placeholder="Enter Title" required />
      </div>
      <div class="form-group">
        <label for="titleOfCourtesy">Title Of Courtesy</label>
        <input type="text" v-model="titleOfCourtesy" placeholder="Enter Courtesy Title" required />
      </div>
      <div class="form-group">
        <label for="birthDate">Birth Date</label>
        <input type="date" v-model="birthDate" required />
      </div>
      <div class="form-group">
        <label for="hireDate">Hire Date</label>
        <input type="date" v-model="hireDate" required />
      </div>
      <div class="form-group">
        <label for="address">Address</label>
        <input type="text" v-model="address" placeholder="Enter Address" required />
      </div>
      <div class="form-group">
        <label for="city">City</label>
        <input type="text" v-model="city" placeholder="Enter City" required />
      </div>
      <div class="form-group">
        <label for="region">Region</label>
        <input type="text" v-model="region" placeholder="Enter Region" required />
      </div>
      <div class="form-group">
        <label for="postalCode">Postal Code</label>
        <input type="text" v-model="postalCode" placeholder="Enter Postal Code" required />
      </div>
      <div class="form-group">
        <label for="country">Country</label>
        <input type="text" v-model="country" placeholder="Enter Country" required />
      </div>
      <div class="form-group">
        <label for="homePhone">Home Phone</label>
        <input type="text" v-model="homePhone" placeholder="Enter Home Phone
        " required />
      </div>
      <div class="form-group">
        <label for="extension">Extension</label>
        <input type="text" v-model="extension" placeholder="Enter Extension" required />
      </div>
      <div class="form-group">
        <label for="photo">Photo</label>
        <input type="text" v-model="photo" placeholder="Enter Photo URL" required />
      </div>
      <div class="form-group">
        <label for="notes">Notes</label>
        <textarea v-model="notes" placeholder="Enter Notes" required></textarea>
      </div>
      <div class="form-group">
        <label for="reportsTo">Reports To</label>
        <input type="number" v-model="reportsTo" placeholder="Enter Reports To ID" required />
      </div>
      <div class="form-group">
        <label for="photoPath">Photo Path</label>
        <input type="text" v-model="photoPath" placeholder="Enter Photo Path" required />
      </div>
      <button type="submit" class="btn-add">Add / Update Employee</button>
    </form>

    <div class="table-container">
      <table>
        <thead>
          <tr>
            <th>Id</th>
            <th>First Name</th>
            <th>Last Name</th>
            <th>Title</th>
            <th>Courtesy</th>
            <th>Birth Date</th>
            <th>Hire Date</th>
            <th>City</th>
            <th>Country</th>
            <th>Actions</th>
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
              <button class="btn-edit" @click="handleEditEmployee(employee)">Edit</button>
              <button class="btn-delete"
                @click="() => { if (employee.Id !== undefined) handleDeleteEmployee(employee.Id) }">Delete</button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<style scoped>
.employee-page {
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

.employee-form {
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

input,
textarea {
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
  margin-bottom: 10px;
  background-color: blue;
  color: white;
  padding: 5px 17px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.3s;
}

textarea {
  resize: none;
  height: 80px;
}
</style>
