const API_URL =
  process.env.NEXT_PUBLIC_API_URL ||
  "https://subhashreebhawan-api.vercel.app/api";

export const BACKEND_URL =
  API_URL.replace(/\/api\/?$/, "");

// ========================================
// BUILDINGS
// ========================================

export async function getBuildingBySlug(
  slug: string
) {
  const response = await fetch(
    `${API_URL}/buildings/slug/${slug}`,
    {
      cache: "no-store",
    }
  );

  if (!response.ok) {
    throw new Error(
      `Unable to load building: ${slug}`
    );
  }

  const data = await response.json();

  return data.building;
}

// ========================================
// FLOORS
// ========================================

export async function getFloorsByBuilding(
  buildingId: number
) {
  const response = await fetch(
    `${API_URL}/floors/building/${buildingId}`,
    {
      cache: "no-store",
    }
  );

  if (!response.ok) {
    throw new Error(
      "Unable to load building floors"
    );
  }

  const data = await response.json();

  return data.floors || [];
}

// ========================================
// TENANTS
// ========================================

export async function getTenants() {
  const response = await fetch(
    `${API_URL}/tenants`,
    {
      cache: "no-store",
    }
  );

  if (!response.ok) {
    throw new Error(
      "Unable to load tenants"
    );
  }

  const data = await response.json();

  return data.tenants || [];
}

// ========================================
// GALLERY
// ========================================

export async function getGalleryByBuilding(
  buildingId: number
) {
  const response = await fetch(
    `${API_URL}/gallery/building/${buildingId}`,
    {
      cache: "no-store",
    }
  );

  if (!response.ok) {
    throw new Error(
      "Unable to load building gallery"
    );
  }

  const data = await response.json();

  return data.gallery || [];
}

export function getBackendImageUrl(
  imageUrl?: string | null
) {
  if (!imageUrl) {
    return "";
  }

  if (
    imageUrl.startsWith("http://") ||
    imageUrl.startsWith("https://")
  ) {
    return imageUrl;
  }

  return `${BACKEND_URL}${imageUrl}`;
}