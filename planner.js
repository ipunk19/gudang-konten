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

    let rawGeneratedText = "";

    try {
        if (localStorage.getItem("geminiApiKey") && apiKeyInput) {
            apiKeyInput.value = localStorage.getItem("geminiApiKey");
        }
        if (localStorage.getItem("geminiSelectedModel") && modelSelect) {
            modelSelect.value = localStorage.getItem("geminiSelectedModel");
        }
        updateApiStatusUI();
    } catch (e) {}

    if (openSettingsBtn && settingsModal) {
        openSettingsBtn.addEventListener("click", () => settingsModal.classList.add("active"));
    }
    if (closeSettingsBtn && settingsModal) {
        closeSettingsBtn.addEventListener("click", () => settingsModal.classList.remove("active"));
    }
    if (settingsModal) {
        settingsModal.addEventListener("click", (e) => {
            if (e.target === settingsModal) settingsModal.classList.remove("active");
        });
    }

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

    const copyBtn = document.getElementById("copyBtn");
    const downloadBtn = document.getElementById("downloadBtn");

    if (copyBtn) {
        copyBtn.addEventListener("click", () => {
            if (!rawGeneratedText) return;
            navigator.clipboard.writeText(rawGeneratedText).then(() => {
                copyBtn.innerHTML = `<i class="fa-solid fa-check" style="color: #00ffcc;"></i> Tersalin!`;
                setTimeout(() => {
                    copyBtn.innerHTML = `<i class="fa-solid fa-copy"></i> Salin`;
                }, 2000);
            });
        });
    }

    if (downloadBtn) {
        downloadBtn.addEventListener("click", () => {
            if (!rawGeneratedText) return;
            const blob = new Blob([rawGeneratedText], { type: "text/markdown;charset=utf-8" });
            const url = URL.createObjectURL(blob);
            const a = document.createElement("a");
            a.href = url;
            a.download = `Planner-1Minggu-${document.getElementById("nicheInput").value.trim().replace(/\s+/g, '-') || 'Kreator'}.md`;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);
        });
    }

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

            generateBtn.innerHTML = `<i class='fa-solid fa-spinner fa-spin'></i> Menyusun Jadwal 1 Minggu...`;
            generateBtn.disabled = true;
            outputArea.innerHTML = "AI sedang meracik jadwal 7 hari lengkap sampai tuntas...";
            if (copyBtn) copyBtn.style.display = "none";
            if (downloadBtn) downloadBtn.style.display = "none";

            const promptText = `Buatlah content planner atau jadwal pembuatan konten yang TUNTAS untuk tepat 7 hari (Senin, Selasa, Rabu, Kamis, Jumat, Sabtu, Minggu):
- Niche/Tema: "${niche}"
- Target Platform: "${platform}"

INSTRUKSI FORMAT:
Buat secara ringkas, padat, dan jelas untuk masing-masing hari dari Senin sampai Minggu tanpa terpotong. 
Setiap hari wajib mencantumkan:
1. **Judul Konten:** ...
2. **Format / Visual:** ...
3. **Hook / Sudut Pandang:** ...
4. **Catatan Eksekusi:** ...

Pastikan teks mencakup semua hari secara berurutan dan diakhiri dengan tuntas sampai hari Minggu!`;

            try {
                const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${selectedModel}:generateContent?key=${apiKey}`, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ 
                        contents: [{ 
                            parts: [{ text: promptText }] 
                        }],
                        generationConfig: {
                            maxOutputTokens: 8192 // Kapasitas maksimal agar dijamin tidak terpotong
                        }
                    })
                });

                const data = await response.json();
                if (!response.ok) throw new Error(data.error?.message || "Kesalahan tidak dikenal.");
                if (!data.candidates || data.candidates.length === 0) throw new Error("Tidak ada hasil.");

                rawGeneratedText = data.candidates[0].content.parts[0].text;
                outputArea.innerHTML = `<div style="text-align: left; font-size: 12px; color: var(--text-main); line-height: 1.6;"><strong style="color: var(--accent-blue);"><i class="fa-solid fa-circle-check"></i> Jadwal 1 Minggu Berhasil Dibuat:</strong><br><br>${rawGeneratedText.replace(/\n/g, '<br>')}</div>`;

                if (copyBtn) copyBtn.style.display = "inline-flex";
                if (downloadBtn) downloadBtn.style.display = "inline-flex";

            } catch (error) {
                outputArea.innerHTML = `<span style="color: #ff4444;">❌ GAGAL MEMPROSES:\n\n${error.message}</span>`;
            } finally {
                generateBtn.innerHTML = `<i class="fa-solid fa-calendar-days"></i> Buat Content Planner 1 Minggu`;
                generateBtn.disabled = false;
            }
        });
    }
});
