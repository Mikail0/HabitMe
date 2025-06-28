# HabitMe - Habit Tracking App

Eine moderne Habit-Tracking-Anwendung mit täglichem Tracking, Statistiken und Erinnerungen. Die App besteht aus einem Node.js/Express Backend und einem React/Vite Frontend mit TypeScript.

## 🚀 Features & Funktionalitäten

### 📋 Habit-Management
- ✅ **Habit erstellen** - Erstelle neue Gewohnheiten mit Titel und optionalen Erinnerungen
- ✅ **Habit bearbeiten** - Ändere Titel und Einstellungen bestehender Habits
- ✅ **Habit löschen** - Entferne Habits mit Bestätigungsdialog
- ✅ **Habit-Liste** - Übersichtliche Darstellung aller Habits

### 📅 Tägliches Tracking
- ✅ **Tägliche Completions** - Markiere Habits nur für den aktuellen Tag
- ✅ **Keine rückwirkenden Änderungen** - Verhindert Manipulation vergangener Tage
- ✅ **DailyHabits-Card** - Übersichtliche Darstellung der heutigen Habits
- ✅ **Fortschrittsbalken** - Visueller Fortschritt für den aktuellen Tag
- ✅ **Status-Badges** - Klare Anzeige von "Erledigt" oder "Ausstehend"

### ⏰ Erinnerungssystem
- ✅ **Erinnerungen konfigurieren** - Zeit und Wochentage für jede Gewohnheit
- ✅ **Wochentag-Auswahl** - Wähle aus, an welchen Tagen Erinnerungen aktiv sind
- ✅ **Zeit-Einstellung** - Konfiguriere die gewünschte Erinnerungszeit
- ✅ **Erinnerungs-Anzeige** - Visuelle Indikatoren für aktive Erinnerungen

### 📊 Statistiken & Analytics
- ✅ **Echte Statistiken** - Basierend auf täglichen Completions
- ✅ **Heute erledigt** - Anzahl der heute abgeschlossenen Habits
- ✅ **Erfolgsrate** - Prozentsatz der heute erledigten Habits
- ✅ **Längster Streak** - Berechnung basierend auf den letzten 30 Tagen
- ✅ **Gesamte Vervollständigungen** - Summe aller täglichen Completions
- ✅ **Wöchentlicher Fortschritt** - Analyse der letzten 4 Wochen pro Wochentag
- ✅ **Habit-Verteilung** - Erfolgsrate der Top 5 Habits (letzte 30 Tage)
- ✅ **Aktivster Tag** - Wochentag mit den meisten geplanten Habits

### 🎨 Benutzeroberfläche
- ✅ **Dark/Light Mode** - Vollständige Theme-Unterstützung mit Toggle
- ✅ **Responsive Design** - Optimiert für Desktop, Tablet und Mobile
- ✅ **Moderne UI** - Tailwind CSS mit schönen Animationen
- ✅ **Navigation** - Seitenübergreifende Navigation (Dashboard, Habits, Statistiken, Einstellungen)
- ✅ **Hero-Section** - Willkommensbereich mit App-Beschreibung

### 💬 Motivation & Engagement
- ✅ **Motivationsspruch** - Tägliche Inspiration von der Quotable API
- ✅ **Erfolgs-Nachrichten** - Positive Rückmeldung bei erledigten Habits
- ✅ **Fortschritts-Feedback** - Visuelle Belohnungen für Erfolge
- ✅ **Refresh-Funktion** - Manuelle Aktualisierung der Statistiken

### 🔧 Technische Features
- ✅ **TypeScript** - Vollständige Type Safety
- ✅ **API-Integration** - RESTful API mit Express.js
- ✅ **Datenbank-Persistierung** - MongoDB mit Mongoose ODM
- ✅ **CORS-Unterstützung** - Sichere Cross-Origin-Kommunikation
- ✅ **Error Handling** - Umfassende Fehlerbehandlung
- ✅ **Loading States** - Benutzerfreundliche Ladeanimationen

## 📋 Voraussetzungen

Stelle sicher, dass folgende Software installiert ist:

- **Node.js** (Version 16 oder höher)
- **npm** (wird mit Node.js installiert)
- **MongoDB** (lokal oder MongoDB Atlas)

## 🛠️ Installation & Setup

### 1. Repository klonen

```bash
git clone <repository-url>
cd HabitMe
```

### 2. Backend Setup

```bash
# In das Backend-Verzeichnis wechseln
cd backend

# Dependencies installieren
npm install
```

#### Umgebungsvariablen konfigurieren

Erstelle eine `.env` Datei im `backend` Ordner:

```env
PORT=5000
MONGO_URI=mongodb://localhost:27017/habitme
NODE_ENV=development
```

**Hinweis:** Die `config/db.js` Datei ist bereits vorhanden und muss nicht geändert werden. Sie verwendet automatisch die Umgebungsvariablen aus der `.env` Datei.

### 3. Frontend Setup

```bash
# In das Frontend-Verzeichnis wechseln
cd ../frontend

# Dependencies installieren
npm install
```

### 4. MongoDB starten

#### Option A: Lokale MongoDB
```bash
# MongoDB starten (Windows)
"C:\Program Files\MongoDB\Server\{version}\bin\mongod.exe"

# MongoDB starten (macOS/Linux)
mongod
```

