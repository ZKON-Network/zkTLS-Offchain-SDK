import { OracleResponse, RequestObject } from './getProof.js';
/**
 *
 * The ZKON Class is responsible for working of the provable-data-sdk provided by Zkon Network. It is a simple class which recieves an
 * encapsulated `ResquestObject`
 *
 *
 * @example
 * ```ts
 * const apiKey = 'foobar';
 * const oracle = 'http://127.0.0.1:3000/'
 * const zkon =  new ZKON(apiKey, oracle);
 * ```
 */
declare class ZKON {
    /**
     * @private The API-Key given by Zkon development team.
     */
    private apiKey;
    /**
     * @private The Oracle address of the Zkon-Oracle Network.
     */
    private oracleURL;
    /**
     * Creates an Object which can be used to request data from data-source.
     * @param {string} apiKey - The API-Key given by Zkon development team.
     * @param {string} oracleURL - The Oracle address of the Zkon-Oracle Network.
     */
    constructor(apiKey: string, oracleURL: string);
    /**
     * Request data from a data-source, and get a ZK Proof about the authenticity of the data-transfer,
     * and the data.
     *
     * @param req
     * The Object notation in which data is provided to the Zkon-Provable API.
     * This is in form of:
     * ```ts
     * {
     *  method:"HTTPS Method in which the data-feed endpoint is to be accessed.",
     *  baseURL:"Datafeed API Endpoint.",
     *  path:"The key with-in the response, which is to be included in the proof."
     * }
     * ```
     *
     * @example
     * ```ts
     * await zkon.request({
     * method:"GET",
     * baseURL:"api.binance.com/api/v3/avgPrice?symbol=BTCUSDT",
     * path:"price" });
     * ```
     *
     * @returns
     * OracleRespone object.
     */
    request(req: RequestObject, proofDeferred?: boolean): Promise<OracleResponse>;
    /**
     * Used to fetch string-data from a data-source.
     * @param req
     * @returns
     */
    requestStringProof(req: RequestObject, proofDeferred?: boolean): Promise<OracleResponse>;
}
export default ZKON;
