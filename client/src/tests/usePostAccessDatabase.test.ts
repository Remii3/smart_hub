import { afterEach, describe, expect, it } from 'vitest';
import sinon from 'sinon';
import axios from 'axios';
import { usePostAccessDatabase } from '@hooks/useAaccessDatabase';

describe('usePostAccessDatabase', () => {
  afterEach(() => {
    sinon.restore();
  });

  it('should return data when request is successful', async () => {
    const data = 'Test';
    const body = { param1: 'value1' };
    const url = 'http://test.com';
    const headers = { 'Content-Type': 'application/json' };

    const postStub = sinon.stub(axios, 'post');
    postStub.resolves({ data });

    const result = await usePostAccessDatabase({ url, body, headers });

    expect(result).toEqual({ data: 'Test', error: null });
  });

  it('should return error when request fails', async () => {
    const body = { param1: 'value1' };
    const url = 'http://test.com';
    const headers = { 'Content-Type': 'application/json' };
    const error = {
      response: { data: { message: 'Error message', name: 'Error name' } },
    };

    const postStub = sinon.stub(axios, 'post');
    postStub.rejects(error);

    const result = await usePostAccessDatabase({ url, body, headers });

    expect(result).toEqual({
      data: null,
      error: {
        response: { data: { message: 'Error message', name: 'Error name' } },
      },
    });
  });
});
