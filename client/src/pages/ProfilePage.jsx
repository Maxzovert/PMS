import { useEffect, useState } from 'react';
import { getOwnerProfile, updateOwnerProfile, ApiError } from '../api';

const EMPTY = {
  fullName: '',
  email: '',
  businessName: '',
  businessType: '',
  addressLine1: '',
  addressLine2: '',
  city: '',
  state: '',
  pincode: '',
};

function profileToForm(profile) {
  return {
    fullName: profile?.fullName || '',
    email: profile?.email || '',
    businessName: profile?.businessName || '',
    businessType: profile?.businessType || '',
    addressLine1: profile?.addressLine1 || '',
    addressLine2: profile?.addressLine2 || '',
    city: profile?.city || '',
    state: profile?.state || '',
    pincode: profile?.pincode || '',
  };
}

export function ProfilePage() {
  const [phone, setPhone] = useState('');
  const [status, setStatus] = useState('draft');
  const [form, setForm] = useState(EMPTY);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const [message, setMessage] = useState(null);

  useEffect(() => {
    const controller = new AbortController();
    setLoading(true);
    setError(null);

    getOwnerProfile({ signal: controller.signal })
      .then((result) => {
        const profile = result.data?.profile;
        setPhone(profile?.phone || '');
        setStatus(profile?.profileStatus || 'draft');
        setForm(profileToForm(profile));
      })
      .catch((err) => {
        if (err?.name === 'AbortError') {
          return;
        }
        setError(
          err instanceof ApiError
            ? err.message
            : 'Could not load profile.',
        );
      })
      .finally(() => {
        if (!controller.signal.aborted) {
          setLoading(false);
        }
      });

    return () => controller.abort();
  }, []);

  function updateField(key, value) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setSaving(true);
    setError(null);
    setMessage(null);
    try {
      const result = await updateOwnerProfile(form);
      const profile = result.data?.profile;
      setPhone(profile?.phone || phone);
      setStatus(profile?.profileStatus || status);
      setForm(profileToForm(profile));
      setMessage(result.message || 'Profile saved');
    } catch (err) {
      setError(
        err instanceof ApiError ? err.message : 'Could not save profile.',
      );
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <section className="page">
        <p className="page__lead">Loading profile…</p>
      </section>
    );
  }

  return (
    <section className="page page--profile">
      <h1 className="page__title">Owner profile</h1>
      <p className="page__lead">
        Personal and business details. KYC and bank details come later.
      </p>

      <p className="profile-meta">
        Phone: <strong>{phone || '—'}</strong>
        {' · '}
        Status: <strong>{status}</strong>
      </p>

      <form className="profile-form" onSubmit={handleSubmit}>
        <label className="field">
          <span className="field__label">Full name</span>
          <input
            className="field__input"
            value={form.fullName}
            onChange={(e) => updateField('fullName', e.target.value)}
            disabled={saving}
            autoComplete="name"
          />
        </label>

        <label className="field">
          <span className="field__label">Email</span>
          <input
            className="field__input"
            type="email"
            value={form.email}
            onChange={(e) => updateField('email', e.target.value)}
            disabled={saving}
            autoComplete="email"
          />
        </label>

        <label className="field">
          <span className="field__label">Business name</span>
          <input
            className="field__input"
            value={form.businessName}
            onChange={(e) => updateField('businessName', e.target.value)}
            disabled={saving}
          />
        </label>

        <label className="field">
          <span className="field__label">Business type</span>
          <input
            className="field__input"
            value={form.businessType}
            onChange={(e) => updateField('businessType', e.target.value)}
            disabled={saving}
            placeholder="e.g. Individual, Partnership"
          />
        </label>

        <label className="field">
          <span className="field__label">Address line 1</span>
          <input
            className="field__input"
            value={form.addressLine1}
            onChange={(e) => updateField('addressLine1', e.target.value)}
            disabled={saving}
            autoComplete="address-line1"
          />
        </label>

        <label className="field">
          <span className="field__label">Address line 2</span>
          <input
            className="field__input"
            value={form.addressLine2}
            onChange={(e) => updateField('addressLine2', e.target.value)}
            disabled={saving}
            autoComplete="address-line2"
          />
        </label>

        <div className="profile-form__row">
          <label className="field">
            <span className="field__label">City</span>
            <input
              className="field__input"
              value={form.city}
              onChange={(e) => updateField('city', e.target.value)}
              disabled={saving}
              autoComplete="address-level2"
            />
          </label>
          <label className="field">
            <span className="field__label">State</span>
            <input
              className="field__input"
              value={form.state}
              onChange={(e) => updateField('state', e.target.value)}
              disabled={saving}
              autoComplete="address-level1"
            />
          </label>
          <label className="field">
            <span className="field__label">Pincode</span>
            <input
              className="field__input"
              value={form.pincode}
              onChange={(e) => updateField('pincode', e.target.value)}
              disabled={saving}
              autoComplete="postal-code"
            />
          </label>
        </div>

        <button type="submit" className="btn btn--primary" disabled={saving}>
          {saving ? 'Saving…' : 'Save profile'}
        </button>
      </form>

      {message ? <p className="page__note">{message}</p> : null}
      {error ? (
        <p className="page__error" role="alert">
          {error}
        </p>
      ) : null}
    </section>
  );
}
