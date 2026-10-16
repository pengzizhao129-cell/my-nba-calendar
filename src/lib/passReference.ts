/** Metadata required to resolve a printed reference for an issued personal pass. */
export type PassReferenceInput = {
 readonly passId: string | null;
 readonly teamCode: string;
 readonly opponentCode: string;
 readonly gameId: string;
 readonly gameNumber: number | null;
 readonly seasonCode: string;
 readonly seasonId?: string;
 readonly countryCode: string;
 readonly cityCode: string;
};

export type PassReference = {
 readonly full: string;
 readonly short: string;
 readonly coordinate: string;
 readonly serial: string;
 readonly seasonPrefix: string;
};

const isCode = (value: unknown, length: number): value is string =>
 typeof value === 'string' && new RegExp(`^[A-Z]{${length}}$`).test(value);

/**
 * Deterministic local mock issuer, not a global uniqueness or authenticity service.
 * The five-digit space can collide. Location is deliberately absent: moving a
 * personal event pass changes its coordinate, never its local issue serial.
 */
function mockLocalSerial(input: PassReferenceInput, seasonCode: string): string {
 const key = JSON.stringify([input.passId, input.teamCode, input.gameId, input.seasonId ?? seasonCode]);
 let hash = 2166136261;
 for (const character of key) hash = Math.imul(hash ^ character.charCodeAt(0), 16777619) >>> 0;
 return String(hash % 100000).padStart(5, '0');
}

/** Missing issuance, event ordinal, or coordinate metadata must remain a preview. */
export function resolvePassReference(input: PassReferenceInput): PassReference | null {
 if (!input || typeof input.passId !== 'string' || !/^\d{4}$/.test(input.passId)) return null;
 if (!isCode(input.teamCode, 3) || !isCode(input.opponentCode, 3) || input.teamCode === input.opponentCode) return null;
 if (!isCode(input.countryCode, 2) || !isCode(input.cityCode, 3)) return null;
 if (typeof input.gameId !== 'string' || !input.gameId.trim()) return null;
 if (input.seasonId !== undefined && (typeof input.seasonId !== 'string' || !input.seasonId.trim())) return null;
 if (!Number.isInteger(input.gameNumber) || input.gameNumber === null || input.gameNumber < 1 || input.gameNumber > 999) return null;

 const season = typeof input.seasonCode === 'string' ? /^(\d{2})[–-](\d{2})$/.exec(input.seasonCode) : null;
 if (!season || (Number(season[1]) + 1) % 100 !== Number(season[2])) return null;

 const seasonPrefix = `MG${season[1]}`;
 const ordinal = String(input.gameNumber).padStart(3, '0');
 const short = `${input.teamCode}-${input.opponentCode}.${ordinal}`;
 const coordinate = `${input.cityCode} / ${input.countryCode}`;
 const serial = mockLocalSerial(input, `${season[1]}-${season[2]}`);
 const full = `${seasonPrefix}-${input.teamCode}-${input.opponentCode}-${ordinal}-${input.countryCode}${input.cityCode}-${serial}`;
 return { full, short, coordinate, serial, seasonPrefix };
}
