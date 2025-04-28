function showLoader(show = true) {
    const loader = document.getElementById('loader');
    if (!loader) return;
    loader.style.display = show ? "flex" : "none";
}

function extractCoverUrl(desc) {
    const m = desc && desc.match(/!\[[^\]]*\]\((.*?)\)/);
    if (m && m[1]) return m[1];
    return null;
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
    const coverUrl = extractCoverUrl(detail.desc) || 'image/pack_icon.png';
    const descClean = detail.desc ? detail.desc.replace(/!\[[^\]]*\]\((.*?)\)/g, '').trim() : "";
    container.innerHTML = `
        <img src="${coverUrl}" alt="cover" class="addon-cover" style="margin-bottom:18px;">
        <div class="detail-title">${detail.name}</div>
        <div class="detail-desc">${descClean ? descClean.replace(/\n/g,"<br>") : '(No description)'}</div>
        <div class="detail-download">
            <button class="detail-btn" type="button" id="downloadBtn">Download</button>
        </div>
    `;
    const btn = document.getElementById('downloadBtn');
    if (btn) {
        btn.addEventListener('click', function() {
            startDownload(detail.url, detail.asset);
        });
        btn.addEventListener('contextmenu', e => e.preventDefault());
    }
    showLoader(false);
}
window.onload = renderDetail;
