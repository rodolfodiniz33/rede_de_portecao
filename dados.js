// dados.js
export const baseDeDados = {
    "servicos": [
        {
            "id": "cram-cg",
            "nome": "CRAM municipal / Coordenadoria da Mulher",
            "categoria": "Assistência social",
            "descricao": "Atendimento e orientação para mulheres em situação de violência.",
            "status": "aprovado",
            "dataVerificacao": "2026-10-21",
            "canais": [
                { "tipo": "telefone", "rotulo": "Telefone", "valor": "(83) 3310-6279" },
                { "tipo": "telefone", "rotulo": "WhatsApp", "valor": "(83) 98826-6906" },
                { "tipo": "email", "rotulo": "E-mail", "valor": "coordenadoriadamulher@gabinete.campinagrande.pb.gov.br" }
            ],
            "horario": "Seg. a sex., 08h-18h",
            "endereco": "Rua Capitão João Alves de Lira, 295, Prata",
            "observacao": "Fontes municipais consistentes.",
            "fonte": "Prefeitura de Campina Grande"
        },
        {
            "id": "deam-cg",
            "nome": "DEAM - Delegacia Especializada de Atendimento à Mulher",
            "categoria": "Delegacia",
            "descricao": "Registro de boletim de ocorrência e pedido de medidas protetivas de urgência.",
            "status": "aprovado",
            "dataVerificacao": "2026-10-21",
            "canais": [
                { "tipo": "telefone", "rotulo": "Telefone", "valor": "(83) 3310-9300" }
            ],
            "horario": "",
            "endereco": "",
            "observacao": "Endereço presencial omitido por divergência de fontes.",
            "fonte": "Coordenadoria da Mulher de Campina Grande"
        },
        {
            "id": "casa-abrigo",
            "nome": "Casa Abrigo municipal",
            "categoria": "Casa Abrigo",
            "sigiloso": true,
            "descricao": "Acolhimento para mulheres sob risco de morte e dependentes.",
            "status": "aprovado",
            "dataVerificacao": "2026-10-21",
            "canais": [
                { "tipo": "telefone", "rotulo": "Ligue 180 para orientações", "valor": "180" }
            ],
            "horario": "",
            "endereco": "",
            "observacao": "Acesso mediante encaminhamento institucional.",
            "fonte": "Coordenadoria da Mulher"
        },
        {
            "id": "ligue-180",
            "nome": "Ligue 180 — Central de Atendimento à Mulher",
            "categoria": "Orientação e denúncia",
            "descricao": "Orientação, acolhimento e denúncia.",
            "status": "aprovado",
            "dataVerificacao": "2026-10-21",
            "canais": [
                { "tipo": "telefone", "rotulo": "Telefone (gratuito)", "valor": "180" }
            ],
            "horario": "24h, todos os dias",
            "endereco": "",
            "observacao": "Gratuito, 24h todos os dias.",
            "fonte": "Ministério das Mulheres"
        },
        {
            "id": "policia-190",
            "nome": "190 — Polícia Militar",
            "categoria": "Emergência",
            "descricao": "Emergência que exige intervenção policial imediata.",
            "status": "aprovado",
            "dataVerificacao": "2026-10-21",
            "canais": [
                { "tipo": "telefone", "rotulo": "Telefone (gratuito)", "valor": "190" }
            ],
            "horario": "24h, todos os dias",
            "endereco": "",
            "observacao": "Utilize apenas para risco à vida.",
            "fonte": "Polícia Militar"
        }
    ]
};