document.addEventListener('DOMContentLoaded', () => {
    
    loadParts();
    initAddButtons();
    initModalClose();
    initSortButtons();
    console.log("Loaded")
});

// GLOBALS
let sortDirection = true;
let allParts = [];




function initAddButtons() {
    document.getElementById('filter-category').addEventListener('change', filterParts);
    document.getElementById('filter-search').addEventListener('input', filterParts);
    document.getElementById('filter-status').addEventListener('change', filterParts);
    document.getElementById('filter-price-min').addEventListener('change', filterParts);
    document.getElementById('filter-price-max').addEventListener('change', filterParts);
    document.getElementById('btn-clear-filters').addEventListener('click', resetFilters);
    document.querySelectorAll('.btn-add-stock').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const type = e.target.dataset.type;
            openAddModal(type);
        });
    });
}

function closeModal() {
    const modal = document.getElementById('component-modal');
    modal.classList.remove('active');
    modal.querySelector('.modal-window').classList.remove('modal-window--wide');
}

function initModalClose() {
    document.querySelector('.modal-close').addEventListener('click', closeModal);
    document.querySelector('.modal-backdrop').addEventListener('click', closeModal);
}

function initSortButtons() {
    const headers = document.querySelectorAll("#parts-table th")
    headers.forEach((header, index) => {
            if (index === 6) return;
            header.style.cursor = "pointer"

        header.addEventListener('click', ()=> {
            sortTable(index);
        })
    })
}

function resetFilters() {
    document.getElementById('filter-category').value = "";
    document.getElementById('filter-status').value = "";
    document.getElementById('filter-search').value = "";
    document.getElementById('filter-search').value = "";
    document.getElementById('filter-price-min').value = "";
    document.getElementById('filter-price-max').value = "";
    filterParts();
}

function sortTable(index) {
    const headers = document.querySelectorAll("#parts-table th");
    const tbody = document.getElementById("parts-tbody");
    const rows = Array.from(tbody.querySelectorAll("tr"));
    
    if (rows.length === 0) return;

    const currentHeader = headers[index];
    const isAscending = currentHeader.classList.contains("asc");
    const direction = isAscending ? "desc" : "asc";


    headers.forEach(h => h.classList.remove("asc", "desc"));
    currentHeader.classList.add(direction);

    const sortedRows = rows.sort((rowA, rowB) => {
        const cellA = rowA.children[index].innerText.trim();
        const cellB = rowB.children[index].innerText.trim();

        return direction === "asc" 
            ? cellA.localeCompare(cellB, undefined, { numeric: true }) 
            : cellB.localeCompare(cellA, undefined, { numeric: true });
    });

    sortedRows.forEach(row => tbody.appendChild(row));
}

function openAddModal(type) {
    const formHTML = generateForm(type);
    document.getElementById('modal-body').innerHTML = formHTML;
    document.getElementById('component-modal').classList.add('active');
    
    const form = document.querySelector('#modal-body form');
    form.addEventListener('submit', (e) => handleFormSubmit(e, type));
}

async function openDetailModal(id) {
    document.getElementById('modal-body').innerHTML = '<p>Ładowanie...</p>';
    const modal = document.getElementById('component-modal');
    modal.querySelector('.modal-window').classList.add('modal-window--wide');
    modal.classList.add('active');

    const html = await generateDetail(id);
    document.getElementById('modal-body').innerHTML = html;
}

