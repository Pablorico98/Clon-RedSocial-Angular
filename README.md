# 📱 Clon de Red Social Full Stack

![Angular](https://img.shields.io/badge/Angular-19+-DD0031?style=flat-square&logo=angular&logoColor=white)
![NestJS](https://img.shields.io/badge/NestJS-Backend-E0234E?style=flat-square&logo=nestjs&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=flat-square&logo=typescript&logoColor=white)
![MongoDB](https://img.shields.io/badge/MongoDB-Atlas-47A248?style=flat-square&logo=mongodb&logoColor=white)
![Cloudinary](https://img.shields.io/badge/Cloudinary-Media-3448C5?style=flat-square&logo=cloudinary&logoColor=white)
![PWA](https://img.shields.io/badge/PWA-Ready-5A0FC8?style=flat-square&logo=pwa&logoColor=white)

Aplicación web Full Stack desarrollada como proyecto integrador bajo una arquitectura **Monorepo**, con **Angular** en el frontend y **NestJS** en el backend.

Integra autenticación con control de acceso basado en roles (RBAC), feed de publicaciones con carga de imágenes en la nube, comentarios en tiempo y forma, perfiles de usuario, métricas administrativas y soporte para Progressive Web App (PWA).

🔗 **Demo en producción:** [Ver aplicación desplegada](https://pablo-rico-tp-2-2026-c1-16o1.vercel.app/)  
📁 **Repositorio:** [github.com/Pablorico98/Clon-RedSocial-Angular](https://github.com/Pablorico98/Clon-RedSocial-Angular)

---

## 🚀 Características principales

### 🔐 Autenticación y autorización
- Registro e inicio de sesión de usuarios.
- Manejo de sesiones mediante tokens **JWT** y estrategia **Passport**.
- Encriptación de contraseñas con **Bcrypt**.
- Control de acceso basado en roles: `Usuario` y `Administrador`.
- Protección de rutas con **Guards** tanto en Angular como en NestJS.
- **HTTP Interceptor** para adjuntar automáticamente el token a las solicitudes.

### 📝 Publicaciones
- Creación, edición y eliminación de publicaciones (CRUD completo).
- Feed interactivo.
- Carga y procesamiento de imágenes en la nube mediante **Cloudinary**.

### 💬 Comentarios
- Sistema de comentarios vinculado a cada publicación gestionado mediante la API REST.

### 👤 Usuarios y perfiles
- Gestión de cuenta y actualización de perfil.
- Subida y personalización de avatar.

### 📊 Dashboard administrativo
- Acceso restringido exclusivamente a administradores.
- Visualización de estadísticas globales y métricas del sistema.
- Módulo de administración y gestión de usuarios.

### 📱 Progressive Web App (PWA)
- Soporte para instalación y funcionamiento offline básico vía **Service Workers** y **Web Manifest**.

---

## 🛠️ Stack tecnológico

| Capa | Tecnologías |
| :--- | :--- |
| **Frontend** | Angular 19+, TypeScript, HTML5, CSS3, PWA (Guards, Interceptors, Pipes y Directivas personalizadas) |
| **Backend** | Node.js, NestJS, API REST, Passport, JWT, Bcrypt, DTOs con `class-validator` |
| **Base de datos** | MongoDB Atlas (Mongoose) |
| **Servicios e Infraestructura** | Cloudinary (imágenes), Vercel (despliegue frontend/backend) |

---

## 🧩 Arquitectura del proyecto

El repositorio está organizado como un **Monorepo** con separación clara entre cliente y servidor:

```text
Clon-RedSocial-Angular/
├── client/                     # Aplicación Frontend (Angular)
│   └── src/
│       └── app/
│           ├── components/     # Componentes visuales y reutilizables
│           ├── pages/          # Vistas principales
│           ├── guards/         # Protección de rutas en cliente
│           ├── interceptors/   # Interceptores HTTP (JWT)
│           └── services/       # Comunicación con la API REST
│
└── server/                     # Aplicación Backend (NestJS)
    └── src/
        ├── auth/               # Autenticación, JWT, estrategias y guards
        ├── usuarios/           # Entidad y lógica de usuarios
        ├── publicaciones/      # Gestión de posts y multimedia
        ├── comentarios/        # Lógica de comentarios
        └── estadisticas/       # Métricas para el dashboard administrativo
```
### 📂 Principales módulos de la API

| Módulo | Responsabilidad |
| :--- | :--- |
| **Auth** | Registro, login, emisión/validación de JWT y roles. |
| **Usuarios** | Consulta, modificación de perfiles y administración. |
| **Publicaciones** | CRUD de posts y enlace con Cloudinary. |
| **Comentarios** | Creación y moderación de comentarios. |
| **Estadísticas** | Métricas agregadas para el panel de administración. |

---

## ⚙️ Instalación y ejecución local

### Prerrequisitos
- Node.js (versión 18 o superior recomendada)
- npm o yarn
- Cuenta en MongoDB Atlas y Cloudinary

### 1. Clonar el repositorio
```bash
git clone [https://github.com/Pablorico98/Clon-RedSocial-Angular.git](https://github.com/Pablorico98/Clon-RedSocial-Angular.git)
cd Clon-RedSocial-Angular

```

### 2. Configuración y ejecución del Backend
```bash
cd server
npm install
```

Crea un archivo `.env` en la raíz de `server/` con las siguientes variables:
```env
PORT=3000
MONGODB_URI=tu_cadena_de_conexion_mongodb
JWT_SECRET=tu_clave_secreta_jwt
CLOUDINARY_CLOUD_NAME=tu_cloud_name
CLOUDINARY_API_KEY=tu_api_key
CLOUDINARY_API_SECRET=tu_api_secret
```

Inicia el servidor en modo desarrollo (por defecto en `http://localhost:3000`):
```bash
npm run start:dev
```

### 3. Configuración y ejecución del Frontend
En una nueva terminal:
```bash
cd client
npm install
npm start
```
La aplicación quedará accesible en `http://localhost:4200/`.

---

## 🎯 Objetivo del proyecto

Este proyecto fue desarrollado como entrega integradora con el propósito de aplicar buenas prácticas de ingeniería de software en un entorno moderno, abarcando:
- Diseño de arquitectura Monorepo limpia y escalable.
- Implementación de APIs RESTful seguras con autenticación JWT y roles.
- Modelado de datos NoSQL con MongoDB Atlas.
- Desarrollo frontend basado en componentes reutilizables y arquitectura reactiva.
- Integración de servicios de terceros (Cloudinary) y despliegue continuo en la nube.

---

## 👨‍💻 Autor

**Pablo Ignacio Rico**  
Técnico Universitario en Programación – UTN-FRA  
[🔗 Perfil de LinkedIn](https://www.linkedin.com/in/pablo-ignacio-rico-ba8507227/)
