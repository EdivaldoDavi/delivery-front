import { ACRESCIMOS } from "./dadoscopy.js"

export class Enums {
    static get CATEGORIES() {
        return {
            PIZZA: {
                id: '1',
                name: 'Cantinho Di Itália',
                img: {
                    type: Enums.TYPES_IMG.FAS,
                    name: 'fa-light fa-pizza-slice'
                },
                listAdditionals: ACRESCIMOS.PIZZA,
                company: Enums.EMPRESAS.EMPRESA01,
            },
            ESPETO: {
                id: '2',
                name: 'Sr. & Sra. Espeto',
                img: {
                     type: Enums.TYPES_IMG.IMG,
                    name: './img/cardapio/burguers/espetoimg.svg'
                },
                listAdditionals:ACRESCIMOS.ESPETO,
                company: Enums.EMPRESAS.EMPRESA02,
            },
            BURGER: {
                id: '3',
                name: 'Bendito Burguer',
                img: {
                    type: Enums.TYPES_IMG.FAS,
                    name: 'fas fa-hamburger'
                },
                listAdditionals: ACRESCIMOS.BURGER,
                company: Enums.EMPRESAS.EMPRESA03,
            },
             KREPE: {
                id: '4',
                name: 'Dú Cheff Krepes' ,
                img: {
                    type: Enums.TYPES_IMG.IMG,
                     name: './img/cardapio/churrasco/CREPES.svg'
                },
                listAdditionals: ACRESCIMOS.KREPE,
                company: Enums.EMPRESAS.EMPRESA04,
            },

            SUSHI: {
                id: '5',
                name: 'THIAGO PEREIRA',
                img: {
                    type: Enums.TYPES_IMG.IMG,
                    name: './img/cardapio/churrasco/hashi.svg'
                },
                listAdditionals: undefined,
                company: Enums.EMPRESAS.EMPRESA05,
            }
			/*
            BEBIDAS: {
                id: '6',
                name: 'Vilinha Chopp',
                img: {
                    type: Enums.TYPES_IMG.FAS,
                    name: 'fas fa-cocktail'
                },
                listAdditionals: ACRESCIMOS.BEBIDAS,
                company: Enums.EMPRESAS.EMPRESA06,
            }
			*/
			
        }
    }

    static get TYPES_IMG() {
        return {
            // Tipo de icone do font awesome, inserção na classe
            FAS: 'fas',
            // Tipo de imagem, inserção no src
            IMG: 'img',
        }
    }

    static get EMPRESAS() {
        return {
            EMPRESA01: {
                id: '1',
                name: 'PIZZA',
                 telOrder: '14 996420910',
                //telOrder: '18997010088',
                priceDelivery: 5,
				typesCommands: [
                    Enums.TYPES_COMMANDS.DELIVERY,
                    Enums.TYPES_COMMANDS.GET,
                    Enums.TYPES_COMMANDS.LOCAL,
                   // Enums.TYPES_COMMANDS.QUERY,
                ],
            },
            EMPRESA02: {
                id: '2',
                name: 'ESPETO',
                // telOrder: '14 99655-2177',
                telOrder: '14988121969',
                priceDelivery: 5,
             typesCommands: [
                   // Enums.TYPES_COMMANDS.DELIVERY,
                   // Enums.TYPES_COMMANDS.GET,
                    Enums.TYPES_COMMANDS.QUERY,
                ],				
            },
			 EMPRESA03: {
                id: '3',
                name: 'Burguer',
                // telOrder: '14 99655-2177',
                telOrder: '14991402791',
                priceDelivery: 5,
				typesCommands: [
                    Enums.TYPES_COMMANDS.DELIVERY,
                    Enums.TYPES_COMMANDS.GET,
                    Enums.TYPES_COMMANDS.QUERY,
                ],				
            },
			 EMPRESA04: {
                id: '4',
                name: 'Kreppe Dú Cheff',
                // telOrder: '14 99655-2177',
                telOrder: '14981247314',
                priceDelivery: 5,
				typesCommands: [
                   // Enums.TYPES_COMMANDS.DELIVERY,
                   // Enums.TYPES_COMMANDS.GET,
                    Enums.TYPES_COMMANDS.QUERY,
                ],				
            },
			 EMPRESA05: {
                id: '5',
                name: 'Sushi',
                // telOrder: '14 99655-2177',
                telOrder: '14997212656',
                priceDelivery: 5,
				typesCommands: [
                    Enums.TYPES_COMMANDS.DELIVERY,
                    Enums.TYPES_COMMANDS.GET,
                    Enums.TYPES_COMMANDS.QUERY,
                ],				
            },
			/*
			 EMPRESA06: {
                id: '6',
                name: 'Vilinha Chopp',
                // telOrder: '14 99655-2177',
                telOrder: '14996395200',
                priceDelivery: 5,
				typesCommands: [
                  //  Enums.TYPES_COMMANDS.DELIVERY,
                  //  Enums.TYPES_COMMANDS.GET,
                  Enums.TYPES_COMMANDS.QUERY,
                ],				
            },
			*/
        }
    }

    /**
     * Tipo de comanda (Delivery, retirada, consumo no local...)
     */
    static get TYPES_COMMANDS() {
        return {
            LOCAL: {
                id: '1',
                name: 'Consumo local',
            },
            DELIVERY: {
                id: '2',
                name: 'Delivery',
            },
            GET: {
                id: '3',
                name: 'Retirada',
            },
            QUERY: {
                id: '4',
                name: 'Cardápio',
            },
        }
    }

    
}
