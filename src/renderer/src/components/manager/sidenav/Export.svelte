<script lang="ts">
  import { userStore } from "../../../stores/store";
  import { BasicCrypto } from "../../../utils/crypto/basic-crypto";

  const downloadTableFile = async () => {
    const basicCrypto = new BasicCrypto(
      $userStore.passphrase,
      $userStore.username
    );
    const tableData = await basicCrypto.getUserStore();

    const tableFile = new Blob([tableData], { type: "text/plain" });

    var tempLink = document.createElement("a");

    tempLink.download = `${$userStore.username}.aes`;
    var url = window.URL.createObjectURL(tableFile);
    tempLink.href = url;

    tempLink.style.display = "none";
    document.body.appendChild(tempLink);

    tempLink.click();
    document.body.removeChild(tempLink);
  };
</script>

<div class="export-container">
  <p>You may export your store's table into an encrypted text file.</p>
  <p>The file may be used to transfer table data between machines or store accounts.</p>
  <p>Altering the exported file may corrupt the encrypted table.</p>
  <div class="button-group">
    <button class="primary-button" on:click={downloadTableFile}
      >Download Store Table</button
    >
  </div>
</div>

<style>
  .export-container {
    padding: 0 16px;
  }
  button {
    margin-top: 16px;
    max-width: 290px;
    margin-left: auto;
  }
</style>
