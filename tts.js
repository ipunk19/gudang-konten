document.addEventListener("DOMContentLoaded", () => {
    const ttsInput = document.getElementById("ttsInput");
    const suaraTts = document.getElementById("suaraTts");
    const temperatureRange = document.getElementById("temperatureRange");
    const instruksiTts = document.getElementById("instruksiTts");
    const generateTtsBtn = document.getElementById("generateTtsBtn");
    const audioContainer = document.getElementById("audioContainer");
    const audioPlayer = document.getElementById("audioPlayer");
    const downloadAudioBtn = document.getElementById("downloadAudioBtn");

    generateTtsBtn.addEventListener("click", async () => {
        const apiKey = localStorage.getItem("geminiApiKey");
        const teks = ttsInput.value.trim();
        const selectedVoice = suaraTts.value;
        const temperatureVal = parseFloat(temperatureRange.value);
        const instruksi = instruksiTts.value.trim();

        if (!apiKey) {
            alert("❌ API Key belum disimpan! Silakan simpan dulu API Key di halaman Pabrik Konten.");
            return;
        }
        if (!teks) {
            alert("❌ Masukkan skrip narasi terlebih dahulu!");
            return;
        }

        generateTtsBtn.innerHTML = `<i class='fa-solid fa-spinner fa-spin'></i> Merender Suara (${selectedVoice})...`;
        generateTtsBtn.disabled = true;

        const finalPromptText = instruksi ? `[Instruksi: ${instruksi}] \n\n ${teks}` : teks;

        try {
            const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-3.8-flash-tts:generateContent?key=${apiKey}`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ 
                    contents: [{ 
                        parts: [{ text: finalPromptText }] 
                    }],
                    generationConfig: {
                        temperature: temperatureVal,
                        speechConfig: {
                            voiceConfig: {
                                prebuiltVoiceConfig: {
                                    voiceName: selectedVoice
                                }
                            }
                        }
                    }
                })
            });

            const data = await response.json();
            if (!response.ok) throw new Error(data.error?.message || "Gagal menghubungi server TTS.");

            const part = data.candidates[0].content.parts[0];
            if (part && part.inlineData) {
                const audioBase64 = part.inlineData.data;
                const mimeType = part.inlineData.mimeType || "audio/wav";
                const audioUrl = `data:${mimeType};base64,${audioBase64}`;
                
                audioPlayer.src = audioUrl;
                downloadAudioBtn.href = audioUrl;
                downloadAudioBtn.download = `Voiceover_${selectedVoice}_${new Date().getTime()}.wav`;
                
                audioContainer.style.display = "block";
            } else {
                throw new Error("API tidak mengembalikan data audio yang valid.");
            }

        } catch (error) {
            alert("❌ GAGAL MEMBUAT SUARA: " + error.message);
        } finally {
            generateTtsBtn.innerHTML = "<i class='fa-solid fa-play'></i> Generate Voice (3.8 Flash TTS)";
            generateTtsBtn.disabled = false;
        }
    });
});
