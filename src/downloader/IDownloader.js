class IDownloader {
    Initialize = async () => { return false; };
    SetCompletionCallback = (completionCallback) => { };
    Download = async (song) => { };
}

module.exports = IDownloader;