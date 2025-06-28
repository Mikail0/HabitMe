const { Schema, model } = require("mongoose");

// Das Schema definiert die Struktur eines Habit-Dokuments
const HabitSchema = new Schema({
  title: { type: String, required: true }, // Titel ist Pflichtfeld  
  completed: { type: Boolean, default: false }, // Abgehakt-Status (für Kompatibilität)
  dailyCompletions: {
    type: Map,
    of: Boolean,
    default: new Map()
  },
  reminder: {
    enabled: { type: Boolean, default: false }, // Erinnerung aktiviert
    time: { type: String, default: "09:00" }, // Zeit für Erinnerung (HH:MM)
    days: [{ type: String, default: ["monday", "tuesday", "wednesday", "thursday", "friday", "saturday", "sunday"] }] // Wochentage
  },
  createdAt: { type: Date, default: Date.now }, // Automatisches Erstellungsdatum
});

// Modell aus Schema erstellen (MongoDB-Collection: "habits")
module.exports = model("Habit", HabitSchema);
