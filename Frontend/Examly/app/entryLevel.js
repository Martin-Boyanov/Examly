import React, { useState } from "react";
import { View, Text, StyleSheet, Pressable, TextInput, ScrollView } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";

// Example CEFR and SAT entry test questions by level
const CEFR_TESTS = [
  // A2/B1
  [
    { question: "Complete: I ____ to the store yesterday.", answer: "went" },
    { question: "Choose the correct word: She ____ very happy.", answer: "is" },
    { question: "Translate: 'Library' to English.", answer: "library" },
    { question: "What is the plural of 'child'?", answer: "children" },
    { question: "Fill in: I have lived here ____ 2019.", answer: "since" },
  ],
  // B2/C1
  [
    { question: "What does 'inevitable' mean?", answer: "unavoidable" },
    { question: "Complete: If I ____ more time, I would travel.", answer: "had" },
    { question: "Choose the correct: She has never ____ sushi.", answer: "eaten" },
    { question: "Write a synonym for 'important'.", answer: "significant" },
    { question: "Fill in: The book, ____ I bought yesterday, is interesting.", answer: "which" },
  ],
  // C1/C2
  [
    { question: "Explain the meaning of 'paradox'.", answer: "contradiction" },
    { question: "Use 'albeit' in a sentence.", answer: "any" }, // 'any' = free-response (counts as correct if answered)
    { question: "What is the antonym of 'scarce'?", answer: "abundant" },
    { question: "Rewrite: 'Despite being tired, he finished the work.'", answer: "any" },
    { question: "Fill in: She speaks English ____ fluency.", answer: "with" },
  ],
];

const SAT_TESTS = [
  // Basic
  [
    { question: "What is 7 x 8?", answer: "56" },
    { question: "Which is a synonym for 'happy'?", answer: "joyful" },
    { question: "Solve for x: 2x = 10", answer: "5" },
    { question: "What is the capital of the USA?", answer: "washington" },
    { question: "What is 15% of 200?", answer: "30" },
  ],
  // Intermediate
  [
    { question: "Simplify: (x^2 - x) / x", answer: "x-1" },
    { question: "What is the main idea of a passage called?", answer: "theme" },
    { question: "Solve: 3x + 2 = 11", answer: "3" },
    { question: "What is the square root of 144?", answer: "12" },
    { question: "What is a metaphor?", answer: "comparison" },
  ],
  // Advanced
  [
    { question: "Integrate: ∫2x dx", answer: "x^2" },
    { question: "Define 'juxtaposition'.", answer: "contrast" },
    { question: "Solve: x^2 - 4x + 4 = 0", answer: "2" },
    { question: "What is the derivative of x^3?", answer: "3x^2" },
    { question: "What is the meaning of 'ubiquitous'?", answer: "everywhere" },
  ],
];

function getTest(exam, score) {
  if (exam === "c1") {
    if (score < 40) return CEFR_TESTS[0];
    if (score < 75) return CEFR_TESTS[1];
    return CEFR_TESTS[2];
  }
  if (exam === "sat") {
    if (score < 40) return SAT_TESTS[0];
    if (score < 75) return SAT_TESTS[1];
    return SAT_TESTS[2];
  }
  return [];
}

// figure out which "band" we served based on incoming score (same rules as getTest)
function getBandIndex(exam, score) {
  if (exam === "c1" || exam === "sat") {
    if (score < 40) return 0;
    if (score < 75) return 1;
    return 2;
  }
  return 0;
}

// simple normalizer for answer comparison (case-insensitive, trims, strips punctuation)
function normalize(str) {
  return String(str || "")
    .toLowerCase()
    .trim()
    .replace(/[^\p{L}\p{N}\s\-]/gu, ""); // remove punctuation but keep letters/digits/spaces/hyphen
}

// check if a user's answer is correct given an expected answer
function isCorrect(user, expected) {
  const u = normalize(user);
  if (!u) return false;
  // 'any' means any non-empty answer counts
  if (expected === "any") return true;

  // allow multiple valid answers with '|' separator if you ever add them
  const options = expected.split("|").map((o) => normalize(o));
  return options.includes(u);
}

