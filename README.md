🇩🇪 Digital & Mobil in Deutschland

Digital & Mobil in Deutschland ist ein kostenloses Informationsportal für Einwohner und Neuzugewanderte in Deutschland.
Die Plattform bündelt wichtige digitale Dienste, aktuelle Informationen und nützliche Tools an einem Ort.

⸻

🚀 Features

🗞️ Informationen & Medien
	•	Aktuelle Nachrichten (RSS-Feeds von tagesschau.de und euronews)
	•	YouTube-Videos & Playlists (Deutsch & Russisch, nocookie eingebettet)

🌤️ Tools & Services
	•	Wetter & Luftqualität in Echtzeit (OpenWeatherMap API)
	•	PDF-Kompressor (eigene Web-App)
	•	Foto-zu-PDF Konverter (eigene Web-App)

🌐 Externe Ressourcen
	•	Jobportale
	•	Arztsuche & Terminbuchung
	•	Deutsche Bahn Fahrplan
	•	Übersetzer
	•	KI-Tools
	•	Lokale Informationen (z. B. Hattingen)

🌍 Mehrsprachigkeit
	•	Deutsch 🇩🇪 / Russisch 🇷🇺
	•	Dynamische Sprachumschaltung innerhalb der Website

⸻

🛠️ Tech Stack

Frontend:
	•	HTML5
	•	CSS3
	•	JavaScript (Vanilla ES6+)

APIs & Services:
	•	OpenWeatherMap (Wetter & Luftqualität)
	•	rss2json (RSS-Feeds)

Hosting:
	•	Vercel (statische Website)

⸻

🔐 Datenschutz & DSGVO
	•	Cookie Consent Manager (Silktide)
	•	YouTube im erweiterten Datenschutzmodus (youtube-nocookie)
	•	Zwei-Klick-Lösung für externe Inhalte
	•	Lokale Schriftarten (kein Google Fonts CDN)
	•	DSGVO-konforme Datenschutzerklärung
	•	Impressum gemäß § 5 DDG & § 18 MStV

⸻

⚙️ Core Features
	•	🕒 Echtzeit-Uhr & Datum
	•	🌦️ Wetter mit LocalStorage-Caching
	•	🔄 Sprachumschaltung (DE ↔ RU)
	•	📱 Responsive Design (Mobile First)
	•	📑 Tab-basierte Navigation (ohne Seitenreload)

⸻

📄 PDF-Kompressor

Repository:
👉 https://github.com/fin325/pdf-compressor-web

Technologien:
	•	Python
	•	Flask
	•	PyMuPDF (fitz)
	•	Supabase (PostgreSQL)

Hosting:
	•	Render (Backend)
	•	Supabase (Datenbank)

Funktion:
	•	Upload einer PDF-Datei
	•	Auswahl der Kompressionsstufe
	•	Rendering jeder Seite als Bild (Pixmap)
	•	Neuerstellung als optimiertes PDF

Optimierungen:
	•	Garbage Collection (Level 4)
	•	Deflate-Kompression
	•	Keine Speicherung von Dateien auf dem Server

Extras:
	•	Feedback-System (Like/Dislike)
	•	IP-basierte Duplikaterkennung

⸻

📸 Foto → PDF Konverter

Repository:
👉 https://github.com/fin325/photo-to-pdf-converter

Technologien:
	•	Python
	•	Streamlit
	•	Pillow (PIL)

Hosting:
	•	Streamlit Community Cloud

Funktion:
	•	Upload von JPG/PNG Bildern
	•	Automatische Konvertierung zu PDF
	•	Mehrseitige PDF (1 Bild = 1 Seite)

Technische Details:
	•	Verarbeitung im Arbeitsspeicher (BytesIO)
	•	Keine Speicherung auf dem Server
	•	Vorschau im Browser (Base64 iframe)

💻 Development & Dokumentation

Die vollständige technische Dokumentation ist direkt auf der Website verfügbar:

👉 https://digital-mobil-deutschland.vercel.app (Tab: **„Projekt Info“**)

**Enthaltene Dokumente:**
- 📄 Development.pdf  
- 📄 HTML.pdf  
- 📄 STYLES.pdf  
- 📄 SCRIPTS.pdf  

Diese Dokumentation beschreibt die Architektur, den Codeaufbau sowie die verwendeten Technologien im Detail.

Auf dem 
⸻

📜 Rechtliches
	•	Impressum
	•	Datenschutz

⸻

👨‍💻 Autor

Artem Finevych
Hattingen, Nordrhein-Westfalen, Deutschland

⸻

💡 Idee

## Ziel des Projekts

Ziel ist es, eine zentrale digitale Plattform zu schaffen,
die besonders Migranten den Alltag in Deutschland erleichtert.

---

© 2026 Artem Finevych. Alle Rechte vorbehalten.  
Dieses Projekt ist urheberrechtlich geschützt.  
Lizenz: [CC BY-NC 4.0](https://creativecommons.org/licenses/by-nc/4.0/)
