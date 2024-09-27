CREATE DATABASE IF NOT EXISTS inventario_mia;
USE inventario_mia;
SELECT * FROM items;
SELECT * FROM inventario_2;

CREATE TABLE items (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(255) NOT NULL,
    descripcion TEXT,
    precio DECIMAL(10, 2),
    cantidad INT
);

USE inventory_db;
SELECT * FROM items;

