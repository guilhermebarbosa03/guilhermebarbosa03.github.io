import type { ProjectSource } from "./types";

import landslideSatellite from "@/assets/projects/deslizamentos/fs-satelite.webp";
import landslideSafetyFactor from "@/assets/projects/deslizamentos/fator-seguranca.webp";
import landslideRain from "@/assets/projects/deslizamentos/chuva-interpolada.webp";
import landslideFlow from "@/assets/projects/deslizamentos/vetores-encosta.webp";
import landslideDisplacement from "@/assets/projects/deslizamentos/deslocamento-horizontal.webp";
import gprHyperbolas from "@/assets/projects/radargramas/candidatos-hiperboles.webp";
import gprTemplate from "@/assets/projects/radargramas/suporte-hiperboles.webp";
import gprClusters from "@/assets/projects/radargramas/clusterizacao-gmm.webp";
import oilResult from "@/assets/projects/vazamento-oleo/resultado-metricas.webp";
import oilVolumes from "@/assets/projects/vazamento-oleo/resumo-volumes.webp";
import oilRisk from "@/assets/projects/vazamento-oleo/relatorio-risco.webp";
import oilContainment from "@/assets/projects/vazamento-oleo/relatorio-contencao.webp";
import oilMenu from "@/assets/projects/vazamento-oleo/menu.webp";
import resistivityViewer from "@/assets/projects/resistividade-3d/visualizador-3d.webp";
import resistivityZone from "@/assets/projects/resistividade-3d/zona-resistividade.webp";
import resistivityZones2d from "@/assets/projects/resistividade-3d/secao-zonas.webp";
import resistivityContinuous from "@/assets/projects/resistividade-3d/secao-continua.webp";
import damPhotoForm from "@/assets/projects/inspecao-barragens/formulario-foto.webp";
import damPdf from "@/assets/projects/inspecao-barragens/relatorio-pdf.webp";
import damHistory from "@/assets/projects/inspecao-barragens/historico-relatorios.webp";
import damAnomalies from "@/assets/projects/inspecao-barragens/formulario-anomalias.webp";
import damPhotos from "@/assets/projects/inspecao-barragens/registro-fotos.webp";
import wbMain from "@/assets/projects/water-balance/tela-principal.webp";
import wbReleased from "@/assets/projects/water-balance/agua-liberada.webp";
import wbLeachate from "@/assets/projects/water-balance/chorume.webp";
import wbInfiltration from "@/assets/projects/water-balance/infiltracao.webp";
import wbMonthly from "@/assets/projects/water-balance/balanco-mensal.webp";
import wbWaste from "@/assets/projects/water-balance/dados-rsu.webp";
import wbRain from "@/assets/projects/water-balance/dados-chuva.webp";
import bluetoothHistory from "@/assets/projects/leitura-bluetooth/historico-medicoes.webp";

