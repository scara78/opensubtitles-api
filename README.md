# 🎬 OpenSubtitles API (Node.js + Express)

API sencilla que permite buscar subtítulos de películas por IMDb ID desde OpenSubtitles.org, usando scraping (sin necesidad de token ni cuenta).

Ideal para integraciones ligeras en proyectos web, apps o media servers.

---

## 🚀 Características

* 🔎 Buscar subtítulos por IMDb ID (`/api/subtitles/:imdbid`)
* 📥 Obtener detalles de un subtítulo individual (`/api/subtitle/:id`)
* 🌐 Soporte para idiomas como español (`spn`, `spl`)
* 📄 Incluye release, nombre de archivo, y descarga directa del `.srt`
* 📎 Descarga y lectura opcional de archivos `.nfo` (créditos o detalles técnicos)

---

## 📦 Instalación

```bash
git clone https://github.com/tuusuario/opensubtitles-api.git
cd opensubtitles-api
npm install
npm run dev
```

▶️ Uso
Iniciar servidor
bash
Copy
Edit
npm start
Servidor disponible por defecto en http://localhost:3000

🧪 Endpoints
🔹 GET /api/subtitles/:imdbId
Busca subtítulos disponibles para una película por su IMDb ID.

Ejemplo:

bash
Copy
Edit
GET /api/subtitles/tt9603208
Respuesta:

json
Copy
Edit
[
  {
    "subtitleId": "12918891",
    "language": "Spanish (LA)",
    "title": "Mission: Impossible - Dead Reckoning Part Two",
    "downloadPage": "https://www.opensubtitles.org/en/subtitles/12918891"
  },
  ...
]
🔹 GET /api/subtitle/:subtitleId
Obtiene detalles de un subtítulo específico, incluyendo el enlace directo a descarga.

Ejemplo:

bash
Copy
Edit
GET /api/subtitle/12918891
Respuesta:

json
Copy
Edit
{
  "subtitleId": "12918891",
  "subtitleUrl": "https://www.opensubtitles.org/en/subtitles/12918891",
  "downloadUrl": "https://www.opensubtitles.org/en/download/sub/12918891",
  "fileId": "1961493430",
  "directDownload": "https://dl.opensubtitles.org/en/download/file/1961493430"
}
🌍 Idiomas soportados
spn – Spanish (Spain)

spl – Spanish (Latin America)

Puedes combinar varios: spn,spl,en

🛠️ Tecnologías
Node.js

Express.js

Axios

Cheerio (scraping ligero)

📄 Licencia
MIT License © 2025
