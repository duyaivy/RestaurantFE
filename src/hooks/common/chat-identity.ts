import { RoleType } from "@/types/jwt.types";
import { decodeToken, getAccessTokenFromLocalStorage } from "@/lib/utils";

type DecodedTokenExtended = ReturnType<typeof decodeToken> & {
  id?: unknown;
  user_id?: unknown;
  guest_id?: unknown;
  sub?: unknown;
};

export interface ChatIdentity {
  userId: number | null;
  role: RoleType | null;
}

export function toNullableNumber(value: unknown): number | null {
  const normalized =
    typeof value === "number" ? value : Number(String(value ?? "").trim());

  return Number.isFinite(normalized) ? normalized : null;
}

export function getCurrentChatIdentity(): ChatIdentity {
  try {
    const token = getAccessTokenFromLocalStorage();
    if (!token) return { userId: null, role: null };

    const decoded = decodeToken(token) as DecodedTokenExtended;
    const userIdCandidates = [
      decoded.guest_id,
      decoded.userId,
      decoded.id,
      decoded.user_id,
      decoded.sub,
    ];

    let userId: number | null = null;
    for (const candidate of userIdCandidates) {
      userId = toNullableNumber(candidate);
      if (userId !== null) break;
    }

    const role = (decoded.role as RoleType | undefined) ?? null;

    return { userId, role };
  } catch {
    return { userId: null, role: null };
  }
}
