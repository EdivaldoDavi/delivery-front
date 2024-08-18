import { Enums } from "./enums2.js";





// Função para obter os produtos da API
async function obterProdutos() {
    try {
        const response = await fetch('http://10.10.10.38:3000/produtos');
        const data = await response.json();
        if (!Array.isArray(data.data)) {
            throw new TypeError('Dados dos produtos não são um array');
        }
        return data.data;
    } catch (error) {
        console.error('Erro ao obter produtos:', error);
        return [];
    }
}

// Função para criar o menu com base nos produtos e categorias
async function criarMenu() {
    try {
      // console.log(Enums.CATEGORIES)
        const categoriasMap = await Enums.CATEGORIES; // Aguarda obter as categorias
      //  console.log('Categorias carregadas dadosjs:', categoriasMap);

        if (!categoriasMap || Object.keys(categoriasMap).length === 0) {
            throw new Error('Categorias não carregadas ou estão vazias.');
        }

     //   console.log(categoriasMap);

        const produtos = await obterProdutos();
      //  console.log('Produtos carregados:', produtos);

        const menu = produtos.map(produto => {
            // Encontre a chave da categoria com base no id
            const categoriaKey = Object.keys(categoriasMap).find(key => {
              //  console.log('produto.idcategoria:', produto.idcategoria);
             //   console.log('categoriasMap[key].id:', categoriasMap[key].id);
                return categoriasMap[key].id === produto.idcategoria.toString();
            });

            if (!categoriaKey) {
                console.error(`Categoria não encontrada para idcategoria: ${produto.idcategoria}`);
                return null;
            }

            //console.log(`Categoria encontrada: ${categoriaKey}`); // Depuração

            // Acesse a categoria correta no mapa de categorias
            const categoryEnum = categoriasMap[categoriaKey];

            if (!categoryEnum) {
                console.error(`Categoria não encontrada no mapa de categorias: ${categoriaKey}`);
                return null;
            }
                
            return {
                id: produto.id,
                img: produto.imaggem || './img/default.jpg', // Coloque uma imagem padrão se necessário
                name: produto.nome || 'Nome não disponível',
                price: produto.price || 0,
                dsc: produto.dsc || 'Descrição não disponível',
                category: categoryEnum, // Define a categoria conforme o Enums
            };
        }).filter(produto => produto !== null);

        console.log('MENU:', menu);
        return menu;
    } catch (error) {
        console.error('Erro ao criar o menu:', error);
        return [];
    }
}

// Função para inicializar e exportar o MENU
async function inicializarMenu() {
    const menu = await criarMenu();
    return menu;
}

const MENU = await inicializarMenu();


export { MENU };

/*
export let MENU2 = [];

// Função para obter os produtos da API
async function obterProdutos() {
    try {
        const response = await fetch('http://10.10.10.38:3000/produtos');
        const data = await response.json();
        if (!Array.isArray(data.data)) {
            throw new TypeError('Dados dos produtos não são um array');
        }
        return data.data;
    } catch (error) {
        console.error('Erro ao obter produtos:', error);
        return [];
    }
}
// Função para criar o menu com base nos produtos e categorias

async function criarMenu() {
    try {
        const categoriasMap = await Enums.CATEGORIES; // Aguarda obter as categorias
        console.log('Categorias carregadas:', categoriasMap);

        if (!categoriasMap || Object.keys(categoriasMap).length === 0) {
            throw new Error('Categorias não carregadas ou estão vazias.');
        }

        const produtos = await obterProdutos();
        console.log('Produtos carregados:', produtos);

        MENU = produtos.map(produto => {
            // Encontre a chave da categoria com base no id
           // const categoriaKey = Object.keys(categoriasMap).find(key => categoriasMap[key].id === produto.idcategoria.toString());
           const categoriaKey = Object.keys(categoriasMap).find(key => {
            console.log('produto.idcategoria:', produto.idcategoria);
            console.log('categoriasMap[key].id:', categoriasMap[key].id);
            return categoriasMap[key].id === produto.idcategoria.toString();
        });
            if (categoriaKey) {
                const categoria = categoriasMap[categoriaKey];
                console.log('ID da Categoria:', categoria.id); // Aqui você obtém o ID da categoria
            } else {
                console.error('Categoria não encontrada para idcategoria:', produto.idcategoria);
            }                

           if (!categoriaKey) {
                console.error(`Categoria não encontrada para idcategoria: ${produto.idcategoria}`);
                return null;
            }

            console.log(`Categoria encontrada: ${categoriaKey}`); // Depuração

            // Acesse a categoria correta no mapa de categorias
            //const categoryEnum = categoriasMap[categoriaKey];
            const categoryEnum = `Enums.CATEGORIES.${categoriaKey}`;
            if (!categoryEnum) {
                console.error(`Categoria não encontrada no mapa de categorias: ${categoriaKey}`);
                return null;
            }


            return {
                id: produto.id,
                img: produto.imaggem || './img/default.jpg', // Coloque uma imagem padrão se necessário
                name: produto.nome || 'Nome não disponível',
                price: produto.price || 0,
                dsc: produto.dsc || 'Descrição não disponível',
                category: categoryEnum, // Define a categoria conforme o Enums
            };
        }).filter(produto => produto !== null);

        console.log('MENU:', MENU2);
    } catch (error) {
        console.error('Erro ao criar o menu:', error);
    }
}

// Chama a função para criar o menu
//criarMenu();

*/

