const ADMIN_USERNAME = "nxzott";
const ADMIN_PASSWORD = "nizam gay 69";
const ADMIN_KEY = "admin_logged_in";
function isAdminLoggedIn() {
    return localStorage.getItem(ADMIN_KEY) === "true";
}
function setAdminLogin(status) {
    if (status) localStorage.setItem(ADMIN_KEY, "true");
    else localStorage.removeItem(ADMIN_KEY);
}
function showAdminMain(show) {
    document.getElementById('admin-main-section').style.display = show ? "" : "none";
    document.getElementById('admin-login-section').style.display = show ? "none" : "";
}
function getAddons() {
    return JSON.parse(localStorage.getItem('addons') || '[]');
}
function saveAddons(addons) {
    localStorage.setItem('addons', JSON.stringify(addons));
}
function renderAdminList() {
    const list = document.getElementById('admin-addon-list');
    const addons = getAddons();
    list.innerHTML = addons.length === 0
        ? "<li>Belum ada addon.</li>"
        : addons.map((addon, idx) => `
            <li>
                <div class="addon-header"><span class="addon-name">${addon.name}</span></div>
                <div class="spoiler-content active">${addon.desc || '(Tanpa deskripsi)'}</div>
                <div class="addon-buttons">
                    <a class="addon-link" href="${addon.url}" target="_blank" rel="noopener">Download</a>
                    <button onclick="editAddon(${idx})">Edit</button>
                    <button onclick="deleteAddon(${idx})">Hapus</button>
                </div>
            </li>
        `).join('');
}
function editAddon(idx) {
    const addons = getAddons();
    const addon = addons[idx];
    document.getElementById('addon-name').value = addon.name;
    document.getElementById('addon-url').value = addon.url;
    document.getElementById('addon-desc').value = addon.desc;
    deleteAddon(idx, false);
}
function deleteAddon(idx, rerender = true) {
    const addons = getAddons();
    addons.splice(idx, 1);
    saveAddons(addons);
    if (rerender !== false) renderAdminList();
}
document.addEventListener('DOMContentLoaded', function() {
    if (isAdminLoggedIn()) {
        showAdminMain(true);
        renderAdminList();
    } else {
        showAdminMain(false);
    }
    document.getElementById('admin-login-form').addEventListener('submit', function(e) {
        e.preventDefault();
        const user = document.getElementById('admin-username').value.trim();
        const pass = document.getElementById('admin-password').value.trim();
        if (user === ADMIN_USERNAME && pass === ADMIN_PASSWORD) {
            setAdminLogin(true);
            showAdminMain(true);
            renderAdminList();
        } else {
            document.getElementById('login-error').textContent = "Username atau password salah!";
            document.getElementById('login-error').style.display = "";
        }
        this.reset();
    });
    document.getElementById('logout-btn').addEventListener('click', function() {
        setAdminLogin(false);
        showAdminMain(false);
        window.location.reload();
    });
});
