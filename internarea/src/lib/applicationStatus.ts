type ApplicationStatusSource = {
  status?: string | null;
  statusUpdatedByRole?: string | null;
};

const validStatusUpdaterRoles = new Set(["company", "recruiter"]);

const normalizeStoredStatus = (status?: string | null) => {
  const normalizedStatus = status?.toLowerCase() || "pending";

  if (normalizedStatus === "approved") {
    return "accepted";
  }

  if (
    normalizedStatus === "accepted" ||
    normalizedStatus === "rejected" ||
    normalizedStatus === "pending"
  ) {
    return normalizedStatus;
  }

  return "pending";
};

export const getReadonlyApplicationStatus = (
  application?: ApplicationStatusSource | null
) => {
  const normalizedStatus = normalizeStoredStatus(application?.status);

  if (normalizedStatus === "pending") {
    return "pending";
  }

  const updatedByRole = application?.statusUpdatedByRole?.toLowerCase() || "";

  return validStatusUpdaterRoles.has(updatedByRole)
    ? normalizedStatus
    : "pending";
};

export const formatApplicationStatusLabel = (
  application?: ApplicationStatusSource | null
) => {
  const readonlyStatus = getReadonlyApplicationStatus(application);

  return readonlyStatus.charAt(0).toUpperCase() + readonlyStatus.slice(1);
};

export const getApplicationStatusClasses = (
  application?: ApplicationStatusSource | null
) => {
  switch (getReadonlyApplicationStatus(application)) {
    case "accepted":
      return "bg-green-100 text-green-800";
    case "rejected":
      return "bg-red-100 text-red-800";
    default:
      return "bg-yellow-100 text-yellow-800";
  }
};
