const Database = require('better-sqlite3');
const path = require('path');

const dbPath = path.join(__dirname, '../database/site.db');
const db = new Database(dbPath);


db.pragma('foreign_keys = ON');

function initDatabase() {
db.exec(`CREATE TABLE IF NOT EXISTS pages (id INTEGER PRIMARY KEY AUTOINCREMENT, slug VARCHAR(100) UNIQUE NOT NULL, title VARCHAR(200) NOT NULL, content TEXT, excerpt TEXT, featured_image TEXT, tags TEXT, views INTEGER DEFAULT 0, public INTEGER DEFAULT 0, menu_order INTEGER NULL, created_at DATETIME DEFAULT CURRENT_TIMESTAMP, modified_at DATETIME NULL)`);

db.exec(`CREATE TABLE IF NOT EXISTS projects (id INTEGER PRIMARY KEY AUTOINCREMENT, slug VARCHAR(100) UNIQUE NOT NULL, title VARCHAR(200) NOT NULL, description TEXT, cpu VARCHAR(100), gpu VARCHAR(100), ram VARCHAR(100), storage VARCHAR(100), mobo VARCHAR(100), otherSpects TEXT, status VARCHAR(50) DEFAULT 'planning', featured INTEGER DEFAULT 0, thumbnail VARCHAR(200), created_at DATETIME DEFAULT CURRENT_TIMESTAMP, modified_at DATETIME NULL, CHECK (status IN ('planning', 'in_progress', 'complete')))`);

db.exec(`CREATE TABLE IF NOT EXISTS project_images (id INTEGER PRIMARY KEY AUTOINCREMENT, project_id INTEGER NOT NULL, image_path VARCHAR(255) NOT NULL, caption VARCHAR(255), sort_order INTEGER DEFAULT 0, FOREIGN KEY (project_id) REFERENCES projects(id) ON DELETE CASCADE)`);

db.exec(`CREATE TABLE IF NOT EXISTS parts (id INTEGER PRIMARY KEY AUTOINCREMENT, name VARCHAR(200) NOT NULL, category VARCHAR(20) NOT NULL, socket VARCHAR(50), points INTEGER DEFAULT 0, quantity INTEGER DEFAULT 0, price DECIMAL(10,2), ecommerce_link VARCHAR(500), status VARCHAR(20) DEFAULT 'available', image_path VARCHAR(255), created_at DATETIME DEFAULT CURRENT_TIMESTAMP, CHECK (category IN ('cpu', 'gpu', 'mobo', 'ram', 'case', 'psu', 'other')), CHECK (status IN ('available', 'sold', 'reserved')))`);

db.exec(`CREATE TABLE IF NOT EXISTS guestbook (id INTEGER PRIMARY KEY AUTOINCREMENT, nickname VARCHAR(100) UNIQUE NOT NULL, message TEXT NOT NULL, created_at DATETIME DEFAULT CURRENT_TIMESTAMP, ip_address VARCHAR(45) NOT NULL)`);

db.exec(`CREATE TABLE IF NOT EXISTS visits (id INTEGER PRIMARY KEY AUTOINCREMENT, date DATE NOT NULL, count INTEGER DEFAULT 0)`);

db.exec(`PRAGMA foreign_keys = ON;

CREATE TABLE IF NOT EXISTS mobo_parts (parts_id INTEGER PRIMARY KEY REFERENCES parts(id), chipset TEXT NOT NULL, socket TEXT NOT NULL, ram_type TEXT NOT NULL CHECK (ram_type IN ('ddr2', 'ddr3', 'ddr4', 'ddr5')), ram_slots INTEGER NOT NULL, ram_max INTEGER NOT NULL, form_factor TEXT NOT NULL CHECK (form_factor IN ('atx', 'matx', 'itx', 'eatx', 'server')), max_tdp INTEGER NOT NULL);

CREATE TABLE IF NOT EXISTS cpu_parts (parts_id INTEGER PRIMARY KEY REFERENCES parts(id), socket TEXT NOT NULL, cores INTEGER NOT NULL, threads INTEGER NOT NULL, TDP INTEGER NOT NULL, ram_compatibility TEXT NOT NULL CHECK (ram_compatibility IN ('ddr2', 'ddr3', 'ddr4', 'ddr5')), clock_rate FLOAT NOT NULL);

CREATE TABLE IF NOT EXISTS gpu_parts (parts_id INTEGER PRIMARY KEY REFERENCES parts(id), tdp INTEGER NOT NULL, psu_pins TEXT CHECK (psu_pins IN ('6', '6+2', '6+6', '8', '8+8', '8+6')), memory INTEGER NOT NULL, memory_type TEXT NOT NULL CHECK (memory_type IN ('gddr2', 'gddr3', 'gddr4', 'gddr5', 'gddr6', 'gddr7')), length INTEGER NOT NULL, gpu_clock INTEGER NOT NULL, memory_clock INTEGER NOT NULL, producent TEXT);

CREATE TABLE IF NOT EXISTS ram_parts (parts_id INTEGER PRIMARY KEY REFERENCES parts(id), capacity INTEGER NOT NULL, type TEXT NOT NULL CHECK (type IN ('ddr2', 'ddr3', 'ddr4', 'ddr5')), clock_rate INTEGER NOT NULL, volt FLOAT, producent TEXT);

CREATE TABLE IF NOT EXISTS psu_parts (parts_id INTEGER PRIMARY KEY REFERENCES parts(id), type TEXT NOT NULL CHECK (type IN ('atx', 'sfx')), max_power INTEGER NOT NULL, producent TEXT, tier TEXT CHECK (tier IN ('S', 'A', 'B', 'C', 'D', 'E', 'F')), certificate TEXT NOT NULL CHECK (certificate IN ('none', 'plus', 'bronze', 'silver', 'gold', 'platinum')));

CREATE TABLE IF NOT EXISTS case_parts (parts_id INTEGER PRIMARY KEY REFERENCES parts(id), type TEXT NOT NULL CHECK (type IN ('fulltower', 'midtower', 'minitower', 'itx', 'micro')), producent TEXT);

CREATE TABLE IF NOT EXISTS cooler_parts (id INTEGER PRIMARY KEY, name TEXT NOT NULL, fan_pins TEXT CHECK (fan_pins IN ('3pin', '2pin', '4pin', '5pin')), tdp INTEGER NOT NULL, producent TEXT);

CREATE TABLE IF NOT EXISTS drafting_projects (id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT NOT NULL, created_at DATETIME DEFAULT CURRENT_TIMESTAMP, updated_at DATETIME DEFAULT CURRENT_TIMESTAMP, layout_data TEXT NOT NULL);

CREATE TABLE IF NOT EXISTS project_slots (id INTEGER PRIMARY KEY AUTOINCREMENT, project_id INTEGER NOT NULL, slot_type TEXT NOT NULL CHECK (slot_type IN ('mobo', 'cpu', 'gpu', 'ram', 'psu', 'case', 'cooler')), part_id INTEGER, FOREIGN KEY (project_id) REFERENCES drafting_projects(id), FOREIGN KEY (part_id) REFERENCES parts(id));
`);

db.exec('')
}

module.exports = { db, initDatabase };
