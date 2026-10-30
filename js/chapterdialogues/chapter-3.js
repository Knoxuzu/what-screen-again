(() => {
    const { scene, when } = window.WSAWrite;
    const A2 = "act2_post_reaction";

    const yard = scene("DELIRIUM ACADEMY", "12:10 PM", "delirium-academy");
    const steps = scene("DELIRIUM ACADEMY", "12:14 PM", "delirium-academy", "elias:smile@right");
    const stepsKnox = scene("DELIRIUM ACADEMY", "12:16 PM", "delirium-academy", "knox:neutral@left elias:smile@right");
    const stepsKnox2 = scene("DELIRIUM ACADEMY", "12:20 PM", "delirium-academy", "knox:worried@left elias:neutral@right");
    const room = scene("KNOX'S BEDROOM", "1:12 AM", "knox-bedroom");
    const feed = scene("LIQUORE · FEED", "1:14 AM", "social-media-feed");
    const feedProp = scene("LIQUORE · FEED", "1:20 AM", "social-media-feed");
    const mirror = scene("KNOX'S BEDROOM", "1:48 AM", "knox-bedroom");
    const end = scene("KNOX'S BEDROOM", "2:05 AM", "knox-bedroom");

    const lines = [
        when(A2, "grounded", yard.N(`Two days on, the attention hasn't faded. Knox has stopped pretending he doesn't notice it, and has started pretending he doesn't enjoy it.`)),
        when(A2, "approval", yard.N(`Two days on, he posted again. Same warm light, same quiet caption. It did well. Not as well as the first, but well enough to make the silence between posts feel louder.`)),
        when(A2, "reflection", yard.N(`Two days on, he hasn't posted again. He keeps rereading the comments, looking for someone who is talking to him rather than to the picture.`)),
        yard.N(`At noon, a small crowd gathers on the Academy steps. In the middle of it, someone is laughing at exactly the right volume.`),
        steps.N(`Elias Vane is the kind of person light seems to prefer. His shirt is crisp, his hair looks windblown on purpose, and every phone in the crowd is slightly angled toward him.`),
        steps.E(`Desk-and-sunset. Good to finally meet the man behind the plant shadow.`),
        stepsKnox.K(`Everyone's calling me that. I'm starting to worry that's all I am.`),
        stepsKnox.E(`Worse things to be. Honestly, I'm a little jealous. You made something people believed.`),
        stepsKnox.K(`You have, what, fifty thousand followers?`),
        stepsKnox.E(`Forty-eight point two. But numbers are the easy part. Posting at 6:15. Three outfits. Same three smiles. It's a system.`),
        stepsKnox.N(`He says it lightly, like a recipe. Knox laughs, but part of him is taking notes.`),
        stepsKnox2.K(`Doesn't it get exhausting?`),
        stepsKnox2.E(`Exhausting?`),
        stepsKnox2.N(`For half a second, something tired crosses Elias's face. Then the smile returns, flawless, like a screen waking up.`),
        stepsKnox.E(`Never. See you around, Knox. Keep posting.`),

        room.N(`Past one in the morning. The apartment lights beyond his window have gone out one by one, but the glow from his screen keeps the room awake.`),
        room.K(`Just a few minutes. Then sleep.`),
        feed.N(`The feed opens like a door onto a party he wasn't invited to. A rooftop dinner. A skyline at golden hour. A group of classmates in matching smiles.`, { image: "feed-posts" }),
        feed.N(`Elias has posted three times today. Each photograph matches the last: the same warm palette, the same careful carelessness.`),
        feed.N(`Then there is Valeria Infernum, whose name arrives with a quarter of a million followers and a crimson glow. Her latest post has been liked by half of Liktoren.`),
        feed.K(`How do they do this every day?`),
        feedProp.N(`He opens his own profile beside Elias's. The comparison takes less than a second, and lasts much longer.`, { image: "profile-compare" }),
        feedProp.K(`A plant. A cup. A desk. That's the whole thing.`),
        feedProp.N(`Fifty thousand people, and a thousand. A rooftop, and a windowsill. He knows these are only chosen moments. Knowing it doesn't help.`, { image: "profile-compare" }),
        mirror.N(`He tries, just to see. He turns off the lamp, dims the room, tilts the cup. He takes the same photograph thirty times, and none of them look like Elias's.`),
        mirror.K(`Why does mine look so... plain?`),
        mirror.N(`Behind him, the real room waits: the notebook, the unwashed mug, the crooked plant. It has never looked less like a picture, and he has never been more aware of it.`),
        end.N(`The screen glows. Somewhere between the third rooftop and the thirtieth retake, the question has changed shape. It isn't what they have anymore. It's what he is.`),
        end.K(`Okay. So what do I do about this?`),
        end.N(`He could study them, step back from them, or look more closely at what he's been admiring.`, {
            choices: [
                {
                    text: `Study them. Figure out how to match it.`,
                    key: "act3_comparison", value: "imitate",
                    points: { approval: 2 },
                    response: `What's stopping me from being more like them?`
                }, {
                    text: `Admire the view, then close the tab.`,
                    key: "act3_comparison", value: "own-path",
                    points: { authenticity: 2 },
                    response: `Their lives look nice. Mine doesn't have to look the same.`
                }, {
                    text: `Question what's behind the curation.`,
                    key: "act3_comparison", value: "question",
                    points: { reflection: 2 },
                    response: `How much of what I'm seeing is even real?`
                }
            ]
        }),
        when("act3_comparison", "imitate", end.K(`What's stopping me from being more like them?`)),
        when("act3_comparison", "own-path", end.K(`Their lives look nice. Mine doesn't have to look the same.`)),
        when("act3_comparison", "question", end.K(`How much of what I'm seeing is even real?`)),
        when("act3_comparison", "imitate", feedProp.N(`He saves Elias's color preset, bookmarks three posts, and starts a list called Things To Try. It feels productive. It feels, a little, like homework for someone else's life.`)),
        when("act3_comparison", "own-path", end.N(`He closes the tab. The feed vanishes, and the dark window returns, with a real city in it, flickering and imperfect and entirely unposed.`)),
        when("act3_comparison", "question", feedProp.N(`He zooms in. The same cup, at the same angle, in three different posts. A reflection in a pair of sunglasses holds a ring light. Nothing in the picture is a lie. None of it is quite the truth either.`, { image: "feed-posts" })),
        end.N(`A notification slides across the top of the screen, soft as a hand on his shoulder.`),
        end.N(`valeria.infernum started following you.`),
        end.K(`...She what?`)
    ];

    window.WSAChapters = window.WSAChapters || {};
    window.WSAChapters[3] = { number: 3, title: "Everyone, Except Myself", lines };
})();
