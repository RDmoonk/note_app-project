import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, Button, SectionList, TouchableOpacity, Alert, StyleSheet } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter, useLocalSearchParams } from 'expo-router';


export default function Form() {
  const [title, setTitle] = useState('');
  const [note, setNote] = useState('');
  const [selectedImportance, setSelectedImportance] = useState('');
  const [editId, setEditId] = useState<number | null>(null);

  const router = useRouter();
  const params = useLocalSearchParams();
  const { id, title: paramTitle, note: paramNote, importance: paramImportance } = useLocalSearchParams();


// const handleSubmit qui va, à l'aide de async storage, d'abord envoyé une alerte d'erreur si aucun champ n'est rempli
  const handleSubmit = async () => {
  if (!title || !note || !selectedImportance) {
    Alert.alert('Error', 'Enter the areas');
    return; 
  } else{
    Alert.alert('The note has been saved')
  }

  const existingNotesJSON = await AsyncStorage.getItem('notes');
  const existingNotes = existingNotesJSON ? JSON.parse(existingNotesJSON) : [];

  let updatedNotes;

  if (id) {
    // Modifier la note existante
    updatedNotes = existingNotes.map((n: any) =>
      n.id == id ? { ...n, title, note, importance: selectedImportance } : n
    );
  } else {
    // Ajouter une nouvelle note
    const newNote = {
      id: Date.now(),
      title,
      note,
      importance: selectedImportance,
      date: new Date().toLocaleString()
    };
    updatedNotes = [...existingNotes, newNote];
  }

  await AsyncStorage.setItem('notes', JSON.stringify(updatedNotes));

  // Reset
  setTitle('');
  setNote('');
  setSelectedImportance('');
  router.push('/');
};


  const importanceData = [
    {
      title: "Importance Level",
      data: ["Important", "Normal", "Just in case"]
    }
  ];

    useEffect(() => {
  if (id && paramTitle && paramNote && paramImportance) {
    setTitle(paramTitle as string);
    setNote(paramNote as string);
    setSelectedImportance(paramImportance as string);
  }
}, [id, paramTitle, paramNote, paramImportance]);

  return (
    <View>
      <Text>Titre :</Text>
      <TextInput style={styles.input} onChangeText={setTitle} value={title} />

      <Text>Contenu :</Text>
      <TextInput
        style={styles.textInput}
        onChangeText={setNote}
        value={note}
        multiline
      />

      <Text>Importance :</Text>
      <SectionList
        sections={importanceData}
        keyExtractor={(item, index) => item + index}
        renderItem={({ item }) => (
          <TouchableOpacity onPress={() => setSelectedImportance(item)}>
            <Text style={[
              styles.importanceItem,
              selectedImportance === item && styles.selectedImportance
            ]}>{item}</Text>
          </TouchableOpacity>
        )}
        renderSectionHeader={({ section: { title } }) => (
          <Text style={styles.sectionHeader}>{title}</Text>
        )}
      />

      <Button title="Enregistrer" onPress={handleSubmit} />
    </View>
  );
}

const styles = StyleSheet.create({
  input: { margin: 10, borderWidth: 1, padding: 10 },
  textInput: { margin: 10, borderWidth: 1, padding: 10, minHeight: 100 },
  importanceItem: { padding: 10, backgroundColor: '#eee', marginVertical: 4 },
  selectedImportance: { backgroundColor: '#add8e6' },
  sectionHeader: { fontWeight: 'bold', marginTop: 10 }
});