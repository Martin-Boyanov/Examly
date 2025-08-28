import React, { useState } from "react";
import { View, Text, StyleSheet, Pressable } from "react-native";
import { useRouter } from "expo-router";

const OPTIONS = [
  {
    id: "c1",
    label: "C1 Advanced English Certificate",
    icon: "📘",
  },
  {
    id: "sat",
    label: "SAT",
    icon: "📝",
  },
];

export default function SelectExamPage() {
  const [selected, setSelected] = useState(null);
  const router = useRouter();

  const handleContinue = () => {
    if (selected) {
      router.push({
        pathname: "/background", // <-- Change to background page
        params: { exam: selected },
      });
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Which exam do you want to prepare for?</Text>
      <View style={styles.optionsWrap}>
        {OPTIONS.map(option => (
          <Pressable
            key={option.id}
            style={[
              styles.optionBtn,
              selected === option.id && styles.optionBtnSelected,
            ]}
            onPress={() => setSelected(option.id)}
          >
            <Text style={styles.optionIcon}>{option.icon}</Text>
            <Text
              style={[
                styles.optionLabel,
                selected === option.id && styles.optionLabelSelected,
              ]}
            >
              {option.label}
            </Text>
          </Pressable>
        ))}
      </View>
      {selected && (
        <Pressable style={styles.continueBtn} onPress={handleContinue}>
          <Text style={styles.continueTxt}>CONTINUE</Text>
        </Pressable>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#18181b",
    justifyContent: "center",
    alignItems: "center",
    padding: 24,
  },
  header: {
    color: "#fff",
    fontWeight: "800",
    fontSize: 22,
    marginBottom: 28,
    textAlign: "center",
  },
  optionsWrap: {
    width: "100%",
    marginBottom: 32,
  },
  optionBtn: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#23232a",
    borderRadius: 12,
    paddingVertical: 18,
    paddingHorizontal: 18,
    marginBottom: 16,
    borderWidth: 2,
    borderColor: "transparent",
  },
  optionBtnSelected: {
    borderColor: "#2563eb",
    backgroundColor: "#1e293b",
  },
  optionIcon: {
    fontSize: 28,
    marginRight: 16,
  },
  optionLabel: {
    color: "#fff",
    fontSize: 17,
    fontWeight: "700",
  },
  optionLabelSelected: {
    color: "#2563eb",
  },
  continueBtn: {
    backgroundColor: "#22c55e",
    borderRadius: 10,
    paddingVertical: 16,
    paddingHorizontal: 60,
    alignItems: "center",
    marginTop: 10,
    elevation: 2,
  },
  continueTxt: {
    color: "#fff",
    fontWeight: "700",
    fontSize: 17,
    letterSpacing: 0.2,
  },
});