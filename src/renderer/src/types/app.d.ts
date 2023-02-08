declare namespace svelteHTML {
  interface HTMLAttributes<T> {
    'on:outClick'?: CompositionEventHandler<T>;
  }
}
