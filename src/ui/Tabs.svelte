<!--
  @component
  Tabs Component
  
  Usage:
  ```svelte
  <script>
    import { Tabs, TabHeader, TabPanel } from 'kf-css/ui';
  </script>

  <Tabs active="tab1">
    <span slot="headers">
      <TabHeader id="tab1">Home</TabHeader>
      <TabHeader id="tab2">Profile</TabHeader>
    </span>
    
    <TabPanel id="tab1">Home Content</TabPanel>
    <TabPanel id="tab2">Profile Content</TabPanel>
  </Tabs>
  ```
-->
<script>
  import { setContext, createEventDispatcher } from 'svelte';
  import { writable } from 'svelte/store';

  export let active = '';
  export let className = '';

  const activeTab = writable(active);
  const dispatch = createEventDispatcher();

  setContext('tabs', {
    activeTab,
    setActive: (id) => {
      activeTab.set(id);
      dispatch('change', id);
    },
  });

  // Sync prop with store
  $: activeTab.set(active);
</script>

<div class="tabs {className}">
  <!-- Tab Headers -->
  <div class="flex border-bottom border-muted-20 mb-m overflow-x-auto">
    <slot name="headers" />
  </div>

  <!-- Tab Content -->
  <div class="tab-content">
    <slot />
  </div>
</div>
