window.WSAWrite = {
    scene(scene, time, background, cast = "") {
        const make = (speaker) => (text, extra = {}) => ({
            speaker, text, scene, time, background,
            ...(cast ? { cast } : {}),
            ...extra
        });

        return {
            N: make("NARRATION"), K: make("KNOX"), S: make("SERAPHINE"),
            V: make("VALERIA"), E: make("ELIAS"), M: make("MIRA"),
            SYS: make("SYSTEM")
        };
    },

    when(choice, value, line) {
        return { ...line, condition: { choice, value } };
    }
};
