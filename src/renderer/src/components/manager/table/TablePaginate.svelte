<script lang="ts">
  import MenuRight from 'svelte-material-icons/MenuRight.svelte';
  import MenuLeft from 'svelte-material-icons/MenuLeft.svelte';
  import { paginate, tableResults } from '../../../stores/store';

  let tableSize: number = Object.keys($tableResults).length;

  let isLeftDisabled: boolean;
  let isRightDisabled: boolean;

  $: {
    tableSize = Object.keys($tableResults).length;
    isLeftDisabled = $paginate.tableOffset[0] === 0;
    isRightDisabled = $paginate.tableOffset[1] === tableSize;
  }

  const paginateLeft = () => {
    paginate.paginateLeft($tableResults);
  };

  const paginateRight = () => {
    paginate.paginateRight($tableResults);
  };
</script>

{#if $paginate.tableOffset && tableSize > 0}
  <div class="container">
    <div class="paginate">
      <div class="showing">
        <p>
          Showing {$paginate.tableOffset[0] + 1} to {$paginate.tableOffset[1]} of {tableSize}
        </p>
      </div>
      <div class="button-container">
        <ul>
          <li>
            <button class="icon-button" disabled={isLeftDisabled} on:click={paginateLeft}
              ><MenuLeft size="1.7rem" /></button
            >
          </li>
          <li>
            <button class="icon-button" disabled={isRightDisabled} on:click={paginateRight}
              ><MenuRight size="1.7rem" /></button
            >
          </li>
        </ul>
      </div>
    </div>
  </div>
{/if}

<style>
  .container {
    box-shadow: var(--container-shadow);
    font-size: 1.2rem;
    position: sticky;
    left: 0;
    z-index: 3;
    padding: 0 8px;
  }

  .button-container {
    flex-shrink: 0;
  }

  .paginate {
    display: flex;
    align-items: center;
    justify-content: space-between;
  }

  .showing {
    flex-shrink: 0;
  }

  li {
    display: inline-block;
  }
</style>
