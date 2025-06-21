import { Tabs } from 'expo-router';
import React from 'react';

// This component defines the tab-based layout for screens inside the (tabs) folder.
// It uses the <Tabs> navigator from expo-router to provide bottom tab navigation.

export default function TabsLayout() {
  return (
    <Tabs
      screenOptions={{
        // This ensures the header (top bar with the title) is shown on all screens by default
        headerShown: true,
      }}
    >
      {/* 
        This screen represents the index.tsx inside the (tabs) folder.
        - Title "Dashboard" will appear in the header.
        - The bottom tab bar will be hidden on this screen using tabBarStyle.
      */}
      <Tabs.Screen
        name="index"
        options={{
          title: 'Dashboard',
          tabBarStyle: { display: 'none' }, // ✅ Hides bottom tab bar on this screen
        }}
      />

      {/*
        This screen represents [id].tsx, a dynamic route inside (tabs).
        - It shows the header with title "Notes".
        - The bottom tab bar will remain visible by default.
      */}
      <Tabs.Screen
        name="[id]"
        options={{
          title: 'Notes',
        }}
      />

      {/*
        This screen represents form.tsx inside (tabs).
        - It shows the header with title "Form".
        - The bottom tab bar is also visible here.
      */}
      <Tabs.Screen
        name="form"
        options={{
          title: 'Form',
        }}
      />
    </Tabs>
  );
}
