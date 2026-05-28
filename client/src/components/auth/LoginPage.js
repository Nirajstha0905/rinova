import { LoginForm } from './LoginForm';
import { DemoPanel } from './DemoPanel';
import { FeaturePanel } from './FeaturePanel';

export function LoginPage({
  demoUsers,
  errors,
  features,
  form,
  isLocked,
  isResetSent,
  message,
  onPasswordReset,
  onQuickLogin,
  onSubmit,
  showPassword,
  updateField,
  setShowPassword,
}) {
  return (
    <main className="auth-page">
      <section className="auth-intro" aria-label="Rinova Creation CRM summary">
        <div className="brand-lockup">
          <span className="brand-mark">E</span>
          <div>
            <h1>Enrollystics</h1>
            <p>Modern Education Consultancy and CRM Platform</p>
          </div>
        </div>

        <FeaturePanel features={features} />

        <div className="auth-metrics" aria-label="Platform highlights">
          <div><strong>248</strong><span>Active leads</span></div>
          <div><strong>72</strong><span>Applications</span></div>
          <div><strong>82%</strong><span>Visa success</span></div>
        </div>
      </section>

      <section className="auth-panel" aria-labelledby="login-heading">
        <LoginForm
          errors={errors}
          form={form}
          isLocked={isLocked}
          isResetSent={isResetSent}
          message={message}
          onPasswordReset={onPasswordReset}
          onSubmit={onSubmit}
          showPassword={showPassword}
          setShowPassword={setShowPassword}
          updateField={updateField}
        />

        <DemoPanel demoUsers={demoUsers} onQuickLogin={onQuickLogin} />
      </section>
    </main>
  );
}
