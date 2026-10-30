(() => {
    "use strict";

    const ENDINGS = Object.freeze({
        "perfect-illusion": "The Perfect Illusion",
        "between-two-worlds": "Between Two Worlds",
        "self-unfiltered": "The Self Unfiltered",
        "different-beginning": "A Different Beginning"
    });

    function resolve(points = {}) {
        const approval = Number(points.approval) || 0;
        const authenticity = Number(points.authenticity) || 0;
        const reflection = Number(points.reflection) || 0;

        if (approval >= 6 && approval > authenticity + reflection) {
            return "perfect-illusion";
        }

        if (authenticity >= 5 && authenticity >= approval + 3) {
            return "self-unfiltered";
        }

        if (reflection >= 4 && reflection > authenticity && reflection >= approval) {
            return "different-beginning";
        }

        return "between-two-worlds";
    }

    window.WSAEndings = Object.freeze({ ENDINGS, resolve });
})();
