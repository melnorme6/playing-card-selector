import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";
import vm from "node:vm";

const appSource = await readFile(new URL("../assets/js/app.js", import.meta.url), "utf8");
const htmlSource = await readFile(new URL("../index.html", import.meta.url), "utf8");
const cssSource = await readFile(new URL("../assets/css/styles.css", import.meta.url), "utf8");
const readmeSource = await readFile(new URL("../README.md", import.meta.url), "utf8");
const offlineReadmeSource = await readFile(new URL("../README-OFFLINE.txt", import.meta.url), "utf8");
const releaseWorkflowSource = await readFile(
  new URL("../.github/workflows/release.yml", import.meta.url),
  "utf8",
);

function loadDataModel() {
  const modelEnd = appSource.indexOf("const elements =");
  const functionsStart = appSource.indexOf("function migrateCardId");
  const functionsEnd = appSource.indexOf("function loadSelectedCards");
  assert.notEqual(modelEnd, -1, "data-model boundary must exist");
  assert.notEqual(functionsStart, -1, "normalization functions must exist");
  assert.notEqual(functionsEnd, -1, "normalization boundary must exist");

  const context = {};
  vm.createContext(context);
  vm.runInContext(
    `${appSource.slice(0, modelEnd)}
      ${appSource.slice(functionsStart, functionsEnd)}
      const state = { language: "it", theme: "light" };
      globalThis.testApi = {
        normalizeConfiguration,
        normalizeSelectedCards,
        validCardCount: VALID_CARD_IDS.size,
        languages: Object.keys(I18N),
        languageOptions: LANGUAGE_OPTIONS.map(({ code }) => code),
        localeAudit: Object.fromEntries(
          Object.entries(I18N).map(([code, locale]) => [
            code,
            {
              stringKeys: Object.entries(locale)
                .filter(([, value]) => typeof value === "string")
                .map(([key]) => key),
              functionKeys: Object.entries(locale)
                .filter(([, value]) => typeof value === "function")
                .map(([key]) => key),
              suits: Object.keys(locale.suits),
              values: Object.keys(locale.values),
              cardValues: Object.keys(locale.cardValues),
            },
          ]),
        ),
      };`,
    context,
  );
  return context.testApi;
}

test("application JavaScript parses", () => {
  assert.doesNotThrow(() => new Function(appSource));
});

test("data model contains a complete 54-card deck and all advertised locales", () => {
  const model = loadDataModel();
  assert.equal(model.validCardCount, 54);
  assert.deepEqual(
    [...model.languages].sort(),
    ["de", "en", "es-419", "fr", "it", "ja", "ko", "pt-BR", "ru", "tr", "zh-Hans", "zh-Hant"].sort(),
  );
  assert.deepEqual([...model.languageOptions].sort(), [...model.languages].sort());
});

test("every locale has the complete interface translation contract", () => {
  const { localeAudit } = loadDataModel();
  const requiredStrings = [
    "pageTitle", "brandName", "toolbarLabel", "layoutSuitTooltip", "layoutValueTooltip",
    "filterLegend", "filterAll", "filterSelected", "filterUnselected", "exportButton",
    "importLabel", "languageLabel", "footerMadeWith", "footerLove", "deckLabel", "joker",
    "jokerRed", "jokerBlack", "sortAscendingTooltip", "sortDescendingTooltip",
    "sortAscendingButtonTooltip", "sortDescendingButtonTooltip", "cardSizeLabel", "zoomOut",
    "zoomIn", "themeDark", "themeLight", "exportSuccess", "importSuccess", "importError",
    "storageError",
  ];
  const requiredFunctions = [
    "selectionSummary", "groupCount", "cardName", "selectCard", "deselectCard",
  ];

  for (const [code, audit] of Object.entries(localeAudit)) {
    assert.deepEqual(
      [...audit.suits].sort(),
      ["clubs", "diamonds", "hearts", "spades"],
      `${code} suits`,
    );
    assert.equal(audit.values.length, 13, `${code} card ranks`);
    assert.deepEqual([...audit.cardValues].sort(), ["A", "J", "K", "Q"], `${code} face names`);
    for (const key of requiredStrings) {
      assert.ok(audit.stringKeys.includes(key), `${code}.${key} must be a translated string`);
    }
    for (const key of requiredFunctions) {
      assert.ok(audit.functionKeys.includes(key), `${code}.${key} must be a formatter`);
    }
  }
});

