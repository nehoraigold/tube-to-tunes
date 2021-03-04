//region imports
const { durationStringToSeconds } = require("../../utils/utils");
const ISearchAlgo = require("./ISearchAlgo");
//endregion

class OfficialAudioSearchAlgo extends ISearchAlgo {
    constructor(youtube) {
        super();
        this.youtube = youtube;
        this.maxResults = 10;
        this.additionalSearchText = "official audio";
    }

    Search = async (track) => {
        const videoIds = await this.getRelevantVideoIds(track);
        if (track.durationSeconds) {
            return this.getBestVideoId(videoIds, track.durationSeconds);
        } else {
            return videoIds[0];
        }
    };

    getRelevantVideoIds = async (track) => {
        const { data } = await this.youtube.search.list({
            part: "snippet",
            chart: "mostPopular",
            type: "video",
            maxResults: this.maxResults,
            q: `${track.name} ${track.artist} ${this.additionalSearchText}`
        });
        return data.items.map((item) => item.id.videoId);
    };

    getBestVideoId = async (videoIds, duration) => {
        const videoIdToDuration = this.getVideoDurations(videoIds, duration);
        return this.getVideoIdClosestInDuration(videoIdToDuration);
    };

    getVideoDurations = async (videoIds, duration) => {
        const videoIdToDuration = {};
        const { data } = await this.youtube.videos.list({
            part: ["contentDetails"],
            id: videoIds.join(",")
        });
        data.items.forEach(item => {
            videoIdToDuration[item.id] = durationStringToSeconds(item.contentDetails.duration) - duration;
        });
        return videoIdToDuration;
    };

    getVideoIdClosestInDuration = async (videoIdToDuration) => {
        const HOW_MUCH_SHORTER_VIDEO_CAN_BE_COMPARED_TO_SONG__SECONDS = 5;
        let bestVideoId;
        let closestDuration = Number.POSITIVE_INFINITY;
        for (const [videoId, duration] of Object.entries(videoIdToDuration)) {
            if (duration < -1 * HOW_MUCH_SHORTER_VIDEO_CAN_BE_COMPARED_TO_SONG__SECONDS) {
                continue;
            }
            if (duration < closestDuration) {
                bestVideoId = videoId;
                closestDuration = duration;
            }
        }
        return bestVideoId;
    };
}

module.exports = OfficialAudioSearchAlgo;