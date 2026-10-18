import type { ContactKind, Localized, SiteMeta, YearMonth } from "./types";
import type { SkillId } from "./skills";

export const person = {
  name: "Guilherme Barbosa",
  givenName: "Guilherme",
  familyName: "Barbosa",
  email: "gbarbosaa.021@gmail.com",
  githubUser: "guilhermebarbosa03",
  city: "Salvador",
  region: "BA",
  country: "BR",
} as const;

export const githubUrl = `https://github.com/${person.githubUser}`;
export const linkedinUrl = "https://www.linkedin.com/in/guilherme-s-67a87b245/";

export const role: Localized = {
  pt: "Software, Dados e IA",
  en: "AI & Machine Learning Developer",
};

export const tagline: Localized = {
  pt: "Ciência da Computação · UFBA · Salvador, BA",
  en: "Computer Science · UFBA · Salvador, Brazil",
};

export const summary: Localized<string[]> = {
  pt: [
    "Sou estudante de Ciência da Computação na UFBA e desenvolvo soluções de Inteligência Artificial e Machine Learning. Trabalho com visão computacional, engenharia de dados, automação e web scraping, da coleta e limpeza dos dados até o treinamento de redes neurais.",
    "Na iniciação científica com a Prefeitura de Salvador, construo um sistema que prevê deslizamentos de terra. Também desenvolvi um app mobile para a Petrobras e ferramentas desktop para geotecnia. Tenho inglês avançado.",
  ],
  en: [
    "I'm a Computer Science student at the Federal University of Bahia (UFBA) and I build Artificial Intelligence and Machine Learning solutions. I work with computer vision, data engineering, automation and web scraping, from collecting and cleaning data to training neural networks.",
    "In my research project with Salvador City Hall, I'm building a system that predicts landslides. I've also built a mobile app for Petrobras and desktop tools for geotechnical engineering. I speak advanced English.",
  ],
};

/** Main stack shown in the intro. */
export const coreStack: SkillId[] = [
  "python",
  "tensorflow",
  "xgboost",
  "opencv",
  "pandas",
  "reactNative",
  "typescript",
  "awsLambda",
];

/** Hero stats. */
export const statLabels = {
  experience: { pt: "anos de experiência", en: "years of experience" },
  projects: { pt: "projetos", en: "projects" },
  graduation: { pt: "formatura prevista", en: "expected graduation" },
} satisfies Record<string, Localized>;

/** Professional experience started in Aug 2024. */
export const yearsOfExperience = "2+";

export const contacts: { kind: ContactKind; label: Localized; value: Localized; href?: string }[] = [
  {
    kind: "email",
    label: { pt: "E-mail", en: "Email" },
    value: { pt: person.email, en: person.email },
  },
  {
    kind: "github",
    label: { pt: "GitHub", en: "GitHub" },
    value: { pt: `github.com/${person.githubUser}`, en: `github.com/${person.githubUser}` },
    href: githubUrl,
  },
  {
    kind: "linkedin",
    label: { pt: "LinkedIn", en: "LinkedIn" },
    value: { pt: "LinkedIn", en: "LinkedIn" },
    href: linkedinUrl,
  },
  {
    kind: "location",
    label: { pt: "Localização", en: "Location" },
    value: { pt: "Salvador, BA, Brasil", en: "Salvador, Bahia, Brazil" },
  },
];

export const education: {
  degree: Localized;
  school: Localized;
  start: YearMonth;
  expectedEnd: YearMonth;
  coursework: Localized<string[]>;
} = {
  degree: { pt: "Bacharelado em Ciência da Computação", en: "B.Sc. in Computer Science" },
  school: {
    pt: "Universidade Federal da Bahia (UFBA)",
    en: "Federal University of Bahia (UFBA)",
  },
  start: "2023-01",
  expectedEnd: "2027-12",
  coursework: {
    pt: [
      "Inteligência Artificial",
      "Estrutura de Dados",
      "Algoritmos",
      "Banco de Dados",
      "Deep Learning",
      "Visão Computacional",
      "Programação",
    ],
    en: [
      "Artificial Intelligence",
      "Data Structures",
      "Algorithms",
      "Databases",
      "Deep Learning",
      "Computer Vision",
      "Programming",
    ],
  },
};

export const certificates: { issuer: string; title: Localized; file: string }[] = [
  {
    issuer: "IBM",
    title: {
      pt: "Databases and SQL for Data Science with Python",
      en: "Databases and SQL for Data Science with Python",
    },
    file: "db.pdf",
  },
  {
    issuer: "UFBA",
    title: {
      pt: "Deep Learning Aplicado a Imagens com Python",
      en: "Deep Learning Applied to Images with Python",
    },
    file: "mlimage.pdf",
  },
  {
    issuer: "UFBA",
    title: { pt: "Análise de Séries Temporais no Python", en: "Time Series Analysis in Python" },
    file: "timeseries.pdf",
  },
];

export const meta: Localized<SiteMeta> = {
  pt: {
    title: "Guilherme Barbosa | Software, Dados e IA",
    description:
      "Portfólio de Guilherme Barbosa, Desenvolvedor de Software, Engenharia de Dados e IA em Salvador (BA). Projetos com Python, TensorFlow, XGBoost, OpenCV, React Native, TypeScript e AWS.",
    keywords: [
      "Guilherme Barbosa",
      "Desenvolvedor",
      "Dados",
      "IA",
      "Machine Learning",
      "Inteligência Artificial",
      "Visão Computacional",
      "Engenharia de Dados",
      "Ciência de Dados",
      "Python",
      "TensorFlow",
      "XGBoost",
      "OpenCV",
      "scikit-learn",
      "Pandas",
      "React Native",
      "TypeScript",
      "AWS",
      "LLM",
      "RAG",
      "Web scraping",
      "Estágio em IA",
      "UFBA",
      "Salvador",
    ],
  },
  en: {
    title: "Guilherme Barbosa | Software Developer, Data and AI",
    description:
      "Portfolio of Guilherme Barbosa, Software Developer, Data and AI based in Salvador, Brazil. Projects built with Python, TensorFlow, XGBoost, OpenCV, React Native, TypeScript and AWS.",
    keywords: [
      "Guilherme Barbosa",
      "Software Developer",
      "Machine Learning Engineer",
      "Artificial Intelligence",
      "Computer Vision",
      "Data Engineering",
      "Data Science",
      "Python",
      "TensorFlow",
      "XGBoost",
      "OpenCV",
      "scikit-learn",
      "Pandas",
      "React Native",
      "TypeScript",
      "AWS",
      "LLM",
      "RAG",
      "Web scraping",
      "AI internship",
      "UFBA",
      "Brazil",
    ],
  },
};
