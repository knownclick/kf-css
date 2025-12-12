<script>
  import { getContext } from 'svelte';

  export let id = '';

  const { activeTab, setActive } = getContext('tabs');

  $: isActive = $activeTab === id;
</script>

<button
  type="button"
  class="px-l py-m cursor-pointer bg-transparent border-none border-bottom border-width-2 transition-colors duration-200 text-m font-500 whitespace-nowrap {isActive
    ? 'border-primary text-primary'
    : 'border-transparent text-muted hover:text-title hover:border-muted-30'}"
  on:click={() => setActive(id)}
  role="tab"
  aria-selected={isActive}
>
  <slot />
</button>
