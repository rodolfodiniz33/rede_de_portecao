// Módulo educativo de defesa pessoal e segurança.
// Todo conteúdo é renderizado via textContent. Nada é salvo no dispositivo.
import { criar, limpar } from './comum.js';

/**
 * Hosts autorizados para vídeos embutidos. VAZIO por padrão (privacidade por padrão):
 * enquanto estiver vazio, nenhum iframe é criado e nenhuma requisição externa é feita.
 * Para liberar vídeos no futuro: (1) adicione o host aqui, por exemplo 'www.youtube-nocookie.com';
 * (2) ajuste o frame-src na meta Content-Security-Policy de defesa_pessoal.html;
 * (3) preencha videoUrl da dica E revise o impacto na política de privacidade.
 */
const HOSTS_VIDEO_AUTORIZADOS = [];

/**
 * Dicas. ATENÇÃO: todo o conteúdo abaixo é RASCUNHO, sem revisão profissional.
 * Preencha fonteResponsavel (nome e função de quem revisou) e dataRevisao (AAAA-MM-DD)
 * somente após a revisão. Dicas sem esses campos aparecem como "Aguardando revisão".
 */
export const DICAS = [
    {
        id: 'plano-seguranca',
        categoria: 'Prevenção',
        titulo: 'Tenha um plano de segurança',
        resumo: 'Pensar antes ajuda a agir mais rápido se o risco aumentar.',
        passos: [
            'Escolha pelo menos uma pessoa de confiança que saiba da sua situação e combine uma palavra ou sinal para pedir ajuda.',
            'Saiba de cor os números 180 e 190.',
            'Pense em um lugar seguro para ir (casa de familiar, de amiga) e como chegar lá.',
            'Se puder, mantenha documentos, remédios e algum dinheiro em um local de acesso rápido e discreto.',
        ],
        videoUrl: null,
        fonteResponsavel: null,
        dataRevisao: null,
    },
    {
        id: 'risco-imediato',
        categoria: 'Em risco agora',
        titulo: 'Se há perigo imediato',
        resumo: 'Priorize sair e pedir ajuda. Evitar o confronto costuma ser mais seguro.',
        passos: [
            'Se conseguir, afaste-se do agressor e vá para um local com outras pessoas.',
            'Ligue 190 e diga onde você está. Se não puder falar, peça ajuda a alguém por perto.',
            'Evite cômodos com poucas saídas ou com objetos que possam ser usados para ferir.',
            'Depois, procure atendimento de saúde e registre a ocorrência na delegacia.',
        ],
        videoUrl: null,
        fonteResponsavel: null,
        dataRevisao: null,
    },
    {
        id: 'assedio-publico',
        categoria: 'Espaços públicos',
        titulo: 'Assédio na rua e no transporte',
        resumo: 'Você não é culpada. Afastar-se e buscar testemunhas é uma opção segura.',
        passos: [
            'Se puder, mude de lugar ou de vagão e aproxime-se de funcionários, motorista ou outras pessoas.',
            'Diga em voz firme e clara que o comportamento deve parar, se sentir segurança para isso.',
            'Anote o horário, o local e a linha do transporte. Isso ajuda em eventual denúncia.',
            'Você pode denunciar pelo 180 ou registrar ocorrência na delegacia.',
        ],
        videoUrl: null,
        fonteResponsavel: null,
        dataRevisao: null,
    },
    {
        id: 'seguranca-digital',
        categoria: 'Segurança digital',
        titulo: 'Cuidados com celular e redes sociais',
        resumo: 'Quem tem acesso ao seu aparelho ou contas pode ver suas conversas e sua localização.',
        passos: [
            'Troque senhas por outras que só você conheça e ative a verificação em duas etapas, quando possível.',
            'Revise quais aparelhos estão conectados às suas contas e quais apps usam sua localização.',
            'Desconfie de aplicativos que você não instalou.',
            'Ao guardar provas (prints, mensagens), lembre que o aparelho pode ser vistoriado. Veja a página Segurança.',
        ],
        videoUrl: null,
        fonteResponsavel: null,
        dataRevisao: null,
    },
    {
        id: 'tecnicas-fisicas',
        categoria: 'Técnicas físicas',
        titulo: 'Técnicas de autoproteção (em elaboração)',
        resumo: 'Movimentos de defesa precisam de demonstração e de revisão de profissional qualificada ou qualificado.',
        passos: [
            'Este bloco será preenchido com vídeos instrucionais produzidos ou revisados por instrutores habilitados.',
            'Enquanto isso, a orientação geral é fugir e pedir ajuda sempre que possível.',
        ],
        videoUrl: null,
        fonteResponsavel: null,
        dataRevisao: null,
    },
];

