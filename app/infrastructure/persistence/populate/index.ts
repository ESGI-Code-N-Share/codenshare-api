import { UserService } from '#domains/users/user_service'
import { ProgramService } from '#domains/program/program_service'
import { faker } from '@faker-js/faker/locale/fr'
import { User } from '#domains/users/user_model'
import { Program } from '#domains/program/program_model'
import { CodeHistoryService } from '#domains/program/codeHistory/code_history_service'
import Post from '#domains/posts/post_model'
import { PostService } from '#domains/posts/post_service'
import { CreatePostDto } from '#domains/posts/post_dto'
import { PostLikeService } from '#domains/posts/post_like/post_like_service'
import { FriendService } from '#domains/friends/friend_service'
import { inject } from '@adonisjs/core'
import { AuthService } from '#domains/auth/auth_service'
import { ConversationService } from '#domains/users/conversations/conversation_service'
import { MessageService } from '#domains/users/conversations/messages/message_service'
import { Conversation } from '#domains/users/conversations/conversation_model'

@inject()
export class Populate {
  constructor(
    private readonly userService: UserService,
    private readonly programService: ProgramService,
    private readonly codeHistoryService: CodeHistoryService,
    private readonly postService: PostService,
    private readonly postLikeService: PostLikeService,
    private readonly friendService: FriendService,
    private readonly authService: AuthService,
    private readonly conversationService: ConversationService,
    private readonly messageService: MessageService
  ) {}

  async run() {
    await this.generateRandomUsers(25)
  }

  async generateRandomUsers(count: number) {
    let index = 0
    const users = []

    const promise = []
    // eslint-disable-next-line @typescript-eslint/naming-convention
    for (const _ of Array.from({ length: count })) {
      console.log(`[Populate - ${index + 1}/${count}] Generating ${count} random users`)
      const userId = await this.authService.register({
        firstname: faker.person.firstName(),
        lastname: faker.person.lastName(),
        email: faker.internet.email().toLowerCase(),
        password: 'admincns',
        emailVerified: faker.datatype.boolean(),
        birthdate: faker.date.past({ years: faker.number.int({ min: 18, max: 60 }) }),
      })

      const user = await this.userService.getById(userId)

      user.overview = faker.person.bio()
      user.createdAt = faker.date.recent()

      await this.userService.update(user)
      promise.push(this.generateRandomProgramsToUser(user))
      promise.push(this.generateRandomPostsToUser(user))
      users.push(user)
      index += 1
    }

    await Promise.all(promise)
    for (const user of users) {
      await this.generateRandomFriendsToUsers(
        user,
        users.filter((u) => u.userId !== user.userId).slice(0, faker.number.int({ min: 1, max: 9 }))
      )
      await this.generatePostLikes(users.slice(0, faker.number.int({ min: 1, max: 25 })))
    }

    // eslint-disable-next-line @typescript-eslint/naming-convention
    for (const _ of users) {
      const participants = faker.helpers.arrayElements(users, { min: 2, max: 8 })
      await this.generateRandomConversationsToUsers(participants)
    }

    console.log(`[Populate] Generated ${count} random users`)
  }

  async generateRandomFriendsToUsers(requester: User, others: User[]) {
    console.log(`[Populate] Generating random friends for user ${requester.userId}`)
    const userFollowers = await this.friendService.getFollowersByUser(requester.userId)
    if (userFollowers.length === 0) return

    for (const user of others) {
      try {
        await this.friendService.follow({
          followerId: requester.userId,
          followedId: user.userId,
        })
      } catch (e) {
        //continue
      }
    }
  }

  async generateRandomConversationsToUsers(users: User[]) {
    console.log(`[Populate] Generating random conversations for users`)
    const promises = []
    // eslint-disable-next-line @typescript-eslint/naming-convention
    for (const _ of Array.from({ length: faker.number.int({ min: 1, max: 25 }) })) {
      const owner = faker.helpers.arrayElement(users)
      const members = users.filter((u) => u.userId !== owner.userId)
      const conversation = await this.conversationService.create({
        ownerId: owner.userId,
        memberIds: members.map((m) => m.userId),
      })
      promises.push(this.generateRandomMessagesToConversation(conversation, members))
    }
    await Promise.all(promises)
  }

