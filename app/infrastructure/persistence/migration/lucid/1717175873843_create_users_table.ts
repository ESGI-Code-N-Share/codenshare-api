import { BaseSchema } from '@adonisjs/lucid/schema'
import Hash from '@adonisjs/core/services/hash'

export default class extends BaseSchema {
  protected tableName = 'users'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.uuid('user_id').primary()

      table.string('firstname', 255).notNullable()
      table.string('lastname', 255).notNullable()
      table.string('email', 255).notNullable().unique()
      table.date('birthdate').notNullable()
      table.string('avatar', 255).notNullable()
      table.enu('role', ['admin', 'moderator', 'user']).defaultTo('user')
      table.string('password', 255).notNullable()
      table.boolean('email_verified').defaultTo(false)

      table.string('overview', 255).defaultTo('')
      table.string('token', 255).nullable()

      table.timestamp('created_at')
      table.timestamp('updated_at')
      table.timestamp('deleted_at').nullable()
    })

    await this.createDefaultAdmin()
    await this.createDefaultUser()
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }

  protected async createDefaultAdmin() {
    this.defer(async (db) => {
      await db
        .insertQuery()
        .table(this.tableName)
        .insert({
          user_id: '11111111-1111-1111-1111-111111111111',
          email: 'admin@cns.fr',
          password: await Hash.make('adminfiters'),
          firstname: 'Admin',
          lastname: 'CNS',
          email_verified: true,
          avatar: 'https://secure.gravatar.com/avatar/1',
          birthdate: '1980-01-01',
          role: 'admin',
          overview: 'Admin user',
          created_at: new Date(),
          updated_at: new Date(),
        })
    })
  }

  protected async createDefaultUser() {
    this.defer(async (db) => {
      await db
        .insertQuery()
        .table(this.tableName)
        .insert({
          user_id: '22222222-2222-2222-2222-222222222222',
          email: 'c.lechene@gmail.com',
          password: await Hash.make('adminfiters'),
          firstname: 'Corentin',
          lastname: 'Lechene',
          email_verified: true,
          avatar: 'https://randomuser.me/api/portraits/men/9.jpg',
          birthdate: '1990-01-01',
          role: 'user',
          overview: 'Lead developer at CNS',
          created_at: new Date(),
          updated_at: new Date(),
        })
    })
  }
}
