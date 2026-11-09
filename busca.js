// busca.js
import { carregarServicos, criar, limpar, normalizar } from './comum.js';

const campoNome = document.getElementById('busca-nome');
const selectCategoria = document.getElementById('filtro-categoria');
const lista = document.getElementById('lista-servicos');
const status = document.getElementById('status-busca');
const formulario = document.getElementById('form-filtros');

let servicos = [];

function resumo(texto, max = 160) {
    if (texto.length <= max) return texto;
    return `${texto.slice(0, max).trimEnd()}…`;
}

function criarCard(servico) {
    const titulo = criar('h2', { texto: servico.nome, classe: 'card__titulo' });

    const card = criar('li', { classe: 'card' });
    card.append(
        criar('span', { texto: servico.categoria, classe: 'etiqueta' }),
        titulo,
        criar('p', { texto: resumo(servico.descricao) }),
    );

    const link = criar('a', {
        texto: 'Ver detalhes',
        classe: 'botao',
        atributos: {
            href: `servico.html?id=${encodeURIComponent(servico.id)}`,
            'aria-label': `Ver detalhes de ${servico.nome}`,
        },
    });
    card.append(link);
    return card;
}

function filtrar() {
    const termo = normalizar(campoNome.value);
    const categoria = selectCategoria.value;

    const resultado = servicos.filter((s) => {
        const okNome = !termo || normalizar(s.nome).includes(termo);
        const okCategoria = !categoria || s.categoria === categoria;
        return okNome && okCategoria;
    });

    limpar(lista);
    for (const servico of resultado) lista.append(criarCard(servico));

    status.textContent =
        resultado.length === 0
            ? 'Nenhum serviço encontrado. Tente outro nome ou escolha "Todas as categorias".'
            : resultado.length === 1
                ? '1 serviço encontrado.'
                : `${resultado.length} serviços encontrados.`;
}

function preencherCategorias() {
    const categorias = [...new Set(servicos.map((s) => s.categoria))].sort((a, b) =>
        a.localeCompare(b, 'pt-BR'),
    );
    for (const nome of categorias) {
        selectCategoria.append(criar('option', { texto: nome, atributos: { value: nome } }));
    }
}

async function iniciar() {
    status.textContent = 'Carregando serviços…';
    try {
        servicos = await carregarServicos();
    } catch (erro) {
        console.error(erro); // Joga o erro no F12 para debug
        status.textContent =
            'Não foi possível carregar a lista de serviços. Em caso de necessidade, ligue 180 (orientação) ou 190 (emergência).';
        return;
    }
    preencherCategorias();
    filtrar();
}

formulario.addEventListener('submit', (evento) => {
    evento.preventDefault();
    filtrar();
});
campoNome.addEventListener('input', filtrar);
selectCategoria.addEventListener('change', filtrar);

iniciar();
// Adicione no final de busca.js para testar:
setTimeout(async () => {
    console.log("=== TESTE DE DADOS ===");
    console.log("1. Serviços validados no front-end:", servicos);

    const resposta = await fetch('servicos.json');
    const dados = await resposta.json();
    console.log("2. O que o JSON está entregando de verdade:", dados);
}, 1000);