// src/screens/NotePage.tsx
import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet, Button } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';

type Note = {
  id: number;
  title: string;
  note: string;
  importance: string;
};

export default function NotePage() {
  const [notes, setNotes] = useState<Note[]>([]);
  // set the use state for the value time
  const [currentDateTime, setcurrentDateTime] = useState(new Date())

  const router = useRouter();

  const showDate = new Date(8.64e15).toString(); 

  useEffect(() => {
    const tmer = setInterval(() =>{
      setcurrentDateTime(new Date())
    }, 1000 )
    return()=>clearInterval(tmer);
  }, []);

  const loadNotes = async () => {
    try {
      const notesJSON = await AsyncStorage.getItem('notes');
      const savedNotes = notesJSON ? JSON.parse(notesJSON) : [];
      setNotes(savedNotes);
    } catch (error) {
      console.log('Erreur de lecture des notes', error);
    }
  };

  // for the delete
  const handleDelete = async (id:number) => {
    const updateNotes = notes.filter(note => note.id !== id);
    setNotes(updateNotes);
    await AsyncStorage.setItem('notes', JSON.stringify(updateNotes))
  }


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

            <Text>{currentDateTime.toLocaleString()}</Text>

            <View>
              <Button
              title='Edit'
              onPress={() => router.push({pathname: '/form', params: item})}
              />
            </View>

            <View>
              <Button
              title='Delete'
              color="red"
              onPress={() => handleDelete(item.id)}
              />

              
            </View>
          </View>
        )}
      />

       <Button
      title="Add a note"
      onPress={() => router.push("/form")}
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