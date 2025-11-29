# Quick Cart
### The Ultimate E-Commerce Experience

![Next.js](https://img.shields.io/badge/Next.js-16.0.3-black?style=for-the-badge&logo=next.js&logoColor=white)
![Spring Boot](https://img.shields.io/badge/Spring_Boot-3.x-6db33f?style=for-the-badge&logo=springboot&logoColor=white)
![MySQL](https://img.shields.io/badge/MySQL-Database-4479a1?style=for-the-badge&logo=mysql&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-5.x-3178c6?style=for-the-badge&logo=typescript&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white)
![JWT](https://img.shields.io/badge/JWT-Auth-000000?style=for-the-badge&logo=jsonwebtokens&logoColor=white)

**Quick Cart** is a robust and scalable e-commerce web application designed to provide a seamless online shopping experience. Built with the power of **Next.js 16** for the frontend and a secure **Spring Boot** backend, it ensures speed, reliability, and ease of use.

---

## ✨ Features

* **🛍️ Smart Shopping:** Browse through "Featured" and "Popular" products with an intuitive UI.
* **🔍 Detailed Insights:** View comprehensive product details, images, and specifications.
* **🛒 Dynamic Cart:** Add items to your cart, update quantities, and manage your shopping list effortlessly.
* **🔐 Secure Auth:** JWT-based user registration and login system for personalized and secure experiences.
* **📦 Order Tracking:** View your past orders and track current statuses.
* **👤 User Profile:** Manage your account details and preferences.

---

## 🛠️ Tech Stack

| Component | Technology |
| :--- | :--- |
| **Frontend** | Next.js v16.0.3 (App Router), TypeScript, Tailwind CSS |
| **Backend** | Java Spring Boot (REST API) |
| **Database** | MySQL |
| **Authentication** | JWT (JSON Web Tokens) |
| **State Management** | React Context API |

---

## 🚀 Getting Started

Follow these instructions to set up the frontend locally.

### Prerequisites
* Node.js (Latest LTS version recommended)
* A running Spring Boot backend
* MySQL Database configured

### Installation

1.  **Clone the repository:**
    ```bash
    git clone [https://github.com/your-username/quick-cart-frontend.git](https://github.com/your-username/quick-cart-frontend.git)
    cd quick-cart-frontend
    ```

2.  **Install dependencies:**
    ```bash
    npm install
    ```

3.  **Configure Environment:**
    Create a `.env.local` file in the root directory and add your backend API URL:
    ```env
    NEXT_PUBLIC_API_URL=http://localhost:8080/api
    ```

4.  **Run the Development Server:**
    ```bash
    npm run dev
    ```

5.  Open [http://localhost:3000](http://localhost:3000) in your browser to see the application.

---

## 📂 Project Structure

```bash
quick-cart-frontend/
├── app/
│   ├── account/       # User profile management
│   ├── cart/          # Shopping cart page
│   ├── login/         # Authentication pages
│   ├── orders/        # Order history
│   ├── product/[id]/  # Dynamic product details
│   ├── shop/          # Main shop listing
│   └── page.tsx       # Home page (Landing)
├── components/        # Reusable UI components (Navbar, Footer, Hero)
├── context/           # AuthContext & Global State
└── public/            # Static assets and icons

````


Made by M. Nithushi Shavindi (Full Stack Developer)
