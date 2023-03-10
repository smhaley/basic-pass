<script lang="ts">
  import { userStore, loadNewTable } from '../../../../stores/store';
  import { BasicCrypto } from '../../../../utils/crypto/basic-crypto';
  import * as ErrorUtils from '../../../error-utils';
  import InputSection from '../../../../lib/InputSection.svelte';
  import type { TableData, TableEntry } from '../../../../stores/tableStore';
  import { deepCopyTable } from '../../../../stores/utils';
  import { createEventDispatcher } from 'svelte';
  import { fade } from 'svelte/transition';


  export let cypherText: string;
  export let filename: string;

  let storePass: string;
  let decryptedTableData: TableData;
  let previewData: string;

  let passphraseError: ErrorUtils.ErrObj = ErrorUtils.baseError;

  const dispatch = createEventDispatcher();

  const handleStoreDecrypt = (e: Event) => {
    e.preventDefault();
    passphraseError = ErrorUtils.baseError;
    const validTextErr = ErrorUtils.validateText(storePass);
    if (!validTextErr.missing) {
      const basicCrypto = new BasicCrypto(storePass, $userStore.username);
      try {
        const tableData = basicCrypto.decryptTable(cypherText);
        decryptedTableData = tableData;
        const tableCopy = deepCopyTable(tableData);
        Object.values(tableCopy).forEach((entry: TableEntry) => delete entry.passphrase);
        previewData = JSON.stringify(tableCopy, null, 2);
      } catch (e) {
        passphraseError = { ...ErrorUtils.baseError, invalid: true };
      }
    } else {
      passphraseError = validTextErr;
    }
  };

  const handleImportAbort = () => {
    storePass = undefined;
    decryptedTableData = undefined;
    passphraseError = ErrorUtils.baseError;
    dispatch('cancel');
  };

  const handleNewDataStore = async () => {
    await BasicCrypto.handleSrcTableUpdate(decryptedTableData, storePass, $userStore.username);
    loadNewTable(storePass, decryptedTableData);
    dispatch('close');
  };
</script>

{#if !decryptedTableData}
  <div in:fade={{ delay: 90 }}>
    <p class="current-file">
      Current file: {filename}
    </p>
    <form on:submit={handleStoreDecrypt}>
      <InputSection
        type="password"
        label={'Import Store Password'}
        errs={passphraseError}
        errMsgs={ErrorUtils.loginPassErrMsgs}
        bind:value={storePass}
      />

      <div class="button-group">
        <div class="button-child">
          <button class="secondary-button" on:click={handleImportAbort}>Cancel</button>
          <button class="primary-button">Submit</button>
        </div>
      </div>
    </form>
  </div>
{:else}
  <div in:fade={{ delay: 90 }}>
    <p>Confirm Store and Passphrase Override.</p>
    <p>Please verify the preview data below.</p>
    <strong>On confirm, your current logged in store will be overwritten with the store below.</strong>
    <strong>
      The passphrase used to unlock the imported store will become the passphrase used to log back in to this store.
    </strong>
    <p>Table preview with scrubbed passphrases:</p>
    <div class="preview">
      <pre>{previewData}</pre>
    </div>
    <div class="button-group ">
      <button class="danger-button overwrite" on:click={handleNewDataStore}>
        Confirm Overwrite</button
      >
      <button class="secondary-button overwrite" on:click={handleImportAbort}> Cancel</button>
    </div>
  </div>
{/if}

<style>
  .button-child {
    margin-left: auto;
  }
  .current-file {
    font-size: 1.25rem;
  }
  .preview {
    max-height: 300px;
    overflow-y: scroll;
    margin: 10px;
    box-shadow: var(--container-shadow);
  }
  .overwrite {
    max-width: 400px;
  }
</style>
