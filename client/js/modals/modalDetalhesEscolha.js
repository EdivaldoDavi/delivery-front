import { commonFunctions } from "../commonsFunctions.js";
import { modalFunctions } from "../modalFunctions.js";
import { modalMessage } from "./modalMessage.js";

export class modalDetalhesEscolha {

    /**
     * ID do modal
     */
    #idModal;
    /** 
     * Conteúdo a ser retornado na promisse como resolve()
    */
    #promisseReturnValue;
    /**
     * Variável que executará o fim do setInterval de retoro da promisse com reject()
     */
    #endTimer;
    /**
     * Elemento foco ao fechar modal
     */
    #focusElementWhenClosingModal;
    /**
     * Variável para reservar a ação a ser executada
     */
    timerSearch;
    /** 
     * Dados ou parâmetros enviados para o modal.
     */
    #dataEnvModal;
    /**
     * Objeto para reservar configurações do modal
     */
    #objConfigs

    constructor() {
        this.#idModal = "#modalDetalhesEscolha";
        this.#promisseReturnValue = {
            refresh: false,
            obj_product: undefined,
            clear_cart: false
        };
        this.#focusElementWhenClosingModal = null;
        this.#endTimer = false;
        this.#dataEnvModal = {
            obj_product: undefined,
        };
        this.#objConfigs = {
            qntdItems: 1,
        }
        this.#addEventsDefault();
    }

    /**
     * Retorna o ID do Modal.
     */
    get getIdModal() {
        return this.#idModal;
    }

    /**
     * Define o valor do timer de fim, utilizado na função modalOpen.
     * @param {Boolean} value - Novo valor para indicar o término do timer.
     */
    set setEndTimer(value) {
        this.#endTimer = value;
    }

    /**
     * Define o elemento de foco de fechamento.
     * @param {jQuery} elem - O elemento jQuery a ser definido como foco de fechamento.
     */
    set setFocusElementWhenClosingModal(elem) {
        this.#focusElementWhenClosingModal = elem;
    }

    /**
     * Define o objeto de dados ou parâmetros enviados para o modal.
     * @param {Object} value - Novo valor para o objeto.
     */
    set setDataEnvModal(value) {
        this.#dataEnvModal = value;
    }

    get getDataEnvModal() {
        return this.#dataEnvModal;
    }

    async modalOpen() {
        const self = this;
       
        if (!self.#dataEnvModal.obj_product) {
            commonFunctions.generateNotification('O produto para personalização não foi enviado.', 'error');
            return Promise.resolve(self.#promisseReturnValue);
        } else {
            await self.#getDataAll();
            await self.#modalHideShow();
        }

        return new Promise(function (resolve) {
            const checkConfirmation = setInterval(async function () {
                if (self.#endTimer) {
                    clearInterval(checkConfirmation);
                    resolve(self.#promisseReturnValue);
                    await self.#modalClose();
                }
            }, 250);
        });
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

    async #modalClose() {
        const self = this;
        this.#initializeAdditionals();
        const modal = $(self.#idModal);
        await self.#modalHideShow(false);
        modal.find("*").off();
        modal.off('keydown');
        self.modalCancel();
        // modal.find('.modal-title').html('Novo orçamento');
        modalFunctions.executeFocusElementOnModal(self.#focusElementWhenClosingModal);
    }

    modalCancel() {
        const self = this;
        self.#clearForm();
    }

    #clearForm() {
        const self = this;
        $(self.#idModal).find('#itensOpcionais').html('');
        $(self.#idModal).find('#obsProduct').val('');
        $(self.#idModal).find('.menu-bottom .add-numero-itens').html(1);
        $(self.#idModal).find('.text-btn-save').html('Adicionar ');
    }

    async #addEventsDefault() {
        const self = this;
        const modal = $(self.#idModal);
        modalFunctions.eventDefaultModals(self);
        self.modalCancel();
        const btnMenos = $(self.#idModal).find('.menu-bottom .btn-menos');
        const btnMais = $(self.#idModal).find('.menu-bottom .btn-mais');
        btnMenos.attr('disabled', true);
        const fillQtd = (qtd) => {
            $(self.#idModal).find('.menu-bottom .add-numero-itens').html(qtd);
            self.#executeSubTotal();
        }
        btnMenos.on('click', function () {
            if (self.#objConfigs.qntdItems > 1) {
                self.#objConfigs.qntdItems--;
                fillQtd(self.#objConfigs.qntdItems);
            }
        });
        btnMais.on('click', function () {
            self.#objConfigs.qntdItems++;
            fillQtd(self.#objConfigs.qntdItems);
        });
    }

    async #fillListAdditionals() {
        const self = this;
        const divOpcionais = $(self.#idModal).find('#divOpcionais');
        const divItens = $(self.#idModal).find('#itensOpcionais');
        divItens.html('');
        if (!self.#dataEnvModal.obj_product.additionals.length) {
            divOpcionais.addClass('hidden');
            return;
        } else {
            divOpcionais.removeClass('hidden');
        }
        console.log(self.#dataEnvModal.obj_product.additionals);
        self.#dataEnvModal.obj_product.additionals.forEach(element => {
            console.log(element);
            const priceFormated = element.price.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
            divItens.append(`
            <div id="additional-${element.id}" class="card card-opcionais mt-2 p-0">
                <label for="additionalModalDetalhesEscolha-${element.id}" class="form-check-label infos-produto-opcional p-2" style="cursor:pointer;">
                        <span class="name"><b>${element.name}</b></span>
                        <span class="price"><b>+ ${priceFormated}</b></span>
                </label>
                <div class="checks p-2 ps-0">
                    <label class="container-check">
                        <input id="additionalModalDetalhesEscolha-${element.id}" type="checkbox" ${element.qntd > 0 ? 'checked' : ''} />
                        <span class="checkmark"></span>
                    </label>
                </div>
            </div>
            `);
            self.#addEventsAdditional(element.id);
        });
    }
// Inicializa o estado dos adicionais ao carregar o modal
async #initializeAdditionals() {
    const self = this;
    const divItens = $(self.#idModal).find('#itensOpcionais');

    // Itera sobre todos os checkboxes e atualiza o estado inicial
    divItens.find('input[type="checkbox"]').each(function() {
        const idAdditional = $(this).closest('[id^="additional-"]').attr('id').split('-')[1];
        const isChecked = this.checked;
        const objIndex = self.#dataEnvModal.obj_product.additionals.findIndex(obj => obj.id == idAdditional);

        if (isChecked) {
            if (objIndex === -1) {
                self.#dataEnvModal.obj_product.additionals.push({
                    id: idAdditional,
                    qntd: 1
                });
            } else {
                self.#dataEnvModal.obj_product.additionals[objIndex].qntd = 1;
            }
        } else {
            if (objIndex !== -1) {
                self.#dataEnvModal.obj_product.additionals.splice(objIndex, 1);
            }
        }
    });

    // Atualiza o subtotal inicial
    self.#executeSubTotal();

    console.log('Initial additional items:', self.#dataEnvModal.obj_product.additionals);
}

// Chame esta função após abrir o modal ou quando precisar inicializar o estado



async #addEventsAdditional(idAdditional) {
    const self = this;
    const divItens = $(self.#idModal).find('#itensOpcionais');
    divItens.find(`#additional-${idAdditional}`).find('input[type="checkbox"]').on('click', function () {
        if (this.checked) {
            const objIndex = self.#dataEnvModal.obj_product.additionals.findIndex((obj => obj.id == idAdditional));
            self.#dataEnvModal.obj_product.additionals[objIndex].qntd = 1;
            self.#executeSubTotal();
        } else {
            const objIndex = self.#dataEnvModal.obj_product.additionals.findIndex((obj => obj.id == idAdditional));
            self.#dataEnvModal.obj_product.additionals[objIndex].qntd = 0;
            self.#executeSubTotal();
        }
    });
}

    async #executeSubTotal() {
        const self = this;
        const btnMenos = $(self.#idModal).find('.menu-bottom .btn-menos');
        if (self.#objConfigs.qntdItems <= 1) {
            btnMenos.attr('disabled', true);
        } else {
            btnMenos.attr('disabled', false);
        }
        let sum = self.#dataEnvModal.obj_product.price;
        self.#dataEnvModal.obj_product.additionals.forEach(element => {
            if (element.qntd > 0) {
                sum += element.price * element.qntd;
            }
        })
        sum *= self.#objConfigs.qntdItems;
        $(self.#idModal).find('#priceTotal').html(sum.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' }));
    }

    async #getDataAll() {
        const self = this;
        const modal = $(self.#idModal);
        try {
            modal.find('.container-imagem-produto').css('background-image', `url(${self.#dataEnvModal.obj_product.img})`);
            modal.find('.nameProduct').html(self.#dataEnvModal.obj_product.name);
            modal.find('.dscProduct').html(self.#dataEnvModal.obj_product.dsc);
            modal.find('.priceProduct').html(self.#dataEnvModal.obj_product.price.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' }));
            if (self.#dataEnvModal.obj_product.obs) {
                modal.find('#obsProduct').val(self.#dataEnvModal.obj_product.obs);
            }
            if (self.#dataEnvModal.obj_product.qntd) {
                self.#objConfigs.qntdItems = self.#dataEnvModal.obj_product.qntd;
                modal.find('.menu-bottom .add-numero-itens').html(self.#objConfigs.qntdItems);
            }
            await self.#fillListAdditionals();
            await self.#executeSubTotal();
            if (self.#dataEnvModal.obj_product.uuid) {
                $(self.#idModal).find('.text-btn-save').html('Atualizar');
            }
        } catch (error) {
            self.#endTimer = true;
            console.error(error);
        }
    }

    saveButtonAction() {
        const self = this;
        self.#dataEnvModal.obj_product['obs'] = $(self.#idModal).find('#obsProduct').val().trim();
        self.#dataEnvModal.obj_product['qntd'] = self.#objConfigs.qntdItems;
        self.#save();
    }

    async #saveVerification() {
        const self = this;
        const selfCompany = self.#dataEnvModal.obj_product.category.company.id;
        const companyCart = MEU_CARRINHO.length ? MEU_CARRINHO[0].category.company.id : undefined;
        if (companyCart === undefined || companyCart === selfCompany) {
            return true;
        } else {
            try {
                await self.#modalHideShow(false);
                const obj = new modalMessage();
                obj.setMessage = 'Há produtos em seu carrinho de outro estabelecimento. Deseja remover esses itens?';
                obj.setTitle = 'Remover itens de outro estabelecimento';
                const result = await obj.modalOpen();
                if (result) {
                    self.#promisseReturnValue.clear_cart = true;
                    return true;
                } else {
                    return false;
                }
            } finally {
                if (!self.#promisseReturnValue.clear_cart) {
                    await self.#modalHideShow();
                }
            }
        }
    }

    async #save() {
        const self = this;
        if (!await self.#saveVerification()) {
            return;
        }
        self.#promisseReturnValue.refresh = true;
        self.#promisseReturnValue.obj_product = self.#dataEnvModal.obj_product;
        self.#endTimer = true;
    }

}