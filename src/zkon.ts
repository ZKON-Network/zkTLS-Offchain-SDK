import getRequestProof, { OracleResponse, RequestObject } from './getProof';

class ZKON {

    private apiKey;
    private oracleURL;

    constructor(apiKey: string, oracleURL: string) {
        this.apiKey = apiKey;
        this.oracleURL = oracleURL;
    }

    async request(req: RequestObject): Promise<OracleResponse>  {
        return getRequestProof(this.apiKey, this.oracleURL, req);
    }
}

export default ZKON;
