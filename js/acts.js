(() => {
    "use strict";

    const ACTS = [
        {
            number: 1,
            title: "Act I",
            subtitle: "THE FIRST MEMORY",
            chapterTitle: "A World Behind Glass",
            description: "Something here is waiting to be remembered.",
            href: "chapters/chapter.html?act=1",
            symbol: "◇",
            colors: ["#ffffff", "#cfc8ee"]
        }, {
            number: 2,
            title: "Act II",
            subtitle: "A SIGNAL RETURNS",
            chapterTitle: "The Sweetness of Being Seen",
            description: "A second fragment, still buried beneath the noise.",
            href: "chapters/chapter.html?act=2",
            symbol: "⌁",
            colors: ["#78eaff", "#282052"]
        }, {
            number: 3,
            title: "Act III",
            subtitle: "THE OTHER SIDE",
            chapterTitle: "Everyone, Except Myself",
            description: "An incomplete memory flickers somewhere beyond reach.",
            href: "chapters/chapter.html?act=3",
            symbol: "⌘",
            colors: ["#d7b8ff", "#2c1648"]
        }, {
            number: 4,
            title: "Act IV",
            subtitle: "A FRACTURE IN TIME",
            chapterTitle: "An Invitation to Become",
            description: "The signal bends. The fragments no longer agree.",
            href: "chapters/chapter.html?act=4",
            symbol: "⟡",
            colors: ["#ffb9d4", "#37204e"]
        }, {
            number: 5,
            title: "Act V",
            subtitle: "WHAT REMAINS",
            chapterTitle: "When the Screens Collide",
            description: "A trace of something that should not have disappeared.",
            href: "chapters/chapter.html?act=5",
            symbol: "⌬",
            colors: ["#9dffdf", "#183c49"]
        }, {
            number: 6,
            title: "Act VI",
            subtitle: "THE LAST SIGNAL",
            chapterTitle: "The Face Beneath Filter",
            description: "The final recoverable memory before the center awakens.",
            href: "chapters/chapter.html?act=6",
            symbol: "⟁",
            colors: ["#f7d78d", "#49304e"]
        }, {
            number: 7,
            title: "Act VII",
            subtitle: "THE FINAL FRACTURE",
            chapterTitle: "Who Remains When We Log Out?",
            description: "The missing piece. The end of the archive is also its beginning.",
            href: "chapters/chapter.html?act=7",
            symbol: "✳",
            colors: ["#ffffff", "#9b83ff", "#78eaff"]
        }
    ];

    window.WSAActs = Object.freeze(
        ACTS.map((act) => Object.freeze({
            ...act,
            colors: Object.freeze([...act.colors])
        }))
    );
})();