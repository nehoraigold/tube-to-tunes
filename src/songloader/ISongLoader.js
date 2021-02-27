

class ISongLoader {
     Initialize = async () => { return false; };
     LoadSongs = async () => { return false; };
     GetSongs = () => { return []; };
     MarkAllAsProcessed = async () => { };
}

module.exports = ISongLoader;