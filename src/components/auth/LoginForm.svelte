<script lang="ts">
  import { createEventDispatcher } from "svelte";
  import * as ErrorUtils from "../error-utils";
  import InputSection from "../../lib/InputSection.svelte";
  import type { UserAction } from "../../actions/authActions";

  let username: string;
  let passphrase: string;

  let usernameError: ErrorUtils.ErrObj = ErrorUtils.baseError;
  let passphraseError: ErrorUtils.ErrObj = ErrorUtils.baseError;

  const dispatch = createEventDispatcher<UserAction>();

  const handleSubmit = (e: Event) => {
    e.preventDefault();
    usernameError = ErrorUtils.validateUser(username);
    passphraseError = ErrorUtils.validatePassphrase(passphrase);
    //todo update below method name
    if (ErrorUtils.doesErrorExist([usernameError, passphraseError])) {
      
      console.log('bbbbb')
      dispatch("userData", {
        username,
        passphrase,
      });
      console.log("fire dispatch");
    }
  };
</script>

<form on:submit={handleSubmit}>
  <InputSection
    label={"Username"}
    errs={usernameError}
    errMsgs={ErrorUtils.usernameErrMsgs}
    bind:value={username}
  />
  <InputSection
    label={"Passphrase"}
    errs={passphraseError}
    type="password"
    errMsgs={ErrorUtils.loginPassErrMsgs}
    bind:value={passphrase}
  />
  <button class="primary-button">Submit</button>
</form>

<style>
  button {
    margin: 12px 0;
  }
</style>
