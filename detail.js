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
    // Ganti SITE_KEY_MU dengan site key asli dari Google reCAPTCHA
    const SITE_KEY_MU = "6LfuTCcrAAAAADhKe6fyFK-m6-1evUmkgetbA81b";
    container.innerHTML = `
        <div class="detail-title">${detail.name}</div>
        <div class="detail-desc">${descClean ? descClean.replace(/\n/g,"<br>") : '(No description)'}</div>
        <div class="detail-download">
            <button class="detail-btn" type="button" id="downloadBtn" disabled>Download</button>
            <div style="margin-top:16px;" id="captcha-container">
                <div class="g-recaptcha" data-sitekey="${SITE_KEY_MU}" data-callback="recaptchaVerified"></div>
            </div>
        </div>
    `;

    // Enable download button jika captcha tercentang
    window.recaptchaVerified = function(token) {
        document.getElementById('downloadBtn').disabled = false;
    };

    // Jika user uncheck recaptcha, disable lagi tombolnya (reCAPTCHA v2 tidak punya event uncheck, jadi reset saat download)
    document.getElementById('downloadBtn').addEventListener('click', function() {
        // Cek token recaptcha
        const token = grecaptcha.getResponse();
        if (!token) {
            alert("Please check the captcha before downloading!");
            this.disabled = true;
            return;
        }
        startDownload(detail.url, detail.asset);
        grecaptcha.reset();
        this.disabled = true;
    });
    showLoader(false);
}
window.onload = renderDetail;
