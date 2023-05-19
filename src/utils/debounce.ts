export function debounce<Params extends any[]>(
  func: (...args: Params) => any,
  timeout: number
): (...args: Params) => void {
  let timer: NodeJS.Timeout | null = null;

  return (...args: Params) => {
    if (timer) {
      clearTimeout(timer);
    }

    timer = setTimeout(() => {
      func(...args);
      timer = null;
    }, timeout);
  };
}