function generateForm(type) {
    
    const typeNames = {
        mobo: 'Płyta główna',
        cpu:  'Procesor',
        gpu:  'Karta graficzna',
        ram:  'Pamięć RAM',
        psu:  'Zasilacz',
        case: 'Obudowa'
    };

    const basicFields = `
        <fieldset>
            <legend>Dane podstawowe</legend>

            <label>Nazwa <span class="required">*</span></label>
            <input type="text" name="name" placeholder="np. ASUS P5G41T-M LX" required>

            <div class="form-row">
                <div class="form-col">
                    <label>Cena (PLN) <span class="required">*</span></label>
                    <input type="number" name="price" placeholder="0" min="0" step="0.01" required>
                </div>
                <div class="form-col">
                    <label>Ilość <span class="required">*</span></label>
                    <input type="number" name="quantity" placeholder="1" min="0" required>
                </div>
            </div>

            <label>Status <span class="required">*</span></label>
            <select name="status" required>
                <option value="available">Dostępny</option>
                <option value="reserved">Zarezerwowany</option>
                <option value="sold">Sprzedany</option>
            </select>
        </fieldset>
    `;

    let extraFields = '';

    switch(type) {
        case 'mobo':
            extraFields = `
                <fieldset>
                    <legend>Specyfikacja MOBO</legend>

                    <div class="form-row">
                        <div class="form-col">
                            <label>Chipset <span class="required">*</span></label>
                            <input type="text" name="chipset" placeholder="np. G41" required>
                        </div>
                        <div class="form-col">
                            <label>Socket <span class="required">*</span></label>
                            <input type="text" name="socket" placeholder="np. LGA 775" required>
                        </div>
                    </div>

                    <div class="form-row">
                        <div class="form-col">
                            <label>Typ RAM <span class="required">*</span></label>
                            <input type="text" name="ram_type" placeholder="np. DDR3" required>
                        </div>
                        <div class="form-col">
                            <label>Sloty RAM <span class="required">*</span></label>
                            <input type="number" name="ram_slots" placeholder="2" min="1" required>
                        </div>
                    </div>

                    <div class="form-row">
                        <div class="form-col">
                            <label>Max RAM (GB) <span class="required">*</span></label>
                            <input type="number" name="ram_max" placeholder="8" min="1" required>
                        </div>
                        <div class="form-col">
                            <label>Max TDP (W) <span class="required">*</span></label>
                            <input type="number" name="max_tdp" placeholder="95" min="1" required>
                        </div>
                    </div>

                    <label>Form Factor <span class="required">*</span></label>
                    <input type="text" name="form_factor" placeholder="np. mATX" required>
                </fieldset>
            `;
            break;
        
        case 'cpu':
            extraFields = `
                <fieldset>
                    <legend>Specyfikacja CPU</legend>

                    <label>Socket <span class="required">*</span></label>
                    <input type="text" name="socket" placeholder="np. LGA 1155" required>

                    <div class="form-row">
                        <div class="form-col">
                            <label>Rdzenie <span class="required">*</span></label>
                            <input type="number" name="cores" placeholder="4" min="1" required>
                        </div>
                        <div class="form-col">
                            <label>Wątki <span class="required">*</span></label>
                            <input type="number" name="threads" placeholder="4" min="1" required>
                        </div>
                    </div>

                    <div class="form-row">
                        <div class="form-col">
                            <label>TDP (W) <span class="required">*</span></label>
                            <input type="number" name="TDP" placeholder="65" min="1" required>
                        </div>
                        <div class="form-col">
                            <label>Taktowanie <span class="required">*</span></label>
                            <input type="text" name="clock_rate" placeholder="np. 3.4 GHz" required>
                        </div>
                    </div>

                    <label>Kompatybilność RAM <span class="required">*</span></label>
                    <input type="text" name="ram_compatibility" placeholder="np. DDR3" required>
                </fieldset>
            `;
            break;
        
        case 'gpu':
            extraFields = `
                <fieldset>
                    <legend>Specyfikacja GPU</legend>

                    <div class="form-row">
                        <div class="form-col">
                            <label>TDP (W) <span class="required">*</span></label>
                            <input type="number" name="tdp" placeholder="75" min="1" required>
                        </div>
                        <div class="form-col">
                            <label>Zasilanie</label>
                            <select name="psu_pins">
                                <option value="">Brak (z PCI-E)</option>
                                <option value="6">6-pin</option>
                                <option value="6+2">6+2-pin</option>
                                <option value="6+6">6+6-pin</option>
                                <option value="8">8-pin</option>
                                <option value="8+6">8+6-pin</option>
                                <option value="8+8">8+8-pin</option>
                            </select>
                        </div>
                    </div>

                    <div class="form-row">
                        <div class="form-col">
                            <label>VRAM (GB) <span class="required">*</span></label>
                            <input type="number" name="memory" placeholder="2" min="1" required>
                        </div>
                        <div class="form-col">
                            <label>Typ pamięci <span class="required">*</span></label>
                            <select name="memory_type" required>
                                <option value="gddr3">GDDR3</option>
                                <option value="gddr4">GDDR4</option>
                                <option value="gddr5">GDDR5</option>
                                <option value="gddr6">GDDR6</option>
                                <option value="gddr7">GDDR7</option>
                            </select>
                        </div>
                    </div>

                    <div class="form-row">
                        <div class="form-col">
                            <label>Zegar GPU (MHz) <span class="required">*</span></label>
                            <input type="number" name="gpu_clock" placeholder="1000" min="1" required>
                        </div>
                        <div class="form-col">
                            <label>Zegar pamięci (MHz) <span class="required">*</span></label>
                            <input type="number" name="memory_clock" placeholder="1500" min="1" required>
                        </div>
                    </div>

                    <label>Długość karty (mm) <span class="required">*</span></label>
                    <input type="number" name="length" placeholder="200" min="1" required>

                    <label>Producent</label>
                    <input type="text" name="producent" placeholder="np. MSI, Gigabyte">
                </fieldset>
            `;
            break;

        case 'ram':
            extraFields = `
                <fieldset>
                    <legend>Specyfikacja RAM</legend>

                    <div class="form-row">
                        <div class="form-col">
                            <label>Pojemność (GB) <span class="required">*</span></label>
                            <input type="number" name="capacity" placeholder="4" min="1" required>
                        </div>
                        <div class="form-col">
                            <label>Typ <span class="required">*</span></label>
                            <select name="type" required>
                                <option value="ddr2">DDR2</option>
                                <option value="ddr3">DDR3</option>
                                <option value="ddr4">DDR4</option>
                                <option value="ddr5">DDR5</option>
                            </select>
                        </div>
                    </div>

                    <div class="form-row">
                        <div class="form-col">
                            <label>Taktowanie (MHz) <span class="required">*</span></label>
                            <input type="number" name="clock_rate" placeholder="1600" min="1" required>
                        </div>
                        <div class="form-col">
                            <label>Napięcie (V)</label>
                            <input type="number" name="volt" placeholder="1.50" step="0.01" min="0">
                        </div>
                    </div>

                    <label>Producent</label>
                    <input type="text" name="producent" placeholder="np. Kingston, Corsair">
                </fieldset>
            `;
            break;

        case 'psu':
            extraFields = `
                <fieldset>
                    <legend>Specyfikacja PSU</legend>

                    <div class="form-row">
                        <div class="form-col">
                            <label>Typ <span class="required">*</span></label>
                            <select name="type" required>
                                <option value="atx">ATX</option>
                                <option value="sfx">SFX</option>
                            </select>
                        </div>
                        <div class="form-col">
                            <label>Moc max (W) <span class="required">*</span></label>
                            <input type="number" name="max_power" placeholder="500" min="1" required>
                        </div>
                    </div>

                    <div class="form-row">
                        <div class="form-col">
                            <label>Tier</label>
                            <select name="tier">
                                <option value="">Nieznany</option>
                                <option value="S">S</option>
                                <option value="A">A</option>
                                <option value="B">B</option>
                                <option value="C">C</option>
                                <option value="D">D</option>
                                <option value="E">E</option>
                                <option value="F">F</option>
                            </select>
                        </div>
                        <div class="form-col">
                            <label>Certyfikat <span class="required">*</span></label>
                            <select name="certificate" required>
                                <option value="none">Brak</option>
                                <option value="plus">80+ White</option>
                                <option value="bronze">80+ Bronze</option>
                                <option value="silver">80+ Silver</option>
                                <option value="gold">80+ Gold</option>
                                <option value="platinum">80+ Platinum</option>
                            </select>
                        </div>
                    </div>

                    <label>Producent</label>
                    <input type="text" name="producent" placeholder="np. Corsair, EVGA">
                </fieldset>
            `;
            break;

        case 'case':
            extraFields = `
                <fieldset>
                    <legend>Specyfikacja obudowy</legend>

                    <label>Typ <span class="required">*</span></label>
                    <select name="type" required>
                        <option value="fulltower">Full Tower</option>
                        <option value="midtower">Mid Tower</option>
                        <option value="minitower">Mini Tower</option>
                        <option value="itx">ITX</option>
                        <option value="micro">Micro</option>
                    </select>

                    <label>Producent</label>
                    <input type="text" name="producent" placeholder="np. SilentiumPC, NZXT">
                </fieldset>
            `;
            break;
    }

    return `
        <h4>⚙ Dodaj ${typeNames[type] || type.toUpperCase()}</h4>
        <form class="modal-form">
            <input type="hidden" name="category" value="${type}">
            ${basicFields}
            ${extraFields}
            <div class="form-actions">
                <button type="button" class="modal-form-cancel">ANULUJ</button>
                <button type="submit">💾 ZAPISZ</button>
            </div>
        </form>
    `;
}

