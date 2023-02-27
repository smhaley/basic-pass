<script lang="ts">
  import MenuRight from 'svelte-material-icons/MenuRight.svelte';
  import MenuLeft from 'svelte-material-icons/MenuLeft.svelte';

  let current: number[] = [0, 9]; //[a,b)
  let total: number = 100;
</script>

<div class="container">
  <div class="paginate">
    <div class="showing">
      <p>Showing {current[0] + 1} to {current[1] + 1} of {total}</p>
    </div>
    <div class="button-container">
      <ul>
        <li>
          <button class="icon-button"><MenuLeft size="1.7rem" /></button>
        </li>
        <li>
          <button class="icon-button"><MenuRight size="1.7rem" /></button>
        </li>
      </ul>
    </div>
  </div>
</div>

<style>
  .container {
    font-size: 1.2rem;
    position: sticky;
    left: 0;
    z-index: 3;
    padding: 0 8px;
  }

  .button-container {
    flex-shrink: 0;
  }

  .paginate {
    display: flex;
    align-items: center;
    justify-content: space-between;
  }

  .showing {
    flex-shrink: 0;
  }

  li {
    display: inline-block;
  }
</style>
