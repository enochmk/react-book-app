const mysql = require('mysql2');
require('dotenv').config();

const conn = mysql.createConnection({
	host: process.env.DB_HOST,
	user: process.env.DB_USER,
	database: process.env.DB_DATABASE,
	password: process.env.DB_PASSWORD
});

let db = {};

// Get all books
db.books = () => {
	return new Promise((resolve, reject) => {
		const stmt = 'SELECT * FROM tbl_books';
		conn.query(stmt, (err, results) => {
			if (err) return reject(err);

			return resolve(results);
		});
	});
};

// Return details of a book by id;
db.one = (id) => {
	return new Promise((resolve, reject) => {
		const stmt = 'SELECT * FROM tbl_books WHERE id = ?';

		conn.query(stmt, [id], (err, results) => {
			if (err) return reject(err);
			return resolve(results);
		});
	});
};

// Add new book
db.insert = (title, rating) => {
	return new Promise((resolve, reject) => {
		const stmt = 'INSERT INTO tbl_books (title, rating) VALUES (?, ?)';

		conn.query(stmt, [title, rating], (err, results) => {
			if (err) return reject(err);

			return resolve(results);
		});
	});
};

// Update a book attribute
db.update = (id, title, rating) => {
	return new Promise((resolve, reject) => {
		const stmt = 'UPDATE tbl_books SET title = ? , rating = ? WHERE id = ?';

		conn.query(stmt, [title, rating, id], (err, results) => {
			if (err) return reject(err);

			return resolve(results);
		});
	});
};

// Delete a book
db.delete = (id) => {
	return new Promise((resolve, reject) => {
		const stmt = 'DELETE FROM tbl_books WHERE id = ?';

		conn.query(stmt, [id], (err, results) => {
			if (err) return reject(err);

			return resolve(results);
		});
	});
};

module.exports = db;
