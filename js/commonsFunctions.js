import { systemNotifications } from "./systemNotifications.js";

export class commonFunctions {

    /**
     * Remove todos os caracteres não numéricos de uma string.
     * @param {string} num – A string a ser processada.
     * @returns {string} – A string com apenas caracteres numéricos.
     */
    static returnsOnlyNumber(num) {
        return String(num).replace(/\D/g, '');
    }

    /**
      * Aplica uma máscara telefônica brasileira a um número e ajusta o formato do número no elemento de destino.
      * @param {string} num – O número de telefone a ser mascarado.
      * @param {string} selector - O seletor jQuery do elemento onde a máscara deve ser aplicada.
      */
    static phoneMask(num, selector) {

        const number = this.returnsOnlyNumber(num);
        $(selector).unmask();

        if (number.length < 11) {
            $(selector).mask('(00) 0000-00009');
        } else {
            $(selector).mask('(00) 0 0000-0009');
        }

        if (this.returnsOnlyNumber($(selector).val()) != number) {
            $(selector).val(this.formatPhone(number));
        }

    }

    /**
      * Formata um número de telefone removendo caracteres não numéricos e aplicando a máscara correta.
      * @param {string} num – O número de telefone a ser formatado.
      * @returns {string} – O número de telefone formatado com a máscara.
      */
    static formatPhone(num) {

        const number = this.returnsOnlyNumber(num);

        if (number.length < 11) {
            return number.replace(/(\d{2})(\d{4})(\d{4})/, '($1) $2-$3');
        } else {
            return number.replace(/(\d{2})(\d)(\d{4})(\d{4})/, '($1) $2 $3-$4');
        }

    }

    /**
      * Aplica uma máscara personalizada a um elemento de entrada numérico.
      *
      * @param {jQuery} elem – O elemento de entrada ao qual a máscara será aplicada.
      * @param {Object} metadata - Metadados que personalizam a máscara.
      * @param {string} metadata.format - A máscara de formato desejada (padrão: '0,99' para números com duas casas decimais).
      * @param {Object} metadata.before - Configurações para dígitos antes da vírgula decimal.
      * @param {number} metadata.before.quantity – O número de dígitos antes da vírgula decimal.
      * @param {Object} metadata.after - Configurações para dígitos após a vírgula decimal.
      * @param {number} metadata.after.quantity – O número de dígitos após a vírgula decimal.
      * @param {boolean} metadata.reverse - Define se a máscara deve ser aplicada em modo reverso (da direita para a esquerda).
      */
    static applyCustomNumberMask(elem, metadata = {}) {
        let format = '0,99';
        $(elem).unmask();

        if (metadata.format) {
            format = metadata.format;
        }

        if ((metadata.before && metadata.before.quantity) || (metadata.after && metadata.after.quantity)) {

            if (metadata.before && metadata.before.quantity) {
                const beforeDigits = '0'.repeat(metadata.before.quantity);
                format = `${beforeDigits}`;
            } else {
                format = '0'
            }

            if (metadata.after && metadata.after.quantity) {
                const afterDigits = '9'.repeat(metadata.after.quantity);
                if (afterDigits) {
                    format += `,${afterDigits}`;
                }
            }

        }

        $(elem).mask(format, { reverse: metadata.reverse });

    }

    static returnArrayToHTML(array, options = {}) {
        const {
            tag = 'li'
        } = options;

        let strItems = '';
        array.forEach(item => {
            strItems += `<${tag}>${item}</${tag}>`
        });

        return strItems;
    }

    /**
     * Gera uma notificação para exibição na interface do usuário.
     * @param {string} message - A mensagem da notificação.
     * @param {string} type - O tipo da notificação (por exemplo, 'success', 'error', 'warning', etc.).
     * @param {Object} [options={}] - Opções adicionais para personalizar a notificação.
     * @param {string} [options.messageTag='h6'] - A tag HTML para envolver a mensagem da notificação.
     * @param {string} [options.messageClass=''] - A classe CSS adicional para estilizar a mensagem da notificação.
     * @param {boolean} [options.applyTag=true] - Indica se a tag HTML especificada deve ser aplicada à mensagem.
     * @param {Array<string>} [options.itemsArray=null] - Um array de itens para incluir na notificação.
     * @param {string} [options.itemsTag='li'] - A tag HTML para cada item na lista de itens.
     * @param {boolean} [options.autoRender=true] - Indica se a notificação deve ser renderizada automaticamente após a geração.
     * @param {any} [options.traceId=undefined] - Um identificador de rastreamento opcional associado à notificação.
     * @returns {Promise<any>} - Uma Promise que resolve com o objeto de notificação renderizado.
     */
    static generateNotification(message, type, options = {}) {
        const {
            messageTag = 'h6',
            messageClass = '',
            applyTag = true,
            itemsArray = null,
            itemsTag = 'li',
            autoRender = true,
            traceId = undefined,
        } = options;

        if (applyTag) {
            const cls = messageClass ? `class="${messageClass}"` : '';
            message = `<${messageTag} ${cls}>${message}</${messageTag}>`
        }

        let strItems = '';
        if (itemsArray) {
            strItems = commonFunctions.returnArrayToHTML(itemsArray, { tag: itemsTag });
            strItems = strItems ? `<hr class="m-1"><ol class="mb-0">${strItems}</ol>` : '';
            message += strItems;
        }

        return new Promise(async function (resolve) {
            const notification = new systemNotifications(message, type);
            notification.setTraceId = traceId;
            resolve(await notification.render());
        })
    }
}