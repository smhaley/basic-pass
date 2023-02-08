<script lang="ts">
  import SiteForm from "../SiteForm.svelte";
  import type { SiteData } from "../../../actions/tableDataActions";
  import { tableStore } from "../../../stores/store";
  import { createEventDispatcher } from "svelte";

  const dispatch = createEventDispatcher();

  let currentSites: string[] | undefined = Object.keys($tableStore);
  let siteExistsError = false;

  const handleNewEntry = (e: CustomEvent<SiteData>) => {
    const { username, passphrase, timestamp, site, tag } = e.detail;
    const tableEntry = { username, passphrase, timestamp, tag };

    const isSiteInStore = currentSites.includes(site);
    if (isSiteInStore) {
      siteExistsError = true;
    } else {
      tableStore.addTableEntry(site, tableEntry);
      dispatch("close");
    }
  };
</script>

<h2 class="heading-container">New Site Entry</h2>
<div>
  <SiteForm on:tableEntry={handleNewEntry} {siteExistsError} />
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
</style>
