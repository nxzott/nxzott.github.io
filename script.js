const GITHUB_OWNER = "nxzott";
const GITHUB_REPO = "addon";
const PAGE_SIZE = 6;

let allAddons = [];
let shownCount = 0;
let filteredAddons = [];

async function fetchAddonsFromReleases() {
    let api = `https://api.github.com/repos/${GITHUB_OWNER}/${GITHUB_REPO}/releases`;
    try {
        const res = await fetch(api);
        if (!res.ok) throw new Error("Failed to fetch from GitHub Releases");
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

function showLoader(show = true) {
    const loader = document.getElementById('loader');
    if (!loader) return;
    loader.style.display = show ? "flex" : "none";
}

const list = document.getElementById('addon-list');
const searchInput = document.getElementById('search');
const scrollTopBtn = document.getElementById('scrollTopBtn');

function renderItems(reset = false) {
    if (reset) {
        list.innerHTML = "";
        shownCount = 0;
    }
    const end = Math.min(shownCount + PAGE_SIZE, filteredAddons.length);
    for (let i = shownCount; i < end; i++) {
        const addon = filteredAddons[i];
        const descClean = addon.desc ? addon.desc.replace(/!\[[^\]]*\]\((.*?)\)/g, '').trim() : "";
        const li = document.createElement('li');
        li.innerHTML = `
            <div class="addon-header">
                <span class="addon-name">${addon.name}</span>
            </div>
            <div class="addon-desc">${descClean ? descClean.replace(/\n/g, "<br>") : "(No description)"}</div>
            <div class="addon-buttons">
                <button class="addon-link" type="button" data-asset="${encodeURIComponent(addon.asset)}" data-url="${encodeURIComponent(addon.url)}">Download</button>
            </div>
        `;
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
    }
    shownCount = end;
}

function handleScroll() {
    // If mendekati bawah 500px, load more
    if ((window.innerHeight + window.scrollY) >= (document.body.offsetHeight - 500)) {
        if (shownCount < filteredAddons.length) {
            renderItems(false);
        }
    }
}

let scrollHandlerAttached = false;

function renderList(addonList, filter = "", reset = true) {
    shownCount = 0;
    filteredAddons = addonList;
    if (filter) {
        filteredAddons = addonList.filter(
            a => (a.name && a.name.toLowerCase().includes(filter.toLowerCase())) 
                || (a.desc && a.desc.toLowerCase().includes(filter.toLowerCase()))
        );
    }
    if (filteredAddons.length === 0) {
        list.innerHTML = "<li>No addons found.</li>";
        shownCount = 0;
        return;
    }
    renderItems(true);

    // Attach infinite scroll once
    if (!scrollHandlerAttached) {
        window.addEventListener('scroll', handleScroll);
        scrollHandlerAttached = true;
    }
}

async function init() {
    showLoader(true);
    allAddons = await fetchAddonsFromReleases();
    renderList(allAddons, "", true);
    showLoader(false);
}
init();

searchInput.oninput = function() {
    renderList(allAddons, this.value, true);
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
