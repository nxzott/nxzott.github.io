function showLoader(show = true) {
    const loader = document.getElementById('loader');
    if (!loader) return;
    loader.style.display = show ? "flex" : "none";
}

function renderDetail() {
    showLoader(true);
    let detail = null;
    try {
        detail = JSON.parse(localStorage.getItem('addon-detail'));
    } catch { detail = null; }
    const container = document.getElementById('detail-container');
    if (!detail) {
        container.innerHTML = `<div style="color:#E46666;font-weight:600;font-size:1.2em;">Data tidak ditemukan.<br>Silakan kembali ke beranda.</div>`;
        showLoader(false);
        return;
    }
    container.innerHTML = `
        <div class="detail-title">${detail.name}</div>
        <div class="detail-desc">${detail.desc ? detail.desc.replace(/\n/g,"<br>") : '(Tidak ada deskripsi)'}</div>
        <div class="detail-download">
            <a class="detail-btn" href="${detail.url}" download>Download file</a>
        </div>
    `;
    showLoader(false);
}
window.onload = renderDetail;
