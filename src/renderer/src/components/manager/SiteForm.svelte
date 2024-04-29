<script lang="ts">
  import { createEventDispatcher } from 'svelte';
  import { availableFilters } from '../../stores/store';
  import InputSection from '../../lib/InputSection.svelte';
  import InputSelect from '../../lib/InputSelect.svelte';
  import * as ErrorUtils from '../error-utils';

  import { TABLE_ENTRY, type SiteDataAction, type SiteData } from '../../actions/tableDataActions';

  export let currentSiteData: SiteData = undefined;
  export let siteExistsError: boolean;
  export let newPassphrase: boolean = true;

  let site = (currentSiteData && currentSiteData.site) || '';
  let passphrase: string;
  let validatePassphrase: string;

  let username: string = (currentSiteData && currentSiteData.username) || '';
  let isNewSite = !(currentSiteData && currentSiteData.site.length);
  let tag: string = (currentSiteData && currentSiteData.tag) || '';

  let siteError = ErrorUtils.baseError;
  let passphraseError = ErrorUtils.baseError;
  let validatePassphraseError = ErrorUtils.baseError;
  let usernameError = ErrorUtils.baseError;

  let showPassInput = false;

  const validateSiteDataSubmit = () => {
    siteError = ErrorUtils.validateText(site);
    passphraseError = ErrorUtils.validatePassphrase(passphrase);
    usernameError = ErrorUtils.validateText(username);

    validatePassphraseError = ErrorUtils.validateValidationPassphrase(
      passphrase,
      validatePassphrase
    );

    const passErrs =
      newPassphrase || showPassInput ? [passphraseError, validatePassphraseError] : [];

    return ErrorUtils.doesErrorExist([siteError, usernameError, ...passErrs]);
  };

  const dispatch = createEventDispatcher<SiteDataAction>();

  const handleSiteData = (e: Event) => {
    e.preventDefault();
    if (validateSiteDataSubmit()) {
      const pass = newPassphrase || showPassInput ? passphrase : currentSiteData.passphrase;
      dispatch(TABLE_ENTRY, {
        site,
        username,
        passphrase: pass,
        tag,
        timestamp: Date.now().toString()
      });
    }
  };

  const buttonText = isNewSite ? 'add to store' : 'update store';
</script>

<div>
  <form on:submit={handleSiteData}>
    {#if isNewSite}
      <InputSection
        label={'Site'}
        errs={{ ...siteError, invalid: siteExistsError }}
        errMsgs={ErrorUtils.validateSiteErrMsgs}
        bind:value={site}
      />
    {/if}

    {#if !newPassphrase}
      <label>
        <input
          type="checkbox"
          on:click={() => {
            showPassInput = !showPassInput;
          }}
        />
        Create New Password
      </label>
    {/if}

    <InputSection
      label={'Username'}
      errs={usernameError}
      errMsgs={ErrorUtils.usernameErrMsgs}
      bind:value={username}
    />

    <InputSelect label={'Tag'} bind:value={tag} options={$availableFilters} />

    {#if newPassphrase || showPassInput}
      <InputSection
        label={'New Passphrase'}
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
    {/if}
    <div class="button-group">
      <button class="primary-button">{buttonText}</button>
    </div>
  </form>
</div>

<style>
  input[type='checkbox'] {
    width: 20px;
    height: 20px;
    margin: 12px;
  }
  button {
    margin-left: auto;
  }
</style>
