// src/components/Form.tsx
import React, { useState } from 'react';
import { View, Text, TextInput, Button, SectionList, TouchableOpacity, Alert, StyleSheet } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useEffect } from 'react';



export default function Form() {
  const [title, setTitle] = useState('');
  const [note, setNote] = useState('');
  const [selectedImportance, setSelectedImportance] = useState('');
  const [editId, setEditId] = useState<number | null>(null);

  const params = useLocalSearchParams();
const router = useRouter();

  const importanceData = [
    {
      title: "Importance Level",
      data: ["Important", "Normal", "Just in case"]
    }
  ];

const saveNote = async (newNote: any) => {
  try {
    const existingNotesJSON = await AsyncStorage.getItem('notes');
    const existingNotes = existingNotesJSON ? JSON.parse(existingNotesJSON) : [];

    const updatedNotes = newNote.id
      ? existingNotes.map((n: any) => (n.id === newNote.id ? newNote : n))
      : [...existingNotes, newNote];

    await AsyncStorage.setItem('notes', JSON.stringify(updatedNotes));
  } catch (error) {
    Alert.alert('Erreur', 'Impossible de sauvegarder la note.');
  }
};

 const handleSubmit = async () => {
  if (!title || !note || !selectedImportance) {
    Alert.alert('Erreur', 'Veuillez remplir tous les champs');
    return;
  }

  const newNote = {
    id: editId || Date.now(),
    title,
    note,
    importance: selectedImportance,
  };

  try {
    const notesJSON = await AsyncStorage.getItem('notes');
    const savedNotes = notesJSON ? JSON.parse(notesJSON) : [];

    const updatedNotes = editId
      ? savedNotes.map((n: any) => (n.id === editId ? newNote : n))
      : [...savedNotes, newNote];

    await AsyncStorage.setItem('notes', JSON.stringify(updatedNotes));

    setTitle('');
    setNote('');
    setSelectedImportance('');
    setEditId(null);

    Alert.alert('Succès', 'Note enregistrée.');
    router.push('/index'); // retour
  } catch (error) {
    Alert.alert('Erreur', 'Échec de la sauvegarde.');
  }
};

  useEffect(() => {
    if (params?.id){
        setTitle(params.title as string);
    setNote(params.note as string);
    setSelectedImportance(params.importance as string);
    setEditId(Number(params.id));
    }
  }, [params])

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
