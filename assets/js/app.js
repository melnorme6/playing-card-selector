"use strict";

const STORAGE_KEYS = Object.freeze({
  selectedCards: "playingCardSelector.selectedCards",
  language: "playingCardSelector.language",
  theme: "playingCardSelector.theme",
  interactionLocked: "playingCardSelector.interactionLocked",
});

const LEGACY_STORAGE_KEYS = Object.freeze({
  selectedCards: "carteSelezionate",
  language: "linguaSelezionata",
  theme: "temaSelezionato",
});

const MAX_IMPORT_BYTES = 1024 * 1024;
const EXPORT_SCHEMA_VERSION = 1;
const CARD_SIZES = Object.freeze(["small", "medium", "large"]);

const SUITS = Object.freeze([
  { id: "hearts", symbol: "♥", color: "red" },
  { id: "diamonds", symbol: "♦", color: "red" },
  { id: "clubs", symbol: "♣", color: "black" },
  { id: "spades", symbol: "♠", color: "black" },
]);

const VALUES_ASCENDING = Object.freeze(["A", "2", "3", "4", "5", "6", "7", "8", "9", "10", "J", "Q", "K"]);
const VALUES_DESCENDING = Object.freeze(["K", "Q", "J", "10", "9", "8", "7", "6", "5", "4", "3", "2", "A"]);

const JOKERS = Object.freeze([
  { id: "joker-red", color: "red" },
  { id: "joker-black", color: "black" },
]);

const I18N = {
  it: {
    pageTitle: "Selezione carte da gioco",
    brandName: "Selezione carte da gioco",
    toolbarLabel: "Controlli applicazione",
    layoutSuitTooltip: "Raggruppamento per seme. Passa al raggruppamento per valore",
    layoutValueTooltip: "Raggruppamento per valore. Passa al raggruppamento per seme",
    filterLegend: "Visualizza",
    filterAll: "Tutte",
    filterSelected: "Possedute",
    filterUnselected: "Mancanti",
    filterAllCompact: "Tutte",
    filterSelectedCompact: "Pos.",
    filterUnselectedCompact: "Manc.",
    exportButton: "Esporta JSON",
    importLabel: "Importa JSON",
    languageLabel: "Lingua",
    brandLabel: "Selezione carte da gioco",
    footerMadeWith: "Realizzato con",
    footerLove: "amore",
    githubLinkLabel: "Apri il progetto su GitHub",
    deckLabel: "Mazzo di carte",
    suits: {
      hearts: "Cuori",
      diamonds: "Quadri",
      clubs: "Fiori",
      spades: "Picche",
    },
    values: {
      A: "Assi",
      2: "Due",
      3: "Tre",
      4: "Quattro",
      5: "Cinque",
      6: "Sei",
      7: "Sette",
      8: "Otto",
      9: "Nove",
      10: "Dieci",
      J: "Fanti",
      Q: "Regine",
      K: "Re",
    },
    cardValues: {
      A: "Asso",
      J: "Fante",
      Q: "Regina",
      K: "Re",
    },
    joker: "Jolly",
    jokerRed: "Jolly rosso",
    jokerBlack: "Jolly nero",
    selectionSummary: (selected, missing, total) =>
      `${selected} selezionate, ${missing} mancanti, ${total} totali`,
    groupCount: (selected, total) => `${selected}/${total}`,
    sortAscendingTooltip: "Ordinamento crescente",
    sortDescendingTooltip: "Ordinamento decrescente",
    sortAscendingButtonTooltip: "Ordinamento crescente. Passa al decrescente",
    sortDescendingButtonTooltip: "Ordinamento decrescente. Passa al crescente",
    cardSizeLabel: "Dimensione carte",
    zoomOut: "Riduci carte",
    zoomIn: "Ingrandisci carte",
    cardName: (value, suit) => `${value} di ${suit}`,
    selectCard: (card) => `Seleziona ${card}`,
    deselectCard: (card) => `Deseleziona ${card}`,
    themeDark: "Attiva tema scuro",
    themeLight: "Attiva tema chiaro",
    lockCards: "Blocca modifica carte",
    unlockCards: "Sblocca modifica carte",
    exportSuccess: "Configurazione esportata.",
    importSuccess: "Configurazione importata.",
    importError: "Il file JSON non contiene una configurazione valida.",
    storageError: "Modifica applicata, ma non è stato possibile salvarla nel browser.",
  },
  en: {
    pageTitle: "Playing Card Selector",
    brandName: "Playing Card Selector",
    toolbarLabel: "Application controls",
    layoutSuitTooltip: "Grouped by suit. Switch to grouping by value",
    layoutValueTooltip: "Grouped by value. Switch to grouping by suit",
    filterLegend: "Show",
    filterAll: "All",
    filterSelected: "Owned",
    filterUnselected: "Missing",
    filterAllCompact: "All",
    filterSelectedCompact: "Own",
    filterUnselectedCompact: "Miss",
    exportButton: "Export JSON",
    importLabel: "Import JSON",
    languageLabel: "Language",
    brandLabel: "Playing Card Selector",
    footerMadeWith: "Made with",
    footerLove: "love",
    githubLinkLabel: "Open the project on GitHub",
    deckLabel: "Playing card deck",
    suits: {
      hearts: "Hearts",
      diamonds: "Diamonds",
      clubs: "Clubs",
      spades: "Spades",
    },
    values: {
      A: "Aces",
      2: "Twos",
      3: "Threes",
      4: "Fours",
      5: "Fives",
      6: "Sixes",
      7: "Sevens",
      8: "Eights",
      9: "Nines",
      10: "Tens",
      J: "Jacks",
      Q: "Queens",
      K: "Kings",
    },
    cardValues: {
      A: "Ace",
      J: "Jack",
      Q: "Queen",
      K: "King",
    },
    joker: "Joker",
    jokerRed: "Red joker",
    jokerBlack: "Black joker",
    selectionSummary: (selected, missing, total) =>
      `${selected} selected, ${missing} missing, ${total} total`,
    groupCount: (selected, total) => `${selected}/${total}`,
    sortAscendingTooltip: "Ascending order",
    sortDescendingTooltip: "Descending order",
    sortAscendingButtonTooltip: "Ascending order. Switch to descending",
    sortDescendingButtonTooltip: "Descending order. Switch to ascending",
    cardSizeLabel: "Card size",
    zoomOut: "Make cards smaller",
    zoomIn: "Make cards larger",
    cardName: (value, suit) => `${value} of ${suit}`,
    selectCard: (card) => `Select ${card}`,
    deselectCard: (card) => `Deselect ${card}`,
    themeDark: "Enable dark theme",
    themeLight: "Enable light theme",
    lockCards: "Lock card editing",
    unlockCards: "Unlock card editing",
    exportSuccess: "Configuration exported.",
    importSuccess: "Configuration imported.",
    importError: "The JSON file does not contain a valid configuration.",
    storageError: "The change was applied, but it could not be saved in this browser.",
  },
};

