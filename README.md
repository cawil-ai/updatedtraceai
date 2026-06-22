
# TrACE.AI Beta App

## How to run the app

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
   yarn install
   ```
4. Start the development server:
   ```
   npx react-native run-android
   ```
5. You should see the development version of the app installed on your device. If it does not open automatically, simply tap its icon on your home screen to open the app!

## Contributing

Please see the [CONTRIBUTING.md](./CONTRIBUTING.md) file where we explain

- How to contribute?
- Use Github Issues to organize your tasks
- Git Workflow
- Local Project Setup
- House Rules
- Creating and reviewing Pull Requests (PRs)

## Exporting as APK

Step 1. Go to the root of the project in the terminal and run the below command
```
react-native bundle --platform android --dev false --entry-file index.js --bundle-output android/app/src/main/assets/index.android.bundle --assets-dest android/app/src/main/res
```

Step 2. From the root of the project, go to your Android directory
```
cd android
```

Step 3. Inside the Android folder, run the following command
```
./gradlew assembleDebug
```

The exported APK will be found in the following path:
```
tracemobileappnew/android/app/build/outputs/apk/debug/app-debug.apk
```
## Known Issues

- [Expo's FileSystem documentDirectory folder](https://docs.expo.io/versions/v40.0.0/sdk/filesystem/#filesystemdocumentdirectory) is not visible through other apps including the Android file explorer.
  - The images and catch data files can still be viewed and manipulated by the app, but the user cannot view the files in their file explorer.
- The app needs an initial internet connection to connect to firebase upon loading the app. Attempting to call `firebase.initializeApp()` after the app loads just results in the following error:
  ```
  FirebaseError: No Firebase App '[DEFAULT]' has been created - call Firebase App.initializeApp() (app/no-app)
  ```
  - Once we migrate our backend into an AWS server with our very own Node.js backend, we can skip this initial internet connection requirement as the app will only need to connect to the internet by using [axios](https://github.com/axios/axios) to make HTTP requests only when needed.

## Todos

- Research how to use [TFJS for React Native](https://github.com/tensorflow/tfjs/tree/master/tfjs-react-native)
  - Ideally, we will just need the trained TFJS model files (`model.json` and `model_weights.bin`) and they should be able to integrate directly with the app
  - Research [bundleResourceIO](https://js.tensorflow.org/api_react_native/latest/#bundleResourceIO) for loading models locally
    > NOTE: We have [ejected into a bare workflow](https://docs.expo.dev/introduction/managed-vs-bare/#what-happens-if-i-run-up-against) to support the `bundleResourceIO` feature.
- Research and implement a feature for persistent login
- Implement a proper design system for the app (see [style-guide.md](./style-guide.md))
- Minor optimizations on data fetching code
- Minor optimizations on state management code
  - Minor refactors to use the Context API for the ff. features:
    - Catch Data
    - Fisherman Data
  - We might also consider using other state management libraries such as [Redux](https://redux.js.org/), as the app becomes more complex later on
#� �t�r�a�c�e�a�i�m�o�b�i�l�e�a�p�p�a�i�
�
�
