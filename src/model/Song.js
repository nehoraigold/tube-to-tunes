class Song {
    constructor(name, artist, videoId, durationSeconds = 0) {
        this.name = name;
        this.artist = artist;
        this.youtubeVideoId = videoId;
        this.durationSeconds = durationSeconds;
    }
}

module.exports = Song;