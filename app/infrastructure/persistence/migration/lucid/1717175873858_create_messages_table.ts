import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'messages'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.uuid('message_id').primary()

      table.text('content').notNullable()
      table.uuid('sender_id').references('user_id').inTable('users').notNullable()
      table.string('image', 255).nullable()
      table
        .uuid('conversation_id')
        .references('conversation_id')
        .inTable('conversations')
        .notNullable()

      table.timestamp('send_at')
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