  async generateRandomMessagesToConversation(conversation: Conversation, members: User[]) {
    console.log(`[Populate] Generating random messages for conversation`)
    // eslint-disable-next-line @typescript-eslint/naming-convention
    for (const _ of Array.from({ length: faker.number.int({ min: 1, max: 25 }) })) {
      const sender = faker.helpers.arrayElement(members)
      await this.messageService.send({
        conversationId: conversation.conversationId,
        content: faker.lorem.sentence(),
        image: faker.helpers.maybe(() => faker.image.urlLoremFlickr({ category: 'coding' }), {
          probability: 0.5,
        }),
        senderId: sender.userId,
      })
    }
  }

  async generateRandomPostsToUser(author: User) {
    console.log(`[Populate] Generating random posts for user`)
    const userPrograms = await this.programService.getAllByUser(author.userId)
    if (userPrograms.length === 0) return

    // eslint-disable-next-line @typescript-eslint/naming-convention
    for (const _ of Array.from({ length: faker.number.int({ min: 1, max: 15 }) })) {
      const post = Post.new(
        faker.commerce.productName(),
        faker.commerce.productDescription(),
        author,
        faker.helpers.maybe(() => faker.image.urlLoremFlickr({ category: 'coding' }), {
          probability: 0.7,
        }),
        faker.helpers.maybe(
          () => faker.helpers.arrayElement(userPrograms.map((p) => p.programId)),
          {
            probability: 0.3,
          }
        )
      )
      post.postedAt = faker.date.recent()

      const postDto: CreatePostDto = {
        title: post.title,
        content: post.content,
        authorId: post.author.userId,
        image: post.image,
        programId: post.programId,
      }
      const newPost = await this.postService.create(postDto)
      post.postId = newPost.postId
    }
  }

  async generatePostLikes(users: User[]) {
    console.log(`[Populate] Generating random likes for post`)
    const posts = await this.postService.getAll()

    // eslint-disable-next-line @typescript-eslint/naming-convention
    for (const _ of Array.from({ length: faker.number.int({ min: 1, max: 25 }) })) {
      const user = faker.helpers.arrayElement(users)
      try {
        await this.postLikeService.likePost({
          postId: faker.helpers.arrayElement(posts.map((p) => p.postId)),
          userId: user.userId,
        })
      } catch (e) {
        //continue
      }
    }
  }

  async generateRandomProgramsToUser(author: User) {
    console.log(`[Populate] Generating random programs for user`)
    // eslint-disable-next-line @typescript-eslint/naming-convention
    for (const _ of Array.from({ length: faker.number.int({ min: 0, max: 8 }) })) {
      const program = Program.default(
        faker.image.urlLoremFlickr({ category: 'coding' }),
        faker.helpers.arrayElement(['public', 'protected', 'private']),
        author,
        author
      )
      program.programId = await this.programService.createDefault(author.userId)

      program.name = faker.commerce.productName()
      program.description = faker.commerce.productDescription()
      program.language = faker.helpers.arrayElement(['java', 'javascript'])
      program.code = faker.lorem.paragraph()
      program.version =
        program.language === 'java' ? faker.helpers.arrayElement(['11', '15', '21']) : ''
      program.createdAt = faker.date.recent()

      await this.programService.update(
        program.programId,
        program.name,
        program.description,
        program.pictureName,
        program.code,
        program.language,
        program.version,
        program.programVisibility,
        program.originalAuthor.userId
      )
      await this.generateRandomCodeHistoriesToProgram(program)
    }
  }

  async generateRandomCodeHistoriesToProgram(program: Program) {
    console.log(`[Populate] Generating random code histories for program`)
    // eslint-disable-next-line @typescript-eslint/naming-convention
    for (const _ of Array.from({ length: faker.number.int({ min: 4, max: 25 }) })) {
      program.code = faker.lorem.paragraph()
      await this.codeHistoryService.create(program)
    }
  }
}