function formatarData(iso) {
    if (!/^\d{4}-\d{2}-\d{2}$/.test(iso ?? '')) return '';
    const [a, m, d] = iso.split('-').map(Number);
    return new Date(a, m - 1, d).toLocaleDateString('pt-BR', { day: '2-digit', month: 'long', year: 'numeric' });
}

/** Retorna um host autorizado ou null. Nunca aceita http, só https. */
function hostAutorizado(urlTexto) {
    try {
        const url = new URL(urlTexto);
        if (url.protocol !== 'https:') return null;
        return HOSTS_VIDEO_AUTORIZADOS.includes(url.hostname) ? url : null;
    } catch {
        return null;
    }
}

/** Cria o espaço de vídeo: capa temporária (padrão) ou iframe autorizado. */
export function criarEspacoVideo(dica) {
    const espaco = criar('figure', { classe: 'video-espaco' });

    const url = dica.videoUrl ? hostAutorizado(dica.videoUrl) : null;
    if (url) {
        const quadro = criar('iframe', {
            atributos: {
                src: url.href,
                title: `Vídeo: ${dica.titulo}`,
                loading: 'lazy',
                referrerpolicy: 'no-referrer',
                sandbox: 'allow-scripts allow-same-origin allow-presentation',
                allowfullscreen: '',
            },
        });
        espaco.append(quadro, criar('figcaption', { texto: `Vídeo: ${dica.titulo}`, classe: 'video-espaco__legenda' }));
        return espaco;
    }

    espaco.append(
        criar('img', {
            atributos: {
                src: 'img/video-capa.svg',
                width: '640',
                height: '360',
                alt: `Espaço reservado para o vídeo instrucional "${dica.titulo}". O vídeo ainda não está disponível.`,
            },
        }),
        criar('figcaption', { texto: 'Vídeo instrucional em breve', classe: 'video-espaco__legenda' }),
    );
    return espaco;
}

/** Cria o rodapé de revisão (RF-007): fonte/responsável e data. */
export function criarRevisao(dica) {
    const bloco = criar('p', { classe: 'revisao' });
    bloco.append(criar('strong', { texto: 'Fonte / Responsável pela revisão: ' }));
    if (dica.fonteResponsavel) {
        const data = formatarData(dica.dataRevisao);
        bloco.append(document.createTextNode(data ? `${dica.fonteResponsavel} (revisado em ${data})` : dica.fonteResponsavel));
    } else {
        bloco.append(document.createTextNode('Aguardando revisão. Conteúdo provisório, ainda não revisado por responsável.'));
    }
    return bloco;
}

export function criarCartaoDica(dica) {
    const titulo = criar('h3', { texto: dica.titulo });
    const card = criar('li', { classe: 'card' });
    card.append(criar('span', { texto: dica.categoria, classe: 'etiqueta' }));
    if (!dica.fonteResponsavel) {
        card.append(criar('span', { texto: 'Aguardando revisão', classe: 'etiqueta etiqueta--alerta' }));
    }
    card.append(titulo, criar('p', { texto: dica.resumo }), criarEspacoVideo(dica));

    const passos = criar('ol', { classe: 'passos' });
    for (const passo of dica.passos) passos.append(criar('li', { texto: passo }));
    card.append(passos, criarRevisao(dica));
    return card;
}

export function renderizarDicas(lista, dicas) {
    limpar(lista);
    for (const dica of dicas) lista.append(criarCartaoDica(dica));
}

export function filtrarPorCategoria(categoria) {
    return categoria ? DICAS.filter((d) => d.categoria === categoria) : DICAS;
}

function iniciar() {
    const lista = document.getElementById('lista-dicas');
    const select = document.getElementById('filtro-dicas');
    const status = document.getElementById('status-dicas');
    if (!lista || !select || !status) return;

    for (const nome of [...new Set(DICAS.map((d) => d.categoria))]) {
        select.append(criar('option', { texto: nome, atributos: { value: nome } }));
    }

    const atualizar = () => {
        const resultado = filtrarPorCategoria(select.value);
        renderizarDicas(lista, resultado);
        status.textContent = resultado.length === 1 ? '1 dica exibida.' : `${resultado.length} dicas exibidas.`;
    };
    select.addEventListener('change', atualizar);
    document.getElementById('form-dicas')?.addEventListener('submit', (e) => e.preventDefault());
    atualizar();
}

iniciar();