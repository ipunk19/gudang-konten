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
            <ol style="margin: 0; padding-left: 15px; margin-bottom: 8px;">
                <li>Buka <a href="https://aistudio.google.com" target="_blank" style="color: var(--accent-blue); text-decoration: underline;">aistudio.google.com</a></li>
                <li>Login pakai Akun Google & klik tombol <b>"Get API key"</b>.</li>
                <li>Buat key baru, salin, lalu tempel di kotak atas.</li>
            </ol>
            <p style="color: #00ffcc; font-size: 10px; border-top: 1px dashed var(--border-color); padding-top: 6px; margin-top: 6px;">
                <i class="fa-solid fa-shield-halved"></i> <b>100% Aman:</b> API Key kamu hanya tersimpan di perangkatmu sendiri (Browser LocalStorage) dan tidak pernah dikirim ke server manapun.
            </p>
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
    const topikInput = document.getElementById("topikInput");
    const generateHookBtn = document.getElementById("generateHookBtn");
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

    generateHookBtn.addEventListener("click", async () => {
        const apiKey = localStorage.getItem("geminiApiKey");
        const selectedModel = localStorage.getItem("geminiSelectedModel") || "gemini-3.8-flash";
        const topik = topikInput.value.trim();

        if (!apiKey) {
            alert("⚠️ API Key belum diatur! Silakan klik 'Atur Key' di pojok kanan atas.");
            bukaPengaturan();
            return;
        }
        if (!topik) {
            alert("⚠️ Topik atau ide konten masih kosong!");
            return;
        }

        generateHookBtn.innerHTML = `<i class='fa-solid fa-spinner fa-spin'></i> Meracik Hook & Judul...`;
        generateHookBtn.disabled = true;
        outputArea.value = "AI sedang menyusun variasi hook pemecah scroll... (Tunggu sebentar)";

        const promptSystem = `Kamu adalah pakar strategi konten video pendek dan copywriter profesional. Berdasarkan topik: "${topik}", buatkan variasi pembuka video (Hook) 3 detik pertama yang sangat memancing rasa penasaran dan menghentikan orang scrolling, serta pilihan judul bombastis.

Berikan hasil HANYA dalam format berikut tanpa basa-basi:

[1. VARIASI HOOK 3 DETIK PERTAMA (EMOSIONAL / MENUSUK)]
- (Tulis opsi 1 kalimat pembuka yang menohok)
- (Tulis opsi 2 kalimat pembuka dengan nada kontras/bertanya)
- (Tulis opsi 3 kalimat pembuka berbasis kenyataan pahit/relate)

[2. VARIASI HOOK 3 DETIK PERTAMA (RASA PENASARAN / CLIFFHANGER)]
- (Tulis opsi 1)
- (Tulis opsi 2)

[3. PILIHAN JUDUL BOMBASTIS (YOUTUBE / REELS / TIKTOK)]
1. ...
2. ...
3. ...
4. ...
5. ...`;

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
            generateHookBtn.innerHTML = "<i class='fa-solid fa-anchor'></i> Generate Hook & Judul";
            generateHookBtn.disabled = false;
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
        a.download = `HookKonten_${new Date().getTime()}.txt`;
        a.click();
    });
});
