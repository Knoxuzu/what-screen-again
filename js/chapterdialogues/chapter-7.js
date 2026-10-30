(() => {
    const { scene, when } = window.WSAWrite;
    const only = (ending, line) => ({ ...line, condition: { ending } });

    const room = scene("KNOX'S BEDROOM", "5:48 AM", "knox-bedroom-day");
    const dark = scene("KNOX'S BEDROOM", "5:52 AM", "black-glass");
    const dawn = scene("THE LIKTOREN OVERPASS", "6:20 AM", "liktoren-overpass-dawn");
    const pi = scene("THE CRIMSON LOUNGE", "8:30 PM", "crimson-lounge", "knox:smile@left valeria:smile@right");
    const piE = scene("THE CRIMSON LOUNGE", "8:44 PM", "crimson-lounge", "knox:smile@left elias:tired@right");
    const piEnd = scene("KNOX'S BEDROOM", "2:14 AM", "black-glass");
    const bt = scene("THE LIKTOREN OVERPASS", "7:05 AM", "liktoren-overpass-dawn", "knox:worried@left seraphine:neutral@right");
    const bt2 = scene("THE LIKTOREN OVERPASS", "7:12 AM", "liktoren-overpass-dawn", "knox:neutral@left seraphine:concerned@right");
    const btEnd = scene("LIKTOREN · NIGHT", "10:30 PM", "city-night");
    const su = scene("THE GLASSHOUSE CAFE", "4:10 PM", "glasshouse-cafe", "knox:neutral@left seraphine:concerned@right");
    const su2 = scene("THE GLASSHOUSE CAFE", "4:22 PM", "glasshouse-cafe", "knox:smile@left mira:smile@right");
    const suEnd = scene("KNOX'S BEDROOM", "6:40 PM", "sunset-desk");
    const db = scene("THE LIKTOREN OVERPASS", "7:30 AM", "liktoren-overpass-dawn");
    const dbM = scene("THE LIKTOREN OVERPASS", "7:44 AM", "liktoren-overpass-dawn", "knox:neutral@left mira:smile@right");
    const dbEnd = scene("LIKTOREN · MORNING", "8:02 AM", "city-night");

    const lines = [
        room.N(`The phone sits on the desk, face-down and silent. Knox didn't turn it off. He just stopped picking it up, and the room has been getting louder around that absence ever since.`),
        room.N(`Two days. The thread that felt like a flood has thinned to a trickle. Someone else has done something worse, or funnier, or simply newer. The city moved on faster than he thought possible.`),
        room.K(`That's it? That's all it takes for everyone to forget?`),
        room.N(`He expected relief. What he feels is stranger: the sense of standing in a very large room, after the music has stopped, wondering whether anyone was ever dancing with him.`),
        dark.N(`The monitor is dark. In its glass, a faint outline waits, sitting where his reflection always is. For once, there's no filter, no photograph, no audience on the other side.`, { image: "filter-mirror" }),
        dark.K(`Who's still here when I log out?`),
        when("act5_confrontation", "defensive", dark.N(`He thinks of Seraphine's last message, still unanswered, and how convinced he was that she hadn't understood. He wonders, quietly, how much of that certainty was his.`)),
        when("act5_confrontation", "reflect", dark.N(`He thinks of the question he asked himself on the Overpass, and how long it took to answer it honestly. He still hasn't decided what to do with the answer.`)),
        when("act5_confrontation", "unsure", dark.N(`He thinks of the Overpass, and the answer he couldn't find. He still doesn't have one. But the not-knowing feels less like a trap than it did.`)),
        dawn.N(`Before sunrise, Knox walks to the Overpass without his phone. The traffic below is thin, and the towers are still lit, their windows pale in the first gray.`),
        dawn.N(`The city of reflections has always been good at showing him what he wanted to see. Today it only shows him itself: a place of strangers who were mostly looking at their own screens.`),
        dawn.K(`I took a photograph because I liked how it looked. When did that stop being enough?`),
        dawn.N(`The sun begins to rise. He has nothing to photograph it with, and for a moment, the sunrise is simply his.`),
        dawn.N(`Whatever comes next, he has a choice about how to go back to the glass.`),

        only("perfect-illusion", pi.N(`Three days later, the Crimson Lounge is warm and perfectly lit. The apology went up at noon: soft light, a trembling caption, a single tear he didn't have to fake. The numbers came back by dinner.`)),
        only("perfect-illusion", pi.V(`Look at that. Eight hundred thousand impressions. You couldn't buy this kind of sincerity.`)),
        only("perfect-illusion", pi.K(`It was sincere.`)),
        only("perfect-illusion", pi.V(`Of course it was. That's why it worked.`)),
        only("perfect-illusion", pi.N(`He laughs. It sounds exactly like the laugh in his videos. He can't remember whether he chose that, or whether it chose him.`)),
        only("perfect-illusion", piE.E(`You're a natural, you know. You don't even flinch anymore.`)),
        only("perfect-illusion", piE.N(`Elias says it kindly, and for a heartbeat he looks very tired. Then the ring light flicks on, and his smile is flawless again.`)),
        only("perfect-illusion", piE.K(`Does it ever get quiet for you?`)),
        only("perfect-illusion", piE.E(`Why would you want it to?`)),
        only("perfect-illusion", piEnd.N(`At two in the morning, the notifications keep coming. Hearts. Sparkles. Strangers saying they feel seen.`)),
        only("perfect-illusion", piEnd.K(`They feel seen.`)),
        only("perfect-illusion", piEnd.N(`He reaches for the photograph from the first night, the cup, the notebook, the stripe of sunset. He can't find it in the feed. He isn't sure he could still take it.`)),
        only("perfect-illusion", piEnd.SYS(`ENDING · THE PERFECT ILLUSION`)),
        only("perfect-illusion", piEnd.SYS(`The feed loves him. Somewhere behind it, someone stopped answering to his name.`)),

        only("between-two-worlds", bt.N(`Seraphine is already on the Overpass when he arrives, hands in her pockets, watching the traffic. He hadn't texted her. She says she saw him walking, from the cafe window.`)),
        only("between-two-worlds", bt.K(`I'm sorry. For the story. For the chair. For all of it.`)),
        only("between-two-worlds", bt.S(`I know you are. I could tell by the way you didn't post it.`)),
        only("between-two-worlds", bt2.K(`I don't know what to do about the account. I don't want to quit it. I don't want to be the guy from that thread, either.`)),
        only("between-two-worlds", bt2.S(`You don't have to decide today. But I can't be the thing you check between posts, Knox. I need to know which version is going to show up.`)),
        only("between-two-worlds", bt2.K(`Both of them are me.`)),
        only("between-two-worlds", bt2.S(`That's what scares me. Neither of them is lying. They just don't want the same things.`)),
        only("between-two-worlds", bt2.N(`She doesn't hug him. She stays beside him on the railing for a long while, close enough to talk to, far enough to leave.`)),
        only("between-two-worlds", btEnd.N(`That night, he posts a short note. No filter, no preset, a single honest paragraph about the story and the chair. It doesn't go viral. It does get seen by the people he most hoped would read it.`)),
        only("between-two-worlds", btEnd.N(`He keeps the account. He keeps the phone close. He keeps wondering which of the two windows is the real one.`)),
        only("between-two-worlds", btEnd.SYS(`ENDING · BETWEEN TWO WORLDS`)),
        only("between-two-worlds", btEnd.SYS(`He sees the split now. He just hasn't decided which side of the glass to live on.`)),

        only("self-unfiltered", su.N(`The Glasshouse Cafe is full of afternoon light again. Seraphine sits at the corner table, notebook closed, coffee untouched. She agreed to meet him. She didn't agree to anything else.`)),
        only("self-unfiltered", su.K(`I didn't come to explain. I came to say what I did. I posted I was there when I wasn't. I used your night for my feed. That wasn't an accident. It was a choice.`)),
        only("self-unfiltered", su.S(`That's the first time you've told me something without a caption.`)),
        only("self-unfiltered", su.K(`I took the story down. I took down the other ones too, the ones that weren't mine. I'm keeping the ones I'd have taken anyway.`)),
        only("self-unfiltered", su.S(`And the Crimson Lounge?`)),
        only("self-unfiltered", su.K(`I deleted Valeria's number. Elias texted to say good luck. I think he meant it.`)),
        only("self-unfiltered", su.N(`She looks at him for a long time. Her face isn't forgiving yet. But it's open, and the door has no ring light behind it.`)),
        only("self-unfiltered", su.S(`Read me something next Thursday. At the open mic. Not a photograph. Something you wrote.`)),
        only("self-unfiltered", su2.M(`I brought the film camera. Seraphine says you owe me forty followers and a roll of Portra.`)),
        only("self-unfiltered", su2.K(`I think I can manage both.`)),
        only("self-unfiltered", suEnd.N(`That evening, the sun lays a stripe across his desk, exactly as it did the first night. Cup, notebook, the shadow of a plant reaching toward the wall.`)),
        only("self-unfiltered", suEnd.N(`He takes one photograph. He posts it with no caption, and puts the phone in a drawer. For once, it isn't an experiment. It's just a picture he likes.`)),
        only("self-unfiltered", suEnd.SYS(`ENDING · THE SELF UNFILTERED`)),
        only("self-unfiltered", suEnd.SYS(`He is still learning who he is. But he's learning it in a room with the lights on.`)),

        only("different-beginning", db.N(`Knox sits on the Overpass railing with a notebook, not his phone. He writes down what he can see, plainly, like someone making an inventory after a fire.`)),
        only("different-beginning", db.K(`I compared myself to everyone. I performed for people I didn't know. I let a number decide whether a photograph was good.`)),
        only("different-beginning", db.N(`The list gets longer than he expected. None of it surprises him. That is the unsettling part: he has known every line of it for weeks.`)),
        only("different-beginning", db.K(`Knowing isn't the same as fixing it.`)),
        only("different-beginning", dbM.M(`You look like someone who finally read the instructions and found out they were about him.`)),
        only("different-beginning", dbM.K(`Is there a version where I just stop?`)),
        only("different-beginning", dbM.M(`There's no version where you just stop. There's a version where you keep noticing, and keep choosing differently, and sometimes fail.`)),
        only("different-beginning", dbM.M(`Seraphine isn't ready, by the way. That isn't a punishment. It's just true. You can't skip it.`)),
        only("different-beginning", dbM.N(`She lifts her camera and takes a photograph of him without asking, then lowers it and shows him the screen. It's grainy, uneven, and very much him.`)),
        only("different-beginning", dbEnd.N(`That morning, he deactivates his account. Not forever, only until he knows what he wants to say with it. The silence is enormous. It is also, for the first time in months, entirely his.`)),
        only("different-beginning", dbEnd.SYS(`ENDING · A DIFFERENT BEGINNING`)),
        only("different-beginning", dbEnd.SYS(`He sees the pattern now. What he does with it is the next story.`))
    ];

    window.WSAChapters = window.WSAChapters || {};
    window.WSAChapters[7] = { number: 7, title: "Who Remains When We Log Out?", lines };
})();
