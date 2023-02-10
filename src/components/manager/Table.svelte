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
      <div class="table-item">
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
    /* height: 100px; */
  }

  td,
  th {
    border-bottom: 1px solid var(--green);
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

  .table-item {
    /* overflow-x: scroll; */
    /* max-height: 100vh; */
    /* padding-bottom: 16px; */
    /* width: ; */
  }

  .table-content {
    overflow: auto;
    justify-content: center;
    display: flex;
    /* height: 70%; */
    /* height: calc(90vh-100px); */
    height: calc(100vh - 100px);
    /* max-width: calc(100%-110px); */
    /* width: 98%; */
    background-color: aliceblue;
  }

  .table-container {
    background-color: blue;
    /* position: fixed;
    left: 100px;
    
    top:71;
    right: 0;
    margin-top: 16px; */
    margin-left: 80px;
    height: 100%;
    /* margin-top: 120px; */
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
    background: var(--bg-color);
    border-bottom: 1px solid var(--green);

    /* box-shadow: 0px 6px 0px rgba(0, 0, 0, 0.3); */
  }

  table thead th:first-child {
    position: sticky;
    /* border-right: 3px solid var(--green); */
    left: 0;
    z-index: 2;
  }
  table tbody th {
    position: sticky;
    left: 0;
    z-index: 2;
    border-bottom: 1px solid var(--green);
  }

  table thead th:first-child {
    position: sticky;
    left: 0;
    z-index: 4;
    box-shadow: inset -1px 0 0px 0px var(--green);
  }
  table tbody th {
    position: sticky;
    left: 0;
    z-index: 3;
    box-shadow: inset -1px 0 0px 0px var(--green);
    background: var(--bg-color);
  }
</style>
