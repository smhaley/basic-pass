<script lang="ts">
  import Close from "svelte-material-icons/Close.svelte";
  import { afterUpdate } from "svelte";
  import { fade, scale } from "svelte/transition";

  export let triggerRef = undefined;
  export let title: string = undefined;
  export let isOpen = false;
  export let role = "dialog";

  let buttonRef: HTMLButtonElement;

  const handleClose = () => (isOpen = false);
  const handleEsc = (e: KeyboardEvent) => e.key === "Escape" && handleClose();

  afterUpdate(() => {
    if (isOpen) {
      buttonRef.focus();
    } else {
      triggerRef && triggerRef.focus();
    }
  });
</script>

{#if isOpen}
  <aside
    on:keydown={handleEsc}
    aria-labelledby="modal-heading"
    aria-modal="true"
    tabIndex={-1}
    {role}
    in:fade
    out:fade
    on:click|self={handleClose}
    class="overlay"
  >
    <div in:scale={{ start: 0.8 }} out:scale={{ start: 0.8 }} class="box">
      <header>
        {#if title}
          <h3 id="modal-heading">{title}</h3>
        {/if}
        <button
          aria-label="Close modal"
          class="icon-button"
          bind:this={buttonRef}
          on:click={handleClose}><Close size={"1.25em"} /></button
        >
      </header>
      <main>
        <slot>No content provided</slot>
      </main>
    </div>
  </aside>
{/if}

<style>
  * {
    box-sizing: border-box;
  }
  aside {
    position: fixed;
    top: 0;
    left: 0;
    bottom: 0;
    right: 0;
    background: rgba(0, 0, 0, 0.5);
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 20px;
    z-index: 999;
    box-shadow: var(--container-shadow);
  }

  aside .box {
    background: var(--bg-color);
    width: 600px;
    border-radius: 4px;
    position: relative;
    box-sizing: 0 0 20px 0px rgba(0, 0, 0, 0.3);
    overflow-y: scroll;
    max-height: 550px;
    overflow-wrap: break-word;
  }
  header {
    margin-top: 6px;
  }

  aside .box header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding-top: 20px;
  }

  aside .box header h3 {
    margin: 0;
  }

  aside .box header {
    background: none;
    border: none;
    padding: 0;
    font-size: 20px;
    position: absolute;
    right: 20px;
    font-weight: lighter;
    cursor: pointer;
  }

  aside .box main {
    padding: 20px;
    overflow: auto;
  }
</style>
