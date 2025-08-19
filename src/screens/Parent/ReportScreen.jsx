import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
} from "react-native";
import { getReportCard } from "../../api/report";

const gradeColors = {
  A: "#43B54B",
  B: "#2B95C9",
  C: "#FFB800",
  D: "#FF7F7F",
};

// CBSE style grade to points mapping (simplified)
const gradePointsMap = {
  A: 10,
  B: 8,
  C: 6,
  D: 4,
};

const subjectIcons = {
  Mathematics: require("../../assets/math.jpg"),
  Arts: require("../../assets/arts.png"),
  History: require("../../assets/history.png"),
};

// Calculate CGPA according to CBSE style (average grade points without weight)
function calculateCBSECGPA(subjects) {
  if (!subjects || subjects.length === 0) return 0;
  const totalPoints = subjects.reduce((sum, subject) => {
    const grade = subject.grade.toUpperCase();
    return sum + (gradePointsMap[grade] || 0);
  }, 0);
  return (totalPoints / subjects.length).toFixed(2);
}

// Calculate overall percentage dynamically
function calculateOverallPercentage(subjects) {
  if (!subjects || subjects.length === 0) return 0;
  let totalScore = 0;
  let totalMaxMarks = 0;
  subjects.forEach((sub) => {
    totalScore += sub.score;
    totalMaxMarks += sub.max;
  });
  return ((totalScore / totalMaxMarks) * 100).toFixed(2);
}

