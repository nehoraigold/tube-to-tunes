//region imports
const ISearchAlgo = require("./ISearchAlgo");
//endregion

class OfficialAudioSearchAlgo extends ISearchAlgo {
    constructor(youtube) {
        super();
        this.youtube = youtube;
        this.searchFields = {
            part: "snippet",
            chart: "mostPopular",
            type: "video"
        }
    }

    Search = async (track) => {
        const { data } = await this.youtube.search.list({
            ...this.searchFields,
            q: `${track.name} ${track.artist} official audio`
        });
        const videoIds = data.items.map((item) => item.id.videoId);
        return videoIds[0];
    };
}

module.exports = OfficialAudioSearchAlgo;