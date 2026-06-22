# Contributing to the TrACE.AI Mobile App

Welcome! This guide provides some steps necessary to make contributing to this project and organizing your tasks in CAWIL.AI as easy and transparent as possible, whether it's:

- Discussing the current state of the code
- Reporting a bug
- Submitting a fix
- Proposing new features
- Adding new features

## Before you contribute

Our aim is to keep it simple for the developers to contribute to this project.

Please familiarize yourself with the folder structure for this project. Here are the most common folders you're most likely to be working on:

- `android/` - Contains the native code specific to Android devices.
- `ios/` - Contains the native code specific to iOS devices.
- `src/` - Contains most of the _**React Native**_ source code that powers the TrACE.AI mobile app.
  - `components/` - Contains common/utility components used by different features/screens within the mobile app. If your component only makes sense to be reused for only one feature group, consider putting them in the `components/` folder within the `features/${featureName}` folder instead.
  - `config/` - Contains configuration code and/or credentials for external libraries (such as Firebase).
  - `features/` - Contains the various features of the app. Each screen (or page) displayed in the mobile app are grouped together in different folders that describe a certain feature. Each feature folder is structured as follows:
    - `screens/` - Contains the code for the actual screens to be displayed in the mobile app.
    - `components/` - Contains components that are only reused within the context of the same feature group. If your component makes more sense to be reused for more feature groups, consider putting them in the top-level `components/` folder instead.
  - `infrastructure/` - Contains code that defines the mobile app's infrastructure:
    - `navigation/` - Defines the navigation flows powered by [React Navigation](https://reactnavigation.org/docs/getting-started/).
    - `theme/` - Defines the theme variables used by [Styled Components](https://styled-components.com/docs/basics#react-native). Useful for defining reusable variables for a well-defined design system.
  - `services/` - Contains [services](https://medium.com/the-guild/injectable-services-in-react-de0136b6d476), which are essential to provide the backbone of the application logic of the app. (e.g. React Context providers for handling Authentication)
  - `utils/` - Contains small but common utility functions that are reused often within the project.

## How to contribute?

You may contribute to this project by working on your tasks given by the CAWIL.AI team. For more details, please contact us via the CAWIL.AI Discord server.

## Use Github Issues to organize your tasks

You may also find it useful to organize your tasks by creating [Github Issues](https://docs.github.com/en/issues/tracking-your-work-with-issues/about-issues). You may use the following template to get started:

```md
# Task Name

Provide a brief description and background for your task.

## Your Task

With as much detail as you can, list the steps that you need to complete the task:

- Step 1
- Step 2
- Step 3

To resolve this issue, create a new branch called `${new-task}` (hint: `git switch -c ${new-task}`, replacing `${new-task}` with a descriptive branch name), commit your changes, and make a new Pull Request linking this issue. We will review your changes and merge into the main branch once the changes have been approved.

## Hints

If you have some ideas or resources that you might find helpful to complete this task, feel free to list them here!
```

## Git Workflow

In order to keep the `main` branch clean and always contain fully working code, we use the [Feature Branch](https://www.atlassian.com/git/tutorials/comparing-workflows/feature-branch-workflow) workflow when we work on our tasks and add new features and/or fix bugs in the TrACE.AI project.

Here are some basic steps to get started using the Feature Branch workflow:

- If you haven't already, clone this repository on your local machine:
  ```
  git clone https://github.com/cawil-ai/traceappbeta01.git
  ```
- Optionally, you may also [use Github Issues](#use-github-issues-to-organize-your-tasks) to describe the task you're working on.
- Make a new feature branch for your current task. It also helps to name this new branch with a short name describing the task you are working on:
  ```
  git switch -c ${new-task}
  ```
- Keep the local repository up to date:
  - Before starting to work on your task, first get the latest version of the `main branch`:
    ```
    git fetch origin
    git pull origin main
    ```
  - Make sure your changes are always in the feature branch you created.
- After working on your task, commit your changes:
  ```
  git add .
  git commit -m "${short-description-of-changes-made}"
  ```
- Then in order to make your changes visible to the remote repository in Github:
  - Get the latest version of the `main` branch to prevent conflicts:
    ```
    git fetch origin
    git pull origin main
    ```
  - Then push the new files to your forked version:
    ```
    git push origin ${new-task}
    ```

## Local Project Setup

> **IMPORTANT!** If you're migrating from the previous Expo managed workflow, it is recommended to clone this repository in a separate folder before following the steps below, as the file structure for the ejected project is drastically different from the managed workflow and thus likely to cause breaking changes.

1. Follow the [React Native guide for setting up your local development environment](https://reactnative.dev/docs/environment-setup). In a nutshell:
   - Make sure you have [openjdk8](https://openjdk.java.net/projects/jdk8/) installed. We recommend installing it via [Chocolatey](https://chocolatey.org/):
     ```
     choco install -y openjdk8
     ```
   - Make sure you have [Android Studio](https://developer.android.com/studio/index.html) installed.
   - Make sure you set the following environment variables:
     - `ANDROID_HOME`: `%LOCALAPPDATA%\Android\Sdk`
     - `ANDROID_SDK_ROOT`: `%LOCALAPPDATA%\Android\Sdk`
   - Make sure you add the following directory to your Path:
     - `%LOCALAPPDATA%\Android\Sdk\platform-tools`
2. To run the app on your own Android device, [follow this guide](https://reactnative.dev/docs/running-on-device). tl;dr:
   - Enable Debugging over USB for your device. You can do this by going to `Settings → About phone → Software information` and then tapping the `Build number` row at the bottom seven times. You can then go back to `Settings → Developer options` to enable `USB debugging`.
   - Plug in your device via USB, then run `adb devices` to authorize React Native to run the development build.
3. Install the project dependencies:
   ```
   npm install
   ```
4. Start the development server:
   ```
   npx react-native run-android
   ```
5. You should see the development version of the app installed on your device. If it does not open automatically, simply tap its icon on your home screen to open the app!

## House Rules

Before commiting and/or pushing your changes, please make sure your code is well-organized and follows the stndards set by the CAWIL.AI team:

- Make sure you follow the [folder structure](#before-you-contribute) defined above
- As much as you can, please keep your code well-organized and free of errors and/or warnings.

  Most of the common errors and warnings can be caught (and may even be fixed automatically!) by installing these recommended VSCode extensions:

  - [ESLint](https://marketplace.visualstudio.com/items?itemName=dbaeumer.vscode-eslint)
  - [Prettier - Code formatter](https://marketplace.visualstudio.com/items?itemName=esbenp.prettier-vscode)

- As much as you can, please write some helpful comments describing the application logic and/or your thought process when writing your code.
  This extension also provides some basic color-coding to keep your comments well-organized:
  - [Better Comments](https://marketplace.visualstudio.com/items?itemName=aaron-bond.better-comments)

## Creating and reviewing Pull Requests (PRs)

Once you're done working on your task, it's time to [create a Pull Request](https://docs.github.com/en/pull-requests/collaborating-with-pull-requests/proposing-changes-to-your-work-with-pull-requests/about-pull-requests) to let the CAWIL.AI team review and test your changes before merging to the `main` branch.

If there is an existing [Github Issue](#use-github-issues-to-organize-your-tasks) related to your task, you may also [link that issue when you create your pull request](https://docs.github.com/en/issues/tracking-your-work-with-issues/linking-a-pull-request-to-an-issue), and that issue will be automatically closed once your changes have been approved and merged.

After submitting your pull request, the CAWIL.AI team will review the changes you've made, ensure the TrACE.AI app still works with the added feature/bugfix, and [review your changes](https://docs.github.com/en/pull-requests/collaborating-with-pull-requests/reviewing-changes-in-pull-requests/reviewing-proposed-changes-in-a-pull-request) before merging into the `main` branch. Within the review, the CAWIL.AI team can also add comments and request changes before your pull request can be approved and merged.

If the CAWIL.AI team requests some changes to your pull request, you can add new commits to the same feature branch to address these requested changes. Once your changes are approved by the CAWIL.AI team, your pull request can then be [merged into the `main` branch](https://docs.github.com/en/pull-requests/collaborating-with-pull-requests/incorporating-changes-from-a-pull-request/merging-a-pull-request). To keep the commit history of the `main` branch clean, the CAWIL.AI team may also [squash your changes into a single commit](https://docs.github.com/en/pull-requests/collaborating-with-pull-requests/incorporating-changes-from-a-pull-request/about-pull-request-merges#squash-and-merge-your-pull-request-commits) upon merging.
