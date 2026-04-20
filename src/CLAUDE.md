# src/ - Modulo: Codigo Fuente CertZen (Simulator Multi-Plataforma)

SPA React + Firebase. Sin backend propio - toda la logica de servidor es Firebase BaaS.

## Estructura

src/
- core/      Infraestructura: Firebase, Router, Zustand Store, Constants
- features/  Modulos por dominio
  - exam/    Motor del examen (preguntas, timer, respuestas)
  - results/ Pantalla de resultados y score
  - welcome/ Seleccion de certificacion
  - admin/   Panel de administracion de preguntas
- App.jsx    Routing raiz
- main.jsx   Punto de entrada

## Reglas

- features/* puede usar core/ solamente
- features/A NO puede usar features/B
- Firebase solo desde core/firebase/firebase.js
- Variables de entorno: siempre import.meta.env.VITE_*

## Convenciones

- Componentes: PascalCase en features/<feature>/components/
- Hooks: prefijo 'use' en features/<feature>/hooks/
- Estado global: solo via Zustand en core/store/
- Sin TypeScript actualmente
