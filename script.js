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
const menuBtn = document.getElementById('menu-btn');
const sideNav = document.getElementById('side-nav');
const overlay = document.getElementById('overlay');
const themeToggle = document.getElementById('theme-toggle');
const toast = document.getElementById('toast');
const scrollTopBtn = document.getElementById('scrollTopBtn');

// == SIDEBAR ==
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

// == DARK/LIGHT MODE ==
function setTheme(mode) {
    if (mode === "light") {
        document.documentElement.setAttribute("data-theme", "light");
        themeToggle.innerHTML = `<span class="material-icons">light_mode</span>`;
        localStorage.setItem("theme", "light");
    } else {
        document.documentElement.removeAttribute("data-theme");
        themeToggle.innerHTML = `<span class="material-icons">dark_mode</span>`;
        localStorage.setItem("theme", "dark");
    }
}
themeToggle.onclick = function() {
    const current = document.documentElement.getAttribute("data-theme") === "light";
    setTheme(current ? "dark" : "light");
};
(function autoDetectTheme() {
    let saved = localStorage.getItem("theme");
    if (!saved) {
        saved = window.matchMedia && window.matchMedia('(prefers-color-scheme: light)').matches ? "light" : "dark";
    }
    setTheme(saved);
})();

// == TOAST NOTIF ==
function showToast(msg) {
    toast.textContent = msg;
    toast.className = "toast show";
    setTimeout(() => { toast.className = "toast"; }, 1850);
}

// == RENDER LIST ==
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
        const li = document.createElement('li');
        li.innerHTML = `
            <div class="addon-header">
                <span class="addon-name">${addon.name}</span>
            </div>
            <div class="addon-desc">${addon.desc ? addon.desc.replace(/\n/g, "<br>") : "(Tidak ada deskripsi)"}</div>
            <div class="addon-buttons">
                <a class="addon-link" href="${addon.url}" download>Download</a>
                <button class="copy-btn" data-url="${addon.url}">Copy Link</button>
            </div>
        `;
        // Animation: floating fade-in
        li.style.opacity = "0";
        li.style.transform = "translateY(24px) scale(0.97)";
        setTimeout(() => {
            li.style.opacity = "1";
            li.style.transform = "translateY(0) scale(1)";
            li.style.transition = "opacity .6s cubic-bezier(.6,.03,.28,1), transform .6s cubic-bezier(.6,.03,.28,1)";
        }, 70 + idx * 70);
        list.appendChild(li);
    });
    // Event copy
    document.querySelectorAll('.copy-btn').forEach(btn => {
        btn.onclick = function(e) {
            navigator.clipboard.writeText(this.dataset.url)
                .then(() => showToast("Link berhasil disalin!"));
        };
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
