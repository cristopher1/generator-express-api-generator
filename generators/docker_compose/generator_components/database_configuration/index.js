class DatabaseConfiguration {
  #connector
  #port
  #dialect
  #myDatabase
  #host
  #username
  #password

  constructor(
    connector,
    port,
    dialect,
    mydatabase = 'api',
    host = 'database',
    username = 'admin',
    password = 'admin',
  ) {
    this.#connector = connector
    this.#port = port
    this.#dialect = dialect
    this.#myDatabase = mydatabase
    this.#host = host
    this.#username = username
    this.#password = password
  }

  getConnector() {
    return this.#connector
  }

  getPort() {
    return this.#port
  }

  getDialect() {
    return this.#dialect
  }

  getMyDatabase() {
    return this.#myDatabase
  }

  getHost() {
    return this.#host
  }

  getUsername() {
    return this.#username
  }

  getPassword() {
    return this.#password
  }
}

export class DatabaseUrl {
  /**
   * @param {DatabaseConfiguration} databaseConfiguration Object that contains
   *   the database configuration
   * @returns
   */
  static getDatabaseUrlWithoutArguments(databaseConfiguration) {
    const connector = databaseConfiguration.getConnector()
    const port = databaseConfiguration.getPort()
    const username = databaseConfiguration.getUsername()
    const password = databaseConfiguration.getPassword()
    const host = databaseConfiguration.getHost()
    const myDatabase = databaseConfiguration.getMyDatabase()

    return `${connector}://${username}:${password}@${host}:${port}/${myDatabase}`
  }
}

export const mysql = new DatabaseConfiguration('mysql', 3306, 'mysql')
export const mariadb = new DatabaseConfiguration('mysql', 3306, 'mariadb')
export const postgresql = new DatabaseConfiguration(
  'postgresql',
  5432,
  'postgres',
)

export const databaseConfigurations = {
  mysql,
  mariadb,
  postgresql,
}
