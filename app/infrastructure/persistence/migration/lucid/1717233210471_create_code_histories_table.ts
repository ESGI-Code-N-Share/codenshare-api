import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'code_histories'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.uuid('codeHistory_id').primary()
      table.text('code').nullable()
      table.uuid('program_id').references('program_id').inTable('programs')

      table.timestamp('created_at')
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
