import type { ExperienceSource } from "./types";

export const experience: ExperienceSource[] = [
  {
    id: "ufba-research",
    role: { pt: "Iniciação Científica em Dados e IA", en: "Undergraduate Researcher, Data & AI" },
    organization: {
      pt: "UFBA, em parceria com a Prefeitura de Salvador",
      en: "UFBA, in partnership with Salvador City Hall",
    },
    location: { pt: "Salvador, BA", en: "Salvador, Brazil" },
    start: "2024-08",
    end: null,
    bullets: {
      pt: [
        "Desenvolvi um sistema de previsão de deslizamentos de terra em Python com Machine Learning (XGBoost, TensorFlow) e visão computacional (OpenCV).",
        "Construí web scrapers com Selenium para coletar dados de solo e precipitação, com limpeza, tratamento e interpolação dos dados (Pandas, NumPy, scikit-learn).",
        "Projetei algoritmos que identificam encostas de alto risco a partir de imagens de terreno, ajudando gestores públicos a prevenir desastres.",
      ],
      en: [
        "Built a landslide prediction system in Python using Machine Learning (XGBoost, TensorFlow) and computer vision (OpenCV).",
        "Wrote Selenium web scrapers to collect soil and rainfall data, then cleaned, processed and interpolated it (Pandas, NumPy, scikit-learn).",
        "Designed algorithms that flag high-risk slopes from terrain images, helping public managers prevent disasters.",
      ],
    },
    skills: ["python", "xgboost", "tensorflow", "opencv", "selenium", "pandas", "numpy", "sklearn"],
    projectIds: ["landslide-prediction", "gpr-soil-analysis"],
  },
  {
    id: "fep-mobile",
    role: { pt: "Desenvolvedor Mobile", en: "Mobile Developer" },
    organization: { pt: "Fundação Escola Politécnica da Bahia", en: "Fundação Escola Politécnica da Bahia" },
    location: { pt: "Salvador, BA", en: "Salvador, Brazil" },
    start: "2025-03",
    end: "2025-12",
    bullets: {
      pt: [
        "Desenvolvi um aplicativo em React Native e TypeScript para a Petrobras que estima vazamentos de óleo com dados de GPS e interpolação da permeabilidade do solo.",
        "Construí um aplicativo de inspeção de barragens com geração automática de relatórios em PDF (Chaquopy, ReportLab) e marcação geográfica em tempo real via GPS.",
        "Implementei a comunicação com hardware via Bluetooth para ler dados de equipamentos e exibi-los em gráficos 2D e 3D.",
      ],
      en: [
        "Developed a React Native and TypeScript app for Petrobras that estimates oil spills using GPS data and soil permeability interpolation.",
        "Built a dam inspection app with automated PDF reports (Chaquopy, ReportLab) and real-time GPS geotagging.",
        "Implemented Bluetooth communication with hardware to read equipment data and display it in 2D and 3D charts.",
      ],
    },
    skills: ["reactNative", "typescript", "android", "chaquopy", "reportlab", "gps", "bluetooth"],
    projectIds: ["oil-spill-app", "dam-inspection-app", "bluetooth-instruments"],
  },
  {
    id: "geotech-lab",
    role: { pt: "Desenvolvedor de Automação de Software", en: "Software Automation Developer" },
    organization: { pt: "Laboratório de Geotecnia Ambiental", en: "Environmental Geotechnics Laboratory" },
    location: { pt: "Salvador, BA", en: "Salvador, Brazil" },
    start: "2024-08",
    end: "2025-01",
    bullets: {
      pt: [
        "Automatizei os cálculos de balanço hídrico de aterros sanitários em Python com PyQt, trocando macros legadas em Excel por uma aplicação desktop com melhor desempenho.",
        "Desenvolvi ferramentas de visualização com as APIs do Google Maps e do Azure Maps que sobrepõem a imagens de satélite volumes 3D de resistividade do solo (Plotly), interpolados a partir de medições.",
      ],
      en: [
        "Automated landfill water-balance calculations in Python with PyQt, replacing legacy Excel macros with a faster desktop application.",
        "Built visualization tools with the Google Maps and Azure Maps APIs that overlay 3D soil resistivity volumes (Plotly), interpolated from field measurements, on satellite imagery.",
      ],
    },
    skills: ["python", "pyqt", "plotly", "googleMaps", "azureMaps"],
    projectIds: ["water-balance", "resistivity-3d"],
  },
];
