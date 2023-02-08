<script lang="ts">
  import { createEventDispatcher } from "svelte";
  import UserForm from "./UserForm.svelte";

  export let existingUsers: string[] | undefined = ["shawn"];

  const dispatch = createEventDispatcher();

  const newUserHandler = () => {
    dispatch("loginState", {
      loginState: true,
    });
  };
</script>

<div>
  <h1>Create New User Store 🔒</h1>

  <UserForm {existingUsers} />

  <button class="link-button" on:click={newUserHandler}>
    Create new user store
  </button>
</div>

<style>
  button {
    margin: 12px;
  }
</style>