export default function EntryLevelTest() {
  const router = useRouter();
  const { exam, score } = useLocalSearchParams();
  const numericScore = Number(score);
  const testQuestions = getTest(exam, numericScore);
  const [answers, setAnswers] = useState(Array(testQuestions.length).fill(""));
  const [currentIdx, setCurrentIdx] = useState(0);
  const [showError, setShowError] = useState(false);

  // results state
  const [showResults, setShowResults] = useState(false);
  const [result, setResult] = useState({ correct: 0, total: testQuestions.length, percent: 0, level: "" });

  const handleChange = (text) => {
    const newAnswers = [...answers];
    newAnswers[currentIdx] = text;
    setAnswers(newAnswers);
    if (showError) setShowError(false);
  };

  const goNext = () => {
    setCurrentIdx((idx) => Math.min(idx + 1, testQuestions.length - 1));
    setShowError(false);
  };

  const goPrev = () => {
    setCurrentIdx((idx) => Math.max(idx - 1, 0));
    setShowError(false);
  };

  const firstUnansweredIdx = answers.findIndex((a) => !a.trim());
  const canSubmit = firstUnansweredIdx === -1;

  function estimateLevel(examType, bandIdx, percent) {
    if (examType === "c1") {
      // within each band, below 50% → lower level, >=50% → higher level
      if (bandIdx === 0) return percent >= 50 ? "B1" : "A2";
      if (bandIdx === 1) return percent >= 50 ? "C1" : "B2";
      return percent >= 50 ? "C2" : "C1";
    }
    if (examType === "sat") {
      if (bandIdx === 0) return "Basic";
      if (bandIdx === 1) return percent >= 50 ? "Intermediate (upper)" : "Intermediate (lower)";
      return percent >= 50 ? "Advanced" : "Intermediate/Advanced";
    }
    return "Unknown";
  }

  const handleSubmit = () => {
    if (!canSubmit) {
      if (firstUnansweredIdx !== -1) setCurrentIdx(firstUnansweredIdx);
      setShowError(true);
      return;
    }

    // grade
    let correct = 0;
    testQuestions.forEach((q, i) => {
      if (isCorrect(answers[i], q.answer)) correct += 1;
    });
    const total = testQuestions.length;
    const percent = Math.round((correct / total) * 100);
    const bandIdx = getBandIndex(exam, numericScore);
    const level = estimateLevel(exam, bandIdx, percent);

    setResult({ correct, total, percent, level });
    setShowResults(true);
  };

  if (showResults) {
    return (
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.header}>
          {exam === "c1"
            ? "Your English Placement Result"
            : exam === "sat"
            ? "Your SAT Readiness Result"
            : "Your Result"}
        </Text>

        <View style={styles.resultCard}>
          <Text style={styles.resultBig}>{result.correct} / {result.total}</Text>
          <Text style={styles.resultSub}>Correct ({result.percent}%)</Text>

          <View style={{ height: 14 }} />

          <Text style={styles.resultLabel}>Estimated level:</Text>
          <Text style={styles.resultLevel}>
            {exam === "c1" ? `CEFR ${result.level}` : result.level}
          </Text>
        </View>

        <View style={styles.navBtns}>
          <Pressable
            style={styles.navBtn}
            onPress={() => {
              // restart this test
              setAnswers(Array(testQuestions.length).fill(""));
              setCurrentIdx(0);
              setShowError(false);
              setShowResults(false);
            }}
          >
            <Text style={styles.navBtnTxt}>Retake</Text>
          </Pressable>

          <Pressable
            style={styles.submitBtn}
            onPress={() => router.push({ pathname: "/path", params: { exam, score } })}
          >
            <Text style={styles.submitBtnTxt}>Continue</Text>
          </Pressable>
        </View>
      </ScrollView>
    );
  }

  const q = testQuestions[currentIdx];

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.header}>
        {exam === "c1"
          ? "Entry Level English Test"
          : exam === "sat"
          ? "Entry Level SAT Test"
          : "Entry Level Test"}
      </Text>

      <Text style={styles.subHeader}>
        Question {currentIdx + 1} of {testQuestions.length}
      </Text>

      <View style={styles.questionCard}>
        <Text style={styles.question}>{q?.question}</Text>
        <TextInput
          style={styles.input}
          value={answers[currentIdx]}
          onChangeText={handleChange}
          placeholder="Your answer"
          placeholderTextColor="#bbb"
          autoCapitalize="none"
        />
        {showError && !answers[currentIdx].trim() && (
          <Text style={styles.error}>Please answer this before submitting.</Text>
        )}
      </View>

      <View style={styles.navBtns}>
        <Pressable
          style={[styles.navBtn, currentIdx === 0 && { opacity: 0.5 }]}
          onPress={goPrev}
          disabled={currentIdx === 0}
        >
          <Text style={styles.navBtnTxt}>Back</Text>
        </Pressable>

        {currentIdx < testQuestions.length - 1 ? (
          <Pressable style={styles.navBtn} onPress={goNext}>
            <Text style={styles.navBtnTxt}>Next</Text>
          </Pressable>
        ) : (
          <Pressable style={styles.submitBtn} onPress={handleSubmit}>
            <Text style={styles.submitBtnTxt}>Submit</Text>
          </Pressable>
        )}
      </View>

      {!canSubmit && (
        <Text style={[styles.subHeader, { marginTop: 14 }]}>
          {testQuestions.length - answers.filter((a) => a.trim()).length} unanswered
        </Text>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
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
  error: {
    color: "#e04ca3",
    fontWeight: "700",
    fontSize: 15,
    marginTop: 2,
    textAlign: "center",
  },
  navBtns: {
    flexDirection: "row",
    justifyContent: "center",
    gap: 18,
    marginTop: 10,
  },
  navBtn: {
    backgroundColor: "#2563eb",
    borderRadius: 10,
    paddingVertical: 12,
    paddingHorizontal: 32,
    alignItems: "center",
  },
  navBtnTxt: {
    color: "#fff",
    fontWeight: "700",
    fontSize: 16,
  },
  submitBtn: {
    backgroundColor: "#22c55e",
    borderRadius: 10,
    paddingVertical: 12,
    paddingHorizontal: 32,
    alignItems: "center",
  },
  submitBtnTxt: {
    color: "#fff",
    fontWeight: "700",
    fontSize: 16,
  },
  resultCard: {
    backgroundColor: "#23232a",
    borderRadius: 14,
    padding: 22,
    width: "100%",
    maxWidth: 420,
    alignItems: "center",
  },
  resultBig: {
    color: "#fff",
    fontWeight: "800",
    fontSize: 34,
  },
  resultSub: {
    color: "#bbb",
    fontSize: 16,
    marginTop: 4,
  },
  resultLabel: {
    color: "#bbb",
    fontSize: 14,
    textTransform: "uppercase",
    letterSpacing: 1,
  },
  resultLevel: {
    color: "#fff",
    fontSize: 22,
    fontWeight: "800",
    marginTop: 6,
  },
});
