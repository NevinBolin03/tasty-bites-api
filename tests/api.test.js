const request = require("supertest");
const app = require("../server");

describe("Books API", () => {
  test("GET /api/books returns all books", async () => {
    const res = await request(app).get("/api/books");
    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });

  test("GET /api/books/1 returns a book", async () => {
    const res = await request(app).get("/api/books/1");
    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty("id", 1);
  });

  test("GET /api/books/999 returns 404", async () => {
    const res = await request(app).get("/api/books/999");
    expect(res.statusCode).toBe(404);
  });

  test("POST /api/books creates a new book", async () => {
    const res = await request(app).post("/api/books").send({
      title: "The Hobbit",
      author: "J.R.R. Tolkien",
      available: true,
    });
    expect(res.statusCode).toBe(201);
    expect(res.body).toHaveProperty("id");
    expect(res.body.title).toBe("The Hobbit");
  });

  test("PUT /api/books/:id updates a book", async () => {
    const created = await request(app).post("/api/books").send({
      title: "Temp",
      author: "Temp",
      available: true,
    });

    const res = await request(app).put(`/api/books/${created.body.id}`).send({
      available: false,
    });

    expect(res.statusCode).toBe(200);
    expect(res.body.available).toBe(false);
  });

  test("PUT /api/books/999 returns 404", async () => {
    const res = await request(app).put("/api/books/999").send({ title: "Nope" });
    expect(res.statusCode).toBe(404);
  });

  test("DELETE /api/books/:id deletes a book", async () => {
    const created = await request(app).post("/api/books").send({
      title: "Delete Me",
      author: "Author",
    });

    const res = await request(app).delete(`/api/books/${created.body.id}`);
    expect(res.statusCode).toBe(200);

    const after = await request(app).get(`/api/books/${created.body.id}`);
    expect(after.statusCode).toBe(404);
  });

  test("DELETE /api/books/999 returns 404", async () => {
    const res = await request(app).delete("/api/books/999");
    expect(res.statusCode).toBe(404);
  });
});