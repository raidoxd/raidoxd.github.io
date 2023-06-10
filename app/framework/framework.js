class Framework {
  constructor() {
    this.routes = {};
    this.currentState = {};
  }

  addRoute(path, handler) {
    this.routes[path] = handler;
  }

  navigate(path) {
    const normalizedPath = path.replace(/\/$/, '');
    if (this.routes.hasOwnProperty(normalizedPath)) {
      const handler = this.routes[normalizedPath];
      handler();
    } else {
      console.error(`No route defined for path: ${normalizedPath}`);
    }
  }

  setState(newState) {
    this.currentState = { ...this.currentState, ...newState };
  }

  getState() {
    return { ...this.currentState };
  }

  bindEvent(selector, eventType, handler) {
    const elements = document.querySelectorAll(selector);
    elements.forEach((element) => {
      element[`on${eventType}`] = handler;
    });
  }
}
