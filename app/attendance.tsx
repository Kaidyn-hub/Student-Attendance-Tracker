import { useRouter } from 'expo-router';
import { useState } from 'react';
import { Alert, Button, FlatList, StyleSheet, Text, View } from 'react-native';
import { useAttendance } from '../hooks/useAttendance';
import { useStudents } from '../hooks/useStudents';

export default function Attendance() {
  const { students } = useStudents();
  const { attendance, addAttendance, getAttendanceByStudent } = useAttendance();
  const [today] = useState(new Date().toISOString().split('T')[0]);
  const router = useRouter();

  const markAttendance = async (studentId: string, status: 'present' | 'absent') => {
    const existing = attendance.find(a => a.studentId === studentId && a.date === today);
    if (existing) {
      Alert.alert('Attendance already marked for today');
      return;
    }
    await addAttendance({ studentId, date: today, status });
  };

  const getStatus = (studentId: string) => {
    const att = attendance.find(a => a.studentId === studentId && a.date === today);
    return att ? att.status : null;
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Mark Attendance for {today}</Text>
      <View style={styles.navButtons}>
        <Button title="Students" onPress={() => router.push('/students')} />
        <Button title="Reports" onPress={() => router.push('/reports')} />
        <Button title="Logout" onPress={() => router.replace('/login')} />
      </View>
      <FlatList
        data={students}
        keyExtractor={item => item.id}
        renderItem={({ item }) => {
          const status = getStatus(item.id);
          return (
            <View style={styles.studentItem}>
              <Text>{item.name} ({item.rollNumber})</Text>
              {status ? (
                <Text style={status === 'present' ? styles.present : styles.absent}>
                  {status.toUpperCase()}
                </Text>
              ) : (
                <View style={styles.buttons}>
                  <Button
                    title="Present"
                    onPress={() => markAttendance(item.id, 'present')}
                    color="green"
                  />
                  <Button
                    title="Absent"
                    onPress={() => markAttendance(item.id, 'absent')}
                    color="red"
                  />
                </View>
              )}
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
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  title: { fontSize: 24, marginBottom: 20, textAlign: 'center' },
  studentItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  buttons: { flexDirection: 'row', gap: 10 },
  present: { color: 'green', fontWeight: 'bold' },
  absent: { color: 'red', fontWeight: 'bold' },
  bottomNav: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 60,
    backgroundColor: '#f8f8f8',
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: '#ddd',
  },
  navButtons: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 20,
  },
});
