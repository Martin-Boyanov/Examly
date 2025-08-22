// app/(tabs)/index.tsx
import React, { useState } from "react";
import { View, Text, StyleSheet, ScrollView, Pressable, StatusBar, SafeAreaView, Modal } from "react-native";
import { Ionicons, MaterialIcons } from "@expo/vector-icons";
import { useRouter, Stack } from "expo-router";
import { Image } from "expo-image";

// Subjects for certificate prep
const SUBJECTS = [
  { id: "math", label: "Math", icon: "calculator-outline" },
  { id: "english", label: "English", icon: "book-outline" },
  { id: "science", label: "Science", icon: "flask-outline" },
];

// Path nodes for each subject
const PATHS = {
  math: [
    { id: "start", status: "start", title: "START", href: "/lesson/math/1" },
    { id: "unit1", status: "locked", title: "Algebra", href: "/lesson/math/algebra" },
    { id: "unit2", status: "locked", title: "Geometry", href: "/lesson/math/geometry" },
    { id: "chest", status: "chest", title: "Certificate" },
    { id: "unit3", status: "locked", title: "Calculus", href: "/lesson/math/calculus" },
    { id: "unit4", status: "locked", title: "Statistics", href: "/lesson/math/statistics" },
  ],
  english: [
    { id: "start", status: "start", title: "START", href: "/lesson/english/1" },
    { id: "unit1", status: "locked", title: "Grammar", href: "/lesson/english/grammar" },
    { id: "unit2", status: "locked", title: "Comprehension", href: "/lesson/english/comprehension" },
    { id: "chest", status: "chest", title: "Certificate" },
    { id: "unit3", status: "locked", title: "Writing", href: "/lesson/english/writing" },
    { id: "unit4", status: "locked", title: "Vocabulary", href: "/lesson/english/vocabulary" },
  ],
  science: [
    { id: "start", status: "start", title: "START", href: "/lesson/science/1" },
    { id: "unit1", status: "locked", title: "Physics", href: "/lesson/science/physics" },
    { id: "unit2", status: "locked", title: "Chemistry", href: "/lesson/science/chemistry" },
    { id: "chest", status: "chest", title: "Certificate" },
    { id: "unit3", status: "locked", title: "Biology", href: "/lesson/science/biology" },
    { id: "unit4", status: "locked", title: "Earth Science", href: "/lesson/science/earthscience" },
  ],
};

type NodeStatus = "start" | "available" | "locked" | "chest";

