import React from "react";
import NotificationsSystem, {
  atalhoTheme,
  setUpNotifications,
  useNotifications,
} from "reapop";

export const Notification = () => {
  const { notifications, dismissNotification } = useNotifications();

  setUpNotifications({
    defaultProps: {
      position: "top-right",
      dismissible: true,
      showDismissButton: true,
      dismissAfter: 4000,
    },
  });

  return (
    <div>
      <NotificationsSystem
        notifications={notifications}
        dismissNotification={(id) => dismissNotification(id)}
        theme={atalhoTheme}
      />
    </div>
  );
};
