import { View, Text, StyleSheet, TouchableOpacity, SectionList } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

/**
 * NoteDetails component displays the details of a single note.
 * Allows the user to view, edit, or delete the note.
 */
const NoteDetails = () => {
  const { id } = useLocalSearchParams(); // Retrieves the note ID from the route parameters
  const router = useRouter(); // Navigation object
  const [note, setNote] = useState<any>(null); // State to hold the note details

  /**
   * Fetches the note from AsyncStorage using the ID passed in route params.
   * Runs once when the component is mounted or when the ID changes.
   */
  useEffect(() => {
    const fetchNote = async () => {
      const notesJSON = await AsyncStorage.getItem('notes'); // Get stored notes
      const notes = notesJSON ? JSON.parse(notesJSON) : [];  // Parse or initialize
      const foundNote = notes.find((n: any) => n.id == id);  // Find the note with the given ID
      setNote(foundNote); // Set the found note to state
    };
    fetchNote();
  }, [id]);

  /**
   * Deletes the current note and navigates back to the main screen.
   * It filters out the note with the matching ID and updates storage.
   */
  const handleDelete = async () => {
    const notesJSON = await AsyncStorage.getItem('notes');
    const notes = notesJSON ? JSON.parse(notesJSON) : [];
    const filtered = notes.filter((n: any) => n.id != id); // Remove the selected note
    await AsyncStorage.setItem('notes', JSON.stringify(filtered)); // Save new list
    router.replace('/'); // Navigate to the main screen
  };

  // Show a loading message while note is being fetched
  if (!note) return <Text style={styles.loading}>Chargement...</Text>;

  return (
    <View style={styles.container}>
      {/* Using SectionList for flexible rendering and to avoid nesting issues */}
      <SectionList
        sections={[
          {
            title: 'NoteDetails',
            data: [note]
          }
        ]}
        keyExtractor={(item, index) => item.id?.toString() || index.toString()}
        renderItem={({ item }) => (
          <View>
            <Text style={styles.title}>{item.title}</Text>
            <Text style={styles.date}>{item.date}</Text>
            <Text style={styles.importance}>Priority : {item.importance}</Text>
            <Text style={styles.body}>{item.note}</Text>

            <View style={styles.buttonContainer}>
              {/* Edit button navigates to the form with the note data as parameters */}
              <TouchableOpacity
                style={styles.editButton}
                onPress={() =>
                  router.push({
                    pathname: '/form',
                    params: {
                      id: item.id.toString(),
                      title: item.title,
                      note: item.note,
                      importance: item.importance,
                    },
                  })
                }
              >
                <Text style={styles.editButtonText}>Edit</Text>
              </TouchableOpacity>
              
              {/* Delete button triggers the handleDelete function */}
              <TouchableOpacity style={styles.deleteButton} onPress={handleDelete}>
                <Text style={styles.deleteButtonText}>Delete</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
        renderSectionHeader={() => null} // No visible section header
      />
    </View>
  );
};

export default NoteDetails;

// Styles for the NoteDetails screen
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#114b5f',
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontFamily: 'Montserrat',
    fontWeight: 'bold',
    color: '#7ee4ec',
    marginBottom: 10,
  },
  date: {
    fontSize: 14,
    fontFamily: 'Montserrat',
    color: '#ffd4ca',
    marginBottom: 10,
  },
  importance: {
    fontSize: 16,
    fontFamily: 'Montserrat',
    color: '#f45b69',
    fontStyle: 'italic',
    marginBottom: 15,
  },
  body: {
    fontSize: 16,
    fontFamily: 'Montserrat',
    color: '#ffffff',
    backgroundColor: '#456990',
    padding: 15,
    borderRadius: 10,
    marginBottom: 30,
  },
  buttonContainer: {
    gap: 10,
  },
  loading: {
    color: '#fff',
    fontFamily: 'Montserrat',
    padding: 20,
  },
  editButton: {
    backgroundColor: '#7ee4ec',
    padding: 12,
    borderRadius: 10,
    alignItems: 'center',
    marginBottom: 10,
  },
  editButtonText: {
    fontFamily: 'Montserrat',
    color: '#114b5f',
    fontWeight: '600',
  },
  deleteButton: {
    backgroundColor: '#f45b69',
    padding: 12,
    borderRadius: 10,
    alignItems: 'center',
  },
  deleteButtonText: {
    fontFamily: 'Montserrat',
    color: '#fff',
    fontWeight: '600',
  },
});
