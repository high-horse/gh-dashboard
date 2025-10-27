# 🧭 GitHub Dashboard

A simple **GitHub Dashboard** built with **React** (frontend) and **Django** (backend), featuring authentication and integration with the **GitHub API**.  
This project is created for **learning purposes** — to explore how to connect a modern frontend with a Django REST backend and interact with real-world APIs.

---

## 🚀 Features

- 🔐 **User Authentication** (Login & Logout)  
- 🧑‍💻 **GitHub API Integration** — fetch repositories, commits, and user data  
- ⚙️ **React + Django REST Framework** architecture  
- 📊 Simple, responsive dashboard UI  
- 🧠 Educational project setup for beginners learning full-stack development

---

## 🏗️ Tech Stack

**Frontend:**
- React (Vite or CRA)
- Axios (for API calls)
- React Router

**Backend:**
- Django
- Django REST Framework
- django-cors-headers

**External API:**
- GitHub REST API

---

## 📦 Installation & Setup

### 1️⃣ Clone the Repository
```bash
git clone https://github.com/high-horse/gh-dashboard.git
cd gh-dashboard
```

### 2️⃣ Backend Setup (Django)
```bash
cd backend
python -m venv venv
source venv/bin/activate  # On Windows use venv\Scripts\activate
pip install -r requirements.txt
python manage.py migrate
python manage.py runserver
# or you can just run makefile scripts 
```

