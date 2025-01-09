<script setup lang="ts">
import { ref, onMounted } from "vue";
import { useRoute, useRouter } from "vue-router"; // สำหรับดึง query parameter
import HttpService from "@/service/HttpService";
import Product from "./product.vue";

const router = useRouter();

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

const route = useRoute();
const productId = ref<string | null>(route.query.productId as string | null);
const productDetails = ref<Product | null>(null);

const customerList = ref<Customer[]>([]);
const customerForm = ref<Customer>({
  Address: '',
  City: '',
  CompanyName: '',
  ContactName: '',
  ContactTitle: '',
  Country: '',
  Fax: '',
  Phone: '',
  PostalCode: '',
  Region: '',
});

const BASE_PATH = import.meta.env.VITE_PORT;

const loadProductDetails = async () => {
  if (productId.value) {
    try {
      const res = await HttpService.getAxiosClient().get(
        `${BASE_PATH}/products/${productId.value}`
      );
      productDetails.value = res.data;
    } catch (error) {
      console.error("Failed to load product details", error);
    }
  }
};

const loadCustomer = async () => {
  const res = await HttpService.getAxiosClient().get(`${BASE_PATH}/customers`);
  customerList.value = res.data;
};

const submitOrder = async () => {
  // ตรวจสอบข้อมูลลูกค้า
  if (!customerForm.value.Address || !customerForm.value.City || !customerForm.value.PostalCode) {
    alert("กรุณากรอกข้อมูลลูกค้าให้ครบถ้วน");
    return;
  }

  try {
    const orderPayload = {
      ShippedDate: new Date().toISOString(),  // ตัวอย่าง: วันที่จัดส่งเป็นวันที่ปัจจุบัน
      ShipRegion: customerForm.value.Region,
      ShipPostalCode: customerForm.value.PostalCode,
      ShipName: customerForm.value.CompanyName,
      ShipCountry: customerForm.value.Country,
      ShipCity: customerForm.value.City,
      ShipAddress: customerForm.value.Address,
      OrderDate: new Date().toISOString(),
      Freight: productDetails.value?.Freight,
      CustomerId: "",
      ProductId: productId.value
    };

    const customerPayload = {
      CompanyName: customerForm.value.CompanyName,
      ContactName: customerForm.value.ContactName,
      ContactTitle: customerForm.value.ContactTitle,
      Address: customerForm.value.Address,
      City: customerForm.value.City,
      PostalCode: customerForm.value.PostalCode,
      Region: customerForm.value.Region,
      Country: customerForm.value.Country,
      Phone: customerForm.value.Phone,
      Fax: customerForm.value.Fax || null,
    };

    // ส่งข้อมูลลูกค้าไปยัง API
    const customerRes = await HttpService.getAxiosClient().post(`${BASE_PATH}/customers`, customerPayload);

    if (customerRes.status === 201) {
      orderPayload.CustomerId = customerRes.data.Id;  // เพิ่ม customerId

      // ส่งคำสั่งซื้อ
      const orderRes = await HttpService.getAxiosClient().post(`${BASE_PATH}/orders`, orderPayload);
      if (orderRes.status === 201) {
        alert("สั่งซื้อสำเร็จ");

        router.push({ name: 'order', query: { orderId: orderRes.data.Id } });

        // รีเซ็ตฟอร์มหลังจากสั่งซื้อสำเร็จ
        Object.keys(customerForm.value).forEach(key => {
          customerForm.value[key as keyof Customer] = ''; // รีเซ็ตฟอร์ม
        });
      }
    }
  } catch (error) {
    console.error("Failed to submit order", error);
  }
};

onMounted(() => {
  loadProductDetails();
  loadCustomer();
});
</script>

<template>
  <div v-if="productDetails" class="product-details">
    <h2>ข้อมูลสินค้า</h2>
    <p><strong>ชื่อสินค้า:</strong> {{ productDetails.ProductName }}</p>
    <p><strong>ราคา:</strong> {{ productDetails.UnitPrice }} บาท</p>
  </div>

  <div class="shipping-form">
    <h2>ข้อมูลลูกค้า</h2>
    <form @submit.prevent="submitOrder">
      <div class="form-group">
        <label for="CompanyName">ชื่อบริษัท</label>
        <input type="text" id="CompanyName" v-model="customerForm.CompanyName" placeholder="กรอกชื่อบริษัท" required>
      </div>
      <div class="form-group">
        <label for="ContactName">ชื่อผู้ติดต่อ</label>
        <input type="text" id="ContactName" v-model="customerForm.ContactName" placeholder="กรอกชื่อผู้ติดต่อ" required>
      </div>
      <div class="form-group">
        <label for="ContactTitle">ตำแหน่ง</label>
        <input type="text" id="ContactTitle" v-model="customerForm.ContactTitle" placeholder="กรอกตำแหน่ง" required>
      </div>
      <div class="form-group">
        <label for="Address">ที่อยู่</label>
        <input type="text" id="Address" v-model="customerForm.Address" placeholder="กรอกที่อยู่" required>
      </div>
      <div class="form-group">
        <label for="City">เมือง</label>
        <input type="text" id="City" v-model="customerForm.City" placeholder="กรอกเมือง" required>
      </div>
      <div class="form-group">
        <label for="PostalCode">รหัสไปรษณีย์</label>
        <input type="text" id="PostalCode" v-model="customerForm.PostalCode" placeholder="กรอกรหัสไปรษณีย์" required>
      </div>
      <div class="form-group">
        <label for="Region">ภาค</label>
        <input type="text" id="Region" v-model="customerForm.Region" placeholder="กรอกภาค" required>
      </div>
      <div class="form-group">
        <label for="Country">ประเทศ</label>
        <input type="text" id="Country" v-model="customerForm.Country" placeholder="กรอกประเทศ" required>
      </div>
      <div class="form-group">
        <label for="Phone">โทรศัพท์</label>
        <input type="text" id="Phone" v-model="customerForm.Phone" placeholder="กรอกเบอร์โทรศัพท์" required>
      </div>
      <div class="form-group">
        <label for="Fax">แฟกซ์</label>
        <input type="text" id="Fax" v-model="customerForm.Fax" placeholder="กรอกแฟกซ์ (ถ้ามี)">
      </div>
      <button type="submit" class="btn-add">ยืนยันการสั่งซื้อ</button>
    </form>
  </div>
</template>

<style scoped>
.product-details {
  margin-bottom: 20px;
  padding: 20px;
  background-color: #fff;
  border: 1px solid #ddd;
  border-radius: 8px;
}

.product-details h2 {
  margin-bottom: 10px;
  font-size: 1.5rem;
  color: #4CAF50;
}

.product-details p {
  margin: 5px 0;
  font-size: 1rem;
  color: #333;
}

.shipping-form {
  margin-top: 30px;
  padding: 20px;
  background-color: #f9f9f9;
  border: 1px solid #ddd;
  border-radius: 8px;
}

.shipping-form h2 {
  margin-bottom: 10px;
  font-size: 1.5rem;
  color: #4CAF50;
}

textarea,
input {
  width: 100%;
  padding: 12px;
  border: 1px solid #ddd;
  border-radius: 8px;
  font-size: 1rem;
  color: #333;
}

textarea:focus,
input:focus {
  border-color: #4CAF50;
  outline: none;
}

.form-group {
  margin-bottom: 15px;
}
</style>
