import axios from 'axios';
import { Bytes, Field, verify } from 'o1js';
import { P256Data, PublicArgumets, ZkonZkProgram } from 'zkon-zkapp';

export interface RequestObject {
  method: string;
  baseUrl: string;  
  path: string;  
}
export interface OracleResponse {
  p256data: P256Data;
  publicArguments: PublicArgumets;
  decommitment: Field;
}

export async function getRequestProof(apiKey: string, oracleURL: string, req: RequestObject): Promise<OracleResponse> {
  try{    
    const response: any = await axios.post(oracleURL, req, { headers: {'x-api-key':apiKey} });
    const oracleResponse : OracleResponse = response.data;    
    const zkonzkP = await ZkonZkProgram.compile();
    const proof = await ZkonZkProgram.verifySource(
      oracleResponse.publicArguments,
      oracleResponse.decommitment,
      oracleResponse.p256data,
    );
    
    const resultZk = await verify(proof.toJSON(), zkonzkP.verificationKey);
    if (!resultZk) {
      throw new Error('Unable to verify proof');
    }
    console.log(oracleResponse);
    return oracleResponse;
  }catch(error){
    console.log(error);
    throw error;
  } 
}

export default getRequestProof;

//Mockdata
/*getRequestProof({
  method: "GET",
  baseUrl: "r-api.e-grains.com/v1/esoy/info",
  path: "data,availableSupply"
});*/