/*

export let MENU = [
    {
        id: 1,
        img: "./img/cardapio/pizzas/portuguesa.jpg",
        name: "PORTUGUESA, Inteira 8 pedaços, Dinheiro ou Pix",
        price: 59.90,
        dsc: "Molho, Mussarela, Presunto, Ovo, Palmito,Milho, Ervilha, Cebola,Tomate,Azeitona, e Orégano",
        category: Enums.CATEGORIES.PIZZA,
    },
    {
        id: 2,
        img: "./img/cardapio/pizzas/portuguesa.jpg",
        name: "PORTUGUESA, Inteira 8 pedaços, Débito ou crédito",
        price: 68.90,
        dsc: "Molho, Mussarela, Presunto, Ovo, Palmito,Milho, Ervilha, Cebola,Tomate,Azeitona, e Orégano",
        category: Enums.CATEGORIES.PIZZA,
    },
	
    {
        id: 3,
        img: "./img/cardapio/pizzas/portuguesa.jpg",
        name: "PORTUGUESA, Individual, Dinheiro ou Pix ",
        price: 27.90,
        dsc: "Molho, Mussarela, Presunto, Ovo, Palmito,Milho, Ervilha, Cebola,Tomate,Azeitona, e Orégano",
        category: Enums.CATEGORIES.PIZZA,
    },
    {
        id: 4,
        img: "./img/cardapio/pizzas/portuguesa.jpg",
        name: "PORTUGUESA Individual, Débito ou Crédito",
        price: 29.90,
        dsc: "Molho, Mussarela, Presunto, Ovo, Palmito,Milho, Ervilha, Cebola,Tomate,Azeitona, e Orégano",
        category: Enums.CATEGORIES.PIZZA,
    },
	
    {
        id: 5,
        img: "./img/cardapio/pizzas/costela.jpg",
        name: "COSTELA, Inteira, 8 pedaços, Dinheiro ou Pix",
        price: 59.90,
        dsc: "Molho, Mussarela, Costela, Catupiry e  Bacon",
        category: Enums.CATEGORIES.PIZZA,
    },
    {
        id: 6,
        img: "./img/cardapio/pizzas/costela.jpg",
        name: "COSTELA, Inteira 8 pedaços, Dinheiro ou Pix",
        price: 68.90,
        dsc: "Molho, Mussarela, Costela, Catupiry e  Bacon",
        category: Enums.CATEGORIES.PIZZA,
    },
	
    {
        id: 7,
        img: "./img/cardapio/pizzas/costela.jpg",
        name: "COSTELA, Individual, Dinheiro ou Pix",
        price: 27.90,
        dsc: "Molho, Mussarela, Costela, Catupiry e  Bacon",
        category: Enums.CATEGORIES.PIZZA,
    },
    {
        id: 8,
        img: "./img/cardapio/pizzas/costela.jpg",
        name: "COSTELA, Individual, Crédito ou Débito",
        price: 29.90,
        dsc: "Molho, Mussarela, Costela, Catupiry e  Bacon",
        category: Enums.CATEGORIES.PIZZA,
    },

    {
        id: 9,
        img: "./img/cardapio/pizzas/nuggets.jpg",
        name: "NUGGET DE FRANGO, Inteira, 8 pedaços, Dinheiro ou Pix",
        price: 59.90,
        dsc: "Molho, Mussarela, Presunto, Nugget, Bacon e Cream Cheese",
        category: Enums.CATEGORIES.PIZZA,
    },
    {
        id: 10,
        img: "./img/cardapio/pizzas/nuggets.jpg",
        name: "NUGGET DE FRANGO, Inteira, 8 pedaços, Débito ou Crédito",
        price: 68.90,
        dsc: "Molho, Mussarela, Presunto, Nugget, Bacon e Cream Cheese",
        category: Enums.CATEGORIES.PIZZA,
    },
	
    {
        id: 11,
        img: "./img/cardapio/pizzas/nuggets.jpg",
        name: "NUGGET DE FRANGO, Individual, Dinheiro ou Pix",
        price: 27.90,
        dsc: "Molho, Mussarela, Presunto, Nugget, Bacon e Cream Cheese",
        category: Enums.CATEGORIES.PIZZA,
    },
    {
        id: 12,
        img: "./img/cardapio/pizzas/nuggets.jpg",
        name: "NUGGET DE FRANGO, Individual, Crédito ou Débito",
        price: 29.90,
		dsc: "Molho, Mussarela, Presunto, Nugget, Bacon e Cream Cheese",
        category: Enums.CATEGORIES.PIZZA,
    },
    {
        id: 13,
        img: "./img/cardapio/pizzas/costela.jpg",
        name: "COSTELA, Individual, Crédito ou Débito",
        price: 29.90,
        dsc: "Molho, Mussarela, Costela, Catupiry e  Bacon",
        category: Enums.CATEGORIES.PIZZA,
    },

    {
        id: 14,
        img: "./img/cardapio/pizzas/lombo.jpg",
        name: "LOMBO, Inteira, 8 pedaços, Dinheiro ou Pix",
        price: 59.90,
        dsc: "Molho, Mussarela, Lombo Defumado,Cream Cheese e Orégano",
        category: Enums.CATEGORIES.PIZZA,
    },
    {
        id: 15,
        img: "./img/cardapio/pizzas/lombo.jpg",
        name: "LOMBO, Inteira, 8 pedaços, Débito ou Crédito",
        price: 68.90,
        dsc: "Molho, Mussarela, Lombo Defumado,Cream Cheese e Orégano",
        category: Enums.CATEGORIES.PIZZA,
    },
	
    {
        id: 16,
        img: "./img/cardapio/pizzas/lombo.jpg",
        name: "LOMBO, Individual, Dinheiro ou Pix",
        price: 27.90,
        dsc: "Molho, Mussarela, Lombo Defumado,Cream Cheese e Orégano",
        category: Enums.CATEGORIES.PIZZA,
    },
    {
        id: 17,
        img: "./img/cardapio/pizzas/lombo.jpg",
        name: "LOMBO, Individual, Crédito ou Débito",
        price: 29.90,
        dsc: "Molho, Mussarela, Lombo Defumado,Cream Cheese e Orégano",
        category: Enums.CATEGORIES.PIZZA,
    },
    {
        id: 18,
        img: "./img/cardapio/pizzas/frango.jpg",
        name: "FRANGO, Inteira, 8 pedaços, Dinheiro ou Pix",
        price: 59.90,
        dsc: "Molho, Mussarela, Frango Desfiado, Bacon, Catupiry, Tomate, Azeitona  e Orégano",
        category: Enums.CATEGORIES.PIZZA,
    },
    {
        id: 19,
        img: "./img/cardapio/pizzas/frango.jpg",
        name: "FRANGO, Inteira, 8 pedaços, Débito ou Crédito",
        price: 68.90,
        dsc: "Molho, Mussarela, Frango Desfiado, Bacon, Catupiry, Tomate, Azeitona  e Orégano",
        category: Enums.CATEGORIES.PIZZA,
    },
	
    {
        id: 20,
        img: "./img/cardapio/pizzas/frango.jpg",
        name: "FRANGO, Individual, Dinheiro ou Pix",
        price: 27.90,
        dsc: "Molho, Mussarela, Frango Desfiado, Bacon, Catupiry, Tomate, Azeitona  e Orégano",
        category: Enums.CATEGORIES.PIZZA,
    },
    {
        id: 21,
        img: "./img/cardapio/pizzas/frango.jpg",
        name: "FRANGO, Individual, Crédito ou Débito",
        price: 29.90,
        dsc: "Molho, Mussarela, Frango Desfiado, Bacon, Catupiry, Tomate, Azeitona  e Orégano",
        category: Enums.CATEGORIES.PIZZA,
    },
    {
        id: 22,
        img: "./img/cardapio/pizzas/calabresa.jpg",
        name: "CALABRESA, Inteira, 8 pedaços, Dinheiro ou Pix",
        price: 59.90,
        dsc: "Molho, Mussarela, Calabresa, Cebola, Cream Cheese  e Orégano",
        category: Enums.CATEGORIES.PIZZA,
    },
    {
        id: 23,
        img: "./img/cardapio/pizzas/calabresa.jpg",
        name: "CALABRESA, Inteira, 8 pedaços, Débito ou Crédito",
        price: 68.90,
        dsc: "Molho, Mussarela, Calabresa, Cebola, Cream Cheese  e Orégano",
        category: Enums.CATEGORIES.PIZZA,
    },
	
    {
        id: 24,
        img: "./img/cardapio/pizzas/calabresa.jpg",
        name: "CALABRESA, Individual, Dinheiro ou Pix",
        price: 27.90,
        dsc: "Molho, Mussarela, Calabresa, Cebola, Cream Cheese  e Orégano",
        category: Enums.CATEGORIES.PIZZA,
    },
    {
        id: 25,
        img: "./img/cardapio/pizzas/calabresa.jpg",
        name: "CALABRESA, Individual, Crédito ou Débito",
        price: 29.90,
        dsc: "Molho, Mussarela, Calabresa, Cebola, Cream Cheese  e Orégano",
        category: Enums.CATEGORIES.PIZZA,
    },
    {
        id: 26,
        img: "./img/cardapio/pizzas/bauru.jpg",
        name: "BAURU, Inteira, 8 pedaços, Dinheiro ou Pix",
        price: 59.90,
        dsc: "Molho, Mussarela, Presunto, Bacon, Catupiry, Tomate, Azeitona e Orégano",
        category: Enums.CATEGORIES.PIZZA,
    },
    {
        id: 27,
        img: "./img/cardapio/pizzas/bauru.jpg",
        name: "BAURU, Inteira, 8 pedaços, Débito ou Crédito",
        price: 68.90,
        dsc: "Molho, Mussarela, Presunto, Bacon, Catupiry, Tomate, Azeitona e Orégano",
        category: Enums.CATEGORIES.PIZZA,
    },
	
    {
        id: 28,
        img: "./img/cardapio/pizzas/bauru.jpg",
        name: "BAURU, Individual, Dinheiro ou Pix",
        price: 27.90,
        dsc: "Molho, Mussarela, Presunto, Bacon, Catupiry, Tomate, Azeitona e Orégano",
        category: Enums.CATEGORIES.PIZZA,
    },
    {
        id: 29,
        img: "./img/cardapio/pizzas/bauru.jpg",
        name: "BAURU, Individual, Crédito ou Débito",
        price: 29.90,
        dsc: "Molho, Mussarela, Presunto, Bacon, Catupiry, Tomate, Azeitona e Orégano",
        category: Enums.CATEGORIES.PIZZA,
		},
		{
        id: 30,
        img: "./img/cardapio/pizzas/brocolis.jpg",
        name: "BRÓCOLIS, Inteira, 8 pedaços, Dinheiro ou Pix",
        price: 59.90,
        dsc: "Molho, Mussarela, Presunto, Bacon, Catupiry, Tomate, Azeitona e Orégano",
        category: Enums.CATEGORIES.PIZZA,
    },
    {
        id: 31,
        img: "./img/cardapio/pizzas/brocolis.jpg",
        name: "BRÓCOLIS, Inteira, 8 pedaços, Débito ou Crédito",
        price: 68.90,
        dsc: "Molho, Mussarela, Presunto, Bacon, Catupiry, Tomate, Azeitona e Orégano",
        category: Enums.CATEGORIES.PIZZA,
    },
   {
        id: 32,
        img: "./img/cardapio/pizzas/brocolis.jpg",
        name: "BRÓCOLIS, Individual, Dinheiro ou Pix",
        price: 27.90,
        dsc: "Molho, Mussarela, Presunto, Bacon, Catupiry, Tomate, Azeitona e Orégano",
        category: Enums.CATEGORIES.PIZZA,
    },
    {
        id: 33,
        img: "./img/cardapio/pizzas/brocolis.jpg",
        name: "BRÓCOLIS, Individual, Crédito ou Débito",
        price: 29.90,
        dsc: "Molho, Mussarela, Presunto, Bacon, Catupiry, Tomate, Azeitona e Orégano",
        category: Enums.CATEGORIES.PIZZA,
    },
    {
        id: 34,
        img: "./img/cardapio/pizzas/mussarela.jpg",
        name: "MUSSARELA, Inteira, 8 pedaços, Dinheiro ou Pix",
        price: 59.90,
        dsc: "Molho, Mussarela, Provolne, Bacon, Parmesão, Tomate e Orégano",
        category: Enums.CATEGORIES.PIZZA,
    },
    {
        id: 35,
        img: "./img/cardapio/pizzas/mussarela.jpg",
        name: "MUSSARELA, Inteira, 8 pedaços, Débito ou Crédito",
        price: 68.90,
        dsc: "Molho, Mussarela, Provolne, Bacon, Parmesão, Tomate e Orégano",
        category: Enums.CATEGORIES.PIZZA,
    },
   {
        id: 36,
        img: "./img/cardapio/pizzas/mussarela.jpg",
        name: "MUSSARELA, Individual, Dinheiro ou Pix",
        price: 27.90,
        dsc: "Molho, Mussarela, Provolne, Bacon, Parmesão, Tomate e Orégano",
        category: Enums.CATEGORIES.PIZZA,
    },
    {
        id: 37,
        img: "./img/cardapio/pizzas/mussarela.jpg",
        name: "MUSSARELA, Individual, Crédito ou Débito",
        price: 29.90,
        dsc: "Molho, Mussarela, Provolne, Bacon, Parmesão, Tomate e Orégano",
        category: Enums.CATEGORIES.PIZZA,
    },
    {
        id: 38,
        img: "./img/cardapio/pizzas/modadacasa.jpg",
        name: "MODA DA CASA, Inteira, 8 pedaços, Dinheiro ou Pix",
        price: 59.90,
        dsc: "Molho, Mussarela, Lombo defumado, Cream Cheese, Brócolis, Ovo, Bacon, Azeitona e Orégano",
        category: Enums.CATEGORIES.PIZZA,
    },
    {
        id: 39,
        img: "./img/cardapio/pizzas/modadacasa.jpg",
        name: "MODA DA CASA, Inteira, 8 pedaços, Débito ou Crédito",
        price: 68.90,
        dsc: "Molho, Mussarela, Lombo defumado, Cream Cheese, Brócolis, Ovo, Bacon, Azeitona e Orégano",
        category: Enums.CATEGORIES.PIZZA,
    },
   {
        id: 40,
        img: "./img/cardapio/pizzas/modadacasa.jpg",
        name: "MODA DA CASA, Individual, Dinheiro ou Pix",
        price: 27.90,
        dsc: "Molho, Mussarela, Lombo defumado, Cream Cheese, Brócolis, Ovo, Bacon, Azeitona e Orégano",
        category: Enums.CATEGORIES.PIZZA,
    },
    {
        id: 41,
        img: "./img/cardapio/pizzas/modadacasa.jpg",
        name: "MODA DA CASA, Individual, Crédito ou Débito",
        price: 29.90,
        dsc: "Molho, Mussarela, Lombo defumado, Cream Cheese, Brócolis, Ovo, Bacon, Azeitona e Orégano",
        category: Enums.CATEGORIES.PIZZA,
    },
    {
        id: 42,
        img: "./img/cardapio/pizzas/atum.jpg",
        name: "ATUM, Inteira, 8 pedaços, Dinheiro ou Pix",
        price: 59.90,
        dsc: "Molho, Mussarela, Atum, Parmesão, Tomate, Azeitona e Orégano",
        category: Enums.CATEGORIES.PIZZA,
    },
    {
        id: 43,
        img: "./img/cardapio/pizzas/atum.jpg",
        name: "ATUM, Inteira, 8 pedaços, Débito ou Crédito",
        price: 68.90,
        dsc: "Molho, Mussarela, Atum, Parmesão, Tomate, Azeitona e Orégano",
        category: Enums.CATEGORIES.PIZZA,
    },
   {
        id: 44,
        img: "./img/cardapio/pizzas/atum.jpg",
        name: "ATUM, Individual, Dinheiro ou Pix",
        price: 27.90,
        dsc: "Molho, Mussarela, Atum, Parmesão, Tomate, Azeitona e Orégano",
        category: Enums.CATEGORIES.PIZZA,
    },
    {
        id: 45,
        img: "./img/cardapio/pizzas/atum.jpg",
        name: "ATUM, Individual, Crédito ou Débito",
        price: 29.90,
        dsc: "Molho, Mussarela, Atum, Parmesão, Tomate, Azeitona e Orégano",
        category: Enums.CATEGORIES.PIZZA,
    },

    {
        id: 46,
        img: "./img/cardapio/pizzas/nhoque.jpg",
        name: "NHOQUE RECHEADO, Quinta e Domingo, Dinheiro ou Pix",
        price: 39.90,
        dsc: "Mussarela",
        category: Enums.CATEGORIES.PIZZA,
    },
    {
        id: 47,
        img: "./img/cardapio/pizzas/nhoque.jpg",
        name: "NHOQUE RECHEADO, Quinta e Domingo, Crédito ou Débito",
        price: 44.90,
        dsc: "Mussarela",
        category: Enums.CATEGORIES.PIZZA,
    },

 {
        id: 48,
        img: "./img/cardapio/churrasco/alcatra.jpg",
        name: "ALCATRA",
        price: 8.50,
        dsc: "Alcatra",
        category: Enums.CATEGORIES.ESPETO,
    },
 {
        id: 49,
        img: "./img/cardapio/churrasco/costela.jpg",
        name: "COSTELA",
        price: 8.50,
        dsc: "Costela",
        category: Enums.CATEGORIES.ESPETO,
    },
 {
        id: 50,
        img: "./img/cardapio/churrasco/kafta.jpg",
        name: "KAFTA",
        price: 8.50,
        dsc: "Kafta",
        category: Enums.CATEGORIES.ESPETO,
    },
 {
        id: 51,
        img: "./img/cardapio/churrasco/kaftacomqueijo.jpg",
        name: "KAFTA COM QUEIJO",
        price: 8.50,
        dsc: "Kafta e queijo",
        category: Enums.CATEGORIES.ESPETO,
    },
 {
        id: 52,
        img: "./img/cardapio/churrasco/kaftacomqueijo.jpg",
        name: "KAFTA COM QUEIJO APIMENTADO",
        price: 8.50,
        dsc: "Kafta, queijo e pimenta",
        category: Enums.CATEGORIES.ESPETO,
    },
 {
        id: 53,
        img: "./img/cardapio/churrasco/linguica.jpg",
        name: "LINGUIÇA",
        price: 8.50,
        dsc: "Linguiça",
        category: Enums.CATEGORIES.ESPETO,
    },
 {
        id: 54,
        img: "./img/cardapio/churrasco/panceta.jpg",
        name: "PANCETA",
        price: 8.50,
        dsc: "Panceta",
        category: Enums.CATEGORIES.ESPETO,
    },
 {
        id: 55,
        img: "./img/cardapio/churrasco/paodealho.jpg",
        name: "PÃO DE ALHO",
        price: 8.50,
        dsc: "Pão e alho",
        category: Enums.CATEGORIES.ESPETO,
    },
 {
        id: 56,
        img: "./img/cardapio/churrasco/queijocoalho.jpg",
        name: "QUEIJO COALHO",
        price: 8.50,
        dsc: "Queijo coalho",
        category: Enums.CATEGORIES.ESPETO,
    },
	{
        id: 57,
        img: "./img/cardapio/churrasco/picanha.jpg",
        name: "PICANHA",
        price: 13.00,
        dsc: "Picanha",
        category: Enums.CATEGORIES.ESPETO,
    },
    {
        id: 58,
        img: "./img/cardapio/churrasco/medalhaofrango.jpg",
        name: "MEDALHÃO DE FRANGO",
        price: 9.50,
        dsc: "Frango e Bacon",
        category: Enums.CATEGORIES.ESPETO,
    },
    {
        id: 59,
        img: "./img/cardapio/churrasco/medalhaoalcatra.jpg",
        name: "MEDALHÃO DE ALCATRA",
        price: 10.50,
        dsc: "Alcatra e Bacon",
        category: Enums.CATEGORIES.ESPETO,
    },
    {
        id: 60,
        img: "./img/cardapio//churrasco/fraldinha.jpg",
        name: "FRALDINHA AO PARMESÃO",
        price: 9.00,
        dsc: "Fraldinha, Parmesão e Pimenta",
        category: Enums.CATEGORIES.ESPETO,
    },
 {
        id: 61,
        img: "./img/cardapio/churrasco/kaftasuper.jpg",
        name: "KAFTA SUPER RECHEADA",
        price: 13.90,
        dsc: "Catupiry, Alho Crocante e Cheiro verde",
        category: Enums.CATEGORIES.ESPETO,
    },
	{
        id: 62,
        img: "./img/cardapio/burguers/imgpadrao.jpg",
        name: "COMBO 1",
        price: 74.90,
        dsc: "2 Lanches a sua escolha e 1 fritas individual",
        category: Enums.CATEGORIES.BURGER,
    },
	{
        id: 63,
        img: "./img/cardapio/burguers/imgpadrao.jpg",
        name: "COMBO 2",
        price: 40.90,
        dsc: "1 Lanches a sua escolha e 1 fritas individual",
        category: Enums.CATEGORIES.BURGER,
    },
	{
        id: 64,
        img: "./img/cardapio/burguers/imgpadrao.jpg",
        name: "COMBO KIDS",
        price: 24.90,
        dsc: "Pão, Carne e Queijo e 1 fritas individual",
        category: Enums.CATEGORIES.BURGER,
    },
	{
        id: 65,
        img: "./img/cardapio/burguers/imgpadrao.jpg",
        name: "HOT ESPECIAL",
        price: 29.90,
        dsc: "Pão Tradicional, 2 Salsichas, Vinagrete, Milho, Bacon, Catupiry, Maionese,  Ketchup e Mostarda",
        category: Enums.CATEGORIES.BURGER,
    },

	{
        id: 66,
        img: "./img/cardapio/burguers/imgpadrao.jpg",
        name: "X EGG BACON",
        price: 38.90,
        dsc: "Hamburguer 120g, Ovo, Bacon, Queijo, Maionese, Ketchup, Mostarda, Tomate, Cebola e Alface",
        category: Enums.CATEGORIES.BURGER,
    },	
	{
        id: 67,
        img: "./img/cardapio/burguers/imgpadrao.jpg",
        name: "X FRANGO",
        price: 29.90,
        dsc: "Pão Tradicional, Filé de frango, Milho, Catupiry, Alface, Tomate e Cebola",
        category: Enums.CATEGORIES.BURGER,
    },
	{
        id: 68,
        img: "./img/cardapio/burguers/imgpadrao.jpg",
        name: "X TUDO",
        price: 44.90,
        dsc: "Hamburguer 120g, Ovo, Bacon, Frango, Catupiry, Presunto, Queijo, Maionese, Ketchup, Mostarda, Tomate, Cebola e Alface",
        category: Enums.CATEGORIES.BURGER,
    },
	{
        id: 69,
        img: "./img/cardapio/burguers/imgpadrao.jpg",
        name: "DUPLO BACON",
        price: 34.90,
        dsc: "Pão Artesanal, 2 Carnes 80g, Bacon, Queijo, Cheddar fatia,Maionese defumada, Alface americano, Tomate e Cebola Roxa",
        category: Enums.CATEGORIES.BURGER,
    },
	{
        id: 70,
        img: "./img/cardapio/burguers/imgpadrao.jpg",
        name: "DUPLO BURGER",
        price: 29.90,
        dsc: "Pão Artesanal, 2 Carnes 80g, Maionese caseira defumada e Queijo cheddar fatia",
        category: Enums.CATEGORIES.BURGER,
    },
	{
        id: 71,
        img: "./img/cardapio/burguers/imgpadrao.jpg",
        name: "DUPLO CATUPIRY",
        price: 37.90,
        dsc: "Pão Artesanal, 2 Carnes 80g, Maionese defumada, Alface americano, Tomate e Cebola roxa",
        category: Enums.CATEGORIES.BURGER,
    },
	{
        id: 72,
        img: "./img/cardapio/burguers/imgpadrao.jpg",
        name: "DUPLO CHEDDAR",
        price: 36.90,
        dsc: "Pão Australiano, 2 Carnes 80g, Cheddar em Pasta, Bacon e Cebola caramelizada",
        category: Enums.CATEGORIES.BURGER,
    },
	{
        id: 73,
        img: "./img/cardapio/burguers/imgpadrao.jpg",
        name: "DUPLO GORGONZOLA",
        price: 38.90,
        dsc: "Pão Australiano, 2 Carnes 80g, Gorgonzola, Bacon, Rúcula e Cebola caramelizada",
        category: Enums.CATEGORIES.BURGER,
    },
	{
        id: 74,
        img: "./img/cardapio/burguers/imgpadrao.jpg",
        name: "DUPLO RODEIO",
        price: 37.90,
        dsc: "Pão Artesanal, 2 Carnes 80g, Anel de Cebola, Barbecue, Cheddar em Pasta e Cheddar em fatia e Maionese defumada",
        category: Enums.CATEGORIES.BURGER,
    },
	{
        id: 75,
        img: "./img/cardapio/burguers/imgpadrao.jpg",
        name: "DUPLO SALADA",
        price: 33.90,
        dsc: "Pão Artesanal, 2 Carnes 80g, Queijo Cheddar fatia, Maionese defumada, Alface americano, Tomate e Cebola roxa",
        category: Enums.CATEGORIES.BURGER,
    },
	{
        id: 76,
        img: "./img/cardapio/krepes/batatinhachips.jpg",
        name: "Batatinha Artesanal tipo chips",
        price: 11.90,
        dsc: "Batatinha Artesanal tipo chips",
        category: Enums.CATEGORIES.KREPE,
    },
	
	{
        id: 77,
        img: "./img/cardapio/krepes/batatinhachips.jpg",
        name: "Batatinha Artesanal tipo chips, com tempero e molho",
        price: 16.90,
        dsc: "Tempero: páprica picante ou lemmon pepper, molho:( queijos ou cheddar), favor discriminar na obervação o tempero e o molho escolhido",
        category: Enums.CATEGORIES.KREPE,
    },
	{
        id: 78,
        img: "./img/cardapio/krepes/krepepadrao.jpg",
        name: "Pizzinha KREPE - peppe",
        price: 19.90,
        dsc: "Mussarela, peperoni, cheiro verde, orégano e catupiry ",
        category: Enums.CATEGORIES.KREPE,
    },
	{
        id: 79,
        img: "./img/cardapio/krepes/krepepadrao.jpg",
        name: "Pizzinha KREPE - corn bacon",
        price: 19.90,
        dsc: "Mussarela, bacon, milho verde, orégano e catupiry",
        category: Enums.CATEGORIES.KREPE,
    },
	{
        id: 80,
        img: "./img/cardapio/krepes/krepepadrao.jpg",
        name: "KREPE Bambino",
        price: 19.90,
        dsc: "Mussarela, catupiry e orégano",
        category: Enums.CATEGORIES.KREPE,
    },
	{
        id: 81,
        img: "./img/cardapio/krepes/krepepadrao.jpg",
        name: "KREPE Brasil",
        price: 22.90,
        dsc: "Mussarela, presunto, tomate, cebola roxa, azeitona e orégano",
        category: Enums.CATEGORIES.KREPE,
    },
	{
        id: 82,
        img: "./img/cardapio/krepes/krepepadrao.jpg",
        name: "KREPE Brócolis",
        price: 26.90,
        dsc: "Mussarela, brócolis salteados no azeite, bacon, alho crocante, orégano e catupiry",
        category: Enums.CATEGORIES.KREPE,
    },
	{
        id: 83,
        img: "./img/cardapio/krepes/krepepadrao.jpg",
        name: "KREPE Pizza",
        price: 26.90,
        dsc: "Mussarela, tomate, presunto, bacon, orégano e catupiry",
        category: Enums.CATEGORIES.KREPE,
    },
	{
        id: 84,
        img: "./img/cardapio/krepes/krepepadrao.jpg",
        name: "KREPE Portuga",
        price: 29.90,
        dsc: "Mussarela, presunto, tomate, cebola roxa, ovo cozido, palmito, azeitona, orégano e catupiry",
        category: Enums.CATEGORIES.KREPE,
    },
	{
        id: 85,
        img: "./img/cardapio/krepes/krepepadrao.jpg",
        name: "KREPE Mignon pepper",
        price: 38.90,
        dsc: "Mussarela, filé mignon em tiras, tomate, cebola roxa, pimenta biquinho, bacon crocante, geléia de pimenta de cabron, rúcula, orégano  e catupiry",
        category: Enums.CATEGORIES.KREPE,
    },
	{
        id: 86,
        img: "./img/cardapio/krepes/krepepadrao.jpg",
        name: "KREPE Mignon com Brócolis",
        price: 37.90,
        dsc: "Mussarela, filé mignon em tiras, brócolis no azeite, parmesão, tomate cereja, orégano, alho frito e catupiry",
        category: Enums.CATEGORIES.KREPE,
    },
	{
        id: 87,
        img: "./img/cardapio/krepes/krepepadrao.jpg",
        name: "KREPE Mignon quatro queijos",
        price: 37.90,
        dsc: "Mussarela, filé mignon em tiras, gorgonzola, parmesão, nóz moscada, orégano e catupiry",
        category: Enums.CATEGORIES.KREPE,
    },
	{
        id: 88,
        img: "./img/cardapio/krepes/krepepadrao.jpg",
        name: "KREPE Bauru",
        price: 33.90,
        dsc: "Mussarela, filé mignon em tiras, tomate, picles de pepino, orégano e catupiry",
        category: Enums.CATEGORIES.KREPE,
    },
	{
        id: 89,
        img: "./img/cardapio/krepes/krepepadrao.jpg",
        name: "KREPE Dú cheff",
        price: 31.90,
        dsc: "Mussarela, filé em tiras, tomate, cebola roxa, rúcula, pimenta biquinho, orégano e catupiry",
        category: Enums.CATEGORIES.KREPE,
    },
	{
        id: 90,
        img: "./img/cardapio/krepes/krepepadrao.jpg",
        name: "KREPE Cheff Melt",
        price: 33.90,
        dsc: "Mussarela, filé bovino, cebola caramelizada, bacon, doritos, cheddar cremoso e orégano",
        category: Enums.CATEGORIES.KREPE,
    },
	{
        id: 91,
        img: "./img/cardapio/krepes/krepepadrao.jpg",
        name: "KREPE Calábria (calabresa)",
        price: 22.90,
        dsc: "Mussarela, calabresa defumada e fatiada, cebola roxa, orégano e catupiry",
        category: Enums.CATEGORIES.KREPE,
    },
	{
        id: 92,
        img: "./img/cardapio/krepes/krepepadrao.jpg",
        name: "KREPE Calábria especial",
        price: 27.90,
        dsc: "Mussarela, calabresa defumada fatiada, cebola roxa, tomate, bacon, ovo, orégano e catupiry",
        category: Enums.CATEGORIES.KREPE,
    },
	{
        id: 93,
        img: "./img/cardapio/krepes/krepepadrao.jpg",
        name: "KREPE chicken",
        price: 27.90,
        dsc: "Mussarela, filézinhos de frango em tiras, milho, azeitona, orégano e catupiry",
        category: Enums.CATEGORIES.KREPE,
    },
	{
        id: 94,
        img: "./img/cardapio/krepes/krepepadrao.jpg",
        name: "KREPE chicken bacon",
        price: 31.90,
        dsc: "Mussarela, filézinhos de frango em tiras, milho, tomate cereja, bacon, orégano e catupiry",
        category: Enums.CATEGORIES.KREPE,
    },
	{
        id: 95,
        img: "./img/cardapio/krepes/krepepadrao.jpg",
        name: "KREPE Ribs barbecue",
        price: 31.90,
        dsc: "Mussarela, costela angus desfiada ao barbecue, bacon, cebola, crispy, orégano e catupiry",
        category: Enums.CATEGORIES.KREPE,
    },
	{
        id: 96,
        img: "./img/cardapio/krepes/krepepadrao.jpg",
        name: "KREPE Ribs dos deuses",
        price: 31.90,
        dsc: "Mussarela, costela angus desfiada, tomate cereja, bacon crocante, orégano e catupiry",
        category: Enums.CATEGORIES.KREPE,
    },
	{
        id: 97,
        img: "./img/cardapio/krepes/krepepadrao.jpg",
        name: "KREPE Peito de peru com alho poró ",
        price: 27.90,
        dsc: "Mussarela, peito de peru, tomate, alho poró, palmito, orégano e catupriy",
        category: Enums.CATEGORIES.KREPE,
    },
	{
        id: 98,
        img: "./img/cardapio/krepes/krepepadrao.jpg",
        name: "KREPE Peru",
        price: 27.90,
        dsc: "Mussarela, peito de peru, ovo cozido, bacon, tomate cereja e catupiry",
        category: Enums.CATEGORIES.KREPE,
    },
	{
        id: 99,
        img: "./img/cardapio/krepes/krepepadrao.jpg",
        name: "KREPE Lombinho",
        price: 29.90,
        dsc: "Mussarela, lombo defumado, geléia de pimenta, tomate cereja, palmito, bacon, orégano e catupiry",
        category: Enums.CATEGORIES.KREPE,
    },
	{
        id: 100,
        img: "./img/cardapio/krepes/krepepadrao.jpg",
        name: "KREPE Carne seca",
        price: 33.90,
        dsc: "Mussarela, carne seca desfiada no azeite, cebola roxa, pimenta biquinho, geléia de pimenta, cheiro verde, orégano e catupiry",
        category: Enums.CATEGORIES.KREPE,
    },
	{
        id: 101,
        img: "./img/cardapio/krepes/krepepadrao.jpg",
        name: "KREPE Caprese",
        price: 25.90,
        dsc: "Mussarela, tomate cereja, rúcula, pesto de manjericão, orégano e parmesão",
        category: Enums.CATEGORIES.KREPE,
    },
	{
        id: 102,
        img: "./img/cardapio/krepes/krepepadrao.jpg",
        name: "KREPE Margueritta",
        price: 24.90,
        dsc: "Mussarela, mix de tomate italiano e cereja, manjericão fresco, molho pesto, parmesão e orégano",
        category: Enums.CATEGORIES.KREPE,
    },
	{
        id: 103,
        img: "./img/cardapio/krepes/krepepadrao.jpg",
        name: "KREPE Vegetariano",
        price: 29.90,
        dsc: "Mussarela, palmito, brócolis, tomate, cenoura, alho poró, molho pesto,orégano e catupiry",
        category: Enums.CATEGORIES.KREPE,
    },
	{
        id: 104,
        img: "./img/cardapio/krepes/krepepadrao.jpg",
        name: "KREPE quadrado Gorgô",
        price: 38.90,
        dsc: "Mussarela, filé mignon em tiras, gorgonzola, cebola caramelizada, orégano e catupiry(acompanha batata chips artesanal)",
        category: Enums.CATEGORIES.KREPE,
    },
	{
        id: 105,
        img: "./img/cardapio/krepes/krepepadrao.jpg",
        name: "KREPE quadrado Dú Sertão",
        price: 38.90,
        dsc: "Mussarela, blend de carne seca e costela desfiados no azeite, cheiro verde, orégano e catupiry(Acompanha batata chips artesanal) ",
        category: Enums.CATEGORIES.KREPE,
    },
	{
        id: 106,
        img: "./img/cardapio/krepes/krepepadrao.jpg",
        name: "KREPE + saladinha por + R$ 9,00 adicione a salada",
        price: 9,
        dsc: "Saladinha composta por rúcula, tomate cereja, palmito, cebola roxa, lascas de amêndoa, parmesão e azeite(acompanha molho mostarda e mel, ou de queijos) ",
        category: Enums.CATEGORIES.KREPE,
    },
	{
        id: 107,
        img: "./img/cardapio/krepes/krepepadrao.jpg",
        name: "KREPE Combo Frango",
        price: 25.90,
        dsc: "Grealhado + saladinha e batata chips artesanal (Acompanha molho mostarda mel ou de queijos)",
        category: Enums.CATEGORIES.KREPE,
    },
	{
        id: 108,
        img: "./img/cardapio/krepes/krepepadrao.jpg",
        name: "KREPE Combo Filé mignon",
        price: 29.90,
        dsc: "Grealhado + saladinha e batata chips artesanal (Acompanha molho mostarda mel ou de queijos)",
        category: Enums.CATEGORIES.KREPE,
    },
	{
        id: 109,
        img: "./img/cardapio/krepes/krepepadrao.jpg",
        name: "KREPE doce de leite artesanal (petit)",
        price: 19.90,
        dsc: "Doce de leite artesanal, queijo tostado, banana e canela ",
        category: Enums.CATEGORIES.KREPE,
    },
	{
        id: 110,
        img: "./img/cardapio/krepes/krepepadrao.jpg",
        name: "KREPE doce de leite artesanal (grand)",
        price: 24.90,
        dsc: "Doce de leite artesanal, queijo tostado, banana e canela ",
        category: Enums.CATEGORIES.KREPE,
    },
	
	{
        id: 111,
        img: "./img/cardapio/krepes/krepepadrao.jpg",
        name: "KREPE leite moça cremoso morango e leite ninho (petit)",
        price: 20.90,
        dsc: "Mussarela, blend de carne seca e costela desfiados no azeite, cheiro verde, orégano e catupiry(Acompanha batata chips artesanal) ",
        category: Enums.CATEGORIES.KREPE,
    },
	{
        id: 112,
        img: "./img/cardapio/krepes/krepepadrao.jpg",
        name: "KREPE leite moça cremoso morango e leite ninho (grand)",
        price: 25.90,
        dsc: "Mussarela, blend de carne seca e costela desfiados no azeite, cheiro verde, orégano e catupiry(Acompanha batata chips artesanal) ",
        category: Enums.CATEGORIES.KREPE,
    },
	
	{
        id: 113,
        img: "./img/cardapio/krepes/krepepadrao.jpg",
        name: "KREPE nutella (petit)",
        price: 19.90,
        dsc: "Nutella ",
        category: Enums.CATEGORIES.KREPE,
    },
	{
        id: 114,
        img: "./img/cardapio/krepes/krepepadrao.jpg",
        name: "KREPE nutella (grand)",
        price: 22.90,
        dsc: "Nutella ",
        category: Enums.CATEGORIES.KREPE,
    },
	{
        id: 115,
        img: "./img/cardapio/krepes/krepepadrao.jpg",
        name: "KREPE nutella com MM's (petit)",
        price: 20.90,
        dsc: "Nutella  com MM's",
        category: Enums.CATEGORIES.KREPE,
    },
	{
        id: 116,
        img: "./img/cardapio/krepes/krepepadrao.jpg",
        name: "KREPE nutella com MM's (grand)",
        price: 26.90,
        dsc: "Nutella com MM's",
        category: Enums.CATEGORIES.KREPE,
    },
	{
        id: 117,
        img: "./img/cardapio/krepes/krepepadrao.jpg",
        name: "KREPE nutella com morango (petit)",
        price: 20.90,
        dsc: "Nutella com morango",
        category: Enums.CATEGORIES.KREPE,
    },
	{
        id: 118,
        img: "./img/cardapio/krepes/krepepadrao.jpg",
        name: "KREPE nutella com morango (grand)",
        price: 25.90,
        dsc: "Nutella com morango ",
        category: Enums.CATEGORIES.KREPE,
    },

	{
        id: 119,
        img: "./img/cardapio/krepes/krepepadrao.jpg",
        name: "KREPE nutella com banana (petit)",
        price: 20.90,
        dsc: "Nutella e banana",
        category: Enums.CATEGORIES.KREPE,
    },
	{
        id: 120,
        img: "./img/cardapio/krepes/krepepadrao.jpg",
        name: "KREPE nutella com banana (grand)",
        price: 25.90,
        dsc: "Nutella e banana ",
        category: Enums.CATEGORIES.KREPE,
    },

	{
        id: 121,
        img: "./img/cardapio/krepes/krepepadrao.jpg",
        name: "KREPE nutella, morango, e kit kat (petit)",
        price: 22.90,
        dsc: "Nutella, morango e kit kat ",
        category: Enums.CATEGORIES.KREPE,
    },
	{
        id: 122,
        img: "./img/cardapio/krepes/krepepadrao.jpg",
        name: "KREPE nutella morango e kit kat (grand)",
        price: 27.90,
        dsc: "Nutella, morango e kit kat",
        category: Enums.CATEGORIES.KREPE,
    },

	{
        id: 123,
        img: "./img/cardapio/krepes/krepepadrao.jpg",
        name: "KREPE nutella  banana e kit kat (petit)",
        price: 22.90,
        dsc: "Nutella, banana  e kit kat  ",
        category: Enums.CATEGORIES.KREPE,
    },
	{
        id: 124,
        img: "./img/cardapio/krepes/krepepadrao.jpg",
        name: "KREPE nutella banana e kit kat (grand)",
        price: 27.90,
        dsc: "Nutella, banana e kit kat ",
        category: Enums.CATEGORIES.KREPE,
    },

	{
        id: 125,
        img: "./img/cardapio/krepes/krepepadrao.jpg",
        name: "KREPE nutella kinder e ninho (petit)",
        price: 23.90,
        dsc: "Nutella, kinder e ninho ",
        category: Enums.CATEGORIES.KREPE,
    },
	{
        id: 126,
        img: "./img/cardapio/krepes/krepepadrao.jpg",
        name: "KREPE nutella kinder e ninho (grand)",
        price: 27.90,
        dsc: "Nutella kinder e ninho",
        category: Enums.CATEGORIES.KREPE,
    },

	{
        id: 127,
        img: "./img/cardapio/krepes/krepepadrao.jpg",
        name: "KREPE nutella kinder bueno e morango (grand)",
        price: 30.90,
        dsc: "Nutella kinder bueno e morango ",
        category: Enums.CATEGORIES.KREPE,
    },
	{
        id: 128,
        img: "./img/cardapio/krepes/krepepalito.jpg",
        name: "KREPE no palito queijo e orégano",
        price: 12.90,
        dsc: "queijo e orégano",
        category: Enums.CATEGORIES.KREPE,
    },
	{
        id: 129,
        img: "./img/cardapio/krepes/krepepalito.jpg",
        name: "KREPE no palito presunto queijo e orégano",
        price: 12.90,
        dsc: "presunto, queijo e orégano",
        category: Enums.CATEGORIES.KREPE,
    },
	{
        id: 130,
        img: "./img/cardapio/krepes/krepepalito.jpg",
        name: "KREPE no palito salsicha, queijo e orégano",
        price: 12.90,
        dsc: "salsicha, queijo e orégano",
        category: Enums.CATEGORIES.KREPE,
    },
	{
        id: 131,
        img: "./img/cardapio/krepes/krepepalito.jpg",
        name: "KREPE no palito milho queijo e orégano",
        price: 12.90,
        dsc: "milho, queijo e orégano",
        category: Enums.CATEGORIES.KREPE,
    },
	{
        id: 132,
        img: "./img/cardapio/krepes/krepepalito.jpg",
        name: "KREPE no palito palmito queijo e orégano",
        price: 12.90,
        dsc: "palmito queijo  e orégano",
        category: Enums.CATEGORIES.KREPE,
    },
	{
        id: 133,
        img: "./img/cardapio/krepes/krepepalito.jpg",
        name: "KREPE no palito batom ao leite",
        price: 12.90,
        dsc: "batom ao leite",
        category: Enums.CATEGORIES.KREPE,
    },
	{
        id: 134,
        img: "./img/cardapio/krepes/krepepalito.jpg",
        name: "KREPE no palito batom branco",
        price: 12.90,
        dsc: "batom branco",
        category: Enums.CATEGORIES.KREPE,
    },
	{
        id: 135,
        img: "./img/cardapio/krepes/krepepalito.jpg",
        name: "KREPE no palito romeu e julieta",
        price: 12.90,
        dsc: "queijo com goiabada",
        category: Enums.CATEGORIES.KREPE,
    },
	{
        id: 136,
        img: "./img/cardapio/krepes/krepepalito.jpg",
        name: "KREPE no palito banana açucar e canela",
        price: 12.90,
        dsc: "banana açucar e canela",
        category: Enums.CATEGORIES.KREPE,
    },
	{
        id: 137,
        img: "./img/cardapio/krepes/krepepalito.jpg",
        name: "KREPE no palito duplo batom ao leite ",
        price: 14.90,
        dsc: "duplo batom ao leite",
        category: Enums.CATEGORIES.KREPE,
    },
	{
        id: 138,
        img: "./img/cardapio/krepes/krepepalito.jpg",
        name: "KREPE no palito duplo batom branco",
        price: 14.90,
        dsc: "",
        category: Enums.CATEGORIES.KREPE,
    },
	{
        id: 139,
        img: "./img/cardapio/krepes/krepepalito.jpg",
        name: "KREPE no palito casadinho",
        price: 14.90,
        dsc: "batom ao leite e batom branco",
        category: Enums.CATEGORIES.KREPE,
    },
	{
        id: 140,
        img: "./img/cardapio/krepes/krepepalito.jpg",
        name: "KREPE no palito prestígio",
        price: 14.90,
        dsc: "prestígio",
        category: Enums.CATEGORIES.KREPE,
    },
	{
        id: 141,
        img: "./img/cardapio/krepes/krepepalito.jpg",
        name: "KREPE no palito sensação nestlê",
        price: 14.90,
        dsc: "sensação nestlê",
        category: Enums.CATEGORIES.KREPE,
    },
	{
        id: 142,
        img: "./img/cardapio/krepes/krepepalito.jpg",
        name: "KREPE no palito bready nutella",
        price: 14.90,
        dsc: "bready nutella",
        category: Enums.CATEGORIES.KREPE,
    },
	{
        id: 143,
        img: "./img/cardapio/krepes/krepepalito.jpg",
        name: "KREPE no palito kids batom ao leite",
        price: 14.90,
        dsc: "batom ao leite MM's e confeitos",
        category: Enums.CATEGORIES.KREPE,
    },
	{
        id: 144,
        img: "./img/cardapio/krepes/krepepalito.jpg",
        name: "KREPE no palito kids batom branco",
        price: 14.90,
        dsc: "batom branco MM's e confeitos",
        category: Enums.CATEGORIES.KREPE,
    },
	{
        id: 145,
        img: "./img/cardapio/krepes/sorvetes.jpg",
        name: "sorvete jundiá diversos",
        price: 12,
        dsc: "diversos sabores preço unico pote e bomboni",
        category: Enums.CATEGORIES.KREPE,
    },
	{
        id: 146,
        img: "./img/cardapio/sushis/rollstradicionais.jpg",
        name: "COD 016",
        price: 49,
        dsc: "20 HOT ROLLS TRADICIONAIS",
        category: Enums.CATEGORIES.SUSHI,
    },
	{
        id: 147,
        img: "./img/cardapio/sushis/sushipadrao.jpg",
        name: "COD 027",
        price: 75,
        dsc: "15 SUSHIS A ESCOLHA DO CHEF",
        category: Enums.CATEGORIES.SUSHI,
    },
	{
        id: 148,
        img: "./img/cardapio/sushis/sushipadrao.jpg",
        name: "Combo Mini 01",
        price: 75,
        dsc: "15 SUSHIS A ESCOLHA DO CHEF, 10 CORTES DE SALMÃO",
        category: Enums.CATEGORIES.SUSHI,
    },
	{
        id: 149,
        img: "./img/cardapio/sushis/sushipadrao.jpg",
        name: "COD 033",
        price: 70,
        dsc: "15 SUSHIS A ESCOLHA DO CHEF, 10 HOT ROLLS DE COUVE FRITA (VEGETARIANO)",
        category: Enums.CATEGORIES.SUSHI,
    },
	{
        id: 150,
        img: "./img/cardapio//sushis/sushipadrao.jpg",
        name: "COD 034",
        price: 75,
        dsc: "15 SUSHIS A ESCOLHA DO CHEF, 10 HOT ROLLS TRADICIONAIS",
        category: Enums.CATEGORIES.SUSHI,
    },
	{
        id: 151,
        img: "./img/cardapio/sushis/sushipadrao.jpg",
        name: "COD 035",
        price: 75,
        dsc: "15 SUSHIS A ESCOLHA DO CHEF, 10 HOT ROLLS ESPECIAL",
        category: Enums.CATEGORIES.SUSHI,
    },
	{
        id: 152,
        img: "./img/cardapio/sushis/sushipadrao.jpg",
        name: "COD 036",
        price: 1059,
        dsc: "15 SUSHIS A ESCOLHA DO CHEF, 10 HOT ROLLS ESPECIAL, 10 HOT ROLLS DE COUVE FRITA(VEGETARIANO)",
        category: Enums.CATEGORIES.SUSHI,
    },
	{
        id: 153,
        img: "./img/cardapio/sushis/sushipadrao.jpg",
        name: "COD 037",
        price: 105,
        dsc: "15 SUSHIS A ESCOLHA DO CHEF, 10 HOT ROLLS TRADICIONAIS, HOT ROLLS ESPECIAL",
        category: Enums.CATEGORIES.SUSHI,
    },
	{
        id: 154,
        img: "./img/cardapio/sushis/sushipadrao.jpg",
        name: "COD 038",
        price: 120,
        dsc: "15 SUSHIS A ESCOLHA DO CHEF, 10 HOT ROLLS TRADICIONAIS, 10 HOT ROLLS ESPECIAL, 10 HOT ROLLS COUVE VEGETARIANO",
        category: Enums.CATEGORIES.SUSHI,
    },
	{
        id: 155,
        img: "./img/cardapio/sushis/sushipadrao.jpg",
        name: "COD 039",
        price: 125,
        dsc: "25 SUSHIS A ESCOLHA DO CHEF, 20 HOT ROLLS TRADICIONAIS",
        category: Enums.CATEGORIES.SUSHI,
    },
	{
        id: 156,
        img: "./img/cardapio/sushis/sushipadrao.jpg",
        name: "COD 040",
        price: 89,
        dsc: "2 TEMAKIS DE SALMÃO COMPLETO, 10 HOT ROLLS TRADICIONAL, 2 COCA COLA LATA",
        category: Enums.CATEGORIES.SUSHI,
    },
	{
        id: 157,
        img: "./img/cardapio/sushis/sushipadrao.jpg",
        name: "COD 041",
        price: 89,
        dsc: "15 SUSHIS A ESCOLHA DO CHEF, 2 ROLINHOS DE QUEIJO, 01 SUNOMONO 100 Gr, 01 CEVICHE 100 Gr",
        category: Enums.CATEGORIES.SUSHI,
    },
	{
        id: 158,
        img: "./img/cardapio/sushis/sushipadrao.jpg",
        name: "PROMOÇAO 95",
        price: 150,
        dsc: "25 SUSHIS A ESCOLHA DO CHEF, 04 ROLINHOS DE QUEIJO, 06 CORTES DE SALMÃO, 10 HOT ROLLS TRADICIONAIS, 02 TEMAKIS DE SALMÃO, CREAM CHEESE E CEBOLINHA",
        category: Enums.CATEGORIES.SUSHI,
    },
	{
        id: 159,
        img: "./img/cardapio/sushis/sushipadrao.jpg",
        name: "COMBO 04",
        price: 150,
        dsc: "25 SUSHIS A ESCOLHA DO CHEF, 01 SUNOMONO 100 Gr, 01 CEVICHE 100 Gr, 01 MINI ROLINHO DE QUEIJO, 06 CORTES DE SALMÃO, 10 HOT ROLLS TRADICIONAIS, 02 TEMAKIS DE SALMÃO, CREAM CHEESE E CEBOLINHA",
        category: Enums.CATEGORIES.SUSHI,
    },
	{
        id: 160,
        img: "./img/cardapio/sushis/sushipadrao.jpg",
        name: "COOMBO LOVE SALMÃO 01",
        price: 49,
        dsc: "05 JOYS DE SALMÃO COM CEBOLIHA E CREAM CHEESE,05 NIGUIRIS DE SALMÃO, 05 SUSHIS A ESCOLHA DO CHEF",
        category: Enums.CATEGORIES.SUSHI,
    },
	{
        id: 161,
        img: "./img/cardapio/sushis/sushipadrao.jpg",
        name: "COOMBO LOVE SALMÃO 02",
        price: 49,
        dsc: "05 JOYS DE SALMÃO COM CEBOLIHA E CREAM CHEESE,05 NIGUIRIS DE SALMÃO, 05 URAMAKIS PHILADÉLFIA (SALMÃO E CREAMCHEESE)",
        category: Enums.CATEGORIES.SUSHI,
    },
	{
        id: 162,
        img: "./img/cardapio/sushis/sushipadrao.jpg",
        name: "COOMBO LOVE SALMÃO 03",
        price: 55,
        dsc: "03 JOYS DE SALMÃO COM CEBOLIHA E CREAM CHEESE,03 NIGUIRIS DE SALMÃO FLAMBADOS, CREAM CHEESE, TARÊ E FURIKAKE, 03 URAMAKIS SALMÃO COMPLETO, 06 CORTES DE SASHIMI DE SALMÃO",
        category: Enums.CATEGORIES.SUSHI,
    },
	{
        id: 163,
        img: "./img/cardapio/sushis/sushipadrao.jpg",
        name: "COOMBO LOVE SALMÃO 04",
        price: 49,
        dsc: "04 JOYS DE SALMÃO COMPLETO,04 NIGUIRIS FLAMBADOS, CREAM CHEESE, TARÊ, FURIKAKE, 04 HOT ROLLS ESPECAIS, TARÊ E GERGILIN, 04 HOT ROLLS TRADICIONAIS, TARÊ E GERGILIN",
        category: Enums.CATEGORIES.SUSHI,
    },
	{
        id: 164,
        img: "./img/cardapio/sushis/sushipadrao.jpg",
        name: "COOMBO LOVE SALMÃO 05",
        price: 75,
        dsc: "04 JOYS DE SALMÃO CEBOLINHA E CREAM CHEESE,04 NIGUIRIS SALMÃO, 04 HOSSONAKIS DE SALMÃO, 04 SUSHIS A ESCOLHA DO CHEF, 04 URAMAKI DE SALMÃO COMPLETO,(SALMÃO, CEBOLINHA E CREAM CHEESE)",
        category: Enums.CATEGORIES.SUSHI,
    },
	{
        id: 165,
        img: "./img/cardapio/sushis/sushipadrao.jpg",
        name: "COOMBO LOVE SALMÃO 06",
        price: 75,
        dsc: "04 JOYS DE SALMÃO CEBOLINHA E CREAM CHEESE,04 NIGUIRIS SALMÃO, 04 CORTES DE SASHIMI DE SALMÃO,  04 HOSSONAKIS DE SALMÃO COM CREAM CHEESE, 03 URAMAKI PHILADELFIA(SALMÃO E CREAM CHEESE)",
        category: Enums.CATEGORIES.SUSHI,
    },
	{
        id: 166,
        img: "./img/cardapio/sushis/temaki.jpg",
        name: "TEMAKI DE SALMÃO (completo e frito por fora)",
        price: 39.90,
        dsc: "Dentro é salmão com cream cheese e cebolinha",
        category: Enums.CATEGORIES.SUSHI,
    },
	{
        id: 167,
        img: "./img/cardapio/sushis/hotnigiris.jpg",
        name: " 04 HOTS NIGIRIS RECHEADOS",
        price: 39.90,
        dsc: "SALMÃO CREAM CHEESE E FRITO",
        category: Enums.CATEGORIES.SUSHI,
    },
	{
        id: 168,
        img: "./img/cardapio/sushis/yakissoba.jpg",
        name: "YAKSSOBA CARNE",
        price: 0,
        dsc: "CARNE",
        category: Enums.CATEGORIES.SUSHI,
    },
	{
        id: 169,
        img: "./img/cardapio/sushis/yakissoba.jpg",
        name: "YAKSSOBA FRANGO",
        price: 0,
        dsc: "FRANGO",
        category: Enums.CATEGORIES.SUSHI,
    },
	{
        id: 170,
        img: "./img/cardapio/sushis/yakissoba.jpg",
        name: "YAKISSOBA MISTO",
        price: 0,
        dsc: "MISTO",
        category: Enums.CATEGORIES.SUSHI,
    },
	{
        id: 171,
        img: "./img/cardapio/sushis/yakissobavegetariano.jpg",
        name: "YAKISSOBA VEGETARIANO",
        price: 0,
        dsc: "VEGETARIANO",
        category: Enums.CATEGORIES.SUSHI,
    },
	/*
	{
        id: 172,
        img: "./img/cardapio/bebidas/antarctica.jpg",
        name: "CERVEJA ANTARCTICA BOA ",
        price: 11.90,
        dsc: "600 ML",
        category: Enums.CATEGORIES.BEBIDAS,
    },
	{
        id: 173,
        img: "./img/cardapio/bebidas/budweiser.jpg",
        name: "CERVEJA BUDWEISER ",
        price: 13.90,
        dsc: "600 ML",
        category: Enums.CATEGORIES.BEBIDAS,
    },
	{
        id: 174,
        img: "./img/cardapio/bebidas/original.jpg",
        name: "CERVEJA ORIGINAL ",
        price: 13.90,
        dsc: "600 ML",
        category: Enums.CATEGORIES.BEBIDAS,
    },
	{
        id: 175,
        img: "./img/cardapio/bebidas/spaten.jpg",
        name: "CERVEJA SPATEN ",
        price: 13.90,
        dsc: "600 ML",
        category: Enums.CATEGORIES.BEBIDAS,
    },
	{
        id: 176,
        img: "./img/cardapio/bebidas/stella.jpg",
        name: "CERVEJA STELLA ARTOIS ",
        price: 15.90,
        dsc: "600 ML",
        category: Enums.CATEGORIES.BEBIDAS,
    },
	{
        id: 177,
        img: "./img/cardapio/bebidas/budweiser.jpg",
        name: "LONG NECK BUDWEISER",
        price: 9.90,
        dsc: "",
        category: Enums.CATEGORIES.BEBIDAS,
    },
	{
        id: 178,
        img: "./img/cardapio/bebidas/spaten.jpg",
        name: "LONG NECK SPATEN",
        price: 9.90,
        dsc: "",
        category: Enums.CATEGORIES.BEBIDAS,
    },
	{
        id: 179,
        img: "./img/cardapio/bebidas/coronalong.jpg",
        name: "LONG NECK CORONA",
        price: 10.90,
        dsc: "",
        category: Enums.CATEGORIES.BEBIDAS,
    },
	{
        id: 180,
        img: "./img/cardapio/bebidas/malzbier.jpg",
        name: "LONG NECK MALZBIER BRHAMA",
        price: 10.90,
        dsc: "",
        category: Enums.CATEGORIES.BEBIDAS,
    },
	{
        id: 181,
        img: "./img/cardapio/bebidas/stella.jpg",
        name: "LONG NECK STELLA ARTOIS",
        price: 11.90,
        dsc: "",
        category: Enums.CATEGORIES.BEBIDAS,
    },
	{
        id: 182,
        img: "./img/cardapio/bebidas/longbecks.jpg",
        name: "LONG NECK BECKS",
        price: 11.90,
        dsc: "",
        category: Enums.CATEGORIES.BEBIDAS,
    },
	{
        id: 183,
        img: "./img/cardapio/bebidas/ice.jpg",
        name: "LONG NECK ICE",
        price: 12.90,
        dsc: "",
        category: Enums.CATEGORIES.BEBIDAS,
    },
	{
        id: 184,
        img: "./img/cardapio/bebidas/stempel.jpg",
        name: "CHOPP DE VINHO STEMPEL",
        price: 12.90,
        dsc: "",
        category: Enums.CATEGORIES.BEBIDAS,
    },
	{
        id: 185,
        img: "./img/cardapio/bebidas/choppbhrama.jpg",
        name: "CHOPP BRHAMA ",
        price: 8.90,
        dsc: "",
        category: Enums.CATEGORIES.BEBIDAS,
    },
	{
        id: 186,
        img: "./img/cardapio/bebidas/bebida-padrao.png",
        name: "REFRIGERANTES LATA",
        price: 5.90,
        dsc: "",
        category: Enums.CATEGORIES.BEBIDAS,
    },
	{
        id: 187,
        img: "./img/cardapio/bebidas/cocaumlitro.jpg",
        name: "COCA COLA 1 litro",
        price: 11.90,
        dsc: "1 LITRO",
        category: Enums.CATEGORIES.BEBIDAS,
    },
	{
        id: 188,
        img: "./img/cardapio/bebidas/h2oh.jpg",
        name: "REFRIGERANTES H2OH ",
        price: 7.90,
        dsc: "500ML",
        category: Enums.CATEGORIES.BEBIDAS,
    },
	{
        id: 189,
        img: "./img/cardapio/bebidas/schweppes.jpg",
        name: "REFRIGERANTES SCHWEPPES CITRUS LATA",
        price: 6.90,
        dsc: "",
        category: Enums.CATEGORIES.BEBIDAS,
    },
	{
        id: 190,
        img: "./img/cardapio/bebidas/tonicalata.jpg",
        name: "REFRIGERANTES TÕNICA LATA",
        price: 6.90,
        dsc: "",
        category: Enums.CATEGORIES.BEBIDAS,
    },
	{
        id: 191,
        img: "./img/cardapio/bebidas/agua.jpg",
        name: "ÁGUA SEM GÁS",
        price: 4,
        dsc: "500ML",
        category: Enums.CATEGORIES.BEBIDAS,
    },
	{
        id: 192,
        img: "./img/cardapio/bebidas/agua.jpg",
        name: "ÁGUA COM GÁS",
        price: 4,
        dsc: "500ML",
        category: Enums.CATEGORIES.BEBIDAS,
    },
	{
        id: 193,
        img: "./img/cardapio/bebidas/sucolaranjacopo.jpg",
        name: "SUCO LARANJA",
        price: 12.90,
        dsc: "COPO",
        category: Enums.CATEGORIES.BEBIDAS,
    },
	{
        id: 194,
        img: "./img/cardapio/bebidas/sucolaranjajarra.jpg",
        name: "SUCO LARANJA",
        price: 17.90,
        dsc: "JARRA",
        category: Enums.CATEGORIES.BEBIDAS,
    },
	{
        id: 195,
        img: "./img/cardapio/bebidas/sucolimaocopo.jpg",
        name: "SUCO LIMÃO",
        price: 12.90,
        dsc: "COPO",
        category: Enums.CATEGORIES.BEBIDAS,
    },
	{
        id: 196,
        img: "./img/cardapio/bebidas/sucolimaojarra.jpg",
        name: "SUCO LIMÃO",
        price: 17.90,
        dsc: "JARRA",
        category: Enums.CATEGORIES.BEBIDAS,
    },
	{
        id: 197,
        img: "./img/cardapio/bebidas/laranjacommorango.jpg",
        name: "SUCO LARANJA COM MORANGO",
        price: 14.90,
        dsc: "COPO",
        category: Enums.CATEGORIES.BEBIDAS,
    },
	{
        id: 198,
        img: "./img/cardapio/bebidas/laranjacommorangojarra.jpg",
        name: "SUCO LARANJA COM MORANGO",
        price: 22.90,
        dsc: "JARRA",
        category: Enums.CATEGORIES.BEBIDAS,
    },
	{
        id: 199,
        img: "./img/cardapio/bebidas/morangocomaguacopo.jpg",
        name: "SUCO MORANGO COM ÁGUA",
        price: 14.90,
        dsc: "COPO",
        category: Enums.CATEGORIES.BEBIDAS,
    },
	{
        id: 200,
        img: "./img/cardapio/bebidas/morangocomaguajarra.jpg",
        name: "SUCO  MORANGO COM ÁGUA",
        price: 22.90,
        dsc: "JARRA",
        category: Enums.CATEGORIES.BEBIDAS,
    },
	{
        id: 201,
        img: "./img/cardapio/bebidas/morangocomleitecopo.jpg",
        name: "SUCO MORANGO AO LEITE",
        price: 16.90,
        dsc: "COPO",
        category: Enums.CATEGORIES.BEBIDAS,
    },
	{
        id: 202,
        img: "./img/cardapio/bebidas/morangocomleitejarra.jpg",
        name: "SUCO MORANGO AO LEITE",
        price: 26.90,
        dsc: "JARRA",
        category: Enums.CATEGORIES.BEBIDAS,
    },
	{
        id: 203,
        img: "./img/cardapio/bebidas/ginfrutasvermelhas.jpg",
        name: "GIN FRUTAS VERMELHAS",
        price: 29.90,
        dsc: "XAROPE E MORANGO (com ou sem especiarias)",
        category: Enums.CATEGORIES.BEBIDAS,
    },
	{
        id: 204,
        img: "./img/cardapio/bebidas/gintropical.jpg",
        name: "GIN TROPICAL",
        price: 29.90,
        dsc: "XAROPE, ABACAXI E LARANJA (com ou sem especiarias)",
        category: Enums.CATEGORIES.BEBIDAS,
    },
	{
        id: 205,
        img: "./img/cardapio/bebidas/gintropical.jpg",
        name: "GIN CITRUS",
        price: 29.90,
        dsc: "XAROPE, ABACAXI E LIMÃO (com ou sem especiarias)",
        category: Enums.CATEGORIES.BEBIDAS,
    },
	{
        id: 206,
        img: "./img/cardapio/bebidas/monster.jpg",
        name: "ENERGÉTICOS MONSTER",
        price: 12.90,
        dsc: "",
        category: Enums.CATEGORIES.BEBIDAS,
    },
	{
        id: 207,
        img: "./img/cardapio/bebidas/caipirinhavodkalimao.jpg",
        name: "CAIPIRINHA VODKA LIMÃO",
        price: 20.90,
        dsc: "500 ML",
        category: Enums.CATEGORIES.BEBIDAS,
    },
	{
        id: 208,
        img: "./img/cardapio/bebidas/caipirinhavodkamorango.jpg",
        name: "CAIPIRINHA VODKA MORANGO",
        price: 20.90,
        dsc: "500 ML",
        category: Enums.CATEGORIES.BEBIDAS,
    },
	{
        id: 209,
        img: "./img/cardapio/bebidas/caipirinhavodkaabacaxi.jpg",
        name: "CAIPIRINHA VODKA ABACAXI",
        price: 20.90,
        dsc: "500 ML",
        category: Enums.CATEGORIES.BEBIDAS,
    },
	{
        id: 210,
        img: "./img/cardapio/bebidas/caipirinhavodkamaracuja.jpg",
        name: "CAIPIRINHA VODKA MARACUJÁ",
        price: 20.90,
        dsc: "500 ML",
        category: Enums.CATEGORIES.BEBIDAS,
    },
	{
        id: 211,
        img: "./img/cardapio/bebidas/caipirinhavodkauva.jpg",
        name: "CAIPIRINHA VODKA UVA",
        price: 20.90,
        dsc: "500 ML",
        category: Enums.CATEGORIES.BEBIDAS,
    },
	{
        id: 212,
        img: "./img/cardapio/burguers/imgpadrao.jpg",
        name: "CAIPIRINHA VINHO LIMÃO",
        price: 20.90,
        dsc: "500 ML",
        category: Enums.CATEGORIES.BEBIDAS,
    },
	{
        id: 213,
        img: "./img/cardapio/burguers/imgpadrao.jpg",
        name: "CAIPIRINHA VINHO MORANGO",
        price: 20.90,
        dsc: "500 ML",
        category: Enums.CATEGORIES.BEBIDAS,
    },
	{
        id: 214,
        img: "./img/cardapio/burguers/imgpadrao.jpg",
        name: "CAIPIRINHA VINHO ABACAXI",
        price: 20.90,
        dsc: "500 ML",
        category: Enums.CATEGORIES.BEBIDAS,
    },
	{
        id: 215,
        img: "./img/cardapio/burguers/imgpadrao.jpg",
        name: "CAIPIRINHA VINHO MARACUJÁ",
        price: 20.90,
        dsc: "500 ML",
        category: Enums.CATEGORIES.BEBIDAS,
    },
	{
        id: 216,
        img: "./img/cardapio/burguers/imgpadrao.jpg",
        name: "CAIPIRINHA VINHO UVA",
        price: 20.90,
        dsc: "500 ML",
        category: Enums.CATEGORIES.BEBIDAS,
    },
	{
        id: 217,
        img: "./img/cardapio/burguers/imgpadrao.jpg",
        name: "CAIPIRINHA WHISKY  LIMÃO",
        price: 20.90,
        dsc: "500 ML",
        category: Enums.CATEGORIES.BEBIDAS,
    },
	{
        id: 218,
        img: "./img/cardapio/burguers/imgpadrao.jpg",
        name: "CAIPIRINHA WHISKY MORANGO",
        price: 20.90,
        dsc: "500 ML",
        category: Enums.CATEGORIES.BEBIDAS,
    },
	{
        id: 219,
        img: "./img/cardapio/burguers/imgpadrao.jpg",
        name: "CAIPIRINHA WHISKY ABACAXI",
        price: 20.90,
        dsc: "500 ML",
        category: Enums.CATEGORIES.BEBIDAS,
    },
	{
        id: 220,
        img: "./img/cardapio/burguers/imgpadrao.jpg",
        name: "CAIPIRINHA WHISKY MARACUJÁ",
        price: 20.90,
        dsc: "500 ML",
        category: Enums.CATEGORIES.BEBIDAS,
    },
	{
        id: 221,
        img: "./img/cardapio/burguers/imgpadrao.jpg",
        name: "CAIPIRINHA WHISKY UVA",
        price: 20.90,
        dsc: "500 ML",
        category: Enums.CATEGORIES.BEBIDAS,
    },
	{
        id: 222,
        img: "./img/cardapio/burguers/imgpadrao.jpg",
        name: "CAIPIRINHA CACHAÇA  LIMÃO",
        price: 20.90,
        dsc: "500 ML",
        category: Enums.CATEGORIES.BEBIDAS,
    },
	{
        id: 223,
        img: "./img/cardapio/burguers/imgpadrao.jpg",
        name: "CAIPIRINHA CACHAÇA MORANGO",
        price: 20.90,
        dsc: "500 ML",
        category: Enums.CATEGORIES.BEBIDAS,
    },
	{
        id: 224,
        img: "./img/cardapio/burguers/imgpadrao.jpg",
        name: "CAIPIRINHA CACHAÇA ABACAXI",
        price: 20.90,
        dsc: "500 ML",
        category: Enums.CATEGORIES.BEBIDAS,
    },
	{
        id: 225,
        img: "./img/cardapio/burguers/imgpadrao.jpg",
        name: "CAIPIRINHA CACHAÇA MARACUJÁ",
        price: 20.90,
        dsc: "500 ML",
        category: Enums.CATEGORIES.BEBIDAS,
    },
	{
        id: 226,
        img: "./img/cardapio/burguers/imgpadrao.jpg",
        name: "CAIPIRINHA CACHAÇA UVA",
        price: 20.90,
        dsc: "500 ML",
        category: Enums.CATEGORIES.BEBIDAS,
    },
	{
        id: 227,
        img: "./img/cardapio/burguers/imgpadrao.jpg",
        name: "CAIPIRINHA SAQUÊ LIMÃO",
        price: 20.90,
        dsc: "500 ML",
        category: Enums.CATEGORIES.BEBIDAS,
    },
	{
        id: 228,
        img: "./img/cardapio/burguers/imgpadrao.jpg",
        name: "CAIPIRINHA SAQUÊ MORANGO",
        price: 20.90,
        dsc: "500 ML",
        category: Enums.CATEGORIES.BEBIDAS,
    },
	{
        id: 229,
        img: "./img/cardapio/burguers/imgpadrao.jpg",
        name: "CAIPIRINHA SAQUÊ ABACAXI",
        price: 20.90,
        dsc: "500 ML",
        category: Enums.CATEGORIES.BEBIDAS,
    },
	{
        id: 230,
        img: "./img/cardapio/burguers/imgpadrao.jpg",
        name: "CAIPIRINHA SAQUÊ MARACUJÁ",
        price: 20.90,
        dsc: "500 ML",
        category: Enums.CATEGORIES.BEBIDAS,
    },
	{
        id: 231,
        img: "./img/cardapio/burguers/imgpadrao.jpg",
        name: "CAIPIRINHA SAQUÊ UVA",
        price: 20.90,
        dsc: "500 ML",
        category: Enums.CATEGORIES.BEBIDAS,
    },
	{
        id: 232,
        img: "./img/cardapio/burguers/imgpadrao.jpg",
        name: "BATIDA VODKA ABACAXI",
        price: 20.90,
        dsc: "",
        category: Enums.CATEGORIES.BEBIDAS,
    },
	{
        id: 233,
        img: "./img/cardapio/burguers/imgpadrao.jpg",
        name: "BATIDA VODKA MORANGO",
        price: 20.90,
        dsc: "",
        category: Enums.CATEGORIES.BEBIDAS,
    },
	{
        id: 234,
        img: "./img/cardapio/burguers/imgpadrao.jpg",
        name: "BATIDA VODKA MARACUJÁ",
        price: 20.90,
        dsc: "",
        category: Enums.CATEGORIES.BEBIDAS,
    },
	{
        id: 235,
        img: "./img/cardapio/burguers/imgpadrao.jpg",
        name: "BATIDA VINHO ABACAXI",
        price: 20.90,
        dsc: "",
        category: Enums.CATEGORIES.BEBIDAS,
    },
	{
        id: 236,
        img: "./img/cardapio/burguers/imgpadrao.jpg",
        name: "BATIDA VINHO MORANGO",
        price: 20.90,
        dsc: "",
        category: Enums.CATEGORIES.BEBIDAS,
    },
	{
        id: 237,
        img: "./img/cardapio/burguers/imgpadrao.jpg",
        name: "BATIDA VINHO MARACUJÁ",
        price: 20.90,
        dsc: "",
        category: Enums.CATEGORIES.BEBIDAS,
    },
	{
        id: 238,
        img: "./img/cardapio/burguers/imgpadrao.jpg",
        name: "BIPOLAR",
        price: 24.90,
        dsc: "Batida de maracujá com vodka e vinho",
        category: Enums.CATEGORIES.BEBIDAS,
    },
	{
        id: 239,
        img: "./img/cardapio/burguers/imgpadrao.jpg",
        name: "MARGARITA",
        price: 24.90,
        dsc: "",
        category: Enums.CATEGORIES.BEBIDAS,
    },
	{
        id: 240,
        img: "./img/cardapio/bebidas/redlabel.jpg",
        name: "WHISKY RED LABEL",
        price: 14.90,
        dsc: "",
        category: Enums.CATEGORIES.BEBIDAS,
    },
	
	{
        id: 241,
        img: "./img/cardapio/bebidas/blacklabel.jpg",
        name: "WHISKY BLACK LABEL",
        price: 24.90,
        dsc: "",
        category: Enums.CATEGORIES.BEBIDAS,
    },
	{
        id: 242,
        img: "./img/cardapio/bebidas/jackdaniels.jpg",
        name: "WHISKY JACK DANIEL'S",
        price: 24.90,
        dsc: "",
        category: Enums.CATEGORIES.BEBIDAS,
    },
	{
        id: 243,
        img: "./img/cardapio/bebidas/jackdaniels.jpg",
        name: "WHISKY JACK DANIEL'S SABORES",
        price: 24.90,
        dsc: "",
        category: Enums.CATEGORIES.BEBIDAS,
    },
	{
        id: 244,
        img: "./img/cardapio/bebidas/campari.jpg",
        name: "CAMPARI",
        price: 16.90,
        dsc: "",
        category: Enums.CATEGORIES.BEBIDAS,
    },
	{
        id: 245,
        img: "./img/cardapio/burguers/imgpadrao.jpg",
        name: "TEQUILA JOSÉ CUERVO",
        price: 11.90,
        dsc: "",
        category: Enums.CATEGORIES.BEBIDAS,
    },
	{
        id: 246,
        img: "./img/cardapio/burguers/imgpadrao.jpg",
        name: "CACHAÇAS BESSI",
        price: 6.90,
        dsc: "",
        category: Enums.CATEGORIES.BEBIDAS,
    },

];
*/