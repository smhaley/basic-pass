<script lang="ts">
  import UserForm from "../../auth/UserForm.svelte";
  import { userStore, tableStore } from "../../../stores/store";
  import type { User } from "../../../actions/authActions";
  import { createEventDispatcher } from "svelte";
  import { BasicCrypto } from "../../../utils/crypto/encrypt";

  const dispatch = createEventDispatcher();

  const handleUpdate = (e: CustomEvent<User>) => {
    const { passphrase } = e.detail;
    userStore.updatePass(passphrase);
    const basicCrypto = new BasicCrypto(passphrase);
    const text = basicCrypto.encryptTable($tableStore);
    console.log(text);
    console.log(basicCrypto.decryptTable(text));
    dispatch("close");
  };
</script>

<h2 class="heading-container">Update User Passphrase</h2>
<div>
  <UserForm on:userData={handleUpdate} currentUsername={$userStore.username} />
</div>

<style>
  h2 {
    margin: 0;
  }
  .heading-container {
    width: 100%;
    text-align: center;
  }
  div {
    padding: 16px;
  }
</style>
