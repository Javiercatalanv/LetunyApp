# 🏐 LETUNY | Volleyball Match Tracker & Stats

**LETUNY** es una solución integral para el seguimiento de partidos de vóley en tiempo real. A diferencia de un marcador simple, esta aplicación transforma cada jugada en datos accionables, permitiendo al equipo "Letuny" analizar su rendimiento, detectar debilidades y celebrar sus victorias con estadísticas profesionales.

---

##Características Principales

###Gestión y Control en Vivo
* **Live Scoring:** Marcador interactivo para iOS y Android con sistema de puntos y gestión de sets.
* **Registro por Acción:** Marca quién hizo el punto y cómo (Remache, Saque, Bloqueo, Recepción).
* **Corrección de Errores:** Sistema de `-1` para ajustar el marcador y las estadísticas en tiempo real.

###Inteligencia Deportiva (Dashboard)
* **MVP Tracker:** Ranking automático de jugadores basado en un sistema de puntaje ponderado.
* **Análisis de Eficiencia:** Cálculo de porcentaje de éxito por cada fundamento técnico.
* **Historial Eterno:** Archivo cronológico de partidos con desglose de eventos por set.

###Administración de Equipo
* **Gestión de Plantilla:** Registro de jugadores con número y posición preferida.
* **Multiequipo:** Soporte para gestionar a Letuny y sus rivales.

---

##Stack Tecnológico

| Capa | Tecnología |
| :--- | :--- |
| **Frontend** | React Native (Expo) |
| **Estilos** | NativeWind (Tailwind CSS) |
| **Lenguaje** | TypeScript |
| **Backend** | NestJS + PostgreSQL |
| **ORM** | TypeORM |

---

##Instalación y Configuración

Sigue estos pasos para poner en marcha el entorno de desarrollo:

###Prerrequisitos
* **Node.js** (Versión LTS recomendada)
* **Expo Go** (Instalado en tu dispositivo móvil)

###Clonar y Configurar Frontend
```bash
git clone [https://github.com/tu-usuario/letuny-frontend.git](https://github.com/tu-usuario/letuny-frontend.git)
cd letuny-frontend
npm install
