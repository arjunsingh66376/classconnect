import React, { useEffect, useState } from 'react';
import {
  View, Text, StyleSheet, ScrollView, ActivityIndicator, Alert, Dimensions, TouchableOpacity, Modal, TextInput,
} from 'react-native';
import { Table, Row } from 'react-native-table-component';

const BACKEND_URL = 'http://192.168.1.211:5000';
const { width } = Dimensions.get('window');

export default function StudentDatabaseScreen({ navigation }) {
  const [tableHead, setTableHead] = useState([
    'Roll No', 'Name', 'Class', 'Fees Paid', 'Fees Due', 'Attendance', 'Subjects', 'Percent', 'Class Teacher', 'Actions'
  ]);
  const [tableData, setTableData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    fetchStudents();
  }, []);

  const fetchStudents = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${BACKEND_URL}/api/students`);
      const students = await res.json();

      // Format table rows
      const rows = students.sort((a, b) => {
        if (a.studentClass !== b.studentClass)
          return a.studentClass.localeCompare(b.studentClass);
        return (parseInt(a.rollNo) || 0) - (parseInt(b.rollNo) || 0);
      }).map(student => ([
        student.rollNo,
        student.studentName,
        student.studentClass,
        student.feesPaid,
        student.feesDue,
        student.attendance,
        (student.subjects || []).map(sub => `${sub.name}:${sub.score}/${sub.max}`).join('\n'),
        student.percentage,
        student.classTeacher,
        <View style={{flexDirection:'row',justifyContent:'center',alignItems:'center'}}>
          <TouchableOpacity onPress={() => handleEdit(student)} style={styles.actionBtn}>
            <Text style={styles.actionBtnText}>Edit</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => handleAdd()} style={[styles.actionBtn, {marginLeft:5, backgroundColor: '#fff', borderColor: '#008000', borderWidth: 1}]}>
            <Text style={[styles.actionBtnText, {color: '#008000'}]}>Add</Text>
          </TouchableOpacity>
        </View>
      ]));

      setTableData(rows);
    } catch (e) {
      Alert.alert('Error', 'Failed to fetch students');
    }
    setLoading(false);
  };

  // Dummy handlers, wire up your add/edit modal here
  const handleEdit = (student) => setShowModal(true);
  const handleAdd = () => setShowModal(true);

  // Define shared column widths
  const widthArr = [60, 100, 70, 75, 75, 90, 200, 65, 110, 110];

  return (
    <View style={{ flex: 1, backgroundColor: "#f9f9f9" }}>
      <Text style={styles.title}>Student Database (Excel View)</Text>
      {loading
        ? <ActivityIndicator size="large" color="#008000" style={{marginTop:40}} />
        : (
          <ScrollView horizontal showsHorizontalScrollIndicator>
            <View>
              {/* Table header */}
              <Table borderStyle={{ borderWidth: 1, borderColor: '#c8e1ff' }} style={{margin: 7}}>
                <Row
                  data={tableHead}
                  widthArr={widthArr}
                  style={styles.head}
                  textStyle={styles.headText}
                />
              </Table>
              {/* Table data body */}
              <ScrollView style={{maxHeight: 500}}>
                <Table borderStyle={{ borderWidth: 1, borderColor: '#c8e1ff' }}>
                  {tableData.map((rowData, idx) => (
                    <Row
                      key={idx}
                      data={rowData}
                      widthArr={widthArr}
                      style={[styles.row, idx%2 && {backgroundColor: '#F7F6E7'}]}
                      textStyle={styles.text}
                    />
                  ))}
                </Table>
              </ScrollView>
            </View>
          </ScrollView>
        )
      }
      {/* Example modal for Add/Edit */}
      <Modal visible={showModal} transparent animationType="fade" onRequestClose={()=>setShowModal(false)}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalPanel}>
            <Text style={{fontWeight: "bold", fontSize: 18, color: "#008000"}}>Add/Edit Student</Text>
            <TextInput style={styles.input} placeholder="Student Name"/>
            {/* ...add more inputs... */}
            <TouchableOpacity style={styles.saveBtn} onPress={()=>setShowModal(false)}>
              <Text style={{color:"#fff", fontWeight:"bold"}}>Save</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.cancelBtn} onPress={()=>setShowModal(false)}>
              <Text style={{color:"#008000", fontWeight:"bold"}}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
}
const styles = StyleSheet.create({
  title: {
    fontSize: 22,
    fontWeight: "bold",
    marginVertical: 16,
    marginLeft: 10,
    color: "#008000"
  },
  head: { height: 40, backgroundColor: '#e1f9ed' },
  headText: { fontWeight: "bold", textAlign: 'center', color: "#222" },
  text: { color: '#222', fontSize: 14, textAlign:'center' },
  actionBtn: {
    backgroundColor: "#008000",
    paddingVertical: 4,
    paddingHorizontal: 14,
    borderRadius: 20,
  },
  actionBtnText: { color: "#fff", fontWeight: "bold", fontSize: 13 },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.40)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalPanel:{
    backgroundColor:'#fff',
    borderRadius:14,
    padding:28,
    alignItems:"center",
    width:300,
  },
  input: {
    width:"100%",
    marginVertical:8,
    backgroundColor:"#f2fff6",
    borderRadius:7,
    paddingHorizontal:12,
    paddingVertical:8,
    borderColor:"#008000",
    borderWidth:1,
    color:"#222"
  },
  saveBtn: {
    backgroundColor: "#008000",
    borderRadius: 8,
    paddingVertical: 10,
    paddingHorizontal: 54,
    marginTop: 7,
    alignSelf: "center",
  },
  cancelBtn: {
    borderRadius: 8,
    borderColor:"#008000",
    borderWidth:1.5,
    paddingVertical: 8,
    paddingHorizontal: 54,
    marginTop: 8,
    alignSelf: "center",
    backgroundColor:'#fff'
  },
  row: { height: 44 }
});
