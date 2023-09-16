<script lang="ts">
  import Slider from '../../../lib/Slider.svelte';
  import { settingsStore } from '../../../stores/store';
  import { settingsLabelMap } from '../../../stores/settingsStore';

  const handleSettingChange = (settingsLabel: string, status: boolean) => {
    const settingsKey = Object.keys(settingsLabelMap).find(
      (key) => settingsLabelMap[key] === settingsLabel
    );
    settingsStore.updateSettings({ [settingsKey]: status });
  };
</script>

<div class="settings-container">
  {#each Object.keys($settingsStore) as setting}
    <Slider
      checked={$settingsStore[setting]}
      label={settingsLabelMap[setting]}
      handleChange={handleSettingChange}
    />
  {/each}
</div>

<style>
  .settings-container {
    padding: 40px;
  }
</style>
