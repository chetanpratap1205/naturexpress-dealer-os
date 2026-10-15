const fs = require('fs');
const path = require('path');

const CORPUS_PATH = path.join(__dirname, 'tataOEMMasterCorpus.json');

class KnowledgeEngine {
  constructor() {
    this.corpus = null;
    this.loadCorpus();
  }

  loadCorpus() {
    try {
      if (fs.existsSync(CORPUS_PATH)) {
        this.corpus = JSON.parse(fs.readFileSync(CORPUS_PATH, 'utf8'));
      }
    } catch (e) {
      console.error("Failed to load OEM Master Corpus:", e);
    }
  }

  getDomainKnowledge(domainKey) {
    if (!this.corpus) this.loadCorpus();
    return this.corpus?.knowledgeDomains?.[domainKey] || null;
  }

  getFRTLaborDetails(modelKey, pmsType) {
    const saDomain = this.getDomainKnowledge('serviceAdvisorRapidIntake');
    const modelData = saDomain?.flatRateTimesLaborCatalogue?.[modelKey];
    return modelData?.[pmsType] || null;
  }

  getDTCTroubleTree(dtcCode) {
    const evDomain = this.getDomainKnowledge('ziptronEVDTCAndDiagnostics');
    return evDomain?.dtcDiagnosticTroubleTrees?.[dtcCode] || null;
  }

  getWarrantyComplianceChecklist() {
    return this.getDomainKnowledge('warrantyZeroRejectionGuidelines');
  }

  getDealershipBenchmarks() {
    return this.getDomainKnowledge('dealerPrincipalMacroEconomics');
  }

  getCREObjectionScript(objectionKey) {
    const creDomain = this.getDomainKnowledge('creTelephonyDripRetainer');
    return creDomain?.objectionHandlingVernacularHindi?.[objectionKey] || null;
  }
}

module.exports = new KnowledgeEngine();
