document.addEventListener("DOMContentLoaded", () => {
    const openQrisBtn = document.getElementById("openQrisBtn");
    const closeQrisBtn = document.getElementById("closeQrisBtn");
    const qrisModal = document.getElementById("qrisModal");

    // Buka Modal QRIS saat tombol "Traktir Kopi" diklik
    if (openQrisBtn) {
        openQrisBtn.addEventListener("click", () => {
            qrisModal.classList.add("active");
        });
    }

    // Tutup Modal QRIS saat tombol silang (x) diklik
    if (closeQrisBtn) {
        closeQrisBtn.addEventListener("click", () => {
            qrisModal.classList.remove("active");
        });
    }

    // Tutup Modal jika area luar kotak modal diklik
    if (qrisModal) {
        qrisModal.addEventListener("click", (e) => {
            if (e.target === qrisModal) {
                qrisModal.classList.remove("active");
            }
        });
    }
});
