import { jest } from "@jest/globals";
import "@testing-library/jest-native/extend-expect";

jest.mock("react-native-reanimated", () =>
  require("react-native-reanimated/mock")
);

jest.mock("expo-router", () => ({
  useRouter: () => ({ back: jest.fn(), push: jest.fn() }),
  useLocalSearchParams: () => ({}),
  Stack: { Screen: () => null },
}));

global.fetch = jest.fn();
