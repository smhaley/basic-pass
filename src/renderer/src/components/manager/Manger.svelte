<script lang="ts">
  import Nav from '../ui-components/Nav.svelte';
  import SideNav from './sidenav/SideNav.svelte';
  import Table from './Table.svelte';
</script>

<div>
  <Nav />
  <SideNav />
  <main>
    <Table />
  </main>
</div>

<style>
  div {
    padding-top: 60px;
    margin: 0 auto;
  }
</style>
