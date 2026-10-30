(() => {
    "use strict";

    const box = document.getElementById("titleNote");
    const text = document.getElementById("titleNoteText");

    if (!box || !text) return;

    const KEY = "wsa_reflection_journal_v1";

    function render() {
        let note = "";

        try {
            note = (localStorage.getItem(KEY) || "").trim();
        } catch (e) { }
        text.textContent = note;
        box.hidden = !note;
    }

    render();
    window.addEventListener("pageshow", render);
    window.addEventListener("storage", (e) => { if (e.key === KEY || e.key === null) render(); });
})();