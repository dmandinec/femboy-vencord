import { ApplicationCommandOptionType } from "../../api/Commands";
import definePlugin from "@utils/types";
import { Logger } from "@utils/Logger";

function rand(min: number, max: number) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

async function fetchReddit(sub: string, sort: string = 'top') {
    let imageUrl: string;

    do {
        const url = `https://www.reddit.com/r/${sub}/${sort}.json?limit=100`;
        const res = await fetch(url);
        const resp = await res.json();
        try {
            const { children } = resp.data;
            let r = rand(0, children.length - 1);
            imageUrl = children[r].data.url;
        } catch (err) {
            console.error(resp);
            console.error(err);
            imageUrl = "Error fetching image.";
        }
    } while (imageUrl && imageUrl.includes("https://www.reddit.com/gallery/"));

    return imageUrl;
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
                name: "sort",
                description: "Sort posts by (hot, new, top, etc.)",
                type: ApplicationCommandOptionType.STRING,
                required: false,
                choices: [
                    { label: "Hot", name: "Hot", value: "hot" },
                    { label: "New", name: "New", value: "new" },
                    { label: "Top", name: "Top", value: "top" },
                    { label: "Rising", name: "Rising", value: "rising" },
                    { label: "Controversial", name: "Controversial", value: "controversial" },
                    { label: "Best", name: "Best", value: "best" }
                ],
            },
        ],

        async execute(args) {
            let sort: string;

            try {
                sort = args[0].value;
            } catch (_) {
                sort = "hot";
            }

            const imageUrl = await fetchReddit("femboys", sort);
            return {
                content: imageUrl || "No image found.",
            };
        },
    }]
});
