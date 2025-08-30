import React, { useEffect, useState, useRef } from "react";
import {
  View, Text, StyleSheet, ScrollView, ActivityIndicator, Alert, Dimensions,
  TouchableOpacity, TextInput,
} from "react-native";
import { Table, Row } from "react-native-table-component";
import Orientation from "react-native-orientation-locker";

// --- Config ---
const BACKEND_URL = "http://192.168.1.211:5000";
const widthArr = [80, 60, 100, 80, 60, 60, 200, 90, 120, 100, 80, 80];

export default function StudentDatabaseScreen() {
  const [tableHead] = useState([
    'Class', 'Roll No', 'Name', 'Attendance', 'Present', 'Absent', 'Subjects', 'Percentage',
    'Class Teacher', 'Total Fees', 'Fees Paid', 'Fees Due'
  ]);
  const [tableData, setTableData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [addingRow, setAddingRow] = useState(false);
  const [newRow, setNewRow] = useState({
    studentClass: '', rollNo: '', studentName: '', attendance: '', present: '', absent: '', subjects: '',
    percentage: '', classTeacher: '', totalFees: '', feesPaid: '', feesDue: '',
  });

  // Input refs for navigation
  const firstInputRef = useRef(null);
  const rollNoRef = useRef(null);
  const nameRef = useRef(null);
  const attendanceRef = useRef(null);
  const presentRef = useRef(null);
  const absentRef = useRef(null);
  const subjectsRef = useRef(null);
  const percentageRef = useRef(null);
  const classTeacherRef = useRef(null);
  const totalFeesRef = useRef(null);
  const feesPaidRef = useRef(null);
  const feesDueRef = useRef(null);

  useEffect(() => {
    // Enable auto rotate for the screen
    Orientation.unlockAllOrientations();
    return () => {
      // (Optional) Lock to portrait, landscape, etc. when leaving this screen
    };
  }, []);

  useEffect(() => { fetchStudents(); }, []);
  useEffect(() => {
    if (addingRow && firstInputRef.current && typeof firstInputRef.current.focus === "function") {
      firstInputRef.current.focus();
    }
  }, [addingRow]);

  const fetchStudents = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${BACKEND_URL}/api/students`);
      const students = await res.json();
      const rows = students.sort((a, b) => {
        if (a.studentClass !== b.studentClass)
          return a.studentClass.localeCompare(b.studentClass);
        return (parseInt(a.rollNo) || 0) - (parseInt(b.rollNo) || 0);
      }).map(s => ([
        s.studentClass, s.rollNo, s.studentName, s.attendance, s.present || '', s.absent || '',
        (s.subjects || []).map(sub => `${sub.name}:${sub.score}/${sub.max}`).join('\n'),
        s.percentage, s.classTeacher, s.totalFees, s.feesPaid, s.feesDue,
      ]));
      setTableData(rows);
    } catch (e) {
      Alert.alert('Error', 'Failed to fetch students: ' + e.message);
    }
    setLoading(false);
  };

  const onChangeNewRow = (field, value) => {
    setNewRow(prev => ({ ...prev, [field]: value }));
  };

  const onSaveNewRow = async () => {
    if (!newRow.rollNo || !newRow.studentName || !newRow.studentClass) {
      Alert.alert("Validation Error", "Roll No, Name, and Class are required.");
      return;
    }
    try {
      const subjectsArray = newRow.subjects
        ? newRow.subjects.split(',').map(s => {
          const [nameScore, max] = s.split('/');
          const [name, score] = nameScore.split(':');
          return { name: name.trim(), score: parseInt(score.trim()), max: parseInt(max.trim()) };
        })
        : [];
      const payload = {
        rollNo: newRow.rollNo,
        studentName: newRow.studentName,
        studentClass: newRow.studentClass,
        attendance: newRow.attendance,
        present: newRow.present,
        absent: newRow.absent,
        subjects: subjectsArray,
        percentage: newRow.percentage,
        classTeacher: newRow.classTeacher,
        totalFees: newRow.totalFees,
        feesPaid: newRow.feesPaid,
        feesDue: newRow.feesDue,
      };
      const res = await fetch(`${BACKEND_URL}/api/students`, {
        method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload),
      });
      if (!res.ok) throw new Error(await res.text() || 'Failed to save student');
      await fetchStudents();
      setAddingRow(false);
      setNewRow({
        studentClass: '', rollNo: '', studentName: '', attendance: '', present: '', absent: '', subjects: '',
        percentage: '', classTeacher: '', totalFees: '', feesPaid: '', feesDue: '',
      });
    } catch (e) {
      Alert.alert("Save Error", e.message);
    }
  };

  // All input cells in a single row as before
  const renderEditableRow = () => (
    <View style={[styles.row, { backgroundColor: "#d9f2d9", flexDirection: "row", marginBottom: 0 }]}>
      <TextInput
        style={[styles.inputCell, { width: widthArr[0] }]}
        placeholder="Class"
        value={newRow.studentClass}
        onChangeText={text => onChangeNewRow("studentClass", text)}
        ref={firstInputRef}
        returnKeyType="next"
        onSubmitEditing={() => rollNoRef.current?.focus()}
        blurOnSubmit={false}
      />
      <TextInput
        style={[styles.inputCell, { width: widthArr[1] }]}
        placeholder="Roll No"
        keyboardType="numeric"
        value={newRow.rollNo}
        onChangeText={text => onChangeNewRow("rollNo", text)}
        ref={rollNoRef}
        returnKeyType="next"
        onSubmitEditing={() => nameRef.current?.focus()}
        blurOnSubmit={false}
      />
      <TextInput
        style={[styles.inputCell, { width: widthArr[2] }]}
        placeholder="Name"
        value={newRow.studentName}
        onChangeText={text => onChangeNewRow("studentName", text)}
        ref={nameRef}
        returnKeyType="next"
        onSubmitEditing={() => attendanceRef.current?.focus()}
        blurOnSubmit={false}
      />
      <TextInput
        style={[styles.inputCell, { width: widthArr[3] }]}
        placeholder="Attendance"
        value={newRow.attendance}
        onChangeText={text => onChangeNewRow("attendance", text)}
        ref={attendanceRef}
        returnKeyType="next"
        onSubmitEditing={() => presentRef.current?.focus()}
        blurOnSubmit={false}
      />
      <TextInput
        style={[styles.inputCell, { width: widthArr[4] }]}
        placeholder="Present"
        keyboardType="numeric"
        value={newRow.present}
        onChangeText={text => onChangeNewRow("present", text)}
        ref={presentRef}
        returnKeyType="next"
        onSubmitEditing={() => absentRef.current?.focus()}
        blurOnSubmit={false}
      />
      <TextInput
        style={[styles.inputCell, { width: widthArr[5] }]}
        placeholder="Absent"
        keyboardType="numeric"
        value={newRow.absent}
        onChangeText={text => onChangeNewRow("absent", text)}
        ref={absentRef}
        returnKeyType="next"
        onSubmitEditing={() => subjectsRef.current?.focus()}
        blurOnSubmit={false}
      />
      <TextInput
        style={[styles.inputCell, { width: widthArr[6] }]}
        placeholder="Subjects (ex: Math:90/100,Eng:85/100)"
        value={newRow.subjects}
        onChangeText={text => onChangeNewRow("subjects", text)}
        ref={subjectsRef}
        returnKeyType="next"
        onSubmitEditing={() => percentageRef.current?.focus()}
        blurOnSubmit={false}
      />
      <TextInput
        style={[styles.inputCell, { width: widthArr[7] }]}
        placeholder="Percentage"
        keyboardType="numeric"
        value={newRow.percentage}
        onChangeText={text => onChangeNewRow("percentage", text)}
        ref={percentageRef}
        returnKeyType="next"
        onSubmitEditing={() => classTeacherRef.current?.focus()}
        blurOnSubmit={false}
      />
      <TextInput
        style={[styles.inputCell, { width: widthArr[8] }]}
        placeholder="Class Teacher"
        value={newRow.classTeacher}
        onChangeText={text => onChangeNewRow("classTeacher", text)}
        ref={classTeacherRef}
        returnKeyType="next"
        onSubmitEditing={() => totalFeesRef.current?.focus()}
        blurOnSubmit={false}
      />
      <TextInput
        style={[styles.inputCell, { width: widthArr[9] }]}
        placeholder="Total Fees"
        keyboardType="numeric"
        value={newRow.totalFees}
        onChangeText={text => onChangeNewRow("totalFees", text)}
        ref={totalFeesRef}
        returnKeyType="next"
        onSubmitEditing={() => feesPaidRef.current?.focus()}
        blurOnSubmit={false}
      />
      <TextInput
        style={[styles.inputCell, { width: widthArr[10] }]}
        placeholder="Fees Paid"
        keyboardType="numeric"
        value={newRow.feesPaid}
        onChangeText={text => onChangeNewRow("feesPaid", text)}
        ref={feesPaidRef}
        returnKeyType="next"
        onSubmitEditing={() => feesDueRef.current?.focus()}
        blurOnSubmit={false}
      />
      <TextInput
        style={[styles.inputCell, { width: widthArr[11] }]}
        placeholder="Fees Due"
        keyboardType="numeric"
        value={newRow.feesDue}
        onChangeText={text => onChangeNewRow("feesDue", text)}
        ref={feesDueRef}
      />
    </View>
  );

  return (
    <View style={styles.container}>
      {/* Header Row with title + buttons */}
      <View style={styles.headerRow}>
        <Text style={styles.title}>Student Database </Text>
        <View style={[styles.headerButtons, { paddingRight: 15 }]}>
          <TouchableOpacity style={styles.headerBtn} onPress={() => setAddingRow(true)}>
            <Text style={styles.headerBtnText}>Add</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.headerBtn} onPress={onSaveNewRow} disabled={!addingRow}>
            <Text style={styles.headerBtnText}>Save</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.headerBtn} onPress={() => {
            setAddingRow(false);
            setNewRow({
              studentClass: '', rollNo: '', studentName: '', attendance: '', present: '', absent: '', subjects: '',
              percentage: '', classTeacher: '', totalFees: '', feesPaid: '', feesDue: '',
            });
          }} disabled={!addingRow}>
            <Text style={styles.headerBtnText}>Cancel</Text>
          </TouchableOpacity>
        </View>
      </View>

      {loading ?
        <ActivityIndicator size="large" color="#008000" style={{ marginTop: 40 }} /> :
        <ScrollView horizontal showsHorizontalScrollIndicator style={{ flexGrow: 0 }}>
          <View>
            {/* Table header */}
            <Table borderStyle={{ borderWidth: 1, borderColor: '#c8e1ff' }}>
              <Row
                data={tableHead}
                widthArr={widthArr}
                style={styles.head}
                textStyle={styles.headText}
              />
            </Table>
            <ScrollView style={{ maxHeight: 500 }}>
              <Table borderStyle={{ borderWidth: 1, borderColor: '#c8e1ff' }}>
                {tableData.map((row, i) => (
                  <Row
                    key={i}
                    data={row}
                    widthArr={widthArr}
                    style={[styles.row, i % 2 && { backgroundColor: '#F7F6E7' }]}
                    textStyle={styles.text}
                  />
                ))}
              </Table>
              {/* Make the add row horizontally scrollable */}
              {addingRow && (
                <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ backgroundColor: "#d9f2d9", minHeight: 44 }}>
                  {renderEditableRow()}
                </ScrollView>
              )}
            </ScrollView>
          </View>
        </ScrollView>
      }
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f9f9f9', padding: 10 },
  headerRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 },
  title: { fontSize: 22, fontWeight: 'bold', color: '#008000' },
  headerButtons: { flexDirection: 'row', gap: 8, paddingRight: 15 },
  headerBtn: { backgroundColor: '#008000', borderRadius: 6, paddingVertical: 6, paddingHorizontal: 14, marginLeft: 8 },
  headerBtnText: { color: '#fff', fontWeight: 'bold', fontSize: 14 },
  head: { height: 40, backgroundColor: '#e1f9ed' },
  headText: { fontWeight: 'bold', textAlign: 'center', color: '#222', flexWrap: 'nowrap' },
  text: { color: '#222', fontSize: 14, textAlign: 'center' },
  row: { height: 44, alignItems: 'center' },
  inputCell: {
    borderWidth: 1,
    borderColor: '#998',
    paddingHorizontal: 6,
    fontSize: 14,
    color: '#222',
    textAlign: 'center',
    height: 40,
    backgroundColor: '#fff',
  },
});
