import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'post_like'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.uuid('post_like_id').primary()

      table.uuid('post_id').references('post_id').inTable('posts').onDelete('CASCADE')
      table.uuid('user_id').references('user_id').inTable('users').onDelete('CASCADE')

      table.timestamp('liked_at').notNullable()
      table.timestamp('deleted_at').nullable()
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
