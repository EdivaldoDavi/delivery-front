import { bootstrapFunctions } from "./bootstrapFunctions.js";

export class systemNotifications {

    #message;
    #title;
    #type;
    #traceId;
    #timeDelay;

    constructor(message = undefined, type = 'info', render = false) {
        this.#message = message;
        this.#title = null;
        this.#type = type;
        this.#traceId = undefined;
        this.#timeDelay = 2500;

        if (render) {
            return this.render();
        }
    }

    /**
     * @param {string} message
     */
    set setMessage(message) {
        this.#message = message;
    }

    /**
     * @param {string} title
     */
    set setTitle(title) {
        this.#title = title
    }

    /**
     * @param {string} type
     */
    set typeNotification(type) {
        this.#type = type;
    }

    set setTraceId(traceId) {
        this.#traceId = traceId
    }

    /**
     * @param {number} time
     */
    set timeDelay(time) {
        this.#timeDelay = time;
    }

    render() {
        const self = this;

        return new Promise(async function (resolve) {
            resolve(await bootstrapFunctions.createNotification(self.#message, { type: self.#type, title: self.#title, traceId: self.#traceId, delay: self.#timeDelay }));
        })

    }
}