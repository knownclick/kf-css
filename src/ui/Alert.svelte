<!--
  @component
  Alert Component
  
  Usage:
  ```svelte
  <script>
    import { Alert } from 'kf-css/ui';
  </script>

  <Alert type="info" title="Information" dismissible={true}>
    This is an important message.
  </Alert>
  ```
-->
<script>
  import { createEventDispatcher } from 'svelte';
  import { fade } from 'svelte/transition';

  export let type = 'info'; // info, success, warning, error
  export let title = '';
  export let dismissible = false;

  const dispatch = createEventDispatcher();
  let visible = true;

  function dismiss() {
    visible = false;
    dispatch('dismiss');
  }

  // Map types to styles
  const styles = {
    info: 'bg-surface-l-1 border-muted-20 text-body',
    success: 'bg-success-10 border-success-20 text-success-d-2',
    warning: 'bg-warning-10 border-warning-20 text-warning-d-2', // Note: warning color might need addition if not exists
    error: 'bg-error-10 border-error-20 text-error-d-2',
  };

  // Icon mapping
  const icons = {
    info: '<path stroke-linecap="round" stroke-linejoin="round" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />',
    success:
      '<path stroke-linecap="round" stroke-linejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />',
    warning:
      '<path stroke-linecap="round" stroke-linejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />',
    error:
      '<path stroke-linecap="round" stroke-linejoin="round" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />',
  };
</script>

{#if visible}
  <div
    class="flex items-start gap-m p-m border radius-m width-100 {styles[type]}"
    role="alert"
    transition:fade={{ duration: 200 }}
  >
    <div class="shrink-0 pt-3xs">
      <svg
        width="24"
        height="24"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        stroke-width="2"
      >
        {@html icons[type]}
      </svg>
    </div>

    <div class="grow">
      {#if title}
        <h4 class="text-m font-600 m-0 mb-2xs">{title}</h4>
      {/if}
      <div class="text-s line-height-l opacity-90">
        <slot />
      </div>
    </div>

    {#if dismissible}
      <button
        type="button"
        class="shrink-0 p-2xs -mr-xs -mt-xs bg-transparent border-none cursor-pointer opacity-70 hover:opacity-100 transition-opacity"
        on:click={dismiss}
        aria-label="Dismiss"
      >
        <svg
          width="20"
          height="20"
          fill="none"
          viewBox="0 0 24 24"
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
    {/if}
  </div>
{/if}