const LANGUAGE_OPTIONS = Object.freeze([
  { code: "en", flag: "🇬🇧", name: "English" },
  { code: "it", flag: "🇮🇹", name: "Italiano" },
  { code: "pt-BR", flag: "🇧🇷", name: "Português (Brasil)" },
  { code: "es-419", flag: "🇲🇽", name: "Español (Latinoamérica)" },
  { code: "de", flag: "🇩🇪", name: "Deutsch" },
  { code: "fr", flag: "🇫🇷", name: "Français" },
  { code: "ru", flag: "🇷🇺", name: "Русский" },
  { code: "tr", flag: "🇹🇷", name: "Türkçe" },
  { code: "zh-Hans", flag: "🇨🇳", name: "简体中文" },
  { code: "zh-Hant", flag: "🇹🇼", name: "繁體中文" },
  { code: "ja", flag: "🇯🇵", name: "日本語" },
  { code: "ko", flag: "🇰🇷", name: "한국어" },
]);

function createLocale(overrides) {
  return {
    ...I18N.en,
    ...overrides,
    suits: { ...I18N.en.suits, ...overrides.suits },
    values: { ...I18N.en.values, ...overrides.values },
    cardValues: { ...I18N.en.cardValues, ...overrides.cardValues },
  };
}

Object.assign(I18N, {
  "pt-BR": createLocale({
    pageTitle: "Seleção de cartas", brandName: "Seleção de cartas", toolbarLabel: "Controles do aplicativo", layoutSuitTooltip: "Agrupado por naipe. Mudar para agrupamento por valor", layoutValueTooltip: "Agrupado por valor. Mudar para agrupamento por naipe", filterLegend: "Exibir", filterAll: "Todas", filterSelected: "Possuídas", filterUnselected: "Faltantes", exportButton: "Exportar JSON", importLabel: "Importar JSON", languageLabel: "Idioma", brandLabel: "Seleção de cartas", footerMadeWith: "Feito com", footerLove: "amor", githubLinkLabel: "Abrir o projeto no GitHub", deckLabel: "Baralho", suits: { hearts: "Copas", diamonds: "Ouros", clubs: "Paus", spades: "Espadas" }, values: { A: "Ases", 2: "Dois", 3: "Três", 4: "Quatros", 5: "Cincos", 6: "Seis", 7: "Setes", 8: "Oitos", 9: "Noves", 10: "Dezes", J: "Valetes", Q: "Damas", K: "Reis" }, joker: "Coringa", jokerRed: "Coringa vermelho", jokerBlack: "Coringa preto", selectionSummary: (selected, missing, total) => `${selected} selecionadas, ${missing} faltantes, ${total} no total`, sortAscendingTooltip: "Ordem crescente", sortDescendingTooltip: "Ordem decrescente", sortAscendingButtonTooltip: "Ordem crescente. Mudar para decrescente", sortDescendingButtonTooltip: "Ordem decrescente. Mudar para crescente", cardName: (value, suit) => `${value} de ${suit}`, selectCard: (card) => `Selecionar ${card}`, deselectCard: (card) => `Desmarcar ${card}`, themeDark: "Ativar tema escuro", themeLight: "Ativar tema claro", exportSuccess: "Configuração exportada.", importSuccess: "Configuração importada.", importError: "O arquivo JSON não contém uma configuração válida.",
  }),
  "es-419": createLocale({
    pageTitle: "Selector de cartas", brandName: "Selector de cartas", toolbarLabel: "Controles de la aplicación", layoutSuitTooltip: "Agrupado por palo. Cambiar a agrupación por valor", layoutValueTooltip: "Agrupado por valor. Cambiar a agrupación por palo", filterLegend: "Mostrar", filterAll: "Todas", filterSelected: "Obtenidas", filterUnselected: "Faltantes", exportButton: "Exportar JSON", importLabel: "Importar JSON", languageLabel: "Idioma", brandLabel: "Selector de cartas", footerMadeWith: "Hecho con", footerLove: "amor", githubLinkLabel: "Abrir el proyecto en GitHub", deckLabel: "Baraja de cartas", suits: { hearts: "Corazones", diamonds: "Diamantes", clubs: "Tréboles", spades: "Picas" }, values: { A: "Ases", 2: "Doses", 3: "Treses", 4: "Cuatros", 5: "Cincos", 6: "Seises", 7: "Sietes", 8: "Ochos", 9: "Nueves", 10: "Dieces", J: "Jotas", Q: "Reinas", K: "Reyes" }, joker: "Comodín", jokerRed: "Comodín rojo", jokerBlack: "Comodín negro", selectionSummary: (selected, missing, total) => `${selected} obtenidas, ${missing} faltantes, ${total} en total`, sortAscendingTooltip: "Orden ascendente", sortDescendingTooltip: "Orden descendente", sortAscendingButtonTooltip: "Orden ascendente. Cambiar a descendente", sortDescendingButtonTooltip: "Orden descendente. Cambiar a ascendente", cardName: (value, suit) => `${value} de ${suit}`, selectCard: (card) => `Seleccionar ${card}`, deselectCard: (card) => `Deseleccionar ${card}`, themeDark: "Activar tema oscuro", themeLight: "Activar tema claro", exportSuccess: "Configuración exportada.", importSuccess: "Configuración importada.", importError: "El archivo JSON no contiene una configuración válida.",
  }),
  de: createLocale({
    pageTitle: "Spielkartenauswahl", brandName: "Spielkartenauswahl", toolbarLabel: "Anwendungssteuerung", layoutSuitTooltip: "Nach Farbe gruppiert. Zur Gruppierung nach Wert wechseln", layoutValueTooltip: "Nach Wert gruppiert. Zur Gruppierung nach Farbe wechseln", filterLegend: "Anzeigen", filterAll: "Alle", filterSelected: "Besessen", filterUnselected: "Fehlend", exportButton: "JSON exportieren", importLabel: "JSON importieren", languageLabel: "Sprache", brandLabel: "Spielkartenauswahl", footerMadeWith: "Erstellt mit", githubLinkLabel: "Projekt auf GitHub öffnen", deckLabel: "Kartendeck", suits: { hearts: "Herz", diamonds: "Karo", clubs: "Kreuz", spades: "Pik" }, values: { A: "Asse", 2: "Zweien", 3: "Dreien", 4: "Vieren", 5: "Fünfen", 6: "Sechsen", 7: "Siebener", 8: "Achten", 9: "Neunen", 10: "Zehnen", J: "Buben", Q: "Damen", K: "Könige" }, joker: "Joker", jokerRed: "Roter Joker", jokerBlack: "Schwarzer Joker", selectionSummary: (selected, missing, total) => `${selected} vorhanden, ${missing} fehlend, ${total} insgesamt`, sortAscendingTooltip: "Aufsteigende Reihenfolge", sortDescendingTooltip: "Absteigende Reihenfolge", sortAscendingButtonTooltip: "Aufsteigende Reihenfolge. Zu absteigend wechseln", sortDescendingButtonTooltip: "Absteigende Reihenfolge. Zu aufsteigend wechseln", selectCard: (card) => `${card} auswählen`, deselectCard: (card) => `${card} abwählen`, themeDark: "Dunkles Design aktivieren", themeLight: "Helles Design aktivieren", exportSuccess: "Konfiguration exportiert.", importSuccess: "Konfiguration importiert.", importError: "Die JSON-Datei enthält keine gültige Konfiguration.",
  }),
  fr: createLocale({
    pageTitle: "Sélecteur de cartes", brandName: "Sélecteur de cartes", toolbarLabel: "Commandes de l’application", layoutSuitTooltip: "Groupé par couleur. Passer au regroupement par valeur", layoutValueTooltip: "Groupé par valeur. Passer au regroupement par couleur", filterLegend: "Afficher", filterAll: "Toutes", filterSelected: "Possédées", filterUnselected: "Manquantes", exportButton: "Exporter JSON", importLabel: "Importer JSON", languageLabel: "Langue", brandLabel: "Sélecteur de cartes", footerMadeWith: "Fait avec", githubLinkLabel: "Ouvrir le projet sur GitHub", deckLabel: "Jeu de cartes", suits: { hearts: "Cœurs", diamonds: "Carreaux", clubs: "Trèfles", spades: "Piques" }, values: { A: "As", 2: "Deux", 3: "Trois", 4: "Quatre", 5: "Cinq", 6: "Six", 7: "Sept", 8: "Huit", 9: "Neuf", 10: "Dix", J: "Valets", Q: "Dames", K: "Rois" }, joker: "Joker", jokerRed: "Joker rouge", jokerBlack: "Joker noir", selectionSummary: (selected, missing, total) => `${selected} possédées, ${missing} manquantes, ${total} au total`, sortAscendingTooltip: "Ordre croissant", sortDescendingTooltip: "Ordre décroissant", sortAscendingButtonTooltip: "Ordre croissant. Passer au décroissant", sortDescendingButtonTooltip: "Ordre décroissant. Passer au croissant", selectCard: (card) => `Sélectionner ${card}`, deselectCard: (card) => `Désélectionner ${card}`, themeDark: "Activer le thème sombre", themeLight: "Activer le thème clair", exportSuccess: "Configuration exportée.", importSuccess: "Configuration importée.", importError: "Le fichier JSON ne contient pas de configuration valide.",
  }),
  ru: createLocale({
    pageTitle: "Выбор игральных карт", brandName: "Выбор игральных карт", toolbarLabel: "Элементы управления", layoutSuitTooltip: "Группировка по масти. Переключить на группировку по значению", layoutValueTooltip: "Группировка по значению. Переключить на группировку по масти", filterLegend: "Показать", filterAll: "Все", filterSelected: "Есть", filterUnselected: "Нет", exportButton: "Экспорт JSON", importLabel: "Импорт JSON", languageLabel: "Язык", brandLabel: "Выбор игральных карт", footerMadeWith: "Сделано с", githubLinkLabel: "Открыть проект на GitHub", deckLabel: "Колода карт", suits: { hearts: "Червы", diamonds: "Бубны", clubs: "Трефы", spades: "Пики" }, values: { A: "Тузы", 2: "Двойки", 3: "Тройки", 4: "Четвёрки", 5: "Пятёрки", 6: "Шестёрки", 7: "Семёрки", 8: "Восьмёрки", 9: "Девятки", 10: "Десятки", J: "Валеты", Q: "Дамы", K: "Короли" }, joker: "Джокер", jokerRed: "Красный джокер", jokerBlack: "Чёрный джокер", selectionSummary: (selected, missing, total) => `${selected} выбрано, ${missing} не хватает, всего ${total}`, sortAscendingTooltip: "По возрастанию", sortDescendingTooltip: "По убыванию", sortAscendingButtonTooltip: "По возрастанию. Переключить на убывание", sortDescendingButtonTooltip: "По убыванию. Переключить на возрастание", selectCard: (card) => `Выбрать: ${card}`, deselectCard: (card) => `Снять выбор: ${card}`, themeDark: "Включить тёмную тему", themeLight: "Включить светлую тему", exportSuccess: "Конфигурация экспортирована.", importSuccess: "Конфигурация импортирована.", importError: "JSON-файл не содержит допустимой конфигурации.",
  }),
  tr: createLocale({
    pageTitle: "Oyun kartı seçici", brandName: "Oyun kartı seçici", toolbarLabel: "Uygulama kontrolleri", layoutSuitTooltip: "Maça göre gruplandı. Değere göre gruplamaya geç", layoutValueTooltip: "Değere göre gruplandı. Maça göre gruplamaya geç", filterLegend: "Göster", filterAll: "Tümü", filterSelected: "Sahip olunan", filterUnselected: "Eksik", exportButton: "JSON dışa aktar", importLabel: "JSON içe aktar", languageLabel: "Dil", brandLabel: "Oyun kartı seçici", footerMadeWith: "Şununla yapıldı", githubLinkLabel: "Projeyi GitHub’da aç", deckLabel: "Kart destesi", suits: { hearts: "Kupa", diamonds: "Karo", clubs: "Sinek", spades: "Maça" }, values: { A: "Aslar", 2: "İkiler", 3: "Üçler", 4: "Dörtler", 5: "Beşler", 6: "Altılar", 7: "Yediler", 8: "Sekizler", 9: "Dokuzlar", 10: "Onlar", J: "Valeler", Q: "Kızlar", K: "Papazlar" }, joker: "Joker", jokerRed: "Kırmızı joker", jokerBlack: "Siyah joker", selectionSummary: (selected, missing, total) => `${selected} seçili, ${missing} eksik, toplam ${total}`, sortAscendingTooltip: "Artan sıra", sortDescendingTooltip: "Azalan sıra", sortAscendingButtonTooltip: "Artan sıra. Azalan sıraya geç", sortDescendingButtonTooltip: "Azalan sıra. Artan sıraya geç", selectCard: (card) => `${card} seç`, deselectCard: (card) => `${card} seçimini kaldır`, themeDark: "Koyu temayı etkinleştir", themeLight: "Açık temayı etkinleştir", exportSuccess: "Yapılandırma dışa aktarıldı.", importSuccess: "Yapılandırma içe aktarıldı.", importError: "JSON dosyası geçerli bir yapılandırma içermiyor.",
  }),
  "zh-Hans": createLocale({
    pageTitle: "扑克牌选择器", brandName: "扑克牌选择器", toolbarLabel: "应用程序控件", layoutSuitTooltip: "按花色分组。切换为按点数分组", layoutValueTooltip: "按点数分组。切换为按花色分组", filterLegend: "显示", filterAll: "全部", filterSelected: "已拥有", filterUnselected: "缺失", exportButton: "导出 JSON", importLabel: "导入 JSON", languageLabel: "语言", brandLabel: "扑克牌选择器", footerMadeWith: "用心制作", githubLinkLabel: "在 GitHub 上打开项目", deckLabel: "扑克牌组", suits: { hearts: "红桃", diamonds: "方块", clubs: "梅花", spades: "黑桃" }, values: { A: "A", 2: "2", 3: "3", 4: "4", 5: "5", 6: "6", 7: "7", 8: "8", 9: "9", 10: "10", J: "J", Q: "Q", K: "K" }, joker: "小丑", jokerRed: "红色小丑", jokerBlack: "黑色小丑", selectionSummary: (selected, missing, total) => `已选择 ${selected} 张，缺少 ${missing} 张，共 ${total} 张`, sortAscendingTooltip: "升序", sortDescendingTooltip: "降序", sortAscendingButtonTooltip: "升序。切换为降序", sortDescendingButtonTooltip: "降序。切换为升序", selectCard: (card) => `选择${card}`, deselectCard: (card) => `取消选择${card}`, themeDark: "启用深色主题", themeLight: "启用浅色主题", exportSuccess: "配置已导出。", importSuccess: "配置已导入。", importError: "JSON 文件不包含有效配置。",
  }),
  "zh-Hant": createLocale({
    pageTitle: "撲克牌選擇器", brandName: "撲克牌選擇器", toolbarLabel: "應用程式控制項", layoutSuitTooltip: "依花色分組。切換為依點數分組", layoutValueTooltip: "依點數分組。切換為依花色分組", filterLegend: "顯示", filterAll: "全部", filterSelected: "已擁有", filterUnselected: "缺少", exportButton: "匯出 JSON", importLabel: "匯入 JSON", languageLabel: "語言", brandLabel: "撲克牌選擇器", footerMadeWith: "用心製作", githubLinkLabel: "在 GitHub 上開啟專案", deckLabel: "撲克牌組", suits: { hearts: "紅心", diamonds: "方塊", clubs: "梅花", spades: "黑桃" }, values: { A: "A", 2: "2", 3: "3", 4: "4", 5: "5", 6: "6", 7: "7", 8: "8", 9: "9", 10: "10", J: "J", Q: "Q", K: "K" }, joker: "鬼牌", jokerRed: "紅色鬼牌", jokerBlack: "黑色鬼牌", selectionSummary: (selected, missing, total) => `已選擇 ${selected} 張，缺少 ${missing} 張，共 ${total} 張`, sortAscendingTooltip: "遞增排序", sortDescendingTooltip: "遞減排序", sortAscendingButtonTooltip: "遞增排序。切換為遞減", sortDescendingButtonTooltip: "遞減排序。切換為遞增", selectCard: (card) => `選擇${card}`, deselectCard: (card) => `取消選擇${card}`, themeDark: "啟用深色主題", themeLight: "啟用淺色主題", exportSuccess: "設定已匯出。", importSuccess: "設定已匯入。", importError: "JSON 檔案不包含有效設定。",
  }),
  ja: createLocale({
    pageTitle: "トランプ選択", brandName: "トランプ選択", toolbarLabel: "アプリケーションの操作", layoutSuitTooltip: "スート別にグループ化。数字別のグループ化に切り替え", layoutValueTooltip: "数字別にグループ化。スート別のグループ化に切り替え", filterLegend: "表示", filterAll: "すべて", filterSelected: "所持", filterUnselected: "未所持", exportButton: "JSON をエクスポート", importLabel: "JSON をインポート", languageLabel: "言語", brandLabel: "トランプ選択", footerMadeWith: "心を込めて制作", githubLinkLabel: "GitHub でプロジェクトを開く", deckLabel: "トランプのデッキ", suits: { hearts: "ハート", diamonds: "ダイヤ", clubs: "クラブ", spades: "スペード" }, values: { A: "エース", 2: "2", 3: "3", 4: "4", 5: "5", 6: "6", 7: "7", 8: "8", 9: "9", 10: "10", J: "ジャック", Q: "クイーン", K: "キング" }, joker: "ジョーカー", jokerRed: "赤のジョーカー", jokerBlack: "黒のジョーカー", selectionSummary: (selected, missing, total) => `${selected} 枚を選択、${missing} 枚不足、合計 ${total} 枚`, sortAscendingTooltip: "昇順", sortDescendingTooltip: "降順", sortAscendingButtonTooltip: "昇順。降順に切り替え", sortDescendingButtonTooltip: "降順。昇順に切り替え", selectCard: (card) => `${card}を選択`, deselectCard: (card) => `${card}の選択を解除`, themeDark: "ダークテーマを有効化", themeLight: "ライトテーマを有効化", exportSuccess: "設定をエクスポートしました。", importSuccess: "設定をインポートしました。", importError: "JSON ファイルに有効な設定が含まれていません。",
  }),
  ko: createLocale({
    pageTitle: "플레잉 카드 선택기", brandName: "플레잉 카드 선택기", toolbarLabel: "애플리케이션 컨트롤", layoutSuitTooltip: "무늬별 그룹화. 숫자별 그룹화로 전환", layoutValueTooltip: "숫자별 그룹화. 무늬별 그룹화로 전환", filterLegend: "표시", filterAll: "전체", filterSelected: "보유", filterUnselected: "미보유", exportButton: "JSON 내보내기", importLabel: "JSON 가져오기", languageLabel: "언어", brandLabel: "플레잉 카드 선택기", footerMadeWith: "마음을 담아 제작", githubLinkLabel: "GitHub에서 프로젝트 열기", deckLabel: "카드 덱", suits: { hearts: "하트", diamonds: "다이아몬드", clubs: "클럽", spades: "스페이드" }, values: { A: "에이스", 2: "2", 3: "3", 4: "4", 5: "5", 6: "6", 7: "7", 8: "8", 9: "9", 10: "10", J: "잭", Q: "퀸", K: "킹" }, joker: "조커", jokerRed: "빨간 조커", jokerBlack: "검은 조커", selectionSummary: (selected, missing, total) => `${selected}장 선택됨, ${missing}장 부족, 총 ${total}장`, sortAscendingTooltip: "오름차순", sortDescendingTooltip: "내림차순", sortAscendingButtonTooltip: "오름차순. 내림차순으로 전환", sortDescendingButtonTooltip: "내림차순. 오름차순으로 전환", selectCard: (card) => `${card} 선택`, deselectCard: (card) => `${card} 선택 해제`, themeDark: "어두운 테마 사용", themeLight: "밝은 테마 사용", exportSuccess: "구성을 내보냈습니다.", importSuccess: "구성을 가져왔습니다.", importError: "JSON 파일에 유효한 구성이 없습니다.",
  }),
});

