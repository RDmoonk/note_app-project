import { Stack } from "expo-router";

// This is the root layout component for the entire app.
// It defines the navigation stack using <Stack> from expo-router.

export default function RootLayout() {
  return ( 
    <Stack
      screenOptions={{ 
        // Global screen options for the entire stack can be set here.
        // Currently, no global options are specified.
      }}
    >
      {/* 
        This screen registers the (tabs) folder as a screen in the stack.
        - It represents the bottom tab navigation layout.
        - The header (top navigation bar) is hidden specifically for this layout.
      */}
      <Stack.Screen
        name="(tabs)"
        options={{ headerShown: false }}
      />

      {/*
        This screen represents a deeper route located at [id]/notesPage.tsx.
        - It sets the header title to "Notes" when navigating to this screen.
      */}
      <Stack.Screen
        name="[id]/notesPage"
        options={{ title: "Notes" }}
      />
    </Stack>
  );
}
