<script lang="ts">
  import { createEventDispatcher } from "svelte";
  import {
    DELETE_KEY,
    type DeleteAction,
  } from "../../../actions/tableDataActions";

  export let key: string;

  const dispatch = createEventDispatcher<DeleteAction>();

  const handleDelete = () => {
    dispatch(DELETE_KEY, {
      siteKey: key,
    });
  };
</script>

<div>
  <div class="head-container">
    <h1>Delete Store Item</h1>
    <h2>{key}</h2>
  </div>

  <button class="primary-button" on:click={handleDelete}
    >Delete Site Entry</button
  >
</div>

<style>
  button {
    margin: 12px;
  }

  .head-container {
    padding-left: 12px;
  }
</style>
