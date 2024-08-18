import { commonFunctions } from "./commonsFunctions.js";
import { MENU } from "./dados.js";
import { Enums } from "./enums2.js";
import { modalDetalhesEscolha } from "./modals/modalDetalhesEscolha.js";
import { modalMessage } from "./modals/modalMessage.js";

$(document).ready(function () {
    cardapio.eventos.init();
   
});

// Expõe o método publico porque foi importado este arquivo js com type=module
window.cardapio = {};
window.MEU_CARRINHO = [];
let MEU_ENDERECO = null;
let VALOR_CARRINHO = 0;
let CELULAR_EMPRESA = '5514996552177';
let home = true;
var FORMAS_PAGAMENTO = [];
var FORMA_SELECIONADA = null;
var TROCO = 0;

const CONFIG_APP = {
    menu: {
        lastCategory: undefined,
        lastIndexItem: undefined,
    },
    commands: {
        type: Enums.TYPES_COMMANDS.DELIVERY,
        tableNumber: undefined
    },
}


cardapio.eventos = {

    init: () => {
        
        cardapio.metodos.validarEmpresaAberta(home);
        cardapio.metodos.obterCategorias();
        cardapio.metodos.obterItensCardapio();
        cardapio.metodos.obterFormasPagamento();
        cardapio.metodos.carregarBotaoLigar();
        cardapio.metodos.carregarBotaoReserva();
    }

}

