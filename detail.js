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

// Modal dialog captcha
function showCaptchaDialog(onSuccess, onCancel) {
    // Hapus modal lama jika ada
    document.getElementById('captcha-modal')?.remove();

    // Modal wrapper
    const modal = document.createElement('div');
    modal.id = 'captcha-modal';
    modal.style.position = 'fixed';
    modal.style.left = 0;
    modal.style.top = 0;
    modal.style.width = '100vw';
    modal.style.height = '100vh';
    modal.style.background = 'rgba(21,18,28,0.75)';
    modal.style.zIndex = 99999;
    modal.style.display = 'flex';
    modal.style.alignItems = 'center';
    modal.style.justifyContent = 'center';

    // Dialog container
    const dialog = document.createElement('div');
    dialog.style.background = '#181825';
    dialog.style.padding = '32px 16px 22px 16px';
    dialog.style.borderRadius = '14px';
    dialog.style.boxShadow = '0 2px 22px #000a';
    dialog.style.maxWidth = '92vw';
    dialog.style.textAlign = 'center';
    dialog.style.position = 'relative';
    dialog.style.minWidth = '280px';

    // Close button
    const closeBtn = document.createElement('button');
    closeBtn.textContent = '✕';
    closeBtn.style.position = 'absolute';
    closeBtn.style.top = '10px';
    closeBtn.style.right = '14px';
    closeBtn.style.background = 'none';
    closeBtn.style.border = 'none';
    closeBtn.style.fontSize = '1.4em';
    closeBtn.style.color = '#fff';
    closeBtn.style.cursor = 'pointer';
    closeBtn.style.opacity = '0.75';
    closeBtn.onmouseenter = () => closeBtn.style.opacity = "1";
    closeBtn.onmouseleave = () => closeBtn.style.opacity = "0.75";
    closeBtn.onclick = () => {
        document.body.removeChild(modal);
        if(onCancel) onCancel();
    };

    // Title
    const title = document.createElement('div');
    title.textContent = "Verifikasi Captcha";
    title.style.fontWeight = 700;
    title.style.fontSize = '1.14em';
    title.style.marginBottom = '13px';

    // Container untuk captcha
    const captchaDiv = document.createElement('div');
    captchaDiv.style.display = 'flex';
    captchaDiv.style.justifyContent = 'center';

    // Tambahkan elemen
    dialog.appendChild(closeBtn);
    dialog.appendChild(title);
    dialog.appendChild(captchaDiv);
    modal.appendChild(dialog);
    document.body.appendChild(modal);

    // Render Turnstile Widget
    const siteKey = "SITE_KEY_KAMU"; // Ganti dengan site key kamu!
    captchaDiv.innerHTML = "";
    const widgetDiv = document.createElement('div');
    widgetDiv.className = "cf-turnstile";
    widgetDiv.setAttribute("data-sitekey", siteKey);
    widgetDiv.setAttribute("data-callback", "turnstileDialogCallback");
    widgetDiv.setAttribute("data-theme", "auto");
    captchaDiv.appendChild(widgetDiv);

    // Callback global
    window.turnstileDialogCallback = function(token) {
        if (token) {
            setTimeout(() => {
                document.body.removeChild(modal);
                if (onSuccess) onSuccess(token);
            }, 300);
        }
    };
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

    // Handler tombol download
    const btn = document.getElementById('downloadBtn');
    btn.addEventListener('click', function() {
        showCaptchaDialog(
            // onSuccess
            () => startDownload(detail.url, detail.asset),
            // onCancel
            () => {}
        );
    });
    btn.addEventListener('contextmenu', e => e.preventDefault());
    showLoader(false);
}
window.onload = renderDetail;