Object.assign(I18N["pt-BR"], {
  filterAllCompact: "Todas",
  filterSelectedCompact: "Poss.",
  filterUnselectedCompact: "Falt.",
  values: {
    A: "Ás", 2: "Dois", 3: "Três", 4: "Quatro", 5: "Cinco", 6: "Seis", 7: "Sete",
    8: "Oito", 9: "Nove", 10: "Dez", J: "Valete", Q: "Dama", K: "Rei",
  },
  cardValues: { A: "Ás", J: "Valete", Q: "Dama", K: "Rei" },
  storageError: "A alteração foi aplicada, mas não foi possível salvá-la neste navegador.",
  cardSizeLabel: "Tamanho das cartas",
  zoomOut: "Diminuir cartas",
  zoomIn: "Aumentar cartas",
});
Object.assign(I18N["es-419"], {
  filterAllCompact: "Todas",
  filterSelectedCompact: "Obt.",
  filterUnselectedCompact: "Falt.",
  values: {
    A: "As", 2: "Dos", 3: "Tres", 4: "Cuatro", 5: "Cinco", 6: "Seis", 7: "Siete",
    8: "Ocho", 9: "Nueve", 10: "Diez", J: "Jota", Q: "Reina", K: "Rey",
  },
  cardValues: { A: "As", J: "Jota", Q: "Reina", K: "Rey" },
  storageError: "El cambio se aplicó, pero no se pudo guardar en este navegador.",
  cardSizeLabel: "Tamaño de las cartas",
  zoomOut: "Reducir cartas",
  zoomIn: "Ampliar cartas",
});
Object.assign(I18N.de, {
  filterAllCompact: "Alle",
  filterSelectedCompact: "Eigen",
  filterUnselectedCompact: "Fehlt",
  cardValues: { A: "Ass", J: "Bube", Q: "Dame", K: "König" },
  footerLove: "Liebe",
  cardName: (value, suit) => `${suit} ${value}`,
  storageError: "Die Änderung wurde angewendet, konnte aber nicht im Browser gespeichert werden.",
  cardSizeLabel: "Kartengröße",
  zoomOut: "Karten verkleinern",
  zoomIn: "Karten vergrößern",
});
Object.assign(I18N.fr, {
  filterAllCompact: "Tout",
  filterSelectedCompact: "Poss.",
  filterUnselectedCompact: "Manq.",
  cardValues: { A: "As", J: "Valet", Q: "Dame", K: "Roi" },
  footerLove: "amour",
  cardName: (value, suit) => `${value} de ${suit}`,
  storageError: "La modification a été appliquée, mais n’a pas pu être enregistrée dans ce navigateur.",
  cardSizeLabel: "Taille des cartes",
  zoomOut: "Réduire les cartes",
  zoomIn: "Agrandir les cartes",
});
Object.assign(I18N.ru, {
  filterAllCompact: "Все",
  filterSelectedCompact: "Есть",
  filterUnselectedCompact: "Нет",
  cardValues: { A: "Туз", J: "Валет", Q: "Дама", K: "Король" },
  footerLove: "любовью",
  cardName: (value, suit) => `${value}, ${suit}`,
  storageError: "Изменение применено, но сохранить его в браузере не удалось.",
  cardSizeLabel: "Размер карт",
  zoomOut: "Уменьшить карты",
  zoomIn: "Увеличить карты",
});
Object.assign(I18N.tr, {
  filterAllCompact: "Tümü",
  filterSelectedCompact: "Var",
  filterUnselectedCompact: "Eksik",
  layoutSuitTooltip: "Türe göre gruplandı. Değere göre gruplamaya geç",
  layoutValueTooltip: "Değere göre gruplandı. Türe göre gruplamaya geç",
  cardValues: { A: "As", J: "Vale", Q: "Kız", K: "Papaz" },
  footerLove: "sevgi",
  cardName: (value, suit) => `${suit} ${value}`,
  storageError: "Değişiklik uygulandı ancak bu tarayıcıda kaydedilemedi.",
  cardSizeLabel: "Kart boyutu",
  zoomOut: "Kartları küçült",
  zoomIn: "Kartları büyüt",
});
Object.assign(I18N["zh-Hans"], {
  filterAllCompact: "全部",
  filterSelectedCompact: "已有",
  filterUnselectedCompact: "缺少",
  joker: "Joker",
  jokerRed: "红色 Joker",
  jokerBlack: "黑色 Joker",
  cardValues: { A: "A", J: "J", Q: "Q", K: "K" },
  footerLove: "爱",
  cardName: (value, suit) => `${suit}${value}`,
  storageError: "更改已应用，但无法保存在此浏览器中。",
  cardSizeLabel: "卡牌大小",
  zoomOut: "缩小卡牌",
  zoomIn: "放大卡牌",
});
Object.assign(I18N["zh-Hant"], {
  filterAllCompact: "全部",
  filterSelectedCompact: "已有",
  filterUnselectedCompact: "缺少",
  cardValues: { A: "A", J: "J", Q: "Q", K: "K" },
  footerLove: "愛",
  cardName: (value, suit) => `${suit}${value}`,
  storageError: "變更已套用，但無法儲存在此瀏覽器中。",
  cardSizeLabel: "卡牌大小",
  zoomOut: "縮小卡牌",
  zoomIn: "放大卡牌",
});
Object.assign(I18N.ja, {
  filterAllCompact: "全て",
  filterSelectedCompact: "所持",
  filterUnselectedCompact: "不足",
  cardValues: { A: "エース", J: "ジャック", Q: "クイーン", K: "キング" },
  footerLove: "愛",
  cardName: (value, suit) => `${suit}の${value}`,
  storageError: "変更は適用されましたが、このブラウザーに保存できませんでした。",
  cardSizeLabel: "カードの大きさ",
  zoomOut: "カードを小さくする",
  zoomIn: "カードを大きくする",
});
Object.assign(I18N.ko, {
  filterAllCompact: "전체",
  filterSelectedCompact: "보유",
  filterUnselectedCompact: "미보유",
  cardValues: { A: "에이스", J: "잭", Q: "퀸", K: "킹" },
  footerLove: "사랑",
  cardName: (value, suit) => `${suit} ${value}`,
  storageError: "변경 사항이 적용되었지만 이 브라우저에 저장할 수 없습니다.",
  cardSizeLabel: "카드 크기",
  zoomOut: "카드 축소",
  zoomIn: "카드 확대",
});

