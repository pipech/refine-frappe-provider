# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

## [0.0.6] - 2024-04-25

### Added

- Add `uploadFile` function

### Changed

- Update `eslint`, add `globals`
- Update `custom` dataClient

### Fixed

- Allow `options` props to be pass to `accessControlProvider`
- Export `authType`
- Properly handle `error`
- Export `DataParams` type
- Fix ts compiled config

## [0.0.5] - 2024-03-06

### Changed

- Add try, catch to `can` on `accessControlProvider`
- Add `options` props to `accessControlProvider`
- Add condition to check for cookies before calling `check` on `authProvider`