<script lang="ts">
  import { appliedFilters, availableFilters } from "../../../stores/store";
  import { createEventDispatcher } from "svelte";

  const dispatch = createEventDispatcher();

  const handleFilterSubmit = (e: Event) => {
    e.preventDefault();
    appliedFilters.set($appliedFilters);
    dispatch("close");
  };

  const handleFilterReset = () => {
    appliedFilters.set([]);
    dispatch("close");
  };
</script>

<h2 class="heading-container">Tag Filters</h2>

{#if $availableFilters.length}
  <form class="filter-container" on:submit={handleFilterSubmit}>
    {#each $availableFilters as tag}
      <label>
        <input
          type="checkbox"
          bind:group={$appliedFilters}
          checked
          value={tag}
        />
        {tag}
      </label>
    {/each}
    <div class="button-group">
      <div class="test">
        <button
          class="secondary-button search-button"
          on:click={handleFilterReset}>reset filters</button
        >
      </div>
    </div>
  </form>
{:else}
  <div class="filter-container">
    <p>No tags to filter on</p>
  </div>
{/if}

<style>
  p {
    font-size: 1.3rem;
  }

  .filter-container {
    padding: 20px;
    display: flex;
    flex-direction: column;
    font-size: 1.3rem;
  }

  label {
    font-size: 1.25rem;
  }

  input[type="checkbox"] {
    width: 20px;
    height: 20px;
    margin-right: 10px;
  }

  h2 {
    margin: 0;
  }

  .heading-container {
    width: 100%;
    text-align: center;
  }

  button {
    margin-top: 16px;
    max-width: 200px;
  }
</style>
