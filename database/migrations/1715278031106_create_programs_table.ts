import {BaseSchema} from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'programs'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.uuid('program_id').primary()

      table.string('name').nullable()
      table.text('description').nullable()
      table.string('picture_name').nullable()
      table.string('language').nullable()
      table.enum('visibility', ['public', 'private']).defaultTo('private')
      table.text('code').nullable()
      table.uuid('author_id').references('user_id').inTable('users')
      table.uuid('original_author_id').references('user_id').inTable('users')
      table.enum('status', ['active', 'inactive', 'archived']).defaultTo('active')

      table.timestamp('created_at', { useTz: true }).notNullable().defaultTo(this.now())
      table.timestamp('updated_at', { useTz: true }).notNullable().defaultTo(this.now())
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