async function generateDetail(id) {
    
    const response = await fetch('/admin/inventory/details/' + id)
    const part = await response.json();
    const renderers = {
    gpu: (specs) => `
        <div class="stat-row"><span class="stat-label">VRAM</span><span class="stat-value">${specs.memory} GB</span></div>
        <div class="stat-row"><span class="stat-label">Typ pamięci</span><span class="stat-value">${specs.memory_type}</span></div>
        <div class="stat-row"><span class="stat-label">Zegar</span><span class="stat-value">${specs.gpu_clock} MHz</span></div>
        <div class="stat-row"><span class="stat-label">TDP</span><span class="stat-value">${specs.tdp} W</span></div>
        <div class="stat-row"><span class="stat-label">PSU Pins</span><span class="stat-value">${specs.psu_pins || 'Brak'}</span></div>
        <div class="stat-row"><span class="stat-label">Długość</span><span class="stat-value">${specs.length} mm</span></div>
        <div class="stat-row"><span class="stat-label">Producent</span><span class="stat-value">${specs.producent || 'Nieznany'}</span></div>
    `,
    cpu: (specs) => `
        <div class="stat-row"><span class="stat-label">Socket</span><span class="stat-value">${specs.socket || 'Brak'}</span></div>
        <div class="stat-row"><span class="stat-label">Rdzenie</span><span class="stat-value">${specs.cores}</span></div>
        <div class="stat-row"><span class="stat-label">Wątki</span><span class="stat-value">${specs.threads}</span></div>
        <div class="stat-row"><span class="stat-label">TDP</span><span class="stat-value">${specs.TDP} W</span></div>
        <div class="stat-row"><span class="stat-label">Kompatybilność RAM</span><span class="stat-value">${specs.ram_compatibility}</span></div>
        <div class="stat-row"><span class="stat-label">Zegar</span><span class="stat-value">${specs.clock_rate} MHz</span></div>
    `,
    ram: (specs) => `
        <div class="stat-row"><span class="stat-label">Pojemność</span><span class="stat-value">${specs.capacity} GB</span></div>
        <div class="stat-row"><span class="stat-label">Typ</span><span class="stat-value">${specs.type}</span></div>
        <div class="stat-row"><span class="stat-label">Zegar</span><span class="stat-value">${specs.clock_rate} MHz</span></div>
        <div class="stat-row"><span class="stat-label">Napięcie</span><span class="stat-value">${specs.volt} V</span></div>
    `,
    psu: (specs) => `
        <div class="stat-row"><span class="stat-label">Typ</span><span class="stat-value">${specs.type}</span></div>
        <div class="stat-row"><span class="stat-label">Moc max</span><span class="stat-value">${specs.max_power} W</span></div>
        <div class="stat-row"><span class="stat-label">Certyfikat</span><span class="stat-value">${specs.certificate}</span></div>
        <div class="stat-row"><span class="stat-label">Tier</span><span class="stat-value">${specs.tier || 'Nieznany'}</span></div>
        <div class="stat-row"><span class="stat-label">Producent</span><span class="stat-value">${specs.producent || 'Nieznany'}</span></div>
    `,
    mobo: (specs) => `
        <div class="stat-row"><span class="stat-label">Chipset</span><span class="stat-value">${specs.chipset}</span></div>
        <div class="stat-row"><span class="stat-label">Socket</span><span class="stat-value">${specs.socket}</span></div>
        <div class="stat-row"><span class="stat-label">Typ RAM</span><span class="stat-value">${specs.ram_type}</span></div>
        <div class="stat-row"><span class="stat-label">Sloty RAM</span><span class="stat-value">${specs.ram_slots}</span></div>
        <div class="stat-row"><span class="stat-label">Max RAM</span><span class="stat-value">${specs.ram_max} GB</span></div>
        <div class="stat-row"><span class="stat-label">Form Factor</span><span class="stat-value">${specs.form_factor}</span></div>
        <div class="stat-row"><span class="stat-label">Max TDP</span><span class="stat-value">${specs.max_tdp} W</span></div>
    `
};

const basicHTML = `
<div class="detail-section">
    <div class="detail-section-header">📋 Ogólne informacje</div>
    <div class="detail-section-body">
        <aside class="detail-id-col">
            <span class="detail-id-glow">#${part.id}</span>
        </aside>
        <div class="detail-info-col">
            <div class="detail-part-name">${part.name}</div>
            <div class="detail-rows">
                <div class="stat-row"><span class="stat-label">Kategoria</span><span class="stat-value">${part.category.toUpperCase()}</span></div>
                <div class="stat-row"><span class="stat-label">Cena</span><span class="stat-value" style="color:var(--green-neon)">${part.price} zł</span></div>
                <div class="stat-row"><span class="stat-label">Ilość</span><span class="stat-value">${part.quantity}</span></div>
                <div class="stat-row"><span class="stat-label">Status</span><span class="stat-value">${part.status}</span></div>
                <div class="stat-row"><span class="stat-label">Dodano</span><span class="stat-value" style="font-size:12px">${new Date(part.created_at).toLocaleString()}</span></div>
            </div>
        </div>
    </div>
</div>
`;

const detailHTML = `
<div class="detail-section">
    <div class="detail-section-header">🔧 Specyfikacja techniczna</div>
    <div class="detail-section-body detail-specs-body">
        ${renderers[part.category] ? renderers[part.category](part.specs) : '<p class="no-results">Brak szczegółów dla tego rekordu</p>'}
    </div>
</div>

    <div class="detail-actions">
        <button class="btn edit" onclick="editPart(${part.id})">✏️ EDYTUJ</button>
        <button class="btn delete" onclick="deletePart(${part.id})">🗑️ USUŃ</button>
    </div>
`;

    return `
        ${basicHTML}${detailHTML}
    `;
}


