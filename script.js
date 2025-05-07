function getAddons() {
    return JSON.parse(localStorage.getItem('addons') || '[]');
}
function renderAddons(filter = "") {
    const list = document.getElementById('addon-list');
    const addons = getAddons();
    const filtered = filter
        ? addons.filter(a =>
            a.name.toLowerCase().includes(filter.toLowerCase()) ||
            (a.desc && a.desc.toLowerCase().includes(filter.toLowerCase()))
        )
        : addons;
    list.innerHTML = filtered.length === 0
        ? "<li>Tidak ada addon ditemukan.</li>"
        : filtered.map((addon, idx) => `
            <li>
                <div class="addon-header">
                    <span class="addon-name">${addon.name}</span>
                    <button class="spoiler-btn" onclick="toggleSpoiler(this,${idx})">Lihat deskripsi</button>
                </div>
                <div class="spoiler-content" id="spoiler-${idx}">${addon.desc ? addon.desc : '(Tanpa deskripsi)'}</div>
                <div class="addon-buttons">
                    <a class="addon-link" href="${addon.url}" target="_blank" rel="noopener">Download</a>
                </div>
            </li>
        `).join('');
}
function toggleSpoiler(btn, idx) {
    const content = document.getElementById('spoiler-' + idx);
    if (content.classList.contains('active')) {
        content.classList.remove('active');
        btn.textContent = 'Lihat deskripsi';
    } else {
        content.classList.add('active');
        btn.textContent = 'Sembunyikan deskripsi';
    }
}
window.toggleSpoiler = toggleSpoiler;
document.addEventListener('DOMContentLoaded', function() {
    renderAddons();
    document.getElementById('search').addEventListener('input', function() {
        renderAddons(this.value);
    });
});
