document.addEventListener("DOMContentLoaded", () => {
    const openSettingsBtn = document.getElementById("openSettingsBtn");
    const closeSettingsBtn = document.getElementById("closeSettingsBtn");
    const settingsModal = document.getElementById("settingsModal");
    const saveApiKeyBtn = document.getElementById("saveApiKeyBtn");
    const apiKeyInput = document.getElementById("apiKey");
    const modelSelect = document.getElementById("modelSelect");

    // Muat API Key yang tersimpan di LocalStorage
    try {
        if (localStorage.getItem("geminiApiKey") && apiKeyInput) {
            apiKeyInput.value = localStorage.getItem("geminiApiKey");
        }
        if (localStorage.getItem("geminiSelectedModel") && modelSelect) {
            modelSelect.value = localStorage.getItem("geminiSelectedModel");
        }
    } catch (e) {}

    // Tombol Buka Modal Settings
    if (openSettingsBtn && settingsModal) {
        openSettingsBtn.addEventListener("click", () => {
            settingsModal.classList.add("active");
        });
    }

    // Tombol Tutup Modal Settings
    if (closeSettingsBtn && settingsModal) {
        closeSettingsBtn.addEventListener("click", () => {
            settingsModal.classList.remove("active");
        });
    }

    // Tutup modal jika klik di luar area kotak modal
    if (settingsModal) {
        settingsModal.addEventListener("click", (e) => {
            if (e.target === settingsModal) {
                settingsModal.classList.remove("active");
            }
        });
    }

    // Simpan API Key
    if (saveApiKeyBtn) {
        saveApiKeyBtn.addEventListener("click", () => {
            const key = apiKeyInput.value.trim();
            if (!key) {
                alert("❌ Masukkan API Key terlebih dahulu!");
                return;
            }
            try {
                localStorage.setItem("geminiApiKey", key);
                localStorage.setItem("geminiSelectedModel", modelSelect.value);
                settingsModal.classList.remove("active");
                alert("✅ API Key berhasil disimpan!");
            } catch (error) {
                alert("❌ Gagal menyimpan: " + error.message);
            }
        });
    }
});
