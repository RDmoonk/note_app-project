import { View, Text, Button, StyleSheet, Alert } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';


const NoteDetails = () => {
    const {id} = useLocalSearchParams();
    const router = useRouter();
    const [note, setNote] = useState<any>(null);

    useEffect(() => {
        const fetchNote = async() => {
            const notesJSON = await AsyncStorage.getItem('notes');
            const notes = notesJSON ? JSON.parse(notesJSON) : [];
            const foundNote = notes.find((n: any) => n.id == id);
            setNote(foundNote);
        };fetchNote();
    }, [id]);



      // logique de suppression, en prenant l'id (qui est un nombre) de la note en paramètre, cela permet de update la note pour ensuite la supprimer
  const handleDelete = async () => {
    const notesJSON = await AsyncStorage.getItem('notes');
    const notes = notesJSON ? JSON.parse(notesJSON) : [];
    const filtered = notes.filter((n: any) => n.id != id);
    await AsyncStorage.setItem('notes',JSON.stringify(filtered));
    router.replace('/');
  };

  if(!note) return <Text>Chargement...</Text>


  return (
    <View style={styles.container}>
        <Text style={styles.title}>{note.title}</Text>
        <Text>{note.date}</Text>
        <Text style={styles.importance}>Importance: {note.importance}</Text>
        <Text style={styles.body} >{note.note}</Text>

       <Button
            title='Edit'
            onPress={() => router.push({
            pathname: '/form',
            params: {
            id: note.id.toString(),
            title: note.title,
            note: note.note,
             importance: note.importance}})}
                    />
        <Button title='Delete' color="red" onPress={handleDelete}/>
    </View>
  );
}

export default NoteDetails

const styles = StyleSheet.create({
     container: { padding: 20 },
  title: { fontSize: 22, fontWeight: 'bold', marginBottom: 10 },
  date: { color: '#888', marginBottom: 10 },
  importance: { fontStyle: 'italic', marginBottom: 10 },
  body: { fontSize: 16, marginBottom: 20 }
})