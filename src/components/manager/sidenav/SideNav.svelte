<script lang="ts">
  import { afterUpdate } from "svelte";
  import { fade } from "svelte/transition";
  import Filter from "svelte-material-icons/Filter.svelte";
  import Search from "svelte-material-icons/Magnify.svelte";
  import Close from "svelte-material-icons/Close.svelte";
  import Account from "svelte-material-icons/Account.svelte";
  import ShipWheel from "svelte-material-icons/ShipWheel.svelte";
  import DatabaseImport from "svelte-material-icons/DatabaseImport.svelte";
  import Lock from "svelte-material-icons/Lock.svelte";
  import TagFilter from "./Filter.svelte";
  import SiteSearch from "./Search.svelte";
  import NewSiteEntry from "./NewSiteEntry.svelte";
  import UpdatePass from "./UpdatePass.svelte";
  import { clickOutside } from "../../../utils/clickOutside";
  import Export from "./Export.svelte";
  import Import from "./import/Import.svelte";
  import {
    appliedFilters,
    currentSearch,
    sideNavOpen,
  } from "../../../stores/store";

  let isOpen = false;

  let closeButtonRef: HTMLButtonElement;
  let buttonRefs: { [key: string]: HTMLButtonElement } = {};
  let activeNavigation: string;
  let activeToolTip: { position: number; label: string };

  const navButtons = [
    { id: "search", label: "Search", component: Search },
    { id: "filter", label: "Filters", component: Filter },
    {
      id: "newEntry",
      label: "New Entry",
      component: Lock,
    },
    {
      id: "account",
      label: "account settings",
      component: Account,
    },
    {
      id: "export",
      label: "Export Table Data",
      component: ShipWheel,
    },
    {
      id: "import",
      label: "Import Table Data",
      component: DatabaseImport,
    },
  ];

  const handleToolTip = (position: number, label: string) => {
    activeToolTip = { position, label };
  };

  const sideNavigation = {
    search: SiteSearch,
    filter: TagFilter,
    newEntry: NewSiteEntry,
    account: UpdatePass,
    export: Export,
    import: Import,
  };

  const handleIconClick = (icon: string) => {
    isOpen = true;
    sideNavOpen.set(true);
    activeNavigation = icon;
    activeToolTip = undefined;
  };

  const handleEsc = (e: KeyboardEvent) => e.key === "Escape" && handleClose();

  const handleClose = () => {
    isOpen = false;
    sideNavOpen.set(false);
  };

  const hasActiveFilter = (id: string) =>
    (id === "search" && $currentSearch && $currentSearch.length) ||
    (id === "filter" && $appliedFilters && $appliedFilters.length);

  afterUpdate(() => {
    if (isOpen) {
      closeButtonRef && closeButtonRef.focus();
    } else if (activeNavigation) {
      buttonRefs[activeNavigation].focus();
      activeNavigation = null;
    }
  });
</script>

<div
  on:keydown={handleEsc}
  style={!$sideNavOpen && "width: 70px"}
  class="sidenav"
  use:clickOutside
  on:outclick={handleClose}
>
  <div class="icon-container">
    {#if $sideNavOpen}
      <div class="close-container">
        <button
          bind:this={closeButtonRef}
          class="icon-button"
          on:click={handleClose}
          in:fade={{ delay: 90 }}
        >
          <Close size={"1.25em"} />
        </button>
      </div>
    {/if}

    {#if !$sideNavOpen}
      {#each navButtons as navButton}
        <div class="icon-item" in:fade={{ delay: 90 }}>
          <button
            on:mouseenter={() =>
              handleToolTip(
                buttonRefs[navButton.id].getBoundingClientRect().top,
                navButton.label
              )}
            on:mouseleave={() => (activeToolTip = undefined)}
            bind:this={buttonRefs[navButton.id]}
            aria-label={`Open ${navButton.label}`}
            class="icon-button"
            class:engaged-icon={hasActiveFilter(navButton.id)}
            on:click={() => handleIconClick(navButton.id)}
          >
            <svelte:component this={navButton.component} size={"2em"} />
          </button>
        </div>
      {/each}
    {/if}
  </div>

  {#if $sideNavOpen}
    <div in:fade={{ delay: 90 }}>
      <svelte:component
        this={sideNavigation[activeNavigation]}
        on:close={handleClose}
      />
    </div>
  {/if}
</div>
{#if isOpen}
  <aside in:fade={{ delay: 50 }} />
{/if}

{#if activeToolTip}
  <div class="tooltip" style={`top: ${activeToolTip.position + 8}px`}>
    {activeToolTip.label}
  </div>
{/if}

<style>
  .sidenav {
    border-right: 1px solid var(--green);
    width: 450px;
    position: fixed;
    z-index: 9;
    top: 70px;
    bottom: 0;
    left: 0;
    background-color: var(--bg-secondary);
    overflow-x: hidden;
    overflow-y: scroll;
    padding-top: 20px;
    transition: 0.1s ease-in-out;
    transition-property: width;
    scrollbar-width: thin;
  }

  .icon-container {
    display: flex;
    flex-direction: column;
    align-items: center;
    margin-top: -15px;
  }

  .close-container {
    width: 100%;
    height: 44px;
    display: flex;
    justify-content: flex-end;
    padding-right: 5px;
    transition: none;
  }

  .icon-item {
    padding: 10px;
    font-size: 0.8rem;
  }

  aside {
    position: fixed;
    top: 71px;
    left: 451px;
    bottom: 0;
    right: 0;
    background: rgba(0, 0, 0, 0.5);
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 20px;
    z-index: 9;
  }

  .tooltip {
    position: fixed;
    border-radius: 5px;
    left: 71px;
    background: var(--tooltip-bg);
    color: var(--tooltip-color);
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 12px;
    z-index: 999;
    text-transform: capitalize;
    font-weight: bold;
  }

  .engaged-icon {
    color: var(--light-blue);
  }
</style>
