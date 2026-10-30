(() => {
    "use strict";

    const elements = {
        message: document.getElementById("reflectionMessage"),
        completed: document.getElementById("chaptersCompleted"),
        choices: document.getElementById("choicesRecorded"),
        records: document.getElementById("endingRecords")
    };

    if (!elements.message || !elements.completed || !elements.choices) {
        return;
    }

    const TOTAL_CHAPTERS = 7;

    function getProgress() {
        return window.Progress || null;
    }

    function getReflectionMessage(summary) {
        if (summary.completedChapters >= TOTAL_CHAPTERS) {
            return "You've reached the end of the journey. Every reflection has become part of the story you chose to tell.";
        }

        if (summary.completedChapters > 0) {
            return "You've already left a few reflections behind. There is still more of this story waiting to unfold.";
        }

        if (summary.choicesRecorded > 0) {
            return "Your choices have begun to shape this journey. Keep going to discover what each reflection reveals.";
        }

        return "Your story is waiting to be written. Begin with the first chapter, and see what you discover along the way.";
    }

    function updateEndingPage() {
        const progress = getProgress();

        if (!progress) {
            elements.completed.textContent = `0 / ${TOTAL_CHAPTERS}`;
            elements.choices.textContent = "0";
            elements.message.textContent = "Your story is waiting to be written. Begin with the first chapter, and see what you discover along the way.";
            return;
        }

        const summary = progress.getProgressSummary();

        elements.completed.textContent = `${summary.completedChapters} / ${TOTAL_CHAPTERS}`;
        elements.choices.textContent = String(summary.choicesRecorded);
        elements.message.textContent = getReflectionMessage(summary);

        if (elements.records) {
            elements.records.setAttribute("data-completed", String(summary.completedChapters));
        }
    }

    updateEndingPage();

    window.addEventListener("storage", (event) => {
        if (event.key === "wsa_story_progress_v1") {
            updateEndingPage();
        }
    });

    window.addEventListener("wsa:progress-updated", updateEndingPage);
})();