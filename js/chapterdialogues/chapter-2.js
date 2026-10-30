(() => {
    const { scene, when } = window.WSAWrite;
    const A1 = "act1_first_choice";

    const room = scene("KNOX'S BEDROOM", "7:20 AM", "knox-bedroom-day");
    const roomStats = scene("KNOX'S BEDROOM", "7:24 AM", "knox-bedroom-day");
    const yard = scene("DELIRIUM ACADEMY", "9:05 AM", "delirium-academy");
    const yardPair = scene("DELIRIUM ACADEMY", "9:08 AM", "delirium-academy", "knox:neutral@left seraphine:smile@right");
    const yardPair2 = scene("DELIRIUM ACADEMY", "9:12 AM", "delirium-academy", "knox:worried@left seraphine:neutral@right");
    const cafe = scene("THE GLASSHOUSE CAFE", "3:40 PM", "glasshouse-cafe");
    const cafeMira = scene("THE GLASSHOUSE CAFE", "3:42 PM", "glasshouse-cafe", "knox:neutral@left mira:smile@right");
    const cafeMira2 = scene("THE GLASSHOUSE CAFE", "3:50 PM", "glasshouse-cafe", "knox:worried@left mira:concerned@right");
    const night = scene("KNOX'S BEDROOM", "11:10 PM", "knox-bedroom");
    const nightStats = scene("KNOX'S BEDROOM", "11:12 PM", "knox-bedroom");

    const lines = [
        room.N(`Morning reaches the desk before Knox does. His phone, face-down beside the pillow, has been buzzing for a while.`),
        when(A1, "authentic", room.N(`Last night, he posted the photograph exactly as it was. No filter, no caption. A quiet little square of his evening.`)),
        when(A1, "approval", room.N(`Last night, he spent forty minutes fixing the light and rewriting the caption. The photograph that went up looked more like a magazine page than his desk.`)),
        when(A1, "curiosity", room.N(`Last night, he scrolled until the shape of what he wanted came into focus. Then he posted the photograph with a caption that sounded suspiciously like everyone else's.`)),
        when(A1, "privacy", room.N(`Last night, he kept the desk photograph to himself. But near midnight he took another one, a cup on a windowsill, and posted it before he could talk himself out of it.`)),
        roomStats.N(`Seventeen notifications. Then forty. Then a number he has to read twice.`, { image: "post-stats" }),
        roomStats.K(`That's not right. That's the wrong post.`, { image: "post-stats" }),
        roomStats.N(`It isn't. The photograph has been shared, reshared, and tagged into feeds he has never seen. Strangers are calling it honest. Others are calling it aesthetic.`, { image: "post-stats" }),
        room.K(`Honest. Aesthetic. Those aren't the same thing, are they?`),
        room.N(`He expects to feel nervous. Instead, something warm unfolds in his chest, quick and bright, like the first sip of something sweet.`),
        room.K(`Okay. That's kind of nice.`),
        room.N(`He checks the number again. It has grown by sixty. He tells himself he is only curious.`),

        yard.N(`Delirium Academy rises over the courtyard in glass and old stone, every window holding a small, tilted copy of the morning.`),
        yard.N(`Knox crosses it and notices the difference at once. Heads turn, just slightly. Someone he has never spoken to nods at him like they've met.`),
        yardPair.S(`There he is. The mysterious photographer of Delirium Academy.`),
        yardPair.K(`Please don't.`),
        yardPair.S(`Oh, I will. Three separate people have shown me your post this morning. One of them nearly cried. I think it was the plant shadow.`),
        yardPair.K(`You're exaggerating.`),
        yardPair.S(`A little. But I told you your pictures were good, and now the internet is finally catching up.`),
        yardPair.N(`Seraphine Austin has known Knox since before either of them had opinions about photography. She says exactly what she means, then offers you half her sandwich.`),
        yardPair2.K(`It's weird. Yesterday nobody was looking. Today it feels like everyone is.`),
        yardPair2.S(`Is that a bad weird or a good weird?`),
        yardPair2.K(`I haven't decided yet.`),
        yardPair.S(`Fair. Thursday, though. The Glasshouse, my first open mic. You promised.`),
        yardPair.K(`I'll be there. Front row.`),
        yardPair.S(`Don't be dramatic. Second row. The front row is for people who cry.`),
        yardPair.N(`She laughs, and he laughs with her. For a moment the courtyard is only a courtyard. Then his phone buzzes, and half his attention follows it.`),

        cafe.N(`The Glasshouse Cafe holds the afternoon under its glass ceiling. Plants hang from every beam, and the light lands in soft green squares.`),
        cafe.N(`At the corner table, a girl in round glasses is loading film into a camera that looks older than both of them.`),
        cafeMira.M(`You're the desk-and-sunset guy.`),
        cafeMira.K(`Is that what I'm called now?`),
        cafeMira.M(`Among the forty people who follow me, yes. I'm Mira. I saw your photograph when it had eleven likes.`),
        cafeMira.K(`Eleven. Wow. Okay.`),
        cafeMira.M(`I liked it more at eleven. It felt like it was only talking to the people who found it by accident.`),
        cafeMira2.M(`Do you still like it? The photograph, I mean. Not the number.`),
        cafeMira2.K(`Of course I like it. It's...`),
        cafeMira2.K(`I think I do.`),
        cafeMira2.N(`The question is gentle, but it lands somewhere he hasn't looked yet. Beside his cup, the phone lights up again, and he glances at it before he can stop himself.`),

        night.N(`By midnight, the post has crossed a number Knox can't quite say out loud. His desk is quiet. His phone is not.`),
        nightStats.N(`Comments scroll past: hearts, sparkles, strangers saying they feel seen. He reads every one, even though it takes an hour.`, { image: "post-stats" }),
        night.K(`They feel seen. By a picture of my desk.`),
        night.N(`It should feel strange. Mostly it feels like being handed a mirror that only shows his best angle.`),
        night.K(`What do I do with this?`),
        night.N(`The attention hums in the room like a second light. What he does with it next might say something about what he wants from it.`, {
            choices: [
                {
                    text: `Let the surprise be what it is.`,
                    key: "act2_post_reaction", value: "grounded",
                    points: { authenticity: 1, curiosity: 1 },
                    response: `I didn't think anyone would care this much.`
                }, {
                    text: `Chase it. Post something like it tomorrow.`,
                    key: "act2_post_reaction", value: "approval",
                    points: { approval: 2 },
                    response: `If this worked once, I could probably do it again.`
                }, {
                    text: `Wonder what they'd see if they knew him.`,
                    key: "act2_post_reaction", value: "reflection",
                    points: { reflection: 2 },
                    response: `I wonder if they'd still like it if they knew me better.`
                }
            ]
        }),
        when("act2_post_reaction", "grounded", night.K(`I didn't think anyone would care this much.`)),
        when("act2_post_reaction", "approval", night.K(`If this worked once, I could probably do it again.`)),
        when("act2_post_reaction", "reflection", night.K(`I wonder if they'd still like it if they knew me better.`)),
        when("act2_post_reaction", "grounded", night.N(`He lets the feeling be what it is: surprising, a little frightening, and not yet an instruction.`)),
        when("act2_post_reaction", "approval", night.N(`A small, hungry idea settles in. A second post. Better light. A caption with more edge. He opens his camera roll with a different kind of attention.`)),
        when("act2_post_reaction", "reflection", night.N(`The question hangs between the comments. Strangers like the person in the photograph. Whether they would like the person holding the camera is a different experiment.`)),
        scene("LIKTOREN · NIGHT", "11:40 PM", "city-night").N(`Outside, Liktoren glitters in its thousand windows. Somewhere out there, a few thousand strangers are thinking about Knox. He has never been so visible, or so unsure who they are looking at.`)
    ];

    window.WSAChapters = window.WSAChapters || {};
    window.WSAChapters[2] = { number: 2, title: "The Sweetness of Being Seen", lines };
})();
