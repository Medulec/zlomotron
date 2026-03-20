const Database = require('better-sqlite3');
const db = new Database('./database/site.db');

db.exec(`
  PRAGMA foreign_keys = ON;

  CREATE TABLE IF NOT EXISTS mobo_parts (
    parts_id INTEGER PRIMARY KEY REFERENCES parts(id),
    chipset TEXT NOT NULL,
    socket TEXT NOT NULL,
    ram_type TEXT NOT NULL CHECK (ram_type IN ('ddr2', 'ddr3', 'ddr4', 'ddr5')),
    ram_slots INTEGER NOT NULL,
    ram_max INTEGER NOT NULL,
    form_factor TEXT NOT NULL CHECK (form_factor IN ('atx', 'matx', 'itx', 'eatx', 'server')),
    max_tdp INTEGER NOT NULL
  );

    CREATE TABLE IF NOT EXISTS cpu_parts (
    parts_id INTEGER PRIMARY KEY REFERENCES parts(id),
    socket TEXT NOT NULL,
    cores INTEGER NOT NULL,
    threads INTEGER NOT NULL,
    TDP INTEGER NOT NULL,
    ram_compatibility TEXT NOT NULL CHECK (ram_compatibility IN ('ddr2', 'ddr3', 'ddr4', 'ddr5')),
    clock_rate FLOAT NOT NULL
  );

    CREATE TABLE IF NOT EXISTS gpu_parts (
    parts_id INTEGER PRIMARY KEY REFERENCES parts(id),
    tdp INTEGER NOT NULL,
    psu_pins TEXT CHECK (psu_pins IN ('6', '6+2', '6+6', '8', '8+8', '8+6')),
    memory INTEGER NOT NULL,
    memory_type TEXT NOT NULL CHECK (memory_type IN ('gddr2', 'gddr3', 'gddr4', 'gddr5', 'gddr6', 'gddr7')),
    length INTEGER NOT NULL,
    gpu_clock INTEGER NOT NULL,
    memory_clock INTEGER NOT NULL,
    producent TEXT
  );

    CREATE TABLE IF NOT EXISTS ram_parts (
    parts_id INTEGER PRIMARY KEY REFERENCES parts(id),
    capacity INTEGER NOT NULL,
    type TEXT NOT NULL CHECK (type IN ('ddr2', 'ddr3', 'ddr4', 'ddr5')),
    clock_rate INTEGER NOT NULL,
    volt FLOAT,
    producent TEXT
  );

    CREATE TABLE IF NOT EXISTS psu_parts (
    parts_id INTEGER PRIMARY KEY REFERENCES parts(id),
    type TEXT NOT NULL CHECK (type IN ('atx', 'sfx')),
    max_power INTEGER NOT NULL,
    producent TEXT,
    tier TEXT CHECK (tier IN ('S', 'A', 'B', 'C', 'D', 'E', 'F')),
    certificate TEXT NOT NULL CHECK (certificate IN ('none', 'plus', 'bronze', 'silver', 'gold', 'platinum'))
  );

    CREATE TABLE IF NOT EXISTS case_parts (
    parts_id INTEGER PRIMARY KEY REFERENCES parts(id),
    type TEXT NOT NULL CHECK (type IN ('fulltower', 'midtower', 'minitower', 'itx', 'micro')),
    producent TEXT
  );

    CREATE TABLE IF NOT EXISTS cooler_parts (
    id INTEGER PRIMARY KEY,
    name TEXT NOT NULL,
    fan_pins TEXT CHECK (fan_pins IN ('3pin', '2pin', '4pin', '5pin')),
    tdp INTEGER NOT NULL,
    producent TEXT
  );

  CREATE TABLE IF NOT EXISTS drafting_projects (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  layout_data TEXT NOT NULL  -- JSON z pozycjami części na canvasie
);

CREATE TABLE IF NOT EXISTS project_slots (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  project_id INTEGER NOT NULL,
  slot_type TEXT NOT NULL CHECK (slot_type IN ('mobo', 'cpu', 'gpu', 'ram', 'psu', 'case', 'cooler')),
  part_id INTEGER NOT NULL,
  FOREIGN KEY (project_id) REFERENCES drafting_projects(id),
  FOREIGN KEY (part_id) REFERENCES parts(id)
);

`);

console.log('Dodano kolumny');
db.close();