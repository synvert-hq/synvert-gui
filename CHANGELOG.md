# Change Log

## [1.14.0] - 2024-06-15

### Added

* Respect `.gitignore`

### Changed

* Update `@synvert-hq/synvert-ui-common` to 1.18.0

## [1.13.0] - 2024-05-07

### Changed

- Update `@synvert-hq/synvert-ui-common` to 1.17.0
- Revert to use `bin_path`
- Use `@synvert-hq/synvert-ui-common` to install and sync synvert

## [1.12.1] - 2024-04-15

### Changed

* Rename `bin_path` to `command_path`

## [1.12.0] - 2024-04-14

### Added

* Add `ruby.bin_path` preference
* Add `javascript.bin_path` preference

### Changes

* Show close button in toast

### Fixed

* Add missing `await` to check ruby dependencies
* Fix `checkJavascriptDependencies` message

## [1.11.1] - 2024-04-11

### Changed

- Moving from `@xinminlabs` to `@synvert-hq`
- Use `@synvert-hq/synvert-ui-common` and `@synvert-hq/synvert-server-common` packages

## [1.11.0] - 2024-02-17

## Added

- Update `synvert-ui-common` to 1.15.2 to support `prism` parser

## [1.10.3] - 2024-01-26

### Changed

- Update `synvert-ui-common` to 1.14.3
- Use `react-diff-viewer-continued` instead of `@xinminlabs/react-diff-viewer`

## [1.10.2] - 2024-01-12

### Changed

- Better error message

## [1.10.1] - 2023-12-27

### Changed

- Update `synvert-ui-common` to 1.14.1
- Polish `add_file`, `remove_file` and `rename_file` UI
- Handle async reducers in action

## [1.10.0] - 2023-12-13

### Added

- Support css/less/sass/scss

### Changed

- Use `filePatternByLanguage`, `placeholderByLanguage`, `parsersByLanguage` from synvert-ui-common

## [1.9.3] - 2023-12-10

### Changed

- Use `replaceTestResult` and `replaceTestAction` from synvert-ui-common
- Use `fetchSnippets` and `generateSnippets` from synvert-ui-common

## [1.9.2] - 2023-12-06

### Changed

- Do not notarize

### Removed

- Drop our own autoUpdater server

## [1.9.1] - 2023-11-24

### Changed

- Use `runSynvertRuby` and `runSynvertJavascript` from synvert-ui-common
- Use `checkRubyDependencies` and `checkJavascriptDependencies` from synvert-ui-common

## [1.9.0] - 2023-11-03

### Added

- Use `update-electron-app`
- Publish to github

### Changed

- Use MIT license

### Fixed

- Catch check dependency error
