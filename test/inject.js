window.triggerError = (message) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      throw new Error(message);
    }, 0);
    setTimeout(resolve, 10);
  });
};

window.triggerRejection = (message) => {
  return new Promise((resolve) => {
    setTimeout(() => Promise.reject(new Error(message)), 0);
    setTimeout(resolve, 10);
  });
};
