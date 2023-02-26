export class IdleTimer {
  private onTimeout: () => void;
  private minutes: number;
  private timeoutLimit: number;
  private interval: NodeJS.Timer;

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
    this.minutes = minutes;
    this.setTimeoutLimit();
    this.track();
    this.intervalCounter();
  }

  private track = () => {
    this._eventNames.forEach((event) => {
      window.addEventListener(event, this.setTimeoutLimit);
    });
  };

  private setTimeoutLimit = () => {
    this.timeoutLimit = Date.now() + this.minutes * 60 * 1000;
  };

  private intervalCounter = () => {
    this.interval = setInterval(() => {
      console.log('bang', this.timeoutLimit, Date.now());
      if (this.timeoutLimit < Date.now()) {
        this.onTimeout();
      }
    }, 1000);
  };

  public cleanup = () => {
    clearInterval(this.interval);
    this._eventNames.forEach((event) => {
      window.removeEventListener(event, this.setTimeoutLimit);
    });
  };
}
