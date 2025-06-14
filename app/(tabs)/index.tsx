// src/screens/NotePage.tsx
import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet, Button } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { router } from 'expo-router';

type Note = {
  title: string;
  note: string;
  importance: string;
};

export default function NotePage() {
  const [notes, setNotes] = useState<Note[]>([]);

  const loadNotes = async () => {
    try {
      const notesJSON = await AsyncStorage.getItem('notes');
      const savedNotes = notesJSON ? JSON.parse(notesJSON) : [];
      setNotes(savedNotes);
    } catch (error) {
      console.log('Erreur de lecture des notes', error);
    }
  };

  useEffect(() => {
    loadNotes();
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Saved notes :</Text>
      <FlatList
        data={notes}
        keyExtractor={(_, index) => index.toString()}
        renderItem={({ item }) => (
          <View style={styles.noteItem}>
            <Text style={styles.noteTitle}>{item.title} ({item.importance})</Text>
            <Text>{item.note}</Text>
          </View>
        )}
      />

       <Button
      title="Add a note"
      onPress={() => router.push("/form")}
      />

      <Button
      title="Notes test"
      onPress={() => router.push("/[id]/notesPage")}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { padding: 20, marginTop: 40 },
  heading: { fontSize: 18, fontWeight: 'bold', marginBottom: 10 },
  noteItem: { backgroundColor: '#eee', padding: 10, borderRadius: 5, marginVertical: 5 },
  noteTitle: { fontWeight: 'bold' }
});
