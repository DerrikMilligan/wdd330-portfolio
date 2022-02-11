
export const getStorageItem = (key) => {
  try {
    return JSON.parse(window.localStorage.getItem(key));
  } catch (error) {
    return null;
  }
}

export const setStorageItem = (key, value) => {
  return window.localStorage.setItem(key, JSON.stringify(value));
}

