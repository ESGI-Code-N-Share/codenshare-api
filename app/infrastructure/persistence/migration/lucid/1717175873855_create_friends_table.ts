import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'friends'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.uuid('friend_id').primary()

      table.uuid('requested_by').references('users.user_id').onDelete('CASCADE')
      table.uuid('addressed_to').references('users.user_id').onDelete('CASCADE')

      table.timestamp('created_at')
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
