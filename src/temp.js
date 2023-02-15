window.BasicPass = {
  getStoreList: () => {
    console.log("getStoreList");
    return Promise.resolve(["shawn", "joe"]);
  },
  createNewUserStore: (args) =>
    Promise.resolve(console.log("createNewUserStore", args)),
  upsertUserStore: (args) =>
    Promise.resolve(console.log("upsertUserStore", args)),
  getUserStore: (args) => {
    console.log("getUserStore", args);
    return Promise.resolve("U2FsdGVkX19GAvnitrOrB/hrpzTTW/kppSSv9mPGQsQ=");
  },
};
