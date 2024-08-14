import axios from 'axios';
import { Bytes, Field } from 'o1js';
import { P256Data, PublicArgumets, ZkonZkProgram } from './zkProgram.js';
require('dotenv').config();

interface RequestObject {
  method: string;
  baseUrl: string;  
  path: string;  
}
interface OracleResponse {
  p256data: P256Data;
  publicArguments: PublicArgumets;  
}

interface OracleResponse2 {
  p256data: string;
  publicArguments: string;  
}

export async function getRequestProof(req: RequestObject){
  try{    
    const response: any = await axios.post(process.env.API_BASE_URL!, req, { headers: {'x-api-key':process.env.API_KEY} });
    const oracleResponse : OracleResponse = response.data;    
    // const zkonzkP = await ZkonZkProgram.compile();
    // const proof = await ZkonZkProgram.verifySource(
    //     publicArguments,
    //     D,
    //     p256data
    // );
    
    // const resultZk = await verify(proof.toJSON(), zkonzkP.verificationKey);
    console.log(oracleResponse);
  }catch(error){
    console.log(error);
  } 
}

getRequestProof({
  method: "GET",
  baseUrl: "r-api.e-grains.com/v1/esoy/info",
  path: "data,availableSupply"
});