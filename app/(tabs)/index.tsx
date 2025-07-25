import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, SectionList, TouchableOpacity } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';

// Type definition for a single Note object
type Note = {
  id: number;
  title: string;
  note: string;
  importance: string;
  date: string;
};

// Main screen component that displays a list of saved notes
export default function NotePage() {
  const [notes, setNotes] = useState<Note[]>([]); // Holds notes from AsyncStorage
  const router = useRouter(); // Navigation object

  // Load notes from AsyncStorage when component mounts
  const loadNotes = async () => {
    try {
      const notesJSON = await AsyncStorage.getItem('notes'); // Get JSON string
      const savedNotes = notesJSON ? JSON.parse(notesJSON) : []; // Parse to array
      setNotes(savedNotes); // Update state
    } catch (error) {
      console.log('Erreur de lecture des notes', error); // Log any errors
    }
  };

  useEffect(() => {
    loadNotes(); // Load notes on initial mount
  }, []);

  // Determine badge background color based on importance level
  const importanceColor = (importance: string) => {
    switch (importance) {
      case 'Important':
        return { backgroundColor: '#f45b69' };
      case 'Normal':
        return { backgroundColor: '#114b5f' };
      case 'Just in case':
        return { backgroundColor: '#7ee4ec' };
      // Fallback color
      default:
        return { backgroundColor: '#fff' };
    }
  };

  return (
    <View style={styles.container}>
      {/* If no notes are saved, show empty message and "Add a note" button */}
      {notes.length === 0 ? (
        <>
          <Text style={styles.emptyMessage}>There is no notes yet</Text>
          <TouchableOpacity
            onPress={() => router.push("/form")}
            style={styles.AddNoteButton}
          >
            <Text>Add a note</Text>
          </TouchableOpacity>
        </>
      ) : (
        <>
          {/* SectionList handles rendering of note entries */}
          <SectionList
            sections={[{ title: 'Saved notes', data: notes }]}
            keyExtractor={(item, index) => item.id.toString() || index.toString()}
            renderSectionHeader={({ section: { title } }) => (
              <Text style={styles.heading}>{title}</Text>
            )}
            renderItem={({ item }) => (
              <View style={styles.noteItem}>
                <Text style={styles.noteTitle}>{item.title}</Text>

                {/* Importance level badge */}
                <View style={[styles.importanceBadge, importanceColor(item.importance)]}>
                  <Text style={styles.importanceText}>{item.importance}</Text>
                </View>

                <Text style={styles.noteDate}>{item.date}</Text>
                <Text numberOfLines={2} ellipsizeMode="tail">{item.note}</Text>

                {/* Navigate to detailed view */}
                <TouchableOpacity
                  onPress={() =>
                    router.push({ pathname: '/noteDetails', params: { id: item.id.toString() } })
                  }
                  style={styles.seeMoreButton}
                >
                  <Text>See More...</Text>
                </TouchableOpacity>
              </View>
            )}
            // Footer shows another "Add a note" button
            ListFooterComponent={() => (
              <TouchableOpacity
                onPress={() => router.push("/form")}
                style={styles.AddNoteButton}
              >
                <Text>Add a note</Text>
              </TouchableOpacity>
            )}
          />
        </>
      )}
    </View>
  );
}

// Styles for the main note listing screen
const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: '#456990',
    flex: 1,
  },
  heading: {
    fontFamily: 'Montserrat',
    fontSize: 24,
    color: '#7ee4ec',
    fontWeight: 'bold',
    marginBottom: 20,
  },
  noteItem: {
    backgroundColor: '#ffd4ca',
    padding: 15,
    borderRadius: 10,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 5,
  },
  noteTitle: {
    fontFamily: 'Montserrat',
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 8,
  },
  noteDate: {
    fontFamily: 'Montserrat',
    fontSize: 14,
    color: '#333',
  },
  buttonPrimary: {
    backgroundColor: '#7ee4ec',
    padding: 12,
    borderRadius: 10,
    alignItems: 'center',
    marginVertical: 5,
  },
  buttonPrimaryText: {
    fontFamily: 'Montserrat',
    color: '#114b5f',
    fontWeight: '600',
  },
  buttonDanger: {
    backgroundColor: '#f45b69',
    padding: 12,
    borderRadius: 10,
    alignItems: 'center',
    marginVertical: 5,
  },
  buttonDangerText: {
    fontFamily: 'Montserrat',
    color: '#fff',
    fontWeight: '600',
  },
  seeMoreButton: {
    backgroundColor: '#fa9e8a',
    padding: 12,
    marginTop: 5,
    borderRadius: 10,
    alignItems: 'center',
    marginBottom: 10,
  },
  AddNoteButton: {
    backgroundColor: '#7ee4ec',
    padding: 12,
    marginTop: 5,
    borderRadius: 10,
    alignItems: 'center',
    marginBottom: 10,
  },
  noteHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  importanceBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  importanceText: {
    fontFamily: 'Montserrat',
    fontSize: 12,
    fontWeight: 'bold',
  },
  emptyMessage: {
    fontFamily: 'Montserrat',
    fontSize: 18,
    color: '#fff',
    textAlign: 'center',
    marginTop: 50,
  },
});
