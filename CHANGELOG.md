# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [0.3.1] - Mar 25, 2024.

### Changed

- Fix caching issue with API requests on clients module.
- Fix client avatar img object fit.
- Fix text grammar on client fields and messages.
- Fix date formats (to german now).
- Remove "delete" option from update client status select.
- Fix client living arrangements date validations.
- Improve client living arrangements update UX/UI.
- Add extra height to textarea component.

## [0.3.0] - Mar 18, 2024.

### Added

- Client details page (all fields with update actions):
  - Main fields (name, status and avatar).
  - Profile section.
  - Guardianship section.
  - Health section.
  - Residence section.
- Added avatar on fullname column of clients table
- Added new components.

### Changed

- Adapt create client form with new living arrangement field data structure.
- Refactor API response error handling on actions.
- Fix sidebar items active styles calculation.

## [0.2.1] - Feb 29, 2024.

### Changed

- Add all local court options (previously was incomplete the list of options).
- Fix multiple form validation errors.
- Add missing translations to german.

## [0.2.0] - Feb 28, 2024.

### Added

- Add clients table.
- Connect clients table with API.
- Add create clients form.
- Connect create clients form with API and clients page UI.
- Add a bunch of new ui components.
- New user profile badge (now with dropdown).

### Changed

- Adapt to new API response format and add pagination utils. New api res format is {data, meta} object.

## [0.1.0] - Feb 21, 2024.

### Added

- User credentials register: Users can now sign up for an account, providing a seamless registration process.
- User credentials login: Users can log in to their accounts using their credentials, ensuring secure access to their profiles.
- Users reset password: A password reset feature has been implemented, allowing users to easily recover their accounts in case they forget their passwords.
- Base app setup: The foundation of the app has been established, including the creation of essential pages and components, setting the stage for future development and feature integration.
