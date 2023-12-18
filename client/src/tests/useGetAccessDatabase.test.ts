import { afterEach, describe, expect, it } from 'vitest';
import sinon from 'sinon';
import axios from 'axios';
import { useGetAccessDatabase } from '@hooks/useAaccessDatabase';

describe('useGetAccessDatabase', () => {
  afterEach(() => {
    sinon.restore();
  });

  it('should return data when request is successful', async () => {
    const data = { data: 'Test' };
    const params = { param1: 'value1' };
    const url = 'http://test.com';

    const getStub = sinon.stub(axios, 'get');
    getStub.resolves({ data });

    const result = await useGetAccessDatabase({ url, params });

    expect(result).toEqual({ data: 'Test', error: null });
  });

  it('should return error when request fails', async () => {
    const params = { param1: 'value1' };
    const url = 'http://test.com';
    const error = { response: { data: { message: 'Error message' } } };

    const getStub = sinon.stub(axios, 'get');
    getStub.rejects(error);

    const result = await useGetAccessDatabase({ url, params });

    expect(result).toEqual({
      data: null,
      error: { response: { data: { message: 'Error message' } } },
    });
  });
});
