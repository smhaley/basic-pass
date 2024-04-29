<script lang="ts">
  import type { ErrMsgs, ErrObj } from '../components/error-utils';
  import MenuDownOutline from 'svelte-material-icons/MenuDownOutline.svelte';
  import { clickOutside } from '../utils/clickOutside';
  import { fuzzyMatch } from '../stores/utils';

  export let label: string;
  export let errs: ErrObj | undefined = undefined;
  export let errMsgs: ErrMsgs | undefined = undefined;
  export let value: string;
  export let type = 'text';
  export let options: string[] = undefined;

  let isDropdownOpen = false;
  let listItems = [];

  let activeOptions = options.map((value) => {
    return {
      label: value,
      value
    };
  });

  const typeAction = (node: HTMLInputElement) => {
    node.type = type;
  };

  let focusedItemIndex = -1;

  const openDropDown = (e?: Event) => {
    e && e.preventDefault();
    isDropdownOpen = true;
    focusedItemIndex = 0; // Focus on the first item when opening the dropdown
    listItems[focusedItemIndex]?.focus(); // Focus on the first item
  };

  const closeDropDown = () => {
    isDropdownOpen = false;
    focusedItemIndex = -1;
  };

  const scrollToFocusedItem = () => {
    const focusedItem = listItems.filter((item) => item)[focusedItemIndex];
    if (focusedItem) {
      focusedItem.scrollIntoView({ block: 'nearest', inline: 'nearest' });
    }
  };

  const handleKeydown = (event: KeyboardEvent) => {
    if (event.key === 'Tab' || (event.shiftKey && event.key === 'Tab')) {
      closeDropDown();
      return;
    }
    if (!isDropdownOpen) {
      openDropDown();
    }

    const availableOptions = listItems.filter((i) => i);

    if (event.key === 'Enter') {
      event.preventDefault();
      isDropdownOpen = false;
      value = activeOptions[focusedItemIndex].value;
    }
    if (event.key === 'ArrowDown') {
      if (!isDropdownOpen) {
        isDropdownOpen = true;
      }
      focusedItemIndex = (focusedItemIndex + 1) % availableOptions.length;
    } else if (event.key === 'ArrowUp') {
      focusedItemIndex = (focusedItemIndex - 1 + availableOptions.length) % options.length;
    }
    scrollToFocusedItem();
  };

  const handleChange = (e: Event) => {
    const newTag = (e.target as HTMLInputElement).value;
    const updatedItems = [];
    const visibleNodes = [];

    let hasExact = false;

    options.forEach((val, idx) => {
      if (newTag?.toLowerCase() === val.toLowerCase()) {
        hasExact = true;
      }
      if (fuzzyMatch(newTag.toLowerCase(), val.toLowerCase())) {
        updatedItems.push({ label: val, value: val.toLowerCase() });
        visibleNodes.push(listItems[idx]);
      }
    });

    if (newTag.length > 0 && !hasExact) {
      updatedItems.push({ label: `Create: "${newTag}"`, value: newTag });
    }
    activeOptions = updatedItems;
    focusedItemIndex = -1;
  };
  $: {
    isDropdownOpen;
  }
</script>

<div
  class="section autocomplete__container"
  role="combobox"
  on:outClick={() => (isDropdownOpen = false)}
  aria-labelledby="autocomplete-label"
  aria-expanded={isDropdownOpen}
  use:clickOutside
>
  <label for={label}>{label}</label>
  <input
    class={`text-input ${errs && (errs.missing || errs.invalid) && 'err-input'}`}
    use:typeAction
    bind:value
    on:input={(e) => handleChange(e)}
    placeholder={options && `Type or select a ${label}`}
    role="textbox"
    id={`autocomplete-input`}
    on:keydown={handleKeydown}
    on:click={(e) => {
      isDropdownOpen = !isDropdownOpen;
      return isDropdownOpen ? openDropDown(e) : closeDropDown();
    }}
  />

  {#if Array.isArray(options)}
    <div
      class="icon-span"
      on:click={(e) => {
        isDropdownOpen = !isDropdownOpen;
        return isDropdownOpen ? openDropDown(e) : closeDropDown();
      }}
    >
      <span class="indicator-separator" />
      <span class={`autocomplete__dropdown-arrow`}>
        <MenuDownOutline />
      </span>
    </div>
    <ul
      role="listbox"
      id="autocomplete-results"
      class={`autocomplete__results ${isDropdownOpen && 'visible'}`}
    >
      {#each activeOptions as option, index}
        <li
          bind:this={listItems[index]}
          on:click={() => {
            value = option.value;
            closeDropDown();
          }}
          on:focus={() => {
            focusedItemIndex = index;
          }}
          class={`autocomplete-item ${focusedItemIndex === index && 'focus'}`}
          id="autocomplete-item-index"
          role="listitem"
        >
          {option.label}
        </li>
      {/each}
    </ul>
  {/if}

  {#if errs && errs.missing}
    <p class="error">{errMsgs.missing}</p>
  {:else if errs && errs.invalid}
    <p class="error">{errMsgs.invalid}</p>
  {:else}
    <p class="error" />
  {/if}
</div>

<style>
  .section {
    margin: 12px 0;
  }

  .autocomplete__container {
    position: relative;
    margin-top: '0.8rem';
    width: 100%;
    /* max-width: 350px; */
  }

  .autocomplete__results.visible {
    z-index: 10;
    margin-top: -10px;
    background-color: var(--bg-color);
    visibility: visible;
  }

  .autocomplete__input {
    display: block;
    width: 100%;
    padding: 0.4rem 0rem 0.4rem 1rem;
    border: 2px solid hsl(212, 10%, 80%);
    border-radius: 5px;
  }

  .autocomplete__input:focus {
    /* border-color: hsl(221, 61%, 40%); */
    border-color: var(--link-color);
  }

  .autocomplete__dropdown-arrow.expanded {
    transform: rotate(-180deg);
    right: 11px;
    top: 40px;
  }

  .icon-span {
    z-index: 30;
    position: absolute;
    right: 1px;
    top: 40px;
    border: none;
    cursor: pointer;
    height: 100%;
    width: 50px;
    height: 30px;
    transition: transform 0.2s linear;
    width: 40px;
    z-index: 11;
    background: var(--bg-secondary);
  }

  .autocomplete__results {
    visibility: hidden;
    position: absolute;
    top: 100%;
    margin-top: 0;
    width: 100%;
    overflow-y: auto;
    border: 1px solid #999;
    padding: 0;
    max-height: 200px;
  }

  .autocomplete__results > li {
    list-style: none;
    padding: 0.4rem 1rem;
    cursor: pointer;
  }

  .autocomplete__results > li:hover {
    color: black;
    background: var(--link-hover);
  }

  .autocomplete__dropdown-arrow {
    z-index: 30;
    position: absolute;
    right: 11px;
    top: 8px;
    background: transparent;
    border: none;
    cursor: pointer;
    height: 100%;
    transition: transform 0.2s linear;
  }

  .indicator-separator {
    z-index: 30;
    background-color: rgb(204, 204, 204);
    width: 1px;
    height: 30px;
    position: absolute;
    right: 40px;
    top: 0px;
    border: none;
    cursor: pointer;
    transition: transform 0.2s linear;
  }

  .autocomplete-item.focus {
    background: var(--link-color);
  }
</style>