function filterParts() {
    
    const selectedCategory = document.getElementById('filter-category').value;
    const selectedState = document.getElementById('filter-status').value;
    const priceMin = document.getElementById('filter-price-min').value;
    const priceMax = document.getElementById('filter-price-max').value;
    let searchedPart = document.getElementById('filter-search').value.toLowerCase();

    const minPrice = priceMin ? parseFloat(priceMin) : null;
    const maxPrice = priceMax ? parseFloat(priceMax) : null;

    const filtered = allParts.filter(part => {
        const nameMatch = !searchedPart || part.name.toLowerCase().includes(searchedPart);
        const price = parseFloat(part.price);
        const minOk = minPrice === null || price >= minPrice;
        const maxOk = maxPrice === null || price <= maxPrice;

        return (!selectedState || part.status === selectedState)
            && (!selectedCategory || part.category === selectedCategory)
            && nameMatch
            && minOk
            && maxOk;
    });

    renderTable(filtered);
    updateStats(filtered);
}

async function loadParts() {
    document.getElementById('loading').style.display = 'block';
    
    try {
        const response = await fetch('/admin/inventory/list');
        allParts = await response.json();
        renderTable(allParts);
        updateStats(allParts);
        
        document.getElementById('loading').style.display = 'none';
    } catch (error) {
        console.error(error);
        document.getElementById('loading').style.display = 'none';
    }
}

