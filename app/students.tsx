import { useRouter } from 'expo-router';
import { useState } from 'react';
import { Alert, Button, FlatList, StyleSheet, Text, TextInput, View } from 'react-native';
import { useStudents } from '../hooks/useStudents';

export default function Students() {
  const { students, addStudent, updateStudent, deleteStudent } = useStudents();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [rollNumber, setRollNumber] = useState('');
  const [editingId, setEditingId] = useState<string | null>(null);
  const router = useRouter();

  const handleAddOrUpdate = async () => {
    if (!name || !email || !rollNumber) {
      Alert.alert('Please fill all fields');
      return;
    }
    if (editingId) {
      await updateStudent(editingId, { name, email, rollNumber });
      setEditingId(null);
    } else {
      await addStudent({ name, email, rollNumber });
    }
    setName('');
    setEmail('');
    setRollNumber('');
  };

  const handleEdit = (id: string) => {
    const student = students.find(s => s.id === id);
    if (student) {
      setName(student.name);
      setEmail(student.email);
      setRollNumber(student.rollNumber);
      setEditingId(id);
    }
  };

  const handleDelete = async (id: string) => {
    await deleteStudent(id);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Students</Text>
      <View style={styles.navButtons}>
        <Button title="Attendance" onPress={() => router.push('/attendance')} />
        <Button title="Reports" onPress={() => router.push('/reports')} />
        <Button title="Logout" onPress={() => router.replace('/login')} />
      </View>
      <TextInput
        placeholder="Name"
        value={name}
        onChangeText={setName}
        style={styles.input}
      />
      <TextInput
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        style={styles.input}
        keyboardType="email-address"
      />
      <TextInput
        placeholder="Roll Number"
        value={rollNumber}
        onChangeText={setRollNumber}
        style={styles.input}
      />
      <Button
        title={editingId ? 'Update Student' : 'Add Student'}
        onPress={handleAddOrUpdate}
      />
      <FlatList
        data={students}
        keyExtractor={item => item.id}
        renderItem={({ item }) => (
          <View style={styles.studentItem}>
            <Text>{item.name} ({item.rollNumber})</Text>
            <View style={styles.buttons}>
              <Button title="Edit" onPress={() => handleEdit(item.id)} />
              <Button title="Delete" onPress={() => handleDelete(item.id)} color="red" />
            </View>
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  title: { fontSize: 24, marginBottom: 20, textAlign: 'center' },
  input: { borderWidth: 1, padding: 10, marginBottom: 10, borderRadius: 5 },
  studentItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  buttons: { flexDirection: 'row', gap: 10, marginTop: 5 },
  navButtons: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 20,
  },
});
