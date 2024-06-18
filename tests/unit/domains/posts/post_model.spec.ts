import { test } from '@japa/runner'
import Post from '#domains/posts/post_model'
import { UserSample } from '#tests/unit/domains/utils/user_sample'

test.group('Post Model', () => {
  test('should create a new post', ({ assert }) => {
    const author = UserSample.new({ userId: '1' })
    const postedAt = new Date()
    const expected: Post = {
      postId: '1',
      author,
      title: 'Title',
      content: 'Content',
      image: undefined,
      likes: [],
      postedAt,
    }

    const post = Post.new(expected.title, expected.content, author, expected.image)

    assert.exists(post.postId)
    assert.equal(post.title, expected.title)
    assert.equal(post.content, expected.content)
    assert.deepEqual(post.author, author)
    assert.equal(post.image, expected.image)
    assert.deepEqual(post.likes, expected.likes)
    assert.exists(post.postedAt)
  })
})
