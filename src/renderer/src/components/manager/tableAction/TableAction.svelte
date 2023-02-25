<script lang="ts">
  import { Tabs, TabList, TabPanel, Tab } from '../../../lib/tabs/index';
  import DeleteForm from './DeleteForm.svelte';
  import SiteForm from '../SiteForm.svelte';
  import type { SiteData } from '../../../actions/tableDataActions';

  export let currentSiteData: SiteData;
</script>

<div>
  <Tabs>
    <TabList>
      <Tab>Update</Tab>
      <Tab>Delete</Tab>
    </TabList>

    <TabPanel>
      <div class="site-form">
        <SiteForm on:tableEntry {currentSiteData} siteExistsError={false} newPassphrase={false} />
      </div>
    </TabPanel>

    <TabPanel>
      <DeleteForm on:deleteKey key={currentSiteData.site} />
    </TabPanel>
  </Tabs>
</div>

<style>
  div {
    /* min-height: 450px;
    min-height: 450px; */
    overflow: auto;
    min-width: 500px;
  }

  .site-form {
    overflow-y: scroll;
    padding: 0 20px;
    max-height: 450px;
    height: 100%;
  }
</style>
