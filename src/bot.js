const { get } = require("request-promise-native")
const { Client, MessageEmbed } = require("discord.js");

const client = new Client();

const PREFIX = "$";

client.on("ready", () => {
    console.log(`${client.user.tag} has logged in.`);
});

client.on("message", (message) => {
    if (message.author.bot) return;
    if (message.content.startsWith(PREFIX)) {
        const [CMD_NAME, ...args] = message.content
            .trim()
            .substring(PREFIX.length)
            .split(/\s+/);

        if (CMD_NAME === "help") {
            const usage = new MessageEmbed()
                .setTitle(`AniBot Help`)
                .setColor("RANDOM")
                .setDescription(`**Usage:**
                    *Anime:* $anime ANIME_NAME_HERE
                    *Manga:* $manga MANGA_NAME_HERE`)
                .setTimestamp();

            message.channel.send(usage);
        }

        else if (CMD_NAME === "anime") {
            if (!args.length) return message.channel.send("Please Provide an Anime Name!!!");

            let option = {
                url: `https://kitsu.io/api/edge/anime?filter[text]=${args.join(" ")}`,
                method: 'GET',
                headers: {
                    'Accept': "application/vnd.api+json",
                    'Content-Type': "application/vnd.api+json"
                },
                json: true
            }

            message.channel.send("Fetching Your Anime Information.....")
                .then(msg => {
                    get(option).then(mat => {
                        const Embed = new MessageEmbed()
                            .setTitle(mat.data[0].attributes.titles.en_jp)
                            .setURL(`https://kitsu.io/anime/${mat.data[0].id}`)
                            .setTimestamp()
                            .setThumbnail(mat.data[0].attributes.posterImage.original)
                            .setDescription(mat.data[0].attributes.synopsis)
                            .setColor("RANDOM")
                            .addField("Type", mat.data[0].attributes.showType, true)
                            .addField("Published", `${mat.data[0].attributes.startDate} **To** ${mat.data[0].attributes.endDate ? mat.data[0].attributes.endDate: "N/A"}`, true)
                            .addField("Status", mat.data[0].attributes.status, true)
                            .addField("Episode Count", mat.data[0].attributes.episodeCount ? mat.data[0].attributes.episodeCount: "N/A", true)
                            .addField("Duration", `${mat.data[0].attributes.episodeLength ? mat.data[0].attributes.episodeLength: "N/A"} Minutes`, true)
                            .addField("RANK", mat.data[0].attributes.ratingRank, true)
                            .addField("Average Rating", mat.data[0].attributes.averageRating, true);

                        message.channel.send(Embed);
                        msg.delete();
                    })

                    .catch(() => {
                        msg.delete();
                        message.channel.send(`No Anime by the name **"${args.join(" ")}"** exists. Please check the spelling or try another!!!`);
                    })
                })
        }

        else if (CMD_NAME === "manga") {
            if (!args.length) return message.channel.send("Please Provide an Manga Name!!!");

            let option = {
                url: `https://kitsu.io/api/edge/manga?filter[text]=${args.join(" ")}`,
                method: 'GET',
                headers: {
                    'Accept': "application/vnd.api+json",
                    'Content-Type': "application/vnd.api+json"
                },
                json: true
            }

            message.channel.send("Fetching Your Manga Information.....")
                .then(msg => {
                    get(option).then(mat => {
                        const Embed = new MessageEmbed()
                            .setTitle(mat.data[0].attributes.titles.en_jp)
                            .setURL(`https://kitsu.io/manga/${mat.data[0].id}`)
                            .setTimestamp()
                            .setThumbnail(mat.data[0].attributes.posterImage.original)
                            .setDescription(mat.data[0].attributes.synopsis)
                            .setColor("RANDOM")
                            .addField("Type", mat.data[0].attributes.mangaType, true)
                            .addField("Published", `${mat.data[0].attributes.startDate} **To** ${mat.data[0].attributes.endDate ? mat.data[0].attributes.endDate: "N/A"}`, true)
                            .addField("Status", mat.data[0].attributes.status, true)
                            .addField("Volume Count", mat.data[0].attributes.volumeCount ? mat.data[0].attributes.volumeCount: "N/A", true)
                            .addField("Chapter Count", mat.data[0].attributes.chapterCount ? mat.data[0].attributes.chapterCount: "N/A", true)
                            .addField("RANK", mat.data[0].attributes.ratingRank, true)
                            .addField("Average Rating", mat.data[0].attributes.averageRating, true)
                            .addField("Serialization", mat.data[0].attributes.serialization, true);

                        message.channel.send(Embed);
                        msg.delete();
                    })

                    .catch(() => {
                        msg.delete();
                        message.channel.send(`No Manga by the name **"${args.join(" ")}"** exists. Please check the spelling or try another!!!`);
                    })
                })
        }
    }
});

client.login(process.env.DISCORD_BOT_TOKEN);
