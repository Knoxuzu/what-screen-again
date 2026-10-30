(() => {
    const { scene, when } = window.WSAWrite;
    const A4 = "act4_invitation";
    const A5 = "act5_confrontation";

    const room = scene("KNOX'S BEDROOM", "6:50 AM", "knox-bedroom-day");
    const yard = scene("DELIRIUM ACADEMY", "9:05 AM", "delirium-academy");
    const yardM = scene("DELIRIUM ACADEMY", "9:20 AM", "delirium-academy", "knox:upset@left mira:concerned@right");
    const yardM2 = scene("DELIRIUM ACADEMY", "9:26 AM", "delirium-academy", "knox:worried@left mira:neutral@right");
    const night = scene("KNOX'S BEDROOM", "10:40 PM", "knox-bedroom");
    const clip = scene("LIQUORE · THREAD", "10:44 PM", "social-media-feed");
    const dmV = scene("LIQUORE · MESSAGES", "10:52 PM", "crimson-lounge", "valeria:cold@right");
    const dmE = scene("LIQUORE · MESSAGES", "10:58 PM", "social-media-feed", "elias:tired@right");
    const glass = scene("KNOX'S BEDROOM", "11:31 PM", "black-glass");
    const glassK = scene("KNOX'S BEDROOM", "11:36 PM", "black-glass", "knox:worried@center");

    const lines = [
        room.N(`By morning, the story from the Glasshouse has stopped being his. Someone has copied it, set it beside something else, and sent it out into Liktoren.`),
        room.N(`The phone buzzes against the desk like a trapped insect. Six hundred notifications. Seventy messages. A name he doesn't recognize, again and again.`),
        yard.N(`In the courtyard, heads turn the way they did last week. This time, the turning is slower, and nobody nods.`),
        yard.N(`Phones lift as he passes. Voices drop in the middle of sentences. A first-year with a Liquore sticker on his laptop looks at Knox, looks at his screen, and looks away.`),
        yard.K(`What did I do?`),
        yardM.M(`Nothing nobody already knew. Someone put it on a screen, that's all.`),
        yardM.N(`Mira has appeared at his elbow with her camera and no expression he can name. She isn't smiling. She isn't gloating either.`),
        yardM.M(`A post from an account called liktoren.unfiltered. Your story at 7:12, next to a clip from the Glasshouse at 7:12. An empty second row.`),
        yardM.K(`Who would...`),
        yardM.M(`Does it matter? It's real. That's why it travels.`),
        yardM2.K(`Seraphine?`),
        yardM2.M(`Not her. She hasn't posted anything. She's been tagged four hundred times, though. People keep asking if she's okay, in public, under her name.`),
        yardM2.N(`That detail lands harder than the screenshot. Seraphine didn't ask for any of this. She just sat in a room and waited.`),
        yardM2.M(`I'm not here to pile on, Knox. I'm here because you haven't looked up in two days.`),

        night.N(`Night again, and the apartment is quiet in the way that makes every notification sound like a knock.`),
        clip.N(`The thread has become a small weather system. Two thousand reposts, six hundred comments. Everyone has a theory about who he is.`, { image: "callout-clip" }),
        clip.K(`This isn't even the whole story.`),
        clip.N(`The comments have already decided it is. Authentic, huh. The real guy. Poor Seraphine. He reads them all, even though each one lands a little lower than the last.`, { image: "callout-clip" }),
        when(A4, "accept", dmV.V(`Messages: You said the right things, and then you got caught saying the wrong ones. The Crimson List doesn't do messy. Consider this a pause. A long one.`)),
        when(A4, "compromise", dmV.V(`Messages: I told you what happens to the sentimental ones. Fix this, or we'll fix it for you. You won't like our version.`)),
        when(A4, "decline", dmV.V(`Messages: And you thought I was the performer. How does it feel, being on the other side of the glass?`)),
        dmV.N(`The message vanishes in a blink, like it wanted to leave no evidence. He can still feel where it was.`),
        dmE.E(`Messages: Take the story down. Post an apology. Soft light, short caption, a little crack in the voice. Numbers come back in forty-eight hours. Trust me.`),
        dmE.K(`Elias, is that... real advice, or a script?`),
        dmE.E(`Does it matter? It works.`),
        dmE.N(`Elias is typing again. Then he stops. Then the typing indicator disappears, and the thread goes still.`),
        when(A5, "defensive", night.N(`His thumbs hover. He could answer every one of them, defend every pixel of himself. Part of him is already drafting.`)),
        when(A5, "reflect", night.N(`His thumbs hover. He keeps thinking about Seraphine's face in the cafe, and how it hasn't been tagged in a single comment.`)),
        when(A5, "unsure", night.N(`His thumbs hover. He doesn't know whether to answer, or apologize, or disappear, and every option has a different number attached.`)),

        glass.N(`He opens the front camera, not to post, just to look. The preset he picked weeks ago is still on. The face on the screen is smooth, warm, and slightly more rested than he is.`, { image: "filter-mirror" }),
        glass.K(`That's what everyone liked.`),
        glass.N(`He turns the filter off. The face that appears is tired. The eyes are a little red, the skin is uneven, and the mouth is trying to look like it isn't frightened.`, { image: "filter-mirror" }),
        glassK.K(`Oh.`),
        glassK.N(`For a long moment, he does nothing. It isn't a beautiful face. It isn't a terrible one. It is just his, and he hasn't looked at it in a while.`),
        glassK.N(`Outside, the thread keeps moving without him. Inside, there is a quiet he hasn't heard in weeks. It's hard to tell if it's peace or only the lull before the next notification.`),
        glassK.N(`Whatever he does next, he will be doing it with this face, or without it.`, {
            choices: [
                {
                    text: `Dig in. Protect the persona.`,
                    key: "act6_conflict", value: "defend",
                    points: { approval: 2 },
                    response: `They don't get to decide who I am.`
                }, {
                    text: `Own what you did.`,
                    key: "act6_conflict", value: "accountable",
                    points: { authenticity: 1, reflection: 1 },
                    response: `I can't keep pretending none of this was my fault.`
                }, {
                    text: `Face the gap between the faces.`,
                    key: "act6_conflict", value: "unknown",
                    points: { reflection: 2 },
                    response: `What if I don't even know who I've been pretending to be?`
                }
            ]
        }),
        when("act6_conflict", "defend", glassK.K(`They don't get to decide who I am.`)),
        when("act6_conflict", "accountable", glassK.K(`I can't keep pretending none of this was my fault.`)),
        when("act6_conflict", "unknown", glassK.K(`What if I don't even know who I've been pretending to be?`)),
        when("act6_conflict", "defend", glassK.N(`He turns the filter back on. The face smooths out, relaxed and almost kind. It is easier to defend than to face. It is also, he notices, the only one that isn't looking back at him.`)),
        when("act6_conflict", "accountable", glassK.N(`He puts the phone down on the desk, screen up. The face fades to black, and in the dark glass there is only the outline of someone with nowhere left to hide.`)),
        when("act6_conflict", "unknown", glassK.N(`He holds the phone at arm's length and tries to find the person in the middle of all the versions. Someone is there. He can't yet say who.`)),
        glassK.N(`The thread keeps moving. Somewhere in Liktoren, a girl with a notebook is not looking at her phone, and a boy sits in the dark with two faces and no idea which one is asking.`)
    ];

    window.WSAChapters = window.WSAChapters || {};
    window.WSAChapters[6] = { number: 6, title: "The Face Beneath Filter", lines };
})();
