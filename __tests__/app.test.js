import path, { dirname } from 'path'
import { fileURLToPath } from 'url'
import { faker } from './helpers'
import { beforeAll } from '@jest/globals'
import assert from 'yeoman-assert'
import helpers from 'yeoman-test'

const __dirname = dirname(fileURLToPath(import.meta.url))

describe('generator-koa2-api-generator:app', () => {
  const baseStructure = [
    'api/.husky/commit-msg',
    'api/.husky/pre-commit',
    'api/.husky/pre-push',
    'api/src/config/database.js',
    'api/src/config/jwt.js',
    'api/src/config/openapi.js',
    'api/src/db/migrations/20240108154448-create-user.cjs',
    'api/src/db/models/index.js',
    'api/src/db/models/user.js',
    'api/src/db/seeders/.keep',
    'api/src/routes/authentication/authenticationRouter.js',
    'api/src/routes/authentication/tokenRouter.js',
    'api/src/routes/swagger/router.js',
    'api/src/routes/user/registerRouter.js',
    'api/src/routes/user/router.js',
    'api/src/routes/index.js',
    'api/src/schemas/json/token/create_token.json',
    'api/src/schemas/json/user/new_user.json',
    'api/src/schemas/json/user/updated_user.json',
    'api/src/schemas/json/index.js',
    'api/src/schemas/openapi/default_response/responses.yml',
    'api/src/schemas/openapi/json_web_token/examples.yml',
    'api/src/schemas/openapi/json_web_token/schemas.yml',
    'api/src/schemas/openapi/security/security_schemes.yml',
    'api/src/schemas/openapi/user/examples.yml',
    'api/src/schemas/openapi/user/schemas.yml',
    'api/src/types/types.d.ts',
    'api/src/api.js',
    'api/src/server.js',
    'api/.env',
    'api/.env.example',
    'api/.eslintignore',
    'api/.eslintrc.yml',
    'api/.gitignore',
    'api/.lintstagedrc.json',
    'api/.prettierignore',
    'api/.prettierrc.json',
    'api/.sequelizerc',
    'api/api-specification.yml',
    'api/babel.config.json',
    'api/commitlint.config.js',
    'api/package.json',
    'api/README.md',
  ]

  describe('create a new project with a database drivers that is not supported', () => {
    it('Should throw an exception when the user selects a database that is not supported', async () => {
      // Arrange
      const answers = {}
      answers.useDockerCompose = true
      answers.databaseDriver = 'database is not supported'
      answers.runGitInit = false
      answers.runPackageScripts = false

      const expected = Error

      const runGenerator = async () => {
        await helpers
          .run(path.join(__dirname, '../generators/app'))
          .withAnswers(answers)
      }

      // Assert
      await expect(runGenerator).rejects.toThrow(expected)
    })
  })

  describe('create a new project without database drivers', () => {
    const projectName = 0
    const args = []
    const answers = {}
    const options = {
      'skip-install': true,
    }

    beforeAll(async () => {
      args[projectName] = faker.string.sample()

      answers.databaseDriver = null
      answers.runGitInit = false
      answers.runPackageScripts = false
      answers.useDocker = false
      answers.useDockerCompose = false

      await helpers
        .run(path.join(__dirname, '../generators/app'))
        .withArguments(args)
        .withAnswers(answers)
        .withOptions(options)
    })

    it('Should create the correct base structure', () => {
      // Assert
      assert.file(baseStructure)
    })

    describe('package.json', () => {
      it('Should create a package.json adding the required fields', () => {
        // Assert
        assert.JSONFileContent('api/package.json', {
          name: args[projectName],
          version: '0.1.0',
          main: 'index.js',
          type: 'module',
          scripts: {
            'init:husky': 'husky install',
            init: 'npm run init:husky',
            dev: 'nodemon -r dotenv/config src/server.js',
            start: 'node src/server.js',
            format: 'prettier --check .',
            'format:fix': 'prettier --write .',
            lint: 'eslint -c .eslintrc.yml --no-eslintrc --ext .js,.mjs .',
            'lint-fix': 'npm run lint -- --fix',
            test: 'echo The test is not implemented && exit -1',
            'lint-staged': 'npx lint-staged',
            commitlint: 'npx commitlint --edit',
            'quality-check': 'npm run format && npm run lint',
          },
          devDependencies: {
            '@babel/cli': '^7.11.6',
            '@babel/core': '^7.11.6',
            '@babel/preset-env': '^7.11.5',
            '@babel/register': '^7.23.7',
            '@commitlint/cli': '^18.4.4',
            '@commitlint/config-conventional': '^18.4.4',
            '@types/express': '^4.17.21',
            'babel-plugin-add-module-exports': '^1.0.4',
            'babel-plugin-transform-import-meta': '^2.2.1',
            dotenv: '^16.3.1',
            eslint: '^8.56.0',
            'eslint-config-prettier': '^9.1.0',
            'eslint-config-standard': '^17.1.0',
            'eslint-plugin-import': '^2.29.1',
            'eslint-plugin-n': '^16.6.2',
            'eslint-plugin-openapi': '^0.0.4',
            'eslint-plugin-promise': '^6.1.1',
            husky: '^8.0.3',
            'koa2-swagger-ui': '^5.10.0',
            'lint-staged': '^15.2.0',
            nodemon: '^3.1.0',
            'openapi-comment-parser': '^1.0.0',
            prettier: '^3.2.2',
            'prettier-plugin-jsdoc': '^1.3.0',
            'sequelize-cli': '^6.6.2',
            'swagger-ui-express': '^5.0.0',
          },
          dependencies: {
            ajv: '^8.12.0',
            'ajv-errors': '^3.0.0',
            'ajv-formats': '^3.0.1',
            express: '^4.19.2',
            'express-async-errors': '^3.1.1',
            'express-bearer-token': '^2.4.0',
            globs: '^0.1.4',
            'http-errors': '^2.0.0',
            jsonwebtoken: '^9.0.2',
            morgan: '^1.10.0',
            sequelize: '^6.37.1',
          },
        })
      })
    })

    describe('openapi', () => {
      it('Should generate the api-specification.yml file with the correct content', () => {
        // Assert
        assert.fileContent([
          [
            'api/api-specification.yml',
            `  title: ${args[projectName]} - API documentation`,
          ],
          [
            'api/api-specification.yml',
            `Default API documentation created by generator-koa2-api-generator for ${args[projectName]} project.`,
          ],
        ])
      })
    })

    describe('README.md', () => {
      it('Should generate the README.md file with the correct content', () => {
        // Assert
        assert.fileContent([
          [
            'api/README.md',
            `<h1 align="center">Welcome to ${args[projectName]} API 👋</h1>`,
          ],
        ])
      })
    })
  })

  describe('create a new project with PostgreSQL drivers', () => {
    const projectName = 0
    const args = []
    const answers = {}
    const options = {
      'skip-install': true,
    }

    beforeAll(async () => {
      args[projectName] = faker.string.sample()

      answers.databaseDriver = 'postgresql'
      answers.runGitInit = false
      answers.runPackageScripts = false
      answers.useDocker = false
      answers.useDockerCompose = false

      await helpers
        .run(path.join(__dirname, '../generators/app'))
        .withArguments(args)
        .withAnswers(answers)
        .withOptions(options)
    })

    it('Should create the correct base structure', () => {
      // Assert
      assert.file(baseStructure)
    })

    describe('package.json', () => {
      it('Should create a package.json adding the required fields and database drivers', () => {
        // Assert
        assert.JSONFileContent('api/package.json', {
          name: args[projectName],
          version: '0.1.0',
          main: 'index.js',
          type: 'module',
          scripts: {
            'init:husky': 'husky install',
            init: 'npm run init:husky',
            dev: 'nodemon -r dotenv/config src/server.js',
            start: 'node src/server.js',
            format: 'prettier --check .',
            'format:fix': 'prettier --write .',
            lint: 'eslint -c .eslintrc.yml --no-eslintrc --ext .js,.mjs .',
            'lint-fix': 'npm run lint -- --fix',
            test: 'echo The test is not implemented && exit -1',
            'lint-staged': 'npx lint-staged',
            commitlint: 'npx commitlint --edit',
            'quality-check': 'npm run format && npm run lint',
          },
          devDependencies: {
            '@babel/cli': '^7.11.6',
            '@babel/core': '^7.11.6',
            '@babel/preset-env': '^7.11.5',
            '@babel/register': '^7.23.7',
            '@commitlint/cli': '^18.4.4',
            '@commitlint/config-conventional': '^18.4.4',
            '@types/express': '^4.17.21',
            'babel-plugin-add-module-exports': '^1.0.4',
            'babel-plugin-transform-import-meta': '^2.2.1',
            dotenv: '^16.3.1',
            eslint: '^8.56.0',
            'eslint-config-prettier': '^9.1.0',
            'eslint-config-standard': '^17.1.0',
            'eslint-plugin-import': '^2.29.1',
            'eslint-plugin-n': '^16.6.2',
            'eslint-plugin-openapi': '^0.0.4',
            'eslint-plugin-promise': '^6.1.1',
            husky: '^8.0.3',
            'koa2-swagger-ui': '^5.10.0',
            'lint-staged': '^15.2.0',
            nodemon: '^3.1.0',
            'openapi-comment-parser': '^1.0.0',
            prettier: '^3.2.2',
            'prettier-plugin-jsdoc': '^1.3.0',
            'sequelize-cli': '^6.6.2',
            'swagger-ui-express': '^5.0.0',
          },
          dependencies: {
            ajv: '^8.12.0',
            'ajv-errors': '^3.0.0',
            'ajv-formats': '^3.0.1',
            express: '^4.19.2',
            'express-async-errors': '^3.1.1',
            'express-bearer-token': '^2.4.0',
            globs: '^0.1.4',
            'http-errors': '^2.0.0',
            jsonwebtoken: '^9.0.2',
            morgan: '^1.10.0',
            pg: '^8.3.3',
            'pg-hstore': '^2.3.3',
            sequelize: '^6.37.1',
          },
        })
      })
    })

    describe('openapi', () => {
      it('Should generate the api-specification.yml file with the correct content', () => {
        // Assert
        assert.fileContent([
          [
            'api/api-specification.yml',
            `  title: ${args[projectName]} - API documentation`,
          ],
          [
            'api/api-specification.yml',
            `Default API documentation created by generator-koa2-api-generator for ${args[projectName]} project.`,
          ],
        ])
      })
    })

    describe('README.md', () => {
      it('Should generate the README.md file with the correct content', () => {
        // Assert
        assert.fileContent([
          [
            'api/README.md',
            `<h1 align="center">Welcome to ${args[projectName]} API 👋</h1>`,
          ],
        ])
      })
    })
  })

  describe('create a new project with MySQL drivers', () => {
    const projectName = 0
    const args = []
    const answers = {}
    const options = {
      'skip-install': true,
    }

    beforeAll(async () => {
      args[projectName] = faker.string.sample()

      answers.databaseDriver = 'mysql'
      answers.runGitInit = false
      answers.runPackageScripts = false
      answers.useDocker = false
      answers.useDockerCompose = false

      await helpers
        .run(path.join(__dirname, '../generators/app'))
        .withArguments(args)
        .withAnswers(answers)
        .withOptions(options)
    })

    it('Should create the correct base structure', () => {
      // Assert
      assert.file(baseStructure)
    })

    describe('package.json', () => {
      it('Should create a package.json adding the required fields and database drivers', () => {
        // Assert
        assert.JSONFileContent('api/package.json', {
          name: args[projectName],
          version: '0.1.0',
          main: 'index.js',
          type: 'module',
          scripts: {
            'init:husky': 'husky install',
            init: 'npm run init:husky',
            dev: 'nodemon -r dotenv/config src/server.js',
            start: 'node src/server.js',
            format: 'prettier --check .',
            'format:fix': 'prettier --write .',
            lint: 'eslint -c .eslintrc.yml --no-eslintrc --ext .js,.mjs .',
            'lint-fix': 'npm run lint -- --fix',
            test: 'echo The test is not implemented && exit -1',
            'lint-staged': 'npx lint-staged',
            commitlint: 'npx commitlint --edit',
            'quality-check': 'npm run format && npm run lint',
          },
          devDependencies: {
            '@babel/cli': '^7.11.6',
            '@babel/core': '^7.11.6',
            '@babel/preset-env': '^7.11.5',
            '@babel/register': '^7.23.7',
            '@commitlint/cli': '^18.4.4',
            '@commitlint/config-conventional': '^18.4.4',
            '@types/express': '^4.17.21',
            'babel-plugin-add-module-exports': '^1.0.4',
            'babel-plugin-transform-import-meta': '^2.2.1',
            dotenv: '^16.3.1',
            eslint: '^8.56.0',
            'eslint-config-prettier': '^9.1.0',
            'eslint-config-standard': '^17.1.0',
            'eslint-plugin-import': '^2.29.1',
            'eslint-plugin-n': '^16.6.2',
            'eslint-plugin-openapi': '^0.0.4',
            'eslint-plugin-promise': '^6.1.1',
            husky: '^8.0.3',
            'koa2-swagger-ui': '^5.10.0',
            'lint-staged': '^15.2.0',
            nodemon: '^3.1.0',
            'openapi-comment-parser': '^1.0.0',
            prettier: '^3.2.2',
            'prettier-plugin-jsdoc': '^1.3.0',
            'sequelize-cli': '^6.6.2',
            'swagger-ui-express': '^5.0.0',
          },
          dependencies: {
            ajv: '^8.12.0',
            'ajv-errors': '^3.0.0',
            'ajv-formats': '^3.0.1',
            express: '^4.19.2',
            'express-async-errors': '^3.1.1',
            'express-bearer-token': '^2.4.0',
            globs: '^0.1.4',
            'http-errors': '^2.0.0',
            jsonwebtoken: '^9.0.2',
            morgan: '^1.10.0',
            mysql2: '^3.9.3',
            sequelize: '^6.37.1',
          },
        })
      })
    })

    describe('openapi', () => {
      it('Should generate the api-specification.yml file with the correct content', () => {
        // Assert
        assert.fileContent([
          [
            'api/api-specification.yml',
            `  title: ${args[projectName]} - API documentation`,
          ],
          [
            'api/api-specification.yml',
            `Default API documentation created by generator-koa2-api-generator for ${args[projectName]} project.`,
          ],
        ])
      })
    })

    describe('README.md', () => {
      it('Should generate the README.md file with the correct content', () => {
        // Assert
        assert.fileContent([
          [
            'api/README.md',
            `<h1 align="center">Welcome to ${args[projectName]} API 👋</h1>`,
          ],
        ])
      })
    })
  })

  describe('create a new project without MariaDB drivers', () => {
    const projectName = 0
    const args = []
    const answers = {}
    const options = {
      'skip-install': true,
    }

    beforeAll(async () => {
      args[projectName] = faker.string.sample()

      answers.databaseDriver = 'mariadb'
      answers.runGitInit = false
      answers.runPackageScripts = false
      answers.useDocker = false
      answers.useDockerCompose = false

      await helpers
        .run(path.join(__dirname, '../generators/app'))
        .withArguments(args)
        .withAnswers(answers)
        .withOptions(options)
    })

    it('Should create the correct base structure', () => {
      // Assert
      assert.file(baseStructure)
    })

    describe('package.json', () => {
      it('Should create a package.json adding the required fields and database drivers', () => {
        // Assert
        assert.JSONFileContent('api/package.json', {
          name: args[projectName],
          version: '0.1.0',
          main: 'index.js',
          type: 'module',
          scripts: {
            'init:husky': 'husky install',
            init: 'npm run init:husky',
            dev: 'nodemon -r dotenv/config src/server.js',
            start: 'node src/server.js',
            format: 'prettier --check .',
            'format:fix': 'prettier --write .',
            lint: 'eslint -c .eslintrc.yml --no-eslintrc --ext .js,.mjs .',
            'lint-fix': 'npm run lint -- --fix',
            test: 'echo The test is not implemented && exit -1',
            'lint-staged': 'npx lint-staged',
            commitlint: 'npx commitlint --edit',
            'quality-check': 'npm run format && npm run lint',
          },
          devDependencies: {
            '@babel/cli': '^7.11.6',
            '@babel/core': '^7.11.6',
            '@babel/preset-env': '^7.11.5',
            '@babel/register': '^7.23.7',
            '@commitlint/cli': '^18.4.4',
            '@commitlint/config-conventional': '^18.4.4',
            '@types/express': '^4.17.21',
            'babel-plugin-add-module-exports': '^1.0.4',
            'babel-plugin-transform-import-meta': '^2.2.1',
            dotenv: '^16.3.1',
            eslint: '^8.56.0',
            'eslint-config-prettier': '^9.1.0',
            'eslint-config-standard': '^17.1.0',
            'eslint-plugin-import': '^2.29.1',
            'eslint-plugin-n': '^16.6.2',
            'eslint-plugin-openapi': '^0.0.4',
            'eslint-plugin-promise': '^6.1.1',
            husky: '^8.0.3',
            'koa2-swagger-ui': '^5.10.0',
            'lint-staged': '^15.2.0',
            nodemon: '^3.1.0',
            'openapi-comment-parser': '^1.0.0',
            prettier: '^3.2.2',
            'prettier-plugin-jsdoc': '^1.3.0',
            'sequelize-cli': '^6.6.2',
            'swagger-ui-express': '^5.0.0',
          },
          dependencies: {
            ajv: '^8.12.0',
            'ajv-errors': '^3.0.0',
            'ajv-formats': '^3.0.1',
            express: '^4.19.2',
            'express-async-errors': '^3.1.1',
            'express-bearer-token': '^2.4.0',
            globs: '^0.1.4',
            'http-errors': '^2.0.0',
            jsonwebtoken: '^9.0.2',
            morgan: '^1.10.0',
            mariadb: '^3.3.0',
            sequelize: '^6.37.1',
          },
        })
      })
    })

    describe('openapi', () => {
      it('Should generate the api-specification.yml file with the correct content', () => {
        // Assert
        assert.fileContent([
          [
            'api/api-specification.yml',
            `  title: ${args[projectName]} - API documentation`,
          ],
          [
            'api/api-specification.yml',
            `Default API documentation created by generator-koa2-api-generator for ${args[projectName]} project.`,
          ],
        ])
      })
    })

    describe('README.md', () => {
      it('Should generate the README.md file with the correct content', () => {
        // Assert
        assert.fileContent([
          [
            'api/README.md',
            `<h1 align="center">Welcome to ${args[projectName]} API 👋</h1>`,
          ],
        ])
      })
    })
  })
})
