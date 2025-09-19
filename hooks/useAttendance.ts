import AsyncStorage from '@react-native-async-storage/async-storage';
import { useEffect, useState } from 'react';
import { Attendance } from '../types';

const STORAGE_KEY = 'attendance';

export const useAttendance = () => {
  const [attendance, setAttendance] = useState<Attendance[]>([]);

  useEffect(() => {
    loadAttendance();
  }, []);

  const loadAttendance = async () => {
    try {
      const data = await AsyncStorage.getItem(STORAGE_KEY);
      if (data) {
        setAttendance(JSON.parse(data));
      }
    } catch (error) {
      console.error('Error loading attendance:', error);
    }
  };

  const saveAttendance = async (newAttendance: Attendance[]) => {
    try {
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(newAttendance));
      setAttendance(newAttendance);
    } catch (error) {
      console.error('Error saving attendance:', error);
    }
  };

  const addAttendance = async (att: Omit<Attendance, 'id'>) => {
    const newAtt: Attendance = { ...att, id: Date.now().toString() };
    const newList = [...attendance, newAtt];
    await saveAttendance(newList);
  };

  const updateAttendance = async (id: string, updated: Partial<Attendance>) => {
    const newList = attendance.map(a => a.id === id ? { ...a, ...updated } : a);
    await saveAttendance(newList);
  };

  const deleteAttendance = async (id: string) => {
    const newList = attendance.filter(a => a.id !== id);
    await saveAttendance(newList);
  };

  const getAttendanceByStudent = (studentId: string) => {
    return attendance.filter(a => a.studentId === studentId);
  };

  return { attendance, addAttendance, updateAttendance, deleteAttendance, getAttendanceByStudent };
};
