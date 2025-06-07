import { type Participant } from "../../../types/types";

/**
 * Utility functions for percentage calculations and formatting
 */
export const metricUtils = {
  /**
   * Calculate percentage with rounding to one decimal place
   */
  calculatePercent: (value: number, total: number): number => {
    if (!total) return 0;
    return (value / total) * 100;
  },

  /**
   * Format a percentage for display (round to nearest integer)
   */
  formatPercent: (value: number): number => {
    return Math.round(value);
  },

  /**
   * Format a percentage for trend display (round to one decimal place)
   */
  formatTrendPercent: (value: number): number => {
    return Math.round(value * 10) / 10;
  },

  /**
   * Filter participants by age range
   */
  filterByAge: (
    participants: Participant[],
    minAge: number,
    maxAge?: number
  ): Participant[] => {
    return participants.filter(p => {
      const age = Number(p.age);
      if (maxAge) {
        return age >= minAge && age <= maxAge;
      }
      return age >= minAge;
    });
  },

  /**
   * Filter participants by sex
   */
  filterBySex: (participants: Participant[], sex: string): Participant[] => {
    return participants.filter(p => p.sex?.toLowerCase() === sex.toLowerCase());
  },

  /**
   * Filter participants by disability status
   */
  filterByDisability: (
    participants: Participant[],
    hasPWD: boolean
  ): Participant[] => {
    return participants.filter(p => (p.isPWD === "yes") === hasPWD);
  },
};

/**
 * Hook for calculating participant metrics
 */
export function useParticipantMetrics(participants: Participant[]) {
  const {
    calculatePercent,
    filterByAge,
    filterBySex,
    filterByDisability,
    formatPercent,
    formatTrendPercent,
  } = metricUtils;

  // Total metrics
  const totalParticipants = participants.length;

  // Gender metrics
  const females = filterBySex(participants, "female");
  const males = filterBySex(participants, "male");
  const totalFemales = females.length;
  const totalMales = males.length;
  const femalePercent = calculatePercent(totalFemales, totalParticipants);
  const malePercent = calculatePercent(totalMales, totalParticipants);

  // Age group metrics
  const femalesYoung = filterByAge(females, 15, 35);
  const femalesOlder = filterByAge(females, 36);
  const malesYoung = filterByAge(males, 15, 35);
  const malesOlder = filterByAge(males, 36);

  const youngFemalePercent = calculatePercent(
    femalesYoung.length,
    totalFemales
  );
  const olderFemalePercent = calculatePercent(
    femalesOlder.length,
    totalFemales
  );
  const youngMalePercent = calculatePercent(malesYoung.length, totalMales);
  const olderMalePercent = calculatePercent(malesOlder.length, totalMales);

  // Disability metrics
  const disabled = filterByDisability(participants, true);
  const disabledMales = filterBySex(disabled, "male");
  const disabledFemales = filterBySex(disabled, "female");
  const disabledPercent = calculatePercent(disabled.length, totalParticipants);
  const disabledMalePercent = calculatePercent(
    disabledMales.length,
    disabled.length
  );
  const disabledFemalePercent = calculatePercent(
    disabledFemales.length,
    disabled.length
  );

  return {
    // Total
    totalParticipants,

    // Gender
    females,
    males,
    totalFemales,
    totalMales,
    femalePercent,
    malePercent,

    // Age groups
    femalesYoung,
    femalesOlder,
    malesYoung,
    malesOlder,
    youngFemalePercent,
    olderFemalePercent,
    youngMalePercent,
    olderMalePercent,

    // Disability
    disabled,
    disabledMales,
    disabledFemales,
    disabledPercent,
    disabledMalePercent,
    disabledFemalePercent,

    // Formatters
    formatPercent,
    formatTrendPercent,
  };
}
