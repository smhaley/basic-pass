<script lang="ts">
  import { onMount } from "svelte";
  import { userStore } from "./stores/store";
  import Manager from "./components/manager/Manger.svelte";
  import Login from "./components/auth/Login.svelte";

  onMount(() => {
    const preferredTheme = localStorage.getItem("theme");
    if (preferredTheme) {
      document.documentElement.setAttribute("data-theme", preferredTheme);
    }
  });
</script>

<div>
  {#if $userStore && $userStore.isAuthenticated}
    <!-- {#if true} -->
    <Manager />
  {:else}
    <Login />
  {/if}
</div>

<style>
  div {
    padding-top: 60px;
    margin: 0 auto;
  }

  @media (min-width: 640px) {
    div {
      max-width: none;
    }
  }
</style>
