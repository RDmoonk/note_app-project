import { View, Text, StyleSheet, ScrollView, TouchableOpacity, SectionList } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

const NoteDetails = () => {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const [note, setNote] = useState<any>(null);

  
  useEffect(() => {
    const fetchNote = async () => {
      const notesJSON = await AsyncStorage.getItem('notes');
      const notes = notesJSON ? JSON.parse(notesJSON) : [];
      const foundNote = notes.find((n: any) => n.id == id);
      setNote(foundNote);
    };
    fetchNote();
  }, [id]);

  // the delete logic, it takes the id of the notes, delete it and then it take you back to the main page
  const handleDelete = async () => {
    const notesJSON = await AsyncStorage.getItem('notes');
    const notes = notesJSON ? JSON.parse(notesJSON) : [];
    const filtered = notes.filter((n: any) => n.id != id);
    await AsyncStorage.setItem('notes', JSON.stringify(filtered));
    router.replace('/');
  };

  // This if is used if there is no notes in the storage
  if (!note) return <Text style={styles.loading}>Chargement...</Text>;

  return (
    <View style={styles.container}>
      {/* section has been used so there is no problem with the nesting  */}
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
        <Text style={styles.importance}>Importance : {item.importance}</Text>
        <Text style={styles.body}>{item.note}</Text>

        <View style={styles.buttonContainer}>
          {/* touchableOpacity is used to give more personality to the buttons while it can handle the logic for the editing */}
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
            
          <TouchableOpacity style={styles.deleteButton} onPress={handleDelete}>
            <Text style={styles.deleteButtonText}>Delete</Text>
          </TouchableOpacity>
        </View>
      </View>
    )}
    renderSectionHeader={() => null}
  />
</View>
  );
};

export default NoteDetails;


// The css of the page using StyleSheet
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
