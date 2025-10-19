import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  TextInput,
  Button,
  Text,
  StyleSheet,
  ScrollView,
  Alert,
  ActivityIndicator,
} from 'react-native';

export default function DiagnosticScreen() {
  const [description, setDescription] = useState<string>('');
  const [response, setResponse] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  // délai en ms (change à ta convenance)
  const DELAY_MS = 800;

  // compteur round-robin
  const countersRef = useRef<Record<string, number>>({});
  const timeoutRef = useRef<number | null>(null);

  // exemples simples de réponses (à remplacer par ton categoryResponses)
  const categoryResponses: Record<string, ((desc: string) => string)[]> = {
    bruit: [
      // Réponse générique
      (d) => `(${d.slice(0, 80)}...) Ce type de bruit peut provenir d’une poulie d’accessoire ou d’un galet tendeur usé. Vérifiez la tension de la courroie et l’état des roulements.`,

      // Cas concret 1 : claquement à froid
      (d) => `(${d.slice(0, 80)}...) Un claquement à froid, qui disparaît à chaud, peut être dû à un poussoir hydraulique fatigué ou à une huile moteur trop visqueuse. Une vidange avec une huile adaptée au climat peut réduire ce bruit.`,

      // Cas concret 2 : bruit en tournant
      (d) => `(${d.slice(0, 80)}...) Un clac-clac quand tu tournes les roues peut indiquer un cardan endommagé. Vérifie les soufflets de transmission côté roue : s’ils sont déchirés, la graisse est partie et le cardan s’use vite.`,
    ],

    moteur: [
      // Réponse générique
      (d) => `(${d.slice(0, 80)}...) Ces symptômes peuvent être liés à un problème d’allumage, d’injection ou de capteurs moteur. Un passage à la valise OBD est recommandé.`,

      // Cas concret 1 : moteur tremble à chaud
      (d) => `(${d.slice(0, 80)}...) Un moteur qui tremble uniquement à chaud peut signaler une bobine d’allumage défectueuse ou un injecteur qui grippe à température. L’analyse des cylindres via OBD peut localiser le défaut.`,

      // Cas concret 2 : perte de puissance
      (d) => `(${d.slice(0, 80)}...) Une perte de puissance brutale peut venir d’un débitmètre HS, d’un turbo grippé, ou d’un mode dégradé activé suite à un capteur défectueux. Vérifie aussi le filtre à air et les durites turbo.`,
    ],

    chauffe: [
      // Réponse générique
      (d) => `(${d.slice(0, 80)}...) Vérifiez le niveau du liquide de refroidissement, l'état du thermostat, et que le ventilateur se déclenche bien.`,

      // Cas concret 1 : température monte uniquement en ville
      (d) => `(${d.slice(0, 80)}...) Si la température grimpe en ville mais redescend sur autoroute, c’est souvent le ventilateur de refroidissement qui ne s’enclenche pas (relais HS ou capteur de température défaillant).`,

      // Cas concret 2 : après remplacement de pièce
      (d) => `(${d.slice(0, 80)}...) Si le moteur chauffe après remplacement du thermostat ou d'une durite, il peut rester de l’air dans le circuit. Un purgeage complet est nécessaire sinon la circulation ne se fait pas correctement.`,
    ],

    general: [
      // Réponse générique
      (d) => `(${d.slice(0, 80)}...) Pour éviter des pannes, vérifiez régulièrement les niveaux (huile, liquide de refroidissement) et contrôlez visuellement les durites et courroies.`,

      // Cas concret 1 : voyant moteur sans symptôme
      (d) => `(${d.slice(0, 80)}...) Un voyant moteur sans symptôme peut être un défaut mineur (sonde lambda, vanne EGR encrassée). Un passage à la valise OBD permettra de savoir si c’est urgent ou non.`,

      // Cas concret 2 : bruit + voyant batterie
      (d) => `(${d.slice(0, 80)}...) Un bruit suivi d’un voyant batterie peut indiquer une courroie d’alternateur cassée. Cela entraîne aussi la perte de la direction assistée et du refroidissement. Il faut arrêter le véhicule rapidement.`,
    ],

  };


  const detectCategory = (text: string): string => {
    const t = text.toLowerCase();

    // Cas spécifiques en priorité
    if (/claquement (à|quand).*froid/.test(t)) return 'bruit';
    if (/claquement (quand|lorsque).*je tourne/.test(t)) return 'bruit';
    if (/vibre (à|quand).*chaud/.test(t)) return 'moteur';
    if (/perte de puissance/.test(t)) return 'moteur';
    if (/chauffe (uniquement|seulement).*(ville|bouchon)/.test(t)) return 'chauffe';
    if (/chauffe après.*remplacement|purge/.test(t)) return 'chauffe';
    if (/voyant moteur.*(pas de sympt[oè]me)?/.test(t)) return 'general';
    if (/voyant.*batterie.*bruit/.test(t)) return 'general';

    // Détection générale par mots-clés
    if (/\bmoteur\b/.test(t)) return 'moteur';
    if (/\bchauffe\b|\bsurchauffe\b|\btemp[ée]rature\b/.test(t)) return 'chauffe';
    if (/\bbruit\b|\bclaquement\b|\bgrincement\b|\bsifflement\b|\bcardan\b/.test(t)) return 'bruit';
    if (/\bcourroie\b|\bgalet\b|\btendeur\b/.test(t)) return 'bruit';

    return 'general';
  };


  const generateBluffNow = (desc: string) => {
    const category = detectCategory(desc);
    const responses = categoryResponses[category] ?? categoryResponses.general;
    if (!(category in countersRef.current)) countersRef.current[category] = 0;
    const idx = countersRef.current[category] % responses.length;
    countersRef.current[category] = countersRef.current[category] + 1;
    return responses[idx](desc);
  };

  const handleBluff = () => {
    if (!description.trim()) {
      Alert.alert('Erreur', 'Merci de saisir une description pour générer un bluff.');
      return;
    }

    // début du "thinking"
    setLoading(true);
    setResponse(null);

    // clear ancien timeout si nécessaire
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }

    // simule délai puis setResponse
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore - setTimeout returns number in RN environment (or Node), checked on cleanup
    timeoutRef.current = setTimeout(() => {
      const bluff = generateBluffNow(description);
      setResponse(bluff);
      setLoading(false);
      timeoutRef.current = null;
    }, DELAY_MS) as unknown as number;
  };

  // cleanup on unmount
  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
        timeoutRef.current = null;
      }
    };
  }, []);

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Entrez la description du problème</Text>

      <TextInput
        placeholder="Ex: J'entends un claquement quand je tourne le volant..."
        value={description}
        onChangeText={setDescription}
        style={styles.input}
        multiline
        editable={!loading}
      />

      <View style={{ marginBottom: 10 }}>
        <Button
          title={loading ? 'Analyse en cours...' : 'Générer une réponse IA'}
          onPress={handleBluff}
          disabled={loading}
        />
      </View>

      {loading && (
        <View style={styles.loadingRow}>
          <ActivityIndicator size="small" color="#007AFF" />
          <Text style={{ marginLeft: 10 }}>IA en cours...</Text>
        </View>
      )}

      {response && (
        <View style={styles.result}>
          <Text style={styles.resultTitle}>IA :</Text>
          <Text>{response}</Text>
        </View>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    paddingBottom: 50,
    backgroundColor: '#fff',
    flexGrow: 1,
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 15,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 10,
    minHeight: 100,
    borderRadius: 5,
    marginBottom: 12,
    textAlignVertical: 'top',
  },
  loadingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  result: {
    marginTop: 10,
    backgroundColor: '#f0f8ff',
    padding: 15,
    borderRadius: 10,
  },
  resultTitle: {
    fontWeight: 'bold',
    fontSize: 16,
    marginBottom: 8,
  },
});
