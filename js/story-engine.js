(() => {
    "use strict";

    const PROGRESS_EVENT = "wsa:progress-updated";
    const POINTS_KEY = "wsa_story_points_v1";
    const CHAPTER_NUMBER = Number(document.body.dataset.chapter) || 1;
    const ART_BASE = "../art/";

    const state = {
        lines: [],
        visibleLines: [],
        currentIndex: 0,
        pointScores: {
            authenticity: 0,
            approval: 0,
            curiosity: 0,
            privacy: 0,
            reflection: 0
        },
        started: false,
        finished: false,

        typing: false,
        typingTimer: null,
        typingText: "",
        typingLine: null,
        auto: false,
        autoTimer: null
    };

    const elements = {};
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");

    function getElements() {
        const ids = {
            intro: "chapterIntro",
            visualNovel: "visualNovel",
            sceneName: "sceneName",
            sceneTime: "sceneTime",
            artStage: "artStage",
            artPlaceholder: "artPlaceholder",
            stageCaption: "stageCaption",
            dialoguePanel: "dialoguePanel",
            speakerNameplate: "speakerNameplate",
            speaker: "speaker",
            clickHint: "clickHint",
            dialogueText: "dialogueText",
            sceneCounter: "sceneCounter",
            dialogueProgress: "dialogueProgress",
            progressFill: "progressFill",
            dialogueNavigation: "dialogueNavigation",
            previousButton: "previousLine",
            nextButton: "nextLine",
            choices: "choices",
            completion: "chapterComplete",
            autoToggle: "autoToggle",
            announce: "dialogueAnnounce"
        };

        for (const [key, id] of Object.entries(ids)) {
            elements[key] = document.getElementById(id);
        }
    }

    function getProgress() {
        return window.Progress || null;
    }

    function loadPointScores() {
        try {
            const saved = JSON.parse(localStorage.getItem(POINTS_KEY));

            if (saved && typeof saved === "object") {
                for (const key of Object.keys(state.pointScores)) {
                    const value = Number(saved[key]);
                    state.pointScores[key] = Number.isFinite(value) ? value : 0;
                }
            }
        } catch (error) {
            console.warn("Could not load story points.", error);
        }
    }

    function savePointScores() {
        try {
            localStorage.setItem(POINTS_KEY, JSON.stringify(state.pointScores));
        } catch (error) {
            console.warn("Could not save story points.", error);
        }
    }

    function resetPointScores() {
        for (const key of Object.keys(state.pointScores)) {
            state.pointScores[key] = 0;
        }

        savePointScores();
    }

    function getSavedChoice(key) {
        const progress = getProgress();

        if (!progress || typeof progress.getChoice !== "function") {
            return null;
        }

        return progress.getChoice(key);
    }

    function conditionIsMet(condition) {
        if (!condition) return true;

        if (condition.choice) {
            if (getSavedChoice(condition.choice) !== condition.value) {
                return false;
            }
        }

        if (condition.point) {
            const score = state.pointScores[condition.point] || 0;
            const target = Number(condition.value);

            switch (condition.operator || ">=") {
                case ">":
                    if (!(score > target)) return false;
                    break;
                case "<":
                    if (!(score < target)) return false;
                    break;
                case "<=":
                    if (!(score <= target)) return false;
                    break;
                case "===":
                    if (!(score === target)) return false;
                    break;
                case ">=":
                default:
                    if (!(score >= target)) return false;
                    break;
            }
        }

        if (condition.ending) {
            const endings = window.WSAEndings;

            if (!endings || endings.resolve(state.pointScores) !== condition.ending) {
                return false;
            }
        }

        return true;
    }

    function refreshVisibleLines() {
        state.visibleLines = state.lines.filter((line) =>
            conditionIsMet(line.condition)
        );
    }

    function getLineAt(index) {
        return state.visibleLines[index] || null;
    }

    function getOriginalLineIndex(line) {
        return state.lines.indexOf(line);
    }

    const art = { bg: null, castKey: "", prop: null, castEl: null, propEl: null };

    function parseCast(cast) {
        if (!cast) return [];

        const items = typeof cast === "string" ? cast.split(/\s+/).filter(Boolean) : cast;

        return items.map((item) => {
            if (typeof item !== "string") return item;

            const [head, at] = item.split("@");
            const [who, mood] = head.split(":");

            return { who, mood: mood || "neutral", at: at || "center" };
        });
    }

    function showPlaceholder(text) {
        if (!elements.artPlaceholder) return;

        elements.artPlaceholder.hidden = false;
        elements.artPlaceholder.replaceChildren();

        const label = document.createElement("p");
        label.className = "art-placeholder-label";
        label.textContent = "ART MISSING";

        const name = document.createElement("p");
        name.className = "art-placeholder-name";
        name.textContent = text.replaceAll("-", " ").toUpperCase();

        elements.artPlaceholder.append(label, name);
    }

    function setBackground(name) {
        if (!elements.artStage || art.bg === name) return;

        art.bg = name;

        if (elements.artPlaceholder) elements.artPlaceholder.hidden = true;
        if (!name) return;

        const layer = document.createElement("div");
        layer.className = "scene-art scene-bg";

        const img = document.createElement("img");
        img.alt = "";
        img.decoding = "async";
        img.addEventListener("error", () => showPlaceholder(name));
        img.src = `${ART_BASE}backgrounds/${name}.svg`;
        layer.append(img);

        const old = elements.artStage.querySelectorAll(".scene-bg");
        elements.artStage.insertBefore(layer, elements.artStage.querySelector(".scene-cast, .scene-prop, .art-placeholder, .stage-overlay"));

        window.setTimeout(() => old.forEach((node) => node.remove()), 700);
    }

    function ensureLayer(key, className) {
        if (art[key] && art[key].isConnected) return art[key];

        const el = document.createElement("div");
        el.className = className;
        el.setAttribute("aria-hidden", "true");

        const overlay = elements.artStage.querySelector(".stage-overlay");
        elements.artStage.insertBefore(el, overlay);
        art[key] = el;

        return el;
    }

    function setCast(list, speakerKey) {
        const layer = ensureLayer("castEl", "scene-cast");
        const key = list.map((c) => `${c.who}:${c.mood}@${c.at}`).join(" ");

        if (key !== art.castKey) {
            art.castKey = key;
            layer.replaceChildren();

            list.forEach((c) => {
                const img = document.createElement("img");
                img.className = "cast-member";
                img.dataset.who = c.who;
                img.dataset.at = c.at;
                img.alt = "";
                img.decoding = "async";

                const neutral = `${ART_BASE}characters/${c.who}-neutral.svg`;
                img.addEventListener("error", () => {
                    if (!img.src.endsWith(`${c.who}-neutral.svg`)) img.src = neutral;
                });
                img.src = `${ART_BASE}characters/${c.who}-${c.mood}.svg`;
                layer.append(img);
            });
        }

        const speaking = list.some((c) => c.who === speakerKey);

        layer.querySelectorAll(".cast-member").forEach((img) => {
            img.classList.toggle("is-dim", speaking && img.dataset.who !== speakerKey);
        });
    }

    function setProp(name) {
        const layer = ensureLayer("propEl", "scene-prop");

        if (art.prop === (name || "")) return;
        art.prop = name || "";
        layer.replaceChildren();
        layer.classList.toggle("has-prop", Boolean(name));

        if (!name) return;

        const img = document.createElement("img");
        img.alt = "";
        img.decoding = "async";
        img.src = `${ART_BASE}props/${name}.svg`;
        layer.append(img);
    }

    function preloadLine(line) {
        if (!line) return;

        const urls = [];

        if (line.background) urls.push(`backgrounds/${line.background}.svg`);
        if (line.image) urls.push(`props/${line.image}.svg`);
        parseCast(line.cast).forEach((c) => urls.push(`characters/${c.who}-${c.mood}.svg`));

        urls.forEach((url) => {
            const img = new Image();
            img.src = ART_BASE + url;
        });
    }

    function updateScene(line) {
        if (elements.sceneName) {
            elements.sceneName.textContent = line.scene || "UNKNOWN LOCATION";
        }

        if (elements.sceneTime) {
            elements.sceneTime.textContent = line.time || "";
        }

        if (elements.artStage) {
            elements.artStage.dataset.background = line.background || "";
            elements.artStage.dataset.image = line.image || "";

            setBackground(line.background || "");
            setCast(parseCast(line.cast), (line.speaker || "").toLowerCase());
            setProp(line.image || "");
        }

        if (elements.stageCaption) {
            elements.stageCaption.textContent = line.caption || "";
        }

        preloadLine(getLineAt(state.currentIndex + 1));
        preloadLine(getLineAt(state.currentIndex + 2));
    }

    function updateSpeaker(line) {
        const speakerName = line.speaker || "NARRATION";
        const speakerKey = speakerName.toLowerCase().replaceAll(" ", "-");

        if (elements.speaker) {
            elements.speaker.textContent = speakerName;
        }

        if (elements.speakerNameplate) {
            elements.speakerNameplate.dataset.speaker = speakerKey;
        }

        if (elements.dialoguePanel) {
            elements.dialoguePanel.dataset.speaker = speakerKey;
        }
    }

    function updateProgressDisplay() {
        const total = state.visibleLines.length;
        const current = total === 0 ? 0 : state.currentIndex + 1;
        const percentage = total === 0 ? 0 : (current / total) * 100;

        if (elements.sceneCounter) {
            elements.sceneCounter.textContent = `${current} / ${total}`;
        }

        if (elements.progressFill) {
            elements.progressFill.style.width = `${percentage}%`;
        }

        if (elements.dialogueProgress) {
            elements.dialogueProgress.setAttribute("aria-valuenow", String(current));
            elements.dialogueProgress.setAttribute("aria-valuemax", String(total));
        }

        if (elements.previousButton) {
            elements.previousButton.disabled = state.currentIndex <= 0;
        }

        if (elements.nextButton) {
            elements.nextButton.disabled =
                total === 0 || state.currentIndex >= total - 1;
        }
    }

    function savePosition(line) {
        const progress = getProgress();

        if (
            progress &&
            typeof progress.setChapterPosition === "function"
        ) {
            const originalIndex = getOriginalLineIndex(line);

            if (originalIndex >= 0) {
                progress.setChapterPosition(CHAPTER_NUMBER, originalIndex);
            }
        }
    }

    function dispatchProgressUpdate() {
        window.dispatchEvent(new CustomEvent(PROGRESS_EVENT));
    }

    function clearChoices() {
        if (elements.choices) {
            elements.choices.replaceChildren();
            elements.choices.classList.add("hidden");
        }

        if (elements.dialogueNavigation) {
            elements.dialogueNavigation.classList.remove("hidden");
        }

        if (elements.clickHint) {
            elements.clickHint.classList.remove("hidden");
        }
    }

    function recordChoice(choice) {
        const progress = getProgress();

        if (progress && typeof progress.recordChoice === "function") {
            progress.recordChoice(choice.key, choice.value);
        }

        if (choice.points && typeof choice.points === "object") {
            for (const [category, amount] of Object.entries(choice.points)) {
                if (!(category in state.pointScores)) {
                    state.pointScores[category] = 0;
                }

                const points = Number(amount);

                if (Number.isFinite(points)) {
                    state.pointScores[category] += points;
                }
            }

            savePointScores();
        }

        dispatchProgressUpdate();
    }

    function renderChoices(choices) {
        if (!elements.choices) return;

        elements.choices.replaceChildren();
        elements.choices.classList.remove("hidden");

        if (elements.clickHint) {
            elements.clickHint.classList.add("hidden");
        }

        choices.forEach((choice, index) => {
            const button = document.createElement("button");
            button.type = "button";
            button.className = "choice-button";
            button.textContent = choice.text || `Choice ${index + 1}`;

            button.addEventListener("click", () => {
                if (button.disabled || state.finished) return;

                elements.choices.querySelectorAll("button").forEach((item) => {
                    item.disabled = true;
                });

                const currentLine = getLineAt(state.currentIndex);
                const choiceIndex = currentLine ? getOriginalLineIndex(currentLine) : -1;
                const progress = getProgress();

                if (progress && choiceIndex >= 0) {
                    if (typeof progress.trimMemoryLog === "function") {
                        progress.trimMemoryLog(CHAPTER_NUMBER, choiceIndex);
                    }

                    if (typeof progress.logLine === "function") {
                        progress.logLine(CHAPTER_NUMBER, {
                            i: choiceIndex,
                            kind: "choice",
                            text: choice.text || ""
                        });
                    }
                }

                const previousValue = getSavedChoice(choice.key);
                const previousChoice = previousValue === null ? null : (currentLine?.choices || []).find((item) => item.value === previousValue);

                if (previousChoice?.points) {
                    for (const [category, amount] of Object.entries(
                        previousChoice.points
                    )) {
                        if (category in state.pointScores) {
                            state.pointScores[category] = Math.max(0, state.pointScores[category] - (Number(amount) || 0));
                        }
                    }
                }

                recordChoice(choice);
                savePointScores();
                clearChoices();
                refreshVisibleLines();

                const nextIndex = state.visibleLines.findIndex(
                    (line) => getOriginalLineIndex(line) > choiceIndex
                );

                if (nextIndex === -1) {
                    finishChapter();
                    return;
                }

                state.currentIndex = nextIndex;
                renderCurrentLine();
            });

            elements.choices.append(button);
        });
    }

    const TYPE_DELAY = 22;

    function setPanelState(value) {
        if (elements.dialoguePanel) {
            elements.dialoguePanel.dataset.state = value;
        }
    }

    function cancelTyping() {
        if (state.typingTimer !== null) {
            window.clearTimeout(state.typingTimer);
            state.typingTimer = null;
        }

        state.typing = false;
    }

    function clearAutoTimer() {
        if (state.autoTimer !== null) {
            window.clearTimeout(state.autoTimer);
            state.autoTimer = null;
        }
    }

    function scheduleAuto() {
        clearAutoTimer();

        if (!state.auto || state.typing || state.finished) return;

        const line = getLineAt(state.currentIndex);

        if (!line) return;

        if (Array.isArray(line.choices) && line.choices.length > 0) return;

        if (state.currentIndex >= state.visibleLines.length - 1) {
            setAuto(false);
            return;
        }

        const delay = 1400 + (line.text || "").length * 28;

        state.autoTimer = window.setTimeout(autoAdvance, delay);
    }

    function setAuto(on) {
        state.auto = Boolean(on);

        if (elements.autoToggle) {
            elements.autoToggle.setAttribute("aria-pressed", String(state.auto));
        }

        if (state.auto) {
            scheduleAuto();
        } else {
            clearAutoTimer();
        }
    }

    function renderTyped(text, count) {
        if (!elements.dialogueText) return;

        const rest = document.createElement("span");
        rest.className = "dialogue-rest";
        rest.textContent = text.slice(count);

        elements.dialogueText.replaceChildren(document.createTextNode(text.slice(0, count)), rest);
    }

    function finishTyping() {
        cancelTyping();

        const line = state.typingLine;

        if (!line || state.finished) return;

        if (Array.isArray(line.choices) && line.choices.length > 0) {
            setPanelState("choice");
            renderChoices(line.choices);
            return;
        }

        setPanelState("ready");
        scheduleAuto();
    }

    function completeTyping() {
        if (!state.typing) return false;

        cancelTyping();

        if (elements.dialogueText) {
            elements.dialogueText.textContent = state.typingText;
        }

        finishTyping();
        return true;
    }

    function delayAfter(character) {
        if (/[.!?…]/.test(character)) return 170;
        if (/[,;:—]/.test(character)) return 85;

        return TYPE_DELAY;
    }

    function showLineText(line) {
        const text = line.text || "";
        const speakerName = line.speaker || "NARRATION";

        cancelTyping();
        clearAutoTimer();

        state.typingLine = line;
        state.typingText = text;

        if (elements.announce) {
            elements.announce.textContent = speakerName.toUpperCase() === "NARRATION" ? text : `${speakerName}: ${text}`;
        }

        if (!elements.dialogueText || !text || reducedMotion.matches) {
            if (elements.dialogueText) {
                elements.dialogueText.textContent = text;
            }

            finishTyping();
            return;
        }

        state.typing = true;
        setPanelState("typing");
        renderTyped(text, 0);

        let count = 0;

        const step = () => {
            count += 1;
            renderTyped(text, count);

            if (count >= text.length) {
                finishTyping();
                return;
            }

            state.typingTimer = window.setTimeout(step, delayAfter(text[count - 1]));
        };

        state.typingTimer = window.setTimeout(step, 120);
    }

    function renderCurrentLine() {
        if (!state.started || state.finished) return;

        refreshVisibleLines();

        if (state.visibleLines.length === 0) {
            finishChapter();
            return;
        }

        if (state.currentIndex >= state.visibleLines.length) {
            state.currentIndex = state.visibleLines.length - 1;
        }

        const line = getLineAt(state.currentIndex);

        if (!line) {
            finishChapter();
            return;
        }

        clearChoices();
        updateScene(line);
        updateSpeaker(line);

        const progress = getProgress();
        const originalIndex = getOriginalLineIndex(line);

        if (progress && typeof progress.logLine === "function") {
            progress.logLine(CHAPTER_NUMBER, {
                i: originalIndex,
                kind: "line",
                speaker: line.speaker || "NARRATION",
                text: line.text || "",
                scene: line.scene || "",
                time: line.time || ""
            });
        }

        updateProgressDisplay();
        savePosition(line);
        showLineText(line);
    }

    function advanceLine() {
        if (!state.started || state.finished) return;

        if (completeTyping()) return;

        const currentLine = getLineAt(state.currentIndex);

        if (currentLine && Array.isArray(currentLine.choices) && currentLine.choices.length > 0) {
            return;
        }

        if (state.currentIndex >= state.visibleLines.length - 1) {
            finishChapter();
            return;
        }

        state.currentIndex += 1;
        renderCurrentLine();
    }

    function advance() {
        setAuto(false);
        advanceLine();
    }

    function autoAdvance() {
        state.autoTimer = null;
        advanceLine();
    }

    function goBack() {
        if (!state.started || state.finished || state.currentIndex <= 0) {
            return;
        }

        setAuto(false);
        state.currentIndex -= 1;
        renderCurrentLine();
    }

    function finishChapter() {
        if (state.finished) return;

        state.finished = true;
        cancelTyping();
        clearAutoTimer();
        clearChoices();

        if (elements.visualNovel) {
            elements.visualNovel.classList.add("hidden");
        }

        if (elements.completion) {
            elements.completion.classList.remove("hidden");
        }

        const progress = getProgress();

        if (progress && typeof progress.completeChapter === "function") {
            progress.completeChapter(CHAPTER_NUMBER);
        }

        if (progress && typeof progress.clearChapterPosition === "function") {
            progress.clearChapterPosition(CHAPTER_NUMBER);
        }

        dispatchProgressUpdate();
    }

    function startChapter(options = {}) {
        const chapter = (window.WSAChapters && window.WSAChapters[CHAPTER_NUMBER]) || (CHAPTER_NUMBER === 1 ? window.ChapterOne : null);

        if (!chapter || !Array.isArray(chapter.lines) || chapter.lines.length === 0) {
            console.error(`Chapter ${CHAPTER_NUMBER} dialogue is missing or empty. Check chapter-${CHAPTER_NUMBER}.js.`);
            return false;
        }

        if (state.started && !state.finished) return true;

        const resume = options.resume === true;

        state.lines = chapter.lines;
        state.started = false;
        state.finished = false;

        if (!resume && CHAPTER_NUMBER === 1) {
            resetPointScores();
        } else {
            loadPointScores();
        }

        refreshVisibleLines();

        const progress = getProgress();
        const savedPosition = resume && progress && typeof progress.getChapterPosition === "function" ? Number(progress.getChapterPosition(CHAPTER_NUMBER)) : 0;
        const validSavedPosition = Number.isInteger(savedPosition) && savedPosition >= 0 && savedPosition < state.lines.length;
        const savedLine = validSavedPosition ? state.lines[savedPosition] : null;

        let visibleIndex = savedLine ? state.visibleLines.indexOf(savedLine) : -1;

        if (visibleIndex < 0 && savedLine) {
            const originalIndex = savedPosition;

            visibleIndex = state.visibleLines.findIndex(
                (line) => getOriginalLineIndex(line) > originalIndex
            );
        }

        state.currentIndex = visibleIndex >= 0 ? visibleIndex : 0;
        state.started = true;

        if (elements.intro) {
            elements.intro.classList.add("hidden");
        }

        if (elements.visualNovel) {
            elements.visualNovel.classList.remove("hidden");
        }

        if (elements.completion) {
            elements.completion.classList.add("hidden");
        }

        renderCurrentLine();
        return true;
    }

    function bindEvents() {
        if (elements.autoToggle) {
            elements.autoToggle.addEventListener("click", () => {
                setAuto(!state.auto);
            });
        }

        if (elements.nextButton) {
            elements.nextButton.addEventListener("click", advance);
        }

        if (elements.previousButton) {
            elements.previousButton.addEventListener("click", goBack);
        }

        if (elements.visualNovel) {
            elements.visualNovel.addEventListener("click", (event) => {
                if (event.target.closest("button") || event.target.closest("a") || event.target.closest(".choices")) {
                    return;
                }

                advance();
            });
        }


        document.addEventListener("keydown", (event) => {
            if (event.defaultPrevented || event.repeat) return;

            const target = event.target;

            if (target instanceof HTMLElement && (target.isContentEditable || target.closest("button, a, input, textarea, select"))) {
                return;
            }

            if (event.key === "ArrowRight" || event.key === " " || event.key === "Enter") {
                event.preventDefault();
                advance();
            } else if (event.key === "ArrowLeft") {
                event.preventDefault();
                goBack();
            }
        });
    }

    function init() {
        getElements();
        loadPointScores();
        bindEvents();

        window.StoryEngine = Object.freeze({
            getPoints() {
                return { ...state.pointScores };
            },
            getPoint(category) {
                return state.pointScores[category] || 0;
            },
            resetPoints: resetPointScores,
            start: startChapter,
            advance,
            goBack
        });
    }

    if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", init);
    } else {
        init();
    }
})();