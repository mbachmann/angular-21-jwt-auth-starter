import { getHttpErrorMessage } from './http-error-message.util';

describe('getHttpErrorMessage', () => {
  it('should return parsed message when error payload is a JSON string', () => {
    const error = {
      error: JSON.stringify({ message: 'Access denied' }),
      status: 403,
      statusText: 'Forbidden',
    };

    expect(getHttpErrorMessage(error)).toBe('Access denied');
  });

  it('should return message when error payload is an object with message', () => {
    const error = {
      error: { message: 'Token expired' },
      status: 401,
      statusText: 'Unauthorized',
    };

    expect(getHttpErrorMessage(error)).toBe('Token expired');
  });

  it('should return status and statusText when payload cannot be parsed', () => {
    const error = {
      error: 'not-a-json-payload',
      status: 500,
      statusText: 'Internal Server Error',
    };

    expect(getHttpErrorMessage(error)).toBe('Error with status: 500 - Internal Server Error');
  });

  it('should return status fallback when only status is available', () => {
    const error = {
      status: 404,
    };

    expect(getHttpErrorMessage(error)).toBe('Error with status: 404');
  });

  it('should return unexpected error fallback when no details are available', () => {
    expect(getHttpErrorMessage({})).toBe('Unexpected error');
  });
});