#### Option B: MongoDB Atlas (Cloud)
1. Gehe zu [MongoDB Atlas](https://www.mongodb.com/atlas)
2. Erstelle ein kostenloses Konto
3. Erstelle einen neuen Cluster
4. Kopiere die Verbindungs-URL
5. Ersetze `mongodb://localhost:27017/habitme` in der `.env` Datei durch deine Atlas-URL

## 🚀 Anwendung starten

### 1. Backend starten

```bash
# Im backend-Verzeichnis
cd backend
npm start
```

Das Backend läuft dann auf: `http://localhost:5000`

### 2. Frontend starten

```bash
# In einem neuen Terminal, im frontend-Verzeichnis
cd frontend
npm run dev
```

Das Frontend läuft dann auf: `http://localhost:5173`

### 3. Anwendung öffnen

Öffne deinen Browser und gehe zu: `http://localhost:5173`

## 📁 Projektstruktur

```
HabitMe/
├── backend/
│   ├── config/
│   │   └── db.js              # MongoDB-Verbindung (bereits vorhanden)
│   ├── model/
│   │   └── Habit.js           # Habit-Model (Mongoose)
│   ├── routes/
│   │   └── habits.js          # API-Routen
│   ├── package.json
│   └── server.js              # Express-Server
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── Dashboard.tsx          # Haupt-Dashboard
│   │   │   ├── DailyHabits.tsx        # Tägliche Habits-Card
│   │   │   ├── HabitForm.tsx          # Habit-Erstellung
│   │   │   ├── HabitList.tsx          # Habit-Verwaltung
│   │   │   ├── Statistics.tsx         # Statistiken
│   │   │   ├── Navigation.tsx         # Navigation
│   │   │   ├── HeroSection.tsx        # Hero-Bereich
│   │   │   ├── ReminderSettings.tsx   # Erinnerungs-Einstellungen
│   │   │   └── DeleteConfirmation.tsx # Lösch-Bestätigung
│   │   ├── contexts/
│   │   │   └── ThemeContext.tsx       # Dark/Light Mode
│   │   ├── App.tsx
│   │   └── main.tsx
│   ├── package.json
│   └── tailwind.config.js
└── README.md
```

## 🔧 API-Endpunkte

### Habits
- `GET /habits` - Alle Habits abrufen
- `POST /habits` - Neuen Habit erstellen
- `PUT /habits/:id` - Habit aktualisieren
- `PATCH /habits/:id/daily` - Tägliche Completion aktualisieren (nur aktuelle/vergangene Tage)
- `PATCH /habits/:id/reminder` - Erinnerung aktualisieren
- `DELETE /habits/:id` - Habit löschen

### Beispiel-Request für neuen Habit:
```json
{
  "title": "Täglich 10 Minuten lesen",
  "reminder": {
    "enabled": true,
    "time": "09:00",
    "days": ["monday", "tuesday", "wednesday", "thursday", "friday"]
  }
}
```

## 🎨 Technologien

### Backend
- **Node.js** - JavaScript Runtime
- **Express.js** - Web Framework
- **MongoDB** - Datenbank
- **Mongoose** - ODM für MongoDB
- **CORS** - Cross-Origin Resource Sharing

### Frontend
- **React 18** - UI Framework
- **TypeScript** - Type Safety
- **Vite** - Build Tool
- **Tailwind CSS** - Styling Framework
- **React Router** - Navigation

## 🐛 Troubleshooting

### Häufige Probleme

#### 1. MongoDB-Verbindungsfehler
```
Error: connect ECONNREFUSED 127.0.0.1:27017
```
**Lösung:** Stelle sicher, dass MongoDB läuft:
```bash
# Windows
net start MongoDB

# macOS/Linux
sudo systemctl start mongod
```

#### 2. Port bereits belegt
```
Error: listen EADDRINUSE :::5000
```
**Lösung:** Ändere den Port in der `.env` Datei:
```env
PORT=5001
```

#### 3. CORS-Fehler im Frontend
```
Access to fetch at 'http://localhost:5000/habits' from origin 'http://localhost:5173' has been blocked by CORS policy
```
**Lösung:** Stelle sicher, dass das Backend läuft und CORS korrekt konfiguriert ist.

#### 4. Dependencies-Fehler
```bash
# Lösche node_modules und installiere neu
rm -rf node_modules package-lock.json
npm install
```

## 📝 Entwicklung

### Neuen Habit-Typ hinzufügen

1. Erweitere das Habit-Model in `backend/model/Habit.js`
2. Aktualisiere die API-Routen in `backend/routes/habits.js`
3. Passe die Frontend-Komponenten an

### Neue Statistik hinzufügen

1. Erweitere die `calculateStats` Funktion in `frontend/src/components/Statistics.tsx`
2. Füge neue UI-Komponenten hinzu

## 🤝 Beitragen

1. Fork das Repository
2. Erstelle einen Feature-Branch (`git checkout -b feature/AmazingFeature`)
3. Committe deine Änderungen (`git commit -m 'Add some AmazingFeature'`)
4. Push zum Branch (`git push origin feature/AmazingFeature`)
5. Öffne einen Pull Request

## 📄 Lizenz

Dieses Projekt ist unter der MIT-Lizenz lizenziert.

## 👨‍💻 Autor

Entwickelt als Web Engineering II Projekt im 4. Semester.

---

**Viel Spaß beim Habit-Tracking! 🎯** 