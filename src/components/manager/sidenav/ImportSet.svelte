<script lang="ts">
  import { userStore } from "../../../stores/store";
  import { BasicCrypto } from "../../../utils/crypto/encrypt";

  export let cypherText: string;

  const handleUpload = (e: Event) => {
    var file = (<HTMLInputElement>e.target).files[0];
    if (!file) return;

    const reader = new FileReader();
    const result = reader.readAsText(file);
    reader.onloadend = () => {
      if (typeof result === "string") {
        cypherText = result;
      }
    };

    reader.onerror = () => {
      window.alert("Upload error");
    };
  };
</script>

<div class="export-container">
  <div class="heading-container">
    <h2>Table Import</h2>
  </div>
  <p>You may import a previously exported table store.</p>
  <strong>Once a table import is finalized, the change cannot be undone.</strong
  >
  <p>
    All aspects of the the import, including the password, will overwrite those
    of the current logged in table account.
  </p>
  <p>
    The password used to decrypt the imported table will become the password for
    the current logged in user.
  </p>

  <div class="button-group">
    <label for="file-upload" class="file-upload primary-button">
      Custom Upload
    </label>
    <input id="file-upload" type="file" on:change={handleUpload} />

    <!-- <p class="content" /> -->
    <pre>
          {cypherText}
      </pre>
  </div>
  <form />
</div>

<style>
  .export-container {
    padding: 0 16px;
  }
  button {
    margin-top: 16px;
    max-width: 260px;
    margin-left: auto;
  }
  .heading-container {
    width: 100%;
    text-align: center;
  }

  input[type="file"] {
    display: none;
  }
  /* .custom-file-upload {
      padding: 12px 15px;
      font-size: 1.2rem;
      font-weight: 600;
      outline: none;
      transition: 0.1s ease-in-out;
      cursor: pointer;
      text-transform: capitalize;
      cursor: pointer;
      color: #ccc;
      background-color: var(--purple);
      border: 1px solid var(--purple);
    } */

  label {
    margin-top: 16px;
    max-width: 260px;
    margin-left: auto;
  }
</style>
