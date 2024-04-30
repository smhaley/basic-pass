<script lang="ts">
  import SiteForm from '../SiteForm.svelte';
  import type { SiteData } from '../../../actions/tableDataActions';
  import { tableStore } from '../../../stores/store';
  import { createEventDispatcher } from 'svelte';
  import { BasicCrypto } from '../../../utils/crypto/basic-crypto';
  import { userStore } from '../../../stores/store';
  import { BgStyle } from '../../../lib/InputSelect/InputSelect.types';

  const dispatch = createEventDispatcher();

  let currentSites: string[] | undefined = Object.keys($tableStore);
  let siteExistsError = false;

  const handleNewEntry = async (e: CustomEvent<SiteData>) => {
    const { username, passphrase, timestamp, site, tag } = e.detail;
    const tableEntry = { username, passphrase, timestamp, tag };

    const isSiteInStore = currentSites.includes(site);
    if (isSiteInStore) {
      siteExistsError = true;
    } else {
      const updateTableData = tableStore.addTableEntry(site, tableEntry);
      BasicCrypto.handleSrcTableUpdate(updateTableData, $userStore.passphrase, $userStore.username);
      dispatch('close');
    }
  };
</script>

<div>
  <SiteForm on:tableEntry={handleNewEntry} {siteExistsError} bgStyle={BgStyle.secondary} />
</div>

<style>
  div {
    margin-bottom: 16px;
  }
</style>
