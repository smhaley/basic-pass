<script lang="ts">
  import Nav from "../ui-components/Nav.svelte";
  import SideNav from "./sidenav/SideNav.svelte";
  import Table from "./Table.svelte";
</script>

<Nav />
<SideNav />
<Table />
<!-- <div class="table-content">
  <div class="main-container">

  </div>
</div> -->

<!-- <div class="main-container">
  <div class="table-container">
    <div class="table-content" />
  </div>
</div> -->
<style>
  .main-container {
    display: flex;
    justify-content: center;
  }
  .table-content {
    position: fixed;
    left: 50px;
    width: 100%;
    margin-top: 16px;
  }
</style>
