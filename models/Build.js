const { db } = require('../config/database');

const Build = {

    getAllBuild: function() {
        return db.prepare(`SELECT * FROM drafting_projects ORDER BY id DESC`).all();
    },

    getBuildById: function(id) {
        const build = db.prepare(`SELECT * FROM drafting_projects WHERE id = ?`).get(id);
        if (!build) return null;

        const slots = db.prepare(`SELECT * FROM project_slots WHERE project_id = ?`).all(id)

        return {...build, slots}
    },

    createBuild: function(build) {
        const insert = db.prepare(`INSERT INTO drafting_projects (name, layout_data) VALUES (?, ?)`);
        const result = insert.run(build.name, build.layout_data)
        return result.lastInsertRowid;
    },

    saveBuild: function(projectId, slots) {
        const transaction = db.transaction(() => {
            db.prepare(`DELETE FROM project_slots (project_id, slot_type, part_id) VALUE (?, ?, ?)`);

            slots.array.forEach(slot => {
                insert.run(projectId, slot.slot_type, slot.part_id || null);
            });
            return projectId;
        })
        return transaction();
    },

    deleteBuild: function(id) {
        const transation = db.transaction(() => {
            db.prepare(`DELETE FROM project_slots WHERE project_id = ?`).run(id);
            db.prepare(`DELETE FROM drafting_projects WHERE id = ?`).run(id);
        })
        return transation()
    }
    
};

module.exports = Build;