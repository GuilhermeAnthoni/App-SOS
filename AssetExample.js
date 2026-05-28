import React, { useState } from "react";
import {
  View,
  Text,
 StyleSheet,
  TouchableOpacity,
  TextInput,
  FlatList,
  ScrollView,
  Linking
} from "react-native";

import styles from "./styles";

import * as Contacts from "expo-contacts";
import * as Location from "expo-location";
import * as SMS from "expo-sms";

export default function App() {

  const [menuOpen, setMenuOpen] = useState(false);
  const [screen, setScreen] = useState("home");

  const [contacts, setContacts] = useState([]);
  const [name, setName] = useState("");
  const [number, setNumber] = useState("");

  // ✅ Enviar mensagem SOS
  async function sendEmergencyMessage() {

    if (contacts.length === 0) {
      alert("Adicione pelo menos um contato");
      return;
    }

    let { status } =
      await Location.requestForegroundPermissionsAsync();

    if (status !== "granted") {
      alert("Permissão de localização negada");
      return;
    }

    let location =
      await Location.getCurrentPositionAsync({});

    const latitude = location.coords.latitude;
    const longitude = location.coords.longitude;

    const message =
`🚨 EMERGÊNCIA 🚨

Preciso de ajuda!

Minha localização:
https://maps.google.com/?q=${latitude},${longitude}`;

    const phoneNumbers =
      contacts.map(contact => contact.number);

    const isAvailable =
      await SMS.isAvailableAsync();

    if (isAvailable) {

      await SMS.sendSMSAsync(
        phoneNumbers,
        message
      );

    } else {
      alert("SMS não disponível neste dispositivo");
    }
  }

  // ✅ Adicionar contato
  function addContact() {

    if (!name || !number) {
      alert("Preencha nome e número");
      return;
    }

    const newContact = {
      id: Date.now().toString(),
      name: name,
      number: number
    };

    setContacts(prevContacts => [...prevContacts, newContact]);

    setName("");
    setNumber("");
  }

  // ✅ Escolher contato da agenda
  async function pickContact() {

    const { status } =
      await Contacts.requestPermissionsAsync();

    if (status !== "granted") {
      alert("Permissão negada");
      return;
    }

    const { data } =
      await Contacts.getContactsAsync({
        fields: [Contacts.Fields.PhoneNumbers],
      });

    if (data.length > 0) {

      const contact = data.find(
        c => c.phoneNumbers &&
        c.phoneNumbers.length > 0
      );

      if (contact) {

        const newContact = {
          id: Date.now().toString(),
          name: contact.name,
          number: contact.phoneNumbers[0].number
        };

        setContacts(prev => [...prev, newContact]);

        alert("Contato adicionado com sucesso!");
      }
    }
  }

  // ✅ Remover contato
  function removeContact(id) {

    const updated =
      contacts.filter(item => item.id !== id);

    setContacts(updated);
  }

  // 📄 Tela contatos
  if (screen === "contatos") {

    return (
      <View style={styles.container}>

        <Text style={styles.logo}>
          Contatos de Emergência
        </Text>

        <TextInput
          placeholder="Nome"
          placeholderTextColor="#94a3b8"
          style={styles.input}
          value={name}
          onChangeText={setName}
        />

        <TextInput
          placeholder="Número"
          placeholderTextColor="#94a3b8"
          style={styles.input}
          keyboardType="numeric"
          value={number}
          onChangeText={setNumber}
        />

        <TouchableOpacity
          style={styles.addButton}
          onPress={addContact}
        >
          <Text style={styles.buttonText}>
            Adicionar contato
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.importButton}
          onPress={pickContact}
        >
          <Text style={styles.buttonText}>
            Escolher da agenda
          </Text>
        </TouchableOpacity>

        <FlatList
          data={contacts}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (

            <View style={styles.contactRow}>

              <View>
                <Text style={styles.contactName}>
                  {item.name}
                </Text>

                <Text style={styles.contactNumber}>
                  {item.number}
                </Text>
              </View>

              <Text
                style={styles.removeContact}
                onPress={() => removeContact(item.id)}
              >
                Remover
              </Text>

            </View>

          )}
        />

        <TouchableOpacity
          style={styles.backButton}
          onPress={() => setScreen("home")}
        >
          <Text style={styles.buttonText}>
            Voltar
          </Text>
        </TouchableOpacity>

      </View>
    );
  }

  // 📄 Tela Jurídica
  if (screen === "juridico") {

    return (

      <ScrollView style={styles.container}>

        <Text style={styles.logo}>
          Guia Jurídico
        </Text>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>
            Lei Maria da Penha
          </Text>

          <Text style={styles.cardText}>
            A Lei Maria da Penha protege mulheres contra violência doméstica e familiar.
          </Text>
        </View>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>
            Telefones de Emergência
          </Text>

          <Text style={styles.cardText}>
            Polícia Militar: 190
          </Text>

          <Text style={styles.cardText}>
            Central da Mulher: 180
          </Text>

          <Text style={styles.cardText}>
            SAMU: 192
          </Text>
        </View>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>
            Como denunciar
          </Text>

          <Text style={styles.cardText}>
            Procure uma delegacia, ligue 180 ou registre boletim online.
          </Text>
        </View>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>
            Medidas protetivas
          </Text>

          <Text style={styles.cardText}>
            A vítima pode solicitar medidas protetivas para afastamento do agressor.
          </Text>
        </View>

        <TouchableOpacity
          style={styles.backButton}
          onPress={() => setScreen("home")}
        >
          <Text style={styles.buttonText}>
            Voltar
          </Text>
        </TouchableOpacity>

      </ScrollView>

    );
  }

  // 📄 Tela Vídeos
  if (screen === "videos") {

    const videos = [

      {
        id: "1",
        title: "Defesa pessoal feminina básica",
        url: "https://www.youtube.com/watch?v=KVpxP3ZZtAc"
      },

      {
        id: "2",
        title: "Como escapar de agarrões",
        url: "https://www.youtube.com/watch?v=6QzPON0ifn8"
      },

      {
        id: "3",
        title: "Técnicas de proteção para mulheres",
        url: "https://www.youtube.com/watch?v=Vw5s0z0u5xA"
      },

      {
        id: "4",
        title: "Autodefesa rápida e eficiente",
        url: "https://www.youtube.com/watch?v=cycIvYl2M7c"
      }

    ];

    return (

      <ScrollView style={styles.container}>

        <Text style={styles.logo}>
          Vídeos de Autodefesa
        </Text>

        {videos.map((video) => (

          <TouchableOpacity
            key={video.id}
            style={styles.videoCard}
            onPress={() => Linking.openURL(video.url)}
          >

            <Text style={styles.videoTitle}>
              {video.title}
            </Text>

            <Text style={styles.videoLink}>
              Assistir vídeo
            </Text>

          </TouchableOpacity>

        ))}

        <TouchableOpacity
          style={styles.backButton}
          onPress={() => setScreen("home")}
        >
          <Text style={styles.buttonText}>
            Voltar
          </Text>
        </TouchableOpacity>

      </ScrollView>

    );
  }

  // 📄 Tela principal
  return (
    <View style={styles.container}>

      {/* MENU BUTTON */}
      <TouchableOpacity
        style={styles.menuButton}
        onPress={() => setMenuOpen(!menuOpen)}
      >
        <Text style={styles.menuIcon}>☰</Text>
      </TouchableOpacity>

      {/* MENU */}
      {menuOpen && (

        <View style={styles.overlay}>

          <TouchableOpacity
            style={{ flex: 1 }}
            activeOpacity={1}
            onPress={() => setMenuOpen(false)}
          />

          <View style={styles.menu}>

            <Text style={styles.menuTitle}>
              Menu
            </Text>

            <TouchableOpacity
              style={styles.menuItem}
              onPress={() => {
                setMenuOpen(false);
                setScreen("contatos");
              }}
            >
              <Text style={styles.menuText}>
                Contato de emergência
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.menuItem}
              onPress={() => {
                setMenuOpen(false);
                setScreen("juridico");
              }}
            >
              <Text style={styles.menuText}>
                Guia Jurídico
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.menuItem}
              onPress={() => {
                setMenuOpen(false);
                setScreen("videos");
              }}
            >
              <Text style={styles.menuText}>
                Vídeos de Autodefesa
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.closeButton}
              onPress={() => setMenuOpen(false)}
            >
              <Text style={styles.closeText}>
                Fechar
              </Text>
            </TouchableOpacity>

          </View>

        </View>
      )}

      {/* HEADER */}
      <View style={styles.header}>
        <Text style={styles.logo}>
          SOS Mulher
        </Text>

        <Text style={styles.subtitle}>
          Segurança em primeiro lugar
        </Text>
      </View>

      {/* SOS */}
      <View style={styles.centerArea}>

        <TouchableOpacity
          style={styles.sosButton}
          onPress={sendEmergencyMessage}
        >
          <Text style={styles.sosText}>
            SOS
          </Text>
        </TouchableOpacity>

        <Text style={styles.instruction}>
          Pressione em caso de emergência
        </Text>

      </View>

      {/* FOOTER */}
      <View style={styles.footer}>
        <Text style={styles.footerText}>
          Sua localização será compartilhada com seus guardiões
        </Text>
      </View>

    </View>
  );
}