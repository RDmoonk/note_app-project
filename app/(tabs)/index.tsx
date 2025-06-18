// NotePage.tsx
import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet, Button } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';

type Note = {
  id: number;
  title: string;
  note: string;
  importance: string;
  date: string;
};

export default function NotePage() {
  const [notes, setNotes] = useState<Note[]>([]);
  const router = useRouter();

  const loadNotes = async () => {
    try {
      const notesJSON = await AsyncStorage.getItem('notes');
      const savedNotes = notesJSON ? JSON.parse(notesJSON) : [];
      setNotes(savedNotes);
    } catch (error) {
      console.log('Erreur de lecture des notes', error);
    }
  };

  // logique de suppression, en prenant l'id (qui est un nombre) de la note en paramètre, cela permet de update la note pour ensuite la supprimer
  const handleDelete = async (id: number) => {
    const updatedNotes = notes.filter(note => note.id !== id);
    setNotes(updatedNotes);
    await AsyncStorage.setItem('notes', JSON.stringify(updatedNotes));
  };

  useEffect(() => {
    loadNotes();
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Saved notes :</Text>

      {/* Bouton qui envoie vers le form */}
       <Button title="Add a note" onPress={() => router.push("/form")} />

        {/* le corps de la note qui va récupérer les données entrée dans le form et les appliqués ici en apparaissant */}
      <FlatList
        data={notes}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <View style={styles.noteItem}>
            <Text style={styles.noteTitle}>{item.title} ({item.importance})</Text>
            <Text style={styles.noteDate}>{item.date}</Text>
            <Text>{item.note}</Text>
            <View>
              <Button
                title='Edit'
                onPress={() =>
                  router.push({
                    pathname: '/form',
                    params: {
                      id: String(item.id),
                      title: item.title,
                      note: item.note,
                      importance: item.importance
                    }
                  })
                }
              />
            </View>
            <View>
              {/* bouton qui prend la logique de handleDelete lorsque l'on appuie dessus */}
              <Button
                title='Delete'
                color="red"
                onPress={() => handleDelete(item.id)}
              />
            </View>
          </View>
        )}
      />

     
    </View>
  );
}

const styles = StyleSheet.create({
  container: { padding: 20, marginTop: 40 },
  heading: { fontSize: 18, fontWeight: 'bold', marginBottom: 10 },
  noteItem: { backgroundColor: '#eee', padding: 10, borderRadius: 5, marginVertical: 5 },
  noteTitle: { fontWeight: 'bold' },
  noteDate: { fontSize: 12, color: 'gray', marginBottom: 4 }
});