import { View, Text, StyleSheet, TouchableOpacity ,Image} from 'react-native'
import {React , } from 'react'

const Botttomtabnav = () => {
  return (
    <View style={styles.bottomNav}>
        <TouchableOpacity style={styles.navTab} onPress={() => navigation.navigate("Dashboard")}>
          <Image source={require("../assets/home.png")} style={styles.navIcon} />
          <Text style={[styles.navText, { color: "#008000" }]}>Dashboard</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.navTab} onPress={() => navigation.navigate("Notifications")}>
          <Image source={require("../assets/notification.png")} style={styles.navIcon} />
          <Text style={styles.navText}>Notifications</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.navTab} onPress={() => navigation.navigate("Profile")}>
          <Image source={require("../assets/profile.png")} style={styles.navIcon} />
          <Text style={styles.navText}>Profile</Text>
        </TouchableOpacity>
      </View>
  )
}

export default Botttomtabnav

const styles =StyleSheet.create({
    
    bottomNav: {
        position: "absolute",
        bottom: 0,
        left: 0,
        right: 0,
        backgroundColor: "#fff",
        borderTopWidth: 1,
        borderTopColor: "#eaeaea",
        flexDirection: "row",
        justifyContent: "space-around",
        alignItems: "center",
        paddingVertical: 8,
      },
      navTab: { alignItems: "center", padding: 10 },
      navIcon: { width: 22, height: 22, marginBottom: 4 },
      navText: { fontSize: 13, color: "#555" },
      modalBackground: { flex: 1, backgroundColor: "rgba(0,0,0,0.75)", justifyContent: "center", alignItems: "center" },
      modalContent: { alignItems: "center" },
      largeProfilePic: { width: 260, height: 260, borderRadius: 130, borderWidth: 2, borderColor: "#fff", backgroundColor: "#eee" },
      dpEdit: { position: "absolute", bottom: 15, right: 35, backgroundColor: "#008000", borderRadius: 30, padding: 10, elevation: 7 },
      dpRemove: { position: "absolute", bottom: 15, left: 35, backgroundColor: "#d32f2f", borderRadius: 30, padding: 10, elevation: 7 },
      iconLarge: { width: 28, height: 28, tintColor: "#fff" },
      centered: { flex: 1, justifyContent: "center", alignItems: "center" },
})
