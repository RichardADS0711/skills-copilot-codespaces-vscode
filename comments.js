// Create web server
const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const port = 3000;
const fs = require('fs');
const path = require('path');
const { v4: uuidv4 } = require('uuid');

// Set up the server
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// GET
app.get('/comments', (req, res) => {
    fs.readFile(path.join(__dirname, 'comments.json'), 'utf8', (err, data) => {
        if (err) {
            console.log(err);
            res.status(500).send('Internal server error');
        } else {
            res.status(200).send(data);
        }
    })
});

// POST
app.post('/comments', (req, res) => {
    const newComment = req.body;
    newComment.id = uuidv4();
    fs.readFile(path.join(__dirname, 'comments.json'), 'utf8', (err, data) => {
        if (err) {
            console.log(err);
            res.status(500).send('Internal server error');
        } else {
            const comments = JSON.parse(data);
            comments.push(newComment);
            fs.writeFile(path.join(__dirname, 'comments.json'), JSON.stringify(comments), (err) => {
                if (err) {
                    console.log(err);
                    res.status(500).send('Internal server error');
                } else {
                    res.status(201).send(newComment);
                }
            })
        }
    })
});

// DELETE
app.delete('/comments/:id', (req, res) => {
    const id = req.params.id;
    fs.readFile(path.join(__dirname, 'comments.json'), 'utf8', (err, data) => {
        if (err) {
            console.log(err);
            res.status(500).send('Internal server error');
        } else {
            const comments = JSON.parse(data);
            const newComments = comments.filter(comment => comment.id !== id);
            fs.writeFile(path.join(__dirname, 'comments.json'), JSON.stringify(newComments), (err) => {
                if (err) {
                    console.log(err);
                    res.status(500).send('Internal server error');
                } else {
                    res.status(200).send(newComments);
                }
            })
        }
    })
});

// PUT
app.put('/comments/:id', (req, res) =>