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
    const ideInput = document.getElementById("ideInput");
    const generateBtn = document.getElementById("generateBtn");
    const outputArea = document.getElementById("outputArea");
    const copyBtn = document.getElementById("copyBtn");
    const downloadBtn = document.getElementById("downloadBtn");

    const settingsModal = document.getElementById("settingsModal");
    const openSettingsBtn = document.getElementById("openSettingsBtn");
    const closeSettingsBtn = document.getElementById("closeSettingsBtn");
    const saveApiKeyBtn = document.getElementById("saveApiKeyBtn");

    // Load data tersimpan saat halaman dibuka
    try {
        if (localStorage.getItem("geminiApiKey")) {
            apiKeyInput.value = localStorage.getItem("geminiApiKey");
        }
        if (localStorage.getItem("geminiSelectedModel")) {
            modelSelect.value = localStorage.getItem("geminiSelectedModel");
        }
        updateApiStatusUI();
        
        if (localStorage.getItem("secarikKertas_backup")) {
            outputArea.value = localStorage.getItem("secarikKertas_backup");
        }
    } catch (e) {}

    // Fungsi Simpan API Key
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

    // Kontrol Buka/Tutup Modal Pengaturan
    if (openSettingsBtn) {
        openSettingsBtn.addEventListener("click", bukaPengaturan);
    }
    if (closeSettingsBtn) {
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

    // Logika Generate Teks 5-in-1
    generateBtn.addEventListener("click", async () => {
        const apiKey = localStorage.getItem("geminiApiKey");
        const selectedModel = localStorage.getItem("geminiSelectedModel") || "gemini-3.8-flash";
        const ide = ideInput.value.trim();

        if (!apiKey) {
            alert("⚠️ API Key belum diatur! Silakan klik tombol 'Atur Key' di atas terlebih dahulu.");
            bukaPengaturan();
            return;
        }
        if (!ide) {
            alert("⚠️ Ide konten masih kosong!");
            return;
        }

        generateBtn.innerHTML = `<i class='fa-solid fa-spinner fa-spin'></i> Memproses dengan ${selectedModel}...`;
        generateBtn.disabled = true;
        outputArea.value = "Menghubungkan ke server AI... (Tunggu sebentar)";

        const promptSystem = `Kamu adalah produser konten kreatif. Buatkan paket konten video pendek (reels/shorts) bergaya quote emosional berdasarkan ide: "${ide}".

Berikan hasil HANYA dalam format berikut tanpa basa-basi:

[1. TEKS VISUAL]
(Tulis 1-2 kalimat puitis/punchy yang akan diletakkan di tengah video)

[2. SKRIP NARASI (VOICEOVER)]
(Tulis naskah untuk diucapkan tanpa menyertakan tanda kurung jeda/instruksi agar bisa langsung dibaca oleh sistem TTS)

[3. ARAHAN VISUAL (B-ROLL)]
(Deskripsikan video latar belakang yang cocok, misal: Suasana hujan dari dalam mobil, tone gelap, dll)

[4. CAPTION DISTRIBUSI]
(Tulis caption memancing interaksi, akhiri dengan hashtag)

[5. YOUTUBE METADATA]
Judul: (Judul penasaran)
Deskripsi: (1 paragraf deskripsi yang mengandung kata kunci SEO)`;

        try {
            const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${selectedModel}:generateContent?key=${apiKey}`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ contents: [{ parts: [{ text: promptSystem }] }] })
            });

            const data = await response.json();
            if (!response.ok) throw new Error(data.error?.message || "Kesalahan tidak dikenal.");
            if (!data.candidates || data.candidates.length === 0) throw new Error("Tidak ada hasil.");

            const hasil = data.candidates[0].content.parts[0].text;
            outputArea.value = hasil;
            
            try {
                localStorage.setItem("secarikKertas_backup", hasil);
            } catch (e) {}

        } catch (error) {
            outputArea.value = `❌ GAGAL MEMPROSES:\n\n${error.message}`;
        } finally {
            generateBtn.innerHTML = "<i class='fa-solid fa-bolt'></i> Generate 5-in-1 Output";
            generateBtn.disabled = false;
        }
    });

    // Fitur Salin & Download Teks
    copyBtn.addEventListener("click", async () => {
        if (!outputArea.value || outputArea.value.startsWith("❌")) return;
        try { await navigator.clipboard.writeText(outputArea.value); alert("Teks disalin!"); } 
        catch (err) { alert("Browser tidak mendukung salin otomatis."); }
    });

    downloadBtn.addEventListener("click", () => {
        if (!outputArea.value || outputArea.value.startsWith("❌")) return;
        const blob = new Blob([outputArea.value], { type: "text/plain" });
        const a = document.createElement("a");
        a.href = URL.createObjectURL(blob);
        a.download = `GudangKonten_${new Date().getTime()}.txt`;
        a.click();
    });
});
