export interface Subscription {
  unsubscribe(): void;
}

export type Subscriber<T> = (value: T) => void;

export interface Observable<T> {
  subscribe(subscriber: Subscriber<T>): Subscription;
}

export class Subject<T> implements Observable<T> {
  private _sinks: SubjectObserver<T>[] = [];
  private _flushing: boolean = false;
  private _queue: T[] = [];

  public subscribe(subscriber: Subscriber<T>) {
    const sub: Subscription = {
      unsubscribe: () => this._unsubscribe(subscriber)
    };

    const isNew = this._sinks.every((o) => o.target !== subscriber);
    if (isNew) {
      this._sinks.push(new SubjectObserver(subscriber));
    }

    return sub;
  }

  public next(value: T) {
    this._queue.push(value);
    this._flush();
  }

  private _flush() {
    if (this._flushing) {
      return;
    }

    this._flushing = true;

    while (this._queue.length > 0) {
      const queue = this._queue;
      this._queue = [];

      console.log("flushing", queue);

      for (const item of queue) {
        for (const observer of this._sinks.slice()) {
          observer.next(item);
        }
      }
    }

    this._sinks = this._sinks.filter((o) => o.target != null);
    this._flushing = false;
  }

  private _unsubscribe(subscriber: Subscriber<T>) {
    const observer = this._sinks.find((o) => o.target === subscriber);
    if (observer == null) {
      return;
    }

    if (this._flushing) {
      observer.close();
    } else {
      this._sinks = this._sinks.filter((o) => o !== observer);
    }
  }
}

class SubjectObserver<T> {
  private _target: Subscriber<T> | null;

  public get target() {
    return this._target;
  }

  public constructor(target: Subscriber<T>) {
    this._target = target;
  }

  public close() {
    this._target = null;
  }

  public next(value: T) {
    this._target?.(value);
  }
}
