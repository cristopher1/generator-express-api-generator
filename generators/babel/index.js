import Generator from 'yeoman-generator'

export default class GeneratorBabel extends Generator {
  writing() {
    this.env.cwd = this.destinationPath('api')

    this.destinationRoot(this.env.cwd)

    this.fs.copy(
      this.templatePath('api/babel.config.json'),
      this.destinationPath('babel.config.json'),
    )
  }
}
