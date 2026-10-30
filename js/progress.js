(() => {
    "use strict";

    const STORAGE_KEY = "wsa_story_progress_v1";
    const TOTAL_CHAPTERS = 7;

    const createDefaultState = () => ({
        version: 1,
        lastChapter: 1,
        completedChapters: [],
        choices: {},
        chapterPositions: {},
        memoryLog: {},
        updatedAt: null
    });

    function isPlainObject(value) {
        return value !== null && typeof value === "object" && !Array.isArray(value);
    }

    function isValidChapter(value) {
        return Number.isInteger(value) && value >= 1 && value <= TOTAL_CHAPTERS;
    }

    function loadState() {
        try {
            const stored = localStorage.getItem(STORAGE_KEY);

            if (!stored) return createDefaultState();

            const parsed = JSON.parse(stored);

            if (!isPlainObject(parsed) || parsed.version !== 1) {
                return createDefaultState();
            }

            const completedChapters = Array.isArray(parsed.completedChapters) ? [...new Set(parsed.completedChapters.filter(isValidChapter))].sort((a, b) => a - b) : [];
            const choices = isPlainObject(parsed.choices) ? parsed.choices : {};
            const chapterPositions = {};

            if (isPlainObject(parsed.chapterPositions)) {
                Object.entries(parsed.chapterPositions).forEach(
                    ([chapter, position]) => {
                        const number = Number(chapter);

                        if (isValidChapter(number) && Number.isInteger(position) && position >= 0) {
                            chapterPositions[number] = position;
                        }
                    }
                );
            }

            const memoryLog = {};

            if (isPlainObject(parsed.memoryLog)) {
                Object.entries(parsed.memoryLog).forEach(
                    ([chapter, entries]) => {
                        const number = Number(chapter);

                        if (isValidChapter(number) && Array.isArray(entries)) {
                            memoryLog[number] = entries.filter((entry) => isPlainObject(entry) && Number.isInteger(entry.i) && entry.i >= 0);
                        }
                    }
                );
            }

            const lastChapter = isValidChapter(parsed.lastChapter) ? parsed.lastChapter : 1;

            return {
                ...createDefaultState(),
                ...parsed,
                lastChapter,
                completedChapters,
                choices,
                chapterPositions,
                memoryLog
            };
        } catch (error) {
            console.warn("WSA: Could not load saved progress.", error);
            return createDefaultState();
        }
    }

    let state = loadState();

    function saveState() {
        state.updatedAt = new Date().toISOString();

        try {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
            return true;
        } catch (error) {
            console.warn("WSA: Could not save progress.", error);
            return false;
        }
    }

    function getSnapshot() {
        return JSON.parse(JSON.stringify(state));
    }

    function getProgressSummary() {
        return {
            completedChapters: state.completedChapters.length,
            choicesRecorded: Object.keys(state.choices).length,
            lastChapter: getLastChapter(),
            chapterPositions: { ...state.chapterPositions }
        };
    }

    function isChapterUnlocked(chapterNumber) {
        if (!isValidChapter(chapterNumber)) return false;
        if (chapterNumber === 1) return true;

        return state.completedChapters.includes(chapterNumber - 1);
    }

    function getLastChapter() {
        return isValidChapter(state.lastChapter) ? state.lastChapter : 1;
    }

    function setLastChapter(chapterNumber) {
        if (!isValidChapter(chapterNumber) || !isChapterUnlocked(chapterNumber)) {
            return false;
        }

        state.lastChapter = chapterNumber;
        return saveState();
    }

    function getCompletedChapters() {
        return [...state.completedChapters].sort((a, b) => a - b);
    }

    function getCompletedCount() {
        return state.completedChapters.length;
    }

    function isChapterCompleted(chapterNumber) {
        return isValidChapter(chapterNumber) && state.completedChapters.includes(chapterNumber);
    }

    function completeChapter(chapterNumber) {
        if (!isValidChapter(chapterNumber)) return false;

        if (!state.completedChapters.includes(chapterNumber)) {
            state.completedChapters.push(chapterNumber);
            state.completedChapters.sort((a, b) => a - b);
        }

        if (chapterNumber < TOTAL_CHAPTERS) {
            state.lastChapter = chapterNumber + 1;
        }

        const saved = saveState();

        window.dispatchEvent(new CustomEvent("wsa:act-completed", {
            detail: {
                act: chapterNumber,
                completedActs: getCompletedChapters(),
                unlockedAct: chapterNumber < TOTAL_CHAPTERS ? chapterNumber + 1 : null
            }
        }));

        return saved;
    }

    function getChoice(choiceId) {
        if (typeof choiceId !== "string") return null;

        return Object.prototype.hasOwnProperty.call(state.choices, choiceId) ? state.choices[choiceId] : null;
    }

    function recordChoice(choiceId, choiceValue) {
        if (typeof choiceId !== "string" || !choiceId.trim() || choiceValue === undefined) {
            return false;
        }

        state.choices[choiceId] = choiceValue;
        return saveState();
    }

    function getChoices() {
        return { ...state.choices };
    }

    function getChoiceCount() {
        return Object.keys(state.choices).length;
    }

    function getChapterPosition(chapterNumber) {
        if (!isValidChapter(chapterNumber)) return 0;

        const position = state.chapterPositions[chapterNumber];

        return Number.isInteger(position) && position >= 0 ? position : 0;
    }

    function setChapterPosition(chapterNumber, lineIndex) {
        if (!isValidChapter(chapterNumber) || !Number.isInteger(lineIndex) || lineIndex < 0) {
            return false;
        }

        state.chapterPositions[chapterNumber] = lineIndex;
        state.lastChapter = chapterNumber;

        return saveState();
    }

    function clearChapterPosition(chapterNumber) {
        if (!isValidChapter(chapterNumber)) return false;

        delete state.chapterPositions[chapterNumber];
        return saveState();
    }

    function logLine(act, entry) {
        if (!isValidChapter(act) || !isPlainObject(entry) || !Number.isInteger(entry.i) || entry.i < 0) {
            return false;
        }

        const list = (state.memoryLog[act] =
            state.memoryLog[act] || []);

        if (list.some((item) => item.i === entry.i && item.kind === entry.kind)) {
            return false;
        }

        const nextOrder = list.reduce((max, item) => Math.max(max, Number(item.order) || 0), 0) + 1;

        list.push({
            ...entry,
            order: nextOrder
        });

        return saveState();
    }

    function trimMemoryLog(act, afterIndex) {
        if (!isValidChapter(act) || !Number.isInteger(afterIndex) || afterIndex < 0 || !Array.isArray(state.memoryLog[act])) {
            return false;
        }

        state.memoryLog[act] = state.memoryLog[act].filter((entry) => entry.i < afterIndex || (entry.i === afterIndex && entry.kind !== "choice"));

        state.memoryLog[act].forEach((entry, index) => {
            entry.order = index + 1;
        });

        return saveState();
    }

    function getMemoryLog(act) {
        if (!isValidChapter(act)) return [];

        const entries = state.memoryLog[act] || [];

        return JSON.parse(JSON.stringify([...entries].sort((a, b) => (Number(a.order) || 0) - (Number(b.order) || 0))));
    }

    function resetProgress() {
        state = createDefaultState();

        let saved = false;

        try {
            localStorage.removeItem(STORAGE_KEY);
            saved = true;
        } catch (error) {
            console.warn("WSA: Could not clear saved progress.", error);
        }

        window.dispatchEvent(new CustomEvent("wsa:progress-reset"));

        return saved;
    }

    window.addEventListener("storage", (event) => {
        if (event.key === null || event.key === STORAGE_KEY) {
            state = loadState();
        }
    });

    window.addEventListener("pageshow", (event) => {
        if (event.persisted) {
            state = loadState();
        }
    });

    window.Progress = Object.freeze({
        getSnapshot,
        getProgressSummary,
        resetProgress,
        isChapterUnlocked,
        getLastChapter,
        setLastChapter,
        getCompletedChapters,
        getCompletedCount,
        isChapterCompleted,
        completeChapter,
        getChoice,
        recordChoice,
        getChoices,
        getChoiceCount,
        getChapterPosition,
        setChapterPosition,
        clearChapterPosition,
        logLine,
        trimMemoryLog,
        getMemoryLog
    });
})();