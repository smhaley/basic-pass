<script lang="ts">
  import ImportConfirm from './ImportConfirm.svelte';
  import { fade } from 'svelte/transition';

  let cypherText: string;
  let filename: string;
  let mountKey = 0;
  let fileInput: HTMLInputElement;

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

  const triggerFileUpload = () => {
    fileInput.click();
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
      <button class="primary-button import-export-buttons" on:click={triggerFileUpload}
        >Upload Store</button
      >
      <input
        id="file-upload"
        type="file"
        bind:this={fileInput}
        on:change={handleUpload}
        class="visually-hidden"
      />
    </div>
  </div>
{:else}
  {#key mountKey}
    <ImportConfirm on:close on:cancel={handleCancel} {filename} {cypherText} />
  {/key}
{/if}

<style>
  .visually-hidden {
    position: absolute;
    width: 1px;
    height: 1px;
    padding: 0;
    margin: -1px;
    overflow: hidden;
    clip: rect(0, 0, 0, 0);
    border: 0;
  }
</style>
