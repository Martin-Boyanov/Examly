import React from "react";
import { View, Text, StyleSheet, TextInput, Pressable, Animated } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";

const EXERCISES = {
  math: {
    "1": [
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
    algebra: [
      { question: "Solve for x: 2x + 3 = 7", answer: "2" },
      { question: "What is the value of y in y - 4 = 10?", answer: "14" },
      { question: "Simplify: 3(x + 2)", answer: "3x + 6" },
      { question: "Expand: (x + 1)(x + 2)", answer: "x^2 + 3x + 2" },
      { question: "Factor: x^2 - 9", answer: "(x + 3)(x - 3)" },
      { question: "Solve: x/2 = 8", answer: "16" },
      { question: "What is the coefficient of x in 5x + 7?", answer: "5" },
      { question: "Simplify: 2x + 3x", answer: "5x" },
      { question: "Solve: x^2 = 25", answer: "5 or -5" },
      { question: "What is x if 4x = 20?", answer: "5" },
    ],
    geometry: [
      { question: "What is the sum of angles in a triangle?", answer: "180" },
      { question: "How many sides does a hexagon have?", answer: "6" },
      { question: "What is the area of a rectangle with sides 4 and 5?", answer: "20" },
      { question: "What is the perimeter of a square with side 3?", answer: "12" },
      { question: "What is a right angle?", answer: "90" },
      { question: "What is the formula for area of a circle?", answer: "πr^2" },
      { question: "How many degrees in a straight line?", answer: "180" },
      { question: "What is the volume of a cube with side 2?", answer: "8" },
      { question: "What is the longest side of a right triangle called?", answer: "Hypotenuse" },
      { question: "What is the radius of a circle with diameter 10?", answer: "5" },
    ],
    calculus: [
      { question: "What is the derivative of x^2?", answer: "2x" },
      { question: "What is the integral of 2x?", answer: "x^2 + C" },
      { question: "What is the limit of 1/x as x approaches infinity?", answer: "0" },
      { question: "What is the derivative of sin(x)?", answer: "cos(x)" },
      { question: "What is the integral of 1/x?", answer: "ln|x| + C" },
      { question: "What is the derivative of e^x?", answer: "e^x" },
      { question: "What is the integral of cos(x)?", answer: "sin(x) + C" },
      { question: "What is the derivative of ln(x)?", answer: "1/x" },
      { question: "What is the limit of x^2 as x approaches 0?", answer: "0" },
      { question: "What is the integral of 3?", answer: "3x + C" },
    ],
    statistics: [
      { question: "What is the mean of 2, 4, 6?", answer: "4" },
      { question: "What is the median of 1, 3, 5?", answer: "3" },
      { question: "What is the mode of 2, 2, 3?", answer: "2" },
      { question: "What is the range of 5, 10, 15?", answer: "10" },
      { question: "What is the probability of flipping heads on a coin?", answer: "0.5" },
      { question: "What is the standard deviation of identical numbers?", answer: "0" },
      { question: "What is the mean of 10, 20?", answer: "15" },
      { question: "What is the median of 2, 4, 8?", answer: "4" },
      { question: "What is the mode of 1, 1, 2?", answer: "1" },
      { question: "What is the range of 3, 7, 11?", answer: "8" },
    ],
  },
  english: {
    "1": [
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
    grammar: [
      { question: "Choose the correct sentence: She go/she goes to school.", answer: "She goes to school." },
      { question: "What is the plural of 'mouse'?", answer: "mice" },
      { question: "Fill in the blank: They ___ playing.", answer: "are" },
      { question: "What is the past tense of 'eat'?", answer: "ate" },
      { question: "Which is a verb: quickly/run?", answer: "run" },
      { question: "Fill in the blank: He ___ a car.", answer: "has" },
      { question: "What is the comparative of 'good'?", answer: "better" },
      { question: "What is the superlative of 'big'?", answer: "biggest" },
      { question: "Choose the correct word: Your/You're amazing.", answer: "You're" },
      { question: "What is the plural of 'child'?", answer: "children" },
    ],
    comprehension: [
      { question: "Read: 'Tom went to the shop.' Where did Tom go?", answer: "shop" },
      { question: "Read: 'Sara likes apples.' What does Sara like?", answer: "apples" },
      { question: "Read: 'The dog barked loudly.' What did the dog do?", answer: "barked" },
      { question: "Read: 'It is raining.' What is the weather?", answer: "raining" },
      { question: "Read: 'Ben has a bike.' What does Ben have?", answer: "bike" },
      { question: "Read: 'The sun is bright.' What is bright?", answer: "sun" },
      { question: "Read: 'Anna drew a cat.' What did Anna draw?", answer: "cat" },
      { question: "Read: 'The cake is sweet.' What is sweet?", answer: "cake" },
      { question: "Read: 'The bird can fly.' What can fly?", answer: "bird" },
      { question: "Read: 'The car is red.' What color is the car?", answer: "red" },
    ],
    writing: [
      { question: "Write a sentence using 'happy'.", answer: "Any sentence with 'happy'" },
      { question: "Write a sentence about your favorite food.", answer: "Any sentence about food" },
      { question: "Write a sentence using 'run'.", answer: "Any sentence with 'run'" },
      { question: "Write a sentence about your family.", answer: "Any sentence about family" },
      { question: "Write a sentence using 'school'.", answer: "Any sentence with 'school'" },
      { question: "Write a sentence about a pet.", answer: "Any sentence about a pet" },
      { question: "Write a sentence using 'play'.", answer: "Any sentence with 'play'" },
      { question: "Write a sentence about a book.", answer: "Any sentence about a book" },
      { question: "Write a sentence using 'friend'.", answer: "Any sentence with 'friend'" },
      { question: "Write a sentence about the weather.", answer: "Any sentence about weather" },
    ],
    vocabulary: [
      { question: "What does 'brave' mean?", answer: "Not afraid" },
      { question: "What does 'tiny' mean?", answer: "Very small" },
      { question: "What does 'quick' mean?", answer: "Fast" },
      { question: "What does 'silent' mean?", answer: "No sound" },
      { question: "What does 'gigantic' mean?", answer: "Very big" },
      { question: "What does 'ancient' mean?", answer: "Very old" },
      { question: "What does 'delicious' mean?", answer: "Tastes good" },
      { question: "What does 'fragile' mean?", answer: "Easily broken" },
      { question: "What does 'polite' mean?", answer: "Well-mannered" },
      { question: "What does 'rapid' mean?", answer: "Fast" },
    ],
  },
};

// Save completion (math/english only)
async function markLessonCompleted(subject, lessonKey) {
  try {
    const raw = await AsyncStorage.getItem("completedLessons");
    const prev = raw ? JSON.parse(raw) : { math: ["1"], english: ["1"] };
    if (!prev[subject]) prev[subject] = ["1"];
    if (!prev[subject].includes(lessonKey)) {
      prev[subject].push(lessonKey);
      await AsyncStorage.setItem("completedLessons", JSON.stringify(prev));
    }
  } catch {}
}

export default function LessonPage() {
  const router = useRouter();
  const { subject, lesson } = useLocalSearchParams();
  const lessonKey = (lesson || "1").toString();

  const exercises =
    EXERCISES?.[subject]?.[lessonKey] ? EXERCISES[subject][lessonKey] : [];

  const [currentIdx, setCurrentIdx] = React.useState(0);
  const [answers, setAnswers] = React.useState(Array(exercises.length).fill(""));
  const [checked, setChecked] = React.useState(Array(exercises.length).fill(false));
  const [showResult, setShowResult] = React.useState(false);
  const [showFinishAnim, setShowFinishAnim] = React.useState(false);
  const [animation] = React.useState(new Animated.Value(0));
  const [finishError, setFinishError] = React.useState("");

  const handleChange = (text) => {
    const newAnswers = [...answers];
    newAnswers[currentIdx] = text;
    setAnswers(newAnswers);
    if (finishError) setFinishError("");
  };

  const checkAnswer = () => {
    if (!answers[currentIdx].trim()) return; // don't check empty
    const newChecked = [...checked];
    newChecked[currentIdx] = true;
    setChecked(newChecked);
    setShowResult(true);
  };

  // Allow skipping without answering
  const goNext = () => {
    setShowResult(false);
    if (currentIdx < exercises.length - 1) {
      setCurrentIdx(currentIdx + 1);
    }
  };

  // Require all answered to finish
  const tryFinish = async () => {
    const allAnswered = answers.every((a) => a.trim().length > 0);
    if (!allAnswered) {
      setFinishError("Please answer every question before finishing.");
      return;
    }
    setFinishError("");
    setShowFinishAnim(true);
    Animated.timing(animation, {
      toValue: 1,
      duration: 1200,
      useNativeDriver: true,
    }).start(async () => {
      await markLessonCompleted(subject, lessonKey);
      router.replace({ pathname: "/path", params: { subject } });
    });
  };

  if (exercises.length === 0) {
    return (
      <View style={styles.container}>
        <Text style={styles.noExercises}>No exercises for this lesson.</Text>
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
                    outputRange: [0.7, 1.2],
                  }),
                },
              ],
            },
          ]}
        >
          <Text style={styles.finishText}>🎉 Lesson Completed! 🎉</Text>
          <Text style={styles.finishSubText}>Next lesson unlocked!</Text>
        </Animated.View>
      </View>
    );
  }

  const ex = exercises[currentIdx];
  const isCorrect =
    answers[currentIdx].trim().toLowerCase() === ex.answer.trim().toLowerCase();

  return (
    <View style={styles.container}>
      <Text style={styles.title}>
        {subject ? subject.charAt(0).toUpperCase() + subject.slice(1) : ""}{" "}
        {lessonKey.charAt(0).toUpperCase() + lessonKey.slice(1)} Lesson
      </Text>

      {finishError ? <Text style={styles.errorText}>{finishError}</Text> : null}

      <View style={styles.exerciseCard}>
        <Text style={styles.question}>
          {currentIdx + 1}. {ex.question}
        </Text>
        <TextInput
          style={styles.input}
          value={answers[currentIdx]}
          onChangeText={handleChange}
          placeholder="Your answer (you can skip and come back)"
          placeholderTextColor="#bbb"
        />
        {showResult && (
          <Text style={isCorrect ? styles.correct : styles.incorrect}>
            {isCorrect ? "Correct!" : `Answer: ${ex.answer}`}
          </Text>
        )}
      </View>

      {/* Checking is optional */}
      <Pressable
        style={[styles.checkBtn, !answers[currentIdx].trim() && { opacity: 0.5 }]}
        onPress={checkAnswer}
        disabled={!answers[currentIdx].trim()}
      >
        <Text style={styles.checkBtnTxt}>Check Answer</Text>
      </Pressable>

      {/* Next is allowed even if empty (skip) */}
      {currentIdx < exercises.length - 1 ? (
        <Pressable style={styles.nextBtn} onPress={goNext}>
          <Text style={styles.nextBtnTxt}>Next</Text>
        </Pressable>
      ) : (
        <Pressable style={styles.finishBtn} onPress={tryFinish}>
          <Text style={styles.finishBtnTxt}>Finish Lesson</Text>
        </Pressable>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#18181b", padding: 18, justifyContent: "center" },
  title: { color: "#fff", fontWeight: "800", fontSize: 22, marginBottom: 12, textAlign: "center" },
  errorText: { color: "#e04ca3", textAlign: "center", marginBottom: 10, fontWeight: "700" },
  noExercises: { color: "#e04ca3", fontSize: 16, textAlign: "center", marginVertical: 30 },
  exerciseCard: { backgroundColor: "#23232a", borderRadius: 14, padding: 16, marginBottom: 14 },
  question: { color: "#fff", fontSize: 16, fontWeight: "700", marginBottom: 8 },
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
  correct: { color: "#22c55e", fontWeight: "700", fontSize: 15, marginTop: 2 },
  incorrect: { color: "#e04ca3", fontWeight: "700", fontSize: 15, marginTop: 2 },
  checkBtn: { backgroundColor: "#22c55e", borderRadius: 10, paddingVertical: 14, alignItems: "center", marginTop: 6 },
  checkBtnTxt: { color: "#fff", fontWeight: "700", fontSize: 17, letterSpacing: 0.2 },
  nextBtn: { backgroundColor: "#2563eb", borderRadius: 10, paddingVertical: 14, alignItems: "center", marginTop: 10 },
  nextBtnTxt: { color: "#fff", fontWeight: "700", fontSize: 17, letterSpacing: 0.2 },
  finishBtn: { backgroundColor: "#e04ca3", borderRadius: 10, paddingVertical: 14, alignItems: "center", marginTop: 10 },
  finishBtnTxt: { color: "#fff", fontWeight: "700", fontSize: 17, letterSpacing: 0.2 },
  finishAnim: { alignItems: "center", justifyContent: "center", marginTop: 60 },
  finishText: { color: "#22c55e", fontWeight: "bold", fontSize: 28, textAlign: "center", marginBottom: 10 },
  finishSubText: { color: "#2563eb", fontWeight: "bold", fontSize: 18, textAlign: "center" },
});
