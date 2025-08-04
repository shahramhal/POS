-- create table menu_categories(
-- id serial Primary key ,
-- name varchar(100)
-- )
-- select * from order_items

-- alter table users
-- add column role VARCHAR(20) CHECK (role IN ('admin', 'waiter', 'kitchen') );
-- update users 
-- set role='waiter'
-- where email= 'victor@example.com';
-- alter table users 
-- alter column role set not null;
-- alter table users 
-- add column  created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP;
-- CREATE TABLE item_modifiers (
--     id SERIAL PRIMARY KEY,
--     name VARCHAR(100) NOT NULL
-- );
-- CREATE TABLE menu_item_modifiers (
--     menu_item_id INT REFERENCES menu_items(id) ON DELETE CASCADE,
--     modifier_id INT REFERENCES item_modifiers(id) ON DELETE CASCADE,
--     PRIMARY KEY (menu_item_id, modifier_id)
-- );
-- alter table orders 
-- add column status VARCHAR(20) CHECK (status IN ('open', 'sent', 'completed', 'paid')) DEFAULT 'open';
-- alter table order_items 
-- add column comment TEXT;
-- CREATE TABLE order_item_modifiers (
--     order_item_id INT REFERENCES order_items(id) ON DELETE CASCADE,
--     modifier_id INT REFERENCES item_modifiers(id),
--     PRIMARY KEY (order_item_id, modifier_id)
-- );
CREATE TABLE payments (
    id SERIAL PRIMARY KEY,
    order_id INT REFERENCES orders(id) UNIQUE,
    payment_type VARCHAR(20) CHECK (payment_type IN ('cash', 'card', 'other')) NOT NULL,
    paid_amount NUMERIC(10, 2) NOT NULL,
    paid_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);