test("versioned configurations validate cards, language, and theme", () => {
  const { normalizeConfiguration } = loadDataModel();
  const result = normalizeConfiguration({
    schemaVersion: 1,
    selectedCards: { "hearts-A": true, "joker-black": true },
    language: "en",
    theme: "dark",
  });

  assert.deepEqual(
    JSON.parse(JSON.stringify(result)),
    {
      selectedCards: { "hearts-A": true, "joker-black": true },
      language: "en",
      theme: "dark",
    },
  );
  assert.equal(
    normalizeConfiguration({
      schemaVersion: 2,
      selectedCards: {},
      language: "en",
      theme: "light",
    }),
    null,
  );
});

test("legacy exports migrate identifiers and reject unknown data", () => {
  const { normalizeConfiguration, normalizeSelectedCards } = loadDataModel();
  const legacy = normalizeConfiguration({ "cuori-A": true, "jolly-rosso": true });

  assert.deepEqual(
    JSON.parse(JSON.stringify(legacy)),
    {
      selectedCards: { "hearts-A": true, "joker-red": true },
      language: "it",
      theme: "light",
    },
  );
  assert.equal(normalizeSelectedCards({ "not-a-card": true }), null);
  assert.equal(normalizeSelectedCards({ "hearts-A": false }), null);
});

test("HTML keeps behavior external and exposes an operable import button", () => {
  assert.match(htmlSource, /<button[^>]+id="importButton"/);
  assert.doesNotMatch(htmlSource, /<label[^>]+id="importLabel"/);
  assert.doesNotMatch(htmlSource, /<script(?![^>]*\bsrc=)/);
  assert.match(htmlSource, /<script src="assets\/js\/app\.js"><\/script>\s*<\/body>/);
});

test("privacy controls block application network requests and referrer leakage", () => {
  assert.match(htmlSource, /name="referrer" content="no-referrer"/);
  assert.match(htmlSource, /Content-Security-Policy/);
  assert.match(htmlSource, /connect-src 'none'/);
  assert.doesNotMatch(
    appSource,
    /\b(?:fetch|XMLHttpRequest|WebSocket|EventSource)\s*\(|navigator\.sendBeacon/,
  );
});

test("card zoom controls use the local Tabler icons", () => {
  assert.match(htmlSource, /<symbol id="zoom-in"/);
  assert.match(htmlSource, /<symbol id="zoom-out"/);
  assert.match(htmlSource, /<button[^>]+id="zoomOutButton"/);
  assert.match(htmlSource, /<button[^>]+id="zoomInButton"/);
});

test("responsive grids contain overflow within their card groups", () => {
  assert.match(
    cssSource,
    /\.deck\[data-layout="suit"\] \.card-row\s*\{[^}]*overflow-x:\s*auto;/s,
  );
  assert.match(
    cssSource,
    /\.deck\[data-layout="value"\]\s*\{[^}]*repeat\(auto-fill,\s*min\(/s,
  );
  assert.match(cssSource, /\.card-group\s*\{[^}]*min-width:\s*0;/s);
  assert.match(
    cssSource,
    /\.deck\[data-layout="value"\] \.card-group--jokers \.card-row\s*\{[^}]*repeat\(4,/s,
  );
  assert.doesNotMatch(
    cssSource,
    /\.deck\[data-layout="value"\] \.card-group--jokers\s*\{[^}]*grid-column:/s,
  );
});

test("public documentation covers online, offline, privacy, and AI-assisted translations", () => {
  assert.match(readmeSource, /https:\/\/melnorme6\.github\.io\/playing-card-selector\//);
  assert.match(readmeSource, /## Use offline/);
  assert.match(readmeSource, /Translations were created with AI assistance/);
  assert.match(readmeSource, /does not accept pull requests/);
  assert.match(readmeSource, /ordinary\s+connection information/);
  assert.match(readmeSource, /no account identifier, email address, browser identifier/);
  assert.match(offlineReadmeSource, /Open index\.html/);
  assert.match(offlineReadmeSource, /makes no automatic network requests/);
  assert.match(offlineReadmeSource, /MIT License without warranty/);
});

test("tag workflow tests and packages a license-complete portable release", () => {
  assert.match(releaseWorkflowSource, /node --test tests\/app\.test\.mjs/);
  assert.match(releaseWorkflowSource, /cp index\.html LICENSE NOTICE/);
  assert.match(releaseWorkflowSource, /cp README-OFFLINE\.txt/);
  assert.match(releaseWorkflowSource, /cp assets\/css\/styles\.css/);
  assert.match(releaseWorkflowSource, /cp assets\/js\/app\.js/);
  assert.match(releaseWorkflowSource, /gh release create/);
});