function updateStats(allParts) {
    const total = allParts.length;
    const available = allParts.filter(p => p.status === 'available').length;
    const reserved = allParts.filter(p => p.status === 'reserved').length;
    const sold = allParts.filter(p => p.status === 'sold').length;

    const totalPrice = allParts.reduce((sum, part) => sum + parseFloat(part.price) * part.quantity, 0);
    const availablePrice = allParts.filter(p => p.status === 'available').reduce((sum, part) => sum + parseFloat(part.price) * part.quantity, 0);

    document.getElementById('stat-total').textContent = total;
    document.getElementById('stat-available').textContent = available;
    document.getElementById('stat-reserved').textContent = reserved;
    document.getElementById('stat-sold').textContent = sold;
    document.getElementById('stat-total-price').textContent = totalPrice.toFixed(2) + ' zł';
    document.getElementById('stat-available-price').textContent = availablePrice.toFixed(2) + ' zł';
}

// THE MOST IMPORTANT HERE IT LOADS AFTER DOM
function renderTable(parts) {
    const tbody = document.getElementById('parts-tbody');

    const categoryBadge = {
    mobo: 'category-badge mobo',
    cpu: 'category-badge cpu',
    gpu: 'category-badge gpu',
    ram: 'category-badge ram',
    psu: 'category-badge psu',
    case: 'category-badge case'
    };

    const statusBadge = {
    available: 'status-badge available',
    reserved: 'status-badge reserved',
    sold: 'status-badge sold'
    }
    
    if (parts.length === 0) {
        tbody.innerHTML = '';
        document.getElementById('no-results').style.display = 'block';
        return;
    }
    
    document.getElementById('no-results').style.display = 'none';
    
    tbody.innerHTML = parts.map(part => `
        <tr data-id="${part.id}">
            <td>${part.id}</td>
            <td>${part.name}</td>
            <td><span class="${categoryBadge[part.category] || 'badge'}">${part.category.toUpperCase()}</span></td>
            <td>${part.price} zł</td>
            <td>${part.quantity}</td>
            <td class="status-${part.status}"><span class="${statusBadge[part.status] || 'status-badge'}">${part.status.toUpperCase()}</span></td>
            <td>
                <button class="status-badge sold" onclick="deletePart(${part.id}, event)">🗑️ USUŃ</button>
            </td>
        </tr>
    `).join('');

        document.querySelectorAll('#parts-tbody tr').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const id = e.currentTarget.dataset.id;
            openDetailModal(id)
        });
    });
    
    document.querySelectorAll('.btn-delete').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const id = e.target.dataset.id;
            deletePart(id);
        });
    });
    
    document.getElementById('results-count').textContent = parts.length;
}



