<script lang="ts">
  import ImportConfirm from './ImportConfirm.svelte';
  import { fade } from 'svelte/transition';

  let cypherText: string;
  let filename: string;
  let mountKey = 0;

  const handleUpload = () => {
    mountKey = mountKey++;
    resetImportState();
    const file = (document.querySelector('input[type=file]') as HTMLInputElement).files[0];
    const reader = new FileReader();

    if (file) {
      reader.readAsText(file);
    }
    reader.onloadend = () => {
      const inputCypher = reader.result;
      if (typeof inputCypher === 'string') {
        cypherText = inputCypher;
        filename = file.name;
      } else {
        window.alert('Please check your file and try again');
      }
    };
  };

  const resetImportState = () => {
    mountKey = mountKey++;
    cypherText = undefined;
    filename = undefined;
  };

  const handleCancel = () => {
    resetImportState();
  };
</script>

<div class="export-container">
  {#if !filename}
    <div in:fade={{ delay: 90 }}>
      <p>You may import a previously exported table store.</p>
      <strong>Once a store import is finalized, the change cannot be undone.</strong>
      <p>
        All aspects of the the import, including the password, will overwrite those of the current
        logged in store account.
      </p>

      <p>
        The password used to decrypt the imported table will become the password for the current
        logged in store.
      </p>

      <div class="button-group">
        <label for="file-upload" class="file-upload primary-button"> Upload Store </label>
        <input id="file-upload" type="file" on:change={handleUpload} />
      </div>
    </div>
  {:else}
    {#key mountKey}
      <ImportConfirm on:close on:cancel={handleCancel} {filename} {cypherText} />
    {/key}
  {/if}
</div>

<style>
  .export-container {
    padding: 0 16px;
  }

  input[type='file'] {
    display: none;
  }

  label {
    margin-top: 16px;
    max-width: 260px;
    margin-left: auto;
  }
</style>
