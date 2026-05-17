export function getHttpErrorMessage(error: any, fallbackPrefix = ''): string {
  if (error?.error) {
    if (typeof error.error === 'object' && typeof error.error.message === 'string') {
      return `${fallbackPrefix}${error.error.message}`;
    }

    try {
      const parsed = JSON.parse(error.error);
      return `${fallbackPrefix}${parsed.message}`;
    } catch {
      if (error?.status && error?.statusText) {
        return `${fallbackPrefix}Error with status: ${error.status} - ${error.statusText}`;
      }
      if (error?.status) {
        return `${fallbackPrefix}Error with status: ${error.status}`;
      }
      return `${fallbackPrefix}Unexpected error`;
    }
  }

  if (error?.status) {
    return `${fallbackPrefix}Error with status: ${error.status}`;
  }

  return `${fallbackPrefix}Unexpected error`;
}


