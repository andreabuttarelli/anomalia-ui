export type ToastTone = 'neutral' | 'success' | 'warning' | 'danger' | 'info';

export interface ToastAction {
  label: string;
  onclick: () => void;
}

export interface ToastOptions {
  title?: string;
  description?: string;
  tone?: ToastTone;
  /** ms on screen. `0` keeps it up until dismissed — pair with an action. */
  timeout?: number;
  action?: ToastAction;
  onDismiss?: () => void;
}

export interface Toast extends ToastOptions {
  id: string;
  tone: ToastTone;
  timeout: number;
}

let seq = 0;

/**
 * Snackbar queue.
 *
 * Material caps the surface at one message and queues the rest; showing three
 * stacked snackbars is how the pattern gets misused. `limit` enforces that —
 * raise it deliberately, not by accident.
 */
class ToastStore {
  items = $state<Toast[]>([]);
  limit = 3;

  show(options: ToastOptions | string): string {
    const input = typeof options === 'string' ? { title: options } : options;
    seq += 1;
    const toast: Toast = {
      id: `an-toast-${seq}`,
      tone: 'neutral',
      timeout: 4000,
      ...input
    };

    this.items = [...this.items, toast].slice(-this.limit);
    return toast.id;
  }

  success = (options: ToastOptions | string) => this.#toned(options, 'success');
  warning = (options: ToastOptions | string) => this.#toned(options, 'warning');
  danger = (options: ToastOptions | string) => this.#toned(options, 'danger');
  info = (options: ToastOptions | string) => this.#toned(options, 'info');

  dismiss(id: string): void {
    const toast = this.items.find((item) => item.id === id);
    if (!toast) return;
    this.items = this.items.filter((item) => item.id !== id);
    toast.onDismiss?.();
  }

  clear(): void {
    this.items = [];
  }

  #toned(options: ToastOptions | string, tone: ToastTone) {
    const input = typeof options === 'string' ? { title: options } : options;
    return this.show({ ...input, tone });
  }
}

export const toasts = new ToastStore();

/** Shorthand: `toast('Saved')`, `toast.success({ title: 'Published' })`. */
export const toast = Object.assign((options: ToastOptions | string) => toasts.show(options), {
  success: toasts.success,
  warning: toasts.warning,
  danger: toasts.danger,
  info: toasts.info,
  dismiss: (id: string) => toasts.dismiss(id),
  clear: () => toasts.clear()
});
