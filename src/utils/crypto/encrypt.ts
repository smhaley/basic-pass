import CryptoJS from "crypto-js";
import type { TableData } from "../../stores/tableStore";

export class BasicCrypto {
  passphrase: string;
  demoEncString =
    "U2FsdGVkX1/bgWGDJ/3RGXuHHtHIkxI90YSMQzAxRQwxDpv7wGit07ZuPG+ZCUsdI/2JoKIHTirCbGqmehLg5GGTDdwcqBxMpV4CjPWYiAPVBjctXuC9rYpJAb8c/T6eXrc7RkldlIb4VXGeMw0UIg==";

  constructor(passphrase: string) {
    this.passphrase = passphrase;
  }

  encryptTable = (tableData: TableData) => {
    const cypherText = CryptoJS.AES.encrypt(
      JSON.stringify(tableData),
      this.passphrase
    ).toString();
    //do electron function here to
    // 1. overwrite existing store with new store

    return cypherText;
  };

  decryptTable = (cypherText: string) => {
    const bytes = CryptoJS.AES.decrypt(cypherText, this.passphrase);
    const decryptedData = JSON.parse(bytes.toString(CryptoJS.enc.Utf8));

    return decryptedData;

    //try catch with error handling
  };

  updateUserStore = (tableData: TableData) => {
    const encryptedTable = this.encryptTable(tableData);

    //store encrypted
    console.log("store the cypherText here", encryptedTable);
  };

  getUserStore = async (userName: string) => {
    console.log("getting store: ", userName);
    return await Promise.resolve(this.demoEncString);
  };

  static getStoreNames = async () => {
    return await Promise.resolve(["shawn", "joe"]);
  };

  login = async (userName: string) => {
    const store = await this.getUserStore(userName);
    return this.decryptTable(store);
  };

  static createNewUserStore = async (username: string, passphrase: string) => {
    console.log("creating new user. need to block on this one", {
      username,
      passphrase,
    });
  };
}

export const handleSrcTableUpdate = (
  tableData: TableData,
  passphrase: string
) => {
  const basicPass = new BasicCrypto(passphrase);
  basicPass.updateUserStore(tableData);
};
