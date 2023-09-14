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

<h2 class="heading-container">App Settings</h2>
<div>
  {#each Object.keys($settingsStore) as setting}
    <Slider
      checked={$settingsStore[setting]}
      label={settingsLabelMap[setting]}
      handleChange={handleSettingChange}
    />
  {/each}
  <div class="button-group">
    <button class="secondary-button search-button" on:click={settingsStore.reset}
      >reset filters</button
    >
  </div>
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
    padding: 0 16px;
    margin-bottom: 16px;
  }

  input {
    margin: 0;
    -webkit-appearance: none;
    position: relative;
    width: 40px;
    height: 20px;
    border-radius: 25px;
    background-color: var(--font-color);
    transition: background 0.3s;
    outline: none;
    cursor: pointer;
  }
  input::after {
    content: '';
    position: absolute;
    top: 50%;
    left: 30%;
    transform: translate(-50%, -50%);
  }

  input::after {
    content: '';
    position: absolute;
    top: 50%;
    left: 30%;
    transform: translate(-50%, -50%);
    border-radius: 50%;
    height: 0.9rem;
    width: 0.9rem;
    background-color: white;
    transition: left 0.3s;
  }

  input::after:focus {
    box-shadow: -1px 0px 45px 69px rgba(0, 0, 0, 1);
  }

  input:checked {
    background-color: var(--light-blue);
  }

  input:checked::after {
    left: 70%;
  }
  input:focus {
    box-shadow: 0px 0px 5px 5px var(--icon-hov-color-primary);
  }
  .label-content {
    padding-left: 20px;
  }
</style>