async function deletePart(id) {
    event.stopPropagation();

    const confirmed = confirm(`Czy na pewno chcesz usunąć część #${id}?`);
    if (!confirmed) return;

    const res = await fetch(`/admin/inventory/delete/${id}`, {
        method: 'POST'
    })
    const data = await res.json();

    await loadParts();
    closeModal();
}

async function handleFormSubmit(e, type) {
    e.preventDefault();

    const formData = new FormData(e.target);
    const data = Object.fromEntries(formData);

    data.category = type;

    try {
        const response = await fetch('/admin/inventory/add', {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify(data)

        });
        const result = await response.json();

        if (result.success) {
            closeModal();
            loadParts();
        } else {
            alert('Nie udało się dodać części.');
        }

    } catch (error) {
        console.error("[ADD] Error: ", error)
    }

}


async function editPart(id) {
    event.stopPropagation();

    document.getElementById('modal-body').innerHTML = '<p class="loading"><span class="blink">▓▓▓</span> ŁADOWANIE EDYCJI... <span class="blink">▓▓▓</span></p>';

    try {
        const response = await fetch('/admin/inventory/details/' + id);
        const part = await response.json();

        const formHTML = generateEditForm(part);
        document.getElementById('modal-body').innerHTML = formHTML;

   
        const form = document.querySelector('#modal-body form');
        form.addEventListener('submit', (e) => handleEditSubmit(e, part.id, part.category));

        
        document.querySelector('.modal-form-cancel').addEventListener('click', () => {
            openDetailModal(id);
        });

    } catch (error) {
        console.error('[EDIT] Fetch error:', error);
        document.getElementById('modal-body').innerHTML = '<p class="no-results">Błąd ładowania danych</p>';
    }
}


