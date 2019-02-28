DROP TABLE books;

CREATE TABLE IF NOT EXISTS books (
  id SERIAL PRIMARY KEY,
  author VARCHAR(255),
  title VARCHAR(255),
  isbn VARCHAR(255),
  image_url VARCHAR(255),
  description VARCHAR(255),
  bookshelf VARCHAR(255)
);

INSERT INTO books (author, title, isbn, image_url, description, bookshelf) VALUES (
  'Liz',
  'Cat Naps',
  '123456789',
  'https://via.placeholder.com/150',
  'A book about how to take the best cat naps.',
  'self-care'
);

INSERT INTO books (author, title, isbn, image_url, description, bookshelf) VALUES (
  'Jon',
  'Cat Conversations',
  '1234567898765',
  'https://via.placeholder.com/150',
  'A book of conversations I have had with my cat.',
  'biography'
);