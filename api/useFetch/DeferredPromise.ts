export default class DeferredPromise<T> {
  public promise: Promise<T>;
  public resolve: (data: T) => void = (() => {});
  public reject: (error: unknown) => void = (() => {});

  constructor() {
    this.promise = new Promise((resolve, reject) => {
      this.reject = reject;
      this.resolve = resolve;
    });
  }
}
