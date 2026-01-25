import CryptoJS from 'crypto-js';
import type { TableData } from '../../stores/tableStore';

export class BasicCrypto {
  passphrase: string;
  username: string;

  constructor(passphrase: string, username: string) {
    this.passphrase = passphrase;
    this.username = username;
  }

  encryptTable = (tableData: TableData): string => {
    const cypherText = CryptoJS.AES.encrypt(JSON.stringify(tableData), this.passphrase).toString();
    return cypherText;
  };

  decryptTable = (cypherText: string): TableData => {
    const bytes = CryptoJS.AES.decrypt(cypherText, this.passphrase);
    const decryptedData = JSON.parse(bytes.toString(CryptoJS.enc.Utf8));
    return decryptedData;
  };

  updateUserStore = async (tableData: TableData) => {
    const encryptedTable = this.encryptTable(tableData);
    window.BasicPass.upsertUserStore([this.username, encryptedTable]);
  };

  getUserStore = async () => {
    return await window.BasicPass.getUserStore([this.username]);
  };

  login = async () => {
    const store = await this.getUserStore();
    return this.decryptTable(store);
  };

  deleteUserStore = async () => {
    return await window.BasicPass.deleteUserStore([this.username]);
  };

  static createNewUserStore = async (username: string, passphrase: string) => {
    const basicCrypto = new BasicCrypto(passphrase, username);
    const initialTableCypher = basicCrypto.encryptTable({});
    await window.BasicPass.createNewUserStore([username, initialTableCypher]);
  };

  static getStoreNames = async () => {
    return await window.BasicPass.getStoreList();
  };

  static handleSrcTableUpdate = async (
    tableData: TableData,
    passphrase: string,
    username: string
  ) => {
    const basicPass = new BasicCrypto(passphrase, username);
    await basicPass.updateUserStore(tableData);
  };
}
