document.addEventListener("DOMContentLoaded", () => {
    // 1. Hubungkan tombol kuning di header agar bisa membuka modal
    const openSettingsBtn = document.getElementById("openSettingsBtn");
    const settingsModal = document.getElementById("settingsModal");
    
    if (openSettingsBtn && settingsModal) {
        openSettingsBtn.addEventListener("click", () => {
            settingsModal.classList.add("active");
        });
    }

    // 2. Tambahkan Kotak Tutorial & Disclaimer 100% Aman secara otomatis
    const modalContent = document.querySelector("#settingsModal .modal-content");
    if (modalContent && !document.getElementById("apiTutorialBox")) {
        const tutorialDiv = document.createElement("div");
        tutorialDiv.id = "apiTutorialBox";
        tutorialDiv.style.cssText = "text-align: left; background: rgba(255,255,255,0.03); border: 1px solid var(--border-color); padding: 12px; border-radius: 8px; margin-bottom: 15px; font-size: 11px; color: var(--text-muted); line-height: 1.5;";
        tutorialDiv.innerHTML = `
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
        `;
        
        // Sisipkan pas di atas tombol "Simpan Pengaturan"
        const saveBtn = document.getElementById("saveApiKeyBtn");
        if (saveBtn) {
            modalContent.insertBefore(tutorialDiv, saveBtn);
        } else {
            modalContent.appendChild(tutorialDiv);
        }
    }
});
