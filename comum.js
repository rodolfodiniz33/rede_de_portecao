// comum.js
import { baseDeDados } from './dados.js';

const CAMPOS_PERMITIDOS = [
    'id', 'nome', 'categoria', 'descricao', 'canais', 'horario',
    'endereco', 'observacao', 'fonte', 'dataVerificacao', 'sigiloso', 'status'
];

const TIPOS_CANAL = ['telefone', 'site', 'email', 'texto'];

const PADRAO_ENDERECO =
    /\b(rua|r\.|avenida|av\.|travessa|tv\.|alameda|rodovia|br-?\d+|bairro|cep|n[º°o]\s*\d+|km\s*\d+)\b|\b\d{5}-?\d{3}\b|maps\.|google\.[a-z.]+\/maps|goo\.gl\/maps|waze|openstreetmap|geo:|lat(itude)?\s*[:=]|lng|long(itude)?\s*[:=]/i;

export function normalizar(texto) {
    return String(texto ?? '')
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .toLowerCase()
        .trim();
}

function textoSeguro(valor, max = 1200) {
    return typeof valor === 'string' ? valor.trim().slice(0, max) : '';
}

function ehCasaAbrigo(bruto) {
    if (bruto && bruto.sigiloso === true) return true;
    const marcador = normalizar(`${bruto?.categoria ?? ''} ${bruto?.nome ?? ''} ${bruto?.id ?? ''}`);
    return /casa[\s-]*abrigo/.test(marcador);
}

function validarCanal(canal, sigiloso) {
    if (!canal || typeof canal !== 'object') return null;
    if (!TIPOS_CANAL.includes(canal.tipo)) return null;

    const rotulo = textoSeguro(canal.rotulo, 120);
    let valor = textoSeguro(canal.valor, 300);
    if (!rotulo || !valor) return null;

    if (canal.tipo === 'telefone') {
        valor = valor.replace(/[^\d+()\s-]/g, '');
        if (!/\d{3,}/.test(valor)) return null;
    } else if (canal.tipo === 'site') {
        if (!/^https:\/\/[^\s]+$/i.test(valor)) return null;
    } else if (canal.tipo === 'email') {
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(valor)) return null;
    }

    if (sigiloso) {
        if (canal.tipo === 'site' || canal.tipo === 'email') return null;
        if (PADRAO_ENDERECO.test(valor) || PADRAO_ENDERECO.test(rotulo)) return null;
    }
    return { tipo: canal.tipo, rotulo, valor };
}

export function validarServico(bruto) {
    if (!bruto || typeof bruto !== 'object' || Array.isArray(bruto)) return null;

    const limpo = {};
    for (const campo of CAMPOS_PERMITIDOS) {
        if (campo in bruto) limpo[campo] = bruto[campo];
    }

    const fonte = textoSeguro(limpo.fonte, 300);
    const dataVerificacao = /^\d{4}-\d{2}-\d{2}$/.test(limpo.dataVerificacao ?? '') ? limpo.dataVerificacao : null;
    const status = textoSeguro(limpo.status).toLowerCase();

    // Trava de segurança do PRD
    if (!fonte || !dataVerificacao || status !== 'aprovado') {
        return null;
    }

    const id = textoSeguro(limpo.id, 80);
    const nome = textoSeguro(limpo.nome, 160);
    if (!/^[a-z0-9-]+$/.test(id) || !nome) return null;

    const sigiloso = ehCasaAbrigo(bruto);

    const servico = {
        id,
        nome,
        categoria: textoSeguro(limpo.categoria, 80) || 'Outros',
        descricao: textoSeguro(limpo.descricao),
        horario: textoSeguro(limpo.horario, 200),
        observacao: textoSeguro(limpo.observacao),
        fonte,
        dataVerificacao,
        sigiloso,
        status,
        canais: Array.isArray(limpo.canais)
            ? limpo.canais.map((c) => validarCanal(c, sigiloso)).filter(Boolean)
            : [],
        endereco: '',
    };

    if (!sigiloso) servico.endereco = textoSeguro(limpo.endereco, 300);

    if (sigiloso) {
        for (const campo of ['descricao', 'observacao', 'horario']) {
            if (PADRAO_ENDERECO.test(servico[campo])) servico[campo] = '';
        }
    }
    return servico;
}

// NOVA FUNÇÃO CARREGAR: Puxa direto do dados.js, sem erro de rede.
export async function carregarServicos() {
    const lista = baseDeDados.servicos;
    const vistos = new Set();
    return lista
        .map(validarServico)
        .filter((s) => s && !vistos.has(s.id) && vistos.add(s.id));
}

export function criar(tag, { texto, classe, atributos } = {}, filhos = []) {
    const no = document.createElement(tag);
    if (classe) no.className = classe;
    if (texto !== undefined) no.textContent = texto;
    if (atributos) {
        for (const [chave, valor] of Object.entries(atributos)) no.setAttribute(chave, valor);
    }
    for (const filho of filhos) no.append(filho);
    return no;
}

export function limpar(no) {
    while (no.firstChild) no.removeChild(no.firstChild);
}

export function formatarData(iso) {
    if (!iso) return '';
    const [a, m, d] = iso.split('-').map(Number);
    return new Date(a, m - 1, d).toLocaleDateString('pt-BR', { day: '2-digit', month: 'long', year: 'numeric' });
}

export function criarCanal(canal) {
    const item = criar('li');
    item.append(criar('strong', { texto: `${canal.rotulo}: ` }));

    if (canal.tipo === 'telefone') {
        const digitos = canal.valor.replace(/[^\d+]/g, '');
        item.append(
            criar('a', {
                texto: canal.valor,
                classe: 'botao botao--secundario',
                atributos: { href: `tel:${digitos}`, 'aria-label': `Ligar para ${canal.rotulo}: ${canal.valor}` },
            }),
        );
    } else if (canal.tipo === 'email') {
        item.append(criar('a', { texto: canal.valor, atributos: { href: `mailto:${canal.valor}` } }));
    } else if (canal.tipo === 'site') {
        item.append(
            criar('a', {
                texto: canal.valor,
                atributos: { href: canal.valor, rel: 'noopener noreferrer', target: '_blank' },
            }),
        );
        item.append(criar('span', { texto: ' (abre em nova aba)', classe: 'sr-only' }));
    } else {
        item.append(document.createTextNode(canal.valor));
    }
    return item;
}

function configurarSaidaRapida() {
    const botao = document.getElementById('saida-rapida');
    if (!botao) return;
    botao.addEventListener('click', (evento) => {
        evento.preventDefault();
        window.location.replace('https://www.google.com.br/');
    });
}

configurarSaidaRapida();