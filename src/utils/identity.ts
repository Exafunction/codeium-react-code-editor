/**
 * Get the current URL of the window. If this fails, a null string is returned.
 * @returns The current URL
 */
export const getCurrentURL = () => {
  try {
    return window.location.href;
  } catch (e) {
    return null;
  }
};

export const getBrowserVersion = () => {
  try {
    return window.navigator.userAgent;
  } catch (e) {
    return null;
  }
};

/**
 * Get the current package version. If this fails, a null string is returned.
 */
export const getPackageVersion = () => {
  try {
    return require('../../package.json').version;
  } catch (e) {
    return null;
  }
};
