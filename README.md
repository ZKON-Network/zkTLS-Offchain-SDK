# zkTLS Offchain SDK | ZKON
ZKON SDK is a lightweight offchain software development kit that allows developers to integrate provable data transfer records into their services over HTTPS connections. By utilizing this SDK, you can easily verify data transfers with cryptographic proofs, ensuring secure and reliable operations. The SDK is designed for flexibility, enabling it to be seamlessly incorporated into various use cases where off-chain provability is required.

## How to fetch off-chain provable data

Version v0.0.1-preview

### Setup


Add the ZKON sdk as a dependency in your javascript project. 


package.json

```json
  "dependencies": {
    "zkon-sdk": "git://github.com/ZKON-Network/provable-data-sdk.git#main"
  }
```


You will need to manually compile the mina-fungible-token dep. To do so create a file called build-mina-fungible-token.js in the root with the following content:

```js
import * as fs from 'fs';

const configFile = 'node_modules/mina-fungible-token/tsconfig.json';
const content = JSON.parse(fs.readFileSync(configFile));
delete content.compilerOptions.typeRoots;
fs.writeFileSync(configFile, JSON.stringify(content, null, 4));
```


Then modify your package.json to execute the file after the installation.

```json
  "scripts": {
    "prepare": "node build-mina-fungible-token.js && cd node_modules/mina-fungible-token && npm run build"
  },
```

### Coding

Import the ZKON SDK.

```tsx
import { ZKON } from 'zkon-sdk';
```

Instance the SDK.

```tsx
const zkon = new ZKON(apiKey, oracle);
```

The apiKey and oracle will be provided by ZKON.

Do the request:

```tsx
console.log(await zkon.request({
  method: "GET",
  baseUrl: "api.binance.com/api/v3/avgPrice?symbol=BTCUSDT",
  path: "price",
}));
```
