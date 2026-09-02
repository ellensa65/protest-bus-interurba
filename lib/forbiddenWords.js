/**
 * Fitxer de configuració per al filtre de paraules ofensives / prohibides (Profanity Filter).
 * Conté una llista de termes en català i castellà, i funcions d'utilitat normalitzades.
 */

// Llista de paraules i expressions prohibides (en minúscules i preferiblement sense accents,
// ja que la funció de normalització elimina accents automàticament tant del text d'entrada com d'aquesta llista).
export const FORBIDDEN_WORDS = [
  // Català - Insults i paraules despectives
  'puta',
  'putes',
  'puto',
  'putos',
  'putassa',
  'fill de puta',
  'filla de puta',
  'fills de puta',
  'filles de puta',
  'cabro',
  'cabros',
  'cabrona',
  'cabrones',
  'gilipollas',
  'jilipollas',
  'gilipolles',
  'merda',
  'merdes',
  'cony',
  'follar',
  'follant',
  'follada',
  'subnormal',
  'subnormals',
  'imbecil',
  'imbecils',
  'marico',
  'maricons',
  'maricon',
  'maricones',
  'bastard',
  'bastards',
  'hostia',
  'ostia',
  'hosties',
  'osties',
  'tonto',
  'tonta',
  'tontos',
  'tontes',
  'mongol',
  'mongola',
  'mongols',
  'cap de suro',
  'cupaire',

  // Castellà - Insults i paraules despectives
  'hijo de puta',
  'hija de puta',
  'hijos de puta',
  'hijas de puta',
  'cabron',
  'cabrones',
  'cabrona',
  'cabronas',
  'mierda',
  'mierdas',
  'coño',
  'coños',
  'joder',
  'jodido',
  'jodida',
  'jodidos',
  'jodidas',
  'cojones',
  'cojon',
  'pendejo',
  'pendeja',
  'pendejos',
  'pendejas',
  'verga',
  'picha',
  'polla',
  'pollas',
  'chupa',
  'chupala',
  'chupamela',
  'perra',
  'perras',
  'putita',
  'putito',
  'bastardo',
  'bastardos',
  'zorra',
  'zorras',
  'malnacido',
  'malnacida'
];

/**
 * Normalitza un text convertint a minúscules, eliminant accents/diacrítics
 * i aplicant algunes substitucions comunes de caràcters (leetspeak bàsic).
 * 
 * @param {string} str 
 * @returns {string} Text normalitzat
 */
export function normalizeText(str) {
  if (!str || typeof str !== 'string') return '';

  return str
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '') // Elimina caràcters d'accent / diacrítics
    .replace(/[@]/g, 'a')
    .replace(/0/g, 'o')
    .replace(/1/g, 'i')
    .replace(/3/g, 'e')
    .replace(/\$/g, 's');
}

/**
 * Escapa caràcters especials de regex per evitar errors de sintaxi en expressions regulars.
 * 
 * @param {string} str 
 * @returns {string}
 */
function escapeRegExp(str) {
  return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

/**
 * Comprova si un text conté alguna de les paraules o frases prohibides.
 * És case-insensitive, ignora accents i té en compte valors repetits o substitutions bàsiques.
 * 
 * @param {string} text - El comentari o text a analitzar
 * @returns {boolean} true si conté contingut no permès, false si és net.
 */
export function hasForbiddenWords(text) {
  if (!text || typeof text !== 'string') return false;

  const normalized = normalizeText(text);
  if (!normalized.trim()) return false;

  // Versió reduint caràcters repetits (ex: "putaaaa" -> "puta")
  const normalizedDeduped = normalized.replace(/(.)\1{2,}/g, '$1');

  return FORBIDDEN_WORDS.some((word) => {
    const normWord = normalizeText(word);
    if (!normWord) return false;

    // Si és una frase compostes amb espais (ex: "fill de puta")
    if (normWord.includes(' ')) {
      return (
        normalized.includes(normWord) ||
        normalizedDeduped.includes(normWord)
      );
    }

    // Per a paraules individuals, utilitzem regex amb limits de paraula (\b)
    // per evitar falsos positius en paraules vàlides com "computadora" o "disputa".
    const regex = new RegExp(`\\b${escapeRegExp(normWord)}\\b`, 'i');
    return regex.test(normalized) || regex.test(normalizedDeduped);
  });
}

/**
 * Neteja el comentari. Si conté alguna paraula o expressió prohibida,
 * retorna null per evitar que es guardi el text a la base de dades.
 * En cas contrari, retorna el comentari retallat (trimmed).
 * 
 * @param {string} text - Comentari original
 * @returns {string|null} Comentari net o null si conté paraules ofensives
 */
export function cleanComment(text) {
  if (!text || typeof text !== 'string') return null;
  const trimmed = text.trim();
  if (!trimmed) return null;

  if (hasForbiddenWords(trimmed)) {
    return null;
  }

  return trimmed;
}
