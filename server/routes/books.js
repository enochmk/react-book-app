const express = require('express');
const db = require('../db/db.js');

const router = express.Router();

router.use(express.urlencoded({ extended: true }));
router.use(express.json());

// Add a new book
router.post('/', async (req, res) => {
	const { title, rating } = req.body;
	try {
		let results = await db.insert(title, rating);
		res.json(results);
	} catch (e) {
		console.log(e);
		res.sendStatus(500);
	}
});

// Get all books
router.get('/', async (req, res) => {
	try {
		let results = await db.books();
		res.json(results);
	} catch (e) {
		console.log(e);
		res.sendStatus(500);
	}
});

// Get details on specific book
router.get('/:id', async (req, res) => {
	try {
		let results = await db.one(req.params.id);
		res.json(results);
	} catch (e) {
		console.log(e);
		res.sendStatus(500);
	}
});

// Update a book
router.put('/:id', async (req, res) => {
	const { title, rating } = req.body;

	try {
		let results = await db.update(req.params.id, title, rating);
		res.json(results);
	} catch (e) {
		console.log(e);
		res.sendStatus(500);
	}
});

// Delete book
router.delete('/:id', async (req, res) => {
	try {
		let results = await db.delete(req.params.id);
		res.json(results);
	} catch (e) {
		console.log(e);
		res.sendStatus(500);
	}
});

module.exports = router;
