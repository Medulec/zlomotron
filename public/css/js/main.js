   // ============================================
    // NAWIGACJA - PRZEŁĄCZANIE ZAKŁADEK (TABS)
    // ============================================
    function showSection(sectionId, tabElement) {
        // Ukryj wszystkie sekcje
        const sections = document.querySelectorAll('.page-section');
        sections.forEach(sec => sec.classList.remove('visible'));
        
        // Pokaż wybraną sekcję
        document.getElementById(sectionId).classList.add('visible');
        
        // Zaktualizuj aktywny tab
        const tabs = document.querySelectorAll('.nav-tab');
        tabs.forEach(t => t.classList.remove('active'));
        tabElement.classList.add('active');
        
        // Scroll do góry
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }
    
    // ============================================
    // KONFIGURATOR PC - OBLICZANIE WYNIKU
    // ============================================
    function calculateScore() {
        // Pobierz wartości z selectów
        const cpu = parseInt(document.getElementById('cpu-select').value);
        const gpu = parseInt(document.getElementById('gpu-select').value);
        const ram = parseInt(document.getElementById('ram-select').value);
        const mobo = parseInt(document.getElementById('mobo-select').value);
        const cas = parseInt(document.getElementById('case-select').value);
        const psu = parseInt(document.getElementById('psu-select').value);
        
        // Oblicz sumę (max możliwe = 85+80+60+50+45+45 = 365)
        const total = cpu + gpu + ram + mobo + cas + psu;
        const maxPoints = 365;
        
        // Oblicz procent
        let percent = Math.floor((total / maxPoints) * 100);
        if (percent > 100) percent = 100;
        
        // Ustal rangę i kolor
        let rank, color;
        
        if (percent <= 10) {
            rank = "ZŁOM TOTALNY";
            color = "#666";
        } else if (percent <= 25) {
            rank = "MASZYNA DO PASJANSA";
            color = "#999";
        } else if (percent <= 40) {
            rank = "BIUROWY KOMBAJN";
            color = "#fff";
        } else if (percent <= 55) {
            rank = "MULTIMEDIALNY DOMOWY";
            color = "#4caf50";
        } else if (percent <= 70) {
            rank = "GAMER MID-RANGE";
            color = "#2196f3";
        } else if (percent <= 85) {
            rank = "ENTUZJASTA OC";
            color = "#ff9800";
        } else if (percent <= 95) {
            rank = "POWER USER";
            color = "#ff5722";
        } else {
            rank = "⚔️ ULTIMATE BATTLECRUISER ⚔️";
            color = "#f44336";
        }
        
        // Pokaż wynik
        const display = document.getElementById('result-display');
        display.style.display = 'block';
        
        // Ustaw procent
        const scoreText = document.getElementById('score-text');
        scoreText.innerText = percent + "%";
        scoreText.style.color = color;
        
        // Ustaw rangę
        const rankText = document.getElementById('rank-text');
        rankText.innerText = rank;
        rankText.style.color = color;
        rankText.style.textShadow = "0 0 10px " + color;
        
        // Animacja paska
        const bar = document.getElementById('score-bar');
        bar.style.width = "0%";
        
        // Delay dla animacji
        setTimeout(() => {
            bar.style.width = percent + "%";
            
            // Zmień kolor paska w zależności od wyniku
            if (percent > 70) {
                bar.style.background = "repeating-linear-gradient(45deg, #ff5722, #ff5722 10px, #e64a19 10px, #e64a19 20px)";
            } else if (percent > 40) {
                bar.style.background = "repeating-linear-gradient(45deg, #2196f3, #2196f3 10px, #1976d2 10px, #1976d2 20px)";
            }
        }, 100);
        
        // Easter egg dla pudełka po butach z NoName PSU
        if (cas === 0 && psu === 0) {
            setTimeout(() => {
                alert('⚠️ UWAGA! ⚠️\n\nTa konfiguracja może spowodować:\n- Pożar\n- Wybuch kondensatorów\n- Spontaniczne combustion\n\nUżywasz na własną odpowiedzialność!');
            }, 1500);
        }
    }
    
    // ============================================
    // LICZNIK - EFEKT "ODŚWIEŻANIA" CYFR
    // ============================================
    document.addEventListener('DOMContentLoaded', function() {
        const digits = document.querySelectorAll('.counter-digit');
        
        // Losowe "miganie" cyfr na starcie
        digits.forEach((digit, index) => {
            setTimeout(() => {
                digit.style.animation = 'none';
                digit.offsetHeight; // trigger reflow
                digit.style.animation = 'digit-flicker 0.15s infinite';
            }, index * 80);
        });
    });
    // ============================================
    // EASTER EGG - IDKFA (Doom cheat code)
    // ============================================
    let konamiBuffer = '';
    document.addEventListener('keypress', function(e) {
        konamiBuffer += e.key.toUpperCase();
        if (konamiBuffer.includes('IDKFA')) {
            konamiBuffer = '';
            document.body.style.filter = 'hue-rotate(180deg)';
            alert('🎮 CHEAT ACTIVATED! 🎮\n\nAll weapons unlocked!\n(Just kidding, this is a PC shop website)');
            setTimeout(() => {
                document.body.style.filter = '';
            }, 5000);
        }
        // Reset buffer if too long
        if (konamiBuffer.length > 20) {
            konamiBuffer = '';
        }
    });
    
    // ============================================
    // MATRIX RAIN EFFECT - KLASYK 2003-2006
    // ============================================
    const canvas = document.getElementById('matrix-bg');
    const ctx = canvas.getContext('2d');
    
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    
    // Znaki do wyświetlenia (katakana + cyfry + symbole)
    const chars = 'アイウエオカキクケコサシスセソタチツテトナニヌネノハヒフヘホマミムメモヤユヨラリルレロワヲン0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ<>{}[]@#$%^&*';
    const charArray = chars.split('');
    
    const fontSize = 14;
    const columns = Math.floor(canvas.width / fontSize);
    
    // Tablica Y pozycji dla każdej kolumny
    const drops = [];
    for (let i = 0; i < columns; i++) {
        drops[i] = Math.random() * -100;
    }
    
    function drawMatrix() {
        // Półprzezroczyste czarne tło - tworzy efekt "śladu"
        ctx.fillStyle = 'rgba(0, 0, 0, 0.05)';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        
        // Zielony tekst
        ctx.fillStyle = '#0f0';
        ctx.font = fontSize + 'px monospace';
        
        for (let i = 0; i < drops.length; i++) {
            // Losowy znak
            const char = charArray[Math.floor(Math.random() * charArray.length)];
            
            // Rysuj znak
            ctx.fillText(char, i * fontSize, drops[i] * fontSize);
            
            // Reset na górę po zejściu na dół + losowość
            if (drops[i] * fontSize > canvas.height && Math.random() > 0.975) {
                drops[i] = 0;
            }
            
            drops[i]++;
        }
    }
    
    // Uruchom Matrix rain
    setInterval(drawMatrix, 50);
    
    // Resize handler
    window.addEventListener('resize', function() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    });