for (const locale of Object.values(I18N)) {
  Object.freeze(locale);
}
Object.freeze(I18N);

const VALID_CARD_IDS = new Set([
  ...SUITS.flatMap((suit) => VALUES_ASCENDING.map((value) => `${suit.id}-${value}`)),
  ...JOKERS.map((joker) => joker.id),
]);

const LEGACY_SUIT_IDS = Object.freeze({
  cuori: "hearts",
  quadri: "diamonds",
  fiori: "clubs",
  picche: "spades",
});

const LEGACY_CARD_IDS = Object.freeze({
  "jolly-rosso": "joker-red",
  "jolly-nero": "joker-black",
});

const elements = {
  toolbar: document.querySelector(".toolbar"),
  deckContainer: document.querySelector("#deckContainer"),
  layoutButton: document.querySelector("#layoutButton"),
  layoutIcon: document.querySelector("#layoutIcon"),
  sortOrderButton: document.querySelector("#sortOrderButton"),
  zoomControls: document.querySelector(".zoom-controls"),
  zoomOutButton: document.querySelector("#zoomOutButton"),
  zoomInButton: document.querySelector("#zoomInButton"),
  languageMenu: document.querySelector(".language-menu"),
  languageMenuList: document.querySelector(".language-menu__list"),
  activeLanguageFlag: document.querySelector("#activeLanguageFlag"),
  themeButton: document.querySelector("#themeButton"),
  interactionLockButton: document.querySelector("#interactionLockButton"),
  exportButton: document.querySelector("#exportButton"),
  importButton: document.querySelector("#importButton"),
  importFile: document.querySelector("#importFile"),
  selectionStatus: document.querySelector("#selectionStatus"),
  footerHeart: document.querySelector("#footerHeart"),
  toast: document.querySelector("#toast"),
  sortIconUse: document.querySelector("#sortIconUse"),
};

