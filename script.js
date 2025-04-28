// KONFIGURASI: Ganti dengan repo dan folder kamu!
const GITHUB_OWNER = "nxzott";
const GITHUB_REPO = "addons";
const GITHUB_PATH = "files"; // kosongkan "" jika root repo

let addons = [
    // Tambahkan manual jika ingin
    // {
    //     name: "Contoh Addon Lokal",
    //     desc: "Addon lokal dari browser.",
    //     url: "https://github.com/username/repo/raw/main/addons/addon.zip"
    // }
];

async function fetchAddonsFromGitHub() {
    let api = `https://api.github.com/repos/${GITHUB_OWNER}/${GITHUB_REPO}/contents/${GITHUB_PATH}`;
    try {
        const res = await fetch(api);
        if (!res.ok) throw new Error("Gagal fetch dari GitHub");
        const files = await res.json();
        // Filter hanya file yang diinginkan (misal zip/mcaddon/mcpack)
        const githubAddons = files.filter(f =>
            f.type === "file" &&
            (f.name.endsWith(".zip") || f.name.endsWith(".mcaddon") || f.name.endsWith(".mcpack"))
        ).map(f => ({
            name: f.name,
            desc: "Dari GitHub repo.",
            url: f.download_url
        }));
        return githubAddons;
    } catch (e) {
        console.error("Fetch GitHub error:", e);
        return [];
    }
}

const list = document.getElementById('addon-list');
const searchInput = document.getElementById('search');

// Side nav logic
const menuBtn = document.getElementById('menu-btn');
const sideNav = document.getElementById('side-nav');
const overlay = document.getElementById('overlay');
function openNav() {
    sideNav.classList.add("open");
    overlay.classList.add("active");
}
function closeNav() {
    sideNav.classList.remove("open");
    overlay.classList.remove("active");
}
menuBtn.onclick = openNav;
overlay.onclick = closeNav;
sideNav.onclick = e => {
    if (e.target.tagName === "A") closeNav();
};

function renderList(addonList, filter = "") {
    list.innerHTML = "";
    let filtered = addonList;
    if (filter) {
        filtered = addonList.filter(
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

let allAddons = [];

async function init() {
    const githubAddons = await fetchAddonsFromGitHub();
    const localNames = new Set(addons.map(a => a.name));
    allAddons = [
        ...githubAddons,
        ...addons.filter(a => !localNames.has(a.name))
    ];
    renderList(allAddons);
}
init();

searchInput.oninput = function() {
    renderList(allAddons, this.value);
};
