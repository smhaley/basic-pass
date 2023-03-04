<script lang="ts">
  import { afterUpdate } from 'svelte';
  import Snack from '../../lib/Snack.svelte';
  import More from 'svelte-material-icons/DotsHorizontal.svelte';
  import ContentCopy from 'svelte-material-icons/ContentCopy.svelte';
  import TablePaginate from './TablePaginate.svelte';
  import Modal from '../../lib/Modal.svelte';
  import Up from 'svelte-material-icons/MenuUp.svelte';
  import { userStore } from '../../stores/store';
  import { BasicCrypto } from '../../utils/crypto/basic-crypto';
  import {
    tableStore,
    tableResults,
    appliedFilters,
    currentSearch,
    tableSize,
    tableSort,
    paginate
  } from '../../stores/store';
  import TableAction from './tableAction/TableAction.svelte';
  import TableTools from './TableTools.svelte';
  import { paginateTableData } from '../../stores/utils';

  import type { SiteData, DeleteTableEntry } from '../../actions/tableDataActions';
  import type { TableData } from '../../stores/tableStore';

  let showSnack = false;
  let isOpen = false;
  let currentSiteKey: string;
  let copyCounter = 1;

  let buttonRefs: { [key: string]: HTMLButtonElement } = {};
  let emptyTableMessage: string = '';
  let visibleRows: TableData;

  $: tableResultsSize = $tableResults ? Object.keys($tableResults).length : 0;

  $: $paginate, (visibleRows = paginateTableData($tableResults, $paginate));
  $: $paginate, console.log('fire');

  const dataCols = ['user', 'date', 'tag'];
  const buttonCols = ['passphrase', 'actions'];
  const tableCols = ['site', ...dataCols, ...buttonCols];

  const handleSiteSort = () => {
    if ($tableSort === 'descending') {
      tableSort.set('ascending');
    } else {
      tableSort.set('descending');
    }
  };

  const getRowDataByKey = (key: string) => {
    const rowObj = { ...$tableStore[key] };
    delete rowObj.passphrase;
    const creationDate = new Date(parseInt(rowObj.timestamp));
    rowObj.timestamp = creationDate.toLocaleDateString();
    return Object.values(rowObj).map((val) => val);
  };

  const handlePassClick = (siteKey: string) => {
    copyCounter = copyCounter + 1;
    showSnack = true;
    if ($tableStore && $tableStore[siteKey]) {
      navigator.clipboard.writeText($tableStore[siteKey].passphrase);
    }
  };

  const handleMoreClick = (site: string) => {
    isOpen = true;
    currentSiteKey = site;
  };

  const handleSnackClose = (e: CustomEvent<{ show: boolean }>) => (showSnack = e.detail.show);

  const handleTableDelete = (e: CustomEvent<DeleteTableEntry>) => {
    const updateTableData = tableStore.deleteTableKey(e.detail.siteKey);
    BasicCrypto.handleSrcTableUpdate(updateTableData, $userStore.passphrase, $userStore.username);
    isOpen = false;
  };

  const handleTableUpdate = (e: CustomEvent<SiteData>) => {
    const { username, passphrase, timestamp, site, tag } = e.detail;
    const tableEntry = { username, passphrase, timestamp, tag };
    const updateTableData = tableStore.updateTableKey(site, tableEntry);
    BasicCrypto.handleSrcTableUpdate(updateTableData, $userStore.passphrase, $userStore.username);
    isOpen = false;
  };

  const generateEmptyTableMessage = () => {
    if (tableResultsSize < 1) {
      if ($appliedFilters.length || $currentSearch.length) {
        return 'Your current search and/or filters have no results.';
      }
    }
    return 'Your vault is currently empty.';
  };

  afterUpdate(() => {
    emptyTableMessage = generateEmptyTableMessage();
  });
</script>

