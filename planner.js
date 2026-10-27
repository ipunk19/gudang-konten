function updateApiStatusUI() {
    const savedKey = localStorage.getItem("geminiApiKey");
    const statusText = document.getElementById("statusText");
    const apiStatusBanner = document.getElementById("apiStatusBanner");
    
    if (savedKey && statusText && apiStatusBanner) {
        statusText.textContent = "Aktif (Tersimpan)";
        statusText.style.color = "#00ffcc";
        apiStatusBanner.style.background = "rgba(0, 255, 204, 0.08)";
        apiStatusBanner.style.borderColor = "rgba(0, 255, 204, 0.3)";
    } else if (statusText) {
        statusText.textContent = "Belum Diset";
        statusText.style.color = "#ff4444";
    }
}

document.addEventListener("DOMContentLoaded", () => {
    const openSettingsBtn = document.getElementById("openSettingsBtn");
    const closeSettingsBtn = document.getElementById("closeSettingsBtn");
    const settingsModal = document.getElementById("settingsModal");
    const saveApiKeyBtn = document.getElementById("saveApiKeyBtn");
    const apiKeyInput = document.getElementById("apiKey");
    const modelSelect = document.getElementById("modelSelect");

    // Muat data tersimpan
    try {
        if (localStorage.getItem("geminiApiKey") && apiKeyInput) {
            apiKeyInput.value = localStorage.getItem("geminiApiKey");
        }
        if (localStorage.getItem("geminiSelectedModel") && modelSelect) {
            modelSelect.value = localStorage.getItem("geminiSelectedModel");
        }
        updateApiStatusUI();
    } catch (e) {}

    // Tombol Buka/Tutup Modal Settings
    if (openSettingsBtn && settingsModal) {
        openSettingsBtn.addEventListener("click", () => {
            settingsModal.classList.add("active");
        });
    }

    if (closeSettingsBtn && settingsModal) {
        closeSettingsBtn.addEventListener("click", () => {
            settingsModal.classList.remove("active");
        });
    }

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
                updateApiStatusUI();
                settingsModal.classList.remove("active");
                alert("✅ API Key berhasil disimpan!");
            } catch (error) {
                alert("❌ Gagal menyimpan: " + error.message);
            }
        });
    }

    // Logika Tombol Generate Planner
    const generateBtn = document.getElementById("generateBtn");
    const nicheInput = document.getElementById("nicheInput");
    const platformSelect = document.getElementById("platformSelect");
    const outputArea = document.getElementById("outputArea");

    if (generateBtn) {
        generateBtn.addEventListener("click", async () => {
            const apiKey = localStorage.getItem("geminiApiKey");
            const selectedModel = localStorage.getItem("geminiSelectedModel") || "gemini-3.8-flash";
            const niche = nicheInput.value.trim();
            const platform = platformSelect.value;

            if (!apiKey) {
                alert("⚠️ API Key belum diatur! Silakan klik 'API Key' di pojok kanan atas.");
                if (settingsModal) settingsModal.classList.add("active");
                return;
            }
            if (!niche) {
                alert("⚠️ Niche atau tema konten masih kosong!");
                return;
            }

            generateBtn.innerHTML = `<i class='fa-solid fa-spinner fa-spin'></i> Menyusun Jadwal...`;
            generateBtn.disabled = true;
            outputArea.innerHTML = "AI sedang menyusun content planner terbaik untukmu...";

            try {
                const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${selectedModel}:generateContent?key=${apiKey}`, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ 
                        contents: [{ 
                            parts: [{ 
                                text: `Buatlah content planner atau jadwal pembuatan konten yang terstruktur rapi untuk:\n- Niche/Tema: "${niche}"\n- Target & Periode: "${platform}"\nBerikan ide judul, format video, sudut pandang hook, dan catatan eksekusi harian.` 
                            }] 
                        }] 
                    })
                });

                const data = await response.json();
                if (!response.ok) throw new Error(data.error?.message || "Kesalahan tidak dikenal.");
                if (!data.candidates || data.candidates.length === 0) throw new Error("Tidak ada hasil.");

                const resultText = data.candidates[0].content.parts[0].text;
                outputArea.innerHTML = `<div style="text-align: left; font-size: 12px; color: var(--text-main); line-height: 1.6;"><strong style="color: var(--accent-blue);"><i class="fa-solid fa-circle-check"></i> Content Planner Berhasil Dibuat:</strong><br><br>${resultText.replace(/\n/g, '<br>')}</div>`;

            } catch (error) {
                outputArea.innerHTML = `<span style="color: #ff4444;">❌ GAGAL MEMPROSES:\n\n${error.message}</span>`;
            } finally {
                generateBtn.innerHTML = `<i class="fa-solid fa-calendar-days"></i> Buat Content Planner`;
                generateBtn.disabled = false;
            }
        });
    }
});
                                
