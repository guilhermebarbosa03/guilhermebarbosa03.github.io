import type { Localized } from "./types";

type SkillLabel = string | Localized;

/**
 * Single registry of skills. Projects, experience and the skills section reference these ids,
 * so a typo becomes a type error.
 */
export const skills = {
  // Programming languages
  python: "Python",
  typescript: "TypeScript",
  javascript: "JavaScript",
  sql: "SQL",
  cpp: "C++",
  // AI & Machine Learning
  tensorflow: "TensorFlow",
  sklearn: "scikit-learn",
  xgboost: "XGBoost",
  neuralNetworks: { pt: "Redes neurais", en: "Neural networks" },
  computerVision: { pt: "Visão computacional", en: "Computer vision" },
  opencv: "OpenCV",
  // Data science
  pandas: "Pandas",
  numpy: "NumPy",
  scipy: "SciPy",
  matplotlib: "Matplotlib",
  plotly: "Plotly",
  selenium: { pt: "Selenium (web scraping)", en: "Selenium (web scraping)" },
  interpolation: { pt: "Interpolação espacial", en: "Spatial interpolation" },
  // LLMs
  ollama: { pt: "Ollama (LLMs locais)", en: "Ollama (local LLMs)" },
  llmApis: { pt: "APIs de LLM", en: "LLM APIs" },
  promptEngineering: "Prompt engineering",
  rag: "RAG",
  agents: { pt: "Agentes com Claude e Gemini", en: "Agents with Claude and Gemini" },
  // Software development
  react: "React",
  reactNative: "React Native",
  expo: "Expo",
  nodejs: "Node.js",
  restApis: { pt: "APIs REST", en: "REST APIs" },
  pyqt: "PyQt",
  git: "Git",
  osAutomation: { pt: "Automação em Linux e Windows", en: "Linux and Windows automation" },
  // Mobile, hardware and geo
  android: "Android",
  chaquopy: "Chaquopy",
  reportlab: "ReportLab",
  bluetooth: "Bluetooth",
  gps: "GPS",
  googleMaps: "Google Maps API",
  azureMaps: "Azure Maps",
  // AWS
  awsLambda: "AWS Lambda",
  apiGateway: "API Gateway",
  s3: "S3",
  dynamodb: "DynamoDB",
  cloudfront: "CloudFront",
  iotCore: "IoT Core",
  // Spoken languages
  portuguese: { pt: "Português (nativo)", en: "Portuguese (native)" },
  english: { pt: "Inglês (avançado)", en: "English (advanced)" },
} satisfies Record<string, SkillLabel>;

export type SkillId = keyof typeof skills;

/** Order and grouping of the skills section. */
export const skillCategories: { id: string; title: Localized; skills: SkillId[] }[] = [
  {
    id: "languages",
    title: { pt: "Linguagens", en: "Programming languages" },
    skills: ["python", "typescript", "javascript", "sql", "cpp"],
  },
  {
    id: "ai",
    title: { pt: "IA & Machine Learning", en: "AI & Machine Learning" },
    skills: ["tensorflow", "sklearn", "xgboost", "neuralNetworks", "computerVision", "opencv"],
  },
  {
    id: "data",
    title: { pt: "Ciência de dados", en: "Data science" },
    skills: ["pandas", "numpy", "scipy", "matplotlib", "plotly", "selenium", "interpolation"],
  },
  {
    id: "llm",
    title: { pt: "LLMs & agentes", en: "LLMs & agents" },
    skills: ["ollama", "llmApis", "promptEngineering", "rag", "agents"],
  },
  {
    id: "software",
    title: { pt: "Desenvolvimento de software", en: "Software development" },
    skills: ["react", "reactNative", "expo", "nodejs", "restApis", "pyqt", "git", "osAutomation"],
  },
  {
    id: "mobile",
    title: { pt: "Mobile, hardware & mapas", en: "Mobile, hardware & maps" },
    skills: ["android", "chaquopy", "reportlab", "bluetooth", "gps", "googleMaps", "azureMaps"],
  },
  {
    id: "aws",
    title: { pt: "Cloud (AWS)", en: "Cloud (AWS)" },
    skills: ["awsLambda", "apiGateway", "s3", "dynamodb", "cloudfront", "iotCore"],
  },
  {
    id: "spoken",
    title: { pt: "Idiomas", en: "Languages" },
    skills: ["portuguese", "english"],
  },
];
