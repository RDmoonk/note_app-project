# Complete Guide to Deploying the React Native Expo Project

This guide contains all the necessary steps to install, configure, and launch the project from the source code, including terminal commands.

---

## Prerequisites

Before starting, make sure you have installed:

- Node.js (recommended version >= 16.x)  
  Check with:  
  ```bash
  node -v
  ```

- npm (or yarn)  
  Check with:  
  ```bash
  npm -v
  ```

- Expo CLI (command-line tool)  
  If not installed, install it globally:  
  ```bash
  npm install -g expo-cli
  ```

- Android Studio (for Android emulator) or Xcode (for iOS simulator, Mac only) — optional.

- Expo Go app installed on your mobile device (Android/iOS).

---

## Installation and Launch Steps

1. **Clone or retrieve the source code**  
   Open a terminal and run:  
   ```bash
   git clone <REPOSITORY_URL>
   cd <FOLDER_NAME>
   ```

2. **Install dependencies**  
   In the project folder, run:  
   ```bash
   npm install
   ```  
   *Or if you're using yarn:*  
   ```bash
   yarn install
   ```

3. **Start the Expo development server**  
   ```bash
   npm start
   ```  
   *Or with yarn:*  
   ```bash
   yarn start
   ```

   This command starts the Metro Bundler and opens a web page with a QR code.

---

## Test the Application

- **On a mobile device**:  
  1. Install Expo Go from the Play Store or App Store.  
  2. Scan the QR code displayed in the terminal or in the web page opened by `npm start`.  
  3. The app will load on your phone.

- **On an Android emulator**:  
  1. Launch an emulator via Android Studio.  
  2. In the terminal, run:  
     ```bash
     npm run android
     ```  
     or  
     ```bash
     yarn android
     ```

- **On an iOS simulator** (Mac only):  
  1. Launch a simulator via Xcode.  
  2. In the terminal, run:  
     ```bash
     npm run ios
     ```  
     or  
     ```bash
     yarn ios
     ```

---

## Summary of Useful Commands

```bash
# Check Node.js
node -v

# Check npm
npm -v

# Install Expo CLI globally (if needed)
npm install -g expo-cli

# Clone the project
git clone <REPOSITORY_URL>
cd <FOLDER_NAME>

# Install dependencies
npm install
# or
yarn install

# Start the Expo development server
npm start
# or
yarn start

# Launch on Android emulator
npm run android
# or
yarn android

# Launch on iOS simulator (Mac)
npm run ios
# or
yarn ios

# Check environment configuration (optional)
expo doctor
```

---

## Additional Notes

- The project uses **AsyncStorage** for local saving.  
- Navigation is based on **expo-router**.  
- For any issues, check your Node and npm versions, or consult the official React Native / Expo documentation:  
  [React Native Environment Setup](https://reactnative.dev/docs/environment-setup)  
  [Expo Documentation](https://docs.expo.dev/)

---

## Support

For any questions, feel free to contact me.

---

Happy coding!
