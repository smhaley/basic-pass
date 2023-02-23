<script lang="ts">
  import UserForm from '../../auth/UserForm.svelte';
  import { userStore, tableStore } from '../../../stores/store';
  import type { User } from '../../../actions/authActions';
  import { createEventDispatcher } from 'svelte';
  import { BasicCrypto } from '../../../utils/crypto/basic-crypto';

  const dispatch = createEventDispatcher();

  const handleUpdate = (e: CustomEvent<User>) => {
    const { passphrase } = e.detail;
    userStore.updatePass(passphrase);

    BasicCrypto.handleSrcTableUpdate($tableStore, passphrase, $userStore.username);
    dispatch('close');
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
