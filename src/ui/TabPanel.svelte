<script>
  import { getContext } from 'svelte';

  export let id = '';

  const { activeTab } = getContext('tabs');
</script>

{#if $activeTab === id}
  <div role="tabpanel" tabindex="0">
    <slot />
  </div>
{/if}
