<script lang="ts">
  import type { ErrMsgs, ErrObj } from "../components/error-utils";

  export let label: string;
  export let errs: ErrObj | undefined;
  export let errMsgs: ErrMsgs | undefined;
  export let value: string;
  export let type = "text";

  const typeAction = (node: HTMLInputElement) => {
  node.type = type;
  };
</script>

<div class="section">
  <label for={label}>{label}</label>
  <input
    class={`${
      errs && (errs.missing || errs.invalid) && "err-input"
    } text-input`}
    id={label}
    use:typeAction
    bind:value
  />
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
</style>
