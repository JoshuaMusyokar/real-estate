import type { NotificationType } from "../types";
import { getNotificationVisual } from "./ntf-helpers";
import { Icons } from "./ntf-icons-utils";

/** Picks the right icon component for a given NotificationType */
export function NotificationIcon({
  type,
  className,
}: {
  type: NotificationType;
  className?: string;
}) {
  const visual = getNotificationVisual(type);
  const iconProps = { className: `${visual.iconClass} ${className ?? ""}` };

  switch (type) {
    case "LEAD_ASSIGNED":
      return <Icons.LeadAssigned {...iconProps} />;
    case "APPOINTMENT_REMINDER":
      return <Icons.Appointment {...iconProps} />;
    case "NEW_PROPERTY_SUBMISSION":
      return <Icons.Property {...iconProps} />;
    case "PROPERTY_INQUIRY":
      return <Icons.Inquiry {...iconProps} />;
    case "SYSTEM_ALERT":
    default:
      return <Icons.System {...iconProps} />;
  }
}
