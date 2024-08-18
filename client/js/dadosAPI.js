import { Enums } from './enums.js';

//const Enums = await Enums.getEnums();
export let MENU = [];

// Função para obter os produtos da API
async function obterProdutos() {
    try {
        const response = await fetch('http://localhost:3000/produtos');
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
// Função para criar o menu com base nos produtos e categorias
async function criarMenu() {
    try {
        const categoriasMap = await Enums.getCATEGORIES(); // Aguarda obter as categorias
        console.log('Categorias carregadas:', categoriasMap);

        if (!categoriasMap || Object.keys(categoriasMap).length === 0) {
            throw new Error('Categorias não carregadas ou estão vazias.');
        }

        const produtos = await obterProdutos();
        console.log('Produtos carregados:', produtos);

        MENU = produtos.map(produto => {
            // Encontre a chave da categoria com base no id
            const categoriaKey = Object.keys(categoriasMap).find(key => categoriasMap[key].id === produto.idcategoria.toString());
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

        console.log('MENU:', MENU);
    } catch (error) {
        console.error('Erro ao criar o menu:', error);
    }
}

// Chama a função para criar o menu
criarMenu();