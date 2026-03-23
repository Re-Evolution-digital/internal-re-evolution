# Política de Segurança — Re-Evolution, Serviços Digitais

## Âmbito
Este documento aplica-se ao website re-evolution.pt e APIs associadas.

## Reporte de Vulnerabilidades
Email: geral@re-evolution.pt
Assunto: [SECURITY] descrição breve
Resposta: até 72 horas

## Medidas Implementadas
- HTTPS forçado (Cloudflare)
- Security headers completos (CSP, HSTS, X-Frame-Options)
- Rate limiting nas APIs
- Validação e sanitização de inputs (zod)
- Honeypot anti-spam nos formulários
- Sem dados sensíveis em logs
- Backups automáticos Cloudflare

## Boas Práticas (referência NIS2)
Embora não seja entidade essencial nos termos da Diretiva NIS2,
a Re-Evolution adopta boas práticas recomendadas: gestão de incidentes,
continuidade de serviço, segurança da cadeia de fornecimento e
formação de segurança.

## Responsável
Carlos Vale — geral@re-evolution.pt
Última atualização: 2026
