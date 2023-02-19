<script lang="ts">
  import { userStore, logout } from "../../../../stores/store";
  import { BasicCrypto } from "../../../../utils/crypto/encrypt";
  import * as ErrorUtils from "../../../error-utils";
  import InputSection from "../../../../lib/InputSection.svelte";
  import type { TableData, TableEntry } from "../../../../stores/tableStore";
  import { deepCopyTable } from "../../../../stores/utils";

  let cypherText: string;
  let filename: string;
  let storePass: string;
  let decryptedTableData: TableData;
  let cypherData: string;
  let previewData: string;

  let passphraseError: ErrorUtils.ErrObj = ErrorUtils.baseError;

  const handleUpload = () => {
    handleImportAbort();
    const file = (
      document.querySelector("input[type=file]") as HTMLInputElement
    ).files[0];
    const reader = new FileReader();

    if (file) {
      reader.readAsText(file);
    }
    reader.onloadend = () => {
      const inputCypher = reader.result;
      if (typeof inputCypher === "string") {
        cypherText = inputCypher;
        filename = file.name;
      } else {
        window.alert("Please check your file and try again");
      }
    };
  };

  const handleStoreDecrypt = (e: Event) => {
    e.preventDefault();
    passphraseError = ErrorUtils.baseError;
    const validTextErr = ErrorUtils.validateText(storePass);
    if (!validTextErr.missing) {
      const basicCrypto = new BasicCrypto(storePass, $userStore.username);
      try {
        const tableData = basicCrypto.decryptTable(cypherText);
        decryptedTableData = tableData;
        cypherData = cypherText;
        const tableCopy = deepCopyTable(tableData);
        Object.values(tableCopy).forEach(
          (entry: TableEntry) => delete entry.passphrase
        );
        previewData = JSON.stringify(tableCopy, null, 2);
      } catch (e) {
        passphraseError = { ...ErrorUtils.baseError, invalid: true };
      }
    } else {
      passphraseError = validTextErr;
    }
  };

  const handleImportAbort = () => {
    cypherText = undefined;
    filename = undefined;
    storePass = undefined;
    decryptedTableData = undefined;
    passphraseError = ErrorUtils.baseError;
  };

  const handleNewDataStore = async () => {
    await BasicCrypto.handleSrcTableUpdate(
      decryptedTableData,
      storePass,
      $userStore.username
    );
    logout();
  };
</script>

<div class="export-container">
  <div class="heading-container">
    <h2>Table Import</h2>
  </div>
  {#if !filename}
    <p>You may import a previously exported table store.</p>
    <strong
      >Once a table import is finalized, the change cannot be undone.</strong
    >
    <p>
      All aspects of the the import, including the password, will overwrite
      those of the current logged in table account.
    </p>

    <p>
      The password used to decrypt the imported table will become the password
      for the current logged in user.
    </p>

    <div class="button-group">
      <label for="file-upload" class="file-upload primary-button">
        Store Upload
      </label>
      <input id="file-upload" type="file" on:change={handleUpload} />
    </div>
  {:else if !decryptedTableData}
    <p class="current-file">
      Current file: {filename}
    </p>
    <form on:submit={handleStoreDecrypt}>
      <InputSection
        type="password"
        label={"Import Store Password"}
        errs={passphraseError}
        errMsgs={ErrorUtils.loginPassErrMsgs}
        bind:value={storePass}
      />

      <div class="button-group">
        <div class="button-child">
          <button class="secondary-button" on:click={handleImportAbort}
            >Cancel</button
          >
          <button class="primary-button">Submit</button>
        </div>
      </div>
    </form>
  {:else}
    <p>Confirm User Store and Passphrase Override</p>
    <p>Please verify the preview data below.</p>
    <p>
      On confirm, your current logged in store will be overwritten with the
      store below.
    </p>
    <p>
      Additionally the access passphrase will will become the passphrase used to
      unlock the data below.
    </p>
    <p>
      On confirm you will be logged out. On login you will see your uploaded
      table data.
    </p>
    <p>Table preview with scrubbed passphrases:</p>
    <div class="preview">
      <pre>{previewData}</pre>
    </div>
    <div class="button-group ">
      <button class="danger-button overwrite" on:click={handleNewDataStore}>
        Confirm Overwrite</button
      >
      <button class="secondary-button overwrite" on:click={handleImportAbort}>
        Cancel</button
      >
    </div>
  {/if}
</div>

<style>
  .export-container {
    padding: 0 16px;
  }

  .heading-container {
    width: 100%;
    text-align: center;
  }

  input[type="file"] {
    display: none;
  }

  label {
    margin-top: 16px;
    max-width: 260px;
    margin-left: auto;
  }
  .button-child {
    margin-left: auto;
  }
  .current-file {
    font-size: 1.25rem;
  }
  .preview {
    max-height: 600px;
    overflow-y: scroll;
  }
  .overwrite {
    max-width: 400px;
  }
</style>
