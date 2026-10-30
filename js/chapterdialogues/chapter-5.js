(() => {
    const { scene, when } = window.WSAWrite;
    const A4 = "act4_invitation";

    const lounge = scene("THE CRIMSON LOUNGE", "6:40 PM", "crimson-lounge", "knox:smile@left elias:smile@right");
    const loungeV = scene("THE CRIMSON LOUNGE", "6:58 PM", "crimson-lounge", "valeria:smile@left elias:neutral@right");
    const room = scene("KNOX'S BEDROOM", "6:40 PM", "knox-bedroom");
    const phone = scene("LIQUORE · STORIES", "7:12 PM", "social-media-feed");
    const cafe = scene("THE GLASSHOUSE CAFE", "8:05 PM", "glasshouse-cafe-dusk");
    const cafeS = scene("THE GLASSHOUSE CAFE", "8:07 PM", "glasshouse-cafe-dusk", "knox:neutral@left seraphine:neutral@right");
    const cafeS2 = scene("THE GLASSHOUSE CAFE", "8:11 PM", "glasshouse-cafe-dusk", "knox:worried@left seraphine:upset@right");
    const cafeS3 = scene("THE GLASSHOUSE CAFE", "8:16 PM", "glasshouse-cafe-dusk", "knox:upset@left seraphine:concerned@right");
    const cafeM = scene("THE GLASSHOUSE CAFE", "8:18 PM", "glasshouse-cafe-dusk", "mira:concerned@right");
    const bridge = scene("THE LIKTOREN OVERPASS", "9:02 PM", "liktoren-overpass-night");
    const bridgeMsg = scene("THE LIKTOREN OVERPASS", "9:05 PM", "liktoren-overpass-night");

    const lines = [
        when(A4, "accept", lounge.N(`Thursday, 6:40. The Crimson Lounge has already rearranged itself around him. Elias adjusts the ring light, Valeria adjusts Knox, and the shoot is running late before it has started.`)),
        when(A4, "compromise", lounge.N(`Thursday, 6:40. The trial shoot is supposed to take an hour. Valeria keeps finding one more angle, and one more version of him she'd prefer to photograph.`)),
        when(A4, "decline", room.N(`Thursday, 6:40. Knox is in his room, not at the Lounge. But the new preset is open, the schedule he swore he wouldn't follow is half followed, and the clock is moving faster than his editing.`)),
        when(A4, "accept", loungeV.V(`Chin lower. Look past the camera, like someone you love just left the room.`)),
        when(A4, "compromise", loungeV.V(`Chin lower. Don't smile with your teeth. You're a mystery, not a salesman.`)),
        when(A4, "decline", room.N(`He crops the same photograph four times. Each version looks a little more like someone else's.`)),
        when(A4, "accept", lounge.K(`I have somewhere to be at seven. Just a friend's thing.`)),
        when(A4, "compromise", lounge.K(`Can we wrap up soon? I promised a friend I'd be somewhere at seven.`)),
        when(A4, "decline", room.K(`Seven. I can still make seven.`)),
        when(A4, "accept", loungeV.E(`Then post first. Say you're there. People believe in intention, and the picture can catch up.`)),
        when(A4, "compromise", loungeV.E(`Then post first. Say you're on your way. It reads as loyalty. Nobody checks the timestamp.`)),
        when(A4, "decline", room.N(`A message from Elias glows beside the editor. Post first. Say you're there. Nobody checks the timestamp.`)),
        phone.N(`7:12 PM. Knox opens Liquore with his thumb already moving. A photograph of a Glasshouse chair, a caption in gold: second row for my best friend tonight.`, { image: "feed-notification" }),
        phone.K(`It's technically true. I'm going to be there. Soon.`),
        phone.N(`He posts it. The hearts begin before he has pocketed the phone.`),
        phone.N(`Inside the Glasshouse, Seraphine is on a small wooden stage, holding a notebook. She glances at the second row, then at her own phone, then at the second row again.`),

        cafe.N(`Knox arrives at 8:05. The Glasshouse is dim and almost empty, and the string lights have started to look like they're waiting for someone.`),
        cafe.N(`Chairs are being stacked. At the back, Mira is winding film onto a spool. She sees him, says nothing, and goes back to her camera.`),
        when(A4, "accept", cafeS.K(`Seraphine. I'm so sorry. The shoot ran long and then the traffic...`)),
        when(A4, "compromise", cafeS.K(`Seraphine. I'm so sorry. The trial shoot ran long and then the traffic...`)),
        when(A4, "decline", cafeS.K(`Seraphine. I'm so sorry. I lost track of time and then the traffic...`)),
        cafeS.S(`You posted that you were in the second row at 7:12.`),
        cafeS.K(`I know. I meant to be, I was practically...`),
        cafeS2.S(`I read my second poem looking at an empty chair. I told myself you were stuck in traffic. Then I saw your story.`),
        cafeS2.K(`It was just a photo.`),
        cafeS2.S(`It was a photo of my night, taken by someone who wasn't in it.`),
        cafeS2.N(`She doesn't raise her voice. That is somehow the worst part. Seraphine has never needed volume to say the true thing.`),
        cafeS3.S(`I don't need you to be perfect, Knox. I needed you to be here. I keep looking at your profile and I can't find the person I know.`),
        cafeS3.K(`That's not fair. This is the first time anything has worked for me. You don't know what this means.`),
        cafeS3.S(`Maybe I don't. But I know what it cost tonight.`),
        cafeS3.S(`Call me when it's you.`),
        cafeS3.N(`She picks up her notebook and walks out through the glass door. The string lights ripple in the movement she leaves behind.`),
        cafeM.M(`She waited until the last chair was empty. I thought you should know.`),
        cafeM.N(`Mira doesn't sound angry. She sounds like someone describing a photograph that didn't develop.`),

        bridge.N(`The Overpass is windy and nearly empty. Knox leans on the railing and doesn't know what to do with his hands, so he holds his phone.`),
        bridgeMsg.N(`Four messages from Seraphine, sent before eight. He reads them in order.`, { image: "message-thread" }),
        bridgeMsg.N(`Below the last one, the story he posted is already past a thousand views. Both screens glow in his hand.`, { image: "message-thread" }),
        bridge.N(`It would be easy to explain this away, or to feel something he doesn't want to feel. He could defend himself, face the question underneath, or just stand here, unsure.`, {
            choices: [
                {
                    text: `Defend yourself. She doesn't get it.`,
                    key: "act5_confrontation", value: "defensive",
                    points: { approval: 2 },
                    response: `She doesn't understand what this means to me.`
                }, {
                    text: `Face the question she's really asking.`,
                    key: "act5_confrontation", value: "reflect",
                    points: { reflection: 2 },
                    response: `When did I start caring more about this than about her?`
                }, {
                    text: `Admit she's right, with nowhere to put it.`,
                    key: "act5_confrontation", value: "unsure",
                    points: { reflection: 1, curiosity: 1 },
                    response: `Maybe she's right. But what am I supposed to do now?`
                }
            ]
        }),
        when("act5_confrontation", "defensive", bridge.K(`She doesn't understand what this means to me.`)),
        when("act5_confrontation", "reflect", bridge.K(`When did I start caring more about this than about her?`)),
        when("act5_confrontation", "unsure", bridge.K(`Maybe she's right. But what am I supposed to do now?`)),
        when("act5_confrontation", "defensive", bridge.N(`He types a long reply, deletes it, and types a shorter one that sounds more like a caption than an apology. He doesn't send it.`)),
        when("act5_confrontation", "reflect", bridge.N(`The question has an answer, and he doesn't like how quickly it arrives. It started somewhere between the first notification and the thirtieth.`)),
        when("act5_confrontation", "unsure", bridge.N(`He wants to fix it, and can't find the handle. Everything he knows how to do belongs to a screen.`)),
        bridge.N(`Behind him, the traffic keeps moving. Ahead, the city is lit like a feed that never ends. And in his pocket, the phone buzzes. Once. Twice. A third time, from numbers he doesn't know.`)
    ];

    window.WSAChapters = window.WSAChapters || {};
    window.WSAChapters[5] = { number: 5, title: "When the Screens Collide", lines };
})();
