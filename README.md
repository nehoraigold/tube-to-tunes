# Tube 2 Tunes
Tube 2 Tunes is a command-line tool to download audio from 
YouTube videos.

## Configuration
In the root directory, you'll see a `config.json` file. It has
the following fields:
```json5
{
    "outputDirectory": "/absolute_path/where_music_files/should_go",
    "songSource": "where-your-list-of-songs-is",
    "downloader": "yt2mp3", // no need to touch this
    "reviewMode": "off",
    "enableSongSkip": true
}
```

### OutputDirectory
Pretty self-explanatory. All the MP3 files will be downloaded into this
directory, so make it a good one.

### SongSource
Tube 2 Tunes supports the following song sources:

* Spotify (`"spotify"`)
* Google Sheets (`"googlesheets"`)
* YouTube (`"youtube"`)

Each of these song sources has a configuration of its own, which you
can (and should) modify in the `configs/` directory. The name of the
the `songSource` key you choose will correspond exactly with the name 
of the JSON file you should modify.

### Downloader
There's currently only one downloader available, `youtube-to-mp3`, or `yt2mp3`.
No need to modify this value for any reason.

### Review Mode
You may select one of the supported review modes to see more in-depth
information and modify the song information prior to starting the download.

| __Review Mode__ | __Behavior__ |
| :---------      | :------      |
| `off`           | Only song title and artist will be shown. Song data cannot be modified prior to download. |
| `display`       | All song data will be shown. Song data cannot be modified prior to download. |
| `confirm`       | All song data will be shown and confirmation requested. If desired, song data can be modified prior to download. Requires user input. |
| `edit`          | All song data will immediately be editable prior to download. Requires user input. |

### Enable Song Skip
Sometimes, you may not want to download all songs loaded from a particular
song source. When this feature is set to `true`, Tube 2 Tunes will run
through the list of songs prior to download and allow you to skip over
any unwanted songs. When enabled, this feature requires user input.

## Song Source Configuration

### Google Sheets

### Spotify

### YouTube

# Ideas For Future Improvement
- Debug mode
