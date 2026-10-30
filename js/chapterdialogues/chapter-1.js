(() => {
    const { scene, when } = window.WSAWrite;
    const A1 = "act1_first_choice";

    const room1 = scene("KNOX'S BEDROOM", "8:42 PM", "knox-bedroom");
    const room2 = scene("KNOX'S BEDROOM", "8:43 PM", "knox-bedroom");
    const room3 = scene("KNOX'S BEDROOM", "8:44 PM", "knox-bedroom");
    const room4 = scene("KNOX'S BEDROOM", "8:45 PM", "knox-bedroom");
    const room5 = scene("KNOX'S BEDROOM", "8:46 PM", "knox-bedroom");
    const room6 = scene("KNOX'S BEDROOM", "8:47 PM", "knox-bedroom");
    const room7 = scene("KNOX'S BEDROOM", "8:48 PM", "knox-bedroom");
    const room8 = scene("KNOX'S BEDROOM", "8:49 PM", "knox-bedroom");
    const room9 = scene("KNOX'S BEDROOM", "8:50 PM", "knox-bedroom");
    const room10 = scene("KNOX'S BEDROOM", "8:51 PM", "knox-bedroom");
    const feed1 = scene("SOCIAL MEDIA FEED", "8:44 PM", "social-media-feed");
    const feed2 = scene("SOCIAL MEDIA FEED", "8:45 PM", "social-media-feed");
    const feed3 = scene("SOCIAL MEDIA FEED", "8:50 PM", "social-media-feed");
    const memory = scene("MEMORY · SUNSET", "EARLIER", "sunset-desk");
    const night = scene("LIKTOREN · NIGHT", "8:51 PM", "city-night");

    const lines = [
        room1.N(`Liktoren, 8:42 PM. The city settles into its evening rhythm, while Knox's bedroom remains illuminated by the glow of his monitor.`),
        room1.N(`Apartment lights flicker on beyond his window. Behind every square of glass, someone has a life Knox can only imagine.`),
        room1.K(`Okay. One picture. That's all I need to post.`),
        room1.N(`The photograph shows a cup beside his notebook, a stripe of sunset across his desk, and the shadow of a plant reaching toward the wall.`, { image: "desk-photograph" }),
        room2.K(`I actually like this one.`, { image: "desk-photograph" }),
        room2.N(`The cursor hovers over the upload button. Knox could share the photograph now, but suddenly, the decision feels bigger than it should.`),
        room2.K(`Maybe I should write a caption first.`),
        room2.K(`"Quiet evenings." No. That sounds like I'm trying too hard.`),
        room2.K(`"Little things." Somehow, that's worse.`),
        room3.N(`He deletes the caption. The photograph remains, waiting for a decision that apparently requires more thought than taking it did.`),
        room3.K(`Why am I acting like this is some big decision?`),

        feed1.N(`His other tab is already open. Someone has posted dinner. Someone else has shared a skyline. A group of classmates smile together in another photograph.`, { image: "feed-posts" }),
        feed1.K(`Everyone makes it look so easy.`, { image: "feed-posts" }),
        feed2.N(`He knows these are only selected moments. Nobody can fit an entire day into a picture. Knowing that doesn't stop him from comparing his own life to them.`, { image: "feed-posts" }),
        feed2.K(`Maybe they don't think about it this much.`, { image: "feed-posts" }),
        feed2.N(`A notification appears. Someone has liked a post he shared earlier. It's a small acknowledgment, but he finds himself checking it twice.`, { image: "feed-notification" }),
        feed2.K(`Huh. They saw it.`, { image: "feed-notification" }),
        feed2.N(`For a moment, he's pleased. Then he catches himself waiting for another notification, and the feeling becomes a little less comfortable.`),
        room4.K(`That's kind of embarrassing.`),

        room5.N(`He returns to his photograph. The warm light, the cup, the notebook. Nothing about the image has changed since he first took it.`, { image: "desk-photograph" }),
        room5.K(`I took this because I liked how it looked. Didn't I?`, { image: "desk-photograph" }),
        memory.N(`He remembers the sunset catching his attention while he was working. He reached for his phone before he ever considered whether anyone else would see the picture.`),
        room5.K(`It looked nice. That's literally the whole story.`, { image: "desk-photograph" }),
        room5.N(`Now the photograph carries other questions. Will anyone care? Will they understand it? Will it look ordinary beside everyone else's carefully chosen moments?`, { image: "desk-photograph" }),
        room6.K(`I could just leave it in my camera roll.`, { image: "desk-photograph" }),
        room6.N(`He doesn't close the window. He could share the moment, keep it private, or spend another few minutes watching what everyone else has chosen to show.`),
        room6.K(`I wish I could stop making everything mean something.`),
        room6.N(`Outside, headlights sweep across the wall. For a moment, the room brightens. Then the light disappears, leaving the monitor as the room's brightest thing.`),

        room7.K(`All right. What do I actually want to do?`),
        room7.N(`For once, he tries to answer without imagining an audience. The photograph was something he liked before it became something other people might judge.`, { image: "desk-photograph" }),
        room7.K(`I like the picture. I know that much.`, { image: "desk-photograph" }),
        room7.N(`But liking something and sharing it aren't quite the same. One belongs to him. The other invites people into the moment, whether he is ready for their opinions or not.`),
        room7.K(`Maybe I don't have to figure all of that out tonight.`),
        room7.N(`His reflection is faintly visible on the monitor. Behind it sits the photograph, caught between the room it came from and the world it might enter.`),
        room7.K(`Okay. One choice. Then I'm done thinking about it.`),
        room8.N(`He could trust his own taste, polish the image for other people's eyes, look for inspiration elsewhere, or decide that the moment doesn't need to be shared.`),
        room8.K(`What am I waiting for?`),
        room8.N(`The screen offers no answer. It only reflects the room back at him, along with the person trying to decide how much of himself to place on the other side of the glass.`),
        room8.K(`I guess I get to choose.`),
        room8.N(`No audience, no reactions, no imagined comments. Just Knox, a photograph, and a decision that might say a little about what he needs tonight.`, {
            choices: [
                {
                    text: `Post it. I like it, and that's enough.`,
                    key: A1, value: "authentic",
                    points: { authenticity: 2 },
                    response: `I took it because I liked how it looked. That's enough of a reason, right?`
                }, {
                    text: `Fix the lighting and caption until people might like it.`,
                    key: A1, value: "approval",
                    points: { approval: 2 },
                    response: `Maybe I should fix the lighting first. And the caption. If I'm going to post it, I might as well make it good.`
                }, {
                    text: `Look around a little longer before deciding.`,
                    key: A1, value: "curiosity",
                    points: { curiosity: 2 },
                    response: `Let's see what everyone else is doing first. Maybe I'll figure out what I want after that.`
                }, {
                    text: `Keep it private. Not every moment needs an audience.`,
                    key: A1, value: "privacy",
                    points: { privacy: 2 },
                    response: `Actually, I don't have to post it at all. I can just keep it for myself.`
                }
            ]
        }),
        when(A1, "authentic", room9.K(`I took it because I liked how it looked. That's enough of a reason, right?`)),
        when(A1, "approval", room9.K(`Maybe I should fix the lighting first. And the caption. If I'm going to post it, I might as well make it good.`)),
        when(A1, "curiosity", feed3.K(`Let's see what everyone else is doing first. Maybe I'll figure out what I want after that.`, { image: "feed-posts" })),
        when(A1, "privacy", room9.K(`Actually, I don't have to post it at all. I can just keep it for myself.`, { image: "desk-photograph" })),
        room9.N(`The choice is made. The photograph hasn't changed, and the city beyond the window continues without knowing anything about it.`),
        room9.K(`I guess that's that.`),
        room10.N(`For tonight, Knox has made a decision. Whether it came from confidence, uncertainty, curiosity, or a need for privacy, it belongs to him.`),
        night.N(`Beyond the glass, Liktoren glimmers beneath the night sky. The screen reflects Knox's face, and for a moment, the image and the person seem almost impossible to separate.`)
    ];

    window.WSAChapters = window.WSAChapters || {};
    window.WSAChapters[1] = { number: 1, title: "A World Behind Glass", lines };
})();
