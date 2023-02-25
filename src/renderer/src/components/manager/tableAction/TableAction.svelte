<script lang="ts">
  import { Tabs, TabList, TabPanel, Tab } from '../../../lib/tabs/index';
  import DeleteForm from './DeleteForm.svelte';
  import SiteForm from '../SiteForm.svelte';
  import type { SiteData } from '../../../actions/tableDataActions';

  export let currentSiteData: SiteData;
</script>

<Tabs>
  <TabList>
    <Tab>Update</Tab>
    <Tab>Delete</Tab>
  </TabList>

  <TabPanel>
    <SiteForm on:tableEntry {currentSiteData} siteExistsError={false} newPassphrase={false} />
  </TabPanel>

  <TabPanel>
    <DeleteForm on:deleteKey key={currentSiteData.site} />
  </TabPanel>
</Tabs>
