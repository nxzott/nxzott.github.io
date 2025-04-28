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
            <div id="turnstile-container" style="margin-bottom:18px;"></div>
            <button class="detail-btn" type="button" id="downloadBtn" disabled>Download</button>
        </div>
    `;

    // Render Turnstile widget
    const siteKey = "0x4AAAAAABVv08CLpoZoYY_g"; // <--- Ganti dengan site key kamu!
    const turnstileContainer = document.getElementById('turnstile-container');
    window.turnstileCallback = function(token) {
        // Aktifkan tombol jika captcha lolos
        const btn = document.getElementById('downloadBtn');
        if (token) {
            btn.disabled = false;
            btn.dataset['cfToken'] = token;
        } else {
            btn.disabled = true;
            btn.dataset['cfToken'] = '';
        }
    };
    // Render widget
    turnstileContainer.innerHTML = "";
    const widgetDiv = document.createElement('div');
    widgetDiv.className = "cf-turnstile";
    widgetDiv.setAttribute("data-sitekey", siteKey);
    widgetDiv.setAttribute("data-callback", "turnstileCallback");
    widgetDiv.setAttribute("data-theme", "auto");
    turnstileContainer.appendChild(widgetDiv);

    // Handler tombol download
    const btn = document.getElementById('downloadBtn');
    btn.addEventListener('click', function() {
        startDownload(detail.url, detail.asset);
        btn.disabled = true; // Disable agar tidak spam
        if (window.turnstile && widgetDiv) window.turnstile.reset(widgetDiv); // Reset captcha
    });
    btn.addEventListener('contextmenu', e => e.preventDefault());
    showLoader(false);
}
window.onload = renderDetail;
