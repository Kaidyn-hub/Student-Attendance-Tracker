import AsyncStorage from '@react-native-async-storage/async-storage';
import { useEffect, useState } from 'react';
import { Student } from '../types';

const STORAGE_KEY = 'students';

export const useStudents = () => {
  const [students, setStudents] = useState<Student[]>([]);

  useEffect(() => {
    loadStudents();
  }, []);

  const loadStudents = async () => {
    try {
      const data = await AsyncStorage.getItem(STORAGE_KEY);
      if (data) {
        setStudents(JSON.parse(data));
      }
    } catch (error) {
      console.error('Error loading students:', error);
    }
  };

  const saveStudents = async (newStudents: Student[]) => {
    try {
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(newStudents));
      setStudents(newStudents);
    } catch (error) {
      console.error('Error saving students:', error);
    }
  };

  const addStudent = async (student: Omit<Student, 'id'>) => {
    const newStudent: Student = { ...student, id: Date.now().toString() };
    const newList = [...students, newStudent];
    await saveStudents(newList);
  };

  const updateStudent = async (id: string, updated: Partial<Student>) => {
    const newList = students.map(s => s.id === id ? { ...s, ...updated } : s);
    await saveStudents(newList);
  };

  const deleteStudent = async (id: string) => {
    const newList = students.filter(s => s.id !== id);
    await saveStudents(newList);
  };

  return { students, addStudent, updateStudent, deleteStudent };
};
