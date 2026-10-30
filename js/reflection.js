(() => {
    "use strict";
    const root = document.getElementById("personalReflection");
    if (!root || !window.WSAEndings) return;

    const POINTS_KEY = "wsa_story_points_v1";
    const JOURNAL_KEY = "wsa_reflection_journal_v1";

    const DATA = {
        "perfect-illusion": {
            read: "Knox kept the persona because it kept paying him back in attention. Nothing in the story says that makes him a bad person. It shows how approval can quietly become the thing that decides who you are allowed to be.",
            asks: [
                "Is there a version of you online that you'd feel tired keeping up if nobody clapped?",
                "Which of your habits online started because it got reactions, not because you enjoyed it?",
                "Who in your life knows the version of you that doesn't get posted?"
            ]
        }, "between-two-worlds": {
            read: "Knox noticed the gap between his screen self and his offline self but didn't close it. Being unsure is a real place to stand. The question is what you do with the noticing.",
            asks: [
                "Where do you feel the gap between how you present online and how you feel offline?",
                "What would a small, low-risk step toward closing that gap look like for you?",
                "Do you act differently when you're being watched? How can you tell?"
            ]
        }, "self-unfiltered": {
            read: "Knox started building from what he values instead of what performs well. Notice that this is a beginning, not a finish line. Research on authentic self-presentation links it with a clearer sense of self (Wong & Hamza, 2025).",
            asks: [
                "What is one thing you share online that is purely yours, whether or not anyone reacts?",
                "What did you used to enjoy before you knew how it would look to others?",
                "How do you tell the difference between honest expression and a more polished performance?"
            ]
        }, "different-beginning": {
            read: "Knox could finally name his patterns, but changing them is still ahead of him. Seeing clearly is the first half of change, and it is easy to underrate how hard it is.",
            asks: [
                "What pattern in your own online behavior could you name right now?",
                "What makes that pattern hard to change? Is it people, fear, or habit?",
                "Who could you tell about it so you don't carry it alone?"
            ]
        }
    };

    const LABELS = {
        authenticity: "Honest expression",
        approval: "Seeking approval",
        reflection: "Self-reflection"
    };

    let points = {};
    try {
        points = JSON.parse(localStorage.getItem(POINTS_KEY)) || {};
    } catch (e) {
        points = {};
    }

    const total = Object.keys(LABELS).reduce((n, k) => n + (Number(points[k]) || 0), 0);
    if (total === 0) return;   // nothing played yet

    const key = window.WSAEndings.resolve(points);
    const info = DATA[key];
    const done = window.Progress && window.Progress.isChapterCompleted(7);

    root.querySelector("[data-ending-name]").textContent = window.WSAEndings.ENDINGS[key];
    root.querySelector("[data-ending-label]").textContent = done ? "YOUR ENDING" : "WHERE YOU'RE HEADING SO FAR";
    root.querySelector("[data-ending-read]").textContent = info.read;

    const bars = root.querySelector("[data-bars]");
    Object.entries(LABELS).forEach(([k, label]) => {
        const pct = Math.round(((Number(points[k]) || 0) / total) * 100);
        const row = document.createElement("div");

        row.className = "pr-bar";
        row.innerHTML = `<span class="pr-bar-label"></span><span class="pr-bar-track"><i></i></span><span class="pr-bar-pct"></span>`;
        row.querySelector(".pr-bar-label").textContent = label;
        row.querySelector("i").style.width = pct + "%";
        row.querySelector(".pr-bar-pct").textContent = pct + "%";

        bars.appendChild(row);
    });

    const list = root.querySelector("[data-asks]");

    info.asks.forEach((q) => {
        const li = document.createElement("li");
        li.textContent = q;
        list.appendChild(li);
    });

    const box = root.querySelector("[data-journal]");
    const status = root.querySelector("[data-journal-status]");

    try {
        box.value = localStorage.getItem(JOURNAL_KEY) || "";
    } catch (e) { }

    let t;
    box.addEventListener("input", () => {
        clearTimeout(t);
        t = setTimeout(() => {
            try { localStorage.setItem(JOURNAL_KEY, box.value); status.textContent = "Saved on this device only."; }
            catch (e) { status.textContent = "Couldn't save here."; }
        }, 400);
    });

    const tabs = root.querySelectorAll(".pr-tab");
    const panels = root.querySelectorAll(".pr-panel");

    tabs.forEach((tab) => tab.addEventListener("click", () => {
        tabs.forEach((x) => {
            const on = x === tab;
            x.classList.toggle("is-active", on);
            x.setAttribute("aria-selected", String(on));
        });
        panels.forEach((pn) => { pn.hidden = pn.dataset.panel !== tab.dataset.tab; });
    }));

    document.body.classList.add("has-reflection");
    root.hidden = false;
})();
