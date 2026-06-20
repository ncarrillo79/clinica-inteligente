/**
 * NO-SHOW RISK SCORING — Sistema de pontuação heurística ponderada
 *
 * IMPORTANTE — O que este módulo É e o que NÃO É:
 *
 *   [HEURÍSTICA] Pesos definidos manualmente com base em literatura clínica
 *   e padrões observados em clínicas brasileiras. NÃO foram aprendidos de dados.
 *
 *   [MODELO REAL] Para substituir por regressão logística treinada:
 *   1. Exporte os documentos com `GET /api/appointments/dataset` (a implementar).
 *   2. Treine em Python com sklearn.linear_model.LogisticRegression.
 *   3. Substitua WEIGHTS e INTERCEPT pelos coeficientes aprendidos.
 *   4. O resto da função permanece igual.
 *
 * Score final: valor em [0, 1] — média ponderada de fatores normalizados.
 * Não usa sigmoid porque os fatores já estão em [0,1] e a soma dos pesos = 1.
 */

// --- Pesos heurísticos (somam 1.0) ---
// Fonte de referência: estudos de no-show ambulatorial (Dove et al., 2017;
// Dantas et al., 2018) e padrões observados em UBSs brasileiras.
const WEIGHTS = {
  noShowRate: 0.40, // [HEURÍSTICA] taxa histórica individual é o preditor mais forte
  leadTime:   0.25, // [HEURÍSTICA] mais dias de antecedência → mais chances de esquecer/desistir
  weather:    0.15, // [HEURÍSTICA] chuva reduz adesão, especialmente transporte público
  dayOfWeek:  0.10, // [HEURÍSTICA] segunda e sexta têm maior taxa de falta em ambulatórios
  hour:       0.10  // [HEURÍSTICA] horários extremos (muito cedo ou fim de tarde) = mais falta
}

// Mínimo de consultas anteriores para confiar na taxa histórica individual.
// Abaixo desse valor, usa um prior de população (fallback).
const MIN_HISTORY_FOR_RATE = 3

// [HEURÍSTICA] Baseline de no-show na população geral — 20% é referência comum
// em ambulatórios brasileiros (variação: 15-30% dependendo do contexto).
const POPULATION_NO_SHOW_BASELINE = 0.20

// [HEURÍSTICA] Dias da semana com maior taxa de falta (0=Dom, 1=Seg, ..., 6=Sáb)
const HIGH_RISK_DAYS = new Set([1, 5]) // segunda-feira e sexta-feira

// [HEURÍSTICA] Faixas de horário de maior risco
const EARLY_HOUR_CUTOFF = 8   // antes das 08h
const LATE_HOUR_CUTOFF  = 17  // a partir das 17h

/**
 * Calcula o fator de risco baseado na taxa histórica de no-show do paciente.
 * Se não há histórico suficiente, mistura a taxa observada com o baseline.
 *
 * [HEURÍSTICA] O blending (80% baseline / 20% observado) é uma forma simplificada
 * de suavização bayesiana. Um modelo real usaria Maximum A Posteriori com prior Beta.
 */
function noShowRateFactor(priorNoShows, totalAppointments) {
  if (totalAppointments >= MIN_HISTORY_FOR_RATE) {
    return priorNoShows / totalAppointments
  }
  const observed = totalAppointments > 0
    ? priorNoShows / totalAppointments
    : POPULATION_NO_SHOW_BASELINE
  // Blending: quanto menos histórico, mais peso no baseline populacional
  return 0.8 * POPULATION_NO_SHOW_BASELINE + 0.2 * observed
}

/**
 * Fator de antecedência: risco cresce linearmente até 30 dias, depois se estabiliza.
 * [HEURÍSTICA] O teto de 30 dias é arbitrário. Um modelo treinado pode descobrir
 * que o risco satura em outro ponto, ou que cresce de forma não-linear.
 */
function leadTimeFactor(leadTimeDays) {
  const capped = Math.max(0, Math.min(leadTimeDays, 30))
  return capped / 30
}

/**
 * Fator de dia da semana: binário (alto risco = 1.0, baixo risco = 0.0).
 * [HEURÍSTICA] Segunda e sexta-feira. Um modelo real usaria one-hot encoding
 * com 7 coeficientes independentes.
 */
function dayOfWeekFactor(dayOfWeek) {
  return HIGH_RISK_DAYS.has(dayOfWeek) ? 1.0 : 0.0
}

/**
 * Fator de horário: binário (horários extremos = 1.0, horário comercial = 0.0).
 * [HEURÍSTICA] Cortes em 08h e 17h. Um modelo real pode descobrir padrões
 * mais sutis (ex: 07h muito pior que 08h).
 */
function hourFactor(appointmentHour) {
  return (appointmentHour < EARLY_HOUR_CUTOFF || appointmentHour >= LATE_HOUR_CUTOFF)
    ? 1.0
    : 0.0
}

/**
 * Mapeia o score numérico [0, 1] para um nível de risco categórico.
 * Limiares [HEURÍSTICOS] — devem ser recalibrados após acumular dados reais
 * usando precision-recall tradeoff conforme o custo de falsos positivos da clínica.
 */
function scoreToRiskLevel(score) {
  if (score < 0.33) return 'LOW'
  if (score < 0.66) return 'MEDIUM'
  return 'HIGH'
}

/**
 * Função principal. Recebe as features de uma consulta e retorna score + nível.
 *
 * @param {Object} features
 * @param {number} features.patientPriorNoShows
 * @param {number} features.patientTotalAppointments
 * @param {number} features.leadTimeDays
 * @param {number|null} features.weatherRainProbability — pop do OpenWeather (0-1), ou null
 * @param {number} features.dayOfWeek — 0 (Dom) a 6 (Sáb)
 * @param {number} features.appointmentHour — 0 a 23
 * @returns {{ noShowRisk: number, riskLevel: 'LOW'|'MEDIUM'|'HIGH' }}
 */
function computeNoShowRisk(features) {
  const {
    patientPriorNoShows,
    patientTotalAppointments,
    leadTimeDays,
    weatherRainProbability,
    dayOfWeek,
    appointmentHour
  } = features

  const factors = {
    noShowRate: noShowRateFactor(patientPriorNoShows, patientTotalAppointments),
    leadTime:   leadTimeFactor(leadTimeDays ?? 0),
    weather:    weatherRainProbability ?? 0, // null = assume sem chuva (conservador)
    dayOfWeek:  dayOfWeekFactor(dayOfWeek ?? 0),
    hour:       hourFactor(appointmentHour ?? 9)
  }

  const score =
    WEIGHTS.noShowRate * factors.noShowRate +
    WEIGHTS.leadTime   * factors.leadTime   +
    WEIGHTS.weather    * factors.weather    +
    WEIGHTS.dayOfWeek  * factors.dayOfWeek  +
    WEIGHTS.hour       * factors.hour

  // Arredonda para 4 casas decimais para evitar floating-point noise
  const noShowRisk = Math.round(score * 10000) / 10000

  return {
    noShowRisk,
    riskLevel: scoreToRiskLevel(noShowRisk)
  }
}

module.exports = { computeNoShowRisk }