import { fromString as uint8arrayFromString } from "uint8arrays/from-string";
import ethers from "ethers";
import siwe from "siwe";
import { LitNodeClient } from "@lit-protocol/lit-node-client";

// Network available:
// - https://developer.litprotocol.com/v3/network/networks/testnet/
// - https://developer.litprotocol.com/v3/network/networks/mainnet
const NETWORK = "manzano";

const litNodeClient = new LitNodeClient({ network: NETWORK });
await litNodeClient.connect();

const privKey =
  "3dfb4f70b15b6fccc786347aaea445f439a7f10fd10c55dd50cafc3d5a0abac1";
const privKeyBuffer = uint8arrayFromString(privKey, "base16");
const wallet = new ethers.Wallet(privKeyBuffer);

const domain = "localhost";
const origin = "https://localhost/login";
const statement =
  "This is a test statement.  You can put anything you want here.";
const expirationTime = new Date(Date.now() + 60 * 60 * 1000).toISOString();

let nonce = litNodeClient.getLatestBlockhash();

const siweMessage = new siwe.SiweMessage({
  domain,
  address: wallet.address,
  statement,
  uri: origin,
  version: "1",
  chainId: "1",
  nonce,
  expirationTime,
});

const messageToSign = siweMessage.prepareMessage();

const signature = await wallet.signMessage(messageToSign);

const recoveredAddress = ethers.utils.verifyMessage(messageToSign, signature);

if (recoveredAddress !== wallet.address) {
  throw new Error("Recovered address does not match wallet address");
}

const latestBlockhash = litNodeClient.getLatestBlockhash();
console.log("latestBlockhash", latestBlockhash);

const authSig = {
  sig: signature,
  derivedVia: "web3.eth.personal.sign",
  signedMessage: messageToSign,
  address: await wallet.getAddress(),
};

console.log("authSig", authSig);
