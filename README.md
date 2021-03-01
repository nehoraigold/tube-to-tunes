# Tube 2 Tunes
Tube 2 Tunes is a command-line tool to download audio from 
YouTube videos.

### Configuration
In the root directory, you'll see a `config.json` file. It has
the following fields:
```json5
{
    "outputDirectory": "/absolute_path/where_music_files/should_go",
    "songSource": "where-your-list-of-songs-is",
    "downloader": "yt2mp3" // no need to touch this
}
```

#### OutputDirectory
Pretty self-explanatory. All the MP3 files will be downloaded into this
directory, so make it a good one.

#### SongSource
Tube 2 Tunes supports the following song sources:

* Spotify (`"spotify"`)
* Google Sheets (`"googlesheets"`)

Each of these song sources has a configuration of its own, which you
can (and should) modify in the `configs/` directory. The name of the
the `songSource` key you choose will correspond exactly with the name 
of the JSON file you should modify.

#### Downloader
There's currently only one downloader available, `youtube-to-mp3`, or `yt2mp3`.
No need to modify this value for any reason.

## Song Source Configuration

### Google Sheets

### Spotify

# Ideas For Future Improvement
- Debug mode
- Fill in music info (song name, album, album artwork, track number) automatically
- SongSource: YouTube playlist
