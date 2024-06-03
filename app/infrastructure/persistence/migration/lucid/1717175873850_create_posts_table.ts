import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'posts'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.uuid('post_id').primary()

      table.string('title').notNullable()
      table.text('content').notNullable()
      table.string('image').nullable()
      table.uuid('author_id').references('user_id').inTable('users').notNullable()

      table.timestamp('posted_at')
      table.timestamp('deleted_at').nullable()
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
