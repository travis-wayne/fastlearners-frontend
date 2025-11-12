import { ContentSection } from './components/content-section'
import { ProfileForm } from './profile/profile-form'

export default function SettingsPage() {
  return (
    <ContentSection
      title='Profile'
      desc='This is how others will see you on the site.'
    >
      <ProfileForm />
    </ContentSection>
  )
}
