import AsyncStorage from '@react-native-async-storage/async-storage';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { Alert, SectionList, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';

/**
 * Form component allowing users to add or edit notes.
 * Notes include a title, content, and an importance level.
 * Data is persisted locally using AsyncStorage.
 */
export default function Form() {
  // States for form inputs
  const [title, setTitle] = useState('');
  const [note, setNote] = useState('');
  const [selectedImportance, setSelectedImportance] = useState('');
  const [editId, setEditId] = useState<number | null>(null);

  // Navigation hooks
  const router = useRouter();
  const params = useLocalSearchParams();
  const { id, title: paramTitle, note: paramNote, importance: paramImportance } = useLocalSearchParams();

  /**
   * Submits the form.
   * - Validates that all fields are filled.
   * - If `id` is provided, updates an existing note.
   * - Otherwise, creates a new note.
   * - Saves notes in AsyncStorage and redirects to home.
   */
  const handleSubmit = async () => {
    if (!title || !note || !selectedImportance) {
      Alert.alert('Error', 'Enter the areas');
      return;
    } else {
      Alert.alert('The note has been saved');
    }

    // Fetch existing notes from AsyncStorage
    const existingNotesJSON = await AsyncStorage.getItem('notes');
    const existingNotes = existingNotesJSON ? JSON.parse(existingNotesJSON) : [];

    let updatedNotes;

    if (id) {
      // Update existing note
      updatedNotes = existingNotes.map((n: any) =>
        n.id == id ? { ...n, title, note, importance: selectedImportance } : n
      );
    } else {
      // Create a new note
      const newNote = {
        id: Date.now(),
        title,
        note,
        importance: selectedImportance,
        date: new Date().toLocaleString()
      };
      updatedNotes = [...existingNotes, newNote];
    }

    // Save updated notes to AsyncStorage
    await AsyncStorage.setItem('notes', JSON.stringify(updatedNotes));

    // Reset form and redirect
    setTitle('');
    setNote('');
    setSelectedImportance('');
    router.push('/');
  };

  // Data for the importance section list
  const importanceData = [
    {
      title: "Importance Level",
      data: ["Important", "Normal", "Just in case"]
    }
  ];

  /**
   * Populates the form fields when editing an existing note.
   */
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
        numberOfLines={5}
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

      <TouchableOpacity onPress={handleSubmit} style={styles.saveButton}>
        <Text>Save</Text>
      </TouchableOpacity>
    </View>
  );
}

// Styles used in the form screen
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#114b5f',
    padding: 20,
  },
  label: {
    fontFamily: 'Montserrat',
    fontSize: 16,
    color: '#ffd4ca',
    marginTop: 15,
    marginBottom: 5,
  },
  input: {
    borderWidth: 1,
    borderColor: '#7ee4ec',
    borderRadius: 10,
    padding: 20,
    fontSize: 14,
    fontFamily: 'Montserrat',
    backgroundColor: '#ffffff',
    color: '#000',
    marginBottom: 10,
  },
  textInput: {
    borderWidth: 1,
    borderColor: '#7ee4ec',
    borderRadius: 10,
    fontSize: 14,
    fontFamily: 'Montserrat',
    backgroundColor: '#ffffff',
    color: '#000',
    textAlignVertical: 'top',
    marginBottom: 15,
  },
  sectionHeader: {
    fontFamily: 'Montserrat',
    fontSize: 16,
    color: '#f45b69',
    fontWeight: 'bold',
    marginTop: 20,
    marginBottom: 8,
  },
  importanceItem: {
    padding: 10,
    backgroundColor: '#456990',
    marginVertical: 4,
    borderRadius: 8,
    fontFamily: 'Montserrat',
    color: '#fff',
    margin: 7
  },
  selectedImportance: {
    backgroundColor: '#7ee4ec',
    color: '#114b5f',
    fontWeight: 'bold',
  },
  saveButton: {
    backgroundColor: '#f45b69',
    padding: 15,
    borderRadius: 10,
    marginTop: 20,
    alignItems: 'center',
    margin: 10
  },
  saveButtonText: {
    fontFamily: 'Montserrat',
    fontSize: 16,
    color: '#fff',
    fontWeight: '600',
  }
});
