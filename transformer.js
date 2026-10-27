// --- SCRIPT OTOMATIS: Inject Tombol & Modal API Key ---
window.bukaPengaturan = function() {
    const modal = document.getElementById("settingsModal");
    if (modal) modal.classList.add("active");
};

document.addEventListener("DOMContentLoaded", () => {     // Pastikan tombol kuning di header merespons klik
    const openSettingsBtn = document.getElementById("openSettingsBtn");
    if (openSettingsBtn) {
        openSettingsBtn.addEventListener("click", () => {
            const modal = document.getElementById("settingsModal");
            if (modal) modal.classList.add("active");
        });
    }
    
    // 1. Otomatis buat tombol API Key di header jika belum ada
    const header = document.querySelector("header");
    if (header && !document.getElementById("openSettingsBtn")) {
        const btn = document.createElement("button");
        btn.id = "openSettingsBtn";
        btn.className = "btn-icon-header";
        btn.title = "Pengaturan API Key";
        btn.style.cssText = "background: rgba(255,255,255,0.05); border: 1px solid var(--border-color); color: var(--text-main); padding: 6px 12px; border-radius: 6px; cursor: pointer; font-size: 12px; display: flex; align-items: center; gap: 6px;";
        btn.innerHTML = `<i class="fa-solid fa-gear" style="color: var(--accent-yellow);"></i> API Key`;
        btn.onclick = bukaPengaturan;
        header.appendChild(btn);
    }

    // 2. Otomatis buat kerangka Modal & Disclaimer 100% Aman jika belum ada
    if (!document.getElementById("settingsModal")) {
        const modalDiv = document.createElement("div");
        modalDiv.id = "settingsModal";
        modalDiv.className = "modal-overlay";
        modalDiv.innerHTML = `
            <div class="modal-content">
                <button id="closeSettingsBtn" class="close-btn">&times;</button>
                <div class="modal-header" style="margin-bottom: 15px;">
                    <i class="fa-solid fa-key" style="color: var(--accent-yellow); font-size: 24px;"></i>
                    <h3>Pengaturan Gemini API</h3>
                    <p class="subtitle" style="font-size: 12px; color: var(--text-muted);">Masukkan API Key pribadi kamu</p>
                </div>
                
                <div style="text-align: left; background: rgba(255,255,255,0.03); border: 1px solid var(--border-color); padding: 12px; border-radius: 8px; margin-bottom: 15px; font-size: 11px; color: var(--text-muted); line-height: 1.5;">
                    <p style="font-weight: bold; color: var(--accent-yellow); margin-bottom: 6px; font-size: 12px;">
                        <i class="fa-solid fa-circle-question"></i> Belum punya API Key?
                    </p>
                    <ol style="margin: 0; padding-left: 15px; margin-bottom: 8px;">
                        <li>Buka <a href="https://aistudio.google.com" target="_blank" style="color: var(--accent-blue); text-decoration: underline;">aistudio.google.com</a></li>
                        <li>Login pakai Akun Google & klik tombol <b>"Get API key"</b>.</li>
                        <li>Buat key baru, salin, lalu tempel di kotak atas.</li>
                    </ol>
                    <p style="color: #00ffcc; font-size: 10px; border-top: 1px dashed var(--border-color); padding-top: 6px; margin-top: 6px;">
                        <i class="fa-solid fa-shield-halved"></i> <b>100% Aman:</b> API Key kamu hanya tersimpan di perangkatmu sendiri (Browser LocalStorage) dan tidak pernah dikirim ke server manapun.
                    </p>
                </div>

                <div style="text-align: left; margin-bottom: 15px;">
                    <label style="font-size: 11px; color: var(--text-muted); display: block; margin-bottom: 5px;">GEMINI API KEY</label>
                    <input type="password" id="apiKey" placeholder="AIzaSy..." style="width: 100%; padding: 10px; background: var(--bg-color); border: 1px solid var(--border-color); color: var(--text-main); border-radius: 8px; font-size: 13px; margin-bottom: 12px;">
                    
                    <label style="font-size: 11px; color: var(--text-muted); display: block; margin-bottom: 5px;">PILIH MODEL AI</label>
                    <select id="modelSelect" style="width: 100%; padding: 10px; background: var(--bg-color); border: 1px solid var(--border-color); color: var(--text-main); border-radius: 8px; font-size: 13px;">
                        <option value="gemini-3.8-flash">Gemini 3.8 Flash (Premium)</option>
                        <option value="gemini-3.5-flash">Gemini 3.5 Flash (Gratis/Standar)</option>
                        <option value="gemini-flash-latest">Gemini Flash Latest (Otomatis)</option>
                    </select>
                </div>

                <button id="saveApiKeyBtn" class="btn-primary" style="width: 100%; background: var(--accent-yellow); color: #121212; border: none; padding: 10px; border-radius: 8px; font-weight: bold; cursor: pointer; font-size: 13px;">Simpan Pengaturan</button>
            </div>
        `;
        document.body.appendChild(modalDiv);
    }

    // 3. Fungsionalitas Tombol & LocalStorage
    const apiKeyInput = document.getElementById("apiKey");
    const modelSelect = document.getElementById("modelSelect");
    const settingsModal = document.getElementById("settingsModal");
    const closeSettingsBtn = document.getElementById("closeSettingsBtn");
    const saveApiKeyBtn = document.getElementById("saveApiKeyBtn");

    try {
        if (localStorage.getItem("geminiApiKey") && apiKeyInput) {
            apiKeyInput.value = localStorage.getItem("geminiApiKey");
        }
        if (localStorage.getItem("geminiSelectedModel") && modelSelect) {
            modelSelect.value = localStorage.getItem("geminiSelectedModel");
        }
    } catch (e) {}

    if (saveApiKeyBtn) {
        saveApiKeyBtn.onclick = () => {
            const key = apiKeyInput.value.trim();
            if (!key) {
                alert("❌ Masukkan API Key terlebih dahulu!");
                return;
            }
            localStorage.setItem("geminiApiKey", key);
            localStorage.setItem("geminiSelectedModel", modelSelect.value);
            settingsModal.classList.remove("active");
            alert("✅ API Key berhasil disimpan!");
        };
    }

    if (closeSettingsBtn) {
        closeSettingsBtn.onclick = () => settingsModal.classList.remove("active");
    }
    if (settingsModal) {
        settingsModal.onclick = (e) => {
            if (e.target === settingsModal) settingsModal.classList.remove("active");
        };
    }
});
