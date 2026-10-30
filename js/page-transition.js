(() => {
    "use strict";

    const overlay = document.getElementById("pageTransition");

    if (!overlay) return;

    const message = document.getElementById("transitionMessage");
    const status = document.getElementById("transitionStatus");
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");

    let running = false;

    const wait = (ms) => new Promise((resolve) => window.setTimeout(resolve, ms));

    function setMessage(text, statusText) {
        if (message) message.textContent = text;
        if (status) status.textContent = statusText;
    }

    async function go(destination) {
        if (running || !destination) return;

        running = true;

        if (reducedMotion.matches) {
            overlay.classList.add("is-active", "is-visible");
            window.location.assign(destination);
            return;
        }

        overlay.dataset.transitionState = "running";
        overlay.classList.add("is-active");

        void overlay.offsetWidth;
        await wait(60);

        overlay.classList.add("is-visible");
        setMessage("SAVING YOUR PLACE", "SESSION ACTIVE");
        await wait(850);

        overlay.classList.add("is-glitching");
        setMessage("SIGNAL INTERRUPTION DETECTED", "SIGNAL UNSTABLE");
        await wait(650);

        overlay.classList.add("is-flashing");
        setMessage("WHO IS REALLY IN CONTROL?", "UNEXPECTED RESPONSE");
        await wait(280);

        overlay.classList.remove("is-flashing");
        await wait(350);

        setMessage("RETURNING TO THE MAIN INTERFACE", "RECONNECTING");
        overlay.classList.add("is-exiting");
        await wait(1250);

        overlay.dataset.transitionState = "complete";
        window.location.assign(destination);
    }

    window.WSATransition = { go };

    const transitionLinks = [
        'a[href="chapters.html"]',
        'a[href="./chapters.html"]',
        'a[href="memory-log.html"]',
        'a[href="./memory-log.html"]'
    ];

    document.querySelectorAll(transitionLinks.join(", ")).forEach((link) => {
        link.addEventListener("click", (event) => {
            if (event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey || (link.target && link.target !== "_self")) {
                return;
            }

            event.preventDefault();
            go(link.href);
        });
    });

    const beginButton = document.getElementById("newGame");

    if (beginButton) {
        beginButton.addEventListener("click", () => {
            if (!beginButton.disabled) go("chapters.html");
        });
    }

    window.addEventListener("pageshow", (event) => {
        if (!event.persisted) return;

        running = false;

        overlay.classList.remove(
            "is-active",
            "is-visible",
            "is-glitching",
            "is-flashing",
            "is-exiting"
        );

        overlay.dataset.transitionState = "idle";
        setMessage("PREPARING YOUR STORY", "CONNECTION STABLE");
    });
})();
