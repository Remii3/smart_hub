import { it, describe, expect, vi } from 'vitest';
import '@testing-library/jest-dom';
import { act, fireEvent, render, screen } from '@testing-library/react';
import { CommentTypes } from '@customTypes/interfaces';
import { MemoryRouter } from 'react-router-dom';
import { UserContext } from '@context/UserProvider';

import Comment, { CommentPropsTypes } from '../Comment';
import { usePostAccessDatabase } from '@hooks/useAaccessDatabase';

describe('Comment Component', () => {
  const commentPropsData = {
    starRating: true,
    targetId: 'test1',
    target: 'Product',
  } as CommentPropsTypes;
  const commentData = {
    _id: 'comment123',
    value: {
      nickname: 'TestUser',
      rating: 4,
      text: 'This is a test comment.',
    },
    creatorData: {
      _id: 'user456',
      userInfo: {
        profileImg: {
          url: 'https://example.com/profile.jpg',
        },
      },
    },
    createdAt: '2023-01-01T12:34:56.789Z',
  } as CommentTypes;

  it('Deletes the comment', async () => {
    const contextValue = {
      userData: {
        data: {
          _id: 'testId',
          role: 'Admin',
        },
      },
    };

    vi.mock('@hooks/useAaccessDatabase', () => ({
      usePostAccessDatabase: vi.fn().mockResolvedValue({ error: null }),
    }));

    render(
      <MemoryRouter>
        {/* @ts-ignore */}
        <UserContext.Provider value={contextValue}>
          <Comment
            starRating={commentPropsData.starRating}
            targetId={commentPropsData.targetId}
            target={commentPropsData.target}
            updateTargetData={() => {}}
            updateComments={() => {}}
            commentData={commentData}
          />
        </UserContext.Provider>
      </MemoryRouter>
    );
    const showDeleteDialogBtn = screen.getByLabelText('Remove comment');

    expect(showDeleteDialogBtn).toBeTruthy();
    fireEvent.click(showDeleteDialogBtn);

    const deleteCommentBtn = screen.getByText('Delete');
    expect(deleteCommentBtn).toBeTruthy();

    await act(() => fireEvent.click(deleteCommentBtn));
    expect(usePostAccessDatabase).toBeCalled();
  });
});
