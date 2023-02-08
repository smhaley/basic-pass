<script lang="ts">
  import { createEventDispatcher } from "svelte";

  export let isNewUser: boolean;

  const sectionHead = isNewUser
    ? "Create New User Store 🔒"
    : "Basic Pass Login 🔒";

  const linkText = isNewUser ? "Return to user login" : "Create new user store";

  //todo add types here
  const dispatch = createEventDispatcher();

  const newUserHandler = () => {
    dispatch("loginState", {
      loginState: isNewUser,
    });
  };
</script>

<div>
  <h1>{sectionHead}</h1>

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
</style>
