<script lang="ts">
  import { createEventDispatcher } from 'svelte';
  import InputSection from '../../lib/InputSection.svelte';
  import * as ErrorUtils from '../error-utils';
  import type { UserAction } from '../../actions/authActions';

  export let currentUsername: string = undefined;
  export let existingUsers: string[] = undefined;

  let username = currentUsername;
  let passphrase: string;
  let validatePassphrase: string;

  const isNewUser = typeof currentUsername === 'undefined';

  let usernameError: ErrorUtils.ErrObj = ErrorUtils.baseError;
  let passphraseError: ErrorUtils.ErrObj = ErrorUtils.baseError;
  let validatePassphraseError: ErrorUtils.ErrObj = ErrorUtils.baseError;

  const dispatch = createEventDispatcher<UserAction>();

  const handleSubmit = (e: Event) => {
    e.preventDefault();
    usernameError = ErrorUtils.validateUser(username, existingUsers || []);
    passphraseError = ErrorUtils.validatePassphrase(passphrase);
    validatePassphraseError = ErrorUtils.validateValidationPassphrase(
      passphrase,
      validatePassphrase
    );

    if (ErrorUtils.doesErrorExist([usernameError, passphraseError, validatePassphraseError])) {
      dispatch('userData', {
        username,
        passphrase
      });
    }
  };
</script>

<form on:submit={handleSubmit}>
  {#if isNewUser}
    <InputSection
      label={'Store Name'}
      errs={usernameError}
      errMsgs={ErrorUtils.usernameErrMsgs}
      bind:value={username}
    />
  {/if}
  <InputSection
    label={'Passphrase'}
    errs={passphraseError}
    type="password"
    errMsgs={ErrorUtils.passPhraseErrMsgs}
    bind:value={passphrase}
  />
  <InputSection
    label={'Validate Passphrase'}
    errs={validatePassphraseError}
    type="password"
    errMsgs={ErrorUtils.validatePassErrMsgs}
    bind:value={validatePassphrase}
  />
  <div class="button-group">
    <button class:small-screen={!isNewUser} class="primary-button">Submit</button>
  </div>
</form>

<style>
  .small-screen {
    margin-left: auto;
  }

  button {
    width: 120px;
  }
</style>
