<script lang="ts">
  import { fade } from 'svelte/transition';
  import { onMount } from 'svelte';
  import type { User } from '../../actions/authActions';
  import UserForm from './UserForm.svelte';
  import LoginForm from './LoginForm.svelte';
  import UserLoginSection from './UserLoginSection.svelte';
  import { userStore, tableStore } from '../../stores/store';
  import { BasicCrypto } from '../../utils/crypto/basic-crypto';

  let loginView = true;

  let existingUsers = [];
  let incorrectPassphrase = false;

  const loginStateHandler = (e: CustomEvent<{ loginState: boolean }>) => {
    loginView = e.detail.loginState;
    incorrectPassphrase = false;
  };

  const handleUserLogin = async (e: CustomEvent<User>) => {
    incorrectPassphrase = false;
    const { username, passphrase } = e.detail;
    try {
      const basicCrypto = new BasicCrypto(passphrase, username);
      const table = await basicCrypto.login();
      userStore.loginUser(username, passphrase);
      tableStore.setTableData(table);
    } catch {
      incorrectPassphrase = true;
    }
  };

  const handleNewUser = async (e: CustomEvent<User>) => {
    const { username, passphrase } = e.detail;
    await BasicCrypto.createNewUserStore(username, passphrase);
    existingUsers = await BasicCrypto.getStoreNames();
    loginView = true;
  };

  onMount(async () => {
    existingUsers = await BasicCrypto.getStoreNames();
  });
</script>

<div class="container">
  {#if loginView}
    <div in:fade class="login-container">
      <UserLoginSection on:loginState={loginStateHandler} isNewUser={false}>
        <LoginForm on:userData={handleUserLogin} {existingUsers} {incorrectPassphrase} />
      </UserLoginSection>
    </div>
  {:else}
    <div in:fade class="login-container">
      <UserLoginSection on:loginState={loginStateHandler} isNewUser>
        <UserForm on:userData={handleNewUser} {existingUsers} />
      </UserLoginSection>
    </div>
  {/if}
</div>

<style>
  .container {
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .login-container {
    background: var(--bg-secondary);
    padding: 20px;
    border-radius: 3px;
    width: 80%;
    max-width: 700px;
    box-shadow: var(--container-shadow);
  }
</style>
