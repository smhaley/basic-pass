<script lang="ts">
  import { onMount } from 'svelte';
  import { userStore } from './stores/store';
  import Manager from './components/manager/Manager.svelte';
  import Login from './components/auth/Login.svelte';

  onMount(() => {
    const preferredTheme = localStorage.getItem('theme');
    if (preferredTheme) {
      document.documentElement.setAttribute('data-theme', preferredTheme);
    } else {
      const osPreference = window.matchMedia('(prefers-color-scheme:dark)').matches
        ? 'dark'
        : 'light';
      document.documentElement.setAttribute('data-theme', osPreference);
    }
  });
</script>

{#if $userStore && $userStore.isAuthenticated}
  <Manager />
{:else}
  <Login />
{/if}
