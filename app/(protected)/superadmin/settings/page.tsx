import { SharedSettingsPage } from "@/components/settings/shared-settings-page";

export default function SettingsPage() {
  return (
    <SharedSettingsPage 
      customTitle="Super Administrator Settings"
      customDescription="Manage your super administrator profile, security, and system-level settings."
      hideAccountTab={true}
    />
  );
}
