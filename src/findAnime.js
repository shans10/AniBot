const axios = require('axios');

const getFormattedText = (animeList) => {
    if (animeList.length === 0) return `No Animes found associated with the given scene!`;

    let text = `Here are the Animes that matched the given scene:\n\n`;

    animeList.forEach(anime => {
        text += `${anime.title_english}\n`;
        text += `https://anilist.co/anime/${anime.anilist_id}\n\n`;
    });

    return text;
}

const findAnime = async ({ imageUrl }) => {
    const res = await axios.get(`https://trace.moe/api/search?url=${imageUrl}`);
    const filteredAnime = res.data.docs.filter(anime => anime.similarity > 0.87);

    return getFormattedText(filteredAnime);
}

module.exports = findAnime;