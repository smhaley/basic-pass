<script lang="ts">
  import { createEventDispatcher } from 'svelte';
  import * as ErrorUtils from '../error-utils';
  import InputSection from '../../lib/InputSection.svelte';
  import type { UserAction } from '../../actions/authActions';

  export let existingUsers: string[];
  export let incorrectPassphrase = false;

  $: incorrectPassphrase, (passphraseError = { ...passphraseError, invalid: incorrectPassphrase });

  let username: string = existingUsers[0];
  let passphrase: string;

  let usernameError: ErrorUtils.ErrObj = ErrorUtils.baseError;
  let passphraseError: ErrorUtils.ErrObj = ErrorUtils.baseError;

  const dispatch = createEventDispatcher<UserAction>();

  const handleSubmit = (e: Event) => {
    e.preventDefault();
    usernameError = ErrorUtils.validateExistingUser(username, existingUsers);
    passphraseError = ErrorUtils.validatePassphrase(passphrase);
    if (ErrorUtils.doesErrorExist([usernameError, passphraseError])) {
      dispatch('userData', {
        username,
        passphrase
      });
    }
  };
</script>

<form on:submit={handleSubmit}>
  <label for="row-size" class="row-label">Store Name</label>
  <select class="text-input" bind:value={username} disabled={existingUsers.length === 0}>
    {#each existingUsers as user}
      <option>{user}</option>
    {/each}
  </select>
  <InputSection
    label={'Passphrase'}
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
