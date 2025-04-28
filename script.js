// Daftar addon (bisa diisi manual, atau akan bertambah jika user upload)
let addons = [
    {
        name: "Contoh Addon 1",
        desc: "Addon untuk fitur A. Cek changelog di repo.",
        url: "https://github.com/username/repo/raw/main/addon1.zip"
    },
    {
        name: "Contoh Addon 2",
        desc: "Addon ringan khusus fitur B.",
        url: "https://github.com/username/repo/raw/main/addon2.zip"
    }
];

// Load dari localStorage jika ada
if (localStorage.getItem('addons')) {
    try {
        addons = JSON.parse(localStorage.getItem('addons'));
    } catch {}
}

const list = document.getElementById('addon-list');
const form = document.getElementById('upload-form');
const toggleUpload = document.getElementById('toggle-upload');
const searchInput = document.getElementById('search');

function renderList(filter = "") {
    list.innerHTML = "";
    let filtered = addons;
    if (filter) {
        filtered = addons.filter(
            a => a.name.toLowerCase().includes(filter.toLowerCase()) 
                || a.desc.toLowerCase().includes(filter.toLowerCase())
        );
    }
    if (filtered.length === 0) {
        list.innerHTML = "<li>Tidak ada addon ditemukan.</li>";
        return;
    }
    filtered.forEach((addon, idx) => {
        const li = document.createElement('li');
        li.innerHTML = `
            <div class="addon-header">
                <span class="addon-name">${addon.name}</span>
            </div>
            <div class="addon-desc">${addon.desc || "(Tidak ada deskripsi)"}</div>
            <div class="addon-buttons">
                <a class="addon-link" href="${addon.url}" download>Download</a>
                <button class="copy-btn" data-url="${addon.url}">Copy Link</button>
            </div>
        `;
        list.appendChild(li);
    });
    // Event copy
    document.querySelectorAll('.copy-btn').forEach(btn => {
        btn.onclick = function() {
            navigator.clipboard.writeText(this.dataset.url)
                .then(() => {
                    this.textContent = "Copied!";
                    setTimeout(() => this.textContent = "Copy Link", 1200);
                });
        };
    });
}

renderList();

toggleUpload.onclick = () => {
    form.style.display = (form.style.display === "none") ? "flex" : "none";
};

form.onsubmit = e => {
    e.preventDefault();
    const name = document.getElementById('addon-name').value.trim();
    const desc = document.getElementById('addon-desc').value.trim();
    const url = document.getElementById('addon-url').value.trim();
    if (!name || !desc || !url) return;
    addons.push({ name, desc, url });
    localStorage.setItem('addons', JSON.stringify(addons));
    renderList(searchInput.value);
    form.reset();
    form.style.display = "none";
};

searchInput.oninput = function() {
    renderList(this.value);
};