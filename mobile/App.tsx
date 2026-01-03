import { useEffect, useState } from "react";
import { SafeAreaView, Text, View, Pressable, ScrollView, TextInput } from "react-native";
import { fetchMyTickets, validateTicket, type Ticket } from "./api";

type Tab = "tickets" | "validate";

export default function App() {
  const [tab, setTab] = useState<Tab>("tickets");
  const [error, setError] = useState("");
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [qrPayload, setQrPayload] = useState("");
  const [validateResult, setValidateResult] = useState<string>("");

  async function loadTickets() {
    setError("");
    try {
      const t = await fetchMyTickets();
      setTickets(t);
    } catch (e: any) {
      setError(e?.message ?? "Failed to load tickets");
    }
  }

  useEffect(() => {
    loadTickets();
  }, []);

  async function onValidate() {
    setError("");
    setValidateResult("");
    try {
      const { status, json } = await validateTicket(qrPayload);
      setValidateResult(`HTTP ${status}\n${JSON.stringify(json, null, 2)}`);
      await loadTickets();
    } catch (e: any) {
      setError(e?.message ?? "Validate failed");
    }
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "white" }}>
      <View style={{ padding: 16, borderBottomWidth: 1, borderColor: "#eee" }}>
        <Text style={{ fontSize: 22, fontWeight: "700" }}>BEASTPass Mobile</Text>
        <Text style={{ opacity: 0.7, marginTop: 4 }}>My Tickets + Validate (scanner next)</Text>

        <View style={{ flexDirection: "row", gap: 10, marginTop: 12 }}>
          <TabButton label="Tickets" active={tab === "tickets"} onPress={() => setTab("tickets")} />
          <TabButton label="Validate" active={tab === "validate"} onPress={() => setTab("validate")} />
        </View>

        {error ? (
          <View style={{ marginTop: 12, padding: 10, borderWidth: 1, borderColor: "#f99", borderRadius: 10 }}>
            <Text style={{ fontWeight: "700" }}>Error</Text>
            <Text>{error}</Text>
          </View>
        ) : null}
      </View>

      {tab === "tickets" ? (
        <ScrollView contentContainerStyle={{ padding: 16, gap: 12 }}>
          <Pressable
            onPress={loadTickets}
            style={{ padding: 12, borderRadius: 10, borderWidth: 1, borderColor: "#333", backgroundColor: "#111" }}
          >
            <Text style={{ color: "white", textAlign: "center", fontWeight: "700" }}>Refresh Tickets</Text>
          </Pressable>

          {tickets.length === 0 ? (
            <Text style={{ opacity: 0.7 }}>No tickets yet. Buy one on the web first.</Text>
          ) : null}

          {tickets.map((t) => (
            <View key={t.id} style={{ borderWidth: 1, borderColor: "#ddd", borderRadius: 12, padding: 12 }}>
              <Text style={{ fontWeight: "700" }}>{t.id}</Text>
              <Text style={{ opacity: 0.8 }}>Event: {t.eventId}</Text>
              <Text style={{ opacity: 0.8 }}>Tier: {t.tierId}</Text>
              <Text style={{ opacity: 0.8 }}>Status: {t.status}</Text>

              <Text style={{ marginTop: 10, opacity: 0.7 }}>QR payload (copy into Validate tab):</Text>
              <Text style={{ fontFamily: "Courier", fontSize: 12, marginTop: 6 }}>{t.qrPayload}</Text>
            </View>
          ))}
        </ScrollView>
      ) : (
        <ScrollView contentContainerStyle={{ padding: 16, gap: 12 }}>
          <Text style={{ fontWeight: "700" }}>Validate ticket</Text>
          <Text style={{ opacity: 0.7 }}>
            For now paste the QR payload. Later you’ll replace this with camera QR scan.
          </Text>

          <TextInput
            value={qrPayload}
            onChangeText={setQrPayload}
            placeholder='{"ticketId":"...","eventId":"...","orderId":"..."}'
            multiline
            style={{
              borderWidth: 1,
              borderColor: "#ddd",
              borderRadius: 12,
              padding: 12,
              minHeight: 120,
              textAlignVertical: "top",
              fontFamily: "Courier",
            }}
          />

          <Pressable
            onPress={onValidate}
            disabled={!qrPayload.trim()}
            style={{
              padding: 12,
              borderRadius: 10,
              borderWidth: 1,
              borderColor: "#333",
              backgroundColor: qrPayload.trim() ? "#111" : "#777",
            }}
          >
            <Text style={{ color: "white", textAlign: "center", fontWeight: "700" }}>
              Validate
            </Text>
          </Pressable>

          {validateResult ? (
            <View style={{ borderWidth: 1, borderColor: "#ddd", borderRadius: 12, padding: 12 }}>
              <Text style={{ fontWeight: "700" }}>Result</Text>
              <Text style={{ marginTop: 8, fontFamily: "Courier", fontSize: 12 }}>
                {validateResult}
              </Text>
            </View>
          ) : null}
        </ScrollView>
      )}
    </SafeAreaView>
  );
}

function TabButton({ label, active, onPress }: { label: string; active: boolean; onPress: () => void }) {
  return (
    <Pressable
      onPress={onPress}
      style={{
        paddingVertical: 8,
        paddingHorizontal: 12,
        borderRadius: 999,
        borderWidth: 1,
        borderColor: active ? "#111" : "#ddd",
        backgroundColor: active ? "#111" : "transparent",
      }}
    >
      <Text style={{ color: active ? "white" : "#111", fontWeight: "700" }}>{label}</Text>
    </Pressable>
  );
}