const state = {
  selectedCards: loadSelectedCards(),
  language: loadLanguage(),
  theme: loadTheme(),
  interactionLocked: loadInteractionLocked(),
  filter: "all",
  layout: "suit",
  sortOrder: "asc",
  cardSize: "medium",
  collapsedGroups: new Set(),
};

let toastTimer;

function safeParse(value, fallback) {
  try {
    return JSON.parse(value);
  } catch {
    return fallback;
  }
}

function getStorageItem(key) {
  try {
    return localStorage.getItem(key);
  } catch {
    return null;
  }
}

function setStorageItem(key, value) {
  try {
    localStorage.setItem(key, value);
  } catch {
    return false;
  }

  return true;
}

function migrateCardId(cardId) {
  if (VALID_CARD_IDS.has(cardId)) {
    return cardId;
  }

  if (Object.hasOwn(LEGACY_CARD_IDS, cardId)) {
    return LEGACY_CARD_IDS[cardId];
  }

  const separatorIndex = cardId.lastIndexOf("-");
  if (separatorIndex < 1) {
    return null;
  }

  const legacySuitId = cardId.slice(0, separatorIndex);
  const value = cardId.slice(separatorIndex + 1);
  const currentSuitId = LEGACY_SUIT_IDS[legacySuitId];
  const migratedId = currentSuitId ? `${currentSuitId}-${value}` : null;
  return migratedId && VALID_CARD_IDS.has(migratedId) ? migratedId : null;
}

