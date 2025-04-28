const GITHUB_OWNER = "nxzott";
const GITHUB_REPO = "addon";

// == RELEASES DATA ==
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
                    if (
                        asset.name.endsWith(".mcaddon") ||
                        asset.name.endsWith(".zip") ||
                        asset.name.endsWith(".mcpack")
                    ) {
                        githubAddons.push({
                            name: releaseName,
                            desc: releaseDesc,
                            url: asset.browser_download_url,
                            asset: asset.name
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

// == LOADER ==
function showLoader(show = true) {
    const loader = document.getElementById('loader');
    if (!loader) return;
    loader.style.display = show ? "flex" : "none";
}

// == DOM ELEMENTS ==
const list = document.getElementById('addon-list');
const searchInput = document.getElementById('search');
const scrollTopBtn = document.getElementById('scrollTopBtn');

// == RENDER LIST ==
function extractCoverUrl(desc) {
    // Regex untuk markdown image: ![alt](url)
    const m = desc && desc.match(/!\[[^\]]*\]\((.*?)\)/);
    if (m && m[1]) return m[1];
    return null;
}

function renderList(addonList, filter = "") {
    list.innerHTML = "";
    let filtered = addonList;
    if (filter) {
        filtered = addonList.filter(
            a => (a.name && a.name.toLowerCase().includes(filter.toLowerCase())) 
                || (a.desc && a.desc.toLowerCase().includes(filter.toLowerCase()))
        );
    }
    if (filtered.length === 0) {
        list.innerHTML = "<li>Tidak ada addon ditemukan.</li>";
        return;
    }
    filtered.forEach((addon, idx) => {
        // Ambil cover/icon dari deskripsi
        const coverUrl = extractCoverUrl(addon.desc) || 'image/pack_icon.png';
        // Hapus baris markdown image di deskripsi
        const descClean = addon.desc ? addon.desc.replace(/!\[[^\]]*\]\((.*?)\)/g, '').trim() : "";
        const li = document.createElement('li');
        li.innerHTML = `
            <div class="addon-header" style="gap:15px;">
                <img src="${coverUrl}" alt="cover" class="addon-cover">
                <span class="addon-name">${addon.name}</span>
            </div>
            <div class="addon-desc">${descClean ? descClean.replace(/\n/g, "<br>") : "(Tidak ada deskripsi)"}</div>
            <div class="addon-buttons">
                <button class="addon-link" type="button" data-asset="${encodeURIComponent(addon.asset)}" data-url="${encodeURIComponent(addon.url)}">Download</button>
            </div>
        `;
        li.style.opacity = "0";
        li.style.transform = "translateY(24px) scale(0.97)";
        setTimeout(() => {
            li.style.opacity = "1";
            li.style.transform = "translateY(0) scale(1)";
            li.style.transition = "opacity .6s cubic-bezier(.6,.03,.28,1), transform .6s cubic-bezier(.6,.03,.28,1)";
        }, 70 + idx * 70);
        list.appendChild(li);

        li.querySelector('.addon-link').addEventListener('click', function(e){
            const detailData = {
                name: addon.name,
                desc: addon.desc,
                url: addon.url,
                asset: addon.asset
            };
            localStorage.setItem('addon-detail', JSON.stringify(detailData));
            window.location.href = `detail.html?name=${encodeURIComponent(addon.name)}`;
        });
        li.querySelector('.addon-link').addEventListener('contextmenu', e => e.preventDefault());
    });
}

// == INIT ==
let allAddons = [];
async function init() {
    showLoader(true);
    const githubAddons = await fetchAddonsFromReleases();
    allAddons = githubAddons;
    renderList(allAddons);
    showLoader(false);
}
init();

searchInput.oninput = function() {
    renderList(allAddons, this.value);
};

// == SCROLL TO TOP BUTTON ==
window.onscroll = function() {
    if (document.documentElement.scrollTop > 200) {
        scrollTopBtn.style.display = "block";
    } else {
        scrollTopBtn.style.display = "none";
    }
};
scrollTopBtn.onclick = function() {
    window.scrollTo({ top: 0, behavior: "smooth" });
};
