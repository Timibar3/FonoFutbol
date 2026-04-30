import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  Dimensions,
  ScrollView,
} from 'react-native';
import { PixelJersey } from '../../components/PixelJersey';
import { router } from 'expo-router';
import * as Haptics from 'expo-haptics';
import { PIXEL } from '../../src/constants/colors';
import { PLAYER_TEAMS } from '../../src/data/teams';
import { TournamentManager, WINS_PER_LEVEL } from '../../src/engine/TournamentManager';
import { TeamId } from '../../src/types';

const { width } = Dimensions.get('window');
const CARD_W = (width - 56) / 2;

export default function TeamSelectionScreen() {
  const [selectedId, setSelectedId] = useState<TeamId | null>(null);
  const [tournament, setTournament] = useState(TournamentManager.getState());

  useEffect(() => {
    const t = TournamentManager.getState();
    setTournament(t);
    if (t.selectedTeamId !== null) setSelectedId(t.selectedTeamId);
  }, []);

  const handleSelect = (id: TeamId) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    setSelectedId(id);
    TournamentManager.setTeam(id);
  };

  const handlePlay = () => {
    if (selectedId === null) return;
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    router.push('/game');
  };

  const wins = tournament.winsAtLevel;

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        <Text style={styles.titleMain}>⚽ FONO FÚTBOL ⚽</Text>
        <Text style={styles.titleSub}>¡ELEGÍ TU EQUIPO!</Text>

        {/* Level + stars */}
        <View style={styles.levelRow}>
          <View style={styles.levelBadge}>
            <Text style={styles.levelText}>NIVEL {tournament.currentLevel}</Text>
          </View>
          <View style={styles.starsRow}>
            {Array.from({ length: WINS_PER_LEVEL }).map((_, i) => (
              <Text
                key={i}
                style={[styles.star, i < wins && styles.starFilled]}
              >
                {i < wins ? '★' : '☆'}
              </Text>
            ))}
          </View>
        </View>

        {/* Team cards */}
        <View style={styles.grid}>
          {PLAYER_TEAMS.map((team) => {
            const active = selectedId === team.id;
            return (
              <TouchableOpacity
                key={team.id}
                style={[styles.card, active && styles.cardActive]}
                onPress={() => handleSelect(team.id as TeamId)}
                activeOpacity={0.82}
              >
                {active && (
                  <View style={styles.checkBadge}>
                    <Text style={styles.checkText}>✓</Text>
                  </View>
                )}
                <PixelJersey
                  primaryColor={team.primaryColor}
                  secondaryColor={team.secondaryColor}
                  stripePattern={team.stripePattern}
                  size={Math.floor(CARD_W * 0.62)}
                />
                <Text style={styles.cardName}>{team.name}</Text>
              </TouchableOpacity>
            );
          })}
        </View>

        {/* Play button */}
        <TouchableOpacity
          style={[styles.playBtn, selectedId === null && styles.playBtnOff]}
          onPress={handlePlay}
          disabled={selectedId === null}
          activeOpacity={0.8}
        >
          <Text style={styles.playBtnText}>
            {selectedId !== null ? '▶  JUGAR  ◀' : 'ELEGÍ UN EQUIPO'}
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: PIXEL.bgDark,
  },
  scroll: {
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: 20,
    paddingBottom: 32,
    gap: 16,
  },
  titleMain: {
    fontSize: 26,
    fontWeight: '900',
    color: PIXEL.gold,
    letterSpacing: 3,
    textShadowColor: '#CC6600',
    textShadowOffset: { width: 2, height: 2 },
    textShadowRadius: 0,
    textAlign: 'center',
  },
  titleSub: {
    fontSize: 14,
    fontWeight: '900',
    color: PIXEL.white,
    letterSpacing: 4,
    textAlign: 'center',
  },
  levelRow: {
    alignItems: 'center',
    gap: 10,
  },
  levelBadge: {
    backgroundColor: '#220044',
    borderWidth: 3,
    borderColor: PIXEL.gold,
    paddingHorizontal: 20,
    paddingVertical: 6,
  },
  levelText: {
    color: PIXEL.gold,
    fontSize: 16,
    fontWeight: '900',
    letterSpacing: 4,
  },
  starsRow: {
    flexDirection: 'row',
    gap: 6,
  },
  star: {
    fontSize: 30,
    color: '#555555',
  },
  starFilled: {
    color: PIXEL.gold,
    textShadowColor: '#CC6600',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 0,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    justifyContent: 'center',
    width: '100%',
  },
  card: {
    width: CARD_W,
    height: CARD_W,
    backgroundColor: '#111133',
    borderWidth: 3,
    borderColor: '#333366',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 8,
    position: 'relative',
  },
  cardActive: {
    borderColor: PIXEL.gold,
    backgroundColor: '#221155',
    shadowColor: PIXEL.gold,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.9,
    shadowRadius: 10,
    elevation: 10,
  },
  checkBadge: {
    position: 'absolute',
    top: 6,
    right: 6,
    backgroundColor: PIXEL.gold,
    width: 26,
    height: 26,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1,
  },
  checkText: {
    color: PIXEL.black,
    fontWeight: '900',
    fontSize: 15,
  },
  jersey: {
    width: CARD_W * 0.62,
    height: CARD_W * 0.62,
  },
  cardName: {
    color: PIXEL.white,
    fontSize: 10,
    fontWeight: '900',
    letterSpacing: 2,
    textAlign: 'center',
    marginTop: 4,
    textShadowColor: PIXEL.black,
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 0,
  },
  playBtn: {
    backgroundColor: PIXEL.btnGreen,
    borderWidth: 3,
    borderColor: PIXEL.black,
    borderBottomWidth: 7,
    borderBottomColor: PIXEL.btnGreenDark,
    paddingVertical: 18,
    alignSelf: 'stretch',
    alignItems: 'center',
    marginTop: 4,
  },
  playBtnOff: {
    backgroundColor: PIXEL.btnGray,
    borderBottomColor: PIXEL.btnGrayDark,
  },
  playBtnText: {
    color: PIXEL.white,
    fontSize: 22,
    fontWeight: '900',
    letterSpacing: 4,
    textShadowColor: PIXEL.black,
    textShadowOffset: { width: 2, height: 2 },
    textShadowRadius: 0,
  },
});
