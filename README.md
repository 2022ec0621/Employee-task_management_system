# Employee & Task Management System  
A full-stack web application built as part of the ProU Technology Full-Stack Development Track assessment.

This system allows:
- Managing Employees (Create, View, Update, Delete)
- Managing Tasks (Assign tasks, Filter, Search, CRUD)
- Authentication (Login, Register, Logout)
- Responsive and modern UI (React + Tailwind)
- PostgreSQL Database with UUID primary keys

---

## 🚀 Tech Stack

### **Frontend**
- React (Vite)
- React Router
- Context API (Authentication)
- Tailwind CSS (UI styling)

### **Backend**
- Node.js + Express.js
- PostgreSQL (with `pg` driver)
- UUID for primary keys
- JSON-based RESTful API

---


Employee-task-management-system/
│
backend/
│
├── app/
│   ├── db/
│   │   └── migration.sql
│   │
│   ├── middleware/
│   │   └── auth.js
│   │
│   ├── routes/
│   │   ├── auth.js
│   │   ├── employees.js
│   │   └── tasks.js
│
├── node_modules/
│
├── .env
├── app.http
├── db.js
├── index.js
├── package.json
└── package-lock.json
|
│
├── frontend/
│   ├── src/
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   ├── api.js
│   │   ├── index.css
│   │   ├── contexts/
│   │   │   └── AuthContext.jsx
│   │   ├── components/
│   │   │   ├── Layout/
│   │   │   │   └── Header.jsx
│   │   │   ├── Employees/
│   │   │   │   ├── EmployeeList.jsx
│   │   │   │   └── EmployeeForm.jsx
│   │   │   ├── Tasks/
│   │   │   │   ├── TaskList.jsx
│   │   │   │   └── TaskForm.jsx
│   │   ├── pages/
│   │   │   ├── Login.jsx
│   │   │   └── Register.jsx
│   ├── public/
│   ├── index.html
│   ├── tailwind.config.cjs
│   └── package.json
│   
│
└── README.md  (root)




# 🧪 API Documentation

Base URL (Production):
https://employee-task-management-system-backend.onrender.com


👤 Authentication

### **POST /api/auth/register**
Registers a new user.

### **POST /api/auth/login**
Returns JWT token.



## 👨‍💼 Employees API

### **GET /api/employees**
Get all employees.

### **GET /api/employees/:id**
Get employee by ID.

### **POST /api/employees**
Create employee.

### **PUT /api/employees/:id**
Update employee.

### **DELETE /api/employees/:id**
Delete employee.

---

## 📋 Tasks API

### **GET /api/tasks**
Get all tasks (supports filters + search).

### **GET /api/tasks/:id**
Get single task.

### **POST /api/tasks**
Create task.

### **PUT /api/tasks/:id**
Update a task.

### **DELETE /api/tasks/:id**
Delete task.

---

# 🧩 Environment Variables

### **Backend `.env`**
PORT=5000
DATABASE_URL=postgres://user:pass@host/dbname
JWT_SECRET=your_secret



### **Frontend `.env`**
VITE_API_URL=https://employee-task-management-system-backend.onrender.com



---

# 🖥 Local Setup

### **1️⃣ Clone**

git clone https://github.com/2022ec0621/Employee-task_management_system.git
🔧 Backend Setup


cd backend
npm install
npm start
Backend runs at:



http://localhost:5000
🎨 Frontend Setup

cd frontend
npm install
npm run dev
Frontend runs at:


http://localhost:5173
🖼 Screenshots
(Add your images here)

Example:
📌 Login Page
<img width="1363" height="657" alt="image" src="https://github.com/user-attachments/assets/0d069fd2-03c5-42a6-be85-e93aa56d5052" />

📌 Register Page
<img width="1359" height="653" alt="image" src="https://github.com/user-attachments/assets/41fb17d1-1b43-4410-812f-747046149b1b" />

📌 Employee List
<img width="1343" height="612" alt="image" src="https://github.com/user-attachments/assets/5b75f5bf-a9cb-45df-bd38-ccd58dd2690f" />

📌 Task List
<img width="1340" height="650" alt="image" src="https://github.com/user-attachments/assets/dd93b671-aeab-4f21-bf7f-62f50adf25b4" />

📌 Employee Form
<img width="1349" height="644" alt="image" src="https://github.com/user-attachments/assets/efa14d47-2b99-4cc8-90bf-42958d204fed" />


📌 Task Form
<img width="1334" height="643" alt="image" src="https://github.com/user-attachments/assets/774963bd-65ee-4346-8d84-0c12b4f74a1e" />



⭐ Bonus Features Implemented

✔ Full authentication (register + login + protected APIs)
✔ Fullstack integration
✔ PostgreSQL UUID primary keys
✔ Search and filtering
✔ Complete CRUD for tasks & employees
✔ Deployed backend & frontend
✔ Clean professional UI


📧 Submission / Contact
Email :

vasudharini.s@prou.com.au

pavithra.mannar@prou.com.au

🎉 Final Notes
This project was built as a full solution covering Frontend, Backend, and Fullstack tracks for the ProU Technology assessment.