function normalizeSelectedCards(candidate) {
  if (candidate === null || typeof candidate !== "object" || Array.isArray(candidate)) {
    return null;
  }

  const normalized = {};
  for (const [cardId, selected] of Object.entries(candidate)) {
    const migratedCardId = migrateCardId(cardId);
    if (!migratedCardId || selected !== true) {
      return null;
    }
    normalized[migratedCardId] = true;
  }

  return normalized;
}

function normalizeConfiguration(candidate) {
  if (
    candidate !== null &&
    typeof candidate === "object" &&
    !Array.isArray(candidate) &&
    Object.hasOwn(candidate, "schemaVersion")
  ) {
    if (
      candidate.schemaVersion !== EXPORT_SCHEMA_VERSION ||
      !Object.hasOwn(I18N, candidate.language) ||
      (candidate.theme !== "light" && candidate.theme !== "dark")
    ) {
      return null;
    }

    const selectedCards = normalizeSelectedCards(candidate.selectedCards);
    return selectedCards === null
      ? null
      : { selectedCards, language: candidate.language, theme: candidate.theme };
  }

  const selectedCards = normalizeSelectedCards(candidate);
  return selectedCards === null
    ? null
    : { selectedCards, language: state.language, theme: state.theme };
}

function loadSelectedCards() {
  const currentValue = getStorageItem(STORAGE_KEYS.selectedCards);
  const legacyValue = getStorageItem(LEGACY_STORAGE_KEYS.selectedCards);
  const normalized = normalizeSelectedCards(safeParse(currentValue ?? legacyValue, null)) ?? {};

  if (!currentValue && legacyValue) {
    setStorageItem(STORAGE_KEYS.selectedCards, JSON.stringify(normalized));
  }

  return normalized;
}

function loadLanguage() {
  const storedLanguage =
    getStorageItem(STORAGE_KEYS.language) ??
    getStorageItem(LEGACY_STORAGE_KEYS.language);
  return Object.hasOwn(I18N, storedLanguage) ? storedLanguage : "it";
}

function loadTheme() {
  const storedTheme =
    getStorageItem(STORAGE_KEYS.theme) ??
    getStorageItem(LEGACY_STORAGE_KEYS.theme);
  if (storedTheme === "light" || storedTheme === "dark") {
    return storedTheme;
  }

  return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
}

function loadInteractionLocked() {
  return getStorageItem(STORAGE_KEYS.interactionLocked) === "true";
}

function translate() {
  return I18N[state.language];
}

function saveSelectedCards() {
  return setStorageItem(STORAGE_KEYS.selectedCards, JSON.stringify(state.selectedCards));
}

function updateInterfaceText() {
  const text = translate();
  document.documentElement.lang = state.language;
  document.title = text.pageTitle;
  elements.toolbar.setAttribute("aria-label", text.toolbarLabel);
  elements.deckContainer.setAttribute("aria-label", text.deckLabel);
  document.querySelector(".brand").setAttribute("aria-label", text.brandLabel);

  const labels = {
    brandName: text.brandName,
    filterLegend: text.filterLegend,
    filterAllLabel: text.filterAll,
    filterSelectedLabel: text.filterSelected,
    filterUnselectedLabel: text.filterUnselected,
    filterAllCompactLabel: text.filterAllCompact,
    filterSelectedCompactLabel: text.filterSelectedCompact,
    filterUnselectedCompactLabel: text.filterUnselectedCompact,
    footerMadeWith: text.footerMadeWith,
  };

  for (const [id, value] of Object.entries(labels)) {
    document.querySelector(`#${id}`).textContent = value;
  }

  const filterLabels = {
    all: text.filterAll,
    selected: text.filterSelected,
    unselected: text.filterUnselected,
  };
  for (const radio of document.querySelectorAll('input[name="filter"]')) {
    radio.setAttribute("aria-label", filterLabels[radio.value]);
  }

  updateLanguageButtons();
  elements.exportButton.setAttribute("aria-label", text.exportButton);
  elements.exportButton.title = text.exportButton;
  elements.importButton.setAttribute("aria-label", text.importLabel);
  elements.importButton.title = text.importLabel;
  elements.footerHeart.setAttribute("aria-label", text.footerLove);
  elements.zoomControls.setAttribute("aria-label", text.cardSizeLabel);
  elements.zoomOutButton.setAttribute("aria-label", text.zoomOut);
  elements.zoomOutButton.title = text.zoomOut;
  elements.zoomInButton.setAttribute("aria-label", text.zoomIn);
  elements.zoomInButton.title = text.zoomIn;
  document.querySelector("#githubLink").setAttribute("aria-label", text.githubLinkLabel);
  document.querySelector("#githubLink").title = text.githubLinkLabel;
  updateLayoutButton();
  updateSortButton();
  updateZoomButtons();
  updateThemeButton();
  updateInteractionLock();
  updateSelectionStatus();
}

function applyTheme() {
  document.documentElement.dataset.theme = state.theme;
  updateThemeButton();
}

function updateThemeButton() {
  const text = translate();
  const isLight = state.theme === "light";
  const label = isLight ? text.themeDark : text.themeLight;

  elements.themeButton.setAttribute("aria-label", label);
  elements.themeButton.title = label;
  elements.themeButton.replaceChildren(createIcon(isLight ? "moon" : "sun"));
}

function updateInteractionLock() {
  const text = translate();
  const label = state.interactionLocked ? text.unlockCards : text.lockCards;
  elements.interactionLockButton.setAttribute("aria-label", label);
  elements.interactionLockButton.setAttribute("aria-pressed", String(state.interactionLocked));
  elements.interactionLockButton.title = label;
  elements.interactionLockButton.replaceChildren(
    createIcon(state.interactionLocked ? "lock" : "lock-open-2"),
  );
  elements.deckContainer.dataset.locked = String(state.interactionLocked);
  for (const card of elements.deckContainer.querySelectorAll(".card")) {
    card.disabled = state.interactionLocked;
  }
}

