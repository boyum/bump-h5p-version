# Bump H5P library vesrion

This action bumps the library version of a H5P project.

## Usage

### Options

| Name                | Required | Default value                                  | Description                                                                                                                |
| ------------------- | -------- | ---------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------- |
| `type`              | true     | -                                              | The version type to update. Either `major`, `minor`, or `patch`. If `minor` is bumped, the patch version will be set to 0. |
| `user-name`         | false    | `github-actions[bot]`                          | GitHub user name to commit with.                                                                                           |
| `user-email`        | false    | `github-actions[bot]@users.noreply.github.com` | GitHub user email to commit with.                                                                                          |
| `working-directory` | false    | `.`                                            | The directory where the library.json file is located, relative to the Git project.                                         |
| `commit-message`    | false    | `bump $TYPE$ version`                          | The commit message used when commiting bumped library version. `$TYPE$` will be replaced with the `type` parameter.        |
