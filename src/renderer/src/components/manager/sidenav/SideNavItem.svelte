<script lang="ts">
  export let name: string;
</script>

<h2 class="heading-container">{name}</h2>
<slot />

<style>
  h2 {
    margin: 0;
  }
  .heading-container {
    width: 100%;
    text-align: center;
  }
</style>
