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
    return Promise.resolve(
      "U2FsdGVkX18RrIQ5WgVTI/IDP8lji3VyO51c0P2eJbdhAi26b0bWGpHYjy0ciJJAnv2mggLtcZMSejc3rwMeDWhm8xackHPf0uLW3jZrtwQckydS6kc+8GxKRmHPIk/vm3cWNcjqOgKEZO78YdbBmfV2xmWUmDONe2XiJsNo5QFZLYsPNxOMvgEybygaG6b3DE/8+ych6sBNuNI94M2+6Hb+MaivGUPyhAJ+fCAssZ1xtfrdmdw/cwy7XVY/kTC1KM3nRzO1Eje7/Z7pkq2z4MM70B3KR8r0u2fO2XLfNelukdfD3BDWMKPkRNQGDK89ck0vy42aKzvR/XJG2mCVWGBQdm6fXwL7kUoIeXa5S3skrktZEgzyeirF+OsEyQFWODGCnxKERyD+zIn4QHr+kfpLOw+M18ylCQzBWqxLBhLUPoXAFFRbSI/uk3C30HP/DLF9EOk8If56QX7wNrZisA=="
    );
  },
};
