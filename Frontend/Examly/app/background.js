import React, { useState } from "react";
import { View, Text, StyleSheet, Pressable, Animated } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";

const C1_QUESTIONS = [
  {
    question: "How often do you read books, articles, or news in English?",
    options: ["Never", "Rarely", "Sometimes", "Often", "Always"],
  },
  {
    question: "Can you understand complex texts on abstract topics in English?",
    options: ["Not at all", "A little", "Somewhat", "Mostly", "Completely"],
  },
  {
    question: "How comfortable are you writing essays or reports in English?",
    options: ["Not comfortable", "A little comfortable", "Somewhat comfortable", "Very comfortable", "Extremely comfortable"],
  },
  {
    question: "Can you follow and participate in discussions on unfamiliar topics in English?",
    options: ["No", "Rarely", "Sometimes", "Often", "Always"],
  },
  {
    question: "How well do you understand movies or podcasts in English without subtitles?",
    options: ["Not at all", "A little", "Somewhat", "Mostly", "Completely"],
  },
];

const SAT_QUESTIONS = [
  {
    question: "How confident are you with algebraic equations?",
    options: ["Not at all", "A little", "Somewhat", "Very", "Expert"],
  },
  {
    question: "Can you read and analyze complex passages in English?",
    options: ["Not at all", "A little", "Somewhat", "Very", "Expert"],
  },
  {
    question: "How comfortable are you with geometry problems?",
    options: ["Not at all", "A little", "Somewhat", "Very", "Expert"],
  },
  {
    question: "How well do you understand data analysis and statistics?",
    options: ["Not at all", "A little", "Somewhat", "Very", "Expert"],
  },
  {
    question: "How often do you practice SAT-style questions?",
    options: ["Never", "Rarely", "Sometimes", "Often", "Always"],
  },
];

export default function BackgroundScreen() {
  const router = useRouter();
  const { exam } = useLocalSearchParams();
  const [currentIdx, setCurrentIdx] = useState(0);
  const [answers, setAnswers] = useState(Array(5).fill(null));
  const [showContinue, setShowContinue] = useState(false);
  const [showFinishAnim, setShowFinishAnim] = useState(false);
  const [animation] = useState(new Animated.Value(0));

  const questions =
    exam === "c1"
      ? C1_QUESTIONS
      : exam === "sat"
      ? SAT_QUESTIONS
      : [];

  const handleSelect = (optionIdx) => {
    const newAnswers = [...answers];
    newAnswers[currentIdx] = optionIdx;
    setAnswers(newAnswers);
    setShowContinue(false);
  };

  // Calculate score out of 100 based on answers
  const calculateScore = () => {
    // Each question has 5 options, index 0 (lowest) to 4 (highest)
    // Score per question: (selectedIdx / 4) * 20
    let score = 0;
    answers.forEach(idx => {
      if (idx !== null) score += ((idx / 4) * 20);
    });
    return Math.round(score); // 0 to 100
  };

  const handleNext = () => {
    if (currentIdx < questions.length - 1) {
      setCurrentIdx(currentIdx + 1);
    } else {
      setShowFinishAnim(true);
      Animated.timing(animation, {
        toValue: 1,
        duration: 900,
        useNativeDriver: true,
      }).start(() => {
        setTimeout(() => {
          setShowFinishAnim(false);
          const score = calculateScore();
          router.push({ pathname: "/entryLevel", params: { exam, score } });
        }, 1200);
      });
    }
  };

  React.useEffect(() => {
    if (answers[currentIdx] !== null) setShowContinue(true);
  }, [answers, currentIdx]);

  if (!questions.length) {
    return (
      <View style={styles.container}>
        <Text style={styles.header}>Tell us about your background!</Text>
        <Text style={styles.subHeader}>Please select an exam first.</Text>
      </View>
    );
  }

  if (showFinishAnim) {
    return (
      <View style={styles.container}>
        <Animated.View
          style={[
            styles.finishAnim,
            {
              opacity: animation,
              transform: [
                {
                  scale: animation.interpolate({
                    inputRange: [0, 1],
                    outputRange: [0.7, 1.1],
                  }),
                },
              ],
            },
          ]}
        >
          <Text style={styles.finishText}>Thank you!</Text>
          <Text style={styles.finishSubText}>Let's get you started on your entry test.</Text>
        </Animated.View>
      </View>
    );
  }

  const q = questions[currentIdx];

  return (
    <View style={styles.container}>
      <Text style={styles.header}>
        {exam === "c1"
          ? "Help us understand your English level"
          : exam === "sat"
          ? "Help us understand your SAT readiness"
          : "Help us understand your level"}
      </Text>
      <Text style={styles.subHeader}>
        Answer these quick questions so we can place you on the right level.
      </Text>
      <View style={styles.questionCard}>
        <Text style={styles.question}>{q.question}</Text>
        {q.options.map((opt, idx) => (
          <Pressable
            key={idx}
            style={[
              styles.optionBtn,
              answers[currentIdx] === idx && styles.optionBtnSelected,
            ]}
            onPress={() => handleSelect(idx)}
          >
            <Text
              style={[
                styles.optionLabel,
                answers[currentIdx] === idx && styles.optionLabelSelected,
              ]}
            >
              {opt}
            </Text>
          </Pressable>
        ))}
      </View>
      {showContinue && (
        <Pressable style={styles.continueBtn} onPress={handleNext}>
          <Text style={styles.continueTxt}>
            {currentIdx < questions.length - 1 ? "CONTINUE" : "START ENTRY TEST"}
          </Text>
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
    marginBottom: 10,
    textAlign: "center",
  },
  subHeader: {
    color: "#bbb",
    fontSize: 15,
    marginBottom: 22,
    textAlign: "center",
  },
  questionCard: {
    backgroundColor: "#23232a",
    borderRadius: 14,
    padding: 18,
    marginBottom: 18,
    width: "100%",
    maxWidth: 400,
  },
  question: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "700",
    marginBottom: 18,
    textAlign: "center",
  },
  optionBtn: {
    backgroundColor: "#23232a",
    borderRadius: 10,
    paddingVertical: 14,
    paddingHorizontal: 12,
    marginBottom: 10,
    borderWidth: 2,
    borderColor: "transparent",
    alignItems: "center",
  },
  optionBtnSelected: {
    borderColor: "#2563eb",
    backgroundColor: "#1e293b",
  },
  optionLabel: {
    color: "#fff",
    fontSize: 15,
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
  finishAnim: {
    alignItems: "center",
    justifyContent: "center",
    marginTop: 60,
  },
  finishText: {
    color: "#22c55e",
    fontWeight: "bold",
    fontSize: 28,
    textAlign: "center",
    marginBottom: 10,
  },
  finishSubText: {
    color: "#2563eb",
    fontWeight: "bold",
    fontSize: 18,
    textAlign: "center",
  },
});