<script lang="ts">
  import UserForm from "../../auth/UserForm.svelte";
  import { userStore } from "../../../stores/store";
  import type { User } from "../../../actions/authActions";
  import { createEventDispatcher } from "svelte";

  const dispatch = createEventDispatcher();

  const handleUpdate = (e: CustomEvent<User>) => {
    console.log("re encrypt store and save", e.detail.passphrase);
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
