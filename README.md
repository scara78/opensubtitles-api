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