/** Carousel order. The first three images of each project appear on the card; the rest open in the zoom view. */
export const projects: ProjectSource[] = [
  {
    id: "landslide-prediction",
    title: { pt: "Previsão de deslizamentos de terra", en: "Landslide prediction" },
    context: {
      pt: "Iniciação Científica · UFBA e Prefeitura de Salvador · 2024–atual",
      en: "Research project · UFBA and Salvador City Hall · 2024–present",
    },
    summary: {
      pt: "Sistema em Python que estima o risco de deslizamento nas encostas de Salvador. Ele cruza chuva interpolada a partir de estações, imagens de terreno e modelos de Machine Learning para calcular o fator de segurança de cada encosta e apontar as áreas críticas para a gestão pública.",
      en: "Python system that estimates landslide risk on the slopes of Salvador, Brazil. It combines rainfall interpolated from weather stations, terrain imagery and Machine Learning models to compute a safety factor for each slope and show public managers where the critical areas are.",
    },
    details: {
      pt: [
        "Modelos de previsão com XGBoost e TensorFlow.",
        "Web scrapers em Selenium coletam dados de solo e precipitação, que eu limpo, trato e interpolo com Pandas, NumPy e scikit-learn.",
        "Algoritmos de visão computacional (OpenCV) segmentam as encostas nas imagens de terreno e traçam a direção do escoamento.",
        "O fator de segurança de cada encosta é sobreposto à imagem de satélite da cidade, ao lado do deslocamento horizontal medido pelos instrumentos de campo.",
      ],
      en: [
        "Prediction models built with XGBoost and TensorFlow.",
        "Selenium scrapers collect soil and rainfall data, which I clean, process and interpolate with Pandas, NumPy and scikit-learn.",
        "Computer vision algorithms (OpenCV) segment slopes in terrain images and trace the water flow direction.",
        "Each slope's safety factor is overlaid on the city's satellite image, next to the horizontal displacement measured by field instruments.",
      ],
    },
    skills: [
      "python",
      "xgboost",
      "tensorflow",
      "computerVision",
      "opencv",
      "selenium",
      "pandas",
      "numpy",
      "sklearn",
      "interpolation",
    ],
    images: [
      {
        src: landslideSatellite,
        alt: {
          pt: "Fator de segurança das encostas sobre a imagem de satélite de Salvador",
          en: "Slope safety factor overlaid on a satellite image of Salvador",
        },
      },
      {
        src: landslideSafetyFactor,
        alt: {
          pt: "Encostas segmentadas e coloridas pelo fator de segurança",
          en: "Segmented slopes colored by safety factor",
        },
      },
      {
        src: landslideRain,
        alt: {
          pt: "Chuva acumulada interpolada a partir das estações em sete janelas de tempo",
          en: "Accumulated rainfall interpolated from stations over seven time windows",
        },
      },
      {
        src: landslideFlow,
        alt: {
          pt: "Direção do escoamento traçada sobre as encostas segmentadas",
          en: "Water flow direction traced over the segmented slopes",
        },
      },
      {
        src: landslideDisplacement,
        alt: {
          pt: "Deslocamento horizontal e velocidade medidos em um instrumento de monitoramento",
          en: "Horizontal displacement and velocity measured by a monitoring instrument",
        },
      },
    ],
  },
  {
    id: "oil-spill-app",
    title: { pt: "App de estimativa de vazamento de óleo", en: "Oil spill estimation app" },
    context: {
      pt: "Desenvolvedor Mobile · Fundação Escola Politécnica da Bahia · Projeto para a Petrobras · 2025",
      en: "Mobile Developer · Fundação Escola Politécnica da Bahia · Built for Petrobras · 2025",
    },
    summary: {
      pt: "Aplicativo em React Native e TypeScript que estima o volume de óleo vazado em campo. O técnico percorre o perímetro da mancha com o GPS, e o app calcula a área, a infiltração no solo a partir da permeabilidade interpolada e a evaporação, gerando relatórios preliminares e definitivos.",
      en: "React Native and TypeScript app that estimates the volume of spilled oil in the field. The technician walks the spill perimeter with GPS, and the app computes the area, soil infiltration from interpolated permeability and evaporation, then generates preliminary and final reports.",
    },
    details: {
      pt: [
        "Mapeamento do perímetro por GPS para calcular a área e o perímetro da mancha.",
        "Volume infiltrado estimado com a permeabilidade do solo interpolada para o local e a textura do solo (pedregulho, areia, silte e argila).",
        "Volume evaporado calculado com a evapotranspiração potencial da estação meteorológica mais próxima.",
        "Relatório preliminar com causas do incidente, avaliação de risco, medidas de contenção e fotos.",
      ],
      en: [
        "GPS perimeter mapping to compute the spill's area and perimeter.",
        "Infiltrated volume estimated from soil permeability interpolated for the site and from soil texture (gravel, sand, silt and clay).",
        "Evaporated volume computed from the potential evapotranspiration of the nearest weather station.",
        "Preliminary report covering incident causes, risk assessment, containment measures and photos.",
      ],
    },
    skills: ["reactNative", "typescript", "gps", "interpolation"],
    images: [
      {
        src: oilResult,
        alt: {
          pt: "Resultado com métricas do perímetro, infiltração, textura do solo e evapotranspiração",
          en: "Result screen with perimeter metrics, infiltration, soil texture and evapotranspiration",
        },
      },
      {
        src: oilVolumes,
        alt: {
          pt: "Cálculo do volume evaporado e resumo dos volumes",
          en: "Evaporated volume calculation and volume summary",
        },
      },
      {
        src: oilRisk,
        alt: {
          pt: "Relatório preliminar com causas do incidente e avaliação de risco",
          en: "Preliminary report with incident causes and risk assessment",
        },
      },
      {
        src: oilContainment,
        alt: {
          pt: "Relatório preliminar com medidas de contenção e fotos",
          en: "Preliminary report with containment measures and photos",
        },
      },
      {
        src: oilMenu,
        alt: {
          pt: "Tela inicial com geração e consulta de relatórios",
          en: "Home screen for creating and browsing reports",
        },
      },
    ],
  },
  {
    id: "gpr-soil-analysis",
    title: { pt: "Análise de solo com radargramas (GPR)", en: "Soil analysis with ground-penetrating radar" },
    context: { pt: "Iniciação Científica · UFBA", en: "Research project · UFBA" },
    summary: {
      pt: "Pipeline em Python para processar e analisar radargramas de GPR. Trabalhei com pré-processamento do sinal, clusterização de atributos, rastreamento de refletores e detecção de hipérboles que podem indicar objetos enterrados.",
      en: "Python pipeline to process and analyze GPR radargrams. I worked on signal preprocessing, attribute clustering, reflector tracking and detection of hyperbolas that may point to buried objects.",
    },
    details: {
      pt: [
        "Leitura e pré-processamento dos dados do radar (tempo zero, dewow, ganho e deconvolução).",
        "Clusterização de atributos do sinal com GMM.",
        "Rastreamento automático de picos e vales ao longo do radargrama.",
        "Busca de hipérboles e mapas de atributos para revisão visual.",
      ],
      en: [
        "Reading and preprocessing radar data (time zero, dewow, gain and deconvolution).",
        "Clustering of signal attributes with a GMM.",
        "Automatic peak and valley tracking along the radargram.",
        "Hyperbola search and attribute maps for visual review.",
      ],
    },
    skills: ["python", "computerVision", "numpy", "scipy", "pandas", "sklearn", "matplotlib"],
    images: [
      {
        src: gprHyperbolas,
        alt: {
          pt: "Detecção de hipérboles no radargrama",
          en: "Hyperbola detection in the radargram",
        },
      },
      {
        src: gprTemplate,
        alt: {
          pt: "Mapa de resposta a um modelo de hipérbole, realçando possíveis objetos enterrados",
          en: "Hyperbola template response map, highlighting possible buried objects",
        },
      },
      {
        src: gprClusters,
        alt: {
          pt: "Clusterização dos atributos do sinal, dividindo o radargrama em regiões parecidas",
          en: "Clustering of signal attributes, splitting the radargram into similar regions",
        },
      },
    ],
  },
  {
    id: "resistivity-3d",
    title: { pt: "Visualização 3D de resistividade do solo", en: "3D soil resistivity viewer" },
    context: {
      pt: "Laboratório de Geotecnia Ambiental · 2024–2025",
      en: "Environmental Geotechnics Laboratory · 2024–2025",
    },
    summary: {
      pt: "Ferramenta em Python que transforma medições de resistividade elétrica em volumes 3D interpolados e os posiciona sobre imagens de satélite. Com Plotly e as APIs do Google Maps e do Azure Maps, a equipe filtra zonas de resistividade e vê cada seção georreferenciada sobre o terreno.",
      en: "Python tool that turns electrical resistivity measurements into interpolated 3D volumes placed over satellite imagery. Built with Plotly and the Google Maps and Azure Maps APIs, it lets the team filter resistivity zones and see each georeferenced section over the terrain.",
    },
    details: {
      pt: [
        "Interpolação das medições de campo em volumes 3D de resistividade.",
        "Imagem de satélite obtida pelas APIs do Google Maps e do Azure Maps e alinhada às coordenadas UTM das seções.",
        "Painel para ligar e desligar zonas, mostrar seções 2D e posicionar a imagem acima ou abaixo dos volumes.",
        "Seções 2D classificadas em faixas de resistividade (Ω·m) e em escala contínua.",
      ],
      en: [
        "Interpolation of field measurements into 3D resistivity volumes.",
        "Satellite imagery from the Google Maps and Azure Maps APIs, aligned to the sections' UTM coordinates.",
        "Control panel to toggle zones, show 2D sections and place the image above or below the volumes.",
        "2D sections classified into resistivity bands (Ω·m) and on a continuous scale.",
      ],
    },
    skills: ["python", "plotly", "interpolation", "googleMaps", "azureMaps"],
    images: [
      {
        src: resistivityViewer,
        alt: {
          pt: "Visualizador 3D com painel de controle e seções sobre a imagem de satélite",
          en: "3D viewer with control panel and sections over the satellite image",
        },
      },
      {
        src: resistivityZone,
        alt: {
          pt: "Detalhe de uma zona de alta resistividade com o volume calculado",
          en: "Close-up of a high-resistivity zone with its computed volume",
        },
      },
      {
        src: resistivityZones2d,
        alt: {
          pt: "Seção 2D classificada em cinco zonas de resistividade",
          en: "2D section classified into five resistivity zones",
        },
      },
      {
        src: resistivityContinuous,
        alt: {
          pt: "Seção 2D em escala contínua de resistividade",
          en: "2D section on a continuous resistivity scale",
        },
      },
    ],
  },
  {
    id: "dam-inspection-app",
    title: { pt: "App de inspeção de barragens", en: "Dam inspection app" },
    context: {
      pt: "Desenvolvedor Mobile · Fundação Escola Politécnica da Bahia · 2025",
      en: "Mobile Developer · Fundação Escola Politécnica da Bahia · 2025",
    },
    summary: {
      pt: "Aplicativo Android para vistorias de barragens em campo. O inspetor registra cada anomalia com situação, magnitude, nível de perigo, descrição e foto, e o app gera o relatório em PDF com a localização GPS e o nível de perigo global da barragem.",
      en: "Android app for field dam inspections. The inspector logs each anomaly with its status, magnitude, hazard level, description and photo, and the app generates a PDF report with the GPS location and the dam's overall hazard level.",
    },
    details: {
      pt: [
        "Relatórios em PDF gerados com Python dentro do Android, usando Chaquopy e ReportLab.",
        "Marcação geográfica em tempo real via GPS.",
        "Histórico de relatórios mensais e semestrais por barragem, com exportação das imagens.",
        "Tabela de anomalias colorida por magnitude e nível de perigo, seguida do registro fotográfico.",
      ],
      en: [
        "PDF reports generated with Python inside Android, using Chaquopy and ReportLab.",
        "Real-time GPS geotagging.",
        "Monthly and biannual report history for each dam, with image export.",
        "Anomaly table colored by magnitude and hazard level, followed by the photo log.",
      ],
    },
    skills: ["android", "python", "chaquopy", "reportlab", "gps"],
    images: [
      {
        src: damPhotoForm,
        alt: {
          pt: "Formulário de anomalia com foto anexada",
          en: "Anomaly form with an attached photo",
        },
      },
      {
        src: damPdf,
        alt: {
          pt: "Relatório em PDF com os dados da vistoria e a tabela de anomalias",
          en: "PDF report with inspection data and the anomaly table",
        },
      },
      {
        src: damHistory,
        alt: {
          pt: "Histórico de relatórios mensais e semestrais",
          en: "Monthly and biannual report history",
        },
      },
      {
        src: damAnomalies,
        alt: {
          pt: "Seleção de situação, magnitude e nível de perigo de cada anomalia",
          en: "Picking the status, magnitude and hazard level of each anomaly",
        },
      },
      {
        src: damPhotos,
        alt: {
          pt: "Registro fotográfico gerado no PDF",
          en: "Photo log generated in the PDF",
        },
      },
    ],
  },
  {
    id: "water-balance",
    title: { pt: "Water Balance: balanço hídrico de aterros", en: "Water Balance: landfill water budget" },
    context: {
      pt: "Desenvolvedor de Automação de Software · Laboratório de Geotecnia Ambiental · 2024–2025",
      en: "Software Automation Developer · Environmental Geotechnics Laboratory · 2024–2025",
    },
    summary: {
      pt: "Aplicação desktop em Python e PyQt que substituiu macros legadas em Excel no cálculo do balanço hídrico de aterros sanitários. O usuário informa chuva, evaporação e dados dos resíduos e da camada de cobertura, e o app calcula infiltração, água liberada e chorume acumulado mês a mês.",
      en: "Python and PyQt desktop application that replaced legacy Excel macros for landfill water-balance calculations. Users enter rainfall, evaporation, waste and cover-layer data, and the app computes infiltration, released water and accumulated leachate month by month.",
    },
    details: {
      pt: [
        "Substituiu macros em Excel por uma aplicação desktop com melhor desempenho.",
        "Infiltração na camada de cobertura calculada hora a hora e balanço do chorume fechado por mês.",
        "Tabelas editáveis com exportação de dados e gráficos de água liberada e chorume em Matplotlib.",
        "Interface em inglês com guia do usuário em português e inglês.",
      ],
      en: [
        "Replaced Excel macros with a faster desktop application.",
        "Hourly infiltration through the cover layer and a monthly leachate balance.",
        "Editable tables with data export, plus Matplotlib charts of released water and leachate.",
        "English interface with a user guide in Portuguese and English.",
      ],
    },
    skills: ["python", "pyqt", "matplotlib"],
    images: [
      {
        src: wbMain,
        alt: {
          pt: "Tela principal com o esquema da célula do aterro e as entradas de dados",
          en: "Main window with the landfill cell diagram and data inputs",
        },
      },
      {
        src: wbReleased,
        alt: {
          pt: "Gráfico de água liberada por decomposição e compressão",
          en: "Chart of water released by decomposition and compression",
        },
      },
      {
        src: wbLeachate,
        alt: {
          pt: "Previsão de chorume acumulado na célula",
          en: "Predicted leachate accumulated in the cell",
        },
      },
      {
        src: wbInfiltration,
        alt: {
          pt: "Cálculo hora a hora da infiltração",
          en: "Hourly infiltration calculation",
        },
      },
      {
        src: wbMonthly,
        alt: {
          pt: "Balanço hídrico mensal",
          en: "Monthly water balance",
        },
      },
      {
        src: wbWaste,
        alt: {
          pt: "Entrada de dados dos resíduos sólidos urbanos",
          en: "Municipal solid waste data input",
        },
      },
      {
        src: wbRain,
        alt: {
          pt: "Dados de chuva por hora",
          en: "Hourly rainfall data",
        },
      },
    ],
  },
  {
    id: "bluetooth-instruments",
    title: { pt: "Leitura de instrumentos via Bluetooth", en: "Bluetooth instrument reader" },
    context: {
      pt: "Desenvolvedor Mobile · Fundação Escola Politécnica da Bahia · 2025",
      en: "Mobile Developer · Fundação Escola Politécnica da Bahia · 2025",
    },
    summary: {
      pt: "Aplicativo que se comunica com equipamentos de medição por Bluetooth, registra as leituras de cada instrumento com coordenadas geográficas e UTM e mostra os dados em gráficos 2D e 3D.",
      en: "App that talks to measurement equipment over Bluetooth, stores each instrument's readings with geographic and UTM coordinates, and plots the data in 2D and 3D charts.",
    },
    details: {
      pt: [
        "Comunicação com o hardware via Bluetooth para coletar as medições.",
        "Lista de instrumentos com a distância de cada um até o usuário.",
        "Histórico por instrumento com total, máximo, mínimo e média das leituras.",
        "Leituras exibidas em gráficos 2D e 3D.",
      ],
      en: [
        "Bluetooth communication with the hardware to collect measurements.",
        "Instrument list showing each one's distance from the user.",
        "Per-instrument history with count, maximum, minimum and average readings.",
        "Readings displayed in 2D and 3D charts.",
      ],
    },
    skills: ["bluetooth", "gps"],
    images: [
      {
        src: bluetoothHistory,
        alt: {
          pt: "Histórico de medições de um instrumento com coordenadas e estatísticas",
          en: "Measurement history of one instrument with coordinates and statistics",
        },
      },
    ],
  },
];
