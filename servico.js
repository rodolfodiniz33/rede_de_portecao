// Detalhes do serviço: lê ?id= da URL, valida o formato e renderiza via textContent.
import { carregarServicos, criar, criarCanal, formatarData, limpar } from './comum.js';

const area = document.getElementById('detalhe');

function mensagem(titulo, texto) {
    limpar(area);
    area.append(criar('h1', { texto: titulo }), criar('p', { texto }));
    area.append(
        criar('a', { texto: 'Voltar ao catálogo', classe: 'botao', atributos: { href: 'catalogo.html' } }),
    );
    document.title = `${titulo} — Rede de Proteção`;
}

function linhaMeta(lista, rotulo, valor) {
    if (!valor) return;
    lista.append(criar('dt', { texto: rotulo }), criar('dd', { texto: valor }));
}

function renderizar(servico) {
    limpar(area);
    document.title = `${servico.nome} — Rede de Proteção`;

    area.append(
        criar('span', { texto: servico.categoria, classe: 'etiqueta' }),
        criar('h1', { texto: servico.nome }),
    );
    if (servico.descricao) area.append(criar('p', { texto: servico.descricao }));

    if (servico.sigiloso) {
        area.append(
            criar('div', { classe: 'aviso', atributos: { role: 'note' } }, [
                criar('p', {
                    texto:
                        'Por segurança, a localização deste serviço é sigilosa e não é divulgada neste site. O acesso é feito por encaminhamento da rede de atendimento.',
                }),
            ]),
        );
    }

    if (servico.canais.length > 0) {
        area.append(criar('h2', { texto: 'Canais de atendimento' }));
        const canais = criar('ul', { classe: 'lista-canais' });
        for (const canal of servico.canais) canais.append(criarCanal(canal));
        area.append(canais);
    }

    const meta = criar('dl', { classe: 'meta' });
    linhaMeta(meta, 'Horário', servico.horario);
    linhaMeta(meta, 'Endereço', servico.endereco);
    linhaMeta(meta, 'Observação', servico.observacao);
    linhaMeta(meta, 'Fonte', servico.fonte);

    meta.append(criar('dt', { texto: 'Última verificação' }));
    if (servico.dataVerificacao) {
        const dd = criar('dd');
        dd.append(
            criar('time', {
                texto: formatarData(servico.dataVerificacao),
                atributos: { datetime: servico.dataVerificacao },
            }),
        );
        meta.append(dd);
    } else {
        meta.append(
            criar('dd', {
                texto: 'Ainda não verificada. Confirme as informações por telefone antes de se deslocar.',
            }),
        );
    }

    area.append(criar('h2', { texto: 'Informações do serviço' }), meta);
}

async function iniciar() {
    const id = new URLSearchParams(window.location.search).get('id') ?? '';
    if (!/^[a-z0-9-]{1,80}$/.test(id)) {
        mensagem('Serviço não encontrado', 'O endereço acessado não corresponde a um serviço da lista.');
        return;
    }
    let servicos;
    try {
        servicos = await carregarServicos();
    } catch {
        mensagem(
            'Não foi possível carregar',
            'Tente novamente mais tarde. Se precisar de ajuda agora, ligue 180 (orientação) ou 190 (emergência).',
        );
        return;
    }
    const servico = servicos.find((s) => s.id === id);
    if (!servico) {
        mensagem('Serviço não encontrado', 'Este serviço não está na lista. Volte ao catálogo para ver os disponíveis.');
        return;
    }
    renderizar(servico);
}

iniciar();