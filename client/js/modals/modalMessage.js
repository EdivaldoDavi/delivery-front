import { modalFunctions } from "../modalFunctions.js";

/**
 * ModalMessage class.
 * 
 * Initializes the modal properties and adds event listeners to its buttons.
 */
export class modalMessage {

    #idModal;
    #message;
    #confirmResult;
    #title;
    #focusElementWhenClosingModal;
    #idDefaultButton;
    #objConfigs;

    constructor() {
        this.#idModal = "#modalMessage";
        this.#message = null;
        this.#confirmResult = undefined;
        this.#title = null;
        this.#focusElementWhenClosingModal = null;
        this.#idDefaultButton = null;
        this.#objConfigs = {
            buttons: {
                confirmYes: {
                    idFocus: 1,
                    text: 'Sim',
                },
                confirmNo: {
                    idFocus: 2,
                    text: 'Não',
                }
            }
        }
        this.addEvents();
    }

    set setMessage(message) {
        this.#message = message;
    }

    set setTitle(title) {
        this.#title = title;
    }

    set setFocusElementWhenClosingModal(elem) {
        this.#focusElementWhenClosingModal = elem;
    }

    /**
     * Specifies the default button to receive focus.
     *
     * @type {number}
     * @property {number} focusPattern - Focus pattern for buttons (1 for "Confirm" button, 2 for "Deny" button).
     */
    set setIdDefaultButton(id) {
        this.#idDefaultButton = id;
    }

    get getObjConfigs() {
        return this.#objConfigs;
    }

    set setObjConfigs(obj) {
        this.#objConfigs = obj;
    }

    async modalOpen() {

        const self = this;
        let title = 'Confirmação de Ação';
        if (self.#title !== null) {
            title = self.#title;
        }
        $(self.#idModal).find('.modal-title').html(title);

        if (self.#message !== null) {
            $(self.#idModal).find('.message').html(self.#message);
            await self.#modalHideShow();
            const confirmYes = $(self.#idModal).find('.confirmYes');
            const confirmNo = $(self.#idModal).find('.confirmNo');
            confirmYes.html(self.#objConfigs.buttons.confirmYes.text);
            confirmNo.html(self.#objConfigs.buttons.confirmNo.text);
            if (([1, 2].findIndex((item) => item == self.#idDefaultButton)) != -1) {
                if (self.#idDefaultButton == 1) {
                    modalFunctions.executeFocusElementOnModal(confirmYes);
                } else {
                    modalFunctions.executeFocusElementOnModal(confirmNo);
                }
            } else {
                modalFunctions.executeFocusElementOnModal(confirmNo);
            }
            return new Promise(function (resolve) {
                const checkConfirmation = setInterval(async function () {
                    if (self.#confirmResult !== undefined) {
                        clearInterval(checkConfirmation);
                        await self.#modalHideShow(false);
                        resolve(self.#confirmResult);
                        self.modalClose();
                        self.#confirmResult = undefined;
                    }
                }, 100);
            });
        } else {
            const message = 'Nenhuma mensagem foi definida';
            console.error(message);
            $.notify(`Não foi possível abrir a confirmação.\nSe o problema persistir consulte o desenvolvedor.\nErro: ${message}`, 'error');
            self.modalClose();
        }

    }

    async #modalHideShow(status = true) {
        return new Promise((resolve) => {
            const modal = $(this.#idModal);
            const eventName = status ? 'shown.bs.modal' : 'hidden.bs.modal';
            const callback = () => {
                modal.off(eventName, callback);
                resolve(true);
            };
            modal.on(eventName, callback);
            status ? modal.modal('show') : modal.modal('hide');
        });
    }

    async modalClose() {
        const self = this;
        self.#title = null;
        self.#message = null;
        const modal = $(self.#idModal);
        modal.find("*").off();
        modal.off('keydown');
        modalFunctions.executeFocusElementOnModal(self.#focusElementWhenClosingModal);
    }

    addEvents() {
        const self = this;
        const modal = $(self.#idModal);
        modal.find(".confirmYes").click(function () {
            self.#confirmResult = true;
        });
        modal.find(".confirmNo, .btn-close").click(function () {
            self.#confirmResult = false;
        });
        modal.on('keydown', function (e) {
            if (e.key === 'Escape') {
                modal.find(".confirmNo").click();
                e.stopPropagation();
            }
        });
    }
}
