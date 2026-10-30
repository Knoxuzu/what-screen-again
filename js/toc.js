(() => {
    "use strict";

    const world = document.querySelector(".fragment-world");
    const container = document.getElementById("chapterList");
    const stage = document.getElementById("fragmentStage");

    if (!world || !container || !stage) return;

    const $ = (id) => document.getElementById(id);
    const ui = {
        prompt: $("archivePrompt"),
        progressLabel: $("archiveProgressLabel"),
        progressStatus: $("archiveProgressStatus"),
        progressTrack: $("archiveProgressTrack"),
        progressFill: $("archiveProgressFill"),
        detailNumber: $("actDetailNumber"),
        detailTitle: $("actDetailTitle"),
        detailSubtitle: $("actDetailSubtitle"),
        detailDescription: $("actDetailDescription"),
        detailStatus: $("actDetailStatus"),
        openLink: $("openActLink"),
        hint: $("archiveHint"),
        assemblyFlash: $("assemblyFlash"),
        stabilize: $("toggleSignal")
    };

    const acts = window.WSAActs;

    if (!Array.isArray(acts) || acts.length !== 7) {
        console.error("WSA: js/acts.js must load before toc.js.");
        return;
    }

    const fragmentTilts = [-10, 6, -6, 10, -7, 8, 0];
    const SELECTED_KEY = "wsaSelectedFragmentV1";
    const ASSEMBLY_KEY = "wsaFragmentAssemblySeenV1";

    let selectedAct = 1;
    let assemblyPlayedThisSession = false;
    let assemblyTimer = null;

    const reducedMotion = window.matchMedia(
        "(prefers-reduced-motion: reduce)"
    );

    function cleanActList(value) {
        if (!Array.isArray(value)) return [];

        return [...new Set(value.map(Number).filter((number) => Number.isInteger(number) && number >= 1 && number <= 7))].sort((a, b) => a - b);
    }

    function getProgress() {
        const completed = new Set();
        const unlocked = new Set([1]);

        if (window.Progress) {
            const savedCompleted = typeof window.Progress.getCompletedChapters === "function" ? window.Progress.getCompletedChapters() : [];

            cleanActList(savedCompleted).forEach((number) => {
                completed.add(number);
            });

            for (let number = 1; number <= 7; number += 1) {
                if (typeof window.Progress.isChapterUnlocked === "function" && window.Progress.isChapterUnlocked(number)) {
                    unlocked.add(number);
                }
            }
        }

        if (!window.Progress) {
            try {
                const saved = JSON.parse(localStorage.getItem("wsa_story_progress_v1"));

                if (saved && typeof saved === "object") {
                    cleanActList(saved.completedChapters).forEach((number) => {
                        completed.add(number);
                    });
                }
            } catch (error) {
                console.warn("WSA: Could not read story progress.", error);
            }

            for (let number = 1; number < 7; number += 1) {
                if (completed.has(number)) {
                    unlocked.add(number + 1);
                }
            }
        }

        let assemblySeen = false;

        try {
            assemblySeen = localStorage.getItem(ASSEMBLY_KEY) === "true";
        } catch { }

        return { completed, unlocked, assemblySeen };
    }

    function getState(act, progress) {
        if (progress.completed.has(act.number)) return "complete";
        if (progress.unlocked.has(act.number)) return "available";
        return "locked";
    }

    function getStateLabel(state) {
        if (state === "complete") return "MEMORY RECOVERED";
        if (state === "available") return "AVAILABLE";
        return "SIGNAL LOST";
    }

    function svgElement(name, attributes = {}) {
        const element = document.createElementNS("http://www.w3.org/2000/svg", name);

        Object.entries(attributes).forEach(([key, value]) => {
            element.setAttribute(key, String(value));
        });

        return element;
    }

    function addMemoryGradient(defs, act) {
        const gradient = svgElement("linearGradient", {
            id: `fragment-gradient-${act.number}`,
            x1: "0%",
            y1: "0%",
            x2: "100%",
            y2: "100%"
        });

        act.colors.forEach((color, index) => {
            const stop = svgElement("stop", {
                offset: `${(index / Math.max(1, act.colors.length - 1)) * 100}%`,
                "stop-color": color
            });

            gradient.appendChild(stop);
        });

        defs.appendChild(gradient);
        return `url(#fragment-gradient-${act.number})`;
    }

    function buildFragmentSVG(act, state) {
        const svg = svgElement("svg", {
            viewBox: "0 0 220 250",
            class: "fragment-art",
            "aria-hidden": "true",
            focusable: "false"
        });

        const defs = svgElement("defs");
        const clip = svgElement("clipPath", {
            id: `fragment-clip-${act.number}`
        });

        const shapes = [
            "M40 8 L173 0 L207 52 L184 108 L203 170 L135 238 L44 218 L10 145 L24 72 Z",
            "M35 0 L177 17 L214 82 L182 133 L197 207 L103 244 L29 196 L5 89 Z",
            "M46 3 L177 8 L217 67 L194 145 L156 224 L65 244 L7 168 L23 63 Z",
            "M18 24 L106 0 L205 37 L218 122 L171 190 L116 248 L36 209 L4 113 Z",
            "M51 0 L190 29 L217 93 L183 153 L192 215 L91 246 L18 185 L7 80 Z",
            "M29 9 L146 0 L214 49 L191 120 L213 183 L130 246 L42 217 L4 129 Z",
            "M52 3 L170 12 L218 80 L181 139 L196 202 L119 246 L29 210 L7 123 L21 54 Z"
        ];

        const shape = shapes[act.number - 1];

        clip.appendChild(svgElement("path", { d: shape }));
        defs.appendChild(clip);

        let memoryFill = "#11101c";

        if (state === "complete") {
            memoryFill = addMemoryGradient(defs, act);
        }

        svg.appendChild(defs);

        const imageLayer = svgElement("g", {
            class: `fragment-image-layer fragment-image-layer--${state}`,
            "clip-path": `url(#fragment-clip-${act.number})`
        });

        imageLayer.appendChild(svgElement("rect", {
            x: 0,
            y: 0,
            width: 220,
            height: 250,
            fill: state === "complete" ? memoryFill : state === "available" ? "#f4f2ff" : "#11101c",
            class: "fragment-image-background"
        }));

        if (state === "complete") {
            imageLayer.appendChild(svgElement("path", {
                d: "M-20 55 L240 190 M-10 180 L225 65 M40 -10 L170 265",
                fill: "none",
                stroke: "#ffffff",
                "stroke-width": 1,
                opacity: 0.32
            }));

            const symbol = svgElement("text", {
                x: 110,
                y: 124,
                "text-anchor": "middle",
                "dominant-baseline": "middle",
                class: "fragment-memory-symbol"
            });

            symbol.textContent = act.symbol;
            imageLayer.appendChild(symbol);
        } else if (state === "available") {
            imageLayer.appendChild(svgElement("path", {
                d: "M25 15 L180 30 L198 90 L130 225 L43 203 L17 112 Z",
                fill: "#ffffff",
                opacity: 0.58
            }));
        } else {
            imageLayer.appendChild(svgElement("rect", {
                x: 0,
                y: 0,
                width: 220,
                height: 250,
                fill: "#05050c",
                opacity: 0.72
            }));

            imageLayer.appendChild(svgElement("path", {
                d: "M115 5 L98 73 L126 110 L88 155 L102 245",
                fill: "none",
                stroke: "#77708e",
                "stroke-width": 1.4,
                opacity: 0.3
            }));
        }

        svg.appendChild(imageLayer);

        svg.appendChild(svgElement("path", {
            d: shape,
            class: "fragment-silhouette",
            fill: "none",
            "stroke-width": state === "available" ? 1.8 : 1.1
        }));

        svg.appendChild(svgElement("path", {
            d: "M24 72 L70 83 L103 58 M103 58 L151 82 L184 108",
            class: "fragment-crack",
            fill: "none",
            "stroke-width": 0.8
        }));

        return svg;
    }

    function saveSelectedAct(number) {
        try {
            localStorage.setItem(SELECTED_KEY, String(number));
        } catch { }
    }

    function setOpenLink(act, state) {
        if (!ui.openLink) return;

        const text = ui.openLink.querySelector(".open-act-link-text");

        if (state === "locked" || !act.href) {
            ui.openLink.setAttribute("aria-disabled", "true");
            ui.openLink.removeAttribute("href");

            if (text) {
                text.textContent = state === "locked" ? "SIGNAL UNAVAILABLE" : "COMING LATER";
            }

            return;
        }

        ui.openLink.removeAttribute("aria-disabled");
        ui.openLink.setAttribute("href", act.href);

        if (text) {
            text.textContent = state === "complete" ? "REVISIT FRAGMENT" : "ENTER FRAGMENT";
        }
    }

    function showLockedAct(act) {
        if (ui.detailNumber) {
            ui.detailNumber.textContent = `FRAGMENT 0${act.number}`;
        }

        if (ui.detailTitle) {
            ui.detailTitle.textContent = "Signal lost";
        }

        if (ui.detailSubtitle) {
            ui.detailSubtitle.textContent = "MEMORY UNAVAILABLE";
        }

        if (ui.detailDescription) {
            ui.detailDescription.textContent =
                `Act ${act.number} is still missing. Recover the preceding memory first.`;
        }

        if (ui.detailStatus) {
            ui.detailStatus.textContent = "LOCKED";
        }

        setOpenLink(act, "locked");
    }

    function updateInspector(act, state) {
        if (ui.detailNumber) {
            ui.detailNumber.textContent = `FRAGMENT 0${act.number}`;
        }

        if (ui.detailTitle) {
            ui.detailTitle.textContent = act.title;
        }

        if (ui.detailSubtitle) {
            ui.detailSubtitle.textContent = act.subtitle;
        }

        if (ui.detailDescription) {
            ui.detailDescription.textContent = act.description;
        }

        if (ui.detailStatus) {
            ui.detailStatus.textContent = state === "available" && !act.href ? "SIGNAL INCOMING" : getStateLabel(state);
        }

        setOpenLink(act, state);

        if (ui.hint) {
            ui.hint.textContent = state === "complete" ? "MEMORY RECOVERED — SELECT TO REVISIT" : state === "available" ? (act.href ? "SELECT THE LIT FRAGMENT TO ENTER" : "THIS FRAGMENT HAS NOT BEEN WRITTEN YET") : "SELECT A LIT FRAGMENT TO INSPECT ITS MEMORY";
        }
    }

    function createActNode(act, state) {
        const node = document.createElement("button");
        node.type = "button";
        node.className = `chapter-node is-${state}`;
        node.dataset.act = String(act.number);
        node.dataset.state = state;
        node.setAttribute("aria-label", `${act.title}: ${state === "available" && !act.href ? "SIGNAL INCOMING" : getStateLabel(state)}`);

        if (state === "locked") {
            node.setAttribute("aria-disabled", "true");
            node.title = "This fragment has not been recovered yet.";
        }

        const label = document.createElement("span");
        label.className = "fragment-label";

        const number = document.createElement("span");
        number.className = "chapter-number";
        number.textContent = `0${act.number}`;

        const title = document.createElement("span");
        title.className = "chapter-title";
        title.textContent = act.title;

        const status = document.createElement("span");
        status.className = "chapter-status";
        status.textContent = state === "locked" ? "MISSING" : state === "complete" ? "RECOVERED" : act.href ? "AVAILABLE" : "INCOMING";

        label.append(number, title, status);
        node.append(buildFragmentSVG(act, state), label);
        node.style.rotate = `${fragmentTilts[act.number - 1]}deg`;

        node.addEventListener("click", () => {
            const progress = getProgress();
            const currentState = getState(act, progress);

            if (currentState === "locked") {
                showLockedAct(act);
                return;
            }

            selectedAct = act.number;
            saveSelectedAct(selectedAct);
            updateInspector(act, currentState);
            highlightSelection();
        });

        return node;
    }

    function highlightSelection() {
        container.querySelectorAll(".chapter-node").forEach((node) => {
            const isSelected = Number(node.dataset.act) === selectedAct;

            node.classList.toggle("is-selected", isSelected);

            if (isSelected) {
                node.setAttribute("aria-current", "true");

                const target = node.offsetLeft - (container.clientWidth - node.offsetWidth) / 2;

                container.scrollTo({
                    left: Math.max(0, target),
                    behavior: reducedMotion.matches ? "auto" : "smooth"
                });
            } else {
                node.removeAttribute("aria-current");
            }
        });
    }

    function saveAssemblySeen() {
        try {
            localStorage.setItem(ASSEMBLY_KEY, "true");
        } catch { }
    }

    function playAssembly() {
        if (assemblyPlayedThisSession) return;

        assemblyPlayedThisSession = true;

        if (assemblyTimer) {
            window.clearTimeout(assemblyTimer);
            assemblyTimer = null;
        }

        if (reducedMotion.matches) {
            world.classList.remove("is-assembling");
            world.classList.add("is-assembled");
            saveAssemblySeen();
            return;
        }

        world.classList.remove("is-assembled", "is-assembling");
        void world.offsetWidth;
        world.classList.add("is-assembling");

        assemblyTimer = window.setTimeout(() => {
            world.classList.remove("is-assembling");
            world.classList.add("is-assembled");
            saveAssemblySeen();
            assemblyTimer = null;
        }, 1900);
    }

    container.addEventListener("wheel", (event) => {
        if (container.scrollWidth <= container.clientWidth) return;

        if (Math.abs(event.deltaY) > Math.abs(event.deltaX)) {
            container.scrollLeft += event.deltaY;
            event.preventDefault();
        }
    }, { passive: false });

    function renderActs() {
        const progress = getProgress();

        container.replaceChildren();

        acts.forEach((act) => {
            container.appendChild(
                createActNode(act, getState(act, progress))
            );
        });

        const completedCount = progress.completed.size;
        const progressPercent = (completedCount / 7) * 100;

        if (ui.progressFill) {
            ui.progressFill.style.width = `${progressPercent}%`;
        }

        if (ui.progressStatus) {
            ui.progressStatus.textContent = `${String(completedCount).padStart(2, "0")} / 07`;
        }

        if (ui.progressTrack) {
            ui.progressTrack.setAttribute("aria-valuenow", String(completedCount));
            ui.progressTrack.setAttribute("aria-valuemax", "7");
        }

        if (ui.progressLabel) {
            ui.progressLabel.textContent = "MEMORIES RECOVERED";
        }

        if (ui.prompt) {
            ui.prompt.textContent = completedCount === 7 ? "Every fragment remembers. The signal is whole." : completedCount === 6 ? "The final piece is waiting at the center." : "A memory is waiting to be recovered.";
        }

        let savedSelection = 1;

        try {
            savedSelection = Number(localStorage.getItem(SELECTED_KEY));
        } catch { }

        const selectedIsUsable = Number.isInteger(savedSelection) && savedSelection >= 1 && savedSelection <= 7 && progress.unlocked.has(savedSelection);
        selectedAct = selectedIsUsable ? savedSelection : [...progress.unlocked][0] || 1;

        updateInspector(acts[selectedAct - 1], getState(acts[selectedAct - 1], progress));

        highlightSelection();

        if (progress.unlocked.has(7)) {
            world.classList.add("is-assembled");

            if (!progress.assemblySeen && !assemblyPlayedThisSession) {
                playAssembly();
            }
        } else {
            if (assemblyTimer) {
                window.clearTimeout(assemblyTimer);
                assemblyTimer = null;
            }

            world.classList.remove("is-assembled", "is-assembling");
            assemblyPlayedThisSession = false;
        }
    }

    window.addEventListener("wsa:act-completed", (event) => {
        const number = Number(event.detail?.act);

        if (!Number.isInteger(number) || number < 1 || number > 7) {
            return;
        }

        renderActs();
    });

    window.addEventListener("wsa:progress-reset", () => {
        assemblyPlayedThisSession = false;

        try {
            localStorage.removeItem(ASSEMBLY_KEY);
            localStorage.removeItem(SELECTED_KEY);
        } catch { }

        renderActs();
    });

    window.addEventListener("storage", (event) => {
        if (event.key === "wsa_story_progress_v1" || event.key === ASSEMBLY_KEY || event.key === SELECTED_KEY) {
            renderActs();
        }
    });

    window.addEventListener("pageshow", (event) => {
        if (event.persisted) renderActs();
    });

    if (ui.openLink) {
        ui.openLink.addEventListener("click", (event) => {
            if (event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey || ui.openLink.getAttribute("aria-disabled") === "true") {
                return;
            }

            const destination = ui.openLink.href;

            if (!destination || !window.WSATransition?.go) return;

            event.preventDefault();
            window.WSATransition.go(destination);
        });
    }

    if (ui.stabilize) {
        ui.stabilize.addEventListener("click", () => {
            const stabilized = world.classList.toggle("signal-stabilized");

            ui.stabilize.setAttribute("aria-pressed", String(stabilized));

            const label = ui.stabilize.querySelector("span:last-child");

            if (label) {
                label.textContent = stabilized ? "SIGNAL STABILIZED" : "STABILIZE SIGNAL";
            }
        });
    }

    renderActs();

    window.WSAFragments = Object.freeze({
        refresh: renderActs,
        getProgress: () => {
            const progress = getProgress();

            return {
                completed: [...progress.completed],
                unlocked: [...progress.unlocked]
            };
        }
    });
})();