<script lang="ts">
  import Nav from '../ui-components/Nav.svelte';
  import { onMount } from 'svelte';
  import SideNav from './sidenav/SideNav.svelte';
  import Table from './Table.svelte';
  import { IdleTimer } from '../../utils/timeout';
  import { logout } from '../../actions/authActions';

  onMount(() => {
    const timeout = new IdleTimer(5, logout);
    return () => {
      timeout.cleanup();
    };
  });
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
