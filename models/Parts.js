const { db } = require('../config/database');

const Parts = {
    getAllMobo: function() {
        return db.prepare(`
            SELECT parts.*, mobo_parts.* 
            FROM parts 
            JOIN mobo_parts ON parts.id = mobo_parts.parts_id 
            WHERE category = 'mobo'
        `).all();
    },

    getMoboBySocket(socket) {
        return db.prepare(`
            SELECT parts.*, mobo_parts.* 
            FROM parts 
            JOIN mobo_parts ON parts.id = mobo_parts.parts_id 
            WHERE mobo_parts.socket = ?
        `).all(socket);
    },

    getAllCPU: function() {
        return db.prepare(`
            SELECT parts.*, cpu_parts.* 
            FROM parts 
            JOIN cpu_parts ON parts.id = cpu_parts.parts_id 
            WHERE category = 'cpu'
        `).all();
    },

    getCPUBySocket(socket) {
        return db.prepare(`
            SELECT parts.*, cpu_parts.* 
            FROM parts 
            JOIN cpu_parts ON parts.id = cpu_parts.parts_id 
            WHERE cpu_parts.socket = ?
        `).all(socket);
    },

    getAllGPU: function() {
        return db.prepare(`
            SELECT parts.*, gpu_parts.* 
            FROM parts 
            JOIN gpu_parts ON parts.id = gpu_parts.parts_id 
            WHERE category = 'gpu'
        `).all();
    },

    getAllRAM: function() {
        return db.prepare(`
            SELECT parts.*, ram_parts.* 
            FROM parts 
            JOIN ram_parts ON parts.id = ram_parts.parts_id 
            WHERE category = 'ram'
        `).all();
    },

    getRAMbyType(ramType) {
        return db.prepare(`
            SELECT parts.*, ram_parts.* 
            FROM parts 
            JOIN ram_parts ON parts.id = ram_parts.parts_id 
            WHERE ram_parts.type = ?
        `).all(ramType);
    },

    getAllPSU: function() {
        return db.prepare(`
            SELECT parts.*, psu_parts.* 
            FROM parts 
            JOIN psu_parts ON parts.id = psu_parts.parts_id 
            WHERE category = 'psu'
        `).all();
    },

    getAllCase: function() {
        return db.prepare(`
            SELECT parts.*, case_parts.* 
            FROM parts 
            JOIN case_parts ON parts.id = case_parts.parts_id 
            WHERE category = 'case'
        `).all();
    },

    getAllCooler: function() {
        return db.prepare(`
            SELECT * FROM cooler_parts
        `).all();
    },

    createMobo(basicData, detailsData) {

    const transactionMobo = db.transaction((basic, details) => {

        const insert = db.prepare(`
            INSERT INTO parts (name, category, price, quantity, status, ecommerce_link, image_path) 
            VALUES (?, 'mobo', ?, ?, ?, ?, ?)
        `);
        const result = insert.run(
            basic.name, 
            basic.price, 
            basic.quantity, 
            basic.status,
            basic.ecommerce_link || null,
            basic.image_path || null
        );
        
        const partId = result.lastInsertRowid;
        
        const insertDetails = db.prepare(`
            INSERT INTO mobo_parts (parts_id, chipset, socket, ram_type, ram_slots, ram_max, form_factor, max_tdp) 
            VALUES (?, ?, ?, ?, ?, ?, ?, ?)
        `);
        insertDetails.run(
            partId, 
            details.chipset, 
            details.socket, 
            details.ram_type,
            details.ram_slots,
            details.ram_max,
            details.form_factor,
            details.max_tdp
        );
        
        return partId;

    })    
    return transactionMobo(basicData, detailsData)
    },

    createCPU(basicData, detailsData) {

    const transactionCPU = db.transaction((basic, details) => {

        const insert = db.prepare(`
            INSERT INTO parts (name, category, price, quantity, status, ecommerce_link, image_path) 
            VALUES (?, 'cpu', ?, ?, ?, ?, ?)
        `);
        const result = insert.run(
            basic.name, 
            basic.price, 
            basic.quantity, 
            basic.status,
            basic.ecommerce_link || null,
            basic.image_path || null
        );
        
        const partId = result.lastInsertRowid;
        
        const insertDetails = db.prepare(`
            INSERT INTO cpu_parts (parts_id, socket, cores, threads, TDP, ram_compatibility, clock_rate) 
            VALUES (?, ?, ?, ?, ?, ?, ?)
        `);

        insertDetails.run(
            partId,  
            details.socket, 
            details.cores,
            details.threads,
            details.TDP,
            details.ram_compatibility,
            details.clock_rate
        );
        
        return partId;

    })
    
    return transactionCPU(basicData, detailsData)
        
    },

    createGPU(basicData, detailsData) {
        const transactionGPU = db.transaction((basic, details) => {
            const insert = db.prepare(`
                INSERT INTO parts (name, category, price, quantity, status, ecommerce_link, image_path) 
                VALUES (?, 'gpu', ?, ?, ?, ?, ?)
            `);
            const result = insert.run(
                basic.name, 
                basic.price, 
                basic.quantity, 
                basic.status,
                basic.ecommerce_link || null,
                basic.image_path || null
            );
            
            const partId = result.lastInsertRowid;
            
            const insertDetails = db.prepare(`
                INSERT INTO gpu_parts (parts_id, tdp, psu_pins, memory, memory_type, length, gpu_clock, memory_clock, producent) 
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
            `);
            insertDetails.run(
                partId, 
                details.tdp, 
                details.psu_pins, 
                details.memory,
                details.memory_type,
                details.length,
                details.gpu_clock,
                details.memory_clock,
                details.producent
            );
            
            return partId;
        });

        return transactionGPU(basicData, detailsData);
    },

    createRAM(basicData, detailsData) {
        const transactionRAM = db.transaction((basic, details) => {
            const insert = db.prepare(`
                INSERT INTO parts (name, category, price, quantity, status, ecommerce_link, image_path)
                VALUES (?, 'ram', ?, ?, ?, ?, ?)
            `);
            const result = insert.run(
                basic.name,
                basic.price,
                basic.quantity,
                basic.status,
                basic.ecommerce_link || null,
                basic.image_path || null
            );

            const partId = result.lastInsertRowid;
            const insertDetails = db.prepare(`
                INSERT INTO ram_parts (parts_id, capacity, type, clock_rate, volt, producent)
                VALUES (?, ?, ?, ?, ?, ?)
            `);

            insertDetails.run(
                partId,
                details.capacity,
                details.type,
                details.clock_rate,
                details.volt,
                details.producent
            );
            return partId;
        });

        return transactionRAM(basicData, detailsData);
    },

    createPsu(basicData, detailsData) {
        const transactionPsu = db.transaction((basic, details) => {
            const insert = db.prepare(`
                INSERT INTO parts (name, category, price, quantity, status, ecommerce_link, image_path) 
                VALUES (?, 'psu', ?, ?, ?, ?, ?)
            `);
            const result = insert.run(
                basic.name, 
                basic.price, 
                basic.quantity, 
                basic.status,
                basic.ecommerce_link || null,
                basic.image_path || null
            );
            
            const partId = result.lastInsertRowid;
            
            const insertDetails = db.prepare(`
                INSERT INTO psu_parts (parts_id, type, max_power, producent, tier, certificate) 
                VALUES (?, ?, ?, ?, ?, ?)
            `);
            insertDetails.run(
                partId, 
                details.type, 
                details.max_power, 
                details.producent,
                details.tier,
                details.certificate
            );
            
            return partId;
        });

        return transactionPsu(basicData, detailsData);
    },

    createCase(basicData, detailsData) {
        const transactionCase = db.transaction((basic, details) => {
            const insert = db.prepare(`
                INSERT INTO parts (name, category, price, quantity, status, ecommerce_link, image_path) 
                VALUES (?, 'case', ?, ?, ?, ?, ?)
            `);
            const result = insert.run(
                basic.name, 
                basic.price, 
                basic.quantity, 
                basic.status,
                basic.ecommerce_link || null,
                basic.image_path || null
            );
            
            const partId = result.lastInsertRowid;
            
            const insertDetails = db.prepare(`
                INSERT INTO case_parts (parts_id, type, producent)
                VALUES (?, ?, ?)
            `);
            insertDetails.run(
                partId, 
                details.type, 
                details.producent
            );
            
            return partId;
        });

        return transactionCase(basicData, detailsData);
    },

    createCooler(data) {
        const insert = db.prepare(`
            INSERT INTO cooler_parts (name, fan_pins, tdp, producent)
            VALUES (?, ?, ?, ?)
        `);
        const result = insert.run(data.name, data.fan_pins, data.tdp, data.producent);
        return result.lastInsertRowid;
    },

    getAll() {
        return db.prepare("SELECT * FROM parts ORDER BY id DESC").all();
    },

    getPartDetails(id){
        const part = db.prepare('SELECT * FROM parts WHERE id = ?').get(id);
        if (!part) return null;

        const specTables = {
        cpu: 'cpu_parts',
        gpu: 'gpu_parts',
        mobo: 'mobo_parts',
        ram: 'ram_parts',
        psu: 'psu_parts',
        case: 'case_parts'
    };

    const tableName = specTables[part.category];
    if (!tableName) return part;

    const specs = db.prepare(`SELECT * FROM ${tableName} WHERE parts_id = ?`).get(id);

    return { ...part, specs };

    },

    getById(id) {
        return db.prepare("SELECT * FROM parts WHERE id = ?").get(id);
    },

    delete(id) {
        db.prepare("DELETE FROM mobo_parts WHERE parts_id = ?").run(id);
        db.prepare("DELETE FROM cpu_parts WHERE parts_id = ?").run(id);
        db.prepare("DELETE FROM gpu_parts WHERE parts_id = ?").run(id);
        db.prepare("DELETE FROM ram_parts WHERE parts_id = ?").run(id);
        db.prepare("DELETE FROM psu_parts WHERE parts_id = ?").run(id);
        db.prepare("DELETE FROM case_parts WHERE parts_id = ?").run(id);
        
        return db.prepare("DELETE FROM parts WHERE id = ?").run(id);
    },

    getUniqueSockets() {
        return db.prepare(`
            SELECT DISTINCT socket FROM mobo_parts
            UNION
            SELECT DISTINCT socket FROM cpu_parts
        `).all().map(r => r.socket);
    },

    getUniqueRamTypes() {
        return db.prepare(`
            SELECT DISTINCT ram_type as type FROM mobo_parts
            UNION
            SELECT DISTINCT type FROM ram_parts
        `).all().map(r => r.type);
    },

    updatePart(id, basicData, detailsData) {
    const transaction = db.transaction(() => {
        const part = db.prepare('SELECT category FROM parts WHERE id = ?').get(id);
        if (!part) throw new Error('Part not found: ' + id);

        db.prepare(`
            UPDATE parts SET name = ?, price = ?, quantity = ?, status = ? WHERE id = ?
        `).run(basicData.name, basicData.price, basicData.quantity, basicData.status, id);

        const specTables = {
            cpu: 'cpu_parts',
            gpu: 'gpu_parts',
            mobo: 'mobo_parts',
            ram: 'ram_parts',
            psu: 'psu_parts',
            case: 'case_parts'
        };

        const tableName = specTables[part.category];
        if (!tableName) return;

        const cols = Object.keys(detailsData);
        const setClause = cols.map(col => `${col} = ?`).join(', ');
        const values = cols.map(col => detailsData[col]);

        db.prepare(`UPDATE ${tableName} SET ${setClause} WHERE parts_id = ?`)
          .run(...values, id);
    });

    return transaction();
    }
};

module.exports = Parts;