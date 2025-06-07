"use server";

import { db } from "@/lib/db";
import { participants } from "@/lib/db/schema";
import { eq, and, count, sql } from "drizzle-orm";
import { type CountResult } from "../types/types";

export async function getParticipantMetrics(clusterId: string) {
  try {
    // Total participants
    const totalParticipants: CountResult = await db
      .select({ count: count() })
      .from(participants)
      .where(eq(participants.cluster_id, clusterId))
      .then(res => res[0]);

    // Total females
    const totalFemales: CountResult = await db
      .select({ count: count() })
      .from(participants)
      .where(
        and(
          eq(participants.cluster_id, clusterId),
          eq(participants.sex, "female")
        )
      )
      .then(res => res[0]);

    // Females aged 15-35
    const femalesYouth: CountResult = await db
      .select({ count: count() })
      .from(participants)
      .where(
        and(
          eq(participants.cluster_id, clusterId),
          eq(participants.sex, "female"),
          sql`${participants.age} >= 15`,
          sql`${participants.age} <= 35`
        )
      )
      .then(res => res[0]);

    // Females > 35
    const femalesOlder: CountResult = await db
      .select({ count: count() })
      .from(participants)
      .where(
        and(
          eq(participants.cluster_id, clusterId),
          eq(participants.sex, "female"),
          sql`${participants.age} > 35`
        )
      )
      .then(res => res[0]);

    // Total males
    const totalMales: CountResult = await db
      .select({ count: count() })
      .from(participants)
      .where(
        and(
          eq(participants.cluster_id, clusterId),
          eq(participants.sex, "male")
        )
      )
      .then(res => res[0]);

    // Males aged 15-35
    const malesYouth: CountResult = await db
      .select({ count: count() })
      .from(participants)
      .where(
        and(
          eq(participants.cluster_id, clusterId),
          eq(participants.sex, "male"),
          sql`${participants.age} >= 15`,
          sql`${participants.age} <= 35`
        )
      )
      .then(res => res[0]);

    // Males > 35
    const malesOlder: CountResult = await db
      .select({ count: count() })
      .from(participants)
      .where(
        and(
          eq(participants.cluster_id, clusterId),
          eq(participants.sex, "male"),
          sql`${participants.age} > 35`
        )
      )
      .then(res => res[0]);

    // Total persons with disabilities
    const totalPWD: CountResult = await db
      .select({ count: count() })
      .from(participants)
      .where(
        and(
          eq(participants.cluster_id, clusterId),
          eq(participants.isPWD, "yes")
        )
      )
      .then(res => res[0]);

    // Male persons with disabilities
    const pwdMale: CountResult = await db
      .select({ count: count() })
      .from(participants)
      .where(
        and(
          eq(participants.cluster_id, clusterId),
          eq(participants.isPWD, "yes"),
          eq(participants.sex, "male")
        )
      )
      .then(res => res[0]);

    // Female persons with disabilities
    const pwdFemale: CountResult = await db
      .select({ count: count() })
      .from(participants)
      .where(
        and(
          eq(participants.cluster_id, clusterId),
          eq(participants.isPWD, "yes"),
          eq(participants.sex, "female")
        )
      )
      .then(res => res[0]);

    return {
      success: true,
      data: {
        totalParticipants: totalParticipants.count,
        totalFemales: totalFemales.count,
        femalesYouth: femalesYouth.count,
        femalesOlder: femalesOlder.count,
        totalMales: totalMales.count,
        malesYouth: malesYouth.count,
        malesOlder: malesOlder.count,
        totalPWD: totalPWD.count,
        pwdMale: pwdMale.count,
        pwdFemale: pwdFemale.count,
      },
    };
  } catch (error) {
    console.error("Error getting participant metrics:", error);
    return {
      success: false,
      error: "Failed to fetch participant metrics",
    };
  }
}