cardapio.metodos = {
        // método que exibe o loader
        loading: (running = false) => {

            if (running) {
                document.querySelector(".loader-full").classList.remove('hidden');
            }
            else {
                document.querySelector(".loader-full").classList.add('hidden');
                
            }
    
        },
    
    
    get: (url, callbackSuccess, callbackError, login = true) => {

        try {
            if (cardapio.metodos.validaToken(login)) {

                let xhr = new XMLHttpRequest();
                xhr.open('GET', url);
                xhr.setRequestHeader("Content-Type", 'application/json;charset=utf-8');
                xhr.setRequestHeader("Authorization", cardapio.metodos.obterValorSessao('token'));

                xhr.onreadystatechange = function () {
                    
                    if (this.readyState == 4) {

                        if (this.status == 200) {
                            return callbackSuccess(JSON.parse(xhr.responseText))
                        }
                        else {
    
                            // se o retorno for não autorizado, redireciona o usuário para o login
                            if (xhr.status == 401) cardapio.metodos.logout();
    
                            return callbackError(xhr.responseText);
                        } 

                    } 
                    
                }

                xhr.send();

            }
        }
        catch (ex) {
            return callbackError(ex);
        }

    },

    // centraliza as chamadas de post
    post: (url, dados, callbackSuccess, callbackError, login = false) => {

        try {
            if (cardapio.metodos.validaToken(login)) {

                let xhr = new XMLHttpRequest();
                xhr.open('POST', url);
                xhr.setRequestHeader("Content-Type", 'application/json;charset=utf-8');
                xhr.setRequestHeader("Authorization", cardapio.metodos.obterValorSessao('token'));

                xhr.onreadystatechange = function () {
                    
                    if (this.readyState == 4) {

                        if (this.status == 200) {
                            return callbackSuccess(JSON.parse(xhr.responseText))
                        }
                        else {
    
                            // se o retorno for não autorizado, redireciona o usuário para o login
                            if (xhr.status == 401) cardapio.metodos.logout();
    
                            return callbackError(xhr.responseText);
                        } 

                    } 
                    
                }

                xhr.send(dados);

            }
        }
        catch (ex) {
            return callbackError(ex);
        }

    },

    
    // método para validar se o token existe. É chamado em todas as requisições internas
    validaToken: (login = false) => {

        var tokenAtual = cardapio.metodos.obterValorSessao('token');

        if ((tokenAtual == undefined || tokenAtual == null || tokenAtual == "" || tokenAtual == 'null') && !login) {
            window.location.href = '/painel/login.html';
            return false;
        }

        return true;
    },

    // grava o token no localstorage
    gravarValorSessao: (valor, local) => {
        localStorage[local] = valor;
    },

    // retorna o token atual
    obterValorSessao: (local) => {

        // Valores Sessão -> [token] [nomeUsuario]
        return localStorage[local];

    },

    // remove uma sessao 
    removerSessao: (local) => {
        localStorage.removeItem(local);
    },

    // método que limpa toda o localStorage e redireciona para o login
    logout: () => {
        localStorage.clear();
        window.location.href = '/painel/login.html';
    },

    // valida se a empresa está aberta
    validarEmpresaAberta: async (home = false) => {

        cardapio.metodos.loading(true);

       cardapio.metodos.get('/empresa/open',
            (response) => {

                cardapio.metodos.loading(false);

                // Se estiver na tela principal do cardápio
                if (home) {
                    document.querySelector(".status-open").classList.remove('hidden');
                }

                if (response.status == "error") {

                    // Altera o label de Aberto/Fechado (se estiver na tela principal do cardápio)
                    if (home) {
                        document.querySelector(".status-open").classList.add('closed');
                        document.querySelector("#lblLojaAberta").innerText = 'Fechado';
                    }

                    // Exibe o menu de loja fechada
                    document.querySelector("#menu-bottom").remove();
                    document.querySelector("#menu-bottom-closed").classList.remove('hidden');
                    return;
                }

                // Se estiver na tela principal do cardápio
                if (home) {
                    document.querySelector(".status-open").classList.remove('closed');
                    document.querySelector("#lblLojaAberta").innerText = 'Aberto';
                }
                
                document.querySelector("#menu-bottom").classList.remove('hidden');
                document.querySelector("#menu-bottom-closed").remove();

            },
            (xhr, ajaxOptions, error) => {
                console.log('xhr', xhr)
                console.log('ajaxOptions', ajaxOptions)
                console.log('error', error)
            }, true
        )

    },



    // obtem todas categorias
    obterCategorias: () => {

        const divCategorias = $('.container-menu');
        divCategorias.html('');

        $.each(Enums.CATEGORIES, (i, e) => {
            let strIco = '';
            switch (e.img.type) {
                case Enums.TYPES_IMG.FAS:
                    strIco = `<i class="fas ${e.img.name}"></i>`;
                    break;
                case Enums.TYPES_IMG.IMG:
                    strIco = `<img class="ico-categoria" src="${e.img.name}">`;
                    break;
            }

            divCategorias.append(`
                <a id="menu-${e.id}" class="btn btn-white p-3 rounded-4 shadow border-0 fadeInLeft delay-02s ${!i ? 'active' : ''}" onclick="cardapio.metodos.obterItensCardapio('${e.id}')">
                    ${strIco}</i>&nbsp; ${e.name}
                </a>
            `);
        });

    },

    // obtem os tipos de comandas
    obterTipoDeComandas: async () => {

        const selTypeCommands = $('#selectTypeCommands');
        selTypeCommands.html('').attr('disabled', true);
       
        if (MEU_CARRINHO.length) {
            const arrayTypesCommands = MEU_CARRINHO[0].category.company.typesCommands ?? [];
          //  console.log(MEU_CARRINHO[0].category.company)
          //  console.log(MEU_CARRINHO[0].category.company.typesCommands)

            const mesa = commonFunctions.returnsOnlyNumber(cardapio.metodos.parametroURL('mesa'));
            arrayTypesCommands.forEach(registroempresa => {
                const empresaComandas = Object.values(Enums.TYPES_COMMANDS).filter(tipocomanda => tipocomanda.id === registroempresa.idtipocomanda.toString());
                
              
                if (empresaComandas.find(e => e.id === Enums.TYPES_COMMANDS.LOCAL.id)) {

                    if (mesa > 0) {
                        CONFIG_APP.commands.type = Enums.TYPES_COMMANDS.LOCAL;
                        CONFIG_APP.commands.tableNumber = mesa;
                    } else {
                        CONFIG_APP.commands.type = empresaComandas[0];
                    }
                } else {
                    CONFIG_APP.commands.type = empresaComandas[0];
                }
        
               
            // Predefinir o tipo de comanda para LOCAL se a mesa for maior que 0
            //const mesa = commonFunctions.returnsOnlyNumber(cardapio.metodos.parametroURL('mesa'));
            if (mesa > 0) {
                CONFIG_APP.commands.type = empresaComandas.find(e => e.name === 'LOCAL') || empresaComandas[0];
                CONFIG_APP.commands.type = Enums.TYPES_COMMANDS.LOCAL
            } else {
                CONFIG_APP.commands.type = empresaComandas.find(e => e.id === CONFIG_APP.commands.type.id) || empresaComandas[0];
            }

            // Adicionar as opções ao select
            empresaComandas.forEach(e => {
                let isSelected = false;

                if (mesa > 0 && e.name === 'LOCAL') {
                    isSelected = true;
                } else if (mesa <= 0 && e.id === CONFIG_APP.commands.type.id) {
                    isSelected = true;
                }

                selTypeCommands.append(`
                    <option value="${e.id}" ${isSelected ? 'selected' : ''}>${e.tipodescricao}</option>
                `);
            });

            // Garantir que o select não esteja desabilitado
            selTypeCommands.removeAttr('disabled');
       });
    

        /*    if (arrayTypesCommands.length) {
                console.log(arrayTypesCommands)
                console.log(Enums.TYPES_COMMANDS)
                if (arrayTypesCommands.find(e => e.idtipocomanda === Enums.TYPES_COMMANDS.LOCAL.id)) {
                    const mesa = commonFunctions.returnsOnlyNumber(cardapio.metodos.parametroURL('mesa'));
                    if (mesa > 0) {
                        CONFIG_APP.commands.type = Enums.TYPES_COMMANDS.LOCAL;
                        CONFIG_APP.commands.tableNumber = mesa;
                    } else {
                        CONFIG_APP.commands.type = arrayTypesCommands[0];
                    }
                } else {
                    CONFIG_APP.commands.type = arrayTypesCommands[0];
                }

                console.log(arrayTypesCommands);
                arrayTypesCommands.forEach(e => {
                    selTypeCommands.append(`
                        <option value="${e.id}" ${e.id === CONFIG_APP.commands.type.id ? 'selected' : ''}>${e.name}</option>
                    `);
                });
                selTypeCommands.removeAttr('disabled');
            }*/
        }
    },

    // obtem a lista de itens do cardápio
    obterItensCardapio: async (idCategoria = '1') => {

        const category = Object.values(Enums.CATEGORIES).find(category => category.id === idCategoria);
        if (!category) {
            console.error(`Categoria com id ${idCategoria} não encontrada`);
            commonFunctions.generateNotification('Categoria inexistente', 'error');
            return;
        }

        const additionals = (category.listAdditionals || []).map((itemAcrescimo) => {
            // Cria uma cópia profunda do objeto usando JSON
            const copiaItem = JSON.parse(JSON.stringify(itemAcrescimo));
            copiaItem.qntd = 0;
            return copiaItem;
        });

        let filtro = MENU.map((menu) => menu.category.id === idCategoria ? menu : null).filter((item) => item !== null);

        filtro = filtro.map((item) => {
            // Cria uma cópia profunda do array additionals
            item.additionals = additionals.map(additionals => ({ ...additionals }));
            return item;
        });

        if (CONFIG_APP.menu.lastCategory !== idCategoria) {
            $("#itensCardapio").html('');
            CONFIG_APP.menu.lastCategory = idCategoria;
            CONFIG_APP.menu.lastIndexItem = undefined;
        }

        let initialIndex = undefined;
        let setInitial = false;
        $.each(filtro, (i, e) => {
            if (CONFIG_APP.menu.lastIndexItem !== undefined && setInitial === false) {
                initialIndex = CONFIG_APP.menu.lastIndexItem;
            }
            setInitial = true;
            if ((initialIndex === undefined && i < 8) || i > initialIndex && i < initialIndex + 9) {
                let temp = cardapio.templates.item.replace(/\${img}/g, e.img)
                    .replace(/\${nome}/g, e.name)
                    .replace(/\${dsc}/g, e.dsc)
                    .replace(/\${preco}/g, e.price.toFixed(2).replace('.', ','))
                    .replace(/\${id}/g, e.id)

                if (Enums.TYPES_COMMANDS.QUERY && e.category.company.typesCommands.find(types => types.id == Enums.TYPES_COMMANDS.QUERY.id)) {
                    // Remove o botão com a classe 'btn-add' usando uma expressão regular
                    // Construir a expressão regular dinamicamente com o id real
                    const regex = new RegExp(`<span class="btn btn-add btn-dark rounded rounded-4" onclick="cardapio\\.metodos\\.adicionarAoCarrinho\\('${e.id}'\\)">Selecionar<i class="fa fa-shopping-bag ms-2"></i></span>`);
                    temp = temp.replace(regex, '');
                }




                $("#itensCardapio").append(temp)
                CONFIG_APP.menu.lastIndexItem = i;
            }
        });

        if (CONFIG_APP.menu.lastIndexItem < filtro.length - 1) {
            $("#btnVerMais").removeClass('hidden');
        } else {
            $("#btnVerMais").addClass('hidden');
        }

        // remove o ativo
        $(".container-menu a").removeClass('active');

        // seta o menu para ativo
        $("#menu-" + idCategoria).addClass('active')

    },

    // clique no botão de ver mais
    verMais: () => {

        var ativo = $(".container-menu a.active").attr('id').split('menu-')[1];
        cardapio.metodos.obterItensCardapio(ativo, true);

        // $("#btnVerMais").addClass('hidden');

    },

    // diminuir a quantidade do item no cardapio
    diminuirQuantidade: (id) => {

        let qntdAtual = parseInt($("#qntd-" + id).text());

        if (qntdAtual > 0) {
            $("#qntd-" + id).text(qntdAtual - 1)
        }

    },

    // aumentar a quantidade do item no cardapio
    aumentarQuantidade: (id) => {

        let qntdAtual = parseInt($("#qntd-" + id).text());
        $("#qntd-" + id).text(qntdAtual + 1)

    },

    // // adicionar ao carrinho o item do cardápio
    adicionarAoCarrinho: async (id) => {

        // obter a categoria ativa
        let idCategoria = $(".container-menu a.active").attr('id').split('menu-')[1];

        // obtem a lista de itens
        let filtro = MENU.map((menu) => menu.category.id === idCategoria ? menu : null).filter((item) => item !== null);

        // obtem o item
        let item = $.grep(filtro, (e, i) => { return e.id == id });

        if (item.length > 0) {

            const obj = new modalDetalhesEscolha();
            const objDataEnv = obj.getDataEnvModal;
            objDataEnv.obj_product = JSON.parse(JSON.stringify(item[0]));
            obj.setDataEnvModal = objDataEnv;
            const result = await obj.modalOpen();
            if (result.refresh && result.obj_product) {
                result.obj_product["uuid"] = cardapio.metodos.create_UUID();
                if (result.clear_cart) {
                    MEU_CARRINHO = [];
                }
                MEU_CARRINHO.push(result.obj_product);
                commonFunctions.generateNotification('Item adicionado ao carrinho', 'success');
                cardapio.metodos.atualizarBadgeTotal();
            }

        }

    },

    // atualiza o badge de totais dos botões "Meu carrinho"
    atualizarBadgeTotal: () => {

        var total = 0;

        $.each(MEU_CARRINHO, (i, e) => {
            total += e.qntd
        })

        if (total > 0) {
            $(".botao-carrinho").removeClass('hidden');
            $(".container-total-carrinho").removeClass('hidden');
        }
        else {
            $(".botao-carrinho").addClass('hidden')
            $(".container-total-carrinho").addClass('hidden');
        }

        $(".badge-total-carrinho").html(total);

    },

    // abrir a modal de carrinho
    abrirCarrinho: async (abrir) => {

        if (abrir) {
            cardapio.metodos.obterTipoDeComandas();
            await cardapio.metodos.modalCarrinhoHideShow(true);
            cardapio.metodos.carregarCarrinho();
            cardapio.metodos.eventosCarrinho();
        } else {
            await cardapio.metodos.modalCarrinhoHideShow(false);
        }
    },

    // abrir a modal de carrinho
    eventosCarrinho: async () => {
        const modal = $('#modalCarrinho');

        modal.find('#selectTypeCommands').off('*').on('change', function () {

            const newCommands = Object.values(Enums.TYPES_COMMANDS).find(item => item.id == $(this).val());
            let etapa = $(".etapa.active").length;
            CONFIG_APP.commands.type = newCommands;
            if (etapa !== 1) {
                cardapio.metodos.carregarEtapa(2);
            }
            cardapio.metodos.carregarValores()

        });

        modal.find('#txtnumeroMesa').off('*').on('change', function () {

            CONFIG_APP.commands.tableNumber = $(this).val();
            cardapio.metodos.carregarEtapa(2);

        });

        modal.find('#foneInfo').off('*').on('change', function () {
            commonFunctions.phoneMask($(this).val(), this);
        }).trigger('change');

        commonFunctions.applyCustomNumberMask(modal.find('#txtCEP'), { format: '00000-000' });

    },

    modalCarrinhoHideShow: async (status = true) => {
        return new Promise((resolve) => {
            const modal = $("#modalCarrinho");
            const eventName = status ? 'shown.bs.modal' : 'hidden.bs.modal';
            const callback = () => {
                modal.off(eventName, callback);
                resolve(true);
            };
            modal.on(eventName, callback);
            status ? modal.modal('show') : modal.modal('hide');
        });
    },

    //método para recuperar parâmetros da url 
    parametroURL: (nameParam) => {

        // Obter a URL atual
        const url = new URL(window.location.href);

        // Criar uma instância de URLSearchParams para manipular os parâmetros da query string
        const params = new URLSearchParams(url.search);

        // Obter o valor do parâmetro 'mesa', ou null se não estiver presente
        const param = params.get(nameParam) || null;

        return param;
    },

    // altera os texto e exibe os botões das etapas
    carregarEtapa: (etapa) => {
        console.log(CONFIG_APP.commands.type.name)
        switch (etapa) {
            case 2:
                $("#itensCarrinho").addClass('hidden');
                $("#localEntrega").addClass('hidden');
                $("#opcionais").addClass('hidden');
                $("#resumoCarrinho").addClass('hidden'); 
                $("#formaDePagamento").addClass('hidden');
                $("#numeroMesa").addClass('hidden');
              
                switch (CONFIG_APP.commands.type.id) {
                    
                    case Enums.TYPES_COMMANDS.LOCAL.id:

                        $("#lblTituloEtapa").text('Consumo no local');
                        $("#numeroMesa").removeClass('hidden');
                        //converte numeroda mesa para dois digitos
                        // $("#txtnumeroMesa").val(parseInt(CONFIG_APP.commands.tableNumber, 10).toString().padStart(2, 0));
                        const numeroMesa = parseInt(CONFIG_APP.commands.tableNumber).toString().padStart(2, 0);
                        let mensagemMesa = `
                            <p class="h4">Identificamos seu pedido para a mesa <b>${numeroMesa}</b>.</p>
                            <p class="h4">Se essa informação não estiver correta, por favor, altere o numero da mesa no campo abaixo.</p>
                        `;
                        if (!numeroMesa || !parseInt(numeroMesa)) {
                            mensagemMesa = `<p class="h4">Não foi possível identificar sua mesa. Por favor, insira o número da sua mesa no campo abaixo.</p>`;
                            $("#txtnumeroMesa").val('');
                        } else {
                            $("#txtnumeroMesa").val(numeroMesa);
                        }
                        $("#mensagemMesa").html(mensagemMesa);

                        $(".etapa").removeClass('active');
                        $(".etapa1").addClass('active');
                        $(".etapa2").addClass('active');
                        $(".etapa3").removeClass('active');
                        $("#formaDePagamento").addClass('hidden');
                        $("#btnEtapaPedido").addClass('hidden');
                        $("#btnEtapaEndereco").removeClass('hidden');
                        $("#btnEtapaResumo").addClass('hidden');
                        $("#btnVoltar").removeClass('hidden');

                        break;
                       
                    case Enums.TYPES_COMMANDS.DELIVERY.id:

                        $("#lblTituloEtapa").text('Endereço de entrega:');
                        $("#itensCarrinho").addClass('hidden');
                        $("#localEntrega").removeClass('hidden');
                        $("#resumoCarrinho").addClass('hidden');
                        $("#opcionais").removeClass('hidden');
                        $("#formaDePagamento").removeClass('hidden');
                        $(".etapa").removeClass('active');
                        $(".etapa1").addClass('active');
                        $(".etapa2").addClass('active');

                        $("#btnEtapaPedido").addClass('hidden');
                        $("#btnEtapaEndereco").removeClass('hidden');
                        $("#btnEtapaResumo").addClass('hidden');
                        $("#btnVoltar").removeClass('hidden');

                        break;

                    case Enums.TYPES_COMMANDS.GET.id:

                        $("#lblTituloEtapa").text('Dados para retirada:');
                        $("#itensCarrinho").addClass('hidden');
                        $("#localEntrega").addClass('hidden');
                        $("#resumoCarrinho").addClass('hidden');
                        $("#formaDePagamento").addClass('hidden');
                        $("#opcionais").removeClass('hidden');

                        $(".etapa").removeClass('active');
                        $(".etapa1").addClass('active');
                        $(".etapa2").addClass('active');
                        $("#btnEtapaPedido").addClass('hidden');
                        $("#btnEtapaEndereco").removeClass('hidden');
                        $("#btnEtapaResumo").addClass('hidden');
                        $("#btnVoltar").removeClass('hidden');

                        break;

                    default:
                        commonFunctions.generateNotification('Tipo de comanda não encontrado.', 'error');
                }
                break;

            case 3:

                $("#lblTituloEtapa").text('Resumo do pedido:');
                $("#itensCarrinho").addClass('hidden');
                $("#localEntrega").addClass('hidden');
                $("#opcionais").addClass('hidden');
                $("#resumoCarrinho").removeClass('hidden');
                $("#numeroMesa").addClass('hidden');

                $(".etapa").removeClass('active');
                $(".etapa1").addClass('active');
                $(".etapa2").addClass('active');
                $(".etapa3").addClass('active');

                $("#btnEtapaPedido").addClass('hidden');
                $("#btnEtapaEndereco").addClass('hidden');
                $("#formaDePagamento").addClass('hidden');
                $("#btnEtapaResumo").removeClass('hidden');
                $("#btnVoltar").removeClass('hidden');
                // let numeroMesaEtapa3 = cardapio.metodos.numeroMesa();
                if (!CONFIG_APP.commands.type) {
                    $("#itemCarrinhoResumo").addClass('hidden');
                }
                break;

            default:
              //  $("#formaDePagamento").addClass('hidden');
                $("#lblTituloEtapa").text('Seu carrinho:');
                $("#itensCarrinho").removeClass('hidden');
                $("#localEntrega").addClass('hidden');
                $("#resumoCarrinho").addClass('hidden');
                $("#opcionais").addClass('hidden');
                $("#numeroMesa").addClass('hidden');
                $("#formaDePagamento").addClass('hidden');

                $(".etapa").removeClass('active');
                $(".etapa1").addClass('active');

                $("#btnEtapaPedido").removeClass('hidden');
                $("#btnEtapaEndereco").addClass('hidden');
                $("#btnEtapaResumo").addClass('hidden');
                $("#btnVoltar").addClass('hidden');
                break;
        }

    },

    // botão de voltar etapa
    voltarEtapa: () => {

        let etapa = $(".etapa.active").length;
        cardapio.metodos.carregarEtapa(etapa - 1);

    },

    carregarCarrinho: () => {

        cardapio.metodos.carregarEtapa(1);
        
        if (MEU_CARRINHO.length > 0) {

            $("#itensCarrinho").html('');

            $.each(MEU_CARRINHO, (i, e) => {

                let priceAdditionals = 0;
                const additionals = e.additionals.map((item) => {
                    if (item.qntd > 0) {
                        priceAdditionals += item.price * item.qntd;
                        if (item.qntd > 1) {
                            return `${item.qntd} ${item.name}`;
                        } else {
                            return `${item.name}`;
                        }
                    }
                }).filter(Boolean).join(', ');

                if (priceAdditionals) {
                    priceAdditionals = ` + ${priceAdditionals.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}`;
                }

                let temp = cardapio.templates.itemCarrinho.replace(/\${img}/g, e.img)
                    .replace(/\${nome}/g, e.name)
                    .replace(/\${dsc}/g, e.dsc)
                    .replace(/\${preco}/g, e.price.toFixed(2).replace('.', ','))
                    .replace(/\${uuid}/g, e.uuid)
                    .replace(/\${qntd}/g, e.qntd)
                    .replace(/\${preco-acrescimos}/g, priceAdditionals ? priceAdditionals : '')
                    .replace(/\${acrescimos}/g, additionals ? `Acréscimos: ${additionals}` : '')

                $("#itensCarrinho").append(temp);
             
                // último item
                if ((i + 1) == MEU_CARRINHO.length) {
                    cardapio.metodos.carregarValores();
                }

            })

        }
        else {
            $("#itensCarrinho").html('<p class="carrinho-vazio"><i class="fa fa-shopping-bag"></i> Seu carrinho está vazio.</p>');
            cardapio.metodos.carregarValores();
        }

    },

    diminuirQuantidadeCarrinho: (uuid) => {

        let qntdAtual = parseInt($("#qntd-carrinho-" + uuid).text());

        if (qntdAtual > 1) {
            $("#qntd-carrinho-" + uuid).text(qntdAtual - 1);
            cardapio.metodos.atualizarCarrinho(uuid, qntdAtual - 1);
        }
        else {
            cardapio.metodos.removerItemCarrinho(uuid)
        }

    },

    aumentarQuantidadeCarrinho: (uuid) => {

        let qntdAtual = parseInt($("#qntd-carrinho-" + uuid).text());
        $("#qntd-carrinho-" + uuid).text(qntdAtual + 1);
        cardapio.metodos.atualizarCarrinho(uuid, qntdAtual + 1);

    },

    // botão alterar item do carrinho
    alterarItemCarrinho: async (uuid) => {

        let item = $.grep(MEU_CARRINHO, (e, i) => { return e.uuid == uuid });

        if (item.length > 0) {
            try {

                // Fecha o modal do carrinho
                await cardapio.metodos.modalCarrinhoHideShow(false);

                const obj = new modalDetalhesEscolha();
                const objDataEnv = obj.getDataEnvModal;
                objDataEnv.obj_product = JSON.parse(JSON.stringify(item[0]));
                obj.setDataEnvModal = objDataEnv;
                const result = await obj.modalOpen();
                if (result.refresh && result.obj_product) {
                    const index = MEU_CARRINHO.findIndex((obj => obj.uuid == uuid));
                    MEU_CARRINHO[index] = result.obj_product;
                    commonFunctions.generateNotification('Produto alterado', 'success');
                    cardapio.metodos.carregarCarrinho();

                    // atualiza o botão carrinho com a quantidade atualizada
                    cardapio.metodos.atualizarBadgeTotal();
                }

            } finally {
                // Abre novamente o modal do carrinho após terminado de alterar o item
                await cardapio.metodos.modalCarrinhoHideShow(true);
            }
        }

    },

    removerItemCarrinho: (uuid) => {

        MEU_CARRINHO = $.grep(MEU_CARRINHO, (e, i) => { return e.uuid != uuid });
        cardapio.metodos.carregarCarrinho();

        // atualiza o botão carrinho com a quantidade atualizada
        cardapio.metodos.atualizarBadgeTotal();

    },

    atualizarCarrinho: (uuid, qntd) => {

        let objIndex = MEU_CARRINHO.findIndex((obj => obj.uuid == uuid));
        MEU_CARRINHO[objIndex].qntd = qntd;

        // atualiza o botão carrinho com a quantidade atualizada
        cardapio.metodos.atualizarBadgeTotal();

        // atualiza os valores (R$) totais do carrinho
        cardapio.metodos.carregarValores();

    },

    carregarValores: () => {

        VALOR_CARRINHO = 0;

        $("#lblSubTotal").text('R$ 0,00');
        $("#lblValorEntrega").text('+ R$ 0,00');
        $("#lblValorTotal").text('R$ 0,00');

        $.each(MEU_CARRINHO, (i, e) => {

            let sum = 0;
            e.additionals.map((item) => {
                if (item.qntd > 0) {
                    sum += parseFloat(item.price * item.qntd);
                }
            });
            sum += parseFloat(e.price);
            VALOR_CARRINHO += parseFloat(sum * e.qntd);
        
            if ((i + 1) == MEU_CARRINHO.length) {
                $("#lblSubTotal").text(`R$ ${VALOR_CARRINHO.toFixed(2).replace('.', ',')}`);
                let entregaEmpresa = 0;
               

                if (Enums.TYPES_COMMANDS.DELIVERY.id == CONFIG_APP.commands.type.id) {
                    entregaEmpresa = MEU_CARRINHO[0].category.company.priceDelivery;
                }
                $("#lblValorEntrega").text(`+ R$ ${entregaEmpresa.toFixed(2).replace('.', ',')}`);
                $("#lblValorTotal").text(`R$ ${(VALOR_CARRINHO + entregaEmpresa).toFixed(2).replace('.', ',')}`);
            }

        })

    },

    // carregar a etapa enderecos
    carregarEndereco: () => {

        if (MEU_CARRINHO.length <= 0) {
            commonFunctions.generateNotification('Seu carrinho está vazio.', 'info');
            return;
        }

        cardapio.metodos.carregarEtapa(2);

    },

    // API ViaCEP
    buscarCep: () => {

        // cria a variavel com o valor do cep
        var cep = $("#txtCEP").val().trim().replace(/\D/g, '');

        // verifica se o CEP possui valor informado
        if (cep != "") {

            // Expressão regular para validar o CEP
            var validacep = /^[0-9]{8}$/;

            if (validacep.test(cep)) {

                $.getJSON("https://viacep.com.br/ws/" + cep + "/json/?callback=?", function (dados) {

                    if (!("erro" in dados)) {

                        // Atualizar os campos com os valores retornados
                        $("#txtEndereco").val(dados.logradouro);
                        $("#txtBairro").val(dados.bairro);
                        $("#txtCidade").val(dados.localidade);
                        $("#ddlUf").val(dados.uf);
                        $("#txtNumero").focus();

                    } else {
                        commonFunctions.generateNotification('CEP não encontrado. Preencha as informações manualmente.', 'info');
                        $("#txtEndereco").focus();
                    }

                })

            } else {
                commonFunctions.generateNotification('Formato do CEP inválido.', 'error');
                $("#txtCEP").focus();
            }

        } else {
            commonFunctions.generateNotification('Informe o CEP, por favor.', 'info');
            $("#txtCEP").focus();
        }

    },

    // validação antes de prosseguir para a etapa 3
    resumoPedido: () => {
  console.log($("#lblFormaPagamentoSelecionada").text().trim());
  console.log( `${(TROCO)}`)
        const dados = {
            
            lblFormaPagamentoSelecionada: $("#lblFormaPagamentoSelecionada").text().trim(),
            nomeInfo: $("#nomeInfo").val().trim(),
            foneInfo: $("#foneInfo").val().trim(),
            cep: $("#txtCEP").val().trim(),
            endereco: $("#txtEndereco").val().trim(),
            bairro: $("#txtBairro").val().trim(),
            cidade: $("#txtCidade").val().trim(),
            uf: $("#ddlUf").val().trim(),
            numero: $("#txtNumero").val().trim(),
            complemento: $("#txtComplemento").val().trim(),
            referencia: $("#txtReferencia").val().trim(),
            troco:  `${(TROCO)}`
        }
        let fieldsIncorrects = [];
        let element = '';

        switch (CONFIG_APP.commands.type.id) {
            case Enums.TYPES_COMMANDS.DELIVERY.id:

                element = $("#nomeInfo");
                if (dados.nomeInfo.length <= 0) {
                    if (!fieldsIncorrects.length) {
                        element.focus();
                    }
                    element.addClass('is-invalid');
                    element.removeClass('is-valid');
                    fieldsIncorrects.push('Nome');
                } else {
                    element.addClass('is-valid');
                    element.removeClass('is-invalid');
                }

                element = $("#foneInfo");
                if (dados.foneInfo.length <= 0) {
                    if (!fieldsIncorrects.length) {
                        element.focus();
                    }
                    element.addClass('is-invalid');
                    element.removeClass('is-valid');
                    fieldsIncorrects.push('Celular');
                } else {
                    element.addClass('is-valid');
                    element.removeClass('is-invalid');
                }

                element = $("#txtCEP");
                if (dados.cep.length <= 0) {
                    if (!fieldsIncorrects.length) {
                        element.focus();
                    }
                    element.addClass('is-invalid');
                    element.removeClass('is-valid');
                    fieldsIncorrects.push('CEP');
                } else {
                    element.addClass('is-valid');
                    element.removeClass('is-invalid');
                }

                if (dados.endereco.length <= 0) {
                    if (!fieldsIncorrects.length) {
                        element.focus();
                    }
                    element.addClass('is-invalid');
                    element.removeClass('is-valid');
                    fieldsIncorrects.push('Endereço');
                } else {
                    element.addClass('is-valid');
                    element.removeClass('is-invalid');
                }

                element = $("#txtBairro");
                if (dados.bairro.length <= 0) {
                    if (!fieldsIncorrects.length) {
                        element.focus();
                    }
                    element.addClass('is-invalid');
                    element.removeClass('is-valid');
                    fieldsIncorrects.push('Bairro');
                } else {
                    element.addClass('is-valid');
                    element.removeClass('is-invalid');
                }

                element = $("#txtCidade");
                if (dados.cidade.length <= 0) {
                    if (!fieldsIncorrects.length) {
                        element.focus();
                    }
                    element.addClass('is-invalid');
                    element.removeClass('is-valid');
                    fieldsIncorrects.push('Cidade');
                } else {
                    element.addClass('is-valid');
                    element.removeClass('is-invalid');
                }

                element = $("#ddlUf");
                if (dados.uf == "-1") {
                    if (!fieldsIncorrects.length) {
                        element.focus();
                    }
                    element.addClass('is-invalid');
                    element.removeClass('is-valid');
                    fieldsIncorrects.push('UF');
                } else {
                    element.addClass('is-valid');
                    element.removeClass('is-invalid');
                }

                element = $("#txtNumero");
                if (dados.numero.length <= 0) {
                    if (!fieldsIncorrects.length) {
                        element.focus();
                    }
                    element.addClass('is-invalid');
                    element.removeClass('is-valid');
                    fieldsIncorrects.push('Número');
                } else {
                    element.addClass('is-valid');
                    element.removeClass('is-invalid');
                }
            //    $("#cardFormaPagamentoSelecionada").removeClass('hidden');

                //  elemento <p> 
                 element = $("#formControlPagamento");
                
                if (dados.lblFormaPagamentoSelecionada.trim().length <= 0) {
                    // Mostrar o elemento se estiver oculto
                 //   $("#cardFormaPagamentoSelecionada").removeClass('hidden');
                //    $("#cardAddFormaPagamento").addClass('hidden');
                
                    if (!fieldsIncorrects.length) {
                        element.focus();
                    }
                
                    // Adicione a classe de erro e remova a classe de sucesso
                    element.addClass('is-invalid').removeClass('is-valid');
                
                    // Adicione o erro à lista de campos incorretos
                    fieldsIncorrects.push('Forma Pagamento');
                } else {
                    // Adicione a classe de sucesso e remova a classe de erro
                    element.addClass('is-valid').removeClass('is-invalid');
                    
                }                

                if (fieldsIncorrects.length > 0) {
                    commonFunctions.generateNotification('Preencha os seguintes campos corretamente:', 'info', { itemsArray: fieldsIncorrects });
                    return;
                }

                MEU_ENDERECO = {
                    nomeInfo: dados.nomeInfo,
                    foneInfo: dados.foneInfo,
                    cep: dados.cep,
                    endereco: dados.endereco,
                    bairro: dados.bairro,
                    cidade: dados.cidade,
                    uf: dados.uf,
                    numero: dados.numero,
                    complemento: dados.complemento,
                    referencia: dados.referencia,
                    lblFormaPagamentoSelecionada: dados.lblFormaPagamentoSelecionada,
                    troco: dados.troco
                }
                cardapio.metodos.carregarEtapa(3);
                cardapio.metodos.carregarResumo();

                break;

            case Enums.TYPES_COMMANDS.GET.id:

                element = $("#nomeInfo");
                if (dados.nomeInfo.length <= 0) {
                    if (!fieldsIncorrects.length) {
                        element.focus();
                    }
                    element.addClass('is-invalid');
                    element.removeClass('is-valid');
                    fieldsIncorrects.push('Nome');
                } else {
                    element.addClass('is-valid');
                    element.removeClass('is-invalid');
                }

                element = $("#foneInfo");
                if (dados.foneInfo.length <= 0) {
                    if (!fieldsIncorrects.length) {
                        element.focus();
                    }
                    element.addClass('is-invalid');
                    element.removeClass('is-valid');
                    fieldsIncorrects.push('Celular');
                } else {
                    element.addClass('is-valid');
                    element.removeClass('is-invalid');
                }

                if (fieldsIncorrects.length > 0) {
                    commonFunctions.generateNotification('Preencha os seguintes campos corretamente:', 'info', { itemsArray: fieldsIncorrects });
                    return;
                }

                MEU_ENDERECO = {
                    nomeInfo: dados.nomeInfo,
                    foneInfo: dados.foneInfo,
                }
                cardapio.metodos.carregarEtapa(3);
                cardapio.metodos.carregarResumo();

                break;

            case Enums.TYPES_COMMANDS.LOCAL.id:

                MEU_ENDERECO = {
                    numeroMesa: CONFIG_APP.commands.tableNumber
                }
                //valida se numero da mesa não está em branco
                if (!CONFIG_APP.commands.tableNumber) {
                    commonFunctions.generateNotification('Informe o número da mesa, por favor.', 'info');
                    $("#txtnumeroMesa").focus();
                } else {
                    cardapio.metodos.carregarEtapa(3);
                    cardapio.metodos.carregarResumo();
                }

                break;
            default:
                commonFunctions.generateNotification('Não foi possível identificar o tipo de comanda.', 'error');
                break;
        }

    },

    // carrega a etapa de Resumo do pedido
    carregarResumo: () => {


      
        $("#listaItensResumo").html('');

        $.each(MEU_CARRINHO, (i, e) => {

            let priceAdditionals = 0;
            const additionals = e.additionals.map((item) => {
                if (item.qntd > 0) {
                    priceAdditionals += item.price * item.qntd;
                    if (item.qntd > 1) {
                        return `${item.qntd} ${item.name}`;
                    } else {
                        return `${item.name}`;
                    }
                }
            }).filter(Boolean).join(', ');

            if (priceAdditionals) {
                priceAdditionals = ` + ${priceAdditionals.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}`;
            }

            let temp = cardapio.templates.itemResumo.replace(/\${img}/g, e.img)
                .replace(/\${nome}/g, e.name)
                .replace(/\${preco}/g, e.price.toFixed(2).replace('.', ','))
                .replace(/\${qntd}/g, e.qntd)
                .replace(/\${preco-acrescimos}/g, priceAdditionals ? priceAdditionals : '')
                .replace(/\${acrescimos}/g, additionals ? `Acréscimos: ${additionals}` : '')

            $("#listaItensResumo").append(temp);

        });

        switch (CONFIG_APP.commands.type.id) {
            case Enums.TYPES_COMMANDS.DELIVERY.id:
                $("#resumoEndereco").html(`${MEU_ENDERECO.nomeInfo}, ${MEU_ENDERECO.foneInfo}, ${MEU_ENDERECO.endereco}, ${MEU_ENDERECO.numero}, ${MEU_ENDERECO.bairro}`);
                $("#cidadeEndereco").html(`${MEU_ENDERECO.cidade}-${MEU_ENDERECO.uf} ${MEU_ENDERECO.complemento ? ` - ${MEU_ENDERECO.complemento}` : ''} / ${MEU_ENDERECO.cep} ${MEU_ENDERECO.referencia ? ` (${MEU_ENDERECO.referencia})` : ''}`);
                $("#resumoFormaPagamento").html(`Pagamento na entrega`);      
                const trocoValor = Number(MEU_ENDERECO.troco) || 0;       
                const trocoFormatado = trocoValor.toFixed(2).replace('.', ',');
                $("#formaPagamento").html(`${MEU_ENDERECO.lblFormaPagamentoSelecionada} ${MEU_ENDERECO.troco > 0 ? `- Troco para: R$ ` + trocoFormatado + ` reais` : 'Pagamento na Entrega'}`);



                break;

            case Enums.TYPES_COMMANDS.GET.id:
                $("#resumoEndereco").html(`Retirada no estabelecimento`);
                $("#cidadeEndereco").html(`${MEU_ENDERECO.nomeInfo}, ${MEU_ENDERECO.foneInfo}`);
               

                break;
            case Enums.TYPES_COMMANDS.LOCAL.id:
                $("#resumoEndereco").html(`Consumo local`);
                $("#cidadeEndereco").html(`Mesa ${MEU_ENDERECO.numeroMesa}`);
                break;

            default:
                commonFunctions.generateNotification('Não foi possível identificar o tipo de comanda.', 'error');
                break;
        }

        cardapio.metodos.finalizarPedido();

    },



    // botão de realizar o pedido
    fazerPedido: async () => {
        console.log(MEU_CARRINHO)
        // faz as validações
        if (MEU_CARRINHO.length > 0) {

           // let checkEntrega = document.querySelector('#chkEntrega').checked;
          //  let checkRetirada = document.querySelector('#chkRetirada').checked;
/*
            if (!checkEntrega && !checkRetirada) {
                app.method.mensagem("Selecione entrega ou retirada.")
                return;
            }

            // obtem o endereço selecionado do local
            let enderecoAtual = app.method.obterValorSessao('address');

            if (checkEntrega && enderecoAtual == undefined) {
                app.method.mensagem("Informe o endereço de entrega.")
                return;
            }

            let enderecoSelecionado = enderecoAtual != undefined ? JSON.parse(enderecoAtual) : null;

            let nome = $('#txtNomeSobrenome').val().trim();
            let celular = $('#txtCelular').val().trim();

            if (nome.length <= 0) {
                app.method.mensagem("Informe o Nome e Sobrenome, por favor")
                return;
            }

            if (celular.length <= 0) {
                app.method.mensagem("Informe o Celular, por favor.")
                return;
            }

            if (FORMA_SELECIONADA == null) {
                app.method.mensagem("Selecione a forma de pagamento.")
                return;
            }
*/
            // tudo ok, faz o pedido
            let idformapagamento = FORMA_SELECIONADA && FORMA_SELECIONADA.idformapagamento !== null    ? JSON.parse(FORMA_SELECIONADA.idformapagamento) : 2;
            let taxaentrega =  CONFIG_APP.commands.type.name == 'DELIVERY' ? MEU_CARRINHO[0].category.company.priceDelivery : 0 ;
            console.log( MEU_CARRINHO[0].category.company.priceDelivery);
            console.log(taxaentrega)
            let idtaxaentregatipo = CONFIG_APP.commands.type.id;
            cardapio.metodos.loading(true);
            console.log(MEU_ENDERECO)
            var dados = {
               // entrega: checkEntrega,
            //    retirada: checkRetirada,
                cart: MEU_CARRINHO,
                endereco: MEU_ENDERECO,
                idtaxaentregatipo: idtaxaentregatipo,
             //   idtaxaentrega: TAXA_ATUAL_ID,
                taxaentrega: taxaentrega,
             
                idformapagamento: idformapagamento,
                troco: TROCO,
                nomecliente: nomeInfo,
                telefonecliente: foneInfo
            }
            console.log(dados)
            // realizar pedido
            cardapio.metodos.post('/pedido', JSON.stringify(dados),
                (response) => {

                    cardapio.metodos.loading(false);

                    console.log('response', response)

                    if (response.status == "error") {
                        console.log(response.message)
                        commonFunctions.generateNotification("erro ao gravar.", 'error')
                        return;
                    }

                    commonFunctions.generateNotification('Pedido realizado!', 'success');

                    // salva o novo pedido
                    dados.order = response.order;

                    cardapio.metodos.gravarValorSessao(JSON.stringify(dados), 'order');

                    // envia pra tela de pedidos
                    setTimeout(() => {
                        // limpa o carrinho
                        localStorage.removeItem("cart");
                       // window.location.href = '/pedido.html';
                    }, 1000000);

                },
                (error) => {
                    cardapio.metodos.loading(false);
                    console.log('error', error)
                }, true
            )

        }
        else {
            commonFunctions.generateNotification("Nenhum item no carrinho.", 'error')
        }


    },


    // // Atualiza o link do botão do WhatsApp
    finalizarPedido: () => {
     
        if (MEU_CARRINHO.length > 0) {

            let texto = 'Olá! gostaria de fazer um pedido:';
            const companyData = {
                priceDelivery: 0,
                telOrder: MEU_CARRINHO[0].category.company.telOrder,
            };

            switch (CONFIG_APP.commands.type.id) {
                case Enums.TYPES_COMMANDS.LOCAL.id:
                    texto += '\n\n*Tipo de comanda: _Consumo local_*';
                    texto += `\n*Mesa:* ${MEU_ENDERECO.numeroMesa}`;
                    break;

                case Enums.TYPES_COMMANDS.DELIVERY.id:
                    let trocoValor = Number(MEU_ENDERECO.troco) || 0;       
                    let trocoFormatado = trocoValor.toFixed(2).replace('.', ',');
    
                    texto += '\n\n*Tipo de comandaS: _Delivery_*';
                    texto += '\n*Nome e telefone:*';
                    texto += `\n${MEU_ENDERECO.nomeInfo}, ${MEU_ENDERECO.foneInfo}`;
                    texto += '\n\n*Endereço de entrega:*';
                    texto += `\n${MEU_ENDERECO.endereco}, ${MEU_ENDERECO.numero}, ${MEU_ENDERECO.bairro}`;
                    texto += `\n${MEU_ENDERECO.cidade}-${MEU_ENDERECO.uf} / ${MEU_ENDERECO.cep} ${MEU_ENDERECO.complemento}`;
                    companyData.priceDelivery = MEU_CARRINHO[0].category.company.priceDelivery;
                    texto += `\n\n*Forma de Pagamento:*`;
                    texto += `\n${MEU_ENDERECO.lblFormaPagamentoSelecionada} ${MEU_ENDERECO.troco > 0 ? `- Troco para: R$ ` + trocoFormatado + ` reais` : ''}\n`;
                    break;

                case Enums.TYPES_COMMANDS.GET.id:
                    texto += '\n\n*Tipo de comanda: _Retirada_*';
                    texto += '\n*Nome e telefone:*';
                    texto += `\n${MEU_ENDERECO.nomeInfo}, ${MEU_ENDERECO.foneInfo}`;
                    break;

                default:
                    break;
            }

            texto += `\n\n*Itens do pedido:*\n\n\${itens}`;

            if (companyData.priceDelivery > 0) {
                texto += `*Taxa de entrega: R$ ${companyData.priceDelivery.toFixed(2).replace('.', ',')}*`;
                texto += `\n*Total (com entrega): R$ ${(VALOR_CARRINHO + companyData.priceDelivery).toFixed(2).replace('.', ',')}*`;
            } else {
                texto += `*Total : R$ ${(VALOR_CARRINHO).toFixed(2).replace('.', ',')}*`;
            }

            let itens = '';

            $.each(MEU_CARRINHO, (i, e) => {
                console.log(MEU_CARRINHO)
                let priceAdditionals = 0;
                const additionals = e.additionals.map((item) => {

                    if (item.qntd > 0) {
                        priceAdditionals += item.price * item.qntd;
                        let strReturn = '';
                        if (item.qntd > 1) {
                            strReturn = `${item.qntd} ${item.name}`;
                        } else {
                            strReturn = `${item.name}`;
                        }
                        return ` - _${strReturn} ... ${item.price.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}_`;;
                    }
                }).filter(Boolean).join('\n');

                itens += `*${e.qntd}x* ${e.name} ....... R$ ${e.price.toFixed(2).replace('.', ',')} \n`;

                const priceUnit = parseFloat(e.price + priceAdditionals);
                if (additionals) {
                    itens += `*_Acréscimos:_*\n${additionals}\n`;
                    itens += `*_Preço Unidade:_* ${(priceUnit).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}\n`;
                }
                if (e.obs) {
                    itens += `*Observações:* ${e.obs}\n`;
                }
                itens += `*Total item: ${(priceUnit * e.qntd).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}*\n\n`;
                console.log(itens)
                console.log(MEU_CARRINHO)
                // último item
                if ((i + 1) == MEU_CARRINHO.length) {

                    texto = texto.replace(/\${itens}/g, itens);
/*
                    document.getElementById("btnEtapaResumo").addEventListener("click", async function(event) {
                        event.preventDefault(); // Previne o comportamento padrão do link
                    
                        
                        // Converte o texto para URL encode
                        let encode = encodeURI(texto);
                        // Gera a URL para o WhatsApp com o número da empresa
                        let URL = `https://wa.me/${commonFunctions.returnsOnlyNumber(companyData.telOrder)}?text=${encode}`;
                    
                        // Redireciona para a URL gerada
                        window.open(URL, "_blank");
                        // Executa a função fazerPedido
                        await cardapio.metodos.fazerPedido();
                    
                        MEU_CARRINHO = [];
                        commonFunctions.generateNotification('Seu carrinho está vazio.', 'success');
                        cardapio.metodos.atualizarBadgeTotal();
                        await cardapio.metodos.modalCarrinhoHideShow(false);
                    });
                    */

            
                    // converte a URL
                    let encode = encodeURI(texto);
                    // let URL = `https://wa.me/${CELULAR_EMPRESA}?text=${encode}`;
                    let URL = `https://wa.me/${commonFunctions.returnsOnlyNumber(companyData.telOrder)}?text=${encode}`;
                  //  cardapio.metodos.fazerPedido();
                  

                    $("#btnEtapaResumo").attr('href', URL).off().on('click', async function () {
                        let blnSuccess = false;
                        try {
                            await cardapio.metodos.modalCarrinhoHideShow(false);
                            const obj = new modalMessage();
                            obj.setMessage = 'Deu tudo certo para enviar seu pedido?';
                            obj.setTitle = 'Confirmação de envio';
                            const objConfigs = obj.getObjConfigs;
                            objConfigs.buttons.confirmYes.text = 'Sim, limpar o carrinho';
                            objConfigs.buttons.confirmNo.text = 'Não, reenviar o pedido';
                            obj.setObjConfigs = objConfigs;
                            blnSuccess = await obj.modalOpen();
                        } finally {
                            if (!blnSuccess) {
                                await cardapio.metodos.modalCarrinhoHideShow(true);
                            } else {
                                cardapio.metodos.fazerPedido();
                                MEU_CARRINHO = [];
                                commonFunctions.generateNotification('Seu carrinho está vazio.', 'success');
                                cardapio.metodos.atualizarBadgeTotal();
                            }
                        }
                    });

                }

            })

        }
    },


    // carrega o link do botão reserva
    carregarBotaoReserva: () => {

        var texto = 'Olá! gostaria de fazer uma *reserva*';

        let encode = encodeURI(texto);
        let URL = `https://wa.me/${CELULAR_EMPRESA}?text=${encode}`;

        $("#btnReserva").attr('href', URL);

    },

    // carrega o botão de ligar
    carregarBotaoLigar: () => {

        $("#btnLigar").attr('href', `tel:${CELULAR_EMPRESA}`);

    },

    // abre o depoimento
    abrirDepoimento: (depoimento) => {

        $("#depoimento-1").addClass('hidden');
        $("#depoimento-2").addClass('hidden');
        $("#depoimento-3").addClass('hidden');

        $("#btnDepoimento-1").removeClass('active');
        $("#btnDepoimento-2").removeClass('active');
        $("#btnDepoimento-3").removeClass('active');

        $("#depoimento-" + depoimento).removeClass('hidden');
        $("#btnDepoimento-" + depoimento).addClass('active');

    },

    create_UUID: () => {
        var dt = new Date().getTime();
        var uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
            var r = (dt + Math.random() * 16) % 16 | 0;
            dt = Math.floor(dt / 16);
            return (c == 'x' ? r : (r & 0x3 | 0x8)).toString(16);
        });
        return uuid;
    },
 // Obtém as formas de pagamento
