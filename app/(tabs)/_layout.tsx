import { Tabs } from 'expo-router'
import React from 'react'

export default function tabsLayout (){
  return (
  <Tabs screenOptions={{title: "tab Nav"}}>
    <Tabs.Screen name="index" options={{title: "Dashboard"}}></Tabs.Screen>
    <Tabs.Screen name="[id]" options={{title: "Notes"}}></Tabs.Screen>
     {/* <Tabs.Screen name="form" options={{title: "Form"}}></Tabs.Screen> */}
    <Tabs.Screen name="todos" options={{title: "Todos" }}></Tabs.Screen>
  </Tabs>
  )
}
