export type ErrObj = {
  invalid?: boolean;
  missing?: boolean;
};

export type ErrMsgs = {
  invalid: string;
  missing: string;
};

export const usernameErrMsgs = {
  missing: "Username required",
  invalid: "Username already in use on this system",
};

export const passPhraseErrMsgs = {
  invalid: "",
  missing: "Passphrase required",
};

export const loginPassErrMsgs = {
  invalid: "Incorrect password",
  missing: "Passphrase required",
};

export const loginUserErrMsgs = {
  invalid: "Username does not exist on this system",
  missing: "Username required",
};

export const validatePassErrMsgs = {
  invalid: "Passphrase does note match",
  missing: "Passphrase required",
};

export const validateSiteErrMsgs = {
  missing: "Site name required",
  invalid: "Site already exists - update in table",
};
export const baseError: ErrObj = { invalid: false, missing: false };

export const constructErrs = (
  currentErrState: ErrObj,
  isInvalid: boolean,
  isMissing: boolean
) => {
  const localErrState = { ...currentErrState };
  localErrState.missing = isMissing;
  localErrState.invalid = isInvalid;
  return localErrState;
};

export const validatePassphrase = (passphrase: string) => {
  const missing = !passphrase || !passphrase.length;
  return {
    missing,
    invalid: !missing && passphrase.length < 1,
  };
};
export const validateValidationPassphrase = (
  passphrase: string,
  validation: string
): ErrObj => {
  const invalid = passphrase && passphrase !== validation;
  return { invalid };
};

export const validateUser = (username: string, existingUsers?: string[]) => {
  const missing = !username || !username.length;
  let invalid = false;
  if (existingUsers) {
    invalid = !existingUsers.every((val) => val !== username);
  }
  return { missing, invalid };
};

export const validateExistingUser = (
  username: string,
  existingUsers: string[]
) => {
  const missing = !username || !username.length;
  let invalid = !existingUsers.some((val) => val === username);

  return { missing, invalid };
};

export const validateText = (val: string, invalid?: boolean) => {
  const missing = !val || !val.length;
  return { missing, invalid: false };
};

export const doesErrorExist = (errs: ErrObj[]) =>
  errs.every((errObj) => !errObj.invalid && !errObj.missing);
