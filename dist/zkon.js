import getRequestProof from './getProof';
class ZKON {
    constructor(apiKey, oracleURL) {
        this.apiKey = apiKey;
        this.oracleURL = oracleURL;
    }
    async request(req) {
        return getRequestProof(this.apiKey, this.oracleURL, req);
    }
}
export default ZKON;
//# sourceMappingURL=zkon.js.map