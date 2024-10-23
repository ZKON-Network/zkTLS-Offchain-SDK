import { Field } from 'o1js';
import { ECDSAHelper, PublicArgumets } from 'zkon-zkapp';
export interface RequestObject {
    method: string;
    baseURL: string;
    path: string;
}
export interface OracleResponse {
    p256data: ECDSAHelper;
    signatureCompressed: string;
    messageHex: string;
    publicArguments: PublicArgumets;
    decommitment: Field;
}
export declare function getRequestProof(apiKey: string, oracleURL: string, req: RequestObject): Promise<OracleResponse>;
export default getRequestProof;
