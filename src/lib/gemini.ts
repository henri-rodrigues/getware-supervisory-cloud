/**
 * Service Integration for Google Gemini 2.5 Flash API
 * Generates automated SCADA telemetry reports and predictive maintenance insights.
 */

interface TelemetryDataSample {
  deviceName: string;
  tagName: string;
  currentValue: number | string | boolean;
  unit: string;
  status: string;
}

export async function generateGeminiSCADAReport(
  userPrompt: string,
  telemetryData: TelemetryDataSample[],
  activeAlarmsCount: number,
  apiKey?: string
): Promise<{ reportText: string; modelUsed: string }> {
  const modelName = 'gemini-2.5-flash';
  const effectiveApiKey = apiKey || import.meta.env.VITE_GEMINI_API_KEY || '';

  const systemContext = `Você é um Engenheiro de Automação sênior especialista em Sistemas Supervisórios SCADA, IoT Industrial e Manutenção Preditiva (Norma ISA-101).
Sua tarefa é analisar a telemetria fornecida abaixo e gerar um relatório técnico detalhado e claro em Markdown, atendendo com precisão à solicitação/prompt do usuário.

DADOS ATUAIS DA PLANTA SUPERVISÓRIA:
- Quantidade de Alarmes Ativos: ${activeAlarmsCount}
- Variáveis em Monitoramento (Tags):
${telemetryData.map(t => `  * [${t.deviceName}] ${t.tagName}: ${t.currentValue} ${t.unit} (Estado: ${t.status})`).join('\n')}

DIRETRIZES DE RESPOSTA:
1. Responda em Português do Brasil com linguagem técnica e profissional.
2. Use formatação Markdown (Títulos, tabelas, bullet points, caixas de destaque).
3. Forneça diagnósticos preditivos e sugestões de ação preventiva se encontrar valores críticos ou anomalias.
4. Responda especificamente ao que o usuário pediu no prompt.`;

  if (!effectiveApiKey) {
    // Return high quality simulated Gemini 2.5 Flash response when no key is set yet
    await new Promise((res) => setTimeout(res, 1200)); // Simulate AI streaming latency
    
    return {
      modelUsed: 'gemini-2.5-flash (Modo Demonstrativo)',
      reportText: `### 🤖 Relatório Técnico Supervisório - Google Gemini 2.5 Flash

**Prompt Analisado:** "${userPrompt}"
**Data da Análise:** ${new Date().toLocaleString('pt-BR')}

---

#### 📊 Resumo Executivo da Operação

Com base na telemetria capturada em tempo real de **${telemetryData.length} tags** industriais e no status de **${activeAlarmsCount} alarme(s) ativo(s)**, apresentamos o parecer técnico:

| Equipamento | Tag Monitorada | Valor Atual | Limite Crítico | Diagnóstico Preditivo |
| :--- | :--- | :--- | :--- | :--- |
${telemetryData.map(t => `| **${t.deviceName}** | ${t.tagName} | \`${t.currentValue} ${t.unit}\` | Setpoint HH/LL | ${t.status === 'CRITICAL_HH' ? '🚨 Alerta de Sobreaquecimento' : t.status === 'WARNING_H' ? '⚠️ Operação Próxima ao Limite' : '✅ Estável conforme ISA-101'} |`).join('\n')}

---

#### 💡 Diagnóstico Preditivo & Recomendações

1. **Eficiência Energética & Térmica:**
   - As variáveis monitoradas no protocolo Modbus TCP demonstram estabilidade térmica média.
   - Recomendamos verificar a calibração do sensor no dispositivo se a variação exceder ±5%.

2. **Ações Preventivas Recomendadas:**
   - [ ] Programar inspeção termográfica nos painéis elétricos antes do próximo ciclo de 30 dias.
   - [ ] Confirmar o recebimento das notificações via Telegram/WhatsApp junto aos operadores de turno.
   - [ ] Manter o plano de retenção de dados ativo para histórico de tendências.

> ℹ️ *Este relatório foi gerado automaticamente pelo modelo Gemini 2.5 Flash acoplado ao Getware Supervisory Cloud.*`
    };
  }

  try {
    const url = `https://generativelanguage.googleapis.com/v1beta/models/${modelName}:generateContent?key=${effectiveApiKey}`;
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: [
          {
            parts: [
              { text: systemContext },
              { text: `PROMPT DO USUÁRIO: ${userPrompt}` }
            ]
          }
        ]
      })
    });

    if (!response.ok) {
      throw new Error(`Erro na API Gemini: ${response.statusText}`);
    }

    const data = await response.json();
    const generatedText = data?.candidates?.[0]?.content?.parts?.[0]?.text || 'Nenhum resultado retornado pela IA.';

    return {
      modelUsed: modelName,
      reportText: generatedText
    };
  } catch (error) {
    console.error('Falha ao chamar a API Gemini 2.5 Flash:', error);
    return {
      modelUsed: `${modelName} (Fallback Mock)`,
      reportText: `⚠️ **Aviso de Conectividade com a API Gemini:**\nNão foi possível comunicar com a API do Gemini 2.5 Flash. Verifique sua chave de API nas configurações ou ambiente.\n\n*Prompt enviado:* "${userPrompt}"`
    };
  }
}
