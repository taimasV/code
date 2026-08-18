export type FlagDifficulty = 'easy' | 'medium' | 'hard' | 'all';

export type FlagQuestion = {
  answer: string;
  options: string[];
};

export type FlagLevel = {
  countries: string[];
  key: FlagDifficulty;
  label: string;
  optionCount: number;
  rounds: number;
};

function countryCodes(value: string) {
  return [...new Set(value.trim().split(/\s+/))];
}

const allCountries = countryCodes(`AF AL DZ AD AO AG AR AM AU AT AZ BS BH BD BB BY BE BZ BJ BT BO BA BW BR BN BG BF BI CV KH CM CA CF TD CL CN CO KM CG CD CR CI HR CU CY CZ DK DJ DM DO EC EG SV GQ ER EE SZ ET FJ FI FR GA GM GE DE GH GR GD GT GN GW GY HT HN HU IS IN ID IR IQ IE IL IT JM JP JO KZ KE KI KP KR KW KG LA LV LB LS LR LY LI LT LU MG MW MY MV ML MT MH MR MU MX FM MD MC MN ME MA MZ MM NA NR NP NL NZ NI NE NG MK NO OM PK PW PS PA PG PY PE PH PL PT QA RO RU RW KN LC VC WS SM ST SA SN RS SC SL SG SK SI SB SO ZA SS ES LK SD SR SE CH SY TW TJ TZ TH TL TG TO TT TN TR TM TV UG UA AE GB US UY UZ VU VA VE VN YE ZM ZW XK`);
const easyCountries = countryCodes(`US GB FR DE IT ES PT RU CN JP KR IN CA BR AR MX AU NZ TR EG ZA
  SA AE IL UA KZ GR SE NO CH NL PL`);
const mediumCountries = countryCodes(`AT BE DK FI IE IS CZ SK HU RO BG HR RS SI LT LV EE BY MD GE AM AZ
  UZ KG TJ TH VN ID MY SG PH PK BD IR IQ JO QA MA DZ TN NG KE ET GH CU CL CO PE VE UY EC CR PA DO JM
  KP SY TW RS BA AL MK CY LB KW OM`);
const familiarCountries = new Set([...easyCountries, ...mediumCountries]);
const hardCountries = allCountries.filter((code) => !familiarCountries.has(code));

export const FLAG_LEVELS: FlagLevel[] = [
  { countries: easyCountries, key: 'easy', label: 'Easy', optionCount: 4, rounds: 60 },
  { countries: mediumCountries, key: 'medium', label: 'Medium', optionCount: 4, rounds: 60 },
  { countries: hardCountries, key: 'hard', label: 'Hard', optionCount: 4, rounds: 60 },
  { countries: allCountries, key: 'all', label: 'All flags', optionCount: 4, rounds: 197 },
];

function shuffle<T>(items: T[]) {
  const copy = [...items];
  for (let index = copy.length - 1; index > 0; index -= 1) {
    const random = Math.floor(Math.random() * (index + 1));
    [copy[index], copy[random]] = [copy[random], copy[index]];
  }
  return copy;
}

export function flagImageUrl(code: string) {
  return `https://flagcdn.io/flags/4x3/${code.toLowerCase()}.svg`;
}

export function createFlagQuestions(level: FlagLevel) {
  const pool = level.countries;
  const answers: string[] = [];

  while (answers.length < level.rounds) {
    const batch = shuffle(pool);
    if (answers[answers.length - 1] === batch[0] && batch.length > 1) [batch[0], batch[1]] = [batch[1], batch[0]];
    answers.push(...batch.slice(0, level.rounds - answers.length));
  }

  return answers.map<FlagQuestion>((answer) => ({
    answer,
    options: shuffle([answer, ...shuffle(pool.filter((code) => code !== answer)).slice(0, level.optionCount - 1)]),
  }));
}
