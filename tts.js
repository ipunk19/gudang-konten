// Fungsi global untuk membuka modal pengaturan API
function bukaPengaturan() {
    const modal = document.getElementById("settingsModal");
    if (modal) modal.classList.add("active");
}

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
    // --- KODE OTOMATIS: Tambah Panduan API Key ke Modal ---
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

        
        const saveBtn = document.getElementById("saveApiKeyBtn");
        if (saveBtn) {
            modalContent.insertBefore(tutorialDiv, saveBtn);
        } else {
            modalContent.appendChild(tutorialDiv);
        }
    }
    // --- BATAS KODE OTOMATIS ---

    const apiKeyInput = document.getElementById("apiKey");
    const modelSelect = document.getElementById("modelSelect");
    const settingsModal = document.getElementById("settingsModal");
    const openSettingsBtn = document.getElementById("openSettingsBtn");
    const closeSettingsBtn = document.getElementById("closeSettingsBtn");
    const saveApiKeyBtn = document.getElementById("saveApiKeyBtn");

    try {
        if (localStorage.getItem("geminiApiKey") && apiKeyInput) {
            apiKeyInput.value = localStorage.getItem("geminiApiKey");
        }
        if (localStorage.getItem("geminiSelectedModel") && modelSelect) {
            modelSelect.value = localStorage.getItem("geminiSelectedModel");
        }
        updateApiStatusUI();
    } catch (e) {}

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
                if (settingsModal) settingsModal.classList.remove("active");
                alert("✅ API Key berhasil disimpan!");
            } catch (error) {
                alert("❌ Gagal menyimpan: " + error.message);
            }
        });
    }

    // Menghubungkan tombol klik untuk membuka & menutup modal
    if (openSettingsBtn) {
        openSettingsBtn.addEventListener("click", bukaPengaturan);
    }
    if (closeSettingsBtn) {
        closeSettingsBtn.addEventListener("click", () => {
            if (settingsModal) settingsModal.classList.remove("active");
        });
    }
    if (settingsModal) {
        settingsModal.addEventListener("click", (e) => {
            if (e.target === settingsModal) settingsModal.classList.remove("active");
        });
    }

    // Logika Tombol Generate TTS
    const generateTtsBtn = document.getElementById("generateTtsBtn");
    const ttsInput = document.getElementById("ttsInput");
    const ttsOutputArea = document.getElementById("ttsOutputArea");

    if (generateTtsBtn) {
        generateTtsBtn.addEventListener("click", async () => {
            const apiKey = localStorage.getItem("geminiApiKey");
            const selectedModel = localStorage.getItem("geminiSelectedModel") || "gemini-3.8-flash";
            const text = ttsInput.value.trim();

            if (!apiKey) {
                alert("⚠️ API Key belum diatur! Silakan klik 'API Key' di pojok kanan atas.");
                bukaPengaturan();
                return;
            }
            if (!text) {
                alert("⚠️ Skrip narasi masih kosong!");
                return;
            }

            generateTtsBtn.innerHTML = `<i class='fa-solid fa-spinner fa-spin'></i> Memproses...`;
            generateTtsBtn.disabled = true;
            ttsOutputArea.innerHTML = "AI sedang meracik arahan intonasi dan skrip suara...";

            try {
                const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${selectedModel}:generateContent?key=${apiKey}`, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ 
                        contents: [{ 
                            parts: [{ 
                                text: `Bertindaklah sebagai sutradara pengisi suara profesional. Berikan panduan pembacaan, intonasi, jeda (pause), dan penekanan emosi untuk teks narasi berikut agar siap di-generate ke suara AI:\n\n"${text}"` 
                            }] 
                        }] 
                    })
                });

                const data = await response.json();
                if (!response.ok) throw new Error(data.error?.message || "Kesalahan tidak dikenal.");
                if (!data.candidates || data.candidates.length === 0) throw new Error("Tidak ada hasil.");

                const resultText = data.candidates[0].content.parts[0].text;
                ttsOutputArea.innerHTML = `<div style="text-align: left; font-size: 12px; color: var(--text-main); line-height: 1.6;"><strong style="color: var(--accent-blue);"><i class="fa-solid fa-circle-check"></i> Panduan Studio Suara Berhasil:</strong><br><br>${resultText.replace(/\n/g, '<br>')}</div>`;

            } catch (error) {
                ttsOutputArea.innerHTML = `<span style="color: #ff4444;">❌ GAGAL MEMPROSES:\n\n${error.message}</span>`;
            } finally {
                generateTtsBtn.innerHTML = `<i class="fa-solid fa-microphone-lines"></i> Generate Voice (TTS)`;
                generateTtsBtn.disabled = false;
            }
        });
    }
});
