import type { Language } from './LanguageContext';
import { gameRulesEn } from './rules/en';
import { gameRulesFr } from './rules/fr';
import { gameRulesKk } from './rules/kk';
import { gameRulesRu } from './rules/ru';

export type GameRulesDictionary = Record<string, string[]>;

const dictionaries: Record<Language, GameRulesDictionary> = {
  en: gameRulesEn,
  ru: gameRulesRu,
  kk: gameRulesKk,
  fr: gameRulesFr,
};

export function getGameRules(gameNumber: string, language: Language) {
  return dictionaries[language][gameNumber] ?? dictionaries.en[gameNumber] ?? [];
}
