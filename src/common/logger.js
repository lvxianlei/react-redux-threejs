function logger() {
    this.log = (message, ...arg) => {
        this.__proto__.log(message, ...arg);
    };
    this.warn = (message, ...arg) => {
        this.__proto__.warn(message, ...arg);
    };
    this.info = (message, ...arg) => {
        this.__proto__.info(message, ...arg);
    };
    this.error = (message, ...arg) => {
        this.__proto__.error(message, ...arg);
    };
    this.trace = (message, ...arg) => {
        this.__proto__.trace(message, ...arg);
    };
    this.debug = (message, ...arg) => {
        this.__proto__.debug(message, ...arg);
    };
}

logger.prototype = console;
const lg = new logger();
export default lg;