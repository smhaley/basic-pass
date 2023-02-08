<script lang="ts">
  import { getContext } from "svelte";
  import { TABS } from "./Tabs.svelte";
  import type { TabContext } from "./types";
  import { fade } from "svelte/transition";

  const panel = {};
  const { registerPanel, selectedPanel } = getContext<TabContext>(TABS);

  registerPanel(panel);
</script>

{#if $selectedPanel === panel}
  <div in:fade={{ delay: 90 }}>
    <slot />
  </div>
{/if}
