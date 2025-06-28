const express = require('express');
const router = express.Router();
const Habit = require('../model/Habit');

// GET: Alle Habits
router.get('/', async (req, res) => {
  const habits = await Habit.find();
  res.json(habits);
});

// POST: Neuen Habit anlegen
router.post('/', async (req, res) => {
  const { title, reminder } = req.body;
  const newHabit = new Habit({ title, reminder });
  await newHabit.save();
  res.status(201).json(newHabit);
});

// PUT: Habit aktualisieren
router.put('/:id', async (req, res) => {
  const { id } = req.params;
  const { title, completed, reminder } = req.body;
  const updatedHabit = await Habit.findByIdAndUpdate(
    id,
    { title, completed, reminder },
    { new: true }
  );
  res.json(updatedHabit);
});

// PATCH: Tägliche Completion aktualisieren
router.patch('/:id/daily', async (req, res) => {
  const { id } = req.params;
  const { date, completed } = req.body;
  
  try {
    // Prüfe ob das Datum in der Zukunft liegt
    const requestedDate = new Date(date);
    const today = new Date();
    today.setHours(23, 59, 59, 999); // Ende des heutigen Tages
    
    if (requestedDate > today) {
      return res.status(400).json({ 
        message: 'Du kannst nur den aktuellen Tag oder vergangene Tage bearbeiten' 
      });
    }

    const habit = await Habit.findById(id);
    if (!habit) {
      return res.status(404).json({ message: 'Habit nicht gefunden' });
    }

    // Tägliche Completion aktualisieren
    if (!habit.dailyCompletions) {
      habit.dailyCompletions = new Map();
    }
    habit.dailyCompletions.set(date, completed);
    
    // Für Kompatibilität: completed auf true setzen, wenn mindestens ein Tag abgehakt ist
    const hasAnyCompletion = Array.from(habit.dailyCompletions.values()).some(val => val === true);
    habit.completed = hasAnyCompletion;
    
    await habit.save();
    res.json(habit);
  } catch (error) {
    console.error('Fehler beim Aktualisieren der täglichen Completion:', error);
    res.status(500).json({ message: 'Fehler beim Aktualisieren der täglichen Completion' });
  }
});

// PATCH: Nur Erinnerung aktualisieren
router.patch('/:id/reminder', async (req, res) => {
  const { id } = req.params;
  const { reminder } = req.body;
  const updatedHabit = await Habit.findByIdAndUpdate(
    id,
    { reminder },
    { new: true }
  );
  res.json(updatedHabit);
});

// DELETE: Habit löschen
router.delete('/:id', async (req, res) => {
  const { id } = req.params;
  await Habit.findByIdAndDelete(id);
  res.json({ message: 'Habit gelöscht' });
});

module.exports = router;
