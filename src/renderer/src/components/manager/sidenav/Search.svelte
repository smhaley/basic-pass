<script lang="ts">
  import { currentSearch, tableSize } from '../../../stores/store';
  import { createEventDispatcher } from 'svelte';

  const dispatch = createEventDispatcher();

  let searchInput: string = $currentSearch;
  let isDisabled = $tableSize < 1;
  const handleSubmit = (e: Event) => {
    e.preventDefault();
    currentSearch.set(searchInput);
    dispatch('close');
  };

  const handleClear = (e: Event) => {
    e.preventDefault();
    currentSearch.set(undefined);
    dispatch('close');
  };
</script>

<form on:submit={handleSubmit}>
  <label for="search">Site Search</label>
  <input disabled={isDisabled} class="text-input" id="search" bind:value={searchInput} />
  <div class="button-group">
    <div class="button-child">
      <button disabled={isDisabled} class="secondary-button search-button" on:click={handleClear}
        >Clear</button
      >
      <button disabled={isDisabled} class="primary-button search-button" type="submit"
        >Search</button
      >
    </div>
  </div>
</form>

<style>
  form {
    padding: 0 16px;
  }

  .button-child {
    margin-left: auto;
  }

  .search-button {
    margin-top: 16px;
    max-width: 150px;
    min-width: 150px;
  }

  label {
    font-weight: 500;
  }
</style>
