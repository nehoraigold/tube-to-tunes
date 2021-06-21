class Song {
    constructor(name,
        artist,
        videoId,
        album = "",
        track = "",
        yearReleased = "",
        durationSeconds = 0,
        albumArtworkUrl = "") {
        this.name = name;
        this.artist = artist;
        this.youtubeVideoId = videoId;
        this.album = album;
        this.track = track;
        this.yearReleased = yearReleased;
        this.durationSeconds = durationSeconds;
        this.albumArtworkUrl = albumArtworkUrl;
    }
}

module.exports = Song;
