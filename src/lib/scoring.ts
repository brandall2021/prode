export type ScoreLike = { homeScore: number; awayScore: number };

/**
 * Reglas:
 *  - 3 puntos: resultado exacto
 *  - 1 punto: acertó el ganador o empate
 *  - 0 puntos: falló
 */
export function calculatePoints(pick: ScoreLike, result: ScoreLike): number {
  if (pick.homeScore === result.homeScore && pick.awayScore === result.awayScore) {
    return 3;
  }
  const pickOutcome = Math.sign(pick.homeScore - pick.awayScore);
  const realOutcome = Math.sign(result.homeScore - result.awayScore);
  if (pickOutcome === realOutcome) return 1;
  return 0;
}