obterFormasPagamento: () => {
    cardapio.metodos.get('/formapagamento',
        (response) => {
            if (response.status === "error") {
                console.error(response.message);
                return;
            }

            FORMAS_PAGAMENTO = response.data || [];

            cardapio.metodos.carregarFormasPagamento(FORMAS_PAGAMENTO);
        },
        (error) => {
            console.error('Erro ao obter formas de pagamento:', error);
        },
        true
    );
},

// Carrega as formas de pagamento na tela
carregarFormasPagamento: (list) => {
    const container = document.querySelector(".container-modal-actions");
 
    
    if (!container) {
        console.error('Contêiner para formas de pagamento não encontrado.');
        return;
    }
    
    // Limpa o conteúdo anterior
    container.innerHTML = '';

    if (list.length > 0) {
        list.forEach((e) => {
            const link = document.createElement('a');
            link.href = "#!";
            link.textContent = e.nome;
            link.onclick = () => cardapio.metodos.selecionarFormaPagamento(e.idformapagamento);
            container.appendChild(link);
        });

        // Adiciona o botão de remover
        const removeLink = document.createElement('a');
        removeLink.href = "#!";
        removeLink.textContent = "Remover";
        removeLink.classList.add('color-red');
        removeLink.onclick = () => cardapio.metodos.selecionarFormaPagamento('');
        container.appendChild(removeLink);
    } else {
        const noData = document.createElement('p');
        noData.textContent = "Nenhuma forma de pagamento disponível.";
        container.appendChild(noData);
    }
},

    
        // método que seleciona a forma de pagamento
        selecionarFormaPagamento: async (forma) => {
            let selecionada = FORMAS_PAGAMENTO.filter(e => e.idformapagamento == forma);
            TROCO = 0;
        
            if (selecionada.length > 0) {
                
                FORMA_SELECIONADA = selecionada[0];
                console.log(selecionada)
                document.querySelector("#cardFormaPagamentoSelecionada").classList.remove('hidden');
                document.querySelector("#cardAddFormaPagamento").classList.add('hidden');
                document.querySelector("#lblFormaPagamentoSelecionada").innerText = FORMA_SELECIONADA.nome;
             

                // Atualiza a visualização para indicar que um método foi selecionado
                $("#formControlPagamento").addClass('is-valid').removeClass('is-invalid');
        
                // Se for Pix
                if (FORMAS_PAGAMENTO.idformapagamento == 1) {
                    document.querySelector("#lblDescFormaPagamentoSelecionada").innerText = `Pagamento na entrega do pedido.`;
                    document.querySelector("#iconFormaPagamentoSelecionada").innerHTML = `<i class="fas fa-receipt"></i>`;
                }
                // Se for dinheiro
                else if (FORMA_SELECIONADA.idformapagamento == 2) {
                    let troco = prompt("Qual o valor do troco?");
                    let _teste = parseFloat(troco);
                    if(isNaN(_teste) || troco == '' || _teste <= 1 ){
                        troco = 0;
                        document.querySelector("#lblDescFormaPagamentoSelecionada").innerText = `Pagamento na entrega do pedido.`;
                    }else {
                        troco = _teste;
                        TROCO = troco;
                        document.querySelector("#lblDescFormaPagamentoSelecionada").innerText = `Troco para: R$ ${(_teste).toFixed(2).replace('.',',')} reais`;
                    }
                  
                    document.querySelector("#iconFormaPagamentoSelecionada").innerHTML = `<i class="fas fa-coins"></i>`;
                }
                // Se for cartão
                else {
                    document.querySelector("#lblDescFormaPagamentoSelecionada").innerText = `Pagamento na entrega do pedido.`;
                    document.querySelector("#iconFormaPagamentoSelecionada").innerHTML = `<i class="fas fa-credit-card"></i>`;
                }
            } else {
                document.querySelector("#cardAddFormaPagamento").classList.remove('hidden');
                document.querySelector("#cardFormaPagamentoSelecionada").classList.add('hidden');
                document.querySelector("#cardAddFormaPagamento").classList.remove('is-valid');
                document.querySelector("#cardAddFormaPagamento").classList.add('is-invalid');
               
              
            
                document.querySelector("#lblFormaPagamentoSelecionada").innerText = '';
             
                console.log(FORMA_SELECIONADA)
                FORMA_SELECIONADA = null;
            }
        
            // Fecha o modal de forma de pagamento
            await cardapio.metodos.modalFormaPagamentoHideShow(false);
        
            // Reabre o modal do carrinho
            await cardapio.metodos.modalCarrinhoHideShow(true);
        },
        
    

        modalFormaPagamentoHideShow: async (status = true) => {
            return new Promise((resolve) => {
                const modal = $("#modalActionsFormaPagamento");
                const eventName = status ? 'shown.bs.modal' : 'hidden.bs.modal';
                const callback = () => {
                    modal.off(eventName, callback);
                    resolve(true);
                };
                modal.on(eventName, callback);
                status ? modal.modal('show') : modal.modal('hide');
            });
        },
        // abre as opções de formas de pagamento
      // Função para abrir o segundo modal após o primeiro
