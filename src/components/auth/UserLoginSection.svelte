<script lang="ts">
  import { createEventDispatcher } from "svelte";
  import ShieldLock from "svelte-material-icons/ShieldLock.svelte";

  export let isNewUser: boolean;

  const sectionHead = isNewUser ? "Create New User Store" : "Basic Pass Login";

  const linkText = isNewUser ? "Return to user login" : "Create new user store";

  const dispatch = createEventDispatcher();

  const newUserHandler = () => {
    dispatch("loginState", {
      loginState: isNewUser,
    });
  };
</script>

<div>
  <div class="heading">
    <h1>
      {sectionHead}
    </h1>
    <span class="icon"><ShieldLock size="3rem" /></span>
  </div>
  <slot />

  <button class="link-button" on:click={newUserHandler}>
    {linkText}
  </button>
</div>

<style>
  h1,
  button {
    margin: 12px 0;
  }
  .heading {
    display: flex;
  }
  .icon {
    margin-left: 16px;
    margin-top: 4px;
  }
</style>
