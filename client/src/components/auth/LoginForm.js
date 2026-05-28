export function LoginForm({
  errors,
  form,
  isLocked,
  isResetSent,
  message,
  onPasswordReset,
  onSubmit,
  showPassword,
  updateField,
  setShowPassword,
}) {
  return (
    <form className="login-card" onSubmit={onSubmit} noValidate>
      <div className="form-heading">
        <h2>Sign In</h2>
        <span>Enter your credentials to access the platform</span>
      </div>

      {message && (
        <div className={isResetSent ? 'notice success' : 'notice'} role="status">
          {message}
        </div>
      )}

      {isLocked && (
        <div className="notice danger" role="alert">
          Login temporarily locked after five failed attempts.
        </div>
      )}

      <label className="field">
        <span>Email</span>
        <input
          aria-invalid={Boolean(errors.email)}
          autoComplete="email"
          name="email"
          onChange={updateField}
          placeholder="name@example.com"
          type="email"
          value={form.email}
        />
        {errors.email && <small>{errors.email}</small>}
      </label>

      <label className="field">
        <span>Password</span>
        <div className="password-wrap">
          <input
            aria-invalid={Boolean(errors.password)}
            autoComplete="current-password"
            name="password"
            onChange={updateField}
            placeholder="Enter your password"
            type={showPassword ? 'text' : 'password'}
            value={form.password}
          />
          <button
            aria-label={showPassword ? 'Hide password' : 'Show password'}
            className="ghost-button"
            onClick={() => setShowPassword((current) => !current)}
            type="button"
          >
            {showPassword ? 'Hide' : 'Show'}
          </button>
        </div>
        {errors.password && <small>{errors.password}</small>}
      </label>

      <div className="form-row">
        <label className="remember-option">
          <input
            checked={form.remember}
            name="remember"
            onChange={updateField}
            type="checkbox"
          />
          <span>Remember this device</span>
        </label>
        <button className="link-button" onClick={onPasswordReset} type="button">
          Forgot password?
        </button>
      </div>

      <button className="primary-button" disabled={isLocked} type="submit">
        Sign In
      </button>
    </form>
  );
}
