# src/features/admin/ - Panel de Administracion

Nota: No hay API REST propia en este proyecto.
Las operaciones de 'API' son llamadas directas a Firestore desde los hooks de admin.

## Flujo admin

1. Login en /admin/login (Firebase Auth con email/password)
2. useAdmin.js fetcha y mutea preguntas directamente en Firestore
3. ImportModal.jsx acepta JSON y hace batch write a Firestore

## Seguridad

firestore.rules - solo usuarios autenticados pueden escribir en questions/**

## Estructura

features/admin/
- pages/   AdminDashboardPage, AdminQuestionsPage, AdminLoginPage, AdminSettingsPage
- components/  QuestionForm, ImportModal
- hooks/   useAdmin.js
