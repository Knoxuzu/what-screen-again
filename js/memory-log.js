(() => {
    "use strict";

    const TOTAL_ACTS = 7;
    const STORAGE_KEY = "wsa_story_progress_v1";

    const ACTS = Array.isArray(window.WSAActs) ? window.WSAActs.map((act) => act.chapterTitle) : [];

    if (ACTS.length !== TOTAL_ACTS) {
        console.error("WSA: js/acts.js must load before memory-log.js.");
        return;
    }

    const shelfScreen = document.getElementById("shelfScreen");
    const bookRow = document.getElementById("bookRow");
    const shelfMessage = document.getElementById("shelfMessage");
    const progressLabel = document.getElementById("progressLabel");
    const progressFill = document.getElementById("progressFill");

    const reader = document.getElementById("bookReader");
    const readerBackdrop = document.getElementById("readerBackdrop");
    const readerTitle = document.getElementById("readerTitle");
    const readerAct = document.getElementById("readerAct");
    const readerSubtitle = document.getElementById("readerSubtitle");
    const readerContent = document.getElementById("readerContent");
    const readerEntryCount = document.getElementById("readerEntryCount");
    const closeReaderButton = document.getElementById("closeReader");

    let activeBook = null;
    let openToken = 0;

    function readSavedProgress() {
        try {
            if (window.Progress && typeof window.Progress.getCompletedChapters === "function") {
                return { completedChapters: window.Progress.getCompletedChapters(), memoryLog: null };
            }

            const raw = localStorage.getItem(STORAGE_KEY);

            if (!raw) {
                return { completedChapters: [], memoryLog: {} };
            }

            const data = JSON.parse(raw);

            return {
                completedChapters: Array.isArray(data.completedChapters) ? data.completedChapters : [],
                memoryLog: data.memoryLog && typeof data.memoryLog === "object" ? data.memoryLog : {}
            };
        } catch (error) {
            console.warn("Could not read saved story progress.", error);

            return {
                completedChapters: [],
                memoryLog: {}
            };
        }
    }

    function getCompletedActs(progress) {
        return new Set(progress.completedChapters.map(Number).filter(number => Number.isInteger(number) && number >= 1 && number <= TOTAL_ACTS));
    }

    function createElement(tag, className, text) {
        const element = document.createElement(tag);

        if (className) {
            element.className = className;
        }

        if (text !== undefined) {
            element.textContent = text;
        }

        return element;
    }

    function createBook(actNumber, completed) {
        const button = document.createElement("button");
        button.type = "button";
        button.className = "memory-book";
        button.style.setProperty("--book-delay", `${(actNumber - 1) * 70}ms`);

        button.setAttribute("aria-label", completed ? `Open Act ${actNumber}: ${ACTS[actNumber - 1]}` : `Act ${actNumber}: undiscovered memory`);

        const spine = createElement("span", "book-spine");
        const number = createElement("span", "book-number", String(actNumber).padStart(2, "0"));
        const title = createElement("span", "book-title", ACTS[actNumber - 1]);
        const seal = createElement("span", "book-seal", completed ? "✧" : "·");

        spine.append(number, title, seal);
        button.append(spine);

        if (completed) {
            button.classList.add("earned");
            button.addEventListener("click", () => openBook(actNumber, button));
        } else {
            button.classList.add("unearned");
            button.disabled = true;
            button.setAttribute("aria-disabled", "true");

            if (actNumber === 1) {
                button.classList.add("blank");
                button.setAttribute("aria-label", "Act I: blank book; complete the chapter to reveal its memories");
            }
        }

        return button;
    }

    function renderShelf() {
        const progress = readSavedProgress();
        const completed = getCompletedActs(progress);

        bookRow.replaceChildren();

        for (let act = 1; act <= TOTAL_ACTS; act += 1) {
            bookRow.appendChild(createBook(act, completed.has(act)));
        }

        const count = completed.size;

        progressLabel.textContent = `${count} / ${TOTAL_ACTS} MEMORIES`;
        progressFill.style.width = `${(count / TOTAL_ACTS) * 100}%`;

        if (count === 0) {
            shelfMessage.textContent = "Some memories have yet to be written.";
        } else if (count === TOTAL_ACTS) {
            shelfMessage.textContent = "Every chapter has left something behind.";
        } else {
            shelfMessage.textContent = `${count} ${count === 1 ? "memory" : "memories"} preserved. More remain unwritten.`;
        }
    }


    function getEntriesForAct(actNumber) {
        if (window.Progress && typeof window.Progress.getMemoryLog === "function") {
            const entries = window.Progress.getMemoryLog(actNumber);
            return Array.isArray(entries) ? entries : [];
        }

        const progress = readSavedProgress();

        if (!progress.memoryLog) {
            return [];
        }

        if (Array.isArray(progress.memoryLog)) {
            return progress.memoryLog.filter(entry => Number(entry.chapter) === actNumber);
        }

        const entries = progress.memoryLog[actNumber];

        return Array.isArray(entries) ? entries : [];
    }

    function addSceneHeading(scene, time) {
        const heading = createElement("h3", "archive-scene-heading", time ? `${scene} · ${time}` : scene);

        readerContent.appendChild(heading);
    }

    function renderEntry(entry) {
        if (!entry || typeof entry !== "object") {
            return;
        }

        if (entry.kind === "choice") {
            const choice = createElement("article", "archive-entry choice");

            choice.append(
                createElement("p", "archive-choice-label", "YOUR CHOICE"),
                createElement("p", "archive-choice-text", typeof entry.text === "string" && entry.text.trim() ? entry.text : "Recorded choice")
            );

            readerContent.appendChild(choice);
            return;
        }

        if (entry.kind !== "line") {
            return;
        }

        const speaker = typeof entry.speaker === "string" ? entry.speaker : "NARRATION";
        const text = typeof entry.text === "string" ? entry.text : "";

        if (!text.trim()) {
            return;
        }

        const narration = speaker.toUpperCase() === "NARRATION";
        const article = createElement("article", `archive-entry${narration ? " narration" : ""}`);

        article.append(createElement("p", "archive-speaker", speaker), createElement("p", "archive-dialogue", text));

        readerContent.appendChild(article);
    }

    function openBook(actNumber, button) {
        const progress = readSavedProgress();
        const completed = getCompletedActs(progress);

        if (!completed.has(actNumber)) {
            renderShelf();
            return;
        }

        openToken += 1;
        const token = openToken;

        activeBook = button;

        readerTitle.textContent = ACTS[actNumber - 1];
        readerAct.textContent = `MEMORY FRAGMENT · ACT ${String(actNumber).padStart(2, "0")}`;
        readerSubtitle.textContent = "The moments that remain.";
        readerContent.replaceChildren();

        const entries = getEntriesForAct(actNumber);
        let renderedEntries = 0;
        let previousScene = "";

        entries.forEach(entry => {
            if (!entry || typeof entry !== "object") {
                return;
            }

            if (entry.kind === "line" && typeof entry.scene === "string" && entry.scene.trim() && entry.scene !== previousScene) {
                addSceneHeading(entry.scene, entry.time || "");
                previousScene = entry.scene;
            }

            if (entry.kind === "line" || entry.kind === "choice") {
                renderEntry(entry);
                renderedEntries += 1;
            }
        });

        if (renderedEntries === 0) {
            readerContent.appendChild(
                createElement(
                    "p", "archive-empty",
                    "This chapter has been completed, but no dialogue or choices have been recorded for it yet. Play the chapter with progress logging enabled, then return here to see its memories."
                )
            );
        }

        readerEntryCount.textContent = `${renderedEntries} ${renderedEntries === 1 ? "ENTRY" : "ENTRIES"}`;

        shelfScreen.classList.add("leaving");
        button.classList.add("opening");

        reader.classList.add("open");
        reader.setAttribute("aria-hidden", "false");

        closeReaderButton.focus({ preventScroll: true });

        window.setTimeout(() => {
            if (token !== openToken) {
                return;
            }

            readerContent.scrollTop = 0;
        }, 50);
    }

    function closeBook() {
        if (!reader.classList.contains("open")) {
            return;
        }

        openToken += 1;

        reader.classList.remove("open");
        reader.setAttribute("aria-hidden", "true");
        shelfScreen.classList.remove("leaving");

        if (activeBook) {
            activeBook.classList.remove("opening");
            activeBook.focus({ preventScroll: true });
        }

        activeBook = null;
        renderShelf();
    }

    closeReaderButton.addEventListener("click", closeBook);
    readerBackdrop.addEventListener("click", closeBook);

    document.addEventListener("keydown", event => {
        if (event.key === "Escape") {
            closeBook();
        }
    });

    window.addEventListener("wsa:progress-updated", renderShelf);
    window.addEventListener("wsa:act-completed", renderShelf);
    window.addEventListener("storage", event => {
        if (!event.key || event.key === STORAGE_KEY) {
            renderShelf();
        }
    });
    window.addEventListener("pageshow", renderShelf);

    renderShelf();
})();