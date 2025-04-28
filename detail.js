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
            <button class="detail-btn" id="showCaptchaBtn" type="button" style="margin-bottom:12px;">Verify</button>
            <div id="turnstile-container" style="margin-bottom:16px;display:none;"></div>
            <button class="detail-btn" type="button" id="downloadBtn" style="display:none;">Download</button>
        </div>
    `;

    const siteKey = "0x4AAAAAABV0BzZCFKxhh9mb"; // <--- Ganti dengan site key Turnstile milikmu!
    const showCaptchaBtn = document.getElementById('showCaptchaBtn');
    const turnstileContainer = document.getElementById('turnstile-container');
    const downloadBtn = document.getElementById('downloadBtn');

    let widgetDiv = null;

    showCaptchaBtn.addEventListener('click', function() {
        // Sembunyikan tombol verify
        showCaptchaBtn.style.display = "none";
        // Tampilkan container captcha
        turnstileContainer.style.display = "block";
        // Hapus widget lama jika ada (supaya render baru selalu berhasil)
        turnstileContainer.innerHTML = "";
        // Render widget
        widgetDiv = document.createElement('div');
        widgetDiv.className = "cf-turnstile";
        widgetDiv.setAttribute("data-sitekey", siteKey);
        widgetDiv.setAttribute("data-callback", "turnstileCallback");
        widgetDiv.setAttribute("data-theme", "auto");
        turnstileContainer.appendChild(widgetDiv);

        // Pastikan callback global untuk Turnstile
        window.turnstileCallback = function(token) {
            if (token) {
                // Captcha sukses: sembunyikan captcha, munculkan download
                turnstileContainer.style.display = "none";
                downloadBtn.style.display = "";
            }
        };
    });

    // Handler tombol download
    downloadBtn.addEventListener('click', function() {
        startDownload(detail.url, detail.asset);
        // Download button tetap tampil, captcha tidak perlu diulang (kecuali kamu ingin reset)
    });
    downloadBtn.addEventListener('contextmenu', e => e.preventDefault());

    showLoader(false);
}
window.onload = renderDetail;
