<script>
  import { getContext } from 'svelte';
  import { slide } from 'svelte/transition';

  export let id = Math.random().toString(36).substr(2, 9);
  export let title = '';
  export let open = false;

  const { activeItems, toggle } = getContext('accordion');

  // Initialize state if prop open is true
  if (open) {
    toggle(id);
  }

  $: isOpen = $activeItems.includes(id);
</script>

<div class="accordion-item border-bottom border-muted-20">
  <button
    type="button"
    class="flex justify-between items-center width-100 p-m bg-transparent border-none cursor-pointer hover:bg-muted-10 transition-colors duration-200"
    on:click={() => toggle(id)}
    aria-expanded={isOpen}
  >
    <span class="text-l font-600 text-title text-left width-100">
      <slot name="title">{title}</slot>
    </span>
    <span
      class="transform transition-transform duration-200 text-muted"
      class:rotate-180={isOpen}
    >
      <!-- Chevron Down Icon -->
      <svg
        width="20"
        height="20"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
        stroke-width="2"
      >
        <path stroke-linecap="round" stroke-linejoin="round" d="M19 9l-7 7-7-7" />
      </svg>
    </span>
  </button>

  {#if isOpen}
    <div
      class="text-body p-m pt-0 line-height-l"
      transition:slide={{ duration: 200 }}
    >
      <slot />
    </div>
  {/if}
</div>