abrirModalFormaPagamento: async () => {
    await cardapio.metodos.modalCarrinhoHideShow(false); // Fecha o modalCarrinho
    await cardapio.metodos.modalFormaPagamentoHideShow(true); // Abre o modalFormaPagamento
},
    
        // fecha a modal de formas de pagamento
        fecharModalActionsFormaPagamento: () => {
            document.querySelector('#modalActionsFormaPagamento').classList.add('hidden');
        },
 

        


}


cardapio.templates = {

    item: `
        <div class="col animated fadeInUp">
            <div class="card h-100 card-item" id="\${id}">
                <div class="row h-100">
                    <div class="col-md-12 col-sm-4 col-12 d-flex align-items-center">
                        <img class="img-thumbnail w-100 rounded-5" src="\${img}" />
                    </div>
                    <div class="col-md-12 col-sm-8 col-12 d-flex flex-column text-start">
                        <div class="row">
                            <p class="title-produto text-md-center my-lg-3 my-2">
                                <b>\${nome}</b>
                            </p>
                        </div>
                        <div class="row">
                            <p class="desc-produto text-md-start my-lg-3 my-2">
                                <b>\${dsc}</b>
                            </p>
                        </div>
                        <div class="row">
                            <p class="price-produto text-md-center">
                                <b>R$ \${preco}</b>
                            </p>
                        </div>
                        <div class="row flex-fill align-items-end">
                            <div class="col text-md-center text-sm-end text-center">
                                <span class="btn btn-add btn-dark rounded rounded-4" onclick="cardapio.metodos.adicionarAoCarrinho('\${id}')">Selecionar<i class="fa fa-shopping-bag ms-2"></i></span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `,

    itemCarrinho: `
        <div class="col-12 my-2 shadow-lg rounded-2 p-3" id="\${uuid}">
            <div class="row align-items-center">
                <div class="col-lg-2 col-md-3 col-4">
                    <img class="img-thumbnail w-100" src="\${img}" />
                </div>
                <div class="col-lg-10 col-md-9 col-8 mt-2 dados-produto">
                    <div class="row">
                        <div class="col-md-7 col-sm-12">
                            <p class="title-produto"><b>\${nome}</b></p>
                            <p class="price-produto"><b>R$ \${preco}</b><b class="acrescimos-produto">\${preco-acrescimos}</b></p>
                            <p class="acrescimos-produto"><b>\${acrescimos}</b></p>
                        </div>
                        <div class="col-md-5 col-sm-12 d-flex align-items-center g-2 flex-wrap">
                            <div class="d-inline-flex flex-grow-1">
                                <div class="input-group align-items-center">
                                    <button type="button" class="btn btn-menos rounded-start-5" onclick="cardapio.metodos.diminuirQuantidadeCarrinho('\${uuid}')"><i class="fas fa-minus"></i></button>
                                    <span class="px-3 add-numero-itens text-center" id="qntd-carrinho-\${uuid}">\${qntd}</span>
                                    <button type="button" class="btn btn-mais rounded-end-5" onclick="cardapio.metodos.aumentarQuantidadeCarrinho('\${uuid}')"><i class="fas fa-plus"></i></button>
                                </div>
                            </div>
                            <div class="d-inline-flex gap-2" >
                                    <button type="button" class="btn btn-edit rounded-3" onclick="cardapio.metodos.alterarItemCarrinho('\${uuid}')"><i class="fa fa-pen"></i></button>
                                    <button type="button" class="btn btn-remove rounded-3 d-sm-block d-none" onclick="cardapio.metodos.removerItemCarrinho('\${uuid}')"><i class="fa fa-times"></i></button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `,

    itemResumo: `
        <div class="col-12 my-2 shadow-lg rounded-2 p-3" id="\${uuid}">
            <div class="row align-items-center">
                <div class="col-lg-2 col-md-3 col-4">
                    <img class="img-thumbnail w-100" src="\${img}" />
                </div>
                <div class="col-lg-10 col-md-9 col-8 mt-2 dados-produto">
                    <div class="d-flex justify-content-between align-items-center">
                        <p class="title-produto"><b>\${nome}</b></p>
                        <span class="ms-2 text-nowrap quantidade-produto-resumo">x <b>\${qntd}</b></span></div>
                    
                    <p class="price-produto"><b>R$ \${preco}</b><b class="acrescimos-produto">\${preco-acrescimos}</b></p>
                    <p class="acrescimos-produto"><b>\${acrescimos}</b></p>
                </div>
            </div>
        </div>
    `,

    // itemResumo: `
    //     <div class="col-12 item-carrinho resumo">
    //         <div class="img-produto-resumo">
    //             <img src="\${img}" />
    //         </div>
    //         <div class="dados-produto">
    //             <p class="title-produto-resumo"><b>\${nome}</b></p>
    //             <p class="price-produto-resumo"><b>R$ \${preco}</b><b class="acrescimos-produto">\${preco-acrescimos}</b></p>
    //             <p class="acrescimos-produto"><b>\${acrescimos}</b></p>
    //         </div>
    //         <p class="quantidade-produto-resumo">
    //             x <b>\${qntd}</b>
    //         </p>
    //     </div>
    // `,

}