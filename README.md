# E-commerce Backend - Arquitectura MVC & Multi-Database

Este proyecto es una API RESTful desarrollada con **Node.js**, **Express** y **TypeScript**. El objetivo principal fue construir un sistema de gestión de inventario y simulación de ventas, demostrando la capacidad de migrar la persistencia de datos entre motores Relacionales (SQL) y No Relacionales (NoSQL).

## Evolución del Proyecto (Roadmap)

El repositorio está estructurado para mostrar dos fases críticas de desarrollo:

### Fase 1: Persistencia Relacional (MySQL)
* **Rama:** `feat/mysql-version`
* **Tecnologías:** MySQL + Sequelize (ORM).
* **Logro:** Implementación inicial de la lógica de negocio, manejo de stock y validaciones de tipos estrictos con TypeScript sobre un esquema de tablas rígido.

### Fase 2: Migración a NoSQL (MongoDB) - [Actual en Main]
* **Rama:** `main`
* **Tecnologías:** MongoDB + Mongoose (ODM).
* **Mejoras:** * Flexibilidad en el esquema de productos.
    * Uso de **ObjectIDs** para escalabilidad horizontal.
    * Optimización de controladores para manejo de documentos JSON dinámicos.
    * Refactorización de interfaces para compatibilidad con tipos de Mongoose.

---

## Stack Tecnológico
- **Lenguaje:** TypeScript (Tipado estricto en toda la App).
- **Framework:** Express.js.
- **Base de Datos:** MongoDB (vía Mongoose).
- **Arquitectura:** Modelo-Vista-Controlador (MVC).
- **Gestor de Paquetes:** pnpm.

## Estructura de Carpetas
- `src/config/`: Configuraciones de conexión (DB).
- `src/controllers/`: Lógica de control y respuestas de la API.
- `src/models/`: Definición de Esquemas (Schemas) e Interfaces.
- `src/routes/`: Definición de rutas y endpoints.
- `src/types/`: Tipos personalizados para la lógica de negocio.

## Endpoints para Pruebas (Thunder Client)

### Gestión de Productos
- `GET /api/` - Listar inventario completo.
- `POST /api/` - Agregar nuevo producto.
- `PUT /api/:id` - Actualizar datos (precio, stock, nombre).
- `DELETE /api/:id` - Eliminar producto del catálogo.

### Flujo de Ventas
- `POST /api/purchase` - Simular venta (Valida: existencia -> stock -> dinero recibido -> descuento de inventario -> devolución de cambio).
- `GET /api/purchases/all` - Reporte histórico de ventas realizadas.

---

## ⚙️ Guía de Inicio Rápido

1. Clone el repositorio:
   ```bash
   git clone https://github.com/mpaulatq-07/ecommerce-backend-mvc.git
