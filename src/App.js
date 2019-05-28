import React, { Component } from 'react';
import { Table, Button, Modal, ModalHeader, ModalBody, ModalFooter, FormGroup, Label, Input, Alert } from 'reactstrap';
import axios from 'axios';

class App extends Component {
	state = {
		books: [],
		newBookModal: false,
		newBookData: {
			title: '',
			rating: 0
		},
		editBookData: {
			id: 0,
			title: '',
			rating: 0
		},
		editBookModal: false,
		error: false,
		message: ''
	};

	componentDidMount() {
		this._refreshBooks();
	}

	// Toggle add New Book Modal (Hide or show)
	toggleNewBookModal = () => {
		this.setState({
			newBookModal: !this.state.newBookModal
		});
	};

	toggleEditBookModal = () => {
		this.setState({
			editBookModal: !this.state.editBookModal
		});
	};

	// Add Book
	handleInputChange = (e) => {
		e.preventDefault();
		const { name, value } = e.target;
		const bookCopy = { ...this.state.newBookData };
		bookCopy[name] = value;
		this.setState({ newBookData: bookCopy });
	};

	// Submit Data;
	handleAddBook = (e) => {
		e.preventDefault();
		axios
			.post('http://localhost:5000/books', this.state.newBookData)
			.then((response) => {
				let newBook = { ...this.state.newBookData, id: response.data.insertId };

				let { books } = this.state;

				books.push(newBook);

				this.setState({ books: books, newBookModal: false });
			})
			.catch((err) => console.log(err));
	};

	// Handle edit button
	handleEditBookData = (id, title, rating) => {
		const data = {
			id,
			title,
			rating
		};
		this.toggleEditBookModal();
		this.setState({ editBookData: data });
	};

	// Handle edit changes
	handleEditChange = (e) => {
		e.preventDefault();
		const { name, value } = e.target;
		const bookCopy = { ...this.state.editBookData };
		bookCopy[name] = value;
		this.setState({ editBookData: bookCopy });
	};

	// Handle update book when done editting.
	handleUpdateBook = (e) => {
		e.preventDefault();
		let { title, rating } = this.state.editBookData;
		axios
			.put(`http://localhost:5000/books/${this.state.editBookData.id}`, {
				title,
				rating
			})
			.then((response) => {
				console.log(response);
				this.toggleEditBookModal();
				this._refreshBooks();
			});
	};

	handleDeleteBook = (id) => {
		axios
			.delete(`http://localhost:5000/books/${id}`)
			.then((response) => {
				console.log(response);
				this._refreshBooks();
			})
			.catch((err) => console.log(err));
	};

	_refreshBooks() {
		axios
			.get('http://localhost:5000/books')
			.then((response) => {
				this.setState({
					books: response.data
				});
			})
			.catch((err) => {
				console.log(err.toString());
				this.setState({ error: true, message: err.toString() });
			});
	}

	render() {
		let books = this.state.books.map((book) => (
			<tr key={book.id}>
				<td>{book.id}</td>
				<td>{book.title}</td>
				<td>{book.rating}</td>
				<td>
					<Button
						color="success"
						size="sm"
						className="mr-2"
						onClick={() => this.handleEditBookData(book.id, book.title, book.rating)}
					>
						Edit
					</Button>
					<Button color="danger" size="sm" onClick={() => this.handleDeleteBook(book.id)}>
						Delete
					</Button>
				</td>
			</tr>
		));

		let modalEditBook = (
			<Modal isOpen={this.state.editBookModal} toggle={this.toggleEditBookModal}>
				<form method="POST" onSubmit={this.handleUpdateBook}>
					<ModalHeader toggle={this.toggleEditBookModal}>Edit Book</ModalHeader>
					<ModalBody>
						<FormGroup>
							<Label for="title">Title</Label>
							<Input
								type="text"
								id="title"
								name="title"
								value={this.state.editBookData.title}
								onChange={this.handleEditChange}
							/>
						</FormGroup>
						<FormGroup>
							<Label for="bookRating">Rating</Label>
							<Input
								type="text"
								id="rating"
								name="rating"
								value={this.state.editBookData.rating}
								onChange={this.handleEditChange}
							/>
						</FormGroup>
					</ModalBody>
					<ModalFooter>
						<Button type="submit" color="success">
							Save
						</Button>{' '}
						<Button type="reset" color="secondary" onClick={this.toggleEditBookModal}>
							Cancel
						</Button>
					</ModalFooter>
				</form>
			</Modal>
		);

		let modalAddBook = (
			<Modal isOpen={this.state.newBookModal} toggle={this.toggleNewBookModal}>
				<form method="POST" onSubmit={this.handleAddBook}>
					<ModalHeader toggle={this.toggleNewBookModal}>Add Book</ModalHeader>
					<ModalBody>
						<FormGroup>
							<Label for="bookTitle">Title</Label>
							<Input
								type="text"
								id="title"
								name="title"
								placeholder="Game of Thrones Chapter 2.."
								onChange={this.handleInputChange}
							/>
						</FormGroup>
						<FormGroup>
							<Label for="bookRating">Rating</Label>
							<Input type="text" id="rating" name="rating" placeholder="5.6" onChange={this.handleInputChange} />
						</FormGroup>
					</ModalBody>
					<ModalFooter>
						<Button type="submit" color="success">
							Add
						</Button>{' '}
						<Button type="reset" color="secondary" onClick={this.toggleNewBookModal}>
							Cancel
						</Button>
					</ModalFooter>
				</form>
			</Modal>
		);

		let alert = (
			<tr>
				<Alert color="danger">{this.state.message}</Alert>
			</tr>
		);

		return (
			<div className="container mt-4 d-flex justify-content-center flex-column">
				<h1 className="display-2 text-center">Books App</h1>
				<Button color="primary" size="sm" className="m-2 text-center" onClick={this.toggleNewBookModal}>
					Add a new Book
				</Button>

				{/* Modal to add new book */}
				{modalAddBook}

				{/* Modal to edit a book */}
				{modalEditBook}

				<Table>
					<thead>
						<tr>
							<th>#</th>
							<th>Title</th>
							<th>Rating</th>
							<th>Actions</th>
						</tr>
					</thead>

					<tbody>{!this.state.error ? books : alert}</tbody>
				</Table>
			</div>
		);
	}
}

export default App;
