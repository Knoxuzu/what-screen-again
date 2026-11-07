(() => {
    "use strict";

    const START_MODE_KEY = "wsa_start_mode_v1";
    const CHAPTER = Number(document.body.dataset.chapter) || 1;

    function initChapterOpening() {
        const intro = document.getElementById("chapterIntro");
        const beginButton = document.getElementById("beginChapter");
        const visualNovel = document.getElementById("visualNovel");
        const completion = document.getElementById("chapterComplete");

        if (!intro || !beginButton || !visualNovel) {
            console.error("Chapter opening elements are missing.");
            return;
        }

        if (window.Progress && typeof window.Progress.isChapterUnlocked === "function" && !window.Progress.isChapterUnlocked(CHAPTER)) {
            window.location.replace("../chapters.html");
            return;
        }

        let startMode = null;
        let storyStarting = false;

        try {
            startMode = sessionStorage.getItem(START_MODE_KEY);
            sessionStorage.removeItem(START_MODE_KEY);
        } catch (error) {
            console.warn("Could not read the start mode.", error);
        }

        // Resume wherever the reader left off, unless they just chose "New Story".
        const hasSavedPlace = Boolean(window.Progress) && window.Progress.getChapterPosition(CHAPTER) > 0;
        const resume = startMode !== "fresh" && hasSavedPlace;
        const label = document.getElementById("beginLabel");

        if (resume && label) {
            label.textContent = "CONTINUE CHAPTER";
        }

        function startStory() {
            if (storyStarting) return;

            if (
                !window.StoryEngine ||
                typeof window.StoryEngine.start !== "function"
            ) {
                console.error(
                    "StoryEngine is unavailable. Check the chapter script loading order."
                );
                return;
            }

            storyStarting = true;
            beginButton.disabled = true;

            const started = window.StoryEngine.start({
                resume
            });

            if (started === false) {
                storyStarting = false;
                beginButton.disabled = false;
                return;
            }

        }

        beginButton.addEventListener("click", startStory);

        intro.classList.remove("hidden", "opening-exit");
        visualNovel.classList.add("hidden");

        if (completion) {
            completion.classList.add("hidden");
        }

        beginButton.disabled = false;
    }

    if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", initChapterOpening);
    } else {
        initChapterOpening();
    }
})();