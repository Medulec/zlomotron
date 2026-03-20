const express = require('express');
const router = express.Router();
const auth = require('../../middleware/auth');
const Parts = require('../../models/Parts');

// GET - wyświetl stronę inventory
router.get('/', auth, (req, res) => { 
    res.render('admin/inventory', {
        title: "INWENTARYZACJA",
        layout: 'admin/admin-lay'
    });
});


router.get('/list', auth, (req, res) => {
    const parts = Parts.getAll();
    res.json(parts);
});

router.get('/details/:id', auth, (req, res) => {
    const id = req.params.id
    const part = Parts.getPartDetails(id)
    res.json(part)
});


router.post('/edit/:id', auth, (req, res) => {
    try {
        const id = req.params.id;
        const category = req.body.category;

        const basicData = {
            name: req.body.name,
            price: req.body.price,
            quantity: req.body.quantity,
            status: req.body.status
        };

        let detailsData = {};

        switch (category) {
            case 'cpu':
                detailsData = {
                    socket: req.body.socket,
                    cores: req.body.cores,
                    threads: req.body.threads,
                    TDP: req.body.TDP,
                    ram_compatibility: req.body.ram_compatibility,
                    clock_rate: req.body.clock_rate
                };
                break;

            case 'mobo':
                detailsData = {
                    chipset: req.body.chipset,
                    socket: req.body.socket,
                    ram_type: req.body.ram_type,
                    ram_slots: req.body.ram_slots,
                    ram_max: req.body.ram_max,
                    form_factor: req.body.form_factor,
                    max_tdp: req.body.max_tdp
                };
                break;

            case 'gpu':
                detailsData = {
                    tdp: req.body.tdp,
                    psu_pins: req.body.psu_pins,
                    memory: req.body.memory,
                    memory_type: req.body.memory_type,
                    length: req.body.length,
                    gpu_clock: req.body.gpu_clock,
                    memory_clock: req.body.memory_clock,
                    producent: req.body.producent
                };
                break;

            case 'ram':
                detailsData = {
                    capacity: req.body.capacity,
                    type: req.body.type,
                    clock_rate: req.body.clock_rate,
                    volt: req.body.volt,
                    producent: req.body.producent
                };
                break;

            case 'psu':
                detailsData = {
                    type: req.body.type,
                    max_power: req.body.max_power,
                    producent: req.body.producent,
                    tier: req.body.tier,
                    certificate: req.body.certificate
                };
                break;

            case 'case':
                detailsData = {
                    type: req.body.type,
                    producent: req.body.producent
                };
                break;

            default:
                return res.status(400).json({ success: false, error: 'Nieznana kategoria: ' + category });
        }

        Parts.updatePart(id, basicData, detailsData);
        res.json({ success: true, id: id });

    } catch (error) {
        console.error('[EDIT] Error:', error);
        res.status(500).json({ success: false, error: error.message });
    }
});

router.post('/add', auth, (req, res) => {
    try {
        const category = req.body.category;

        const basicData = {
            name: req.body.name,
            price: req.body.price,
            quantity: req.body.quantity,
            status: req.body.status,
            ecommerce_link: null,
            image_path: null
        }
        let detailsData = {};
        let partID;

        switch(category) {
            case 'cpu':
                detailsData = {
                    socket: req.body.socket,
                    cores: req.body.cores,
                    threads: req.body.threads,
                    TDP: req.body.TDP,
                    ram_compatibility: req.body.ram_compatibility,
                    clock_rate: req.body.clock_rate
                };
                partID = Parts.createCPU(basicData, detailsData)
                break;

            case 'mobo':
                detailsData = {
                    chipset: req.body.chipset,
                    socket: req.body.socket,
                    ram_type:req.body.ram_type,
                    ram_slots: req.body.ram_slots,
                    ram_max: req.body.ram_max,
                    form_factor: req.body.form_factor,
                    max_tdp: req.body.max_tdp
                }
                partID = Parts.createMobo(basicData, detailsData)
                break;

            case 'gpu':
                detailsData = {
                    tdp: req.body.tdp,
                    psu_pins: req.body.psu_pins,
                    memory: req.body.memory,
                    memory_type: req.body.memory_type,
                    length: req.body.length,
                    gpu_clock: req.body.gpu_clock,
                    memory_clock: req.body.memory_clock,
                    producent: req.body.producent
                };
                partID = Parts.createGPU(basicData, detailsData);
                break;

            case 'ram':
                detailsData = {
                    capacity: req.body.capacity,
                    type: req.body.type,
                    clock_rate: req.body.clock_rate,
                    volt: req.body.volt,
                    producent: req.body.producent
                };
                partID = Parts.createRAM(basicData, detailsData);
                break;

            case 'psu':
                detailsData = {
                    type: req.body.type,
                    max_power: req.body.max_power,
                    producent: req.body.producent,
                    tier: req.body.tier,
                    certificate: req.body.certificate
                };
                partID = Parts.createPsu(basicData, detailsData);
                break;

            case 'case':
                detailsData = {
                    type: req.body.type,
                    producent: req.body.producent
                };
                partID = Parts.createCase(basicData, detailsData);
                break;

    }

        if (!partID) {
            return res.status(500).json({ success: false, error: 'Pozycja nie została dodana' });
            } else {
            res.json({success: true, id: partID})
            }
    
    
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, error: error.message });
    }

})

router.post('/delete/:id', auth, (req, res) => {
    const id = req.params.id
    Parts.delete(id)
    res.json({success: true, id: id})
});



module.exports = router;