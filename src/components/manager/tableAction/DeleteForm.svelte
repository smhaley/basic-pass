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

  <div class="button-group">
    <button class="primary-button" on:click={handleDelete}
      >Delete Site Entry</button
    >
  </div>
</div>

<style>
  h2 {
    font-weight: normal;
  }
  button {
    margin-left: auto;
  }

  .head-container {
    padding-left: 12px;
  }
</style>
