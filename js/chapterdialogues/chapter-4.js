(() => {
    const { scene, when } = window.WSAWrite;
    const A3 = "act3_comparison";

    const yard = scene("DELIRIUM ACADEMY", "5:30 PM", "delirium-academy");
    const yardE = scene("DELIRIUM ACADEMY", "5:34 PM", "delirium-academy", "knox:surprised@left elias:smile@right");
    const lounge = scene("THE CRIMSON LOUNGE", "6:40 PM", "crimson-lounge");
    const loungeV = scene("THE CRIMSON LOUNGE", "6:46 PM", "crimson-lounge", "knox:neutral@left valeria:smile@right");
    const loungeV2 = scene("THE CRIMSON LOUNGE", "6:55 PM", "crimson-lounge", "knox:worried@left valeria:cold@right");
    const loungeE = scene("THE CRIMSON LOUNGE", "7:02 PM", "crimson-lounge", "valeria:neutral@left elias:neutral@right");
    const loungeAll = scene("THE CRIMSON LOUNGE", "7:08 PM", "crimson-lounge", "knox:neutral@left valeria:smile@right");
    const bridge = scene("THE LIKTOREN OVERPASS", "9:50 PM", "liktoren-overpass-night");
    const bridgeV = scene("THE LIKTOREN OVERPASS", "9:58 PM", "liktoren-overpass-night");

    const lines = [
        when(A3, "imitate", yard.N(`The week has gone to practice. Knox has a new preset, a stricter schedule, and a folder of photographs he's quietly embarrassed by.`)),
        when(A3, "own-path", yard.N(`The week has gone to ordinary things: lectures, bad coffee, and one photograph he posted only because he liked it. It did fine. He noticed he was fine with that.`)),
        when(A3, "question", yard.N(`The week has gone to watching. Knox now sees the strings in every picture: the angle, the timing, the friend just out of frame holding the light.`)),
        yard.N(`The Academy courtyard empties into evening. Then someone steps out of the crowd and walks straight toward him.`),
        yardE.E(`Knox. Perfect timing. I have something for you.`),
        yardE.N(`Elias holds out a card. It is heavy and black, edged with a thin line of gold, and it is warm from his pocket.`, { image: "invite-card" }),
        yardE.E(`Valeria would like a word. Tonight. The Crimson Lounge. She doesn't ask twice.`),
        yardE.K(`Why me?`),
        yardE.E(`Because you didn't try. Do you know how rare that is?`),

        lounge.N(`The Crimson Lounge is hidden behind an unmarked door below a flower shop. Inside, everything is velvet and red light, and every surface seems to have been built to be photographed.`),
        lounge.N(`A ring light stands in one corner, patient as a moon. Mirrors cover the walls, and in all of them, Knox looks slightly more finished than he feels.`),
        loungeV.N(`Valeria Infernum doesn't rise when he enters. She waits, one hand around a glass she hasn't touched, until he's already crossed half the room.`),
        loungeV.V(`The desk-and-sunset boy. You're smaller than your photographs.`),
        loungeV.K(`That's... a strange thing to say first.`),
        loungeV.V(`It's a compliment. Photographs are supposed to be larger than life. Yours just happen to be honest about it.`),
        loungeV.V(`Let me tell you what I see. Plenty of people can be seen. Almost none of them can look like they aren't trying. You have that. We can make it a brand.`),
        loungeV.K(`A brand?`),
        loungeV.V(`A circle. The Crimson List. Shoots, collaborations, a schedule, a voice. I handle the shape. You supply the mystery.`),
        loungeV2.V(`There are a few conditions. Three posts a day. Our lighting. Nothing too sentimental, and nothing that doesn't scale.`),
        loungeV2.K(`Doesn't scale?`),
        loungeV2.V(`The little things. The friend who writes poetry. The girl with the film camera and forty followers. Affection is lovely, Knox. It just doesn't photograph.`),
        loungeV2.N(`She says it with a warm smile. Somehow, that makes it worse.`),
        loungeE.E(`You don't have to decide in this room. But the door doesn't stay open forever.`),
        loungeE.N(`In the mirrors, a hundred Knoxes wait for his answer, all of them lit perfectly, all of them smiling slightly. None of them looks nervous.`),
        loungeE.N(`He could take the seat, ask for a way in that keeps some of himself, or say what it would cost him.`, {
            choices: [
                {
                    text: `Say yes. Take the seat at the table.`,
                    key: "act4_invitation", value: "accept",
                    points: { approval: 2 },
                    response: `I didn't come this far just to turn this down.`
                }, {
                    text: `Ask for a way in on his own terms.`,
                    key: "act4_invitation", value: "compromise",
                    points: { approval: 1, authenticity: 1 },
                    response: `Can't I be part of this without changing everything?`
                }, {
                    text: `Walk away from the offer.`,
                    key: "act4_invitation", value: "decline",
                    points: { authenticity: 2 },
                    response: `If I have to become someone else, is it really worth it?`
                }
            ]
        }),
        when("act4_invitation", "accept", loungeAll.K(`I didn't come this far just to turn this down.`)),
        when("act4_invitation", "compromise", loungeAll.K(`Can't I be part of this without changing everything?`)),
        when("act4_invitation", "decline", loungeV2.K(`If I have to become someone else, is it really worth it?`)),
        when("act4_invitation", "accept", loungeAll.V(`Smart boy. Elias will send your schedule. First shoot is Thursday, seven o'clock. Wear black.`)),
        when("act4_invitation", "compromise", loungeAll.V(`Everyone says that at first. Fine. A trial shoot, Thursday at seven. We'll see how much of you survives the lighting.`)),
        when("act4_invitation", "decline", loungeV2.V(`Hm. Most people at least pretend to hesitate. Keep my number, Knox. You'll want it eventually.`)),

        bridge.N(`The Liktoren Overpass hums with late traffic. Below, headlights stretch into ribbons. Above, the towers are lit like screens left on.`),
        bridge.K(`Thursday.`),
        bridge.N(`Thursday is also Seraphine's open mic. The thought arrives and sits down beside him, uninvited.`),
        when("act4_invitation", "accept", bridgeV.N(`His phone lights with a message. Valeria: Welcome to the list. Don't tell anyone yet. Mystery is part of the brand.`)),
        when("act4_invitation", "compromise", bridgeV.N(`His phone lights with a message. Valeria: Trial shoot confirmed. Don't be late. Mystery is part of the brand.`)),
        when("act4_invitation", "decline", bridgeV.N(`His phone stays dark. That should feel like relief. Instead, it feels like a door he can still hear.`)),
        bridge.N(`In the dark glass of the railing, his reflection is faint and unfinished. For once, no ring light is flattering it.`),
        bridge.K(`I'll figure it out. I always figure it out.`),
        bridge.N(`The city doesn't answer. It only glimmers, patient and bright, waiting to see what he'll become.`)
    ];

    window.WSAChapters = window.WSAChapters || {};
    window.WSAChapters[4] = { number: 4, title: "An Invitation to Become", lines };
})();
