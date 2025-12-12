<!--
  @component
  Accordion Component
  
  Usage:
  ```svelte
  <script>
    import { Accordion, AccordionItem } from 'kf-css/ui';
  </script>

  <Accordion multiple={true}>
    <AccordionItem title="Item 1">Content 1</AccordionItem>
    <AccordionItem title="Item 2">Content 2</AccordionItem>
  </Accordion>
  ```
-->
<script>
  import { setContext } from 'svelte';
  import { writable } from 'svelte/store';

  export let multiple = false;
  export let className = '';

  // Store for active items (allows multiple or single)
  const activeItems = writable([]);

  setContext('accordion', {
    activeItems,
    multiple,
    toggle: (id) => {
      activeItems.update((items) => {
        if (items.includes(id)) {
          return items.filter((i) => i !== id);
        }
        return multiple ? [...items, id] : [id];
      });
    },
  });
</script>

<div class="accordion flex flex-col gap-xs {className}">
  <slot />
</div>
