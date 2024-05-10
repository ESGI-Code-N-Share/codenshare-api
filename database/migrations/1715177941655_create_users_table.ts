import {BaseSchema} from '@adonisjs/lucid/schema'
// import {randomUUID} from "node:crypto";

export default class extends BaseSchema {
  protected tableName = 'users'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.uuid('user_id').primary()
      table.string('email').notNullable().unique()
      table.timestamp('created_at', { useTz: true }).notNullable().defaultTo(this.now())
      table.timestamp('updated_at', { useTz: true }).notNullable().defaultTo(this.now())
    })
    await this.createDefaultUser()
  }

  async createDefaultUser() {
    this.defer(async (db) => {
      await db.insertQuery().table(this.tableName).insert({
        user_id: '11111111-1111-1111-1111-111111111111',
        email: 'admin@cns.fr',
      })
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