function updateLanguageButtons() {
  const text = translate();
  const activeLanguage = LANGUAGE_OPTIONS.find(({ code }) => code === state.language);
  elements.languageMenu.querySelector("summary").setAttribute("aria-label", text.languageLabel);
  elements.languageMenu.querySelector("summary").title = text.languageLabel;
  elements.languageMenuList.setAttribute("aria-label", text.languageLabel);
  for (const button of elements.languageMenuList.querySelectorAll(".language-button")) {
    const language = LANGUAGE_OPTIONS.find(({ code }) => code === button.dataset.language);
    const label = `${text.languageLabel}: ${language.name}`;
    button.setAttribute("aria-pressed", String(button.dataset.language === state.language));
    button.setAttribute("aria-label", label);
    button.title = label;
  }
  elements.activeLanguageFlag.textContent = activeLanguage.flag;
}

function renderLanguageMenu() {
  const fragment = document.createDocumentFragment();
  for (const language of LANGUAGE_OPTIONS) {
    const item = document.createElement("li");
    const button = document.createElement("button");
    const flag = document.createElement("span");
    const name = document.createElement("span");

    button.type = "button";
    button.className = "language-button";
    button.dataset.language = language.code;
    button.lang = language.code;
    flag.className = "language-flag";
    flag.setAttribute("aria-hidden", "true");
    flag.textContent = language.flag;
    name.textContent = language.name;
    button.append(flag, name);
    button.addEventListener("click", () => {
      state.language = language.code;
      const saved = setStorageItem(STORAGE_KEYS.language, state.language);
      updateInterfaceText();
      renderDeck();
      elements.languageMenu.open = false;
      if (!saved) {
        showToast(translate().storageError);
      }
    });
    item.append(button);
    fragment.append(item);
  }
  elements.languageMenuList.replaceChildren(fragment);
}

function createIcon(iconId) {
  const namespace = "http://www.w3.org/2000/svg";
  const icon = document.createElementNS(namespace, "svg");
  const use = document.createElementNS(namespace, "use");
  icon.setAttribute("aria-hidden", "true");
  use.setAttribute("href", `#${iconId}`);
  icon.append(use);
  return icon;
}

function updateLayoutButton() {
  const text = translate();
  const groupedBySuit = state.layout === "suit";
  const iconIds = groupedBySuit
    ? ["diamonds", "clubs", "heart", "spade"]
    : ["play-card-1", "play-card-2", "play-card-3", "play-card-4"];
  elements.layoutIcon.replaceChildren(...iconIds.map(createIcon));
  const label = groupedBySuit ? text.layoutSuitTooltip : text.layoutValueTooltip;
  elements.layoutButton.setAttribute("aria-label", label);
  elements.layoutButton.title = label;
}

function updateSortButton() {
  const text = translate();
  const ascending = state.sortOrder === "asc";
  elements.sortIconUse.setAttribute(
    "href",
    `#${ascending ? "sort-ascending-letters" : "sort-descending-letters"}`,
  );
  const label = ascending ? text.sortAscendingButtonTooltip : text.sortDescendingButtonTooltip;
  const title = ascending ? text.sortAscendingTooltip : text.sortDescendingTooltip;
  elements.sortOrderButton.setAttribute("aria-label", label);
  elements.sortOrderButton.title = title;
}

function updateZoomButtons() {
  const sizeIndex = CARD_SIZES.indexOf(state.cardSize);
  elements.deckContainer.dataset.cardSize = state.cardSize;
  elements.zoomOutButton.disabled = sizeIndex === 0;
  elements.zoomInButton.disabled = sizeIndex === CARD_SIZES.length - 1;
}

function getCardName(cardId) {
  const text = translate();
  const joker = JOKERS.find((candidate) => candidate.id === cardId);
  if (joker) {
    return joker.color === "red" ? text.jokerRed : text.jokerBlack;
  }

  const separatorIndex = cardId.lastIndexOf("-");
  const suitId = cardId.slice(0, separatorIndex);
  const value = cardId.slice(separatorIndex + 1);
  return text.cardName(text.cardValues[value] ?? value, text.suits[suitId]);
}

function createCard(cardId, value, symbol, color, isJoker = false) {
  const card = document.createElement("button");
  card.type = "button";
  card.className = `card${color === "red" ? " card--red" : ""}`;
  card.dataset.cardId = cardId;
  card.dataset.selected = state.selectedCards[cardId] ? "true" : "false";
  card.setAttribute("aria-pressed", card.dataset.selected);
  card.disabled = state.interactionLocked;

  const valueElement = document.createElement("span");
  valueElement.className = isJoker ? "card__joker" : "card__value";
  valueElement.textContent = value;

  const suitElement = isJoker ? createIcon("joker") : document.createElement("span");
  suitElement.setAttribute("class", isJoker ? "card__joker-icon" : "card__suit");
  if (!isJoker) {
    suitElement.textContent = symbol;
    suitElement.setAttribute("aria-hidden", "true");
  }

  card.append(valueElement, suitElement);
  updateCardAccessibleName(card);
  card.addEventListener("click", () => toggleCard(card));
  return card;
}

function updateCardAccessibleName(card) {
  const text = translate();
  const cardName = getCardName(card.dataset.cardId);
  const selected = card.dataset.selected === "true";
  card.setAttribute("aria-label", selected ? text.deselectCard(cardName) : text.selectCard(cardName));
}

function toggleCard(card) {
  const cardId = card.dataset.cardId;
  const selected = card.dataset.selected === "true";
  const cards = [...elements.deckContainer.querySelectorAll(".card")];
  const cardIndex = cards.indexOf(card);

  if (selected) {
    delete state.selectedCards[cardId];
  } else {
    state.selectedCards[cardId] = true;
  }

  card.dataset.selected = String(!selected);
  card.setAttribute("aria-pressed", String(!selected));
  updateCardAccessibleName(card);
  const saved = saveSelectedCards();
  applyFilter();
  if (card.hidden) {
    const nextVisible =
      cards.slice(cardIndex + 1).find((candidate) => !candidate.hidden) ??
      cards.slice(0, cardIndex).reverse().find((candidate) => !candidate.hidden);
    const focusTarget =
      nextVisible ?? document.querySelector('input[name="filter"]:checked');
    focusTarget.focus();
  }
  updateSelectionStatus();
  updateGroupCounts();
  if (!saved) {
    showToast(translate().storageError);
  }
}

function createGroup(groupId, title) {
  const group = document.createElement("details");
  group.className = "card-group";
  group.dataset.groupId = groupId;
  group.open = !state.collapsedGroups.has(groupId);

  const summary = document.createElement("summary");
  const titleElement = document.createElement("span");
  titleElement.textContent = title;
  const count = document.createElement("span");
  count.className = "card-group__count";
  summary.append(titleElement, count);

  const row = document.createElement("div");
  row.className = "card-row";

  group.append(summary, row);
  group.addEventListener("toggle", () => {
    if (group.open) {
      state.collapsedGroups.delete(groupId);
    } else {
      state.collapsedGroups.add(groupId);
    }
  });
  return { group, row };
}

