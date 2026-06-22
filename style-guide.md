# Style Guide

## Splash Screen and App Icon

As per Expo's [documentation](https://docs.expo.io/tutorial/configuration/), here are the following guidelines for the splash screen and app icons:

**[Splash Screen](https://docs.expo.io/guides/splash-screens/)**

- The splash screen image should be named `splash.png` and saved into the `assets` directory.
- The splash screen must have `1242px` width by `2436px` height.

**[App Icon](https://docs.expo.io/guides/app-icons/)**

- The app icon images should be named `icon.png` and `adaptive-icon.png`, and saved into the `assets` directory.
- The app icons must be perfectly square (i.e.the width and height must be exactly the same).
- Ideally, the app icon should have `1024px` width by `1024px` height.

The background colors for the splash screen and the app icon can be configured in [app.json](./app.json):

```json
// in app.json:
{
  "expo": {
    /*...*/
    "icon": "./assets/icon.png",
    "splash": {
      "image": "./assets/splash.png",
      "resizeMode": "contain",
      "backgroundColor": "#ffffff"
    },
    /*...*/
    "android": {
      "adaptiveIcon": {
        "foregroundImage": "./assets/adaptive-icon.png",
        "backgroundColor": "#FFFFFF"
      }
    }
  }
}
```

This means we can just have a transparent background on the image files and easily change the background color without the need to edit the image files themselves.

## Color Scheme

For now, we are using [Tailwind's color schemes](https://tailwindcss.com/docs/customizing-colors) for the app.

> Note that we are not actually using TailwindCSS in the React Native app, but rather we are simply just copying the hex codes to be used in the StyleSheets for the screens and components.

## Component Design

We're using [styled-components for React Native](https://styled-components.com/docs/basics#react-native) to help organize the design system for our app.

For screens with complex designs and/or component structures, the styled components should be placed into a `*.styles.js` file, and such components would be imported into the corresponding `*.screen.js` file. Reusable components can also be placed into a separate `*.styles.js` file in the `src/components` directory.

Using styled-components also allows us to use a theming system to help organize our styles. You can view the theme variables such as colors, font sizes/weights, spacing, and margin/padding sizes in the [`src/infrastructure/theme` folder](./src/infrastructure/theme/).

The theme variables can then be passed as props into the stled components like so:

```jsx
const ComponentName = styled.element`
  padding: ${(props) => props.theme.space[2]};
  font-size: ${(props) => props.theme.fontSizes.body};
  font-weight: ${(props) => props.theme.fontWeights.regular};
  color: ${(props) => props.theme.colors.text.primary};
  background-color: ${(props) => props.theme.colors.bg.primary};
`;
```

## Screen Layout Design

TODO
