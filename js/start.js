(() => {
    "use strict";

    const startButton = document.getElementById("startGame");
    const dialog = document.getElementById("startChoice");

    if (!startButton || !dialog) {
        console.error("Start button or choice dialog is missing.");
        return;
    }

    const hint = document.getElementById("continueHint");
    const dialogText = document.getElementById("startChoiceText");
    const continueButton = document.getElementById("continueStory");
    const newButton = document.getElementById("newStory");
    const newLabel = newButton?.querySelector(".menu-button-label");
    const cancelButton = document.getElementById("cancelStart");

    const CHAPTER_ONE_URL = "chapters/chapter-1.html";
    const POINTS_KEY = "wsa_story_points_v1";
    const START_MODE_KEY = "wsa_start_mode_v1";

    const DEFAULT_TEXT = "Continue your previous progress, or begin a new story?";

    let confirmingReset = false;

    function getProgress() {
        return window.Progress || null;
    }

    function hasSavedProgress() {
        const progress = getProgress();

        if (!progress) return false;

        const summary = progress.getProgressSummary();

        return (summary.completedChapters > 0 || summary.choicesRecorded > 0 || summary.lastChapter > 1 || progress.getChapterPosition(1) > 0);
    }

    function updateHint() {
        if (!hint) return;

        hint.textContent = hasSavedProgress() ? "YOUR STORY IS WAITING." : "YOUR STORY HAS YET TO BEGIN.";
    }

    function navigateToChapter(mode, url = CHAPTER_ONE_URL) {
        try {
            if (mode) sessionStorage.setItem(START_MODE_KEY, mode);
        } catch (error) {
            console.warn("Could not save the start mode.", error);
        }

        if (dialog.open) {
            dialog.close();
        }

        window.requestAnimationFrame(() => {
            if (window.WSATransition?.go) {
                window.WSATransition.go(url);
            } else {
                window.location.assign(url);
            }
        });
    }

    function navigateToResumePoint() {
        const progress = getProgress();
        const last = progress ? progress.getLastChapter() : 1;
        const act = Array.isArray(window.WSAActs) ? window.WSAActs[last - 1] : null;
        const href = act ? act.href : (last === 1 ? CHAPTER_ONE_URL : null);

        if (href && progress && progress.isChapterUnlocked(last)) {
            navigateToChapter("resume", href);
        } else {
            navigateToChapter(null, "chapters.html");
        }
    }

    function freshStart() {
        const progress = getProgress();

        if (progress && typeof progress.resetProgress === "function") {
            progress.resetProgress();
        }

        try {
            localStorage.removeItem(POINTS_KEY);
        } catch (error) {
            console.warn("Could not clear saved story points.", error);
        }

        navigateToChapter("fresh");
    }

    function resetDialog() {
        confirmingReset = false;

        if (dialogText) {
            dialogText.textContent = DEFAULT_TEXT;
        }

        if (newLabel) {
            newLabel.textContent = "NEW STORY";
        }

        if (continueButton) {
            continueButton.disabled = !hasSavedProgress();
        }
    }

    startButton.addEventListener("click", () => {
        resetDialog();

        if (!dialog.open) {
            dialog.showModal();
        }
    });

    if (continueButton) {
        continueButton.addEventListener("click", () => {
            if (!hasSavedProgress()) return;

            navigateToResumePoint();
        });
    }

    if (newButton) {
        newButton.addEventListener("click", () => {
            if (hasSavedProgress() && !confirmingReset) {
                confirmingReset = true;

                if (dialogText) {
                    dialogText.textContent = "This will erase your saved progress, choices, points and memory log. Are you sure?";
                }

                if (newLabel) {
                    newLabel.textContent = "ERASE & BEGIN";
                }

                return;
            }

            freshStart();
        });
    }

    if (cancelButton) {
        cancelButton.addEventListener("click", () => {
            if (dialog.open) dialog.close();
        });
    }

    dialog.addEventListener("close", resetDialog);

    updateHint();

    window.addEventListener("storage", (event) => {
        if (event.key === "wsa_story_progress_v1") {
            updateHint();
        }
    });

    window.addEventListener("wsa:progress-updated", updateHint);
})();