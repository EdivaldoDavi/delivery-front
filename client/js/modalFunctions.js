
export class modalFunctions {

    /**
     * Sets up default event handlers for modals, such as close, cancel, and save actions.
     *
     * @param {Object} self - The reference to the current object.
     * @param {Object} options - Additional options to configure the event handlers.
     * @param {boolean} options.formRegister - Whether to include additional event handlers for registration forms (default: false).
     */
    static eventDefaultModals(self, options = {}) {
        const { formRegister = false,
            inputsSearchs = null
        } = options;

        const idModal = self.getIdModal;
        const modal = $(idModal);

        modal.find(".btn-save").on("click", function (e) {
            e.preventDefault();
            self.saveButtonAction();
        });

        modal.find('.btn-close').on('click', function () {
            self.setEndTimer = true;
        });

        modal.find('.btn-cancel').on('click', function () {
            if (formRegister == true) {
                if (typeof self.modalCancel === 'function') {
                    self.modalCancel();
                } else {
                    self.setEndTimer = true;
                }
            } else {
                self.setEndTimer = true;
            }
        });

        modal.on('keydown', function (e) {
            if (e.key === 'Escape') {
                e.stopPropagation();
                self.setEndTimer = true;
            }
        });

        modal.on('click', function (e) {
            if ($(e.target).hasClass('modal')) {
                self.setEndTimer = true;
            }
        });

        if (formRegister == true) {
            this.addDefaultRegistrationModalEvents(self);
        }

        if (inputsSearchs != null) {
            this.addDefaultSearchModalEvents(self, inputsSearchs);
        }

    }

    static executeFocusElementOnModal(elem) {
        if (elem !== null && $(elem).length) {
            setTimeout(() => {
                $(elem).focus();
            }, 500);
        }
    }

}