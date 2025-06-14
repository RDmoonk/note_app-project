// src/components/Form.tsx
import React, { useState } from 'react';
import { View, Text, TextInput, Button, SectionList, TouchableOpacity, Alert, StyleSheet } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function Form() {
  const [title, setTitle] = useState('');
  const [note, setNote] = useState('');
  const [selectedImportance, setSelectedImportance] = useState('');

  const importanceData = [
    {
      title: "Importance Level",
      data: ["Important", "Normal", "Just in case"]
    }
  ];

  const saveNote = async () => {
    try {
      const newNote = { title, note, importance: selectedImportance };
      const existingNotesJSON = await AsyncStorage.getItem('notes');
      const existingNotes = existingNotesJSON ? JSON.parse(existingNotesJSON) : [];

      const updatedNotes = [...existingNotes, newNote];
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

    await saveNote();

    // Reset
    setTitle('');
    setNote('');
    setSelectedImportance('');
    Alert.alert('Succès', 'Note enregistrée localement.');
  };

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
