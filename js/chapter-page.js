(() => {
    "use strict";

    // Builds chapters/chapter.html for ?act=N, then loads that act's dialogue
    // and the story engine in a fixed order.

    const TOTAL_ACTS = 7;
    const params = new URLSearchParams(window.location.search);
    const act = Number(params.get("act"));
    const acts = window.WSAActs;
    const meta = window.WSAChapterMeta && window.WSAChapterMeta[act];

    if (!Number.isInteger(act) || act < 1 || act > TOTAL_ACTS || !acts || !meta) {
        window.location.replace("../chapters.html");
        return;
    }

    const info = acts[act - 1];
    const roman = info.title.replace(/^Act\s+/i, "");
    const pad = String(act).padStart(2, "0");

    document.body.dataset.chapter = String(act);
    document.title = `${info.title}: ${info.chapterTitle} | What Screen Again?`;

    const description = document.getElementById("pageDescription");
    if (description) {
        description.setAttribute("content", `${info.title}: ${info.chapterTitle} — What Screen Again?, an interactive visual novel.`);
    }

    const text = {
        ...meta,
        frame: `FRAME ${pad} / ${String(acts.length).padStart(2, "0")}`,
        fragment: `MEMORY FRAGMENT ${pad}`,
        actLabel: info.title.toUpperCase(),
        endLabelEyebrow: `END OF CHAPTER ${roman}`
    };

    document.querySelectorAll("[data-meta]").forEach((el) => {
        const value = text[el.dataset.meta];
        if (typeof value === "string") el.textContent = value;
    });

    meta.notices.forEach(([symbol, label], index) => {
        const symbolEl = document.querySelector(`[data-notice-symbol="${index}"]`);
        const textEl = document.querySelector(`[data-notice-text="${index}"]`);
        if (symbolEl) symbolEl.textContent = symbol;
        if (textEl) textEl.textContent = label;
    });

    // Wrap each title word so the CSS can reveal them one after another.
    let wordIndex = 0;
    document.querySelectorAll(".chapter-intro h1 [data-meta]").forEach((part) => {
        const pieces = part.textContent.split(/(\s+)/);
        part.textContent = "";

        pieces.forEach((piece) => {
            if (!piece) return;

            if (/^\s+$/.test(piece)) {
                part.append(piece);
                return;
            }

            const word = document.createElement("span");
            word.className = "title-word";
            word.style.setProperty("--i", String(wordIndex++));
            word.textContent = piece;
            part.append(word);
        });
    });

    const endLink = document.getElementById("endLink");
    if (endLink) endLink.setAttribute("href", meta.endHref);

    const sources = [
        "../js/chapterdialogues/helpers.js",
        `../js/chapterdialogues/chapter-${act}.js`,
        "../js/endings.js",
        "../js/story-engine.js",
        "../js/chapter-opening.js"
    ];

    sources.forEach((src) => {
        const script = document.createElement("script");
        script.src = src;
        script.async = false; // keep execution in this order
        script.addEventListener("error", () => console.error(`WSA: could not load ${src}.`));
        document.head.append(script);
    });
})();
