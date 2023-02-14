<script lang="ts">
  import { fade } from "svelte/transition";
  import { onMount } from "svelte";
  import type { User } from "../../actions/authActions";
  import UserForm from "./UserForm.svelte";
  import LoginForm from "./LoginForm.svelte";
  import UserLoginSection from "./UserLoginSection.svelte";
  import { userStore, tableStore } from "../../stores/store";
  import { mockTable } from "../../stores/tableStore";
  import { BasicCrypto } from "../../utils/crypto/encrypt";

  let loginView = true;

  let existingUsers = [];
  let loading = false;
  let incorrectPassphrase = false;
  //todo add types here
  const loginStateHandler = (e) => (loginView = e.detail.loginState);

  const handleUserLogin = async (e: CustomEvent<User>) => {
    incorrectPassphrase = false;
    const { username, passphrase } = e.detail;
    try {
      const basicCrypto = new BasicCrypto(passphrase);
      const table = await basicCrypto.login(username);
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
        <LoginForm
          on:userData={handleUserLogin}
          {existingUsers}
          {incorrectPassphrase}
        />
      </UserLoginSection>
    </div>
  {:else}
    <div in:fade class="login-container">
      <UserLoginSection on:loginState={loginStateHandler} isNewUser>
        <UserForm on:userData={handleNewUser} {existingUsers} />
      </UserLoginSection>
    </div>
  {/if}
  <div class="new-user-container" />
</div>

<style>
  .container {
    height: 100%;
    padding: 0;
    margin: 0;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .login-container {
    background: var(--bg-secondary);
    display: flex;
    flex-direction: column;
    padding: 20px;
    border-radius: 3px;
    width: 80%;
    max-width: 700px;
    box-shadow: var(--container-shadow);
  }

  .new-user-container {
    padding: 12px;
  }
</style>
