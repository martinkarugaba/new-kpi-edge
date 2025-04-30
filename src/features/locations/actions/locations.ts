"use server";

import { db } from "@/lib/db";

export async function getCountries() {
  try {
    const data = await db.query.countries.findMany({
      orderBy: (countries, { asc }) => [asc(countries.name)],
    });
    return { success: true, data };
  } catch (error) {
    console.error("Error fetching countries:", error);
    return { success: false, error: "Failed to fetch countries" };
  }
}

export async function getDistricts() {
  try {
    const data = await db.query.districts.findMany({
      orderBy: (districts, { asc }) => [asc(districts.name)],
    });
    return { success: true, data };
  } catch (error) {
    console.error("Error fetching districts:", error);
    return { success: false, error: "Failed to fetch districts" };
  }
}

export async function getSubCounties() {
  try {
    const data = await db.query.subCounties.findMany({
      orderBy: (subCounties, { asc }) => [asc(subCounties.name)],
    });
    return { success: true, data };
  } catch (error) {
    console.error("Error fetching sub counties:", error);
    return { success: false, error: "Failed to fetch sub counties" };
  }
}

export async function getParishes() {
  try {
    const data = await db.query.parishes.findMany({
      orderBy: (parishes, { asc }) => [asc(parishes.name)],
    });
    return { success: true, data };
  } catch (error) {
    console.error("Error fetching parishes:", error);
    return { success: false, error: "Failed to fetch parishes" };
  }
}

export async function getVillages() {
  try {
    const data = await db.query.villages.findMany({
      orderBy: (villages, { asc }) => [asc(villages.name)],
    });
    return { success: true, data };
  } catch (error) {
    console.error("Error fetching villages:", error);
    return { success: false, error: "Failed to fetch villages" };
  }
}
