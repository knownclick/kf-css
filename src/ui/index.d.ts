import { SvelteComponent } from 'svelte';

export class Accordion extends SvelteComponent<
  { multiple?: boolean; className?: string },
  { change: CustomEvent<void> },
  { default: {} }
> {}
export class AccordionItem extends SvelteComponent<
  { id?: string; title?: string; open?: boolean },
  { click: CustomEvent<void> },
  { default: {}; title: {} }
> {}

export class Modal extends SvelteComponent<
  { open: boolean; title?: string; size?: 's' | 'm' | 'l' | 'xl' },
  { close: CustomEvent<void> },
  { default: {}; footer: {} }
> {}

export class Tabs extends SvelteComponent<
  { active: string; className?: string },
  { change: CustomEvent<string> },
  { default: {}; headers: {} }
> {}
export class TabHeader extends SvelteComponent<
  { id: string },
  { click: CustomEvent<void> },
  { default: {} }
> {}
export class TabPanel extends SvelteComponent<
  { id: string },
  {},
  { default: {} }
> {}

export class Alert extends SvelteComponent<
  {
    type?: 'info' | 'success' | 'warning' | 'error';
    title?: string;
    dismissible?: boolean;
  },
  { dismiss: CustomEvent<void> },
  { default: {} }
> {}

export class Drawer extends SvelteComponent<
  { open: boolean; position?: 'left' | 'right'; size?: 's' | 'm' | 'l' },
  { close: CustomEvent<void> },
  { default: {} }
> {}

export class Dropdown extends SvelteComponent<
  { label?: string; open?: boolean; align?: 'left' | 'right' },
  {},
  { default: {}; trigger: {} }
> {}

export class Switch extends SvelteComponent<
  { checked: boolean; disabled?: boolean },
  { change: CustomEvent<boolean> },
  { default: {} }
> {}

export class Badge extends SvelteComponent<
  {
    variant?: 'primary' | 'success' | 'warning' | 'error' | 'muted';
    pill?: boolean;
  },
  {},
  { default: {} }
> {}
