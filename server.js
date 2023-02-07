const express = require('express');
const path = require('path');
const fs = require('fs');
const { notes } = require('./db/db');
const { v4: uuidv4 } = require('uuid');
const PORT = process.env.PORT || 3001
const app = express();

// Middleware to parse incoming request data as JSON
app.use(express.json());

// Middleware to parse incoming request data as URL encoded data
app.use(express.urlencoded({ extended: true }));

// Serve static files from 'public' directory
app.use(express.static('public'));

// Log initial notes from db
console.log(notes);

// API Routes

// Route to handle GET request to '/api/notes' and return all notes
app.get('/api/notes', (req, res) => {
    
    // Log the initial notes array
    console.log("Initial notes array: " + notes);
    // If there are no notes, log an error
    if (!notes) {
        console.log("No notes found.");
        return;
    }
    // Send the notes as a JSON response
    res.json(notes)
});

// Route to handle POST request to '/api/notes' and add a new note
app.post('/api/notes', (req, res) => {
    // Create a new note using the request body
    const newNote = req.body;
    // Assign a unique id to the new note
    req.body.id = uuidv4();
    // Log the new note
    console.log("New note: " + JSON.stringify(req.body))

    // Add the newNote to the notes array
    notes.push(newNote)

    // Write the updated notes array to the db file
    fs.writeFileSync(
        path.join(__dirname, './db/db.json'),
        JSON.stringify({notes: notes }, null, 2)
    );

    // Send the new note as a JSON response
    res.json(newNote);
});

// Route to handle DELETE request 
app.delete('/api/notes/:id', (req, res) => {
    // Get the id of the note to be deleted from the request parameters
    noteId = req.params.id
    // Find the index of the note in the notes array
    const index = notes.map(e => e.id).indexOf(noteId)
    // Remove the note from the notes array
    notes.splice(index, 1);

    // Write the updated notes array to the db file
    fs.writeFileSync(
        path.join(__dirname, './db/db.json'),
        JSON.stringify({notes: notes }, null, 2)
    )

    // Send the deleted note id as a JSON response
    res.json(noteId);
});

// HTML Routes

app.get('/notes', (req, res) => {
    res.sendFile(path.join(__dirname, '/public/notes.html'))
})

app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '/public/index.html'));
})

app.listen(PORT, () => {
    console.log(`API server now on port ${PORT}!`);
})