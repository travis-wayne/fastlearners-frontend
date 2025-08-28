import { SharedSettingsPage } from "@/components/settings/shared-settings-page";

export default function SettingsPage() {
  return (
    <SharedSettingsPage 
      customTitle="Administrator Settings"
      customDescription="Manage your administrator profile, security, and account settings."
      hideAccountTab={true}
    />
  );
}
