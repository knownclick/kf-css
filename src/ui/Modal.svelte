<!--
  @component
  Modal Component
  
  Usage:
  ```svelte
  <script>
    import { Modal } from 'kf-css/ui';
    let isOpen = false;
  </script>

  <Modal bind:open={isOpen} title="My Modal" size="m">
    <p>Modal content goes here.</p>
    <div slot="footer">
      <button on:click={() => isOpen = false}>Close</button>
    </div>
  </Modal>
  ```
-->
<script>
  import { createEventDispatcher } from 'svelte';
  import { fade, scale } from 'svelte/transition';

  export let open = false;
  export let title = '';
  export let size = 'm'; // s, m, l, xl

  const dispatch = createEventDispatcher();

  function close() {
    open = false;
    dispatch('close');
  }

  function handleKeydown(e) {
    if (e.key === 'Escape' && open) {
      close();
    }
  }
</script>

<svelte:window on:keydown={handleKeydown} />

{#if open}
  <div
    class="fixed inset-0 z-modal flex items-center justify-center p-m"
    role="dialog"
    aria-modal="true"
  >
    <!-- Backdrop -->
    <div
      class="absolute inset-0 bg-surface-90 bg-blur-s"
      transition:fade={{ duration: 200 }}
      on:click={close}
    ></div>

    <!-- Content -->
    <div
      class="relative z-10 bg-surface border border-muted-20 radius-l shadow-l flex flex-col width-100 overflow-hidden {size ===
      's'
        ? 'm:max-w-s'
        : ''} {size === 'm' ? 'm:max-w-m' : ''} {size === 'l'
        ? 'm:max-w-l'
        : ''} {size === 'xl' ? 'm:max-w-xl' : ''}"
      transition:scale={{ start: 0.95, duration: 200 }}
    >
      {#if title}
        <div
          class="p-m border-bottom border-muted-20 flex justify-between items-center bg-surface-l-1"
        >
          <h3 class="text-l font-600 text-title m-0">{title}</h3>
          <button
            class="p-s radius-s hover:bg-muted-20 cursor-pointer border-none bg-transparent text-muted hover:text-title transition-colors"
            on:click={close}
            aria-label="Close"
          >
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>
      {/if}

      <div class="p-l overflow-y-auto max-h-[80vh]">
        <slot />
      </div>

      {#if $$slots.footer}
        <div
          class="p-m border-top border-muted-20 bg-surface-l-1 flex justify-end gap-s"
        >
          <slot name="footer" />
        </div>
      {/if}
    </div>
  </div>
{/if}
