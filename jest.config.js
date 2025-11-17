module.exports = {
  preset: "jest-expo",
  testEnvironment: "jest-environment-jsdom",

  fakeTimers: {
    enableGlobally: true,
  },

  transform: {
    "^.+\\.[tj]sx?$": "babel-jest",
  },

  transformIgnorePatterns: [
    "node_modules/(?!(" +
      "expo|" +
      "expo-modules-core|" +
      "@expo/.*|" +
      "expo-router|" +
      "expo-constants|" +
      "expo-asset|" +
      "expo-file-system|" +
      "react-native|" +
      "@react-native/.*" +
    ")/)"
  ],

  // MUST RUN FIRST
  setupFiles: ["<rootDir>/jest.pre-setup.js"],

  // Runs after Jest environment is ready
  setupFilesAfterEnv: ["<rootDir>/jest.setup.ts"],
};
