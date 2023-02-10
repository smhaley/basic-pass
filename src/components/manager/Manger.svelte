<script lang="ts">
  import Nav from "../ui-components/Nav.svelte";
  import SideNav from "./sidenav/SideNav.svelte";
  import Table from "./Table.svelte";
</script>

<Nav />
<SideNav />
<main class="table-container">
  <Table />
</main>

<style>
  .table-container {
/* height: 100%; */
    padding: 16px;

  }
</style>
