import { render, screen, fireEvent, act } from '@testing-library/react';
import { BrowserRouter as Router } from 'react-router-dom';
import Comment from '../features/comments/Comment';
import sinon from 'sinon';
import axios from 'axios';
import { afterEach, describe, expect, it } from 'vitest';
import { CommentTypes } from '@customTypes/interfaces';
import { UserContext } from '@context/UserProvider';

describe('Comment', () => {
  afterEach(() => {
    sinon.restore();
  });

  it('should call usePostAccessDatabase when delete button is clicked', async () => {
    const postStub = sinon.stub(axios, 'post');
    postStub.resolves({ data: 'Test', error: null });
    const contextValue = {
      userData: {
        data: {
          _id: 'testId',
          role: 'Admin',
        },
      },
    };

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

    render(
      <Router>
        <UserContext.Provider value={contextValue}>
          <Comment commentData={commentData} />
        </UserContext.Provider>
      </Router>
    );

    const showDeleteDialogBtn = screen.getByLabelText('Remove comment');
    act(() => {
      fireEvent.click(showDeleteDialogBtn);
    });

    const deleteCommentBtn = screen.getByText('Delete');
    await act(async () => {
      fireEvent.click(deleteCommentBtn);
    });

    expect(postStub.called).toBe(true);
  });
});
