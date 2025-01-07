# ใช้ Node.js image ที่มีการติดตั้งอยู่แล้ว
FROM node:16

# ตั้งค่าพื้นที่ทำงานภายใน container
WORKDIR /app

# คัดลอกไฟล์ package.json และ package-lock.json เข้ามาใน container
COPY package*.json ./

# ติดตั้ง dependencies
RUN npm install

# คัดลอกโค้ดทั้งหมดเข้าไปใน container
COPY . .

# สร้างโปรเจกต์ Vue.js
RUN npm run build

# เปิด port ที่จะให้บริการ (สามารถเปลี่ยนเป็น port ที่คุณต้องการ)
EXPOSE 8080

# รัน server สำหรับโปรเจกต์ Vue.js ที่ถูก build แล้ว
CMD ["npm", "run", "serve", "--", "--host", "0.0.0.0"]
