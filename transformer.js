function bukaPengaturan() {
    document.getElementById("settingsModal").classList.add("active");
}

function updateApiStatusUI() {
    const savedKey = localStorage.getItem("geminiApiKey");
    const statusText = document.getElementById("statusText");
    const apiStatusBanner = document.getElementById("apiStatusBanner");
    
    if (savedKey) {
        statusText.textContent = "Aktif (Tersimpan)";
        statusText.style.color = "#00ffcc";
        apiStatusBanner.style.background = "rgba(0, 255, 204, 0.08)";
        apiStatusBanner.style.borderColor = "rgba(0, 255, 204, 0.3)";
    } else {
        statusText.textContent = "Belum Diset";
        statusText.style.color = "#ff4444";
    }
}

document.addEventListener("DOMContentLoaded", () => { // --- KODE OTOMATIS: Tambah Panduan API Key ke Modal ---
const modalContent = document.querySelector("#settingsModal .modal-content");
if (modalContent && !document.getElementById("apiTutorialBox")) {
    const tutorialDiv = document.createElement("div");
    tutorialDiv.id = "apiTutorialBox";
    tutorialDiv.style.cssText = "text-align: left; background: rgba(255,255,255,0.03); border: 1px solid var(--border-color); padding: 12px; border-radius: 8px; margin-bottom: 15px; font-size: 11px; color: var(--text-muted); line-height: 1.5;";
    tutorialDiv.innerHTML = `
        <p style="font-weight: bold; color: var(--accent-yellow); margin-bottom: 6px; font-size: 12px;">
            <i class="fa-solid fa-circle-question"></i> Belum punya API Key?
        </p>
        <ol style="margin: 0; padding-left: 15px;">
            <li>Buka <a href="https://aistudio.google.com" target="_blank" style="color: var(--accent-blue); text-decoration: underline;">aistudio.google.com</a></li>
            <li>Login pakai Akun Google & klik tombol <b>"Get API key"</b>.</li>
            <li>Buat key baru, salin, lalu tempel di kotak atas.</li>
        </ol>
    `;
    
    // Sisipkan otomatis tepat di atas tombol "Simpan Pengaturan"
    const saveBtn = document.getElementById("saveApiKeyBtn");
    if (saveBtn) {
        modalContent.insertBefore(tutorialDiv, saveBtn);
    } else {
        modalContent.appendChild(tutorialDiv);
    }
}

    const apiKeyInput = document.getElementById("apiKey");
    const modelSelect = document.getElementById("modelSelect");
    const rawInput = document.getElementById("rawInput");
    const transformBtn = document.getElementById("transformBtn");
    const outputArea = document.getElementById("outputArea");
    const copyBtn = document.getElementById("copyBtn");
    const downloadBtn = document.getElementById("downloadBtn");

    const settingsModal = document.getElementById("settingsModal");
    const openSettingsBtn = document.getElementById("openSettingsBtn");
    const closeSettingsBtn = document.getElementById("closeSettingsBtn");
    const saveApiKeyBtn = document.getElementById("saveApiKeyBtn");

    try {
        if (localStorage.getItem("geminiApiKey")) {
            apiKeyInput.value = localStorage.getItem("geminiApiKey");
        }
        if (localStorage.getItem("geminiSelectedModel")) {
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
                settingsModal.classList.remove("active");
                alert("✅ API Key berhasil disimpan!");
            } catch (error) {
                alert("❌ Gagal menyimpan: " + error.message);
            }
        });
    }

    if (openSettingsBtn) openSettingsBtn.addEventListener("click", bukaPengaturan);
    if (closeSettingsBtn) closeSettingsBtn.addEventListener("click", () => settingsModal.classList.remove("active"));
    if (settingsModal) {
        settingsModal.addEventListener("click", (e) => {
            if (e.target === settingsModal) settingsModal.classList.remove("active");
        });
    }

    transformBtn.addEventListener("click", async () => {
        const apiKey = localStorage.getItem("geminiApiKey");
        const selectedModel = localStorage.getItem("geminiSelectedModel") || "gemini-3.8-flash";
        const rawText = rawInput.value.trim();

        if (!apiKey) {
            alert("⚠️ API Key belum diatur! Silakan klik 'Atur Key' di pojok kanan atas.");
            bukaPengaturan();
            return;
        }
        if (!rawText) {
            alert("⚠️ Ide atau narasi mentah masih kosong!");
            return;
        }

        transformBtn.innerHTML = `<i class='fa-solid fa-spinner fa-spin'></i> Menstransformasi Konten...`;
        transformBtn.disabled = true;
        outputArea.value = "AI sedang merombak ide ke berbagai format platform... (Tunggu sebentar)";

        const promptSystem = `Kamu adalah content strategist multi-platform handal. Berdasarkan ide/narasi mentah berikut: "${rawText}", ubah dan distribusikan menjadi 3 format platform berbeda dengan gaya penulisan yang memikat.

Berikan hasil HANYA dalam format berikut tanpa basa-basi:

[1. FORMAT REELS / TIKTOK / SHORTS]
- Judul/Hook: 
- Skrip Narasi (Voiceover): 
- Visual B-Roll Singkat: 

[2. FORMAT THREAD X (TWITTER)]
Tweet 1 (Hook): 
Tweet 2: 
Tweet 3: 
Tweet 4 (Closing & CTA): 

[3. FORMAT INSTAGRAM CAROUSEL / POST]
Slide 1 (Cover): 
Slide 2: 
Slide 3: 
Slide 4 (Call to Action): 
Caption & Hashtag:`;

        try {
            const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${selectedModel}:generateContent?key=${apiKey}`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ contents: [{ parts: [{ text: promptSystem }] }] })
            });

            const data = await response.json();
            if (!response.ok) throw new Error(data.error?.message || "Kesalahan tidak dikenal.");
            if (!data.candidates || data.candidates.length === 0) throw new Error("Tidak ada hasil.");

            outputArea.value = data.candidates[0].content.parts[0].text;

        } catch (error) {
            outputArea.value = `❌ GAGAL MEMPROSES:\n\n${error.message}`;
        } finally {
            transformBtn.innerHTML = "<i class='fa-solid fa-shuffle'></i> Transformasi ke Semua Platform";
            transformBtn.disabled = false;
        }
    });

    copyBtn.addEventListener("click", async () => {
        if (!outputArea.value || outputArea.value.startsWith("❌")) return;
        try { await navigator.clipboard.writeText(outputArea.value); alert("Teks berhasil disalin!"); } 
        catch (err) { alert("Gagal menyalin teks."); }
    });

    downloadBtn.addEventListener("click", () => {
        if (!outputArea.value || outputArea.value.startsWith("❌")) return;
        const blob = new Blob([outputArea.value], { type: "text/plain" });
        const a = document.createElement("a");
        a.href = URL.createObjectURL(blob);
        a.download = `MultiPlatform_${new Date().getTime()}.txt`;
        a.click();
    });
});
