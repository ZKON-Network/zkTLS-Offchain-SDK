import { Field } from 'o1js';
import { ECDSAHelper } from 'zkon-zkapp';
/**
 * Interface representing the notation in which a Request Object is constructed.
 *
 * @example
 * const exampleObject: RequestObject = {
 *   method: "GET",
 *   baseURL: "r-api.e-grains.com/v1/esoy/info",
 *   path: "data,availableSupply"
 * }
 *
 *
 * @example
 * const exampleObjectWithBody: RequestObject = {
 *  method: "POST",
 *  baseURL: "data-point/url",
 *  path: "data,path,in,response",
 *  body:{
 *    "name":"John Doe"
 *    "password":"pass"
 *  }
 * }
 *
 * @example
 *
 * const exampleObjectWithHeaders: RequestObject = {
 *  method:"GET",
 *  baseURL:"api.binance.com/api/v3/avgPrice?symbol=BTCUSDT",
 *  path:"price",
 *  headers:{"Host":"api.binance.com"}
 * };
 *
 */
export interface RequestObject {
    /** HTTPs Method to access the Data Feed API. */
    method: string;
    /** Datafeed API Endpoint. */
    baseURL: string;
    /**
     * The key with-in the response of the API endpoint, which is to be included in the proof.
     * @example
     *
     * Suppose,for `"baseURL": "api.binance.com/api/v3/avgPrice?symbol=BTCUSDT"`, the API returns:
     * ```ts
     * Response = { "mins": 5,
     * "price": "62959.73420364",
     * "closeTime": 1728327827320
     * }
     * ```
     *
     * Say you want the proof to include the `price` key of the API-Response. Then populate
     * ```JSON
     * "path":"price"
     * ```
     */
    path: string;
    /** @optional Request Body */
    body?: Record<string, any> | null;
    /**
     * @optional
     * Headers Object.
     * Add Headers in form of { "Key1": "Value1", ..."KeyN":"ValueN" }
     *
     * @example
     * "headers":{
     *  "x-powered-by": "Express",
     *  "x-rapidapi-version": "1.2.6"
     * }
    */
    headers?: Record<string, any> | null;
    /**  */
    proofType?: "string-proof" | "field-proof";
}
/**
 * Interface representing the response object from Zkon Oracle,
 * which is used to generate a zero-knowledge Kimchi proof,
 * regarding the ECDSA Signature of the TLS-Connection.
 */
export interface OracleResponse {
    /** o1js specific data to help with ECDSA Verification.*/
    p256data: ECDSAHelper;
    /** Compressed form of the ECDSA Signature */
    signatureCompressed: string;
    /** Message of the ECDSA Signature */
    messageHex: string;
    /** o1js specific data to help with ECDSA Verification.*/
    publicArguments: Record<string, any>;
    /** o1js specific data to help with ECDSA Verification.*/
    decommitment: Field;
}
/**
 * Responsible for requesting & fetching proof of proveable-data feed, using the Zkon Oracle Network.
 *
 * @param {string} apiKey - The API Key provided by ZKON. To be used as `x-api-key` in headers.
 * @param {string} oracleURL - Address of the Oracle. Example `127.0.0.1:5000`
 * @param {RequestObject} req - The Object which contains the information which is to be fetched and proved.
 *
 * @returns An encapsulated object, which is used to generate a zero-knowledge Kimchi proof, regarding the ECDSA Signature of the TLS-Connection.
 *
 * @example
 * ```ts
 * getRequestProof('foo178xx','http://127.0.0.1:3000/',{
 *   method: "GET",
 *   baseURL: "r-api.e-grains.com/v1/esoy/info",
 *   path: "data,availableSupply"
 * })
 * ```
 */
export declare function getRequestProof(apiKey: string, oracleURL: string, req: RequestObject, proofType?: string): Promise<OracleResponse>;
export default getRequestProof;