<div class="table-container">
  {#if $tableSize > 0}
    <div class="table-content">
      <div class="pass-table">
        <TableTools />
        {#if tableResultsSize > 0}
          <div class="table-item">
            <table>
              <thead>
                <tr>
                  {#each tableCols as col}
                    <th
                      class="header-cell"
                      class:site-col={col === 'site'}
                      class:data-cols={dataCols.includes(col)}
                      class:button-cols={buttonCols.includes(col)}
                      >{col}
                      {#if col === 'site' && tableResultsSize > 1}
                        <button
                          class="icon-button"
                          on:click={handleSiteSort}
                          class:active-sort={$tableSort === 'ascending'}
                        >
                          <Up size={'2rem'} />
                        </button>
                      {/if}
                    </th>
                  {/each}
                </tr>
                <thead />
              </thead>
              <tbody>
                {#each Object.keys(visibleRows) as rowKey}
                  <tr>
                    <th class="site-col">{rowKey}</th>
                    {#each getRowDataByKey(rowKey) as rowData}
                      <td class="data-col">{rowData}</td>
                    {/each}
                    <td class="icon-data">
                      <button on:click={() => handlePassClick(rowKey)} class="icon-button"
                        ><ContentCopy size={'1.4em'} /></button
                      >
                    </td>
                    <td class="icon-data">
                      <button
                        bind:this={buttonRefs[rowKey]}
                        on:click={() => handleMoreClick(rowKey)}
                        class="icon-button"><More size={'1.4em'} /></button
                      >
                    </td>
                  </tr>
                {/each}
              </tbody>
            </table>
          </div>
        {:else}
          <div class="empty-results-container"><div>{emptyTableMessage}</div></div>
        {/if}
        <div class="paginate">
          <TablePaginate />
        </div>
      </div>
    </div>
  {:else}
    <div class="empty-results">{emptyTableMessage}</div>
  {/if}
</div>
{#key copyCounter}
  <Snack message="Copied to clipboard" on:snackClose={handleSnackClose} show={showSnack} />
{/key}

<Modal bind:isOpen triggerRef={buttonRefs[currentSiteKey]}>
  <TableAction
    on:deleteKey={handleTableDelete}
    on:tableEntry={handleTableUpdate}
    currentSiteData={{ site: currentSiteKey, ...$tableStore[currentSiteKey] }}
  />
</Modal>

<style>
  .icon-data {
    text-align: center;
    vertical-align: middle;
    max-width: 70px;
    min-width: 70px;
  }

  .site-col {
    max-width: 250px;
    min-width: 250px;
    overflow-wrap: break-word;
  }

  .data-cols {
    overflow-wrap: break-word;
  }

  .button-cols {
    text-align: center;
  }

  .table-content {
    justify-content: center;
    /* flex-direction: column; */
    display: flex;
  }

  .table-container {
    margin-left: 80px;
    margin-top: 16px;
  }

  .pass-table {
    display: flex;
    flex-direction: column;
    box-shadow: var(--container-shadow);
    max-height: calc(100vh - 100px);
    min-height: calc(100vh - 100px);
    overflow-x: hidden;
  }

  .table-item {
    overflow-y: scroll;
    border-radius: 2px;
  }

  .empty-results-container {
    display: flex;
    overflow-x: scroll;
    width: 100%;
    height: 100%;
    font-size: 1.4rem;
    align-items: center;
    overflow-wrap: break-word;
    overflow-x: auto;
    padding: 20px;
  }

  @media (min-width: 800px) {
    .empty-results-container {
      min-width: 987px;
    }
  }

  @media (min-width: 1150px) {
    .empty-results-container {
      justify-content: center;
    }
  }

  .paginate {
    margin-top: auto;
  }
  table {
    border-collapse: collapse;
    table-layout: fixed;
    border-bottom: 1px solid var(--green);
  }

  td,
  th {
    box-shadow: 0 -1px 0px 0px var(--green);
    background-color: var(--bg-primary);
    text-align: left;
    display: table-cell;
    padding: 8px 12px;
    overflow-wrap: break-word;
  }
  td {
    max-width: 150px;
    min-width: 150px;
  }

  thead {
    display: table-header-group;
    font-size: 1.4rem;
    text-transform: capitalize;
  }

  tr {
    font-size: 1.1rem;
    line-height: 1.1rem;
    color: inherit;
    display: table-row;
    vertical-align: middle;
    outline: 0px;
    min-height: 70px;
  }

  table tbody th {
    font-weight: 100;
    text-align: left;
    position: relative;
  }

  table thead th {
    position: sticky;
    top: 0;
    z-index: 1;
    background: var(--bg-secondary);
    box-shadow: inset 0 -3px 0px 0px var(--green);
  }

  table thead th:first-child {
    position: sticky;
    left: 0;
    z-index: 4;
    box-shadow: inset -3px 0 0px 0px var(--green), inset 0 -3px 0px 0px var(--green);
  }

  table tbody th {
    position: sticky;
    left: 0;
    z-index: 3;
    box-shadow: inset -3px 0 0px 0px var(--green), inset 0 -1px 0px 0px var(--green);
    background: var(--bg-secondary);
  }
  th {
    box-shadow: 0.25em 0.25em 0.25em rgba(0, 0, 0, 0.4);
  }

  table tbody th:last-child {
    position: sticky;
    left: 0;
    z-index: 3;
    box-shadow: inset -1px 0 0px 0px var(--green);
    background: var(--bg-secondary);
  }

  table > tbody > tr:last-child > th {
    box-shadow: inset -3px 0 0px 0px var(--green);
  }

  .active-sort {
    transform: rotate(180deg);
  }

  .header-cell {
    height: 52px;
  }
</style>
