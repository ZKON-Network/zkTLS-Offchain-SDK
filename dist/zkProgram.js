"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PublicArgumets = exports.P256Data = exports.ZkonZkProgram = void 0;
const o1js_1 = require("o1js");
const p256_1 = require("@noble/curves/p256");
const utils_1 = require("@noble/hashes/utils");
class P256Data extends (0, o1js_1.Struct)({
    signature: [o1js_1.Field, o1js_1.Field, o1js_1.Field, o1js_1.Field],
    messageHex: [o1js_1.Field, o1js_1.Field, o1js_1.Field, o1js_1.Field, o1js_1.Field, o1js_1.Field, o1js_1.Field, o1js_1.Field, o1js_1.Field, o1js_1.Field, o1js_1.Field, o1js_1.Field]
}) {
}
exports.P256Data = P256Data;
class PublicArgumets extends (0, o1js_1.Struct)({
    commitment: o1js_1.Field,
    dataField: o1js_1.Field
}) {
}
exports.PublicArgumets = PublicArgumets;
const checkECDSA = (message, signature) => {
    const public_key_notary = (0, utils_1.hexToBytes)('0206fdfa148e1916ccc96b40d0149df05825ef54b16b711ccc1b991a4de1c6a12c');
    const messageActual = (0, utils_1.hexToBytes)(message);
    const signatureActual = p256_1.p256.Signature.fromCompact(signature);
    const result = p256_1.p256.verify(signatureActual, messageActual, public_key_notary, { prehash: true });
    return new o1js_1.Bool(result);
};
const ZkonZkProgram = (0, o1js_1.ZkProgram)({
    name: 'zkonProof',
    publicInput: PublicArgumets,
    methods: {
        verifySource: {
            privateInputs: [o1js_1.Field, P256Data],
            async method(commitment, decommitment, p256_data) {
                const assert = (0, o1js_1.Bool)(true);
                o1js_1.Provable.asProver(() => {
                    let concatSignature = ``;
                    let concatMessage = ``;
                    let fixedMessage = [];
                    let fixedSignature = [];
                    p256_data.messageHex.forEach((part, index) => {
                        let data = part.toBigInt().toString(16);
                        if (data.length != 32 && index != 11) {
                            let padding = ``;
                            for (let i = 0; i < (32 - data.length); i++) {
                                padding += '0';
                            }
                            data = padding + data;
                        }
                        if (index == 11 && data.length != 22) {
                            data = '0' + data;
                        }
                        fixedMessage.push(data);
                    });
                    p256_data.signature.forEach((part, index) => {
                        let data = part.toBigInt().toString(16);
                        if (data.length != 32) {
                            let padding = ``;
                            for (let i = 0; i < (32 - data.length); i++) {
                                padding += '0';
                            }
                            data = padding + data;
                        }
                        fixedSignature.push(data);
                    });
                    fixedMessage.forEach((data, index) => {
                        concatMessage += data;
                    });
                    fixedSignature.forEach(data => {
                        concatSignature += data;
                    });
                    console.log(concatSignature);
                    const messageHex = concatMessage;
                    const signature = concatSignature;
                    const checkECDSASignature = checkECDSA(messageHex, signature);
                    assert.assertEquals(checkECDSASignature);
                });
                decommitment.assertEquals(commitment.commitment);
            }
        }
    }
});
exports.ZkonZkProgram = ZkonZkProgram;
exports.default = ZkonZkProgram;
//# sourceMappingURL=zkProgram.js.map