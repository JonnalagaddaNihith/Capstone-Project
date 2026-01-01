CREATE DATABASE IF NOT EXISTS rental_system_database;
-- DROP DATABASE rental_system_data_base;
USE rental_system_database;

-- 1. Users Table (Handles registration for Owners and Tenants)
CREATE TABLE Users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    role ENUM('owner', 'tenant', 'admin') NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
SELECT * FROM Users;
DROP TABLE Users;
-- 2. Properties Table
CREATE TABLE Properties (
    id INT AUTO_INCREMENT PRIMARY KEY,
    owner_id INT NOT NULL,
    title VARCHAR(255) NOT NULL,
    property_description TEXT,
    rent_per_day DECIMAL(10, 2) NOT NULL CHECK (rent_per_day > 0),
    location VARCHAR(255) NOT NULL,
    amenities TEXT,
    photo1 LONGBLOB,
    photo2 LONGBLOB,
    photo3 LONGBLOB,
    photo4 LONGBLOB,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (owner_id) REFERENCES Users(id) ON DELETE CASCADE
);
SELECT * FROM Properties;
DROP TABLE Properties;
SHOW VARIABLES LIKE 'secure_file_priv';
-- 3. Bookings Table
CREATE TABLE Bookings (
    id INT AUTO_INCREMENT PRIMARY KEY,
    property_id INT NOT NULL,
    tenant_id INT NOT NULL,
    check_in DATETIME NOT NULL,
    check_out DATETIME NOT NULL,
    status ENUM('Pending', 'Approved', 'Rejected') DEFAULT 'Pending',
    request_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (property_id) REFERENCES Properties(id) ON DELETE CASCADE,
    FOREIGN KEY (tenant_id) REFERENCES Users(id) ON DELETE CASCADE
);
SELECT * FROM Bookings;
DROP TABLE Bookings;
