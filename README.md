# 🎬 StudioSpace — Client Application

<p align="center">
  A modern studio discovery and booking platform designed to connect people with creative spaces.
</p>

<p align="center">
  <a href="https://studioclient.vercel.app/">
    <img src="https://img.shields.io/badge/Live_Demo-Visit_StudioSpace-2563EB?style=for-the-badge&logo=vercel&logoColor=white" alt="Live Demo" />
  </a>
  <a href="https://github.com/prantodev1/studio_client">
    <img src="https://img.shields.io/badge/Source_Code-GitHub-181717?style=for-the-badge&logo=github&logoColor=white" alt="GitHub" />
  </a>
</p>

<p align="center">
  <img src="https://img.shields.io/badge/Next.js-16.4.3-000000?style=flat-square&logo=next.js&logoColor=white" />
  <img src="https://img.shields.io/badge/React-19.3-61DAFB?style=flat-square&logo=react&logoColor=black" />
  <img src="https://img.shields.io/badge/Tailwind_CSS-4-06B6D4?style=flat-square&logo=tailwindcss&logoColor=white" />
  <img src="https://img.shields.io/badge/Better_Auth-Authentication-000000?style=flat-square" />
  <img src="https://img.shields.io/badge/Vercel-Deployed-000000?style=flat-square&logo=vercel" />
</p>

---

## 📖 About The Project

**StudioSpace** is a modern studio discovery and booking platform built to simplify the process of finding, managing, and booking creative spaces.

The application provides a user-friendly interface for exploring studio listings and managing booking-related activities. It communicates with a dedicated Express.js backend to handle application data, authentication, and business operations.

Built with **Next.js, React, and Tailwind CSS**, StudioSpace focuses on a responsive user experience, maintainable architecture, and seamless frontend-backend integration.

## 🌐 Live Application

| Component | Details |
|:---|:---|
| Client Application | [studioclient.vercel.app](https://studioclient.vercel.app/) |
| Backend API | [studiospace-server-silk.vercel.app](https://studiospace-server-silk.vercel.app/) |
| Client Repository | [GitHub Repository](https://github.com/prantodev1/studio_client) |
| Server Repository | [Backend Repository](https://github.com/prantodev1/studioSpace_server) |
| Frontend Hosting | Vercel |
| Backend Hosting | Vercel |

## ✨ Key Features

- **Studio Discovery** — Explore available studio listings.
- **Studio Management** — Support studio listing management through backend APIs.
- **Booking Operations** — Interact with studio booking services.
- **User Authentication** — Authentication integration with Better Auth.
- **Role-Based Access** — Support role-aware application experiences.
- **Protected Resources** — Integrate with authenticated backend endpoints.
- **Responsive Interface** — Designed for different screen sizes.
- **Theme Support** — Theme management using Next Themes.
- **Interactive Notifications** — User feedback through React Toastify.
- **API Integration** — Communicate with the StudioSpace backend using HTTP requests.

## 🛠️ Technology Stack

### Frontend

| Technology | Purpose |
|:---|:---|
| Next.js 16 | React Framework |
| React 19 | UI Development |
| Tailwind CSS 4 | Styling |
| JavaScript | Application Logic |

### Authentication & Database Integration

| Technology | Purpose |
|:---|:---|
| Better Auth | Authentication |
| MongoDB | Database Integration |
| MongoDB Adapter | Better Auth Database Adapter |

### UI & Utilities

| Technology | Purpose |
|:---|:---|
| Next Themes | Theme Management |
| React Toastify | Notifications |
| ESLint | Code Quality |

### Development & Deployment

- Node.js
- npm
- Vercel
- Git & GitHub

## ⚙️ Installation & Setup

Follow these steps to run StudioSpace Client locally.

### 1. Clone the Repository

```bash
git clone https://github.com/prantodev1/studio_client.git
```

### 2. Navigate to the Project Directory

```bash
cd studio_client
```

### 3. Install Dependencies

```bash
npm install
```

### 4. Configure Environment Variables

Create a `.env.local` file in the project root.

```env
NEXT_PUBLIC_API_URL=http://localhost:5000
BETTER_AUTH_URL=http://localhost:3000
```

Replace the placeholder URLs with the appropriate development or production configuration.

Refer to `.env.example` for the project's required environment variables and naming conventions.

> **Security:** Never expose private API secrets, database credentials, or authentication secrets through public environment variables.

### 5. Run the Development Server

```bash
npm run dev
```

Open your browser:

```text
http://localhost:3000
```

### 6. Build for Production

```bash
npm run build
```

### 7. Start Production Server

```bash
npm start
```

## 🔗 Backend Integration

StudioSpace Client communicates with the Express.js backend through RESTful API endpoints.

**Production Backend:**

```text
https://studiospace-server-silk.vercel.app/
```

**Production Frontend:**

```text
https://studioclient.vercel.app/
```

### Application Architecture

```text
              USER
               |
               ▼
       STUDIO SPACE CLIENT
          Next.js + React
               |
               |
          HTTP / JSON
               |
               ▼
       STUDIO SPACE SERVER
          Node.js + Express
               |
          ┌────┴─────┐
          ▼          ▼
       MongoDB   Authentication
       Atlas       & RBAC
```

## 🔐 Authentication

StudioSpace integrates Better Auth for user authentication and communicates with the backend authentication infrastructure.

The authentication system supports:

- User authentication
- JWT-based authentication integration
- Protected API communication
- Role-aware access control
- Secure authentication configuration

## ☁️ Deployment

The StudioSpace Client application is deployed on **Vercel**.

```

### Deployment Configuration

1. Connect the GitHub repository to Vercel.
2. Configure the required environment variables.
3. Set the production build command.
4. Deploy the application.
5. Verify the frontend and backend communication.

**Production URL:**

https://studioclient.vercel.app/

## 🎯 Project Objective

The primary goal of StudioSpace is to create a convenient digital platform for discovering creative spaces and managing studio bookings.

By combining a modern frontend experience with a secure backend infrastructure, StudioSpace aims to deliver a reliable and accessible studio booking ecosystem.

## 👨‍💻 Developer

<p align="center">
  <strong>Pranto Paul</strong>
  <br />
  Computer Science & Engineering Student
  <br />
  Aspiring Full-Stack Software Engineer
</p>

<p align="center">
  <a href="https://github.com/prantodev1">
    <img src="https://img.shields.io/badge/GitHub-prantodev1-181717?style=for-the-badge&logo=github" alt="GitHub Profile" />
  </a>
</p>

---

<p align="center">
  <strong>StudioSpace</strong>
  <br />
  <i>Discover. Create. Book. Experience.</i>
  <br /><br />
  Built with ❤️ by <strong>Pranto Paul</strong>
</p>