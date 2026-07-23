import { useEffect, useState } from 'react';
import { getOwnerProfile, updateOwnerProfile, ApiError } from '../api';
import { DecorMark, PageMotion } from '../components';

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

const inputClass =
  'rounded-xl border border-border/55 bg-surface-elevated px-3.5 py-2.5 font-ui text-base text-secondary outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/30 disabled:cursor-not-allowed disabled:opacity-65';

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
          err instanceof ApiError ? err.message : 'Could not load profile.',
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
      <section>
        <p className="font-ui text-muted">Loading profile…</p>
      </section>
    );
  }

  return (
    <PageMotion>
      <DecorMark
        kind="illusTwo"
        data-motion="decor"
        className="mb-3 w-14 opacity-50"
      />
      <h1
        data-motion="title"
        className="font-brand text-3xl font-bold tracking-tight text-secondary"
      >
        Owner profile
      </h1>
      <p data-motion="body" className="mt-2 font-ui text-base text-muted">
        Personal and business details. KYC and bank details come later.
      </p>

      <p
        data-motion="body"
        className="mt-4 font-ui text-sm text-muted"
      >
        Phone: <strong className="text-secondary">{phone || '—'}</strong>
        {' · '}
        Status: <strong className="text-secondary">{status}</strong>
      </p>

      <form
        data-motion="form"
        className="mt-8 flex max-w-xl flex-col gap-4"
        onSubmit={handleSubmit}
      >
        <label className="flex flex-col gap-1.5">
          <span className="font-ui text-sm font-medium text-secondary">
            Full name
          </span>
          <input
            className={inputClass}
            value={form.fullName}
            onChange={(e) => updateField('fullName', e.target.value)}
            disabled={saving}
            autoComplete="name"
          />
        </label>

        <label className="flex flex-col gap-1.5">
          <span className="font-ui text-sm font-medium text-secondary">
            Email
          </span>
          <input
            className={inputClass}
            type="email"
            value={form.email}
            onChange={(e) => updateField('email', e.target.value)}
            disabled={saving}
            autoComplete="email"
          />
        </label>

        <label className="flex flex-col gap-1.5">
          <span className="font-ui text-sm font-medium text-secondary">
            Business name
          </span>
          <input
            className={inputClass}
            value={form.businessName}
            onChange={(e) => updateField('businessName', e.target.value)}
            disabled={saving}
          />
        </label>

        <label className="flex flex-col gap-1.5">
          <span className="font-ui text-sm font-medium text-secondary">
            Business type
          </span>
          <input
            className={inputClass}
            value={form.businessType}
            onChange={(e) => updateField('businessType', e.target.value)}
            disabled={saving}
            placeholder="e.g. Individual, Partnership"
          />
        </label>

        <label className="flex flex-col gap-1.5">
          <span className="font-ui text-sm font-medium text-secondary">
            Address line 1
          </span>
          <input
            className={inputClass}
            value={form.addressLine1}
            onChange={(e) => updateField('addressLine1', e.target.value)}
            disabled={saving}
            autoComplete="address-line1"
          />
        </label>

        <label className="flex flex-col gap-1.5">
          <span className="font-ui text-sm font-medium text-secondary">
            Address line 2
          </span>
          <input
            className={inputClass}
            value={form.addressLine2}
            onChange={(e) => updateField('addressLine2', e.target.value)}
            disabled={saving}
            autoComplete="address-line2"
          />
        </label>

        <div className="grid gap-4 sm:grid-cols-3">
          <label className="flex flex-col gap-1.5">
            <span className="font-ui text-sm font-medium text-secondary">
              City
            </span>
            <input
              className={inputClass}
              value={form.city}
              onChange={(e) => updateField('city', e.target.value)}
              disabled={saving}
              autoComplete="address-level2"
            />
          </label>
          <label className="flex flex-col gap-1.5">
            <span className="font-ui text-sm font-medium text-secondary">
              State
            </span>
            <input
              className={inputClass}
              value={form.state}
              onChange={(e) => updateField('state', e.target.value)}
              disabled={saving}
              autoComplete="address-level1"
            />
          </label>
          <label className="flex flex-col gap-1.5">
            <span className="font-ui text-sm font-medium text-secondary">
              Pincode
            </span>
            <input
              className={inputClass}
              value={form.pincode}
              onChange={(e) => updateField('pincode', e.target.value)}
              disabled={saving}
              autoComplete="postal-code"
            />
          </label>
        </div>

        <button
          type="submit"
          className="mt-2 inline-flex items-center justify-center rounded-xl bg-primary px-4 py-3 font-ui text-sm font-semibold text-white transition hover:brightness-105 disabled:cursor-not-allowed disabled:opacity-55"
          disabled={saving}
        >
          {saving ? 'Saving…' : 'Save profile'}
        </button>
      </form>

      {message ? (
        <p className="mt-5 font-ui text-sm text-primary">{message}</p>
      ) : null}
      {error ? (
        <p
          className="mt-5 rounded-xl bg-accent-soft px-3.5 py-3 font-ui text-sm text-secondary-deep"
          role="alert"
        >
          {error}
        </p>
      ) : null}
    </PageMotion>
  );
}
