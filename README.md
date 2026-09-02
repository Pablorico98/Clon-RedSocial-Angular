# 📱 Clon de Red Social Full Stack

Aplicación web Full Stack desarrollada como proyecto integrador, utilizando una arquitectura **Monorepo** con Angular para el frontend y NestJS para el backend.

El proyecto integra autenticación, autorización basada en roles, publicaciones, comentarios, perfiles de usuario, almacenamiento de imágenes en la nube, estadísticas administrativas y una base de datos MongoDB Atlas.

🌐 **Demo:**  
https://pablo-rico-tp-2-2026-c1-16o1.vercel.app/

💻 **Repositorio:**  
https://github.com/Pablorico98/Clon-RedSocial-Angular

---

## 🚀 Características principales

### 🔐 Autenticación y autorización

- Registro de usuarios.
- Inicio de sesión.
- Autenticación mediante JWT.
- Passport Strategy.
- Encriptación de contraseñas mediante Bcrypt.
- Sistema de roles: Usuario / Administrador.
- Protección de rutas mediante Guards.
- Interceptor HTTP para gestión automática del token JWT.

### 📝 Publicaciones

- Creación de publicaciones.
- Edición y eliminación.
- Feed de publicaciones.
- Publicaciones con imágenes.
- Almacenamiento de imágenes mediante Cloudinary.

### 💬 Comentarios

- Sistema de comentarios asociado a publicaciones.
- Gestión de comentarios mediante la API.

### 👤 Usuarios y perfiles

- Gestión de usuarios.
- Perfil de usuario.
- Personalización del avatar.
- Administración de datos de cuenta.

### 📊 Dashboard administrativo

- Acceso exclusivo para administradores.
- Visualización de estadísticas globales.
- Gestión de usuarios.
- Información general del sistema.

### 📱 Progressive Web App

El frontend incorpora funcionalidades PWA mediante:

- Service Workers.
- Web Manifest.

---

## 🛠️ Stack tecnológico

### Frontend

- **Angular 19+**
- **TypeScript**
- HTML5
- CSS3
- Progressive Web App (PWA)

También se implementaron:

- Directivas personalizadas.
- Pipes personalizados.
- Angular Guards.
- HTTP Interceptors.
- Servicios para comunicación con la API.
- Componentes reutilizables.

### Backend

- **Node.js**
- **NestJS**
- API REST.
- JWT.
- Passport.
- Bcrypt.
- DTOs.
- `class-validator`.
- Guards.

### Base de datos

- **MongoDB Atlas**

### Servicios externos

- **Cloudinary** para almacenamiento y gestión de imágenes.
- **Vercel** para despliegue de la aplicación.

---

## 🧩 Arquitectura

El proyecto utiliza una arquitectura **Monorepo**, separando frontend y backend dentro del mismo repositorio.

```
Clon-RedSocial-Angular/
│
├── client/
│   └── Angular
│
└── server/
    └── NestJS

Frontend
client/
└── src/
    └── app/
        ├── components/
        ├── pages/
        ├── guards/
        ├── interceptors/
        └── services/

Backend
server/
└── src/
    ├── auth/
    ├── usuarios/
    ├── publicaciones/
    ├── comentarios/
    └── estadisticas/
```

📂 Principales módulos

| Módulo        | Descripción                         |
| ------------- | ----------------------------------- |
| Auth          | Registro, login, JWT y autorización |
| Usuarios      | Gestión de usuarios y roles         |
| Publicaciones | CRUD de publicaciones e imágenes    |
| Comentarios   | Gestión de comentarios              |
| Estadísticas  | Métricas y dashboard administrativo |


▶️ Instalación y ejecución local
1. Clonar el repositorio
git clone https://github.com/Pablorico98/Clon-RedSocial-Angular.git
cd Clon-RedSocial-Angular

2. Configurar el backend
cd server
npm install

Crear un archivo .env con las variables necesarias:

MONGODB_URI=
JWT_SECRET=
CLOUDINARY_CLOUD_NAME=
CLOUDINARY_API_KEY=
CLOUDINARY_API_SECRET=

Luego iniciar el servidor:

npm run start:dev

3. Configurar el frontend

Abrir otra terminal:

cd client
npm install
npm start


🌐 Demo online

La aplicación se encuentra desplegada y disponible para probar:

https://pablo-rico-tp-2-2026-c1-16o1.vercel.app/

🎯 Objetivo del proyecto

El objetivo principal fue desarrollar una aplicación web completa utilizando tecnologías modernas de frontend y backend, integrando:

Arquitectura Full Stack.
API REST.
Autenticación y autorización.
Persistencia de datos.
Servicios cloud.
Desarrollo frontend basado en componentes.
Despliegue de la aplicación.
👨‍💻 Autor

Pablo Ignacio Rico

Técnico Universitario en Programación — UTN-FRA
[🔗 LinkedIn ](https://www.linkedin.com/in/pablo-ignacio-rico-ba8507227/)



    
