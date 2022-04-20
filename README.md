# Bump H5P library vesrion

This action bumps the library version of a H5P project.

## Usage

### Options

| Name                | Required | Default value | Description                                                                                                                |
| ------------------- | -------- | ------------- | -------------------------------------------------------------------------------------------------------------------------- |
| `type`              | true     | -             | The version type to update. Either `major`, `minor`, or `patch`. If `minor` is bumped, the patch version will be set to 0. |
| `working-directory` | false    | `.`           | The directory where the library.json file is located, relative to the Git project.                                         |
