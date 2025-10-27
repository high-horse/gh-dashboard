# 🧭 GitHub Dashboard

A simple **GitHub Dashboard** built with **React** (frontend) and **Django** (backend), featuring authentication and integration with the **GitHub API**.  
This project is created for **learning purposes** — to explore React Js with MUI + Python Django framework.

---

## 🚀 Features

- 🔐 **User Authentication** (Login & Logout)  
- 🧑‍💻 **GitHub API Integration** — fetch repositories, commits, and user data  
- ⚙️ **React + Django REST Framework** architecture  
- 📊 Simple, responsive dashboard UI  
- 🧠 Educational project

---

## 🏗️ Tech Stack

**Frontend:**
- React (Vite)
- Axios (for API calls)
- React Router
- React MUI Components

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

