import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'programs'

  async up() {
    this.schema.createTable(this.tableName, async (table) => {
      table.uuid('program_id').primary()

      table.string('name').nullable()
      table.text('description').nullable()
      table.string('picture_name').nullable()
      table.string('language').nullable()
      table.enum('visibility', ['public', 'private', 'protected']).defaultTo('private')
      table.text('code').nullable()
      table.uuid('author_id').references('user_id').inTable('users')
      table.uuid('original_author_id').references('user_id').inTable('users')

      table.timestamp('created_at')
      table.timestamp('updated_at')
      table.timestamp('deleted_at')

      await this.createDefaultProgram()
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }

  protected async createDefaultProgram() {
    this.defer(async (db) => {
      await db.insertQuery().table(this.tableName).insert({
        program_id: '11111111-1111-1111-1111-111111111111',
        name: 'name',
        description: 'description',
        picture_name: 'https://secure.gravatar.com/avatar/1',
        language: 'language',
        visibility: 'private',
        code: 'println("toto")',
        author_id: '22222222-2222-2222-2222-222222222222',
        original_author_id: '22222222-2222-2222-2222-222222222222',
        created_at: new Date(),
        updated_at: new Date(),
      })
    })
  }
}
