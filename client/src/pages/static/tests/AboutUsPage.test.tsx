import { describe, expect, it, test } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';

import AboutUsPage from '../AboutUsPage';

describe('About us page', () => {
  it('Renders page', () => {
    render(<AboutUsPage />);
  });
  test('Fetches imgs', async () => {
    render(<AboutUsPage />);
    const images = screen.getAllByAltText('About us group image.');

    await Promise.all(
      images.map(async (image) => {
        const imageUrl = image.getAttribute('src') as RequestInfo | URL;
        const response = await fetch(imageUrl);

        await waitFor(() => {
          expect(response.status).toBe(200);
        });
      })
    );

    images.forEach((image) => {
      expect(image).toBeTruthy();
    });
  });
});