function generateEditForm(part) {
    const s = part.specs || {};

    const typeNames = {
        mobo: 'Płyta główna',
        cpu:  'Procesor',
        gpu:  'Karta graficzna',
        ram:  'Pamięć RAM',
        psu:  'Zasilacz',
        case: 'Obudowa'
    };

    // helper for select
    function opt(value, label, current) {
        return `<option value="${value}"${current === value ? ' selected' : ''}>${label}</option>`;
    }

    const basicFields = `
        <fieldset>
            <legend>Dane podstawowe</legend>

            <label>Nazwa <span class="required">*</span></label>
            <input type="text" name="name" value="${esc(part.name)}" required>

            <div class="form-row">
                <div class="form-col">
                    <label>Cena (PLN) <span class="required">*</span></label>
                    <input type="number" name="price" value="${part.price}" min="0" step="0.01" required>
                </div>
                <div class="form-col">
                    <label>Ilość <span class="required">*</span></label>
                    <input type="number" name="quantity" value="${part.quantity}" min="0" required>
                </div>
            </div>

            <label>Status <span class="required">*</span></label>
            <select name="status" required>
                ${opt('available', 'Dostępny', part.status)}
                ${opt('reserved', 'Zarezerwowany', part.status)}
                ${opt('sold', 'Sprzedany', part.status)}
            </select>
        </fieldset>
    `;

    let extraFields = '';

    switch (part.category) {
        case 'mobo':
            extraFields = `
                <fieldset>
                    <legend>Specyfikacja MOBO</legend>
                    <div class="form-row">
                        <div class="form-col">
                            <label>Chipset <span class="required">*</span></label>
                            <input type="text" name="chipset" value="${esc(s.chipset)}" required>
                        </div>
                        <div class="form-col">
                            <label>Socket <span class="required">*</span></label>
                            <input type="text" name="socket" value="${esc(s.socket)}" required>
                        </div>
                    </div>
                    <div class="form-row">
                        <div class="form-col">
                            <label>Typ RAM <span class="required">*</span></label>
                            <input type="text" name="ram_type" value="${esc(s.ram_type)}" required>
                        </div>
                        <div class="form-col">
                            <label>Sloty RAM <span class="required">*</span></label>
                            <input type="number" name="ram_slots" value="${s.ram_slots}" min="1" required>
                        </div>
                    </div>
                    <div class="form-row">
                        <div class="form-col">
                            <label>Max RAM (GB) <span class="required">*</span></label>
                            <input type="number" name="ram_max" value="${s.ram_max}" min="1" required>
                        </div>
                        <div class="form-col">
                            <label>Max TDP (W) <span class="required">*</span></label>
                            <input type="number" name="max_tdp" value="${s.max_tdp}" min="1" required>
                        </div>
                    </div>
                    <label>Form Factor <span class="required">*</span></label>
                    <input type="text" name="form_factor" value="${esc(s.form_factor)}" required>
                </fieldset>
            `;
            break;

        case 'cpu':
            extraFields = `
                <fieldset>
                    <legend>Specyfikacja CPU</legend>
                    <label>Socket <span class="required">*</span></label>
                    <input type="text" name="socket" value="${esc(s.socket)}" required>
                    <div class="form-row">
                        <div class="form-col">
                            <label>Rdzenie <span class="required">*</span></label>
                            <input type="number" name="cores" value="${s.cores}" min="1" required>
                        </div>
                        <div class="form-col">
                            <label>Wątki <span class="required">*</span></label>
                            <input type="number" name="threads" value="${s.threads}" min="1" required>
                        </div>
                    </div>
                    <div class="form-row">
                        <div class="form-col">
                            <label>TDP (W) <span class="required">*</span></label>
                            <input type="number" name="TDP" value="${s.TDP}" min="1" required>
                        </div>
                        <div class="form-col">
                            <label>Taktowanie <span class="required">*</span></label>
                            <input type="text" name="clock_rate" value="${esc(s.clock_rate)}" required>
                        </div>
                    </div>
                    <label>Kompatybilność RAM <span class="required">*</span></label>
                    <input type="text" name="ram_compatibility" value="${esc(s.ram_compatibility)}" required>
                </fieldset>
            `;
            break;

        case 'gpu':
            extraFields = `
                <fieldset>
                    <legend>Specyfikacja GPU</legend>
                    <div class="form-row">
                        <div class="form-col">
                            <label>TDP (W) <span class="required">*</span></label>
                            <input type="number" name="tdp" value="${s.tdp}" min="1" required>
                        </div>
                        <div class="form-col">
                            <label>Zasilanie</label>
                            <select name="psu_pins">
                                ${opt('', 'Brak (z PCI-E)', s.psu_pins || '')}
                                ${opt('6', '6-pin', s.psu_pins)}
                                ${opt('6+2', '6+2-pin', s.psu_pins)}
                                ${opt('6+6', '6+6-pin', s.psu_pins)}
                                ${opt('8', '8-pin', s.psu_pins)}
                                ${opt('8+6', '8+6-pin', s.psu_pins)}
                                ${opt('8+8', '8+8-pin', s.psu_pins)}
                            </select>
                        </div>
                    </div>
                    <div class="form-row">
                        <div class="form-col">
                            <label>VRAM (GB) <span class="required">*</span></label>
                            <input type="number" name="memory" value="${s.memory}" min="1" required>
                        </div>
                        <div class="form-col">
                            <label>Typ pamięci <span class="required">*</span></label>
                            <select name="memory_type" required>
                                ${opt('gddr3', 'GDDR3', s.memory_type)}
                                ${opt('gddr4', 'GDDR4', s.memory_type)}
                                ${opt('gddr5', 'GDDR5', s.memory_type)}
                                ${opt('gddr6', 'GDDR6', s.memory_type)}
                                ${opt('gddr7', 'GDDR7', s.memory_type)}
                            </select>
                        </div>
                    </div>
                    <div class="form-row">
                        <div class="form-col">
                            <label>Zegar GPU (MHz) <span class="required">*</span></label>
                            <input type="number" name="gpu_clock" value="${s.gpu_clock}" min="1" required>
                        </div>
                        <div class="form-col">
                            <label>Zegar pamięci (MHz) <span class="required">*</span></label>
                            <input type="number" name="memory_clock" value="${s.memory_clock}" min="1" required>
                        </div>
                    </div>
                    <label>Długość karty (mm) <span class="required">*</span></label>
                    <input type="number" name="length" value="${s.length}" min="1" required>
                    <label>Producent</label>
                    <input type="text" name="producent" value="${esc(s.producent)}">
                </fieldset>
            `;
            break;

        case 'ram':
            extraFields = `
                <fieldset>
                    <legend>Specyfikacja RAM</legend>
                    <div class="form-row">
                        <div class="form-col">
                            <label>Pojemność (GB) <span class="required">*</span></label>
                            <input type="number" name="capacity" value="${s.capacity}" min="1" required>
                        </div>
                        <div class="form-col">
                            <label>Typ <span class="required">*</span></label>
                            <select name="type" required>
                                ${opt('ddr2', 'DDR2', s.type)}
                                ${opt('ddr3', 'DDR3', s.type)}
                                ${opt('ddr4', 'DDR4', s.type)}
                                ${opt('ddr5', 'DDR5', s.type)}
                            </select>
                        </div>
                    </div>
                    <div class="form-row">
                        <div class="form-col">
                            <label>Taktowanie (MHz) <span class="required">*</span></label>
                            <input type="number" name="clock_rate" value="${s.clock_rate}" min="1" required>
                        </div>
                        <div class="form-col">
                            <label>Napięcie (V)</label>
                            <input type="number" name="volt" value="${s.volt || ''}" step="0.01" min="0">
                        </div>
                    </div>
                    <label>Producent</label>
                    <input type="text" name="producent" value="${esc(s.producent)}">
                </fieldset>
            `;
            break;

        case 'psu':
            extraFields = `
                <fieldset>
                    <legend>Specyfikacja PSU</legend>
                    <div class="form-row">
                        <div class="form-col">
                            <label>Typ <span class="required">*</span></label>
                            <select name="type" required>
                                ${opt('atx', 'ATX', s.type)}
                                ${opt('sfx', 'SFX', s.type)}
                            </select>
                        </div>
                        <div class="form-col">
                            <label>Moc max (W) <span class="required">*</span></label>
                            <input type="number" name="max_power" value="${s.max_power}" min="1" required>
                        </div>
                    </div>
                    <div class="form-row">
                        <div class="form-col">
                            <label>Tier</label>
                            <select name="tier">
                                ${opt('', 'Nieznany', s.tier || '')}
                                ${opt('S', 'S', s.tier)}
                                ${opt('A', 'A', s.tier)}
                                ${opt('B', 'B', s.tier)}
                                ${opt('C', 'C', s.tier)}
                                ${opt('D', 'D', s.tier)}
                                ${opt('E', 'E', s.tier)}
                                ${opt('F', 'F', s.tier)}
                            </select>
                        </div>
                        <div class="form-col">
                            <label>Certyfikat <span class="required">*</span></label>
                            <select name="certificate" required>
                                ${opt('none', 'Brak', s.certificate)}
                                ${opt('plus', '80+ White', s.certificate)}
                                ${opt('bronze', '80+ Bronze', s.certificate)}
                                ${opt('silver', '80+ Silver', s.certificate)}
                                ${opt('gold', '80+ Gold', s.certificate)}
                                ${opt('platinum', '80+ Platinum', s.certificate)}
                            </select>
                        </div>
                    </div>
                    <label>Producent</label>
                    <input type="text" name="producent" value="${esc(s.producent)}">
                </fieldset>
            `;
            break;

        case 'case':
            extraFields = `
                <fieldset>
                    <legend>Specyfikacja obudowy</legend>
                    <label>Typ <span class="required">*</span></label>
                    <select name="type" required>
                        ${opt('fulltower', 'Full Tower', s.type)}
                        ${opt('midtower', 'Mid Tower', s.type)}
                        ${opt('minitower', 'Mini Tower', s.type)}
                        ${opt('itx', 'ITX', s.type)}
                        ${opt('micro', 'Micro', s.type)}
                    </select>
                    <label>Producent</label>
                    <input type="text" name="producent" value="${esc(s.producent)}">
                </fieldset>
            `;
            break;
    }

    return `
        <h4>✏️ Edytuj ${typeNames[part.category] || part.category.toUpperCase()} — #${part.id}</h4>
        <form class="modal-form">
            <input type="hidden" name="category" value="${part.category}">
            ${basicFields}
            ${extraFields}
            <div class="form-actions">
                <button type="button" class="modal-form-cancel">↩ WRÓĆ</button>
                <button type="submit">💾 ZAPISZ ZMIANY</button>
            </div>
        </form>
    `;
}

function esc(val) {
    if (val == null) return '';
    return String(val)
        .replace(/&/g, '&amp;')
        .replace(/"/g, '&quot;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;');
}


async function handleEditSubmit(e, id, category) {
    e.preventDefault();

    const formData = new FormData(e.target);
    const data = Object.fromEntries(formData);
    data.category = category;

    e.target.classList.add('form-loading');

    try {
        const response = await fetch('/admin/inventory/edit/' + id, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        });
        const result = await response.json();

        if (result.success) {
            // odśwież tabelę i wróć do widoku detail
            await loadParts();
            openDetailModal(id);
        } else {
            e.target.classList.remove('form-loading');
            alert('Nie udało się zapisać zmian: ' + (result.error || 'Nieznany błąd'));
        }
    } catch (error) {
        e.target.classList.remove('form-loading');
        console.error('[EDIT] Submit error:', error);
        alert('Błąd połączenia z serwerem.');
    }
}