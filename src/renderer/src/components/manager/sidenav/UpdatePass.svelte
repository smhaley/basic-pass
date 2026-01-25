<script lang="ts">
  import UserForm from '../../auth/UserForm.svelte';
  import { userStore, tableStore, deleteUserStore } from '../../../stores/store';
  import type { User } from '../../../actions/authActions';
  import { createEventDispatcher } from 'svelte';
  import { BasicCrypto } from '../../../utils/crypto/basic-crypto';
  import { fade } from 'svelte/transition';

  let initiateDelete = false;
  const dispatch = createEventDispatcher();

  const handleUpdate = (e: CustomEvent<User>) => {
    const { passphrase } = e.detail;
    userStore.updatePass(passphrase);

    BasicCrypto.handleSrcTableUpdate($tableStore, passphrase, $userStore.username);
    dispatch('close');
  };
</script>

<div>
  <h3>Update Passphrase</h3>
  <UserForm on:userData={handleUpdate} currentUsername={$userStore.username} />
  <h3>Delete Store</h3>

  {#if !initiateDelete}
    <div class="button-group" in:fade={{ delay: 90 }}>
      <button
        class="danger-button"
        on:click={() => {
          initiateDelete = true;
        }}
      >
        Delete store
      </button>
    </div>
  {:else}
    <div in:fade={{ delay: 90 }}>
      <p><strong>Note: </strong>You cannot recover a deleted store</p>
      <div class="button-group">
        <button
          class="secondary-button"
          on:click={() => {
            initiateDelete = false;
          }}
        >
          Cancel
        </button>
        <button class="danger-button" on:click={deleteUserStore}> DANGER: Confirm Delete </button>
      </div>
    </div>
  {/if}
</div>

<style>
  strong {
    font-size: 1.2rem;
  }
</style>
