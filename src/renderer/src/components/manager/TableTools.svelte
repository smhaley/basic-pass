<script lang="ts">
  //   import MenuRight from 'svelte-material-icons/MenuRight.svelte';
  //   import MenuLeft from 'svelte-material-icons/MenuLeft.svelte';

  import { currentSearch, tableSize } from '../../stores/store';
  //   import { createEventDispatcher } from 'svelte';

  const rowSizes = [5, 10, 15, 20];
  //   let current: number[] = [0, 9]; //[a,b)
  //   let total: number = 100;

  let searchInput: string = $currentSearch;
  let isDisabled = $tableSize < 1;
</script>

<div class="container">
  <div class="paginate">
    <div class="showing">
      <label for="row-size">Rows per page:</label>
      <select name="row-size" id="row-size">
        {#each rowSizes as size}
          <option value={size}>{size}</option>
        {/each}
      </select>
    </div>
    <div class="button-container">
      <label id="search-label" for="search">Site Search</label>
      <input
        placeholder="Site Search"
        disabled={isDisabled}
        class="text-input"
        id="search"
        bind:value={searchInput}
      />
    </div>
  </div>
</div>

<style>
  .container {
    font-size: 1.2rem;
    position: sticky;
    left: 0;
    z-index: 3;
    padding: 0 8px;
  }

  .button-container {
    flex-shrink: 0;
    display: inline-block;
  }

  .paginate {
    display: flex;
    align-items: center;
    justify-content: space-between;
  }

  .showing {
    flex-shrink: 0;
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;

  }

  #search-label {
    display: none;
  }
</style>
