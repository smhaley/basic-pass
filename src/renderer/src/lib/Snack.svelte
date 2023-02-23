<script lang="ts">
  import { createEventDispatcher } from "svelte";
  import Success from "svelte-material-icons/CheckboxMarkedCirclePlusOutline.svelte";
  import Error from "svelte-material-icons/AlertCircle.svelte";
  
  const dispatch = createEventDispatcher<{ snackClose: { show: boolean } }>();

  export let show = false;
  export let message: string;
  export let type: "success" | "error" = "success";
  $: if (show) handleSnack();

  const handleSnack = () => {
    setTimeout(function () {
      dispatch("snackClose", {
        show: false,
      });
    }, 3000);
  };
</script>

<div class={`snackbar ${show && "show"} ${type === "error" && "snack-err"}`}>
  {#if type === "success" || !type}
    <Success size={"2rem"} />
  {:else}
    <Error size={"2rem"} />
  {/if}
  {message}
</div>

<style>
  .snackbar {
    visibility: hidden;
    min-width: 250px;
    margin-left: -125px;
    background-color: var(--light-green);
    color: #333;
    text-align: center;
    border-radius: 2px;
    padding: 12px;
    position: fixed;
    z-index: 1;
    left: 50%;
    bottom: 30px;
    font-size: 1.3rem;
    border-radius: 3px;
    font-weight: bold;
  }

  .snack-err {
    background-color: var(--red-dark);
    color: #c1bfbd;
  }

  div {
    display: flex;
    align-items: center;
    justify-content: space-between;
  }

  .show {
    visibility: visible;
    -webkit-animation: fadein 0.5s, fadeout 0.5s 2.5s;
    animation: fadein 0.5s, fadeout 0.5s 2.5s;
  }

  @-webkit-keyframes fadein {
    from {
      bottom: 0;
      opacity: 0;
    }
    to {
      bottom: 30px;
      opacity: 1;
    }
  }

  @keyframes fadein {
    from {
      bottom: 0;
      opacity: 0;
    }
    to {
      bottom: 30px;
      opacity: 1;
    }
  }

  @-webkit-keyframes fadeout {
    from {
      bottom: 30px;
      opacity: 1;
    }
    to {
      bottom: 0;
      opacity: 0;
    }
  }

  @keyframes fadeout {
    from {
      bottom: 30px;
      opacity: 1;
    }
    to {
      bottom: 0;
      opacity: 0;
    }
  }
</style>
