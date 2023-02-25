type FocusableEls =
  | HTMLAnchorElement
  | HTMLButtonElement
  | HTMLInputElement
  | HTMLTextAreaElement
  | HTMLSelectElement;

export const trapFocus = (e: KeyboardEvent, element: HTMLElement) => {
  if (!element) return;
  const focusableEls: NodeListOf<FocusableEls> = element.querySelectorAll(
    'a[href]:not([disabled]), button:not([disabled]), textarea:not([disabled]), input[type="text"]:not([disabled]), input[type="radio"]:not([disabled]), input[type="checkbox"]:not([disabled]), select:not([disabled])'
  );

  const firstFocusableEl = focusableEls[0];
  const lastFocusableEl = focusableEls[focusableEls.length - 1];
  const TAB = 'Tab';

  const isTabPressed = e.key === TAB || e.code === TAB;

  if (!isTabPressed) {
    return;
  }

  if (e.shiftKey) {
    /* shift + tab */
    if (document.activeElement === firstFocusableEl) {
      lastFocusableEl.focus();
      e.preventDefault();
    }
  } else {
    /* tab */
    if (document.activeElement === lastFocusableEl) {
      firstFocusableEl.focus();
      e.preventDefault();
    }
  }
};
