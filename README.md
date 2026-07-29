# 📱 Clon de Red Social Full Stack (Monorepo)

Aplicación web interactiva tipo Red Social desarrollada con arquitectura **Monorepo**, conectando un cliente dinámico en Angular con un servidor robusto en NestJS y MongoDB Atlas.

🔗 **Demo en vivo:** [https://pablo-rico-tp-2-2026-c1-16o1.vercel.app/](https://pablo-rico-tp-2-2026-c1-16o1.vercel.app/)

---

## 🛠️ Stack Tecnológico

### Frontend (`/client`):
* **Framework:** Angular 19+ (TypeScript)
* **PWA Support:** Service Workers & Web Manifest integrados
* **Características:** Directivas personalizadas (`auto-focus`, `resaltar`, `solo-numeros`), Pipes personalizados (`iniciales`, `tiempo-transcurrido`, `truncate`), Interceptores HTTP para JWT y Guards de navegación (`auth.guard`, `public.guard`, `admin.guard`).

### Backend (`/server`):
* **Framework:** NestJS (Node.js)
* **Autenticación:** JWT (JSON Web Tokens) + Passport Strategy + Bcrypt
* **Base de Datos:** MongoDB Atlas mediante Mongoose / TypeORM
* **Gestión de Multimedia:** Cloudinary API para carga y almacenamiento optimizado de imágenes
* **Validación:** DTOs estructurados con `class-validator`

---

## ✨ Funcionalidades Principales

* 🔐 **Autenticación y Roles:** Registro, inicio de sesión seguro mediante JWT y control de acceso basado en roles (Usuario / Admin).
* 📝 **Gestión de Publicaciones:** Creación, edición, eliminación e interacción en feed de posteos con imágenes almacenadas en Cloudinary.
* 💬 **Módulo de Comentarios:** Hilo de comentarios en tiempo real integrados a cada publicación.
* 📊 **Panel de Administración (Dashboard):** Visualización de estadísticas globales del sistema y gestión avanzada de usuarios.
* 👤 **Perfil de Usuario:** Personalización de avatar y datos de cuenta.

---

## 📁 Estructura del Monorepo

```text
├── client/          # Frontend en Angular
│   ├── src/app/
│   │   ├── components/    # Componentes reutilizables (publicacion-card, etc.)
│   │   ├── pages/         # Páginas (inicio, login, registro, perfil, dashboard)
│   │   ├── guards/        # Protección de rutas por JWT y Rol
│   │   ├── interceptors/  # Inyección automática de Tokens HTTP
│   │   └── services/      # Servicios de comunicación API
└── server/          # API RESTful en NestJS
    ├── src/
    │   ├── auth/          # Módulo de Autenticación, JWT Strategy & Guards
    │   ├── usuarios/      # CRUD de usuarios y roles
    │   ├── publicaciones/ # Gestión de posteos y multimedia
    │   ├── comentarios/   # Módulo de interacción
    │   └── estadisticas/  # Módulo de reportes y métricas




            
