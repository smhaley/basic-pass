export class IdleTimer {
  protected onTimeout: () => void;
  protected seconds: number;
  private _time = 0;
  private _eventNames: string[] = [
    'DOMMouseScroll',
    'mousedown',
    'mousemove',
    'mousewheel',
    'MSPointerDown',
    'MSPointerMove',
    'keydown',
    'touchmove',
    'touchstart',
    'wheel'
  ];

  constructor(minutes: number, onTimeout: () => void) {
    this.onTimeout = onTimeout;
    this.seconds = minutes * 1000;
  }

  private timeout = () => {
    clearTimeout(this.seconds * 1000);
    // time = setTimeout(this.onTimeout, this.seconds * 1000);
  };
}
