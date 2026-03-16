import { StatusBar } from "expo-status-bar";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  Linking,
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from "react-native";

export default function App() {
  const [loading, setLoading] = useState(true);
  const [news, setNews] = useState([]);
  const [error, setError] = useState("");
  const [summary, setSummary] = useState("");

  useEffect(() => {
    fetch("https://hn.algolia.com/api/v1/search?tags=front_page")
      .then((res) => res.json())
      .then((data) => {
        setNews(data.hits || []);
      })
      .catch(() => {
        setError("Could not load news");
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <SafeAreaView style={styles.center}>
        <ActivityIndicator size="large" />
        <Text style={styles.smallText}>Loading...</Text>
      </SafeAreaView>
    );
  }

  if (error) {
    return (
      <SafeAreaView style={styles.center}>
        <Text>{error}</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Simple News</Text>
      </View>
      <FlatList
        data={news}
        keyExtractor={(item) => String(item.objectID)}
        contentContainerStyle={styles.list}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <TouchableOpacity onPress={() => item.url && Linking.openURL(item.url)}>
              <Text style={styles.cardTitle}>{item.title || "No title"}</Text>
              <Text style={styles.meta}>{item.author || "unknown"}</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.aiButton}
              onPress={async () => {
                const res = await fetch("http://loacalhost:5000/summary", {
                  method: "POST",
                  headers: {
                    "Content-Type": "application/json"
                  },
                  body: JSON.stringify({ title: item.title })
                });

                const data = await res.json();
                setSummary(data.summary);
              }}
            >
              <Text style={styles.aiText}>✨ AI Summary</Text>
            </TouchableOpacity>
          </View>
        )}
      />
      {summary !== "" && (
        <View style={styles.summaryBox}>
          <Text style={{ fontWeight: "bold" }}>AI Summary</Text>
          <Text>{summary}</Text>
        </View>
      )}
      <StatusBar style="auto" />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  aiButton: {
    marginTop: 10,
    backgroundColor: "#000",
    padding: 6,
    borderRadius: 6,
    alignSelf: "flex-start"
  },

  aiText: {
    color: "#fff",
    fontSize: 12
  },

  summaryBox: {
    backgroundColor: "#fff",
    padding: 12,
    borderTopWidth: 1,
    borderColor: "#ddd"
  },
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5"
  },
  center: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    gap: 8
  },
  smallText: {
    fontSize: 14,
    color: "#555"
  },
  header: {
    paddingHorizontal: 16,
    paddingTop: 14,
    paddingBottom: 10,
    backgroundColor: "#fff",
    borderBottomWidth: 1,
    borderBottomColor: "#ddd"
  },
  title: {
    fontSize: 24,
    fontWeight: "700"
  },
  list: {
    padding: 12,
    gap: 10
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: 8,
    padding: 12,
    borderWidth: 1,
    borderColor: "#e5e5e5"
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 6
  },
  meta: {
    fontSize: 12,
    color: "#666"
  }
});
