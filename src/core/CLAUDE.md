# src/core/ - Infraestructura Compartida

Modulo de infraestructura. No contiene logica de negocio del examen.

## Archivos clave

- firebase/firebase.js       Unica instancia de Firebase App, Auth y Firestore
- router/AppRouter.jsx       Definicion de rutas con React Router v7
- router/ProtectedRoute.jsx  Redirige a /admin/login si no hay usuario autenticado
- store/useAuthStore.js      Store Zustand: { user, loading, login, logout }
- constants/certifications.js  Array CERTIFICATIONS - fuente de verdad de todos los examenes

## Regla

Nada fuera de este modulo debe importar firebase directamente.
