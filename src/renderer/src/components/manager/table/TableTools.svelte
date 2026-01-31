<script lang="ts">
  import { currentSearch, tableSize } from '../../../stores/store';
  import { paginate, tableResults } from '../../../stores/store';

  let selectedRow = $paginate.rowSize;
  let searchInput: string;
  const rowSizes = [5, 10, 15];

  $: searchInput, currentSearch.set(searchInput);
  $: $currentSearch, (searchInput = $currentSearch);
  
  const handleRowSelect = (e: Event) => {
    selectedRow = parseInt((e.target as HTMLSelectElement).value);
    paginate.updateRowSize(selectedRow, $tableResults);
  };

  let isDisabled = $tableSize < 1;
</script>
<div class="container">
  <div class="paginate">
    <div class="row-size-container">
      <label for="row-size" class="row-label">Rows:</label>
      <select class="text-input" id="row-size" on:change={handleRowSelect} value={selectedRow}>
        {#each rowSizes as rowSize}
          <option value={rowSize}>
            {rowSize}
          </option>
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
    box-shadow: var(--container-shadow);
    font-size: 1.2rem;
    position: sticky;
    left: 0;
    z-index: 3;
    padding: 10px 8px 0 8px;
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

  .row-size-container {
    flex-shrink: 0;
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;
    padding-right: 10px;
  }

  #search-label {
    display: none;
  }


  .row-label {
    padding-right: 8px;
  }
</style>
