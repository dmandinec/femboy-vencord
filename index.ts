import { ApplicationCommandOptionType } from "../../api/Commands";
import definePlugin from "../../utils/types";

function rand(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

async function fetchReddit(sub: string, sort: string = 'top') {
    const url = `https://www.reddit.com/r/${sub}/${sort}.json?limit=100`;
    const res = await fetch(url);
    const resp = await res.json();
    try {
        const { children } = resp.data;
        let r = rand(0, children.length - 1);
        return children[r].data.url;
    } catch (err) {
        console.error(resp);
        console.error(err);
        return "Error fetching image.";
    }
}



export default definePlugin({
    name: "Femboy-Images", // Updated plugin name
    authors: [{
        name: "dmandinec",
        id: BigInt(376079696489742338),
    }],
    description: "Add a command to send femboy images from Reddit",
    dependencies: ["CommandsAPI"],
    commands: [{
        name: "femboy",
        description: "Send a femboy image from Reddit",
        options: [
            {
                name: "nsfw",
                description: "Include NSFW content",
                type: ApplicationCommandOptionType.BOOLEAN,
                required: false,
            },
            {
                name: "sort",
                description: "Sort posts by (hot, new, top, etc.)",
                type: ApplicationCommandOptionType.STRING,
                required: false,
                choices: [
                    { name: "Hot", value: "hot" },
                    { name: "New", value: "new" },
                    { name: "Top", value: "top" },
                    { name: "Rising", value: "rising" },
                    { name: "Controversial", value: "controversial" },
                    { name: "Best", value: "best" }
                ],
            },
        ],

        async execute(args) {
            let sub = "femboys"; // Default subreddit for femboy images
            let sort = "top"; // Default sorting
            let nsfw = false; // NSFW content flag

            args.forEach(arg => {
                switch (arg.name) {
                    case "nsfw":
                        nsfw = arg.value;
                        sub = nsfw ? "FemBoys_NSFW" : "femboys"; // Change to the NSFW subreddit if needed
                        break;
                    case "sort":
                        sort = arg.value;
                        break;
                }
            });

            const imageUrl = await fetchReddit(sub, sort);
            return {
                content: imageUrl || "No image found.",
            };
        },
    }]
});
