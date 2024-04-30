<script lang="ts">
  import Close from 'svelte-material-icons/Close.svelte';
  import { afterUpdate } from 'svelte';
  import { fade, scale } from 'svelte/transition';
  import { trapFocus } from '../utils/trapFocus';

  export let triggerRef = undefined;
  export let title: string = undefined;
  export let isOpen = false;
  export let role = 'dialog';

  let buttonRef: HTMLButtonElement;
  let modal: HTMLElement;

  const handleClose = () => (isOpen = false);
  const handleEsc = (e: KeyboardEvent) => e.key === 'Escape' && handleClose();

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
    bind:this={modal}
    on:keydown={handleEsc}
    aria-labelledby="modal-heading"
    aria-modal="true"
    tabIndex="-1"
    {role}
    in:fade
    out:fade
    on:click|self={handleClose}
    class="overlay"
  >
    <div
      in:scale={{ start: 0.8 }}
      out:scale={{ start: 0.8 }}
      class="box"
      role="dialog"
      on:keydown={(e) => trapFocus(e, modal)}
    >
      <header>
        {#if title}
          <h3 id="modal-heading">{title}</h3>
        {/if}
        <button
          aria-label="Close modal"
          class="icon-button"
          bind:this={buttonRef}
          on:click={handleClose}><Close size={'1.25em'} /></button
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
    width: 100%;
    height: 100%;
    box-shadow: var(--container-shadow);
  }

  aside .box {
    width: 600px;
    max-width: 100%;
    height: 500px;
    max-height: 100%;
    box-shadow:
      0 4px 8px 0 rgba(0, 0, 0, 0.2),
      0 6px 20px 0 rgba(0, 0, 0, 0.19);
    background: var(--bg-color);
    border-radius: 4px;
    position: relative;
    box-sizing: 0 0 20px 0px rgba(0, 0, 0, 0.3);
    overflow-y: scroll;
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
