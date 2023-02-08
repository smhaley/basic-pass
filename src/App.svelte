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

<main>
  {#if $userStore && $userStore.isAuthenticated}
    <!-- {#if true} -->
    <Manager />
  {:else}
    <Login />
  {/if}
</main>

<style>
  main {
    padding-top: 60px;
    /* text-align: center;
    padding: 1em;
    max-width: 240px; */
    margin: 0 auto;
  }

  @media (min-width: 640px) {
    main {
      max-width: none;
    }
  }
</style>
