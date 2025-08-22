import React from "react";
import { View, Text, StyleSheet, ScrollView, TextInput, Pressable } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";

const EXERCISES = {
  math: [
    { question: "What is 5 + 7?", answer: "12" },
    { question: "Solve: 9 × 3", answer: "27" },
    { question: "What is 15 - 4?", answer: "11" },
    { question: "Solve: 8 ÷ 2", answer: "4" },
    { question: "What is the square root of 49?", answer: "7" },
    { question: "What is 6 × 6?", answer: "36" },
    { question: "Solve: 100 - 25", answer: "75" },
    { question: "What is 3³?", answer: "27" },
    { question: "Solve: 14 + 5", answer: "19" },
    { question: "What is 10 ÷ 2?", answer: "5" },
  ],
  english: [
    { question: "Fill in the blank: The cat ___ on the mat.", answer: "sat" },
    { question: "What is the synonym of 'happy'?", answer: "joyful" },
    { question: "Choose the correct word: Their/There/They're going home.", answer: "They're" },
    { question: "What is the antonym of 'cold'?", answer: "hot" },
    { question: "Fill in the blank: She ___ a book.", answer: "reads" },
    { question: "What is the plural of 'child'?", answer: "children" },
    { question: "Choose the correct word: Its/It's raining.", answer: "It's" },
    { question: "What is the past tense of 'run'?", answer: "ran" },
    { question: "Fill in the blank: I ___ to school.", answer: "go" },
    { question: "What is the opposite of 'big'?", answer: "small" },
  ],
  science: [
    { question: "What planet is known as the Red Planet?", answer: "Mars" },
    { question: "What is H2O commonly known as?", answer: "Water" },
    { question: "What gas do plants breathe in?", answer: "Carbon dioxide" },
    { question: "What is the boiling point of water (°C)?", answer: "100" },
    { question: "What organ pumps blood?", answer: "Heart" },
    { question: "What is the largest mammal?", answer: "Blue whale" },
    { question: "What force keeps us on the ground?", answer: "Gravity" },
    { question: "What is the center of an atom called?", answer: "Nucleus" },
    { question: "What do bees make?", answer: "Honey" },
    { question: "What is the process plants use to make food?", answer: "Photosynthesis" },
  ],
};

export default function LessonPage() {
  const router = useRouter();
  const { subject } = useLocalSearchParams();
  const exercises = EXERCISES[subject] || [];
  const [answers, setAnswers] = React.useState(Array(exercises.length).fill(""));
  const [showResults, setShowResults] = React.useState(false);

  const handleChange = (text, idx) => {
    const newAnswers = [...answers];
    newAnswers[idx] = text;
    setAnswers(newAnswers);
  };

  const checkAnswers = () => {
    setShowResults(true);
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={{ paddingBottom: 40 }}>
      <Text style={styles.title}>{subject ? subject.charAt(0).toUpperCase() + subject.slice(1) : ""} Lesson</Text>
      {exercises.map((ex, idx) => (
        <View key={idx} style={styles.exerciseCard}>
          <Text style={styles.question}>{idx + 1}. {ex.question}</Text>
          <TextInput
            style={styles.input}
            value={answers[idx]}
            onChangeText={text => handleChange(text, idx)}
            editable={!showResults}
            placeholder="Your answer"
            placeholderTextColor="#bbb"
          />
          {showResults && (
            <Text style={answers[idx].trim().toLowerCase() === ex.answer.trim().toLowerCase() ? styles.correct : styles.incorrect}>
              {answers[idx].trim().toLowerCase() === ex.answer.trim().toLowerCase() ? "Correct!" : `Answer: ${ex.answer}`}
            </Text>
          )}
        </View>
      ))}
      {!showResults ? (
        <Pressable style={styles.checkBtn} onPress={checkAnswers}>
          <Text style={styles.checkBtnTxt}>Check Answers</Text>
        </Pressable>
      ) : (
        <Pressable style={styles.backBtn} onPress={() => router.back()}>
          <Text style={styles.backBtnTxt}>Back</Text>
        </Pressable>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#18181b", padding: 18 },
  title: {
    color: "#fff",
    fontWeight: "800",
    fontSize: 22,
    marginBottom: 18,
    textAlign: "center",
  },
  exerciseCard: {
    backgroundColor: "#23232a",
    borderRadius: 14,
    padding: 16,
    marginBottom: 14,
  },
  question: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "700",
    marginBottom: 8,
  },
  input: {
    backgroundColor: "#18181b",
    color: "#fff",
    borderRadius: 8,
    padding: 10,
    fontSize: 15,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: "#333",
  },
  correct: {
    color: "#22c55e",
    fontWeight: "700",
    fontSize: 15,
    marginTop: 2,
  },
  incorrect: {
    color: "#e04ca3",
    fontWeight: "700",
    fontSize: 15,
    marginTop: 2,
  },
  checkBtn: {
    backgroundColor: "#22c55e",
    borderRadius: 10,
    paddingVertical: 14,
    alignItems: "center",
    marginTop: 10,
  },
  checkBtnTxt: {
    color: "#fff",
    fontWeight: "700",
    fontSize: 17,
    letterSpacing: 0.2,
  },
  backBtn: {
    backgroundColor: "#2563eb",
    borderRadius: 10,
    paddingVertical: 14,
    alignItems: "center",
    marginTop: 10,
  },
  backBtnTxt: {
    color: "#fff",
    fontWeight: "700",
    fontSize: 17,
    letterSpacing: 0.2,
  },
});