// Main Home Screen
export default function CertificatePrepHome() {
  const [subject, setSubject] = useState("math");
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedLesson, setSelectedLesson] = useState<any>(null);
  const router = useRouter();
  const pathData = PATHS[subject];

  // Handle lesson node click
  const handleLessonPress = (node: any) => {
    if (node.href) {
      setSelectedLesson(node);
      setModalVisible(true);
    }
  };

  // Start lesson and navigate
  const startLesson = () => {
    setModalVisible(false);
    if (selectedLesson) {
      router.push({
        pathname: "/lesson",
        params: { subject },
      });
    }
  };

  return (
    <SafeAreaView style={styles.safe}>
      <Stack.Screen options={{ headerShown: false }} />
      <StatusBar barStyle="light-content" />
      {/* Top Navbar inside SafeAreaView */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>
          {SUBJECTS.find(s => s.id === subject)?.label} Certificate Prep
        </Text>
        <View style={styles.headerRight}>
          <Ionicons name="notifications-outline" size={22} color="#fff" style={{ marginRight: 12 }} />
          <Pressable style={styles.tryProBtn}>
            <Text style={styles.tryProTxt}>TRY PRO</Text>
          </Pressable>
        </View>
      </View>

      {/* Progress Bar & Stats */}
      <View style={styles.statsBar}>
        <View style={styles.statItem}>
          <Ionicons name="heart" size={18} color="#e04ca3" />
          <Text style={styles.statTxt}>5</Text>
        </View>
        <View style={styles.statItem}>
          <Ionicons name="flash" size={18} color="#bbb" />
          <Text style={styles.statTxt}>0</Text>
        </View>
        <View style={styles.statItem}>
          <MaterialIcons name="auto-awesome" size={18} color="#a78bfa" />
          <Text style={styles.statTxt}>165</Text>
        </View>
      </View>
      <View style={styles.progressBarWrap}>
        <View style={styles.progressBarBg}>
          <View style={styles.progressBarFill} />
        </View>
      </View>

      {/* Subject Selector */}
      <View style={styles.subjectBar}>
        {SUBJECTS.map(s => (
          <Pressable
            key={s.id}
            style={[
              styles.subjectBtn,
              subject === s.id && styles.subjectBtnActive,
            ]}
            onPress={() => setSubject(s.id)}
          >
            <Ionicons name={s.icon as any} size={20} color={subject === s.id ? "#fff" : "#bbb"} />
            <Text style={[styles.subjectTxt, subject === s.id && styles.subjectTxtActive]}>
              {s.label}
            </Text>
          </Pressable>
        ))}
      </View>

      {/* Main Content */}
      <ScrollView style={styles.container} contentContainerStyle={{ paddingBottom: 40 }}>
        {/* Path */}
        <View style={styles.pathWrap}>
          <View style={styles.pathCol}>
            {pathData.map((n, idx) => (
              <React.Fragment key={n.id}>
                {idx > 0 && <View style={styles.connector} />}
                <PathNode {...n} onPress={() => handleLessonPress(n)} />
              </React.Fragment>
            ))}
          </View>
          <Image
            source={require("@/assets/images/mascot.png")}
            style={styles.mascot}
            contentFit="contain"
          />
        </View>

        {/* Certificate Card */}
        <View style={styles.certificateCard}>
          <MaterialIcons name="verified" size={48} color="#e04ca3" style={{ marginBottom: 8 }} />
          <Text style={styles.certificateTitle}>Your Certificate is close</Text>
          <Text style={styles.certificateDesc}>
            You are doing great! Keep learning to unlock your certificate!
          </Text>
        </View>

        {/* More Courses */}
        <Text style={styles.moreCoursesLabel}>More courses to explore</Text>
        <View style={styles.courseCard}>
          <Ionicons name="code-slash-outline" size={32} color="#22c55e" style={{ marginRight: 10 }} />
          <View style={{ flex: 1 }}>
            <Text style={styles.courseTitle}>Coding Foundations</Text>
            <Text style={styles.courseDesc}>
              Master all the coding skills you need to create websites, write programs, and manage databases
            </Text>
          </View>
          <Ionicons name="chevron-forward" size={24} color="#bbb" />
        </View>
        <View style={styles.courseCard}>
          <Ionicons name="analytics-outline" size={32} color="#6366f1" style={{ marginRight: 10 }} />
          <View style={{ flex: 1 }}>
            <Text style={styles.courseTitle}>Data Analytics with AI</Text>
            <Text style={styles.courseDesc}>
              Develop essential data skills and analyze data with AI
            </Text>
          </View>
          <Ionicons name="chevron-forward" size={24} color="#bbb" />
        </View>
        <Pressable style={styles.viewAllBtn}>
          <Text style={styles.viewAllTxt}>VIEW ALL COURSES</Text>
        </Pressable>
      </ScrollView>

      {/* Lesson Modal */}
      <Modal
        visible={modalVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>
              {selectedLesson?.title || "Lesson"}
            </Text>
            <Text style={styles.modalDesc}>
              Ready to start this lesson?
            </Text>
            <Pressable style={styles.startBtn} onPress={startLesson}>
              <Text style={styles.startBtnTxt}>Start Lesson</Text>
            </Pressable>
            <Pressable style={styles.cancelBtn} onPress={() => setModalVisible(false)}>
              <Text style={styles.cancelBtnTxt}>Cancel</Text>
            </Pressable>
          </View>
        </View>
      </Modal>

      <CustomBottomNav router={router} />
    </SafeAreaView>
  );
}

// Path Node Component
function PathNode({
  status,
  href,
  title,
  onPress,
}: {
  status: NodeStatus;
  href?: string;
  title?: string;
  onPress?: () => void;
}) {
  const core = (
    <View
      style={[
        styles.node,
        status === "start" && styles.nodeStart,
        status === "available" && styles.nodeAvailable,
        status === "locked" && styles.nodeLocked,
        status === "chest" && styles.nodeChest,
      ]}
    >
      {status === "start" && <Ionicons name="star" size={32} color="#fff" />}
      {status === "available" && <Ionicons name="star" size={32} color="#4cc9f0" />}
      {status === "locked" && <Ionicons name="lock-closed" size={30} color="#fff" />}
      {status === "chest" && <MaterialIcons name="verified" size={32} color="#e04ca3" />}
    </View>
  );

  return (
    <View style={{ alignItems: "center" }}>
      {title ? (
        <View style={styles.nodeLabelBox}>
          <Text style={styles.nodeLabel}>{title}</Text>
        </View>
      ) : null}
      {href ? (
        <Pressable onPress={onPress} style={({ pressed }) => pressed && { transform: [{ scale: 0.98 }] }}>
          {core}
        </Pressable>
      ) : (
        core
      )}
    </View>
  );
}

function CustomBottomNav({ router }) {
  return (
    <View style={styles.bottomNav}>
      <NavItem icon="home-outline" label="Home" onPress={() => router.push("/")} />
      <NavItem icon="people-outline" label="Community" onPress={() => router.push("/community")} />
      <NavItem icon="trophy-outline" label="Leaderboard" badge onPress={() => router.push("/leaderboard")} />
      <NavItem icon="code-outline" label="Create" onPress={() => router.push("/create")} />
      <NavItem icon="person-circle" label="Profile" profile onPress={() => router.push("/profile")} />
    </View>
  );
}

function NavItem({ icon, label, badge, profile, onPress }) {
  return (
    <Pressable style={styles.navItem} onPress={onPress}>
      <Ionicons name={icon} size={26} color="#bbb" />
      {badge && <View style={styles.navBadge} />}
      {profile ? (
        <View style={styles.profileCircle}>
          <Text style={styles.profileInitial}>W</Text>
        </View>
      ) : (
        <Text style={styles.navLabel}>{label}</Text>
      )}
    </Pressable>
  );
}

const HEADER_BG = "#2563eb";
const NAVY = "#18181b";
const NODE_RING = "#2a3541";
const NODE_BG = "#23232a";
const LOCKED_OPACITY = 0.35;

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: NAVY },
  container: { flex: 1, backgroundColor: NAVY },
  header: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: HEADER_BG,
    paddingHorizontal: 16,
    paddingVertical: 14,
    gap: 10,
    borderBottomWidth: 1,
    borderColor: "#23232a",
  },
  headerTitle: {
    flex: 1,
    color: "#fff",
    fontSize: 20,
    fontWeight: "700",
    letterSpacing: 0.2,
  },
  headerRight: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  tryProBtn: {
    backgroundColor: "#fbbf24",
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 6,
    marginLeft: 8,
  },
  tryProTxt: {
    color: "#18181b",
    fontWeight: "800",
    fontSize: 14,
    letterSpacing: 0.2,
  },
  statsBar: {
    flexDirection: "row",
    justifyContent: "flex-start",
    alignItems: "center",
    backgroundColor: "#23232a",
    paddingHorizontal: 16,
    paddingVertical: 8,
    gap: 16,
  },
  statItem: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#18181b",
    borderRadius: 8,
    paddingHorizontal: 8,
    paddingVertical: 2,
    gap: 4,
  },
  statTxt: {
    color: "#fff",
    fontWeight: "700",
    fontSize: 15,
    marginLeft: 2,
  },
  progressBarWrap: {
    paddingHorizontal: 16,
    paddingVertical: 6,
    backgroundColor: "#23232a",
  },
  progressBarBg: {
    height: 12,
    backgroundColor: "#18181b",
    borderRadius: 8,
    overflow: "hidden",
  },
  progressBarFill: {
    height: 12,
    width: "40%",
    backgroundColor: "#22c55e",
    borderRadius: 8,
  },
  subjectBar: {
    flexDirection: "row",
    justifyContent: "center",
    marginVertical: 10,
    gap: 12,
  },
  subjectBtn: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#23232a",
    borderRadius: 10,
    paddingVertical: 8,
    paddingHorizontal: 16,
    marginHorizontal: 2,
    gap: 7,
    borderWidth: 2,
    borderColor: "transparent",
  },
  subjectBtnActive: {
    backgroundColor: "#2563eb",
    borderColor: "#fff",
  },
  subjectTxt: {
    color: "#bbb",
    fontWeight: "700",
    fontSize: 15,
    letterSpacing: 0.3,
  },
  subjectTxtActive: {
    color: "#fff",
  },
  pathWrap: {
    marginTop: 8,
    flexDirection: "row",
    paddingHorizontal: 32,
    minHeight: 320,
  },
  pathCol: {
    flex: 1,
    alignItems: "center",
    paddingTop: 8,
  },
  connector: {
    width: 8,
    height: 44,
    backgroundColor: NODE_RING,
    borderRadius: 999,
    marginVertical: 6,
    opacity: 0.5,
  },
  node: {
    width: 90,
    height: 90,
    borderRadius: 999,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: NODE_BG,
    borderWidth: 8,
    borderColor: NODE_RING,
    shadowColor: "#000",
    shadowOpacity: 0.35,
    shadowOffset: { width: 0, height: 8 },
    shadowRadius: 14,
    elevation: 6,
  },
  nodeStart: {
    borderColor: "#2563eb",
    backgroundColor: "#1e293b",
  },
  nodeAvailable: {
    borderColor: "#4cc9f0",
    backgroundColor: "#10212c",
  },
  nodeLocked: {
    opacity: LOCKED_OPACITY,
  },
  nodeChest: {
    borderColor: "#e04ca3",
    backgroundColor: "#23232a",
  },
  nodeLabelBox: {
    backgroundColor: "#23232a",
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 2,
    marginBottom: 6,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.08)",
  },
  nodeLabel: {
    color: "#fff",
    fontSize: 13,
    fontWeight: "800",
    opacity: 0.9,
    letterSpacing: 0.5,
  },
  mascot: {
    width: 120,
    height: 120,
    marginTop: 80,
    marginLeft: -30,
    opacity: 0.95,
    position: "absolute",
    right: 0,
    top: 180,
  },
  certificateCard: {
    backgroundColor: "#23232a",
    borderRadius: 18,
    margin: 18,
    padding: 18,
    alignItems: "center",
    shadowColor: "#e04ca3",
    shadowOpacity: 0.08,
    shadowRadius: 10,
  },
  certificateTitle: {
    color: "#fff",
    fontWeight: "800",
    fontSize: 18,
    marginBottom: 4,
  },
  certificateDesc: {
    color: "#bbb",
    fontSize: 14,
    textAlign: "center",
  },
  moreCoursesLabel: {
    color: "#fff",
    fontWeight: "700",
    fontSize: 16,
    marginLeft: 18,
    marginBottom: 8,
    marginTop: 10,
  },
  courseCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#23232a",
    borderRadius: 14,
    marginHorizontal: 18,
    marginBottom: 10,
    padding: 14,
    gap: 8,
  },
  courseTitle: {
    color: "#fff",
    fontWeight: "700",
    fontSize: 15,
  },
  courseDesc: {
    color: "#bbb",
    fontSize: 13,
    marginTop: 2,
  },
  viewAllBtn: {
    backgroundColor: "#23232a",
    borderRadius: 10,
    marginHorizontal: 18,
    marginTop: 8,
    paddingVertical: 12,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#2563eb",
  },
  viewAllTxt: {
    color: "#2563eb",
    fontWeight: "700",
    fontSize: 15,
    letterSpacing: 0.3,
  },
  // Modal styles
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.45)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    backgroundColor: "#23232a",
    borderRadius: 18,
    padding: 28,
    alignItems: "center",
    width: 300,
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowRadius: 12,
  },
  modalTitle: {
    color: "#fff",
    fontWeight: "800",
    fontSize: 20,
    marginBottom: 8,
  },
  modalDesc: {
    color: "#bbb",
    fontSize: 15,
    marginBottom: 18,
    textAlign: "center",
  },
  startBtn: {
    backgroundColor: "#22c55e",
    borderRadius: 10,
    paddingVertical: 12,
    paddingHorizontal: 32,
    marginBottom: 10,
    width: "100%",
    alignItems: "center",
  },
  startBtnTxt: {
    color: "#fff",
    fontWeight: "700",
    fontSize: 16,
    letterSpacing: 0.2,
  },
  cancelBtn: {
    paddingVertical: 8,
    paddingHorizontal: 32,
    width: "100%",
    alignItems: "center",
  },
  cancelBtnTxt: {
    color: "#bbb",
    fontWeight: "700",
    fontSize: 15,
  },
  bottomNav: {
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    backgroundColor: "#23232a",
    paddingVertical: 8,
    borderTopWidth: 1,
    borderColor: "#18181b",
  },
  navItem: {
    alignItems: "center",
    justifyContent: "center",
    position: "relative",
    width: 70,
    paddingVertical: 4,
  },
  navLabel: {
    color: "#bbb",
    fontSize: 13,
    fontWeight: "700",
    marginTop: 2,
  },
  navBadge: {
    position: "absolute",
    top: 2,
    right: 14,
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: "#e04ca3",
    borderWidth: 2,
    borderColor: "#23232a",
  },
  profileCircle: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: "#e04ca3",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 2,
  },
  profileInitial: {
    color: "#fff",
    fontWeight: "700",
    fontSize: 15,
  },
});
