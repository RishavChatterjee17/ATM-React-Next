# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a Casetext homework assignment to build a functional ATM machine demo web app. The application should be built in React (JavaScript or TypeScript) with stubbed backend functionality.

## Key Requirements

- Build ATM interface matching provided mocks (Mock_1.png, Mock_2.png)
- Implement PIN entry system
- Support balance checking, withdrawals, and deposits
- Highlight user's card type after correct PIN entry
- Use provided assets in the `assets/` directory
- Utilize React hooks and effective state management
- Funds should correctly reflect after transactions

## Project Structure

Currently this is an empty repository containing only:
- `README.md` - Project requirements and guidelines
- `assets/` - UI mockups and visual assets (atm_sign.png, creditcard_sprite.png, graffiti.png, sticker_graf.png, systems.png)

## Development Setup

No package.json or build configuration exists yet. When setting up the project, you'll need to:
- Initialize a React project (Create React App, Vite, or Next.js)
- Set up state management solution
- Configure build and development scripts

## Backend Considerations

The project requires stubbed backend functionality - use local storage or file-based data rather than a real server. An optional Express.js backend can be added if beneficial for the implementation.