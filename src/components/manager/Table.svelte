<script lang="ts">
  import { afterUpdate } from "svelte";
  import Snack from "../../lib/Snack.svelte";
  import More from "svelte-material-icons/DotsHorizontal.svelte";
  import ContentCopy from "svelte-material-icons/ContentCopy.svelte";
  import Modal from "../../lib/Modal.svelte";
  import {
    tableStore,
    tableResults,
    appliedFilters,
    currentSearch,
    tableSize,
  } from "../../stores/store";
  import TableAction from "./tableAction/TableAction.svelte";

  import type {
    SiteData,
    DeleteTableEntry,
  } from "../../actions/tableDataActions";

  let showSnack = false;
  let isOpen = false;
  let currentSiteKey: string;

  let buttonRefs: { [key: string]: HTMLButtonElement } = {};
  let emptyTableMessage: string;

  const dataCols = ["user", "date", "tag"];
  const buttonCols = ["passphrase", "actions"];
  const tableCols = ["site", ...dataCols, ...buttonCols];

  const getRowDataByKey = (key: string) => {
    const rowObj = { ...$tableStore[key] };
    delete rowObj.passphrase;
    const creationDate = new Date(parseInt(rowObj.timestamp));
    rowObj.timestamp = creationDate.toLocaleDateString();
    return Object.values(rowObj).map((val) => val);
  };

  const handlePassClick = (siteKey: string) => {
    showSnack = true;
    if ($tableStore && $tableStore[siteKey]) {
      console.log($tableStore[siteKey].passphrase);
      navigator.clipboard.writeText($tableStore[siteKey].passphrase);
    }
  };

  const handleMoreClick = (site: string) => {
    isOpen = true;
    currentSiteKey = site;
    console.log(site);
  };

  const handleSnackClose = (e: CustomEvent<{ show: boolean }>) =>
    (showSnack = e.detail.show);

  const handleTableDelete = (e: CustomEvent<DeleteTableEntry>) => {
    tableStore.deleteTableKey(e.detail.siteKey);
    isOpen = false;
  };

  const handleTableUpdate = (e: CustomEvent<SiteData>) => {
    const { username, passphrase, timestamp, site, tag } = e.detail;
    const tableEntry = { username, passphrase, timestamp, tag };
    tableStore.updateTableKey(site, tableEntry);
    isOpen = false;
  };

  const generateEmptyTableMessage = () => {
    if (!$tableResults) {
      if ($appliedFilters.length || $currentSearch.length) {
        return "Your current search and/or filters have no results.";
      }
    }
    return "Your vault is currently empty.";
  };

  afterUpdate(() => {
    console.log($tableResults);
    emptyTableMessage = generateEmptyTableMessage();
  });
</script>

<div class="table-container">
  {#if $tableResults && $tableSize > 0}
    <div class="table-content">
      <div>
        <table>
          <thead>
            <tr>
              {#each tableCols as col}
                <th
                  class:site-col={col === "site"}
                  class:data-cols={dataCols.includes(col)}
                  class:button-cols={buttonCols.includes(col)}
                  class="header-row">{col}</th
                >
              {/each}
            </tr>
            <thead />
          </thead>
          <tbody>
            {#each Object.keys($tableResults) as rowKey, i}
              <tr>
                <th class="site-col">{rowKey}</th>
                {#each getRowDataByKey(rowKey) as rowData, i}
                  <td class="data-col">{rowData}</td>
                {/each}
                <td class="icon-data">
                  <button
                    on:click={() => handlePassClick(rowKey)}
                    class="icon-button"><ContentCopy size={"1.4em"} /></button
                  >
                </td>
                <td class="icon-data">
                  <button
                    bind:this={buttonRefs[rowKey]}
                    on:click={() => handleMoreClick(rowKey)}
                    class="icon-button"><More size={"1.4em"} /></button
                  >
                </td>
              </tr>
            {/each}
          </tbody>
        </table>
      </div>
    </div>
  {:else}
    <div class="empty-results">{emptyTableMessage}</div>
  {/if}
</div>
<Snack
  message="Copied to clipboard"
  on:snackClose={handleSnackClose}
  show={showSnack}
/>

<Modal bind:isOpen triggerRef={buttonRefs[currentSiteKey]}>
  <TableAction
    on:deleteKey={handleTableDelete}
    on:tableEntry={handleTableUpdate}
    currentSiteData={{ site: currentSiteKey, ...$tableStore[currentSiteKey] }}
  />
</Modal>

<style>
  table {
    border-collapse: collapse;
    table-layout: fixed;
    box-shadow: var(--container-shadow);
  }

  td,
  th {
    /* border-bottom: 1px solid var(--green); */
    box-shadow: 0 -1px 0px 0px var(--green);
    background-color: var(--bg-primary);
    text-align: left;
    display: table-cell;
    padding: 14px 30px;
    overflow-wrap: break-word;
  }
  td {
    max-width: 100px;
    min-width: 100px;
  }

  thead {
    display: table-header-group;
    font-size: 1.4rem;
    text-transform: capitalize;
  }
  tr {
    font-size: 1.1rem;
    padding: 14px;
    line-height: 1.1rem;
    color: inherit;
    display: table-row;
    vertical-align: middle;
    outline: 0px;
    min-height: 70px;
  }

  .icon-data {
    text-align: center;
    vertical-align: middle;
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
    overflow: auto;
    justify-content: center;
    display: flex;
    height: calc(100vh - 90px);
  }

  .table-container {
    margin-left: 80px;
    margin-top: 16px;
    height: 100%;
  }

  .empty-results {
    display: flex;
    width: 100%;
    height: 300px;
    font-size: 1.4rem;
    justify-content: center;
    align-items: center;
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
    box-shadow: inset 0 -1px 0px 0px var(--green);
  }

  table thead th:first-child {
    position: sticky;
    left: 0;
    z-index: 4;
    box-shadow: inset -1px 0 0px 0px var(--green),
      inset 0 -1px 0px 0px var(--green);
  }

  table tbody th {
    position: sticky;
    left: 0;
    z-index: 3;
    box-shadow: inset -1px 0 0px 0px var(--green),
      inset 0 -1px 0px 0px var(--green);
    background: var(--bg-secondary);
  }

  table tbody th:last-child {
    position: sticky;
    left: 0;
    z-index: 3;
    box-shadow: inset -1px 0 0px 0px var(--green);
    background: var(--bg-secondary);
  }

  table > tbody > tr:last-child > th {
    box-shadow: inset -1px 0 0px 0px var(--green);
  }
</style>
