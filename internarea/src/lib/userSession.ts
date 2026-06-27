export type StoredUser = {
  id?: string;
  uid?: string;
  name?: string;
  email?: string;
  token?: string;
  photo?: string | null;
  phone?: string | null;
  phoneNumber?: string | null;
};

const storageKey = "user";

export const getStoredUser = (): StoredUser | null => {
  if (typeof window === "undefined") {
    return null;
  }

  try {
    const rawUser = window.localStorage.getItem(storageKey);

    if (!rawUser) {
      return null;
    }

    const parsedUser = JSON.parse(rawUser) as StoredUser;

    return parsedUser?.email ? parsedUser : null;
  } catch {
    return null;
  }
};

export const saveStoredUser = (user: StoredUser) => {
  if (typeof window === "undefined") {
    return;
  }

  window.localStorage.setItem(storageKey, JSON.stringify(user));
};

export const clearStoredUser = () => {
  if (typeof window === "undefined") {
    return;
  }

  window.localStorage.removeItem(storageKey);
};

export const toAppUser = (user: StoredUser) => ({
  uid: user.uid || user.id || user.email || "local-user",
  photo: user.photo || "",
  name: user.name || user.email?.split("@")[0] || "User",
  email: user.email || "",
  phoneNumber: user.phoneNumber || user.phone || "",
});
