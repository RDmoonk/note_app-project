import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, SectionList, TouchableOpacity } from 'react-native';
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

  useEffect(() => {
    loadNotes();
  }, []);

  const importanceColor = (importance: string) => {
    switch(importance){
     case 'Important':
      return{backgroundColor: '#f45b69'};
      case 'Normal':
        return {backgroundColor:'#114b5f'};
        case 'Just in case':
        return {backgroundColor: '#7ee4ec'};
        // this default is a fallback just in case
        default:
          return {backgroundColor: '#fff'};
    }
  };

  

  return (
  <View style={styles.container}>
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
        {/* section has been used so there is no problem with the nesting  */}
        <SectionList
          sections={[{ title: 'Saved notes', data: notes }]}
          keyExtractor={(item, index) => item.id.toString() || index.toString()}
          renderSectionHeader={({ section: { title } }) => (
            <Text style={styles.heading}>{title}</Text>
          )}
          renderItem={({ item }) => (
            <View style={styles.noteItem}>
              <Text style={styles.noteTitle}>{item.title}</Text>

              {/* Badge d'importance */}
              <View style={[styles.importanceBadge, importanceColor(item.importance)]}>
                <Text style={styles.importanceText}>{item.importance}</Text>
              </View>

              <Text style={styles.noteDate}>{item.date}</Text>
              <Text numberOfLines={2} ellipsizeMode="tail">{item.note}</Text>

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

// The css of the page using StyleSheet
const styles = StyleSheet.create({
  container: {     padding: 20,
    backgroundColor: '#456990',
    flex: 1, },
 
    heading: {   fontFamily: 'Montserrat',
    fontSize: 24,
    color: '#7ee4ec',
    fontWeight: 'bold',
    marginBottom: 20, },

  noteItem: {  backgroundColor: '#ffd4ca',
    padding: 15,
    borderRadius: 10,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 5, },
  noteTitle: {   fontFamily: 'Montserrat',
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 8, },
  noteDate: {     fontFamily: 'Montserrat',
    fontSize: 14,
    color: '#333', },

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

AddNoteButton:{
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