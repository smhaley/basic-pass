<script lang="ts">
  import { getContext } from 'svelte';
  import { TABS } from './Tabs.svelte';
  import type { TabContext } from './types';

  const tab = {};
  const { registerTab, selectTab, selectedTab } = getContext<TabContext>(TABS);

  registerTab(tab);
</script>

<button class:selected={$selectedTab === tab} on:click={() => selectTab(tab)}>
  <slot />
</button>

<style>
  button {
    background: none;
    border: none;
    border-bottom: 4px solid transparent;
    border-radius: 0;
    margin: 0;
    color: var(--font-color);
  }

  .selected {
    border-bottom: 4px solid var(--green);
    color: var(--active-green-tab);
    transition: 90ms ease-in-out;
  }

  button:hover,
  button:focus {
    background-color: var(--icon-hov-color-primary);
    border-bottom: 4px solid currentColor;
  }
</style>