function renderDeck() {
  const text = translate();
  const values = state.sortOrder === "asc" ? VALUES_ASCENDING : VALUES_DESCENDING;
  const fragment = document.createDocumentFragment();
  elements.deckContainer.dataset.layout = state.layout;

  if (state.layout === "suit") {
    for (const suit of SUITS) {
      const { group, row } = createGroup(`suit-${suit.id}`, text.suits[suit.id]);
      for (const value of values) {
        row.append(createCard(`${suit.id}-${value}`, value, suit.symbol, suit.color));
      }
      fragment.append(group);
    }
  } else {
    for (const value of values) {
      const { group, row } = createGroup(`value-${value}`, text.values[value]);
      for (const suit of SUITS) {
        row.append(createCard(`${suit.id}-${value}`, value, suit.symbol, suit.color));
      }
      fragment.append(group);
    }
  }

  const { group: jokerGroup, row: jokerRow } = createGroup("jokers", text.joker);
  jokerGroup.classList.add("card-group--jokers");
  for (const joker of JOKERS) {
    jokerRow.append(createCard(joker.id, text.joker, "", joker.color, true));
  }
  fragment.append(jokerGroup);

  elements.deckContainer.replaceChildren(fragment);
  applyFilter();
  updateSelectionStatus();
  updateGroupCounts();
}

function applyFilter() {
  const groups = elements.deckContainer.querySelectorAll(".card-group");

  for (const group of groups) {
    let visibleCards = 0;
    for (const card of group.querySelectorAll(".card")) {
      const selected = card.dataset.selected === "true";
      const visible =
        state.filter === "all" ||
        (state.filter === "selected" && selected) ||
        (state.filter === "unselected" && !selected);

      card.hidden = !visible;
      if (visible) {
        visibleCards += 1;
      }
    }
    group.hidden = visibleCards === 0;
  }
}

function updateSelectionStatus() {
  const selected = Object.keys(state.selectedCards).length;
  const total = VALID_CARD_IDS.size;
  const missing = total - selected;
  const summary = translate().selectionSummary(selected, missing, total);
  elements.selectionStatus.textContent = `${selected} / ${String(missing).padStart(2, "0")} / ${total}`;
  elements.selectionStatus.setAttribute("aria-label", summary);
  elements.selectionStatus.title = summary;
}

function updateGroupCounts() {
  const text = translate();
  for (const group of elements.deckContainer.querySelectorAll(".card-group")) {
    const cards = group.querySelectorAll(".card");
    const selected = group.querySelectorAll('.card[data-selected="true"]').length;
    group.querySelector(".card-group__count").textContent = text.groupCount(selected, cards.length);
  }
}

function exportConfiguration() {
  const now = new Date();
  const timestamp = [
    now.getFullYear(),
    String(now.getMonth() + 1).padStart(2, "0"),
    String(now.getDate()).padStart(2, "0"),
    "_",
    String(now.getHours()).padStart(2, "0"),
    String(now.getMinutes()).padStart(2, "0"),
    String(now.getSeconds()).padStart(2, "0"),
  ].join("");

  const configuration = {
    schemaVersion: EXPORT_SCHEMA_VERSION,
    selectedCards: state.selectedCards,
    language: state.language,
    theme: state.theme,
  };
  const blob = new Blob([`${JSON.stringify(configuration, null, 2)}\n`], {
    type: "application/json",
  });
  const downloadUrl = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = downloadUrl;
  anchor.download = `playing-cards_${timestamp}.json`;
  anchor.click();
  window.setTimeout(() => URL.revokeObjectURL(downloadUrl), 0);
  showToast(translate().exportSuccess);
}

async function importConfiguration(file) {
  try {
    if (file.size > MAX_IMPORT_BYTES) {
      throw new Error("Import file exceeds the size limit");
    }
    const importedValue = safeParse(await file.text(), null);
    const configuration = normalizeConfiguration(importedValue);
    if (configuration === null) {
      throw new Error("Invalid card selection data");
    }

    state.selectedCards = configuration.selectedCards;
    state.language = configuration.language;
    state.theme = configuration.theme;
    const saved = [
      saveSelectedCards(),
      setStorageItem(STORAGE_KEYS.language, state.language),
      setStorageItem(STORAGE_KEYS.theme, state.theme),
    ].every(Boolean);
    applyTheme();
    updateInterfaceText();
    renderDeck();
    showToast(saved ? translate().importSuccess : translate().storageError);
  } catch (error) {
    console.error(error);
    showToast(translate().importError);
  } finally {
    elements.importFile.value = "";
  }
}

function showToast(message) {
  window.clearTimeout(toastTimer);
  elements.toast.textContent = message;
  elements.toast.hidden = false;
  toastTimer = window.setTimeout(() => {
    elements.toast.hidden = true;
  }, 3000);
}

function bindEvents() {
  elements.layoutButton.addEventListener("click", () => {
    state.layout = state.layout === "suit" ? "value" : "suit";
    updateLayoutButton();
    renderDeck();
  });
  elements.sortOrderButton.addEventListener("click", () => {
    state.sortOrder = state.sortOrder === "asc" ? "desc" : "asc";
    updateSortButton();
    renderDeck();
  });
  elements.zoomOutButton.addEventListener("click", () => {
    const sizeIndex = CARD_SIZES.indexOf(state.cardSize);
    state.cardSize = CARD_SIZES[Math.max(0, sizeIndex - 1)];
    updateZoomButtons();
  });
  elements.zoomInButton.addEventListener("click", () => {
    const sizeIndex = CARD_SIZES.indexOf(state.cardSize);
    state.cardSize = CARD_SIZES[Math.min(CARD_SIZES.length - 1, sizeIndex + 1)];
    updateZoomButtons();
  });

  elements.themeButton.addEventListener("click", () => {
    state.theme = state.theme === "light" ? "dark" : "light";
    const saved = setStorageItem(STORAGE_KEYS.theme, state.theme);
    applyTheme();
    if (!saved) {
      showToast(translate().storageError);
    }
  });

  elements.interactionLockButton.addEventListener("click", () => {
    state.interactionLocked = !state.interactionLocked;
    const saved = setStorageItem(
      STORAGE_KEYS.interactionLocked,
      String(state.interactionLocked),
    );
    updateInteractionLock();
    if (!saved) {
      showToast(translate().storageError);
    }
  });

  elements.exportButton.addEventListener("click", exportConfiguration);
  elements.importButton.addEventListener("click", () => elements.importFile.click());
  elements.importFile.addEventListener("change", (event) => {
    const [file] = event.target.files;
    if (file) {
      importConfiguration(file);
    }
  });

  for (const radio of document.querySelectorAll('input[name="filter"]')) {
    radio.addEventListener("change", (event) => {
      state.filter = event.target.value;
      applyFilter();
    });
  }
}

function initialize() {
  renderLanguageMenu();
  applyTheme();
  updateInterfaceText();
  bindEvents();
  renderDeck();
}

initialize();
