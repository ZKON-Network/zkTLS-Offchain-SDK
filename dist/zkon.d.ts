import { OracleResponse, RequestObject } from './getProof';
declare class ZKON {
    private apiKey;
    private oracleURL;
    constructor(apiKey: string, oracleURL: string);
    request(req: RequestObject): Promise<OracleResponse>;
}
export default ZKON;
