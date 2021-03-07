class ILogger {
    Info = (...message) => { };
    Debug = (...message) => { };
    Err = (...message) => { };
}

module.exports = ILogger;