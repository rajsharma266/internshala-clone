export type StoredAdmin = {
  username: string;
  role: "admin";
};

const adminStorageKey = "admin_user";

export const getStoredAdmin = (): StoredAdmin | null => {
  if (typeof window === "undefined") {
    return null;
  }

  try {
    const rawAdmin = window.localStorage.getItem(adminStorageKey);

    if (!rawAdmin) {
      return null;
    }

    const parsedAdmin = JSON.parse(rawAdmin) as StoredAdmin;

    if (!parsedAdmin?.username || parsedAdmin.role !== "admin") {
      return null;
    }

    return parsedAdmin;
  } catch {
    return null;
  }
};

export const saveStoredAdmin = (admin: StoredAdmin) => {
  if (typeof window === "undefined") {
    return;
  }

  window.localStorage.setItem(adminStorageKey, JSON.stringify(admin));
};

export const clearStoredAdmin = () => {
  if (typeof window === "undefined") {
    return;
  }

  window.localStorage.removeItem(adminStorageKey);
};
