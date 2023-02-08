<script lang="ts">
  import { fade } from "svelte/transition";
  import type { User } from "../../actions/authActions";
  import UserForm from "./UserForm.svelte";
  import LoginForm from "./LoginForm.svelte";
  import UserLoginSection from "./UserLoginSection.svelte";
  import { userStore, tableStore } from "../../stores/store";
  import { mockTable } from "../../stores/tableStore";

  let loginView = true;

  let existingUsers = [];
  let loading = false;
  let incorrectPassphrase = false;
  //todo add types here
  const loginStateHandler = (e) => (loginView = e.detail.loginState);

  const handleUserLogin = async (e: CustomEvent<User>) => {
    ///do some validation
    // tableData.set(mockTable);
    tableStore.setTableData(mockTable);
    userStore.loginUser(e.detail.username);
    // userStore.set({
    //   username: e.detail.username,
    //   isAuthenticated: true,
    // });

    console.log(userStore);
  };

  const handleNewUser = (e: CustomEvent<User>) => {
    ///create new user here file
    //create empty tab;e

    loginView = true;
  };
</script>

<div class="container">
  {#if loginView}
    <div in:fade class="login-container">
      <UserLoginSection on:loginState={loginStateHandler} isNewUser={false}>
        <LoginForm on:userData={handleUserLogin} />
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
