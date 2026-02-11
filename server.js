// server.js
const express = require("express");

const app = express();
app.use(express.json());

// In-memory books list
let books = [
  { id: 1, title: "Dune", author: "Frank Herbert", available: true },
  { id: 2, title: "1984", author: "George Orwell", available: false },
];

// GET /api/books - all books
app.get("/api/books", (req, res) => {
  res.json(books);
});

// GET /api/books/:id - book by id
app.get("/api/books/:id", (req, res) => {
  const id = parseInt(req.params.id);
  const book = books.find((b) => b.id === id);

  if (!book) return res.status(404).json({ error: "Book not found" });
  res.json(book);
});

// POST /api/books - create book
app.post("/api/books", (req, res) => {
  const { title, author, available } = req.body;

  if (!title || !author) {
    return res.status(400).json({ error: "title and author are required" });
  }

  const newBook = {
    id: books.length ? Math.max(...books.map((b) => b.id)) + 1 : 1,
    title,
    author,
    available: available ?? true,
  };

  books.push(newBook);
  res.status(201).json(newBook);
});

// PUT /api/books/:id - update book
app.put("/api/books/:id", (req, res) => {
  const id = parseInt(req.params.id);
  const book = books.find((b) => b.id === id);

  if (!book) return res.status(404).json({ error: "Book not found" });

  const { title, author, available } = req.body;

  if (title !== undefined) book.title = title;
  if (author !== undefined) book.author = author;
  if (available !== undefined) book.available = available;

  res.json(book);
});

// DELETE /api/books/:id - delete book
app.delete("/api/books/:id", (req, res) => {
  const id = parseInt(req.params.id);
  const index = books.findIndex((b) => b.id === id);

  if (index === -1) return res.status(404).json({ error: "Book not found" });

  const removed = books.splice(index, 1)[0];
  res.json(removed);
});

// Export app for Supertest
module.exports = app;

// Only start server when running `npm start`
if (require.main === module) {
  const PORT = 3000;
  app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
}