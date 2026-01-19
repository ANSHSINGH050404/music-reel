import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ScrollView,
  Animated,
} from "react-native";
import * as DocumentPicker from "expo-document-picker";
import { useState, useRef, useEffect } from "react";
import { LinearGradient } from "expo-linear-gradient";

const API_URL = "http://10.108.18.141:3000/api";

export default function UploadHookScreen() {
  const [audio, setAudio] = useState<any>(null);
  const [songName, setSongName] = useState("");
  const [artistName, setArtistName] = useState("");
  const [category, setCategory] = useState("");
  const [duration, setDuration] = useState("");

  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [success, setSuccess] = useState(false);

  const pulseAnim = useRef(new Animated.Value(1)).current;
  const successAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (success) {
      Animated.spring(successAnim, {
        toValue: 1,
        useNativeDriver: true,
        tension: 50,
        friction: 7,
      }).start();
    } else {
      successAnim.setValue(0);
    }
  }, [success]);

  useEffect(() => {
    if (uploading) {
      const pulse = Animated.loop(
        Animated.sequence([
          Animated.timing(pulseAnim, {
            toValue: 1.05,
            duration: 1000,
            useNativeDriver: true,
          }),
          Animated.timing(pulseAnim, {
            toValue: 1,
            duration: 1000,
            useNativeDriver: true,
          }),
        ])
      );
      pulse.start();
      return () => pulse.stop();
    }
  }, [uploading]);

  const pickAudio = async () => {
    const res = await DocumentPicker.getDocumentAsync({
      type: "audio/*",
    });

    if (!res.canceled) {
      setAudio(res.assets[0]);
      setSuccess(false);
      setProgress(0);
    }
  };

  const uploadHook = () => {
    if (!audio) {
      Alert.alert("Error", "Please select an audio file");
      return;
    }

    setUploading(true);
    setSuccess(false);
    setProgress(0);

    const formData = new FormData();

    formData.append("audio", {
      uri: audio.uri,
      name: audio.name,
      type: audio.mimeType || "audio/mpeg",
    } as any);

    formData.append("song_name", songName);
    formData.append("artist_name", artistName);
    formData.append("category", category);
    formData.append("duration", duration);

    const xhr = new XMLHttpRequest();

    xhr.open("POST", `${API_URL}/hooks/upload`);

    xhr.upload.onprogress = (event) => {
      if (event.lengthComputable) {
        const percent = Math.round((event.loaded / event.total) * 100);
        setProgress(percent);
      }
    };

    xhr.onload = () => {
      setUploading(false);

      if (xhr.status === 201) {
        setSuccess(true);
        Alert.alert("Success", "Hook uploaded successfully 🎉");

        setAudio(null);
        setSongName("");
        setArtistName("");
        setCategory("");
        setDuration("");
      } else {
        Alert.alert("Error", "Upload failed");
      }
    };

    xhr.onerror = () => {
      setUploading(false);
      Alert.alert("Error", "Network error");
    };

    xhr.send(formData);
  };

  const categories = ["Sad", "Love", "Chill",];

  return (
    <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
      <View style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.emoji}>🎵</Text>
          <Text style={styles.title}>Upload Your Hook</Text>
          <Text style={styles.subtitle}>Share your music with the world</Text>
        </View>

        {/* Audio File Picker */}
        <TouchableOpacity
          style={[styles.filePicker, audio && styles.filePickerSelected]}
          onPress={pickAudio}
          activeOpacity={0.7}
        >
          {audio ? (
            <View style={styles.fileSelectedContent}>
              <View style={styles.fileIcon}>
                <Text style={styles.fileIconText}>🎵</Text>
              </View>
              <View style={styles.fileDetails}>
                <Text style={styles.fileName} numberOfLines={1}>
                  {audio.name}
                </Text>
                <Text style={styles.fileSize}>
                  {(audio.size / 1024 / 1024).toFixed(2)} MB
                </Text>
              </View>
              <Text style={styles.changeText}>Change</Text>
            </View>
          ) : (
            <View style={styles.filePickerContent}>
              <View style={styles.uploadIconContainer}>
                <Text style={styles.uploadIcon}>📁</Text>
              </View>
              <Text style={styles.filePickerTitle}>Select Audio File</Text>
              <Text style={styles.filePickerSubtitle}>Tap to browse your files</Text>
            </View>
          )}
        </TouchableOpacity>

        {/* Form Inputs */}
        <View style={styles.formSection}>
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Song Name</Text>
            <TextInput
              placeholder="Enter song name"
              placeholderTextColor="#999"
              value={songName}
              onChangeText={setSongName}
              style={styles.input}
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Artist Name</Text>
            <TextInput
              placeholder="Enter artist name"
              placeholderTextColor="#999"
              value={artistName}
              onChangeText={setArtistName}
              style={styles.input}
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Category</Text>
            <View style={styles.categoryContainer}>
              {categories.map((cat) => (
                <TouchableOpacity
                  key={cat}
                  style={[
                    styles.categoryChip,
                    category === cat && styles.categoryChipActive,
                  ]}
                  onPress={() => setCategory(cat)}
                  activeOpacity={0.7}
                >
                  <Text
                    style={[
                      styles.categoryChipText,
                      category === cat && styles.categoryChipTextActive,
                    ]}
                  >
                    {cat}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Duration (seconds)</Text>
            <TextInput
              placeholder="10 - 30"
              placeholderTextColor="#999"
              value={duration}
              onChangeText={setDuration}
              keyboardType="numeric"
              style={styles.input}
            />
          </View>
        </View>

        {/* Upload Progress */}
        {uploading && (
          <Animated.View
            style={[styles.progressContainer, { transform: [{ scale: pulseAnim }] }]}
          >
            <View style={styles.progressHeader}>
              <Text style={styles.progressLabel}>Uploading...</Text>
              <Text style={styles.progressPercent}>{progress}%</Text>
            </View>
            <View style={styles.progressBarContainer}>
              <View style={styles.progressBarBg}>
                <Animated.View
                  style={[
                    styles.progressBarFill,
                    {
                      width: `${progress}%`,
                    },
                  ]}
                />
              </View>
            </View>
          </Animated.View>
        )}

        {/* Success Message */}
        {success && (
          <Animated.View
            style={[
              styles.successContainer,
              {
                opacity: successAnim,
                transform: [
                  {
                    scale: successAnim.interpolate({
                      inputRange: [0, 1],
                      outputRange: [0.8, 1],
                    }),
                  },
                ],
              },
            ]}
          >
            <Text style={styles.successIcon}>✨</Text>
            <Text style={styles.successTitle}>Upload Successful!</Text>
            <Text style={styles.successMessage}>Your hook is now live</Text>
          </Animated.View>
        )}

        {/* Upload Button */}
        <TouchableOpacity
          style={[styles.uploadButton, uploading && styles.uploadButtonDisabled]}
          onPress={uploadHook}
          disabled={uploading}
          activeOpacity={0.8}
        >
          <LinearGradient
            colors={uploading ? ["#94a3b8", "#64748b"] : ["#8b5cf6", "#6366f1"]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.uploadButtonGradient}
          >
            <Text style={styles.uploadButtonText}>
              {uploading ? "Uploading..." : "Upload Hook"}
            </Text>
            {!uploading && <Text style={styles.uploadButtonIcon}>🚀</Text>}
          </LinearGradient>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scrollView: {
    flex: 1,
    backgroundColor: "#f8fafc",
  },
  scrollContent: {
    flexGrow: 1,
  },
  container: {
    flex: 1,
    padding: 24,
    paddingTop: 60,
  },
  header: {
    alignItems: "center",
    marginBottom: 32,
  },
  emoji: {
    fontSize: 56,
    marginBottom: 12,
  },
  title: {
    fontSize: 32,
    fontWeight: "800",
    color: "#0f172a",
    marginBottom: 8,
    letterSpacing: -0.5,
  },
  subtitle: {
    fontSize: 16,
    color: "#64748b",
    fontWeight: "500",
  },
  filePicker: {
    backgroundColor: "#ffffff",
    borderRadius: 20,
    padding: 24,
    marginBottom: 24,
    borderWidth: 2,
    borderColor: "#e2e8f0",
    borderStyle: "dashed",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  filePickerSelected: {
    borderColor: "#8b5cf6",
    borderStyle: "solid",
    backgroundColor: "#f5f3ff",
  },
  filePickerContent: {
    alignItems: "center",
  },
  uploadIconContainer: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: "#f1f5f9",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 16,
  },
  uploadIcon: {
    fontSize: 36,
  },
  filePickerTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#0f172a",
    marginBottom: 4,
  },
  filePickerSubtitle: {
    fontSize: 14,
    color: "#64748b",
  },
  fileSelectedContent: {
    flexDirection: "row",
    alignItems: "center",
  },
  fileIcon: {
    width: 56,
    height: 56,
    borderRadius: 12,
    backgroundColor: "#8b5cf6",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 16,
  },
  fileIconText: {
    fontSize: 28,
  },
  fileDetails: {
    flex: 1,
  },
  fileName: {
    fontSize: 16,
    fontWeight: "700",
    color: "#0f172a",
    marginBottom: 4,
  },
  fileSize: {
    fontSize: 14,
    color: "#64748b",
  },
  changeText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#8b5cf6",
  },
  formSection: {
    gap: 20,
    marginBottom: 24,
  },
  inputGroup: {
    gap: 8,
  },
  label: {
    fontSize: 14,
    fontWeight: "700",
    color: "#334155",
    marginLeft: 4,
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  input: {
    backgroundColor: "#ffffff",
    borderWidth: 2,
    borderColor: "#e2e8f0",
    padding: 16,
    borderRadius: 14,
    fontSize: 16,
    color: "#0f172a",
    fontWeight: "500",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 1,
  },
  categoryContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
  },
  categoryChip: {
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 12,
    backgroundColor: "#ffffff",
    borderWidth: 2,
    borderColor: "#e2e8f0",
  },
  categoryChipActive: {
    backgroundColor: "#8b5cf6",
    borderColor: "#8b5cf6",
  },
  categoryChipText: {
    fontSize: 14,
    fontWeight: "700",
    color: "#64748b",
  },
  categoryChipTextActive: {
    color: "#ffffff",
  },
  progressContainer: {
    backgroundColor: "#ffffff",
    borderRadius: 16,
    padding: 20,
    marginBottom: 24,
    shadowColor: "#8b5cf6",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 4,
  },
  progressHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  progressLabel: {
    fontSize: 15,
    fontWeight: "700",
    color: "#334155",
  },
  progressPercent: {
    fontSize: 18,
    fontWeight: "800",
    color: "#8b5cf6",
  },
  progressBarContainer: {
    marginBottom: 4,
  },
  progressBarBg: {
    height: 10,
    backgroundColor: "#f1f5f9",
    borderRadius: 5,
    overflow: "hidden",
  },
  progressBarFill: {
    height: "100%",
    backgroundColor: "#8b5cf6",
    borderRadius: 5,
  },
  successContainer: {
    backgroundColor: "#f0fdf4",
    borderRadius: 16,
    padding: 24,
    marginBottom: 24,
    alignItems: "center",
    borderWidth: 2,
    borderColor: "#22c55e",
  },
  successIcon: {
    fontSize: 48,
    marginBottom: 12,
  },
  successTitle: {
    fontSize: 20,
    fontWeight: "800",
    color: "#15803d",
    marginBottom: 4,
  },
  successMessage: {
    fontSize: 14,
    color: "#16a34a",
    fontWeight: "600",
  },
  uploadButton: {
    borderRadius: 16,
    overflow: "hidden",
    shadowColor: "#8b5cf6",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 16,
    elevation: 8,
  },
  uploadButtonDisabled: {
    shadowOpacity: 0.1,
  },
  uploadButtonGradient: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    padding: 18,
    gap: 10,
  },
  uploadButtonText: {
    color: "#ffffff",
    fontSize: 18,
    fontWeight: "800",
    letterSpacing: 0.3,
  },
  uploadButtonIcon: {
    fontSize: 20,
  },
});