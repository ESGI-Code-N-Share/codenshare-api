import Post from '#domains/posts/post_model'
import { UserSample } from '#tests/unit/domains/utils/user_sample'

export class PostSample {
  static new(postData: Partial<Post>): Post {
    return {
      postId: postData.postId ?? '1',
      title: postData.title ?? 'Title',
      content: postData.content ?? 'Content',
      author: postData.author ?? UserSample.new({}),
      image: postData.image ?? 'image.png',
      likes: postData.likes ?? [],
      postedAt: postData.postedAt ?? new Date(),
    }
  }
}