const ReportScreen = ({ navigation }) => {
  const [data, setData] = useState(null);
  const [selectedTerm, setSelectedTerm] = useState(1);

  useEffect(() => {
    getReportCard("101", selectedTerm).then(setData);
  }, [selectedTerm]);

  if (!data) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <Text>Loading...</Text>
      </View>
    );
  }

  const cgpa = calculateCBSECGPA(data.subjects);
  const overallPercent = calculateOverallPercentage(data.subjects);

  return (
    <View style={{ flex: 1, backgroundColor: "#fff" }}>
      {/* Centered Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Text style={{ fontSize: 26, color: "#26344a" }}>{"<"}</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Report Card</Text>
        <View style={{ width: 36 }} />
      </View>

      {/* Tabs */}
      <View style={styles.tabs}>
        {data.terms.map((term, idx) => (
          <TouchableOpacity
            key={term}
            style={[
              styles.tabBtn,
              selectedTerm === idx + 1 && styles.tabBtnActive,
            ]}
            onPress={() => setSelectedTerm(idx + 1)}
          >
            <Text
              style={[
                styles.tabText,
                selectedTerm === idx + 1 && styles.tabTextActive,
              ]}
            >
              {term}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <ScrollView style={{ flex: 1 }} contentContainerStyle={{ paddingBottom: 80 }}>
        {/* Overall Performance */}
        <View style={styles.overallCard}>
          <Text style={styles.sectionTitle}>Overall Performance</Text>
          <View style={styles.overallRow}>
            <View style={styles.overallBox}>
              <Text style={styles.overallValue}>{cgpa}</Text>
              <Text style={styles.overallLabel}>CGPA</Text>
            </View>
            <View style={[styles.overallBox, { borderLeftWidth: 1, borderLeftColor: "#eee" }]}>
              <Text style={styles.overallValue}>{overallPercent}%</Text>
              <Text style={styles.overallLabel}>Overall %</Text>
            </View>
            <View style={[styles.overallBox, { borderLeftWidth: 1, borderLeftColor: "#eee" }]}>
              <Text style={[styles.overallValue, { color: gradeColors[data.overall.grade] }]}>{data.overall.grade}</Text>
              <Text style={styles.overallLabel}>Overall Grade</Text>
            </View>
          </View>
        </View>

        {/* Subject Performance */}
        <Text style={styles.sectionTitle}>Subject Performance (Term {selectedTerm})</Text>
        {data.subjects.map((sub) => (
          <View key={sub.name} style={styles.subjectCard}>
            <View style={{ flexDirection: "row", alignItems: "center" }}>
              <Image source={subjectIcons[sub.name]} style={styles.subjectIcon} />
              <Text style={styles.subjectName}>{sub.name}</Text>
              <View style={[styles.gradeBadge, { backgroundColor: gradeColors[sub.grade] }]}>
                <Text style={styles.gradeBadgeText}>{sub.grade}</Text>
              </View>
            </View>
            <View style={{ flexDirection: "row", alignItems: "center", marginVertical: 6 }}>
              <Text style={styles.subjectScore}>{sub.score}</Text>
              <Text style={styles.subjectOutOf}>/ {sub.max} Marks</Text>
            </View>
            <Text style={[styles.remark, { color: gradeColors[sub.grade] }]}>
              {sub.remark}
            </Text>
            <View style={styles.progressBarContainer}>
              <View
                style={[
                  styles.progressBar,
                  {
                    width: `${(sub.score / sub.max) * 100}%`,
                  },
                ]}
              />
              <View style={styles.progressBarBg} />
            </View>
          </View>
        ))}

        {/* Teacher's Remarks */}
        <View style={styles.remarksCard}>
          <Text style={styles.remarkTitle}>Teacher's Remarks</Text>
          <Text style={styles.remarkText}>{data.teacherRemark.text}</Text>
          <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 6 }}>
            <Text style={styles.finalGradeLabel}>Final Grade:</Text>
            <Text style={[styles.finalGrade, { color: gradeColors[data.teacherRemark.finalGrade] }]}>{data.teacherRemark.finalGrade}</Text>
          </View>
        </View>
      </ScrollView>

      {/* Bottom Navigation */}
      <View style={styles.bottomNav}>
        <TouchableOpacity style={styles.navTab}>
          <Image source={require("../../assets/home.png")} style={styles.navIcon} />
          <Text style={[styles.navText, { color: "#1976d2" }]}>Dashboard</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.navTab}>
          <Image source={require("../../assets/notification.png")} style={styles.navIcon} />
          <Text style={styles.navText}>Notifications</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.navTab}>
          <Image source={require("../../assets/profile.png")} style={styles.navIcon} />
          <Text style={styles.navText}>Profile</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingTop: 24,
    paddingBottom: 12,
    paddingHorizontal: 16,
    backgroundColor: "#fff",
    borderBottomWidth: 1,
    borderBottomColor: "#f2f2f2",
  },
  backBtn: { width: 36, alignItems: "flex-start" },
  headerTitle: {
    flex: 1,
    textAlign: "center",
    fontSize: 19,
    fontWeight: "bold",
    color: "#26344a",
  },
  tabs: {
    flexDirection: "row",
    justifyContent: "center",
    backgroundColor: "#fff",
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  tabBtn: {
    paddingHorizontal: 21,
    paddingVertical: 7,
    backgroundColor: "#fff",
    borderRadius: 7,
    marginRight: 7,
  },
  tabBtnActive: { backgroundColor: "#E3ECF7" },
  tabText: { color: "#26344a", fontSize: 15 },
  tabTextActive: { color: "#1976d2", fontWeight: "bold" },
  overallCard: {
    margin: 16,
    padding: 18,
    borderRadius: 14,
    backgroundColor: "#fff",
    elevation: 1,
    borderWidth: 1,
    borderColor: "#f2f2f2",
  },
  sectionTitle: { fontSize: 15, fontWeight: "bold", marginVertical: 14, marginLeft: 12 },
  overallRow: { flexDirection: "row", justifyContent: "space-between", marginTop: 12 },
  overallBox: { flex: 1, alignItems: "center" },
  overallValue: { fontSize: 21, fontWeight: "bold", marginBottom: 2 },
  overallLabel: { fontSize: 13, color: "#aaa" },
  subjectCard: {
    marginHorizontal: 16,
    marginVertical: 8,
    padding: 18,
    borderRadius: 14,
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#f2f2f2",
  },
  subjectIcon: { width: 22, height: 22, marginRight: 8 },
  subjectName: { fontSize: 16, fontWeight: "bold", color: "#26344a", flex: 1 },
  gradeBadge: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 11,
    alignItems: "center",
    marginLeft: 8,
  },
  gradeBadgeText: { color: "#fff", fontSize: 14, fontWeight: "bold" },
  subjectScore: { fontSize: 25, fontWeight: "bold", color: "#26344a" },
  subjectOutOf: { fontSize: 15, color: "#aaa", marginLeft: 5 },
  remark: { fontSize: 13, fontWeight: "500", marginVertical: 2 },
  progressBarContainer: {
    width: "100%",
    height: 7,
    borderRadius: 16,
    backgroundColor: "#e9eaf5",
    position: "relative",
    marginTop: 6,
    overflow: "hidden",
  },
  progressBar: {
    position: "absolute",
    left: 0,
    top: 0,
    height: 7,
    borderRadius: 16,
    backgroundColor: "#1976d2",
    zIndex: 10,
  },
  progressBarBg: { width: "100%", height: "100%" },
  remarksCard: {
    margin: 16,
    marginTop: 8,
    padding: 18,
    borderRadius: 14,
    backgroundColor: "#fff",
    elevation: 1,
    borderWidth: 1,
    borderColor: "#f2f2f2",
  },
  remarkTitle: { fontSize: 15, fontWeight: "bold", marginBottom: 6 },
  remarkText: { fontSize: 15, color: "#26344a", marginBottom: 8 },
  finalGradeLabel: { fontSize: 14, color: "#26344a", fontWeight: "bold" },
  finalGrade: { fontSize: 18, marginLeft: 6, fontWeight: "bold" },
  bottomNav: {
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "#fff",
    paddingVertical: 8,
    borderTopWidth: 1,
    borderTopColor: "#eaeaea",
  },
  navTab: { alignItems: "center", padding: 8 },
  navIcon: { width: 22, height: 22, marginBottom: 3 },
  navText: { fontSize: 13, color: "#888" },
});

export default ReportScreen;
