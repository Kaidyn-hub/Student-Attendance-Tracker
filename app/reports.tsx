import { useRouter } from 'expo-router';
import { Button, FlatList, StyleSheet, Text, View } from 'react-native';
import { useAttendance } from '../hooks/useAttendance';
import { useStudents } from '../hooks/useStudents';

export default function Reports() {
  const { students } = useStudents();
  const { attendance } = useAttendance();
  const router = useRouter();

  const getAttendanceRate = (studentId: string) => {
    const studentAtt = attendance.filter(a => a.studentId === studentId);
    const total = studentAtt.length;
    const present = studentAtt.filter(a => a.status === 'present').length;
    return total > 0 ? ((present / total) * 100).toFixed(2) : '0.00';
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Attendance Reports</Text>
      <View style={styles.navButtons}>
        <Button title="Students" onPress={() => router.push('/students')} />
        <Button title="Attendance" onPress={() => router.push('/attendance')} />
        <Button title="Logout" onPress={() => router.replace('/login')} />
      </View>
      <FlatList
        data={students}
        keyExtractor={item => item.id}
        renderItem={({ item }) => (
          <View style={styles.studentReport}>
            <Text style={styles.studentName}>{item.name} ({item.rollNumber})</Text>
            <Text>Attendance Rate: {getAttendanceRate(item.id)}%</Text>
          </View>
        )}
      />
      <Text style={styles.subtitle}>All Attendance Records</Text>
      <FlatList
        data={attendance}
        keyExtractor={item => item.id}
        renderItem={({ item }) => {
          const student = students.find(s => s.id === item.studentId);
          return (
            <View style={styles.record}>
              <Text>{student?.name} - {item.date} - {item.status}</Text>
            </View>
          );
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  title: { fontSize: 24, marginBottom: 20, textAlign: 'center' },
  subtitle: { fontSize: 18, marginTop: 20, marginBottom: 10 },
  navButtons: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 20,
  },
  studentReport: { marginBottom: 10, padding: 10, backgroundColor: '#f0f0f0', borderRadius: 5 },
  studentName: { fontWeight: 'bold' },
  record: { marginBottom: 5, padding: 5, backgroundColor: '#e0e0e0', borderRadius: 3 },
});
