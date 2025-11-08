-- products table
CREATE TABLE IF NOT EXISTS products (
  id INTEGER PRIMARY KEY,
  name TEXT NOT NULL,
  price REAL NOT NULL,
  description TEXT,
  image TEXT
);

-- cart table
CREATE TABLE IF NOT EXISTS cart (
  id INTEGER PRIMARY KEY,
  productId INTEGER NOT NULL,
  qty INTEGER NOT NULL,
  createdAt TEXT DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY(productId) REFERENCES products(id)
);

-- insert sample products with image URLs
INSERT INTO products (id, name, price, description, image)
SELECT 1, 'Classic T-Shirt', 299.00, 'Comfortable cotton tee',
'https://images.pexels.com/photos/10026491/pexels-photo-10026491.jpeg?auto=compress&cs=tinysrgb&w=600'
WHERE NOT EXISTS (SELECT 1 FROM products WHERE id = 1);

INSERT INTO products (id, name, price, description, image)
SELECT 2, 'Running Shoes', 1299.00, 'Lightweight running shoes',
'https://images.pexels.com/photos/19090/pexels-photo.jpg?auto=compress&cs=tinysrgb&w=600'
WHERE NOT EXISTS (SELECT 1 FROM products WHERE id = 2);

INSERT INTO products (id, name, price, description, image)
SELECT 3, 'Denim Jeans', 999.00, 'Blue slim-fit jeans',
'https://images.pexels.com/photos/428340/pexels-photo-428340.jpeg?auto=compress&cs=tinysrgb&w=600'
WHERE NOT EXISTS (SELECT 1 FROM products WHERE id = 3);

INSERT INTO products (id, name, price, description, image)
SELECT 4, 'Sunglasses', 499.00, 'UV protection stylish glasses',
'https://images.pexels.com/photos/46710/pexels-photo-46710.jpeg?auto=compress&cs=tinysrgb&w=600'
WHERE NOT EXISTS (SELECT 1 FROM products WHERE id = 4);

INSERT INTO products (id, name, price, description, image)
SELECT 5, 'Backpack', 1599.00, 'Water-resistant 20L bag',
'https://images.pexels.com/photos/374726/pexels-photo-374726.jpeg?auto=compress&cs=tinysrgb&w=600'
WHERE NOT EXISTS (SELECT 1 FROM products WHERE id = 5);
