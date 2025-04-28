const GITHUB_OWNER = "nxzott";
const GITHUB_REPO = "addon";

async function fetchAddonsFromReleases() {
    let api = `https://api.github.com/repos/${GITHUB_OWNER}/${GITHUB_REPO}/releases`;
    try {
        const res = await fetch(api);
        if (!res.ok) throw new Error("Gagal fetch dari GitHub Releases");
        const releases = await res.json();
        let githubAddons = [];
        for (const release of releases) {
            const releaseName = release.name || release.tag_name;
            const releaseDesc = release.body || "";
            if (release.assets && release.assets.length > 0) {
                for (const asset of release.assets) {
                    // Tambahkan filter di bawah ini!
                    if (
                        asset.name.endsWith(".zip") ||
                        asset.name.endsWith(".mcaddon") ||
                        asset.name.endsWith(".mcpack")
                    ) {
                        githubAddons.push({
                            name: asset.name,
                            desc: (releaseDesc ? releaseDesc + "\n\n" : "") + (asset.label || ""),
                            url: asset.browser_download_url,
                            release: releaseName
                        });
                    }
                }
            }
        }
        return githubAddons;
    } catch (e) {
        console.error("Fetch GitHub Releases error:", e);
        return [];
    }
}

const list = document.getElementById('addon-list');
const searchInput = document.getElementById('search');

function renderList(addonList, filter = "") {
    list.innerHTML = "";
    let filtered = addonList;
    if (filter) {
        filtered = addonList.filter(
            a => (a.name && a.name.toLowerCase().includes(filter.toLowerCase())) 
                || (a.desc && a.desc.toLowerCase().includes(filter.toLowerCase()))
                || (a.release && a.release.toLowerCase().includes(filter.toLowerCase()))
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
                <span class="addon-release" style="color:#43B781;font-size:0.95em;font-weight:500;">${addon.release || ""}</span>
            </div>
            <div class="addon-desc">${addon.desc ? addon.desc.replace(/\n/g, "<br>") : "(Tidak ada deskripsi)"}</div>
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
    const githubAddons = await fetchAddonsFromReleases();
    allAddons = githubAddons;
    renderList(allAddons);
}
init();

searchInput.oninput = function() {
    renderList(allAddons, this.value);
};
