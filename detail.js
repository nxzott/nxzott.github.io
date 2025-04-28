function showLoader(show = true) {
    const loader = document.getElementById('loader');
    if (!loader) return;
    loader.style.display = show ? "flex" : "none";
}

function startDownload(url, filename) {
    const a = document.createElement('a');
    a.href = url;
    a.download = filename || '';
    a.style.display = 'none';
    document.body.appendChild(a);
    a.click();
    setTimeout(() => document.body.removeChild(a), 130);
}

// Captcha generator: soal & jawaban dalam dua bahasa
function generateCaptcha() {
    // Kumpulan soal (ID dan EN)
    const types = [
        // Penjumlahan
        () => {
            const a = Math.floor(Math.random() * 20) + 5;
            const b = Math.floor(Math.random() * 10) + 2;
            return {
                question_id: `Berapa hasil dari ${a} + ${b}?`,
                question_en: `What is the result of ${a} + ${b}?`,
                answer: (a + b).toString()
            };
        },
        // Pengurangan
        () => {
            const a = Math.floor(Math.random() * 20) + 10;
            const b = Math.floor(Math.random() * 10) + 2;
            return {
                question_id: `Hasil dari ${a} - ${b}?`,
                question_en: `What is ${a} minus ${b}?`,
                answer: (a - b).toString()
            };
        },
        // Perkalian
        () => {
            const a = Math.floor(Math.random() * 7) + 2;
            const b = Math.floor(Math.random() * 6) + 2;
            return {
                question_id: `Berapakah ${a} × ${b}?`,
                question_en: `What is ${a} × ${b}?`,
                answer: (a * b).toString()
            };
        },
        // Sisa Bagi
        () => {
            const a = Math.floor(Math.random() * 35) + 10;
            const b = Math.floor(Math.random() * 5) + 2;
            return {
                question_id: `Berapakah sisa bagi dari ${a} : ${b}?`,
                question_en: `What is the remainder of ${a} divided by ${b}?`,
                answer: (a % b).toString()
            };
        },
        // Karakter ke-N dari string
        () => {
            const kata = "minecraft";
            const n = Math.floor(Math.random() * 5) + 2;
            return {
                question_id: `Tulis huruf ke-${n} dari kata '${kata}' (huruf kecil)?`,
                question_en: `Type the letter number ${n} of the word '${kata}' (lowercase)?`,
                answer: kata[n-1]
            };
        },
        // Logika sederhana
        () => ({
            question_id: "Tuliskan huruf kapital pertama dari kata 'Addon'!",
            question_en: "Type the first capital letter of the word 'Addon'!",
            answer: "A"
        }),
        // Soal pilihan logika
        () => ({
            question_id: "Jika kemarin adalah Senin, maka lusa adalah hari...",
            question_en: "If yesterday was Monday, what day is the day after tomorrow?",
            answer: "Kamis|Thursday"
        }),
        // Soal logika angka
        () => ({
            question_id: "Berapa angka setelah 17?",
            question_en: "What number comes after 17?",
            answer: "18"
        })
    ];
    const idx = Math.floor(Math.random() * types.length);
    return types[idx]();
}

// Modal captcha dengan dua bahasa
function showCaptchaModal(callback) {
    let modal = document.createElement('div');
    modal.id = "captcha-modal";
    modal.style.position = "fixed";
    modal.style.zIndex = 9999;
    modal.style.left = 0;
    modal.style.top = 0;
    modal.style.width = "100vw";
    modal.style.height = "100vh";
    modal.style.background = "rgba(21,18,28,0.88)";
    modal.style.display = "flex";
    modal.style.justifyContent = "center";
    modal.style.alignItems = "center";

    const captcha = generateCaptcha();

    modal.innerHTML = `
    <div style="background:#181825;padding:32px 20px 20px 20px;border-radius:13px;max-width:90vw;box-shadow:0 2px 22px #000a;">
        <div style="font-size:1.15em;font-weight:700;margin-bottom:15px;text-align:center;">Captcha / Verifikasi</div>
        <div style="margin-bottom:7px;text-align:center;">
            <span style="display:block;margin-bottom:2px;">${captcha.question_id}</span>
            <span style="display:block;font-size:0.95em;color:#b8b7b7;">(English: ${captcha.question_en})</span>
        </div>
        <input type="text" id="captcha-input" style="width:160px;padding:8px 10px;border-radius:6px;border:1.5px solid #23243b;background:#23243b;color:#fff;margin-bottom:12px;text-align:center;font-size:1.1em;outline:none;" autocomplete="off">
        <div style="text-align:center;">
            <button id="captcha-ok" style="margin-top:6px;padding:8px 24px;background:var(--btn-bg-hover,#28285a);color:#fff;border-radius:7px;border:none;font-weight:700;font-size:1em;cursor:pointer;">OK</button>
            <button id="captcha-cancel" style="margin-left:12px;padding:8px 20px;background:#23243b;color:#aaa;border-radius:7px;border:none;font-weight:600;font-size:1em;cursor:pointer;">Cancel</button>
        </div>
        <div id="captcha-msg" style="margin-top:10px;color:#f56;font-size:0.96em;text-align:center;display:none;"></div>
    </div>
    `;

    document.body.appendChild(modal);

    const input = modal.querySelector('#captcha-input');
    const msg = modal.querySelector('#captcha-msg');
    modal.querySelector('#captcha-ok').onclick = function() {
        const val = input.value.trim().toLowerCase();
        let valid = false;
        // Jawaban bisa lebih dari satu (dipisahkan "|", ex: Kamis|Thursday)
        if (captcha.answer.includes('|')) {
            captcha.answer.split('|').forEach(ans=>{
                if(val === ans.toLowerCase()) valid = true;
            });
        } else {
            valid = (val === captcha.answer.toLowerCase());
        }
        if (valid) {
            document.body.removeChild(modal);
            callback(true);
        } else {
            msg.style.display = "block";
            msg.textContent = "Jawaban salah! / Wrong answer!";
            input.value = "";
            input.focus();
        }
    };
    modal.querySelector('#captcha-cancel').onclick = function() {
        document.body.removeChild(modal);
        callback(false);
    };
    input.addEventListener('keydown', function(e) {
        if (e.key === "Enter") modal.querySelector('#captcha-ok').click();
    });
    setTimeout(()=>input.focus(),100);
}

function renderDetail() {
    showLoader(true);
    let detail = null;
    try {
        detail = JSON.parse(localStorage.getItem('addon-detail'));
    } catch { detail = null; }
    const container = document.getElementById('detail-container');
    if (!detail) {
        container.innerHTML = `<div style="color:#E46666;font-weight:600;font-size:1.2em;">Data not found.<br>Please return to homepage.</div>`;
        showLoader(false);
        return;
    }
    const descClean = detail.desc ? detail.desc.replace(/!\[[^\]]*\]\((.*?)\)/g, '').trim() : "";
    container.innerHTML = `
        <div class="detail-title">${detail.name}</div>
        <div class="detail-desc">${descClean ? descClean.replace(/\n/g,"<br>") : '(No description)'}</div>
        <div class="detail-download">
            <button class="detail-btn" type="button" id="downloadBtn">Download</button>
        </div>
    `;
    const btn = document.getElementById('downloadBtn');
    if (btn) {
        btn.addEventListener('click', function() {
            showCaptchaModal(function(success){
                if (success) startDownload(detail.url, detail.asset);
            });
        });
        btn.addEventListener('contextmenu', e => e.preventDefault());
    }
    showLoader(false);
}
window.onload = renderDetail;
